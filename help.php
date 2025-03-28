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

// Get POST data
$data = json_decode(file_get_contents('php://input'), true);
$name = $conn->real_escape_string($data['name']);
$email = $conn->real_escape_string($data['email']);
$message = $conn->real_escape_string($data['message']);

// Insert query
$sql = "INSERT INTO help_requests (name, email, message, status) VALUES ('$name', '$email', '$message', 'Pending')";

if ($conn->query($sql) === TRUE) {
    echo json_encode(['message' => 'Help request submitted successfully!']);
} else {
    echo json_encode(['message' => 'Error: ' . $conn->error]);
}

$conn->close();
?>
