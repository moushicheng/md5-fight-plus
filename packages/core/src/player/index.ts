import md5 from "blueimp-md5";
import {
  PlayerBaseProperty,
  PlayerInstanceProperty,
  PlayerRuntimeContext,
  PlayerRuntimeProperty,
} from "@/types/player";
import { SyncBailHook } from "@/hooks/SyncBailHook";
import { BattleFieldInstance } from "@/types/battleField";

function calculateProperty(name) {
  const encryptedMd5Hex = md5(name); // Generates Player's ID.
  const propertyNumber: number[] = [];
  for (let i = 0; i < 16; i += 1) {
    const piece = encryptedMd5Hex.slice(i * 2, (i + 1) * 2);
    const convertedNumber = parseInt(piece, 16) / 2.55;
    propertyNumber.push(Math.floor(convertedNumber));
  }
  return propertyNumber;
}
function getBaseProperty(dataSources: number[]) {
  const baseProperty: PlayerBaseProperty = {
    STR: 0,
    SPD: 0,
    MANA: 0,
    CON: 0,
  };
  let total = 0;
  for (const key in baseProperty) {
    const val = dataSources.shift();
    const valAdjusted = val;
    baseProperty[key] += val; //调整基础值
    total += valAdjusted;
  }
  adjustPropertyBefore(baseProperty, total);
  return baseProperty;
}
function adjustPropertyBefore(baseProperty: PlayerBaseProperty, total: number) {
  //调整生命值
  let max = -1;
  let maxKey = "";
  for (const key in baseProperty) {
    if (max < baseProperty[key]) {
      max = baseProperty[key];
      maxKey = key;
    }
  }
  // if (maxKey !== 'CON') {
  //     baseProperty[maxKey] = baseProperty['CON']
  //     baseProperty['CON'] = max;
  // }
  //x基数
  for (const key in baseProperty) {
    baseProperty[key] = (baseProperty[key] * 40) / total;
  }
  if (baseProperty["SPD"] < 3) baseProperty["SPD"] = 3;
  baseProperty["MANA"] = baseProperty["MANA"] + 3;
  baseProperty[maxKey] = baseProperty[maxKey] - 3;
  // //调整攻击力
  // if (baseProperty['STR'] > 7) {
  //     const diff = baseProperty['STR'] * 0.4
  //     baseProperty['STR'] -= diff;
  //     baseProperty['CON'] += diff * 0.9
  //     baseProperty['MANA'] += diff * 0.1
  // }
  // if (baseProperty['STR'] < 0.5) {
  //     baseProperty['STR'] += 1
  // }

  //规整化数字
  for (const key in baseProperty) {
    baseProperty[key] = Math.round(baseProperty[key]);
  }
}

export const createPlayer = function (name: string) {
  const md5Numbers = calculateProperty(name);
  //属性设定
  const baseProperty = getBaseProperty(md5Numbers);
  //等级设定
  const level = 1;
  //技能组
  const skills = ["a", "a", "a", "a", "a"];
  //hooks列表
  const hooks = createPlayerHook();
  const runtimeProperty: PlayerRuntimeProperty = {
    hp: undefined,
    attack: undefined,
    speed: undefined,
    mana: undefined,
    stunned: false,
    firing: 0,
    frostbite: 0,
    poison: 0,
    armor: 0,
  };
  const runtimeContext: PlayerRuntimeContext = {
    actionTimes: 0, //行动计数
    roundCount: 0,
    skills: [],
  };
  const playerParameter: PlayerInstanceProperty = {
    name,
    baseProperty,
    level,
    skills,
    hooks,
    runtimeProperty,
    runtimeContext,
    battleField: undefined,
  };
  hooks.initProperty.call(playerParameter);
  const currentPlayer: PlayerInstanceProperty = playerParameter;
  return currentPlayer;
};
//从基础属性中加载一个Players
type Config = {
  name: string;
  baseProperty: PlayerBaseProperty;
  skills: string[];
  level: number;
};
export const loadPlayer = function (config: Config) {
  const md5Numbers = calculateProperty(config.name);
  //属性设定
  const baseProperty = config.baseProperty;
  //等级设定
  const level = config.level;
  //技能组
  const skills = config.skills;
  //hooks列表
  const hooks = createPlayerHook();
  const runtimeProperty: PlayerRuntimeProperty = {
    hp: undefined,
    attack: undefined,
    speed: undefined,
    mana: undefined,
    stunned: false,
    firing: 0,
    frostbite: 0,
    poison: 0,
    armor: 0,
  };
  const runtimeContext: PlayerRuntimeContext = {
    actionTimes: 0, //行动计数
    roundCount: 0,
    skills: [],
  };
  const playerParameter: PlayerInstanceProperty = {
    name: config.name,
    baseProperty,
    level,
    skills,
    hooks,
    runtimeProperty,
    runtimeContext,
    battleField: undefined,
  };
  hooks.initProperty.call(playerParameter);
  const currentPlayer: PlayerInstanceProperty = playerParameter;
  return currentPlayer;
};

export const createPlayerHook = () => {
  const hooks = {
    initProperty: new SyncBailHook<PlayerInstanceProperty>(),
    prepare: new SyncBailHook<BattleFieldInstance>(),
    beforeAttack: new SyncBailHook<{
      battleField: BattleFieldInstance;
      oneRoundContext: any;
    }>(),
    beforeUnderAttack: new SyncBailHook<{
      battleField: BattleFieldInstance;
      oneRoundContext: any;
    }>(),
    onAttack: new SyncBailHook<{
      battleField: BattleFieldInstance;
      oneRoundContext: any;
    }>(),
    onUnderAttack: new SyncBailHook<{
      battleField: BattleFieldInstance;
      oneRoundContext: any;
      damage: number;
    }>(),
    afterAttack: new SyncBailHook<{
      battleField: BattleFieldInstance;
      oneRoundContext: any;
      damage: number;
    }>(),
    afterUnderAttack: new SyncBailHook<{
      battleField: BattleFieldInstance;
      oneRoundContext: any;
    }>(),
    onAdjustHp: new SyncBailHook<number>(),
    onAdjustManaBefore: new SyncBailHook<number>(),
    onAdjustMana: new SyncBailHook<number>(),
    onAdjustFrostbite: new SyncBailHook<number>(),
    onAdjustFiring: new SyncBailHook<number>(),
    onAdjustPoison: new SyncBailHook<number>(),
    onAdjustArmor: new SyncBailHook<number>(),
    onAdjustSpeed: new SyncBailHook<number>(),
    onAdjustAttack: new SyncBailHook<number>(),
  };
  return hooks;
};
