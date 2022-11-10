class DivComponent extends Component {
    constructor(template, context) {
        super(template, context)
    }

    setBox() {
    }

    draw() {
        pen.reset()
        let margin = parseInt(this.style['margin']?.value ?? 0)
        let borderWidth = parseInt(this.style['border']?.value.split(' ')[0] ?? 1)
        let borderStyle = this.style['border']?.value.split(' ')[1] ?? 'solid'
        let borderColor = this.style['border']?.value.split(' ')[2] ?? 'black'
        let radius = parseInt(this.style['border-radius']?.value ?? 0)

        let x = this.layout.left + margin
        let y = this.layout.top + margin
        let width = this.layout.width - margin * 2
        let height = this.layout.height - margin * 2

        pen.drawRect(x, y, width, height, radius, borderStyle, borderWidth)
        if (this.style.border) {
            pen.stroke(borderColor, borderWidth)
        }
        if (this.style.background) {
            pen.fill(this.style.background.value)
        }
    }
}
