import { BattleFieldInstance } from "@/types/battleField";
import { PlayerInstanceProperty } from "@/types/player";
import { getOpponent, getPlayers } from "@/utils";

export function initBuffFiring(battleField: BattleFieldInstance) {
    const { player1, player2 } = getPlayers(battleField);
    run(player1)
    run(player2)
    function run(player: PlayerInstanceProperty) {
        player.hooks.onUnderAttack.tap({
            name: 'firing',
            stage: 60
        }, (props) => {
            const damage = props.damage
            const attacker = getOpponent(player);
            const firing = attacker.runtimeProperty.firing;
            const firingDamage = Math.ceil((firing / 100) * damage)
            if (firing <= 0 || damage <= 0) return props;
            const currentDamage = damage * firingDamage / 100
            props.damage = currentDamage
            attacker.hooks.onAdjustFiring.call(-1)
            player.hooks.onAdjustHp.call(-currentDamage)
            battleField.logger.addInfo(`由于灼热效果,${player.name}再受到${currentDamage}点伤害`)
            return props
        })
    }
}