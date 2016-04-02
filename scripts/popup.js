var password = "";
var username = "";
var dataToReturn = "";

chrome.storage.local.get('password', function (result) {password = result.password;});
chrome.storage.local.get('username', function (result) {username = result.username;});
chrome.storage.local.get('dataToReturn', function (result) {dataToReturn = result.dataToReturn;});

window.onload = function() {
	// document.getElementById('runScript').addEventListener('click', runButtonF);
	setTimeout(function(){
		injectScript();
	}, 100);
};

function injectScript(){
	if (password.length > 3 && username.length > 3 && dataToReturn.length > 3) {
		chrome.windows.getCurrent(function (currentWindow) {
			chrome.tabs.query({active: true, windowId: currentWindow.id}, function(activeTabs) {
				chrome.tabs.executeScript(activeTabs[0].id, {file: 'scripts/jq.js', allFrames: true});
				chrome.tabs.executeScript(activeTabs[0].id, {file: 'scripts/check_emails.js', allFrames: true});
			});
		});
		document.getElementById("success").innerHTML = "Running on page now!";
		document.getElementById("success").style.display = "block";
	} else {
		document.getElementById("error").innerHTML = "Please save your API keys in the <a href='options.html'>options</a> first";
		document.getElementById("success").style.display = "block";
	}
}

// function runButtonF() {
// 	injectScript();
// 	window.close();
// }