import { SyncBailHook } from "@/hooks/SyncBailHook"
import { BattleFieldInstance } from "./battleField"

export const enum PlayerStatus {
    /**
     * The `ready` status means the `Player` is doing nothing.
     */
    ready,
    /**
     * The `beforeAttack` status means the `Player` is preparing an attacking.
     */
    beforeAttack,
    /**
     * The `onAttack` status means the `Player` is attacking.
     */
    onAttack,
    /**
     * The `afterAttack` status means the `Player` has just finished an attacking.
     */
    afterAttack,
    /**
     * The `beforeUnderAttack` status means the `Player` is about to be under attack.
     */
    beforeUnderAttack,
    /**
     * The `onUnderAttack` status means the `Player` is under attack.
     */
    onUnderAttack,
    /**
     * The `afterUnderAttack` status means the `Player` has just been attacked.
     */
    afterUnderAttack,
}
export enum PlayerType {
    physical,
    magical
}
// 人物基本属性
export type PlayerBaseProperty = {
    STR: number,//力量,影响attack，hp
    CON: number,//体质,影响hp
    SPD: number,//速度,影响speed
    MANA: number,//法力值
}
// 战斗时属性，从基本属性映射， buff，debuff之类只能影响运行时属性。
export type PlayerRuntimeProperty = {
    hp: number     //生命值
    attack: number //攻击力
    speed: number //速度
    mana: number //魔力
    stunned: boolean //是否眩晕
    roundCount: number//回合次数
    actionTimes: number//行动计数
}
export type PlayerInstanceProperty = {
    name: string
    baseProperty?: PlayerBaseProperty
    level?: number
    skills?: any[] //技能组
    runtimeProperty?: PlayerRuntimeProperty
    hooks?: {
        prepare: SyncBailHook<BattleFieldInstance>,
        [props: string]: SyncBailHook<any>
    }
    actionCount?: number //行动计数
    battleField: BattleFieldInstance
}