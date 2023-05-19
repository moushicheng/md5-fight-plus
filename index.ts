
import { createBattleField } from "@/battle-field";
import { createPlayer } from "./src/player";

const p1 = createPlayer('m3')
const p2 = createPlayer('m4')
const battleField = createBattleField(p1, p2)
battleField.fight()