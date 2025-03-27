import assert from 'assert'
import { Given, When, Then, world } from '@cucumber/cucumber'
import { DirectAcyclicGraph } from '@/data-structures/graphs/DirectAcyclicGraph'

type TestNode = { id: string, value: string }
const testNode = (id: string, value: string): TestNode => {
    return { id, value }
}
Given("the test nodes", () => {
    
    const nodeA = testNode('a', 'A')
    const nodeB = testNode('b', 'B')
    const nodeC = testNode('c', 'C')
    const nodeD = testNode('d', 'D')
    const nodeE = testNode('e', 'E')
    const nodeF = testNode('f', 'F')
    const nodeG = testNode('g', 'G')
    const DAG = new DirectAcyclicGraph<TestNode, 'id'>(nodeA, 'id')
    DAG.addEdge('a', nodeD)
    DAG.addEdge('a', nodeB)
    DAG.addEdge('a', nodeE)
    DAG.addEdge('d', nodeE)
    DAG.addEdge('b', nodeE)
    DAG.addEdge('b', nodeG)
    DAG.addEdge('b', nodeC)
    DAG.addEdge('e', nodeF)
    DAG.addEdge('c', nodeG)
    DAG.addEdge('g', nodeF)
    world.DAG = DAG
    

    // const DAG = new DirectAcyclicGraph(2)
    // DAG.addEdge(0, 3)
    // DAG.addEdge(0, 1)
    // DAG.addEdge(0, 4)
    // DAG.addEdge(3, 4)
    // DAG.addEdge(1, 4)
    // DAG.addEdge(1, 6)
    // DAG.addEdge(1, 2)
    // DAG.addEdge(4, 5)
    // DAG.addEdge(2, 6)
    // DAG.addEdge(6, 5)
    // world.DAG = DAG
})
Then("I should see test node results", () => {
    // console.log(world.DAG.topologicalSort().map(n => n.value).join(' -> '))
    // console.log(world.DAG.topologicalSort().join(' -> '))
    // console.log(world.DAG.transitiveClosure().join(' -> '))
    // console.log(world.DAG.print())
})