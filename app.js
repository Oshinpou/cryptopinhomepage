function signUp() {
    const username = document.getElementById('signupUsername').value;
    const password = document.getElementById('signupPassword').value;
    localStorage.setItem(username, password);
    alert('Sign up successful!');
}

function login() {
    const username = document.getElementById('loginUsername').value;
    const password = document.getElementById('loginPassword').value;
    if (localStorage.getItem(username) === password) {
        localStorage.setItem('currentUser', username);
        window.location.href = 'dashboard.html';
    } else {
        alert('Invalid credentials!');
    }
}

function recoverPassword() {
    const username = prompt('Enter your username to recover password:');
    if (localStorage.getItem(username)) {
        alert(`Your password is: ${localStorage.getItem(username)}`);
    } else {
        alert('Username not found.');
    }
}

function deleteAccount() {
    const username = prompt('Enter your username to delete account:');
    if (localStorage.getItem(username)) {
        localStorage.removeItem(username);
        alert('Account deleted successfully.');
    } else {
        alert('Username not found.');
    }
}
