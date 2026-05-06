const chatHTML = `
<div id="jelly-chat-widget">

  <div id="jelly-chat-button">
    💬
  </div>

  <div id="jelly-chat-box" class="hidden">

    <div id="jelly-chat-header">
      Jelly AI Assistant
    </div>

    <div id="jelly-chat-messages">
      <div class="bot-message">
        Hey 👋 How can I help you today?
      </div>
    </div>

    <div id="jelly-chat-input-area">
      <input
        type="text"
        id="jelly-chat-input"
        placeholder="Type your message..."
      />

      <button id="jelly-send-btn">
        Send
      </button>
    </div>

  </div>

</div>
`;

document.body.insertAdjacentHTML("beforeend", chatHTML);

const button = document.getElementById("jelly-chat-button");
const box = document.getElementById("jelly-chat-box");

button.addEventListener("click", () => {
  box.classList.toggle("hidden");
});

const sendBtn = document.getElementById("jelly-send-btn");

sendBtn.addEventListener("click", async () => {

  const input = document.getElementById("jelly-chat-input");

  const message = input.value;

  if (!message) return;

  addMessage(message, "user");

  input.value = "";

  showTyping();

  const response = await fetch(
    "https://jelly-ai-sales-chatbot-1.onrender.com/api/chat",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        store_id: "b9bac8ff-c5e1-4591-bcf9-1b2a9263dbe9",
        conversation_id: "f777fd19-18c6-48d3-b2c6-80103e49b3af",
        message
      })
    }
  );

  const data = await response.json();

  removeTyping();

  addMessage(data.reply, "bot");

});

function addMessage(message, sender) {

  const messages = document.getElementById("jelly-chat-messages");

  const div = document.createElement("div");

  div.className =
    sender === "user"
      ? "user-message"
      : "bot-message";

  div.innerText = message;

  messages.appendChild(div);

  messages.scrollTop = messages.scrollHeight;

}

function showTyping() {

  const messages = document.getElementById("jelly-chat-messages");

  const typing = document.createElement("div");

  typing.id = "typing";

  typing.className = "bot-message";

  typing.innerText = "Typing...";

  messages.appendChild(typing);

}

function removeTyping() {

  const typing = document.getElementById("typing");

  if (typing) {
    typing.remove();
  }

}
