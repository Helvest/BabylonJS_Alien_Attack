"use strict";

//Objet ZONE
function BaseObject(game, mesh) {
	this.game = game;
	this.mesh = mesh.clone();

	this.mesh.script = this;
	this.mesh.isVisible = true;
	game.shadow.getShadowMap().renderList.push(this.mesh);
	this.mesh.receiveShadows = true;

	var children = this.mesh.getChildren();
	var L = children.length;
	for (var i = 0; i < L; i++) {
		children[i].isVisible = true;
		game.shadow.getShadowMap().renderList.push(children[i]);
		children[i].receiveShadows = true;
	};

	this.alive = true;
};

BaseObject.prototype.Kill = function () {
    this.alive = false;
};

BaseObject.prototype.Destroy = function () {
    this.alive = false;
    this.mesh.script = null;
    this.mesh.dispose();
    this.mesh = null;
    this.game = null;
};

BaseObject.prototype.TriggerEnter = function () {
	this.Kill();
};





//Bullet ZONE
function Bullet(game, mesh, position, rotation, speed, damage, lifeTime, parent) {
    BaseObject.call(this, game, mesh);
    this.mesh.position = position.clone() || this.mesh.position;
    this.mesh.rotation = rotation.clone() || this.mesh.rotation;
    this.speed = speed || 1;
    this.damage = damage || 1;
    this.lifeTime = lifeTime || 1;
    this.parent = parent || null;
};
Bullet.prototype = Object.create(BaseObject.prototype);
Bullet.prototype.constructor = BaseObject;

Bullet.prototype.Update = function () {
    if (this.lifeTime > 0)
    {
        var time = this.game.time.deltaTime;
        this.mesh.locallyTranslate(new BABYLON.Vector3(time * this.speed, 0, 0));
        this.lifeTime -= time;
    }
    else
    {
        this.Kill();
    };
};

Bullet.prototype.Kill = function () {
	this.constructor.prototype.Kill.call(this);
	this.parent = null;
};

Bullet.prototype.TriggerEnter = function (other) {
	if (!other instanceof Bullet && other instanceof this.parent) {
		//rajouter compteur de point

		this.Kill();
	};
};




//Bonus ZONE
function Bonus(game, mesh) {
    BaseObject.call(this, game, mesh);
    this.lifeTime = 10;
    this._scaleVector = this.mesh.scaling.divide(new BABYLON.Vector3(this.lifeTime,this.lifeTime,this.lifeTime));
};
Bonus.prototype = Object.create(BaseObject.prototype);
Bonus.prototype.constructor = BaseObject;

Bonus.prototype.Update = function (other) {
	if (this.lifeTime > 0){
		this.lifeTime -= this.game.time.deltaTime;
		this.mesh.scaling = this._scaleVector.multiplyByFloats(this.lifeTime, this.lifeTime, this.lifeTime);
	}
	else
		this.Kill();
};

Bonus.prototype.TriggerEnter = function (other) {
	if (other instanceof Player) {
		other.Heal(25);
		this.Kill();
	};
};



//Destructible ZONE
function Destructible(game, mesh, lifes) {
    BaseObject.call(this, game, mesh);
    this._baseLifes = this.lifes = lifes || 1;

    this.mesh.actionManager = new BABYLON.ActionManager(this.game.scene);

};
Destructible.prototype = Object.create(BaseObject.prototype);
Destructible.prototype.constructor = BaseObject;


Destructible.prototype.Die = function () {
    //anime de mort puis kill
};

Destructible.prototype.TriggerEnter = function (objet) {
	if (objet instanceof Bullet && objet.parent != this) {
		this.lifes -= objet.damage;
		if (this.lifes <= 0) {
			this.Kill();
		};
	};
};


//SHIP ZONE
function Ship(game, mesh, lifes, speed, fireRate, bulletPrefab) {
	Destructible.call(this, game, mesh, lifes);

    this._baseSpeed = this.speed = speed || 1;
    this._fireRate = fireRate || 0;
    if (this._fireRate != 0)
    	this._fireRate = 1 / this._fireRate || 1;
    this.fireRate = 0;

    this.bulletPrefab = bulletPrefab || game.prefabs.laserBullet;
    this.canon = new BABYLON.Vector3.Zero();

};
Ship.prototype = Object.create(Destructible.prototype);
Ship.prototype.constructor = Destructible;

Ship.prototype.direction = new Array();
Ship.prototype.direction.Foward = new BABYLON.Vector3(0, 0, 0);
Ship.prototype.direction.Back = new BABYLON.Vector3(0, Math.PI, 0);
Ship.prototype.direction.Right = new BABYLON.Vector3(0, Math.PI / 2, 0);
Ship.prototype.direction.Left = new BABYLON.Vector3(0, -Math.PI / 2, 0);
Ship.prototype.direction.FowardRight = new BABYLON.Vector3(0, Math.PI / 4, 0);
Ship.prototype.direction.FowardLeft = new BABYLON.Vector3(0, -Math.PI / 4, 0);
Ship.prototype.direction.BackRight = new BABYLON.Vector3(0, Math.PI - Math.PI / 4, 0);
Ship.prototype.direction.BackLeft = new BABYLON.Vector3(0, Math.PI + Math.PI / 4, 0);

Ship.prototype.Update = function () {
	if (this._fireRate != 0)
		this.fireRate = this.fireRate - this.game.time.deltaTime;
};

Ship.prototype.FireIn = function (direction) {
	if (this.fireRate < 0) {
		this.fireRate = this._fireRate;
		var bullet = new Bullet(this.game, this.bulletPrefab, this.mesh.position, direction, 16, 1, 1, this)
		this.game.objets.push(bullet);
	};
};

Ship.prototype.Move = function () {
	this.mesh.locallyTranslate(new BABYLON.Vector3(0, 0, this.game.time.deltaTime * this.speed));
};

Ship.prototype.MoveIn = function (direction) {
	var move = this.speed * this.game.time.deltaTime;
	this.mesh.position.x += direction.x * move;
	this.mesh.position.z += direction.z * move;
};

Ship.prototype.PositionToDirection = function (position) {
	var direction = position.subtract(this.mesh.position);
	direction.normalize();

	return direction;
};

Ship.prototype.DirectionToRotation = function (direction) {
	return new BABYLON.Vector3(0, Math.atan2(direction.x, direction.z) - Math.PI/2, 0);
};


//SONDE ZONE
function Sonde(game, mesh, lifes, speed) {
	Ship.call(this, game, mesh, lifes, speed);

	this._baseLifes = this.lifes = lifes || Math.random() * 9 + 1;
	this._baseSpeed = this.speed = speed || Math.random() * 9 + 1;

	this.mesh.actionManager = new BABYLON.ActionManager(this.game.scene);

	this.mesh.rotation.y = Math.random() * Math.PI * 2;
};
Sonde.prototype = Object.create(Ship.prototype);
Sonde.prototype.constructor = Ship;

Sonde.prototype.Update = function () {
	this.Move();
};

Sonde.prototype.Kill = function () {
	this.constructor.prototype.Kill.call(this);

	var bonus = new Bonus(this.game, this.game.prefabs.bonus);
	bonus.mesh.position = this.mesh.position.clone();
	this.game.objets.push(bonus);
};



//PLAYER ZONE
function Player(game, mesh, lifes, speed, fireRate) {
    Ship.call(this, game, mesh, lifes, speed, fireRate);

    this._positionY = this.mesh.position.y;

    this.cameraPoint = new BABYLON.Vector3(0, this._positionY, 0);

    this.RotateY(0);
};
Player.prototype = Object.create(Ship.prototype);
Player.prototype.constructor = Ship;

Player.prototype.Move = function (x, z) {
	var move = this.game.time.deltaTime * this.speed;
	this.mesh.locallyTranslate(new BABYLON.Vector3(move * x, 0, move * z));
};

Player.prototype.Fire = function (x, z) {
    if (this.fireRate <= 0) {
        if (x == -1) {
            if (z == -1) {
            	this.canon.copyFrom(this.direction.FowardLeft);
            }
            else if (z == 1) {
            	this.canon.copyFrom(this.direction.BackLeft);
            }
            else {
            	this.canon.copyFrom(this.direction.Left);
            };
        }
        else if (x == 1) {
            if (z == -1) {
            	this.canon.copyFrom(this.direction.FowardRight);
            }
            else if (z == 1) {
            	this.canon.copyFrom(this.direction.BackRight);
            }
            else {
            	this.canon.copyFrom(this.direction.Right);
            };
        }
        else {
            if (z == -1) {
            	this.canon.copyFrom(this.direction.Foward);
            }
            else if (z == 1) {
            	this.canon.copyFrom(this.direction.Back);
            };
        };

        this.canon.y += this.mesh.rotation.y + Math.PI / 2;
    
        this.fireRate = this._fireRate;
        var bullet = new Bullet(this.game, this.bulletPrefab, this.mesh.position, this.canon, 16, 1, 1, this);
        this.game.objets.push(bullet);
    };
};

Player.prototype.Update = function () {
	this.constructor.prototype.Update.call(this);
	this.mesh.position.y = this._positionY + 0.2 * Math.cos(this.game.time.allTime * 1.3);

	this.cameraPoint.x = this.mesh.position.x;
	this.cameraPoint.z = this.mesh.position.z;
};

Player.prototype.Heal = function (life) {
	this.lifes += life;
	if (this.lifes > this._lifes) {
		this.lifes = this._lifes;
	};
};

Player.prototype.TriggerEnter = function (objet) {
	if (objet instanceof Bullet && objet.parent != this) {
		this.lifes -= objet.damage;
	}
	else if (objet instanceof Enemy) {
		this.lifes--;
	}
	else if (objet instanceof Bonus) {

	};

	if (this.lifes <= 0) {
		this.Kill();
	};
};

Player.prototype.RotateY = function (rotation) {
	this.mesh.rotation.y += rotation * Math.PI * 2;

	this.mesh.rotation.y %= Math.PI * 2;
	this.game.camera.alpha = -this.mesh.rotation.y - Math.PI/2;

};

Player.prototype.Destroy = function () {
	this.alive = false;
	this.mesh.isVisible = false;
};


//ENEMY ZONE
function Enemy(game, mesh, lifes, speed, fireRate, bulletPrefab) {
	Ship.call(this, game, mesh, lifes, speed, fireRate, bulletPrefab);

	this.randomIA = Math.random() * Math.PI * 2;
};
Enemy.prototype = Object.create(Ship.prototype);
Enemy.prototype.constructor = Ship;

Enemy.prototype.Update = function () {
	this.constructor.prototype.Update.call(this);

	var playerPosition = this.game.player.mesh.position;
	var playerDistance = BABYLON.Vector3.Distance(playerPosition, this.mesh.position);
	var playerDirection = this.PositionToDirection(playerPosition);
	var playerRotationTo = this.DirectionToRotation(playerDirection);

	this.mesh.rotation = BABYLON.Vector3.Lerp(this.mesh.rotation, playerRotationTo, 1);

	//bouger IA
	if (playerDistance > 10)
		this.MoveIn(playerDirection);
	else {
		var position = playerPosition.clone();
		position.x += Math.cos(this.game.time.allTime + this.randomIA) * 10;
		position.z += Math.sin(this.game.time.allTime + this.randomIA) * 10;
		var direction = this.PositionToDirection(position);
		this.MoveIn(direction);
	};

	//tirer sur player
	this.FireIn(playerRotationTo);
};

Enemy.prototype.TriggerEnter = function (objet) {
	if (objet instanceof Bullet && objet.parent instanceof Player) {
		this.lifes -= objet.damage;
	}
	else if (objet instanceof Player) {
		this.lifes--;
	};

	if (this.lifes <= 0) {
		this.Kill();
	};
};


//ENEMY ZONE
function Enemy2(game, mesh, lifes, speed, fireRate, bulletPrefab) {
	Enemy.call(this, game, mesh, lifes, speed, fireRate, bulletPrefab);
};
Enemy2.prototype = Object.create(Enemy.prototype);
Enemy2.prototype.constructor = Enemy;

Enemy2.prototype.Update = function () {

	var playerPosition = this.game.player.mesh.position;
	var playerDistance = BABYLON.Vector3.Distance(playerPosition, this.mesh.position);
	var playerDirection = this.PositionToDirection(playerPosition);
	var playerRotationTo = this.DirectionToRotation(playerDirection);

	this.mesh.rotation = BABYLON.Vector3.Lerp(this.mesh.rotation, playerRotationTo, 1);

	//bouger IA
	this.MoveIn(playerDirection);

	//tirer sur player
	this.FireIn(playerRotationTo);
};