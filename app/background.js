/**
 * Author: Petar
 * Date: 2/15/13
 */
var winId;
var drawAttention = false;

chrome.browserAction.onClicked.addListener(function() {

    //alert(win);

    if (!winId) {
        var w = 656,
            h = 550,
            focus = true;

        chrome.windows.create({'url': 'discover.html', 'type': 'detached_panel', 'focused' : focus, 'width' : w, 'height' : h},
            function(window) {
                winId = window.id;
            });
    }
    else {

        chrome.windows.update(winId, {'focused' : true, 'drawAttention' : drawAttention},
            function(window) {
        });
    }

/*    chrome.windows.create({'url': 'discover.html', 'type': 'popup'}, function(window) {
    });*/
});

chrome.windows.onRemoved.addListener(function(windowId) {
    //alert('closed ' + windowId);
    winId = undefined;
});