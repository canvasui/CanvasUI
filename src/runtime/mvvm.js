class Mvvm {
    constructor(component, config, reLayout) {
        this.component = component
        this.reLayout = reLayout
        this.proxyCallbackMap = new Map()
        this.currentProxyCallback = null
        // data
        this.vm = this.proxy(config.data)
        // methods
        for (let name in config.methods) {
            this.vm[name] = (new Function(config.methods[name].replace(`${name}()`, ''))).bind(this.vm)
        }
        this.traverse(this.component)
        this.reLayout()
    }

    proxy(object) {
        let self = this
        return new Proxy(object, {
            get(object, property) {
                if (typeof object[property] === 'object' && !Array.isArray(object[property])) {
                    return self.proxy(object[property])
                } else {
                    if (self.currentProxyCallback) {
                        if (!self.proxyCallbackMap.has(object)) {
                            self.proxyCallbackMap.set(object, new Map())
                        }
                        if (!self.proxyCallbackMap.get(object).has(property)) {
                            self.proxyCallbackMap.get(object).set(property, new Set())
                        }
                        self.proxyCallbackMap.get(object).get(property).add(self.currentProxyCallback)
                    }
                    return object[property]
                }
            },
            set(object, property, value) {
                object[property] = value
                let callbacks = self.proxyCallbackMap.get(object)?.get(property) ?? (new Set())
                for (let callback of callbacks) {
                    callback()
                }
                return true
            }
        })
    }

    registerProxyCallback(callback) {
        this.currentProxyCallback = callback
        callback()
        this.currentProxyCallback = null
    }

    traverse(component) {
        for (let [prop, value] of Object.entries(component.props)) {
            if (value.match(/{([\s\S]+)}/)) {
                let name = RegExp.$1.trim()
                this.registerProxyCallback(() => {
                    if (typeof this.vm[name] === 'function' || Array.isArray(this.vm[name])) {
                        component.props[prop] = this.vm[name]
                    } else {
                        component.props[prop] = value.replace(/{([\s\S]+)}/, this.vm[name])
                        if (prop === 'value') {
                            component.bind = name
                        }
                    }
                    component.setBox()
                    this.reLayout()
                })
            }
        }
        component.vm = this.vm
        component.setBox()
        for (let child of component.children) {
            this.traverse(child)
        }
    }
}
