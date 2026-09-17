const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const root = path.resolve(__dirname, '..');
const types = { '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.svg': 'image/svg+xml', '.json': 'application/json' };
function createServer() {
    return http.createServer(function(request, response) {
        try {
            let pathname = decodeURIComponent(new URL(request.url, 'http://localhost').pathname);
            if (pathname === '/' || pathname === '/learn') { response.writeHead(302, { Location: '/learn/' }); response.end(); return; }
            if (pathname.startsWith('/learn/')) pathname = pathname.slice('/learn'.length);
            const filename = path.resolve(root, '.' + pathname + (pathname.endsWith('/') ? 'index.html' : ''));
            if (!filename.startsWith(root + path.sep)) { response.writeHead(403); response.end(); return; }
            fs.readFile(filename, function(error, data) {
                if (error) { response.writeHead(404); response.end('Not found'); return; }
                response.writeHead(200, { 'Content-Type': types[path.extname(filename)] || 'application/octet-stream', 'Cache-Control': 'no-cache' });
                response.end(data);
            });
        } catch { response.writeHead(400); response.end('Bad request'); }
    });
}
module.exports = { createServer };
if (require.main === module) {
    createServer().listen(4173, '127.0.0.1', function() { console.log('Learn: http://127.0.0.1:4173/learn/'); });
}
