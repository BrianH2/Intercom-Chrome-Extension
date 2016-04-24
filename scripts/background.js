chrome.runtime.onInstalled.addListener(function (object) {
	if (object.reason == "install") {
		chrome.tabs.create({url: "/welcome.html"}, function (tab) {});
	}
});
