import { Skill } from "@/types/skill";
import { PlayerInstanceProperty } from "@/types/player";
import { getRandomItem, releaseFiring, releaseFrostbite, removeHookInRoundEnd } from "@/utils";

const getInfo = (player: PlayerInstanceProperty, atk: number) => {
    const info = [
        `${player.name}释放【火球术】造成${atk}伤害`,
    ]
    return getRandomItem(info)
}

export function _fireBall(player: PlayerInstanceProperty) {
    player.hooks.onAttack.tap({ name: 'fireball', lives: 1 }, (props) => {
        const atk = 20
        releaseFiring(player, 4)
        player.battleField.logger.addInfo(getInfo(player, atk), player.hooks.onAttack);
        return { ...props, damage: atk }
    })
}
export const fireBall: Skill = {
    name: '火焰冲击',
    description: '造成20点伤害,【灼热】4',
    mana: 2,
    run: _fireBall
}