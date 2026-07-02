#!/usr/bin/env python3
"""Accepts POST /shot?name=foo with a data-URL body; writes PNG to shots/."""
import base64, os, sys
from http.server import BaseHTTPRequestHandler, HTTPServer
from urllib.parse import urlparse, parse_qs

OUT = sys.argv[1] if len(sys.argv) > 1 else 'shots'
os.makedirs(OUT, exist_ok=True)

class H(BaseHTTPRequestHandler):
    def log_message(self, *a): pass
    def _cors(self):
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', '*')
    def do_OPTIONS(self):
        self.send_response(204); self._cors(); self.end_headers()
    def do_POST(self):
        q = parse_qs(urlparse(self.path).query)
        name = (q.get('name', ['shot'])[0]).replace('/', '_').replace('..', '_')
        n = int(self.headers.get('Content-Length', 0))
        body = self.rfile.read(n).decode()
        if ',' in body: body = body.split(',', 1)[1]
        path = os.path.join(OUT, name + '.png')
        with open(path, 'wb') as f: f.write(base64.b64decode(body))
        self.send_response(200); self._cors(); self.end_headers()
        self.wfile.write(path.encode())

HTTPServer(('127.0.0.1', 8472), H).serve_forever()
