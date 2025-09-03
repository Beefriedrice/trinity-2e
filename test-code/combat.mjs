//import { trinityRoll } from "/systems/trinity/module/trinity-roll.js";
// import { setFocusName } from "/systems/trinity/module/combat/focus-dialog.js";

export class TrinitySecondEditionCombat extends Combat
{

  async startCombat() {

    // Group Initiative
    console.log("combat this", this);
    await this._setGroups();

    return this.update({round: 1, turn: 1});
  }

  async nextRound() {
    
    // Group Init stuff here:
    await this._setGroups();

    super.nextRound();
  }

  async previousRound() {
    
    // Group Init stuff here:
    await this._setGroups();

    super.previousRound();
  }

  async _setGroups() {
    let updates = {};
    updates = this.data.combatants.map(c => { return this._hasPlayer(c) });
    await this.updateEmbeddedDocuments("Combatant", updates);
  }

  _hasPlayer(c) {
    console.log("combat c:", c);
    if (c.token?.data?.disposition === 1) {
      return { _id: c.id, img: "systems/trinity-2e/assets/combat/team-friendly.png", name: "Friendly" };
    }
    else if (c.token?.data?.disposition === 0) {
      return { _id: c.id, img: "systems/trinity-2e/assets/combat/team-neutral.png", name: "Neutral" };
    }
    else {
      return { _id: c.id, img: "systems/trinity-2e/assets/combat/team-hostile.png", name: "Hostile" };
    }
  }

  async rollInitiative() {
    super.rollInitiative();
  }
}

  /*
  async rollInitiative(ids, {formula=null, updateTurn=true, messageOptions={}}={})
  {
    // Structure input data
    ids = typeof ids === "string" ? [ids] : ids;
    const currentId = this.combatant?.id;
    const rollMode = messageOptions.rollMode || game.settings.get("core", "rollMode");

    let updates = [];
    // for(const id of ids)
    for ( let [i, id] of ids.entries() )
    {
      const combatant = this.combatants.get(id);
      if ( !combatant?.isOwner ) return results;

      

      // Actors w/ an initiative roll selected
        
        //combatant.actor.data.data.savedRolls[combatant.actor.data.data.linkedRolls.initiative];
        
        let rollFormula = CONFIG.Combat.initiative.formula;
        

        // const roll = game.trinity.TRoll.create(rollFormula, {}, {}, p.enha.value);
        let roll = new Roll(rollFormula);
        await roll.evaluate({async: true});

        updates.push({
          _id: id,
          initiative: roll.total
        });

        roll.toMessage({
          speaker: ChatMessage.getSpeaker({ actor: this.actor }),
          content: `${await roll.render()}`
        });

    }
    if ( !updates.length ) return this;

    console.log("COMBAT THIS:", this);
    await this.updateEmbeddedDocuments("Combatant", updates);

    // Ensure the turn order remains with the same combatant
    if ( updateTurn && currentId ) {
      await this.update({turn: this.turns.findIndex(t => t.id === currentId)});
    }

    return this;
  }

} */

/*
export async function giveFocus(c) {
  let dispo = c.token?.data?.disposition;
  let actorName = "Temp Test Value";
  let updates = {};
  // Create Dialog Here, return selected actor
  setFocusName(c);
  // let actorName = new Dialog(info);
  // c.data.name = actorName;
  // updates = game.combat.data.combatants.set(c.id, c).map(c => { return c });
  // updates = game.combat.data.combatants.set(c.id, c).map(c => { return {_id: c.id} });

-----------------
  updates = game.combat.data.combatants.map(cb => {
    let newName = ( cb.id === c._id ) ? actorName : cb.data.name;
    // if ( cb.id === c._id ) { cb.data.name = actorName; }
    return { _id: cb.id, name: newName };
  });

  // { _id: c.id, name: actorName }
  console.log(game.combat.data.combatants.set(c.id, c));
  console.log(game.combat.data.combatants);
  console.log(updates);
  console.log(game.combat.data.combatants.map(c => { return c }));
  await game.combat.updateEmbeddedDocuments("Combatant", updates);
---------------
}
*/