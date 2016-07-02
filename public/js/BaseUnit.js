
var keyboardInit = function(){
  // UP
  upKey.onDown.add(function() {
    db.ref('players/' + window.player.uid).update({ up: true })
  });
  upKey.onUp.add(function() {
    db.ref('players/' + window.player.uid).update({ up: false })
  });
  wKey.onDown.add(function() {
    db.ref('players/' + window.player.uid).update({ up: true })
  });
  wKey.onUp.add(function() {
    db.ref('players/' + window.player.uid).update({ up: false })
  });

  // DOWN
  downKey.onDown.add(function() {
    db.ref('players/' + window.player.uid).update({ down: true })
  });
  downKey.onUp.add(function() {
    db.ref('players/' + window.player.uid).update({ down: false })
  });
  sKey.onDown.add(function() {
    db.ref('players/' + window.player.uid).update({ down: true })
  });
  sKey.onUp.add(function() {
    db.ref('players/' + window.player.uid).update({ down: false })
  });


  // LEFT
  leftKey.onDown.add(function() {
    db.ref('players/' + window.player.uid).update({ left: true })
  });
  leftKey.onUp.add(function() {
    db.ref('players/' + window.player.uid).update({ left: false })
  });
  aKey.onDown.add(function() {
    db.ref('players/' + window.player.uid).update({ left: true })
  });
  aKey.onUp.add(function() {
    db.ref('players/' + window.player.uid).update({ left: false })
  });

  // RIGHT
  rightKey.onDown.add(function() {
    db.ref('players/' + window.player.uid).update({ right: true })
  });
  rightKey.onUp.add(function() {
    db.ref('players/' + window.player.uid).update({ right: false })
  });
  dKey.onDown.add(function() {
    db.ref('players/' + window.player.uid).update({ right: true })
  });
  dKey.onUp.add(function() {
    db.ref('players/' + window.player.uid).update({ right: false })
  });
}


BaseUnit = function (uid, game, x, y) {
  setInterval(() => {
    firebase.database().ref('players/' + uid).update({
      x: this.x,
      y: this.y
    })
  }, 1000);

  // Base units start with a blank sprite, and are filled with child sprites for each state
  // who's visiblity is toggled with 'startAnimation.'
  Phaser.Sprite.call(this, game, x, y, '_blank');

  keyboardInit();
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
  this.bringToTop();

  console.log('Creating BaseUnit');

  // Init
  this.startListener(db, uid);
}

BaseUnit.prototype = Object.create(Phaser.Sprite.prototype);
BaseUnit.prototype.constructor = BaseUnit;


BaseUnit.prototype.startAnimation = function(action, speed){
  var speed = speed || 12;
  this.children.forEach(function(child_sprite){
    child_sprite.visible = false; // Hide all other children
  });
  this.children[this.act[action]].visible = true; // Make our action visible
  this.children[this.act[action]].play('start', speed); // Play our animation
};


BaseUnit.prototype.startListener = function(db, uid){

  var playerListenPath = firebase.database().ref('players/' + uid);
  console.log('starting listener');

  playerListenPath.on('value', (snap) => {
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

BaseUnit.prototype.update = function() {

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

    // Mouse pointer flipping
    if (game.input.activePointer.position.x > this.position.x){
      this.scale.x = 1;
    } else {
      this.scale.x = -1;
    }

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


    // TODO NOT BASE
    // if (this.isRolling == true){
    //   // TODO jolt in direction you are facing without control for short period of time
    //   this.startAnimation('ROLL');
    // }

}
