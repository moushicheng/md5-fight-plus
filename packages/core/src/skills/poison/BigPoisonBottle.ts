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
  const info = [`${player.name}投掷大毒瓶，施加了10点【毒药】`];
  return getRandomItem(info);
};

export function _bigPoisonBottle(player: PlayerInstanceProperty) {
  player.hooks.onAttack.tap(
    {
      name: "bigPoisonBottle",
      lives: 1,
    },
    ({ battleField, oneRoundContext }) => {
      const opponent = getOpponent(player);
      releasePoison(opponent, 10);
      player.battleField.logger.addInfo(getAttackInfo(player), onAttack);
      return { battleField, oneRoundContext, damage: 0 };
    }
  );
}
export const bigPoisonBottle: Skill = {
  name: "大毒瓶",
  description: "大毒瓶，对敌方施加10【毒药】",
  mana: 6,
  run: _bigPoisonBottle,
  type: [POISON_TYPE],
};
