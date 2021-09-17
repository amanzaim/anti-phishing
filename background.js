
// add function to the button
chrome.browserAction.onClicked.addListener(buttonClicked);

// add function for onUpdated url (omnibox)
chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
  // if url has been updated, check for Phishing
  if (changeInfo.url) {
    buttonClicked();
  }
});

// function for button click
function buttonClicked() {
  chrome.tabs.query({active: true, lastFocusedWindow: true}, tabs => {
      let url = tabs[0].url;
      // check to see if the url contains chrome:// urls or empty url
      if (url === "chrome://newtab/" || url === "chrome://*" )
        console.log("safe website according to Google API");
      else
        callPost(url);
  });
}

// function to POST to the Safe Browsing API and get the response
async function callPost(url){

  const URL ='https://safebrowsing.googleapis.com/v4/threatMatches:find?key=ADDYOURKEYHERE'
  const data={
    "client": {
      "clientId": "aman",
      "clientVersion": "1.0"
    },
    "threatInfo": {
      "threatTypes": ["MALWARE", "SOCIAL_ENGINEERING"],
      "platformTypes": ["WINDOWS"],
      "threatEntryTypes": ["URL"],
      "threatEntries": [
        {"url": url}
      ]
    }
  }
  const Param = {
    headers: {
      "content-type" : "application/json"
    },
    body: JSON.stringify(data),
    method: "POST"
  };

  //console.log(url);

  const response = await fetch (URL, Param);
  const resout = await response.json();
  console.log(resout);

  // checks to see if the response is empty
  // the URL is not contained in the Safe Browsing API
  if(!Object.keys(resout).length){
     console.log("no data found inside the Safe Browsing Api, checking using TFIDF");
     chrome.tabs.query({active: true, lastFocusedWindow: true}, tabs => {
       chrome.tabs.executeScript(null, { file: "jquery-3.6.0.js"})
       chrome.tabs.executeScript(null, { file: "content.js" });
     });
  } else {
    console.log("A match has been found in the Safe Browsing API");
    alert("This website is a Phishing website, please do not input any of your information.");
  }
}
