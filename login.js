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
