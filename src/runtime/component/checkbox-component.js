class CheckboxComponent extends Component {
    constructor(template, context) {
        super(template, context)
        this.firstDraw = true
        this.value = false
        this.borderColor = '#dcdfe6'
        this.registerEvent()
    }

    get backgroundColor() {
        return this.value ? '#409eff' : '#ffffff'
    }

    get labelColor() {
        return this.value ? '#409eff' : '#606266'
    }

    setBox() {
        this.context.font = '14px sans-serif'
        let labelWidth = this.context.measureText(this.props.label).width
        this.style['width'] = {
            value: `${24 + labelWidth}px`,
        }
        this.style['height'] = {
            value: '14px',
        }
    }

    registerEvent() {
        this.hover(() => {
            this.borderColor = '#409eff'
            document.body.style.cursor = 'pointer'
        }, () => {
            this.borderColor = '#dcdfe6'
        })
        this.tap(() => {
            this.value = !this.value
            this.vm[this.bind] = this.value
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
        // 边框
        pen.drawRect(this.layout.left, this.layout.top, 14, 14, 2)
        pen.stroke(this.borderColor)
        // 背景
        pen.fill(this.backgroundColor)
        // 对勾
        if (this.value) {
            pen.drawText('✔', this.layout.left + 1, this.layout.top, 14, 'white')
        }
        // 文字
        pen.drawText(this.props.label, this.layout.left + 24, this.layout.top, 14, this.labelColor)
    }
}
