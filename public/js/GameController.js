
GameController = function (game, x, y) {
  console.log('Creating GameController');
  Phaser.Sprite.call(this, game, x, y, '_blank');

  // Init
  //this.startListener(db, uid);
}

GameController.prototype = Object.create(Phaser.Sprite.prototype);
GameController.prototype.constructor = GameController;

GameController.prototype.startListener = function(db, uid){
  
}

GameController.prototype.update = function() {
  mainGroup.sort('y', Phaser.Group.SORT_ASCENDING);
}
