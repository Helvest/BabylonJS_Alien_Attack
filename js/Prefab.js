"use strict";
function Prefab(game) {
	var prefabs = game.prefabs = game.prefabs || new Object();


	//CREATION MANUELLE
	var player = BABYLON.Mesh.CreateSphere("player", 10, 2, game.scene);
	player.position = new BABYLON.Vector3(0, 3, 0);
    player.scaling = new BABYLON.Vector3(1, 0.2, 1);
    player.material = game.material.white;
    player.isVisible = false;

    var head = BABYLON.Mesh.CreateSphere("head", 10, 0.6, game.scene);
    head.position = new BABYLON.Vector3(0, 0.8, 0);
    head.scaling = new BABYLON.Vector3(1.5, 3, 1.5);
    head.parent = player;
    head.material = game.material.greenAlien;
    head.isVisible = false;

    prefabs.player = player;

    var laserBullet = BABYLON.Mesh.CreateSphere("bullet", 10, 0.5, game.scene);
    laserBullet.scaling = new BABYLON.Vector3(1.5, 0.25, 0.25);
    laserBullet.material = game.material.blueLaser;
    laserBullet.isVisible = false;

    prefabs.laserBullet = laserBullet;

    var bonus = BABYLON.Mesh.CreateSphere("bonus", 10, 0.5, game.scene);
    bonus.scaling = new BABYLON.Vector3(2, 2, 2);
    bonus.material = game.material.redAlien;
    bonus.isVisible = false;

    prefabs.bonus = bonus;


	//CREATION LOADED
    var ares = game.prefabs.ares;
    console.log(ares);
    ares.scaling = new BABYLON.Vector3(0.03, 0.03, 0.03);
	//ares.bakeCurrentTransformIntoVertices();

    var orion = game.prefabs.orion;
    orion.scaling = new BABYLON.Vector3(1.5, 1.5, 1.5);

    var missile = game.prefabs.missile;
    missile.scaling = new BABYLON.Vector3(0.4, 0.4, 0.5);

    for (var index in prefabs) {
    	prefabs[index].position = new BABYLON.Vector3(0, 3, 0);
    };
};