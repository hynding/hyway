import { Given, When, Then, world } from '@cucumber/cucumber'
import { stub } from 'sinon'

const setupRandomStub = () => {
    if (world.randomStub) {
        world.randomStub.restore()
    }
    world.randomStub = stub(Math, 'random')
}

Given("our native randomization function returns {float}", (value: number) => {
    setupRandomStub()
    world.randomStub.returns(value)
})

Given("our native randomization function returns the successive values", (table) => {
    setupRandomStub()
    table.raw().forEach((row: any[], index: number) => {
        world.randomStub.onCall(index).returns(parseFloat(row[0]))
    })
})