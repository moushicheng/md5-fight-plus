import { Skill } from "@/types/skill";
import { PlayerInstanceProperty } from "@/types/player";
import { getRandomItem, releaseFrostbite, removeHook } from "@/utils";

const getAttackInfo = (player: PlayerInstanceProperty, atk: number) => {
    const info = [
        `${player.name}搓了搓手，召唤并丢出一个...雪球！造成${atk}伤害，【霜蚀】5`,
    ]
    return getRandomItem(info)
}

export function _snowball(player: PlayerInstanceProperty) {
    const id = player.hooks.onAttack.tap('init frostbiteAttack', (props) => {
        const atk = 2
        releaseFrostbite(player, 8);
        player.battleField.logger.addInfo(getAttackInfo(player, atk), player.hooks.onAttack);
        return { ...props, damage: atk }
    })
    removeHook(player, id, 'onAttack')
}
export const snowball: Skill = {
    name: '丢雪球',
    description: '造成2点伤害，【霜蚀】8',
    mana: 2,
    run: _snowball
}