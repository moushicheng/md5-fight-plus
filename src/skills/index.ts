
import { preprocessSkill } from '@/utils'
import { snowball } from './frostbite'
import { normalAttack } from './normal-attack'

const raw_skills = {
    normalAttack: normalAttack,
    snowball: snowball
}
Object.keys(raw_skills).forEach(key => {
    const skill = raw_skills[key]

    skill.run = preprocessSkill(skill)
})

export default raw_skills
