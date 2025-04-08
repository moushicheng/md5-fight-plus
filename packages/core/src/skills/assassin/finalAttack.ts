import { Skill } from "@/types/skill";
import { PlayerInstanceProperty } from "@/types/player";
import {
    getRandomItem,
} from "@/utils";
import { ASSASSIN_TYPE } from ".";

const getInfo = (player: PlayerInstanceProperty, atk: number) => {
    const info = [`${player.name}释放【终结技】造成${atk}伤害`];
    return getRandomItem(info);
};

export function _finalAttack(player: PlayerInstanceProperty) {
    player.hooks.onAttack.tap({ name: "finalAttack", lives: 1 }, (props) => {
        const atk = player.runtimeProperty.attack * 0.5 * player.runtimeProperty.mana;
        player.battleField.logger.addInfo(
            getInfo(player, atk),
            player.hooks.onAttack
        );
        player.hooks.onAdjustMana.call( - player.runtimeProperty.mana);
        return { ...props, damage: atk };
    });
}
export const finalAttack: Skill = {
    name: "终结技",
    description: "消耗自己所有魔力,每消耗一点造成0.5力量的伤害",
    mana: 0,
    run: _finalAttack,
    type: [ASSASSIN_TYPE],
};
