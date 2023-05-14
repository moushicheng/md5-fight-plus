import { BattleField } from "src/types/BattleField";
export const enum PlayerStatus {
    /**
     * The `ready` status means the `Player` is doing nothing.
     */
    ready,
    /**
     * The `beforeAttack` status means the `Player` is preparing an attacking.
     */
    beforeAttack,
    /**
     * The `onAttack` status means the `Player` is attacking.
     */
    onAttack,
    /**
     * The `afterAttack` status means the `Player` has just finished an attacking.
     */
    afterAttack,
    /**
     * The `beforeUnderAttack` status means the `Player` is about to be under attack.
     */
    beforeUnderAttack,
    /**
     * The `onUnderAttack` status means the `Player` is under attack.
     */
    onUnderAttack,
    /**
     * The `afterUnderAttack` status means the `Player` has just been attacked.
     */
    afterUnderAttack,
}
export enum PlayerType {
    physical,
    magical
}

const PlayerStatusList: PlayerStatus[] = [
    PlayerStatus.onUnderAttack,
    PlayerStatus.afterUnderAttack,
    PlayerStatus.beforeAttack,
    PlayerStatus.afterAttack,
    PlayerStatus.beforeUnderAttack,
    PlayerStatus.ready,
    PlayerStatus.onAttack,
];

const createPlayer = function () {

}

const getPlayer = function () {

}

