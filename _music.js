(function() {
  const SRC   = 'glue-song.mp3';
  const KEY   = 'musicTime';
  const MKEY  = 'musicMuted';

  const audio = new Audio(SRC);
  audio.loop    = true;
  audio.volume  = 0.55;
  audio.preload = 'auto';
  audio.muted   = sessionStorage.getItem(MKEY) === '1';

  let started = false;

  function startMusic() {
    if (started) return;
    started = true;
    const saved = parseFloat(sessionStorage.getItem(KEY) || '0');
    if (saved > 0) audio.currentTime = saved;
    audio.play().catch(function(){});
  }

  // Save on exit
  function saveTime() { sessionStorage.setItem(KEY, audio.currentTime); }
  window.addEventListener('pagehide',     saveTime);
  window.addEventListener('beforeunload', saveTime);

  // Inject button + start on first click
  function injectBtn() {
    if (document.getElementById('muteBtn')) return;

    const btn = document.createElement('button');
    btn.id = 'muteBtn';
    btn.innerHTML = audio.muted ? '🔇' : '🎵';
    btn.title = 'Musique';
    Object.assign(btn.style, {
      position: 'fixed', bottom: '16px', right: '16px',
      background: 'rgba(255,255,255,0.85)',
      border: '2px solid rgba(200,56,90,0.3)',
      borderRadius: '50%', width: '46px', height: '46px',
      fontSize: '20px', cursor: 'pointer', zIndex: '99999',
      boxShadow: '0 3px 10px rgba(0,0,0,0.2)',
      touchAction: 'manipulation',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      lineHeight: '1'
    });

    btn.addEventListener('click', function(e) {
      e.stopPropagation();
      if (!started) {
        startMusic();
      } else {
        audio.muted = !audio.muted;
        sessionStorage.setItem(MKEY, audio.muted ? '1' : '0');
      }
      btn.innerHTML = audio.muted ? '🔇' : '🎵';
    });

    document.body.appendChild(btn);

    // Try autoplay — if it works, update icon
    audio.play().then(function() {
      started = true;
      btn.innerHTML = audio.muted ? '🔇' : '🎵';
    }).catch(function() {
      // Autoplay blocked — wait for first interaction anywhere
      function onInteract() {
        startMusic();
        btn.innerHTML = audio.muted ? '🔇' : '🎵';
        document.removeEventListener('click',      onInteract);
        document.removeEventListener('touchstart', onInteract);
      }
      document.addEventListener('click',      onInteract, { passive: true });
      document.addEventListener('touchstart', onInteract, { passive: true });
    });
  }

  if (document.body) {
    injectBtn();
  } else {
    document.addEventListener('DOMContentLoaded', injectBtn);
  }
})();
