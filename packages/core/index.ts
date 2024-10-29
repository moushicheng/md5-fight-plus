import { createBattleField } from "./src/battle-field";
import { createPlayer, loadPlayer } from "./src/player";
import { Level } from "./src/logs";
import skillList from "./src/skills/index";
import type { Skill } from "./src/types/skill";

const LogLevel = Level;
export { createPlayer, createBattleField, skillList, LogLevel, loadPlayer };
export type { Skill };
const p1 = createPlayer("p1");
const p2 = createPlayer("p2");
p1.skills = ["fireElf", "fireBall", "fireBurst", "fireStorm"];
p1.baseProperty.MANA = 999;
console.log(
  "@创建角色成功",
  p1.name,
  p1.baseProperty,
  p1.runtimeProperty.firing
);
console.log("@创建角色成功", p2.name, p2.baseProperty);
const battleField = createBattleField(p1, p2);
battleField.fight();

console.log(
  battleField.logger
    .getByLevel(LogLevel.info)
    .map((item) => {
      return item.message;
    })
    .slice(20, 100)
    .join("\n")
);
