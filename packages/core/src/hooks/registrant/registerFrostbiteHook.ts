import { BattleFieldInstance } from "@/types/battleField";
import { PlayerInstanceProperty } from "@/types/player";
import { getPlayers } from "@/utils";

export function initBuffFrostbite(battleField: BattleFieldInstance) {
  const { player1, player2 } = getPlayers(battleField);
  run(player1);
  run(player2);
  function run(player: PlayerInstanceProperty) {
    player.hooks.onUnderAttack.tap(
      "increase buff_frostbite onUnderAttack",
      (props) => {
        const { damage } = props;
        const frostbite = player.runtimeProperty.frostbite;
        if (frostbite > 0 && damage > 0) {
          player.hooks.onAdjustFrostbite.call(2);
        }
        return props;
      }
    );
    player.hooks.afterAttack.tap(
      "release buff_frostbite on roundEnd",
      (props) => {
        const { player1: attacker } = getPlayers(battleField);
        const buff_frostbite =
          Math.floor(attacker.runtimeProperty.frostbite * 0.5) ||
          attacker.runtimeProperty.frostbite;
        if (buff_frostbite > 0) {
          attacker.hooks.onAdjustFrostbite.call(-buff_frostbite);
          attacker.hooks.onAdjustHp.call(-buff_frostbite);
          battleField.logger.addInfo(
            `${attacker.name}受到${buff_frostbite}点【霜蚀】伤害,当前霜蚀层数${attacker.runtimeProperty.frostbite}`
          );
        }
        return props;
      }
    );
  }
}
