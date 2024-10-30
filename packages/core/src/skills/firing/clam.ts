import { Skill } from "@/types/skill";
import { PlayerInstanceProperty } from "@/types/player";
import {
  getRandomItem,
  releaseFiring,
  releaseFrostbite,
  removeHookInRoundEnd,
} from "@/utils";
import { FIRE_TYPE } from ".";

const getInfo = (player: PlayerInstanceProperty) => {
  const info = [
    `${player.name}深吸一口气，心中平静如水，缓缓释放出【气定神闲】的技能，周围气势顿时凝聚`,
    `${player.name}微微一笑，眼中闪烁着自信，缓缓释放“气定神闲”，让敌人感到无形压力。`,
  ];
  return getRandomItem(info);
};

export function _clam(player: PlayerInstanceProperty) {
  let count = 1;
  let skill: Skill = undefined;
  player.hooks.onAttack.tap({ name: "clam", lives: 2 }, (props) => {
    if (count === 0) {
      //恢复这个技能的费用
      skill.runtimeProperty.mana = skill.mana;
    }
    if (count === 1) {
      player.battleField.logger.addInfo(getInfo(player), player.hooks.onAttack);
      //找出下一个技能..
      const skillIndex =
        (player.runtimeContext.roundCount + 1) %
        player.runtimeContext.skills.length;
      skill = player.runtimeContext.skills[skillIndex];

      //将技能设定为0费
      skill.runtimeProperty.mana = 0;
      count--;
    }

    return { ...props, damage: 0 };
  });
}
export const clam: Skill = {
  name: "气定神闲",
  description: "你的下一个技能，不需要消耗魔力！",
  mana: 2,
  run: _clam,
  type: [FIRE_TYPE],
};
