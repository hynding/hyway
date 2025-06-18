export class GameAsset {
    constructor(config) {
        this.config = config
        this.reset()
    }

    reset() {
        this.geometry = {
            width: 0,
            height: 0,
            x: 0,
            y: 0,
        }
        this.attributes = {
            color: 'black',
            width: 0,
            height: 0,
            x: 0,
            y: 0,
        }
    }
}