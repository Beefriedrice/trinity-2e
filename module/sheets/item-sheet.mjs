import {
  onManageActiveEffect,
  prepareActiveEffectCategories,
} from '../helpers/effects.mjs';

/**
 * Extend the basic ItemSheet with some very simple modifications
 * @extends {ItemSheet}
 */
export class TrinityContinuumItemSheet extends ItemSheet {
  /** @override */
  static get defaultOptions() {
    return foundry.utils.mergeObject(super.defaultOptions, {
      classes: ['trinity-continuum', 'sheet', 'item'],
      width: 560,
      height: 'auto',
      tabs: [
        {
          navSelector: '.sheet-tabs',
          contentSelector: '.sheet-body',
          initial: 'description',
        },
      ],
    });
  }

  /** @override */
  get template() {
    const path = 'systems/trinity-continuum/templates/item';
    // Return a single sheet for all item types.
    // return `${path}/item-sheet.hbs`;

    // Alternatively, you could use the following return statement to do a
    // unique item sheet by type, like `weapon-sheet.hbs`.
    return `${path}/item-${this.item.type}-sheet.hbs`;
  }

  /* -------------------------------------------- */

  /** @override */
  async getData() {
    // Retrieve base data structure.
    const context = super.getData();

    // Use a safe clone of the item data for further operations.
    const itemData = this.document.toObject(false);

    // Enrich description info for display
    // Enrichment turns text like `[[/r 1d20]]` into buttons
    context.enrichedDescription = await TextEditor.enrichHTML(
      this.item.system.description,
      {
        // Whether to show secret blocks in the finished html
        secrets: this.document.isOwner,
        // Necessary in v11, can be removed in v12
        async: true,
        // Data to fill in for inline rolls
        rollData: this.item.getRollData(),
        // Relative UUID resolution
        relativeTo: this.item,
      }
    );

    // Add the item's data to context.data for easier access, as well as flags.
    context.system = itemData.system;
    context.flags = itemData.flags;

    // Adding a pointer to CONFIG.TC
    context.config = CONFIG.TC;

    // Prepare active effects for easier access
    context.effects = prepareActiveEffectCategories(this.item.effects);

    return context;
  }

  /* -------------------------------------------- */

  /** @override */
  activateListeners(html) {
    super.activateListeners(html);

    // Everything below here is only needed if the sheet is editable
    if (!this.isEditable) return;

    // Roll handlers, click handlers, etc. would go here.

    // Active Effect management
    html.on('click', '.effect-control', (ev) =>
      onManageActiveEffect(ev, this.item)
    );

    html.on('change', '.injury-firstaid', () => {
      //checks what the checkbox was BEFORE the click.
      
      /* Attempting to make injuries automatically downgrade wound conditions when first aid is checked.  Need more knowledge to implement.

      if (this.item.system.firstaid === false) {
        console.log("it worked");
        if (this.item.system.wound === 'Maimed') {
          console.log(this.item.system.wound);
          console.log(this.item.id);
          console.log(this.id);
          const newInjury = [{system: {wound: 'Injured'}}];
          const updated = this.item.update(newInjury);
          console.log(this.item.system.wound);
          console.log(this.item.wound);
        } else if (this.item.system.wound === 'Injured') {
          console.log(this.item.system.wound);
          this.item.system.wound = 'Bruised';
          this.getData();
          console.log(this.item.system.wound);
        }
      } */
    });
  }
}
