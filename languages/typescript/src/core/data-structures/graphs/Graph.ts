export class Graph<T> {
    protected nodes: T[];

    constructor(nodes: T[] = []) {
        this.nodes = [...nodes];
    }
}