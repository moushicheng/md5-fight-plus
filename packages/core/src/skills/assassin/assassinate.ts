import { Skill } from "@/types/skill";
import { PlayerInstanceProperty } from "@/types/player";
import { getRandomItem } from "@/utils";
import { ASSASSIN_TYPE } from ".";

const getInfo = (player: PlayerInstanceProperty, atk: number) => {
  const info = [`${player.name}释放【刺杀】造成${atk}伤害`];
  return getRandomItem(info);
};

export function _assassinate(player: PlayerInstanceProperty) {
  player.hooks.onAttack.tap({ name: "assassinate", lives: 1 }, (props) => {
    player.hooks.onAdjustSpeed.call(+1); //增加1点速度
    const atk = player.runtimeProperty.attack;
    player.battleField.logger.addInfo(
      getInfo(player, atk),
      player.hooks.onAttack
    );
    return { ...props, damage: atk };
  });
}
export const assassinate: Skill = {
  name: "刺杀",
  description: "增加1点速度，并造成一倍力量的伤害",
  mana: 1,
  run: _assassinate,
  type: [ASSASSIN_TYPE],
};
