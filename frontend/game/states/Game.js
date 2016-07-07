/* globals __DEV__ */
import Phaser from 'phaser'
import RemotePlayer from '../sprites/RemotePlayer'
import LocalPlayer from '../sprites/LocalPlayer'
import Firebase from 'firebase'


export default class extends Phaser.State {
  init () {
    //const serverName = '-KLj2XdwGG4aYO3MEH1J'
    //const serverPath = '/gameServers/' + serverName + '/';
    //window.player.uid = db.ref().child( serverPath + 'players').push(defaultPlayerData).key;

    let width = document.documentElement.clientWidth > 768 ? 768 : document.documentElement.clientWidth
    let height = document.documentElement.clientHeight > 1024 ? 1024 : document.documentElement.clientHeight
  }

  preload () {
    game.load.spritesheet('_blank', '/sprites/blank.png', 96, 96, 0);
    game.load.spritesheet('beam_pink', '/sprites/beam_pink.png', 15, 3);
    game.load.spritesheet('marine_roll', '/sprites/marine_roll.png', 96, 96, 11);
    game.load.spritesheet('marine_walk_down', '/sprites/marine_walk_down.png', 96, 96, 5);
    game.load.spritesheet('marine_walk_up', '/sprites/marine_walk_up.png', 96, 96, 5);
    game.load.spritesheet('marine_idle_up', '/sprites/marine_idle_up.png', 96, 96);
    game.load.spritesheet('marine_idle_down', '/sprites/marine_idle_down.png', 96, 96);
    game.load.image('debug_background','/tileSprites/debug-grid-1920x1920.png');
  }

  create () {
    const uid = 'some_uid'
    const db = firebase.database();

    // Game setup
    game.add.tileSprite(0, 0, 1920, 1920, 'debug_background');
    game.stage.backgroundColor = "#e0e4f1";
    game.world.setBounds(0, 0, 1920, 1920);
    game.stage.disableVisibilityChange = true;

    const upKey = game.input.keyboard.addKey(Phaser.Keyboard.UP);
    const downKey = game.input.keyboard.addKey(Phaser.Keyboard.DOWN);
    const leftKey = game.input.keyboard.addKey(Phaser.Keyboard.LEFT);
    const rightKey = game.input.keyboard.addKey(Phaser.Keyboard.RIGHT);

    //http://keycode.info/
    const wKey = game.input.keyboard.addKey(87);
    const aKey = game.input.keyboard.addKey(65);
    const sKey = game.input.keyboard.addKey(83);
    const dKey = game.input.keyboard.addKey(68);


    //  This group will hold the players and actionable objects
    const mainGroup = game.add.group();

    // window.remotePlayers = [];
    //
    // const serverPath = '/gameServers/-KLj2XdwGG4aYO3MEH1J/'
    // db.ref(serverPath + 'players').on('child_added', function(snap){
    //   if (snap.key == uid) return; // Don't add yourself
    //   var remotePlayerData = snap.val();
    //   console.log(snap.key, remotePlayerData);
    //
    //   var new_player = new RemotePlayer(game, remotePlayerData.x, remotePlayerData.y, '_some_other_uid');
    //   remotePlayers.push(new_player);
    //   // new_player.anchor.setTo(remotePlayerData.x, remotePlayerData.y);
    //   mainGroup.add(new_player);
    // })

    const localUnit = new LocalPlayer(game, game.world.centerX, game.world.centerY, '_blank', 'x_some_uid');
    localUnit.anchor.setTo(0, 0);
    //game.add.existing(playerUnit);
    mainGroup.add(localUnit)

    //gameCamera = new Phaser.Camera(game, 1, playerUnit.x, playerUnit.y, 800, 600);
    game.camera.follow(localUnit)
  }

  render () {
    // if (__DEV__) {
    //   this.game.debug.spriteInfo(this.mushroom, 32, 32)
    // }
  }
}
