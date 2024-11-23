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
import { skill_777 } from "./general/777";
import { clam } from "./firing/clam";
import { manaBottle } from "./general/manaBottle";
import { littlePoisonBottle } from "./poison/littlePoisonBottle";
import { bigPoisonBottle } from "./poison/BigPoisonBottle";
import { poisonAttack } from "./poison/poisonAttack";
import { poisonCloud } from "./poison/poisonCloud";
import { assassinate } from "./ assassin/assassinate";
import { finalAttack } from "./ assassin/finalAttack";
import { gentlyAttack } from "./ assassin/gentlyAttack";
import { sneak } from "./ assassin/sneak";
import { waiting } from "./ assassin/waiting";

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
  clam,
  //☠️毒药
  littlePoisonBottle,
  bigPoisonBottle,
  poisonAttack,
  poisonCloud,
  //刺客
  assassinate,
  finalAttack,
  gentlyAttack,
  sneak,
  waiting,

  //普通技能
  manaBottle,
  skill_777,
};

export const preprocessSkill = (skill: Skill) => {
  const raw_run = skill.run;
  return function cb(player: PlayerInstanceProperty) {
    //查看蓝耗
    if (!canUseSkill(player, skill.runtimeProperty.mana)) {
      player.battleField.logger.addInfo(`${player.name}累趴了，摸鱼一回合（`);
      return;
    }
    raw_run(player);
    player.hooks.onAdjustMana.call(-skill.runtimeProperty.mana);
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
  const skill: Skill = raw_skills[key];
  skill.run = preprocessSkill(skill);
  skill.runtimeProperty = {
    mana: skill.mana,
    type: skill.type,
  };
});

export default raw_skills;
