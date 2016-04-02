window.onload = function() {
  restore_options();
  document.getElementById('save').addEventListener('click',save_options);
  document.getElementById('close').addEventListener('click',close_window);
}

// Saves options to chrome.storage
function save_options() {
  var password = document.getElementById("password").value;
  var username = document.getElementById("username").value;
  var dataToReturn = $('input[name="dataToReturn"]:checked').val();

  if (password.length < 4 || username.length < 4) {
    document.getElementById('status').textContent = "PLEASE ENTER REAL API KEYS";
  }

  chrome.storage.local.set({
    password: password,
    username: username,
    dataToReturn: dataToReturn
  }, function() {
    // Update status to let user know options were saved.
    document.getElementById('success').style.display="block";
    setTimeout(function() {
      document.getElementById('success').style.display="none";
    }, 1500);
  });
}


// Restores select box and checkbox state using the preferences
// stored in chrome.storage.
function restore_options() {
  // Use default value color = 'red' and likesColor = true.
  chrome.storage.local.get({
    password: "",
    username: "",
    dataToReturn: "return_Name"
  }, function(items) {
    document.getElementById('password').value = items.password;
    document.getElementById('username').value = items.username;
    $('input[value="'+items.dataToReturn+'"]').attr("checked","true");
  });
}

function close_window(){
  window.close();
}
