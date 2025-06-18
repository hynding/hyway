export class Camera {
  constructor({ context, top, left, width, height, stage }) {
    this.context = context;
    this.top = top;
    this.left = left;
    this.width = width;
    this.height = height;
    this.stage = stage;
    this.assets = [];
  }

  snap() {
    this.scenery = this.stage.dressings();
  }
}
