import Actor5e from '../../../systems/dnd5e/module/actor/entity.js';
import ItemSheet5e from '../../../systems/dnd5e/module/item/sheet.js';
import {d20Roll, damageRoll} from '../../../systems/dnd5e/module/dice.js';

export default function extendedActorFunctions () {

    ItemSheet5e.prototype._getItemConsumptionTargets = (function () {
        const original = ItemSheet5e.prototype._getItemConsumptionTargets;
        return function(){
            if(this.item.actor.data.data.ferocity && this.object.data.data.consume.type === "attribute"){
                //adds ferocity as an option to the Resource Consumtion Attribute list at the head
                return Object.assign({ferocity:"Ferocity", 'attributes.hd':"Hit-Die"},original.apply(this, arguments))
            }
            return original.apply(this, arguments);
        }
    }());

    Actor5e.prototype._rest = (function (){
        const original = Actor5e.prototype._rest;
        return function () {
            original.apply(this, arguments);
            const caregiver = this.getFlag(`mcdm-companions-followers`, 'caregiver')
            if(caregiver){
                const hitDie = Math.min(this.data.data.attributes.hd + Math.floor(this.data.data.details.level/2),this.data.data.details.level);
                this.update({"data.attributes.hd": hitDie})
            }
        }

    })();

    Actor5e.prototype.rollHitDie = (function (){
        const original = Actor5e.prototype.rollHitDie;
        return function () {
            const caregiver = this.getFlag(`mcdm-companions-followers`, 'caregiver')
            if(caregiver){
                companionRollHitDie(this, arguments);
                return;
            }
            return original.apply(this, arguments);
        }
    })();

    Actor5e.prototype._prepareCharacterData = (function (){
        const original = Actor5e.prototype._prepareCharacterData;
        return function () {

            const caregiver = this.getFlag(`mcdm-companions-followers`, 'caregiver')
            if(caregiver){
                const hitDie = this.data.data.attributes.hd; //Companions don't need this data to be prepared as they do not get it from classes;
                original.apply(this, arguments);
                this.data.data.attributes.hd = hitDie;

                if(!game.actors){
                    return;
                }
                const caregiverAct = game.actors.get(caregiver);
                this.data.data.attributes.prof = caregiverAct.data.data.attributes.prof;
                this.data.data.details.level = caregiverAct.data.data.details.level;

                //set HP which scales off of caregiver stats
                const hpFormula = this.data.data.attributes.hp.formula || "7 + 7 * @details.level";
                const rollData = foundry.utils.deepClone(this.getRollData());
                const replaced = Roll.replaceFormulaData(hpFormula, rollData);
                this.data.data.attributes.hp.max = Roll.safeEval(replaced);

                this.prepareDerivedData();
                return;
            }

            return original.apply(this, arguments);
        }
    })();


	Actor5e.prototype.rollFerocity = function (dialog=true, options = {}) {
        rollFerocity(this, dialog, options);
	};
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

    async function rollFerocity(t, dialog=true, options = {}){
        const parts = [`1d4`];
        const flavor = 'Ferocity Roll';
        const title = `${flavor}: ${t.name}`;
        const data = foundry.utils.deepClone(t.data.data);

        // Call the roll helper utility
        const roll = await damageRoll({
            event: new Event("hitDie"),
            parts,
            data,
            title,
            flavor,
            allowCritical: false,
            fastForward: !dialog,
            dialogOptions: {width: 350},
            messageData: {
                speaker: ChatMessage.getSpeaker({actor: t}),
                "flags.dnd5e.roll": {type: "hitDie"}
            }
            });
            if ( !roll ) return null;

            await t.update(
                {"data.ferocity": t.data.data.ferocity + roll.total});
            return roll;
    }

    async function companionRollHitDie(t, a){

        const parts = [`1d8`, "@abilities.con.mod"];
        const flavor = game.i18n.localize("DND5E.HitDiceRoll");
        const title = `${flavor}: ${t.name}`;
        const data = foundry.utils.deepClone(t.data.data);

        // Call the roll helper utility
        const roll = await damageRoll({
            event: new Event("hitDie"),
            parts,
            data,
            title,
            flavor,
            allowCritical: false,
            fastForward: !a[0].dialog,
            dialogOptions: {width: 350},
            messageData: {
                speaker: ChatMessage.getSpeaker({actor: t}),
                "flags.dnd5e.roll": {type: "hitDie"}
            }
            });
            if ( !roll ) return null;

            // Adjust actor data
            // await cls.update({"data.hitDiceUsed": cls.data.data.hitDiceUsed + 1});
            const hp = t.data.data.attributes.hp;
            const dhp = Math.min(hp.max + (hp.tempmax ?? 0) - hp.value, roll.total);
            await t.update(
                {"data.attributes.hp.value": hp.value + dhp,
                "data.attributes.hd" : (t.data.data.attributes.hd-1)
                });
            return roll;
        }
};


Hooks.once('ready', () => {
    for(let a of game.actors){
        // if(!a.data.flags[`mcdm-companions-followers`]?.caregiver) continue;
        if(!a.getFlag(`mcdm-companions-followers`, 'caregiver')) continue;
        a.prepareBaseData();
    }
});