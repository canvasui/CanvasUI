const fs = require('fs')
const path = require('path')
const http = require('http')
const Compiler = require('../compiler/compiler')


function build() {
    let components = {}
    let files = fs.readdirSync(path.join(__dirname, '../src'))
    for (let file of files) {
        if (path.extname(file) === '.ui') {
            let sourceCode = fs.readFileSync(path.join(__dirname, `../src/${file}`), 'utf8')
            components[path.basename(file).slice(0, -3)] = new Compiler(sourceCode).compile()
        }
    }
    let main = `let components = ${JSON.stringify(components, (key, value) => {
        if (typeof value === 'function') {
            return value.toString()
        } else {
            return value
        }
    }, 4)}; main();`
    fs.writeFileSync(path.join(__dirname, '../public/main.js'), main)
}


function runServer() {
    let fileChanged = false
    fs.watch(path.join(__dirname, '../src'), () => {
        fileChanged = true
    })

    let hotReload = `
    <script>
    let eventSource = new EventSource('http://127.0.0.1:3000/reload')
    eventSource.onmessage = function(event) {
        if (event.data === 'reload') {
            location.reload()
        }
    }
    </script>
    `

    http.createServer((request, response) => {
        let url = request.url
        if (url === '/') {
            build()
            let data = fs.readFileSync(path.join(__dirname, '../public/index.html'), 'utf8') + hotReload
            response.writeHead(200, { 'Content-Type': 'text/html' })
            response.end(data)
        } else if (url === '/reload') {
            response.writeHead(200, {
                'Content-Type': 'text/event-stream',
                'Connection': 'keep-alive',
                'Cache-Control': 'no-cache'
            })
            if (fileChanged) {
                fileChanged = false
                response.end('data: reload\n\n')
            } else {
                response.end()
            }
        } else {
            let type = {
                js: 'application/javascript',
                jpg: 'image/jpeg',
                png: 'image/png',
            }[path.extname(url).slice(1)]
            if (type !== undefined) {
                let data = fs.readFileSync(path.join(__dirname, `../public${url}`))
                response.writeHead(200, { 'Content-Type': type })
                response.end(data)    
            }
        }
    }).listen(3000)
    console.log('server running at http://127.0.0.1:3000/')
}


runServer()
