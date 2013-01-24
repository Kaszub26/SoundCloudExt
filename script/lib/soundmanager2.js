/** @license
 *
 * SoundManager 2: JavaScript Sound for the Web
 * ----------------------------------------------
 * http://schillmania.com/projects/soundmanager2/
 *
 * Copyright (c) 2007, Scott Schiller. All rights reserved.
 * Code provided under the BSD License:
 * http://schillmania.com/projects/soundmanager2/license.txt
 *
 * V2.97a.20111220
 */
(function (J) {
    function R(R, ea) {
        function l(b) {
            return function (a) {
                var c = this._t;
                return!c || !c._a ? null : b.call(this, a)
            }
        }

        this.flashVersion = 8;
        this.debugFlash = this.debugMode = !1;
        this.consoleOnly = this.useConsole = !0;
        this.waitForWindowLoad = !1;
        this.bgColor = "#ffffff";
        this.useHighPerformance = !1;
        this.html5PollingInterval = this.flashPollingInterval = null;
        this.flashLoadTimeout = 1E3;
        this.wmode = null;
        this.allowScriptAccess = "always";
        this.useFlashBlock = !1;
        this.useHTML5Audio = !0;
        this.html5Test = /^(probably|maybe)$/i;
        this.preferFlash = !0;
        this.noSWFCache = !1;
        this.audioFormats = {mp3:{type:['audio/mpeg; codecs="mp3"', "audio/mpeg", "audio/mp3", "audio/MPA", "audio/mpa-robust"], required:!0}, mp4:{related:["aac", "m4a"], type:['audio/mp4; codecs="mp4a.40.2"', "audio/aac", "audio/x-m4a", "audio/MP4A-LATM", "audio/mpeg4-generic"], required:!1}, ogg:{type:["audio/ogg; codecs=vorbis"], required:!1}, wav:{type:['audio/wav; codecs="1"', "audio/wav", "audio/wave", "audio/x-wav"], required:!1}};
        this.defaultOptions = {autoLoad:!1, autoPlay:!1, from:null, loops:1, onid3:null,
            onload:null, whileloading:null, onplay:null, onpause:null, onresume:null, whileplaying:null, onposition:null, onstop:null, onfailure:null, onfinish:null, multiShot:!0, multiShotEvents:!1, position:null, pan:0, stream:!0, to:null, type:null, usePolicyFile:!1, volume:100};
        this.flash9Options = {isMovieStar:null, usePeakData:!1, useWaveformData:!1, useEQData:!1, onbufferchange:null, ondataerror:null};
        this.movieStarOptions = {bufferTime:3, serverURL:null, onconnect:null, duration:null};
        this.movieID = "sm2-container";
        this.id = ea || "sm2movie";
        this.debugID = "soundmanager-debug";
        this.debugURLParam = /([#?&])debug=1/i;
        this.versionNumber = "V2.97a.20111220";
        this.movieURL = this.version = null;
        this.url = R || null;
        this.altURL = null;
        this.enabled = this.swfLoaded = !1;
        this.oMC = null;
        this.sounds = {};
        this.soundIDs = [];
        this.didFlashBlock = this.muted = !1;
        this.filePattern = null;
        this.filePatterns = {flash8:/\.mp3(\?.*)?$/i, flash9:/\.mp3(\?.*)?$/i};
        this.features = {buffering:!1, peakData:!1, waveformData:!1, eqData:!1, movieStar:!1};
        this.sandbox = {};
        var fa;
        try {
            fa = "undefined" !== typeof Audio &&
                "undefined" !== typeof(new Audio).canPlayType
        } catch (Xa) {
            fa = !1
        }
        this.hasHTML5 = fa;
        this.html5 = {usingFlash:null};
        this.flash = {};
        this.ignoreFlash = this.html5Only = !1;
        var Aa, c = this, h = null, S, p = navigator.userAgent, j = J, ga = j.location.href.toString(), k = document, ha, T, i, v = [], K = !1, L = !1, m = !1, w = !1, ia = !1, M, q, ja, C, D, U, Ba, ka, A, V, E, la, ma, na, W, F, Ca, oa, Da, X, Ea, N = null, pa = null, G, qa, H, Y, Z, ra, o, $ = !1, sa = !1, Fa, Ga, Ha, aa = 0, O = null, ba, s = null, Ia, ca, P, x, ta, ua, Ja, n, Ra = Array.prototype.slice, B = !1, r, da, Ka, u, La, va = p.match(/(ipad|iphone|ipod)/i),
            Sa = p.match(/firefox/i), Ta = p.match(/droid/i), y = p.match(/msie/i), Ua = p.match(/webkit/i), Q = p.match(/safari/i) && !p.match(/chrome/i), Va = p.match(/opera/i), wa = p.match(/(mobile|pre\/|xoom)/i) || va, xa = !ga.match(/usehtml5audio/i) && !ga.match(/sm2\-ignorebadua/i) && Q && !p.match(/silk/i) && p.match(/OS X 10_6_([3-7])/i), ya = "undefined" !== typeof k.hasFocus ? k.hasFocus() : null, I = Q && "undefined" === typeof k.hasFocus, Ma = !I, Na = /(mp3|mp4|mpa)/i, za = k.location ? k.location.protocol.match(/http/i) : null, Oa = !za ? "http://" : "", Pa = /^\s*audio\/(?:x-)?(?:mpeg4|aac|flv|mov|mp4||m4v|m4a|mp4v|3gp|3g2)\s*(?:$|;)/i,
            Qa = "mpeg4,aac,flv,mov,mp4,m4v,f4v,m4a,mp4v,3gp,3g2".split(","), Wa = RegExp("\\.(" + Qa.join("|") + ")(\\?.*)?$", "i");
        this.mimePattern = /^\s*audio\/(?:x-)?(?:mp(?:eg|3))\s*(?:$|;)/i;
        this.useAltURL = !za;
        this._global_a = null;
        if (wa && (c.useHTML5Audio = !0, c.preferFlash = !1, va))B = c.ignoreFlash = !0;
        this.supported = this.ok = function () {
            return s ? m && !w : c.useHTML5Audio && c.hasHTML5
        };
        this.getMovie = function (b) {
            return S(b) || k[b] || j[b]
        };
        this.createSound = function (b) {
            function a() {
                e = Y(e);
                c.sounds[d.id] = new Aa(d);
                c.soundIDs.push(d.id);
                return c.sounds[d.id]
            }

            var e = null, f = null, d = null;
            if (!m || !c.ok())return ra(void 0), !1;
            2 === arguments.length && (b = {id:arguments[0], url:arguments[1]});
            e = q(b);
            e.url = ba(e.url);
            d = e;
            if (o(d.id, !0))return c.sounds[d.id];
            if (ca(d))f = a(), f._setup_html5(d); else {
                if (8 < i) {
                    if (null === d.isMovieStar)d.isMovieStar = d.serverURL || (d.type ? d.type.match(Pa) : !1) || d.url.match(Wa);
                    if (d.isMovieStar && d.usePeakData)d.usePeakData = !1
                }
                d = Z(d, void 0);
                f = a();
                if (8 === i)h._createSound(d.id, d.loops || 1, d.usePolicyFile); else if (h._createSound(d.id,
                    d.url, d.usePeakData, d.useWaveformData, d.useEQData, d.isMovieStar, d.isMovieStar ? d.bufferTime : !1, d.loops || 1, d.serverURL, d.duration || null, d.autoPlay, !0, d.autoLoad, d.usePolicyFile), !d.serverURL)f.connected = !0, d.onconnect && d.onconnect.apply(f);
                !d.serverURL && (d.autoLoad || d.autoPlay) && f.load(d)
            }
            !d.serverURL && d.autoPlay && f.play();
            return f
        };
        this.destroySound = function (b, a) {
            if (!o(b))return!1;
            var e = c.sounds[b], f;
            e._iO = {};
            e.stop();
            e.unload();
            for (f = 0; f < c.soundIDs.length; f++)if (c.soundIDs[f] === b) {
                c.soundIDs.splice(f,
                    1);
                break
            }
            a || e.destruct(!0);
            delete c.sounds[b];
            return!0
        };
        this.load = function (b, a) {
            return!o(b) ? !1 : c.sounds[b].load(a)
        };
        this.unload = function (b) {
            return!o(b) ? !1 : c.sounds[b].unload()
        };
        this.onposition = this.onPosition = function (b, a, e, f) {
            return!o(b) ? !1 : c.sounds[b].onposition(a, e, f)
        };
        this.clearOnPosition = function (b, a, e) {
            return!o(b) ? !1 : c.sounds[b].clearOnPosition(a, e)
        };
        this.start = this.play = function (b, a) {
            if (!m || !c.ok())return ra("soundManager.play(): " + G(!m ? "notReady" : "notOK")), !1;
            if (!o(b)) {
                a instanceof Object ||
                (a = {url:a});
                return a && a.url ? (a.id = b, c.createSound(a).play()) : !1
            }
            return c.sounds[b].play(a)
        };
        this.setPosition = function (b, a) {
            return!o(b) ? !1 : c.sounds[b].setPosition(a)
        };
        this.stop = function (b) {
            return!o(b) ? !1 : c.sounds[b].stop()
        };
        this.stopAll = function () {
            for (var b in c.sounds)c.sounds.hasOwnProperty(b) && c.sounds[b].stop()
        };
        this.pause = function (b) {
            return!o(b) ? !1 : c.sounds[b].pause()
        };
        this.pauseAll = function () {
            var b;
            for (b = c.soundIDs.length; b--;)c.sounds[c.soundIDs[b]].pause()
        };
        this.resume = function (b) {
            return!o(b) ?
                !1 : c.sounds[b].resume()
        };
        this.resumeAll = function () {
            var b;
            for (b = c.soundIDs.length; b--;)c.sounds[c.soundIDs[b]].resume()
        };
        this.togglePause = function (b) {
            return!o(b) ? !1 : c.sounds[b].togglePause()
        };
        this.setPan = function (b, a) {
            return!o(b) ? !1 : c.sounds[b].setPan(a)
        };
        this.setVolume = function (b, a) {
            return!o(b) ? !1 : c.sounds[b].setVolume(a)
        };
        this.mute = function (b) {
            var a = 0;
            "string" !== typeof b && (b = null);
            if (b)return!o(b) ? !1 : c.sounds[b].mute();
            for (a = c.soundIDs.length; a--;)c.sounds[c.soundIDs[a]].mute();
            return c.muted = !0
        };
        this.muteAll = function () {
            c.mute()
        };
        this.unmute = function (b) {
            "string" !== typeof b && (b = null);
            if (b)return!o(b) ? !1 : c.sounds[b].unmute();
            for (b = c.soundIDs.length; b--;)c.sounds[c.soundIDs[b]].unmute();
            c.muted = !1;
            return!0
        };
        this.unmuteAll = function () {
            c.unmute()
        };
        this.toggleMute = function (b) {
            return!o(b) ? !1 : c.sounds[b].toggleMute()
        };
        this.getMemoryUse = function () {
            var b = 0;
            h && 8 !== i && (b = parseInt(h._getMemoryUse(), 10));
            return b
        };
        this.disable = function (b) {
            var a;
            "undefined" === typeof b && (b = !1);
            if (w)return!1;
            w = !0;
            for (a = c.soundIDs.length; a--;)Da(c.sounds[c.soundIDs[a]]);
            M(b);
            n.remove(j, "load", D);
            return!0
        };
        this.canPlayMIME = function (b) {
            var a;
            c.hasHTML5 && (a = P({type:b}));
            return!s || a ? a : b ? !!(8 < i && b.match(Pa) || b.match(c.mimePattern)) : null
        };
        this.canPlayURL = function (b) {
            var a;
            c.hasHTML5 && (a = P({url:b}));
            return!s || a ? a : b ? !!b.match(c.filePattern) : null
        };
        this.canPlayLink = function (b) {
            return"undefined" !== typeof b.type && b.type && c.canPlayMIME(b.type) ? !0 : c.canPlayURL(b.href)
        };
        this.getSoundById = function (b) {
            if (!b)throw Error("soundManager.getSoundById(): sID is null/undefined");
            return c.sounds[b]
        };
        this.onready = function (b, a) {
            if (b && b instanceof Function)return a || (a = j), ja("onready", b, a), C(), !0;
            throw G("needFunction", "onready");
        };
        this.ontimeout = function (b, a) {
            if (b && b instanceof Function)return a || (a = j), ja("ontimeout", b, a), C({type:"ontimeout"}), !0;
            throw G("needFunction", "ontimeout");
        };
        this._wD = this._writeDebug = function () {
            return!0
        };
        this._debug = function () {
        };
        this.reboot = function () {
            var b, a;
            for (b = c.soundIDs.length; b--;)c.sounds[c.soundIDs[b]].destruct();
            try {
                if (y)pa = h.innerHTML;
                N = h.parentNode.removeChild(h)
            } catch (e) {
            }
            pa =
                N = s = null;
            c.enabled = ma = m = $ = sa = K = L = w = c.swfLoaded = !1;
            c.soundIDs = c.sounds = [];
            h = null;
            for (b in v)if (v.hasOwnProperty(b))for (a = v[b].length; a--;)v[b][a].fired = !1;
            j.setTimeout(c.beginDelayedInit, 20)
        };
        this.getMoviePercent = function () {
            return h && "undefined" !== typeof h.PercentLoaded ? h.PercentLoaded() : null
        };
        this.beginDelayedInit = function () {
            ia = !0;
            E();
            setTimeout(function () {
                if (sa)return!1;
                W();
                V();
                return sa = !0
            }, 20);
            U()
        };
        this.destruct = function () {
            c.disable(!0)
        };
        Aa = function (b) {
            var a = this, e, f, d, g, z, j, k = !1, t = [], l = 0, n, p,
                m = null, r = null, s = null;
            this.sID = b.id;
            this.url = b.url;
            this._iO = this.instanceOptions = this.options = q(b);
            this.pan = this.options.pan;
            this.volume = this.options.volume;
            this.isHTML5 = !1;
            this._a = null;
            this.id3 = {};
            this._debug = function () {
            };
            this.load = function (b) {
                var c = null;
                if ("undefined" !== typeof b)a._iO = q(b, a.options), a.instanceOptions = a._iO; else if (b = a.options, a._iO = b, a.instanceOptions = a._iO, m && m !== a.url)a._iO.url = a.url, a.url = null;
                if (!a._iO.url)a._iO.url = a.url;
                a._iO.url = ba(a._iO.url);
                if (a._iO.url === a.url && 0 !== a.readyState &&
                    2 !== a.readyState)return 3 === a.readyState && a._iO.onload && a._iO.onload.apply(a, [!!a.duration]), a;
                b = a._iO;
                m = a.url;
                a.loaded = !1;
                a.readyState = 1;
                a.playState = 0;
                if (ca(b)) {
                    if (c = a._setup_html5(b), !c._called_load)a._html5_canplay = !1, a._a.autobuffer = "auto", a._a.preload = "auto", c.load(), c._called_load = !0, b.autoPlay && a.play()
                } else try {
                    a.isHTML5 = !1, a._iO = Z(Y(b)), b = a._iO, 8 === i ? h._load(a.sID, b.url, b.stream, b.autoPlay, b.whileloading ? 1 : 0, b.loops || 1, b.usePolicyFile) : h._load(a.sID, b.url, !!b.stream, !!b.autoPlay, b.loops ||
                        1, !!b.autoLoad, b.usePolicyFile)
                } catch (d) {
                    F({type:"SMSOUND_LOAD_JS_EXCEPTION", fatal:!0})
                }
                return a
            };
            this.unload = function () {
                0 !== a.readyState && (a.isHTML5 ? (g(), a._a && (a._a.pause(), ta(a._a))) : 8 === i ? h._unload(a.sID, "about:blank") : h._unload(a.sID), e());
                return a
            };
            this.destruct = function (b) {
                if (a.isHTML5) {
                    if (g(), a._a)a._a.pause(), ta(a._a), B || d(), a._a._t = null, a._a = null
                } else a._iO.onfailure = null, h._destroySound(a.sID);
                b || c.destroySound(a.sID, !0)
            };
            this.start = this.play = function (b, c) {
                var d, c = void 0 === c ? !0 : c;
                b || (b =
                {});
                a._iO = q(b, a._iO);
                a._iO = q(a._iO, a.options);
                a._iO.url = ba(a._iO.url);
                a.instanceOptions = a._iO;
                if (a._iO.serverURL && !a.connected)return a.getAutoPlay() || a.setAutoPlay(!0), a;
                ca(a._iO) && (a._setup_html5(a._iO), z());
                if (1 === a.playState && !a.paused && (d = a._iO.multiShot, !d))return a;
                if (!a.loaded)if (0 === a.readyState) {
                    if (!a.isHTML5)a._iO.autoPlay = !0;
                    a.load(a._iO)
                } else if (2 === a.readyState)return a;
                if (!a.isHTML5 && 9 === i && 0 < a.position && a.position === a.duration)b.position = 0;
                if (a.paused && a.position && 0 < a.position)a.resume();
                else {
                    a._iO = q(b, a._iO);
                    if (null !== a._iO.from && null !== a._iO.to && 0 === a.instanceCount && 0 === a.playState && !a._iO.serverURL) {
                        d = function () {
                            a._iO = q(b, a._iO);
                            a.play(a._iO)
                        };
                        if (a.isHTML5 && !a._html5_canplay)return a.load({_oncanplay:d}), !1;
                        if (!a.isHTML5 && !a.loaded && (!a.readyState || 2 !== a.readyState))return a.load({onload:d}), !1;
                        a._iO = p()
                    }
                    (!a.instanceCount || a._iO.multiShotEvents || !a.isHTML5 && 8 < i && !a.getAutoPlay()) && a.instanceCount++;
                    0 === a.playState && a._iO.onposition && j(a);
                    a.playState = 1;
                    a.paused = !1;
                    a.position = "undefined" !== typeof a._iO.position && !isNaN(a._iO.position) ? a._iO.position : 0;
                    if (!a.isHTML5)a._iO = Z(Y(a._iO));
                    a._iO.onplay && c && (a._iO.onplay.apply(a), k = !0);
                    a.setVolume(a._iO.volume, !0);
                    a.setPan(a._iO.pan, !0);
                    a.isHTML5 ? (z(), d = a._setup_html5(), a.setPosition(a._iO.position), d.play()) : h._start(a.sID, a._iO.loops || 1, 9 === i ? a._iO.position : a._iO.position / 1E3)
                }
                return a
            };
            this.stop = function (b) {
                var c = a._iO;
                if (1 === a.playState) {
                    a._onbufferchange(0);
                    a._resetOnPosition(0);
                    a.paused = !1;
                    if (!a.isHTML5)a.playState = 0;
                    n();
                    c.to && a.clearOnPosition(c.to);
                    if (a.isHTML5) {
                        if (a._a)b = a.position, a.setPosition(0), a.position = b, a._a.pause(), a.playState = 0, a._onTimer(), g()
                    } else h._stop(a.sID, b), c.serverURL && a.unload();
                    a.instanceCount = 0;
                    a._iO = {};
                    c.onstop && c.onstop.apply(a)
                }
                return a
            };
            this.setAutoPlay = function (b) {
                a._iO.autoPlay = b;
                a.isHTML5 || (h._setAutoPlay(a.sID, b), b && !a.instanceCount && 1 === a.readyState && a.instanceCount++)
            };
            this.getAutoPlay = function () {
                return a._iO.autoPlay
            };
            this.setPosition = function (b) {
                void 0 === b && (b = 0);
                var c = a.isHTML5 ? Math.max(b, 0) : Math.min(a.duration ||
                    a._iO.duration, Math.max(b, 0));
                a.position = c;
                b = a.position / 1E3;
                a._resetOnPosition(a.position);
                a._iO.position = c;
                if (a.isHTML5) {
                    if (a._a && a._html5_canplay && a._a.currentTime !== b)try {
                        a._a.currentTime = b, (0 === a.playState || a.paused) && a._a.pause()
                    } catch (d) {
                    }
                } else b = 9 === i ? a.position : b, a.readyState && 2 !== a.readyState && h._setPosition(a.sID, b, a.paused || !a.playState);
                a.isHTML5 && a.paused && a._onTimer(!0);
                return a
            };
            this.pause = function (b) {
                if (a.paused || 0 === a.playState && 1 !== a.readyState)return a;
                a.paused = !0;
                a.isHTML5 ? (a._setup_html5().pause(),
                    g()) : (b || void 0 === b) && h._pause(a.sID);
                a._iO.onpause && a._iO.onpause.apply(a);
                return a
            };
            this.resume = function () {
                var b = a._iO;
                if (!a.paused)return a;
                a.paused = !1;
                a.playState = 1;
                a.isHTML5 ? (a._setup_html5().play(), z()) : (b.isMovieStar && !b.serverURL && a.setPosition(a.position), h._pause(a.sID));
                k && b.onplay ? (b.onplay.apply(a), k = !0) : b.onresume && b.onresume.apply(a);
                return a
            };
            this.togglePause = function () {
                if (0 === a.playState)return a.play({position:9 === i && !a.isHTML5 ? a.position : a.position / 1E3}), a;
                a.paused ? a.resume() : a.pause();
                return a
            };
            this.setPan = function (b, c) {
                "undefined" === typeof b && (b = 0);
                "undefined" === typeof c && (c = !1);
                a.isHTML5 || h._setPan(a.sID, b);
                a._iO.pan = b;
                if (!c)a.pan = b, a.options.pan = b;
                return a
            };
            this.setVolume = function (b, d) {
                "undefined" === typeof b && (b = 100);
                "undefined" === typeof d && (d = !1);
                if (a.isHTML5) {
                    if (a._a)a._a.volume = Math.max(0, Math.min(1, b / 100))
                } else h._setVolume(a.sID, c.muted && !a.muted || a.muted ? 0 : b);
                a._iO.volume = b;
                if (!d)a.volume = b, a.options.volume = b;
                return a
            };
            this.mute = function () {
                a.muted = !0;
                if (a.isHTML5) {
                    if (a._a)a._a.muted = !0
                } else h._setVolume(a.sID, 0);
                return a
            };
            this.unmute = function () {
                a.muted = !1;
                var b = "undefined" !== typeof a._iO.volume;
                if (a.isHTML5) {
                    if (a._a)a._a.muted = !1
                } else h._setVolume(a.sID, b ? a._iO.volume : a.options.volume);
                return a
            };
            this.toggleMute = function () {
                return a.muted ? a.unmute() : a.mute()
            };
            this.onposition = this.onPosition = function (b, c, d) {
                t.push({position:b, method:c, scope:"undefined" !== typeof d ? d : a, fired:!1});
                return a
            };
            this.clearOnPosition = function (a, b) {
                var c, a = parseInt(a, 10);
                if (isNaN(a))return!1;
                for (c = 0; c < t.length; c++)if (a ===
                    t[c].position && (!b || b === t[c].method))t[c].fired && l--, t.splice(c, 1)
            };
            this._processOnPosition = function () {
                var b, c;
                b = t.length;
                if (!b || !a.playState || l >= b)return!1;
                for (; b--;)if (c = t[b], !c.fired && a.position >= c.position)c.fired = !0, l++, c.method.apply(c.scope, [c.position]);
                return!0
            };
            this._resetOnPosition = function (a) {
                var b, c;
                b = t.length;
                if (!b)return!1;
                for (; b--;)if (c = t[b], c.fired && a <= c.position)c.fired = !1, l--;
                return!0
            };
            p = function () {
                var b = a._iO, c = b.from, d = b.to, e, f;
                f = function () {
                    a.clearOnPosition(d, f);
                    a.stop()
                };
                e =
                    function () {
                        if (null !== d && !isNaN(d))a.onPosition(d, f)
                    };
                if (null !== c && !isNaN(c))b.position = c, b.multiShot = !1, e();
                return b
            };
            j = function () {
                var b = a._iO.onposition;
                if (b)for (var c in b)if (b.hasOwnProperty(c))a.onPosition(parseInt(c, 10), b[c])
            };
            n = function () {
                var b = a._iO.onposition;
                if (b)for (var c in b)b.hasOwnProperty(c) && a.clearOnPosition(parseInt(c, 10))
            };
            z = function () {
                a.isHTML5 && Fa(a)
            };
            g = function () {
                a.isHTML5 && Ga(a)
            };
            e = function () {
                t = [];
                l = 0;
                k = !1;
                a._hasTimer = null;
                a._a = null;
                a._html5_canplay = !1;
                a.bytesLoaded = null;
                a.bytesTotal =
                    null;
                a.duration = a._iO && a._iO.duration ? a._iO.duration : null;
                a.durationEstimate = null;
                a.eqData = [];
                a.eqData.left = [];
                a.eqData.right = [];
                a.failures = 0;
                a.isBuffering = !1;
                a.instanceOptions = {};
                a.instanceCount = 0;
                a.loaded = !1;
                a.metadata = {};
                a.readyState = 0;
                a.muted = !1;
                a.paused = !1;
                a.peakData = {left:0, right:0};
                a.waveformData = {left:[], right:[]};
                a.playState = 0;
                a.position = null
            };
            e();
            this._onTimer = function (b) {
                var c, d = !1, e = {};
                if (a._hasTimer || b) {
                    if (a._a && (b || (0 < a.playState || 1 === a.readyState) && !a.paused)) {
                        c = a._get_html5_duration();
                        if (c !== r)r = c, a.duration = c, d = !0;
                        a.durationEstimate = a.duration;
                        c = 1E3 * a._a.currentTime || 0;
                        c !== s && (s = c, d = !0);
                        (d || b) && a._whileplaying(c, e, e, e, e);
                        return d
                    }
                    return!1
                }
            };
            this._get_html5_duration = function () {
                var b = a._iO, c = a._a ? 1E3 * a._a.duration : b ? b.duration : void 0;
                return c && !isNaN(c) && Infinity !== c ? c : b ? b.duration : null
            };
            this._setup_html5 = function (b) {
                var b = q(a._iO, b), d = decodeURI, g = B ? c._global_a : a._a, h = d(b.url), z = g && g._t ? g._t.instanceOptions : null;
                if (g) {
                    if (g._t && (!B && h === d(m) || B && z.url === b.url && (!m || m === z.url)))return g;
                    B && g._t && g._t.playState && b.url !== z.url && g._t.stop();
                    e();
                    g.src = b.url;
                    m = a.url = b.url;
                    g._called_load = !1
                } else {
                    g = new Audio(b.url);
                    g._called_load = !1;
                    if (Ta)g._called_load = !0;
                    if (B)c._global_a = g
                }
                a.isHTML5 = !0;
                a._a = g;
                g._t = a;
                f();
                g.loop = 1 < b.loops ? "loop" : "";
                b.autoLoad || b.autoPlay ? a.load() : (g.autobuffer = !1, g.preload = "none");
                g.loop = 1 < b.loops ? "loop" : "";
                return g
            };
            f = function () {
                if (a._a._added_events)return!1;
                var b;
                a._a._added_events = !0;
                for (b in u)u.hasOwnProperty(b) && a._a && a._a.addEventListener(b, u[b], !1);
                return!0
            };
            d =
                function () {
                    var b;
                    a._a._added_events = !1;
                    for (b in u)u.hasOwnProperty(b) && a._a && a._a.removeEventListener(b, u[b], !1)
                };
            this._onload = function (b) {
                b = !!b;
                a.loaded = b;
                a.readyState = b ? 3 : 2;
                a._onbufferchange(0);
                a._iO.onload && a._iO.onload.apply(a, [b]);
                return!0
            };
            this._onbufferchange = function (b) {
                if (0 === a.playState || b && a.isBuffering || !b && !a.isBuffering)return!1;
                a.isBuffering = 1 === b;
                a._iO.onbufferchange && a._iO.onbufferchange.apply(a);
                return!0
            };
            this._onsuspend = function () {
                a._iO.onsuspend && a._iO.onsuspend.apply(a);
                return!0
            };
            this._onfailure = function (b, c, d) {
                a.failures++;
                if (a._iO.onfailure && 1 === a.failures)a._iO.onfailure(a, b, c, d)
            };
            this._onfinish = function () {
                var b = a._iO.onfinish;
                a._onbufferchange(0);
                a._resetOnPosition(0);
                if (a.instanceCount) {
                    a.instanceCount--;
                    if (!a.instanceCount)n(), a.playState = 0, a.paused = !1, a.instanceCount = 0, a.instanceOptions = {}, a._iO = {}, g();
                    (!a.instanceCount || a._iO.multiShotEvents) && b && b.apply(a)
                }
            };
            this._whileloading = function (b, c, d, e) {
                var f = a._iO;
                a.bytesLoaded = b;
                a.bytesTotal = c;
                a.duration = Math.floor(d);
                a.bufferLength =
                    e;
                if (f.isMovieStar)a.durationEstimate = a.duration; else if (a.durationEstimate = f.duration ? a.duration > f.duration ? a.duration : f.duration : parseInt(a.bytesTotal / a.bytesLoaded * a.duration, 10), void 0 === a.durationEstimate)a.durationEstimate = a.duration;
                3 !== a.readyState && f.whileloading && f.whileloading.apply(a)
            };
            this._whileplaying = function (b, c, d, e, f) {
                var g = a._iO;
                if (isNaN(b) || null === b)return!1;
                a.position = b;
                a._processOnPosition();
                if (!a.isHTML5 && 8 < i) {
                    if (g.usePeakData && "undefined" !== typeof c && c)a.peakData = {left:c.leftPeak,
                        right:c.rightPeak};
                    if (g.useWaveformData && "undefined" !== typeof d && d)a.waveformData = {left:d.split(","), right:e.split(",")};
                    if (g.useEQData && "undefined" !== typeof f && f && f.leftEQ && (b = f.leftEQ.split(","), a.eqData = b, a.eqData.left = b, "undefined" !== typeof f.rightEQ && f.rightEQ))a.eqData.right = f.rightEQ.split(",")
                }
                1 === a.playState && (!a.isHTML5 && 8 === i && !a.position && a.isBuffering && a._onbufferchange(0), g.whileplaying && g.whileplaying.apply(a));
                return!0
            };
            this._onmetadata = function (b, c) {
                var d = {}, e, f;
                for (e = 0, f = b.length; e <
                    f; e++)d[b[e]] = c[e];
                a.metadata = d;
                a._iO.onmetadata && a._iO.onmetadata.apply(a)
            };
            this._onid3 = function (b, c) {
                var d = [], e, f;
                for (e = 0, f = b.length; e < f; e++)d[b[e]] = c[e];
                a.id3 = q(a.id3, d);
                a._iO.onid3 && a._iO.onid3.apply(a)
            };
            this._onconnect = function (b) {
                b = 1 === b;
                if (a.connected = b)a.failures = 0, o(a.sID) && (a.getAutoPlay() ? a.play(void 0, a.getAutoPlay()) : a._iO.autoLoad && a.load()), a._iO.onconnect && a._iO.onconnect.apply(a, [b])
            };
            this._ondataerror = function () {
                0 < a.playState && a._iO.ondataerror && a._iO.ondataerror.apply(a)
            }
        };
        na = function () {
            return k.body ||
                k._docElement || k.getElementsByTagName("div")[0]
        };
        S = function (b) {
            return k.getElementById(b)
        };
        q = function (b, a) {
            var e = {}, f, d;
            for (f in b)b.hasOwnProperty(f) && (e[f] = b[f]);
            f = "undefined" === typeof a ? c.defaultOptions : a;
            for (d in f)f.hasOwnProperty(d) && "undefined" === typeof e[d] && (e[d] = f[d]);
            return e
        };
        n = function () {
            function b(a) {
                var a = Ra.call(a), b = a.length;
                c ? (a[1] = "on" + a[1], 3 < b && a.pop()) : 3 === b && a.push(!1);
                return a
            }

            function a(a, b) {
                var h = a.shift(), k = [f[b]];
                if (c)h[k](a[0], a[1]); else h[k].apply(h, a)
            }

            var c = j.attachEvent,
                f = {add:c ? "attachEvent" : "addEventListener", remove:c ? "detachEvent" : "removeEventListener"};
            return{add:function () {
                a(b(arguments), "add")
            }, remove:function () {
                a(b(arguments), "remove")
            }}
        }();
        u = {abort:l(function () {
        }), canplay:l(function () {
            var b = this._t;
            if (b._html5_canplay)return!0;
            b._html5_canplay = !0;
            b._onbufferchange(0);
            var a = !isNaN(b.position) ? b.position / 1E3 : null;
            if (b.position && this.currentTime !== a)try {
                this.currentTime = a
            } catch (c) {
            }
            b._iO._oncanplay && b._iO._oncanplay()
        }), load:l(function () {
            var b = this._t;
            b.loaded ||
            (b._onbufferchange(0), b._whileloading(b.bytesTotal, b.bytesTotal, b._get_html5_duration()), b._onload(!0))
        }), emptied:l(function () {
        }), ended:l(function () {
            this._t._onfinish()
        }), error:l(function () {
            this._t._onload(!1)
        }), loadeddata:l(function () {
            var b = this._t, a = b.bytesTotal || 1;
            if (!b._loaded && !Q)b.duration = b._get_html5_duration(), b._whileloading(a, a, b._get_html5_duration()), b._onload(!0)
        }), loadedmetadata:l(function () {
        }), loadstart:l(function () {
            this._t._onbufferchange(1)
        }), play:l(function () {
            this._t._onbufferchange(0)
        }),
            playing:l(function () {
                this._t._onbufferchange(0)
            }), progress:l(function (b) {
                var a = this._t;
                if (a.loaded)return!1;
                var c, f = 0, d = b.target.buffered;
                c = b.loaded || 0;
                var g = b.total || 1;
                if (d && d.length) {
                    for (c = d.length; c--;)f = d.end(c) - d.start(c);
                    c = f / b.target.duration
                }
                isNaN(c) || (a._onbufferchange(0), a._whileloading(c, g, a._get_html5_duration()), c && g && c === g && u.load.call(this, b))
            }), ratechange:l(function () {
            }), suspend:l(function (b) {
                var a = this._t;
                u.progress.call(this, b);
                a._onsuspend()
            }), stalled:l(function () {
            }), timeupdate:l(function () {
                this._t._onTimer()
            }),
            waiting:l(function () {
                this._t._onbufferchange(1)
            })};
        ca = function (b) {
            return!b.serverURL && (b.type ? P({type:b.type}) : P({url:b.url}) || c.html5Only)
        };
        ta = function (b) {
            if (b)b.src = Sa ? "" : "about:blank"
        };
        P = function (b) {
            function a(a) {
                return c.preferFlash && r && !c.ignoreFlash && "undefined" !== typeof c.flash[a] && c.flash[a]
            }

            if (!c.useHTML5Audio || !c.hasHTML5)return!1;
            var e = b.url || null, b = b.type || null, f = c.audioFormats, d;
            if (b && "undefined" !== c.html5[b])return c.html5[b] && !a(b);
            if (!x) {
                x = [];
                for (d in f)f.hasOwnProperty(d) && (x.push(d),
                    f[d].related && (x = x.concat(f[d].related)));
                x = RegExp("\\.(" + x.join("|") + ")(\\?.*)?$", "i")
            }
            d = e ? e.toLowerCase().match(x) : null;
            if (!d || !d.length)if (b)e = b.indexOf(";"), d = (-1 !== e ? b.substr(0, e) : b).substr(6); else return!1; else d = d[1];
            if (d && "undefined" !== typeof c.html5[d])return c.html5[d] && !a(d);
            b = "audio/" + d;
            e = c.html5.canPlayType({type:b});
            return(c.html5[d] = e) && c.html5[b] && !a(b)
        };
        Ja = function () {
            function b(b) {
                var d, e, f = !1;
                if (!a || "function" !== typeof a.canPlayType)return!1;
                if (b instanceof Array) {
                    for (d = 0, e = b.length; d <
                        e && !f; d++)if (c.html5[b[d]] || a.canPlayType(b[d]).match(c.html5Test))f = !0, c.html5[b[d]] = !0, c.flash[b[d]] = !(!c.preferFlash || !r || !b[d].match(Na));
                    return f
                }
                b = a && "function" === typeof a.canPlayType ? a.canPlayType(b) : !1;
                return!(!b || !b.match(c.html5Test))
            }

            if (!c.useHTML5Audio || "undefined" === typeof Audio)return!1;
            var a = "undefined" !== typeof Audio ? Va ? new Audio(null) : new Audio : null, e, f = {}, d, g;
            d = c.audioFormats;
            for (e in d)if (d.hasOwnProperty(e) && (f[e] = b(d[e].type), f["audio/" + e] = f[e], c.flash[e] = c.preferFlash && !c.ignoreFlash &&
                e.match(Na) ? !0 : !1, d[e] && d[e].related))for (g = d[e].related.length; g--;)f["audio/" + d[e].related[g]] = f[e], c.html5[d[e].related[g]] = f[e], c.flash[d[e].related[g]] = f[e];
            f.canPlayType = a ? b : null;
            c.html5 = q(c.html5, f);
            return!0
        };
        G = function () {
        };
        Y = function (b) {
            if (8 === i && 1 < b.loops && b.stream)b.stream = !1;
            return b
        };
        Z = function (b) {
            if (b && !b.usePolicyFile && (b.onid3 || b.usePeakData || b.useWaveformData || b.useEQData))b.usePolicyFile = !0;
            return b
        };
        ra = function () {
        };
        ha = function () {
            return!1
        };
        Da = function (b) {
            for (var a in b)b.hasOwnProperty(a) &&
                "function" === typeof b[a] && (b[a] = ha)
        };
        X = function (b) {
            "undefined" === typeof b && (b = !1);
            (w || b) && c.disable(b)
        };
        Ea = function (b) {
            var a = null;
            if (b)if (b.match(/\.swf(\?.*)?$/i)) {
                if (a = b.substr(b.toLowerCase().lastIndexOf(".swf?") + 4))return b
            } else b.lastIndexOf("/") !== b.length - 1 && (b += "/");
            b = (b && -1 !== b.lastIndexOf("/") ? b.substr(0, b.lastIndexOf("/") + 1) : "./") + c.movieURL;
            c.noSWFCache && (b += "?ts=" + (new Date).getTime());
            return b
        };
        ka = function () {
            i = parseInt(c.flashVersion, 10);
            if (8 !== i && 9 !== i)c.flashVersion = i = 8;
            var b = c.debugMode ||
                c.debugFlash ? "_debug.swf" : ".swf";
            if (c.useHTML5Audio && !c.html5Only && c.audioFormats.mp4.required && 9 > i)c.flashVersion = i = 9;
            c.version = c.versionNumber + (c.html5Only ? " (HTML5-only mode)" : 9 === i ? " (AS3/Flash 9)" : " (AS2/Flash 8)");
            8 < i ? (c.defaultOptions = q(c.defaultOptions, c.flash9Options), c.features.buffering = !0, c.defaultOptions = q(c.defaultOptions, c.movieStarOptions), c.filePatterns.flash9 = RegExp("\\.(mp3|" + Qa.join("|") + ")(\\?.*)?$", "i"), c.features.movieStar = !0) : c.features.movieStar = !1;
            c.filePattern = c.filePatterns[8 !==
                i ? "flash9" : "flash8"];
            c.movieURL = (8 === i ? "soundmanager2.swf" : "soundmanager2_flash9.swf").replace(".swf", b);
            c.features.peakData = c.features.waveformData = c.features.eqData = 8 < i
        };
        Ca = function (b, a) {
            if (!h)return!1;
            h._setPolling(b, a)
        };
        oa = function () {
            if (c.debugURLParam.test(ga))c.debugMode = !0
        };
        o = this.getSoundById;
        H = function () {
            var b = [];
            c.debugMode && b.push("sm2_debug");
            c.debugFlash && b.push("flash_debug");
            c.useHighPerformance && b.push("high_performance");
            return b.join(" ")
        };
        qa = function () {
            G("fbHandler");
            var b = c.getMoviePercent(),
                a = {type:"FLASHBLOCK"};
            if (c.html5Only)return!1;
            if (c.ok()) {
                if (c.oMC)c.oMC.className = [H(), "movieContainer", "swf_loaded" + (c.didFlashBlock ? " swf_unblocked" : "")].join(" ")
            } else {
                if (s)c.oMC.className = H() + " movieContainer " + (null === b ? "swf_timedout" : "swf_error");
                c.didFlashBlock = !0;
                C({type:"ontimeout", ignoreInit:!0, error:a});
                F(a)
            }
        };
        ja = function (b, a, c) {
            "undefined" === typeof v[b] && (v[b] = []);
            v[b].push({method:a, scope:c || null, fired:!1})
        };
        C = function (b) {
            b || (b = {type:"onready"});
            if (!m && b && !b.ignoreInit || "ontimeout" ===
                b.type && c.ok())return!1;
            var a = {success:b && b.ignoreInit ? c.ok() : !w}, e = b && b.type ? v[b.type] || [] : [], f = [], d, a = [a], g = s && c.useFlashBlock && !c.ok();
            if (b.error)a[0].error = b.error;
            for (b = 0, d = e.length; b < d; b++)!0 !== e[b].fired && f.push(e[b]);
            if (f.length)for (b = 0, d = f.length; b < d; b++)if (f[b].scope ? f[b].method.apply(f[b].scope, a) : f[b].method.apply(this, a), !g)f[b].fired = !0;
            return!0
        };
        D = function () {
            j.setTimeout(function () {
                c.useFlashBlock && qa();
                C();
                c.onload instanceof Function && c.onload.apply(j);
                c.waitForWindowLoad && n.add(j,
                    "load", D)
            }, 1)
        };
        da = function () {
            if (void 0 !== r)return r;
            var b = !1, a = navigator, c = a.plugins, f, d = j.ActiveXObject;
            if (c && c.length)(a = a.mimeTypes) && a["application/x-shockwave-flash"] && a["application/x-shockwave-flash"].enabledPlugin && a["application/x-shockwave-flash"].enabledPlugin.description && (b = !0); else if ("undefined" !== typeof d) {
                try {
                    f = new d("ShockwaveFlash.ShockwaveFlash")
                } catch (g) {
                }
                b = !!f
            }
            return r = b
        };
        Ia = function () {
            var b, a;
            if (va && p.match(/os (1|2|3_0|3_1)/i)) {
                c.hasHTML5 = !1;
                c.html5Only = !0;
                if (c.oMC)c.oMC.style.display =
                    "none";
                return!1
            }
            if (c.useHTML5Audio) {
                if (!c.html5 || !c.html5.canPlayType)return c.hasHTML5 = !1, !0;
                c.hasHTML5 = !0;
                if (xa && da())return!0
            } else return!0;
            for (a in c.audioFormats)if (c.audioFormats.hasOwnProperty(a) && (c.audioFormats[a].required && !c.html5.canPlayType(c.audioFormats[a].type) || c.flash[a] || c.flash[c.audioFormats[a].type]))b = !0;
            c.ignoreFlash && (b = !1);
            c.html5Only = c.hasHTML5 && c.useHTML5Audio && !b;
            return!c.html5Only
        };
        ba = function (b) {
            var a, e, f = 0;
            if (b instanceof Array) {
                for (a = 0, e = b.length; a < e; a++)if (b[a]instanceof
                    Object) {
                    if (c.canPlayMIME(b[a].type)) {
                        f = a;
                        break
                    }
                } else if (c.canPlayURL(b[a])) {
                    f = a;
                    break
                }
                if (b[f].url)b[f] = b[f].url;
                return b[f]
            }
            return b
        };
        Fa = function (b) {
            if (!b._hasTimer)b._hasTimer = !0, !wa && c.html5PollingInterval && (null === O && 0 === aa && (O = J.setInterval(Ha, c.html5PollingInterval)), aa++)
        };
        Ga = function (b) {
            if (b._hasTimer)b._hasTimer = !1, !wa && c.html5PollingInterval && aa--
        };
        Ha = function () {
            var b;
            if (null !== O && !aa)return J.clearInterval(O), O = null, !1;
            for (b = c.soundIDs.length; b--;)c.sounds[c.soundIDs[b]].isHTML5 && c.sounds[c.soundIDs[b]]._hasTimer &&
            c.sounds[c.soundIDs[b]]._onTimer()
        };
        F = function (b) {
            b = "undefined" !== typeof b ? b : {};
            c.onerror instanceof Function && c.onerror.apply(j, [
                {type:"undefined" !== typeof b.type ? b.type : null}
            ]);
            "undefined" !== typeof b.fatal && b.fatal && c.disable()
        };
        Ka = function () {
            if (!xa || !da())return!1;
            var b = c.audioFormats, a, e;
            for (e in b)if (b.hasOwnProperty(e) && ("mp3" === e || "mp4" === e))if (c.html5[e] = !1, b[e] && b[e].related)for (a = b[e].related.length; a--;)c.html5[b[e].related[a]] = !1
        };
        this._setSandboxType = function () {
        };
        this._externalInterfaceOK =
            function () {
                if (c.swfLoaded)return!1;
                (new Date).getTime();
                c.swfLoaded = !0;
                I = !1;
                xa && Ka();
                y ? setTimeout(T, 100) : T()
            };
        W = function (b, a) {
            function e(a, b) {
                return'<param name="' + a + '" value="' + b + '" />'
            }

            if (K && L)return!1;
            if (c.html5Only)return ka(), c.oMC = S(c.movieID), T(), L = K = !0, !1;
            var f = a || c.url, d = c.altURL || f, g;
            g = na();
            var h, j, i = H(), l, m = null, m = (m = k.getElementsByTagName("html")[0]) && m.dir && m.dir.match(/rtl/i), b = "undefined" === typeof b ? c.id : b;
            ka();
            c.url = Ea(za ? f : d);
            a = c.url;
            c.wmode = !c.wmode && c.useHighPerformance ? "transparent" :
                c.wmode;
            if (null !== c.wmode && (p.match(/msie 8/i) || !y && !c.useHighPerformance) && navigator.platform.match(/win32|win64/i))c.wmode = null;
            g = {name:b, id:b, src:a, width:"auto", height:"auto", quality:"high", allowScriptAccess:c.allowScriptAccess, bgcolor:c.bgColor, pluginspage:Oa + "www.macromedia.com/go/getflashplayer", title:"JS/Flash audio component (SoundManager 2)", type:"application/x-shockwave-flash", wmode:c.wmode, hasPriority:"true"};
            if (c.debugFlash)g.FlashVars = "debug=1";
            c.wmode || delete g.wmode;
            if (y)f = k.createElement("div"),
                j = ['<object id="' + b + '" data="' + a + '" type="' + g.type + '" title="' + g.title + '" classid="clsid:D27CDB6E-AE6D-11cf-96B8-444553540000" codebase="' + Oa + 'download.macromedia.com/pub/shockwave/cabs/flash/swflash.cab#version=6,0,40,0" width="' + g.width + '" height="' + g.height + '">', e("movie", a), e("AllowScriptAccess", c.allowScriptAccess), e("quality", g.quality), c.wmode ? e("wmode", c.wmode) : "", e("bgcolor", c.bgColor), e("hasPriority", "true"), c.debugFlash ? e("FlashVars", g.FlashVars) : "", "</object>"].join(""); else for (h in f =
                k.createElement("embed"), g)g.hasOwnProperty(h) && f.setAttribute(h, g[h]);
            oa();
            i = H();
            if (g = na())if (c.oMC = S(c.movieID) || k.createElement("div"), c.oMC.id) {
                l = c.oMC.className;
                c.oMC.className = (l ? l + " " : "movieContainer") + (i ? " " + i : "");
                c.oMC.appendChild(f);
                if (y)h = c.oMC.appendChild(k.createElement("div")), h.className = "sm2-object-box", h.innerHTML = j;
                L = !0
            } else {
                c.oMC.id = c.movieID;
                c.oMC.className = "movieContainer " + i;
                h = i = null;
                if (!c.useFlashBlock)if (c.useHighPerformance)i = {position:"fixed", width:"8px", height:"8px", bottom:"0px",
                    left:"0px", overflow:"hidden"}; else if (i = {position:"absolute", width:"6px", height:"6px", top:"-9999px", left:"-9999px"}, m)i.left = Math.abs(parseInt(i.left, 10)) + "px";
                if (Ua)c.oMC.style.zIndex = 1E4;
                if (!c.debugFlash)for (l in i)i.hasOwnProperty(l) && (c.oMC.style[l] = i[l]);
                try {
                    y || c.oMC.appendChild(f);
                    g.appendChild(c.oMC);
                    if (y)h = c.oMC.appendChild(k.createElement("div")), h.className = "sm2-object-box", h.innerHTML = j;
                    L = !0
                } catch (n) {
                    throw Error(G("domError") + " \n" + n.toString());
                }
            }
            return K = !0
        };
        V = function () {
            if (c.html5Only)return W(),
                !1;
            if (h)return!1;
            h = c.getMovie(c.id);
            if (!h)N ? (y ? c.oMC.innerHTML = pa : c.oMC.appendChild(N), N = null, K = !0) : W(c.id, c.url), h = c.getMovie(c.id);
            c.oninitmovie instanceof Function && setTimeout(c.oninitmovie, 1);
            return!0
        };
        U = function () {
            setTimeout(Ba, 1E3)
        };
        Ba = function () {
            if ($)return!1;
            $ = !0;
            n.remove(j, "load", U);
            if (I && !ya)return!1;
            var b;
            m || (b = c.getMoviePercent());
            setTimeout(function () {
                    b = c.getMoviePercent();
                    !m && Ma && (null === b ? c.useFlashBlock || 0 === c.flashLoadTimeout ? c.useFlashBlock && qa() : X(!0) : 0 !== c.flashLoadTimeout && X(!0))
                },
                c.flashLoadTimeout)
        };
        A = function () {
            function b() {
                n.remove(j, "focus", A);
                n.remove(j, "load", A)
            }

            if (ya || !I)return b(), !0;
            ya = Ma = !0;
            Q && I && n.remove(j, "mousemove", A);
            $ = !1;
            b();
            return!0
        };
        La = function () {
            var b, a = [];
            if (c.useHTML5Audio && c.hasHTML5)for (b in c.audioFormats)c.audioFormats.hasOwnProperty(b) && a.push(b + ": " + c.html5[b] + (!c.html5[b] && r && c.flash[b] ? " (using flash)" : c.preferFlash && c.flash[b] && r ? " (preferring flash)" : !c.html5[b] ? " (" + (c.audioFormats[b].required ? "required, " : "") + "and no flash support)" : ""))
        };
        M = function (b) {
            if (m)return!1;
            if (c.html5Only)return m = !0, D(), !0;
            var a;
            if (!c.useFlashBlock || !c.flashLoadTimeout || c.getMoviePercent())m = !0, w && (a = {type:!r && s ? "NO_FLASH" : "INIT_TIMEOUT"});
            if (w || b) {
                if (c.useFlashBlock && c.oMC)c.oMC.className = H() + " " + (null === c.getMoviePercent() ? "swf_timedout" : "swf_error");
                C({type:"ontimeout", error:a});
                F(a);
                return!1
            }
            if (c.waitForWindowLoad && !ia)return n.add(j, "load", D), !1;
            D();
            return!0
        };
        T = function () {
            if (m)return!1;
            if (c.html5Only) {
                if (!m)n.remove(j, "load", c.beginDelayedInit), c.enabled = !0, M();
                return!0
            }
            V();
            try {
                h._externalInterfaceTest(!1), Ca(!0, c.flashPollingInterval || (c.useHighPerformance ? 10 : 50)), c.debugMode || h._disableDebug(), c.enabled = !0, c.html5Only || n.add(j, "unload", ha)
            } catch (b) {
                return F({type:"JS_TO_FLASH_EXCEPTION", fatal:!0}), X(!0), M(), !1
            }
            M();
            n.remove(j, "load", c.beginDelayedInit);
            return!0
        };
        E = function () {
            if (ma)return!1;
            ma = !0;
            oa();
            if (!r && c.hasHTML5)c.useHTML5Audio = !0, c.preferFlash = !1;
            Ja();
            c.html5.usingFlash = Ia();
            s = c.html5.usingFlash;
            La();
            if (!r && s)c.flashLoadTimeout = 1;
            k.removeEventListener &&
            k.removeEventListener("DOMContentLoaded", E, !1);
            V();
            return!0
        };
        ua = function () {
            "complete" === k.readyState && (E(), k.detachEvent("onreadystatechange", ua));
            return!0
        };
        la = function () {
            ia = !0;
            n.remove(j, "load", la)
        };
        da();
        n.add(j, "focus", A);
        n.add(j, "load", A);
        n.add(j, "load", U);
        n.add(j, "load", la);
        Q && I && n.add(j, "mousemove", A);
        k.addEventListener ? k.addEventListener("DOMContentLoaded", E, !1) : k.attachEvent ? k.attachEvent("onreadystatechange", ua) : F({type:"NO_DOM2_EVENTS", fatal:!0});
        "complete" === k.readyState && setTimeout(E, 100)
    }

    var ea = null;
    if ("undefined" === typeof SM2_DEFER || !SM2_DEFER)ea = new R;
    J.SoundManager = R;
    J.soundManager = ea
})(window);