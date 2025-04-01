<?php
// Assuming you have defined the following constants:
// Database credentials (make sure these are stored securely)
define('DB_HOST', '172.28.72.154');
define('DB_USER', 'wadhawo');
define('DB_PASS', 'Walter254');
define('DB_NAME', 'unep_staff_portal');

$servername = "172.28.72.154"; $username = "wadhawo"; $password = "Walter254"; $dbname = "unep_staff_portal";

function createConnection() {
    // Define database credentials
    
    global $servername; global $username; global $password; global $dbname;
    // Create connection
    #$con = new mysqli(DB_HOST, DB_USER, DB_PASS, DB_NAME);
    $con = new mysqli($servername, $username, $password, $dbname);

    // Check connection
    if ($con->connect_error) {
        die("Connection failed: " . $con->connect_error);
    }

    return $con;
}

$cx = createConnection();
$conn = $cx;

// Function for inserting data into any of the tables
function insertData($table, $data)
{
    global $conn;
    $columns = implode(', ', array_keys($data));
    $values = "'" . implode("', '", array_values($data)) . "'";
    
    $query = "INSERT INTO $table ($columns) VALUES ($values)";
    
    if ($conn->query($query)) {
        return true;
    } else {
        echo "Error: " . $conn->error;
        return false;
    }
}

// Function for retrieving data from any of the tables
function getRows($table)
{
    global $conn;
    $result = $conn->query("SELECT * FROM $table");
    
    if ($result->num_rows > 0) {
        return $result->fetch_all(MYSQLI_ASSOC);
    } else {
        return array();
    }
}

// Function for updating data in any of the tables
function updateData($table, $id, $data)
{
    global $conn;
    $setClause = [];
    
    foreach ($data as $key => $value) {
        $setClause[] = "$key = '$value'";
    }

    $setString = implode(', ', $setClause);
    
    $query = "UPDATE $table SET $setString WHERE id=$id";
    
    if ($conn->query($query)) {
        return true;
    } else {
        echo "Error: " . $conn->error;
        return false;
    }
}

// Function for deleting data from any of the tables
function deleteRow($table, $id)
{
    global $conn;
    $query = "DELETE FROM $table WHERE id=$id";
    
    if ($conn->query($query)) {
        return true;
    } else {
        echo "Error: " . $conn->error;
        return false;
    }
}

function handleLogin($username, $password) {
    global $conn;

    // Fetch row from database based on username and password
    $query = "SELECT * FROM Users WHERE username='$username' AND password_hash='$password'";
    $result = $conn->query($query);

    if ($row = $result->fetch_assoc()) {
        $_SESSION['user_id'] = $row['id'];
        return json_encode(array('success' => true));
    } else {
        return json_encode(array('success' => false, 'message' => "Invalid username or password"));
    }
}

?>