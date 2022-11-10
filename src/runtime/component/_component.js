class Component {
    constructor(template, context) {
        this.vm = null
        this.initQueue = []
        this.tagName = template.tagName
        this.parent = template.parent
        this.props = template.props
        this.style = template.style
        this.context = context
        this.layout = {}
        this.children = []
    }

    // 鼠标事件
    hover(enterCallback, leaveCallback) {
        document.addEventListener('mousemove', (event) => {
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
        document.addEventListener('mousedown', (event) => {
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
        document.addEventListener('mouseup', (event) => {
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
        document.addEventListener('mousemove', (event) => {
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
        document.addEventListener('dblclick', (event) => {
            if (event.clientX >= this.layout.left &&
                event.clientX <= this.layout.right &&
                event.clientY >= this.layout.top &&
                event.clientY <= this.layout.bottom)
            {
                callback(event)
            }
        })
    }

    // 手势事件
    // 轻点
    tap(callback) {
        document.addEventListener('tap', (event) => {
            if (event.detail.clientX >= this.layout.left &&
                event.detail.clientX <= this.layout.right &&
                event.detail.clientY >= this.layout.top &&
                event.detail.clientY <= this.layout.bottom)
            {
                callback(event.detail)
            }
        })
    }
    // 长按
    pressstart(callback) {
        document.addEventListener('pressstart', (event) => {
            if (event.detail.clientX >= this.layout.left &&
                event.detail.clientX <= this.layout.right &&
                event.detail.clientY >= this.layout.top &&
                event.detail.clientY <= this.layout.bottom)
            {
                callback(event.detal)
            }
        })
    }
    pressend(callback) {
        document.addEventListener('pressend', (event) => {
            if (event.detail.clientX >= this.layout.left &&
                event.detail.clientX <= this.layout.right &&
                event.detail.clientY >= this.layout.top &&
                event.detail.clientY <= this.layout.bottom)
            {
                callback(event.detail)
            }
        })
    }
    // 拖动
    panstart(callback) {
        document.addEventListener('panstart', (event) => {
            if (event.detail.startX >= this.layout.left &&
                event.detail.startX <= this.layout.right &&
                event.detail.startY >= this.layout.top &&
                event.detail.startY <= this.layout.bottom)
            {
                callback(event.detail)
            }
        })
    }
    panmove(callback) {
        document.addEventListener('panmove', (event) => {
            if (event.detail.clientX >= this.layout.left &&
                event.detail.clientX <= this.layout.right &&
                event.detail.clientY >= this.layout.top &&
                event.detail.clientY <= this.layout.bottom)
            {
                callback(event.detail)
            }
        })
    }
    panend(callback) {
        document.addEventListener('panend', (event) => {
            if (event.detail.clientX >= this.layout.left &&
                event.detail.clientX <= this.layout.right &&
                event.detail.clientY >= this.layout.top &&
                event.detail.clientY <= this.layout.bottom)
            {
                callback(event.detail)
            }
        })
    }
    // 快扫
    swipe(callback) {
        document.addEventListener('swipe', (event) => {
            if (event.detail.clientX >= this.layout.left &&
                event.detail.clientX <= this.layout.right &&
                event.detail.clientY >= this.layout.top &&
                event.detail.clientY <= this.layout.bottom)
            {
                callback(event.detail)
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
