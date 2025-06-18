import { Player } from "./Player.js";

export class Platformer {
  constructor(canvas) {
    this.name = 'Platformer';
    this.description = 'A platformer game where the player navigates through levels, avoiding obstacles and enemies.';
    this.keywords = ['platformer', 'game', '2D', 'adventure'];
    this.version = '1.0.0';
    this.canvas = canvas;
    this.context = this.canvas.getContext('2d');
    this.player = new Player();
    this.isPaused = false;
    this.isMovingLeft = false;
    this.isMovingRight = false;
    this.superSpeedActive = false;
    this.facing = 'right';
    this.panSpeed = 5;
    this.playerSpeed = 5;
    this.playerSuperSpeed = 10;
    this.zoom = 1.0;
    this.zoomSuperSpeed = 0.5;
    this.playerEdgeThreshold = 0.3;
    this.controls = {
      up: false,
      down: false,
      left: false,
      right: false,
      space: false,
    }
    this.setup();
    this.start();
  }

  setup() {
        window.addEventListener('keydown', (event) => {
            switch (event.key) {
                case 'ArrowLeft':
                    this.isMovingLeft = true;
                    this.facing = 'left';
                    this.controls.left = true;
                    break;
                case 'ArrowRight':
                    this.isMovingRight = true;
                    this.facing = 'right';
                    this.controls.right = true;
                    break;
                case ' ':
                  console.log('Space key down');
                  this.superSpeedActive = true;
                  this.controls.space = true;
            }
        });
        window.addEventListener('keyup', (event) => {
            switch (event.code) {
                case 'ArrowLeft':
                    this.isMovingLeft = false;
                    this.controls.left = false;
                    break;
                case 'ArrowRight':
                    this.isMovingRight = false;
                    this.controls.right = false;
                    break;
                case 'Space':
                  console.log('Space key up');
                  this.superSpeedActive = false;
                  this.controls.space = false;
            }
        });
    this.platformBlockA = {
      width: 100,
      height: 20,
      color: 'blue'
    };
    this.platformBlockB = {
      width: 100,
      height: 20,
      color: 'yellow'
    };
    // this.player = {
    //   width: 30,
    //   height: 50,
    //   x: 50,
    //   y: 150,
    //   color: 'green',
    //   directionX: 1,
    //   directionY: 0,
    //   accelerationX: 1.08,
    //   accelerationY: 0,
    //   speedX: 0,
    //   maxSpeedX: 5,
    // };
    this.entities = []
    // create the platform blocks alternating colors for 1000 blocks
    for (let i = 0; i < 50; i++) {
      const block = {
        width: this.platformBlockA.width,
        height: this.platformBlockA.height,
        x: i * this.platformBlockA.width,
        y: 200, //Math.floor(i / 50) * this.platformBlockA.height,
        color: i % 2 === 0 
        ? this.platformBlockA.color 
        : this.platformBlockB.color
      };
      this.entities.push(block);
    }

  }

  start() {
    console.log(`${this.name} is starting...`);
    this.isPaused = false;
    this.step();
  }

  stop() {
    console.log(`${this.name} has stopped.`);
    this.isPaused = true;
  }

  get bounds() {
    return {
      top: 0,
      left: 0,
      width: this.canvas.width,
      height: this.canvas.height,
    }
  }

  get rightThreshold() {
    return this.canvas.width * this.playerEdgeThreshold;
  }

  get leftThreshold() {
    return this.canvas.width * (1 - this.playerEdgeThreshold);
  }


  isPlayerAheadOfRightThreshold() {
    return this.player.x > this.rightThreshold;
  }

  isPlayerBehindOfRightThreshold() {
    return this.player.x < this.rightThreshold;
  }

  isPlayerAheadOfLeftThreshold() {
    return this.player.x < this.leftThreshold;
  }

  isPlayerBehindOfLeftThreshold() {
    return this.player.x > this.leftThreshold;
  }

  get hasMoreStageLeft() {
    return this.entities[0].x <= 0;
  }

  get hasMoreStageRight() {
    const lastEntity = this.entities[this.entities.length - 1];
    return lastEntity.x + lastEntity.width >= this.canvas.width;
  }

  step() {
    if (this.isPaused) {
      console.log(`${this.name} is paused.`);
      return;
    }

    // this.moveOld();
    this.move();

    this.draw();

    requestAnimationFrame(() => this.step());
  }

  draw() {
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    // Drawing logic goes here
    // console.log(`${this.name} is drawing on the canvas.`);

    this.entities.forEach(entity => {
      this.context.fillStyle = entity.color;
      this.context.fillRect(entity.x, entity.y, entity.width, entity.height);
    });

    this.context.fillStyle = this.player.color;
    this.context.fillRect(this.player.x, this.player.y, this.player.width, this.player.height);
  }

  move() {

    const maxSpeedX = this.superSpeedActive ? this.playerSuperSpeed : this.player.maxSpeedX;

    if (this.controls.right) {
      this.player.directionX = 1;
    } else if (this.controls.left) {
      this.player.directionX = -1;
    }

    if (this.controls.left || this.controls.right) {
      this.player.speedX = Math.min(maxSpeedX, (this.player.speedX < 1 ? 1 : this.player.speedX) * this.player.accelerationX);
    } else {
      this.player.speedX = this.player.speedX && this.player.speedX / this.player.accelerationX;
      if (this.player.speedX < 0.1) {
        this.player.speedX = 0;
      }
    }

    const dx = this.player.speedX * this.player.directionX;

    if (dx) {
      if ((dx > 0 && this.hasMoreStageRight) || (dx < 0 && this.hasMoreStageLeft)) {
        if ((dx < 0 && this.isPlayerBehindOfLeftThreshold()) || (dx > 0 && this.isPlayerBehindOfRightThreshold())) {
          this.player.x += dx;
          if (dx > 0 && this.isPlayerAheadOfRightThreshold()) {
            this.player.x = this.rightThreshold;
          } else if (dx < 0 && this.isPlayerAheadOfLeftThreshold()) {
            this.player.x = this.leftThreshold;
          }
        } else if ((dx < 0 && this.isPlayerAheadOfLeftThreshold()) || (dx > 0 && this.isPlayerAheadOfRightThreshold())) {
          this.player.x -= dx * this.playerEdgeThreshold;
          if (dx > 0 && this.isPlayerBehindOfRightThreshold()) {
            this.player.x = this.rightThreshold;
          } else if (dx < 0 && this.isPlayerBehindOfLeftThreshold()) {
            this.player.x = this.leftThreshold;
          }
          // if player is ahead of 60% of the canvas width, move the platform blocks left
          this.entities.forEach(entity => {
            entity.x -= dx * (1 + this.playerEdgeThreshold);
          });
        } else {
          this.entities.forEach(entity => {
            entity.x -= dx;
          });
        }
      } else if ((dx < 0 && this.player.x > 0) || (dx > 0 && this.player.x + this.player.width < this.canvas.width)) {
        this.player.x += dx;
      }
    }
    
    if (this.player.directionX < 0 && this.isPlayerAheadOfLeftThreshold() && this.hasMoreStageLeft) {
      this.player.x += this.panSpeed;
      this.entities.forEach(entity => {
        entity.x += this.panSpeed;
      });
    } else if (this.player.directionX > 0 && this.isPlayerAheadOfRightThreshold() && this.hasMoreStageRight) {
      this.player.x -= this.panSpeed;
      this.entities.forEach(entity => {
        entity.x -= this.panSpeed;
      });
    }
  }





// vvvv == first attempt -- vvvv


  playerIsAheadOfRightThreshold() {
    return this.player.x > this.rightThreshold;
  }

  playerIsBehindOfRightThreshold() {
    return this.player.x < this.rightThreshold;
  }

  playerIsAheadOfLeftThreshold() {
    return this.player.x < this.leftThreshold;
  }

  playerIsBehindOfLeftThreshold() {
    return this.player.x > this.leftThreshold;
  }

  playerIsFacingRight() {
    return this.facing === 'right';
  }

  playerIsFacingLeft() {
    return this.facing === 'left';
  }

  moveOld() {

    const speed = this.superSpeedActive ? this.playerSuperSpeed : this.playerSpeed;

    if (this.isMovingLeft) {
      if (this.hasMoreStageLeft) {
        if (this.playerIsBehindOfLeftThreshold()) {
          this.player.x -= speed;
          if (this.playerIsAheadOfLeftThreshold()) {
            this.player.x = this.leftThreshold;
          }
        } else if (this.playerIsAheadOfLeftThreshold()) {
          this.player.x += speed * this.playerEdgeThreshold;
          if (this.playerIsBehindOfLeftThreshold()) {
            this.player.x = this.leftThreshold;
          }
          // if player is ahead of 60% of the canvas width, move the platform blocks left
          this.entities.forEach(entity => {
            entity.x += speed * (1 + this.playerEdgeThreshold);
          });
        } else {
          this.entities.forEach(entity => {
            entity.x += speed;
          });
        }
      } else if (this.player.x > 0) {
        this.player.x -= speed;
      }
    } else if (this.isMovingRight) {
      if (this.hasMoreStageRight) {
        if (this.playerIsBehindOfRightThreshold()) {
          this.player.x += speed;
          if (this.playerIsAheadOfRightThreshold()) {
            this.player.x = this.rightThreshold;
          }
        } else if (this.playerIsAheadOfRightThreshold()) {
          this.player.x -= speed * this.playerEdgeThreshold;
          if (this.playerIsBehindOfRightThreshold()) {
            this.player.x = this.rightThreshold;
          }
          // if player is ahead of 60% of the canvas width, move the platform blocks left
          this.entities.forEach(entity => {
            entity.x -= speed * (1 + this.playerEdgeThreshold);
          });
        } else {
          this.entities.forEach(entity => {
            entity.x -= speed;
          });
        }
      } else if (this.player.x + this.player.width < this.canvas.width) {
        this.player.x += speed;
      }
    } else if (this.playerIsFacingLeft() && this.playerIsAheadOfLeftThreshold() && this.hasMoreStageLeft) {
      this.player.x += this.panSpeed;
      this.entities.forEach(entity => {
        entity.x += this.panSpeed;
      });
    } else if (this.playerIsFacingRight() && this.playerIsAheadOfRightThreshold() && this.hasMoreStageRight) {
      this.player.x -= this.panSpeed;
      this.entities.forEach(entity => {
        entity.x -= this.panSpeed;
      });
    }
  }
}