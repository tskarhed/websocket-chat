const express = require("express");
const app = express();
const port = 3000;

const WebSocketServer = require("ws").Server;
const server = require("http").createServer(app);
const wss = new WebSocketServer({ server });

// Serve js files
app.use("/js", express.static(path.join(__dirname, "ui/js/")));
// Serve css files
app.use("/css", express.static(path.join(__dirname, "ui/css/")));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname + "/ui/html/index.html"));
});

app.get("/test", (req, res) => {
  res.set("X-Custom-header", "I'm a teapot damnit!");
  res.status(418);
  return res.send("Hello");
});

let clientCounter = 0;

wss.broadcast = function broadcast(data) {
  wss.clients.forEach((client) => {
    if (client.readyState === client.OPEN) {
      try {
        ws.send(JSON.stringify(data));
      } catch (err) {
        console.log(err);
      }
    }
  });
};

wss.on("connection", function connection(ws) {
  console.log("client connections: ", ++clientCounter);
  wss.broadcast({ type: "clients", payload: clientCounter });
  ws.on("message", function incoming(message) {
    wss.broadcast({ type: "message", payload: message });
  });

  ws.on("close", function close() {
    console.log("client connections: ", --clientCounter);
    wss.broadcast({ type: "clients", payload: clientCounter });
  });

  ws.on("error", function error() {
    console.log("error");
    wss.broadcast({ type: "clients", payload: clientCounter });
  });
});

const pingPayload = JSON.stringify({ type: "ping" });

//Keep connection alive
let pingInterval = setInterval(() => {
  wss.broadcast(pingPayload);
}, 5000);

server.listen(port, () =>
  console.log(`Example app listening at http://localhost:${port}`)
);
