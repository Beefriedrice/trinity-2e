/**
 * Define a set of template paths to pre-load
 * Pre-loaded templates are compiled and cached for fast access when rendering
 * @return {Promise}
 */
export const preloadHandlebarsTemplates = async function () {
  return loadTemplates([
    // Actor partials.
    'systems/trinity-2e/templates/actor/parts/actor-background.hbs',
    'systems/trinity-2e/templates/actor/parts/actor-bonds.hbs',
    'systems/trinity-2e/templates/actor/parts/actor-edges.hbs',
    'systems/trinity-2e/templates/actor/parts/actor-effects.hbs',
    'systems/trinity-2e/templates/actor/parts/actor-equipment.hbs',
    'systems/trinity-2e/templates/actor/parts/actor-features.hbs',
    'systems/trinity-2e/templates/actor/parts/actor-items.hbs',
    'systems/trinity-2e/templates/actor/parts/actor-paths.hbs',
    'systems/trinity-2e/templates/actor/parts/actor-powers.hbs',
    'systems/trinity-2e/templates/actor/parts/actor-skills.hbs',
    'systems/trinity-2e/templates/actor/parts/actor-spells.hbs',
    'systems/trinity-2e/templates/actor/parts/actor-transformations.hbs',
    // Item partials
    'systems/trinity-2e/templates/item/parts/item-attributes.hbs',
    'systems/trinity-2e/templates/item/parts/item-effects.hbs',
  ]);
};
