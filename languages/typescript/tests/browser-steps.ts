import { Given, When, Then, world } from '@cucumber/cucumber'
import { JSDOM } from 'jsdom'
import { elementFactory } from '@/web/dom-helpers/elementFactory'

Given("the following HTML", (html: string) => {
    world.dom = new JSDOM(html)
    global.document = world.dom.document
    global.window = world.dom.window
})