import { PlayerDeathEvent } from "@/events/playerDeath";
import { BattleFieldInstance } from "@/types/battleField";

export const checkPlayerDeath = (battleField: BattleFieldInstance) => {
    const player1 = battleField.players.left
    const player2 = battleField.players.right

    if (player1.runtimeProperty.hp === 0) {
        return new PlayerDeathEvent(`玩家【${player1.name}阵亡,游戏结束】`)
    }
    if (player2.runtimeProperty.hp === 0) {
        return new PlayerDeathEvent(`玩家【${player2.name}阵亡,游戏结束】`)
    }
}