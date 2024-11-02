import { BattleFieldInstance } from "@/types/battleField";
import { PlayerInstanceProperty } from "@/types/player";
import { getOpponent, getPlayers } from "@/utils";

export function initBuffPoison(battleField: BattleFieldInstance) {
  const { player1, player2 } = getPlayers(battleField);
  run(player1);
  run(player2);
  function run(player: PlayerInstanceProperty) {
    //玩家回合结束阶段，
    player.hooks.afterAttack.tap(
      {
        name: "poison",
        stage: 60,
      },
      (props) => {
        const poison = player.runtimeProperty.poison;
        if (!poison || poison <= 0) {
          return;
        }
        player.hooks.onAdjustPoison.call(-1);
        player.hooks.onAdjustHp.call(-poison);
        player.battleField.logger.addInfo(
          `${player.name}【毒药】发作，造成${poison}点伤害`
        );
        return props;
      }
    );
  }
}
