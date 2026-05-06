const style = document.createElement("link");

style.rel = "stylesheet";

style.href =
  "https://cdn.jsdelivr.net/gh/kazi2000/jelly-ai-sales-chatbot@main/widget/style.css";

document.head.appendChild(style);
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

// Inject Widget

document.body.insertAdjacentHTML(
  "beforeend",
  chatHTML
);

// Elements

const button = document.getElementById(
  "jelly-chat-button"
);

const box = document.getElementById(
  "jelly-chat-box"
);

const sendBtn = document.getElementById(
  "jelly-send-btn"
);

const inputField = document.getElementById(
  "jelly-chat-input"
);

// Toggle Widget

button.addEventListener("click", () => {
  box.classList.toggle("hidden");
});

// Send Message

sendBtn.addEventListener("click", async () => {

  const message = inputField.value.trim();

  if (!message) return;

  // Add User Message
  addMessage(message, "user");

  // Clear Input
  inputField.value = "";

  // Show Typing
  showTyping();

  try {

    const response = await fetch(
      "https://jelly-ai-sales-chatbot-1.onrender.com/api/chat",
      {
        method: "POST",

        headers: {
          "Content-Type": "application/json"
        },

        body: JSON.stringify({

          store_id:
            "b9bac8ff-c5e1-4591-bcf9-1b2a9263dbe9",

          conversation_id:
            "f777fd19-18c6-48d3-b2c6-80103e49b3af",

          message

        })
      }
    );

    const data = await response.json();

    setTimeout(() => {

      removeTyping();

      addMessage(
        data.reply ||
          "AI failed to respond",
        "bot"
      );

    }, 1200);

  } catch (error) {

    console.error(error);

    removeTyping();

    addMessage(
      "Something went wrong ⚠️",
      "bot"
    );

  }

});

// Enter Key Support

inputField.addEventListener(
  "keypress",
  (e) => {

    if (e.key === "Enter") {
      sendBtn.click();
    }

  }
);

// Add Message

function addMessage(message, sender) {

  const messages = document.getElementById(
    "jelly-chat-messages"
  );

  const div = document.createElement("div");

  div.className =
    sender === "user"
      ? "user-message"
      : "bot-message";

  div.innerText = message;

  messages.appendChild(div);

  messages.scrollTop =
    messages.scrollHeight;

}

// Typing State

function showTyping() {

  const messages = document.getElementById(
    "jelly-chat-messages"
  );

  const typing = document.createElement("div");

  typing.id = "typing";

  typing.className = "bot-message";

  typing.innerText = "Typing...";

  messages.appendChild(typing);

  messages.scrollTop =
    messages.scrollHeight;

}

// Remove Typing

function removeTyping() {

  const typing = document.getElementById(
    "typing"
  );

  if (typing) {
    typing.remove();
  }

}
