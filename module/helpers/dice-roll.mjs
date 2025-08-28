export async function diceRoller (quantity, enhancement) {
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
}