const STANDING_WIDTH = 30
const STANDING_HEIGHT = 40
const CROUCHING_WIDTH = 40
const CROUCHING_HEIGHT = 20

export class Player {
  constructor() {
    this.reset()
  }

  reset() {
    this.geometry = {
      width: STANDING_WIDTH,
      height: STANDING_HEIGHT,
      x: 50,
      y: 60,
    }
    this.attributes = {
      // constants
      color: 'blue',
      standingWidth: STANDING_WIDTH,
      standingHeight: STANDING_HEIGHT,
      crouchWidth: CROUCHING_WIDTH,
      crouchHeight: CROUCHING_HEIGHT,
      maxJumpHeight: 60,
      jumpAcceleration: 0.98,
      fallAcceleration: 1.05,
      startJumpSpeed: 4,
      startFallSpeed: 1,
      crouchSpeed: 2,
      // variable
      verticleDirection: 1,
      jumpingSpot: 0,
      jumpSpeed: 4,
      fallSpeed: 1,
      isCrouching: false,
    }
    this.previousFrame = {
        geometry: { ...this.geometry },
        attributes: { ...this.attributes }
    }
  }

  isWithinBounds(obstacle) {
    return (
        obstacle.x < this.geometry.x + this.geometry.width &&
        obstacle.x + obstacle.width > this.geometry.x &&
        obstacle.y < this.geometry.y + this.geometry.height &&
        obstacle.y + obstacle.height > this.geometry.y
    )
  }

  wasAbove(obstacle, speed) {
    return (
        this.previousFrame.geometry.y + this.previousFrame.geometry.height <= obstacle.y &&
        this.previousFrame.geometry.x + this.previousFrame.geometry.width >= obstacle.x &&
        this.previousFrame.geometry.x <= obstacle.x + obstacle.width
    )
  }

  wasBelow(obstacle, speed) {
    return (
        this.previousFrame.geometry.y >= obstacle.y + obstacle.height &&
        this.previousFrame.geometry.x + this.previousFrame.geometry.width >= obstacle.x &&
        this.previousFrame.geometry.x <= obstacle.x + obstacle.width
    )
  }

  get x() {
    return this.geometry.x
  }
  set x(x) {
    this.previousFrame.geometry.x = this.geometry.x
    this.geometry.x = x
  }
  get y() {
    return this.geometry.y
  }
  set y(y) {
    this.previousFrame.geometry.y = this.geometry.y
    this.geometry.y = y
  }
  get width() {
    return this.geometry.width
  }
  set width(width) {
    this.previousFrame.geometry.width = this.geometry.width
    this.geometry.width = width
  }

  get height() {
    return this.geometry.height
  }
  set height(height) {
    this.previousFrame.geometry.height = this.geometry.height
    this.geometry.height = height
  }

  get verticleDirection() {
    return this.attributes.verticleDirection
  }
  set verticleDirection(verticleDirection) {
    this.previousFrame.attributes.verticleDirection = this.attributes.verticleDirection
    this.attributes.verticleDirection = verticleDirection
  }

  get jumpSpeed() {
    return this.attributes.jumpSpeed
  }
  set jumpSpeed(jumpSpeed) {
    this.previousFrame.attributes.jumpSpeed = this.attributes.jumpSpeed
    this.attributes.jumpSpeed = jumpSpeed
  }
  get fallSpeed() {
    return this.attributes.fallSpeed
  }
  set fallSpeed(fallSpeed) {
    this.previousFrame.attributes.fallSpeed = this.attributes.fallSpeed
    this.attributes.fallSpeed = fallSpeed
  }
  get isCrouching() {
    return this.attributes.isCrouching
  }
  set isCrouching(isCrouching) {
    this.previousFrame.attributes.isCrouching = this.attributes.isCrouching
    this.attributes.isCrouching = isCrouching
  }

  get jumpingSpot() {
    return this.attributes.jumpingSpot
  }
  set jumpingSpot(jumpingSpot) {
    this.previousFrame.attributes.jumpingSpot = this.attributes.jumpingSpot
    this.attributes.jumpingSpot = jumpingSpot
  }
}