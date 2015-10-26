
document.addEventListener("DOMContentLoaded", function() {

    var canvas = document.getElementById("renderCanvas");

    var engine = new BABYLON.Engine(canvas, true);

    var scene = new BABYLON.Scene(engine);
    scene.debugLayer.show();

    var camera = new BABYLON.FreeCamera("MainCamera", new BABYLON.Vector3(0, 5, -10), scene);
    //camera.applyGravity = true;
    camera.checkCollisions = true;

    camera.speed = 0.5;
    camera.angularSensibility = 1000;

    camera.keysUp = [90]; // Touche Z
    camera.keysDown = [83]; // Touche S
    camera.keysLeft = [81]; // Touche Q
    camera.keysRight = [68]; // Touche D;
    scene.activeCamera.attachControl(canvas);

    var light = new BABYLON.PointLight("DirLight", new BABYLON.Vector3(0, 10, 0), scene);
    light.diffuse = new BABYLON.Color3(1, 1, 1);
    light.specular = new BABYLON.Color3(0.6, 0.6, 0.6);
    light.intensity = 1.5;

    var ground = BABYLON.Mesh.CreatePlane("ground", 50, scene);
    ground.rotation.x = Math.PI / 2;
    ground.checkCollisions = true;
    ground.material = new BABYLON.StandardMaterial("tapis_billard", scene);
    ground.material.diffuseTexture = new BABYLON.Texture("assets/images/tapis_billard.jpg", scene);
    

    var yellowMaterial = new BABYLON.StandardMaterial("yellow", scene);
    yellowMaterial.diffuseTexture = new BABYLON.Texture("assets/images/ball13.jpg", scene);

    var redMaterial = new BABYLON.StandardMaterial("red", scene);
    redMaterial.diffuseTexture = new BABYLON.Texture("assets/images/ball15.jpg", scene);

    var whiteMaterial = new BABYLON.StandardMaterial("white", scene);
    whiteMaterial.diffuseColor = new BABYLON.Color3(1, 1, 1);

    var blackMaterial = new BABYLON.StandardMaterial("black", scene);
    blackMaterial.diffuseColor = new BABYLON.Color3(0, 0, 0);

    var cubeSize = 2.5;
    var Xpos = 0;
    var Zpos = 0;

    function Position() {

        if (Xpos >= cubeSize * 3) {
            Xpos = 0;
            Zpos += cubeSize;
        }
        else
            Xpos += cubeSize;

    };


    for (var i = 0; i < 7; i++) {
        var box = BABYLON.Mesh.CreateSphere("box" + i, 50, cubeSize, scene);
        box.position = new BABYLON.Vector3(Xpos, cubeSize / 2, Zpos);
        box.material = yellowMaterial;
        box.checkCollisions = true;
        Position();
    }

    for (var i = 0; i < 7; i++) {
        var box = BABYLON.Mesh.CreateSphere("box" + i, 50, cubeSize, scene);
        box.position = new BABYLON.Vector3(Xpos, cubeSize / 2, Zpos);
        box.material = redMaterial;
        box.checkCollisions = true;
        Position();
    }

    var box = BABYLON.Mesh.CreateSphere("box", 50, cubeSize, scene);
    box.position = new BABYLON.Vector3(Xpos, cubeSize / 2, Zpos);
    box.material = whiteMaterial;
    box.checkCollisions = true;
    Position();

    var box = BABYLON.Mesh.CreateSphere("box", 50, cubeSize, scene);
    box.position = new BABYLON.Vector3(Xpos, cubeSize / 2, Zpos);
    box.material = blackMaterial;
    box.checkCollisions = true;
    Position();


    engine.runRenderLoop(function () {

        scene.render();

    });

}, false);

//créer les couleur

//le sol

//les boules