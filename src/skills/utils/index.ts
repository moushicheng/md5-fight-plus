import { PlayerInstanceProperty } from "@/types/player";

export const decreaseMana = (player: PlayerInstanceProperty, mana: number) => {
    player.runtimeProperty.mana -= mana
}