import { BattleFieldInstance } from "@/types/battleField";
import { getPlayers } from "@/utils";

export function registerHooks(battleField: BattleFieldInstance) {
    battleField.hooks.fightStart.tap('calculate runtimeProperty', (battleField) => {
        const { player1, player2 } = getPlayers(battleField)
    })
    battleField.hooks.fightStart.tap('choose skills', (battleField) => {

    })
}