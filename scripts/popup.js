var password = "";
var username = "";
var dataToReturn = "";
var dataPresentation = "";
var extraClassToCheck = "";
var return_Custom = "";

chrome.storage.local.get({
    password: "",
    username: "",
    dataToReturn: "return_WebSessions",
    dataPresentation: "show_Visible",
    extraClassToCheck: "",
    return_Custom: ""
  }, function(items) {
    password = items.password;
    username = items.username;
    dataToReturn = items.dataToReturn;
    dataPresentation = items.dataPresentation;
    extraClassToCheck = items.extraClassToCheck;
    return_Custom = items.return_Custom;
  });

window.onload = function() {
	setTimeout(function(){
		injectScript();
	}, 100);
};

function injectScript(){
	if (password.length > 3 && username.length > 3) {
		chrome.windows.getCurrent(function (currentWindow) {
			chrome.tabs.query({active: true, windowId: currentWindow.id, }, function(activeTabs) {
				chrome.tabs.executeScript(activeTabs[0].id, {file: 'scripts/jq.js', allFrames: true});
				chrome.tabs.executeScript(activeTabs[0].id, {file: 'scripts/check_emails.js', allFrames: true});
			});
		});
		document.getElementById("success").innerHTML = "Running on page now!";
		document.getElementById("success").style.display = "block";
	} else {
		document.getElementById("error").innerHTML = "You must save your API keys in the <a target='_blank' href='options.html'>options</a> before this will work";
		document.getElementById("error").style.display = "block";
	}
}

var currentDomain;
chrome.runtime.onMessage.addListener(
	function(request, sender, sendResponse) {
		if (request.currentDomain != null){
			currentDomain = request.currentDomain;
			sendResponse({msg: "received"});
			var searchIntercomUrl = "https://app.intercom.io/apps/"+username+"/users?search=";
			document.getElementById("success").innerHTML = "Running on page now! <a href='"+searchIntercomUrl+currentDomain+"' target='_blank'>Or click here to search Intercom for "+currentDomain+"</a>";
		}

		if (request.completedScan == "true"){
			sendResponse({msg2: "received"});
			var searchIntercomUrl = "https://app.intercom.io/apps/"+username+"/users?search=";
			if (request.numberEmailsFound > 0) {
				document.getElementById("error").style.display = "none";
				document.getElementById("warning").style.display = "none";
				document.getElementById("success").innerHTML = "Completed scan of page, checked "+request.numberEmailsChecked+" email(s) on the page and found "+request.numberEmailsFound+" results. <a href='"+searchIntercomUrl+currentDomain+"' target='_blank'>You can click here to search Intercom for "+currentDomain+"</a>";
				document.getElementById("success").style.display = "block";
			} else if(request.numberEmailsChecked == 0) {
				document.getElementById("success").style.display = "none";
				document.getElementById("warning").style.display = "none";
				document.getElementById("error").innerHTML = "Completed scan of page, but found no email(s) to check. <a href='"+searchIntercomUrl+currentDomain+"' target='_blank'>However you can click here to search Intercom for any users containing "+currentDomain+"</a>";
				document.getElementById("error").style.display = "block";
			} else if(request.numberEmailsChecked > 0 && request.numberEmailsFound == 0){
				document.getElementById("success").style.display = "none";
				document.getElementById("error").style.display = "none";
				document.getElementById("warning").innerHTML = "Completed scan of page, found "+request.numberEmailsChecked+" email(s) but did not find them in Intercom. <a href='"+searchIntercomUrl+currentDomain+"' target='_blank'>However, you can still check Intercom for any users with '"+currentDomain+"'</a>";
				document.getElementById("warning").style.display = "block";
			}
		} else if(request.completedScan == "scanning page"){
			document.getElementById("success").style.display = "none";
			document.getElementById("error").style.display = "none";
			document.getElementById("warning").innerHTML = "Scanning page. <a href='"+searchIntercomUrl+currentDomain+"' target='_blank'>Click here to search for all users in Intercom containing "+currentDomain+" while you wait!</a>";
			document.getElementById("warning").style.display = "block";
		}
	});
