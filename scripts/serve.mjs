import { createReadStream } from 'node:fs'
import { stat } from 'node:fs/promises'
import { createServer } from 'node:http'
import { extname, resolve, sep } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = fileURLToPath(new URL('../dist/', import.meta.url))
const base = process.env.SLIDEV_BASE || '/'
const port = Number(process.env.SLIDEV_PORT || 3030)
const mime = {
  '.css': 'text/css; charset=utf-8',
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
  '.woff2': 'font/woff2',
  '.woff': 'font/woff',
  '.pdf': 'application/pdf',
}

createServer(async (request, response) => {
  try {
    const pathname = decodeURIComponent(new URL(request.url, 'http://localhost').pathname)
    const name = pathname.startsWith(base) ? pathname.slice(base.length) : null
    if (name === null) {
      response.writeHead(404).end()
      return
    }
    const file = resolve(root, name || 'index.html')
    if (!file.startsWith(resolve(root) + sep) || !(await stat(file)).isFile()) {
      response.writeHead(404).end()
      return
    }
    response.writeHead(200, {
      'Content-Type': mime[extname(file)] || 'application/octet-stream',
      'Cache-Control': 'no-cache',
    })
    const body = createReadStream(file)
    body.on('error', () => response.destroy())
    body.pipe(response)
  } catch {
    response.writeHead(404).end()
  }
}).listen(port, '127.0.0.1', () => console.log(`Slidev deck at http://127.0.0.1:${port}${base}`))
