import { checkPlayerDeath } from "@/hooks/intercepts/checkPlayer";
import { BattleFieldInstance } from "@/types/battleField";

export function registerRoundHooks(battleField: BattleFieldInstance) {
    battleField.roundHooks.roundReady.registerIntercept((battleField) => {
        checkPlayerDeath(battleField)
    })
    battleField.roundHooks.roundReady.tap('Order', (battleField) => {
        return battleField
    })

}