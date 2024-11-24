import { Skill } from "@/types/skill";
import { PlayerInstanceProperty } from "@/types/player";
import { getRandomItem } from "@/utils";
import { ASSASSIN_TYPE } from ".";

const getInfo = (player: PlayerInstanceProperty) => {
  const info = [`${player.name}释放【三重释放】,`];
  return getRandomItem(info);
};

export function _double(player: PlayerInstanceProperty) {
  let i = 0;
  let nextSkills;
  player.hooks.onAttack.tap({ name: "double", lives: 2 }, (props) => {
    if (i === 0) {
      player.battleField.logger.addInfo(getInfo(player), player.hooks.onAttack);
      i++;
      const skillIndex =
        (player.runtimeContext.roundCount + 1) %
        player.runtimeContext.skills.length;
      const currentSkill = player.runtimeContext.skills[skillIndex];
      nextSkills = currentSkill;
      return { ...props, damage: 0 };
    }
    nextSkills.run(player);
    return { ...props, damage: 0 };
  });
}
export const double: Skill = {
  name: "双重释放",
  description: "你的下一个技能额外两次",
  mana: 2,
  run: _double,
  type: [ASSASSIN_TYPE],
};
