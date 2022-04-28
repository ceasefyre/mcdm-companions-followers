import Actor5e from '../../../systems/dnd5e/module/actor/entity.js';
import {d20Roll} from '../../../systems/dnd5e/module/dice.js';

export default function extendedActorFunctions () {

    Actor5e.prototype._prepareCharacterData = (function (){
        const original = Actor5e.prototype._prepareCharacterData;
        return function () {

            const caregiver = this.getFlag(`mcdm-companions-followers`, 'caregiver')
            if(caregiver){

                original.apply(this, arguments);

                if(!game.actors){
                    return;
                }
                const caregiverAct = game.actors.get(caregiver);
                this.data.data.attributes.prof = caregiverAct.data.data.attributes.prof;
                this.prepareDerivedData();
                return;
            }

            return original.apply(this, arguments);
        }
    })();

	// Actor5e.prototype._onUpdate = (function (){

	// 	const original = Actor5e.prototype._onUpdate;

	// 	return function () {
    //         console.log(this.data.flags)
    //         if(this.data.flags?.core?.sheetClass === "dnd5e.MCDMCaregiver5eSheet"){
    //             console.log("Caregiver");
    //             return original.apply(this, arguments);
    //         }
    //         else if(this.data.flags?.core?.sheetClass === "dnd5e.MCDMCompanion5eSheet"){
    //             console.log("Companion");
    //             // return original.apply(this, arguments);
    //         } else {
    //             console.log("Not Caregiver");
    //             return original.apply(this, arguments);
    //         }

    //         original.apply(this, arguments);
	// 	}
	// })();
};


Hooks.once('ready', () => {
    for(let a of game.actors){
        // if(!a.data.flags[`mcdm-companions-followers`]?.caregiver) continue;
        if(!a.getFlag(`mcdm-companions-followers`, 'caregiver')) continue;
        a.prepareBaseData();
    }
});