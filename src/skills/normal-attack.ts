import { PlayerInstanceProperty } from "@/types/player";
import _ from 'lodash'
//普攻
export function normalAttack(player: PlayerInstanceProperty) {
    console.log('init normalAttack');
    const id = player.hooks.onAttack.tap('normal Attack', (props) => {
        const accumulate = _.isNumber(props) ? props : 0; //我也不知道什么情况下普攻还会有增伤。。
        const atk = player.runtimeProperty.attack;
        console.log(`@ ${player.name}平A了一下,即将造成${atk}点伤害`);
        return accumulate + atk
    })
    player.hooks.onAttack.tap('remove normalAttack', (props) => {
        player.hooks.onAttack.removeTap(id)
        return props
    })
}