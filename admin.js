const DB_NAME = "globalDB";
const STORE_NAME = "pageData";
let db;
const db = new PouchDB('users');
const transactionDB = new PouchDB('transactions');

// Admin Login
function adminLogin() {
    const adminEmail = document.getElementById('adminEmail').value;
    const adminPassword = document.getElementById('adminPassword').value;

    if (adminEmail === 'admin@cryptopin.com' && adminPassword === 'admin123') {
        Toastify({
            text: "Admin Login Successful!",
            duration: 3000,
            close: true,
            gravity: "top",
            position: "right",
            backgroundColor: "green",
        }).showToast();
        document.getElementById('adminLoginBox').style.display = 'none';
        document.getElementById('adminDashboard').style.display = 'block';
        loadUsers();
        loadTransactions();
    } else {
        showError('Invalid admin credentials');
    }
}

// Load Users
function loadUsers() {
    db.allDocs({ include_docs: true }).then(function(result) {
        const userList = result.rows.map(row => row.doc);
        let userHTML = '';
        userList.forEach(function(user) {
            userHTML += `<div>${user.username} - ${user.email}</div>`;
        });
        document.getElementById('userList').innerHTML = userHTML;
    }).catch(function(err) {
        showError('Error loading users');
    });
}

// Load Transactions
function loadTransactions() {
    transactionDB.allDocs({ include_docs: true }).then(function(result) {
        const transactions = result.rows.map(row => row.doc);
        let transactionsHTML = '';
        transactions.forEach(function(transaction) {
            transactionsHTML += `<div>User: ${transaction.user} - Amount: ${transaction.amount} BNB</div>`;
        });
        document.getElementById('allTransactions').innerHTML = transactionsHTML;
    }).catch(function(err) {
        showError('Error loading transactions');
    });
}

// Admin Logout
function adminLogout() {
    document.getElementById('adminLoginBox').style.display = 'block';
    document.getElementById('adminDashboard').style.display = 'none';
}

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


// Initialize Database
function initDB() {
    let request = indexedDB.open(DB_NAME, 1);
    request.onsuccess = (e) => {
        db = e.target.result;
    };
}

// Search Data by URL or Title
function searchData() {
    let searchKey = document.getElementById("searchData").value.toLowerCase();
    let tx = db.transaction(STORE_NAME, "readonly");
    let store = tx.objectStore(STORE_NAME);
    let req = store.openCursor();
    let result = "";

    req.onsuccess = (e) => {
        let cursor = e.target.result;
        if (cursor) {
            let url = cursor.value.url.toLowerCase();
            let title = cursor.value.title.toLowerCase();
            if (url.includes(searchKey) || title.includes(searchKey)) {
                result += `<p>URL: ${cursor.value.url} | Title: ${cursor.value.title} | Time: ${cursor.value.timestamp}</p>`;
            }
            cursor.continue();
        } else {
            document.getElementById("searchResult").innerHTML = result || "No Data Found!";
        }
    };
}

// View All Data
function viewAllData() {
    let tx = db.transaction(STORE_NAME, "readonly");
    let store = tx.objectStore(STORE_NAME);
    let req = store.openCursor();
    let result = "";

    req.onsuccess = (e) => {
        let cursor = e.target.result;
        if (cursor) {
            result += `<p>URL: ${cursor.value.url} | Title: ${cursor.value.title} | Time: ${cursor.value.timestamp}</p>`;
            cursor.continue();
        } else {
            document.getElementById("dataList").innerHTML = result || "No Data Available!";
        }
    };
}

// Initialize Database on Page Load
initDB();

async function submitPayment() {
  const txHash = document.getElementById("txHashInput").value.trim();
  const wallet = document.getElementById("cryptopinWallet").value.trim();
  const bnbAmount = parseFloat(document.getElementById("qrBnbAmount").value);

  if (!txHash || !wallet || !bnbAmount) {
    alert("Fill all fields correctly.");
    return;
  }

  const tokens = bnbAmount * 100000; // Example conversion

  const user = localStorage.getItem("cryptopin_user");
  const userDB = new PouchDB(user);
  const entry = {
    _id: new Date().toISOString(),
    type: "transaction",
    bnb: bnbAmount,
    tokens,
    txHash,
    cryptoWallet: wallet
  };

  await userDB.put(entry);

  Toastify({ text: `Success! You bought ${tokens} CryptoPin tokens.`, duration: 4000, style: { background: "#0f0" } }).showToast();

  document.getElementById("txHashInput").value = "";
  document.getElementById("cryptopinWallet").value = "";
}


