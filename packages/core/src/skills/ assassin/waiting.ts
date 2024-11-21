import { Skill } from "@/types/skill";
import { PlayerInstanceProperty } from "@/types/player";
import {
    getRandomItem,
} from "@/utils";
import { ASSASSIN_TYPE } from ".";

export function _waiting(player: PlayerInstanceProperty) {
    player.hooks.onAttack.tap({ name: "waiting", lives: 1 }, (props) => {
        const value=Math.min(player.runtimeProperty.attack,3)
        player.hooks.onAdjustAttack.call(-value)
        player.hooks.onAdjustSpeed.call(+value)
        player.battleField.logger.addInfo(`${player.name}释放【伺机待发】，将${value}点力量转化为速度`, player.hooks.onAttack)
        return { ...props, damage: 0 };
    });
}
export const waiting: Skill = {
    name: "伺机待发",
    description: "将至多3点力量转化为速度",
    mana: 2,
    run: _waiting,
    type: [ASSASSIN_TYPE],
};
