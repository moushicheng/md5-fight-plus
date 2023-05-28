import { Skill } from "@/types/skill";
import { PlayerInstanceProperty } from "@/types/player";
import { getOpponent, getRandomItem, releaseFrostbite, removeHook } from "@/utils";

const getAttackInfo = (player: PlayerInstanceProperty, atk: number) => {
    const info = [
        `${player.name}召唤【暴风雪】，造成${atk}点伤害！`,
    ]
    return getRandomItem(info)
}

export function _blizzard(player: PlayerInstanceProperty) {
    const id = player.hooks.onAttack.tap('init frostbiteAttack', (props) => {
        const defender = getOpponent(player);
        const frostbite = defender.runtimeProperty.frostbite;
        const atk = frostbite * 3;
        player.battleField.logger.addInfo(getAttackInfo(player, atk), player.hooks.onAttack);
        return { ...props, damage: atk }
    })
    removeHook(player, id, 'onAttack')
}
export const blizzard: Skill = {
    name: '暴风雪',
    description: '暴雪已死',
    mana: 5,
    run: _blizzard
}