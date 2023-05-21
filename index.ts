
import { createBattleField } from "@/battle-field";
import { createPlayer } from "./src/player";
import { Level } from "@/logs";

const p1 = createPlayer('')
const p2 = createPlayer('m4')
const battleField = createBattleField(p1, p2)
battleField.fight()

console.log(battleField.logger.getByLevel(Level.info).map(item => item.message));