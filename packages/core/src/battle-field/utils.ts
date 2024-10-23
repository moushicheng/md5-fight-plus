import { BattleFieldInstance } from "@/types/battleField";
import { PlayerInstanceProperty } from "@/types/player";

export const initOrder = (
  battleField: BattleFieldInstance,
  player1: PlayerInstanceProperty,
  player2: PlayerInstanceProperty
) => {
  battleField.players.left = player1;
  battleField.players.right = player2;
};
