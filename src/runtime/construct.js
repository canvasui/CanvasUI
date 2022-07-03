function construct(template, context) {
    return traverse(template)

    function traverse(template, parent=null) {
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
        }[template.tagName] ?? CustomComponent)(template, context)
        if (parent) {
            componentObj.parent = parent
        }
        for (let child of template.children) {
            componentObj.children.push(traverse(child, componentObj))
        }
        return componentObj
    }
}
