import { checkPlayerDeath } from "@/hooks/intercepts/checkPlayer";
import { BattleFieldInstance } from "@/types/battleField";
import { getPlayers } from "@/utils";

export function registerRoundHooks(battleField: BattleFieldInstance) {
    battleField.roundHooks.roundStart.registerIntercept((battleField) => {
        const isDeath = checkPlayerDeath(battleField)
        if (isDeath) throw isDeath;
        return battleField
    })
    battleField.roundHooks.roundStart.tap('Order', (battleField) => {
        //决定玩家出手顺序
        const { player1, player2 } = getPlayers(battleField)
        player1.runtimeProperty.speed >= player2.runtimeProperty.speed
        return battleField
    })
    battleField.roundHooks.roundStart.tap('release skill', (battleField) => {
        const attacker = battleField.players.left
        return battleField
    })

}