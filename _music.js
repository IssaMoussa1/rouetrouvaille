(function() {
  const SRC = 'glue-song.mp3';
  const KEY = 'musicTime';

  const audio = new Audio(SRC);
  audio.loop   = true;
  audio.volume = 0.55;
  audio.preload = 'auto';

  let started = false;

  function startMusic() {
    if (started) return;
    // Restore position from previous page
    const saved = parseFloat(sessionStorage.getItem(KEY) || '0');
    if (saved > 0) {
      audio.addEventListener('canplay', function onCanPlay() {
        audio.currentTime = saved;
        audio.removeEventListener('canplay', onCanPlay);
      });
    }
    audio.play().then(function() {
      started = true;
    }).catch(function() {});
  }

  // Try autoplay immediately
  startMusic();

  // Fallback: start on first user interaction anywhere on the page
  ['click','touchstart','keydown'].forEach(function(evt) {
    document.addEventListener(evt, function handler() {
      startMusic();
      if (started) {
        document.removeEventListener(evt, handler);
      }
    }, { once: false });
  });

  // Save position when leaving the page
  window.addEventListener('pagehide', function() {
    sessionStorage.setItem(KEY, audio.currentTime);
  });
  window.addEventListener('beforeunload', function() {
    sessionStorage.setItem(KEY, audio.currentTime);
  });

  // Mute toggle button
  window.addEventListener('DOMContentLoaded', function() {
    const btn = document.createElement('button');
    btn.id = 'muteBtn';
    btn.textContent = '🔊';
    Object.assign(btn.style, {
      position:'fixed', bottom:'16px', right:'16px',
      background:'rgba(255,255,255,0.75)', border:'none',
      borderRadius:'50%', width:'42px', height:'42px',
      fontSize:'18px', cursor:'pointer', zIndex:'999',
      boxShadow:'0 2px 8px rgba(0,0,0,0.15)',
      touchAction:'manipulation'
    });
    btn.addEventListener('click', function() {
      // Also use mute button click to start music if not started
      startMusic();
      audio.muted = !audio.muted;
      btn.textContent = audio.muted ? '🔇' : '🔊';
    });
    document.body.appendChild(btn);
  });
})();
