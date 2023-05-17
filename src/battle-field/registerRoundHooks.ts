import { BailEvent } from "@/hooks/SyncBailHook";
import { BattleFieldInstance } from "@/types/battleField";

export function registerRoundHooks(battleField: BattleFieldInstance) {
    battleField.roundHooks.roundReady.registerIntercept((params) => {
        //假设有玩家死亡
        const hp = 0


    })
    battleField.roundHooks.roundReady.tap('Order', (battleField) => {
        return new BailEvent('1')
    })

}