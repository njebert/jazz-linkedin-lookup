function onClickHandler(info, tab) {
  if (info.menuItemId == "selection") {
    console.log("item " + info.menuItemId + " was clicked");
    console.log("info: " + JSON.stringify(info));    
    console.log("tab: " + JSON.stringify(tab));

    var selectionText = info.selectionText;
    //alert(selectionText);

    //call to Jazz API
    var xhr = new XMLHttpRequest();

    //url encoding for the selectionText variable
    //hide the API key!
    var address = "https://api.resumatorapi.com/v1/applicants/name/"  
      // url encode the selected text Clayton%20Henderson
      + encodeURI(selectionText)

      + "?apikey=<API KEY REMOVED>"

    xhr.open("GET", address, true);
    xhr.onreadystatechange = function() {
      if (xhr.readyState == 4) {
        // JSON.parse does not evaluate the attacker's scripts.
        var resp = JSON.parse(xhr.responseText);
        if(resp.length > 0){
          //candidate has applied!
        }
        console.log(JSON.stringify(resp));
      }
    }
    xhr.send();
  }
};

chrome.contextMenus.onClicked.addListener(onClickHandler);

//Need something that will run on page load, detect that a page has scrolled
//https://developer.chrome.com/extensions/tabs#method-executeScript

//linkedin search results page: 
  //var element = document.getElementsByClassName("actor-name")[3]
  //Change the inner HTML, the styling, etc.


// Set up context menu tree at install time.
chrome.runtime.onInstalled.addListener(function () {
  // Create one test item for each context type.
  var contexts = ["selection"];
  chrome.contextMenus.create({
    "title": "Lookup Selection in Jazz...",
    "contexts": ["selection"],
    "id": "selection"
  });

});
