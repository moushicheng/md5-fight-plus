
import { createBattleField } from "@/battle-field";
import { createPlayer } from "./src/player";
import { Level } from "@/logs";
import { hooksRecord } from "@/hooks/SyncBailHook";

const p1 = createPlayer('p1')
const p2 = createPlayer('p2')
const battleField = createBattleField(p1, p2)
battleField.fight()

console.log(battleField.logger.getByLevel(Level.info).map(item => item.message).join('\n'));
console.log(hooksRecord.slice(0, 20).join('\n'));
battleField.logger.addDebug(hooksRecord.join('\n'))