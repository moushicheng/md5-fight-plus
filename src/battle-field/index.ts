import { SyncBailHook } from "@/hooks/SyncBailHook";
import { BattleFieldInstance } from "@/types/battleField";
import { PlayerInstanceProperty } from "@/types/player";
import { registerRoundHooks } from "./registerRoundHooks";
import { registerHooks } from "./registerHooks";

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
export function initRound(battleField: BattleFieldInstance) {
    battleField.round = () => {
        try {
            const result = battleField.roundHooks.roundReady.call(battleField)
            console.log('@result', result);
        } catch (err) {
            console.log('@err in round', err);
        }
    }
    battleField.roundHooks = {
        //职责:选择进攻顺序,选择技能组
        roundReady: new SyncBailHook<BattleFieldInstance>()
    }
    battleField.roundCount = 0;
}
export function initFight(battleField: BattleFieldInstance) {
    battleField.fight = () => {
        battleField.hooks.fightStart.call()
        battleField.roundCount++;//从第0回合开始计数
        battleField.round()
    }
}
export function initHooks(battleField: BattleFieldInstance) {
    battleField.hooks = {
        init: new SyncBailHook<BattleFieldInstance>(),
        fightStart: new SyncBailHook(),
    }
}
