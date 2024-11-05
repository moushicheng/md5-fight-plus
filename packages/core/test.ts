import { createBattleField } from "@/battle-field";
import { createPlayer } from "@/player";
import { LogLevel } from ".";
import { PlayerInstanceProperty } from "@/types/player";
function setProperty(
  p1: PlayerInstanceProperty,
  CON = 10,
  MANA = 10,
  SPD = 10,
  STR = 10
) {
  p1.baseProperty.CON = CON;
  p1.baseProperty.MANA = MANA;
  p1.baseProperty.SPD = SPD;
  p1.baseProperty.STR = STR;
}
const p1 = createPlayer("p1");
setProperty(p1);
const p2 = createPlayer("p2");
setProperty(p2);
p1.skills = ["poisonCloud", "a", "a", "a", "a"];

const battleField = createBattleField(p1, p2);
battleField.fight();

console.log(
  battleField.logger
    .getByLevel(LogLevel.info)
    .map((item) => {
      return item.message;
    })
    .join("\n")
);
