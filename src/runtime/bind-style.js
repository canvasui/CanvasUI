function bindStyle(component, style) {
    traverse(component)

    function traverse(component) {
        compute(component)
        for (let child of component.children) {
            traverse(child)
        }
    }

    function match(component, selector) {
        if (selector[0] === '#') {
            let id = component.props.id
            if (id === selector.slice(1)) {
                return true
            }
        } else if (selector[0] === '.') {
            let classNames = component.props.class?.split(' ') ?? []
            for (let className of classNames) {
                if (className === selector.slice(1)) {
                    return true
                }
            }
        } else if (selector === component.tagName) {
            return true
        } else {
            return false
        }
    }

    function specificity(selectors) {
        let s = [0, 0, 0, 0]
        for (let part of selectors) {
            if (part[0] === '#') {
                s[1] += 1
            } else if (part[0] === '.') {
                s[2] += 1
            } else {
                s[3] += 1
            }
        }
        return s
    }

    function compare(s1, s2) {
        if (s1[0] !== s2[0]) {
            return s1[0] > s2[0]
        } else if (s1[1] !== s2[1]) {
            return s1[1] > s2[1]
        } else if (s1[2] !== s2[2]) {
            return s1[2] > s2[2]
        } else if (s1[3] !== s2[3]) {
            return s1[3] - s2[3]
        } else {
            return false
        }
    }

    function compute(component) {
        component.style = {}
        ruleLoop:
        for (let rule of style) {
            let selectors = rule.selector.split(' ').reverse()
            let parent = component
            for (let part of selectors) {
                if (match(parent, part)) {
                    parent = parent.parent
                } else {
                    continue ruleLoop
                }
            }
            let newSpecificity = specificity(selectors)
            let style = component.style
            for (let [property, value] of Object.entries(rule.declaration)) {
                style[property] = style[property] ?? {}
                style[property].specificity = style[property].specificity ?? newSpecificity
                if (compare(style[property].specificity, newSpecificity)) {
                    // 如果原样式比新样式的优先级更高, 则无需改变
                    continue
                }
                // 后来优先原则
                style[property].value = value
            }
        }
    }
}
