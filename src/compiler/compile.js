const parseStyle = require('./parse-style')
const filterTemplate = require('./filter-template')


function compile(sourceCode) {
    let stack = [{ type: 'component', children: [] }]
    let state = atData
    let currentToken = null
    let currentProp = null
    let currentCode = null
    return parse()

    function parse() {
        for (let char of sourceCode) {
            state = state(char)
            if (currentToken?.tagName === 'script' && state === atData) {
                state = atScript
            }
        }
        let children = stack[0].children
        let script = children.find(child => child.tagName === 'script')?.children[0]?.content.trim() ?? ''
        let template = children.find(child => child.tagName === 'template') ?? {
            type: 'component',
            tagName: 'template',
            props: {},
            children: [],
            parent: { type: 'component' },
            style: {},
        }
        let style = children.find(child => child.tagName === 'style')?.children[0]?.content.trim() ?? ''
        return {
            script: script,
            template: filterTemplate(template),
            style: parseStyle(style),
        }
    }

    function emitToken() {
        let token = currentToken
        let top = stack[stack.length - 1]
        if (token.type !== 'code') {
            currentCode = null
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
            stack.push(component)
        } else if (token.type === 'code') {
            if (currentCode === null) {
                currentCode = {
                    content: '',
                }
                top.children.push(currentCode)
            }
            currentCode.content += token.content
        } else if (token.type === 'endTag' && top.tagName === token.tagName) {
            stack.pop()
        }
        currentToken = null
    }

    function atData(char) {
        if (char === '<') {
            return atTagOpen
        } else {
            currentToken = {
                type: 'code',
                content: char,
            }
            emitToken()
            return atData
        }
    }

    function atTagOpen(char) {
        if (char.match(/^[a-zA-Z0-9]$/)) {
            currentToken = {
                type: 'startTag',
                tagName: '',
                props: {},
            }
            return atTagName(char)
        } else if (char === '/') {
            return atEndTagOpen
        }
    }

    function atTagName(char) {
        if (char.match(/^[a-zA-Z0-9]$/)) {
            currentToken.tagName += char
            return atTagName
        } else if (char.match(/^[\t\n ]$/)) {
            return atBeforePropName
        } else if (char === '>') {
            emitToken()
            return atData
        }
    }

    function atEndTagOpen(char) {
        if (char.match(/^[a-zA-Z0-9]$/)) {
            currentToken = {
                type: 'endTag',
                tagName: '',
            }
            return atTagName(char)
        }
    }

    function atBeforePropName(char) {
        if (char.match(/^[a-zA-Z-@]$/)) {
            currentProp = {
                name: '',
                value: '',
            }
            return atPropName(char)
        } else if (char.match(/^[\t\n ]$/)) {
            return atBeforePropName
        } else if (char === '>') {
            return atAfterPropName(char)
        }
    }

    function atPropName(char) {
        if (char.match(/^[\t\n ]$/) || char === '>') {
            return atAfterPropName(char)
        } else if (char === '=') {
            return atBeforePropValue
        } else {
            currentProp.name += char
            return atPropName
        }
    }

    function atAfterPropName(char) {
        if (char.match(/^[\t\n ]$/)) {
            return atAfterPropName
        } else if (char === '=') {
            return atBeforePropValue
        } else if (char === '>') {
            if (currentProp) {
                currentToken.props[currentProp.name] = currentProp.value
            }
            emitToken()
            return atData
        }
    }

    function atBeforePropValue(char) {
        if (char.match(/^[\t\n ]$/)) {
            return atBeforePropValue
        } else if (char === '"') {
            return atPropValue
        }
    }

    function atPropValue(char) {
        if (char === '"') {
            currentToken.props[currentProp.name] = currentProp.value
            return atAfterPropValue
        } else {
            currentProp.value += char
            return atPropValue
        }
    }

    function atAfterPropValue(char) {
        if (char.match(/^[\t\n ]$/)) {
            return atBeforePropName
        } else if (char === '>') {
            emitToken()
            return atData
        }
    }

    function atScript(char) {
        if (char === '<') {
            return atScriptEndTag1
        } else {
            currentToken = {
                type: 'code',
                content: char,
            }
            emitToken()
            return atScript
        }
    }
    // <
    function atScriptEndTag1(char) {
        if (char === '/') {
            return atScriptEndTag2
        } else {
            currentToken = {
                type: 'code',
                content: `<${char}`,
            }
            emitToken()
            return atScript
        }
    }
    // </
    function atScriptEndTag2(char) {
        if (char === 's') {
            return atScriptEndTag3
        } else {
            currentToken = {
                type: 'code',
                content: `</${char}`,
            }
            emitToken()
            return atScript
        }
    }
    // </s
    function atScriptEndTag3(char) {
        if (char === 'c') {
            return atScriptEndTag4
        } else {
            currentToken = {
                type: 'code',
                content: `</s${char}`,
            }
            emitToken()
            return atScript
        }
    }
    // </sc
    function atScriptEndTag4(char) {
        if (char === 'r') {
            return atScriptEndTag5
        } else {
            currentToken = {
                type: 'code',
                content: `</sc${char}`,
            }
            emitToken()
            return atScript
        }
    }
    // </scr
    function atScriptEndTag5(char) {
        if (char === 'i') {
            return atScriptEndTag6
        } else {
            currentToken = {
                type: 'code',
                content: `</scr${char}`,
            }
            emitToken()
            return atScript
        }
    }
    // </scri
    function atScriptEndTag6(char) {
        if (char === 'p') {
            return atScriptEndTag7
        } else {
            currentToken = {
                type: 'code',
                content: `</scri${char}`,
            }
            emitToken()
            return atScript
        }
    }
    // </scrip
    function atScriptEndTag7(char) {
        if (char === 't') {
            return atScriptEndTag8
        } else {
            currentToken = {
                type: 'code',
                content: `</scrip${char}`,
            }
            emitToken()
            return atScript
        }
    }
    // </script
    function atScriptEndTag8(char) {
        if (char === '>') {
            currentToken = {
                type: 'endTag',
                tagName: 'script',
            }
            emitToken()
            return atData
        } else {
            currentToken = {
                type: 'code',
                content: `</script${char}`,
            }
            emitToken()
            return atScript
        }
    }
}


module.exports = compile
