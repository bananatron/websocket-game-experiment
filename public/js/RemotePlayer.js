

var compareCords = function(remotePlayer, dbSnap){
  console.log(remotePlayer, dbSnap)
  if (remotePlayer.x != dbSnap.x && remotePlayer.y != dbSnap.y){
    remotePlayer.x = dbSnap.x;
    remotePlayer.y = dbSnap.y;
  }
};

RemotePlayer = function (uid, game, x, y) {

  Phaser.Sprite.call(this, game, x, y, '_blank');

  this.act = {}; // Where action indexs are stored for animation lookup

  // Idle Down animation
  this.addChild(game.make.sprite(-(this.width/2), -(this.height/2), 'marine_idle_down'));
  this.act['IDLE_DOWN'] = 0;
  this.children[0].visible = false;
  this.children[0].animations.add('start');

  // Idle Up animation
  this.addChild(game.make.sprite(-(this.width/2), -(this.height/2), 'marine_idle_up'));
  this.act['IDLE_UP'] = 1;
  this.children[1].visible = false;
  this.children[1].animations.add('start');

  // Walking Down animation
  this.addChild(game.make.sprite(-(this.width/2), -(this.height/2), 'marine_walk_down'));
  this.act['WALK_UP'] = 2;
  this.children[2].visible = false;
  this.children[2].animations.add('start');

  // Walking Up animation
  this.addChild(game.make.sprite(-(this.width/2), -(this.height/2), 'marine_walk_up'));
  this.act['WALK_DOWN'] = 3;
  this.children[3].visible = false;
  this.children[3].animations.add('start');

  // Rolling animation
  this.addChild(game.make.sprite(-(this.width/2), -(this.height/2), 'marine_roll'));
  this.act['ROLL'] = 4;
  this.children[4].visible = false;
  this.children[4].animations.add('start');

  // Object props
  this.isMovingUp = false;
  this.isMovingDown = false;
  this.isMovingRight = false;
  this.isMovingLeft = false;

  game.physics.enable(this, Phaser.Physics.ARCADE);
  this.moveSpeed = 2;
  this.anchor.set(0.5);
  this.body.drag.set(1);
  this.body.maxVelocity.setTo(600, 600);
  this.body.collideWorldBounds = true;
  //this.bringToTop();

  console.log('Creating RemotePlayer');

  // Init
  this.startListener(db, uid);
  this.startAnimation('IDLE_DOWN');
}

RemotePlayer.prototype = Object.create(Phaser.Sprite.prototype);
RemotePlayer.prototype.constructor = RemotePlayer;

RemotePlayer.prototype.startAnimation = function(action, speed){
  var speed = speed || 12;
  this.children.forEach(function(child_sprite){
    child_sprite.visible = false; // Hide all other children
  });
  this.children[this.act[action]].visible = true; // Make our action visible
  this.children[this.act[action]].play('start', speed); // Play our animation
};


RemotePlayer.prototype.startListener = function(db, uid){

  var playerListenPath = firebase.database().ref(serverPath + 'players/' + uid);

  playerListenPath.on('value', (snap) => {

    if (snap.val().x != this.x) this.x = snap.val().x;
    if (snap.val().y != this.y) this.y = snap.val().y;
    // ^ TODO Interpolate here instead of direct set

    if (snap.val().up == true) {
      this.isMovingUp = true;
    } else {
      this.isMovingUp = false;
    }

    if (snap.val().right == true) {
      this.isMovingRight = true;
    } else {
      this.isMovingRight = false;
    }

    if (snap.val().left == true) {
      this.isMovingLeft = true;
    } else {
      this.isMovingLeft = false;
    }

    if (snap.val().down == true) {
      this.isMovingDown = true;
    } else {
      this.isMovingDown = false;
    }

  });
}

RemotePlayer.prototype.update = function() {

    //this.z = -(this.game.physics.arcade.distanceToXY(this, this.x, 0));
    var walking = false;
    if (this.isMovingLeft){
        this.x -= this.moveSpeed;
        walking = true;
    }
    else if (this.isMovingRight){
        this.x += this.moveSpeed;
        walking = true;
    }

    if (this.isMovingUp == true){
        this.y -= this.moveSpeed;
        walking = true;
    }
    else if (this.isMovingDown){
        this.y += this.moveSpeed;
        walking = true;
    }

    if (this.isMovingDown == false && this.isMovingUp == false && this.isMovingRight == false && this.isMovingLeft == false){
      walking = false;
    }

    // TODO Directional information for remote players

    if (walking == true) {
      if (game.input.activePointer.position.y > this.position.y){
        this.startAnimation('WALK_UP');
      } else {
        this.startAnimation('WALK_DOWN');
      }
    } else {
      if (game.input.activePointer.position.y < this.position.y){
        this.startAnimation('IDLE_UP', 2);
      } else {
        this.startAnimation('IDLE_DOWN', 4);
      }
    }

}
