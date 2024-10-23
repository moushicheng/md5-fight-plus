import { SyncBailHook } from "@/hooks/SyncBailHook";
import { BattleFieldInstance } from "@/types/battleField";
import { PlayerInstanceProperty } from "@/types/player";
import { registerRoundHooks } from "../hooks/registrant/registerRoundHooks";
import { registerHooks } from "../hooks/registrant/registerHooks";
import { initRound } from "./initRound";
import { RoundTimeOutEvent } from "@/events/roundTimeOut";
import { registerAfterActionHook } from "./registerIntercept";
import { createLogger } from "@/logs";
import { getPlayerState, getPlayers } from "@/utils";

export function createBattleField(
  p1: PlayerInstanceProperty,
  p2: PlayerInstanceProperty
) {
  const battleFieldInstance: BattleFieldInstance = {};
  //初始化参数
  initPlayer(battleFieldInstance, p1, p2);
  initRound(battleFieldInstance);
  initFight(battleFieldInstance);
  initHooks(battleFieldInstance);
  initLogger(battleFieldInstance);
  //注册一些钩子
  registerHooks(battleFieldInstance);
  registerRoundHooks(battleFieldInstance);
  registerAfterActionHook(battleFieldInstance);
  battleFieldInstance.hooks.init.call(battleFieldInstance);
  return battleFieldInstance;
}
export function initPlayer(
  battleField: BattleFieldInstance,
  p1: PlayerInstanceProperty,
  p2: PlayerInstanceProperty
) {
  if (!battleField.players)
    battleField.players = { left: undefined, right: undefined };
  if (p1) battleField.players.left = p1;
  if (p2) battleField.players.right = p2;
  p1.battleField = battleField;
  p2.battleField = battleField;
}

export function initFight(battleField: BattleFieldInstance) {
  battleField.fight = () => {
    battleField.hooks.fightStart.call(battleField);
    try {
      for (; battleField.roundCount < 100; battleField.roundCount++) {
        battleField.logger.addInfo(
          `------------------第${battleField.roundCount}回合------------------`
        );
        battleField.round();
      }
      throw new RoundTimeOutEvent();
    } catch (err) {
      const message = err.message ? err.message : err;
      battleField.logger.addInfo(`游戏结束,原因: ${message}`, "game over");
      battleField.logger.addError(`游戏结束,原因: ${message}`, "game over");
      console.log(err);
    }
  };
}
export function initHooks(battleField: BattleFieldInstance) {
  battleField.hooks = {
    init: new SyncBailHook<BattleFieldInstance>(),
    // 计算运行时属性
    // 计算玩家技能组
    fightStart: new SyncBailHook<BattleFieldInstance>(),
  };
}

export function initLogger(battleField: BattleFieldInstance) {
  battleField.logger = createLogger({
    filePath: "battleField.log.json",
    mode: "JSON",
  });
}
