import { Skill } from "@/types/skill";
import { PlayerInstanceProperty } from "@/types/player";
import { getPlayers, getRandomItem } from "@/utils";

const getAttackInfo = (player: PlayerInstanceProperty, atk: number) => {
    const info = [
        `${player.name}搓了搓手，召唤并丢出一个...雪球！造成${atk}伤害，【霜蚀】5`,
    ]
    return getRandomItem(info)
}

export function _snowball(player: PlayerInstanceProperty) {
    const battleField = player.battleField
    const id = player.hooks.onAttack.tap('init frostbiteAttack', (props) => {
        const { player2: defender } = getPlayers(battleField)
        defender.hooks.onAdjustFrostbite.call(5)
        player.battleField.logger.addInfo(getAttackInfo(player, 5), player.hooks.onAttack)
        return { ...props, damage: 5 }
    })
    battleField.roundHooks.roundStart.tap('remove frostbiteAttack', (props) => {
        player.hooks.onAttack.removeTap(id)
        return props
    })
}
export const snowball: Skill = {
    name: '丢雪球',
    description: '简简单单丢个雪球',
    mana: 2,
    run: _snowball
}