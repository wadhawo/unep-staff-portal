
function closeModal(div) {
  // Get a reference to the modal element
  var modal = document.getElementById(div);

  // Add an event listener to the document that hides the modal when clicked outside its boundaries
  document.addEventListener("click", function (e) {
      // If the modal is not the target of the click, and no descendant of the modal was clicked, hide it
      if (!modal.contains(e.target)) {
          modal.style.display = "none";
      }
  });
}

function showHideDiv(div_name) {
  const div = document.getElementById(div_name);
  if (div) {
    div.style.display = div.style.display === "none" ? "block" : "none";
  }
}

function toggleW3Show(divId) {
  let div = document.getElementById(divId);
  
  if (div.classList.contains('w3-hide')) {
    div.classList.remove('w3-hide');
    div.classList.add('w3-show');
  } else {
    div.classList.remove('w3-show');
    div.classList.add('w3-hide');
  }
}

function showHide(divId) {
  let div = document.getElementById(divId);
  
  if (div.classList.contains('w3-hide')) {
    div.classList.remove('w3-hide');
    div.classList.add('w3-show');
  } else {
    div.classList.remove('w3-show');
    div.classList.add('w3-hide');
  }
}

function previewFormData(formData){
  // Loop through each input in the form
  for (let [key, value] of formData.entries()) {
    console.log(`${key}: ${value}`);
  }
}

async function getOfflineData() {
    const user_data = JSON.parse(localStorage.user);

    // Create data object to send
    const data = { "user_id": user_data.user_id, "role": user_data.role,  "get_offline_data":"" };
    // Create a FormData object since PHP expects form-data and not JSON
    var formData = new FormData();
    formData.append("user_id", user_data.user_id); formData.append("role", user_data.role); formData.append("get_offline_data", "");

    // Send a POST request with the data as JSON
    fetch('server/server.php', {  // Change this URL based on your PHP file location
        method: 'POST',
        //headers: { 'Content-Type': 'application/json' }, //This encoding confuses PHP. 
        body: formData //JSON.stringify(data)
    })
    .then(response => response.json())
    .then(data => {  
      if(data.success){ console.info(data.message); localStorage.offlineData = JSON.stringify(data.data); }else{
        console.warn(data.message);
      }
    }).catch((error) => console.error('Error:', error));
}

function validateLoginForm() {
    // Assuming you have a form with id="loginForm"
    var loginForm = document.getElementById("loginForm");
  
    if (!loginForm) {  // Check if the form exists on the page
        console.error('No form element found with id "loginForm"');
        return;
    }
  
    const isValidForm = loginForm.checkValidity();  // If form validation fails
    if (!isValidForm) {
        console.log('Form is not valid.');
        alert("Please fill out all fields correctly.");
        return;  // Stop execution of the function
    }
  
    const formData = new FormData(loginForm);  // Serialize the form data
    previewFormData(formData);
    fetch('server/server.php', {
      method: 'POST',
      body: formData, //headers: {'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'}
    }).then(response => {
      if (response.ok) {
        return response.text().then(text => {
            if (text) {
                return JSON.parse(text);
            } else {
                throw new Error('Empty response from server');
            }
        });
      } else {
          throw new Error('Network response was not ok');
      }
    }).then((data) => {
        if(data.success){
          localStorage.setItem('user', JSON.stringify(data.userData)); getOfflineData();
          alert("Login Successful");
          showHide("login_modal"); setTimeout(()=>{ location.href = "admin.html"; }, 5000);
        }else{ if(data.hasOwnProperty("message")){ alert("Message: "+data.message); }else{ alert("Error: "+data.error); } }
    }).catch((error) => {
        if (error instanceof SyntaxError) {
            console.error('Received non-JSON response:', error.message);
            alert('Unexpected response from server. Please try again.');
        } else {
            console.error(error);
            alert('An error occurred while logging in. Please try again.');
        }
    });
}
function validateRegForm() {
  // Assuming you have a form with id="loginForm"
  var loginForm = document.getElementById("signupForm");

  if (!loginForm) {  // Check if the form exists on the page
      console.error('No form element found with id "signupForm"');
      return;
  }

  const isValidForm = loginForm.checkValidity();  // If form validation fails
  if (!isValidForm) {
      console.log('Form is not valid.');
      alert("Please fill out all fields correctly.");
      return;  // Stop execution of the function
  }

  const formData = new FormData(loginForm);  // Serialize the form data
  previewFormData(formData);
  fetch('server/server.php', {
    method: 'POST',
    body: formData, //headers: {'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'}
  }).then(response => {
    if (response.ok) {
      return response.text().then(text => {
          if (text) {
              return JSON.parse(text);
          } else {
              throw new Error('Empty response from server');
          }
      });
    } else {
        throw new Error('Network response was not ok');
    }
  }).then((data) => {
      if(data.success){
        getOfflineData();
        alert("Registration Successful");
      }else{ if(data.hasOwnProperty("message")){ alert("Message: "+data.message); }else{ alert("Error: "+data.error); } }
  }).catch((error) => {
      if (error instanceof SyntaxError) {
          console.error('Received non-JSON response:', error.message);
          alert('Unexpected response from server. Please try again.');
      } else {
          console.error(error);
          alert('An error occurred while registering new user. Please try again.');
      }
  });
}
  // JavaScript implementation for the validateRegisterForm() function
  function validateRegistrationForm() {
    // Get the form data from the inputs
    const email = document.getElementById('email').value;
    const fname = document.getElementById('fname').value; const lname = document.getElementById('lname').value;
    const username = document.getElementById('reg_username').value;
    const password = document.getElementById('reg_password').value;
  
    // Validate all fields are filled out and if they meet requirements
    if (!email || !username || !password) {
      alert('Please fill out all fields!');
      return false;
    }
  
    const emailRegex = /^[^\s@]+@([\w-]+\.)+[\w-]{2,4}$/;
    if (!emailRegex.test(email)) {
      alert('Please enter a valid email address!');
      return false;
    }
  
    const usernameRegex = /^[A-Za-z0-9]+$/;
    if (username.length < 4 || !usernameRegex.test(username)) {
      alert('Username must be at least 4 characters long and only contain letters and numbers!');
      return false;
    }
  
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!#%*?&]{8,}$/;
    if (!passwordRegex.test(password)) {
      alert('Password must contain at least one uppercase letter, one lowercase letter, one number and one special character (@$!%*#?)');
      return false;
    }
  
    // Send the data to server.php using fetch() method in AJAX
    const formData = {
      email: email,
      fname: fname, lname: lname,
      username: username,
      password: password
    };
  
    console.log(formData);
  
    fetch('server/server.php', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(formData)
    })
      .then((response) => response.text())
      .then((data) => {
        if (data === 'New record created successfully') {
          alert('Registration successful!');
          // Clear the form and close modal after registration
          document.getElementById('signupForm').reset();
          $('#myModal').modal('close');
        } else {
          alert('Registration failed! Please try again.');
          console.log(data);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }
  
  function toggleLoginSignup(form){
    console.log("Form: " + form); // Check if a string is being passed correctly
    
    let regDiv = document.getElementById("signupFormContainer"); 
    let loginDiv = document.getElementById("loginFormContainer");
    
    if(form === "Login"){ // Using strict equality operator instead of loose equality to avoid false positives for falsy values like 0
      console.log("Showing Login form...");
      regDiv.classList.remove('w3-show'); regDiv.classList.add('w3-hide'); loginDiv.classList.remove('w3-hide'); loginDiv.classList.add('w3-show');
      
    }else if(form === "Registration"){ // Adding console logs to check for valid inputs
      console.log("Showing Registration form...");
      regDiv.classList.add('w3-show'); loginDiv.classList.remove('w3-show'); loginDiv.classList.add('w3-hide');
      console.warn("Trying to show Registration form"); 
    }else{
      alert("Invalid choice!"); 
      console.error("Form is not 'Login' or 'Registration'");
    }
  }

  
var mySidebar = document.getElementById("mySidebar"); // Get the Sidebar
var overlayBg = document.getElementById("myOverlay"); // Get the DIV with overlay effect

  // Toggle between showing and hiding the sidebar, and add overlay effect
function w3_open() {
        if (mySidebar.style.display === 'block') {
            mySidebar.style.display = 'none';
            overlayBg.style.display = "none";
        } else {
            mySidebar.style.display = 'block';
            overlayBg.style.display = "block";
        }
}

// Close the sidebar with the close button
function w3_close() { mySidebar.style.display = "none"; overlayBg.style.display = "none";  }

function logout(){ localStorage.clear(); location.reload(); }

function prepareHTMLComponents(){
    const userData = JSON.parse(localStorage.getItem("user"));
    document.getElementById("user_id").innerText = userData.first_name;

    if(window.location.href.includes('login.html')){

    }
}

function PROPER(str){ return str.toLowerCase().split(' ').map(function(word) { return word.replace(word[0], word[0].toUpperCase()); }).join(' ');}


window.onload = function() {
    if(localStorage.hasOwnProperty("user")){
      //if(JSON.parse(localStorage.getItem("user")).hasOwnProperty("user_id")){ prepareHTMLComponents(); }

      if(window.location.href.includes("index.html") || !window.location.href.includes(".")){
        //getOfflineData(); 
      }
      if(window.location.href.includes("admin.html")){  }
      if(window.location.href.includes("users.html")){ //getOfflineData(); showUsersGrid(); 
        alert("Loading data..."); 
      }

    }else{ 
      showHide("login_modal"); 
    }
}
