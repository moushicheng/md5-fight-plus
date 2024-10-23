import { Skill } from "@/types/skill";
import { PlayerInstanceProperty } from "@/types/player";
import { getRandomItem, releaseFiring, removeHookInRoundEnd } from "@/utils";

const getInfo = (player: PlayerInstanceProperty, atk: number) => {
  const info = [`${player.name}释放【炎爆术】造成${atk}伤害`];
  return getRandomItem(info);
};

export function _fireBurst(player: PlayerInstanceProperty) {
  const id = player.hooks.onAttack.tap("fireBurst", (props) => {
    const atk = 40;
    releaseFiring(player, 8);
    player.battleField.logger.addInfo(
      getInfo(player, atk),
      player.hooks.onAttack
    );
    return { ...props, damage: atk };
  });
  removeHookInRoundEnd(player, id, "onAttack");
}
export const fireBurst: Skill = {
  name: "炎爆术",
  description: "造成40点伤害,【灼热】8",
  mana: 8,
  run: _fireBurst,
};
