
import { createBattleField } from "@/battle-field";
import { createPlayer } from "./src/player";

const p1 = createPlayer('moush')
const p2 = createPlayer('p2')
const battleField = createBattleField(p1, p2)
battleField.fight()