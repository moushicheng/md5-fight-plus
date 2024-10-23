import { preprocessSkill } from "@/utils";
import { snowball } from "./ice/snowball";
import { normalAttack } from "./normal-attack";
import { blizzard } from "./ice/blizzard";
import { absoluteZero } from "./ice/absoluteZero";
import { iceArmor } from "./ice/iceArmor";
import { freeze } from "./ice/freeze";
import { icePiton } from "./ice/icePiton";
import { fireBlast } from "./firing/fireblast";
import { fireElf } from "./firing/fireElf";

const raw_skills = {
  normalAttack,
  snowball,
  blizzard,
  absoluteZero,
  iceArmor,
  freeze,
  icePiton,
  fireBlast,
  fireElf,
};
Object.keys(raw_skills).forEach((key) => {
  const skill = raw_skills[key];
  skill.run = preprocessSkill(skill);
});

export default raw_skills;
