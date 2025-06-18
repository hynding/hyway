
import { component } from '../component.js'

export const registerBoxComponent = (localName = 'hyway-box') => component({
    name: localName,
    props: {
        tag: 'div'
    },
    template: `
        <div part="box">
            <slot></slot>
        </div>
    `
})