import { BattleFieldInstance } from "@/types/battleField";
import { PlayerInstanceProperty } from "@/types/player";
import { getOpponent, getPlayers } from "@/utils";

export function initBuffPoison(battleField: BattleFieldInstance) {
  run();
  function run() {
    //玩家回合结束阶段，
    battleField.roundHooks.roundEnd.tap(
      {
        name: "poison",
        stage: 60,
      },
      (props) => {
        const { player1, player2 } = getPlayers(battleField);
        po(player1);
        po(player2);
        function po(player: PlayerInstanceProperty) {
          const poison = player.runtimeProperty.poison;
          if (!poison || poison <= 0) {
            return props;
          }
          player.hooks.onAdjustPoison.call(-1);
          player.hooks.onAdjustHp.call(-poison);
          player.battleField.logger.addInfo(
            `${player.name}【毒药】发作，造成${poison}点伤害`
          );
        }
        return props;
      }
    );
  }
}
