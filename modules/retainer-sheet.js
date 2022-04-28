import ActorSheet5eNPC from '../../../systems/dnd5e/module/actor/sheets/npc.js';
import ActorSheet5e from '../../../systems/dnd5e/module/actor/sheets/base.js';

// export default class MCDMRetainer5eSheet extends ActorSheet5e {
export default class MCDMRetainer5eSheet extends ActorSheet5eNPC {
    // static get defaultOptions () {
    //     return mergeObject(super.defaultOptions, {
    //         classes: ['mcdm-companions-followers', 'retainer', 'npc'],
	// 		scrollY: ['form'],
	// 		width: 340,
	// 		height: 415
    //     });
    // }

    get template() {
        console.log("Open Retainer Character Sheet")
		return 'modules/mcdm-companions-followers/templates/retainer-sheet.html';
    }

    // _prepareItems () {

	// }
}


Hooks.on("renderMCDMRetainer5eSheet", (app, html) => {

});
