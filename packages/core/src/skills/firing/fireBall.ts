import { Skill } from "@/types/skill";
import { PlayerInstanceProperty } from "@/types/player";
import {
  getRandomItem,
  releaseFiring,
  releaseFrostbite,
  removeHookInRoundEnd,
} from "@/utils";
import { FIRE_TYPE } from ".";

const getInfo = (player: PlayerInstanceProperty, atk: number) => {
  const info = [`${player.name}释放【火球术】造成${atk}伤害`];
  return getRandomItem(info);
};

export function _fireBall(player: PlayerInstanceProperty) {
  player.hooks.onAttack.tap({ name: "fireBall", lives: 1 }, (props) => {
    const atk = 20;
    releaseFiring(player, 4);
    player.battleField.logger.addInfo(
      getInfo(player, atk),
      player.hooks.onAttack
    );
    return { ...props, damage: atk };
  });
}
export const fireBall: Skill = {
  name: "火球术",
  description: "造成20点伤害,【灼热】4",
  mana: 4,
  run: _fireBall,
  type: [FIRE_TYPE],
};
