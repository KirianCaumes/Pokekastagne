import {skins} from "../data/constants/player.constants";

export function getRandomSkin() {
    return skins[Math.floor(Math.random() * skins.length)];
}
