// Copyright (c) 2012 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

// The onClicked callback function.
function onClickHandler(info, tab) {
  if (info.menuItemId == "selection") {
    console.log("item " + info.menuItemId + " was clicked");
    console.log("info: " + JSON.stringify(info));    
    console.log("tab: " + JSON.stringify(tab));

    var selectionText = info.selectionText;
    alert(selectionText);

    //call to Jazz API
  }
};

chrome.contextMenus.onClicked.addListener(onClickHandler);

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
