import { BattleFieldInstance } from "@/types/battleField";
import { PlayerInstanceProperty } from "@/types/player";
import { getOpponent, getPlayers } from "@/utils";

export function initBuffFiring(battleField: BattleFieldInstance) {
  const { player1, player2 } = getPlayers(battleField);
  run(player1);
  run(player2);
  function run(player: PlayerInstanceProperty) {
    //玩家回合结束阶段，转化灼热层数为速度
    player.hooks.afterAttack.tap(
      {
        name: "firing",
        stage: 60,
      },
      (props) => {
        const attacker = getOpponent(player);
        const firing = attacker.runtimeProperty.firing;
        if (firing <= 5) return props;
        attacker.runtimeProperty.speed =
          attacker.runtimeProperty.speed + (firing % 5);
        attacker.hooks.onAdjustFiring.call(-(firing % 5) * 5);
        battleField.logger.addInfo(
          `由于灼热效果,${attacker.name}增加速度${firing % 5}点`
        );
        return props;
      }
    );
  }
}
