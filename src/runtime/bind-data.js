function bindData(component, style, script) {
    let rootComponent = component
    let proxyCallbackMap = new Map()
    let currentProxyCallback = null
    // data & methods
    function init(callback) {
        component.initQueue.push(callback)
    }
    let config = Object.entries(eval(`(function() {${script}})()`))
    let data = config.filter(item => typeof item[1] !== 'function')
    let methods = config.filter(item => typeof item[1] === 'function')
    let vm = proxy(Object.fromEntries(data))
    vm.component = component
    for (let method of methods) {
        let [_name, _body] = method
        with(vm) {
            vm[_name] = (...args) => {
                eval(`(${_body})(...args)`)
            }
        }
    }
    // 遍历 component 及其子组件, 收集依赖(对使用模板语法的 prop 注册回调函数)
    // 并绑定样式和设置盒模型
    traverse(rootComponent)

    function proxy(object) {
        return new Proxy(object, {
            get(object, property) {
                if (typeof object[property] === 'object' && !Array.isArray(object[property])) {
                    return proxy(object[property])
                } else {
                    if (currentProxyCallback) {
                        if (!proxyCallbackMap.has(object)) {
                            proxyCallbackMap.set(object, new Map())
                        }
                        if (!proxyCallbackMap.get(object).has(property)) {
                            proxyCallbackMap.get(object).set(property, new Set())
                        }
                        proxyCallbackMap.get(object).get(property).add(currentProxyCallback)
                    }
                    return object[property]
                }
            },
            set(object, property, value) {
                object[property] = value
                let callbacks = proxyCallbackMap.get(object)?.get(property) ?? (new Set())
                for (let callback of callbacks) {
                    callback()
                }
                return true
            }
        })
    }

    function registerProxyCallback(callback) {
        currentProxyCallback = callback
        callback(true)
        currentProxyCallback = null
    }

    function traverse(component) {
        for (let [prop, value] of Object.entries(component.props)) {
            if (value.match(/{([\s\S]+)}/)) {
                let name = RegExp.$1.trim()
                registerProxyCallback((registering) => {
                    // registering 用于标记当前是正在收集依赖还是真正触发了改动
                    // 有些操作必须是真正触发了改动了才会执行, 并不会在收集依赖的时候就执行
                    if (typeof vm[name] === 'function' || Array.isArray(vm[name])) {
                        component.props[prop] = vm[name]
                    } else {
                        component.props[prop] = value.replace(/{([\s\S]+)}/, vm[name])
                        if (prop === 'value') {
                            // 对于特殊的 input 类的组件, 当 UI 操作使其发生变化的时候, 也将相应的变化流向 vm
                            // 此处存下所绑定的变量名, 在组件中即可使用 this.vm[this.bind] = this.value 的方式传递数据
                            component.bind = name
                        }
                    }
                    // 在属性发生改变的时候 重新绑定样式 / 重新设置盒模型 / 重新排版
                    bindStyle(component, style)
                    component.setBox()
                    if (!registering) {
                        // 真正触发改动的时候才发生重排
                        layout(rootComponent, true)
                    }
                })
            }
        }
        component.vm = vm
        bindStyle(component, style)
        component.setBox()
        for (let child of component.children) {
            traverse(child)
        }
    }
}
