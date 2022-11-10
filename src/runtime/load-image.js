function loadImage(component) {
    if (component instanceof ImageComponent) {
        component.image = new Image()
        component.image.src = component.props.path
    }
    for (let child of component.children) {
        loadImage(child)
    }
}
