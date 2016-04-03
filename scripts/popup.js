var password = "";
var username = "";
var dataToReturn = "";
var dataPresentation = "";
var extraClassToCheck = "";

chrome.storage.local.get({
    password: "",
    username: "",
    dataToReturn: "return_Name",
    dataPresentation: "show_Visible",
    extraClassToCheck: ""
  }, function(items) {
    password = items.password;
    username = items.username;
    dataToReturn = items.dataToReturn;
    dataPresentation = items.dataPresentation;
    extraClassToCheck = items.extraClassToCheck;
  });

window.onload = function() {
	// document.getElementById('runScript').addEventListener('click', runButtonF);
	setTimeout(function(){
		injectScript();
	}, 100);
};

function injectScript(){
	if (password.length > 3 && username.length > 3) {
		chrome.windows.getCurrent(function (currentWindow) {
			chrome.tabs.query({active: true, windowId: currentWindow.id}, function(activeTabs) {
				chrome.tabs.executeScript(activeTabs[0].id, {file: 'scripts/jq.js', allFrames: true});
				chrome.tabs.executeScript(activeTabs[0].id, {file: 'scripts/check_emails.js', allFrames: true});
			});
		});
		document.getElementById("success").innerHTML = "Running on page now!";
		document.getElementById("success").style.display = "block";
	} else {
		document.getElementById("error").innerHTML = "You must save your API keys in the <a href='options.html'>options</a> before this will work";
		document.getElementById("error").style.display = "block";
	}
}

// function runButtonF() {
// 	injectScript();
// 	window.close();
// }
