
import { preprocessSkill } from '@/utils'
import { snowball } from './ice/snowball'
import { normalAttack } from './normal-attack'
import { blizzard } from './ice/blizzard'
import { absoluteZero } from './ice/absoluteZero'
import { iceArmor } from './ice/iceArmor'

const raw_skills = {
    normalAttack,
    snowball,
    blizzard,
    absoluteZero,
    iceArmor
}
Object.keys(raw_skills).forEach(key => {
    const skill = raw_skills[key]
    skill.run = preprocessSkill(skill)
})

export default raw_skills
