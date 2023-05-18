import { SyncBailHook } from "@/hooks/SyncBailHook";
import { BattleFieldInstance } from "@/types/battleField";
import { PlayerInstanceProperty } from "@/types/player";
import { registerRoundHooks } from "./registerRoundHooks";
import { registerHooks } from "./registerHooks";
import { initRound } from "./initRound";

export function createBattleField(p1: PlayerInstanceProperty, p2: PlayerInstanceProperty) {
    const battleFieldInstance: BattleFieldInstance = {}
    initPlayer(battleFieldInstance, p1, p2)
    initRound(battleFieldInstance)
    initFight(battleFieldInstance)
    initHooks(battleFieldInstance)
    registerHooks(battleFieldInstance)
    registerRoundHooks(battleFieldInstance)
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
        battleField.round()
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
