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
  console.log(
    battleField.logger.LogContainer.map((item) => item.message).join("\n")
  );
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

test("assassinate", () => {
  const p1 = createPlayer({
    name: "p1",
    skills: ["assassinate"],
  });
  const p2 = createPlayer({
    name: "p2",
    skills: ["normalAttack"],
  });
  fight(p1, p2);
});

test("finalAttack", () => {
  const p1 = createPlayer({
    name: "p1",
    skills: ["finalAttack"],
  });
  const p2 = createPlayer({
    name: "p2",
    skills: ["normalAttack"],
  });
  fight(p1, p2);
});

test("waiting && gentlyAttack", () => {
  const p1 = createPlayer({
    name: "p1",
    skills: ["waiting", "gentlyAttack"],
  });
  const p2 = createPlayer({
    name: "p2",
    skills: ["normalAttack"],
  });
  fight(p1, p2);
});

test("sneak", () => {
  const p1 = createPlayer({
    name: "p1",
    skills: ["sneak", "gentlyAttack"],
  });
  const p2 = createPlayer({
    name: "p2",
    skills: ["normalAttack"],
  });
  fight(p1, p2);
});

test("double", () => {
  const p1 = createPlayer({
    name: "p1",
    skills: ["double", "normalAttack"],
  });
  const p2 = createPlayer({
    name: "p2",
    skills: ["normalAttack"],
  });
  fight(p1, p2);
});
