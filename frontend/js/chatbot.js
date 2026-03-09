// ===============================
// 🆔 STEP 1: ANONYMOUS USER ID
// ===============================
let userId = localStorage.getItem("userId");

if (!userId) {
  userId = "user_" + crypto.randomUUID();
  localStorage.setItem("userId", userId);
}

// ===============================
// 🌍 USER LOCATION (ON-DEMAND)
// ===============================
let userLocation = {
  lat: null,
  lon: null,
};

function detectLocation() {
  if (!navigator.geolocation) {
    console.warn("Geolocation not supported");
    return;
  }

  navigator.geolocation.getCurrentPosition(
    (pos) => {
      userLocation.lat = pos.coords.latitude;
      userLocation.lon = pos.coords.longitude;

      console.log("📍 Location detected:", userLocation);

      // Optional: show inside chatbot for demo
      appendMessage(
        "bot",
        `📍 Location enabled<br>Lat: ${userLocation.lat.toFixed(4)}, Lng: ${userLocation.lon.toFixed(4)}`
      );
    },
    (err) => {
      console.warn("⚠️ Location denied:", err.message);
      appendMessage(
        "bot",
        "⚠️ Location access denied. Personalization may be limited."
      );
    }
  );
}

// ===============================
// 🤖 TOGGLE CHATBOT
// ===============================
function toggleChatbot() {
  const chatbot = document.getElementById("chatbot-box");
  chatbot.classList.toggle("active");

  if (chatbot.classList.contains("active")) {
    chatbot.style.display = "flex";

    // 🔥 Trigger permission ONLY on user action
    if (!userLocation.lat) {
      detectLocation();
    }
  } else {
    setTimeout(() => {
      if (!chatbot.classList.contains("active")) {
        chatbot.style.display = "none";
      }
    }, 300);
  }
}

// ===============================
// 💬 APPEND MESSAGE
// ===============================
function appendMessage(sender, text) {
  const messages = document.getElementById("chatbot-messages");
  const div = document.createElement("div");
  div.className = sender === "user" ? "user-message" : "bot-message";
  div.innerHTML = text;
  messages.appendChild(div);
  messages.scrollTop = messages.scrollHeight;
}

// ===============================
// 🧠 LOCAL Q&A (FAST RESPONSES)
// ===============================
function getChatbotResponse(message) {
  message = message.toLowerCase();

  if (message.includes("website") || message.includes("about")) {
    return "🌍 <b>AI Powered Exploration Guide</b> helps users explore India through domain-based intelligent navigation.";
  }

  if (message.includes("categories") || message.includes("options")) {
    return "📚 Domains include Agriculture, Architecture, Art & Culture, Cuisines, Defence, Education, Forestry, Handlooms, History, Medicine, Ports, and Rivers.";
  }

  if (message.includes("location")) {
    if (userLocation.lat) {
      return `📍 Your location is enabled.<br>Lat: ${userLocation.lat.toFixed(
        4
      )}, Lng: ${userLocation.lon.toFixed(4)}`;
    } else {
      return "⚠️ Location not available yet. Please allow location access.";
    }
  }

  if (message.includes("help")) {
    return "🤖 I provide domain guidance, smart recommendations, and location-aware exploration support.";
  }

  return null;
}

// ===============================
// 🚀 SEND MESSAGE (API CALL)
// ===============================
async function sendMessage() {
  const input = document.getElementById("chatbot-input");
  const message = input.value.trim();
  if (!message) return;

  appendMessage("user", message);
  input.value = "";

  const localReply = getChatbotResponse(message);
  if (localReply) {
    appendMessage("bot", localReply);
    return;
  }

  try {
    const response = await fetch("https://exploration-guide.onrender.com/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        message,
        userId,
        lat: userLocation.lat,
        lon: userLocation.lon,
      }),
    });

    const data = await response.json();
    appendMessage("bot", data.reply || "🤖 No response received.");
  } catch (error) {
    console.error("Chatbot error:", error);
    appendMessage("bot", "⚠️ Unable to connect to server.");
  }
}
