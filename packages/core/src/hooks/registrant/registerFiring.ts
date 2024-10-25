import { BattleFieldInstance } from "@/types/battleField";
import { PlayerInstanceProperty } from "@/types/player";
import { getOpponent, getPlayers } from "@/utils";

export function initBuffFiring(battleField: BattleFieldInstance) {
  const { player1, player2 } = getPlayers(battleField);
  run(player1);
  run(player2);
  function run(player: PlayerInstanceProperty) {
    player.hooks.afterAttack.tap(
      {
        name: "firing",
        stage: 60,
      },
      (props) => {
        // const damage = props.damage;
        // const attacker = getOpponent(player);
        // const firing = attacker.runtimeProperty.firing;
        // const firingDamage = Math.ceil((firing / 100) * damage);
        // if (firing <= 0 || damage <= 0) return props;
        // props.damage = firingDamage;
        // // attacker.hooks.onAdjustFiring.call(-1)
        // player.hooks.onAdjustHp.call(-firingDamage);
        // battleField.logger.addInfo(
        //   `由于灼热效果,${player.name}再受到${firingDamage}点伤害`
        // );
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
