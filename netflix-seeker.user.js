// ==UserScript==
// @name     Netflix Seeker
// @license  MIT
// @version  0.0.1
// @description  benry
// @include    /^https:\/\/www\.netflix\.com\/watch\/.*$/
// @copyright  2018+, aycabta
// @grant    none
// ==/UserScript==

(function() {
    function initialize() {
        var savedTime = null;
        var seekSeconds = 5;
        var isShownControls = true;
        var leftControls = document.getElementsByClassName('video-title')[0];
        var secondsInfo = document.createElement('div');
        secondsInfo.style.color = '#BBB';
        secondsInfo.style.fontSize = '2.2em';
        secondsInfo.classList.add('time-display');
        secondsInfo.classList.add('ellipsize-text');
        var secondsText = document.createTextNode('seek ' + seekSeconds.toString(10))
        secondsInfo.appendChild(secondsText);
        leftControls.appendChild(secondsInfo);
        document.addEventListener("keydown", function(e) {
            var to = null;
            var videoPlayer = netflix.appContext.state.playerApp.getAPI().videoPlayer;
            var playerSessionId = videoPlayer.getAllPlayerSessionIds()[0];
            var player = videoPlayer.getVideoPlayerBySessionId(playerSessionId);
            switch (e.keyCode) {
                case 219: // [
                    seekSeconds--;
                    console.log("seek with " + seekSeconds + " seconds");
                    secondsText.textContent = 'seek ' + seekSeconds.toString(10);
                    break;
                case 221: // ]
                    seekSeconds++;
                    console.log("seek with " + seekSeconds + " seconds");
                    secondsText.textContent = 'seek ' + seekSeconds.toString(10);
                    break;
                case 85: // u
                    to = player.getCurrentTime() - seekSeconds * 1000;
                    break;
                case 79: // o
                    to = player.getCurrentTime() + seekSeconds * 1000;
                    break;
                case 83: // s
                    savedTime = player.getCurrentTime();
                    break;
                case 82: // r
                    if (savedTime !== null) {
                        to = savedTime;
                    }
                    break;
                case 73: // i
                    if (player.getPaused()) {
                        player.play();
                    } else {
                        player.pause();
                    }
                    break;
            }
            if (to !== null) {
                if (to < 0) {
                    to = 0;
                } else if (to > player.getDuration()) {
                    to = player.getDuration();
                }
                player.seek(to, true);
            }
        });
    };
    var script = document.createElement('script');
    script.textContent = '(' + initialize.toString() + ')()';
    var head = document.getElementsByTagName('head')[0];
    var intervalId = setInterval(function() {
        if (typeof document.getElementsByClassName('video-title')[0] !== "undefined") {
            head.appendChild(script);
            clearInterval(intervalId);
        }
    }, 200);
})();
