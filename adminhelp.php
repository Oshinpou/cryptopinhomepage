<?php
// Database connection
$host = 'localhost';
$dbname = 'cryptopin';
$user = 'root';
$pass = '';

// Establish database connection
$conn = new mysqli($host, $user, $pass, $dbname);

// Check connection
if ($conn->connect_error) {
    die(json_encode(['message' => 'Database connection failed: ' . $conn->connect_error]));
}

// Allow CORS (Optional for API, if required)
header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');

// Handle GET request to fetch data
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $result = $conn->query("SELECT * FROM help_requests ORDER BY id DESC");

    if ($result === false) {
        echo json_encode(['message' => 'Error fetching data.']);
        exit;
    }

    $data = [];
    while ($row = $result->fetch_assoc()) {
        $data[] = $row;
    }

    echo json_encode($data);
    exit;
}

// Handle POST request to delete record
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Get input data
    $input = json_decode(file_get_contents('php://input'), true);

    // Check if delete action is requested
    if (isset($input['action']) && $input['action'] === 'delete' && isset($input['id'])) {
        $id = intval($input['id']);

        // Prepare delete statement
        $stmt = $conn->prepare("DELETE FROM help_requests WHERE id = ?");
        $stmt->bind_param("i", $id);

        if ($stmt->execute()) {
            if ($stmt->affected_rows > 0) {
                echo json_encode(['message' => 'Request deleted successfully!']);
            } else {
                echo json_encode(['message' => 'No record found with that ID.']);
            }
        } else {
            echo json_encode(['message' => 'Failed to delete request.']);
        }
        $stmt->close();
        exit;
    } else {
        echo json_encode(['message' => 'Invalid request.']);
        exit;
    }
}

// Handle invalid request method
http_response_code(405);
echo json_encode(['message' => 'Method not allowed.']);
$conn->close();
?>
