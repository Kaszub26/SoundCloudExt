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
        'height': 135
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
    current : {
        category: {
            name : ''
        },
        song: {
            index : '',
            id : ''
        }
    },
    categories : "https://api.sndcdn.com/explore/sounds/category?client_id=b45b1aa10f1ac2941910a7f0d10f8e28",
    songData : "https://api.sndcdn.com/tracks.json?ids={0}&client_id=b45b1aa10f1ac2941910a7f0d10f8e28", //append ids + clientId
    iFrameEndpoint : 'https://w.soundcloud.com/player/?url=http://api.soundcloud.com/tracks/{0}&auto_play=true&auto_advance=true&buying=false&liking=false&download=false&sharing=false&show_artwork=true&show_comments=false&show_playcount=false&show_user=true&start_track=0&callback=true',
    next : 'http://api.soundcloud.com/tracks/{0}&auto_advance=true&buying=false&liking=false&download=false&sharing=false&show_artwork=true&show_comments=false&show_playcount=false&show_user=true&start_track=0&callback=true',
    tracks : {},
    doesExist : false,
    currentSong : '',
    $iFrame : null,
    intro : null,
    introFirstSong: null,

    playSong : function(songId) {

        if (Discover.current.song.id !== songId) {
            Discover.current.song.id = songId;
            Discover.current.song.index = Discover.tracks[Discover.current.category.name].indexOf(songId);
            console.log(Discover.current.song.id, Discover.current.song.index);

            Discover.$iFrame.attr('src', Discover.iFrameEndpoint.wiFormat(songId));
            widget = SC.Widget('iFrame');
            widget.load(Discover.next.wiFormat(songId));
            widget.unbind(SC.Widget.Events.READY);

            widget.bind(SC.Widget.Events.READY, function() {
                console.log('ready!');
                widget.play();
                widget.unbind(SC.Widget.Events.FINISH);
                widget.bind(SC.Widget.Events.FINISH, function() {
                    console.log('done!');
                    Discover.playNextSong();
                });
            });

            Discover.$iFrame.show();
            Discover.$songsContainer.css('height', '270');
            Discover.$loaderSelect.css('top' , '100px');
            var songsPositionTop = Discover.$songsContainer.position().top;
            Discover.$songSoften.css('top', songsPositionTop + 'px');
        }
        else if (Discover.current.song.id === songId) {
            widget.play();
        }
    },

    pauseSong : function() {
        widget.pause();
    },

    playNextSong : function() {

        console.log('song finished, playing next');

        var newSourceUrl,
            nextSongId;

        if (Discover.current.song.index < (Discover.tracks[Discover.current.category.name].length) - 1) {
            nextSongId = Discover.tracks[Discover.current.category.name][++Discover.current.song.index];
        }
        else {
            nextSongId = Discover.tracks[Discover.current.category.name][0];
        }
        newSourceUrl = Discover.next.wiFormat(nextSongId);
        Discover.current.song.id = nextSongId;
        Discover.current.song.index = Discover.tracks[Discover.current.category.name].indexOf(nextSongId);

        widget.load(newSourceUrl);
        widget.bind(SC.Widget.Events.READY, function() {
            widget.play();
            //Select the next active song and scroll to it
            var $activeSong = Discover.$songsContainer.find('[data-id="' + nextSongId + '"]');
            Discover.$songsContainer.scrollTo($activeSong, 600);
        });
    },

    showData: function(data) {

        var response = JSON.parse(data.target.response);

        //Create chosen.jquery.min category list
        $('#lhs').append('<select id="categorySelection" style="width: 170px"></select>');
        Discover.$categorySelection = $('#categorySelection'); //cache selector to we can use again

        var optionTemplate = '<option value="{0}" {1}>{2}</option>';
        var options = '';

        for (var i = 0, collectionLength = response.collection.length; i < collectionLength; i++) {

            var name = response.collection[i].name.toLowerCase().replace(/ /g, '');     //Make items lower case and remove space
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
        Discover.current.category.name = Discover.defaultCategory;

        var newSelection =  Discover.$chosenSelect.val();
        var requestUrl = Discover.songData.wiFormat(Discover.tracks[newSelection].join(','));
        Discover.makeEndpointRequest(requestUrl, Discover.cacheSongs);

        console.log(requestUrl);
        console.log(Discover.tracks);
        Discover.bindEvents();
    },

    cacheSongs : function(data) {


        var response = JSON.parse(data.target.response);
        //console.log(response);

        //Fill HTML template with content
        var trackTemplate = '<li data-id="{0}"><img src="{1}" class="art"/><div class="audioBtn"></div><div class="artist">{2}</div><div class="title">{3}</div><div class="metaContainer"></div></li>';
        var trackList = '';

        var currentCategoryArray = [];
        for (var i = 0, trackLength = response.length; i < trackLength; i++) {

            //Order of songIds in Discover.cache.tracks is not the same as what we get back here
            //Empty the previous list and push new values in order
            currentCategoryArray.push('' + response[i].id); //make sure this is string
            trackList += trackTemplate.wiFormat(response[i].id, response[i].artwork_url || Discover.defaultAlbumArt, response[i].user.username, response[i].title);
        }

        Discover.tracks[Discover.current.category.name] = currentCategoryArray;
        console.log(Discover.tracks);

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
                Discover.pauseSong();
                $list.find('*').parent().removeClass('selected');
            }
            else {
                $list.find('*').parent().removeClass('selected');
                $(this).addClass('selected');
                var songId = $(this).attr('data-id'),
                    artist = $(this).find('.artist').text(),
                    songName = $(this).find('.title').text();
                window.document.title = artist + ' - ' + songName;
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
            if (Discover.$songsContainer.scrollTop() >= heightOfSongs) {
                Discover.$scrollUp.css('visibility','visible').fadeIn('medium');
            }
            else {
                Discover.$scrollUp.fadeOut('fast');
            }
        });

        Discover.$scrollUp.click(function() {
            Discover.$songsContainer.animate({ scrollTop : 0});
        });

        Discover.introFirstSong = $list[0];

        if (!Discover.intro) {
            //Songs done loading
            //start intro js on first load
            Discover.intro = introJs();
            Discover.intro .setOptions({
                steps: [
                    {
                        element: document.querySelector('#categorySelection_chzn'),
                        intro: 'Select your favorite genre',
                        tooltipClass: 'tutorial-text'
                    },
                    {
                        element: document.querySelector('#rhs'),
                        intro: 'Songs will appear here',
                        position: 'bottom',
                        tooltipClass: 'tutorial-text'
                    },
                    {
                        element: document.querySelector('#playerContainer'),
                        intro: 'Enjoy listening to your favorite music!',
                        position: 'bottom',
                        tooltipClass: 'tutorial-text'
                    }
                ]
            });

            Discover.intro.start();

            Discover.intro .onchange(function(targetElement) {
                if (targetElement.id === 'playerContainer') {
                    Discover.introFirstSong.click();
                }
                console.log(targetElement.id)
            });
        }
    },

    bindEvents : function() {

        //Listen for changes
        Discover.$chosenSelect.change(function() {

            Discover.$songsContainer.css('visibility', 'hidden');
            Discover.$loaderSelect.show();

            var newSelection =  Discover.$chosenSelect.val();
            //console.log('value changed to',  newSelection);
            Discover.currentCategory = newSelection;

            //Update boxes with new selected value
            var requestUrl = Discover.songData.wiFormat(Discover.tracks[newSelection].join(','));
            console.log(requestUrl);
            Discover.makeEndpointRequest(requestUrl, Discover.cacheSongs);
        });
    },

    makeEndpointRequest : function(url, callback) {

        var xhr = new XMLHttpRequest();
        xhr.open('GET', url, true);
        xhr.onload = callback;
        xhr.send();
    }
};

jQuery(document).ready(function() {
/*    var size = [window.outerWidth ,window.outerHeight];
    $(window).resize(function(){
        window.resizeTo(size[0],size[1]);
    });*/
    Discover.$playerContainer = $('#playerContainer');
    Discover.$playerContainer.append('<iframe id="iFrame" style="display: none; width:{0}px; height:{1}px;"></iframe>'
        .wiFormat(Discover.playerContainerSize.width, Discover.playerContainerSize.height)
    );
    Discover.$iFrame = $('#iFrame');
    Discover.$songsContainer = $('#songsContainer');
    Discover.$loaderSelect = $('#loader');
    Discover.$songSoften = $('#soften');
    Discover.$scrollUp = $('#scrollUp');

    Discover.makeEndpointRequest(Discover.categories, Discover.showData);
    Discover.$songsContainer.css('visibility', 'hidden');
    Discover.$loaderSelect.show();
});

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
