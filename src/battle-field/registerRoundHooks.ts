import { getPlayerActionTimes, getPlayerSpeed, initActionTimes } from "@/player/utils";
import { BattleFieldInstance } from "@/types/battleField";
import { getPlayers } from "@/utils";
import { initOrder } from "./utils";
import { PlayerInstanceProperty } from "@/types/player";

export function registerRoundHooks(battleField: BattleFieldInstance) {
    initRoundStart(battleField)
    initPrepare(battleField.players.left)
    initPrepare(battleField.players.right)
    initRounding(battleField)
    initOnUnderAttack(battleField.players.left)
    initOnUnderAttack(battleField.players.right)
    initRoundEnd(battleField)
}
function initRoundStart(battleField: BattleFieldInstance) {
    battleField.roundHooks.roundStart.tap('Order', (battleField) => {
        const { player1, player2 } = getPlayers(battleField)
        const spd1 = getPlayerSpeed(player1)
        const spd2 = getPlayerSpeed(player2)
        const p1ActionTimes = getPlayerActionTimes(player1)
        const p2ActionTimes = getPlayerActionTimes(player2)
        //决定本轮攻击左右方，左方为攻击者，右方为防御者
        //行动计数高的玩家优先行动
        if (p1ActionTimes > p2ActionTimes) {
            initOrder(battleField, player1, player2)
        }
        if (p1ActionTimes < p2ActionTimes) {
            initOrder(battleField, player2, player1)
        }
        // 若计数相同，根据速度决定顺序
        if (p1ActionTimes === p2ActionTimes) {
            if (spd1 >= spd2) {
                initOrder(battleField, player1, player2)
            }
            if (spd1 < spd2) {
                initOrder(battleField, player2, player1)
            }
        }

        return battleField
    })
}

function initRoundEnd(battleField: BattleFieldInstance) {
    battleField.roundHooks.roundEnd.tap('increase round count', (battleField) => {
        //增加回合计数
        battleField.roundCount++;
        return battleField
    })
    battleField.roundHooks.roundEnd.tap('exec player action count', (battleField) => {
        //处理玩家行动计数
        const { player1, player2 } = getPlayers(battleField)
        player1.runtimeContext.actionTimes-- //减少攻击者的行动计数
        player1.runtimeContext.roundCount++; //玩家行动回合数+1
        const p1ActionTimes = getPlayerActionTimes(player1)
        const p2ActionTimes = getPlayerActionTimes(player2)
        if (p1ActionTimes === 0 && p2ActionTimes === 0) initActionTimes(player1, player2)
        return battleField
    })
    battleField.roundHooks.roundEnd.tap('log player status', (battleField) => {
        const { player1, player2 } = getPlayers(battleField)
        battleField.logger.addDebug(`玩家状态记录: 
${player1.name}【hp】: ${player1.runtimeProperty.hp}
${player2.name}【hp】: ${player2.runtimeProperty.hp}`, battleField.roundHooks.roundEnd)
        return battleField
    })
}
export function initRounding(battleField: BattleFieldInstance) {
    let oneRoundContext = {
        attackTimes: 0,
        totalDamage: 0
    }
    battleField.roundHooks.rounding.tap({ name: 'initContext', stage: 0 }, (battleField) => {
        oneRoundContext = {
            attackTimes: 0,
            totalDamage: 0
        }
        return battleField
    })
    battleField.roundHooks.rounding.tap('attack stage', (battleField) => {
        const { player1: attacker, player2: defender } = getPlayers(battleField)
        oneRoundContext.attackTimes += attacker.hooks.onAttack.cbs.length;
        while (oneRoundContext.attackTimes--) {
            //攻击前
            attacker.hooks.beforeAttack.call(battleField)
            defender.hooks.beforeUnderAttack.call(battleField)
            //攻击时
            const damage = attacker.hooks.onAttack.call(battleField)    //攻击
            oneRoundContext.totalDamage += damage
            defender.hooks.onUnderAttack.call({ battleField, damage }); //承受攻击
            //攻击后
            attacker.hooks.afterAttack.call(battleField);
            defender.hooks.afterUnderAttack.call(battleField)
        }
        return battleField
    })
}

function initPrepare(player: PlayerInstanceProperty) {
    player.hooks.prepare.tap('prepare skill', (battleField) => {
        const skillIndex = player.runtimeContext.actionTimes % player.runtimeContext.skills.length;
        const currentSkill = player.runtimeContext.skills[skillIndex];
        currentSkill(player)
        return battleField
    })
}
function initOnUnderAttack(player: PlayerInstanceProperty) {
    player.hooks.onUnderAttack.tap('calculate damage', ({ battleField, damage }) => {
        player.runtimeProperty.hp -= damage;
        battleField.logger.addInfo(`${player.name}【hp】: 受到${damage}点伤害`, player.hooks.onUnderAttack)
        return { battleField, damage }
    })
}