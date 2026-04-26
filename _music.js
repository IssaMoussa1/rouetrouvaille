// Shared music helper — include on every page
(function() {
  const SRC = 'glue-song.mp3';
  const KEY = 'musicTime';

  const audio = new Audio(SRC);
  audio.loop   = true;
  audio.volume = 0.55;

  const saved = parseFloat(sessionStorage.getItem(KEY) || '0');
  if (saved > 0) audio.currentTime = saved;

  function tryPlay() {
    audio.play().catch(() => {
      // Autoplay blocked — play on first user interaction
      document.addEventListener('click', function once() {
        audio.play();
        document.removeEventListener('click', once);
      });
    });
  }
  tryPlay();

  // Save position before leaving
  window.addEventListener('pagehide', () => {
    sessionStorage.setItem(KEY, audio.currentTime);
  });

  // Mute toggle button (injected)
  window.addEventListener('DOMContentLoaded', () => {
    const btn = document.createElement('button');
    btn.id = 'muteBtn';
    btn.textContent = '🔊';
    Object.assign(btn.style, {
      position:'fixed', bottom:'16px', right:'16px',
      background:'rgba(255,255,255,0.7)', border:'none',
      borderRadius:'50%', width:'40px', height:'40px',
      fontSize:'18px', cursor:'pointer', zIndex:'999',
      boxShadow:'0 2px 8px rgba(0,0,0,0.15)'
    });
    btn.onclick = () => {
      audio.muted = !audio.muted;
      btn.textContent = audio.muted ? '🔇' : '🔊';
    };
    document.body.appendChild(btn);
  });
})();
