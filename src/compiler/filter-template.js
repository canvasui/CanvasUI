function filterTemplate(component) {
    component.children = component.children.filter(child => child.type === 'component')
    for (let child of component.children) {
        filterTemplate(child)
    }
    return component
}


module.exports = filterTemplate
