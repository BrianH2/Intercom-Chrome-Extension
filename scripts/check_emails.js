function concat_collection(obj1, obj2) {
    var i;
    var arr  = new Array();
    var len1 = obj1.length;
    var len2 = obj2.length;
    for (i=0; i<len1; i++) {
        arr.push(obj1[i]);
    }
    for (i=0; i<len2; i++) {
        arr.push(obj2[i]);
    }
    return arr;
}

var password = "";
var username = "";
var dataToReturn = "";
var return_Custom = "";
var dataPresentation = "";
var extraClassToCheck = "";
var allEmailsOnPage;
var IntChrClassName = "IntercomChrExtBH";
var timeNow = Math.floor(new Date().getTime() / 1000);

chrome.storage.local.get('password', function (result) {password = result.password;});
chrome.storage.local.get('username', function (result) {username = result.username;});
chrome.storage.local.get('dataToReturn', function (result) {dataToReturn = result.dataToReturn;});
chrome.storage.local.get('return_Custom', function (result) {return_Custom = result.return_Custom;});
chrome.storage.local.get('dataPresentation', function (result) {dataPresentation = result.dataPresentation;});
chrome.storage.local.get('extraClassToCheck', function (result) {extraClassToCheck = result.extraClassToCheck;});

// remove all existing elements from extension on page
var existingExtensionElements = document.querySelectorAll("."+IntChrClassName);
// console.log(existingExtensionElements);
for (var i = existingExtensionElements.length - 1; i >= 0; i--) {
	existingExtensionElements[i].parentNode.removeChild(existingExtensionElements[i]);
}

setTimeout(function(){
	allEmailsOnPage = document.querySelectorAll('a[href^="mailto:"]');
	salesForceEmailsOnPage = document.querySelectorAll('.uiOutputEmail');
	allEmailsOnPage = concat_collection(allEmailsOnPage, salesForceEmailsOnPage);
	if (extraClassToCheck.length > 1) {
		var allOtherEmailsOnPage = document.querySelectorAll('.'+extraClassToCheck);
		allEmailsOnPage = concat_collection(allEmailsOnPage,allOtherEmailsOnPage);
	}
	// console.log(allEmailsOnPage);
	if (allEmailsOnPage.length == 0 ) {
		chrome.runtime.sendMessage({
	    	completedScan: "true",
	    	numberEmailsChecked: allEmailsOnPage.length,
	    	numberEmailsFound: 0
    	},function(response) {});
	} else {
		addIntercomData();
	}
}, 100);

var numberEmailsFound = 0;
var currentEmailChecking = 0;
function addIntercomData() { 
	var searchIntercomUrl = "https://app.intercom.io/apps/"+username+"/users?search=";
	var currentDomain = document.location.hostname;
	currentDomain = currentDomain.replace("www.","");
	chrome.runtime.sendMessage({
      currentDomain: currentDomain
    },
    function(response) {});

	jQuery.each(allEmailsOnPage, function (i, item) {
		var infoSpan = document.createElement('span');
		if (item.hasAttribute("href")) {
			var email = item.href;
			email = email.match(/mailto:([^\?]*)/);
			email = email[1]?email[1]:false;
		} else {
			var emailRegex = /(?:[a-z0-9!#$%&'*+\/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+\/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/gm
			email = (item.innerHTML).match(emailRegex)[0];
		}

		item.style.color='blue';
		item.style.background='yellow';
	    jQuery.ajax({
	        url: "https://api.intercom.io/users?email="+encodeURIComponent(email),
	        type: "GET",
	        beforeSend: function(request){
	        	request.setRequestHeader("Accept", "application/json");
	        	request.setRequestHeader("Authorization", "Basic " + btoa(username + ":" + password));
	        },
	        error:function (xhr, ajaxOptions, thrownError){
	        	currentEmailChecking = currentEmailChecking + 1;
			    if(xhr.status==404) {
			        iconImage = "<img style='width:20px; -webkit-filter: grayscale(100%);' src='"+chrome.extension.getURL('images/logo.png')+"' alt='Intercom Chrome Extension'>";
			        if (dataPresentation == "show_Visible") {
						infoSpan.innerHTML = " " + iconImage + " not found";
					} else {
						infoSpan.innerHTML = "<span class='tooltip'>" + iconImage + "<span class='tooltiptext'>Not found</span></span></span>";
					}
					infoSpan.setAttribute('title', "No user found matching "+email);
					infoSpan.setAttribute('class', IntChrClassName);
					allEmailsOnPage[i].parentNode.insertBefore(infoSpan, allEmailsOnPage[i].nextSibling);
			    }

			    if (currentEmailChecking == allEmailsOnPage.length) {
					chrome.runtime.sendMessage({
				    	completedScan: "true",
				    	numberEmailsChecked: allEmailsOnPage.length,
				    	numberEmailsFound: numberEmailsFound
			    	},function(response) {});
				} else {
					chrome.runtime.sendMessage({
				    	completedScan: "scanning page"
			    	},function(response) {});
				}
			}
	        // cache: false
	    }).done(function (result) {
	        // console.log(result);
	        numberEmailsFound = numberEmailsFound + 1;
	        currentEmailChecking = currentEmailChecking + 1;
	        // console.log(numberEmailsFound);
	        var emailIntercom = result["email"];
			var webSessions = result["session_count"];
			var location = result["location_data"]["city_name"] + ", " + result["location_data"]["region_name"] + ", " + result["location_data"]["country_name"]
			var signed_up_at = result["signed_up_at"];
			var name = result["name"];
			var minsInDay = 24*60*60;
			var daysSinceSignup = Math.floor( (timeNow - signed_up_at) / minsInDay);

			iconImage = "<img style='width:20px;' src='"+chrome.extension.getURL('images/logo.png')+"' alt='Intercom Chrome Extension'>";
			if (dataPresentation == "show_Visible") {
				// if (webSessions > 3) {
				// 	webSessionsSTYLE = "color:green;";
				// } else {
				// 	webSessionsSTYLE = "color:grey;";
				// }
				if (dataToReturn == "return_WebSessions") {
					infoSpan.innerHTML = " <a style='font-weight:bold' href='"+searchIntercomUrl+email+"' target='_blank'> "+iconImage+" <span style='"+webSessionsSTYLE+"'>"+webSessions+" web sessions</span></a>";
				} else if(dataToReturn == "return_DaysSignup") {
					infoSpan.innerHTML = " <a style='font-weight:bold' href='"+searchIntercomUrl+email+"' target='_blank'> "+iconImage+" "+daysSinceSignup+" days</a>";
				} else if(dataToReturn == "return_Location") {
					infoSpan.innerHTML = " <a style='font-weight:bold' href='"+searchIntercomUrl+email+"' target='_blank'> "+iconImage+" "+location+"</a>";
				} else if(dataToReturn == "return_Name") {
					infoSpan.innerHTML = " <a style='font-weight:bold' href='"+searchIntercomUrl+email+"' target='_blank'> "+iconImage+" "+name+"</a>";
				} else if(dataToReturn == "return_Custom") {
					var custom_attribute = result["custom_attributes"][return_Custom];
					if (custom_attribute == null) {custom_attribute = "unknown";}
					infoSpan.innerHTML = " <a style='font-weight:bold' href='"+searchIntercomUrl+email+"' target='_blank'> "+iconImage+" "+custom_attribute+"</a>";
				}
				infoSpan.setAttribute('title', emailIntercom + " | " + name); 
			} else {
				// append CSS
				var css = 'a.tooltipIntChrExt::before {content: attr(data-tip);font-size: 13px;position:absolute;z-index: 999;white-space:nowrap;bottom:9999px;left: 50%; background: #DBEEFF;border-radius:2px; color: #000000;border: #4A8EE2 1px solid;padding:4px 10px 7px;opacity: 1;  transition:opacity 1s ease-out;} a.tooltipIntChrExt:hover::before {opacity: 1;bottom:-35px;}',
				    head = document.head || document.getElementsByTagName('head')[0],
				    style = document.createElement('style');
				style.type = 'text/css';
				if (style.styleSheet){
				  style.styleSheet.cssText = css;
				} else {
				  style.appendChild(document.createTextNode(css));
				}
				head.appendChild(style);

				if (dataToReturn == "return_WebSessions") {
					infoSpan.innerHTML = " <a class='tooltipIntChrExt' data-tip='"+webSessions+" web sessions' href='"+searchIntercomUrl+email+"' target='_blank'>"+iconImage+"</a>";
					infoSpan.setAttribute('title', webSessions+" web sessions");
				} else if(dataToReturn == "return_DaysSignup") {
					infoSpan.innerHTML = " <a class='tooltipIntChrExt' data-tip='"+daysSinceSignup+" days since sign up' href='"+searchIntercomUrl+email+"' target='_blank'>"+iconImage+"</a>";
					infoSpan.setAttribute('title', daysSinceSignup+" days since sign up");
				} else if(dataToReturn == "return_Location") {
					infoSpan.innerHTML = " <a class='tooltipIntChrExt' data-tip='"+location+"' href='"+searchIntercomUrl+email+"' target='_blank'>"+iconImage+"</a>";
					infoSpan.setAttribute('title', location);
				} else if(dataToReturn == "return_Name") {
					infoSpan.innerHTML = " <a class='tooltipIntChrExt' data-tip='"+name+"' href='"+searchIntercomUrl+email+"' target='_blank'>"+iconImage+"</a>";
					infoSpan.setAttribute('title', name);
				} else if(dataToReturn == "return_Custom") {
					var custom_attribute = result["custom_attributes"][return_Custom];
					if (custom_attribute == null) {custom_attribute = "unknown";}
					infoSpan.innerHTML = " <a class='tooltipIntChrExt' data-tip='"+custom_attribute+"' href='"+searchIntercomUrl+email+"' target='_blank'>"+iconImage+"</a>";
					infoSpan.setAttribute('title', custom_attribute);
				}
			}

			infoSpan.setAttribute('class', IntChrClassName);
			allEmailsOnPage[i].parentNode.insertBefore(infoSpan, allEmailsOnPage[i].nextSibling);
			if (currentEmailChecking == allEmailsOnPage.length) {
				chrome.runtime.sendMessage({
			    	completedScan: "true",
			    	numberEmailsChecked: allEmailsOnPage.length,
			    	numberEmailsFound: numberEmailsFound
		    	},function(response) {});
			} else {
					chrome.runtime.sendMessage({
				    	completedScan: "scanning page"
			    	},function(response) {});
				}
	    });
	});
}
