const DEFAULT_SETTINGS = {
  width: 30,
  height: 50,
  x: 50,
  y: 150,
  color: 'green',
  directionX: 1,
  directionY: 0,
  accelerationX: 1.08,
  accelerationY: 0,
  speedX: 0,
  maxSpeedX: 5,
};

export class Player {
  constructor(_settings = {}) {
    const settings = { ...DEFAULT_SETTINGS, ..._settings};
    this.width = settings.width;
    this.height = settings.height;
    this.x = settings.x;
    this.y = settings.y;
    this.color = settings.color;
    this.directionX = settings.directionX;
    this.directionY = settings.directionY;
    this.accelerationX = settings.accelerationX;
    this.accelerationY = settings.accelerationY;
    this.speedX = settings.speedX;
    this.maxSpeedX = settings.maxSpeedX;

  }
}
