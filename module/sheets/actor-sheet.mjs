import {
  onManageActiveEffect,
  prepareActiveEffectCategories,
} from '../helpers/effects.mjs';


/**
 * Extend the basic ActorSheet with some very simple modifications
 * @extends {ActorSheet}
 */
export class TrinitySecondEditionActorSheet extends ActorSheet {
  /** @override */
  static get defaultOptions() {
    return foundry.utils.mergeObject(super.defaultOptions, {
      classes: ['trinity-2e', 'sheet', 'actor'],
      width: 750,
      height: 850,
      tabs: [
        {
          navSelector: '.sheet-tabs',
          contentSelector: '.sheet-body',
          initial: 'stats',
        },
        { 
          navSelector: '.attribute-sheet-tabs',
          contentSelector: '.attribute-sheet-body',
          intiial: 'attributes'
        },
        { 
          navSelector: '.background-sheet-tabs',
          contentSelector: '.background-sheet-body',
          intiial: 'paths'
        },
        { 
          navSelector: '.gear-sheet-tabs',
          contentSelector: '.gear-sheet-body',
          intiial: 'weapons'
        },
        { 
          navSelector: '.power-sheet-tabs',
          contentSelector: '.power-sheet-body',
          intiial: 'skilltricks'
        },
        { 
          navSelector: '.status-sheet-tabs',
          contentSelector: '.status-sheet-body',
          intiial: 'health'
        }
      ],
    });
  }

  /** @override */
  get template() {
    return `systems/trinity-2e/templates/actor/actor-${this.actor.type}-sheet.hbs`;
  }

  /* -------------------------------------------- */

  /** @override */
  async getData() {
    // Retrieve the data structure from the base sheet. You can inspect or log
    // the context variable to see the structure, but some key properties for
    // sheets are the actor object, the data object, whether or not it's
    // editable, the items array, and the effects array.
    const context = super.getData();

    // Use a safe clone of the actor data for further operations.
    const actorData = this.document.toObject(false);

    // Add the actor's data to context.data for easier access, as well as flags.
    context.system = actorData.system;
    context.flags = actorData.flags;

    // Adding a pointer to CONFIG.TRINITY_SECOND
    context.config = CONFIG.TRINITY_SECOND;

    // Prepare character data and items.
    if (actorData.type == 'character') {
      this._prepareItems(context);
      this._prepareCharacterData(context);
    }

    // Prepare nova data and items.
    if (actorData.type == 'nova') {
      this._prepareItems(context);
      this._prepareNovaData(context);
    }

    // Prepare NPC data and items.
    if (actorData.type == 'npc') {
      this._prepareItems(context);
    }

    // Enrich biography info for display
    // Enrichment turns text like `[[/r 1d20]]` into buttons
    context.enrichedBiography = await TextEditor.enrichHTML(
      this.actor.system.biography,
      {
        // Whether to show secret blocks in the finished html
        secrets: this.document.isOwner,
        // Necessary in v11, can be removed in v12
        async: true,
        // Data to fill in for inline rolls
        rollData: this.actor.getRollData(),
        // Relative UUID resolution
        relativeTo: this.actor,
      }
    );

    // Prepare active effects
    context.effects = prepareActiveEffectCategories(
      // A generator that returns all effects stored on the actor
      // as well as any items
      this.actor.allApplicableEffects()
    );

    return context;
  }

  /**
   * Character-specific context modifications
   *
   * @param {object} context The context object to mutate
   */
  _prepareCharacterData(context) {
    // This is where you can enrich character-specific editor fields
    // or setup anything else that's specific to this type
  }

  _prepareNovaData(context) {
    // This is where you can enrich character-specific editor fields
    // or setup anything else that's specific to this type
  }

  /**
   * Organize and classify Items for Actor sheets.
   *
   * @param {object} context The context object to mutate
   */
  _prepareItems(context) {
    // Initialize containers.
    const armor = [];
    const bond = [];
    const contact = [];
    const edge = [];
    const equipment = [];
    const features = [];
    const gear = [];
    const gift = [];
    const injury = [];
    const megaedge = [];
    const path = [];
    const quantumpower = {
      0: [],
      1: [],
      2: [],
      3: [],
    };
    const skilltrick = [];
    const specialty = [];
    const spells = {
      0: [],
      1: [],
      2: [],
      3: [],
      4: [],
      5: [],
      6: [],
      7: [],
      8: [],
      9: [],
    };
    const status = [];
    const transformation = [];
    const vehicle = [];
    const weapon = [];
    let injured = 0;
    let bruised = 0;
    let maimed = 0;

    // Iterate through items, allocating to containers
    for (let i of context.items) {
      i.img = i.img || Item.DEFAULT_ICON;
      
      // Append to armor.
      if (i.type === 'armor') {
        armor.push(i);
      }
      //Append to bonds.
      else if (i.type === 'bond') {
        bond.push(i);
      }
      // Append to contacts.
      else if (i.type === 'contact') {
        contact.push(i);
      }
      // Append to equipment.
      else if (i.type === 'equipment') {
        equipment.push(i);
      }
      // Append to edges.
      else if (i.type === 'edge') {
        edge.push(i);
      }
      // Append to features.
      else if (i.type === 'feature') {
        features.push(i);
      }
      // Append to gear.
      else if (i.type === 'item') {
        gear.push(i);
      }
      // Append to gift.
      else if (i.type === 'gift') {
        gift.push(i);
      }
      // Append to injury.
      else if (i.type === 'injury') {
        injury.push(i);
        if (i.system.wound === 'Bruised' || i.system.wound === 'bruised') {
          bruised += 1;
        } else if (i.system.wound === 'Injured' || i.system.wound === 'injured') {
          injured += 1;
        } else if (i.system.wound === 'Maimed' || i.system.wound === 'maimed') {
          maimed += 1;
        }
      }
      // Append to mega-edges.
      else if (i.type === 'megaedge') {
        megaedge.push(i);
      }
      // Append to paths.
      else if (i.type === 'path') {
        path.push(i);
      }
      // Append to quantum powers.
      else if (i.type === 'quantumpower') {
        if (i.system.suite >= 1 && i.system.suite <= 3) {
          quantumpower[i.system.suite].push(i)
        } else {
          quantumpower[0].push(i)
        }
      }
      // Append to skill tricks.
      else if (i.type === 'skilltrick') {
        skilltrick.push(i);
      }
      // Append to specialties
      else if (i.type === 'specialty') {
        specialty.push(i);
      }
      // Append to spells.
      else if (i.type === 'spell') {
        if (i.system.spellLevel != undefined) {
          spells[i.system.spellLevel].push(i);
        }
      }
      // Append to status.
      else if (i.type === 'status') {
        status.push(i);
      }
      // Append to transformation
      else if (i.type === 'transformation') {
        transformation.push(i);
      }
      // Append to vehicle.
      else if (i.type === 'vehicle') {
        vehicle.push(i);
      }
      // Append to weapon.
      else if (i.type === 'weapon') {
        weapon.push(i);
      }
    }

    // Assign and return
    context.system.health.bruised.filled = bruised;
    context.system.health.injured.filled = injured;
    context.system.health.maimed.filled = maimed;
    context.armor = armor;
    context.bond = bond;
    context.contact = contact;
    context.edge = edge;
    context.equipment = equipment;
    context.features = features;
    context.gear = gear;
    context.gift = gift;
    context.injury = injury;
    context.megaedge = megaedge;
    context.path = path;
    context.quantumpower = quantumpower;
    context.skilltrick = skilltrick;
    context.specialty = specialty;
    context.spells = spells;
    context.status = status;
    context.transformation = transformation;
    context.vehicle = vehicle;
    context.weapon = weapon;
  }

  /* -------------------------------------------- */

  /** @override */
  activateListeners(html) {
    super.activateListeners(html);
    
    // Render the item sheet for viewing/editing prior to the editable check.
    html.on('click', '.item-edit', (ev) => {
      const li = $(ev.currentTarget).parents('.item');
      const item = this.actor.items.get(li.data('itemId'));
      item.sheet.render(true);
    });

    $(document).ready(() => {
      $('.power-settings').hide();
    });

    html.on('click', '.power-button', () => {
      $('.power-settings').toggle();
    });

    /** html.on('keyup', '.suiteqty', (ev) => {
      const number = $(ev.currentTarget).val();
      for (let i = 0; i <= number; i++) {
        this.actor.system.nova.powersuites
      }
      
    }); */


    //Failed attempt to make checking a box update a value.

    //html.on('click', '.checkbox', (ev) => {
    //  const boxName = ev.currentTarget;
    //  const targetValue = boxName.dataset.checkbox;
    //  ui.information.info(targetValue);
    //}); 

    /**  Having trouble exporting this function while trying to get it to work.
    async function diceRoller (quantity, enhancement) {
    //target number for roll.
    let target_number = 7;

    let rollText = quantity + "d10x=10cs>=" + target_number;

    let theRoll = new Roll(rollText);

    await theRoll.evaluate();

    let diceRoll = theRoll.dice[0].results;
    let total = theRoll.total;
    let getDice = `<div class="message-content">
    <div class="dice-roll expanded" data-action="expandRoll">
    <div class="dice-result">
    <div class="dice-formula">${theRoll.formula}</div>
    <div class=dice-tooltip>
    <div class="wrapper">
    <section class="tooltip-part">
    <div class="dice">
    <header class="part-header flexrow">
    <span class="part-formula">${theRoll.formula}</span>
    <span class="part-total" ${theRoll.total}</span>
    </header>
    <ol class="dice-rolls">`
    for (let dice of diceRoll.sort((a, b) => a>b)) {
        getDice += `<li class="roll die d10`
        if (dice.result >= target_number) {
            getDice += ` success`;
            if (dice.result === 10) {
                getDice += ` exploded`;
            };
        };
        getDice += `">${dice.result}</li>`;
    }
    getDice += `</ol></div></section></div></div>`;
    getDice += `<h4 class="dice-total">${total}</h4>`;
    if (total > 0) {
        total += enhancement;
        getDice += `<h4 class="dice-total">${total} with Enhancement</h4>`;
    }
    getDice += `</div></div></div>`;
    ChatMessage.create({
        user: game.user._id,
        content: getDice,
    });
    }*/

    // Chaos and experimentation.
    html.on('click', '.skill', () => {
      //const skillValue = $(event.currentTarget).next.value
      
     //diceRoller(4, 3);
      
      /*const myDialogOptions = {
        width: 200,
        height: 200,
        top: 500,
        left: 500
      }
      let myContent = `<div>`;
      myContent += test;
      myContent += `</div><div>`;
      myContent += `{{` + skillName + `}}`;
      myContent += `</div>`;
      const myDialog = new Dialog({
        title: "test",
        content: myContent,
        buttons: {
          button1: {
            label: '1 die',
            callback: () => {
              
            },
            icon: `<i class="fas fa-dice-d6></i>`
          }
        }
      }, myDialogOptions).render(true)*/
    });

    // -------------------------------------------------------------
    // Everything below here is only needed if the sheet is editable
    if (!this.isEditable) return;

    // Add Inventory Item
    html.on('click', '.item-create', this._onItemCreate.bind(this));

    // Delete Inventory Item
    html.on('click', '.item-delete', (ev) => {
      const li = $(ev.currentTarget).parents('.item');
      const item = this.actor.items.get(li.data('itemId'));
      item.delete();
      li.slideUp(200, () => this.render(false));
    });

    // Active Effect management
    html.on('click', '.effect-control', (ev) => {
      const row = ev.currentTarget.closest('li');
      const document =
        row.dataset.parentId === this.actor.id
          ? this.actor
          : this.actor.items.get(row.dataset.parentId);
      onManageActiveEffect(ev, document);
    });

    // Rollable abilities.
    html.on('click', '.rollable', this._onRoll.bind(this));

    // Drag events for macros.
    if (this.actor.isOwner) {
      let handler = (ev) => this._onDragStart(ev);
      html.find('li.item').each((i, li) => {
        if (li.classList.contains('inventory-header')) return;
        li.setAttribute('draggable', true);
        li.addEventListener('dragstart', handler, false);
      });
    }
  }

  /**
   * Handle creating a new Owned Item for the actor using initial data defined in the HTML dataset
   * @param {Event} event   The originating click event
   * @private
   */
  async _onItemCreate(event) {
    event.preventDefault();
    const header = event.currentTarget;
    // Get the type of item to create.
    const type = header.dataset.type;
    // Grab any data associated with this control.
    const data = duplicate(header.dataset);
    // Initialize a default name.
    const name = `New ${type.capitalize()}`;
    // Prepare the item object.
    const itemData = {
      name: name,
      type: type,
      system: data,
    };
    // Remove the type from the dataset since it's in the itemData.type prop.
    delete itemData.system['type'];

    // Finally, create the item!
    return await Item.create(itemData, { parent: this.actor });
  }

  /**
   * Handle clickable rolls.
   * @param {Event} event   The originating click event
   * @private
   */
  _onRoll(event) {
    event.preventDefault();
    const element = event.currentTarget;
    const dataset = element.dataset;

    // Handle item rolls.
    if (dataset.rollType) {
      if (dataset.rollType == 'item') {
        const itemId = element.closest('.item').dataset.itemId;
        const item = this.actor.items.get(itemId);
        if (item) return item.roll();
      }
    }

    //If the caller is an attribute
    if (dataset.attribute) {
      dataset.roll = dataset.attribute + "d10x=10cs>=8";
    }

    // Handle rolls that supply the formula directly.
    if (dataset.roll) {
      let label = dataset.label ? `[ability] ${dataset.label}` : '';
      let roll = new Roll(dataset.roll, this.actor.getRollData());
      roll.toMessage({
        speaker: ChatMessage.getSpeaker({ actor: this.actor }),
        flavor: label,
        rollMode: game.settings.get('core', 'rollMode'),
      });
      return roll;
    }
  }
}
