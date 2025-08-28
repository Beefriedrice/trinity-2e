export function registerSettings() {
    game.settings.register('trinity-2e', 'momentum', {
        name: game.i18n.localize('TRINITY_SECOND.Momentum'),
        hint: "Track momentum dice.",
        default: 0,
        scope: 'world',
        type: Number,
        config: false
    });

    game.settings.register('trinity-2e', 'collateral', {
        name: game.i18n.localize('TRINITY_SECOND.Collateral'),
        hint: "Tracks collateral dice.",
        scope: "world",
        type: Number,
        config: false
    });
}