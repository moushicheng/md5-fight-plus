import { PlayerBaseProperty } from "@/types/player"

export const findMinProperty = (baseProperty: PlayerBaseProperty) => {
    let min = 9999;
    let minKey = ''
    for (const key in baseProperty) {
        if (baseProperty[key] < min) {
            minKey = key;
            min = baseProperty[key]
        }
    }
    return minKey
}