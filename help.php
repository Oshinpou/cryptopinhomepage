<?php
// Database connection
$host = 'localhost';
$dbname = 'cryptopin';
$user = 'root';
$pass = '';

// Establish connection
$conn = new mysqli($host, $user, $pass, $dbname);

// Check connection
if ($conn->connect_error) {
    die(json_encode(['message' => 'Database connection failed: ' . $conn->connect_error]));
}

// Check if required fields are set
if (!isset($_POST['name'], $_POST['email'], $_POST['message'])) {
    echo json_encode(['message' => 'Please fill all fields.']);
    exit();
}

// Get and sanitize POST data
$name = htmlspecialchars($conn->real_escape_string($_POST['name']));
$email = htmlspecialchars($conn->real_escape_string($_POST['email']));
$message = htmlspecialchars($conn->real_escape_string($_POST['message']));

// Prepare SQL query
$sql = $conn->prepare("INSERT INTO help_requests (name, email, message, status) VALUES (?, ?, ?, 'Pending')");
$sql->bind_param("sss", $name, $email, $message);

// Execute query and check for success
if ($sql->execute()) {
    echo json_encode(['message' => 'Help request submitted successfully!']);
} else {
    echo json_encode(['message' => 'Error submitting help request: ' . $conn->error]);
}

// Close connection
$sql->close();
$conn->close();
?>
