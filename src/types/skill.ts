import { PlayerInstanceProperty, PlayerRuntimeProperty } from "./player"

export type Skill = {
    name: string,
    mana: number,
    onAdjustRunTimeProperty?: Partial<PlayerRuntimeProperty>
    description: string,
    run: (player: PlayerInstanceProperty) => void
}