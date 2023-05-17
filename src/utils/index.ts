import { BattleFieldInstance } from "@/types/battleField";

export const getPlayers = (battleField: BattleFieldInstance) => {
    return {
        player1: battleField.players.left,
        player2: battleField.players.right
    }
}