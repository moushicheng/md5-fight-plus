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
    INT: number,//智力，影响magic
    DEF: number,//防御力
    MND: number,//精神
    MANA: number,//魔力,影响mp
    CON: number,//体质,影响hp
    SPD: number//速度,影响speed
}
// 战斗时属性，从基本属性映射， buff，debuff之类只能影响运行时属性。
export type PlayerRuntimeProperty = {
    hp: number     //生命值
    mp: number     //魔力
    attack: number //伤害量
    magic: number //法力
    speed: number //速度
    armor: number //护甲
    magicArmor: number //魔法护甲
    stunned: boolean //是否眩晕
}
export type PlayerInstanceProperty = {
    baseProperty?: PlayerBaseProperty
    level?: number
    skills?: any[] //技能组
    runtimeProperty?: PlayerRuntimeProperty
    hooks?: any
}