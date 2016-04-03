var password = "";
var username = "";
var dataToReturn = "";
var dataPresentation = "";
var IntChrClassName = "IntercomChrExtBH";
var timeNow = Math.floor(new Date().getTime() / 1000);

chrome.storage.local.get('password', function (result) {password = result.password;});
chrome.storage.local.get('username', function (result) {username = result.username;});
chrome.storage.local.get('dataToReturn', function (result) {dataToReturn = result.dataToReturn;});
chrome.storage.local.get('dataPresentation', function (result) {dataPresentation = result.dataPresentation;});

var allEmailsOnPage = document.querySelectorAll('a[href^="mailto:"]');

// remove all existing elements from extension on page
var existingExtensionElements = document.querySelectorAll("."+IntChrClassName);
// console.log(existingExtensionElements);
for (var i = existingExtensionElements.length - 1; i >= 0; i--) {
	existingExtensionElements[i].parentNode.removeChild(existingExtensionElements[i]);
}

// need delay to load jQuery if not there
setTimeout(function(){
	addIntercomData();
}, 100);

function addIntercomData() { 
	jQuery.each(allEmailsOnPage, function (i, item) {
		var infoSpan = document.createElement('span');
		var email = item.href;
		email = email.match(/mailto:([^\?]*)/);
		email = email[1]?email[1]:false;

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
			}
	        // cache: false
	    }).done(function (result) {
	        // console.log(result);
	        var emailIntercom = result["email"];
			var webSessions = result["session_count"];
			var location = result["location_data"]["city_name"] + ", " + result["location_data"]["region_name"] + ", " + result["location_data"]["country_name"]
			var signed_up_at = result["signed_up_at"];
			var name = result["name"];
			var minsInDay = 24*60*60;
			var daysSinceSignup = Math.floor( (timeNow - signed_up_at) / minsInDay);

			iconImage = "<img style='width:20px;' src='"+chrome.extension.getURL('images/logo.png')+"' alt='Intercom Chrome Extension'>";
			if (dataPresentation == "show_Visible") {
				if (webSessions > 3) {
					webSessionsSTYLE = "color:green;";
				} else {
					webSessionsSTYLE = "color:grey;";
				}
				if (dataToReturn == "return_WebSessions") {
					infoSpan.innerHTML = " <a style='font-weight:bold' href='https://app.intercom.io/apps/eqe7kbcu/users?search="+email+"' target='_blank'> "+iconImage+" <span style='"+webSessionsSTYLE+"'>"+webSessions+" web sessions</span></a>";
				} else if(dataToReturn == "return_DaysSignup") {
					infoSpan.innerHTML = " <a style='font-weight:bold' href='https://app.intercom.io/apps/eqe7kbcu/users?search="+email+"' target='_blank'> "+iconImage+" "+daysSinceSignup+" days</a>";
				} else if(dataToReturn == "return_Location") {
					infoSpan.innerHTML = " <a style='font-weight:bold' href='https://app.intercom.io/apps/eqe7kbcu/users?search="+email+"' target='_blank'> "+iconImage+" "+location+"</a>";
				} else if(dataToReturn == "return_Name") {
					infoSpan.innerHTML = " <a style='font-weight:bold' href='https://app.intercom.io/apps/eqe7kbcu/users?search="+email+"' target='_blank'> "+iconImage+" "+name+"</a>";
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
					infoSpan.innerHTML = " <a class='tooltipIntChrExt' data-tip='"+webSessions+" web sessions' href='https://app.intercom.io/apps/eqe7kbcu/users?search="+email+"' target='_blank'>"+iconImage+"</a>";
					infoSpan.setAttribute('title', webSessions+" web sessions");
				} else if(dataToReturn == "return_DaysSignup") {
					infoSpan.innerHTML = " <a class='tooltipIntChrExt' data-tip='"+daysSinceSignup+" days since sign up' href='https://app.intercom.io/apps/eqe7kbcu/users?search="+email+"' target='_blank'>"+iconImage+"</a>";
					infoSpan.setAttribute('title', daysSinceSignup+" days since sign up");
				} else if(dataToReturn == "return_Location") {
					infoSpan.innerHTML = " <a class='tooltipIntChrExt' data-tip='"+location+"' href='https://app.intercom.io/apps/eqe7kbcu/users?search="+email+"' target='_blank'>"+iconImage+"</a>";
					infoSpan.setAttribute('title', location);
				} else if(dataToReturn == "return_Name") {
					infoSpan.innerHTML = " <a class='tooltipIntChrExt' data-tip='"+name+"' href='https://app.intercom.io/apps/eqe7kbcu/users?search="+email+"' target='_blank'>"+iconImage+"</a>";
					infoSpan.setAttribute('title', name);
				}
			}

			infoSpan.setAttribute('class', IntChrClassName);
			allEmailsOnPage[i].parentNode.insertBefore(infoSpan, allEmailsOnPage[i].nextSibling);
	    });
	});
}
