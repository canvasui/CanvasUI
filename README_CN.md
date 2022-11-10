# CanvasUI
`CanvasUI` 是一个基于 canvas 的 UI 工具包.

[English version](./README.md)


## 介绍
`CanvasUI` 将现代前端开发的关键技术基于 HTML 的 &lt;canvas&gt; 重新实现了一遍(不借助任何第三方库), 它包括了:
- 使用 XML 描述的 10 个常用的组件(例如: &lt;button&gt;, &lt;image&gt;, 甚至 &lt;input&gt;)
- Flex 布局以及常用的 CSS
- MVVM
- 开箱即用的脚手架和开发服务器(支持热重载)
<div style="text-align: center;">
    <img src="./readme.png" style="width: 700px;">
</div>


## 用法
1. 使用 `npx github:canvasui/canvasui project-name` 创建项目
2. 使用 vscode 打开项目根目录即可享受代码高亮
3. 在项目的根目录下运行 `npm run build` 启动开发服务器(同时也会将代码打包至 `/public` 目录)
4. 使用浏览器访问 `http://127.0.0.1:3000/`
5. 修改 `/src` 目录下的 `main.ui`, 浏览器将会实时更新修改(并同时打包至 `/public` 目录)


## 文档
### 代码结构
```html
<style>
.hello {
    font-size: 50px;
}
</style>

<template>
    <text class="hello" content="hello { name } !"></text>
</template>

<script>
return {
    data: {
        name: 'world',
    },
}
</script>
```

### 内置组件
<table>
    <tr><th>组件名</th><th>支持的属性</th><th>支持的CSS</th></tr>
    <tr><td>&lt;text&gt;</td><td>content</td><td>font-size, color</td></tr>
    <tr><td>&lt;image&gt;</td><td>path</td><td>width, height</td></tr>
    <tr><td>&lt;button&gt;</td><td>label, @click</td><td></td></tr>
    <tr><td>&lt;input&gt;</td><td>value, hint</td><td>width</td></tr>
    <tr><td>&lt;checkbox&gt;</td><td>value, label</td><td></td></tr>
    <tr><td>&lt;radio&gt;</td><td>value, label, option</td><td></td></tr>
    <tr><td>&lt;switch&gt;</td><td>value</td><td></td></tr>
    <tr><td>&lt;color&gt;</td><td>value</td><td></td></tr>
    <tr><td>&lt;slider&gt;</td><td>value</td><td>width</td></tr>
    <tr><td>&lt;select&gt;</td><td>value, options</td><td></td></tr>
</table>

### 一些说明
- 内置组件和容器
    - 标签都要有结束标签, 属性值要加双引号
    - 所有组件均支持 id 与 class 属性, 并可使用 CSS 选择器为其添加样式
    - &lt;input&gt; 支持的功能有:
        - 键盘输入字符, 删除字符, 左右移动光标
        - 鼠标位置插入光标
        - 鼠标拖放选择, 双击全选
        - 复制(command-c), 粘贴(command-c), 剪切(command-x), 全选(command-a)
    - 可以使用 &lt;div&gt; 作为容器, 但目前只支持单层嵌套(即不能在 &lt;div&gt; 中再嵌套一个 &lt;div&gt;)
- CSS
    - flex 作为默认且唯一的布局方式, 不需要再写 "display: flex;"
    - 支持的 flex 相关的属性有: justify-content, align-items, flex-direction, flex-wrap, align-content, flex-flow
    - 可以为 &lt;div&gt; 应用盒模型, 但目前支持的写法只有:
        - padding: length; (例如: padding: 5px;)
        - border: border-width border-style border-color; (例如: border: 1px solid black;)
        - margin: length; (例如: margin: 5px;)
    - 天然支持 border-box, 所以 width 包含 border 和 padding
    - CSS 选择器支持以 `A B` 的形式选择 A 的直接子代 B
- MVVM
    - 属性值可以是字面值, 也可以是形如 "{ xx }" 的变量
    - 所有的输入类组件(例如: &lt;input&gt;, &lt;checkbox&gt;, &lt;slider&gt;), 均可使用 value="{ variable }" 实现双向绑定


## 开发者说
我是 CanvasUI 的开发者, 我用了 13 天的时间开发了 CanvasUI, 目的是为了整全地了解前端开发的顶层设计和底层原理. 我目前正在寻找一份合适的工作, 如果您有合适的岗位(最好是远程工作), 欢迎发邮件至 zhilin7@qq.com.
