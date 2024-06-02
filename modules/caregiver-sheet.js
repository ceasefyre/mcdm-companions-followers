// module/applications/actor/character-sheet.mjs
import ActorSheet5eCharacter from "../../../systems/dnd5e/module/applications/actor/character-sheet.mjs";

export default class MCDMCaregiver5eSheet extends ActorSheet5eCharacter {
    get template() {
        console.log("Open Caregiver Character Sheet")
        return 'modules/mcdm-companions-followers/templates/caregiver-sheet.html';
    }

    _onSheetAction(event){
        console.log("ENTER")
        event.preventDefault();
        const button = event.currentTarget;
        if(button.dataset.action === "rollferocity"){
            this.actor.rollFerocity();
            return;
        }
        super._onSheetAction(event);
    }
}

Hooks.on("renderMCDMCaregiver5eSheet", (app, html) => {

    const companionID = app.actor.getFlag("mcdm-companions-followers","companion");
    const companion = companionID ? game.actors.get(companionID) : null;

    const htmlElementCompanion = `
<div class="form-group">
	<label>Companion: ${companion ? companion.data.name : "No Companion"}</label>
</div>`;
    html.find(".traits .form-group").first().before(htmlElementCompanion);
});
