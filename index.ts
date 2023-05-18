
import { createBattleField } from "@/battle-field";
import { createPlayer } from "./src/player";

const p1 = createPlayer('m3')
const p2 = createPlayer('m4')
createPlayer('m5')
createPlayer('m6')
createPlayer('m7')
const battleField = createBattleField(p1, p2)
battleField.fight()