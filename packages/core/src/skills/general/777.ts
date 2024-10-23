import { Skill } from "@/types/skill";
import { PlayerInstanceProperty } from "@/types/player";
import { removeHookInRoundEnd } from "@/utils";
export function _skill_777(player: PlayerInstanceProperty) {
  const id = player.hooks.onAttack.tap("init frostbiteAttack", (props) => {
    const roundTimes = player.battleField.roundCount;
    const rate = roundTimes % 7 ? 2 : 1;
    const atk = (roundTimes & 2 ? 10 : 0) * rate;
    const armor = (roundTimes & 3 ? 10 : 0) * rate;
    const hp = (roundTimes & 5 ? 10 : 0) * rate;
    let info = `${player.name}释放【777】，`;
    if (atk === 0 && armor === 0 && hp === 0 && rate === 1) {
      info += "但无事发生！";
      return { ...props, damage: 0 };
    }
    if (atk === 0 && armor === 0 && hp === 0 && rate === 2) {
      info += "造成14点伤害！";
      return { ...props, damage: 14 };
    }
    const infos = [];
    if (atk !== 0) {
      infos.push(`造成${atk}点伤害`);
    }
    if (hp !== 0) {
      infos.push(`恢复${hp}点生命`);
      player.hooks.onAdjustHp.call(hp);
    }
    if (armor !== 0) {
      infos.push(`获得${armor}点护甲`);
      player.hooks.onAdjustArmor.call(armor);
    }
    info += infos.join("，") + "!";

    player.battleField.logger.addInfo(info);
    return { ...props, damage: atk };
  });
  removeHookInRoundEnd(player, id, "onAttack");
}
export const skill_777: Skill = {
  name: "777",
  description: "来一次神奇的赌博！",
  mana: 5,
  run: _skill_777,
};
