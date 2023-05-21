import { PlayerInstanceProperty } from "@/types/player";
import _ from 'lodash'
//普攻
export function normalAttack(player: PlayerInstanceProperty) {
    const battleField = player.battleField
    battleField.logger.addDebug('init normalAttack')
    const id = player.hooks.onAttack.tap('normal Attack', () => {
        const atk = player.runtimeProperty.attack;
        player.battleField.logger.addInfo(`${player.name}释放普通攻击,造成${atk}伤害`, player.hooks.onAttack)
        return atk * 0.5
    })
    battleField.roundHooks.roundStart.tap('remove normalAttack', (props) => {
        player.hooks.onAttack.removeTap(id)
        return props
    })
}