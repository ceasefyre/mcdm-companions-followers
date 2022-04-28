// import ActorSheet5eCharacter from "../../systems/dnd5e/module/actor/sheets/character.js";
import ActorSheet5e from '../../../systems/dnd5e/module/actor/sheets/character.js';

export default class MCDMCaregiver5eSheet extends ActorSheet5e {
    get template() {
        console.log("Open Caregiver Character Sheet")
        return super.template;
    }
}


Hooks.on("renderMCDMCaregiver5eSheet", (app, html) => {

});
