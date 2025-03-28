<?php
// Database connection
$host = 'localhost';
$dbname = 'cryptopin';
$user = 'root';
$pass = '';

$conn = new mysqli($host, $user, $pass, $dbname);

if ($conn->connect_error) {
    die(json_encode(['message' => 'Database connection failed.']));
}

// Handle GET request to fetch data
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $result = $conn->query("SELECT * FROM help_requests ORDER BY id DESC");
    $data = [];

    while ($row = $result->fetch_assoc()) {
        $data[] = $row;
    }

    echo json_encode($data);
}

// Handle DELETE request to delete record
if ($_SERVER['REQUEST_METHOD'] === 'DELETE') {
    $id = intval($_GET['id']);
    $conn->query("DELETE FROM help_requests WHERE id = $id");

    if ($conn->affected_rows > 0) {
        echo json_encode(['message' => 'Request deleted successfully!']);
    } else {
        echo json_encode(['message' => 'Failed to delete request.']);
    }
}

$conn->close();
?>
