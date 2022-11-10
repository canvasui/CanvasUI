class SwitchComponent extends Component {
    constructor(template, context) {
        super(template, context)
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
        this.tap(() => {
            this.value = !this.value
            this.vm[this.bind] = this.value
        })
        this.hover(() => {
            document.body.style.cursor = 'pointer'
        })
    }

    draw() {
        pen.reset()
        if (this.firstDraw) {
            this.firstDraw = false
            // 因为传入的属性值为字符串类型, 而不是布尔类型, 所以需要进一步判断
            this.value = {
                'true': true,
                'false': false,
            }[this.props.value]
        }
        // 背景
        pen.drawRect(this.layout.left, this.layout.top, 40, 20, 10)
        pen.fill(this.backgroundColor)
        // 滑块
        let x = this.layout.right - 10
        let y = this.layout.top + 10
        if (!this.value) {
            x = this.layout.left + 10
        }
        pen.drawCircle(x, y, 8)
        pen.fill('white')
    }
}
