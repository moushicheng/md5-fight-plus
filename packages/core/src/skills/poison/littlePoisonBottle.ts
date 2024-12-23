import { Skill } from "@/types/skill";
import { PlayerInstanceProperty } from "@/types/player";
import _ from "lodash";
import {
  getOpponent,
  getRandomItem,
  releasePoison,
  removeHookInRoundEnd,
} from "@/utils";
import { POISON_TYPE } from ".";
import { onAttack } from "@/logs";
const getAttackInfo = (player: PlayerInstanceProperty) => {
  const info = [`${player.name}投掷小毒瓶，施加了5点【毒药】`];
  return getRandomItem(info);
};

export function _littlePoisonBottle(player: PlayerInstanceProperty) {
  player.hooks.onAttack.tap(
    {
      name: "littlePoisonBottle",
      lives: 1,
    },
    ({ battleField, oneRoundContext }) => {
      const opponent = getOpponent(player);
      releasePoison(opponent, 5);
      player.battleField.logger.addInfo(getAttackInfo(player), onAttack);
      return { battleField, oneRoundContext, damage: 0 };
    }
  );
}
export const littlePoisonBottle: Skill = {
  name: "小毒瓶",
  description: "小毒瓶，对敌方施加5【毒药】",
  mana: 2,
  run: _littlePoisonBottle,
  type: [POISON_TYPE],
};
