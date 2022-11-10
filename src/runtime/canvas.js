class Canvas {
    constructor() {
        this.canvas = document.querySelector('canvas')
        this.context = this.canvas.getContext('2d')
        this.responsive()
        this.setDefaultCursor()
    }

    launch(component, reLayout) {
        this.component = component
        this.reLayout = reLayout
        // 读取图片尺寸, 重新排版
        for (let child of component.children) {
            if (child.constructor.name === 'ImageComponent') {
                child.setBox()
                reLayout()
            }
        }
        setInterval(() => {
            this.context.clearRect(0, 0, this.canvas.width, this.canvas.height)
            this.draw(component)
        }, 1000/60)
    }

    draw(component) {
        component.draw()
        for (let child of component.children) {
            this.draw(child)
        }
    }

    responsive() {
        this.canvas.width = window.innerWidth
        this.canvas.height = window.innerHeight
        window.addEventListener('resize', () => {
            this.canvas.width = window.innerWidth
            this.canvas.height = window.innerHeight
            this.component.style['width'].value = this.canvas.width
            this.component.style['height'].value = this.canvas.height
            this.reLayout()
        })
    }

    setDefaultCursor() {
        window.addEventListener('mousemove', () => {
            document.body.style.cursor = 'auto'
        })
    }
}
