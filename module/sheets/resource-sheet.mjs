/**
 * @extends {FormApplication}
 * 
 * 
 */


export default class TrinitySecondEditionResourceSheet extends Application {
    constructor(object = {}, options = {}) {
        super({
            template: "systems/trinity-2e/templates/other/resource-sheet.hbs",
            popOut: false,
        });
    }


    getData() {
        //Get current value
        let groupResources = { momentum: game.settings.get('trinity-2e', 'momentum'), collateral: game.settings.get('trinity-2e', 'collateral'), atmosphere: game.settings.get('trinity-2e', 'atmosphere') };

        return {
            groupResources
        }
    }

    syncData() {
        game.socket.emit('system.trinity-2e', 'plus');
    }

    activateListeners(html) {
        html.find('.plus').click(async (event) => {
            const type = event.currentTarget.dataset.type;
            var currentResource = game.settings.get('trinity-2e', type) || 0;
            if (type === 'atmosphere' && currentResource < 3) {
                currentResource++;
                await game.settings.set('trinity-2e', type, currentResource);
            } else if (type !== 'atmosphere') {
                currentResource++;
                await game.settings.set('trinity-2e', type, currentResource);
            }
            
            game.socket.emit('system.trinity-2e', 'plus');
            this.syncData();
            this.render();
        });

        html.find('.minus').click(async (event) => {
            const type = event.currentTarget.dataset.type;
            var currentResource = game.settings.get('trinity-2e', type) || 0;
            if ((currentResource > 0) && (type !== "atmosphere")) {
                currentResource --;
                await game.settings.set('trinity-2e', type, currentResource);
            } else if (currentResource > -3 && type === 'atmosphere') {
                currentResource --;
                await game.settings.set('trinity-2e', type, currentResource);
            }
            game.socket.emit('trinity-2e', 'minus');
            this.render();
        });

        game.socket.on('system.trinity-2e', (message) => {
            console.log(message);
            this.render();
        });

        html.find('.setting-control').click(() => {
            $(".resource-listing").toggle();
        });
    }
}