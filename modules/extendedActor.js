// module/documents/actor/actor.mjs
import Actor5e from '../../../systems/dnd5e/module/documents/actor/actor.mjs';
// module/documents/item.mjs
import ItemSheet5e from '../../../systems/dnd5e/module/documents/item.mjs';
// module/dice/dice.mjs
import {damageRoll} from '../../../systems/dnd5e/module/dice/dice.mjs';

export default function extendedActorFunctions () {

    ItemSheet5e.prototype._getItemConsumptionTargets = (function () {
        const original = ItemSheet5e.prototype._getItemConsumptionTargets;
        return function(){

            const originalObject = original.apply(this, arguments);
            if(this.object.data.data.consume?.type === "attribute"){
                //adds ferocity as an option to the Resource Consumtion Attribute list at the head
                if(this.object.getFlag('core', 'sheetClass') === "dnd5e.MCDMRetainer5eSheet" ||  this.item.actor?.data?.data?.ferocity !== undefined){
                    return Object.assign({ferocity:"Ferocity", 'attributes.hd':"Hit-Die"},originalObject);
                }
                return Object.assign({ferocity:"Ferocity"},originalObject);
            }
            return originalObject;
        }
    }());

    Actor5e.prototype._rest = (function (){
        const original = Actor5e.prototype._rest;
        return function () {
            original.apply(this, arguments);

            if(arguments[2]){ // check if long rest
                const caregiver = this.getFlag(`mcdm-companions-followers`, 'caregiver');
                const retainer = this.getFlag('core', 'sheetClass') === "dnd5e.MCDMRetainer5eSheet";
                if(caregiver || retainer){
                    const hitDie = Math.min(this.data.data.attributes.hd + Math.floor(this.data.data.details.level/2),this.data.data.details.level);
                    this.update({"data.attributes.hd": hitDie})
                }
            }
        }
    })();

    Actor5e.prototype.rollHitDie = (function (){
        const original = Actor5e.prototype.rollHitDie;
        return function () {
            const caregiver = this.getFlag(`mcdm-companions-followers`, 'caregiver') //check if a companion
            if(caregiver){
                companionRollHitDie(this, arguments);
                return;
            }
            else if(this.getFlag('core', 'sheetClass') === "dnd5e.MCDMRetainer5eSheet"){//check if retainer
                companionRollHitDie(this, arguments, this.data.data.attributes.retainerHitDieSize);
                return;
            }
            return original.apply(this, arguments);
        }
    })();

    Actor5e.prototype._prepareCharacterData = (function (){
        const original = Actor5e.prototype._prepareCharacterData;
        return function () {

            if(game.actors && this.getFlag(`mcdm-companions-followers`, 'companion')){
                if(!game.actors.get(this.getFlag(`mcdm-companions-followers`, 'companion'))){
                    this.setFlag(`mcdm-companions-followers`, 'companion', null);
                }
            }

            const caregiver = this.getFlag(`mcdm-companions-followers`, 'caregiver')
            if(caregiver){
                const hitDie = this.data.data.attributes.hd; //Companions don't need this data to be prepared as they do not get it from classes;
                original.apply(this, arguments);
                this.data.data.attributes.hd = hitDie;

                if(!game.actors){
                    return;
                }
                const caregiverAct = game.actors.get(caregiver);

                if(!caregiverAct){
                    this.setFlag(`mcdm-companions-followers`, 'caregiver', null);
                }
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

    Actor5e.prototype._prepareNPCData = (function (){
        const original = Actor5e.prototype._prepareNPCData;
        return function () {

            if(this.getFlag('core', 'sheetClass') === "dnd5e.MCDMRetainer5eSheet"){
                const data = arguments[0].data;

                data.details.level = Math.min(Math.max(parseInt(data.details.level), 1), 7);

                // Retains need twice the EXP to level up
                data.details.xp.max = CONFIG.DND5E.CHARACTER_EXP_LEVELS[data.details.level]*2;
            
                // Proficiency
                data.attributes.prof = 2;

                // Retainers hb scales from HD value
                switch(data.attributes.retainerHitDieSize){
                    default : data.attributes.hp.max = 8 + data.details.level * 8; break;
                    case '10': data.attributes.hp.max = 9 + data.details.level * 9; break;
                    case '12': data.attributes.hp.max = 10 + data.details.level * 10; break;
                }
                if(data.attributes.hd === undefined) data.attributes.hd = 0;
                
                // Spellcaster Level
                if ( data.attributes.spellcasting && !Number.isNumeric(data.details.spellLevel) ) {
                  data.details.spellLevel = Math.max(data.details.cr, 1);
                }
                return;
            }
            return original.apply(this, arguments);
        }
    })();

    Actor5e.prototype.prepareDerivedData = (function (){
        const original = Actor5e.prototype.prepareDerivedData;
        return function () {
            if(this.getFlag('core', 'sheetClass') === "dnd5e.MCDMRetainer5eSheet"){
                original.apply(this, arguments);

                const actorData = this.data;
                const data = actorData.data;

                //sets the AC value based on the three pregen configs
                data.attributes.ac.value = data.attributes.retainerArmorClass;

                const bonusData = this.getRollData();
                for (let [id, abl] of Object.entries(data.abilities)) {
                    //retainer effectly has a +3 to all Ability Checks, and +4 to their primary Abillity
                    abl.mod = data.attributes.primaryAbillity == id ? 4 : 3;

                    //retainer + 3 to all saves, +6 to primary save
                    abl.save = abl.proficient ? 6 : 3;
                }
                
                const flags = actorData.flags.dnd5e || {};

                const feats = CONFIG.DND5E.characterFlags;
                const observant = flags.observantFeat;
                for (let [id, skl] of Object.entries(data.skills)) {

                    skl.mod = data.abilities[skl.ability]?.mod ?? 0;
                    skl.total = skl.mod + skl.bonus;
                    if ( Number.isNumeric(skl.prof.term) ) skl.total += skl.prof.flat;

                    // Compute passive bonus
                    const passive = observant && (feats.observantFeat.skills.includes(id)) ? 5 : 0;
                    const passiveBonus = this._simplifyBonus(skl.bonuses?.passive, bonusData);
                    skl.passive = 10 + skl.mod + skl.bonus + skl.prof.flat + passive + passiveBonus;
                }
                return;
            }
            return original.apply(this, arguments);
        }

    })();



	Actor5e.prototype.rollFerocity = function (dialog=true, options = {}) {
        rollFerocity(this, dialog, options);
	};


    function prepareBaseAbilitiesRetainer(data, updates){
        const abilities = {};

    }

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

    async function companionRollHitDie(t, a, size=8){
        if(t.data.data.attributes.hd <= 0){
            ui.notifications.warn("You are out of Hit Dice.");
            return;
        }
        const parts = [`1d${size}`, "@abilities.con.mod"];
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