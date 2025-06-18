import { Canvas } from "./Canvas.js";
export class Game {
    constructor(assets = []) {
        this.platform = new Canvas({
            selector: 'canvas',
            width: 400,
            height: 200,
            context: '2d',
        });
        this.assets = assets;
        this.state = 'running'; // paused, game-over
    }

    addAsset(asset) {
        this.assets.push(asset);
    }

    removeAsset(asset) {
        this.assets = this.assets.filter(a => a !== asset);
    }
}