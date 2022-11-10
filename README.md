# CanvasUI
`CanvasUI` is a canvas-based UI framework.


## Introduction
`CanvasUI` <strong>re-implements</strong> key technologies of modern front-end development. It is based on HTML &lt;canvas&gt;, just using Vanilla JS, no external dependency, it contains:
- Declarative tags (e.g. &lt;button&gt;, &lt;image&gt;, and even &lt;input&gt;)
- Layout engine that supports Flex
- Commonly used CSS
- MVVM
- Timeline and Animation
- Mobile-compatible gestures
- Scaffolding out of the box and development server that supports hot reload


## Usage
1. Create a project with `npx github:canvasui/canvasui project-name`
2. Use vscode to open the project root directory to enjoy code highlighting
3. Run `npm run build` in the root directory of the project to start the development server (the code will also be packaged into the `/public` directory)
4. Use a browser to visit `http://127.0.0.1:3000/`
5. Modify `main.ui` in the `/src` directory, the browser will update and modify in real time (and package it to the `/public` directory at the same time)


## Sample code
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


## Built-in components
<table>
    <tr><th>component name</th><th>supported props</th><th>supported CSS</th></tr>
    <tr><td>&lt;button&gt;</td><td>label, @click</td><td></td></tr>
    <tr><td>&lt;checkbox&gt;</td><td>value, label</td><td></td></tr>
    <tr><td>&lt;color&gt;</td><td>value</td><td></td></tr>
    <tr><td>&lt;div&gt;</td><td></td><td>width, height, padding, margin, border, border-radius, background</td></tr>
    <tr><td>&lt;image&gt;</td><td>path</td><td>width, height, border-radius</td></tr>
    <tr><td>&lt;input&gt;</td><td>value, hint</td><td>width</td></tr>
    <tr><td>&lt;radio&gt;</td><td>value, label, option</td><td></td></tr>
    <tr><td>&lt;select&gt;</td><td>value, options</td><td></td></tr>
    <tr><td>&lt;slider&gt;</td><td>value</td><td>width</td></tr>
    <tr><td>&lt;switch&gt;</td><td>value</td><td></td></tr>
    <tr><td>&lt;template&gt;</td><td></td><td>width, height</td></tr>
    <tr><td>&lt;text&gt;</td><td>content</td><td>font-size, color</td></tr>
</table>
