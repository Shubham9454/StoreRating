-- Create database
CREATE DATABASE IF NOT EXISTS store_rating_db;

-- Use the database
USE store_rating_db;

-- Create users table
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(60) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    address TEXT,
    password VARCHAR(255) NOT NULL,
    role ENUM('admin', 'normal_user', 'store_owner') NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT chk_name_length CHECK (CHAR_LENGTH(name) >= 20 AND CHAR_LENGTH(name) <= 60),
    CONSTRAINT chk_address_length CHECK (CHAR_LENGTH(address) <= 400)
);

-- Create stores table
CREATE TABLE stores (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(60) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    address TEXT,
    owner_id INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT chk_store_name_length CHECK (CHAR_LENGTH(name) >= 20 AND CHAR_LENGTH(name) <= 60),
    CONSTRAINT chk_store_address_length CHECK (CHAR_LENGTH(address) <= 400),
    FOREIGN KEY (owner_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Create ratings table
CREATE TABLE ratings (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    store_id INT,
    rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE KEY unique_user_store (user_id, store_id),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (store_id) REFERENCES stores(id) ON DELETE CASCADE
);

-- Create indexes for better performance
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_stores_owner_id ON stores(owner_id);
CREATE INDEX idx_ratings_user_id ON ratings(user_id);
CREATE INDEX idx_ratings_store_id ON ratings(store_id);
CREATE INDEX idx_ratings_store_user ON ratings(store_id, user_id);

-- Insert default admin user (password: AdminPass123!)
INSERT INTO users (name, email, address, password, role) VALUES (
    'System Administrator Default',
    'admin@system.com',
    '123 Admin Street, Admin City, Admin State, 12345',
    '$2a$10$8K1p/a0dClAsgHs1nkN2A.VJoL9WZlcGWmFcMKoOBJDBG4fBVnxuq',
    'admin'
);

-- Insert sample stores for testing
INSERT INTO users (name, email, address, password, role) VALUES 
(
    'Sample Store Owner One Name',
    'store1@example.com',
    '456 Store Street, Store City, Store State, 67890',
    '$2a$10$8K1p/a0dClAsgHs1nkN2A.VJoL9WZlcGWmFcMKoOBJDBG4fBVnxuq',
    'store_owner'
),
(
    'Sample Store Owner Two Name',
    'store2@example.com',
    '789 Business Avenue, Business City, Business State, 13579',
    '$2a$10$8K1p/a0dClAsgHs1nkN2A.VJoL9WZlcGWmFcMKoOBJDBG4fBVnxuq',
    'store_owner'
);

-- Insert corresponding stores
INSERT INTO stores (name, email, address, owner_id) VALUES 
(
    'Sample Store Owner One Name',
    'store1@example.com',
    '456 Store Street, Store City, Store State, 67890',
    2
),
(
    'Sample Store Owner Two Name',
    'store2@example.com',
    '789 Business Avenue, Business City, Business State, 13579',
    3
);

-- Insert sample normal user
INSERT INTO users (name, email, address, password, role) VALUES (
    'Sample Normal User Name Here',
    'user@example.com',
    '321 User Lane, User City, User State, 24680',
    '$2a$10$8K1p/a0dClAsgHs1nkN2A.VJoL9WZlcGWmFcMKoOBJDBG4fBVnxuq',
    'normal_user'
);

-- Insert some sample ratings for testing
INSERT INTO ratings (user_id, store_id, rating) VALUES 
(4, 1, 5),
(4, 2, 4);