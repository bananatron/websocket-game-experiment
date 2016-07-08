import Phaser from 'phaser'
import Firebase from 'firebase'

export default class extends Phaser.Sprite {

  constructor (game, x, y, asset, uid, serverName) {
    const db = firebase.database()
    const UPDATE_INTERVAL = 4000

    super(game, x, y, asset)
    console.log('Creating LocalPlayer')

    //this.serverName = serverName
    serverName = '-KLj2XdwGG4aYO3MEH1J' // TODO STUBBED
    this.serverName = serverName
    this.uid = uid

    this.moveSpeed = 2
    this.anchor.setTo(0.5)
    game.physics.enable(this, Phaser.Physics.ARCADE)

    this.isMovingUp = false
    this.isMovingDown = false
    this.isMovingRight = false
    this.isMovingLeft = false

    this.body.drag.set(1)
    this.body.maxVelocity.setTo(600, 600)
    this.body.collideWorldBounds = true

    const serverPath = `/gameServers/${serverName}/players/${this.uid}`
    setInterval(() => {
      firebase.database().ref(serverPath).update({
        x: this.x,
        y: this.y
      })
    }, UPDATE_INTERVAL);


    this.keyboardInit(this); //TODO
    this.act = {}; // Where action indexs are stored for animation lookup

    // Idle Down animation
    this.addChild(game.make.sprite(-(this.width/2), -(this.height/2), 'marine_idle_down'))
    this.act['IDLE_DOWN'] = 0
    this.children[0].visible = false
    this.children[0].animations.add('start')

    // Idle Up animation
    this.addChild(game.make.sprite(-(this.width/2), -(this.height/2), 'marine_idle_up'))
    this.act['IDLE_UP'] = 1
    this.children[1].visible = false
    this.children[1].animations.add('start')

    // Walking Down animation
    this.addChild(game.make.sprite(-(this.width/2), -(this.height/2), 'marine_walk_down'))
    this.act['WALK_UP'] = 2
    this.children[2].visible = false
    this.children[2].animations.add('start')

    // Walking Up animation
    this.addChild(game.make.sprite(-(this.width/2), -(this.height/2), 'marine_walk_up'))
    this.act['WALK_DOWN'] = 3
    this.children[3].visible = false
    this.children[3].animations.add('start')

    // Rolling animation
    this.addChild(game.make.sprite(-(this.width/2), -(this.height/2), 'marine_roll'))
    this.act['ROLL'] = 4
    this.children[4].visible = false
    this.children[4].animations.add('start')

    // Init
    this.startListener()
  }

  update () {
    var walking = false;
    if (this.isMovingLeft){
        this.x -= this.moveSpeed
        walking = true
    }
    else if (this.isMovingRight){
        this.x += this.moveSpeed
        walking = true
    }

    if (this.isMovingUp == true){
        this.y -= this.moveSpeed
        walking = true
    }
    else if (this.isMovingDown){
        this.y += this.moveSpeed
        walking = true
    }

    if (this.isMovingDown == false && this.isMovingUp == false && this.isMovingRight == false && this.isMovingLeft == false){
      walking = false
    }

    // Mouse pointer flipping
    if (game.input.activePointer.x > game.camera.width/2){
      this.scale.x = 1
    } else {
      this.scale.x = -1
    }

    if (walking == true) {
      if (game.input.activePointer.y > game.camera.height/2){
        this.startAnimation('WALK_UP')
      } else {
        this.startAnimation('WALK_DOWN')
      }
    } else {
      if (game.input.activePointer.y < game.camera.height/2){
        this.startAnimation('IDLE_UP', 2)
      } else {
        this.startAnimation('IDLE_DOWN', 4)
      }
    }

    // TODO
    // if (this.isRolling == true){
    //   // TODO jolt in direction you are facing without control for short period of time
    //   this.startAnimation('ROLL');
    // }
  }

  startAnimation (action, speed){
    speed = speed || 12
    this.children.forEach(function(child_sprite){
      child_sprite.visible = false // Hide all other children
    });
    this.children[this.act[action]].visible = true // Make our action visible
    this.children[this.act[action]].play('start', speed) // Play our animation
  }

  startListener () {
    // debugger;
    const serverPath = `gameServers/${this.serverName}/players/${this.uid}`

    firebase.database().ref(serverPath).on('value', (snap) => {
      if (snap.val().up == true) {
        this.isMovingUp = true
      } else {
        this.isMovingUp = false
      }

      if (snap.val().right == true) {
        this.isMovingRight = true
      } else {
        this.isMovingRight = false
      }

      if (snap.val().left == true) {
        this.isMovingLeft = true
      } else {
        this.isMovingLeft = false
      }

      if (snap.val().down == true) {
        this.isMovingDown = true
      } else {
        this.isMovingDown = false
      }

    })
  }

  keyboardInit (playerUnit){
    //const serverName = playerUnit.serverName
    const db = firebase.database(); //TODO use instance variable probably
    const serverPath = `/gameServers/${this.serverName}/players/${this.uid}`

    // MOUSE
    const mouseDown = function(){
      var originX = (playerUnit.x + playerUnit.width/2) // Gun origin
      var originY = playerUnit.y+14
      //TODO mainGroup.add(new Projectile(game, originX, originY, game.input.activePointer.worldX, game.input.activePointer.worldY));
    }

    const upKey = game.input.keyboard.addKey(Phaser.Keyboard.UP)
    const downKey = game.input.keyboard.addKey(Phaser.Keyboard.DOWN)
    const leftKey = game.input.keyboard.addKey(Phaser.Keyboard.LEFT)
    const rightKey = game.input.keyboard.addKey(Phaser.Keyboard.RIGHT)

    //http://keycode.info/
    const wKey = game.input.keyboard.addKey(87)
    const aKey = game.input.keyboard.addKey(65)
    const sKey = game.input.keyboard.addKey(83)
    const dKey = game.input.keyboard.addKey(68)


    game.input.onDown.add(mouseDown, this);

    // UP
    upKey.onDown.add(function() {
      db.ref(serverPath).update({ up: true })
    });
    upKey.onUp.add(function() {
      db.ref(serverPath).update({ up: false })
    });
    wKey.onDown.add(function() {
      db.ref(serverPath).update({ up: true })
    });
    wKey.onUp.add(function() {
      db.ref(serverPath).update({ up: false })
    });

    // DOWN
    downKey.onDown.add(function() {
      db.ref(serverPath).update({ down: true })
    });
    downKey.onUp.add(function() {
      db.ref(serverPath).update({ down: false })
    });
    sKey.onDown.add(function() {
      db.ref(serverPath).update({ down: true })
    });
    sKey.onUp.add(function() {
      db.ref(serverPath).update({ down: false })
    });


    // LEFT
    leftKey.onDown.add(function() {
      db.ref(serverPath).update({ left: true })
    });
    leftKey.onUp.add(function() {
      db.ref(serverPath).update({ left: false })
    });
    aKey.onDown.add(function() {
      db.ref(serverPath).update({ left: true })
    });
    aKey.onUp.add(function() {
      db.ref(serverPath).update({ left: false })
    });

    // RIGHT
    rightKey.onDown.add(function() {
      db.ref(serverPath).update({ right: true })
    });
    rightKey.onUp.add(function() {
      db.ref(serverPath).update({ right: false })
    });
    dKey.onDown.add(function() {
      db.ref(serverPath).update({ right: true })
    });
    dKey.onUp.add(function() {
      db.ref(serverPath ).update({ right: false })
    });

  }

}
