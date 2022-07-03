class ColorComponent extends Component {
    constructor(template, context) {
        super(template, context)
        this.firstDraw = true
        this.value = '#409eff'
        this.show = false
        this.registerEvent()
    }

    setBox() {
        this.style['width'] = {
            value: '40px',
        }
        this.style['height'] = {
            value: '40px',
        }
    }

    registerEvent() {
        this.tap(() => {
            this.show = !this.show
        })
        this.hover(() => {
            document.body.style.cursor = 'pointer'
        })
        document.addEventListener('tap', (event) => {
            if (event.detail.clientX >= this.layout.left - 50 &&
                event.detail.clientX <= this.layout.right + 50 &&
                event.detail.clientY >= this.layout.bottom + 5 &&
                event.detail.clientY <= this.layout.bottom + 145)
            {
                if (this.show) {
                    let dpr = window.devicePixelRatio
                    if ('ontouchstart' in document) {
                        dpr = 1
                    }
                    let [r, g, b] = this.context.getImageData(event.detail.clientX * dpr, event.detail.clientY * dpr, 1, 1).data
                    this.value = `rgb(${r}, ${g}, ${b})`
                    this.vm[this.bind] = this.value
                    this.show = false
                }
            }
        })
    }

    draw() {
        pen.reset()
        if (this.firstDraw) {
            this.firstDraw = false
            if (this.props.value !== '') {
                this.value = this.props.value
            }
        }
        // 选择按钮
        pen.drawRect(this.layout.left, this.layout.top, 40, 40, 4)
        pen.stroke('#dcdfe6')
        pen.drawRect(this.layout.left + 5, this.layout.top + 5, 30, 30, 2)
        pen.fill(this.value)
        // 箭头
        pen.drawText('▽', this.layout.left + 13, this.layout.top + 13, 14, 'white')
        // 色盘
        if (this.show) {
            for (let i = 0; i < 12; i++) {
                this.context.beginPath()
                this.context.moveTo(this.layout.left + 20, this.layout.top + 115)
                this.context.arc(this.layout.left + 20, this.layout.top + 115, 70, (Math.PI * 2) / 12 * i, (Math.PI * 2) / 12 * (i + 1))
                this.context.closePath()
                this.context.fillStyle = `hsl(${i * 30}, 100%, 50%)`
                this.context.fill()
            }
        }
    }
}
