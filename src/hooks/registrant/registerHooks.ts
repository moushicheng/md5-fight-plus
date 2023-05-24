import { initActionTimes } from "@/player/utils";
import { BattleFieldInstance } from "@/types/battleField";
import { PlayerInstanceProperty } from "@/types/player";
import { getPlayers } from "@/utils";
import skillList from '@/skills/index'

export function registerHooks(battleField: BattleFieldInstance) {
    battleField.hooks.fightStart.tap('init runtimeProperty', (battleField) => {
        //初始化runtime
        const { player1, player2 } = getPlayers(battleField)
        calRunTime(player1)
        calRunTime(player2)
        initActionTimes(player1, player2)
        return battleField
    })
    battleField.hooks.fightStart.tap('fill skills', (battleField) => {
        // 填充技能组,这是由于玩家一开始设置的战斗技能组形如 ['k1','k2','k3'],这里要根据id（k1）填充技能类
        const { player1, player2 } = getPlayers(battleField)
        fillSkill(player1)
        fillSkill(player2)
        return battleField
    })
}
function calRunTime(player: PlayerInstanceProperty) {
    player.runtimeProperty.hp = player.baseProperty.CON * 15
    player.runtimeProperty.attack = player.baseProperty.STR
    player.runtimeProperty.mana = Math.round(player.baseProperty.MANA * 1.5)
    player.runtimeProperty.speed = player.baseProperty.SPD
}
function fillSkill(player: PlayerInstanceProperty) {
    const skills = player.skills
    skills.forEach((skillName: string) => {
        const skill = skillList[skillName] || skillList['normalAttack']
        player.runtimeContext.skills.push(skill)
    })
}