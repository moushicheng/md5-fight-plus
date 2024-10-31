import { BattleFieldInstance } from "@/types/battleField";
import { PlayerInstanceProperty } from "@/types/player";
import { writeFile } from "fs";
import { cloneDeep, omit } from "lodash";

export const RoundStart = "RoundStart";
export const onUnderAttack = "onUnderAttack";
export const onAttack = "onAttack";
//消息级别:Level(info,warning,error
export enum Level {
  error = 0,
  warn = 1,
  info = 2,
  http = 3,
  debug = 4,
  system = 5,
}
type Log = {
  message: string;
  time: Date;
  level: number;
  type: any;
  players: {
    [key: string]: Omit<PlayerInstanceProperty, "hooks" | "battleField">;
  };
};
type Options = {
  mode: "JSON" | "DB";
  filePath: string;
  battleField: BattleFieldInstance;
};
export type Logger = {
  add: (level: Level, type: any, message: string) => number;
  addError: (message: string, type?: any) => number;
  addWarn: (message: string, type?: any) => number;
  addDebug: (message: string, type?: any) => number;
  addInfo: (message: string, type?: any) => number;
  addHttp: (message: string, type?: any) => number;
  addSystem: (message: string, type?: any) => number;
  getByLevel: (level: Level) => Log[];
  getByScopeLevel: (minLevel: any, maxLevel: any) => Log[];
  getByType: (type: any) => Log[];
  getByMessage: (message: string) => Log[];
  storageLogs: (callback: any) => void;
  LogContainer: Log[];
};
//根据消息级别来归类Log
//根据时间顺序来归类Log
export const createLogger = (options?: Options): Logger => {
  const LogContainer: Log[] = [];

  const add = (level: Level, type = "unknown", message) => {
    const players = options.battleField.players;
    const newLog: Log = {
      message,
      time: new Date(),
      level,
      type,
      players: {
        [players.left.name]: cloneDeep(
          omit(players.left, ["hooks", "battleField"])
        ),
        [players.right.name]: cloneDeep(
          omit(players.right, ["hooks", "battleField"])
        ),
      },
    };
    LogContainer.push(newLog);
    return LogContainer.length - 1;
  };
  const addError = (message, type) => add(Level.error, type, message);
  const addWarn = (message, type) => add(Level.warn, type, message);
  const addInfo = (message, type) => add(Level.info, type, message);
  const addHttp = (message, type) => add(Level.http, type, message);
  const addDebug = (message, type) => add(Level.debug, type, message);
  const addSystem = (message, type) => add(Level.system, type, message);

  const getByLevel = (level: Level) => {
    return LogContainer.filter((item) => item.level === level);
  };
  const getByType = (type: any) => {
    return LogContainer.filter((item) => item.type === type);
  };
  const getByMessage = (message) => {
    return LogContainer.filter((item) => item.message.includes(message));
  };
  const getByScopeLevel = (minLevel, maxLevel) => {
    return LogContainer.filter((item) => {
      return item.level <= maxLevel && item.level >= minLevel;
    });
  };
  const storageLogs = (callback) => {
    if (options.mode === "JSON" && options.filePath) {
      writeFile(options.filePath, JSON.stringify(LogContainer), (err) =>
        callback(err)
      );
      return;
    }
    //用户自己处理Log
    callback(LogContainer);
  };

  return {
    add,
    addError,
    addWarn,
    addDebug,
    addInfo,
    addHttp,
    addSystem,
    getByLevel,
    getByScopeLevel,
    getByType,
    getByMessage,
    storageLogs,
    LogContainer,
  };
};
