"use strict";

//LOADER ZONE
function LoaderImage(game) {

	var loaderImage = game.loaderImage = new Array();

	game.context = window.document.getElementById('renderCanvas').getContext("webgl");
	console.log("context", game.context);

	game.images = [];

	loaderImage.total = 0;
	loaderImage.totalComplete = 0;
	loaderImage.isComplete = false;
	loaderImage.pourcentage = 0;

	var imagesListe = game.imagesListe = [
		"TTT", "assets/images/tumblr.png"
	];

	function Onload(image) {
		loaderImage.totalComplete++;

		image._src = image.src;

		loaderImage.pourcentage = loaderImage.totalComplete / loaderImage.total;

		if (loaderImage.totalComplete == loaderImage.total) {
			loaderImage.isComplete = true;
			console.log("loaderImage complete");
			TryAfterLoad(game);
		};
	};

	function Error() {
		alert("Erreur lors du chargement");
	};

	var L = imagesListe.length;
	loaderImage.total = L / 2;
	for (var i = 0; i < L; i += 2) {
		var image = new Image();
		image.name = image[i];
		image.onload = Onload;
		image.onerror = Error;
		image.onabort = Error;
		image.src = imagesListe[i + 1];
	};

};

function Affichage(game) {

	var context = game.context;
	var images = game.images;

	console.log(context);
	var L = images.length;
	for (var i = 0; i < L; i++) {
		var objet = images[i];
		if (objet.alive) {
			var image = objet.image;
			context.drawImage(image, objet.x, objet.y, image.width, image.height);
		}
		else {
			objet.Destroy();
			images.splice(i, 1);
			L--;
		};
	};
};

//SPRITE ZONE
function Sprite(game, name) {
	this.game = game;
	this.name = name;
	this.alive = true;

	var index = game.images.indexOf(name);
	var link = game.images[index + 1];
	this.image = new Image();
	this.image.src = link;
	game.images.push(this);

	this.x = 0;
	this.y = 0;
};

Sprite.prototype.Kill = function () {
	this.alive = false;
};

Sprite.prototype.Destroy = function () {
	this.alive = null;
	this.image = null;
	this.game = null;
};

Sprite.prototype.ChangeTaille = function (taille) {
	this.image.width *= taille;
	this.image.height *= taille;
};

Sprite.prototype.Position = function (x, y) {
	this.x = x;
	this.y = y;
};


//BOUTON ZONE
function Button(game, name) {
	Sprite.call(this, game, name);

};
Button.prototype = Object.create(Sprite.prototype);
Button.prototype.constructor = Sprite;