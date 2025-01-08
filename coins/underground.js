document.addEventListener("DOMContentLoaded", () => {
  const config = {
    type: Phaser.AUTO,
    parent: "game-screen", // The HTML element ID
    physics: {
      default: "arcade",
      arcade: {
        gravity: { y: 0 },
        debug: false, // Enable debug temporarily if needed
      },
    },
    scale: {
      mode: Phaser.Scale.RESIZE,
      autoCenter: Phaser.Scale.CENTER_BOTH,
    },
    scene: [TitleScene, BackstoryScene, PlayScene, GameOverScene], // All scenes listed here
  };

  window.skipBackstory = false;

  new Phaser.Game(config);
});

// Define all game scene classes
class TitleScene extends Phaser.Scene {
  constructor() {
    super("TitleScene");
  }

  preload() {
    this.load.audio("introMusic", "assets/audio/bgMusic.mp3");
  }

  create() {
    this.introMusic = this.sound.add("introMusic", { loop: true, volume: 0.8 });
    this.introMusic.play();

    const titleStyle = { fontSize: "72px", fill: "#ffff00", fontFamily: "Tourney" };
    this.add
      .text(
        this.cameras.main.centerX,
        this.cameras.main.centerY - 100,
        "\nROY'S\npAyPhOnE\nSCRamBle\n",
        titleStyle
      )
      .setOrigin(0.5);

    const infoStyle = { fontSize: "16px", fill: "#00FF00", fontFamily: "monospace" };
    this.add
      .text(
        this.cameras.main.centerX,
        this.cameras.main.centerY + 50,
        "\nCLICK ANYWHERE OR PRESS SPACE TO START",
        infoStyle
      )
      .setOrigin(0.5);

    this.input.once("pointerdown", () => {
      this.startGameFlow();
    });
    this.input.keyboard.once("keydown-SPACE", () => {
      this.startGameFlow();
    });
  }

  startGameFlow() {
    if (this.introMusic) {
      this.introMusic.stop();
    }

    if (window.skipBackstory) {
      this.scene.start("PlayScene");
    } else {
      this.scene.start("BackstoryScene");
    }
  }
}

class BackstoryScene extends Phaser.Scene {
  constructor() {
    super("BackstoryScene");
  }

  create() {
    window.skipBackstory = true;

    const backstory = `ROY’S FIRST LIVE SHOW IN OVER A YEAR TOOK A TURN FOR THE WORSE WHEN HE DROPPED ALL HIS SPARE CHANGE IN THE PAYPHONE BOOTH.\nNOW, YOU MUST HELP HIM SCRAMBLE TO COLLECT EVERY LAST COIN WHILE DODGING FALLING CACTI THAT SOME HOBO LEFT ON THE ROOF. GRAB THE CHANGE BEFORE TIME RUNS OUT SO ROY CAN KEEP DIALING UP CHAOS!`;

    const style = {
      fontSize: "36px",
      fill: "#00FF00",
      fontFamily: "monospace",
      align: "justify",
      wordWrap: { width: 800, useAdvancedWrap: true },
    };

    this.backstoryText = this.add
      .text(this.cameras.main.centerX, this.cameras.main.height + 50, backstory, style)
      .setOrigin(0.5);

    this.tweens.add({
      targets: this.backstoryText,
      y: -this.backstoryText.height,
      duration: 18000,
      ease: "Linear",
      onComplete: () => {
        this.scene.start("PlayScene");
      },
    });

    this.input.keyboard.once("keydown-SPACE", () => {
      this.scene.start("PlayScene");
    });
    this.input.once("pointerdown", () => {
      this.scene.start("PlayScene");
    });
  }
}

class PlayScene extends Phaser.Scene {
  constructor() {
    super("PlayScene");
  }

  preload() {
    this.load.image("bg", "assets/bg.jpg");
    this.load.image("player", "assets/player.png");
    this.load.image("rock", "assets/rock.png"); // Falling objects
    this.load.image("treasure", "assets/treasure.png"); // Coins
    this.load.image("particle", "assets/particle.png");

    this.load.audio("bgMusic", "assets/audio/bgMusic.mp3");
    this.load.audio("coinPickup", "assets/audio/coinPickup.mp3");
    this.load.audio("loseLife", "assets/audio/loseLife.mp3");
    this.load.audio("gameOverSound", "assets/audio/gameOver.mp3");
  }

  create() {
    // Background setup
    this.bg = this.add.sprite(0, 0, "bg").setOrigin(0, 0);
    this.bg.setDisplaySize(this.cameras.main.width, this.cameras.main.height);

    this.scale.on("resize", (gameSize) => {
      this.bg.setDisplaySize(gameSize.width, gameSize.height);
    });

    // HUD
    this.score = 0;
    this.lives = 3;
    this.gameOverFlag = false;

    this.level = 1; // Track the current level
    this.currentTreasureCount = 0; // How many treasures remain uncollected

    const hudStyle = { fontSize: "16px", fill: "#00FF00", fontFamily: "monospace" };
    this.scoreText = this.add.text(10, 10, "Score: 0", hudStyle);
    this.livesText = this.add.text(150, 10, "Lives: 3", hudStyle);
    this.timerText = this.add.text(10, 30, "", hudStyle);

    // Player setup
    this.player = this.physics.add.sprite(
      this.cameras.main.centerX,
      this.cameras.main.centerY,
      "player"
    );
    this.player.setCollideWorldBounds(true);

    // Create groups for rocks and treasures
    this.rocks = this.physics.add.group();
    this.treasures = this.physics.add.group();

    // Physics colliders and overlap
    this.physics.add.collider(this.player, this.rocks, this.hitRock, null, this);
    this.physics.add.overlap(this.player, this.treasures, this.collectTreasure, null, this);

    // Input controls
    this.cursors = this.input.keyboard.createCursorKeys();

    // Swipe detection for mobile
    let touchStartX, touchStartY;
    this.input.on("pointerdown", (pointer) => {
      touchStartX = pointer.x;
      touchStartY = pointer.y;
    });

    this.input.on("pointerup", (pointer) => {
      const deltaX = pointer.x - touchStartX;
      const deltaY = pointer.y - touchStartY;
      const threshold = 50;

      if (Math.abs(deltaX) > Math.abs(deltaY)) {
        if (Math.abs(deltaX) > threshold) {
          this.player.setVelocityX(deltaX > 0 ? 160 : -160);
        }
      } else {
        if (Math.abs(deltaY) > threshold) {
          this.player.setVelocityY(deltaY > 0 ? 160 : -160);
        }
      }

      this.time.delayedCall(200, () => this.player.setVelocity(0));
    });

    this.rockSpawnEvent = null; // Will be used to continuously spawn cacti
    // Start first level
    this.startLevel(this.level);
  }

  update() {
    if (this.gameOverFlag) return;

    const speed = 160;
    this.player.setVelocity(0);

    if (this.cursors.left.isDown) this.player.setVelocityX(-speed);
    if (this.cursors.right.isDown) this.player.setVelocityX(speed);
    if (this.cursors.up.isDown) this.player.setVelocityY(-speed);
    if (this.cursors.down.isDown) this.player.setVelocityY(speed);

    // Manually update each rock so they can be destroyed when offscreen
    this.rocks.children.iterate((rock) => {
      if (rock && rock.y > this.cameras.main.height + rock.height) {
        rock.destroy();
      }
    });
  }

  // Start (or restart) a level
  startLevel(level) {
    // Clear groups and any existing rock-spawn timer
    this.rocks.clear(true, true);
    this.treasures.clear(true, true);
    if (this.rockSpawnEvent) {
      this.rockSpawnEvent.remove(false);
    }

    // Adjust difficulty per level
    const rockCount = 2 + (level - 1) * 2; // initial wave
    const rockSpeed = 60 + (level - 1) * 20; // cacti speed
    const treasureCount = 5 + (level - 1) * 2; // coins
    this.currentTreasureCount = treasureCount;

    // Start with an initial wave of cacti
    this.spawnRocks(rockCount, rockSpeed);

    // Continuously spawn new cacti until this level is cleared
    this.rockSpawnEvent = this.time.addEvent({
      delay: 2000, // spawn interval
      callback: () => {
        const x = Phaser.Math.Between(50, this.cameras.main.width - 50);
        const rock = this.rocks.create(x, 0, "rock");
        rock.setVelocityY(rockSpeed);
      },
      callbackScope: this,
      loop: true,
    });

    // Spawn coins
    this.spawnTreasures(treasureCount);

    // Timer for this level
    const baseTime = 30; // base
    const timeDecrease = (level - 1) * 2;
    this.levelTime = Math.max(baseTime - timeDecrease, 10); // never go below 10 seconds
    this.timeLeft = this.levelTime;
    this.updateTimerText();

    // Create a timer event for counting down
    this.timerEvent = this.time.addEvent({
      delay: 1000,
      callback: () => {
        this.timeLeft--;
        this.updateTimerText();
        if (this.timeLeft <= 0) {
          // time's up
          this.timerEvent.remove(false);
          this.gameOver();
        }
      },
      callbackScope: this,
      loop: true,
    });
  }

  updateTimerText() {
    this.timerText.setText("Time: " + this.timeLeft);
  }

  spawnRocks(count, speed) {
    for (let i = 0; i < count; i++) {
      const x = Phaser.Math.Between(50, this.cameras.main.width - 50);
      const rock = this.rocks.create(x, 0, "rock");
      rock.setVelocityY(speed);
    }
  }

  spawnTreasures(count) {
    for (let i = 0; i < count; i++) {
      const x = Phaser.Math.Between(50, this.cameras.main.width - 50);
      const y = Phaser.Math.Between(50, this.cameras.main.height - 50);
      this.treasures.create(x, y, "treasure");
    }
  }

  collectTreasure(player, treasure) {
    treasure.destroy();
    this.sound.play("coinPickup");
    this.score += 10;
    this.scoreText.setText("Score: " + this.score);

    // Decrement the count of remaining treasures
    this.currentTreasureCount--;
    // If all treasures are collected, advance to next level
    if (this.currentTreasureCount <= 0) {
      this.nextLevel();
    }
  }

  nextLevel() {
    if (this.timerEvent) {
      this.timerEvent.remove(false);
    }
    if (this.rockSpawnEvent) {
      this.rockSpawnEvent.remove(false);
    }
    this.level++;
    this.startLevel(this.level);
  }

  hitRock(player, rock) {
    rock.destroy();
    this.sound.play("loseLife");
    this.lives -= 1;
    this.livesText.setText("Lives: " + this.lives);

    if (this.lives <= 0) {
      this.gameOver();
    }
  }

  gameOver() {
    this.gameOverFlag = true;
    if (this.timerEvent) {
      this.timerEvent.remove(false);
    }
    if (this.rockSpawnEvent) {
      this.rockSpawnEvent.remove(false);
    }
    this.sound.play("gameOverSound");
    this.scene.start("GameOverScene", { score: this.score });
  }
}

class GameOverScene extends Phaser.Scene {
  constructor() {
    super("GameOverScene");
  }

  init(data) {
    this.finalScore = data.score || 0;
  }

  create() {
    const style = { fontSize: "32px", fill: "#00FF00", fontFamily: "monospace" };
    this.add
      .text(this.cameras.main.centerX, 150, "GAME OVER", {
        ...style,
        fontSize: "64px",
        fill: "#FFFF00",
      })
      .setOrigin(0.5);

    this.add
      .text(this.cameras.main.centerX, 200, `YOUR SCORE: ${this.finalScore}`, style)
      .setOrigin(0.5);
    this.add.text(this.cameras.main.centerX, 250, "PRESS R TO RESTART", style).setOrigin(0.5);

    this.input.keyboard.once("keydown-R", () => {
      window.skipBackstory = true;
      this.scene.start("TitleScene");
    });
  }
}
