/**
 * Extend the base Actor document by defining a custom roll data structure which is ideal for the Simple system.
 * @extends {Actor}
 */
export class TrinityContinuumActor extends Actor {
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
    const flags = actorData.flags.trinitycontinuum || {};

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
    if (actorData.type !== 'sgc') {
      systemData.health.total.max = systemData.health.bruised.max + systemData.health.injured.max + systemData.health.maimed.max + systemData.health.hard.max;
    }

    // Make separate methods for each Actor type (character, npc, etc.) to keep
    // things organized.

    this._prepareBaselineData(actorData);
    this._prepareNovaData(actorData);
    this._preparePsionData(actorData);
    this._prepareSGCData(actorData);
    this._prepareTalentData(actorData);
  }


  _prepareBaselineData(actorData) {
    if (actorData.type !== 'baseline') return;

    const systemData = actorData.system;
  }

  _prepareNovaData(actorData) {
    if (actorData.type !== 'nova') return;

    // Make modifications to data here. For example:
    const systemData = actorData.system;

    //Calculate quantum points based on quantum rating.
    systemData.traits.quantumpoints.max = systemData.traits.quantum.value * 5 + 10;
    
  }

  _preparePsionData(actorData) {
    if (actorData.type !== 'psion') return;

    const systemData = actorData.system;
  }

  _prepareSGCData(actorData) {
    if (actorData.type !== 'sgc') return;

    const systemData = actorData.system;
  }

  _prepareTalentData(actorData) {
    if (actorData.type !== 'talent') return;

    const systemData = actorData.system;
  }

  /**
   * Override getRollData() that's supplied to rolls.
   */
  getRollData() {
    // Starts off by populating the roll data with a shallow copy of `this.system`
    const data = { ...this.system };

    // Prepare character roll data.
    this._getBaselineRollData(data);
    this._getNovaRollData(data);
    this._getPsionRollData(data);
    this._getSGCRollData(data);
    this._getTalentRollData(data);

    return data;
  }

  /**
   * Prepare baseline roll data.
   */
  _getBaselineRollData(data) {
    if (this.type !== 'baseline') return;

  }

  /**
   * Prepare Nova roll data.
   */
  _getNovaRollData(data) {
    if (this.type !== 'nova') return;

    data.quantum = data.traits.quantum.value ?? 1;
  }

  /**
   * Prepare Psion roll data.
   */
  _getPsionRollData(data) {
    if (this.type !== 'psion') return;

  }

  /**
   * Prepare SGC roll data.
   */
  _getSGCRollData(data) {
    if (this.type !== 'sgc') return;

  }

   /**
   * Prepare Talent roll data.
   */
  _getTalentRollData(data) {
    if (this.type !== 'talent') return;

  }
}
