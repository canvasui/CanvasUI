class ImageComponent extends Component {
    constructor(template, context) {
        super(template, context)
        this.image = null
    }

    setBox() {
        // 为了避免重排, <image> 必须通过 CSS 显式设置宽高
    }

    draw() {
        pen.reset()
        let width = parseInt(this.style['width'].value)
        let height = parseInt(this.style['height'].value)
        let radius = parseInt(this.style['border-radius']?.value ?? 0)
        pen.drawImage(this.image, this.layout.left, this.layout.top, width, height, radius)
    }
}
