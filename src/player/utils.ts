import { PlayerBaseProperty, PlayerInstanceProperty } from "@/types/player"

export const findMinProperty = (baseProperty: PlayerBaseProperty) => {
    let min = 9999;
    let minKey = ''
    for (const key in baseProperty) {
        if (baseProperty[key] < min) {
            minKey = key;
            min = baseProperty[key]
        }
    }
    return minKey
}
export const initActionTimes = (player1: PlayerInstanceProperty, player2: PlayerInstanceProperty) => {
    const p1Spd = player1.baseProperty.SPD;
    const p2Spd = player1.baseProperty.SPD;
    const minSpd = Math.min(p1Spd, p2Spd)
    player1.runtimeContext.actionTimes = Math.floor(p1Spd / minSpd);
    player2.runtimeContext.actionTimes = Math.floor(p2Spd / minSpd);
}

export const getPlayerSpeed = (player: PlayerInstanceProperty) => {
    return player.runtimeProperty.speed;
}
export const getPlayerActionTimes = (player: PlayerInstanceProperty) => {
    return player.runtimeContext.actionTimes
}