
Projectile = function (game, originX, originY, destX, destY) {

  Phaser.Sprite.call(this, game, originX, originY, 'beam_pink');

  this.moveSpeed = 700;
  this.keepAlive = 3000;

  game.physics.enable(this, Phaser.Physics.ARCADE);
  this.enableBody = true;
  this.anchor.set(0.5);
  
  //this.body.collideWorldBounds = true;


  //this.rotation = game.physics.arcade.moveToPointer(this, this.moveSpeed, game.input.activePointer);
  this.rotation = game.physics.arcade.moveToXY(this, destX, destY, this.moveSpeed);

  setTimeout(() => {
    this.destroy();
  }, this.keepAlive)
}

Projectile.prototype = Object.create(Phaser.Sprite.prototype);
Projectile.prototype.constructor = Projectile;

Projectile.prototype.update = function() {
    // this.rotation = game.physics.arcade.moveToPointer(this, 1000);
    //this.rotation = game.physics.arcade.moveToXY(this, this.targetX, this.targetY, this.moveSpeed);
    //this.angle = game.physics.arcade.angleToPointer(this);
    //game.physics.arcade.velocityFromAngle(this.angle, this.moveSpeed)

}
