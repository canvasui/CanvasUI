class ButtonComponent extends Component {
    constructor(component, context) {
        super(component, context)
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
        this.click(() => {
            this.props['@click']()
        })
    }

    draw() {
        // 边框
        let width = parseInt(this.style['width'].value)
        let height = parseInt(this.style['height'].value)
        this.roundedRect(this.layout.left, this.layout.top, width, height, 4, this.borderColor)
        // 背景
        this.context.fillStyle = this.backgroundColor
        this.context.fill()
        // 文字
        this.context.textBaseline = 'top'
        this.context.font = '14px sans-serif'
        this.context.fillStyle = this.labelColor
        let labelStart = { x: 21, y: 13}
        let labelWidth = this.context.measureText(this.props.label).width
        if (labelWidth < 58) {
            labelStart.x = (100 - labelWidth) / 2
        }
        this.context.fillText(this.props.label, this.layout.left + labelStart.x, this.layout.top + labelStart.y)
    }
}

