import { Skill } from "@/types/skill";
import { PlayerInstanceProperty } from "@/types/player";
import _ from "lodash";
import { getRandomItem, removeHookInRoundEnd } from "@/utils";
import { GENERAL_TYPE } from ".";
import { onAttack } from "@/logs";

const getInfo = (player: PlayerInstanceProperty) => {
  const info = [`${player.name}咔了口魔力瓶，回复五点魔力`];
  return getRandomItem(info);
};

export function _normalAttack(player: PlayerInstanceProperty) {
  player.hooks.onAttack.tap(
    {
      name: "manaBottle",
      lives: 1,
    },
    ({ battleField, oneRoundContext }) => {
      player.hooks.onAdjustMana.call(+5);
      player.battleField.logger.addInfo(getInfo(player), onAttack);
      return { battleField, oneRoundContext, damage: 0 };
    }
  );
}
export const manaBottle: Skill = {
  name: "魔力瓶",
  description: "咔，回口魔力,总共五点",
  mana: 0,
  run: _normalAttack,
  type: [GENERAL_TYPE],
};
