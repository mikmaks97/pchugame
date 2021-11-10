var main = function(game) {
  //global variable declarations------------------------------------------------
  //all group declarations
  this.backgroundGroup;
  this.leftBlocks;
  this.rightBlocks;
  this.leftEnemies;
  this.rightEnemies;
  this.playerBullets;

  //background
  this.leftBackground;
  this.divider;
  this.rightBackground;
  this.onlyFloor;

  //arrays of spcialty blocks
  this.regularBlocks = [];
  this.jumpBlocks = [];
  this.antiBlocks = [];

  //other variables
  this.score;
  this.playerAndBlockTargetWidth;
  this.playerAndBlockScaleMultiplier;
  this.topPlayer;
  this.previousBlueY;
  this.previousPurpleY;
  this.cameraSpeed;
  this.previousCameraHeight;
  this.currentPlayerPosition;
  this.randomYMultiplier;
  this.currentBlock;
  this.colliding;

  this.purpleBulletSpawned;
  this.blueBulletSpawned;
  this.purpleBulletKey;
  this.blueBulletKey;
  this.enemySpawned;
  this.purpleJumpKey;
  this.blueJumpKey;

  //particle variables
  this.particleEmitterBlue;
  this.particleEmitterPurple;
  this.rain;

  //sound variables
  this.notes = [8];
  this.pchu = [3];
  this.c;
  this.d;
  this.e;
  this.f;
  this.g;
  this.a;
  this.b;
  this.c2;
  this.explosion;
  this.pchu2;
  this.pchu3;
}

main.prototype = {
  //FUNCTION WE SET SHIT UP IN************************************************
  create: function() {
    //really important for restarts!!!!-----------------------------------------
    this.game.world.setBounds(0, 0, w, h);
    this.cameraSpeed = 0;
    this.previousCameraHeight = 0;
    this.currentPlayerPosition = h / 2;
    this.currentBlock = null;
    this.colliding = false;
    this.purpleBulletSpawned = false;
    this.blueBulletSpawned = false;
    this.enemySpawned = false;
    this.score = 0;

    this.game.stage.backgroundColor = '#ff0000';

    //calculate all scale multipliers (the real magic behind resizing the game)
    //I calculate the ratios between the width of the game and the objects in it using their default widths
    //I then use those ratios with the default widths to calculate the target width
    //Lastly, the scale multipliers are just the ratios of the target width/default width of objects
    var backgroundTargetWitdh = w * 0.491;
    var scaleMultiplier = backgroundTargetWitdh / 1156;

    var dividerTargetWidth = w * 0.0214;
    var dividerScaleMultiplier = dividerTargetWidth / 26;

    this.playerAndBlockTargetWidth = w * 0.0615;
    this.playerAndBlockScaleMultiplier = this.playerAndBlockTargetWidth / 46;

    //enable the Arcade Physics system
    this.game.physics.startSystem(Phaser.Physics.ARCADE);
    //objects collide only with the side of the world
    this.game.physics.arcade.checkCollision.down = false;
    this.game.physics.arcade.checkCollision.up = false;

    //create the background---------------------------------------------------
    this.backgroundGroup = this.game.add.group();
    this.leftBackground = this.backgroundGroup.create(0, 0, 'background'); //draw left background
    this.leftBackground.scale.setTo(scaleMultiplier, 1); //scale down to 367px width
    this.leftBackground.fixedToCamera = true;

    this.divider = this.backgroundGroup.create(this.leftBackground.right, 0, 'divider'); //position the divider at 364px
    this.divider.scale.setTo(dividerScaleMultiplier, 1); //scale down
    this.game.physics.arcade.enable(this.divider);
    this.divider.body.immovable = true;
    this.divider.fixedToCamera = true;

    this.rightBackground = this.backgroundGroup.create(this.divider.right, 0, 'background'); //position second background at 383px (367+16)
    this.rightBackground.scale.setTo(scaleMultiplier, 1); //scale down
    this.rightBackground.fixedToCamera = true;

    //create the blocks in the beginning--------------------------------------
    this.leftBlocks = this.game.add.group(); //group of blocks on the left side
    this.leftBlocks.enableBody = true; //enable collision for left blocks

    this.rightBlocks = this.game.add.group(); //group of blocks on the right side
    this.rightBlocks.enableBody = true; //enable collision for right blocks

    //specialty groups---------------
    this.game.physics.arcade.enable(this.regularBlocks);
    this.game.physics.arcade.enable(this.jumpBlocks);
    this.game.physics.arcade.enable(this.antiBlocks);


    //Function Call--------
    this.createBlocks(20);

    //this just creates the bottom floor to stand on---------------------------
    this.onlyFloor = this.game.add.sprite(0, this.game.world.height - 1, 'regularBlockRight');
    this.game.physics.arcade.enable(this.onlyFloor);
    this.onlyFloor.scale.setTo(50, 1);
    this.onlyFloor.body.immovable = true;


    //create the players - things get complicated...--------------------------
    var playerTargetHeight = (38 * this.playerAndBlockTargetWidth) / 46;
    //purple player-----------------------------------------------------------
    var purplePlayerYSpawn = (30 * this.playerAndBlockTargetWidth) / 46;
    this.playerPurple = this.game.add.sprite(w / 4 - this.playerAndBlockTargetWidth / 2, h - purplePlayerYSpawn, 'player1Bottom'); //create the base of the purple player
    this.playerPurpleTop = this.game.add.sprite(0, -8, 'player1Top'); //create the top of the purple player
    this.playerPurple.scale.setTo(this.playerAndBlockScaleMultiplier, this.playerAndBlockScaleMultiplier);
    this.playerPurple.animations.add('smilePurple', [1, 2, 3], 4, false);
    this.playerPurple.animations.add('blinkPurple', [4, 5, 6], 13, false);

    //physics for the base
    this.playerPurple.addChild(this.playerPurpleTop); //make the top a child of the base, so they move together
    this.game.physics.arcade.enable(this.playerPurple, true); //the second parameter, true, means enable body for all children
    this.playerPurple.body.collideWorldBounds = true;
    this.playerPurple.body.gravity.y = 300;
    this.playerPurple.body.acceleration.y = 700;
    this.playerPurple.body.bounce.y = 0.2;

    //physics for the top
    this.playerPurpleTop.body.immovable = true;
    this.playerPurpleTop.body.moves = false; //this just makes it also, so objects can't pass through it

    this.purpleBulletKey = this.game.input.keyboard.addKey(Phaser.Keyboard.DOWN);
    this.purpleJumpKey = this.game.input.keyboard.addKey(Phaser.Keyboard.UP);


    //blue player-------------------------------------------------------------
    var bluePlayerYSpawn = (8 * this.playerAndBlockTargetWidth) / 46;
    this.playerBlue = this.game.add.sprite(3 * w / 4 - this.playerAndBlockTargetWidth / 2, h - bluePlayerYSpawn, 'player2Bottom'); //create the base of the blue player
    this.playerBlueTop = this.game.add.sprite(this.playerBlue.width / 2, -30, 'player2Top'); //create the top of the blue player
    this.playerBlue.scale.setTo(this.playerAndBlockScaleMultiplier, this.playerAndBlockScaleMultiplier);
    this.playerBlueTop.animations.add('smileBlue', [1, 2, 3], 4, false);
    this.playerBlueTop.animations.add('blinkBlue', [4, 5, 6], 13, false);

    //physics for the base
    this.playerBlue.addChild(this.playerBlueTop);
    this.game.physics.arcade.enable(this.playerBlue, true);
    this.playerBlue.body.collideWorldBounds = true;
    this.playerBlue.body.gravity.y = 300;
    this.playerBlue.body.acceleration.y = 700;
    this.playerBlue.body.bounce.y = 0.2;

    //physics for the top
    this.playerBlueTop.body.immovable = true;
    this.playerBlueTop.body.moves = false;

    this.blueBulletKey = this.game.input.keyboard.addKey(Phaser.Keyboard.S);
    this.blueJumpKey = this.game.input.keyboard.addKey(Phaser.Keyboard.W);


    //just set the top player to something at the start-----------------------
    this.topPlayer = this.playerPurple;


    //particles---------------------------------------------------------------
    this.particleEmitterPurple = this.game.add.emitter(this.playerPurple.width / 2, 30, 400);
    this.particleEmitterPurple.makeParticles('playerPurpleTrail');
    this.particleEmitterPurple.width = this.playerPurple.width;
    this.particleEmitterPurple.setRotation(0, 0);
    this.particleEmitterPurple.setScale(0.2, 0.1, 0.1, 0.2);
    this.particleEmitterPurple.setAlpha(1, 0, 600);
    this.particleEmitterPurple.gravity = 200;
    this.particleEmitterPurple.maxParticleSpeed = new Phaser.Point(0, 50);
    this.particleEmitterPurple.minParticleSpeed = new Phaser.Point(0, 0);
    this.particleEmitterPurple.lifespan = 500;

    this.playerPurple.addChild(this.particleEmitterPurple);


    this.particleEmitterBlue = this.game.add.emitter(this.playerBlue.width / 2, 8, 400);
    this.particleEmitterBlue.makeParticles('playerBlueTrail');
    this.particleEmitterBlue.width = this.playerBlue.width;
    this.particleEmitterBlue.setRotation(0, 0);
    this.particleEmitterBlue.setScale(0.2, 0.1, 0.1, 0.2);
    this.particleEmitterBlue.setAlpha(1, 0, 600);
    this.particleEmitterBlue.gravity = 200;
    this.particleEmitterBlue.maxParticleSpeed = new Phaser.Point(0, 50);
    this.particleEmitterBlue.minParticleSpeed = new Phaser.Point(0, 0);
    this.particleEmitterBlue.lifespan = 500;

    this.playerBlue.addChild(this.particleEmitterBlue);

    this.rain = this.game.add.emitter(this.game.world.centerX, this.game.world.bounds.y, 400);
    this.rain.width = this.game.world.width;
    this.rain.makeParticles('rain');
    this.rain.minParticleScale = 0.2;
    this.rain.maxParticleScale = 0.6;
    this.rain.gravity = 0;
    this.rain.setXSpeed(0, 0);
    this.rain.setYSpeed(0, 0);
    this.rain.minRotation = 0;
    this.rain.maxRotation = 0;
    this.rain.start(false, 1600, 5, 0);


    this.enemyExplosion = this.game.add.emitter(this.game.world.centerX, this.game.world.centerY, 400);
    this.enemyExplosion.makeParticles('enemyExplosion');
    this.enemyExplosion.setScale(0.2, 0.1, 0.1, 0.2);
    this.enemyExplosion.gravity = 0;

    this.regularBlockEffect = this.game.add.emitter(this.game.world.centerX, this.game.world.centerY, 400);
    this.regularBlockEffect.makeParticles('regularBlockParticle');
    this.regularBlockEffect.gravity = 0;
    this.regularBlockEffect.setScale(1.5, 2, 1.5, 2, 6000, Phaser.Easing.Quintic.Out);
    this.regularBlockEffect.minParticleSpeed.setTo(0, 0);
    this.regularBlockEffect.maxParticleSpeed.setTo(0, 0);
    this.regularBlockEffect.setRotation(0, 0);
    this.regularBlockEffect.setAlpha(1, 0, 3000, Phaser.Easing.Quintic.Out);
    this.regularBlockEffect.width = 1;


    //create sounds-----------------------------------------------------------
    this.c = this.game.add.audio('c');
    this.d = this.game.add.audio('d');
    this.e = this.game.add.audio('e');
    this.f = this.game.add.audio('f');
    this.g = this.game.add.audio('g');
    this.a = this.game.add.audio('a');
    this.b = this.game.add.audio('b');
    this.c2 = this.game.add.audio('c2');
    this.notes[0] = this.c;
    this.notes[1] = this.d;
    this.notes[2] = this.e;
    this.notes[3] = this.f;
    this.notes[4] = this.g;
    this.notes[5] = this.a;
    this.notes[6] = this.b;
    this.notes[7] = this.c2;
    this.pchu2 = this.game.add.audio('pchu2', 0.4);
    this.pchu3 = this.game.add.audio('pchu3', 0.4);
    this.pchu[0] = this.pchu2;
    this.pchu[1] = this.pchu3;
    this.explosion = this.game.add.audio('explosion');


    //enemies!----------------------------------------------------------------
    this.leftEnemies = this.game.add.group();
    this.leftEnemies.enableBody = true;
    this.leftEnemies.name = 'leftEnemies';
    this.rightEnemies = this.game.add.group();
    this.rightEnemies.enableBody = true;
    this.rightEnemies.name = 'rightEnemies';
    this.playerBullets = this.game.add.group();
    this.playerBullets.enableBody = true;

    this.game.time.events.loop(100, this.moveEnemy, this);

    //score text--------------------------------------------------------------
    var scoreText = this.game.add.text(w / 2 - 17, 0, '0', {
      font: "65px Arial",
      fill: "#FFFFFF",
      align: "center"
    });
    this.game.time.events.loop(Phaser.Timer.SECOND, function() {
      if (this.game.camera.y < this.previousCameraHeight) {
        this.score++;
      }
      scoreText.setText(this.score);

    }, this);

    //connect camera shake plugin :)
    this.game.plugins.cameraShake = this.game.plugins.add(Phaser.Plugin.CameraShake);

    //change default properties
    this.game.plugins.cameraShake.setup({
      shakeRange: 10,
      shakeCount: 10,
      shakeInterval: 20,
      randomShake: false,
      randomizeInterval: true,
      shakeAxis: 'x'
    });
  },

  //FUNCTION CALLED EVERY FRAME***********************************************
  update: function() {
    //collision groups--------------------------------------------------------
    this.game.physics.arcade.collide(this.playerBlue, this.onlyFloor); //the blue player needs to collide with the floor
    this.game.physics.arcade.collide(this.playerPurple, this.onlyFloor); //so does the purple player

    this.game.physics.arcade.collide(this.playerBlue, this.divider); //the blue player needs to collide with the divider
    this.game.physics.arcade.collide(this.playerPurple, this.divider); //so does the purple player

    //regular block collision------------------------------------------------
    if (this.game.physics.arcade.collide(this.playerBlue, this.regularBlocks)) {
      this.playerBlue.body.velocity.y = -575;
      this.playNote();
      this.colliding = true;
    } else {
      this.colliding = false;
    }
    if (this.game.physics.arcade.collide(this.playerPurple, this.regularBlocks)) {
      this.playerPurple.body.velocity.y = -575;
      this.playNote();
      this.colliding = true;
    } else {
      this.colliding = false;
    }
    if (this.game.physics.arcade.overlap(this.playerBlue, this.regularBlocks, this.collisionNotePlayer, null, this)) {
      this.playerBlue.body.velocity.y = -575;
    }
    if (this.game.physics.arcade.overlap(this.playerPurple, this.regularBlocks, this.collisionNotePlayer, null, this)) {
      this.playerPurple.body.velocity.y = -575;
    }

    //jump block collision---------------------------------------------------
    this.game.physics.arcade.collide(this.playerBlue, this.jumpBlocks);
    this.game.physics.arcade.collide(this.playerPurple, this.jumpBlocks);

    //antiblock collision----------------------------------------------------
    if (this.game.physics.arcade.collide(this.playerBlue, this.antiBlocks)) {
      if (this.playerBlue.body.touching.left) {
        this.playerBlue.body.velocity.x = 1200;
      } else if (this.playerBlue.body.touching.right) {
        this.playerBlue.body.velocity.x = -1200;
      } else if (this.playerBlue.body.touching.up) {
        this.playerBlue.body.velocity.y = 575;
      } else {
        this.playerBlue.body.velocity.y = -575;
      }
    }
    if (this.game.physics.arcade.collide(this.playerPurple, this.antiBlocks)) {
      if (this.playerPurple.body.touching.left) {
        this.playerPurple.body.velocity.x = 1200;
      } else if (this.playerPurple.body.touching.right) {
        this.playerPurple.body.velocity.x = -1200;
      } else if (this.playerPurple.body.touching.up) {
        this.playerPurple.body.velocity.y = 575;
      } else {
        this.playerPurple.body.velocity.y = -575;
      }
    }

    //enemy collision with player bullets------------------------------------
    this.game.physics.arcade.collide(this.playerBullets, this.leftEnemies, this.enemyDeath, null, this);
    this.game.physics.arcade.collide(this.playerBullets, this.rightEnemies, this.enemyDeath, null, this);

    //if enemy moves beyond screen--------------------------------------------
    this.leftEnemies.forEach(function(enemy) {
      if (enemy.y > this.game.camera.y + this.game.camera.height) {
        this.leftEnemies.remove(enemy);
        this.enemySpawned = false;
      }
    }, this);
    this.rightEnemies.forEach(function(enemy) {
      if (enemy.y > this.game.camera.y + this.game.camera.height) {
        this.rightEnemies.remove(enemy);
        this.enemySpawned = true;
      }
    }, this);

    //if bullets move beyond screen-------------------------------------------
    this.playerBullets.forEach(function(bullet) {
      if (bullet.y < this.game.camera.y - 20) {
        if (bullet.x < this.leftBackground.right) {
          this.purpleBulletSpawned = false;
        } else {
          this.blueBulletSpawned = false;
        }
        this.playerBullets.remove(bullet);
      }
    }, this);


    //update world bounds and camera------------------------------------------
    this.game.world.setBounds(0, this.topPlayer.y - 3 * h / 2, w, h * 2);
    this.updateCamera(this.topPlayer);

    //Function Call to recycle the blocks-------------------------------------
    this.recycleBlocks(this.leftBlocks);
    this.recycleBlocks(this.rightBlocks);

    //Function Call to spawn enemies and bullets------------------------------
    this.spawnEnemy();

    //if player velocity is bigger than or less than 0, smoothly tranisition it back to 0
    if (this.playerPurple.body.velocity.x < 0 || this.playerPurple.body.velocity.x > 0) {
      this.playerPurple.body.velocity.x += (0 - this.playerPurple.body.velocity.x) * 0.3;
    }
    if (this.playerBlue.body.velocity.x < 0 || this.playerBlue.body.velocity.x > 0) {
      this.playerBlue.body.velocity.x += (0 - this.playerBlue.body.velocity.x) * 0.3;
    }

    //blinking----------------------------------------------------------------
    var randomNumber = Math.floor(Math.random() * 400);
    if (randomNumber == 343) { //343 is a cool number, ok?! 7*7*7 = cubed. I think that's hot.
      this.playerPurple.animations.play('blinkPurple');
    } else if (randomNumber == 42) {
      this.playerBlueTop.animations.play('blinkBlue'); //also a cool number. Cause like, it's life.
    }


    //player 1 controls-------------------------------------------------------
    if (this.game.input.keyboard.isDown(Phaser.Keyboard.A)) {
      //  Move to the left
      this.playerPurple.body.velocity.x = -450;
    } else if (this.game.input.keyboard.isDown(Phaser.Keyboard.D)) {
      //  Move to the right
      this.playerPurple.body.velocity.x = 450;
    }

    this.purpleJumpKey.onDown.add(function() {
      if (this.playerPurple.body.touching.down) {
        this.playerPurple.body.velocity.y = -575;
        this.playerPurple.animations.play('smilePurple');
      }
    }, this);
    this.playerPurple.events.onAnimationComplete.add(function() {
      this.playerPurple.frame = 0;
    }, this);
    this.purpleBulletKey.onDown.add(function() {
      if (!this.purpleBulletSpawned) {
        this.spawnPlayerBullet(this.playerPurple);
        this.purpleBulletSpawned = true;
      }
    }, this);

    //player 2 controls-------------------------------------------------------
    if (this.game.input.keyboard.isDown(Phaser.Keyboard.LEFT)) {
      //  Move to the left
      this.playerBlue.body.velocity.x = -450;
    } else if (this.game.input.keyboard.isDown(Phaser.Keyboard.RIGHT)) {
      //  Move to the right
      this.playerBlue.body.velocity.x = 450;
    }

    this.blueJumpKey.onDown.add(function() {
      if (this.playerBlue.body.touching.down) {
        this.playerBlue.body.velocity.y = -575;
        this.playerBlueTop.animations.play('smileBlue');
      }
    }, this);
    this.playerBlueTop.events.onAnimationComplete.add(function() {
      this.playerBlueTop.frame = 0;
    }, this);
    this.blueBulletKey.onDown.add(function() {
      if (!this.blueBulletSpawned) {
        this.spawnPlayerBullet(this.playerBlue);
        this.blueBulletSpawned = true;
      }
    }, this);


    //who's the top player----------------------------------------------------
    if (this.playerPurple.y < this.playerBlue.y) {
      this.topPlayer = this.playerPurple;
    } else {
      this.topPlayer = this.playerBlue;
    }

    //update particles--------------------------------------------------------
    if (this.playerBlue.y < this.previousBlueY) {
      this.particleEmitterBlue.emitParticle();
    }
    this.previousBlueY = this.playerBlue.y;
    if (this.playerPurple.y < this.previousPurpleY) {
      this.particleEmitterPurple.emitParticle();
    }
    this.previousPurpleY = this.playerPurple.y;

    this.rain.y = this.game.camera.y - 10;
    this.rain.gravity = -this.cameraSpeed * 75;
    this.rain.update();

    //check for game over-----------------------------------------------------
    if (this.playerBlue.y - 38 > this.game.camera.y + this.game.camera.height || this.game.physics.arcade.collide(this.rightEnemies, this.playerBlue)) {
      //this.backdrop.stop();
      var deathMessage = 'Blue, you died!';
      this.game.state.start("GameOver", true, false, deathMessage, this.score);
    } else if (this.playerPurple.y - 38 > this.game.camera.y + this.game.camera.height || this.game.physics.arcade.collide(this.leftEnemies, this.playerPurple)) {
      //this.backdrop.stop();
      var deathMessage = 'Purple, you died!';
      this.game.state.start("GameOver", true, false, deathMessage, this.score);
    }
  },


  /*----------------------------CUTOM FUNCTIONS-----------------------------*/
  //UPDATE CAMERA FUNCTION****************************************************
  updateCamera: function(player) {
    this.cameraSpeed = this.game.camera.y - this.previousCameraHeight;
    this.previousCameraHeight = this.game.camera.y;
    //if the top player's height is higher than his previous...
    if (player.y < this.currentPlayerPosition) {
      this.currentPlayerPosition = player.y; //change the previous to the current

      //move the camera smoothly to that position
      this.game.camera.y += ((this.currentPlayerPosition - h / 2) - this.game.camera.y) * 0.1;
    } else if (this.currentPlayerPosition < h / 2) {
      this.game.camera.y -= 3;
      this.currentPlayerPosition = this.game.camera.y + h / 2;
    }
  },

  //FUNCTION THAT CREATES BLOCKS AT THE START OF THE GAME*********************
  createBlocks: function(numberOfBlocks) {
    //75 is a nice number because it gives just the right amount of room between blocks
    this.randomYMultiplier = 75;

    //set the height of the previous block to the height of the screen at the start
    var previousBlock = h;

    //spawn twenty blocks
    for (var i = 0; i < numberOfBlocks; i++) {
      var spawnOtherBlock = Math.floor(Math.random() * 20); //1 in 20 chance to spawn special block

      var height = previousBlock - 160; //we take the position of the previous block and add by the height the player can jump
      var y = height + (Math.random() * this.randomYMultiplier); //now we have 160 pixels of random space to fill

      //ten on the left
      if (i < numberOfBlocks / 2) {
        var x = Math.random() * (this.leftBackground.right - this.playerAndBlockTargetWidth); //the width of the background is 367, so the x is random between 0-321 because the width of the block is 46 (367-321)
        if (spawnOtherBlock == 7) {
          var newBlock = this.leftBlocks.create(x, -50, 'jumpBlockLeft'); //spawn the block in the left blocks group
          newBlock.body.checkCollision.down = false;
          newBlock.body.checkCollision.left = false;
          newBlock.body.checkCollision.right = false;
          this.jumpBlocks.push(newBlock);
        } else if (spawnOtherBlock == 13) {
          var newBlock = this.leftBlocks.create(x, -50, 'antiBlock'); //spawn the block in the left blocks group
          this.antiBlocks.push(newBlock);
        } else {
          var newBlock = this.leftBlocks.create(x, -50, 'regularBlockLeft'); //spawn the block in the left blocks group
          newBlock.body.checkCollision.down = false;
          newBlock.body.checkCollision.left = false;
          newBlock.body.checkCollision.right = false;
          this.regularBlocks.push(newBlock);
        }
      }
      //and ten on the right
      else {
        var x = (Math.random() * (this.leftBackground.right - this.playerAndBlockTargetWidth)) + this.rightBackground.left;
        if (spawnOtherBlock == 7) {
          var newBlock = this.rightBlocks.create(x, -50, 'jumpBlockRight'); //spawn the block in the right blocks group
          newBlock.body.checkCollision.down = false;
          newBlock.body.checkCollision.left = false;
          newBlock.body.checkCollision.right = false;
          this.jumpBlocks.push(newBlock);
        } else if (spawnOtherBlock == 13) {
          var newBlock = this.rightBlocks.create(x, -50, 'antiBlock'); //spawn the block in the right blocks group
          this.antiBlocks.push(newBlock);
        } else {
          var newBlock = this.rightBlocks.create(x, -50, 'regularBlockRight'); //spawn the block in the right blocks group
          newBlock.body.checkCollision.down = false;
          newBlock.body.checkCollision.left = false;
          newBlock.body.checkCollision.right = false;
          this.regularBlocks.push(newBlock);
        }
      }

      newBlock.body.immovable = true;
      newBlock.scale.setTo(this.playerAndBlockScaleMultiplier, this.playerAndBlockScaleMultiplier);
      this.game.add.tween(newBlock).to({
        y: y
      }, Math.floor(Math.random() * 2400 + 1200), Phaser.Easing.Bounce.Out, true);

      previousBlock = y; //increment the height
      if (i == numberOfBlocks / 2 - 1) {
        previousBlock = h; //reset the height if we make half the blocks and move to the other side
      }
    }
  },

  //FUNCTION THAT THEN RECYCLES THOSE BLOCKS**********************************
  recycleBlocks: function(blocks) {
    var spawnOtherBlock = Math.floor(Math.random() * 20);
    var currentBlock = blocks.children[0];

    if (currentBlock.y > this.game.camera.y + this.game.camera.height) {
      var side = currentBlock.x; //store x of block

      //check if it's in any of the arrays and remove it if necessary
      if (this.isInArray(currentBlock, this.regularBlocks)) {
        this.regularBlocks.shift();
      } else if (this.isInArray(currentBlock, this.jumpBlocks)) {
        this.jumpBlocks.shift();
      } else if (this.isInArray(currentBlock, this.antiBlocks)) {
        this.antiBlocks.shift();
      }
      blocks.remove(currentBlock); //remove it from the right or left group

      var y = blocks.children[blocks.length - 1].y + (Math.random() * this.randomYMultiplier) - 160;
      var x = 0;

      if (side < this.leftBackground.right) {
        x = Math.random() * (this.leftBackground.right - this.playerAndBlockTargetWidth);
      } else if (side > this.rightBackground.left) {
        x = (Math.random() * (this.leftBackground.right - this.playerAndBlockTargetWidth)) + this.rightBackground.left;
      }

      if (spawnOtherBlock == 7) {
        if (side < this.leftBackground.right) {
          var newBlock = blocks.create(x, y, 'jumpBlockLeft');
        } else {
          var newBlock = blocks.create(x, y, 'jumpBlockRight');
        }
        this.jumpBlocks.push(newBlock);
        newBlock.body.checkCollision.down = false;
        newBlock.body.checkCollision.left = false;
        newBlock.body.checkCollision.right = false;
      } else if (spawnOtherBlock == 13) {
        var newBlock = blocks.create(x, y, 'antiBlock');
        this.antiBlocks.push(newBlock);
      } else {
        if (side < this.leftBackground.right) {
          var newBlock = blocks.create(x, y, 'regularBlockLeft');
        } else {
          var newBlock = blocks.create(x, y, 'regularBlockRight');
        }
        newBlock.body.checkCollision.down = false;
        newBlock.body.checkCollision.left = false;
        newBlock.body.checkCollision.right = false;
        this.regularBlocks.push(newBlock);
      }

      newBlock.body.immovable = true;
      newBlock.scale.setTo(this.playerAndBlockScaleMultiplier, this.playerAndBlockScaleMultiplier);
    }
  },

  isInArray: function(value, array) {
    return array.indexOf(value) > -1;
  },

  collisionNotePlayer: function(player, block) {
    if (this.currentBlock != block && !this.colliding) {
      this.playNote();
      this.regularBlockEffect.x = block.x+block.width/2;
      this.regularBlockEffect.y = block.y+block.height/2;
      this.regularBlockEffect.start(true, 2000, null, 10);
    }
    this.currentBlock = block;
  },

  //FUNCTION THAT PLAYS RANDOM NOTES*****************************************
  playNote: function() {
    var randomSound = Math.floor(Math.random() * 7);
    this.notes[randomSound].play();
  },

  playPchu: function() {
    var randomSound = Math.floor(Math.random());
    this.pchu[randomSound].play();
  },

  //ENEMY FUNCTIONS**********************************************************
  spawnEnemy: function() {
    if (!this.enemySpawned) {
      var spawn = Math.floor(Math.random() * 500);
      if (spawn == 13) {
        x = Math.random() * (this.leftBackground.right - this.playerAndBlockTargetWidth);
        var enemy = this.leftEnemies.create(x, this.game.camera.y - 200, 'enemy');
        enemy.scale.setTo(this.playerAndBlockScaleMultiplier, this.playerAndBlockScaleMultiplier);
        enemy.body.velocity.x = -300;
        this.enemySpawned = true;
      } else if (spawn == 42) {
        x = (Math.random() * (this.leftBackground.right - this.playerAndBlockTargetWidth)) + this.rightBackground.left;
        var enemy = this.rightEnemies.create(x, this.game.camera.y - 200, 'enemy');
        enemy.scale.setTo(this.playerAndBlockScaleMultiplier, this.playerAndBlockScaleMultiplier);
        enemy.body.velocity.x = 300;
        this.enemySpawned = true;
      }
    }
  },

  moveEnemy: function() {
    this.rightEnemies.forEach(function(enemy) {
      if (enemy.x <= this.rightBackground.left || enemy.x >= this.rightBackground.right - enemy.width) {
        enemy.body.velocity.x = -enemy.body.velocity.x;
      }
    }, this);
    this.leftEnemies.forEach(function(enemy) {
      if (enemy.x <= 0 || enemy.x >= this.leftBackground.right - enemy.width) {
        enemy.body.velocity.x = -enemy.body.velocity.x;
      }
    }, this);
  },

  spawnPlayerBullet: function(player) {
    if (player == this.playerPurple) {
      var newBullet = this.playerBullets.create(player.x + player.width / 2, player.top, 'bulletPurple');
      newBullet.scale.setTo(this.playerAndBlockScaleMultiplier, this.playerAndBlockScaleMultiplier);
      newBullet.body.velocity.y = -700;
    } else {
      var newBullet = this.playerBullets.create(player.x + player.width / 2, player.top, 'bulletBlue');
      newBullet.scale.setTo(this.playerAndBlockScaleMultiplier, this.playerAndBlockScaleMultiplier);
      newBullet.body.velocity.y = -700;
    }
    this.playPchu();
  },

  enemyDeath: function(bullet, enemy) {
    this.playerBullets.remove(bullet);
    this.enemyExplosion.x = enemy.x;
    this.enemyExplosion.y = enemy.y;
    this.enemyExplosion.start(true, 2000, null, 50);
    if (enemy.x < this.leftBackground.right) {
      this.leftEnemies.remove(enemy);
      this.purpleBulletSpawned = false;
    } else {
      this.rightEnemies.remove(enemy);
      this.blueBulletSpawned = false;
    }
    this.enemySpawned = false;
    this.game.plugins.cameraShake.shake();
    this.explosion.play();
  }
}
