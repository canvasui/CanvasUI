class SliderComponent extends Component {
    constructor(component, context) {
        super(component, context)
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
        window.addEventListener('mousedown', (event) => {
            if (event.clientX >= this.block.left &&
                event.clientX <= this.block.right &&
                event.clientY >= this.block.top &&
                event.clientY <= this.block.bottom)
            {
                this.block.mousedown = true
                this.block.offsetX = event.clientX - this.block.left
                document.body.style.cursor = 'grabbing'
            }
        })
        window.addEventListener('mousemove', (event) => {
            if (this.block.mousedown){
                let left = event.clientX - this.block.offsetX
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
            } else if (
                event.clientX >= this.block.left &&
                event.clientX <= this.block.right &&
                event.clientY >= this.block.top &&
                event.clientY <= this.block.bottom)
            {
                document.body.style.cursor = 'grab'
            }
        })
        window.addEventListener('mouseup', (event) => {
            this.block.mousedown = false
        })
    }

    registerEvent() {
        this.drag()
    }

    draw() {
        if (this.firstDraw) {
            this.firstDraw = false
            if (this.props.value) {
                this.value = Number(this.props.value)
            }
        }
        // 滑条
        let width = parseInt(this.style['width'].value) - 20
        let height = 6
        this.roundedRect(this.layout.left + 10, this.layout.top + 7, width, height, 3, '#e4e7ed')
        this.context.fillStyle = '#e4e7ed'
        this.context.fill()
        // 滑块
        this.block.left = this.layout.left + (this.layout.right - this.layout.left - 20) / 100 * this.value
        this.block.right = this.block.left + 20
        this.block.top = this.layout.top
        this.block.bottom = this.layout.bottom 
        this.context.beginPath()
        let x = this.block.left + 10
        let y = this.layout.top + 10
        this.context.arc(x, y, 10, 0, 2 * Math.PI)
        this.context.fillStyle = 'white'
        this.context.fill()
        this.context.strokeStyle = '#409eff'
        this.context.lineWidth = 2
        this.context.stroke()
        this.context.lineWidth = 1
        // 文字
        if (this.block.mousedown) {
            this.context.textBaseline = 'middle'
            this.context.textAlign = 'center'
            this.context.font = '12px sans-serif'
            this.context.fillStyle = '#409eff'
            this.context.fillText(this.value, x, y)
            this.context.textBaseline = 'top'
            this.context.textAlign = 'left'
        }
    }
}
