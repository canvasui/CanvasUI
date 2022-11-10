class DivComponent extends Component {
    constructor(component, context) {
        super(component, context)
    }

    setBox() {
    }

    draw() {
        if (!this.style['border']) {
            return
        }
        let margin = this.style['margin'] ? parseInt(this.style['margin'].value) : 0
        let borderWidth = this.style['border'] ? parseInt(this.style['border'].value.split(' ')[0]) : 0
        let borderStyle = this.style['border'] ? this.style['border'].value.split(' ')[1] : 'solid'
        let borderColor = this.style['border'] ? this.style['border'].value.split(' ')[2] : 'black'
        let radius = this.style['border-radius'] ? parseInt(this.style['border-radius'].value) : 0

        let x = this.layout.left + margin
        let y = this.layout.top + margin
        let width = this.layout.width - margin * 2
        let height = this.layout.height - margin * 2
        this.context.lineWidth = borderWidth
        this.roundedRect(x, y, width, height, radius, borderStyle, borderColor)
        this.context.lineWidth = 1
    }
}
