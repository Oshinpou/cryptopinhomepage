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
    die('Connection failed: ' . $conn->connect_error);
}

// Get form data
$name = $_POST['name'];
$email = $_POST['email'];
$message = $_POST['message'];

// Prepare and insert data into 'help_requests' table
$sql = "INSERT INTO help_requests (name, email, message, status) VALUES (?, ?, ?, 'Pending')";
$stmt = $conn->prepare($sql);
$stmt->bind_param('sss', $name, $email, $message);

if ($stmt->execute()) {
    echo 'Help request submitted successfully!';
} else {
    echo 'Error: ' . $stmt->error;
}

$stmt->close();
$conn->close();
?>
