    /** Snippet that could be useful. 
     * 
     * 
     * Loop through ability scores, and add their modifiers to our sheet output.
    for (let [key, ability] of Object.entries(systemData.abilities)) {
      // Calculate the modifier using d20 rules.
      ability.mod = Math.floor((ability.value - 10) / 2); 

    // Originally in actor.mjs in the _getCharacterRollData function.
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


    //from actor-sheet
    // Append to spells.
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
    
      else if (i.type === 'spell') {
        if (i.system.spellLevel != undefined) {
          spells[i.system.spellLevel].push(i);
        }
      }



      //removed templates
      "spell": {
        "templates": ["base"],
        "spellLevel": 1
      },

      "item": {
      "templates": ["base"],
      "quantity": 1,
      "weight": 0,
      "formula": "d20 + @str.mod + ceil(@lvl / 2)"
    },
    "feature": {
      "templates": ["base"]
    },

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
      }, myDialogOptions).render(true)

    */