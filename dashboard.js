const db = new PouchDB('transactions');
const user = JSON.parse(localStorage.getItem('user'));

// Generate QR Code for Payment
function generateQRCode() {
    const tokenAmount = document.getElementById('tokenAmount').value;
    const walletAddress = document.getElementById('walletAddress').value;

    if (!tokenAmount || !walletAddress) {
        showError('Please enter both token amount and wallet address');
        return;
    }

    const bnbAmount = tokenAmount / 100000; // 1 BNB = 100,000 tokens

    // Generate QR code
    const qrCodeData = {
        amount: bnbAmount,
        wallet: walletAddress,
        userEmail: user.email
    };
    
    QRCode.toDataURL(JSON.stringify(qrCodeData), function(err, url) {
        if (err) {
            showError('Error generating QR Code');
            return;
        }
        document.getElementById('qrOutput').innerHTML = `<img src="${url}" alt="QR Code">`;
    });
}

// Handle Payment and Store Transaction
function handlePayment(bnbAmount) {
    // For the purpose of the demo, we simulate a payment
    const transaction = {
        user: user.username,
        email: user.email,
        amount: bnbAmount,
        timestamp: new Date().toISOString()
    };

    db.put(transaction).then(function(response) {
        Toastify({
            text: `You’ve successfully bought ${bnbAmount * 100000} CryptoPin tokens!`,
            duration: 5000,
            close: true,
            gravity: "top",
            position: "center",
            backgroundColor: "green",
        }).showToast();
        updatePurchaseHistory();
    }).catch(function(err) {
        showError('Error processing payment');
    });
}

// Display Purchase History
function updatePurchaseHistory() {
    db.allDocs({ include_docs: true }).then(function(result) {
        const history = result.rows.map(row => row.doc);
        let historyHTML = '';
        history.forEach(function(item) {
            historyHTML += `<div>Purchased: ${item.amount} BNB - ${item.timestamp}</div>`;
        });
        document.getElementById('purchaseHistory').innerHTML = historyHTML;
    }).catch(function(err) {
        showError('Error loading purchase history');
    });
}

// Logout
function logout() {
    localStorage.removeItem('user');
    window.location.href = 'login.html';
}

updatePurchaseHistory();

function paymentSuccess(amount) {
  Toastify({
    text: `You’ve successfully bought ${amount} CryptoPin tokens!`,
    duration: 5000,
    close: true,
    gravity: "top", 
    position: "center", 
    backgroundColor: "green",
  }).showToast();
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

function generatePaymentQR(amount) {
  const recipient = "YOUR_BNB_WALLET_ADDRESS"; // Replace with your wallet
  const qrData = `ethereum:${recipient}?value=${web3.utils.toHex(web3.utils.toWei(amount, 'ether'))}`;
  
  document.getElementById("qrCode").innerHTML = "";
  new QRCode(document.getElementById("qrCode"), {
    text: qrData,
    width: 256,
    height: 256,
    correctLevel: QRCode.CorrectLevel.H
  });
}

function handleGenerateQR() {
  const amount = document.getElementById("qrBnbAmount").value;
  if (!amount || parseFloat(amount) <= 0) {
    alert("Enter a valid BNB amount.");
    return;
  }
  generatePaymentQR(amount);
}

function refreshQR() {
  document.getElementById("qrCode").innerHTML = "";
  document.getElementById("qrBnbAmount").value = "";
}

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


  // Initialize local PouchDB
  const localTransactions = new PouchDB('user_transactions');

  // Replace with your CouchDB endpoint
  const remoteTransactions = new PouchDB('https://admin:password@your-couchdb-domain.com/transactions_db');

  // Sync data in real-time
  localTransactions.sync(remoteTransactions, {
    live: true,
    retry: true
  }).on('change', function (info) {
    console.log("Sync Change: ", info);
  }).on('error', function (err) {
    console.error("Sync Error:", err);
  });

  // Save transaction
  function saveTransaction(data) {
    const record = {
      _id: new Date().toISOString(),
      username: data.username,
      email: data.email,
      bnbAmount: data.bnb,
      tokens: data.tokens,
      cryptopinWallet: data.wallet,
      txHash: data.tx,
      time: new Date().toLocaleString()
    };

    localTransactions.put(record).then(() => {
      console.log("Transaction saved locally.");
    }).catch(err => console.error("Save Error:", err));
  }

  // Example usage:
  // saveTransaction({ username: 'john', email: 'john@gmail.com', bnb: 1, tokens: 100000, wallet: '0x...', tx: '0xhash' });

