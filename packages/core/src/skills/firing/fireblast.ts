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
  const info = [
    `${player.name}快速引导周围的火元素能量，手中凝聚并释放【火焰冲击】造成${atk}伤害`,
  ];
  return getRandomItem(info);
};

export function _fireblast(player: PlayerInstanceProperty) {
  const id = player.hooks.onAttack.tap(
    { name: "fireblast", lives: 1 },
    (props) => {
      const atk = 10;
      releaseFiring(player, 2);
      player.battleField.logger.addInfo(
        getInfo(player, atk),
        player.hooks.onAttack
      );
      return { ...props, damage: atk };
    }
  );
  removeHookInRoundEnd(player, id, "onAttack");
}
export const fireBlast: Skill = {
  name: "火焰冲击",
  description: "造成10点伤害,【灼热】2",
  mana: 2,
  run: _fireblast,
  type: [FIRE_TYPE],
};
