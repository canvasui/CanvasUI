class TextComponent extends Component {
    constructor(component, context) {
        super(component, context)
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
        this.context.textBaseline = 'top'
        this.context.font = `${this.style['font-size']?.value ?? '16px'} sans-serif`
        this.context.fillStyle = this.style['color']?.value ?? 'black'
        this.context.fillText(this.props.content, this.layout.left, this.layout.top)
    }
}
