#!/usr/bin/env python
# Inspired by  https://stackoverflow.com/a/25708957/51280
from http.server import SimpleHTTPRequestHandler
import socketserver

class MyHTTPRequestHandler(SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_my_headers()
        SimpleHTTPRequestHandler.end_headers(self)

    def send_my_headers(self):
        self.send_header("Cache-Control", "no-cache, no-store, must-revalidate")
        self.send_header("Pragma", "no-cache")
        self.send_header("Expires", "0")


if __name__ == '__main__':
    with socketserver.TCPServer(("", 8001), MyHTTPRequestHandler) as httpd:
        print("serving at port", 8001)
        httpd.serve_forever()

