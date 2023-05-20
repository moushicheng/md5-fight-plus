import { SyncBailHook } from "@/hooks/SyncBailHook";
import { BattleFieldInstance } from "@/types/battleField";
import { PlayerInstanceProperty } from "@/types/player";
import { registerRoundHooks } from "./registerRoundHooks";
import { registerHooks } from "./registerHooks";
import { initRound } from "./initRound";
import { BailEvent } from "@/events/BailEvent";
import { RoundTimeOutEvent } from "@/events/roundTimeOut";
import { registerIntercept } from "./registerIntercept";

export function createBattleField(p1: PlayerInstanceProperty, p2: PlayerInstanceProperty) {
    const battleFieldInstance: BattleFieldInstance = {}
    //初始化参数
    initPlayer(battleFieldInstance, p1, p2)
    initRound(battleFieldInstance)
    initFight(battleFieldInstance)
    initHooks(battleFieldInstance)
    //注册一些钩子
    registerHooks(battleFieldInstance)
    registerRoundHooks(battleFieldInstance)
    registerIntercept(battleFieldInstance)
    battleFieldInstance.hooks.init.call(battleFieldInstance)
    return battleFieldInstance
}
export function initPlayer(battleField: BattleFieldInstance, p1: PlayerInstanceProperty, p2: PlayerInstanceProperty) {
    if (!battleField.players) battleField.players = { left: undefined, right: undefined }
    if (p1) battleField.players.left = p1
    if (p2) battleField.players.right = p2
    p1.battleField = battleField
    p2.battleField = battleField
}

export function initFight(battleField: BattleFieldInstance) {
    battleField.fight = () => {
        battleField.hooks.fightStart.call(battleField)
        battleField.roundCount++;//从第0回合开始计数
        try {
            for (let i = 0; i < 100; i++) {
                console.log(`------------------第${i}回合开始------------------`);
                battleField.round()
            }
            throw new RoundTimeOutEvent()
        } catch (err) {
            console.log('游戏结束,原因: ', err);
        }

    }
}
export function initHooks(battleField: BattleFieldInstance) {
    battleField.hooks = {
        init: new SyncBailHook<BattleFieldInstance>(),
        // 计算运行时属性
        // 计算玩家技能组
        fightStart: new SyncBailHook<BattleFieldInstance>(),
    }
}
