class SelectComponent extends Component {
    constructor(component, context) {
        super(component, context)
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
        this.click(() => {
            this.borderColor = '#409eff'                
            this.show = !this.show
        })
        this.hover(() => {
            document.body.style.cursor = 'pointer'
        })
        window.addEventListener('mousemove', (event) => {
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
        window.addEventListener('click', (event) => {
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
        this.roundedRect(this.layout.left, this.layout.top, 240, 40, 4, this.borderColor)
        // 箭头
        this.context.fillStyle = '#c0c4cc'
        this.context.textBaseline = 'top'
        this.context.font = '14px sans-serif'
        this.context.fillText('▽', this.layout.right - 30, this.layout.top + 12)
        if (this.show) {
            // 菜单背景
            let width = parseInt(this.style['width'].value)
            let height = this.options.length * 36 + 15
            this.roundedRect(this.layout.left, this.layout.bottom + 12, width, height, 4, '#e4e7ed')
            this.context.fillStyle = 'white'
            this.context.fill()
            this.context.fillStyle = '#e4e7ed'
            this.context.textBaseline = 'bottom'
            this.context.font = '12px sans-serif'
            this.context.fillText('△', this.layout.left + 35, this.layout.bottom + 14)
            this.context.textBaseline = 'top'
            // 菜单内容
            for (let i = 0; i < this.options.length; i++) {
                let item = this.optionPositions[i]
                if (item.selected) {
                    this.context.fillStyle = '#f5f7fa'
                    this.context.fillRect(this.layout.left, this.layout.bottom + item.top, 240, 40)
                }
                this.context.fillStyle = '#606266'
                this.context.textBaseline = 'top'
                this.context.font = '16px sans-serif'
                this.context.fillText(this.options[i], this.layout.left + 20, this.layout.bottom + item.top + 10)
            }
        }
        if (this.selected) {
            // 选定内容
            this.context.fillStyle = '#606266'
            this.context.textBaseline = 'top'
            this.context.font = '16px sans-serif'
            this.context.fillText(this.selected, this.layout.left + 16, this.layout.top + 11)    
        } else {
            // 提示文字
            this.context.fillStyle = '#b9bcc5'
            this.context.textBaseline = 'top'
            this.context.font = '16px sans-serif'
            this.context.fillText('Select', this.layout.left + 16, this.layout.top + 11)
        }
    }
}
