console.log("✅ feedback.js loaded");

const feedbackForm = document.getElementById("feedbackForm");

if (feedbackForm) {
  feedbackForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const message = document.getElementById("message").value;
    const user = JSON.parse(localStorage.getItem("user"));
    const userId = user ? user._id : null;

    const emailInput = document.getElementById("email");
    const email = emailInput ? emailInput.value : null;

    if (!userId && !email) {
      alert("⚠️ Please login or provide email.");
      return;
    }

    try {
      const res = await fetch("http://localhost:5000/api/feedback", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId, email, feedbackText: message }),
      });

      const data = await res.json();

      if (res.ok) {
        alert("✅ Feedback submitted!");
        feedbackForm.reset();
        window.location.href = "index.html";
      } else {
        alert("❌ Failed to submit: " + data.error);
      }
    } catch (err) {
      alert("⚠️ Server error: " + err.message);
      console.error("Feedback error:", err);
    }
  });
} else {
  console.error("❌ feedbackForm not found!");
}
