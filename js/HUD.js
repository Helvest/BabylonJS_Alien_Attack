
function Menu(game) {
	game.render = Nothing;
	setTimeout(function () {
		/* GUI CREATION when all texture are loaded*/
		var gui = game.guiMenu = new bGUI.GUISystem(game.scene, game.engine.getRenderWidth(), game.engine.getRenderHeight());
		gui.enableClick();

		var menu = game.menu = [];

		menu.texts = new bGUI.GUIGroup("text", gui);
		// Title
		menu.start = new bGUI.GUIText("start", 256, 128, { font: "40px Segoe UI", text: "START", color: "#cecb7a" }, gui);
		menu.start.relativePosition(new BABYLON.Vector3(0.5, 0.5, 0));
		menu.texts.add(HUD.score);

		menu.start.onClick = function () {
			gui.dispose()
			Level(game);
		};

		gui.updateCamera();

	}, 10);
};

function HUD(game) {

	var HUD = game.hud = [];

	HUD.isReady = false;

	setTimeout(function () {
		/* GUI CREATION when all texture are loaded*/
		var gui = game.guiHUD = new bGUI.GUISystem(game.scene, game.engine.getRenderWidth(), game.engine.getRenderHeight());

		// bGUI logo
		HUD.barDeVie = new bGUI.GUIPanel("bar", game.images["bar"], null, gui);
		HUD.barDeVie.relativePosition(new BABYLON.Vector3(0.1, 0.05, 0));
		//HUD.barDeVie.mesh.scaling.x = 100;

		HUD.texts = new bGUI.GUIGroup("text", gui);

		HUD.score = new bGUI.GUIText("score", 500, 200, { font: "40px Segoe UI", text: "SCORE: 0", color: "#cecb7a" }, gui);
		HUD.score.relativePosition(new BABYLON.Vector3(0.91, 0.05, 0));
		HUD.texts.add(HUD.score);

		HUD.gameover = new bGUI.GUIText("gameover", 500, 200, { font: "40px Segoe UI", text: "GAME OVER", color: "#cecb7a" }, gui);
		HUD.gameover.relativePosition(new BABYLON.Vector3(0.4, 0.5, 0));
		HUD.texts.add(HUD.gameover);

		HUD.gameover.setVisible(false, false);
		//HUD.barDeVie.setVisible(false, false);
		//HUD.score.setVisible(false, false);


		/*HUD.forEach(function (element) {
			console.log(element);
			element.setVisible(false, false);
		});*/

		gui.updateCamera();

		HUD.isReady = true;

		game.hud.barDeVie.max = game.hud.barDeVie.mesh.scaling.x;

	}, 10);
};