import { snowball } from "./ice/snowball";
import { normalAttack } from "./normal-attack";
import { blizzard } from "./ice/blizzard";
import { absoluteZero } from "./ice/absoluteZero";
import { iceArmor } from "./ice/iceArmor";
import { freeze } from "./ice/freeze";
import { icePiton } from "./ice/icePiton";

import { Skill } from "@/types/skill";
import { PlayerInstanceProperty } from "@/types/player";
import { fireBlast } from "./firing/fireblast";
import { fireElf } from "./firing/fireElf";
import { fireBall } from "./firing/fireBall";
import { fireBurst } from "./firing/fireBurst";
import { fireStorm } from "./firing/fireStorm";

export const raw_skills = {
  normalAttack,
  //冰技能
  snowball,
  blizzard,
  absoluteZero,
  iceArmor,
  freeze,
  icePiton,
  //火焰技能
  fireBlast,
  fireElf,
  fireBall,
  fireBurst,
  fireStorm,
};

export const preprocessSkill = (skill: Skill) => {
  const raw_run = skill.run;
  return function cb(player: PlayerInstanceProperty) {
    //查看蓝耗
    if (!canUseSkill(player, skill.mana)) {
      player.battleField.logger.addInfo(`${player.name}累趴了，摸鱼一回合（`);
      return;
    }
    raw_run(player);
    player.hooks.onAdjustMana.call(-skill.mana);
  };
};
export const canUseSkill = (player: PlayerInstanceProperty, mana: number) => {
  if (player.runtimeProperty.mana < mana) {
    //说明mp不够了
    return false;
  }
  return true;
};
Object.keys(raw_skills).forEach((key) => {
  const skill = raw_skills[key];
  skill.run = preprocessSkill(skill);
});

export default raw_skills;
