import md5 from 'blueimp-md5'
import { PlayerBaseProperty, PlayerInstanceProperty, PlayerRuntimeProperty, PlayerStatus } from 'src/types/player';
import { createPlayerHook } from 'src/hooks/player';


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
        STR: undefined,
        INT: undefined,
        DEF: undefined,
        MND: undefined,
        MANA: undefined,
        CON: undefined,
        SPD: undefined,
    }
    let total = 0
    for (const key in baseProperty) {
        const val = md5Numbers.pop()
        baseProperty[key] = val
        total += val;
    }
    for (const key in baseProperty) {
        baseProperty[key] = Math.round(baseProperty[key] * 100 / total)
    }
    return baseProperty
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
        mp: undefined,
        attack: undefined,
        magic: undefined,
        speed: undefined,
        armor: undefined,
        magicArmor: undefined,
        stunned: false
    }
    const playerParameter: PlayerInstanceProperty = {
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

