import { Coordinate } from "./Coordinate";

export class BoundingBox {
    public min: Coordinate = new Coordinate();
    public max: Coordinate = new Coordinate();

    public getWidth(): number {
        return Math.abs(this.max.x - this.min.x);
    }

    public getHeight(): number {
        return Math.abs(this.max.y - this.min.y);
    }

    public getDepth(): number {
        return Math.abs(this.max.z - this.min.z);
    }
}