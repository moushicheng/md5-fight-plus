import { SyncBailHook } from "@/hooks/SyncBailHook";
import { BattleFieldInstance } from "@/types/battleField";

export function initRound(battleField: BattleFieldInstance) {
  battleField.round = () => {
    //回合开始阶段
    battleField.roundHooks.roundStart.call(battleField);
    const attacker = battleField.players.left;
    //准备阶段
    attacker.hooks.prepare.call(battleField);
    battleField.roundHooks.rounding.call(battleField);
    //回合结束阶段
    battleField.roundHooks.roundEnd.call(battleField);
  };
  battleField.roundHooks = {
    //职责:选择进攻顺序,选择技能组
    roundEnd: new SyncBailHook<BattleFieldInstance>(),
    rounding: new SyncBailHook<BattleFieldInstance>(),
    roundStart: new SyncBailHook<BattleFieldInstance>(),
  };
  battleField.roundCount = 0;
}
