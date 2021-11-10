var boot = function(game){}

boot.prototype = {
	preload: function(){
  	this.game.load.image("loading","assets/sprites/loading.png");
	},
	create: function(){
		//for resizing our game
		this.game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
		this.game.scale.pageAlignVertically = true;
		this.game.scale.pageAlignHorizontally = true;

		this.game.state.start("Preload");
	}
}
