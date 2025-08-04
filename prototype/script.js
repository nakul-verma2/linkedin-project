/* ------------------------------------------------------------------
   LinkedIn-clone  –  script.js  (FINAL, error-free version)
-------------------------------------------------------------------*/

/* ========== GLOBALS ========== */
let currentUser   = null;
let isLoginMode   = true;                   // default screen = Login
const API_BASE    = "http://localhost:5000";

/* ========== INITIALISATION ========== */
document.addEventListener("DOMContentLoaded", () => {
  // Remove hidden-field requirements on first load (prevents browser error)
  document.getElementById("name").removeAttribute("required");
  document.getElementById("bio").removeAttribute("required");

  setupEventListeners();
  checkAuthState();
});

/* ========== EVENT SETUP ========== */
function setupEventListeners() {
  document.getElementById("authForm").addEventListener("submit", handleAuth);
  document.getElementById("postForm").addEventListener("submit", handleCreatePost);
}

/* ========== AUTH STATE ========== */
function checkAuthState() {
  const savedUser = localStorage.getItem("currentUser");
  if (savedUser) {
    currentUser = JSON.parse(savedUser);
    showMainContent();
    loadPosts();
  } else {
    showAuthSection();
  }
}

/* ========== VIEW HELPERS ========== */
function showAuthSection() {
  document.getElementById("authSection").style.display  = "flex";
  document.getElementById("mainContent").style.display  = "none";
}

function showMainContent() {
  document.getElementById("authSection").style.display  = "none";
  document.getElementById("mainContent").style.display  = "block";
  showHome();
}

/* ========== LOGIN / REGISTER TOGGLE ========== */
function toggleAuth() {
  isLoginMode = !isLoginMode;

  const title      = document.getElementById("authTitle");
  const button     = document.getElementById("authButton");
  const switchText = document.getElementById("authSwitchText");
  const switchLink = document.getElementById("authSwitchLink");
  const nameField  = document.getElementById("nameField");
  const bioField   = document.getElementById("bioField");
  const nameInput  = document.getElementById("name");
  const bioInput   = document.getElementById("bio");

  if (isLoginMode) {
    // ----- LOGIN VIEW -----
    title.textContent          = "Login";
    button.textContent         = "Login";
    switchText.textContent     = "Don't have an account?";
    switchLink.textContent     = "Register";
    nameField.style.display    = "none";
    bioField.style.display     = "none";
    nameInput.removeAttribute("required");
    bioInput.removeAttribute("required");
  } else {
    // ----- REGISTER VIEW -----
    title.textContent          = "Register";
    button.textContent         = "Register";
    switchText.textContent     = "Already have an account?";
    switchLink.textContent     = "Login";
    nameField.style.display    = "block";
    bioField.style.display     = "block";
    nameInput.setAttribute("required", "");
    // bio remains optional
  }
}

/* ========== LOGIN / REGISTER HANDLER ========== */
async function handleAuth(e) {
  e.preventDefault();

  const email    = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();
  const name     = document.getElementById("name").value.trim();
  const bio      = document.getElementById("bio").value.trim();

  /* ---- VALIDATION ---- */
  if (!email || !password) {
    showMessage("Email and password are required", "error");
    return;
  }
  if (!isLoginMode && !name) {
    showMessage("Name is required for registration", "error");
    return;
  }

  /* ---- LOGIN ---- */
  if (isLoginMode) {
    try {
      const res  = await fetch(`${API_BASE}/login`, {
        method  : "POST",
        headers : { "Content-Type": "application/json" },
        body    : JSON.stringify({ email, password })
      });
      const data = await res.json();
      if (data.success) {
        currentUser = { ...data.user };
        localStorage.setItem("currentUser", JSON.stringify(currentUser));
        showMessage("Login successful!", "success");
        showMainContent();
        loadPosts();
      } else {
        showMessage(data.error || "Login failed", "error");
      }
    } catch (err) {
      showMessage("Network error during login", "error");
    }
    return;
  }

  /* ---- REGISTER ---- */
  try {
    const res  = await fetch(`${API_BASE}/register`, {
      method  : "POST",
      headers : { "Content-Type": "application/json" },
      body    : JSON.stringify({ email, password, name, bio })
    });
    const data = await res.json();
    if (data.success) {
      currentUser = { uid: data.uid, email, name, bio };
      localStorage.setItem("currentUser", JSON.stringify(currentUser));
      showMessage("Registration successful!", "success");
      showMainContent();
      loadPosts();
    } else {
      showMessage(data.error || "Registration failed", "error");
    }
  } catch (err) {
    showMessage("Network error during registration", "error");
  }
}

/* ========== POST CREATION ========== */
async function handleCreatePost(e) {
  e.preventDefault();
  const content = document.getElementById("postContent").value.trim();
  if (!content) {
    showMessage("Please enter some content", "error");
    return;
  }
  try {
    const res  = await fetch(`${API_BASE}/posts`, {
      method  : "POST",
      headers : { "Content-Type": "application/json" },
      body    : JSON.stringify({ uid: currentUser.uid, content })
    });
    const data = await res.json();
    if (data.success) {
      document.getElementById("postContent").value = "";
      showMessage("Post created successfully!", "success");
      loadPosts();
    } else {
      showMessage(data.error || "Could not create post", "error");
    }
  } catch (err) {
    showMessage("Network error while posting", "error");
  }
}

/* ========== FEED ========== */
async function loadPosts() {
  try {
    const res  = await fetch(`${API_BASE}/posts`);
    const data = await res.json();
    if (data.success) displayPosts(data.posts);
    else showMessage("Failed to load posts", "error");
  } catch (err) {
    showMessage("Network error while loading posts", "error");
  }
}

function displayPosts(posts = []) {
  const c = document.getElementById("postsContainer");
  c.innerHTML = posts.length
    ? posts
        .map(
          p => `
        <div class="post">
          <div class="post-header">
            <span class="post-author" style="cursor:pointer; color: #0073b1; text-decoration: underline;"onclick="showUserProfile('${p.uid}')">${p.author_name}</span>

            <span class="post-time">${formatDate(p.timestamp)}</span>
          </div>
          <div class="post-content">${p.content}</div>
        </div>`
        )
        .join("")
    : '<p class="loading">No posts yet. Be the first to post!</p>';
}

function formatDate(t) {
  const d = new Date(t);
  return `${d.toLocaleDateString()} ${d.toLocaleTimeString()}`;
}

/* ========== PROFILE ========== */
function showHome() {
  document.getElementById("homeSection").style.display    = "block";
  document.getElementById("profileSection").style.display = "none";
  loadPosts();
}

function showProfile() {
  document.getElementById("homeSection").style.display    = "none";
  document.getElementById("profileSection").style.display = "block";
  loadProfile();
}

async function loadProfile() {
  const info  = document.getElementById("profileInfo");
  const posts = document.getElementById("userPosts");
  info.innerHTML = `
    <h2>${currentUser.name}</h2>
    <p><strong>Email:</strong> ${currentUser.email}</p>
    <p><strong>Bio:</strong> ${currentUser.bio || "No bio provided"}</p>`;

  try {
    const res  = await fetch(`${API_BASE}/user/${currentUser.uid}/posts`);
    const data = await res.json();
    posts.innerHTML = data.success && data.posts.length
      ? `<h3>Your Posts</h3>` +
        data.posts
          .map(
            p => `
        <div class="post">
          <div class="post-header">
            <span class="post-time">${formatDate(p.timestamp)}</span>
          </div>
          <div class="post-content">${p.content}</div>
        </div>`
          )
          .join("")
      : '<p class="loading">You haven\'t posted anything yet.</p>';
  } catch {
    posts.innerHTML = '<p class="error">Failed to load your posts</p>';
  }
}

/* ========== LOGOUT ========== */
function logout() {
  localStorage.removeItem("currentUser");
  currentUser = null;
  showAuthSection();
  document.getElementById("authForm").reset();
  document.getElementById("postForm").reset();
}

/* ========== MESSAGES ========== */
function showMessage(msg, type) {
  document.querySelectorAll(".success, .error").forEach(n => n.remove());
  const div = document.createElement("div");
  div.className = type;
  div.textContent = msg;
  const target =
    document.getElementById("authSection").style.display !== "none"
      ? document.querySelector(".auth-form")
      : document.querySelector(".main-content");
  target.prepend(div);
  setTimeout(() => div.remove(), 5000);
}

// Show other user's profile
function showUserProfile(uid) {
  // Hide home, show profile
  document.getElementById("homeSection").style.display    = "none";
  document.getElementById("profileSection").style.display = "block";
  loadOtherProfile(uid);
}

async function loadOtherProfile(uid) {
  const info  = document.getElementById("profileInfo");
  const posts = document.getElementById("userPosts");
  info.innerHTML = '<p>Loading profile...</p>';
  posts.innerHTML = '';

  try {
    // Get user info
    const res1  = await fetch(`${API_BASE}/user/${uid}`);
    const data1 = await res1.json();
    if (!data1.success) {
      info.innerHTML = '<p class="error">User not found</p>';
      return;
    }
    const user = data1.user;

    // Show user info
    info.innerHTML = `
      <h2>${user.name}</h2>
      <p><strong>Email:</strong> ${user.email}</p>
      <p><strong>Bio:</strong> ${user.bio || "No bio provided"}</p>`;

    // Get user posts
    const res2  = await fetch(`${API_BASE}/user/${uid}/posts`);
    const data2 = await res2.json();
    posts.innerHTML = data2.success && data2.posts.length
      ? `<h3>${user.name}'s Posts</h3>` +
        data2.posts
          .map(
            p => `
        <div class="post">
          <div class="post-header">
            <span class="post-time">${formatDate(p.timestamp)}</span>
          </div>
          <div class="post-content">${p.content}</div>
        </div>`
          )
          .join("")
      : `<p class="loading">${user.name} hasn't posted anything yet.</p>`;
  } catch (e) {
    info.innerHTML = '<p class="error">Failed to load profile.</p>';
  }
}
