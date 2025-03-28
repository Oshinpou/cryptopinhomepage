window.onload = function () {
    const username = localStorage.getItem('currentUser');
    if (!username) {
        window.location.href = 'signuplogin.html';
    }
    document.getElementById('usernameDisplay').innerText = username;
};

function logout() {
    localStorage.removeItem('currentUser');
    window.location.href = 'signuplogin.html';
}
