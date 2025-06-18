//https://en.wikipedia.org/wiki/Spacetime
import { PhysicalObject } from '../PhysicalObject.js';
import { Coordinate } from '@/core/math/geometry/Coordinate.js';

export class Spacetime {
    public origin: Coordinate = new Coordinate({x: 0, y: 0, z: 0});
    public bodies: PhysicalObject[] = [];
    public lengthUnit: string = 'm';
    public timeUnit: string = 's';
    public massUnit: string = 'kg';
    public time: number = 0;

    constructor() {

    }
}