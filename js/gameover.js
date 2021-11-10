var gameOver = function(game) {
  this.message;
	this.score;
  this.spaceKey;
}

gameOver.prototype = {
  init: function(deathMessage, score) {
    this.message = deathMessage;
		this.score = score;
  },
  create: function() {
		this.game.world.setBounds(0, 0, w, h);
    this.game.stage.backgroundColor = '#101010';

    var targetTextWidth = w * 0.6;
    var textMultiplier = targetTextWidth/835;

		if (this.score >= localStorage["highScore"] || localStorage["highScore"] == null) {
			localStorage["highScore"] = this.score;
		}

    if (this.message == 'Blue, you died!') {
      var text = this.game.add.text(w/2, h/5, this.message, {
        font: "65px Open Sans, sans-serif",
        fill: "#2271AB",
        align: "center"
      });
    } else {
      var text = this.game.add.text(w/2, h/5, this.message, {
        font: "65px Open Sans, sans-serif",
        fill: "#E1008C",
        align: "center"
      });
    }
		text.anchor.setTo(0.5, 0.5);

		var scoreText = this.game.add.text(w/2, 2*h/5, 'Score: '+this.score, {
			font: "65px Open Sans, sans-serif",
			fill: "#FFFFFF",
			align: "center"
		});
		scoreText.anchor.setTo(0.5, 0.5);
		var highScoreText = this.game.add.text(w/2, 3*h/5, 'Highscore: '+localStorage["highScore"], {
			font: "65px Open Sans, sans-serif",
			fill: "#FFFFFF",
			align: "center"
		});
		highScoreText.anchor.setTo(0.5, 0.5);
    var resetText = this.game.add.text(w/2, 4*h/5, 'Press space to restart (do it!)', {
      font: "65px Open Sans, sans-serif",
      fill: "#FFFFFF",
      align: "center"
    });
    resetText.anchor.setTo(0.5, 0.5);
    resetText.scale.setTo(textMultiplier, textMultiplier);
    scoreText.scale.setTo(textMultiplier, textMultiplier);
    highScoreText.scale.setTo(textMultiplier, textMultiplier);
    text.scale.setTo(textMultiplier, textMultiplier);

    this.spaceKey = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
  },
  update: function() {
    this.spaceKey.onDown.add(this.restart, this);
  },
  restart: function() {
    this.game.state.start("Main");
  }
}
