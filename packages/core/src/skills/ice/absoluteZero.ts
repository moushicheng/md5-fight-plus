import { Skill } from "@/types/skill";
import { PlayerInstanceProperty } from "@/types/player";
import {
  getOpponent,
  getRandomItem,
  releaseFrostbite,
  removeHookInRoundEnd,
} from "@/utils";

const getAttackInfo = (player: PlayerInstanceProperty, atk: number) => {
  const defender = getOpponent(player);
  const info = [
    `空气中逐渐浮现出一丝冰晶，随着时间流逝，这片空间都被冻结了！${player.name}释放【绝对零度】，施加【霜蚀】50！`,
  ];
  return getRandomItem(info);
};

export function _absoluteZero(player: PlayerInstanceProperty) {
  const id = player.hooks.onAttack.tap("init frostbiteAttack", (props) => {
    releaseFrostbite(player, 50);
    player.battleField.logger.addInfo(
      getAttackInfo(player, 5),
      player.hooks.onAttack
    );
    return { ...props, damage: 0 };
  });
  removeHookInRoundEnd(player, id, "onAttack");
}
export const absoluteZero: Skill = {
  name: "绝对零度",
  description: "【霜蚀】50",
  mana: 8,
  run: _absoluteZero,
};
