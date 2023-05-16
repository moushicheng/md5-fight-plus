import { PlayerInstanceProperty } from "src/types/player"
import { SyncBailHook } from "./SyncBailHook"

export const createPlayerHook = () => {
    const hooks = {
        initProperty: new SyncBailHook<PlayerInstanceProperty>()
    }
    return hooks
}