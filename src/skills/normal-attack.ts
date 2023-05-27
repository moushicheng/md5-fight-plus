import { Skill } from "@/types/skill";
import { PlayerInstanceProperty } from "@/types/player";
import _ from 'lodash'
import { getRandomItem, removeHook } from "@/utils";
/**普通攻击 */
const getAttackInfo = (player: PlayerInstanceProperty, atk: number) => {
    const info = [
        `${player.name}跌跌撞撞A了过去,造成${atk}伤害！！`,
        `${player.name}释放技能【平A】,造成${atk}点伤害`
    ]
    return getRandomItem(info)
}

export function _normalAttack(player: PlayerInstanceProperty) {
    const battleField = player.battleField
    battleField.logger.addDebug('init normalAttack')
    const id = player.hooks.onAttack.tap('normal Attack', ({ battleField, oneRoundContext }) => {
        const atk = player.runtimeProperty.attack;
        player.battleField.logger.addInfo(getAttackInfo(player, atk), player.hooks.onAttack)
        return { battleField, oneRoundContext, damage: Math.round(atk * 0.7) }
    })
    removeHook(player, id, 'onAttack')
}
export const normalAttack: Skill = {
    name: '普通攻击',
    description: '简简单单攻击一下...',
    mana: 2,
    run: _normalAttack
}