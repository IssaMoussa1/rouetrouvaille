(function() {
  const SRC = 'glue-song.mp3';
  const KEY = 'musicTime';

  const audio = new Audio(SRC);
  audio.loop    = true;
  audio.volume  = 0.55;
  audio.preload = 'auto';

  let started = false;

  function startMusic() {
    if (started) return;
    const saved = parseFloat(sessionStorage.getItem(KEY) || '0');
    if (saved > 0) {
      audio.addEventListener('canplay', function onCanPlay() {
        audio.currentTime = saved;
        audio.removeEventListener('canplay', onCanPlay);
      }, { once: true });
    }
    audio.play().then(function() { started = true; }).catch(function() {});
  }

  // Try autoplay immediately
  startMusic();

  // Fallback on any interaction
  ['click','touchstart','keydown'].forEach(function(evt) {
    document.addEventListener(evt, function() { startMusic(); }, { passive: true });
  });

  // Save position when leaving
  window.addEventListener('pagehide',     function() { sessionStorage.setItem(KEY, audio.currentTime); });
  window.addEventListener('beforeunload', function() { sessionStorage.setItem(KEY, audio.currentTime); });

  // Inject mute button — works whether DOM is ready or not
  function injectBtn() {
    if (document.getElementById('muteBtn')) return;
    const btn = document.createElement('button');
    btn.id = 'muteBtn';
    btn.textContent = '🔊';
    Object.assign(btn.style, {
      position:'fixed', bottom:'16px', right:'16px',
      background:'rgba(255,255,255,0.75)', border:'none',
      borderRadius:'50%', width:'42px', height:'42px',
      fontSize:'18px', cursor:'pointer', zIndex:'9999',
      boxShadow:'0 2px 8px rgba(0,0,0,0.15)',
      touchAction:'manipulation'
    });
    btn.addEventListener('click', function() {
      startMusic();
      audio.muted = !audio.muted;
      btn.textContent = audio.muted ? '🔇' : '🔊';
    });
    (document.body || document.documentElement).appendChild(btn);
  }

  // Inject immediately if body exists, otherwise wait
  if (document.body) {
    injectBtn();
  } else {
    document.addEventListener('DOMContentLoaded', injectBtn);
  }
})();
