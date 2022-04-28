import ActorSheet5eCharacter from "../../../systems/dnd5e/module/actor/sheets/character.js";
// import ActorSheet5eNPC from '../../../systems/dnd5e/module/actor/sheets/npc.js';

export default class MCDMCompanion5eSheet extends ActorSheet5eCharacter {
    get template(){
        // console.log("Render Beast Companion Sheet")
        // console.log(this.actor.data.data)

        return super.template;
    }


}

Hooks.on("renderMCDMCompanion5eSheet", (app, html) => {
    const selectList = document.createElement("select");
    selectList.id = "mySelect";
    selectList.classList = "actor-size"
    // let playerCharacterArray = [];

    // const currentChar = game.actors.get(app.actor.data.data.caregiver) || "";
    // console.log(app.actor.data.flags)
    const currentChar = game.actors.get(app.actor.data.flags[`mcdm-companions-followers`]?.caregiver) || "";
    let selectOptions = currentChar ? `<option value="${currentChar.id}">${currentChar.name}</option><option value=""></option>` : `<option value=""></option>`;
    
    // const caregivers = game.actors.filter((a) => a.type === "character" && a.testUserPermission(game.user, "OWNER"));
    game.actors.forEach(act => {
        
        if(act.type === "character" && act.testUserPermission(game.user, "OWNER")){
            var option = document.createElement("option");
            option.value = act.id;
            option.text = act.name;
            selectList.appendChild(option);

            selectOptions += `\n<option value="${act.id}">${act.name}</option>`
        }
    });

    // game.i18n.localize("DND5E.")    
	// <select class="actor-size" name="data.caregiver">

    const htmlElementCaregiver = `
<div class="form-group">
	<label>Caregiver</label>
	<select class="actor-size" name="flags.mcdm-companions-followers.caregiver">
			${selectOptions}
	</select>
</div>`;
    html.find(".traits .form-group").first().before(htmlElementCaregiver);


    const htmlElemenetFerocity =`
<li class="attribute ferocity">
    <h4 class="attribute-name box-title rollable" data-action="rollFerocity">Ferocity</h4>
    <div class="attribute-value">
        <input name="data.ferocity" type="text" data-dtype="Number" placeholder="0" value="${app.actor.data.data.ferocity || 0}">
    </div>
</li>`;
    html.find(".attribute + .initiative").replaceWith(htmlElemenetFerocity);
    // html.find(".attribute + .movement").last().after(htmlElemenetFerocity);
    // html.find(".counters").replaceWith(htmlElementCounter);

});