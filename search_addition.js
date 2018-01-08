// Shout out - http://tech-blog.tomchambers.me/2016/01/13/How-to-write-a-simple-page-rewriting-Chrome-extension/

var searchResults = [];

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
            + "?apikey=<API KEY REMOVED>"

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
                if (resp.length > 0) {
                    foundResult.NameSpanReference.after('&nbsp; &nbsp;<i class="fas fa-music"></i>');
                    //console.log("APPLIED! " + foundResult.Index + ": " + foundResult.Name);
                } else {
                    //console.log(foundResult.Index + ": " + foundResult.Name);
                }
            }
        }
        xhr.send();
    });
}

//TODO - detect when search results pane changes!
// Chain it up to do lookups when search results change.

//initial call to process search results
setTimeout(function () {
    processSearchResults();
}, 1500);


// $(document).on('click', function (event) {
//     if ($(event.target).is(".next")) {
//         console.log("Next clicked");
//     }
// });