import { Canvas } from '@/web/dom-helpers/index.js';
import { Circle, Polygon } from '../../core/index.js';

export type Canvas2dRendererOptions = {
  selector?: string;
  element?: HTMLCanvasElement | null;
  stretchToFit?: boolean;
  graphics?: Array<Circle | Polygon>;
  animate?: boolean;
  step?: (deltaTime?: number) => void;
}

const defaultOptions: Canvas2dRendererOptions = {
  selector: 'canvas',
  element: null as HTMLCanvasElement | null,
  stretchToFit: true,
  graphics: [],
  animate: false,
}

export class Canvas2dRenderer {
  public canvas: HTMLCanvasElement;
  private context: CanvasRenderingContext2D;
  private graphics: Array<Circle | Polygon>;
  private step?: (deltaTime?: number) => void;
  public animate: boolean = false;

  constructor(config: Canvas2dRendererOptions = defaultOptions) {
    const { selector, element, stretchToFit, graphics, animate, step } = { ...defaultOptions, ...config };
    this.canvas = element 
      ? element 
      : selector 
      ? document.querySelector(selector) as HTMLCanvasElement 
      : document.createElement('canvas');
    this.context = this.canvas.getContext('2d') as CanvasRenderingContext2D;
    this.graphics = graphics || [];
    this.animate = animate!;
    this.step = step;

    if (stretchToFit) {
      this.resizeCanvas();
      window.addEventListener('resize', () => this.resizeCanvas());
    }

    this.startAnimation();
  }

  public addGraphic(graphic: Circle | Polygon) {
    this.graphics.push(graphic);
  }

  public addGraphics(graphics: Array<Circle | Polygon>) {
    graphics.forEach(graphic => this.addGraphic(graphic));
  }

  private resizeCanvas() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
    this.clear();
  }

  public clear() {
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }

  public draw() {
    this.clear();
    this.graphics.forEach(graphic => {
      if (graphic instanceof Circle) {
        this.drawCircle(graphic.x, graphic.y, graphic.radius, graphic.styles);
      } else if (graphic instanceof Polygon) {
        const path = new Path2D();
        graphic.getCoordinates().forEach((point, index) => {
          if (index === 0) {
            path.moveTo(point.x, point.y);
          } else {
            path.lineTo(point.x, point.y);
          }
        });
        path.closePath();
        this.drawPath(path, graphic.color);
      }
    });
  }

  public drawRectangle(x: number, y: number, width: number, height: number, color: string) {
    this.context.fillStyle = color;
    this.context.fillRect(x, y, width, height);
  }

  public drawCircle(x: number, y: number, radius: number, styles: CanvasRenderingContext2D) {
    Object.assign(this.context, styles);
    this.context.beginPath();
    this.context.arc(x, y, radius, 0, Math.PI * 2);
    if (styles.fillStyle) {
      this.context.fill();
    }
    if (styles.strokeStyle || styles.lineWidth) {
      this.context.stroke();
    }
  }

  public drawLine(x1: number, y1: number, x2: number, y2: number, color: string, lineWidth: number = 1) {
    this.context.strokeStyle = color;
    this.context.lineWidth = lineWidth;
    this.context.beginPath();
    this.context.moveTo(x1, y1);
    this.context.lineTo(x2, y2);
    this.context.stroke();
  }

  public drawPath(path: Path2D, color: string, lineWidth: number = 1) {
    this.context.strokeStyle = color;
    this.context.lineWidth = lineWidth;
    this.context.stroke(path);
  }

  public drawText(text: string, x: number, y: number, fontSize: string = '16px', color: string = 'black') {
    this.context.font = `${fontSize} sans-serif`;
    this.context.fillStyle = color;
    this.context.fillText(text, x, y);
  }

  private startAnimation() {
    const animate = (timestamp: number) => {
      if (this.step) {
        this.step(timestamp);
      }
      this.draw();
      if (this.animate) {
        requestAnimationFrame(animate);
      }
    };
    requestAnimationFrame(animate);
  }
}