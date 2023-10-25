const components = {}

function main() {
    // 创建 Canvas, 获取 context, pen 设置 context
    let canvas = new Canvas()
    pen.setContext(canvas.context)

    // 遍历 componentJson, 转换为若干 Component 对象, 并挂在 components 上
    for (let [key, value] of Object.entries(componentJson)) {
        let { style, template, script, error } = value
        if (error) {
            document.body.innerHTML = `<div style="font-size: 30px; color: red;">${error}</div>`
            return
        }
        let component = construct(template, canvas.context)
        bindData(component, style, script)
        components[key] = component
    }

    // 根组件
    let rootComponent = components.main

    // 挂载子组件
    mountChildren(rootComponent)

    // 如果 dpr 不为 1, 需要缩放 canvas. 但其 style 的宽高始终和视口是一致的.
    rootComponent.style['width'] = { value: canvas.canvas.style.width }
    rootComponent.style['height'] = { value: canvas.canvas.style.height }

    // 载入图片, 排版, 渲染
    loadImage(rootComponent)
    layout(rootComponent)
    canvas.launch(rootComponent)
}
