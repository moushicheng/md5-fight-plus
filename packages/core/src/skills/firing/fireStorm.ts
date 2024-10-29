import { Skill } from "@/types/skill";
import { PlayerInstanceProperty } from "@/types/player";
import { getRandomItem, releaseFiring, removeHookInRoundEnd } from "@/utils";
import { FIRE_TYPE } from ".";

const getInfo = (player: PlayerInstanceProperty, atk: number) => {
  const info = [`${player.name}释放【火焰风暴】造成${atk}伤害`];
  return getRandomItem(info);
};

export function _fireStorm(player: PlayerInstanceProperty) {
  const id = player.hooks.onAttack.tap("fireStorm", (props) => {
    const atk = 30;
    releaseFiring(player, 6);
    player.battleField.logger.addInfo(
      getInfo(player, atk),
      player.hooks.onAttack
    );
    return { ...props, damage: atk };
  });
  removeHookInRoundEnd(player, id, "onAttack");
}
export const fireStorm: Skill = {
  name: "火焰风暴",
  description: "造成30点伤害,【灼热】6",
  mana: 6,
  run: _fireStorm,
  type: [FIRE_TYPE],
};
