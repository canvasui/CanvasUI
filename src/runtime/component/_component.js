class Component {
    constructor(component, context) {
        this.vm = null
        this.parent = component.parent
        this.props = component.props
        this.style = component.style
        this.context = context
        this.layout = {}
        this.children = []
    }

    roundedRect(x, y, width, height, radius, color, style="solid"){
        let lineWidth = this.context.lineWidth
        if (style === 'dotted') {
            this.context.setLineDash([lineWidth, lineWidth])
        } else if (style === 'dashed') {
            this.context.setLineDash([4 * lineWidth, 4 * lineWidth])
        }
        x += lineWidth / 2
        y += lineWidth / 2
        width -= lineWidth
        height -= lineWidth
        this.context.beginPath()
        this.context.strokeStyle = color
        this.context.moveTo(x, y + radius)
        this.context.lineTo(x, y + height - radius)
        this.context.quadraticCurveTo(x, y + height, x + radius, y + height)
        this.context.lineTo(x + width - radius, y + height)
        this.context.quadraticCurveTo(x + width, y + height, x + width, y + height - radius)
        this.context.lineTo(x + width, y + radius)
        this.context.quadraticCurveTo(x + width, y, x + width - radius, y)
        this.context.lineTo(x + radius, y)
        this.context.quadraticCurveTo(x, y, x, y + radius)
        this.context.stroke()
        this.context.setLineDash([])
    }

    hover(enterCallback, leaveCallback) {
        window.addEventListener('mousemove', (event) => {
            if (event.clientX >= this.layout.left &&
                event.clientX <= this.layout.right &&
                event.clientY >= this.layout.top &&
                event.clientY <= this.layout.bottom)
            {
                enterCallback(event)
            } else {
                leaveCallback && leaveCallback(event)
            }
        })
    }

    mousedown(callback) {
        window.addEventListener('mousedown', (event) => {
            if (event.clientX >= this.layout.left &&
                event.clientX <= this.layout.right &&
                event.clientY >= this.layout.top &&
                event.clientY <= this.layout.bottom)
            {
                callback(event)
            }
        })
    }

    mouseup(callback) {
        window.addEventListener('mouseup', (event) => {
            if (event.clientX >= this.layout.left &&
                event.clientX <= this.layout.right &&
                event.clientY >= this.layout.top &&
                event.clientY <= this.layout.bottom)
            {
                callback(event)
            }
        })
    }

    mousemove(callback) {
        window.addEventListener('mousemove', (event) => {
            if (event.clientX >= this.layout.left &&
                event.clientX <= this.layout.right &&
                event.clientY >= this.layout.top &&
                event.clientY <= this.layout.bottom)
            {
                callback(event)
            }
        })
    }

    click(callback) {
        window.addEventListener('click', (event) => {
            if (event.clientX >= this.layout.left &&
                event.clientX <= this.layout.right &&
                event.clientY >= this.layout.top &&
                event.clientY <= this.layout.bottom)
            {
                callback(event)
            }
        })
    }

    dblclick(callback) {
        window.addEventListener('dblclick', (event) => {
            if (event.clientX >= this.layout.left &&
                event.clientX <= this.layout.right &&
                event.clientY >= this.layout.top &&
                event.clientY <= this.layout.bottom)
            {
                callback(event)
            }
        })
    }

    /*
    子类应实现如下方法:
    setBox()        // 设置宽高用于排版
    registerEvent() // 用于注册事件
    draw()          // 用于绘制组件
    */
}
