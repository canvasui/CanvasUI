class SwitchComponent extends Component {
    constructor(component, context) {
        super(component, context)
        this.firstDraw = true
        this.value = true
        this.registerEvent()
    }

    get backgroundColor() {
        return this.value ? '#49c45c' : '#dcdfe6'
    }

    setBox() {
        this.style['width'] = {
            value: '40px',
        }
        this.style['height'] = {
            value: '20px',
        }
    }

    registerEvent() {
        this.click(() => {
            this.value = !this.value
            this.vm[this.bind] = this.value
        })
        this.hover(() => {
            document.body.style.cursor = 'pointer'
        })
    }

    draw() {
        if (this.firstDraw) {
            this.firstDraw = false
            // 因为传入的属性值为字符串类型, 而不是布尔类型, 所以需要进一步判断
            if (this.props.value === 'true') {
                this.value = true
            } else if (this.props.value = 'false') {
                this.value = false
            }
        }
        // 背景
        this.roundedRect(this.layout.left, this.layout.top, 40, 20, 10, this.backgroundColor)
        this.context.fillStyle = this.backgroundColor
        this.context.fill()
        // 滑块
        this.context.beginPath()
        let x = this.layout.right - 10
        let y = this.layout.top + 10
        if (!this.value) {
            x = this.layout.left + 10
        }
        this.context.arc(x, y, 8, 0, 2 * Math.PI)
        this.context.fillStyle = 'white'
        this.context.fill()
    }
}
