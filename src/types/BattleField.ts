import { PlayerInstanceProperty } from "./player"

export type BattleFieldInstance = {
    players?: {
        left: PlayerInstanceProperty
        right: PlayerInstanceProperty
    }
}