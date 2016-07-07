//import Point from 'Point'
// import RemotePlayer from './frontend/game/sprites/RemotePlayer'
// import LocalPlayer from './frontend/game/sprites/LocalPlayer'
// import Firebase from 'firebase'

import 'pixi'
import 'p2'
import Phaser from 'phaser'

import BootState from './game/states/Boot'
import SplashState from './game/states/Splash'
import GameState from './game/states/Game'

class Game extends Phaser.Game {

  constructor () {

    //Initialize Firebase (Probably move this out)
    var config = {
      apiKey: "AIzaSyBm9d3jkeSRtS_WBC_Sy4D-2XG3WakalvM",
      authDomain: "project-4296942740685711854.firebaseapp.com",
      databaseURL: "https://project-4296942740685711854.firebaseio.com",
      storageBucket: "project-4296942740685711854.appspot.com",
    };
    firebase.initializeApp(config);


    // const serverName = '-KLj2XdwGG4aYO3MEH1J'
    // const db = firebase.database();
    // serverPath = '/gameServers/' + serverName + '/';
    // window.player.uid = db.ref().child( serverPath + 'players').push(defaultPlayerData).key;


    // let width = document.documentElement.clientWidth > 768 ? 768 : document.documentElement.clientWidth
    // let height = document.documentElement.clientHeight > 1024 ? 1024 : document.documentElement.clientHeight
    let width = 800
    let height = 600

    super(width, height, Phaser.AUTO, 'content', null)

    // Possible game states
    // # add(key, state, autoStart)
    this.state.add('Boot', BootState, false)
    this.state.add('Splash', SplashState, false)
    this.state.add('Game', GameState, false)

    this.state.start('Game')
  }

}

window.game = new Game()





// // Lobby stuff
// serverName = getUrlParameter('server');
//
// defaultServer = {
//   created_on: Date.now()
// };
//
// $('#add-server-link').on('click', function(){
//   firebase.database().ref().child('/gameServers').push(defaultServer);
// });
//
// firebase.database().ref('/gameServers').on('value', function(snap){
//   $('.rendered').remove();
//   Object.keys(snap.val()).forEach(function(server, kkey){
//     var temp_li = $('.template').clone();
//     $(temp_li).find('a').attr('href', ('?server=' +  server));
//     $(temp_li).find('a').text(server);
//     $(temp_li).removeClass('template');
//     $(temp_li).addClass('rendered');
//     $('.serverlist').append(temp_li);
//   });
// });


// if (serverName) {
//   var game = new Phaser.Game(800, 600, Phaser.CANVAS, 'snapdragon', { preload: preload, create: create });
//
//   var playerUnit;
//
//   window.player = { uid: null }
//   var db = firebase.database();
//   var defaultPlayerData = {
//     up: false,
//     down: false,
//     right: false,
//     left: false,
//     x: 0,
//     y: 0,
//   }
//
//
//   console.log(window.player.uid, ': connected and listening');
//
//
//
//
//
// }
