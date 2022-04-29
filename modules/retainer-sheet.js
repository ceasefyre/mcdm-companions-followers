import ActorSheet5eNPC from '../../../systems/dnd5e/module/actor/sheets/npc.js';
import ActorSheet5e from '../../../systems/dnd5e/module/actor/sheets/base.js';

// export default class MCDMRetainer5eSheet extends ActorSheet5e {
export default class MCDMRetainer5eSheet extends ActorSheet5eNPC {
    static get defaultOptions () {
        return super.defaultOptions;
    }

    get template() {
		return 'modules/mcdm-companions-followers/templates/retainer-sheet.html';
    }

}
