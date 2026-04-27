// Musique — démarre sur le clic du bouton 🎵
(function() {
  var SONG = 'glue-song.mp3';
  var audio = null;
  var playing = false;

  function getAudio() {
    if (!audio) {
      audio = new Audio(SONG);
      audio.loop = true;
      audio.volume = 0.6;
    }
    return audio;
  }

  function toggleMusic() {
    var a = getAudio();
    var btn = document.getElementById('musicBtn');
    if (!playing) {
      a.play().then(function() {
        playing = true;
        if (btn) btn.textContent = '🔊';
      }).catch(function(e) {
        console.log('Audio error:', e);
      });
    } else {
      a.pause();
      playing = false;
      if (btn) btn.textContent = '🔇';
    }
  }

  // Inject button directly into body
  function inject() {
    var btn = document.createElement('button');
    btn.id = 'musicBtn';
    btn.textContent = '🔇';
    btn.onclick = toggleMusic;
    btn.style.cssText = [
      'position:fixed',
      'bottom:16px',
      'right:16px',
      'width:44px',
      'height:44px',
      'border-radius:50%',
      'border:none',
      'background:rgba(255,255,255,0.85)',
      'font-size:20px',
      'cursor:pointer',
      'z-index:99999',
      'box-shadow:0 2px 8px rgba(0,0,0,0.2)',
      'touch-action:manipulation'
    ].join(';');
    document.body.appendChild(btn);
  }

  if (document.body) {
    inject();
  } else {
    document.addEventListener('DOMContentLoaded', inject);
  }
})();
