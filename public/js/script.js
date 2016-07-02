var game = new Phaser.Game(800, 600, Phaser.AUTO, 'phaser-example', { preload: preload, create: create });
var playerUnit;

window.player = { uid: null }
var db = firebase.database();
var defaultPlayerData = {
  up: false,
  down: false,
  right: false,
  left: false,
  x: 0,
  y: 0,
}

window.player.uid = db.ref().child('/players').push(defaultPlayerData).key;
console.log(window.player.uid, ': connected and listening');


function preload() {
  // All sprite frames 96 x 96
  game.load.spritesheet('_blank', '/sprites/blank.png', 96, 96, 0);
  game.load.spritesheet('marine_roll', '/sprites/marine_roll.png', 96, 96, 11);
  game.load.spritesheet('marine_walk_down', '/sprites/marine_walk_down.png', 96, 96, 5);
  game.load.spritesheet('marine_walk_up', '/sprites/marine_walk_up.png', 96, 96, 5);
  game.load.spritesheet('marine_idle_up', '/sprites/marine_idle_up.png', 96, 96);
  game.load.spritesheet('marine_idle_down', '/sprites/marine_idle_down.png', 96, 96);
  game.stage.disableVisibilityChange = true;
}


function create() {
  upKey = game.input.keyboard.addKey(Phaser.Keyboard.UP);
  downKey = game.input.keyboard.addKey(Phaser.Keyboard.DOWN);
  leftKey = game.input.keyboard.addKey(Phaser.Keyboard.LEFT);
  rightKey = game.input.keyboard.addKey(Phaser.Keyboard.RIGHT);

  //http://keycode.info/
  wKey = game.input.keyboard.addKey(87);
  aKey = game.input.keyboard.addKey(65);
  sKey = game.input.keyboard.addKey(83);
  dKey = game.input.keyboard.addKey(68);



  db.ref('/players').on('child_added', function(snap){

    if (snap.key == window.player.uid) return;
    var remotePlayerData = snap.val();
    console.log(snap.key, remotePlayerData);

    var new_player = new RemotePlayer(snap.key, game, remotePlayerData.x, remotePlayerData.y);
    new_player.anchor.setTo(remotePlayerData.x, remotePlayerData.y);
    game.add.existing(new_player);
  });

  playerUnit = new BaseUnit(window.player.uid, game, 0, 0, 1);
  playerUnit.anchor.setTo(0, 0);
  game.add.existing(playerUnit);
}
