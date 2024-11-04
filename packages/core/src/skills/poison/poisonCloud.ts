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
  const info = [`【毒雾】蔓延....`];
  return getRandomItem(info);
};

export function _poisonCloud(player: PlayerInstanceProperty) {
  let first = true;
  player.hooks.onAttack.tap(
    {
      name: "poisonCloud",
      lives: 1000,
    },
    ({ battleField, oneRoundContext }) => {
      const opponent = getOpponent(player);
      releasePoison(opponent, 2);
      releasePoison(player, 2);
      if (first) {
        player.battleField.logger.addInfo(
          player.name + "释放了【毒雾】",
          onAttack
        );
      } else {
        player.battleField.logger.addInfo(getAttackInfo(player), onAttack);
      }
      first = false;
      return { battleField, oneRoundContext, damage: 0 };
    }
  );
}
export const poisonCloud: Skill = {
  name: "毒雾",
  description: "接下来的整场战斗，双方玩家每回合结束时施加【毒药】2",
  mana: 3,
  run: _poisonCloud,
  type: [POISON_TYPE],
};
