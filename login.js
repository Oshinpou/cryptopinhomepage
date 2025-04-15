// PouchDB Setup
const db = new PouchDB('users');
const gun = Gun();

// Handle Login
document.getElementById('loginForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    
    db.find({ selector: { email: email } }).then(function(result) {
        if (result.docs.length === 0 || result.docs[0].password !== password) {
            showError('Invalid email or password');
        } else {
            localStorage.setItem('user', JSON.stringify(result.docs[0]));
            Toastify({
                text: "Login Successful!",
                duration: 3000,
                close: true,
                gravity: "top",
                position: "right",
                backgroundColor: "green",
            }).showToast();
            window.location.href = 'dashboard.html';
        }
    }).catch(function(err) {
        showError('Error logging in');
    });
});

// Handle Signup
document.getElementById('signupForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const username = document.getElementById('username').value;
    const email = document.getElementById('signupEmail').value;
    const password = document.getElementById('signupPassword').value;
    
    const newUser = { _id: email, username: username, email: email, password: password };
    
    db.put(newUser).then(function(response) {
        Toastify({
            text: "Signup Successful!",
            duration: 3000,
            close: true,
            gravity: "top",
            position: "right",
            backgroundColor: "green",
        }).showToast();
        window.location.href = 'login.html';
    }).catch(function(err) {
        showError('Error during signup');
    });
});

// Handle Reset Password
document.getElementById('resetForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const email = document.getElementById('resetEmail').value;

    db.find({ selector: { email: email } }).then(function(result) {
        if (result.docs.length === 0) {
            showError('Email not found');
        } else {
            // Send Reset Link (you can extend this with email functionality)
            Toastify({
                text: "Reset link sent!",
                duration: 3000,
                close: true,
                gravity: "top",
                position: "right",
                backgroundColor: "blue",
            }).showToast();
        }
    }).catch(function(err) {
        showError('Error sending reset link');
    });
});

// Error Handling
function showError(message) {
    Toastify({
        text: message,
        duration: 3000,
        close: true,
        gravity: "top",
        position: "center",
        backgroundColor: "red",
    }).showToast();
}

function loginSuccess() {
  Toastify({
    text: "Login Successful!",
    duration: 3000,
    close: true,
    gravity: "top", 
    position: "right", 
    backgroundColor: "green",
  }).showToast();
}

// Initialize PouchDB instance
const userDB = new PouchDB('users');
const remote = 'https://your-couchdb-url.com/users'; // Replace with your CouchDB URL

// Sync with remote CouchDB (optional for now)
userDB.sync(remote, { live: true, retry: true });

// Switch between forms (Login, Sign Up, Reset)
function switchForm(form) {
  document.getElementById("form-title").textContent = form.charAt(0).toUpperCase() + form.slice(1);
  
  // Hide all forms
  document.getElementById("login-form").classList.add("hidden");
  document.getElementById("signup-form").classList.add("hidden");
  document.getElementById("reset-form").classList.add("hidden");
  document.getElementById("delete-form").classList.add("hidden");

  // Show selected form
  document.getElementById(`${form}-form`).classList.remove("hidden");
  clearMessages();
}

// Clear output and error messages
function clearMessages() {
  document.getElementById("output").textContent = "";
  document.getElementById("error").textContent = "";
}

// Hashing (simple base64 for local use only, replace with SHA later)
function hash(text) {
  return btoa(text); // NOT secure, just for prototype. Replace with SHA later.
}

// Sign Up - Create a new account
async function signUp(username, email, password) {
  clearMessages();
  
  if (!username || !email || !password) {
    return showError("All fields are required");
  }

  try {
    const existing = await userDB.get(email);
    showError("User already exists.");
  } catch {
    const user = {
      _id: email,
      username,
      email,
      password: hash(password),
      created: new Date().toISOString()
    };
    await userDB.put(user);
    showMessage("Signup successful! Please login.");
    switchForm("login");
  }
}

// Login - Authenticate the user
async function login(email, password) {
  clearMessages();
  
  if (!email || !password) {
    return showError("All fields are required");
  }

  try {
    const user = await userDB.get(email);
    if (user.password === hash(password)) {
      localStorage.setItem("loggedInUser", JSON.stringify(user));
      showMessage("Login successful!");
      window.location.href = "dashboard.html";  // Redirect to dashboard
    } else {
      showError("Incorrect password.");
    }
  } catch {
    showError("User not found.");
  }
}

// Reset Password - Change password functionality
async function resetPassword(email, newPassword) {
  clearMessages();
  
  if (!email || !newPassword) {
    return showError("Email and New Password are required.");
  }

  try {
    const user = await userDB.get(email);
    user.password = hash(newPassword);
    await userDB.put(user);
    showMessage("Password reset successful.");
  } catch {
    showError("User not found.");
  }
}

// Delete Account - Remove the user account
async function deleteAccount(email, password) {
  clearMessages();
  
  if (!email || !password) {
    return showError("Email and Password are required.");
  }

  try {
    const user = await userDB.get(email);
    if (user.password === hash(password)) {
      await userDB.remove(user);
      showMessage("Account deleted.");
      localStorage.removeItem("loggedInUser");
    } else {
      showError("Incorrect password.");
    }
  } catch {
    showError("User not found.");
  }
}

// Show success messages
function showMessage(msg) {
  document.getElementById("output").textContent = msg;
}

// Show error messages
function showError(msg) {
  document.getElementById("error").textContent = msg;
}                     
