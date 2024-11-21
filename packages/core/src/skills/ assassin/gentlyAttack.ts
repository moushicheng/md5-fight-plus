import { Skill } from "@/types/skill";
import { PlayerInstanceProperty } from "@/types/player";
import {
    getRandomItem,
} from "@/utils";
import { ASSASSIN_TYPE } from ".";

const getInfo = (player: PlayerInstanceProperty, atk: number) => {
    const info = [`${player.name}释放【轻击】造成${atk}伤害`];
    return getRandomItem(info);
};

export function _gentlyAttack(player: PlayerInstanceProperty) {
    player.hooks.onAttack.tap({ name: "gentlyAttack", lives: 1 }, (props) => {
        const atk = player.runtimeProperty.speed
        player.battleField.logger.addInfo(
            getInfo(player, atk),
            player.hooks.onAttack
        );
        return { ...props, damage: atk };
    });
}
export const gentlyAttack: Skill = {
    name: "轻击",
    description: "造成一倍速度的伤害",
    mana: 1,
    run: _gentlyAttack,
    type: [ASSASSIN_TYPE],
};
