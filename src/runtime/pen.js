const pen = {
    context: null,
    setContext(context) {
        this.context = context
    },
    reset() {
        // 常用属性
        this.context.strokeStyle = 'black'
        this.context.fillStyle = 'white'
        this.context.lineWidth = 1
        this.context.lineCap = 'butt'
        this.context.setLineDash([])
        // 文字相关
        this.context.font = '14px sans-serif'
        this.context.textAlign = 'left'
        this.context.textBaseline = 'top'
        // 阴影相关
        this.context.shadowOffsetX = 0
        this.context.shadowOffsetY = 0
        this.context.shadowBlur = 0
        this.context.shadowColor = 'black'
    },
    stroke(color, lineWidth=1) {
        this.context.strokeStyle = color
        this.context.lineWidth = lineWidth
        this.context.stroke()
        this.context.lineWidth = 1
    },
    fill(color) {
        this.context.fillStyle = color
        this.context.fill()
    },
    // 需要手动 stroke 或 fill 的
    drawRect(x, y, width, height, radius, style='solid', lineWidth=1) {
        if (style === 'dotted') {
            this.context.setLineDash([lineWidth, lineWidth])
        } else if (style === 'dashed') {
            this.context.setLineDash([4 * lineWidth, 4 * lineWidth])
        } else {
            this.context.lineCap = 'square'
        }
        x += lineWidth / 2
        y += lineWidth / 2
        width -= lineWidth
        height -= lineWidth
        this.context.beginPath()
        this.context.moveTo(x, y + radius)
        this.context.lineTo(x, y + height - radius)
        this.context.quadraticCurveTo(x, y + height, x + radius, y + height)
        this.context.lineTo(x + width - radius, y + height)
        this.context.quadraticCurveTo(x + width, y + height, x + width, y + height - radius)
        this.context.lineTo(x + width, y + radius)
        this.context.quadraticCurveTo(x + width, y, x + width - radius, y)
        this.context.lineTo(x + radius, y)
        this.context.quadraticCurveTo(x, y, x, y + radius)
    },
    drawCircle(x, y, radius) {
        this.context.beginPath()
        this.context.arc(x, y, radius, 0, 2 * Math.PI)
    },
    // 无需手动 stroke 或 fill 的
    drawLine(startX, startY, endX, endY, color='black') {
        this.context.beginPath()
        this.context.moveTo(startX, startY)
        this.context.lineTo(endX, endY)
        this.context.strokeStyle = color
        this.context.stroke()
    },
    drawText(content, x, y, fontSize, fontColor, align='left') {
        this.context.font = `${fontSize}px sans-serif`
        this.context.fillStyle = fontColor
        this.context.textAlign = align
        this.context.fillText(content, x, y)
    },
    drawImage(image, x, y, width, height, radius=0) {
        if (radius !== 0) {
            this.context.save()
            this.context.beginPath()
            this.context.moveTo(x + radius, y)
            this.context.arcTo(x + width, y, x + width, y + height, radius)
            this.context.arcTo(x + width, y + height, x, y + height, radius)
            this.context.arcTo(x, y + height, x, y, radius)
            this.context.arcTo(x, y, x + width, y, radius)
            this.context.closePath()
            this.context.clip()
            this.context.drawImage(image, x, y, width, height)
            this.context.restore()
        } else {
            this.context.drawImage(image, x, y, width, height)
        }
    }
}
