# Intercom-Chrome-Extension
A Google Chrome Extension for Intercom. Checks Intercom for emails found on the page and returns information and a link to the user. Learn more [here](http://brianh2.github.io/Intercom-Chrome-Extension/).

### Table of Contents
* [Installation](#installation)
* [Usage](#usage)
* [Permissions](#permissions)
* [Disclaimer](#disclaimer)

## Installation
### Option 1: From the Chrome Store
Install from the Chrome Extension Store here: [https://chrome.google.com/webstore/detail/intercom-chrome-extension/nacbmbmlibonpmhhacnnliibhpdpkpjl](https://chrome.google.com/webstore/detail/intercom-chrome-extension/nacbmbmlibonpmhhacnnliibhpdpkpjl)

### Option 2: Install Locally (will not auto-update)
1. Download the zip file of this repo
2. Unzip and move somewhere you won't delete it
3. Open Chrome
4. Go to Menu > More Tools > Extensions
5. Check the box "Developer Mode"
6. Click the button "Load Unpacked Extension"
7. Select the folder from step 2 and click "Select"
8. There you go - it is now installed!

## Usage
1. Click on the extension button in the menu bar
2. Open the options page
3. Get your API key and App ID from Intercom ([https://doc.intercom.io/api/#authorization](https://doc.intercom.io/api/#authorization))
  * Note it is advised to create and use a Read Only key
4. Paste them into the options page from step 2
5. Choose the information you want returned on screen
6. Hit save and close the options
  * Note the API key and App ID are saved locally using [https://developer.chrome.com/extensions/storage#property-local](Chrome Local Storage)
7. Now, whenever you want to run it on a page, simply click the extension button in the menu bar!

## Permissions
The extension uses the following permissions:
* api.intercom.io - this permission is so the emails on the page can be sent to Intercom and information can be received. We do not see/record/change any information in your Intercom account.
* background - this is so the extension can check email addresses automatically on the page. It gets the emails and checks them against your Intercom account.
* active tab - the extension gets all email addresses on the page/tab you are on and sends them to Intercom to check if they are users and return information on them if they are.

## Disclaimer
This is not associated with and has not been endorsed by [Intercom](https://www.intercom.io)
