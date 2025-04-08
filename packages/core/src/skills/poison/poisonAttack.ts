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
const getAttackInfo = (player: PlayerInstanceProperty, dmg: number) => {
  const info = [`${player.name}释放剧毒之刃，造成${dmg}点伤害`];
  return getRandomItem(info);
};

export function _poisonAttack(player: PlayerInstanceProperty) {
  player.hooks.onAttack.tap(
    {
      name: "poisonAttack",
      lives: 1,
    },
    ({ battleField, oneRoundContext }) => {
      const opponent = getOpponent(player);
      const dmg = opponent.runtimeProperty.poison;
      player.battleField.logger.addInfo(getAttackInfo(player, dmg), onAttack);
      return { battleField, oneRoundContext, damage: dmg };
    }
  );
}
export const poisonAttack: Skill = {
  name: "剧毒之刃",
  description: "对敌方造成【毒药】层数的伤害",
  mana: 2,
  run: _poisonAttack,
  type: [POISON_TYPE],
};
