class Layouter {
    constructor(component) {
        this.component = component
        this.component.layout = {}

        this.mainSize = ''      // 'width' | 'height'
        this.mainStart = ''     // 'left' | 'right' | 'top' | 'bottom'
        this.mainEnd = ''       // 'left' | 'right' | 'top' | 'bottom'
        this.mainSign = 0       // +1 | -1
        this.mainBase = 0       // 0 | style.width | style.height

        this.crossSize = ''     // 'width' | 'height'
        this.crossStart = ''    // 'left' | 'right' | 'top' | 'bottom'
        this.crossEnd = ''      // 'left' | 'right' | 'top' | 'bottom'
        this.crossSign = 0      // +1 | -1
        this.crossBase = 0      // 0 | style.width | style.height

        this.children = []

        this.flexLines = []
    }

    layout() {
        if (!this.component.children.length) {
            return
        }
        this.flexLines = []
        this.setup(this.component)  // 设置组件的 layout 属性, 用于保存排版信息
        this.setDefaultValue()      // 对于没有显式设置的 flex 相关的属性, 设置默认值
        this.setRuler()             // 根据 flex-direction 设置相应的尺度
        this.setChildren()          // 添加子元素并按 order 排序
        this.splitLine()            // 分行
        this.computeMainAxis()      // 计算主轴
        this.computeCrossAxis()     // 计算交叉轴
        for (let child of this.component.children) {
            this.component = child
            this.layout()
        }
    }

    setup(component) {
        if (!(component instanceof DivComponent)) {
            component.layout = {
                width: component.style.width ? parseInt(component.style.width.value) : 0,
                height: component.style.height ? parseInt(component.style.height.value) : 0,
            }
        }
    }

    setDefaultValue() {
        let style = this.component.style
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

    setRuler() {
        let style = this.component.style
        let layout = this.component.layout
        if (style['flex-direction'].value === 'row') {
            this.mainSize = 'width'
            this.mainStart = 'left'
            this.mainEnd = 'right'
            this.mainSign = +1
            this.mainBase = (layout.left ?? 0) + parseInt(style.margin?.value ?? 0) + parseInt(style.border?.value.split(' ')[0] ?? 0) + parseInt(style.padding?.value ?? 0)

            this.crossSize = 'height'
            this.crossStart = 'top'
            this.crossEnd = 'bottom'
            this.crossSign = +1
            this.crossBase = (layout.top ?? 0) + parseInt(style.margin?.value ?? 0) + parseInt(style.border?.value.split(' ')[0] ?? 0) + parseInt(style.padding?.value ?? 0)
        } else if (style['flex-direction'].value === 'row-reverse') {
            this.mainSize = 'width'
            this.mainStart = 'right'
            this.mainEnd = 'left'
            this.mainSign = -1
            this.mainBase = (layout.right ?? layout.width) - parseInt(style.margin?.value ?? 0) - parseInt(style.border?.value.split(' ')[0] ?? 0) - parseInt(style.padding?.value ?? 0)

            this.crossSize = 'height'
            this.crossStart = 'top'
            this.crossEnd = 'bottom'
            this.crossSign = +1
            this.crossBase = (layout.top ?? 0) + parseInt(style.margin?.value ?? 0) + parseInt(style.border?.value.split(' ')[0] ?? 0) + parseInt(style.padding?.value ?? 0)
        } else if (style['flex-direction'].value === 'column') {
            this.mainSize = 'height'
            this.mainStart = 'top'
            this.mainEnd = 'bottom'
            this.mainSign = +1
            this.mainBase = (layout.top ?? 0) + parseInt(style.margin?.value ?? 0) + parseInt(style.border?.value.split(' ')[0] ?? 0) + parseInt(style.padding?.value ?? 0)

            this.crossSize = 'width'
            this.crossStart = 'left'
            this.crossEnd = 'right'
            this.crossSign = +1
            this.crossBase = (layout.left ?? 0) + parseInt(style.margin?.value ?? 0) + parseInt(style.border?.value.split(' ')[0] ?? 0) + parseInt(style.padding?.value ?? 0)
        } else if (style['flex-direction'].value === 'column-reverse') {
            this.mainSize = 'height'
            this.mainStart = 'bottom'
            this.mainEnd = 'top'
            this.mainSign = -1
            this.mainBase = (layout.bottom ?? layout.height) - parseInt(style.margin?.value ?? 0) - parseInt(style.border?.value.split(' ')[0] ?? 0) - parseInt(style.padding?.value ?? 0) 

            this.crossSize = 'width'
            this.crossStart = 'left'
            this.crossEnd = 'right'
            this.crossSign = +1
            this.crossBase = (layout.left ?? 0) + parseInt(style.margin?.value ?? 0) + parseInt(style.border?.value.split(' ')[0] ?? 0) + parseInt(style.padding?.value ?? 0)
        }

        if (style['flex-wrap'].value === 'wrap-reverse') {
            [this.crossStart, this.crossEnd] = [this.crossEnd, this.crossStart]
            this.crossSign = -1
            this.crossBase = {
                'row': (layout.bottom ?? layout.height) - parseInt(style.margin?.value ?? 0) - parseInt(style.border?.value.split(' ')[0] ?? 0) - parseInt(style.padding?.value ?? 0),
                'row-reverse': (layout.bottom ?? layout.height) - parseInt(style.margin?.value ?? 0) - parseInt(style.border?.value.split(' ')[0] ?? 0) - parseInt(style.padding?.value ?? 0),
                'column': (layout.right ?? layout.width) - parseInt(style.margin?.value ?? 0) - parseInt(style.border?.value.split(' ')[0] ?? 0) - parseInt(style.padding?.value ?? 0),
                'column-reverse': (layout.right ?? layout.width) - parseInt(style.margin?.value ?? 0) - parseInt(style.border?.value.split(' ')[0] ?? 0) - parseInt(style.padding?.value ?? 0),
            }[style['flex-direction'].value]
        }
    }

    setChildren() {
        let children = []
        for (let child of this.component.children) {
            this.setup(child)
            children.push(child)
            if (child.children.length > 0) {
                // child 为 DivComponent, 因为只有 div 有子节点, 且只能嵌套一层
                child.layout.width = parseInt(child.style.width?.value ?? 0)
                if (!child.style.width) {
                    for (let c of child.children) {
                        c.setBox()
                        child.layout.width += parseInt(c.style.width.value)
                    }
                    child.layout.width +=
                        parseInt(child.style.padding?.value ?? 0) * 2 +
                        parseInt(child.style.border?.value.split(' ')[0] ?? 0) * 2 +
                        parseInt(child.style.margin?.value ?? 0) * 2
                } else {
                    child.layout.width += parseInt(child.style.margin?.value ?? 0) * 2
                }
                child.layout.height = parseInt(child.style.height?.value ?? 0)
                if (!child.style.height) {
                    for (let c of child.children) {
                        c.setBox()
                        child.layout.height = Math.max(parseInt(c.style.height.value), child.layout.height)
                    }
                    child.layout.height +=
                        parseInt(child.style.padding?.value ?? 0) * 2 +
                        parseInt(child.style.border?.value.split(' ')[0] ?? 0) * 2 +
                        parseInt(child.style.margin?.value ?? 0) * 2
                } else {
                    child.layout.height += parseInt(child.style.margin?.value ?? 0) * 2
                }
            }
        }
        children.sort((a, b) => {
            return (a.style.order?.value ?? 0) - (b.style.order?.value ?? 0)
        })
        this.children = children
    }

    createLine() {
        let newLine = []
        let margin = parseInt(this.component.style.margin?.value ?? 0)
        let border = parseInt(this.component.style.border?.value.split(' ')[0] ?? 0)
        let padding = parseInt(this.component.style.padding?.value ?? 0)
        newLine.mainSpace = this.component.layout[this.mainSize] - margin * 2 - border * 2 - padding * 2
        newLine.crossSpace = 0
        this.flexLines.push(newLine)
        return newLine
    }

    splitLine() {
        let newLine = this.createLine()
        let style = this.component.style
        let layout = this.component.layout
        for (let child of this.children) {
            let childStyle = child.style
            let childLayout = child.layout
            if (childStyle['flex']) {
                // flex 属性意味着可伸缩, 无论剩余多少尺寸都能放进去
                newLine.push(child)
                newLine.crossSpace = Math.max(newLine.crossSpace, childLayout[this.crossSize])
            } else if (style['flex-wrap'].value === 'no-wrap') {
                // 强行在一行中塞入全部元素
                newLine.push(child)
                newLine.mainSpace -= childLayout[this.mainSize]
                newLine.crossSpace = Math.max(newLine.crossSpace, childLayout[this.crossSize])
            } else {
                // 如果元素超过容器, 则压缩到容器大小
                let containerWidth = layout[this.mainSize] - parseInt(style.margin?.value ?? 0) * 2 - parseInt(style.border?.value.split(' ')[0] ?? 0) * 2 - parseInt(style.padding?.value ?? 0) * 2
                childLayout[this.mainSize] = Math.min(childLayout[this.mainSize], containerWidth)
                // 分行
                if (newLine.mainSpace < childLayout[this.mainSize]) {
                    newLine = this.createLine()
                }
                // 将元素收入行内
                newLine.push(child)
                newLine.mainSpace -= childLayout[this.mainSize]
                newLine.crossSpace = Math.max(newLine.crossSpace, childLayout[this.crossSize])
            }
        }
    }

    computeFlexLine(line, flexTotal) {
        let currentMain = this.mainBase
        for (let child of line) {
            if (child.style['flex']) {
                child.layout[this.mainSize] = child.style['flex'].value / flexTotal * line.mainSpace
            }
            child.layout[this.mainStart] = currentMain
            child.layout[this.mainEnd] = currentMain + this.mainSign * child.layout[this.mainSize]
            currentMain = child.layout[this.mainEnd]
        }
    }

    computeNotFlexLine(line) {
        let style = this.component.style
        let currentMain = this.mainBase
        let space = 0
        if (style['justify-content'].value === 'flex-start') {
            currentMain = this.mainBase
            space = 0
        } else if (style['justify-content'].value === 'flex-end') {
            currentMain = this.mainBase + this.mainSign * line.mainSpace
            space = 0
        } else if (style['justify-content'].value === 'center') {
            currentMain = this.mainBase + this.mainSign * line.mainSpace / 2
            space = 0
        } else if (style['justify-content'].value === 'space-between') {
            currentMain = this.mainBase
            space = this.mainSign * line.mainSpace / (line.length - 1)
        } else if (style['justify-content'].value === 'space-around') {
            currentMain = this.mainBase + this.mainSign * line.mainSpace / line.length / 2
            space = this.mainSign * line.mainSpace / line.length
        }
        for (let child of line) {
            let childLayout = child.layout
            childLayout[this.mainStart] = currentMain
            childLayout[this.mainEnd] = currentMain + this.mainSign * childLayout[this.mainSize]
            currentMain = childLayout[this.mainEnd] + space
        }
    }

    computeNegativeSpaceLine(line) {
        let layout = this.component.layout
        let scale = layout[this.mainSize] / (layout[this.mainSize] + (-line.mainSpace))
        let currentMain = this.mainBase
        for (let child of line) {
            let childLayout = child.layout
            if (child.style['flex']) {
                // 将有 flex 属性的元素压缩到 0
                childLayout[this.mainSize] = 0
            }
            childLayout[this.mainSize] *= scale
            childLayout[this.mainStart] = currentMain
            childLayout[this.mainEnd] = currentMain + this.mainSign * childLayout[this.mainSize]
            currentMain = childLayout[this.mainEnd]
        }
    }

    computeMainAxis() {
        for (let line of this.flexLines) {
            if (line.mainSpace >= 0) {
                let flexTotal = 0
                for (let child of line) {
                    flexTotal += child.style['flex']?.value ?? 0
                }
                if (flexTotal > 0) {
                    // 含有 [有 flex 属性的元素] 的行
                    this.computeFlexLine(line, flexTotal)
                } else {
                    // 没有 [有 flex 属性的元素] 的行
                    this.computeNotFlexLine(line)
                }
            } else {
                // 剩余空间为负, 说明 [flex-wrap: nowrap], 等比压缩不含有 flex 元素的属性
                this.computeNegativeSpaceLine(line)
            }
        }
    }

    computeCrossAxis() {
        // 根据 align-content align-items align-self 确定元素位置
        let style = this.component.style
        let layout = this.component.layout
        // 自动撑开交叉轴
        layout[this.crossSize] === 0
        if (layout[this.crossSize] === 0) {
            for (let line of this.flexLines) {
                layout[this.crossSize] += line.crossSpace
            }
            layout[this.crossSize] += parseInt(style.padding?.value ?? 0) + parseInt(style.border?.value.split(' ')[0] ?? 0)
        }
        // 计算交叉轴总空白
        let crossSpaceTotal = layout[this.crossSize] - parseInt(style.margin?.value ?? 0) * 2 - parseInt(style.border?.value.split(' ')[0] ?? 0) * 2 - parseInt(style.padding?.value ?? 0) * 2
        for (let line of this.flexLines) {
            crossSpaceTotal -= line.crossSpace
        }
        // 确定每一条主轴位于整个容器的交叉轴的位置
        let currentCross = this.crossBase
        let space = 0
        if (style['align-content'].value === 'flex-start') {
            currentCross = this.crossBase
            space = 0
        } else if (style['align-content'].value === 'flex-end') {
            currentCross = this.crossBase + this.crossSign * crossSpaceTotal
            space = 0
        } else if (style['align-content'].value === 'center') {
            currentCross = this.crossBase + this.crossSign * crossSpaceTotal / 2
            space = 0
        } else if (style['align-content'].value === 'space-between') {
            currentCross = this.crossBase
            space = this.crossSign * crossSpaceTotal / (this.flexLines.length - 1)
        } else if (style['align-content'].value === 'space-around') {
            currentCross = this.crossBase + this.crossSign * crossSpaceTotal / this.flexLines.length / 2
            space = this.crossSign * crossSpaceTotal / this.flexLines.length
        } else if (style['align-content'].value === 'stretch') {
            currentCross = this.crossBase
            space = 0
        }
        // 确定每个元素的具体位置
        for (let line of this.flexLines) {
            let lineCrossSize = line.crossSpace
            if (style['align-content'].value === 'stretch') {
                // 平分剩余的空白空间, 拉伸填满
                lineCrossSize = line.crossSpace + crossSpaceTotal / this.flexLines.length
            }
            for (let child of line) {
                let childLayout = child.layout
                let align = child.style['align-self']?.value || style['align-items'].value
                if (align === 'stretch') {
                    childLayout[this.crossStart] = currentCross
                    childLayout[this.crossSize] = childLayout[this.crossSize] ?? lineCrossSize
                    childLayout[this.crossEnd] = childLayout[this.crossStart] + this.crossSign * childLayout[this.crossSize]
                } else if (align === 'flex-start') {
                    childLayout[this.crossStart] = currentCross
                    childLayout[this.crossEnd] = childLayout[this.crossStart] + this.crossSign * childLayout[this.crossSize]
                } else if (align === 'flex-end') {
                    childLayout[this.crossStart] = currentCross + this.crossSign * lineCrossSize - this.crossSign * childLayout[this.crossSize]
                    childLayout[this.crossEnd] = childLayout[this.crossStart] + this.crossSign * childLayout[this.crossSize]
                } else if (align === 'center') {
                    childLayout[this.crossStart] = currentCross + this.crossSign * (lineCrossSize - childLayout[this.crossSize]) / 2
                    childLayout[this.crossEnd] = childLayout[this.crossStart] + this.crossSign * childLayout[this.crossSize]
                }
            }
            currentCross += this.crossSign * lineCrossSize + space
        }
    }
}
