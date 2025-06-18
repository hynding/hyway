const DEFAULT_CONFIG = {
    parentSelector: 'body',
    selector: 'canvas',
    width: 800,
    height: 600,
    context: '2d',
}
export class Canvas {
    constructor(config = DEFAULT_CONFIG) {
        if (config.selector) {
            this.container = document.querySelector(config.selector)
        } else if (config.parentSelector) {
            const canvas = document.createElement('canvas')
            canvas.width = config.width
            canvas.height = config.height
            this.container = canvas
            document.querySelector(this.config.parentSelector).appendChild(canvas)
        }
        this.context = this.container.getContext(config.context)
    }

    clear() {
        this.context.clearRect(0, 0, this.config.width, this.config.height)
    }

    draw(assets) {
        this.clear()
        assets.forEach(asset => {
            
        })
    }
}