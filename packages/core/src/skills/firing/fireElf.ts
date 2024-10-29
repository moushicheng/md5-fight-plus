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
  const info = [`火羽精灵进攻，造成${atk}点伤害`];
  return getRandomItem(info);
};

export function _fireElf(player: PlayerInstanceProperty) {
  let isFirst = true;
  player.hooks.onAttack.tap({ name: "fireElf", lives: 5 }, (props) => {
    const atk = player.runtimeProperty.firing;
    releaseFiring(player, 1);
    if (isFirst) {
      isFirst = false;
      player.battleField.logger.addInfo(`${player.name}召唤火羽精灵`);
      return { ...props, damage: atk };
    }
    player.battleField.logger.addInfo(
      getInfo(player, atk),
      player.hooks.onAttack
    );
    return { ...props, damage: atk };
  });
}
export const fireElf: Skill = {
  name: "火羽精灵",
  description:
    "获得【灼热】1，火羽精灵，【持续】4，己方回合结束时，造成【灼热】层数的伤害",
  mana: 4,
  run: _fireElf,
  type: [FIRE_TYPE],
};
