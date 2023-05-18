import md5 from 'blueimp-md5'
import { PlayerBaseProperty, PlayerInstanceProperty, PlayerRuntimeProperty, PlayerStatus } from 'src/types/player';
import { SyncBailHook } from '@/hooks/SyncBailHook';
import { findMinProperty } from './utils';


const playerStatusList: PlayerStatus[] = [
    PlayerStatus.onUnderAttack,
    PlayerStatus.afterUnderAttack,
    PlayerStatus.beforeAttack,
    PlayerStatus.afterAttack,
    PlayerStatus.beforeUnderAttack,
    PlayerStatus.ready,
    PlayerStatus.onAttack,
];

function calculateProperty(name) {
    const encryptedMd5Hex = md5(name); // Generates Player's ID. 
    const propertyNumber: number[] = [];
    for (let i = 0; i < 16; i += 1) {
        const piece = encryptedMd5Hex.slice(i * 2, (i + 1) * 2);
        const convertedNumber = parseInt(piece, 16) / 2.55;
        propertyNumber.push(Math.floor(convertedNumber));
    }
    return propertyNumber
}
function getBaseProperty(dataSources: number[]) {
    const baseProperty: PlayerBaseProperty = {
        STR: 0,
        SPD: 0,
        MANA: 0,
        CON: 0,
    }
    let total = 0
    for (const key in baseProperty) {
        const val = dataSources.shift()
        const valAdjusted = val
        baseProperty[key] += val//调整基础值
        total += valAdjusted
    }
    adjustPropertyBefore(baseProperty, total)

    console.log(baseProperty);
    return baseProperty
}
function adjustPropertyBefore(baseProperty: PlayerBaseProperty, total: number) {
    //调整生命值
    let max = -1;
    let maxKey = ''
    for (const key in baseProperty) {
        if (max < baseProperty[key]) {
            max = baseProperty[key]
            maxKey = key;
        }
    }
    if (maxKey !== 'CON') {
        baseProperty[maxKey] = baseProperty['CON']
        baseProperty['CON'] = max;
    }
    //x基数
    for (const key in baseProperty) {
        baseProperty[key] = baseProperty[key] * 40 / total
    }
    //调整攻击力
    if (baseProperty['STR'] > 10) {
        const diff = baseProperty['STR'] * 0.4
        baseProperty['STR'] -= diff;
        baseProperty['CON'] += diff * 0.9
        baseProperty['MANA'] += diff * 0.1
    }
    if (baseProperty['STR'] < 0.5) {
        baseProperty['STR'] += 1
    }

    //规整化数字
    for (const key in baseProperty) {
        baseProperty[key] = Math.round(baseProperty[key])
    }
}


export const createPlayer = function (name: string) {
    const md5Numbers = calculateProperty(name)
    //属性设定
    const baseProperty = getBaseProperty(md5Numbers)
    //等级设定
    const level = 1;
    //技能组
    const skills = new Array();
    //hooks列表
    const hooks = createPlayerHook();
    const runtimeProperty: PlayerRuntimeProperty = {
        hp: undefined,
        attack: undefined,
        speed: undefined,
        mana: undefined,
        stunned: false
    }
    const playerParameter: PlayerInstanceProperty = {
        name,
        baseProperty,
        level,
        skills,
        hooks,
        runtimeProperty,
        battleField: undefined
    };
    hooks.initProperty.call(playerParameter)
    const currentPlayer: PlayerInstanceProperty = playerParameter
    return currentPlayer
}


export const createPlayerHook = () => {
    const hooks = {
        initProperty: new SyncBailHook<PlayerInstanceProperty>()
    }
    return hooks
}