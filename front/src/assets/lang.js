/**
 * @typedef {'singleplayer' | 'multiplayer' | 'howtoplay' | 'settings' | 'logout'} TranslateKey
 */

/**
 * Translate
 * @enum {Object}
 */
const Translates = {
    singleplayer: {
        fr: 'Partie seul',
        en: 'Singleplayer',
    },
    multiplayer: {
        fr: 'Multijoueur',
        en: 'Multiplayer',
    },
    howtoplay: {
        fr: 'Comment jouer ?',
        en: 'How to play?',
    },
    settings: {
        fr: 'Paramètres',
        en: 'Settings',
    },
    logout: {
        fr: 'Se déconnecter',
        en: 'Logout',
    }
}

export default Translates