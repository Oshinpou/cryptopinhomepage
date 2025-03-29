<?php
// Database connection details
$host = 'localhost';
$user = 'root';
$password = '';
$dbname = 'cryptopin';

// Create connection
$conn = new mysqli($host, $user, $password, $dbname);

// Check connection
if ($conn->connect_error) {
    die(json_encode(['message' => 'Database connection failed: ' . $conn->connect_error]));
}

// Check if POST data is received
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Validate input data
    $name = isset($_POST['name']) ? trim($_POST['name']) : '';
    $email = isset($_POST['email']) ? trim($_POST['email']) : '';
    $message = isset($_POST['message']) ? trim($_POST['message']) : '';

    // Validate input to avoid empty or malicious data
    if (empty($name) || empty($email) || empty($message)) {
        die(json_encode(['message' => 'All fields are required.']));
    }

    // Validate email format
    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        die(json_encode(['message' => 'Invalid email format.']));
    }

    // Prepare and insert data into 'help_requests' table
    $sql = "INSERT INTO help_requests (name, email, message, status) VALUES (?, ?, ?, 'Pending')";
    $stmt = $conn->prepare($sql);

    // Check if statement prepared successfully
    if (!$stmt) {
        die(json_encode(['message' => 'Error preparing statement: ' . $conn->error]));
    }

    // Bind parameters securely
    $stmt->bind_param('sss', $name, $email, $message);

    // Execute statement and handle result
    if ($stmt->execute()) {
        echo json_encode(['message' => 'Help request submitted successfully!']);
    } else {
        echo json_encode(['message' => 'Error: ' . $stmt->error]);
    }

    // Close statement and connection
    $stmt->close();
    $conn->close();
} else {
    // Handle non-POST requests
    echo json_encode(['message' => 'Invalid request method.']);
}
?>
