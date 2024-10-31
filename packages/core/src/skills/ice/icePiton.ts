import { Skill } from "@/types/skill";
import { PlayerInstanceProperty } from "@/types/player";
import { getRandomItem, releaseFrostbite, removeHookInRoundEnd } from "@/utils";
import { FIRE_TYPE } from "../firing";

const getAttackInfo = (player: PlayerInstanceProperty, atk: number) => {
  const info = [
    `${player.name}向前突进,手中复现出一道寒芒，一记【冰锥刺击】造成${atk}伤害，【霜蚀】12`,
  ];
  return getRandomItem(info);
};

export function _icePiton(player: PlayerInstanceProperty) {
  const id = player.hooks.onAttack.tap("icePiton", (props) => {
    const atk = 3;
    releaseFrostbite(player, 12);
    player.battleField.logger.addInfo(
      getAttackInfo(player, atk),
      player.hooks.onAttack
    );
    return { ...props, damage: atk };
  });
  removeHookInRoundEnd(player, id, "onAttack");
}
export const icePiton: Skill = {
  name: "冰锥刺击",
  description: "造成3点伤害，【霜蚀】12",
  mana: 3,
  run: _icePiton,
  type: [FIRE_TYPE],
};
