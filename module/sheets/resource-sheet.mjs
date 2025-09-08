/**
 * @extends {FormApplication}
 * 
 * 
 */


export default class TrinityContinuumResourceSheet extends Application {
    constructor(object = {}, options = {}) {
        super({
            template: "systems/trinity-continuum/templates/other/resource-sheet.hbs",
            popOut: false,
        });
    }


    getData() {
        //Get current value
        let groupResources = { momentum: game.settings.get('trinity-continuum', 'momentum'), collateral: game.settings.get('trinity-continuum', 'collateral'), atmosphere: game.settings.get('trinity-continuum', 'atmosphere') };

        return {
            groupResources
        }
    }

    syncData() {
        game.socket.emit('system.trinity-continuum', 'plus');
    }

    activateListeners(html) {
        html.find('.plus').click(async (event) => {
            const type = event.currentTarget.dataset.type;
            var currentResource = game.settings.get('trinity-continuum', type) || 0;
            if (type === 'atmosphere' && currentResource < 3) {
                currentResource++;
                await game.settings.set('trinity-continuum', type, currentResource);
            } else if (type !== 'atmosphere') {
                currentResource++;
                await game.settings.set('trinity-continuum', type, currentResource);
            }
            
            game.socket.emit('system.trinity-continuum', 'plus');
            this.syncData();
            this.render();
        });

        html.find('.minus').click(async (event) => {
            const type = event.currentTarget.dataset.type;
            var currentResource = game.settings.get('trinity-continuum', type) || 0;
            if ((currentResource > 0) && (type !== "atmosphere")) {
                currentResource --;
                await game.settings.set('trinity-continuum', type, currentResource);
            } else if (currentResource > -3 && type === 'atmosphere') {
                currentResource --;
                await game.settings.set('trinity-continuum', type, currentResource);
            }
            game.socket.emit('trinity-continuum', 'minus');
            this.render();
        });

        game.socket.on('system.trinity-continuum', (message) => {
            console.log(message);
            this.render();
        });

        html.find('.setting-control').click(() => {
            $(".resource-listing").toggle();
        });
    }
}