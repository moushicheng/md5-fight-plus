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
function getBaseProperty(md5Numbers: number[]) {

    const baseProperty: PlayerBaseProperty = {
        STR: 0,
        CON: 0,
        SPD: 0,
    }
    let total = 0
    for (const key in baseProperty) {
        const val = md5Numbers.pop()
        baseProperty[key] += val
        total += val;
    }

    for (const key in baseProperty) {
        baseProperty[key] = Math.round(baseProperty[key] * 30 / total)
    }
    adjustProperty(baseProperty)//调整基础值
    console.log(baseProperty);
    return baseProperty
}
function adjustProperty(baseProperty: PlayerBaseProperty) {
    const addition = {
        STR: 1,
        CON: 5,
        SPD: 0,
    }
    for (const key in baseProperty) {
        baseProperty[key] += addition[key]
    }
    if (baseProperty.SPD > 10) {
        const diff = baseProperty.SPD - 5;
        const key = findMinProperty(baseProperty)
        baseProperty[key] += diff
        baseProperty.SPD -= diff
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