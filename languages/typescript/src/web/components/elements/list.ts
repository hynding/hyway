
import { component } from '../component.js'

export const registerListComponent = (localName = 'hyway-list') => component({
    name: localName,
    props: {
        component: 'ul',
        itemComponent: 'li',
        items2: [
            { name: 'Item 1' },
            { name: 'Item 2' },
            { name: 'Item 3' },
            { name: 'Item 4' },
            { name: 'Item 5' }
        ]
    },
    data: {
        test: 'Hello World'
    },
    computed: {
        test2() {
            return this.test + ' 2'
        },
        test3() {
            return this.test2() + ' 3'
        }
    },
    methods: {
        increment() {
            this.test = this.test + '!' as any
        },
        async getData() {
            const response = await fetch('./data.json')
            const data = await response.json()
            this.test = data.name
        }
    },
    async mounted() {
        await this.getData()
    },
    template: `
        <ul data-for-each="item in items2" part="list">
            <li data-bind="item.name"></li>
        </ul>
    `
})