// import ActorSheet5eCharacter from "../../systems/dnd5e/module/actor/sheets/character.js";
import ActorSheet5e from '../../../systems/dnd5e/module/actor/sheets/character.js';

export default class MCDMCaregiver5eSheet extends ActorSheet5e {
    get template() {
        console.log("Open Caregiver Character Sheet")
        return super.template;
    }
}


Hooks.on("renderMCDMCaregiver5eSheet", (app, html) => {

    const companionID = app.actor.getFlag("mcdm-companions-followers","companion");
    const companion = companionID ? game.actors.get(companionID) : null;

    const htmlElemenetFerocity =`
<li class="attribute ferocity">
    <h4 class="attribute-name box-title rollable" data-action="rollFerocity">Ferocity</h4>
    <div class="attribute-value">
        <input name="data.ferocity" type="text" data-dtype="Number" placeholder="0" value="${app.actor.data.data.ferocity || 0}">
    </div>
</li>`;
    html.find(".attribute + .initiative").last().after(htmlElemenetFerocity);


    const htmlElementCompanion = `
<div class="form-group">
	<label>Companion: ${companion ? companion.data.name : "No Companion"}</label>
</div>`;
    html.find(".traits .form-group").first().before(htmlElementCompanion);
});
