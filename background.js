/**
 * Author: Petar
 * Date: 2/15/13
 */
chrome.browserAction.onClicked.addListener(function() {
    var w = 656,
        h = 515,
 /*       left = (screen.width/2) - (w/2),
        top = (screen.height/2) - (h/2),*/
        focus = true;

    chrome.windows.create({'url': 'discover.html', 'type': 'detached_panel', 'focused' : focus, 'width' : w, 'height' : h},
        function(window) {

    });

/*    chrome.windows.create({'url': 'discover.html', 'type': 'popup'}, function(window) {
    });*/
});