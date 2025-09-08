/**
 * Extend the basic Item with some very simple modifications.
 * @extends {Item}
 */
export class TrinityContinuumItem extends Item {
  /**
   * Augment the basic Item data model with additional dynamic data.
   */
  prepareData() {
    // As with the actor class, items are documents that can have their data
    // preparation methods overridden (such as prepareBaseData()).
    super.prepareData();
    
    if (!this.img || this.img === 'icons/svg/item-bag.svg') {
      let type = this.type;
      let img = 'icons/svg/item-bag.svg';
      
      if(type === "armor"){
        img = 'icons/svg/statue.svg';
      }
      else if(type === "bond"){
        img = 'icons/svg/heal.svg';
      }
      else if(type === "contact"){
        img = 'icons/svg/mystery-man.svg';
      }
      else if(type === "edge"){
        img = 'icons/svg/up.svg';
      }
      else if(type === "equipment"){
        img = 'icons/svg/chest.svg';
      }
      else if(type === "gift"){
        img = 'icons/svg/aura.svg';
      }
      else if(type === "injury"){
        img = 'icons/svg/bones.svg';
      }
      else if(type === "megaedge"){
        img = 'icons/svg/upgrade.svg';
      }
      else if(type === "path"){
        img = 'icons/svg/walk.svg';
      }
      else if(type === "quantumpower"){
        img = 'icons/svg/lightning.svg';
      }
      else if(type === "skilltrick"){
        img = 'icons/svg/card-hand.svg';
      }
      else if(type === "specialty"){
        img = 'icons/svg/light.svg';
      }
      else if(type === "status"){
        img = 'icons/svg/stoned.svg';
      }
      else if(type === "transformation"){
        img = 'icons/svg/radiation.svg';
      }
      else if(type === "vehicle"){
        img = 'icons/svg/anchor.svg';
      }
      else if(type === "weapon"){
        img = 'icons/svg/sword.svg';
      }
      this.img = img;
    }
  }

  /**
   * Prepare a data object which defines the data schema used by dice roll commands against this Item
   * @override
   */
  getRollData() {
    // Starts off by populating the roll data with a shallow copy of `this.system`
    const rollData = { ...this.system };

    // Quit early if there's no parent actor
    if (!this.actor) return rollData;

    // If present, add the actor's roll data
    rollData.actor = this.actor.getRollData();

    return rollData;
  }

  /**
   * Handle clickable rolls.
   * @param {Event} event   The originating click event
   * @private
   */
  async roll() {
    const item = this;

    // Initialize chat data.
    const speaker = ChatMessage.getSpeaker({ actor: this.actor });
    const rollMode = game.settings.get('core', 'rollMode');
    const label = `[${item.type}] ${item.name}`;

    // If there's no roll data, send a chat message.
    if (!this.system.formula) {
      ChatMessage.create({
        speaker: speaker,
        rollMode: rollMode,
        flavor: label,
        content: item.system.description ?? '',
      });
    }
    // Otherwise, create a roll and send a chat message from it.
    else {
      // Retrieve roll data.
      const rollData = this.getRollData();

      // Invoke the roll and submit it to chat.
      const roll = new Roll(rollData.formula, rollData);
      // If you need to store the value first, uncomment the next line.
      // const result = await roll.evaluate();
      roll.toMessage({
        speaker: speaker,
        rollMode: rollMode,
        flavor: label,
      });
      return roll;
    }
  }
}
