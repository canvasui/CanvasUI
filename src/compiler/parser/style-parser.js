class StyleParser {
    constructor(style) {
        this.style = style
        this.rules = []
        this.selector = ''
        this.declaration = {}
        this.property = ''
        this.value = ''
    }

    parse() {
        this.state = this.atSelector
        for (let char of this.style) {
            this.state = this.state(char)
        }
        return this.rules
    }

    atSelector(char) {
        if (char === '{') {
            return this.atProperty
        } else {
            this.selector += char
            return this.atSelector
        }
    }

    atProperty(char) {
        if (char === ':') {
            return this.atValue
        } else if (char === '}') {
            this.rules.push({
                selector: this.selector.trim(),
                declaration: this.declaration,
            })
            this.selector = ''
            this.declaration = {}
            return this.atSelector
        } else {
            this.property += char
            return this.atProperty
        }
    }

    atValue(char) {
        if (char === ';') {
            this.declaration[this.property.trim()] = this.value.trim()
            this.property = ''
            this.value = ''
            return this.atProperty
        } else {
            this.value += char
            return this.atValue
        }
    }
}


module.exports = StyleParser
