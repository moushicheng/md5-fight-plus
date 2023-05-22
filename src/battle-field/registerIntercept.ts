import { checkPlayerDeath } from "@/hooks/intercepts/checkPlayer";
import { BattleFieldInstance } from "@/types/battleField";
import { PlayerInstanceProperty } from "@/types/player";
import { getPlayers } from "@/utils";

export function registerIntercept(battleField: BattleFieldInstance) {
    const { player1, player2 } = getPlayers(battleField);
    register(player1, battleField)
    register(player2, battleField)
}
function register(player: PlayerInstanceProperty, battleField: BattleFieldInstance) {
    const hooks = player.hooks
    for (const key in hooks) {
        const hook = hooks[key];
        hook.registerIntercept('check Death', (props) => {
            const deathEvent = checkPlayerDeath(battleField)
            if (deathEvent) throw deathEvent.message
            return props
        })
    }
}