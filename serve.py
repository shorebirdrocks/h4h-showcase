#!/usr/bin/env python3
"""
Simple local development server for the recreated Hack4Her website.
Supports clean URLs (e.g. /about, /schedule, /workshops) as well as static assets.
"""

import http.server
import os
import sys

PORT = int(sys.argv[1]) if len(sys.argv) > 1 else 8000
DIRECTORY = os.path.dirname(os.path.abspath(__file__))

class CleanURLHandler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=DIRECTORY, **kwargs)

    def do_GET(self):
        clean_path = self.path.split('?')[0].split('#')[0]
        
        # If route has no extension and is not root, check for .html or /index.html
        if clean_path != '/' and not os.path.exists(os.path.join(DIRECTORY, clean_path.lstrip('/'))):
            if os.path.exists(os.path.join(DIRECTORY, clean_path.lstrip('/') + '.html')):
                self.path = clean_path + '.html'
            elif os.path.exists(os.path.join(DIRECTORY, clean_path.lstrip('/'), 'index.html')):
                self.path = clean_path + '/index.html'
                
        return super().do_GET()

if __name__ == '__main__':
    server_address = ('', PORT)
    httpd = http.server.ThreadingHTTPServer(server_address, CleanURLHandler)
    print(f"Hack4Her website serving at: http://localhost:{PORT}")
    print("Press Ctrl+C to stop.")
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        print("\nShutting down server.")
        httpd.server_close()
