export class Polygon {
    constructor(
        public vertices: { x: number; y: number }[],
        public color: string = 'black',
        public name: string = 'Polygon'
    ) {}

    getArea(): number {
        let area = 0;
        const n = this.vertices.length;
        for (let i = 0; i < n; i++) {
            const j = (i + 1) % n;
            area += this.vertices[i].x * this.vertices[j].y;
            area -= this.vertices[j].x * this.vertices[i].y;
        }
        return Math.abs(area) / 2;
    }

    getPerimeter(): number {
        let perimeter = 0;
        const n = this.vertices.length;
        for (let i = 0; i < n; i++) {
            const j = (i + 1) % n;
            const dx = this.vertices[j].x - this.vertices[i].x;
            const dy = this.vertices[j].y - this.vertices[i].y;
            perimeter += Math.sqrt(dx * dx + dy * dy);
        }
        return perimeter;
    }

    getCoordinates(): { x: number; y: number }[] {
        return this.vertices;
    }
}