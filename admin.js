function clearRequests() {
    localStorage.removeItem('requests');
    alert('All requests cleared!');
    loadRequests();
}

function loadRequests() {
    const requestList = document.getElementById('requestList');
    const requests = JSON.parse(localStorage.getItem('requests')) || [];
    requestList.innerHTML = requests.length === 0 ? 'No requests available.' : requests.map(req => `<p>${req}</p>`).join('');
}
window.onload = loadRequests;
