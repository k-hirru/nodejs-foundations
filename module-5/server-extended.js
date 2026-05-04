const http = require("http");

const server = http.createServer((req, res) => {
  console.log(`${req.method} ${req.url}`);

  if (req.url === "/" && req.method === "GET") {
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ message: "Hello from Node.js!" }));
    return;
  }

  if (req.url === "/health" && req.method === "GET") {
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ status: "ok" }));
    return;
  }

  if (req.url === "/users" && req.method === "GET") {
    const users = [
      { id: 1, name: "Ana" },
      { id: 2, name: "Bruno" },
    ];
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify(users));
    return;
  }

  if (req.url === "/about" && req.method === "GET") {
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ name: 'My First Server', version: '1.0.0' }));
    return;
  }

  if (req.url === "/time" && req.method === "GET") {
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ now: new Date().toISOString() }));
    return;
  }

if (req.url.startsWith("/echo") && req.method === "GET") {
    const url = new URL(req.url, `http://${req.headers.host}`);
    const message = url.searchParams.get('message');
    
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ echo: message }));
    return;
}

  res.writeHead(404, { "Content-Type": "application/json" });
  res.end(JSON.stringify({ error: "Not found" }));
});

const PORT = 3005;
server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
