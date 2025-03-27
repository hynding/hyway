import { Graph } from './Graph'

export class DirectAcyclicGraph<DagNode, DagNodeIdKey extends keyof DagNode> extends Graph<DagNode> {
    private adjacencyMap: Map<string, DagNode[]>
    private nodeIdKey: DagNodeIdKey

    constructor(rootNode: DagNode, nodeIdKey: DagNodeIdKey) {
        super([rootNode])
        this.nodeIdKey = nodeIdKey
        this.adjacencyMap = new Map<string, DagNode[]>()
        this.adjacencyMap.set(`${rootNode[nodeIdKey]}`, [])
    }
    addEdge(id: string, dagNode: DagNode) {
        const dagNodeId = `${dagNode[this.nodeIdKey]}`
        if (this.adjacencyMap.has(id) && this.adjacencyMap.get(id)?.find(n => `${n[this.nodeIdKey]}` === dagNodeId)) {
            throw new Error('Adding this edge will create a cycle')
        }
        if (!this.adjacencyMap.has(id)) {
            this.nodes.push(dagNode)
            this.adjacencyMap.set(id, [])
        }
        this.adjacencyMap.get(id)?.push(dagNode)
    }
    topologicalSortUtil(dagNode: DagNode, visited: Record<string, boolean | undefined> = {}, stack: DagNode[] = []) {
        const id = `${dagNode[this.nodeIdKey]}`
        visited[id] = true
        if (this.adjacencyMap.has(id)) {
            for (const n of this.adjacencyMap.get(id) as DagNode[]) {
                if (!visited[id]) {
                    this.topologicalSortUtil(n, visited, stack)
                }
            }
        }
        stack.push(dagNode)
    }
    topologicalSort() {
        const visited = {} as Record<string, boolean>
        const stack: DagNode[] = []
        this.nodes.forEach(dagNode => {
            const id = `${dagNode[this.nodeIdKey]}`
            if (!visited[id]) {
                this.topologicalSortUtil(dagNode, visited, stack)
            }
        })
        return stack
    }

    print() {
        for (const [key, value] of this.adjacencyMap) {
            console.log(key, '->', value)
        }
    }
}
