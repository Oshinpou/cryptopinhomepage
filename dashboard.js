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
