import { Skill } from "@/types/skill";
import { PlayerInstanceProperty } from "@/types/player";
import {
  getOpponent,
  getRandomItem,
  releaseFrostbite,
  removeHookInRoundEnd,
} from "@/utils";
import { FIRE_TYPE } from "../firing";

const getInfo = (player: PlayerInstanceProperty) => {
  const info = [`${player.name}释放【寒冰护甲】，获得10点护甲值`];
  return getRandomItem(info);
};

export function _iceArmor(player: PlayerInstanceProperty) {
  const defender = getOpponent(player);
  const id = player.hooks.onAttack.tap("init frostbiteAttack", (props) => {
    player.hooks.onAdjustArmor.call(10);
    player.battleField.logger.addInfo(getInfo(player), player.hooks.onAttack);
    return props;
  });
  const id2 = player.hooks.onUnderAttack.tap("Ice Armor Frostbite", (props) => {
    defender.hooks.onAdjustFrostbite.call(5);
    player.battleField.logger.addInfo(
      `因冰寒护甲，${defender.name}获得【霜蚀】5`
    );
    removeHookInRoundEnd(player, id2, "onUnderAttack");
    return props;
  });
  removeHookInRoundEnd(player, id, "onAttack");
}
export const iceArmor: Skill = {
  name: "寒冰护甲",
  description: "获得10点护甲，下一回合中每当受到一次攻击，【霜蚀】5",
  mana: 3,
  run: _iceArmor,
  type: [FIRE_TYPE],
};
