import ActorSheet5eNPC from "../../systems/dnd5e/module/actor/sheets/npc.js";
import ActorSheet5eCharacter from "../../systems/dnd5e/module/actor/sheets/character.js";


import MCDMCaregiver5eSheet from './modules/caregiver-sheet.js';
import MCDMCompanion5eSheet from './modules/companion-sheet.js';
import extendedActorFunctions from './modules/extendedActor.js';

Hooks.on('init', () => {
    console.log(
`___________________________
___  _________________  ___
|  \\/  /  __ \\  _  \\  \\/  |
| .  . | /  \\/ | | | .  . |
| |\\/| | |   | | | | |\\/| |
| |  | | \\__/\\ |/ /| |  | |
\\_|  |_/\\____/___/ \\_|  |_/
___________________________`);


    // Actors.registerSheet("dnd5e", MCDMCaregiver5eSheet, {
    //     types: ["character"],
    //     makeDefault: false,
    //     label: "Caregiver Character Sheet"
    // });

    extendedActorFunctions();

    Actors.registerSheet("dnd5e", MCDMCompanion5eSheet, {
        types: ["character"],
        makeDefault: false,
        label: "Comanion Sheet"
    });

});


Hooks.on('preUpdateActor', async (actor, update, options, userId) => {

    console.log(actor)
    console.log(update)

    //update flags on caregivers, these flags will be used to force update on the companions
    if(update.flags && update.flags['mcdm-companions-followers']?.caregiver){
        const oldCaregiverID = actor.data.flags['mcdm-companions-followers'].caregiver;
        const newCaregiverID = update.flags['mcdm-companions-followers'].caregiver; 
        game.actors.get(newCaregiverID).setFlag('mcdm-companions-followers', 'companion', actor.id);
        if(oldCaregiverID) game.actors.get(oldCaregiverID).setFlag('mcdm-companions-followers', 'companion', null);
    }

    //force the companion to update its data if the caregiver changes
    if(actor.getFlag('mcdm-companions-followers', 'companion') && !(update.flags && update.flags['mcdm-companions-followers']?.companion)){
        const companion = game.actors.get(actor.getFlag('mcdm-companions-followers', 'companion'));
        companion.prepareBaseData();
        companion.sheet.render(companion.sheet.rendered); //if the sheet is also opened, force it to render again

    }
});
