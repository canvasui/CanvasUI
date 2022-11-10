class ColorComponent extends Component {
    constructor(component, context) {
        super(component, context)
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
        this.click(() => {
            this.show = !this.show
        })
        this.hover(() => {
            document.body.style.cursor = 'pointer'
        })
        window.addEventListener('click', (event) => {
            if (event.clientX >= this.layout.left - 50 &&
                event.clientX <= this.layout.right + 50 &&
                event.clientY >= this.layout.bottom + 5 &&
                event.clientY <= this.layout.bottom + 145)
            {
                if (this.show) {
                    let [r, g, b] = this.context.getImageData(event.clientX, event.clientY, 1, 1).data
                    this.value = `rgb(${r}, ${g}, ${b})`
                    this.vm[this.bind] = this.value
                    this.show = false
                }
            }
        })
    }

    draw() {
        if (this.firstDraw) {
            this.firstDraw = false
            if (this.props.value !== '') {
                this.value = this.props.value
            }
        }
        // 选择按钮
        this.roundedRect(this.layout.left, this.layout.top, 40, 40, 4, '#dcdfe6')
        this.roundedRect(this.layout.left + 5, this.layout.top + 5, 30, 30, 2, '#999')
        this.context.fillStyle = this.value
        this.context.fill()
        // 箭头
        this.context.fillStyle = 'white'
        this.context.textBaseline = 'top'
        this.context.font = '14px sans-serif'
        this.context.fillText('▽', this.layout.left + 13, this.layout.top + 13)
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
