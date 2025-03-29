-- Create the 'cryptopin' database if it does not exist
CREATE DATABASE IF NOT EXISTS cryptopin;

-- Use the 'cryptopin' database
USE cryptopin;

-- Create 'help_requests' table with improved structure
CREATE TABLE IF NOT EXISTS help_requests (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL,
    message TEXT NOT NULL,
    status ENUM('Pending', 'In Progress', 'Resolved', 'Closed') DEFAULT 'Pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Optional: Create an index to speed up query performance
CREATE INDEX idx_status ON help_requests (status);
