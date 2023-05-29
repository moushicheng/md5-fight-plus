import { BattleFieldInstance } from "@/types/battleField";
import { PlayerInstanceProperty } from "@/types/player";
import { getPlayers } from "@/utils";

export function initBuffFrostbite(battleField: BattleFieldInstance) {
    const { player1, player2 } = getPlayers(battleField);
    run(player1)
    run(player2)
    function run(player: PlayerInstanceProperty) {
        player.hooks.onAttack.tap({
            name: 'firing',
            stage: 60
        }, (props) => {
            const damage = props.damage
            const firing = player.runtimeProperty.firing;
            const firingDamage = Math.ceil((firing / 100) * damage)
            if (firing === 0 || damage === 0) return props;
            props.damage = props.damage + firingDamage
            player.hooks.onAdjustFiring.call(-1)
            return props
        })
    }
}