<?php
session_start();
header('Content-Type: application/json; charset=UTF-8');

ini_set('log_errors', 1);
ini_set('error_log', 'response_log.txt');
ini_set('display_errors', 0); // Disable display of errors for production
#ob_start(); // Start output buffering // Log response for debugging

include 'conn.php';
$db = new DatabaseManager(createConnection());

$response = [];

if ($_SERVER['REQUEST_METHOD'] == "POST") {
    if (isset($_POST["country"]) && isset($_POST["role"])) {
        // Check if 'password_hash' is set in the POST data
        if (isset($_POST["password_hash"])) {
            // Generate MD5 hash of the password
            $_POST["password_hash"] = md5($_POST["password_hash"]);
            
            // Pass the modified $_POST data to insertData
            $response = $db->insertData("Users", $_POST);
        } else {
            // Handle case where password_hash is not set
            $response = json_encode(['success' => false, 'message' => 'Password is required.', 'data' => []]);
        }
    }else if (isset($_POST["login_username"]) && isset($_POST["login_password"])) {
        $response = $db->authenticateUser($_POST["login_username"], $_POST["login_password"]);
    }elseif (isset($_FILES['product_photo']) && $_FILES['product_photo']['error'] === 0) {
        $file = $_FILES['product_photo'];

        // Validate the file's extension
        $allowedExtensions = ['jpg', 'jpeg', 'png'];
        $filename = $file['name'];
        $extension = pathinfo($filename, PATHINFO_EXTENSION);
        if (!in_array($extension, $allowedExtensions)) {
            $response = json_encode(['success' => false, 'message' => 'Error: Please select a valid image file (JPEG/PNG/JPG).', 'data' => []]);
        }

        // Generate a unique filename to avoid overwriting existing files
        $newFilename = uniqid() . '_' . $filename;
        
        // Define the upload path (e.g., within your project's "uploads" directory)
        $uploadPath = '../files/product_images/' . $newFilename;

        // Move the uploaded file to the defined path
        if (move_uploaded_file($file['tmp_name'], $uploadPath)) {
            // Initialize an array to hold form data
            $data = [];

            // Loop through $_POST to capture all form fields except 'product_photo'
            foreach ($_POST as $key => $value) {
                if ($key !== 'product_photo' && $key !== 'gps_coordinates' && $key !== 'submission_type' && $key !== 'product_id') { // Skip 'product_photo','submission_type','gps_coordinates'
                    $data[$key] = $value;
                }
            }
            $data['image_url'] = $newFilename; // Add 'image_url' to the data array
            
            
            if($_POST["submission_type"] == "add"){ 
                $data['user_id'] = $_SESSION['user_id']; 
                $response = $db->insertData("ProductListings", $data); // Insert data into the databasey

                // Decode the JSON response
                $responseArray = json_decode($response, true);

                // Check if the operation was successful and retrieve the last_insert ID
                if ($responseArray['success']) {
                    $lastInsertId = $responseArray['last_insert'];
                    #Send data to other tables where product_id is foreign key -InventoryHistory
                    $db->insertData("InventoryHistory", [
                        "product_id" => $lastInsertId,
                        "old_quantity" => 0,
                        "new_quantity" => $_POST["stock_quantity"],
                        "new_price" => $_POST["price"],
                        "change_type" => "in"
                    ]);
                    $db->insertData("Logs", ["description"=>"Create: New InventoryHistory entry", "gps_coordinates"=>gpsStringToJSON($_POST["gps_coordinates"]), "user_id"=>$_SESSION['user_id']]);
                }

                $db->insertData("Logs", ["description"=>"Create: New product listing", "gps_coordinates"=>gpsStringToJSON($_POST["gps_coordinates"]), "user_id"=>$_SESSION['user_id']]);
            }else{
                $response = $db->updateData("ProductListings", $_POST["product_id"], $data); // Update data into the database
                $db->insertData("Logs", ["description"=>"Update: product listing", "gps_coordinates"=>gpsStringToJSON($_POST["gps_coordinates"]), "user_id"=>$_SESSION['user_id']]);
            }

            #$response = json_encode(['success' => true, 'message' => 'The image has been successfully uploaded.', 'data' => []]);
        } else {
            $response = json_encode(['success' => false, 'message' => 'Error: An error occurred while uploading the image.', 'data' => []]);
        }
    }elseif (isset($_POST["get_offline_data"]) && isset($_POST["user_id"]) && isset($_POST["role"])){
        if($_POST["user_id"] == $_SESSION["user_id"] && $_POST["role"] == $_SESSION["role"]){
            $dta = getOfflineData();
            $response = json_encode(['success' => true, 'message' => 'Data fetched successfully', 'data' => $dta]);
        }else{ $response = json_encode(['success' => false, 'message' => 'Permission error', 'data' => []]); }
    }elseif (isset($_POST["cart_items"])) {
        $data = [];
        // Loop through $_POST to capture all form fields except 'cart_items'
        foreach ($_POST as $key => $value) {
            if ($key !== 'cart_items') { // Skip 'cart_items' which carries transactions data
                $data[$key] = $value;
            }
        }
    
        // Insert data into OrderDetails and get the last insert ID
        $order_response = $db->insertData("OrderDetails", $data);
        $responseArray = json_decode($order_response, true);
    
        if ($responseArray['success']) {
            $lastInsertId = $responseArray['last_insert'];
    
            // Decode the cart_items JSON
            $cartItems = json_decode($_POST["cart_items"], true);
    
            // Loop through each item in the cart and insert into Transactions
            $tx_response = null;
            foreach ($cartItems as $item) {
                $transactionData = [
                    "order_id" => $lastInsertId,
                    "user_id" => $data['user_id'],
                    "product_id" => $item['product_id'],
                    "quantity" => $item['quantity'],
                    "price_per_unit" => $item['price'],
                    "total_price" => $item['total_price']
                ];
                $tx_response = $db->insertData("Transactions", $transactionData);
            }
            
            if($tx_response["success"]){
                $response = json_encode(['success' => true, 'message' => 'Order and transactions recorded successfully.']);
            }else{
                $response = json_encode(['success' => false, 'message' => $tx_response["message"], ''=>$tx_response["message"]]);
            }
        } else {
            $response = json_encode(['success' => false, 'message' => $responseArray["message"], 'data' => []]);
        }
    }else {
        $response = json_encode(['success' => false, 'message' => 'Invalid input', 'data' => []]);
    }
} else {
    $response = json_encode(['success' => false, 'message' => 'Invalid request method', 'data'=>[]]);
}

echo $response; // Always output the response

class DatabaseManager {
    private $conn;

    public function __construct($cx) {
        try {
            $this->conn = $cx;
            if ($this->conn->connect_error) {
                throw new Exception("Connection failed: " . $this->conn->connect_error);
            }
        } catch (Exception $e) {
            echo "Error: " . $e->getMessage();
        }
    }

    // Function for inserting data into any of the tables
    public function insertData($table, $data) {
        $columns = implode(', ', array_keys($data));
        $values = "'" . implode("', '", array_values($data)) . "'";

        $query = "INSERT INTO $table ($columns) VALUES ($values)";

        if ($this->conn->query($query)) {
            $lastInsertId = $this->conn->insert_id; // Retrieve the last insert ID
            return json_encode(['success' => true, 'message' => 'New product and photo successfully uploaded.', 'data' => [], 'last_insert'=>$lastInsertId]);
        } else {
            return json_encode(['success' => false, 'message'=>'Error occured', 'data' => [], 'error'=>$this->conn->error]);
        }
    }

    // Function for retrieving data from any of the tables
    public function getRows($table) {
        $userRole = $_SESSION['role'];
        $userId = $_SESSION['user_id'];
    
        // Prepare the base query
        $query = "SELECT * FROM $table";
    
        // Modify the query based on the user role
        if ($userRole !== 'admin') {
            if ($table === 'ProductListings') {
                $query .= " WHERE user_id = $userId";
            } elseif ($table === 'OrderDetails') {
                $query .= " WHERE user_id = $userId";
            } elseif ($table === 'Transactions') {
                $query .= " WHERE user_id = $userId";
            } elseif ($table === 'Logs') {
                $query .= " WHERE user_id = $userId";
            } elseif ($table === 'InventoryHistory') {
                // Join with ProductListings to filter by user_id
                $query = "SELECT ih.* FROM InventoryHistory ih
                          JOIN ProductListings pl ON ih.product_id = pl.product_id
                          WHERE pl.user_id = $userId";
            }
        }
    
        $result = $this->conn->query($query);
    
        if ($result->num_rows > 0) {
            return $result->fetch_all(MYSQLI_ASSOC);
        } else {
            return array();
        }
    }
    

    // Function for updating data in any of the tables
    public function updateData($table, $id, $data) {
        $setClause = [];
        foreach ($data as $key => $value) {
            $setClause[] = "$key = '" . mysqli_real_escape_string($this->conn, $value) . "'";
        }
        $setString = implode(', ', $setClause);

        $query = "UPDATE $table SET $setString WHERE id=$id";

        if ($this->conn->query($query)) {
            return true;
        } else {
            echo "Error: " . $this->conn->error;
            return false;
        }
    }

    // Function for deleting data from any of the tables
    public function deleteRow($table, $id) {
        $query = "DELETE FROM $table WHERE id=" . intval($id);

        if ($this->conn->query($query)) {
            return true;
        } else {
            echo "Error: " . $this->conn->error;
            return false;
        }
    }

    public function authenticateUser($username, $password) {
        // Convert password to MD5 hash
        $hashedPassword = md5($password);
        #$hashedPassword = password_hash($password, PASSWORD_DEFAULT);
    
        // Query User table for username and hashed password
        $userQuery = "SELECT * FROM Users WHERE username = '$username' AND password_hash = '$hashedPassword'";
        
        if($result = $this->conn->query($userQuery)){
            if ($result->num_rows > 0) {
                // Get the user's data
                $userData = $result->fetch_assoc();
        
                // Store the user's ID in session
                $_SESSION['user_id'] = $userData['user_id'];
                $_SESSION['username'] = $userData['username'];
                $_SESSION['first_name'] = $userData['first_name'];
                $_SESSION['last_name'] = $userData['last_name'];
                $_SESSION['role'] = $userData['role'];
        
                // Set session cookie to expire in an hour
                $expireTime = time() + (60 * 60);
                setcookie('session_id', session_id(), $expireTime, '/', '', false);
        
                // Rename the key before encoding
                $userData['token'] = $userData['password_hash']; unset($userData['password_hash']);

                // Return true and user data in JSON format
                return json_encode(['success' => true, 'userData' => $userData]);
            } else {
                // Return false and empty user data in JSON format
                return json_encode(['success' => false, 'userData' => [], 'message'=>'No user matched. Please enter valid username and/or password.']);
            }
        }else{ return json_encode(['success' => false, 'error' => $this->conn->error]); }

        /*$stmt = $this->conn->prepare("SELECT * FROM User WHERE user_id = ? AND password_hash = ?");
        $stmt->bind_param("ss", $username, $hashedPassword);
        $stmt->execute();
        
        $result = $stmt->get_result();*/
        
    }

    public function closeConnection() {
        $this->conn->close();
    }
}

function getOfflineData(){
    // Define an array to store table names
    $tables = [
        'Categories','InventoryHistory','Logs','Notifications','OrderDetails','ProductAttributes',
        'ProductListings','ReviewsRatings','Subcategories','SystemSettings','Transactions','Users'
    ];
    // Create an empty array to store the data
    $data = [];

    // Loop through each table and fetch data
    foreach ($tables as $table) {
      $data[$table] = getRows($table);
    }

    return $data; //Return as an array to avoid multiple json encoding 
}

function gpsStringToJSON($gpsDataString){
    // Split the string into individual components
    $gpsComponents = explode(';', $gpsDataString);

    // Initialize an associative array for the JSON structure
    $gpsDataArray = [];

    // Iterate through the components and split into key-value pairs
    foreach ($gpsComponents as $component) {
        $keyValue = explode(',', $component);
        if (count($keyValue) == 2) {
            $key = trim($keyValue[0]);
            $value = trim($keyValue[1]);

            // Convert 'null' strings to actual null
            $value = strtolower($value) === 'null' ? null : $value;

            // Convert numeric strings to float or integer
            if (is_numeric($value)) {
                $value = strpos($value, '.') !== false ? (float)$value : (int)$value;
            }

            $gpsDataArray[$key] = $value;
        }
    }

    // Convert the associative array to a JSON string
    $gpsDataJson = json_encode($gpsDataArray);
    return $gpsDataJson;
}
#Unit Testing
$user_data = [ 'username' => 'wadhawo', 'email' => 'walteradhawo@gmail.com',  'password_hash' => 'yreinfidsyfndsk', 'first_name' => 'Walter', 'last_name' => 'Adhawo', 'role' => 'admin' ];
#if ($db->insertData('Users', $user_data)) { echo "New record created successfully"; } else {  echo "Error: Couldn't insert new record"; }

#$jn = $db -> authenticateUser("wadhawo", "Walter@123");
#echo json_encode($jn);

#$response = json_decode($db->authenticateUser("wadhawo", "Walter@123"), true);
#echo json_encode($response); // Send JSON response

#$response = $db->authenticateUser("wadhawo", "Walter@123");
#echo $response; // Send JSON response
#echo json_encode(getOfflineData());