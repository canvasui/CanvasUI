/*
派发的事件及相应属性:
    通用的
        start: clientX, clientY
        cancel: clientX, clientY
    轻点(Tap)
        tap: clientX, clientY
    长按(Press)
        pressstart: clientX, clientY
        pressend: clientX, clientY
        presscancel
    拖动(Pan)
        panstart: startX, startY, clientX, clientY
        panmove: startX, startY, clientX, clientY
        panend: startX, startY, clientX, clientY, speed, isSwipe
    轻扫(Swipe)
        swipe: startX, startY, clientX, clientY, speed
*/
class Gesture {
    constructor() {
        this.contexts = {}
        if ('ontouchstart' in document) {
            this.listenTouch()
        } else {
            this.listenMouse()
        }
    }

    listenTouch() {
        document.addEventListener('touchstart', (event) => {
            for (let touch of event.changedTouches) {
                this.contexts[touch.identifier] = {}
                this.start(touch, this.contexts[touch.identifier])
            }
        })
        document.addEventListener('touchmove', (event) => {
            for (let touch of event.changedTouches) {
                this.move(touch, this.contexts[touch.identifier])
            }
        })
        document.addEventListener('touchend', (event) => {
            for (let touch of event.changedTouches) {
                this.end(touch, this.contexts[touch.identifier])
                delete this.contexts[touch.identifier]
            }
        })
        document.addEventListener('touchcancel', (event) => {
            for (let touch of event.changedTouches) {
                this.cancel(touch, this.contexts[touch.identifier])
                delete this.contexts[touch.identifier]
            }
        })
    }

    listenMouse() {
        document.addEventListener('mousedown', (event) => {
            this.contexts['mouse'] = {}
            this.start(event, this.contexts['mouse'])
            let mousemove = (event) => {
                this.move(event, this.contexts['mouse'])
            }
            let mouseup = (event) => {
                this.end(event, this.contexts['mouse'])
                document.removeEventListener('mousemove', mousemove)
                document.removeEventListener('mouseup', mouseup)
            }
            document.addEventListener('mousemove', mousemove)
            document.addEventListener('mouseup', mouseup)
        })
    }

    start(point, context) {
        document.dispatchEvent(new CustomEvent('start', {
            detail: {
                clientX: point.clientX,
                clientY: point.clientY,
            }
        }))
        context.startX = point.clientX
        context.startY = point.clientY
        context.moves = []
        context.action = 'tap'
        context.timeoutHandler = setTimeout(() => {
            if (context.action === 'pan') {
                return
            }
            context.action = 'press'
            document.dispatchEvent(new CustomEvent('pressstart', {
                detail: {
                    clientX: point.clientX,
                    clientY: point.clientY,
                }
            }))
        }, 500)
    }

    move(point, context) {
        let offsetX = point.clientX - context.startX
        let offsetY = point.clientY - context.startY
        if (context.action !== 'pan' && offsetX ** 2 + offsetY ** 2 > 100) {
            if (context.action === 'press') {
                document.dispatchEvent(new CustomEvent('presscancel'))
            }
            context.action = 'pan'
            document.dispatchEvent(new CustomEvent('panstart', {
                detail: {
                    startX: context.startX,
                    startY: context.startY,
                    clientX: point.clientX,
                    clientY: point.clientY,
                }
            }))
        }
        if (context.action === 'pan') {
            context.moves.push({
                clientX: point.clientX,
                clientY: point.clientY,
                time: Date.now(),
            })
            context.moves = context.moves.filter(move => Date.now() - move.time < 300)
            document.dispatchEvent(new CustomEvent('panmove', {
                detail: {
                    startX: context.startX,
                    startY: context.startY,
                    clientX: point.clientX,
                    clientY: point.clientY,
                }
            }))
        }
    }

    end(point, context) {
        clearTimeout(context.timeoutHandler)
        if (context.action === 'tap') {
            document.dispatchEvent(new CustomEvent('tap', {
                detail: {
                    clientX: point.clientX,
                    clientY: point.clientY,
                }
            }))
        } else if (context.action === 'press') {
            document.dispatchEvent(new CustomEvent('pressend', {
                detail: {
                    clientX: point.clientX,
                    clientY: point.clientY,
                }
            }))
        } else if (context.action === 'pan') {
            let move = context.moves[0]
            let speed = Math.sqrt((point.clientX - move.clientX) ** 2 + (point.clientY - move.clientY) ** 2) / (Date.now() - move.time)
            let isSwipe = speed > 1.5
            document.dispatchEvent(new CustomEvent('panend', {
                detail: {
                    startX: context.startX,
                    startY: context.startY,
                    clientX: point.clientX,
                    clientY: point.clientY,
                    speed: speed,
                    isSwipe: isSwipe,
                }
            }))
            if (isSwipe) {
                document.dispatchEvent(new CustomEvent('swipe', {
                    detail: {
                        startX: context.startX,
                        startY: context.startY,
                        clientX: point.clientX,
                        clientY: point.clientY,
                        speed: speed,
                    }
                }))
            }
        }
    }

    cancel(point, context) {
        clearTimeout(context.timeoutHandler)
        document.dispatchEvent(new CustomEvent('cancel', {
            detail: {
                clientX: point.clientX,
                clientY: point.clientY,
            }
        }))
    }
}


new Gesture()
