
import { createBattleField } from "@/battle-field";
import { createPlayer } from "./src/player";
import { Level } from "@/logs";

const p1 = createPlayer('p3')
const p2 = createPlayer('p2')
p2.skills[0] = 'snowball'
p2.skills[1] = 'snowball'
p2.skills[2] = 'snowball'
p2.skills[3] = 'blizzard'
console.log('@创建角色成功', p1.name, p1.baseProperty);
console.log('@创建角色成功', p2.name, p2.baseProperty);
const battleField = createBattleField(p1, p2)
battleField.fight()

console.log(battleField.logger.getByLevel(Level.info).map(item => item.message).join('\n'));