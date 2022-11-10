const TemplateParser = require('./parser/template-parser')
const StyleParser = require('./parser/style-parser')


class Compiler {
    constructor(sourceCode) {
        let { style, template, script} = new TemplateParser(sourceCode).parse()
        this.style = new StyleParser(style).parse()
        this.template = this.templateFilter(template)
        this.script = (new Function(script))()
    }

    compile() {
        return {
            style: this.style,
            template: this.template,
            script: this.script,
        }
    }

    templateFilter(component) {
        component.children = component.children.filter(child => child.type === 'component')
        for (let child of component.children) {
            this.templateFilter(child)
        }
        return component
    }
}


module.exports = Compiler
