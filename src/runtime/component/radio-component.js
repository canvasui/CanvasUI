class RadioComponent extends Component {
    constructor(component, context) {
        super(component, context)
        this.firstDraw = true
        this.checked = false
        this.borderColor = '#dcdfe6'
        this.registerEvent()
    }

    static group = {}

    setBox() {
        this.context.font = '14px sans-serif'
        let labelWidth = this.context.measureText(this.props.label).width
        this.style['width'] = {
            value: `${26 + labelWidth}px`,
        }
        this.style['height'] = {
            value: '16px',
        }
    }

    registerEvent() {
        this.click(() => {
            for (let item of RadioComponent.group[this.bind]) {
                item.checked = false
            }
            this.checked = true
            this.vm[this.bind] = this.props.option
        })
        this.hover(() => {
            this.borderColor = '#409eff'
            document.body.style.cursor = 'pointer'
        }, () => {
            this.borderColor = '#dcdfe6'
        })
    }

    draw() {
        if (this.firstDraw) {
            this.firstDraw = false
            if (this.props.value === this.props.option) {
                this.checked = true
            }
            if (RadioComponent.group[this.bind]) {
                RadioComponent.group[this.bind].push(this)
            } else {
                RadioComponent.group[this.bind] = [this]
            }
        }
        // 选择框
        this.context.beginPath()
        let x = this.layout.left + 8
        let y = this.layout.top + 8
        this.context.arc(x, y, 8, 0, 2 * Math.PI)
        this.context.fillStyle = 'white'
        this.context.fill()
        this.context.strokeStyle = this.borderColor
        this.context.stroke()
        if (this.checked) {
            this.context.beginPath()
            this.context.arc(x, y, 5, 0, 2 * Math.PI)
            this.context.strokeStyle = '#409eff'
            this.context.lineWidth = 5
            this.context.stroke()
            this.context.lineWidth = 1    
        }
        // 文字
        this.context.textBaseline = 'top'
        this.context.font = ' 14px sans-serif'
        this.context.fillStyle = '#606266'
        this.context.fillText(this.props.label, this.layout.left + 26, this.layout.top + 1)
    }
}
