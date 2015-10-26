"use strict";
var HexGridBuilder = function (game, width, depth, margin, PCdeMap, applatisment) {

	this.game = game;
	this.scene = game.scene;
	
	Math.PI2 = Math.PI / 2;
	Math.PI6 = Math.PI / 6;

	this.width = width || 10;
	this.depth = depth || 10;
	this.margin = margin || 1;
	//% de map visible
	this.PCdeMap = PCdeMap || 25;
	this.applatisment = applatisment || 1;

	this.tailleSphere = 9.83 / (this.PCdeMap / 10) * this.applatisment;

	//this.NewWorld();
};

HexGridBuilder.prototype.CalculParam = function () {

	this.tailleMapVisible = Math.min(this.width, this.depth) * this.PCdeMap / 100;

	this.tailleMapZ = this.depth * 0.75 * this._hexDepth / 2;
	this.tailleMapX = this.width * this._hexWidth / 2;
	
	//4Z = 3X
	this.tailleMapVisibleZ = this.tailleMapVisible;
	this.tailleMapVisibleX = this.tailleMapVisible * 0.75;
	
	this.circonference = (this.PCdeMap / this.applatisment / 100) * Math.PI;
	
	//ecart de position avec le centre actuelle
	this.ecartZ = this.tailleMapVisibleZ / 2;
	this.ecartX = this.tailleMapVisibleX / 2;
	
	this.maxZ = this.ecartZ * this._hexDepth * this.margin * 0.75;
	this.maxX = this.ecartX * this._hexWidth * this.margin;

	this.rayonZ = this.maxZ / Math.PI ;
	this.rayonX = this.maxX / Math.PI ;
	this.rayonY = (this.rayonZ + this.rayonX) / 2;
	
	this.ecartZMod = (Math.floor(-this.ecartZ)) % this.depth;
	this.ecartXMod = (Math.floor(-this.ecartX)) % this.width;
	
	this.decalY = this.tailleSphere * this.rayonY * 2;
};

HexGridBuilder.prototype.getGlobeHex = function (centerX, centerZ) {

    //numero d'index
    this.indexZ = centerZ > 0 ? Math.floor(centerZ / this._hexDepth) : Math.ceil(centerZ / this._hexDepth);
    this.indexZ += this.ecartZMod;

    this.indexX = centerX > 0 ? Math.floor(centerX / this._hexWidth) : Math.ceil(centerX / this._hexWidth);
	this.indexX += this.ecartXMod;

	//liste des hex
	var table = this.map.tableau;

	//tout invisible
	for (var z = 0; z < this.depth; z++)
		for (var x = 0; x < this.width; x++)
			table[z][x].isVisible = false;

	//liste des visibles
	for (var z = 0; z < this.tailleMapVisibleZ; z++) {

		//ID dans la tableau z
		var zz = (this.indexZ + z) % this.depth;
		zz = zz < 0 ? this.depth + zz : zz;
		
		var offset = table[zz][0].hexPosition.z % 2 !== 0 ? this._hexWidth / 2 : 0;
		
		//Position X et Z reelle
		var trueZ = ((-this.ecartZ + z) * this._hexDepth * this.margin - (centerZ % this._hexDepth)) * 0.75;
		
		//% exacte de distance = distence sur la sirconf en %
		var rotationZ = (trueZ / this.maxZ) * this.circonference;
		var distanceZ = rotationZ - Math.PI2;	
		
		//donner à cos sort la distance * PI/4
		var cosZ = Math.cos(distanceZ);
		var sinZ = Math.sin(distanceZ);

		for (var x = 0; x < this.tailleMapVisibleX; x++) {

			//ID dans la tableau x
			var xx = (this.indexX + x) % this.width;
			xx = xx < 0 ? this.width + xx : xx;

			var hex = table[zz][xx];

			//Position X reelle
			var trueX = (-this.ecartX + x) * this._hexWidth * this.margin + offset - (centerX % this._hexWidth);

			//Distance du centre
			var hexDistance = Math.abs(BABYLON.Vector2.Distance(new BABYLON.Vector2(centerX, centerZ), new BABYLON.Vector2(trueX + centerX, trueZ + centerZ)));

			if(this.rayonY * this._hexDepth > hexDistance)
				hex.isVisible = true;
			else
				continue;			
			
			//% exacte de distance = distence sur la sirconf en %
			var rotationX = (trueX / this.maxX) * this.circonference;
			var distanceX = rotationX - Math.PI2;
			

			//donner à cos sort la distance * PI/4
			var cosX = Math.cos(distanceX);
			var sinX = Math.sin(distanceX);

			//* le rayon
			hex.position.z = cosZ * this.rayonZ * this.tailleSphere + centerZ;
			hex.position.x = cosX * this.rayonX * this.tailleSphere + centerX;
			
			hex.position.y = (sinZ + sinX) * -this.rayonY * this.tailleSphere - this.decalY;
			
			//ROTATION à 0
			hex.rotationQuaternion = new BABYLON.Quaternion(0,0,0,1);
			
			//ROTATION Y
			hex.rotate(BABYLON.Axis.Y, Math.PI6, BABYLON.Space.WORLD);
			
			//ROTATION Z et X
			hex.rotate(BABYLON.Axis.Z, -rotationX, BABYLON.Space.WORLD);
			hex.rotate(BABYLON.Axis.X, rotationZ, BABYLON.Space.WORLD);
			
		};
	};
};

HexGridBuilder.prototype.GenerateMap = function () {

	//objet vide pour contenir les hex
	var grid = new BABYLON.Mesh("Grid", this.scene);
	grid.isVisible = false;

	//un hex
	var prefab = this.generateHex();
	prefab.isVisible = false;

	var boundingInfo = prefab.getBoundingInfo();
	this._hexWidth = boundingInfo.maximum.z - boundingInfo.minimum.z;
	this._hexDepth = boundingInfo.maximum.x - boundingInfo.minimum.x;
	this._hexDepth75 = this._hexDepth * 0.75;

	//couleur et hauteur
	var materials = [
		this.game.material.blue, 1,
		this.game.material.green, 1.2,
		this.game.material.white, 1.4
	];

	var tile = null;
	var random = 0;
	var tableauZ = [];
	for (var z = 0; z < this.depth; z++) {
		tableauZ[z] = [];
		for (var x = 0; x < this.width; x++) {
			//copy le mesh
			tile = prefab.clone();

			//rajoute le script
			new Hexagone(this.game, tile);

			tile.hexPosition = new BABYLON.Vector3(x, 0, z);
			
			//GENERATION
			var random = Math.floor(Math.random() * 2.999) * 2;
			//var random = 0;

			if(z == 0 || z == this.depth-1){
				tile.script.AddMaterial(this.game.material.yellow, this.game.material.red);
			}
			else if (x == 0 || x == this.width-1)
			{
				tile.script.AddMaterial(this.game.material.black, this.game.material.red);
			}
			else
				tile.script.AddMaterial(materials[random], this.game.material.red);

			tile.scaling.y += materials[random+1];

			//tile.position = this.getWorldCoordinate(x, tile.scaling.y / 2, z, tile);
			tile.parent = grid;
			
			tableauZ[z][x] = tile;
		}
	}

	prefab.dispose();
	
	grid.tableau = tableauZ;
	return grid;
};

HexGridBuilder.prototype.generateHex = function () {
	var hexagone = BABYLON.Mesh.CreateCylinder("hexagone", 1, 3, 3, 6, 1, this.scene);
	hexagone.rotation.y += Math.PI / 6;
	new Hexagone(this.game, hexagone);

	return hexagone;
};

HexGridBuilder.prototype.calculateInitialPosition = function () {
	var position = BABYLON.Vector3.Zero();
	position.x = -this._hexWidth * this.width / 2 + this._hexWidth / 2;
	position.z = this.depth / 2 * this._hexDepth / 2;
	return position;
};

HexGridBuilder.prototype.getWorldCoordinate = function (x, y, z) {

	var offset = 0;
	if (z % 2 !== 0) {
		offset = this._hexWidth / 2;
	};

	var px = this._initialPosition.x + offset + x * this._hexWidth * this.margin;
	var pz = this._initialPosition.z - z * this._hexDepth * 0.75 * this.margin;

	return new BABYLON.Vector3(px, 0, pz);
};

HexGridBuilder.prototype.Kill = function() {

	if (this.map) {
		var tableau = this.map.tableau;
		var L = tableau.length;

		for (var i = 0; i < L; i++) {
			tableau[i].dispose();
		};
	};
};

HexGridBuilder.prototype.NewWorld = function () {
	this.Kill();

	this._hexWidth = 1;
	this._hexDepth = 1;
	this._initialPosition = BABYLON.Vector3.Zero();
	this.map = this.GenerateMap();
	this.CalculParam();
	this.getGlobeHex(0, 0);
};