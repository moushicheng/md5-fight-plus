import { checkPlayerDeath } from "@/hooks/intercepts/checkPlayer";
import { getPlayerActionTimes, getPlayerSpeed, initActionTimes } from "@/player/utils";
import { BattleFieldInstance } from "@/types/battleField";
import { getPlayers } from "@/utils";
import { initOrder } from "./utils";

export function registerRoundHooks(battleField: BattleFieldInstance) {
    battleField.roundHooks.roundStart.registerIntercept((battleField) => {
        const isDeath = checkPlayerDeath(battleField)
        if (isDeath) throw isDeath;
        return battleField
    })
    battleField.roundHooks.roundStart.tap('Order', (battleField) => {
        const { player1, player2 } = getPlayers(battleField)
        const spd1 = getPlayerSpeed(player1)
        const spd2 = getPlayerSpeed(player2)
        const p1ActionTimes = getPlayerActionTimes(player1)
        const p2ActionTimes = getPlayerActionTimes(player2)
        //决定本轮行动玩家
        if (p1ActionTimes > p2ActionTimes) {
            initOrder(battleField, player1, player2)
        }
        if (p1ActionTimes < p2ActionTimes) {
            initOrder(battleField, player2, player1)
        }
        if (p1ActionTimes === p2ActionTimes) {
            if (spd1 >= spd2) {
                initOrder(battleField, player1, player2)
            }
            if (spd1 < spd2) {
                initOrder(battleField, player2, player1)
            }
        }


        battleField.players.left.actionCount--
        //下面这段逻辑应该放在回合结束阶段
        // if (p1ActionTimes === 0 && p2ActionTimes === 0) {
        //     //恢复所有计数
        //     initActionTimes(player1, player2)
        // }

        return battleField
    })
    battleField.roundHooks.roundStart.tap('release skill', (battleField) => {
        const attacker = battleField.players.left
        return battleField
    })

}