function layout(component, root) {
    // root 用于标记是从根节点开始重排, 还是在排版过程中子组件在递归调用 layout()
    let mainSize = ''      // 'width' | 'height'
    let mainStart = ''     // 'left' | 'right' | 'top' | 'bottom'
    let mainEnd = ''       // 'left' | 'right' | 'top' | 'bottom'
    let mainSign = 0       // +1 | -1
    let mainBase = 0       // 0 | style.width | style.height
    let crossSize = ''     // 'width' | 'height'
    let crossStart = ''    // 'left' | 'right' | 'top' | 'bottom'
    let crossEnd = ''      // 'left' | 'right' | 'top' | 'bottom'
    let crossSign = 0      // +1 | -1
    let crossBase = 0      // 0 | style.width | style.height
    let children = []
    let flexLines = []

    main()

    function main() {
        if (component.children.length === 0) {
            return
        }
        setup(component)    // 设置组件的 layout.width 和 layout.height (即整个盒模型最外层的宽高)
        setDefaultValue()   // 对于没有显式设置的 flex 相关的属性, 设置默认值
        setRuler()          // 根据 flex-direction 设置相应的尺度
        setChildren()       // 设置子组件的 layout.width 和 layout.height, 并按 order 排序
        splitLine()         // 分行(准确地说, 应该是分主轴)
        computeMainAxis()   // 计算主轴
        computeCrossAxis()  // 计算交叉轴
        for (let child of component.children) {
            layout(child)
        }
    }

    function setup(component) {
        // 因为默认为 border-box, 所以 width 包含 border 和 padding
        if (root) {
            // 从根组件重排的情况
            component.layout.width = parseInt(component.style.width?.value ?? 0) + parseInt(component.style.margin?.value ?? 0) * 2
            component.layout.height = parseInt(component.style.height?.value ?? 0) + parseInt(component.style.margin?.value ?? 0) * 2
        } else {
            // 递归调用的情况
            let width = parseInt(component.style.width?.value ?? 0) + parseInt(component.style.margin?.value ?? 0) * 2
            let height = parseInt(component.style.height?.value ?? 0) + parseInt(component.style.margin?.value ?? 0) * 2
            // 当 width, height 为 0 时, 取之前已经计算的 layout 的宽高 (layout 的宽高可能是因为组件具有 flex 属性而被 computeFlexLine 计算出来的)
            // 当 width, height 不为 0 时, 可能是显式设定的固定值, 也可能是 props 的数据改变进而改变了 style
            if (width === 0 && height === 0) {
                width = component.layout.width ?? 0
                height = component.layout.height ?? 0
            }
            component.layout.width = width
            component.layout.height = height
        }
    }

    function setDefaultValue() {
        let style = component.style
        style['justify-content'] = style['justify-content'] ?? { value: 'flex-start' }
        style['align-items'] = style['align-items'] ?? { value: 'stretch' }
        style['flex-direction'] = style['flex-direction'] ?? { value: 'row' }
        style['flex-wrap'] = style['flex-wrap'] ?? { value: 'nowrap' }
        style['align-content'] = style['align-content'] ?? { value: 'stretch' }
        if (style['flex-flow']) {
            style['flex-direction'] = { value: style['flex-flow'].value.split(' ')[0] }
            style['flex-wrap'] = { value: style['flex-flow'].value.split(' ')[1] }
        }
    }

    function setRuler() {
        let style = component.style
        let layout = component.layout
        if (style['flex-direction'].value === 'row') {
            mainSize = 'width'
            mainStart = 'left'
            mainEnd = 'right'
            mainSign = +1
            mainBase = (layout.left ?? 0) + parseInt(style.margin?.value ?? 0) + parseInt(style.border?.value.split(' ')[0] ?? 0) + parseInt(style.padding?.value ?? 0)

            crossSize = 'height'
            crossStart = 'top'
            crossEnd = 'bottom'
            crossSign = +1
            crossBase = (layout.top ?? 0) + parseInt(style.margin?.value ?? 0) + parseInt(style.border?.value.split(' ')[0] ?? 0) + parseInt(style.padding?.value ?? 0)
        } else if (style['flex-direction'].value === 'row-reverse') {
            mainSize = 'width'
            mainStart = 'right'
            mainEnd = 'left'
            mainSign = -1
            mainBase = (layout.right ?? layout.width) - parseInt(style.margin?.value ?? 0) - parseInt(style.border?.value.split(' ')[0] ?? 0) - parseInt(style.padding?.value ?? 0)

            crossSize = 'height'
            crossStart = 'top'
            crossEnd = 'bottom'
            crossSign = +1
            crossBase = (layout.top ?? 0) + parseInt(style.margin?.value ?? 0) + parseInt(style.border?.value.split(' ')[0] ?? 0) + parseInt(style.padding?.value ?? 0)
        } else if (style['flex-direction'].value === 'column') {
            mainSize = 'height'
            mainStart = 'top'
            mainEnd = 'bottom'
            mainSign = +1
            mainBase = (layout.top ?? 0) + parseInt(style.margin?.value ?? 0) + parseInt(style.border?.value.split(' ')[0] ?? 0) + parseInt(style.padding?.value ?? 0)

            crossSize = 'width'
            crossStart = 'left'
            crossEnd = 'right'
            crossSign = +1
            crossBase = (layout.left ?? 0) + parseInt(style.margin?.value ?? 0) + parseInt(style.border?.value.split(' ')[0] ?? 0) + parseInt(style.padding?.value ?? 0)
        } else if (style['flex-direction'].value === 'column-reverse') {
            mainSize = 'height'
            mainStart = 'bottom'
            mainEnd = 'top'
            mainSign = -1
            mainBase = (layout.bottom ?? layout.height) - parseInt(style.margin?.value ?? 0) - parseInt(style.border?.value.split(' ')[0] ?? 0) - parseInt(style.padding?.value ?? 0)

            crossSize = 'width'
            crossStart = 'left'
            crossEnd = 'right'
            crossSign = +1
            crossBase = (layout.left ?? 0) + parseInt(style.margin?.value ?? 0) + parseInt(style.border?.value.split(' ')[0] ?? 0) + parseInt(style.padding?.value ?? 0)
        }

        if (style['flex-wrap'].value === 'wrap-reverse') {
            [crossStart, crossEnd] = [crossEnd, crossStart]
            crossSign = -1
            crossBase = {
                'row': (layout.bottom ?? layout.height) - parseInt(style.margin?.value ?? 0) - parseInt(style.border?.value.split(' ')[0] ?? 0) - parseInt(style.padding?.value ?? 0),
                'row-reverse': (layout.bottom ?? layout.height) - parseInt(style.margin?.value ?? 0) - parseInt(style.border?.value.split(' ')[0] ?? 0) - parseInt(style.padding?.value ?? 0),
                'column': (layout.right ?? layout.width) - parseInt(style.margin?.value ?? 0) - parseInt(style.border?.value.split(' ')[0] ?? 0) - parseInt(style.padding?.value ?? 0),
                'column-reverse': (layout.right ?? layout.width) - parseInt(style.margin?.value ?? 0) - parseInt(style.border?.value.split(' ')[0] ?? 0) - parseInt(style.padding?.value ?? 0),
            }[style['flex-direction'].value]
        }
    }

    function setChildren() {
        for (let child of component.children) {
            setup(child)
            children.push(child)
        }
        children.sort((a, b) => {
            return (a.style.order?.value ?? 0) - (b.style.order?.value ?? 0)
        })
    }

    function createLine() {
        let newLine = []
        let margin = parseInt(component.style.margin?.value ?? 0)
        let border = parseInt(component.style.border?.value.split(' ')[0] ?? 0)
        let padding = parseInt(component.style.padding?.value ?? 0)
        newLine.mainSpace = component.layout[mainSize] - margin * 2 - border * 2 - padding * 2
        newLine.crossSpace = 0
        flexLines.push(newLine)
        return newLine
    }

    function splitLine() {
        let newLine = createLine()
        let style = component.style
        let layout = component.layout
        for (let child of children) {
            let childStyle = child.style
            let childLayout = child.layout
            if (childStyle['flex']) {
                // flex 属性意味着可伸缩, 无论剩余多少尺寸都能放进去
                newLine.push(child)
                newLine.crossSpace = Math.max(newLine.crossSpace, childLayout[crossSize])
            } else if (style['flex-wrap'].value === 'nowrap') {
                // 强行在一行中塞入全部元素
                newLine.push(child)
                newLine.mainSpace -= childLayout[mainSize]
                newLine.crossSpace = Math.max(newLine.crossSpace, childLayout[crossSize])
            } else {
                // 如果元素超过容器, 则压缩到容器大小
                let containerWidth = layout[mainSize] - parseInt(style.margin?.value ?? 0) * 2 - parseInt(style.border?.value.split(' ')[0] ?? 0) * 2 - parseInt(style.padding?.value ?? 0) * 2
                childLayout[mainSize] = Math.min(childLayout[mainSize], containerWidth)
                // 分行
                if (newLine.mainSpace < childLayout[mainSize]) {
                    newLine = createLine()
                }
                // 将元素收入行内
                newLine.push(child)
                newLine.mainSpace -= childLayout[mainSize]
                newLine.crossSpace = Math.max(newLine.crossSpace, childLayout[crossSize])
            }
        }
    }

    function computeFlexLine(line, flexTotal) {
        let currentMain = mainBase
        for (let child of line) {
            if (child.style['flex']) {
                child.layout[mainSize] = parseInt(child.style['flex'].value) / flexTotal * line.mainSpace
            }
            child.layout[mainStart] = currentMain
            child.layout[mainEnd] = currentMain + mainSign * child.layout[mainSize]
            currentMain = child.layout[mainEnd]
        }
    }

    function computeNotFlexLine(line) {
        let style = component.style
        let currentMain = mainBase
        let space = 0
        if (style['justify-content'].value === 'flex-start') {
            currentMain = mainBase
            space = 0
        } else if (style['justify-content'].value === 'flex-end') {
            currentMain = mainBase + mainSign * line.mainSpace
            space = 0
        } else if (style['justify-content'].value === 'center') {
            currentMain = mainBase + mainSign * line.mainSpace / 2
            space = 0
        } else if (style['justify-content'].value === 'space-between') {
            currentMain = mainBase
            space = mainSign * line.mainSpace / (line.length - 1)
        } else if (style['justify-content'].value === 'space-around') {
            currentMain = mainBase + mainSign * line.mainSpace / line.length / 2
            space = mainSign * line.mainSpace / line.length
        }
        for (let child of line) {
            let childLayout = child.layout
            childLayout[mainStart] = currentMain
            childLayout[mainEnd] = currentMain + mainSign * childLayout[mainSize]
            currentMain = childLayout[mainEnd] + space
        }
    }

    function computeNegativeSpaceLine(line) {
        let layout = component.layout
        let scale = layout[mainSize] / (layout[mainSize] + (-line.mainSpace))
        let currentMain = mainBase
        for (let child of line) {
            let childLayout = child.layout
            if (child.style['flex']) {
                // 将有 flex 属性的元素压缩到 0
                childLayout[mainSize] = 0
            }
            childLayout[mainSize] *= scale
            childLayout[mainStart] = currentMain
            childLayout[mainEnd] = currentMain + mainSign * childLayout[mainSize]
            currentMain = childLayout[mainEnd]
        }
    }

    function computeMainAxis() {
        for (let line of flexLines) {
            if (line.mainSpace >= 0) {
                let flexTotal = 0
                for (let child of line) {
                    flexTotal += parseInt(child.style['flex']?.value ?? 0)
                }
                if (flexTotal > 0) {
                    // 含有 [有 flex 属性的元素] 的行
                    computeFlexLine(line, flexTotal)
                } else {
                    // 没有 [有 flex 属性的元素] 的行
                    computeNotFlexLine(line)
                }
            } else {
                // 剩余空间为负, 说明 [flex-wrap: nowrap], 等比压缩不含有 flex 元素的属性
                computeNegativeSpaceLine(line)
            }
        }
    }

    function computeCrossAxis() {
        // 根据 align-content align-items align-self 确定元素位置
        let style = component.style
        let layout = component.layout
        // 如果交叉轴没有设置, 则自动撑开交叉轴
        if (layout[crossSize] === 0) {
            for (let line of flexLines) {
                layout[crossSize] += line.crossSpace
            }
            layout[crossSize] += parseInt(style.padding?.value ?? 0) * 2 + parseInt(style.border?.value.split(' ')[0] ?? 0) * 2 + parseInt(style.margin?.value ?? 0) * 2
        }
        // 计算交叉轴总空白
        let crossSpaceTotal = layout[crossSize] - parseInt(style.margin?.value ?? 0) * 2 - parseInt(style.border?.value.split(' ')[0] ?? 0) * 2 - parseInt(style.padding?.value ?? 0) * 2
        for (let line of flexLines) {
            crossSpaceTotal -= line.crossSpace
        }
        // 确定每一条主轴位于整个容器的交叉轴的位置
        let currentCross = crossBase
        let space = 0
        if (style['align-content'].value === 'flex-start') {
            currentCross = crossBase
            space = 0
        } else if (style['align-content'].value === 'flex-end') {
            currentCross = crossBase + crossSign * crossSpaceTotal
            space = 0
        } else if (style['align-content'].value === 'center') {
            currentCross = crossBase + crossSign * crossSpaceTotal / 2
            space = 0
        } else if (style['align-content'].value === 'space-between') {
            currentCross = crossBase
            space = crossSign * crossSpaceTotal / (flexLines.length - 1)
        } else if (style['align-content'].value === 'space-around') {
            currentCross = crossBase + crossSign * crossSpaceTotal / flexLines.length / 2
            space = crossSign * crossSpaceTotal / flexLines.length
        } else if (style['align-content'].value === 'stretch') {
            currentCross = crossBase
            space = 0
        }
        // 确定每个元素的具体位置
        for (let line of flexLines) {
            let lineCrossSize = line.crossSpace
            if (style['align-content'].value === 'stretch') {
                // 平分剩余的空白空间, 拉伸填满
                lineCrossSize = line.crossSpace + crossSpaceTotal / flexLines.length
            }
            for (let child of line) {
                let childLayout = child.layout
                let align = child.style['align-self']?.value || style['align-items'].value
                if (align === 'stretch') {
                    childLayout[crossStart] = currentCross
                    childLayout[crossSize] = childLayout[crossSize] || lineCrossSize
                    childLayout[crossEnd] = childLayout[crossStart] + crossSign * childLayout[crossSize]
                } else if (align === 'flex-start') {
                    childLayout[crossStart] = currentCross
                    childLayout[crossEnd] = childLayout[crossStart] + crossSign * childLayout[crossSize]
                } else if (align === 'flex-end') {
                    childLayout[crossStart] = currentCross + crossSign * lineCrossSize - crossSign * childLayout[crossSize]
                    childLayout[crossEnd] = childLayout[crossStart] + crossSign * childLayout[crossSize]
                } else if (align === 'center') {
                    childLayout[crossStart] = currentCross + crossSign * (lineCrossSize - childLayout[crossSize]) / 2
                    childLayout[crossEnd] = childLayout[crossStart] + crossSign * childLayout[crossSize]
                }
            }
            currentCross += crossSign * lineCrossSize + space
        }
    }
}
