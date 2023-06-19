import { Skill } from "@/types/skill";
import { PlayerInstanceProperty } from "@/types/player";
import { getOpponent, getRandomItem, releaseFrostbite, removeHookInRoundEnd } from "@/utils";

const info = (player: PlayerInstanceProperty, spd: number) => {
    const defender = getOpponent(player);
    const info = [
        `${player.name}释放冰结术,${defender.name}的速度减少${spd}点！`,
    ]
    return getRandomItem(info)
}

export function _freeze(player: PlayerInstanceProperty) {
    const id = player.hooks.onAttack.tap('init frostbiteAttack', (props) => {
        const defender = getOpponent(player);
        const defenderFrostbite = defender.runtimeProperty.frostbite;
        const defenderSpeed = defender.runtimeProperty.speed
        const transformTimes = Math.min(Math.floor(defenderFrostbite / 3), defenderSpeed - 1, 3)
        defender.hooks.onAdjustFrostbite.call(-transformTimes * 3);
        defender.hooks.onAdjustSpeed.call(-transformTimes)
        player.battleField.logger.addInfo(info(player, transformTimes), player.hooks.onAttack);
        return props
    })
    removeHookInRoundEnd(player, id, 'onAttack')
}
export const freeze: Skill = {
    name: '冰结术',
    description: '冰结术',
    mana: 2,
    run: _freeze
}