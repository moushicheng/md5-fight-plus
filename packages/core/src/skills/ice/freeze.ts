import { Skill } from "@/types/skill";
import { PlayerInstanceProperty } from "@/types/player";
import {
  getOpponent,
  getRandomItem,
  releaseFrostbite,
  removeHookInRoundEnd,
} from "@/utils";
import { FIRE_TYPE } from "../firing";

const info = (player: PlayerInstanceProperty, spd: number) => {
  const defender = getOpponent(player);
  const info = [
    `${player.name}释放冰结术,${defender.name}感觉自己从皮肤一层层到心脏....都无法动弹了，${defender.name}速度减少${spd}点！`,
  ];
  return getRandomItem(info);
};

export function _freeze(player: PlayerInstanceProperty) {
  const id = player.hooks.onAttack.tap("init frostbiteAttack", (props) => {
    const defender = getOpponent(player);
    const defenderFrostbite = defender.runtimeProperty.frostbite;
    const defenderSpeed = defender.runtimeProperty.speed;
    const transformTimes = Math.min(
      Math.floor(defenderFrostbite / 3),
      defenderSpeed - 1,
      3
    );
    defender.hooks.onAdjustFrostbite.call(-transformTimes * 3);
    defender.hooks.onAdjustSpeed.call(-transformTimes);
    player.battleField.logger.addInfo(
      info(player, transformTimes),
      player.hooks.onAttack
    );
    return props;
  });
  removeHookInRoundEnd(player, id, "onAttack");
}
export const freeze: Skill = {
  name: "冰结术",
  description:
    "转化目标身上的至多9层霜蚀，每转化3层则使敌方SPD-1,若敌方SPD<=1，则改为释放【丢雪球】",
  mana: 2,
  run: _freeze,
  type: [FIRE_TYPE],
};
