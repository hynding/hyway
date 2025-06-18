export const iterate = (renderer: any, fn: any) => (content: any) => {
    const context = renderer(content)
    const key = context.attribute("data-for-each");
    const [id, data] = key.split(" in ");
    const children: any[] = []
    context.children.forEach((child: any) => {
        const childContext = renderer(child)
        children.push(childContext.clone())
    })
    fn({ content, id, data, children });
}