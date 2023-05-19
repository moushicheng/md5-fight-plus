import { PlayerDeathEvent } from "@/events/playerDeath";
import { SyncBailHook } from "@/hooks/SyncBailHook";
import { BattleFieldInstance } from "@/types/battleField";

export function initRound(battleField: BattleFieldInstance) {
    battleField.round = () => {
        try {
            //回合开始阶段
            battleField.roundHooks.roundStart.call(battleField)
            const attacker = battleField.players.left;
            const defender = battleField.players.right;
            //准备阶段
            attacker.hooks.prepare.call(battleField)
            //攻击前
            attacker.hooks.beforeAttack.call(battleField)
            defender.hooks.beforeUnderAttack.call(battleField)
            //攻击时
            const damage = attacker.hooks.onAttack.call(battleField)    //攻击
            defender.hooks.onUnderAttack.call({ battleField, damage }); //承受攻击
            //攻击后
            attacker.hooks.afterAttack.call(battleField);
            defender.hooks.afterUnderAttack.call(battleField)
            //回合结束阶段
            battleField.roundHooks.roundEnd.call(battleField)
        } catch (err) {
            if (err instanceof PlayerDeathEvent) {
                console.log('游戏结束，玩家x死亡');
            }
        }
    }
    battleField.roundHooks = {
        //职责:选择进攻顺序,选择技能组
        roundEnd: new SyncBailHook<BattleFieldInstance>(),
        roundStart: new SyncBailHook<BattleFieldInstance>()
    }
    battleField.roundCount = 0;
}