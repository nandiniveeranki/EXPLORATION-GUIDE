// Toggle chatbot open/close
function toggleChatbot() {
  const chatbot = document.getElementById("chatbot-box");
  chatbot.classList.toggle("active");

  if (!chatbot.classList.contains("active")) {
    setTimeout(() => {
      if (!chatbot.classList.contains("active")) {
        chatbot.style.display = "none";
      }
    }, 300); // match CSS transition
  } else {
    chatbot.style.display = "flex";
  }
}

// Append message to chat window
function appendMessage(sender, text) {
  const messages = document.getElementById("chatbot-messages");
  const div = document.createElement("div");
  div.className = sender === "user" ? "user-message" : "bot-message";
  div.innerHTML = text;
  messages.appendChild(div);
  messages.scrollTop = messages.scrollHeight;
}

// Local Q&A handler
function getChatbotResponse(message) {
  message = message.toLowerCase();
  let response = "";

  if (message.includes("website") || message.includes("about")) {
    response = "🌍 This is the <b>AI Powered Exploration Guide</b> – a platform that helps you explore different domains of India like Agriculture, Education, Medicine, History, and more!";
  } 
  else if (message.includes("categories") || message.includes("options")) {
    response = "📚 We have 12 categories: Agriculture, Architecture, Art & Culture, Cuisines, Defence, Education, Forestry, Handlooms, History, Medicine, Port, and Rivers.";
  } 
  else if (message.includes("what can you do") || message.includes("help")) {
    response = "🤖 I can:<br>- Answer queries about categories<br>- Save your search history<br>- Help you bookmark favorite places<br>- Make exploration fun 🚀!";
  } 
  else if (message.includes("useful") || message.includes("why")) {
    response = "✨ This guide is useful for students, researchers, and explorers who want structured knowledge about India’s resources, with AI-powered assistance.";
  } 
  else {
    return null; // let backend handle it
  }

  return response;
}

// Send user message + fetch bot reply
async function sendMessage() {
  const input = document.getElementById("chatbot-input");
  const message = input.value.trim();
  if (!message) return;

  appendMessage("user", message);
  input.value = "";

  // Try local Q&A first
  const localReply = getChatbotResponse(message);
  if (localReply) {
    appendMessage("bot", localReply);
    return;
  }

  // Otherwise, call backend
  try {
    const response = await fetch("http://localhost:5000/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message }),
    });

    const data = await response.json();
    appendMessage("bot", data.reply);
  } catch (error) {
    console.error("Chatbot error:", error);
    appendMessage("bot", "⚠️ Error connecting to chatbot server");
  }
}
