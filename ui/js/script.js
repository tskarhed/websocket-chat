const messageInput = document.querySelector("#input");

const HOST = "playground.skarhed.com";

messageInput.addEventListener("keyup", (event) => {
  if (event.key === "Enter") {
    const message = event.target.value;
    event.target.value = "";
    sendMessage(message);
  }
});

/*!
 * Sanitize and encode all HTML in a user-submitted string
 * (c) 2018 Chris Ferdinandi, MIT License, https://gomakethings.com
 * @param  {String} str  The user-submitted string
 * @return {String} str  The sanitized string
 */
let sanitizeHTML = function (str) {
  var temp = document.createElement("div");
  temp.textContent = str;
  return temp.innerHTML;
};

let ws;

try {
  // Local dev
  if (["localhost", "127.0.0.1", ""].includes(location.hostname)) {
    ws = new WebSocket(`ws://localhost:3000`);
  } else {
    ws = new WebSocket(`wss://${HOST}`);
  }
} catch (e) {
  console.log("Web socket init error", e);
}

function sendMessage(message) {
  ws.send(JSON.stringify({ type: "message", payload: message }));
}

ws.onmessage = function ({ data }) {
  const messageContainer = document.querySelector("#messages");
  const clientsContainer = document.querySelector("#clients");

  try {
    data = JSON.parse(data);
    const { type, payload } = data;
    switch (type) {
      case "ping":
        console.log("ping received");
        return;
      case "clients":
        clientsContainer.innerHTML = `Connected clients: ${payload}`;
        return;
      case "message":
      default:
        const div = document.createElement("div");
        div.className = "message_container";
        div.innerHTML = `<span class="time">${new Date().toLocaleTimeString()}:</span> <span class="message">${sanitizeHTML(
          payload
        )}</span>`;
        messageContainer.prepend(div);
        return;
    }
  } catch (err) {
    console.log(err);
  }
};
