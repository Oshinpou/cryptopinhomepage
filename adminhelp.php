<?php
header('Content-Type: application/json');

// DB connection
$host = 'localhost';
$user = 'root';
$password = '';
$dbname = 'cryptopin';
$conn = new mysqli($host, $user, $password, $dbname);

if ($conn->connect_error) {
    http_response_code(500);
    echo json_encode(['message' => 'Database connection failed']);
    exit();
}

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $result = $conn->query("SELECT id, name, email, message, status FROM help_requests ORDER BY id DESC");

    $data = [];
    while ($row = $result->fetch_assoc()) {
        $data[] = $row;
    }

    echo json_encode($data);
    exit();
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $input = json_decode(file_get_contents("php://input"), true);

    if (isset($input['id']) && $input['action'] === 'delete') {
        $id = intval($input['id']);
        $stmt = $conn->prepare("DELETE FROM help_requests WHERE id = ?");
        $stmt->bind_param("i", $id);

        if ($stmt->execute()) {
            echo json_encode(['message' => 'Request deleted successfully.']);
        } else {
            http_response_code(500);
            echo json_encode(['message' => 'Failed to delete request.']);
        }

        $stmt->close();
        exit();
    } else {
        http_response_code(400);
        echo json_encode(['message' => 'Invalid request.']);
        exit();
    }
}

// Invalid method
http_response_code(405);
echo json_encode(['message' => 'Method not allowed.']);
exit();
?>
