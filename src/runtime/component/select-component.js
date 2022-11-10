class SelectComponent extends Component {
    constructor(template, context) {
        super(template, context)
        this.firstDraw = true
        this.options = []
        this.selected = ''
        this.show = false
        this.optionPositions = []
        this.borderColor = '#dcdfe6'
        this.registerEvent()
    }

    setBox() {
        this.style['width'] = {
            value: '240px',
        }
        this.style['height'] = {
            value: '40px',
        }
    }

    registerEvent() {
        this.hover(() => {
            if (!this.show) {
                this.borderColor = '#c0c4cc'
            }
        }, () => {
            if (!this.show) {
                this.borderColor = '#dcdfe6'
            }
        })
        this.tap(() => {
            this.borderColor = '#409eff'
            this.show = !this.show
        })
        this.hover(() => {
            document.body.style.cursor = 'pointer'
        })
        document.addEventListener('mousemove', (event) => {
            if (this.show) {
                for (let item of this.optionPositions) {
                    if (event.clientX >= this.layout.left &&
                        event.clientX <= this.layout.right &&
                        event.clientY >= this.layout.bottom + item.top &&
                        event.clientY <= this.layout.bottom + item.bottom)
                    {
                        item.selected = true
                        document.body.style.cursor = 'pointer'
                    } else {
                        item.selected = false
                    }
                }
            }
        })
        document.addEventListener('click', (event) => {
            if (this.show) {
                for (let i = 0; i < this.optionPositions.length; i++) {
                    let item = this.optionPositions[i]
                    if (event.clientX >= this.layout.left &&
                        event.clientX <= this.layout.right &&
                        event.clientY >= this.layout.bottom + item.top &&
                        event.clientY <= this.layout.bottom + item.bottom)
                    {
                        this.selected = this.options[i]
                        this.vm[this.bind] = this.selected
                        this.show = false
                        this.borderColor = '#dcdfe6'
                    }
                }
            }
        })
    }

    draw() {
        pen.reset()
        if (this.firstDraw) {
            this.firstDraw = false
            for (let item of this.props.options) {
                if (item === this.props.value) {
                    this.selected = item
                }
            }
            this.options = this.props.options
            for (let i = 0; i < this.options.length; i++) {
                let top = 12 + i * 36 + 6
                let bottom = top + 36
                this.optionPositions.push({
                    top: top,
                    bottom: bottom,
                    selected: false,
                })
            }
        }
        // 边框
        pen.drawRect(this.layout.left, this.layout.top, 240, 40, 4)
        pen.stroke(this.borderColor)
        // 箭头
        pen.drawText('▽', this.layout.right - 30, this.layout.top + 12, 14, '#c0c4cc')
        if (this.show) {
            // 菜单背景
            let width = parseInt(this.style['width'].value)
            let height = this.options.length * 36 + 15
            pen.drawRect(this.layout.left, this.layout.bottom + 12, width, height, 4)
            pen.stroke('#e4e7ed')
            pen.fill('white')
            pen.drawText('△', this.layout.left + 35, this.layout.bottom + 2, 12, '#e4e7ed')
            // 菜单内容
            for (let i = 0; i < this.options.length; i++) {
                let item = this.optionPositions[i]
                if (item.selected) {
                    pen.drawRect(this.layout.left, this.layout.bottom + item.top, 240, 40, 0)
                    pen.fill('#f5f7fa')
                }
                pen.drawText(this.options[i], this.layout.left + 20, this.layout.bottom + item.top + 10, 16, '#606266')
            }
        }
        if (this.selected) {
            // 选定内容
            pen.drawText(this.selected, this.layout.left + 16, this.layout.top + 11, 16, '#606266')
        } else {
            // 提示文字
            pen.drawText('Select', this.layout.left + 16, this.layout.top + 11, 16, '#b9bcc5')
        }
    }
}
