import { PlayerDeathEvent } from "@/events/playerDeath";
import { BattleFieldInstance } from "@/types/battleField";
import { PlayerInstanceProperty } from "@/types/player";

export const getPlayers = (battleField: BattleFieldInstance) => {
    return {
        player1: battleField.players.left,
        player2: battleField.players.right
    }
}
export const initFnToPlayers = (battleField: BattleFieldInstance, fn: (player: PlayerInstanceProperty) => void) => {
    const { player1, player2 } = getPlayers(battleField);
    fn(player1)
    fn(player2)
}

export const checkPlayerDeath = (battleField: BattleFieldInstance) => {
    const player1 = battleField.players.left
    const player2 = battleField.players.right

    if (player1.runtimeProperty.hp <= 0) {
        return new PlayerDeathEvent(`玩家【${player1.name}阵亡,游戏结束】`)
    }
    if (player2.runtimeProperty.hp <= 0) {
        return new PlayerDeathEvent(`玩家【${player2.name}阵亡,游戏结束】`)
    }
}
export const canUseSkill = (player: PlayerInstanceProperty, mana: number) => {
    if (player.runtimeProperty.mana < mana) {
        //说明mp不够了
        return false;
    }
    return true;
}