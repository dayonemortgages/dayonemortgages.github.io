#!/usr/bin/env python3
"""Local preview server that serves the custom 404 page for missing files."""

from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
import argparse
from ipaddress import ip_address


class Custom404Handler(SimpleHTTPRequestHandler):
    def _should_disable_cache(self):
        host = self.headers.get("Host", "").split(":", 1)[0].lower()
        if host in {"localhost", "::1"}:
            return True

        try:
            return ip_address(host).is_loopback
        except ValueError:
            pass

        client_ip = self.client_address[0] if self.client_address else ""
        try:
            return ip_address(client_ip).is_loopback
        except ValueError:
            return False

    def send_response(self, code, message=None):
        super().send_response(code, message)
        if self._should_disable_cache():
            self.send_header("Cache-Control", "no-store, no-cache, must-revalidate, max-age=0")
            self.send_header("Pragma", "no-cache")
            self.send_header("Expires", "0")

    def send_error(self, code, message=None, explain=None):
        if code == 404:
            page = Path(self.directory) / "404.html"
            if page.is_file():
                body = page.read_bytes()
                self.send_response(404, message or "Not Found")
                self.send_header("Content-Type", "text/html; charset=utf-8")
                self.send_header("Content-Length", str(len(body)))
                self.end_headers()
                self.wfile.write(body)
                return

        super().send_error(code, message, explain)


def main():
    parser = argparse.ArgumentParser(description="Serve the static site locally.")
    parser.add_argument("port", nargs="?", default=4173, type=int)
    parser.add_argument("--host", default="127.0.0.1")
    args = parser.parse_args()

    server = ThreadingHTTPServer((args.host, args.port), Custom404Handler)
    print(f"Serving at http://{args.host}:{args.port}/")
    server.serve_forever()


if __name__ == "__main__":
    main()
