import { Skill } from "@/types/skill";
import { PlayerInstanceProperty } from "@/types/player";
import _ from "lodash";
import { getRandomItem, removeHookInRoundEnd } from "@/utils";
import { GENERAL_TYPE } from "./general";
/**普通攻击 */
const getAttackInfo = (player: PlayerInstanceProperty, atk: number) => {
  const info = [
    `${player.name}跌跌撞撞A了过去,造成${atk}伤害！！`,
    `${player.name}释放技能【平A】,造成${atk}点伤害`,
  ];
  return getRandomItem(info);
};

export function _normalAttack(player: PlayerInstanceProperty) {
  player.hooks.onAttack.tap(
    {
      name: "normal Attack",
      lives: 1,
    },
    ({ battleField, oneRoundContext }) => {
      const atk = Math.round(player.runtimeProperty.attack * 0.5);
      player.battleField.logger.addInfo(
        getAttackInfo(player, atk),
        player.hooks.onAttack
      );
      return { battleField, oneRoundContext, damage: atk };
    }
  );
}
export const normalAttack: Skill = {
  name: "普通攻击",
  description: "简简单单攻击一下...",
  mana: 1,
  run: _normalAttack,
  type: [GENERAL_TYPE],
};
