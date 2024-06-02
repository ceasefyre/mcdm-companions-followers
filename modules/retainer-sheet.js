// module/applications/actor/npc-sheet.mjs
import ActorSheet5eNPC from '../../../systems/dnd5e/module/applications/actor/npc-sheet.mjs';
// module/applications/actor/base-sheet.mjs
import ActorSheet5e from '../../../systems/dnd5e/module/applications/actor/base-sheet.mjs';

import CompanionHitDiceConfig from "./apps/companion-hit-dice-config.js";


// export default class MCDMRetainer5eSheet extends ActorSheet5e {
export default class MCDMRetainer5eSheet extends ActorSheet5eNPC {
	static get defaultOptions () {
		return super.defaultOptions;
	}

	get template() {
		return 'modules/mcdm-companions-followers/templates/retainer-sheet.html';
	}

	activateListeners(html) {
		super.activateListeners(html);
		if ( !this.isEditable ) return;

		// Short and Long Rest
		html.find(".short-rest").click(this._onShortRest.bind(this));
		html.find(".long-rest").click(this._onLongRest.bind(this));
	}
	_onConfigMenu(event) {
		event.preventDefault();
		const button = event.currentTarget;
		if(button.dataset.action === "hit-dice"){
			new CompanionHitDiceConfig(this.object).render(true);
			return;
		}
		super._onConfigMenu(event)
	}

	/* -------------------------------------------- */

	/**
	 * Take a short rest, calling the relevant function on the Actor instance.
	 * @param {Event} event             The triggering click event.
	 * @returns {Promise<RestResult>}  Result of the rest action.
	 * @private
	 */
	async _onShortRest(event) {
		event.preventDefault();
		await this._onSubmit(event);
		return this.actor.shortRest();
	}

	/* -------------------------------------------- */

	/**
	 * Take a long rest, calling the relevant function on the Actor instance.
	 * @param {Event} event             The triggering click event.
	 * @returns {Promise<RestResult>}  Result of the rest action.
	 * @private
	 */
	async _onLongRest(event) {
		event.preventDefault();
		await this._onSubmit(event);
		return this.actor.longRest();
	}
}
