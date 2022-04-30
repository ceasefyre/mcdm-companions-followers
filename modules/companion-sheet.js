import ActorSheet5eCharacter from "../../../systems/dnd5e/module/actor/sheets/character.js";
import CompanionHitPointConfig from "./apps/companion-hit-points-config.js";
import CompanionHitDiceConfig from "./apps/companion-hit-dice-config.js";

// import ActorSheet5eNPC from '../../../systems/dnd5e/module/actor/sheets/npc.js';

export default class MCDMCompanion5eSheet extends ActorSheet5eCharacter {
    get template(){
        // return super.template;
        return 'modules/mcdm-companions-followers/templates/companion-sheet.html';
    }

    _onSheetAction(event){
        event.preventDefault();
        const button = event.currentTarget;
        if(button.dataset.action === "rollferocity"){

            let thisToken;

            for(let t of canvas.tokens.controlled){
                if(t.actor.uuid === this.actor.uuid){
                    thisToken = t;
                    break;
                }
            }
            if(!thisToken){
                for(let t of game.scenes.current.tokens){
                    if(t.actor.uuid === this.actor.uuid){
                        thisToken = t;
                        break;
                    }
                }
            }

            if(!thisToken){
                ui.notifications.warn("No token was found in this current scene linked this actor.");

                this.actor.rollFerocity();
                return;
            }

            //TODO - Count the vissible tokens next to thisToken, and add that value to the Ferocity Roll as the default value for bonus
            this.actor.rollFerocity();
            return;
        }
        super._onSheetAction(event);
    }

    _onConfigMenu(event) {
        event.preventDefault();
        const button = event.currentTarget;
        if(button.dataset.action === "hit-points"){
            new CompanionHitPointConfig(this.object).render(true);
            return;
        }
        else if(button.dataset.action === "hit-dice"){
            new CompanionHitDiceConfig(this.object).render(true);
            return;
        }
        super._onConfigMenu(event)
    }
}

Hooks.on("renderMCDMCompanion5eSheet", (app, html) => {
    const selectList = document.createElement("select");
    selectList.id = "mySelect";
    selectList.classList = "actor-size"

    const caregiverActor = game.actors.get(app.actor.data.flags[`mcdm-companions-followers`]?.caregiver) || null;

    let selectOptions = caregiverActor ? `<option value="${caregiverActor.id}">${caregiverActor.name}</option><option value=""></option>` : `<option value=""></option>`;
    
    // const caregivers = game.actors.filter((a) => a.type === "character" && a.testUserPermission(game.user, "OWNER"));
    game.actors.forEach(act => {
        if(act.type === "character" && act.testUserPermission(game.user, "OWNER") && act.id !== app.actor.id){
            var option = document.createElement("option");
            option.value = act.id;
            option.text = act.name;
            selectList.appendChild(option);
            selectOptions += `\n<option value="${act.id}">${act.name}</option>`
        }
    });

    const htmlElementCaregiver = `
<div class="form-group">
	<label>Caregiver</label>
	<select class="actor-size" name="flags.mcdm-companions-followers.caregiver">
			${selectOptions}
	</select>
</div>`;
    html.find(".traits .form-group").first().before(htmlElementCaregiver);

    // cargiverActor.data.data.details.level;
    const htmlCaregiverInfo  = caregiverActor ? 
`<div class="charlevel">
<label>Caregiver: ${caregiverActor.data.name}</label>
</div>
<div class="charlevel">
<label>Caregiver Level: ${caregiverActor.data.data.details.level || 0}</label>
</div>
`
: `<label>No Caregiver =(</label>`;
    html.find(".charlevel").replaceWith(htmlCaregiverInfo);

});