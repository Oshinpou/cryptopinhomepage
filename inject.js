// Load and Initialize WASM Module
async function initWasm() {
  const wasm = await import("./wasm_code.js"); // Adjust the path if needed

  // DOM Elements
  const registerBtn = document.getElementById("register-btn");
  const loginBtn = document.getElementById("login-btn");
  const searchBtn = document.getElementById("search-btn");
  const deleteBtn = document.getElementById("delete-btn");

  // Register User
  registerBtn.addEventListener("click", () => {
    const username = document.getElementById("reg-username").value;
    const email = document.getElementById("reg-email").value;
    const password = document.getElementById("reg-password").value;
    const result = wasm.register_user(username, email, password);
    alert(result);
  });

  // Login User
  loginBtn.addEventListener("click", () => {
    const username = document.getElementById("login-username").value;
    const password = document.getElementById("login-password").value;
    const result = wasm.login_user(username, password);
    alert(result);
  });

  // Search User Profile
  searchBtn.addEventListener("click", () => {
    const searchUser = document.getElementById("search-username").value;
    const userInfo = wasm.get_user_info(searchUser);
    if (userInfo) {
      const userData = JSON.parse(userInfo);
      alert(`User Found: \nUsername: ${userData.username}\nEmail: ${userData.email}`);
    } else {
      alert("User not found.");
    }
  });

  // Delete User
  deleteBtn.addEventListener("click", () => {
    const username = document.getElementById("delete-username").value;
    const result = wasm.delete_user(username);
    alert(result);
  });
}

// Initialize WebAssembly and Handle Errors
initWasm().catch(console.error);
