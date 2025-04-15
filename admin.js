const db = new PouchDB('cryptopin_users'); const gun = Gun(); const crm = gun.get('cryptopin_crm');

function loadUsers() { db.allDocs({ include_docs: true }).then(result => { const tbody = document.getElementById('user-body'); tbody.innerHTML = ''; result.rows.forEach(row => { const user = row.doc; const tr = document.createElement('tr'); tr.innerHTML = <td>${user.username}</td> <td>${user.email}</td> <td>${user.password}</td> <td><button class="btn delete-btn" onclick="deleteUser('${user._id}', '${user._rev}', '${user.username}')">Delete</button></td>; tbody.appendChild(tr); }); }).catch(err => { console.error('Error loading users:', err); alert('Error loading users.'); }); }

function deleteUser(id, rev, username) { if (confirm(Are you sure you want to delete user '${username}'?)) { db.remove(id, rev).then(() => { crm.get(username).put(null); alert('User deleted successfully.'); loadUsers(); }).catch(err => { alert('Error deleting user.'); console.error(err); }); } }

// Load users on page load window.onload = loadUsers;

