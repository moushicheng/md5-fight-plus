import { initActionTimes } from "@/player/utils";
import { BattleFieldInstance } from "@/types/battleField";
import { PlayerInstanceProperty } from "@/types/player";
import { getPlayers } from "@/utils";
import skillList from "@/skills/index";
import { initBuffFrostbite } from "./registerFrostbiteHook";
import { initBuffFiring } from "./registerFiring";
import { initBuffPoison } from "./registerPosion";

export function registerHooks(battleField: BattleFieldInstance) {
  initFightStart(battleField);
  initBuffFrostbite(battleField);
  initBuffFiring(battleField);
  initBuffPoison(battleField);
  initAdjustRuntime(battleField);
}
function initFightStart(battleField: BattleFieldInstance) {
  battleField.hooks.fightStart.tap("init runtimeProperty", (battleField) => {
    //初始化runtime
    const { player1, player2 } = getPlayers(battleField);
    calRunTime(player1);
    calRunTime(player2);
    initActionTimes(player1, player2);
    return battleField;
  });
  battleField.hooks.fightStart.tap("fill skills", (battleField) => {
    // 填充技能组,这是由于玩家一开始设置的战斗技能组形如 ['k1','k2','k3'],这里要根据id（k1）填充技能类
    const { player1, player2 } = getPlayers(battleField);
    fillSkill(player1);
    fillSkill(player2);
    return battleField;
  });
}
function calRunTime(player: PlayerInstanceProperty) {
  player.runtimeProperty.hp = player.baseProperty.CON * 15 + 30;
  player.runtimeProperty.attack = player.baseProperty.STR;
  player.runtimeProperty.mana = Math.round(player.baseProperty.MANA * 1.5);
  player.runtimeProperty.speed = player.baseProperty.SPD;
}
function fillSkill(player: PlayerInstanceProperty) {
  const skills = player.skills;
  skills.forEach((skillName: string) => {
    const skill = skillList[skillName] || skillList["normalAttack"];
    player.runtimeContext.skills.push(skill);
  });
}

function initAdjustRuntime(battleField: BattleFieldInstance) {
  const { player1, player2 } = getPlayers(battleField);
  [player1, player2].forEach((player: PlayerInstanceProperty) => {
    player.hooks.onAdjustHp.tap("adjust Hp", (value) => {
      player.runtimeProperty.hp += value;
      return value;
    });
    player.hooks.onAdjustMana.tap("adjust Mana", (value) => {
      const val = player.hooks.onAdjustManaBefore.call(value);
      player.runtimeProperty.mana += val;
      return value;
    });
    player.hooks.onAdjustAttack.tap("adjust Attack", (value) => {
      let nextValue = player.runtimeProperty.attack + value;
      if (nextValue < 0) nextValue = 0;
      player.runtimeProperty.attack = nextValue;
      return nextValue;
    })
    player.hooks.onAdjustFrostbite.tap("adjust Frostbite", (value) => {
      let nextValue = player.runtimeProperty.frostbite + value;
      if (nextValue < 0) nextValue = 0;
      player.runtimeProperty.frostbite = nextValue;
      return nextValue;
    });
    player.hooks.onAdjustFiring.tap("adjust Firing", (value) => {
      let nextValue = player.runtimeProperty.firing + value;
      if (nextValue < 0) nextValue = 0;
      player.runtimeProperty.firing = nextValue;
      return nextValue;
    });
    player.hooks.onAdjustPoison.tap("adjust Poison", (value) => {
      let nextValue = player.runtimeProperty.poison + value;
      if (nextValue < 0) nextValue = 0;
      player.runtimeProperty.poison = nextValue;
      return nextValue;
    });
    player.hooks.onAdjustArmor.tap("adjust Armor", (value) => {
      let nextValue = player.runtimeProperty.armor + value;
      if (nextValue < 0) {
        player.runtimeProperty.armor = 0;
        return nextValue;
      }
      player.runtimeProperty.armor = nextValue;
      return nextValue;
    });
    player.hooks.onAdjustSpeed.tap("adjust Speed", (value) => {
      player.runtimeProperty.speed += value;
      if (player.runtimeProperty.speed <= 0) player.runtimeProperty.speed = 1;
      return value;
    });
  });
}
