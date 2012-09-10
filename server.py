#! /usr/bin/env python3

import os
import bottle

@bottle.route("/assets/<filename:path>")
def assets(filename):
    return bottle.static_file(filename, root="assets/assets")

@bottle.route("/")
def index():
    return bottle.static_file("index.html", root="site")

@bottle.route("/<filename:path>")
def pages(filename):
    if bottle.request.headers.get("X-PJAX"):
        root = "site/ajax"
    else:
        root = "site"
    return bottle.static_file(filename, root=root)

if __name__ == "__main__":
    bottle.run(host="0.0.0.0", port=int(os.environ.get("PORT", 8000)))

app = bottle.default_app()
