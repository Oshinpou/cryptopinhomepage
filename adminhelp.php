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
    exit();
}

// Handle POST request to delete record
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = json_decode(file_get_contents('php://input'), true);

    if (isset($data['action']) && $data['action'] === 'delete' && isset($data['id'])) {
        $id = intval($data['id']);
        $stmt = $conn->prepare("DELETE FROM help_requests WHERE id = ?");
        $stmt->bind_param('i', $id);

        if ($stmt->execute()) {
            echo json_encode(['message' => 'Request deleted successfully!']);
        } else {
            echo json_encode(['message' => 'Failed to delete request.']);
        }
        $stmt->close();
    } else {
        echo json_encode(['message' => 'Invalid request.']);
    }
}

$conn->close();
?>
