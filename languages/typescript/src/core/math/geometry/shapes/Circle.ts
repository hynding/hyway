import { Coordinate, type CoordinateObject } from '../Coordinate.js';
import { Shape } from '../Shape.js';

export class Circle extends Shape {
    constructor(origin: Coordinate | CoordinateObject, public radius: number, styles: CanvasRenderingContext2D) {
      super('circle', origin, styles)
    }

    getArea(): number {
        return Math.PI * this.radius * this.radius;
    }

    getCircumference(): number {
        return 2 * Math.PI * this.radius;
    }

    // getCoordinates(): { x: number; y: number }[] {
    //     const coordinates = [];
    //     for (let angle = 0; angle < 360; angle += 1) {
    //         const radian = (angle * Math.PI) / 180;
    //         coordinates.push({
    //             x: this.center.x + this.radius * Math.cos(radian),
    //             y: this.center.y + this.radius * Math.sin(radian)
    //         });
    //     }
    //     return coordinates;
    // }
}