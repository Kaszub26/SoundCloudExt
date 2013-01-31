/**
 * Author: petar
 * Date: 1/21/13
 */

/**
 * Extend the string object to allow a C string format
 * @return {String}
 */
String.prototype.wiFormat = function () {
    var pattern = /\{\d+\}/g;
    var args = arguments;
    return this.replace(pattern, function (capture) {
        return args[capture.match(/\d+/)];
    });
};

//TODO
//change to Discover widget namespace
var widget;

var Discover = {

    $playerContainer : null,
    $songsContainer : null,
    $songSoften: null,
    $scrollUp : null,
    $categorySelection : null,
    $chosenSelect : null,
    $loaderSelect: null,
    playerContainerSize: {
        'width' : 420,
        'height': 150
    },
    params : {
        'auto_play'     : true,
        'auto_advance'  : true,
        'buying'        : false,
        'liking'        : true,
        'download'      : false,
        'sharing'       : false,
        'show_artwork'  : true,
        'show_comments' : false,
        'show_playcount': false,
        'show_user'     : true,
        'start_track'   : 0,
        'callback'      : true
    },
    defaultAlbumArt : 'images/default-artwork.png',
    defaultCategory : 'pop',
    currentCategory : 'pop',
    categoryExpirationInMilliseconds : 60000, //3600000 , //one hour
    categories : "https://api.sndcdn.com/explore/sounds/category?client_id=b45b1aa10f1ac2941910a7f0d10f8e28",
    songData : "https://api.sndcdn.com/tracks.json?ids={0}&client_id=b45b1aa10f1ac2941910a7f0d10f8e28", //append ids + clientId
    linkFormat : 'https://w.soundcloud.com/player/?url=http://api.soundcloud.com/tracks/{0}&auto_play=true&auto_advance=true&buying=false&liking=false&download=false&sharing=false&show_artwork=true&show_comments=false&show_playcount=false&show_user=true&start_track=0&callback=true',
    tracks : {},
    doesExist : false,
    currentSong : '',
    $iFrame : null,

    playSong : function(songId) {

        if (Discover.currentSong !== songId) {
            Discover.currentSong = songId;
            Discover.$iFrame.attr('src', Discover.linkFormat.wiFormat(songId));
            widget = SC.Widget(Discover.$iFrame[0]);
            Discover.$iFrame.show();
            Discover.$songsContainer.css('height', '270');
            Discover.$loaderSelect.css('top' , '100px');
            Discover.$songSoften.css('top','165px');
        }
    },

    showData: function(data) {

        var response = JSON.parse(data.target.response);

        //Create chosen.jquery.min category list
        $('#lhs').append('<select id="categorySelection" style="width: 170px"></select>');
        Discover.$categorySelection = $('#categorySelection'); //cache selector to we can use again

        var optionTemplate = '<option value="{0}" {1}>{2}</option>';
        var options = '';

        for (var i = 0, collectionLength = response.collection.length; i < collectionLength; i++) {

            var name = response.collection[i].name.toLowerCase().replace(/ /g, '');     //Make items lower case and remove space TODO one regex
            var formatName = name.replace(/[&\+]/g, '');                                //Replace &, +, and other uncessary characters with ''
            Discover.tracks[formatName] = [];

            options += optionTemplate.wiFormat(formatName, formatName === Discover.defaultCategory ? 'selected=selected' : '', name);

            for (var j = 0, tracksLength = response.collection[i].tracks.length; j < tracksLength; j++) {
                var songId = response.collection[i].tracks[j].id;
                Discover.tracks[formatName].push(songId);
            }
        }
        Discover.$categorySelection.append(options);

        //Initialize chosen.jquery to category selection list
        Discover.$chosenSelect = Discover.$categorySelection.chosen();


        //TODO check if it exists in local storage
        var newSelection =  Discover.$chosenSelect.val();
        var requestUrl = Discover.songData.wiFormat(Discover.tracks[newSelection].join(','));
        Discover.invokeSoundCloud(requestUrl, Discover.showResults);

        console.log(requestUrl);
        console.log(Discover.tracks);
        Discover.bindEvents();
    },

    showResults : function(data) {


        var response = JSON.parse(data.target.response);
        console.log(response);
        //fill with selected content
        var trackTemplate = '<li data-id="{0}"><img src="{1}" class="art"/><div class="audioBtn"></div><div class="artist">{2}</div><div class="title">{3}</div><div class="metaContainer"></div></li>';
        var trackList = '';

        //console.log(response);
        for (var i = 0, trackLength = response.length; i < trackLength; i++) {
            trackList += trackTemplate.wiFormat(response[i].id, response[i].artwork_url || Discover.defaultAlbumArt, response[i].user.username, response[i].title);
        }

        //empty song collection everytime a new selection is chosen, and hide loader
        Discover.$songsContainer.html(trackList);

        //removes image loading flicker - images don't load fast enough
        window.setTimeout(function() {
            Discover.$songsContainer.css('visibility', 'visible');
            Discover.$loaderSelect.hide();
        }, 350);

        //Determines which song is currently selected
        var $list = Discover.$songsContainer.find('li');
        $list.click(function() {
            var isSelected = $(this).hasClass('selected');
            if (isSelected) {
                $list.find('*').parent().removeClass('selected');
            }
            else {
                $list.find('*').parent().removeClass('selected');
                $(this).addClass('selected');
                var songId = $(this).attr('data-id');
                Discover.playSong(songId);
            }

            //jQuery scrollTo plugin, smoothly slides up to selected album art in list
            Discover.$songsContainer.scrollTo($(this), 600);
        });

        var $children = Discover.$songsContainer.children();
        var rows = Math.ceil(($children.length) / 3);
        var heightOfSongs = $children.height() * (rows - 3);


        //except we need to ignore the last row that will be at the bottom

        Discover.$songsContainer.scroll(function() {
            if ($(this).scrollTop() >= 5) {
                Discover.$songSoften.css('visibility','visible');
            }
            else {
                Discover.$songSoften.css('visibility','hidden');
            }
            console.log(Discover.$songsContainer.scrollTop(), heightOfSongs);
            if (Discover.$songsContainer.scrollTop() >= heightOfSongs) {
                Discover.scrollUp.css('visibility','visible').fadeIn('medium');
            }
            else {
                Discover.scrollUp.fadeOut('fast');
            }
        });

        Discover.scrollUp.click(function() {
            Discover.$songsContainer.animate({ scrollTop : 0});
        });
    },

    bindEvents : function() {

        //This needs to used cached data
        //Listen for changes
        Discover.$chosenSelect.change(function() {

            Discover.$songsContainer.css('visibility', 'hidden');
            Discover.$loaderSelect.show();

            var newSelection =  Discover.$chosenSelect.val();
            console.log('value changed to',  newSelection);
            Discover.currentCategory = newSelection;

            //Update boxes with new selected value
            var requestUrl = Discover.songData.wiFormat(Discover.tracks[newSelection].join(','));
            console.log(requestUrl);
            Discover.invokeSoundCloud(requestUrl, Discover.showResults);
        });
    },

    invokeSoundCloud : function(url, callback) {

        var xhr = new XMLHttpRequest();
        xhr.open("GET", url, true);
        xhr.onload = callback;
        xhr.send();
    }
};

jQuery(document).ready(function() {
    //LocalStorageHelper.clearStorage();
    Discover.$playerContainer = $('#playerContainer');
    Discover.$playerContainer.append('<iframe id="iFrame" style="display: none; width:{0}px; height:{1}px;"></iframe>'
        .wiFormat(Discover.playerContainerSize.width, Discover.playerContainerSize.height)
    );
    Discover.$iFrame = $('#iFrame');
    Discover.$songsContainer = $('#songsContainer');
    Discover.$loaderSelect = $('#loader');
    Discover.$songSoften = $('#soften');
    Discover.scrollUp = $('#scrollUp');

    Discover.invokeSoundCloud(Discover.categories, Discover.showData);
    Discover.$songsContainer.css('visibility', 'hidden');
    Discover.$loaderSelect.show();
});


/*
    soundManager.defaultOptions = {
        autoLoad: false,        // enable automatic loading (otherwise .load() will call with .play())
        autoPlay: false,        // enable playing of file ASAP (much faster if "stream" is true)
        from: null,             // position to start playback within a sound (msec), see demo
        loops: 1,               // number of times to play the sound. Related: looping (API demo)
        multiShot: true,        // let sounds "restart" or "chorus" when played multiple times..
        multiShotEvents: false, // allow events (onfinish()) to fire for each shot, if supported.
        onid3: null,            // callback function for "ID3 data is added/available"
        onload: null,           // callback function for "load finished"
        onstop: null,           // callback for "user stop"
        onfinish: null,         // callback function for "sound finished playing"
        onpause: null,          // callback for "pause"
        onplay: null,           // callback for "play" start
        onresume: null,         // callback for "resume" (pause toggle)
        position: null,         // offset (milliseconds) to seek to within downloaded sound.
        pan: 0,                 // "pan" settings, left-to-right, -100 to 100
        stream: true,           // allows playing before entire file has loaded (recommended)
        to: null,               // position to end playback within a sound (msec), see demo
        type: null,             // MIME-like hint for canPlay() tests, eg. 'audio/mp3'
        usePolicyFile: false,   // enable crossdomain.xml request for remote domains (for ID3/waveform access)
        volume: 100,            // self-explanatory. 0-100, the latter being the max.
        whileloading: null,     // callback function for updating progress (X of Y bytes received)
        whileplaying: null,     // callback during play (position update)
        // see optional flash 9-specific options, too
    }
*/


/* Good data structure for our content

   { Categories : [song1, song2, ...], ... }

    var c = {
        'classical' : [
            "75005583",
            "75425411",
            "76004618"
        ],

        'electronic' : [
            "75749972",
            "75518678",
            "75504179"
        ],

        'urban' : [
            "75969748",
            "75969240",
            "75495542"
        ]
    };
*/
