#!/usr/bin/env python3
# import http.server

# class MyHTTPRequestHandler(http.server.SimpleHTTPRequestHandler):
#     def end_headers(self):
#         self.send_my_headers()
#         http.server.SimpleHTTPRequestHandler.end_headers(self)

#     def send_my_headers(self):
#         self.send_header("Cache-Control", "no-cache, no-store, must-revalidate")
#         self.send_header("Pragma", "no-cache")
#         self.send_header("Expires", "0")


# if __name__ == '__main__':
#     http.server.test(HandlerClass=MyHTTPRequestHandler, port=8001)

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







# import http.server

# PORT = 8001

# class NoCacheHTTPRequestHandler(
#     http.server.SimpleHTTPRequestHandler
# ):
#     def send_response_only(self, code, message=None):
#         super().send_response_only(code, message)
#         self.send_header('Cache-Control', 'no-store, must-revalidate')
#         self.send_header('Expires', '0')

# if __name__ == '__main__':
#     http.server.test(
#         HandlerClass=NoCacheHTTPRequestHandler,
#         port=PORT
#     )