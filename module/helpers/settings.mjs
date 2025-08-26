export function registerSettings() {
    game.settings.register('trinity-2e', 'momentum', {
        name: game.i18n.localize('TRINITY_SECOND.Momentum'),
        hint: "test",
        default: 0,
        scope: 'world',
        type: Number,
        config: false
    });

    game.settings.register('trinity-2e', 'collateral', {
        name: game.i18n.localize('TRINITY_SECOND.Collateral'),
        hint: 'test',
        scope: 'world',
        type: Number,
        config: false
    });
}