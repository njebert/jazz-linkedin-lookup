// Shout out - http://tech-blog.tomchambers.me/2016/01/13/How-to-write-a-simple-page-rewriting-Chrome-extension/

var searchResults = [];

var API_KEY = ""; //API KEY REMOVED!

function decorateElement(response, element){
    if (!$.isEmptyObject(response)) {
        element.after('&nbsp; &nbsp;<i class="fas fa-music"></i>');
    }
}

function processSearchResults() {
    //clear existing search results
    searchResults = [];

    $(".name-and-icon").each(function (index) {
        var nameSpanReference = $(this);
        var nameSearchResult = $(this).text().trim();

        var searchResult = {};

        searchResult.Name = nameSearchResult;
        searchResult.NameSpanReference = nameSpanReference;
        searchResult.Index = index;

        searchResults.push(searchResult);

        //console.log(searchResult.index + ": " + searchResult.Name);

        //Hit Jazz api for employment status information.
        var xhr = new XMLHttpRequest();

        //url encoding for the selectionText variable
        //hide the API key!
        var address = "https://api.resumatorapi.com/v1/applicants/name/"
            // url encode the selected text Clayton%20Henderson
            + encodeURI(nameSearchResult)
            + "?apikey=" + API_KEY;

        xhr.open("GET", address, true);
        xhr.onreadystatechange = function () {
            if (xhr.readyState == 4) {

                //Match returned record with saved searchResults
                var responseURL = xhr.responseURL;
                //remove first portion of the URL
                responseURL = responseURL.replace("https://api.resumatorapi.com/v1/applicants/name/", "");
                //trim to first element of the URL
                responseURL = responseURL.substring(0, responseURL.indexOf("?"));
                var responseName = decodeURI(responseURL).trim();

                var foundResult = searchResults.find(r => r.Name == responseName);

                // JSON.parse does not evaluate the attacker's scripts.
                var resp = JSON.parse(xhr.responseText);
                decorateElement(resp, foundResult.NameSpanReference);
            }
        }
        xhr.send();
    });
}

function processProfilePage() {
    $(".pv-top-card-section__name").each(function (index) {
        var nameHeaderReference = $(this);

        var profileResult = {};
        profileResult.Name = nameHeaderReference.text();

        //Seaprate Jazz call for profile requests
        var xhr = new XMLHttpRequest();

        var address = "https://api.resumatorapi.com/v1/applicants/name/"
            // url encode the selected text Clayton%20Henderson
            + encodeURI(profileResult.Name)
            + "?apikey=" + API_KEY;

        console.log("Process Profile Page: " + profileResult.Name);
        
        xhr.open("GET", address, true);
        xhr.onreadystatechange = function () {
            if (xhr.readyState == 4) {

                //Match returned record with saved searchResults
                var responseURL = xhr.responseURL;
                //remove first portion of the URL
                responseURL = responseURL.replace("https://api.resumatorapi.com/v1/applicants/name/", "");
                //trim to first element of the URL
                responseURL = responseURL.substring(0, responseURL.indexOf("?"));
                var responseName = decodeURI(responseURL).trim();

                // JSON.parse does not evaluate the attacker's scripts.
                var resp = JSON.parse(xhr.responseText);
                decorateElement(resp, nameHeaderReference);
            }
        }
        xhr.send();

    });
}

//initial call to process search results or profile results
setTimeout(function () {
    //TODO - Detect a search results page to run the correct method on the page.
    processSearchResults();
    processProfilePage();

}, 1500);

// binding to "NEXT" and "PREV" clicks in the LinkedIn Search interface
$(document).on('click', function (event) {
    if ($(event.target).parent().is(".next") ||
        $(event.target).parent().is(".prev")) {
        setTimeout(function () {
            processSearchResults();
        }, 2500);
    }

    if($(event.target).is(".actor-name")){
        setTimeout(function () {
            processProfilePage();
        }, 2500);
    }
});