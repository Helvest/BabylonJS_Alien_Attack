"use strict";
function Hexagone (game, mesh) {
	this.game = game;
	this.mesh = mesh;
	this.mesh.script = this;

	game.shadow.getShadowMap().renderList.push(this.mesh);
	this.mesh.receiveShadows = true;
};

Hexagone.prototype.AddMaterial = function (material, selectMaterial) {
	this._material = this.mesh.material = material;
	this.selectMaterial = selectMaterial;
};

Hexagone.prototype.Select = function () {
	if (this.selectMaterial)
		this.mesh.material = this.selectMaterial;
};

Hexagone.prototype.Deselect = function () {
	if (this._material)
		this.mesh.material = this._material;
};