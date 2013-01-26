/**
 * Author: petar
 * Date: 1/21/13
 */

//TODO
//change to Discover widget namespace
var widget;

var Discover = {

    $playerContainer : null,
    $songsContainer : null,
    $categorySelection : null,
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
    categories : "https://api.sndcdn.com/explore/sounds/category?client_id=b45b1aa10f1ac2941910a7f0d10f8e28",
    songData : "https://api.sndcdn.com/tracks.json?ids=", //append ids + clientId
    clientId : "&client_id=b45b1aa10f1ac2941910a7f0d10f8e28",
    tracks : {},
    doesExist : false,
    iFrame : null,

    playSong : function(songId) {


        var link = 'https://w.soundcloud.com/player/' + '?url=http://api.soundcloud.com/tracks/' + songId + '&auto_play=true&auto_advance=true&buying=false&liking=true&download=false&sharing=false&show_artwork=true&show_comments=false&show_playcount=false&show_user=true&start_track=0&callback=true';

        //Make sure you do no reload the player if you press the same icon
        if (this.doesExist) {

            var i = this.iFrame.src.indexOf(songId);
            var isPlaying = (i >= 0); //if it contains it, then what is === -1?

            //Check to see if song pressed is already playing
            if (isPlaying) {
                console.log('case 1', 'exists and is same song, do nothing.');
                this.doesExist = true;
            }

            //PLayer exists, remove current player, add new player
            else {
                console.log('case 2', 'exists, so just change iFrame url to new song');
                this.iFrame.src = link;
                this.doesExist = true;
            }
        }

        //Player does not exist, create a new one, append to body
        else {
            console.log('case 3');
            this.iFrame = document.createElement('iframe');
            Discover.$playerContainer.appendChild(this.iFrame); //this takes a long time, do it with Javascript
            this.iFrame.src = link;
            this.iFrame.setAttribute('class', 'iframe');

            this.iFrame.width = Discover.playerContainerSize.width;
            this.iFrame.height = Discover.playerContainerSize.height;
            this.doesExist = true;
            widget = SC.Widget(this.iFrame);
        }
    },

    requestCategories: function() {
        var xhr = new XMLHttpRequest();
        xhr.open("GET", this.categories, true);
        xhr.onload = this.showData.bind(this);
        xhr.send();
    },

    showData: function(e) {
        var response = JSON.parse(e.target.responseText);
        console.log(response);

        //Create chosen.jquery.min category list
        var categoryElement = document.createElement('select');
        $('#lhs').append(categoryElement);
        categoryElement.setAttribute('id' , 'categorySelection');
        var categorySelection = document.getElementById('categorySelection');
        Discover.$categorySelection = $(categorySelection); //cache selector to we can use again

        //////////////////////////////////////////////////////////////////////
        //Append extra crap to DOM
        //GET RID OF THIS
        /*
        var categoryUl = document.createElement('ul');
        var songsDiv = document.createElement('div');
        if (document.body != null) {
            document.body.appendChild(categoryUl);
            categoryUl.setAttribute('id', 'categories');
            Discover.$categories = $(categoryUl);
            document.body.appendChild(songsDiv);
            songsDiv.setAttribute('id', 'songsContainer');
            var songsContainer = document.getElementById('songsContainer');
        }
        */
        //////////////////////////////////////////////////////////////////////

        //var list = document.getElementById('categories');
        for (var i = 0; i < response.collection.length; i++) {
            var name = response.collection[i].name.toLowerCase().replace(/ /g, '');     //Make items lower case and remove space TODO one regex
            var formatName = name.replace(/[&\+]/g, '');                                //Replace &, +, and other uncessary characters with ''
            Discover.tracks[formatName] = [];

            //New selection of categories
            var categoryOption = document.createElement('option');
            categoryOption.innerHTML = name;
            categoryOption.setAttribute('value', formatName);
            categorySelection.appendChild(categoryOption);

            //Make the first item selected by default
            if (i === 0) {
                categoryOption.setAttribute('selected' , 'selected');
            }

            //////////////////////////////////////////////////////////////////////
            //NOT GOING TO NEED THIS
            //Old list of categories
            /*
            var item = document.createElement('li');
            item.innerHTML = name;
            item.setAttribute('data-category', formatName);
            list.appendChild(item);

            var songs = document.createElement('ul');
            songsContainer.appendChild(songs);
            songs.setAttribute('id', formatName);
            songs.setAttribute('class', 'hide');
            */

            for (var j = 0; j < response.collection[i].tracks.length; j++) {
                var songId = response.collection[i].tracks[j].id;
                Discover.tracks[formatName].push(songId);
                /*
                var song = document.createElement('li');
                song.setAttribute('data-id', songId);
                song.innerHTML = songId;
                var categoryList = document.getElementById(formatName);
                categoryList.appendChild(song);
                */
            }
        }
        console.log(Discover.tracks);
        this.bindEvents();
    },

    showResults : function(e) {

        //empty song collection everytime a new selection is chosen
        Discover.$songsContainer.empty();
        /*
        var $final = $('songsContainer');
        $final.empty();
        */

        //fill with selected content
        var response = JSON.parse(e.target.responseText);
        console.log(response);
        for (var i = 0; i < response.length; i++) {


            //Do seperate ones for every parameter
            if (response[i].artwork_url) {

                //<li>
                var songLi = document.createElement('li');
                Discover.$songsContainer.append(songLi);
                songLi.setAttribute('data-id', response[i].id);

                //img
                var img = document.createElement('img');
                img.src = response[i].artwork_url;
                songLi.appendChild(img);
                img.setAttribute('class', 'art');

                //waveform
                var wave = document.createElement('img');
                wave.src = response[i].waveform_url;
                songLi.appendChild(wave);
                wave.width = img.width;
                wave.height = img.height / 20;
                wave.setAttribute('class', 'wave minimize');

                //play button
                var audioBtn = document.createElement('div');
                songLi.appendChild(audioBtn);
                audioBtn.setAttribute('class', 'audioBtn');

                //artist name
                var artist = document.createElement('div');
                songLi.appendChild(artist);
                artist.innerHTML = response[i].user.username;
                artist.setAttribute('class', 'artist');

                //song name
                var title = document.createElement('div');
                songLi.appendChild(title);
                title.innerHTML = response[i].title;
                title.setAttribute('class', 'title');

                //White gradient hider over text
                var hider = document.createElement('div');
                songLi.appendChild(hider);
                hider.setAttribute('class', 'hider');

                //currently empty
                var player = document.createElement('div');
                songLi.appendChild(player);
                player.setAttribute('id', 'player');

                //TODO - like button
                //
                //not in this version
            }
        }
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
        });

        Discover.$songsContainer.find('li').hover(
            //mouseOver
            function() { //jQuery(this).find('.wave').height(24);
            },
            //mouseOut
            function() {
            }
        );
    },

    bindEvents : function() {
        /*
        var $navList = Discover.$categories.find('li');
        var $data = $('#songsContainer').find('li');
        */

        /*
        var $dataParent = $data.parent();
         */

        //Initialize chosen.jquery to category selection list
        Discover.$categorySelection.chosen();
        $('#categorySelection_chzn').width(170);


        //Listen for changes
        Discover.$categorySelection.chosen().change(function() {
            var newSelection = Discover.$categorySelection.chosen().val();
            console.log('value changed to',  newSelection);

            //Update boxes with new selected value
            var requestUrl = Discover.songData;
            var category = Discover.tracks[newSelection]; //might have to strip it becasue the selection text is different than array data

            //Iterate over all of the songs in a category to get songIDs
            for (var song in category) {
                if (category.hasOwnProperty(song)) {

                    //Append each of the song ids to the URL query
                    var songId = category[song];
                    requestUrl += songId + ',';
                    console.log(songId, requestUrl);
                }
            }

            //Finally append client id to authorize request
            requestUrl += Discover.clientId;
            console.log(requestUrl);

            //Request songs from the selected category
            var xhrSong = new XMLHttpRequest();
            xhrSong.open("GET", requestUrl, true);
            xhrSong.onload = Discover.showResults.bind(this);
            xhrSong.send();
        });

        //instead of nav list click
        //$navList.click(function() {

            /*
            //Every item becomes unselected
            //ensures only 1 item is ever selected
            $navList.each(function() {
                $(this).removeClass('selected');
            });

            //Hide the data-id list of songs
            //TODO make this a array instead of DOM elements
            $dataParent.each(function() {
                $(this).addClass('hide');
            });
            */

            /*
            //Selected the clicked item
            $(this).addClass('selected');
            */

            /*
            //Which item is selected
            var $which = $(this).attr('data-category');
            var selector = '#' + $which; //doesn't work #blah&blah, need to escape string
            console.log($which, selector);

            //Get resources for selected nav item
            var reqUrl = Discover.songData;
            var obj = Discover.tracks[$which];
            for (var key in obj) {
                if (obj.hasOwnProperty(key)) {
                    console.log(obj[key]);
                }
            }
            */

            /*
            //var temp = document.createElement('ul');
            //jQuery('songsContainer').append(temp);
            //temp.setAttribute('id', $which);

            $(selector).children().each(function() {
                reqUrl += $(this).attr('data-id') + ','; //should use array value instead of DOM li
            });
            reqUrl += Discover.clientId;
            console.log(reqUrl);
            */

            /*
            //request songs from the clicked category
            var xhrSong = new XMLHttpRequest();
            xhrSong.open("GET", reqUrl, true);
            xhrSong.onload = Discover.showResults.bind(this);
            xhrSong.send();
            $(selector).removeClass('hide');
            */
        //});

        /*
        $data.click(function(e) {
            $data.each(function() {
                $(this).removeClass('selected');
            });
            $(this).addClass('selected');
        });
        */

        //Discover.$categories.find('li:first').click();
    }
};


jQuery(document).ready(function() {
    Discover.$playerContainer = document.getElementById('playerContainer');
    var songsContainer = document.getElementById('songsContainer');
    Discover.$songsContainer = $(songsContainer);
    Discover.requestCategories();
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
