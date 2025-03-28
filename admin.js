const DB_NAME = "globalDB";
const STORE_NAME = "pageData";
let db;

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
