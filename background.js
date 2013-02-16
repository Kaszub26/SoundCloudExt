/**
 * Author: Petar
 * Date: 2/15/13
 */
var win;
var drawAttention = false;

chrome.browserAction.onClicked.addListener(function() {

    if (!win) {
        var w = 656,
            h = 515,
            focus = true;

        chrome.windows.create({'url': 'discover.html', 'type': 'detached_panel', 'focused' : focus, 'width' : w, 'height' : h},
            function(window) {
                win = window;
                win.id = window.id;
            });
    }
    else {

        chrome.windows.update(win.id, {'focused' : true, 'drawAttention' : drawAttention},
            function(window) {
        });
    }

/*    chrome.windows.create({'url': 'discover.html', 'type': 'popup'}, function(window) {
    });*/
});