import { createBattleField } from "@/battle-field";
import { loadPlayer } from "@/player";
import { PlayerInstanceProperty } from "@/types/player";
import { expect, test } from "vitest";

type Player = {
  name: string;
  skills: string[];
};
function createPlayer(player: Player) {
  return loadPlayer({
    name: player.name,
    skills: player.skills || ["a"],
    level: 1,
    baseProperty: {
      SPD: 10,
      STR: 10,
      MANA: 10,
      CON: 10,
    },
  });
}

function fight(p1: PlayerInstanceProperty, p2: PlayerInstanceProperty) {
  const battleField = createBattleField(p1, p2);
  battleField.fight();
  return battleField;
}

test("normalAttack", () => {
  const p1 = createPlayer({
    name: "p1",
    skills: ["normalAttack"],
  });
  const p2 = createPlayer({
    name: "p2",
    skills: ["normalAttack"],
  });
  fight(p1, p2);
});
