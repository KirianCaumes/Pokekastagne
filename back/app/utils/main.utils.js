import {GameConstants} from "../data/constants/game.constants.js";

function timeDiff(lastActionDate) {
    let diff = {}
    let tmp = Date.now() - lastActionDate;

    tmp = Math.floor(tmp / 1000);
    diff.sec = tmp % 60;

    tmp = Math.floor((tmp - diff.sec) / 60);
    return tmp % 60;
}

export function rememberPlayerToPlay(lastActionDate) {
    const diff = timeDiff(lastActionDate);

    return (diff > 10) && (diff < GameConstants.SKIP_TIME);
}

export function isPlayerOutOfTime(lastActionDate) {
    const diff = timeDiff(lastActionDate);

    return diff > GameConstants.SKIP_TIME;
}


