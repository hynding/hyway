import { Coordinate } from "@/core/math/geometry/Coordinate";
import { Material } from "./Material";
import { BoundingBox } from "@/core/math/geometry/BoundingBox";

//https://en.wikipedia.org/wiki/Physical_object
export class PhysicalObject {
    public mass: number = 1;
    public rotation: number = 0; // in radians
    public velocity: Coordinate = new Coordinate();
    public density: number = 1;
    public volume: number = 0;
    public radius: number = 0;
    public friction: number = 0.1;
    public restitution: number = 0.5;
    public magnetism: number = 0;
    public materials: Material[] = [];
    public boundingBox: BoundingBox = new BoundingBox();
    public origin: Coordinate = new Coordinate();
    public direction: Coordinate = new Coordinate(1, 0, 0); // Default direction along the x-axis
}