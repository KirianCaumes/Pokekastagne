/**
 * @typedef {'singleplayer' | 'multiplayer' | 'howtoplay' | 'settings' | 'logout' | 'login' | 'register' | 'username' | 'email' | 'password'} TranslateKey
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
    },
    login: {
        fr: 'Se connecter',
        en: 'Login',
    },
    register: {
        fr: 'S\'inscrire',
        en: 'Register',
    },
    username: {
        fr: 'Nom d\'utilisateur',
        en: 'Username',
    },
    email: {
        fr: 'Mail',
        en: 'Email',
    },
    password: {
        fr: 'Mot de passe',
        en: 'Password',
    }
}

export default Translates