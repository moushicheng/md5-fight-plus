
import { preprocessSkill } from '@/utils'
import { snowball } from './frostbite'
import { normalAttack } from './normal-attack'
import { blizzard } from './blizzard'

const raw_skills = {
    normalAttack: normalAttack,
    snowball: snowball,
    blizzard: blizzard
}
Object.keys(raw_skills).forEach(key => {
    const skill = raw_skills[key]

    skill.run = preprocessSkill(skill)
})

export default raw_skills
