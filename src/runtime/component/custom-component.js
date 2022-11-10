class CustomComponent extends Component {
    constructor(template, context) {
        super(template, context)
    }

    setBox() {
    }

    mount() {
        let { style, template, script } = componentJson[this.tagName]
        let component = construct(template, this.context)
        bindData(component, style, script)
        return component
    }
}
