import { PlayerInstanceProperty } from "src/types/player"
import { SyncHook } from "tapable"

export const createPlayerHook = () => {
    const hooks = {
        initProperty: new SyncHook<PlayerInstanceProperty>(["playerParameter"])
    }
    return hooks
}