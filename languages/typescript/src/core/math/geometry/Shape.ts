import { Coordinate, type CoordinateObject } from "./Coordinate.js";

export class Shape<S = CanvasRenderingContext2D> {
    public origin!: Coordinate;

    constructor(
        public name: string,
        origin: Coordinate | CoordinateObject,
        public styles: S
    ) {
        if (!(origin instanceof Coordinate)) {
            this.origin = new Coordinate(origin || [0, 0]);
        } else {
            this.origin = origin;
        }
    }

    get x(): number {
        return this.origin.x;
    }

    set x(value: number) {
        this.origin.x = value;
    }

    get y(): number {
        return this.origin.y;
    }

    set y(value: number) {
        this.origin.y = value;
    }

    get z(): number {
        return this.origin.z;
    }

    set z(value: number) {
        this.origin.z = value;
    }
}