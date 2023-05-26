import { Skill } from "@/types/skill";
import { PlayerInstanceProperty } from "@/types/player";
import { getPlayers } from "@/utils";

export function _snowball(player: PlayerInstanceProperty) {
    const battleField = player.battleField
    const id = player.hooks.onAttack.tap('init frostbiteAttack', (props) => {
        const { player2: defender } = getPlayers(battleField)
        defender.hooks.onAdjustFrostbite.call(5)
        player.battleField.logger.addInfo(`${player.name}释放丢雪球，造成5点伤害，【霜蚀】5`, player.hooks.onAttack)
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