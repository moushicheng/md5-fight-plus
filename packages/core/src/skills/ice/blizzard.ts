import { Skill } from "@/types/skill";
import { PlayerInstanceProperty } from "@/types/player";
import { getOpponent, getRandomItem, removeHookInRoundEnd } from "@/utils";
import { FIRE_TYPE } from "../firing";

const getAttackInfo = (player: PlayerInstanceProperty, atk: number) => {
  const info = [`${player.name}召唤【暴风雪】，造成${atk}点伤害！`];
  return getRandomItem(info);
};

export function _blizzard(player: PlayerInstanceProperty) {
  const id = player.hooks.onAttack.tap("blizzard", (props) => {
    const defender = getOpponent(player);
    const frostbite = defender.runtimeProperty.frostbite;
    const atk = frostbite * 3;
    player.battleField.logger.addInfo(
      getAttackInfo(player, atk),
      player.hooks.onAttack
    );
    return { ...props, damage: atk };
  });
  removeHookInRoundEnd(player, id, "onAttack");
}
export const blizzard: Skill = {
  name: "暴风雪",
  description: "造成【霜蚀】层数X3的伤害 ,并将目标的【霜蚀】层数清零",
  mana: 5,
  run: _blizzard,
  type: [FIRE_TYPE],
};
