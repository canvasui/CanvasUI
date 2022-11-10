function main() {
    let { style, template, script } = components.main
    new StyleBinder(template, style).bind()
    let canvas = new Canvas()
    let component = new TemplateParser(template, canvas.context).parse()
    component.style['width'] = { value: canvas.canvas.width }
    component.style['height'] = { value: canvas.canvas.height }
    new Mvvm(component, script, () => {
        // 在属性发生改变的时候重排
        new Layouter(component).layout()
    })
    ImageLoader.load(template)
    ImageLoader.finish(() => {
        canvas.launch(component, () => {
            // 在窗口大小改变的时候重排
            new Layouter(component).layout()
        })
    })
}
