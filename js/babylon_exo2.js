"use strict";
document.addEventListener("DOMContentLoaded", Start, false);

function Start() {
    var game = [];

    game.canvas = document.getElementById("renderCanvas");
    game.engine = new BABYLON.Engine(game.canvas, true);
    game.scene = new BABYLON.Scene(game.engine);

    //game.scene.debugLayer.show();

    Loader(game);
};

function Loader(game) {
    game.loader = new BABYLON.AssetsManager(game.scene);

    game.meshTask = game.loader.addMeshTask("ares", "", "assets/3D/", "ares.babylon");

    // Fonction appelée quand le chargement de l’objet est terminé
    game.meshTask.onSuccess = function (task) {
        game.ares = task.loadedMeshes[0];
        console.log(game.ares);
    };

    game.loader.onFinish = function (tasks) {
        Create(game);
    };

    game.loader.load(); // Démarre le chargement

};

function Cameras(game) {
    game.camera = new BABYLON.FreeCamera("MainCamera", new BABYLON.Vector3(0, 5, -10), game.scene);
    //camera.applyGravity = true;
    game.camera.checkCollisions = true;

    game.camera.speed = 0.5;
    game.camera.angularSensibility = 1000;

    game.camera.keysUp = [90]; // Touche Z
    game.camera.keysDown = [83]; // Touche S
    game.camera.keysLeft = [81]; // Touche Q
    game.camera.keysRight = [68]; // Touche D;
    game.scene.activeCamera.attachControl(game.canvas);
};

function Lights(game) {
    var light = game.light = new BABYLON.PointLight("DirLight", new BABYLON.Vector3(0, 10, 0), game.scene);
    light.diffuse = new BABYLON.Color3(1, 1, 1);
    light.specular = new BABYLON.Color3(0.6, 0.6, 0.6);
    light.intensity = 1.5;
};

function Grounds(game) {
    var ground = game.ground = BABYLON.Mesh.CreatePlane("ground", 50, game.scene);
    ground.rotation.x = Math.PI / 2;
    ground.checkCollisions = true;
    ground.material = new BABYLON.StandardMaterial("tapis_billard", game.scene);
    ground.material.diffuseTexture = new BABYLON.Texture("assets/images/tapis_billard.jpg", game.scene);
};

function Material(game) {
    var material = game.material = [];

    material.red = new BABYLON.StandardMaterial("red", game.scene);
    material.red.diffuseColor = new BABYLON.Color3(1, 0, 0);

    material.green = new BABYLON.StandardMaterial("green", game.scene);
    material.green.diffuseColor = new BABYLON.Color3(0, 1, 0);

    material.blue = new BABYLON.StandardMaterial("blue", game.scene);
    material.blue.diffuseColor = new BABYLON.Color3(0, 0, 1);

    material.yellow = new BABYLON.StandardMaterial("yellow", game.scene);
    material.yellow.diffuseColor = new BABYLON.Color3(1, 1, 0);

    material.white = new BABYLON.StandardMaterial("white", game.scene);
    material.white.diffuseColor = new BABYLON.Color3(1, 1, 1);

    material.black = new BABYLON.StandardMaterial("black", game.scene);
    material.black.diffuseColor = new BABYLON.Color3(0, 0, 0);

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

function Create(game) {

    Cameras(game);
    Lights(game);
    //Grounds(game);
    Material(game);
    Animation(game);

    /*var box = BABYLON.Mesh.CreateBox("box1", 2.5, game.scene);
    box.position = new BABYLON.Vector3(0, 2.5 / 2, 0);
    box.material = game.material.rainbow;
    box.checkCollisions = true;*/


    game.ares.position = new BABYLON.Vector3(0, 0, 0);
    game.ares.scaling = new BABYLON.Vector3(.2, .2, .2);
    game.ares.material = game.material.black;
    game.ares.checkCollisions = true;
    game.ares.animations.push(game.animationRotate);
    game.ares.animations.push(game.animationBox);
    game.scene.beginAnimation(game.ares, 0, 150, true);
    
    Update(game);
};


function Update(game) {
    game.engine.runRenderLoop(function () {
        game.scene.render();

    });
};