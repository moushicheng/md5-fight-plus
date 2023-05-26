import { Skill } from "@/types/skill";
import { PlayerInstanceProperty } from "@/types/player";
import _ from 'lodash'
/**普通攻击 */
export function _normalAttack(player: PlayerInstanceProperty) {
    const battleField = player.battleField
    battleField.logger.addDebug('init normalAttack')
    const id = player.hooks.onAttack.tap('normal Attack', ({ battleField, oneRoundContext }) => {
        const atk = player.runtimeProperty.attack;
        player.battleField.logger.addInfo(`${player.name}释放普通攻击,造成${atk}伤害`, player.hooks.onAttack)
        return { battleField, oneRoundContext, damage: Math.round(atk * 0.7) }
    })
    battleField.roundHooks.roundStart.tap('remove normalAttack', (props) => {
        player.hooks.onAttack.removeTap(id)
        return props
    })
}
export const normalAttack: Skill = {
    name: '普通攻击',
    mana: 2,
    description: '简简单单攻击一下...',
    onAdjustRunTimeProperty: {
        mana: 2,
    },
    run: _normalAttack
}