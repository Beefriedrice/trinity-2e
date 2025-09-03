class SimpleDiceRoller {
  static _createDiceTableHtmlOneCell(diceRoll, isLast, targetNumber) {
    let s = [];
    s.push(
      '<li data-dice-type="10" data-target-number="', targetNumber, '" data-dice-roll="',
      diceRoll,
      '"'
    );

    if (diceRoll == 1) {
      s.push(' class="sdr-col1">');

      s.push(
        '<i class="df-d',
        10,
        "-",
        10,
        '" data-dice-type="',
        10,
        '" data-dice-roll="1"></i>'
      );
      s.push("Target - ", targetNumber);

    } else if (isLast) {
      s.push(' class="sdr-lastcol">' + diceRoll);
    } else {
      s.push(">" + diceRoll);
    }
    s.push("</li>");

    return s.join("");
  }

  static _createDiceTableHtmlOneLine(targetNumber) {
    let s = [];

    s.push("<ul>");

    for (let i = 1; i <= 10; ++i) {
      let isLast = i == 10;
      s.push(this._createDiceTableHtmlOneCell(i, isLast, targetNumber));
    }

    s.push("</ul>");

    return s.join("");
  }

  static _createDiceTableHtml() {
    let s = [];

    s.push(this._createDiceTableHtmlOneLine(7));
    s.push(this._createDiceTableHtmlOneLine(8));

    return s.join("");
  }

  static async _createDiceTable(html) {

    const tableContentsHtml = this._createDiceTableHtml();

    const tableContents = $(tableContentsHtml);

    html.find("ul").remove();

    html.append(tableContents);

    html.find("li").click((ev) => this._rollDice(ev, html));
  }

  static async _rollDice(event, html) {

    var diceRoll = event.target.dataset.diceRoll;
    var targetNumber = event.target.dataset.targetNumber;
    //diceRoller(diceRoll, targetNumber, 0);

    var formula = diceRoll + "d10x=10cs>=" + targetNumber;

    let r = new Roll(formula);

    r.toMessage({
      user: game.user._id,
    }); 

    const $popup = $(".simple-dice-roller-popup");
    $popup.hide();
  }

}

Hooks.on("renderSceneControls", () => {
  if (
    !document.querySelector(
      "#scene-controls-layers button[data-control='simple-dice-roller']"
    )
  ) {
    document.querySelector("#scene-controls-layers").insertAdjacentHTML(
      "beforeend",
      `<li>
            <button type="button" class="control ui-control icon fas fa-dice-d10" role="tab" data-action="simple-dice-roller" data-control="simple-dice-roller" data-tooltip="Dice Table" aria-controls="scene-controls-tools"></button>
            <ol class="sub-controls app control-tools sdr-sub-controls">
                <li id="SDRpopup" class="simple-dice-roller-popup control-tool">
                </li>
            </ol>
        </li>
        `
    );

    // Always use jQuery to select the popup
    const $popup = $(".simple-dice-roller-popup");
    SimpleDiceRoller._createDiceTable($popup);
    $popup.hide();

    document
      .querySelector(
        "#scene-controls-layers button[data-control='simple-dice-roller']"
      )
      .addEventListener("click", (ev) => {
        const $popup = $(".simple-dice-roller-popup");
        // Toggle display between none and block
        if ($popup.is(":visible")) {
          $popup.hide();
        } else {
          $popup.show();
        }
      });
  }
});


//Failed dice roller function current work in progress.  The function works, my exporting it so far has not.
export async function diceRoller (quantity, target_number = 8, enhancement = 0) {
     
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
};