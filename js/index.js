"use strict";

//START
document.addEventListener("DOMContentLoaded", function() {
    var game = [];

    game.canvas = document.getElementById("renderCanvas");
    game.engine = new BABYLON.Engine(game.canvas, true);
    game.scene = new BABYLON.Scene(game.engine);

	//game.scene.debugLayer.show();

    Loader(game);
}, false);

function Loader(game) {
    game.prefabs = game.prefabs || [];

    game.loader = new BABYLON.AssetsManager(game.scene);
    game.loader.isComplete = false;

    var toLoad = [
		{ name: "tumblr", src: "assets/images/tumblr.png" },
		{ name: "bar", src: "assets/images/bar.png" }
    ];

    game.images = [];

    toLoad.forEach(function (obj) {
    	var img = game.loader.addTextureTask(obj.name, obj.src);
    	img.onSuccess = function (t) {
    		game.images[t.name] = t.texture;
    	};
    });

	//Fonction appelée quand le chargement de l’objet est terminé
	function OnSuccess(task) {
		var prefabs = game.prefabs[task.name] = task.loadedMeshes[0];
		prefabs.isVisible = false;
	};
    
	game.loader.addMeshTask("ares", "", "assets/3D/", "ares.babylon").onSuccess = OnSuccess;
	game.loader.addMeshTask("orion", "", "assets/3D/", "orion.unity.babylon").onSuccess = OnSuccess;
	game.loader.addMeshTask("missile", "", "assets/3D/", "missile.unity.babylon").onSuccess = OnSuccess;

	//Fonction appelée quand tout les chargements sont terminés
    game.loader.onFinish = function (tasks) {
    	game.loader.isComplete = true;
    	Create(game);
    };
	// Démarre le chargement
    game.loader.load();
};

/*function TryAfterLoad(game) {
	if (game.loader.isComplete && game.loaderImage.isComplete) {
		Create(game);
	};
};*/

function Cameras(game) {
	//ARC
	game.camera = new BABYLON.ArcRotateCamera("MainCamera", 0, Math.PI / 3, 25, new BABYLON.Vector3.Zero(), game.scene);

};

function Lights(game) {
    /*game.light = new BABYLON.PointLight("DirLight", new BABYLON.Vector3(0, 10, 0), game.scene);
    game.light.diffuse = new BABYLON.Color3(1, 1, 1);
    game.light.specular = new BABYLON.Color3(0.6, 0.6, 0.6);
    game.light.intensity = 1.5;*/

	game.light = new BABYLON.DirectionalLight("Dir", new BABYLON.Vector3(0, -1, 0), game.scene);
	game.light.diffuse = new BABYLON.Color3(1, 1, 1);
	game.light.specular = new BABYLON.Color3(.6, .6, .6);

	game.light.rotation = new BABYLON.Quaternion.Identity();

	game.shadow = new BABYLON.ShadowGenerator(1000, game.light);
	//game.shadow.usePoissonSampling = true;

	/*game.light = new BABYLON.DirectionalLight("Dir1", new BABYLON.Vector3(0, 1, 0), game.scene);
	game.light.diffuse = new BABYLON.Color3(1, 1, 1);
	game.light.specular = new BABYLON.Color3(.6, .6, .6);

	game.light = new BABYLON.DirectionalLight("Dir2", new BABYLON.Vector3(1, 0, 0), game.scene);
	game.light.diffuse = new BABYLON.Color3(1, 1, 1);
	game.light.specular = new BABYLON.Color3(.6, .6, .6);*/
};

function Material(game) {
	var material = game.material = [];

	//COLOR
    material.red = new BABYLON.StandardMaterial("red", game.scene);
    material.red.diffuseColor = BABYLON.Color3.Red();

    material.green = new BABYLON.StandardMaterial("green", game.scene);
    material.green.diffuseColor = BABYLON.Color3.Green();

    material.blue = new BABYLON.StandardMaterial("blue", game.scene);
    material.blue.diffuseColor = BABYLON.Color3.Blue();

    material.yellow = new BABYLON.StandardMaterial("yellow", game.scene);
    material.yellow.diffuseColor = BABYLON.Color3.Yellow();

    material.white = new BABYLON.StandardMaterial("white", game.scene);
    material.white.diffuseColor = BABYLON.Color3.White();

    material.black = new BABYLON.StandardMaterial("black", game.scene);
    material.black.diffuseColor = BABYLON.Color3.Black();

	//SPECIFIQUE
    material.blueLaser = new BABYLON.StandardMaterial("blueLaser", game.scene);
    material.blueLaser.emissiveColor = BABYLON.Color3.Blue();

    material.greenAlien = new BABYLON.StandardMaterial("greenAlien", game.scene);
    material.greenAlien.emissiveColor = BABYLON.Color3.Green();

    material.redAlien = new BABYLON.StandardMaterial("redAlien", game.scene);
    material.redAlien.emissiveColor = BABYLON.Color3.Red();

};

function Animation(game) {

    game.animationBox = new BABYLON.Animation(
         "animationBox",
         "material.emissiveColor",
         50,
         BABYLON.Animation.ANIMATIONTYPE_COLOR3,
         BABYLON.Animation.ANIMATIONLOOPMODE_CYCLE
    );

    var keys = [];

    keys.push({
        frame: 0,
        value: game.material.black.diffuseColor
    }, {
        frame: 30,
        value: game.material.red.diffuseColor
    }, {
        frame: 60,
        value: game.material.blue.diffuseColor
    }, {
        frame: 90,
        value: game.material.green.diffuseColor
    }, {
        frame: 120,
        value: game.material.white.diffuseColor
    }, {
        frame: 150,
        value: game.material.black.diffuseColor
    });

    game.animationBox.setKeys(keys);

    game.animationRotate = new BABYLON.Animation(
         "animationRotate",
         "rotation.z",
         30,
         BABYLON.Animation.ANIMATIONTYPE_FLOAT,
         BABYLON.Animation.ANIMATIONLOOPMODE_CYCLE
    );

    keys = [];

    keys.push({
        frame: 0,
        value: 0
    }, {
        frame: 150,
        value: 6.3
    });

    game.animationRotate.setKeys(keys);

};

function Nothing() { };

function Create(game) {
	game.render = Nothing;
	Cameras(game);
	
    Lights(game);
    Material(game);
    Animation(game);
    
    Prefab(game);

	game.grid = new HexGridBuilder(game, 30, 50, 0, 100, 3);

	//Menu(game);
    Level(game);

    game.engine.runRenderLoop(function () {
    	game.render();
    	game.scene.render();
    });
};

function MakeEnemy(game, enemy) {
	enemy.mesh.position.x = game.grid.tailleMapX * (Math.random() * 2 - 1);
	enemy.mesh.position.z = game.grid.tailleMapZ * (Math.random() * 2 - 1);
	game.objets.push(enemy);
};

function MakeBonus(game) {
	var bonus = new Sonde(game, game.prefabs.orion);
	bonus.mesh.position.x = game.grid.tailleMapX * (Math.random() * 2 - 1);
	bonus.mesh.position.z = game.grid.tailleMapZ * (Math.random() * 2 - 1);
	game.objets.push(bonus);
};


function Level(game) {

	game.score = 0;

	HUD(game);

	if (game.objets) {
		var L = game.objets.length;
		for (var i = 0; i < L; i++) {
			game.objets[i].Destroy();
		};
	};

    game.objets = new Array();

    game.grid.NewWorld();

    game.player = new Player(game, game.prefabs.player, 100, 10, 10);
    game.objets.push(game.player);
	
    game.camera.target = game.player.cameraPoint;

	//ennemy
    for (var i = 0; i < 5; i++) {
    	MakeEnemy(game, new Enemy(game, game.prefabs.ares, 25, 5, 0.5));
    };

    for (var i = 0; i < 5; i++) {
    	MakeEnemy(game, new Enemy2(game, game.prefabs.missile, 25, 7, 0.5));
    };

	//bonus
    for (var i = 0; i < 5; i++) {
    	MakeBonus(game);
    };
   
    game.time = new Time();

   // game.hud.score.

    Control(game);
    Update(game);
};

function Update(game) {

    var time = game.time;
    var objets = game.objets;
    var control = game.control;
    var player = game.player;

    game.score = 0;

    function PlayUpdate() {
    	time.Update();

    	if (!player.alive)
    		return;

        if (control.move) {
            var x = 0;
            var z = 0;

            if (control.moveFoward)
                z = 1;
            else if (control.moveBack)
                z = -1;

            if (control.moveLeft)
                x = -1;
            else if (control.moveRight)
                x = 1;

            if (z != 0 && x != 0) {
                z *= 0.7;
                x *= 0.7;
            };

            player.Move(x, z);
            game.grid.getGlobeHex(player.mesh.position.x, player.mesh.position.z);
        };

        if (control.rotate) {
        	if (control.rotateMore) {
        		player.RotateY(time.deltaTime/2);
        	}
        	else if (control.rotateLess) {
        		player.RotateY(-time.deltaTime/2);
        	};
        };

        if (control.fire) {
            var x = 0;
            var z = 0;

            if (control.fireFoward)
                z = 1;
            else if (control.fireBack)
                z = -1;

            if (control.fireLeft)
                x = 1;
            else if (control.fireRight)
                x = -1;

            player.Fire(x, z);
        };

		//check tout les objets
        var L = objets.length;
        var J = 0;
        for (var i = 0; i < L; i++) {
        	var objet = objets[i];
        	J++;
            if (objet.alive) {
            	objet.Update();

            	var limiteX = game.grid.tailleMapX;
            	var limiteZ = game.grid.tailleMapZ;
            	var playerX = player.mesh.position.x;
            	var playerZ = player.mesh.position.z;
            	var objetX = objet.mesh.position.x;
            	var objetZ = objet.mesh.position.z;


            	if (objetX > playerX + limiteX) {
            		objet.mesh.position.x = playerX - limiteX;
            	}
            	else if (objetX < playerX - limiteX) {
            		objet.mesh.position.x = playerX + limiteX;
            	};

            	if (objetZ > playerZ + limiteZ) {
            		objet.mesh.position.z = playerZ - limiteZ;
            	}
            	else if (objetZ < playerZ - limiteZ) {
            		objet.mesh.position.z = playerZ + limiteZ;
            	};


            	for (var j = J; j < L; j++) {
            		var other = objets[j];
            		//Si collision
            		var col = objet.mesh.intersectsMesh(other.mesh);

            		if (col) {

            			objet.TriggerEnter(other);
            			other.TriggerEnter(objet);

            			//break;
            		};
            	};
            }
            else {

            	if (objet instanceof Enemy || objet instanceof Bonus) {
            		game.score += 10;

            		var hasard = Math.floor(Math.random() * 3);

            		console.log(hasard)
            		switch (hasard) {
            			case 1:
            				MakeEnemy(game, new Enemy(game, game.prefabs.ares, 25, 5, 0.5));
            				break;
            			case 2:
            				MakeEnemy(game, new Enemy2(game, game.prefabs.missile, 25, 7, 0.5));
            				break;
            			default:
            				MakeBonus(game);
            		};
            	};

                objet.Destroy();
                objets.splice(i, 1);
                L--;
            };
        };

        if (game.hud.isReady) {
        	game.hud.barDeVie.mesh.scaling.x = game.hud.barDeVie.max * player.lifes / player._baseLifes;

        	game.hud.score.update(game.score.toString())

        	if (!player.alive) {
        		game.hud.gameover.setVisible(true, true);
        	};
        };

    	//Move Light
        var vitesse = 30;
        var cosX = Math.cos(player.mesh.position.x / vitesse) * Math.PI;
        var sinX = Math.sin(player.mesh.position.x / vitesse) * Math.PI;

        var cosZ = Math.cos(player.mesh.position.z / vitesse) * Math.PI;
        var sinZ = Math.sin(player.mesh.position.z / vitesse) * Math.PI;

        game.light.direction.x = cosX;
        game.light.direction.y = sinX + sinZ;
        game.light.direction.z = cosZ;
    };

    game.render = PlayUpdate;
};