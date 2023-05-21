import { SyncBailHook } from "@/hooks/SyncBailHook"
import { PlayerInstanceProperty } from "./player"
import { Logger } from "@/logs"

export type BattleFieldInstance = {
    players?: {
        left: PlayerInstanceProperty
        right: PlayerInstanceProperty
    }
    round?: () => void
    roundCount?: number
    roundHooks?: {
        roundStart: SyncBailHook<BattleFieldInstance>,
        roundEnd: SyncBailHook<BattleFieldInstance>,
        [props: string]: SyncBailHook<any>
    }
    /** 
        独立记录每轮回合状态
    **/
    roundContext?: {
        attackTimes: number,
        totalDamage: number,
        [props: string]: any
    }
    fight?: () => void
    hooks?: {
        init: SyncBailHook<BattleFieldInstance>
        fightStart: SyncBailHook<BattleFieldInstance>
        [props: string]: SyncBailHook<any>
    }
    logger?: Logger
}