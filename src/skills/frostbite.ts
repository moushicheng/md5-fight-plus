import { PlayerInstanceProperty } from "@/types/player";

export function frostbiteAttack(player: PlayerInstanceProperty) {
    const battleField = player.battleField
    const id = player.hooks.onAttack.tap('init frostbiteAttack', (props) => {
        player.battleField.logger.addInfo(`${player.name}释放寒霜冲击，造成5点伤害，【霜蚀】5`, player.hooks.onAttack)
        return { ...props, damage: 5 }
    })
    battleField.roundHooks.roundStart.tap('remove frostbiteAttack', (props) => {
        player.hooks.onAttack.removeTap(id)
        return props
    })
}