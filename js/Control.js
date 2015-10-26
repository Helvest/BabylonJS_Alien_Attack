"use strict";
function Control(game) {
    var KeyCodes = Control.KeyCodes;

    var control = game.control = [];
    control.move = false;
    control.moveFoward = false;
    control.moveBack = false;
    control.moveLeft = false;
    control.moveRight = false;

    control.fire = false;
    control.fireFoward = false;
    control.fireBack = false;
    control.fireLeft = false;
    control.fireRight = false;

    function OnKeyDown(e) {

        switch (e.keyCode) {

            //MOVE
            case KeyCodes.Z:
                control.moveFoward = true;
                control.move = true;
                break;
            case KeyCodes.S:
                control.moveBack = true;
                control.move = true;
                break;
            case KeyCodes.Q:
                control.moveLeft = true;
                control.move = true;
                break;
            case KeyCodes.D:
                control.moveRight = true;
                control.move = true;
                break;

			//ROTATE
        	case KeyCodes.E:
        		control.rotateMore = true;
        		control.rotate = true;
        		break;
        	case KeyCodes.A:
        		control.rotateLess = true;
        		control.rotate = true;
        		break;

            //FIRE
            case KeyCodes.ArrowUp:
                control.fireFoward = true;
                control.fire = true;
                break;
            case KeyCodes.ArrowDown:
                control.fireBack = true;
                control.fire = true;
                break;
            case KeyCodes.ArrowLeft:
                control.fireLeft = true;
                control.fire = true;
                break;
            case KeyCodes.ArrowRight:
                control.fireRight = true;
                control.fire = true;
                break;

        };
    };
    window.addEventListener("keydown", OnKeyDown, false);


    function OnKeyUp(e) {

        switch (e.keyCode) {
            //MOVE
            case KeyCodes.Z:
                control.moveFoward = false;
                break;
            case KeyCodes.S:
                control.moveBack = false;
                break;
            case KeyCodes.Q:
                control.moveLeft = false;
                break;
            case KeyCodes.D:
                control.moveRight = false;
                break;

            //ROTATE
        	case KeyCodes.E:
        		control.rotateMore = false;
        		break;
        	case KeyCodes.A:
        		control.rotateLess = false;
        		break;

            //FIRE
            case KeyCodes.ArrowUp:
                control.fireFoward = false;
                break;
            case KeyCodes.ArrowDown:
                control.fireBack = false;
                break;
            case KeyCodes.ArrowLeft:
                control.fireLeft = false;
                break;
            case KeyCodes.ArrowRight:
                control.fireRight = false;
                break;
        };


        if (!control.moveFoward
            && !control.moveBack
            && !control.moveLeft
            && !control.moveRight) {
            control.move = false;
        };

        if (!control.rotateMore
            && !control.rotateLess) {
        	control.rotate = false;
        };

        if (!control.fireFoward
            && !control.fireBack
            && !control.fireLeft
            && !control.fireRight) {
        	control.fire = false;
        };
    };
    window.addEventListener("keyup", OnKeyUp, false);

    var hexagon;
    var onClickHandler = function (e) {
        var pick = game.scene.pick(e.clientX, e.clientY);

        if (hexagon)
            hexagon.script.Deselect();

        if (pick.pickedMesh && pick.pickedMesh.hexPosition) {
            hexagon = pick.pickedMesh;
            hexagon.script.Select();
            game.playerPosX = hexagon.hexPosition.x;
            game.playerPosZ = hexagon.hexPosition.z;
            //console.log(hexagon.hexPosition);
        }
    };

    window.addEventListener("pointerdown", onClickHandler, false);

   /* window.addEventListener("mousemove", function (e) {
        console.log(e.clientX, e.clientY);
    });*/
};

Control.KeyCodes = {
    Tab: 9,
    Shift: 16,
    Space: 32,
    Enter: 13,
    Escape: 27,
    ArrowLeft: 37,
    ArrowUp: 38,
    ArrowRight: 39,
    ArrowDown: 40,
    Delete: 46,
    A: 65,
    B: 66,
    C: 67,
    D: 68,
    E: 69,
    F: 70,
    G: 71,
    H: 72,
    I: 73,
    J: 74,
    K: 75,
    L: 76,
    M: 77,
    N: 78,
    O: 79,
    P: 80,
    Q: 81,
    R: 82,
    S: 83,
    T: 84,
    U: 85,
    V: 86,
    W: 87,
    X: 88,
    Y: 89,
    Z: 90
};