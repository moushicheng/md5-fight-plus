import { createBattleField } from "@/battle-field";
import { loadPlayer } from "@/player";
import { PlayerInstanceProperty } from "@/types/player";
import { expect, test } from "vitest";

type Player = {
  name: string;
  skills: string[];
  baseProperty?: {
    SPD?: number;
    STR?: number;
    MANA?: number;
    CON?: number;
  };
};
function createPlayer(player: Player) {
  return loadPlayer({
    name: player.name,
    skills: player.skills || ["a"],
    level: 1,
    baseProperty: {
      SPD: player.baseProperty.SPD || 10,
      STR: player.baseProperty.STR || 10,
      MANA: player.baseProperty.MANA || 10,
      CON: player.baseProperty.CON || 10,
    },
  });
}

function fight(p1: PlayerInstanceProperty, p2: PlayerInstanceProperty) {
  const battleField = createBattleField(p1, p2);
  battleField.fight();
  console.log(
    battleField.logger.LogContainer.map((item) => item.message).join("\n")
  );
  return battleField;
}

test("death round", () => {
  const p1 = createPlayer({
    name: "p1",
    skills: ["normalAttack"],
    baseProperty: {
      STR: 1,
    },
  });
  const p2 = createPlayer({
    name: "p2",
    skills: ["normalAttack"],
    baseProperty: {
      STR: 1,
    },
  });
  fight(p1, p2);
});
