
import { preprocessSkill } from '@/utils'
import { snowball } from './snowball'
import { normalAttack } from './normal-attack'
import { blizzard } from './blizzard'
import { absoluteZero } from './absoluteZero'

const raw_skills = {
    normalAttack,
    snowball,
    blizzard,
    absoluteZero,
}
Object.keys(raw_skills).forEach(key => {
    const skill = raw_skills[key]
    skill.run = preprocessSkill(skill)
})

export default raw_skills
