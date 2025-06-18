import { elementFactory } from '../elementFactory.js'

const DEFAULT_CONFIG = {
    parentSelector: 'body',
    selector: 'canvas',
    width: 800,
    height: 600,
    context: '2d',
}
export class Canvas {
    public container: HTMLCanvasElement
    public context: CanvasRenderingContext2D

    constructor(config = DEFAULT_CONFIG) {
        if (config.selector) {
            // this.container = elementFactory(config.selector).get() as HTMLCanvasElement
            const canvas = elementFactory(config.selector, false)
            canvas.attr('width', config.width.toString())
            canvas.attr('height', config.height.toString())
            this.container = canvas.get() as HTMLCanvasElement
            this.container.width = config.width
            this.container.height = config.height
        } else if (config.parentSelector) {
            const canvas = elementFactory('canvas', true)
            this.container = canvas.get() as HTMLCanvasElement
            this.container.width = config.width
            this.container.height = config.height
            elementFactory(config.parentSelector).add(canvas)
        } else {
            throw new Error('Canvas could not be created')
        }
        const context = this.container.getContext(config.context);
        if (context instanceof CanvasRenderingContext2D) {
            this.context = context;
        } else {
            throw new Error('Canvas context could not be created')
        }
    }

    clear() {
        this.context.clearRect(0, 0, this.container.width, this.container.height)
    }

    // FIX: don't use 'any' type
    render(assets: any[]) {
        this.clear()
        assets.forEach(asset => {
            // check if asset is in viewport

            // use switch statement to determine type of asset
            switch (asset.type) {
                case 'circle':
                    this.context.beginPath()
                    this.context.arc(asset.x, asset.y, asset.radius, 0, Math.PI * 2)
                    this.context.fillStyle = asset.color
                    this.context.fill()
                    this.context.closePath()
                    break
                case 'rectangle':
                    this.context.fillStyle = asset.color
                    this.context.fillRect(asset.x, asset.y, asset.width, asset.height)
                    break
                case 'line':
                    this.context.beginPath()
                    this.context.moveTo(asset.x1, asset.y1)
                    this.context.lineTo(asset.x2, asset.y2)
                    this.context.strokeStyle = asset.color
                    this.context.lineWidth = asset.width
                    this.context.stroke()
                    this.context.closePath()
                    break
                case 'polygon':
                    this.context.beginPath()
                    this.context.moveTo(asset.points[0].x, asset.points[0].y)
                    asset.points.forEach((point: { x: number; y: number }) => {
                        this.context.lineTo(point.x, point.y)
                    })
                    this.context.closePath()
                    this.context.fillStyle = asset.color
                    this.context.fill()
                    this.context.strokeStyle = asset.strokeColor
                    this.context.lineWidth = asset.strokeWidth
                    this.context.stroke()
                    break
                case 'text':
                    this.context.font = `${asset.size}px ${asset.font}`
                    this.context.fillStyle = asset.color
                    this.context.fillText(asset.text, asset.x, asset.y)
                    break
                case 'image':
                    // should preload image
                    const img = new Image()
                    img.src = asset.src
                    img.onload = () => {
                        this.context.drawImage(img, asset.x, asset.y, asset.width, asset.height)
                    }
                    break
            }
        })
    }
}