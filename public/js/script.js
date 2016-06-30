var game = new Phaser.Game(800, 600, Phaser.AUTO, 'phaser-example', { preload: preload, create: create });
var wabbit;

function preload() {

    game.load.image('bunny', 'assets/sprites/bunny.png');

}

function create() {

    wabbit = new MonsterBunny(1, game, 200, 300, 1, connection);
    wabbit.anchor.setTo(0.5, 0.5);

    var wabbit2 = new MonsterBunny(2, game, 600, 300, 0.5);
    wabbit2.anchor.setTo(0.5, 0.5);

    game.add.existing(wabbit);
    game.add.existing(wabbit2);

}
