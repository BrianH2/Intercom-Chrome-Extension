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
  var dataPresentation = $('input[name="dataPresentation"]:checked').val();
  var extraClassToCheck = document.getElementById('extraClassToCheck').value;
  var return_Custom = document.getElementById('return_Custom').value;

  // if (password.length < 4 || username.length < 4) {
  //   document.getElementById('error').textContent = "PLEASE ENTER REAL API KEYS";
  //   document.getElementById('error').style.display="block";
  //   setTimeout(function() {
  //     document.getElementById('error').style.display="none";
  //   }, 2000);
  // }

  chrome.storage.local.set({
    password: password,
    username: username,
    dataToReturn: dataToReturn,
    dataPresentation: dataPresentation,
    extraClassToCheck: extraClassToCheck,
    return_Custom: return_Custom
  }, function() {
    document.getElementById('success').style.display="block";
    setTimeout(function() {
      document.getElementById('success').style.display="none";
    }, 1500);
  });
}

function restore_options() {
  chrome.storage.local.get({
    password: "",
    username: "",
    dataToReturn: "return_WebSessions",
    dataPresentation: "show_Visible",
    extraClassToCheck: "",
    return_Custom: ""
  }, function(items) {
    document.getElementById('password').value = items.password;
    document.getElementById('username').value = items.username;
    $('input[value="'+items.dataToReturn+'"]').attr("checked","true");
    $('input[value="'+items.dataPresentation+'"]').attr("checked","true");
    document.getElementById('extraClassToCheck').value = items.extraClassToCheck;
    document.getElementById('return_Custom').value = items.return_Custom;
  });
}

function close_window(){
  window.close();
}
