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
