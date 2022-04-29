export default class CompanionHitDiceConfig extends DocumentSheet {
  /** @override */
  static get defaultOptions() {
    return foundry.utils.mergeObject(super.defaultOptions, {
      classes: ["dnd5e", "hd-config", "dialog"],
      template: "modules/mcdm-companions-followers/templates/apps/companion-hit-dice-config.html",
      width: 360,
      height: "auto"
    });
  }
  /* -------------------------------------------- */

  /** @override */
  get title() {
    return `${game.i18n.localize("DND5E.HitDiceConfig")}: ${this.object.name}`;
  }

  /* -------------------------------------------- */

  /** @override */
  getData(options) {
      let label;
      if(this.object.getFlag('core', 'sheetClass') === "dnd5e.MCDMRetainer5eSheet"){
        label = `Retainer (d${this.object.data.data.attributes.retainerHitDieSize || 8})`;
      } else{
        label = "Companion (d8)";
      }
      return {data: this.object.data.data, canRoll: !!this.object.data.data.attributes.hd, label: label};
  }

  /* -------------------------------------------- */

  /** @override */
  activateListeners(html) {
    super.activateListeners(html);

    // Hook up -/+ buttons to adjust the current value in the form
    html.find("button.increment,button.decrement").click(event => {
      const button = event.currentTarget;
      const current = button.parentElement.querySelector(".current");
      const max = button.parentElement.querySelector(".max");
      const direction = button.classList.contains("increment") ? 1 : -1;
      current.value = Math.clamped(parseInt(current.value) + direction, 0, parseInt(max.value));
    });

    html.find("button.roll-hd").click(this._onRollHitDie.bind(this));
  }

  /* -------------------------------------------- */

  /** @override */
  async _updateObject(event, formData) {
    const updateData = {};

    updateData[`data.attributes.hd`] = formData[`attributes.hd`];
    return this.object.update(updateData);
  }

  /* -------------------------------------------- */

  /**
   * Rolls the hit die corresponding with the class row containing the event's target button.
   * @param {MouseEvent} event
   * @private
   */
  async _onRollHitDie(event) {
    event.preventDefault();
    const button = event.currentTarget;
    await this.object.rollHitDie("d8");

    // Re-render dialog to reflect changed hit dice quantities
    this.render();
  }
}
