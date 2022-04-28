export default class CompanionHitDiceConfig extends DocumentSheet {
  /** @override */
  static get defaultOptions() {
    return foundry.utils.mergeObject(super.defaultOptions, {
      id: "companion-hp-config",
      classes: ["dnd5e", "ac-config", "dialog"],
      template: "modules/mcdm-companions-followers/templates/apps/companion-hit-points-config.html",
      width: 360,
      height: "auto"
    });
  }
  /* -------------------------------------------- */

  /** @override */
  get title() {
    return `Companion Hitpoints Config: ${this.object.name}`;
  }

  /* -------------------------------------------- */

  /** @override */
  getData(options) {
      return {data: this.object.data.data};
  }

  /* -------------------------------------------- */

  /** @override */
  async _updateObject(event, formData) {
    
    return this.object.update({"data.attributes.hp.formula": formData['attributes.hp.formula']});
  }

}
