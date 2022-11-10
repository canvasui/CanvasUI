class TemplateParser {
    constructor(sourceCode) {
        this.sourceCode = sourceCode
        this.stack = [{ type: 'component', children: [] }]
        this.state = this.atData
        this.currentToken = null
        this.currentProp = null
        this.currentCode = null
    }

    parse() {
        for (let char of this.sourceCode) {
            this.state = this.state(char)
        }
        let children = this.stack[0].children
        return {
            style: children.filter(child => child.tagName === 'style')[0].children[0].content.trim(),
            template: children.filter(child => child.tagName === 'template')[0],
            script: children.filter(child => child.tagName === 'script')[0].children[0].content.trim(),
        }
    }

    emitToken() {
        let token = this.currentToken
        let top = this.stack[this.stack.length - 1]
        if (token.type !== 'code') {
            this.currentCode = null
        }
        if (token.type === 'startTag') {
            let parent = JSON.parse(JSON.stringify(top))
            delete parent.children
            let component = {
                type: 'component',
                tagName: token.tagName,
                props: token.props,
                children: [],
                parent: parent,
                style: {},
            }
            top.children.push(component)
            this.stack.push(component)
        } else if (token.type === 'code') {
            if (this.currentCode === null) {
                this.currentCode = {
                    content: '',
                }
                top.children.push(this.currentCode)
            }
            this.currentCode.content += token.content
        } else if (token.type === 'endTag' && top.tagName === token.tagName) {
            this.stack.pop()
        }
    }

    atData(char) {
        if (char === '<') {
            return this.atTagOpen
        } else {
            this.currentToken = {
                type: 'code',
                content: char,
            }
            this.emitToken()
            return this.atData
        }
    }

    atTagOpen(char) {
        if (char.match(/^[a-zA-Z0-9]$/)) {
            this.currentToken = {
                type: 'startTag',
                tagName: '',
                props: {},
            }
            return this.atTagName(char)
        } else if (char === '/') {
            return this.atEndTagOpen
        }
    }

    atTagName(char) {
        if (char.match(/^[a-zA-Z0-9]$/)) {
            this.currentToken.tagName += char
            return this.atTagName
        } else if (char.match(/^[\t\n ]$/)) {
            return this.atBeforePropName
        } else if (char === '>') {
            this.emitToken()
            return this.atData
        }
    }

    atEndTagOpen(char) {
        if (char.match(/^[a-zA-Z0-9]$/)) {
            this.currentToken = {
                type: 'endTag',
                tagName: '',
            }
            return this.atTagName(char)
        }
    }

    atBeforePropName(char) {
        if (char.match(/^[a-zA-Z-@]$/)) {
            this.currentProp = {
                name: '',
                value: '',
            }
            return this.atPropName(char)
        } else if (char.match(/^[\t\n ]$/)) {
            return this.atBeforePropName
        } else if (char === '>') {
            return this.atAfterPropName
        }
    }

    atPropName(char) {
        if (char.match(/^[\t\n ]$/) || char === '>') {
            return this.atAfterPropName(char)
        } else if (char === '=') {
            return this.atBeforePropValue
        } else {
            this.currentProp.name += char
            return this.atPropName
        }
    }

    atAfterPropName(char) {
        if (char.match(/^[\t\n ]$/)) {
            return this.atAfterPropName
        } else if (char === '=') {
            return this.atBeforePropValue
        } else if (char === '>') {
            this.currentToken.props[this.currentProp.name] = this.currentProp.value
            this.emitToken()
            return this.atData
        } else {
            this.currentToken.props[this.currentProp.name] = this.currentProp.value
            this.currentProp = {
                name: '',
                value: '',
            }
            return this.atPropName(char)
        }
    }

    atBeforePropValue(char) {
        if (char.match(/^[\t\n ]$/)) {
            return this.atBeforePropValue
        } else if (char === '"') {
            return this.atPropValue
        }
    }

    atPropValue(char) {
        if (char === '"') {
            this.currentToken.props[this.currentProp.name] = this.currentProp.value
            return this.atAfterPropValue
        } else {
            this.currentProp.value += char
            return this.atPropValue
        }
    }

    atAfterPropValue(char) {
        if (char.match(/^[\t\n ]$/)) {
            return this.atBeforePropName
        } else if (char === '>') {
            this.emitToken()
            return this.atData
        }
    }
}


module.exports = TemplateParser
