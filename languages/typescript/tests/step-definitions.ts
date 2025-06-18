import assert from 'assert'
import { Given, When, Then, world } from '@cucumber/cucumber'
import { getSumFloat } from '@/core/data-types/floats/getSumFloat'
import { getProductFloat } from '@/core/data-types/floats/getProductFloat'
import { getAdjacentMathendArray } from '@/core/data-structures/arrays/getAdjacentMathendArray'

Given("the values {float} and {float}", (value1: number, value2: number) => {
    world.values = [value1, value2]
})

Given("the following values", (table) => {
    world.table = table.hashes()
})
    
When("I get the {word} of the values", (opertation: string) => {
    if (world.table) {
        world.values = world.table.map((row: { values: string }) => 
            row.values.split(',').map((value: string) => parseFloat(value))
        )
    } else {
        world.values = [world.values]
    }
    switch (opertation) {
        case "sum":
            return world.results = world.values.map((values: any) => getSumFloat(...values))
        case "product":
            return world.results = world.values.map((values: any) => getProductFloat(...values))

    }
})

Then("the result should be {float}", (expected: number) => {
    assert.strictEqual(world.result, expected)
})

Then("the result should match the provided answer", () => {
    world.results.forEach((result: unknown, index: string | number) => {
        assert.strictEqual(result, parseFloat(world.table[index].answer))
    })
})

Given("the following array", (table) => {
    world.array = table.raw().map((row: any[]) => row.map(value => parseFloat(value)))[0]
})

Given("the adjacent mathend empty value is {int}", (emptyValue: number) => {
    world.emptyValue = emptyValue
})

Given("I wish to operate on the {word} of {int} adjacent mathend values", (operation: string, adjacent: number) => {
    world.matchCount = adjacent
    world.operation = operation
})

When("I request the adjacent mathends to the {word}", (direction: string) => {
    const { array, emptyValue, matchCount, operation } = world
    const isEnd = direction === "right"
    const equation = (value: number) => value*2
    world.result = getAdjacentMathendArray(array, isEnd, equation, emptyValue, matchCount)
})

Then("I should get the following array", (table) => {
    const expected = table.raw().map((row: any[]) => row.map(value => parseFloat(value)))[0]
    assert.deepStrictEqual(world.result, expected)
})