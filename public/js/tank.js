
MonsterBunny = function (uid, game, x, y, connection) {

  Phaser.Sprite.call(this, game, x, y, 'bunny');

  // Object props
  this.isMovingUp = false;
  this.isMovingDown = false;
  this.isMovingRight = false;
  this.isMovingLeft = false;

  this.rotateSpeed = 6;
  game.physics.enable(this, Phaser.Physics.ARCADE);
  this.anchor.set(0.5);
  this.body.drag.set(0.1);
  this.body.maxVelocity.setTo(400, 400);
  this.body.collideWorldBounds = true;
  this.bringToTop();

  console.log('Creating MonsterBunny');

  // Init
  this.startListener(connection);
}

MonsterBunny.prototype = Object.create(Phaser.Sprite.prototype);
MonsterBunny.prototype.constructor = MonsterBunny;


MonsterBunny.prototype.startListener = function(connection){

  connection.onmessage = function (e) {
    console.log('server:', e.data);
    var serverCommandAsString = e.data;
    this.eval(serverCommandAsString)();
  }

}

MonsterBunny.prototype.update = function() {

    this.angle += this.rotateSpeed;

    if (this.isMovingUp == true){
      this.game.physics.arcade.velocityFromRotation(90, this.moveSpeed, this.body.velocity);
    } else {
      game.physics.arcade.velocityFromRotation(90, 0, this.body.velocity);
    }

}






Marine = function (uid, game) {

  Phaser.Sprite.call(this, game, 0, 0, 'marine');

  this.uid = uid;
  this.game = game;



  this.moveSpeed = 40;
  this.isMovingUp = false;
  this.isMovingDown = false;
  this.isMovingRight = false;
  this.isMovingLeft = false;

  //game.physics.enable(game, Phaser.Physics.ARCADE);
  //this.body.immovable = false;
  //this.body.collideWorldBounds = true;
  //this.body.bounce.setTo(1, 1);


  //game.physics.arcade.velocityFromRotation(this.tank.rotation, 100, this.body.velocity);


  // Sprites
  //this = game.add.sprite(x, y, 'enemy', 'tank1');
  //this.turret = game.add.sprite(x, y, 'enemy', 'turret'); // Will remove
  //this.turret = game.add.sprite(0, 0, 'this', 'turret');
  //this.turret.anchor.setTo(0.3, 0.5);


};

Marine.prototype = Object.create(Phaser.Sprite.prototype);
Marine.prototype.constructor = Marine;


Marine.prototype.create = function(){

  this.anchor.set(0.5);
  this.body.drag.set(0.1);
  this.body.maxVelocity.setTo(400, 400);
  tank.body.collideWorldBounds = true;

  this.bringToTop();
  //this.turret.bringToTop();

  this.game.add.sprite(0, 0, 'lol')


  this.game.camera.follow(marine);
  this.game.camera.deadzone = new Phaser.Rectangle(150, 150, 500, 300);
  this.game.camera.focusOnXY(0, 0);

}



Marine.prototype.update = function(){

  // if (this.moving == true) {
  //   game.physics.arcade.velocityFromRotation(turret.rotation, currentSpeed, tank.body.velocity);
  // } else {
  //   if (currentSpeed > 0) { currentSpeed -= 4; }
  // }



  // if (this.isMovingUp == true){
  //   this.game.physics.arcade.velocityFromRotation(90, this.moveSpeed, this.body.velocity);
  //   // tank.game.physics.arcade.velocityFromAngle(turret.rotation + 180 - ((tank.moving ? -45 : 0) + (tank.movingLeft ? 45 : 0)), baseSpeed, tank.body.velocity);
  // } else {
  //   game.physics.arcade.velocityFromRotation(0, this.moveSpeed, this.body.velocity);
  //   //stop moving left?
  // }

}

Marine.prototype.startListener = function(connection){

  connection.onmessage = function (e) {
    console.log('server:', e.data);
    var serverCommandAsString = e.data;
    this.eval(serverCommandAsString)();
  }

}
