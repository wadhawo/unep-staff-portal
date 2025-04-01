CREATE DATABASE IF NOT EXISTS unep_staff_portal;
USE unep_staff_portal;

-- Table for storing education levels
CREATE TABLE education_levels (
    id INT AUTO_INCREMENT PRIMARY KEY,
    level_name VARCHAR(100) UNIQUE NOT NULL
);

-- Table for storing duty stations
CREATE TABLE duty_stations (
    id INT AUTO_INCREMENT PRIMARY KEY,
    station_name VARCHAR(255) UNIQUE NOT NULL
);

-- Table for software expertise categories
CREATE TABLE software_expertise (
    id INT AUTO_INCREMENT PRIMARY KEY,
    software_name VARCHAR(255) UNIQUE NOT NULL
);

-- Table for expertise levels
CREATE TABLE expertise_levels (
    id INT AUTO_INCREMENT PRIMARY KEY,
    level_name VARCHAR(100) UNIQUE NOT NULL
);

-- Table for languages
CREATE TABLE languages (
    id INT AUTO_INCREMENT PRIMARY KEY,
    language_name VARCHAR(100) UNIQUE NOT NULL
);

-- Table for responsibility levels
CREATE TABLE responsibility_levels (
    id INT AUTO_INCREMENT PRIMARY KEY,
    level_name VARCHAR(100) UNIQUE NOT NULL
);

-- Table for user authentication
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role ENUM('admin', 'staff') DEFAULT 'staff',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table for storing staff details
CREATE TABLE staff (
    id INT AUTO_INCREMENT PRIMARY KEY,
    index_number VARCHAR(50) UNIQUE NOT NULL,
    full_names VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    current_location VARCHAR(255) NOT NULL,
    education_level_id INT NOT NULL,
    duty_station_id INT NOT NULL,
    remote_work_availability BOOLEAN NOT NULL DEFAULT 0,
    software_expertise_id INT NOT NULL,
    expertise_level_id INT NOT NULL,
    language_id INT NOT NULL,
    responsibility_level_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (education_level_id) REFERENCES education_levels(id),
    FOREIGN KEY (duty_station_id) REFERENCES duty_stations(id),
    FOREIGN KEY (software_expertise_id) REFERENCES software_expertise(id),
    FOREIGN KEY (expertise_level_id) REFERENCES expertise_levels(id),
    FOREIGN KEY (language_id) REFERENCES languages(id),
    FOREIGN KEY (responsibility_level_id) REFERENCES responsibility_levels(id)
);

INSERT INTO users (username, password_hash, ROLE) VALUES ('portal_admin', MD5('Walter123'), 'admin');
