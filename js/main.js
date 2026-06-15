/* Serendipity R2 — interactions: nav, video, scroll-reveal, count-up, gauges */
(function () {
  document.documentElement.classList.add('js');
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function init() {
    document.documentElement.classList.add('reveal-ready');
    /* mobile nav */
    var toggle = document.querySelector('.nav-toggle');
    var nav = document.getElementById('mainNav');
    if (toggle && nav) {
      toggle.addEventListener('click', function () {
        var open = nav.classList.toggle('open');
        toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
      });
      nav.querySelectorAll('a').forEach(function (a) { a.addEventListener('click', function () { nav.classList.remove('open'); toggle.setAttribute('aria-expanded', 'false'); }); });
    }

    /* poster-first hero video */
    var playBtn = document.getElementById('playBtn');
    if (playBtn) {
      playBtn.addEventListener('click', function () {
        var card = document.getElementById('heroVideo');
        var video = document.createElement('video');
        video.src = (window.__resources && window.__resources.sizzleVideo) || 'https://createserendipity.com/hubfs/Serendipity%20Testimonial%20Sizzle%20Video_1080p.mp4';
        video.controls = true; video.autoplay = true; video.playsInline = true;
        card.appendChild(video);
        playBtn.style.display = 'none';
        card.querySelectorAll('.video-frame-tag, .video-caption').forEach(function (el) { el.style.display = 'none'; });
      });
    }

    /* count-up helper */
    function countUp(el) {
      var target = parseFloat(el.getAttribute('data-target'));
      var suffix = el.getAttribute('data-suffix') || '';
      var prefix = el.getAttribute('data-prefix') || '';
      if (reduceMotion) { el.textContent = prefix + target + suffix; return; }
      var dur = 1100, start = null;
      function step(ts) {
        if (!start) start = ts;
        var p = Math.min((ts - start) / dur, 1);
        var eased = 1 - Math.pow(1 - p, 3);
        var val = Math.round(target * eased);
        el.textContent = prefix + val + suffix;
        if (p < 1) requestAnimationFrame(step);
        else el.textContent = prefix + target + suffix;
      }
      requestAnimationFrame(step);
    }

    /* reveal on scroll — rect-based (IntersectionObserver is unreliable in some embeds) */
    var revealEls = [].slice.call(document.querySelectorAll('.reveal, [data-target]'));
    function checkReveal() {
      var vh = window.innerHeight || document.documentElement.clientHeight;
      revealEls = revealEls.filter(function (el) {
        var r = el.getBoundingClientRect();
        if (r.top < vh * 0.92 && r.bottom > -40) {
          el.classList.add('in');
          if (el.hasAttribute('data-target')) countUp(el);
          return false;
        }
        return true;
      });
    }
    checkReveal();
    window.addEventListener('scroll', checkReveal, { passive: true });
    window.addEventListener('resize', checkReveal);
    /* safety net: never leave content hidden */
    setTimeout(checkReveal, 250);
    setTimeout(function () {
      document.querySelectorAll('.reveal:not(.in)').forEach(function (el) {
        var r = el.getBoundingClientRect();
        if (r.top < (window.innerHeight || 800)) el.classList.add('in');
      });
      /* finalize any count-up numbers so they never show a partial/zero value */
      document.querySelectorAll('[data-target]').forEach(function (el) {
        var t = el.getAttribute('data-target');
        el.textContent = (el.getAttribute('data-prefix') || '') + t + (el.getAttribute('data-suffix') || '');
      });
    }, 1200);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
