// https://en.wikipedia.org/wiki/Particle

export class Particle {
    public mass: number = 1;
    public radius: number = 1;
    public position: { x: number; y: number } = { x: 0, y: 0 };
    public velocity: { x: number; y: number } = { x: 0, y: 0 };
    public acceleration: { x: number; y: number } = { x: 0, y: 0 };
    public force: { x: number; y: number } = { x: 0, y: 0 };
    public angle: number = 0;
    public angularVelocity: number = 0;
    public angularAcceleration: number = 0;
}