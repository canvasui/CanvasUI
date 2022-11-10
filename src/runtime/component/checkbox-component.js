class CheckboxComponent extends Component {
    constructor(component, context) {
        super(component, context)
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
        this.click(() => {
            this.value = !this.value
            this.vm[this.bind] = this.value
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
        // 边框
        this.roundedRect(this.layout.left, this.layout.top, 14, 14, 2, this.borderColor)
        // 背景
        this.context.fillStyle = this.backgroundColor
        this.context.fill()
        // 对勾
        if (this.value) {
            this.context.textBaseline = 'top'
            this.context.font = '14px sans-serif'
            this.context.fillStyle = 'white'
            this.context.fillText('✔', this.layout.left + 1, this.layout.top)
        }
        // 文字
        this.context.textBaseline = 'top'
        this.context.font = '14px sans-serif'
        this.context.fillStyle = this.labelColor
        this.context.fillText(this.props.label, this.layout.left + 24, this.layout.top)
    }
}
