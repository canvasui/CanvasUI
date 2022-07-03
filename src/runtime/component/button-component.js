class ButtonComponent extends Component {
    constructor(template, context) {
        super(template, context)
        this.borderColor = '#dcdfe6'
        this.backgroundColor = '#ffffff'
        this.labelColor = '#606266'
        this.registerEvent()
    }

    setBox() {
        this.style['width'] = {
            value: '100px',
        }
        this.style['height'] = {
            value: '40px',
        }
        this.context.font = '14px sans-serif'
        let labelWidth = this.context.measureText(this.props.label).width
        if (labelWidth >= 58) {
            this.style['width'].value = `${labelWidth + 42}px`
        }
    }

    registerEvent() {
        this.hover(() => {
            this.borderColor = '#c6e2ff'
            this.backgroundColor = '#ecf5ff'
            this.labelColor = '#409eff'
            document.body.style.cursor = 'pointer'
        }, () => {
            this.borderColor = '#dcdfe6'
            this.backgroundColor = '#ffffff'
            this.labelColor = '#606266'
        })
        this.mousedown(() => {
            this.borderColor = '#3a8ee6'
            this.labelColor = '#3a8ee6'
        })
        this.mouseup(() => {
            this.borderColor = '#c6e2ff'
            this.labelColor = '#409eff'
        })
        this.tap(() => {
            this.props['@click']()
        })
    }

    draw() {
        pen.reset()
        // 边框
        let width = parseInt(this.style['width'].value)
        let height = parseInt(this.style['height'].value)
        pen.drawRect(this.layout.left, this.layout.top, width, height, 4)
        pen.stroke(this.borderColor)
        // 背景
        pen.fill(this.backgroundColor)
        // 文字
        let x = this.layout.left + width / 2
        let y = this.layout.top + 13
        pen.drawText(this.props.label, x, y, 14, this.labelColor, 'center')
    }
}

