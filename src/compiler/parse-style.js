function parseStyle(style) {
    let rules = []
    let selector = ''
    let declaration = {}
    let property = ''
    let value = ''
    return parse()

    function parse() {
        let state = atSelector
        for (let char of style) {
            state = state(char)
        }
        return rules
    }

    function atSelector(char) {
        if (char === '{') {
            return atProperty
        } else {
            selector += char
            return atSelector
        }
    }

    function atProperty(char) {
        if (char === ':') {
            return atValue
        } else if (char === '}') {
            rules.push({
                selector: selector.trim(),
                declaration: declaration,
            })
            selector = ''
            declaration = {}
            return atSelector
        } else {
            property += char
            return atProperty
        }
    }

    function atValue(char) {
        if (char === ';') {
            declaration[property.trim()] = value.trim()
            property = ''
            value = ''
            return atProperty
        } else {
            value += char
            return atValue
        }
    }
}


module.exports = parseStyle
