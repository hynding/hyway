import { Canvas } from '../../languages/typescript/dist/src/web/index.js';
import { Player } from './Player.js';

export class WebRunner {
    constructor() {
        this.platform = new Canvas({
            selector: 'canvas',
            width: 400,
            height: 200,
            context: '2d',
        })
        this.player = new Player()
        this.assets = [
            {
                id: 'player', 
                type: 'rectangle',
                color: this.player.attributes.color,
                // x: this.player.x, 
                // y: this.player.y, 
                width: this.player.width, 
                height: this.player.height,
            },
            {
                id: 'platform', 
                type: 'rectangle',
                color: 'black',
                // x: 0, 
                // y: this.platform.container.height - 20, 
                width: 50, 
                height: 2,
            },
            {
                id: 'block', 
                type: 'rectangle',
                color: 'green',
                // x: 0, 
                // y: this.platform.container.height - 20, 
                width: 30, 
                height: 40,
            },
            {
                id: 'spikes', 
                type: 'rectangle',
                color: 'red',
                // x: 0, 
                // y: this.platform.container.height - 20, 
                width: 30, 
                height: 40,
            },
        ]
        this.assetMap = this.assets.reduce((map, asset) => {
            map[asset.id] = asset;
            return map;
        }, {});
        this.instances = []
        this.isGameOver = false

        this.moveUp = false
        this.moveDown = false

        this.initSpeed = 0.4
        this.speed = this.initSpeed
        this.maxSpeed = 2
        this.acceleration = 1.005
        this.setupControls()
        this.init()
        this.step()
    }

    setupControls() {
        window.addEventListener('keydown', (event) => {
            switch (event.key) {
                case 'ArrowUp':
                    this.moveUp = true;
                    break;
                case 'ArrowDown':
                    this.moveDown = true;
                    break;
            }
        });
        window.addEventListener('keyup', (event) => {
            switch (event.code) {
                case 'ArrowUp':
                    this.moveUp = false;
                    break;
                case 'ArrowDown':
                    this.moveDown = false;
                    break;
                case 'Space':
                    this.reset()
                    // obstaces = [];
                    // generateObstacle();
                    // speed = initSpeed;
                    // player.reset();
                    // this.isGameOver = false;
                    // step();
                    // console.log('reset');
                    break;
            }
        });
    }

    init() {
        this.speed = this.initSpeed
        this.instances = []
        this.addInstance('player', this.player.x, this.player.y)
        const floorTile = this.assetMap['platform']
        const initialTiles = Math.ceil(this.platform.container.width / floorTile.width) + 1
        for(let i = 0; i < initialTiles; i++) {
            this.addInstance('platform', i * floorTile.width, this.platform.container.height - 20)
        }
    }

    addInstance(assetId, x, y) {
        this.instances.push({
            x, y,
            ...this.assetMap[assetId]
        });
    }

    removeInstance(instance) {
        this.instances = this.instances.filter(a => a !== instance);
    }


    generateObstacle() {
        const isPlatform = Math.random() < 0.5;
        const isGroundObstacle = Math.random() < 0.5;
        const obstacle = {
            // x: Math.random() * (canvasElement.width - 30) + (canvasElement.width),
            x: Math.random() * (canvas.width - 30) + (canvas.width),
            y: ground.y - (isGroundObstacle ? 40 : 60),
            width: 30,
            height: 40,
            color: isPlatform ? 'green' : 'red',
            isPlatform
        };
        // addInstance
        obstaces.push(obstacle);
    }

    step() {
        if (this.isGameOver) {
            console.log('game over')
            return
        }
        [...this.instances].forEach((instance) => {
            if (instance.id === 'player') {
                if (!this.player.isCrouching) {
                    if (this.moveUp && !this.player.verticleDirection) {
                        this.player.jumpingSpot = instance.y + instance.height;
                        this.player.jumpSpeed = this.player.attributes.startJumpSpeed;
                        this.player.verticleDirection = -1;
                    // was jumping up, needs to start falling
                    } else if (!this.moveUp && this.player.verticleDirection === -1) {
                        this.player.fallSpeed = this.player.attributes.startFallSpeed;
                        this.player.verticleDirection = 1;
                    }

                    // jumping up
                    if (this.player.verticleDirection < 0) {
                        this.player.jumpSpeed *= this.player.attributes.jumpAcceleration;
                        instance.y -= this.player.jumpSpeed;

                        if (instance.y < this.player.jumpingSpot - (instance.y + this.player.attributes.maxJumpHeight)) {
                            instance.y = this.player.jumpingSpot - (instance.y + this.player.attributes.maxJumpHeight)
                            this.player.fallSpeed = this.player.attributes.startFallSpeed;
                            this.player.jumpSpeed = this.player.attributes.startJumpSpeed;
                            this.player.verticleDirection = 1;
                        }
                    } else if (this.player.verticleDirection > 0) {
                        this.player.fallSpeed *= this.player.attributes.fallAcceleration;
                        instance.y += this.player.fallSpeed;

                        // TODO - account for ground
                        if (instance.y + instance.height >= 180/*ground.y*/) {
                            instance.y = 180/*ground.y*/ - instance.height;
                            this.player.fallSpeed = this.player.attributes.startFallSpeed;
                            this.player.verticleDirection = 0;
                        }
                    }
                }

                // crouching
                if (this.player.verticleDirection === 0) {
                    if (this.moveDown) {
                        this.player.isCrouching = true;
                        if (instance.width < this.player.attributes.crouchWidth) {
                            instance.width += this.player.attributes.crouchSpeed;
                        } else {
                            instance.width = this.player.attributes.crouchWidth;
                        }
                        if (instance.height > this.player.attributes.crouchHeight) {
                            instance.height -= this.player.attributes.crouchSpeed;
                        } else {
                            instance.height = this.player.attributes.crouchHeight;
                        }
                    } else {
                        if (instance.width > this.player.attributes.standingWidth) {
                            instance.width -= this.player.attributes.crouchSpeed;
                        } else {
                            instance.width = this.player.attributes.standingWidth;
                        }
                        if (instance.height < this.player.attributes.standingHeight) {
                            instance.height += this.player.attributes.crouchSpeed;
                        } else {
                            instance.height = this.player.attributes.standingHeight;
                        }
                        if (instance.width === this.player.attributes.standingWidth && instance.height === this.player.attributes.standingHeight) {
                            this.player.isCrouching = false;
                        }
                    }
                    if (!this.player.isCrouching && instance.y + instance.height < 180/*ground.y*/) {
                        this.player.verticleDirection = 1;
                    } else {
                        instance.y = 180/*ground.y*/ - instance.height;
                    }
                }


            } else {
                instance.x -= this.speed;
                // draw obstacle when in bounds
                if (instance.x < this.platform.container.width && instance.x + instance.width > 0) {

                    // check for collision with the player
                    if (this.player.isWithinBounds(instance)) {
                        if (instance.id !== 'spikes') {
                            if (this.player.wasAbove(instance)) {
                                instance.y = instance.y - instance.height;
                                this.player.fallSpeed = this.player.attributes.startFallSpeed;
                                this.player.verticleDirection = 0;
                            } else if (this.player.wasBelow(instance)) {
                                this.player.isCrouching = true
                                instance.y = instance.y + instance.height;
                                instance.width = this.player.attributes.crouchWidth;
                                instance.height = this.player.attributes.crouchHeight;
                            }
                        } else {
                            // game over
                            this.isGameOver = true;
                        }
                    }
                }
            }

            const shouldRemove = instance.x + instance.width < 0
            if (shouldRemove) {
                // TEMP - add new platform tile when removing one
                if (instance.id === 'platform') {
                    console.log('adding new platform tile')
                    instance.x = this.platform.container.width
                } else {
                    this.removeInstance(instance)
                }
            }
        })

        if (this.speed < this.maxSpeed) {
            this.speed = Math.min(this.speed * this.acceleration, this.maxSpeed);
        }

        this.platform.render(this.instances)

        requestAnimationFrame(() => {
            this.step();
        })
    }
}