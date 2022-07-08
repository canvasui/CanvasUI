class Canvas {
    constructor() {
        this.canvas = document.querySelector('canvas')
        this.context = this.canvas.getContext('2d')
        this.component = null
        this.responsive()
        this.setDefaultCursor()
    }

    launch(component) {
        this.component = component
        this.component.initQueue.forEach(callback => callback())
        requestAnimationFrame(this.mainloop.bind(this))
    }

    mainloop() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height)
        this.draw(this.component)
        requestAnimationFrame(this.mainloop.bind(this))
    }

    draw(component) {
        component.draw()
        for (let child of component.children) {
            this.draw(child)
        }
    }

    responsive() {
        let timer = null
        let resize = () => {
            let dpr = window.devicePixelRatio
            if ('ontouchstart' in document) {
                dpr = 1
            }
            this.canvas.width = window.innerWidth * dpr
            this.canvas.height = window.innerHeight * dpr
            this.canvas.style.width = `${window.innerWidth}px`
            this.canvas.style.height = `${window.innerHeight}px`
            this.context.scale(dpr, dpr)
        }
        resize()
        window.addEventListener('resize', () => {
            clearTimeout(timer)
            timer = setTimeout(() => {
                resize()
                this.component.style['width'].value = window.innerWidth
                this.component.style['height'].value = window.innerHeight
                layout(this.component, true)
            }, 100)
        })
    }

    setDefaultCursor() {
        document.addEventListener('mousemove', () => {
            document.body.style.cursor = 'auto'
        })
    }
}
