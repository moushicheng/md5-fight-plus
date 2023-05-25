import { PlayerInstanceProperty } from "./player"

export type Skill = {
    name: string,
    mana: number,
    description: string,
    run: (player: PlayerInstanceProperty) => void
}