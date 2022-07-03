class TextComponent extends Component {
    constructor(template, context) {
        super(template, context)
    }

    setBox() {
        this.context.font = `${this.style['font-size']?.value ?? '16px'} sans-serif`
        this.style['width'] = {
            value: this.context.measureText(this.props.content).width + 'px',
        }
        this.style['height'] = {
            value: this.style['font-size']?.value ?? '16px',
        }
    }

    draw() {
        pen.reset()
        let fontSize = parseInt(this.style['font-size']?.value ?? 16)
        let fontColor = this.style['color']?.value ?? 'black'
        pen.drawText(this.props.content, this.layout.left, this.layout.top, fontSize, fontColor)
    }
}
