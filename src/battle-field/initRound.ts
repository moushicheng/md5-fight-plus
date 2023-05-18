import { SyncBailHook } from "@/hooks/SyncBailHook";
import { BattleFieldInstance } from "@/types/battleField";

export function initRound(battleField: BattleFieldInstance) {
    battleField.round = () => {
        try {
            //回合开始阶段
            battleField.roundHooks.roundStart.call(battleField)
            const attacker = battleField.players.left;
            const defender = battleField.players.right;
            //attacker准备阶段
            attacker.hooks.prepare.call(battleField)
        } catch (err) {
        }
    }
    battleField.roundHooks = {
        //职责:选择进攻顺序,选择技能组
        roundStart: new SyncBailHook<BattleFieldInstance>()
    }
    battleField.roundCount = 0;
}