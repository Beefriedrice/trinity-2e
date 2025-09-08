export function registerSettings() {
    game.settings.register('trinity-continuum', 'momentum', {
        name: game.i18n.localize('TC.Momentum'),
        hint: "Track momentum dice.",
        default: 0,
        scope: 'world',
        type: Number,
        config: false
    });

    game.settings.register('trinity-continuum', 'collateral', {
        name: game.i18n.localize('TC.Collateral'),
        hint: "Tracks collateral dice.",
        default: 0,
        scope: "world",
        type: Number,
        config: false
    });

    game.settings.register('trinity-continuum', 'atmosphere', {
        name: game.i18n.localize('TC.Atmosphere'),
        hint: "Tracks current atmosphere.",
        default: 0,
        scope: "world",
        type: Number,
        config: false
    });
}