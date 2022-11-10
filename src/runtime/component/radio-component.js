class RadioComponent extends Component {
    constructor(template, context) {
        super(template, context)
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
        this.tap(() => {
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
        pen.reset()
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
        let x = this.layout.left + 8
        let y = this.layout.top + 8
        pen.drawCircle(x, y, 8)
        pen.fill('white')
        pen.stroke(this.borderColor)
        if (this.checked) {
            pen.drawCircle(x, y, 5)
            pen.stroke('#409eff', 5)
        }
        // 文字
        pen.drawText(this.props.label, this.layout.left + 26, this.layout.top + 1, 14, '#606266')
    }
}
