function showUsersGrid(){
  const offlineData = JSON.parse(localStorage.offlineData);

  // Filter out unwanted columns from users data
  const filteredColumns = offlineData.staff.map(user => {
      // Destructure to exclude specific properties
      const { password_hash, username, ...filteredUsers } = user;
      return filteredUsers;
  });
  
  setTimeout(() => {
    const users_table = new gridjs.Grid({
      data: filteredColumns,
      pagination: true,
      search: true,
      sort: true,
      resizable: true,
    });
    
    document.getElementById("gridjs-wrapper").innerHTML="";
    users_table.on('rowClick', (...args) => extractDataFromGridJS(args));
    
    users_table.render(document.getElementById("gridjs-wrapper"));
  }, 5000);
}

function showRegistrationForm(){
    document.getElementById('login_modal').classList.remove('w3-light-gray');
    document.getElementById('toggleButton').classList.add('w3-hide'); 
    document.getElementById('closeRegBtn').classList.remove('w3-hide'); document.getElementById('closeRegBtn').classList.add('w3-show');
    toggleLoginSignup('Registration'); 
    showHide('login_modal');
}