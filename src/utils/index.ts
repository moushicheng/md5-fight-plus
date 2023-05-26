import { PlayerDeathEvent } from "@/events/playerDeath";
import { Skill } from "@/types/skill";
import { BattleFieldInstance } from "@/types/battleField";
import { PlayerInstanceProperty } from "@/types/player";
import { decreaseMana } from "@/skills/utils";

export const getPlayers = (battleField: BattleFieldInstance) => {
    return {
        player1: battleField.players.left,
        player2: battleField.players.right
    }
}
export const initFnToPlayers = (battleField: BattleFieldInstance, fn: (player: PlayerInstanceProperty) => void) => {
    const { player1, player2 } = getPlayers(battleField);
    fn(player1)
    fn(player2)
}

export const checkPlayerDeath = (battleField: BattleFieldInstance) => {
    const player1 = battleField.players.left
    const player2 = battleField.players.right

    if (player1.runtimeProperty.hp <= 0) {
        return new PlayerDeathEvent(`玩家【${player1.name}阵亡,游戏结束】`)
    }
    if (player2.runtimeProperty.hp <= 0) {
        return new PlayerDeathEvent(`玩家【${player2.name}阵亡,游戏结束】`)
    }
}
export const canUseSkill = (player: PlayerInstanceProperty, mana: number) => {
    if (player.runtimeProperty.mana < mana) {
        //说明mp不够了
        return false;
    }
    return true;
}

export const preprocessSkill = (skill: Skill) => {
    const raw_run = skill.run
    return function cb(player: PlayerInstanceProperty) {
        //查看蓝耗
        if (!canUseSkill(player, skill.mana)) {
            player.battleField.logger.addInfo(`${player.name}累趴了，摸鱼一回合（`)
            return;
        }
        raw_run(player)
        decreaseMana(player, skill.mana)
        decreaseRuntimeProperty(player, skill)
    }
}

export const decreaseRuntimeProperty = (player: PlayerInstanceProperty, skill: Skill) => {
    const properties = skill.onAdjustRunTimeProperty;
    Object.entries(properties).forEach(([property, value]) => {
        const hook = 'onAdjust' + toUpperFirstCase(property)
        console.log(hook);
    })
}
export const toUpperFirstCase = (name: string) => name.charAt(0).toUpperCase() + name.slice(1)