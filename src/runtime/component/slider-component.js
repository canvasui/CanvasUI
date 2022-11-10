class SliderComponent extends Component {
    constructor(template, context) {
        super(template, context)
        this.firstDraw = true,
        this.value = 0
        this.block = {
            mousedown: false,
            left: 0,
            right: 0,
            top: 0,
            bottom: 0,
            offsetX: 0,
        }
        this.registerEvent()
    }

    setBox() {
        this.style['width'] = this.style['width'] ?? {
            value: '300px',
        }
        this.style['height'] = {
            value: '20px',
        }
    }

    drag() {
        document.addEventListener('panstart', (event) => {
            if (event.detail.startX >= this.block.left &&
                event.detail.startX <= this.block.right &&
                event.detail.startY >= this.block.top &&
                event.detail.startY <= this.block.bottom)
            {
                this.block.mousedown = true
                this.block.offsetX = event.detail.startX - this.block.left
                document.body.style.cursor = 'grabbing'
            }
        })
        document.addEventListener('panmove', (event) => {
            if (this.block.mousedown){
                let left = event.detail.clientX - this.block.offsetX
                if (left < this.layout.left) {
                    left = this.layout.left
                } else if (left > this.layout.right - 20) {
                    left = this.layout.right - 20
                }
                this.block.left = left
                this.block.right = this.block.left + 20
                this.value = Math.floor((this.block.left - this.layout.left) / (this.layout.right - this.layout.left - 20) * 100)
                this.vm[this.bind] = this.value
                document.body.style.cursor = 'grabbing'
            }
        })
        document.addEventListener('panend', (event) => {
            this.block.mousedown = false
            document.body.style.cursor = 'grab'
        })
    }

    registerEvent() {
        this.drag()
        document.addEventListener('mousemove', (event) => {
            if (event.clientX >= this.block.left &&
                event.clientX <= this.block.right &&
                event.clientY >= this.block.top &&
                event.clientY <= this.block.bottom)
            {
                document.body.style.cursor = 'grab'
            }
        })
    }

    draw() {
        pen.reset()
        if (this.firstDraw) {
            this.firstDraw = false
            if (this.props.value) {
                this.value = Number(this.props.value)
            }
        }
        // 滑条
        let width = parseInt(this.style['width'].value) - 20
        let height = 6
        pen.drawRect(this.layout.left + 10, this.layout.top + 7, width, height, 3)
        pen.fill('#e4e7ed')
        // 滑块
        this.block.left = this.layout.left + (this.layout.right - this.layout.left - 20) / 100 * this.value
        this.block.right = this.block.left + 20
        this.block.top = this.layout.top
        this.block.bottom = this.layout.bottom
        let x = this.block.left + 10
        let y = this.layout.top + 10
        pen.drawCircle(x, y, 10)
        pen.fill('white')
        pen.stroke('#409eff', 2)
        // 文字
        if (this.block.mousedown) {
            pen.drawText(this.value, x, y - 6, 12, '#409eff', 'center')
        }
    }
}
