"use strict";

//LOADER ZONE
function LoaderImage(game) {

	//name, link, capacity, size
	var imagesListe = game.imagesListe = [
		"tumblr", "assets/images/tumblr.png", 10, 205
	];

	game.images = [];

	var L = imagesListe.length;
	for (var i = 0; i < L; i += 4) {

		game.images.push(imagesListe[i]);

		var spriteManager = new BABYLON.SpriteManager(imagesListe[i], imagesListe[i + 1], imagesListe[i + 2], imagesListe[i + 3], game.scene);
		game.images.push(spriteManager);
	};

};


//SPRITE ZONE
function Sprite(game, name, x, y, z) {

	this.game = game;

	var index = game.images.indexOf(name);

	if (index == -1) {
		console.log("Pas d'image : " + name);
		debugger;
	};

	this.manager = game.images[index + 1];

	this.image = new BABYLON.Sprite(name, this.manager);

	this.Position(x, y, z);
};

Sprite.prototype.Kill = function () {
	this.alive = false;
};

Sprite.prototype.Destroy = function () {
	this.alive = null;
	this.manager = null;
	this.image = null;
	this.callback = null;
	this.game = null;
};

Sprite.prototype.ChangeTaille = function (taille) {
	this.image.size = taille;
};

Sprite.prototype.Position = function (x, y, z) {
	this.image.position.x = x || this.image.position.x;
	this.image.position.y = y || this.image.position.y;
	this.image.position.y = z || this.image.position.z;
};


//BOUTON ZONE
function Button(game, name, x, y, z, callback) {
	Sprite.call(this, game, name);
	this.callback = callback;
};
Button.prototype = Object.create(Sprite.prototype);
Button.prototype.constructor = Sprite;