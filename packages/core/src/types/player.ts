import { SyncBailHook } from "@/hooks/SyncBailHook";
import { BattleFieldInstance } from "./battleField";

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
  magical,
}
// 人物基本属性
export type PlayerBaseProperty = {
  STR: number; //力量,影响attack，hp
  CON: number; //体质,影响hp
  SPD: number; //速度,影响speed
  MANA: number; //法力值
};
// 战斗时属性，从基本属性映射， buff，debuff之类只能影响运行时属性。
export type PlayerRuntimeProperty = {
  hp: number; //生命值
  attack: number; //攻击力
  speed: number; //速度
  mana: number; //魔力
  stunned: boolean; //是否眩晕
  frostbite: number; //霜蚀
  firing: number; //灼烧
  poison: number; //中毒
  armor: number; //护甲
};
export type PlayerRuntimeContext = {
  roundCount: number; //回合次数
  actionTimes: number; //行动计数
  skills: any[];
  isAttacker?: boolean;
};

export type PlayerInstanceProperty = {
  name: string;
  baseProperty?: PlayerBaseProperty;
  level?: number;
  skills?: any[]; //技能组
  runtimeProperty?: PlayerRuntimeProperty;
  runtimeContext?: PlayerRuntimeContext;
  hooks?: {
    /** 
            初始化属性
        **/
    initProperty: SyncBailHook<PlayerInstanceProperty>;
    /** 
            回合准备阶段
        **/
    prepare: SyncBailHook<BattleFieldInstance>;
    /** 
            作为攻击方的准备攻击阶段
        **/
    beforeAttack: SyncBailHook<{
      battleField: BattleFieldInstance;
      oneRoundContext: any;
    }>;
    /** 
            作为防守方的准备被攻击阶段
        **/
    beforeUnderAttack: SyncBailHook<{
      battleField: BattleFieldInstance;
      oneRoundContext: any;
    }>;
    /** 
            作为攻击方的攻击时阶段
        **/
    onAttack: SyncBailHook<{
      battleField: BattleFieldInstance;
      oneRoundContext: any;
      damage?: number;
    }>;
    /** 
            作为防守方的被攻击时阶段
        **/
    onUnderAttack: SyncBailHook<{
      battleField: BattleFieldInstance;
      oneRoundContext: any;
      damage?: number;
    }>;
    /** 
            作为攻击方的攻击后阶段
        **/
    afterAttack: SyncBailHook<{
      battleField: BattleFieldInstance;
      oneRoundContext: any;
    }>;
    /** 
            作为防守方的被攻击后阶段
        **/
    afterUnderAttack: SyncBailHook<{
      battleField: BattleFieldInstance;
      oneRoundContext: any;
    }>;
    /** 
            调整运行时属性
        **/
    onAdjustManaBefore: SyncBailHook<number>;
    onAdjustMana: SyncBailHook<number>;
    onAdjustFrostbite: SyncBailHook<number>;
    onAdjustHp: SyncBailHook<number>;
    onAdjustFiring: SyncBailHook<number>;
    onAdjustArmor: SyncBailHook<number>;
    onAdjustSpeed: SyncBailHook<number>;
    [props: string]: SyncBailHook<any>;
  };
  battleField: BattleFieldInstance;
};
