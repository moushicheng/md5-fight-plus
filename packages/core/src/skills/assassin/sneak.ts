import { Skill } from "@/types/skill";
import { PlayerInstanceProperty } from "@/types/player";
import {
    getRandomItem,
} from "@/utils";
import { ASSASSIN_TYPE } from ".";

const getInfo = (player: PlayerInstanceProperty) => {
    const info = [`${player.name}释放【潜行】`];
    return getRandomItem(info);
};

export function _sneak(player: PlayerInstanceProperty) {
    player.hooks.onAttack.tap({ name: "sneak", lives: 1 }, (props) => {
        player.hooks.onAdjustSpeed.call(+5); //增加2点速度
        player.battleField.logger.addInfo(
            getInfo(player,),
            player.hooks.onAttack
        );
        return { ...props, damage: 0 };
    });
}
export const sneak: Skill = {
    name: "潜行",
    description: "增加5点速度",
    mana: 3,
    run: _sneak,
    type: [ASSASSIN_TYPE],
};
