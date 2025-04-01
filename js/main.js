
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
          showHide("login_modal"); //setTimeout(()=>{ location.href = "users.html"; }, 5000);
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
  
var locationString="";
async function getLocationData() {
    function success(position) {
      const latitude  = position.coords.latitude;
      const longitude = position.coords.longitude;
      const accuracy  = position.coords.accuracy;
      const altitude = position.coords.altitude;
      const altitudeAccuracy = position.coords.altitudeAccuracy;
      const heading  = position.coords.accuracy;
      const speed = position.coords.speed;

      let locString= "latitude, "+latitude+"; longitude, "+longitude+"; accuracy, "+accuracy
      +"; altitude, "+altitude+"; altitudeAccuaracy, "+altitudeAccuracy+"; heading, "+heading+"; speed, "+speed;
      console.log(locString); locationSupport=true;
      locationString = locString;
        return locationString;
    }
  
    function showGeolocationError(error) {
        switch(error.code) {
          case error.PERMISSION_DENIED:
                alert("User denied the request for Geolocation.");
            break;
          case error.POSITION_UNAVAILABLE:
                alert("Location information is unavailable.");
            break;
          case error.TIMEOUT:
                alert("The request to get user location timed out.");
            break;
          case error.UNKNOWN_ERROR:
                alert("An unknown error occurred.");
            break;
        }
    }

    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser');
    } else {
        navigator.geolocation.getCurrentPosition(success, showGeolocationError);
    }
  
}

function deviceInfoStr(){
    function deviceInfo() {
        {
        /* test cases
            alert(
                'browserInfo result: OS: ' + browserInfo.os +' '+ browserInfo.osVersion + '\n'+
                    'Browser: ' + browserInfo.browser +' '+ browserInfo.browserVersion + '\n' +
                    'Mobile: ' + browserInfo.mobile + '\n' +
                    'Cookies: ' + browserInfo.cookies + '\n' +
                    'Screen Size: ' + browserInfo.screen
            );
        */
            var unknown = 'Unknown';
    
            // screen
            var screenSize = '';
            if (screen.width) {
                width = (screen.width) ? screen.width : '';
                height = (screen.height) ? screen.height : '';
                screenSize += '' + width + " x " + height;
            }
    
            //browser
            var nVer = navigator.appVersion;
            var nAgt = navigator.userAgent;
            var browser = navigator.appName;
            var version = '' + parseFloat(navigator.appVersion);
            var majorVersion = parseInt(navigator.appVersion, 10);
            var nameOffset, verOffset, ix;
    
            // Opera
            if ((verOffset = nAgt.indexOf('Opera')) != -1) {
                browser = 'Opera';
                version = nAgt.substring(verOffset + 6);
                if ((verOffset = nAgt.indexOf('Version')) != -1) {
                    version = nAgt.substring(verOffset + 8);
                }
            }
            // MSIE
            else if ((verOffset = nAgt.indexOf('MSIE')) != -1) {
                browser = 'Microsoft Internet Explorer';
                version = nAgt.substring(verOffset + 5);
            }
    
            //IE 11 no longer identifies itself as MS IE, so trap it
            //http://stackoverflow.com/questions/17907445/how-to-detect-ie11
            else if ((browser == 'Netscape') && (nAgt.indexOf('Trident/') != -1)) {
    
                browser = 'Microsoft Internet Explorer';
                version = nAgt.substring(verOffset + 5);
                if ((verOffset = nAgt.indexOf('rv:')) != -1) {
                    version = nAgt.substring(verOffset + 3);
                }
    
            }
    
            // Chrome
            else if ((verOffset = nAgt.indexOf('Chrome')) != -1) {
                browser = 'Chrome';
                version = nAgt.substring(verOffset + 7);
            }
            // Safari
            else if ((verOffset = nAgt.indexOf('Safari')) != -1) {
                browser = 'Safari';
                version = nAgt.substring(verOffset + 7);
                if ((verOffset = nAgt.indexOf('Version')) != -1) {
                    version = nAgt.substring(verOffset + 8);
                }
    
                // Chrome on iPad identifies itself as Safari. Actual results do not match what Google claims
                //  at: https://developers.google.com/chrome/mobile/docs/user-agent?hl=ja
                //  No mention of chrome in the user agent string. However it does mention CriOS, which presumably
                //  can be keyed on to detect it.
                if (nAgt.indexOf('CriOS') != -1) {
                    //Chrome on iPad spoofing Safari...correct it.
                    browser = 'Chrome';
                    //Don't believe there is a way to grab the accurate version number, so leaving that for now.
                }
            }
            // Firefox
            else if ((verOffset = nAgt.indexOf('Firefox')) != -1) {
                browser = 'Firefox';
                version = nAgt.substring(verOffset + 8);
            }
            // Other browsers
            else if ((nameOffset = nAgt.lastIndexOf(' ') + 1) < (verOffset = nAgt.lastIndexOf('/'))) {
                browser = nAgt.substring(nameOffset, verOffset);
                version = nAgt.substring(verOffset + 1);
                if (browser.toLowerCase() == browser.toUpperCase()) {
                    browser = navigator.appName;
                }
            }
            // trim the version string
            if ((ix = version.indexOf(';')) != -1) version = version.substring(0, ix);
            if ((ix = version.indexOf(' ')) != -1) version = version.substring(0, ix);
            if ((ix = version.indexOf(')')) != -1) version = version.substring(0, ix);
    
            majorVersion = parseInt('' + version, 10);
            if (isNaN(majorVersion)) {
                version = '' + parseFloat(navigator.appVersion);
                majorVersion = parseInt(navigator.appVersion, 10);
            }
    
            // mobile version
            var mobile = /Mobile|mini|Fennec|Android|iP(ad|od|hone)/.test(nVer);
    
            // cookie
            var cookieEnabled = (navigator.cookieEnabled) ? true : false;
    
            if (typeof navigator.cookieEnabled == 'undefined' && !cookieEnabled) {
                document.cookie = 'testcookie';
                cookieEnabled = (document.cookie.indexOf('testcookie') != -1) ? true : false;
            }
    
            // system
            var os = unknown;
            var clientStrings = [
                {s:'Windows 3.11', r:/Win16/},
                {s:'Windows 95', r:/(Windows 95|Win95|Windows_95)/},
                {s:'Windows ME', r:/(Win 9x 4.90|Windows ME)/},
                {s:'Windows 98', r:/(Windows 98|Win98)/},
                {s:'Windows CE', r:/Windows CE/},
                {s:'Windows 2000', r:/(Windows NT 5.0|Windows 2000)/},
                {s:'Windows XP', r:/(Windows NT 5.1|Windows XP)/},
                {s:'Windows Server 2003', r:/Windows NT 5.2/},
                {s:'Windows Vista', r:/Windows NT 6.0/},
                {s:'Windows 7', r:/(Windows 7|Windows NT 6.1)/},
                {s:'Windows 8.1', r:/(Windows 8.1|Windows NT 6.3)/},
                {s:'Windows 8', r:/(Windows 8|Windows NT 6.2)/},
                {s:'Windows NT 4.0', r:/(Windows NT 4.0|WinNT4.0|WinNT|Windows NT)/},
                {s:'Windows ME', r:/Windows ME/},
                {s:'Android', r:/Android/},
                {s:'Open BSD', r:/OpenBSD/},
                {s:'Sun OS', r:/SunOS/},
                {s:'Linux', r:/(Linux|X11)/},
                {s:'iOS', r:/(iPhone|iPad|iPod)/},
                {s:'Mac OS X', r:/Mac OS X/},
                {s:'Mac OS', r:/(MacPPC|MacIntel|Mac_PowerPC|Macintosh)/},
                {s:'QNX', r:/QNX/},
                {s:'UNIX', r:/UNIX/},
                {s:'BeOS', r:/BeOS/},
                {s:'OS/2', r:/OS\/2/},
                {s:'Search Bot', r:/(nuhk|Googlebot|Yammybot|Openbot|Slurp|MSNBot|Ask Jeeves\/Teoma|ia_archiver)/}
            ];
            for (var id in clientStrings) {
                var cs = clientStrings[id];
                if (cs.r.test(nAgt)) {
                    os = cs.s;
                    break;
                }
            }
    
            var osVersion = unknown;
    
            if (/Windows/.test(os)) {
                osVersion = /Windows (.*)/.exec(os)[1];
                os = 'Windows';
            }
    
            switch (os) {
                case 'Mac OS X':
                    osVersion = /Mac OS X (10[\.\_\d]+)/.exec(nAgt)[1];
                    break;
    
                case 'Android':
                    osVersion = /Android ([\.\_\d]+)/.exec(nAgt)[1];
                    break;
    
                case 'iOS':
                    osVersion = /OS (\d+)_(\d+)_?(\d+)?/.exec(nVer);
                    osVersion = osVersion[1] + '.' + osVersion[2] + '.' + (osVersion[3] | 0);
                    break;
    
            }
        }
    
        return window.browserInfo = {
            screen: screenSize,
            browser: browser,
            browserVersion: version,
            mobile: mobile,
            os: os,
            osVersion: osVersion,
            cookies: cookieEnabled
        };
    };
    let info=deviceInfo();
    const cols=Object.keys(info); const data=Object.values(info); let strInfo="";
    for (var i=0; i<cols.length; i++){
        strInfo +=cols[i]+"="+data[i]+";";
    }
    strInfo +="osArchitecture="+platform.os.architecture+"; osFamily="+platform.os.family+";";
    strInfo +="description="+platform.description+"; manufacturer="+platform.manufacturer+";";
    strInfo +="name="+platform.name+", product="+platform.product+",";
    strInfo +="userAgent="+platform.ua;
    return strInfo;
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
    getLocationData();
    if(localStorage.hasOwnProperty("user")){
      if(JSON.parse(localStorage.getItem("user")).hasOwnProperty("user_id")){ prepareHTMLComponents(); }

      if(window.location.href.includes("index.html") || !window.location.href.includes(".")){
        //getOfflineData(); 
      }
      if(window.location.href.includes("admin.html")){ displayProducts(productData); }
      if(window.location.href.includes("users.html")){ getOfflineData(); showUsersGrid(); alert("Loading data..."); }

    }else{ 
      showHide("login_modal"); 
    }
}
