import {GameConstants} from "../data/constants/game.constants.js";

export function isPlayerTurnOutdated(lastActionDate) {
    let diff = {}
    let tmp = Date.now() - lastActionDate;

    tmp = Math.floor(tmp / 1000);
    diff.sec = tmp % 60;

    tmp = Math.floor((tmp - diff.sec) / 60);
    diff.min = tmp % 60;

    return diff.min > GameConstants.SKIP_TIME;
}
