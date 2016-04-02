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
var IntChrClassName = "IntercomChrExtBH";
var timeNow = Math.floor(new Date().getTime() / 1000);

chrome.storage.local.get('password', function (result) {password = result.password;});
chrome.storage.local.get('username', function (result) {username = result.username;});
chrome.storage.local.get('dataToReturn', function (result) {dataToReturn = result.dataToReturn;});

var allEmailsOnPage = document.querySelectorAll('a[href^="mailto:"]');
var allUserEmailsOnPage = document.querySelectorAll('.user-email');
allEmailsOnPage = concat_collection(allEmailsOnPage,allUserEmailsOnPage);

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
		var email = item.text;
		item.style.color='blue';
		item.style.background='yellow';
	    jQuery.ajax({
	        url: "https://api.intercom.io/users?email="+encodeURIComponent(email),
	        type: "GET",
	        beforeSend: function(request){
	        	request.setRequestHeader("Accept", "application/json");
	        	request.setRequestHeader("Authorization", "Basic " + btoa(username + ":" + password));
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

			if (webSessions > 3) {
				webSessionsSTYLE = "color:green;";
			} else {
				webSessionsSTYLE = "color:grey;";
			}

			iconImage = "<img src='"+chrome.extension.getURL('images/logo20.png')+"' alt='Intercom Chrome Extension'>";

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
			infoSpan.setAttribute('class', IntChrClassName);
			allEmailsOnPage[i].parentNode.insertBefore(infoSpan, allEmailsOnPage[i].nextSibling);
	    });
	});
}








