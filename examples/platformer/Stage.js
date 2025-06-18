const DEFAULT_BOUNDS = {
  top: 0,
  left: 0,
  width: 0,
  height: 0,
}

export class Stage {
  constructor({ bounds = DEFAULT_BOUNDS, assets = []}) {
    this.bounds = bounds;
    this.assets = [...assets];
  }
}