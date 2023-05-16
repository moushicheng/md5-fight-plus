import { BattleFieldInstance } from "@/types/battleField";
import { PlayerInstanceProperty } from "@/types/player";

export function createBattleField(p1: PlayerInstanceProperty, p2: PlayerInstanceProperty) {
    const battleFieldInstance: BattleFieldInstance = {}
    initPlayer(battleFieldInstance, p1, p2)


    return battleFieldInstance
}
export function initPlayer(battleField: BattleFieldInstance, p1, p2) {
    if (!battleField.players) battleField.players = { left: undefined, right: undefined }
    if (p1) battleField.players.left = p1
    if (p2) battleField.players.right = p2
}