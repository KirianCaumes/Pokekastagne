export const GameConstants = {
    DEFAULT_START_LIFE: 100,
    DEFAULT_AP: 1,
    DEFAULT_MP: 3,
    ONLINE: 'online',
    OFFLINE: 'offline',
    STATUS_AWAIT: 'await',
    STATUS_RUNNING: 'running',
    STATUS_FINISHED: 'finished',

    MAX_PLAYERS: process.env.MAX_PLAYERS || 2,
    SKIP_TIME: 1440, // in minutes

    ACTIONS_WALK: 'walk',
    ACTIONS_ATTACK: 'attack',
    ACTIONS_CATCH: 'catch',
    ACTIONS_SKIP: 'skip'
}
