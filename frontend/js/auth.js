// js/auth.js

console.log("✅ auth.js loaded");

const signupForm = document.getElementById("signup-form");
console.log("signupForm:", signupForm);

if (signupForm) {
  signupForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    try {
      const res = await fetch("http://localhost:5000/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();

      if (res.ok) {
        alert("✅ Signup successful!");
        window.location.href = "login.html"; // redirect to login
      } else {
        alert("❌ Signup failed: " + data.message);
      }
    } catch (err) {
      alert("⚠️ Server error: " + err.message);
      console.error(err);
    }
  });
}

// Handle login form too (optional if you want both in same file)
const loginForm = document.getElementById("login-form");

if (loginForm) {
  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = document.getElementById("login-email").value;
    const password = document.getElementById("login-password").value;

    try {
      const res = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (res.ok) {
        alert("✅ Login successful!");
        localStorage.setItem("user", JSON.stringify(data.user));
        window.location.href = "index.html"; // redirect to homepage
      } else {
        alert("❌ Login failed: " + data.message);
      }
    } catch (err) {
      alert("⚠️ Server error: " + err.message);
      console.error(err);
    }
  });
}
