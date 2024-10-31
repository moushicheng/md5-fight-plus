import { Skill } from "@/types/skill";
import { PlayerInstanceProperty } from "@/types/player";
import { removeHookInRoundEnd } from "@/utils";
import { GENERAL_TYPE } from ".";
import { getRandomScope } from "../utils";
export function _skill_777(player: PlayerInstanceProperty) {
  const id = player.hooks.onAttack.tap("777", (props) => {
    const roundTimes = player.runtimeContext.roundCount;

    let info = `${player.name}释放【777】，正在进行神秘的抽签..`;

    const infos = [];
    const atk = getAtkAndHp(roundTimes, infos);
    infos.push(`\n抽签结束共计造成${atk}伤害！`);
    info += infos.join("，") + "!";

    player.battleField.logger.addInfo(info);
    return { ...props, damage: atk };
  });
  removeHookInRoundEnd(player, id, "onAttack");
}
export const skill_777: Skill = {
  name: "777",
  description: "来一次神奇的赌博！",
  mana: 7,
  run: _skill_777,
  type: [GENERAL_TYPE],
};

const getAtkAndHp = (roundTimes: number, infos: string[]) => {
  let atk = roundTimes % 2 === 0 ? (getRandomScope(0, 7 * 3) % 7) * 7 : 0;
  const again = getRandomScope(0, 10) >= 7;

  infos.push(`【${atk}】`);

  if (again) {
    infos.push("再来一次！再次进行抽签...");
  }
  if (again) {
    const _atk = getAtkAndHp(roundTimes + 1, infos);
    atk += _atk;
  }

  return atk;
};
