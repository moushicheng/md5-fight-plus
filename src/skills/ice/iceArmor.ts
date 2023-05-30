import { Skill } from "@/types/skill";
import { PlayerInstanceProperty } from "@/types/player";
import { getRandomItem, releaseFrostbite, removeHook } from "@/utils";

const getInfo = (player: PlayerInstanceProperty) => {
    const info = [
        `${player.name}释放【寒冰护甲】，获得10点护甲值`,
    ]
    return getRandomItem(info)
}

export function _iceArmor(player: PlayerInstanceProperty) {
    const id = player.hooks.onAttack.tap('init frostbiteAttack', (props) => {
        player.hooks.onAdjustArmor.call(10);
        player.battleField.logger.addInfo(getInfo(player), player.hooks.onAttack);
        return props
    })
    removeHook(player, id, 'onAttack')
}
export const iceArmor: Skill = {
    name: '寒冰护甲',
    description: '获得10点护甲，下一回合中每当受到一次攻击，【霜蚀】5',
    mana: 3,
    run: _iceArmor
}