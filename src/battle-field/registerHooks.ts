import { initActionTimes } from "@/player/utils";
import { BattleFieldInstance } from "@/types/battleField";
import { PlayerInstanceProperty } from "@/types/player";
import { getPlayers } from "@/utils";

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
        //填充技能组
        const { player1, player2 } = getPlayers(battleField)
        fillSkill(player1)
        fillSkill(player2)
        return battleField
    })
}
function calRunTime(player: PlayerInstanceProperty) {
    player.runtimeProperty.hp = player.baseProperty.CON
    player.runtimeProperty.attack = player.baseProperty.STR
    player.runtimeProperty.mana = player.baseProperty.MANA
    player.runtimeProperty.speed = player.baseProperty.SPD
}
function fillSkill(player: PlayerInstanceProperty) {
    const skills = player.skills
}