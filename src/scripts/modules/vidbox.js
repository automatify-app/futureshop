function YouTubeGetID(url) {
  var ID = '';
  url = url
    .replace(/(>|<)/gi, '')
    .split(/(vi\/|v=|\/v\/|youtu\.be\/|\/embed\/)/);
  if (url[2] !== undefined) {
    ID = url[2].split(/[^0-9a-z_\-]/i);
    ID = ID[0];
  } else {
    ID = url;
  }
  return ID;
}

export default class Vidbox {
  constructor(el) {
    var tag = document.createElement('script');
    tag.src = 'https://www.youtube.com/iframe_api';
    var firstScriptTag = document.getElementsByTagName('script')[0];
    firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
    let playerWrap = el;
    let startTime = 0;
    if (el.getAttribute('data-start-time') > 0) {
      startTime = Math.max(0, el.getAttribute('data-start-time'));
    }
    const vars = {
      rel: 0,
      showinfo: 0,
      modestBranding: 1,
      // "loop": 1,
      start: startTime,
      playsinline: 1,
      enablejsapi: 1,
      disablekb: 1,
      controls: 0,
      autoplay: 1,
      mute: 1,
    };

    el.player = '';
    var prev_func = window.onYouTubeIframeAPIReady;
    window.onYouTubeIframeAPIReady = function () {
      if (prev_func && typeof prev_func == 'function') {
        prev_func();
      }
      el.player = new YT.Player(el.querySelector('.youtube-player'), {
        height: '600',
        width: '1200',
        videoId: YouTubeGetID(el.getAttribute('data-video-url')),
        playerVars: vars,
        events: {
          onReady: onPlayerReady,
          onStateChange: onPlayerStateChange,
        },
      });
    };

    var checkCount = 0;
    function checkIfPlaying() {
      var state = el.player.getPlayerState();

      // playerWrap.classList.add('use-vid');
      if (checkCount > 12 && state != 1) {
        playerWrap.classList.add('use-gif');
        if (window.innerWidth <= 800) {
          playerWrap.classList.add('use-gif');
          playerWrap.classList.add('small');
        }
        return false;
      }
      if (state == 5 || state == 3 || state == -1) {
        checkCount++;
        if (state == 5) {
          checkCount++;
        }

        el.player.mute();
        el.player.setVolume(0);

        if (startTime > 0) {
          el.player.seekTo(startTime);
        } else {
          el.player.playVideo();

          el.player.mute();
        }
        setTimeout(checkIfPlaying, 200);
      }
      if (state == 1) {
        playerWrap.classList.add('use-vid');
        return true;
      }
      // if (state == -1)
      //     playerWrap.classList.add('use-gif');
      //   if (window.innerWidth <= 800) {
      //     playerWrap.classList.add('small');
      //   }
      //   return false;
    }

    function onPlayerReady(event) {
      el.player.mute();
      el.player.playVideo();
      event.target.mute();
      event.target.mute();

      // if (startTime > 0) {
      //   el.player.seekTo(startTime)
      // }
      setTimeout(checkIfPlaying, 50);
    }

    function onPlayerStateChange(event) {
      el.player.mute();
      if (event.data == YT.PlayerState.PLAYING) {
      } else if (event.data == YT.PlayerState.ENDED) {
        el.player.playVideo();

        // if (startTime > 0) {
        //   el.player.seekTo(startTime)
        // }
      } else {
      }
    }
  }
}
