
// Lobby stuff
serverName = getUrlParameter('server');

defaultServer = {
  created_on: Date.now()
};

$('#add-server-link').on('click', function(){
  firebase.database().ref().child('/gameServers').push(defaultServer);
});

firebase.database().ref('/gameServers').on('value', function(snap){
  $('.rendered').remove();
  Object.keys(snap.val()).forEach(function(server, kkey){
    var temp_li = $('.template').clone();
    $(temp_li).find('a').attr('href', ('?server=' +  server));
    $(temp_li).find('a').text(server);
    $(temp_li).removeClass('template');
    $(temp_li).addClass('rendered');
    $('.serverlist').append(temp_li);
  });
});


if (serverName) {
  var game = new Phaser.Game(800, 600, Phaser.CANVAS, 'snapdragon', { preload: preload, create: create });

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

  serverPath = '/gameServers/' + serverName + '/';

  window.player.uid = db.ref().child( serverPath + 'players').push(defaultPlayerData).key;
  console.log(window.player.uid, ': connected and listening');


  function preload() {
    // All sprite frames 96 x 96
    game.load.spritesheet('_blank', '/sprites/blank.png', 96, 96, 0);
    game.load.spritesheet('beam_pink', '/sprites/beam_pink.png', 15, 3);
    game.load.spritesheet('marine_roll', '/sprites/marine_roll.png', 96, 96, 11);
    game.load.spritesheet('marine_walk_down', '/sprites/marine_walk_down.png', 96, 96, 5);
    game.load.spritesheet('marine_walk_up', '/sprites/marine_walk_up.png', 96, 96, 5);
    game.load.spritesheet('marine_idle_up', '/sprites/marine_idle_up.png', 96, 96);
    game.load.spritesheet('marine_idle_down', '/sprites/marine_idle_down.png', 96, 96);
    game.load.image('debug_background','/tileSprites/debug-grid-1920x1920.png');
  }


  function create() {

    // Game setup
    game.add.tileSprite(0, 0, 1920, 1920, 'debug_background');
    game.stage.backgroundColor = "#e0e4f1";
    game.world.setBounds(0, 0, 1920, 1920);
    game.stage.disableVisibilityChange = true;

    upKey = game.input.keyboard.addKey(Phaser.Keyboard.UP);
    downKey = game.input.keyboard.addKey(Phaser.Keyboard.DOWN);
    leftKey = game.input.keyboard.addKey(Phaser.Keyboard.LEFT);
    rightKey = game.input.keyboard.addKey(Phaser.Keyboard.RIGHT);

    //http://keycode.info/
    wKey = game.input.keyboard.addKey(87);
    aKey = game.input.keyboard.addKey(65);
    sKey = game.input.keyboard.addKey(83);
    dKey = game.input.keyboard.addKey(68);


    // New gameController which controls all global data
    gameController = new GameController(game, 0, 0);
    game.add.existing(gameController);

    //  This group will hold the players and actionable objects
    mainGroup = game.add.group();

    window.remotePlayers = [];

    db.ref(serverPath + 'players').on('child_added', function(snap){
      if (snap.key == window.player.uid) return; // Don't add yourself
      var remotePlayerData = snap.val();
      console.log(snap.key, remotePlayerData);

      var new_player = new RemotePlayer(snap.key, game, remotePlayerData.x, remotePlayerData.y);
      remotePlayers.push(new_player);
      // new_player.anchor.setTo(remotePlayerData.x, remotePlayerData.y);
      mainGroup.add(new_player);
    });

    playerUnit = new PlayerUnit(window.player.uid, game, game.world.centerX, game.world.centerY, 1);
    playerUnit.anchor.setTo(0, 0);
    //game.add.existing(playerUnit);
    mainGroup.add(playerUnit);

    //gameCamera = new Phaser.Camera(game, 1, playerUnit.x, playerUnit.y, 800, 600);
    game.camera.follow(playerUnit);
  }
}
