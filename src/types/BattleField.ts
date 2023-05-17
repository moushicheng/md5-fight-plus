import { SyncBailHook } from "@/hooks/SyncBailHook"
import { PlayerInstanceProperty } from "./player"

export type BattleFieldInstance = {
    players?: {
        left: PlayerInstanceProperty
        right: PlayerInstanceProperty
    }
    round?: () => void
    roundCount?: number
    roundHooks?: {
        roundReady: SyncBailHook<BattleFieldInstance>
        [props: string]: SyncBailHook<any>
    }
    fight?: () => void
    hooks?: {
        init: SyncBailHook<BattleFieldInstance>
        [props: string]: SyncBailHook<any>
    }
}