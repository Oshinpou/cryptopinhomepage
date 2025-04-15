// login.js

const db = new PouchDB('cryptopin'); const gun = Gun();

function switchForm(form) { document.getElementById('signup-form').classList.add('hidden'); document.getElementById('login-form').classList.add('hidden'); document.getElementById('reset-form').classList.add('hidden'); document.getElementById('delete-form').classList.add('hidden'); document.getElementById(${form}-form).classList.remove('hidden'); document.getElementById('output').innerText = ''; document.getElementById('error').innerText = ''; }

function showMessage(msg) { document.getElementById('output').innerText = msg; document.getElementById('error').innerText = ''; }

function showError(msg) { document.getElementById('error').innerText = msg; document.getElementById('output').innerText = ''; }

function signUp(username, email, password) { if (!username || !email || !password) return showError('All fields required.'); const user = { _id: email, username, email, password }; db.put(user).then(() => { gun.get('users').get(username).put({ email, password }); showMessage('Account created. You can now log in.'); }).catch(err => { if (err.status === 409) showError('Account already exists.'); else showError('Signup failed: ' + err.message); }); }

function login(username, password) { if (!username || !password) return showError('Username and password required.'); gun.get('users').get(username).once(data => { if (!data) return showError('User not found.'); if (data.password !== password) return showError('Incorrect password.'); sessionStorage.setItem('loggedInUser', username); window.location.href = 'home.html'; // replace with actual page }); }

function resetPassword(username, email, newPass) { if (!username || !email || !newPass) return showError('All fields required.'); db.get(email).then(doc => { if (doc.username !== username) return showError('Username and email do not match.'); doc.password = newPass; return db.put(doc); }).then(() => { gun.get('users').get(username).put({ password: newPass }); showMessage('Password reset successful.'); }).catch(err => { showError('Reset failed: ' + err.message); }); }

function deleteAccount(username, email, password) { if (!username || !email || !password) return showError('All fields required.'); db.get(email).then(doc => { if (doc.username !== username || doc.password !== password) return showError('Incorrect credentials.'); return db.remove(doc); }).then(() => { gun.get('users').get(username).put(null); showMessage('Account deleted.'); }).catch(err => { showError('Deletion failed: ' + err.message); }); }

// Auto redirect if already logged in if (sessionStorage.getItem('loggedInUser')) { window.location.href = 'dashboard.html'; // adjust as needed }

                                                                                                                                                          
