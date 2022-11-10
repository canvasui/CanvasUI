class TemplateParser {
    constructor(template, context) {
        this.template = template
        this.context = context
    }

    parse() {
        return this.traverse(this.template)
    }

    traverse(component) {
        let componentObj = new ({
            button: ButtonComponent,
            checkbox: CheckboxComponent,
            color: ColorComponent,
            div: DivComponent,
            image: ImageComponent,
            input: InputComponent,
            radio: RadioComponent,
            select: SelectComponent,
            slider: SliderComponent,
            switch: SwitchComponent,
            template: TemplateComponent,
            text: TextComponent,
        }[component.tagName])(component, this.context)
        for (let child of component.children) {
            componentObj.children.push(this.traverse(child))
        }
        return componentObj
    }
}
