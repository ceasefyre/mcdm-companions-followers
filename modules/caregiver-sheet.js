// import ActorSheet5eCharacter from "../../systems/dnd5e/module/actor/sheets/character.js";
import ActorSheet5e from '../../../systems/dnd5e/module/actor/sheets/character.js';

export default class MCDMCaregiver5eSheet extends ActorSheet5e {
    get template() {
        console.log("Open Caregiver Character Sheet")
        console.log(this.actor.data.data)

        return super.template;
    }
}


Hooks.on("renderMCDMCaregiver5eSheet", (app, html) => {
    // console.log(app.actor.data.data);
    // console.log(app.actor.data.data.traits.sizes)
    // console.log("Modifying Actor Sheet");

    // const selectList = document.createElement("select");
    // selectList.id = "mySelect";
    // selectList.classList = "actor-size"
    // // let playerCharacterArray = [];

    // const currentChar = game.actors.get(app.actor.data.data.companions) || "";

    // console.log(currentChar)

    // let selectOptions = currentChar ? `<option value="${currentChar.id}">${currentChar.name}</option><option value=""></option>` : `<option value=""></option>`;
    // game.actors.forEach(act => {
    //     // console.log(act.sheet.constructor.name === "MCDMCompanion5eSheet");
    //     // console.log(act.data.data.mcdmbeastheartsheet?.isCompanion);
    //     //act.data.data.mcdmbeastheartsheet?.isCompanion
    //     // console.log(act.sheet)
    //     // if(act.hasPlayerOwner && act.type === "character"){

    //     //act.data.data.flags.core.sheetClass
    //     if(act.sheet.constructor.name === "MCDMCompanion5eSheet"){
    //         // console.log(act);
    //         // playerCharacterArray.push(act)
    //         var option = document.createElement("option");
    //         option.value = act.id;
    //         option.text = act.name;
    //         selectList.appendChild(option);

    //         selectOptions += `\n<option value="${act.id}">${act.name}</option>`
    //     }
    // });

   
//     const htmlElementCompanion = `
// <div class="form-group">
// 	<label>Companion</label>
// 	<select class="actor-size" name="data.companions">
// 			${selectOptions}
// 	</select>
// </div>`;
//     html.find(".traits .form-group").first().before(htmlElementCompanion);

    const htmlElemenetFerocity =`
<li class="attribute ferocity">
    <h4 class="attribute-name box-title rollable" data-action="rollFerocity">Ferocity</h4>
    <div class="attribute-value">
        <input name="data.ferocity" type="text" data-dtype="Number" placeholder="0" value="${app.actor.data.data.ferocity || 0}">
    </div>
</li>`;
    html.find(".attribute + .initiative").last().after(htmlElemenetFerocity);





    
    // // selectList.id = "mySelect";
    // // for (var i = 0; i < array.length; i++) {
    // //     var option = document.createElement("option");
    // //     option.value = array[i];
    // //     option.text = array[i];
    // //     selectList.appendChild(option);
    // // }

    // // Get current Actor
    // const currentActor = app.object;

    // // My field
    // const myField = document.createElement("input");
    // myField.type = "text";
    // myField.id = "field-name";
    // // myField.value = currentActor.getFlag("module-name", "flag-name");
    // myField.value = "TEST VALUE";
    // myField.placeholder = "My Placeholder";
    // myField.name = `flags.${"module-name"}.${"flag-name"}`;

    // // Add to Actor Sheet
    // // html[0].querySelector(".center-pane").prepend(myField);

    // // html.find(".center-pane").last().after(myField);
});
