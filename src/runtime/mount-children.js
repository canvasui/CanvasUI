function mountChildren(component) {
    for (let i = 0; i < component.children.length; i++) {
        if (component.children[i] instanceof CustomComponent) {
            component.children[i] = component.children[i].mount()
        }
        mountChildren(component.children[i])
    }
}
