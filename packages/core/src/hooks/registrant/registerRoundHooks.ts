import {
  getPlayerActionTimes,
  getPlayerSpeed,
  initActionTimes,
} from "@/player/utils";
import { BattleFieldInstance } from "@/types/battleField";
import { getPlayerState, getPlayers, initFnToPlayers } from "@/utils";
import { initOrder } from "../../battle-field/utils";
import { PlayerInstanceProperty } from "@/types/player";
import _ from "lodash";
export function registerRoundHooks(battleField: BattleFieldInstance) {
  const { player1: attacker, player2: defender } = getPlayers(battleField);
  initRoundStart(battleField);
  initPrepare(battleField);
  initRounding(battleField);
  initOnAttack(attacker, defender, battleField);
  initOnAttack(defender, attacker, battleField);
  initOnUnderAttack(battleField);
  initRoundEnd(battleField);
}
function initRoundStart(battleField: BattleFieldInstance) {
  battleField.roundHooks.roundStart.tap("Order", (battleField) => {
    const { player1, player2 } = getPlayers(battleField);
    const spd1 = getPlayerSpeed(player1);
    const spd2 = getPlayerSpeed(player2);
    const p1ActionTimes = getPlayerActionTimes(player1);
    const p2ActionTimes = getPlayerActionTimes(player2);
    //决定本轮攻击左右方，左方为攻击者，右方为防御者
    //行动计数高的玩家优先行动
    if (p1ActionTimes > p2ActionTimes) {
      initOrder(battleField, player1, player2);
    }
    if (p1ActionTimes < p2ActionTimes) {
      initOrder(battleField, player2, player1);
    }
    // 若计数相同，根据速度决定顺序
    if (p1ActionTimes === p2ActionTimes) {
      if (spd1 >= spd2) {
        initOrder(battleField, player1, player2);
      }
      if (spd1 < spd2) {
        initOrder(battleField, player2, player1);
      }
    }

    return battleField;
  });
}

function initRoundEnd(battleField: BattleFieldInstance) {
  battleField.roundHooks.roundEnd.tap(
    "exec player action count",
    (battleField) => {
      //处理玩家行动计数
      const { player1, player2 } = getPlayers(battleField);
      player1.runtimeContext.actionTimes--; //减少攻击者的行动计数
      player1.runtimeContext.roundCount++; //玩家行动回合数+1
      const p1ActionTimes = getPlayerActionTimes(player1);
      const p2ActionTimes = getPlayerActionTimes(player2);
      if (p1ActionTimes === 0 && p2ActionTimes === 0)
        initActionTimes(player1, player2);
      return battleField;
    }
  );
  battleField.roundHooks.roundEnd.tap(
    { name: "log player status", stage: 100 },
    (battleField) => {
      const { player1, player2 } = getPlayers(battleField);
      battleField.logger.addDebug(`${getPlayerState(player1)}`);
      battleField.logger.addDebug(`${getPlayerState(player2)}`);
      return battleField;
    }
  );
  battleField.roundHooks.roundEnd.tap("recover mana", (battleField) => {
    initFnToPlayers(battleField, (player: PlayerInstanceProperty) => {
      const canRecover = player.runtimeContext.roundCount % 5 === 0;
      if (canRecover) {
        player.runtimeProperty.mana = player.baseProperty.MANA;
      }
    });
    return battleField;
  });
}

function initPrepare(battleField: BattleFieldInstance) {
  const { player1, player2 } = getPlayers(battleField);
  run(player1);
  run(player2);
  function run(player: PlayerInstanceProperty) {
    player.hooks.prepare.tap("prepare skill", (battleField) => {
      const skillIndex =
        player.runtimeContext.roundCount % player.runtimeContext.skills.length;
      const currentSkill = player.runtimeContext.skills[skillIndex];
      currentSkill.run(player);
      return battleField;
    });
  }
}
export function initRounding(battleField: BattleFieldInstance) {
  let oneRoundContext = {
    attackTimes: 0,
    totalDamage: 0,
  };
  battleField.roundHooks.rounding.tap(
    { name: "initContext", stage: 0 },
    (battleField) => {
      oneRoundContext = {
        attackTimes: 0,
        totalDamage: 0,
      };
      return battleField;
    }
  );
  battleField.roundHooks.rounding.tap("attack stage", (battleField) => {
    const { player1: attacker } = getPlayers(battleField);
    attacker.hooks.onAttack.call({
      battleField,
      oneRoundContext,
    }); //攻击
    return battleField;
  });
}
function initOnAttack(
  attacker: PlayerInstanceProperty,
  defender: PlayerInstanceProperty,
  battleField: BattleFieldInstance
) {
  //攻击前阶段
  attacker.hooks.onAttack.registerBeforeActionHook("before attack", (props) => {
    attacker.hooks.beforeAttack.call(props);
    defender.hooks.beforeUnderAttack.call(props);
    return props;
  });
  //计算攻击时的一些操作
  attacker.hooks.onAttack.registerAfterActionHook("onUnderAttack", (props) => {
    defender.hooks.onUnderAttack.call(props);
    return props;
  });
  //攻击后阶段
  attacker.hooks.onAttack.registerAfterActionHook("after attack", (props) => {
    attacker.hooks.afterAttack.call(props);
    defender.hooks.afterUnderAttack.call(props);
    return props;
  });
}
function initOnUnderAttack(battleField: BattleFieldInstance) {
  const { player1, player2 } = getPlayers(battleField);
  run(player1);
  run(player2);
  function run(player: PlayerInstanceProperty) {
    player.hooks.onUnderAttack.tap("calculate armor", (props) => {
      const { damage } = props;
      const armor = player.runtimeProperty.armor; //damage=3,armor=5
      if (armor <= 0 || damage <= 0) return props;
      if (!armor || !damage) return props;
      if (armor < damage) {
        //伤害更多
        player.hooks.onAdjustArmor.call(-armor);
        props.damage = damage - armor;
        player.battleField.logger.addInfo(
          `${player.name}抵挡${armor}点伤害，护甲剩余0`
        );
      } else {
        //护甲更多
        player.hooks.onAdjustArmor.call(-damage);
        props.damage = 0;
        player.battleField.logger.addInfo(
          `${player.name}抵挡${damage}点伤害,护甲剩余${armor - damage}`
        );
      }

      return props;
    });
    player.hooks.onUnderAttack.tap("calculate damage", (props) => {
      const { damage, battleField } = props;
      if (!damage) return props;
      player.hooks.onAdjustHp.call(-damage);
      battleField.logger.addInfo(
        `${player.name}: 受到${damage}点伤害,当前剩余【hp】${[
          player.runtimeProperty.hp,
        ]}`,
        player.hooks.onUnderAttack
      );
      return props;
    });
  }
}
