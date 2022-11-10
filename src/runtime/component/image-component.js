class ImageComponent extends Component {
    constructor(component, context) {
        super(component, context)
        this.image = null
    }

    setBox() {
        this.image = ImageLoader.images[this.props.path]
        if (this.image) {
            this.style['width'] = this.style['width'] ?? {
                value: this.image.width
            }
            this.style['height'] = this.style['height'] ?? {
                value: this.image.height
            }
        }
    }

    draw() {
        let width = parseInt(this.style['width'].value)
        let height = parseInt(this.style['height'].value)
        this.context.drawImage(this.image, this.layout.left, this.layout.top, width, height)
    }
}
