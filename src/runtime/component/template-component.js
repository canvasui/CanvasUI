class TemplateComponent extends Component {
    constructor(template, context) {
        super(template, context)
    }

    setBox() {
    }

    draw() {
        pen.reset()
        let x = this.layout.left
        let y = this.layout.top
        let width = this.layout.width
        let height = this.layout.height
        pen.drawRect(x, y, width, height, 0)
    }
}
