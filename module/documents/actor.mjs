/**
 * Extend the base Actor document by defining a custom roll data structure which is ideal for the Simple system.
 * @extends {Actor}
 */
export class TrinitySecondEditionActor extends Actor {
  /** @override */
  prepareData() {
    // Prepare data for the actor. Calling the super version of this executes
    // the following, in order: data reset (to clear active effects),
    // prepareBaseData(), prepareEmbeddedDocuments() (including active effects),
    // prepareDerivedData().
    super.prepareData();
  }

  /** @override */
  prepareBaseData() {
    // Data modifications in this step occur before processing embedded
    // documents or derived data.
  }

  /**
   * @override
   * Augment the actor source data with additional dynamic data. Typically,
   * you'll want to handle most of your calculated/derived data in this step.
   * Data calculated in this step should generally not exist in template.json
   * (such as ability modifiers rather than ability scores) and should be
   * available both inside and outside of character sheets (such as if an actor
   * is queried and has a roll executed directly from it).
   */
  prepareDerivedData() {
    const actorData = this;
    const systemData = actorData.system;
    const flags = actorData.flags.trinity2e || {};

    // Prepare experience formulas
    systemData.experience.current = systemData.experience.total - systemData.experience.spent;

    // prepare derived health boxes
    if (systemData.attributes.sta.value >= 3) {
      systemData.health.bruised.stamina = 1;
    }
    if (systemData.attributes.sta.value >= 5) {
      systemData.health.injured.stamina = 1;
    }

    //calculate total of each wound type.
    systemData.health.bruised.max = systemData.health.bruised.base + systemData.health.bruised.stamina + systemData.health.bruised.added;
    systemData.health.injured.max = systemData.health.injured.base + systemData.health.injured.stamina + systemData.health.injured.added;
    systemData.health.maimed.max = systemData.health.maimed.base + systemData.health.maimed.stamina + systemData.health.maimed.added;

    //create a total health for token usage.
    systemData.health.total.value = systemData.health.bruised.value + systemData.health.injured.value + systemData.health.maimed.value + systemData.health.hard.value;
    systemData.health.total.max = systemData.health.bruised.max + systemData.health.injured.max + systemData.health.maimed.max + systemData.health.hard.max;

    // Make separate methods for each Actor type (character, npc, etc.) to keep
    // things organized.
    this._prepareCharacterData(actorData);
    this._prepareNovaData(actorData);
    this._prepareNpcData(actorData);
  }

  /**
   * Prepare Character type specific data
   */
  _prepareCharacterData(actorData) {
    if (actorData.type !== 'character') return;

    // Make modifications to data here. For example:
    const systemData = actorData.system;

    // Loop through ability scores, and add their modifiers to our sheet output.
    for (let [key, ability] of Object.entries(systemData.abilities)) {
      // Calculate the modifier using d20 rules.
      ability.mod = Math.floor((ability.value - 10) / 2);
    }
  }

  _prepareNovaData(actorData) {
    if (actorData.type !== 'nova') return;

    // Make modifications to data here. For example:
    const systemData = actorData.system;

    //Calculate quantum points based on quantum rating.
    systemData.traits.quantumpoints.max = systemData.traits.quantum.value * 5 + 10;
  }

  /**
   * Prepare NPC type specific data.
   */
  _prepareNpcData(actorData) {
    if (actorData.type !== 'npc') return;

    // Make modifications to data here. For example:
    const systemData = actorData.system;
    systemData.xp = systemData.cr * systemData.cr * 100;
  }

  /**
   * Override getRollData() that's supplied to rolls.
   */
  getRollData() {
    // Starts off by populating the roll data with a shallow copy of `this.system`
    const data = { ...this.system };

    // Prepare character roll data.
    this._getCharacterRollData(data);
    this._getNovaRollData(data);
    this._getNpcRollData(data);

    return data;
  }

  /**
   * Prepare character roll data.
   */
  _getCharacterRollData(data) {
    if (this.type !== 'character') return;

    // Copy the ability scores to the top level, so that rolls can use
    // formulas like `@str.mod + 4`.
    if (data.abilities) {
      for (let [k, v] of Object.entries(data.abilities)) {
        data[k] = foundry.utils.deepClone(v);
      }
    }

    // Add level for easier access, or fall back to 0.
    if (data.attributes.level) {
      data.lvl = data.attributes.level.value ?? 0;
    }
  }

  /**
   * Prepare Nova roll data.
   */
  _getNovaRollData(data) {
    if (this.type !== 'nova') return;

    data.quantum = data.traits.quantum.value ?? 1;
  }

  /**
   * Prepare NPC roll data.
   */
  _getNpcRollData(data) {
    if (this.type !== 'npc') return;

    // Process additional NPC data here.
  }
}
