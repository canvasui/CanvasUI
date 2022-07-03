const fs = require('fs')
const path = require('path')
const http = require('http')
const compile = require('../compiler/compile')


function load(response) {
    // build
    let componentJson = {}
    function build(directory) {
        let files = fs.readdirSync(directory)
        for (let file of files) {
            let filePath = `${directory}/${file}`
            if (fs.lstatSync(filePath).isDirectory()) {
                build(filePath)
            } else if (path.extname(file) === '.ui') {
                let sourceCode = fs.readFileSync(`${directory}/${file}`, 'utf8')
                componentJson[path.basename(file, '.ui')] = compile(sourceCode)
            }
        }
    }
    build(path.join(__dirname, '../src'))
    let main = `let componentJson = ${JSON.stringify(componentJson, (key, value) => {
        if (typeof value === 'function') {
            return value.toString()
        } else {
            return value
        }
    }, 4)}; main();`
    fs.writeFileSync(path.join(__dirname, '../public/main.js'), main)
    // hotReload
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
    let data = fs.readFileSync(path.join(__dirname, '../public/index.html'), 'utf8') + hotReload
    // send response
    response.writeHead(200, { 'Content-Type': 'text/html' })
    response.end(data)
}


function runServer() {
    let fileChanged = false
    fs.watch(path.join(__dirname, '../src'), { recursive: true }, () => {
        fileChanged = true
    })

    http.createServer((request, response) => {
        try {
            let url = request.url
            if (url === '/') {
                load(response)
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
        } catch {
            response.end()
        }
    }).listen(3000)
    console.log('server running at http://127.0.0.1:3000/')
}


runServer()
