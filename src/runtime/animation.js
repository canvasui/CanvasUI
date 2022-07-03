/*
用法:
let animation = new Animation(config)
let animation2 = new Animation(config)

let timeline = new Timeline()
timeline.add(animation)
timeline.add(animation2)

timeline.start()
timeline.pause()
timeline.resume()
*/


class Timeline {
    constructor() {
        this.state = 'initial'  // initial | running | paused | waiting(已经start, 等待add)
        this.rafId = 0
        this.startTime = 0
        this.pauseTime = 0
        this.animations = new Set()
    }

    tick() {
        let elapsedTime = Date.now() - this.startTime
        for (let animation of this.animations) {
            let { object, property, template, duration, delay, timingFunction } = animation
            let progress
            if (elapsedTime < delay) {
                progress = 0
            } else if (elapsedTime <= delay + duration) {
                // timingFunction 接受时间的进度(0~1), 返回实际效果的进度(0~1)
                progress = timingFunction((elapsedTime - delay) / duration)
            } else {
                progress = 1
                this.animations.delete(animation)
            }
            // 根据进度计算相应的属性值
            let value = animation.newValue(progress)
            if (object[property]) {
                object[property].value = template(value)
            } else {
                object[property] = { value: template(value) }
            }
        }
        if (this.animations.size > 0) {
            this.rafId = requestAnimationFrame(this.tick.bind(this))
        } else {
            // 已经 start, 等待 add 后立即开始 tick
            this.state = 'waiting'
        }
    }

    add(animation) {
        this.animations.add(animation)
        if (this.state !== 'initial') {
            // 可以随时开启一个新的 animation
            animation.delay += Date.now() - this.startTime
        }
        if (this.state === 'waiting') {
            // timeline 已经 start, 当 animations 中有元素的时候立即开始 tick
            this.state = 'running'
            this.tick()
        }
    }

    start() {
        if (this.state !== 'initial') {
            return
        }
        this.state = 'running'
        this.startTime = Date.now()
        this.tick()
    }

    pause() {
        if (this.state !== 'running') {
            return
        }
        this.state = 'paused'
        this.pauseTime = Date.now()
        cancelAnimationFrame(this.rafId)
    }

    resume() {
        if (this.state !== 'paused') {
            return
        }
        this.state = 'running'
        this.startTime += Date.now() - this.pauseTime
        this.tick()
    }

    reset() {
        this.animations = new Set()
        this.state = 'initial'
    }
}


class Animation {
    constructor(config) {
        this.object = null
        this.id = config.id
        this.property = config.property
        this.template = config.template
        this.start = config.start
        this.end = config.end
        this.duration = config.duration
        this.delay = config.delay || 0
        this.timingFunction = config.timingFunction || (progress => progress)
        this.find(config.component)
    }

    find(component) {
        if (component.props?.id === this.id) {
            this.object = component.style
            return
        }
        for (let child of component.children) {
            this.find(child)
        }
    }

    newValue(progress) {
        // 不同的 animation 需要重写此方法
        return this.start + (this.end - this.start) * progress
    }
}


function cubicBezier(x1, y1, x2, y2) {
    // 翻译自 WebKit 源码:
    // https://github.com/WebKit/WebKit/blob/main/Source/WebCore/platform/graphics/UnitBezier.h

    const epsilon = 1e-6

    const ax = 3 * x1 - 3 * x2 + 1
    const bx = 3 * x2 - 6 * x1
    const cx = 3 * x1

    const ay = 3 * y1 - 3 * y2 + 1
    const by = 3 * y2 - 6 * y1
    const cy = 3 * y1

    function sampleCurveX(t) {
        return ((ax * t + bx) * t + cx ) * t
    }

    function sampleCurveY(t) {
        return ((ay * t + by) * t + cy ) * t
    }

    function sampleCurveDerivativeX(t) {
        return (3 * ax * t + 2 * bx) * t + cx
    }

    function solveCurveX(x) {
        let t0 = 0
        let t1 = 1
        let t2 = x
        let x2
        // 先尝试非常快的牛顿法
        for (let i = 0; i < 8; i++) {
            x2 = sampleCurveX(t2) - x
            if (Math.abs(x2) < epsilon) {
                return t2
            }
            let derivative = sampleCurveDerivativeX(t2)
            if (Math.abs(derivative) < epsilon) {
                break
            }
            t2 -= x2 / derivative
        }
        // 回到更可靠的二分法
        while (t1 > t0) {
            x2 = sampleCurveX(t2) - x
            if (Math.abs(x2) < epsilon) {
                return t2
            }
            if (x2 > 0) {
                t1 = t2
            } else {
                t0 = t2
            }
            t2 = (t1 + t0) / 2
        }
        return t2
    }

    function solve(x) {
        return sampleCurveY(solveCurveX(x))
    }

    return solve
}


let timeline = new Timeline()
