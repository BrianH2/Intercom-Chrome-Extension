window.onload = function() {
  restore_options();
  document.getElementById('save').addEventListener('click',save_options);
  document.getElementById('close').addEventListener('click',close_window);
}

// try to restore api and app id if they exist
function restore_options() {
  chrome.storage.local.get({
    password: "",
    username: "",
  }, function(items) {
    document.getElementById('password').value = items.password;
    document.getElementById('username').value = items.username;
  });
}


// Saves options to chrome.storage
function save_options() {
  var password = document.getElementById("password").value;
  var username = document.getElementById("username").value;

  document.getElementById('error').style.display="none";
  document.getElementById('success').style.display="none";

  if (password.length < 10 || username.length < 5) {
    document.getElementById('error').style.display="block";
  } else {
    chrome.storage.local.set({
      password: password,
      username: username
    }, function() {
      document.getElementById('success').style.display="block";
    });
  }
}

function close_window(){
  window.close();
}
