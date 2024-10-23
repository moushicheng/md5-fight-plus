import { Skill } from "@/types/skill";
import { PlayerInstanceProperty } from "@/types/player";
import {
  getRandomItem,
  releaseFiring,
  releaseFrostbite,
  removeHookInRoundEnd,
} from "@/utils";

const getInfo = (player: PlayerInstanceProperty, atk: number) => {
  const info = [`火羽精灵进攻，造成${atk}点伤害`];
  return getRandomItem(info);
};

export function _fireElf(player: PlayerInstanceProperty) {
  let isFirst = true;
  player.hooks.onAttack.tap({ name: "fireElf", lives: 3 }, (props) => {
    if (isFirst) {
      isFirst = false;
      player.battleField.logger.addInfo(`${player.name}召唤火羽精灵`);
      return { ...props, damage: 0 };
    }
    const atk = player.runtimeProperty.firing;
    player.battleField.logger.addInfo(
      getInfo(player, atk),
      player.hooks.onAttack
    );
    return { ...props, damage: atk };
  });
}
export const fireElf: Skill = {
  name: "火羽精灵",
  description: "火羽精灵，【持续】2，己方回合结束时，造成【灼热】层数的伤害",
  mana: 4,
  run: _fireElf,
};
