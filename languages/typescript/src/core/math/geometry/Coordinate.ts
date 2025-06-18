export type CoordinateObject = 
    [number?, number?, number?] |
    { x?: number, y?: number, z?: number } 

export class Coordinate {
    public x: number = 0;
    public y: number = 0;
    public z: number = 0;

    constructor(
        xOrObject: number | CoordinateObject = 0,
        y: number = 0,
        z: number = 0
    ) {
        if (typeof xOrObject === 'number') {
            this.x = xOrObject;
            this.y = y;
            this.z = z;
        } else if (Array.isArray(xOrObject)) {
            this.x = xOrObject?.[0] ?? 0;
            this.y = xOrObject?.[1] ?? y;
            this.z = xOrObject?.[2] ?? z;
        } else if (typeof xOrObject === 'object') {
            this.x = xOrObject.x ?? 0;
            this.y = xOrObject.y ?? y;
            this.z = xOrObject.z ?? z;
        }
    }
}