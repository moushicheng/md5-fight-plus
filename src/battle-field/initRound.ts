import { SyncBailHook } from "@/hooks/SyncBailHook";
import { BattleFieldInstance } from "@/types/battleField";

export function initRound(battleField: BattleFieldInstance) {
    battleField.round = () => {
        try {
            battleField.roundHooks.roundReady.call(battleField)


        } catch (err) {
        }
    }
    battleField.roundHooks = {
        //职责:选择进攻顺序,选择技能组
        roundReady: new SyncBailHook<BattleFieldInstance>()
    }
    battleField.roundCount = 0;
}