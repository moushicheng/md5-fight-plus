import { PlayerInstanceProperty } from "@/types/player";
import _ from 'lodash'
//普攻
export function normalAttack(player: PlayerInstanceProperty) {
    player.hooks.onAttack.tap('normal Attack', (props) => {
        const accumulate = _.isNumber(props) ? props : 0; //我也不知道什么情况下普攻还会有增伤。。
        const atk = player.runtimeProperty.attack;
        return accumulate + atk
    })
}