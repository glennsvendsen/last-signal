/* Last Signal: progressive enhancement only. The page reads fully without this file. */
(() => {
  'use strict';
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const conn = navigator.connection || {};
  const lean = reduced || conn.saveData || /(^|-)2g$/.test(conn.effectiveType || '');   // data saver, slow link, or reduced motion: stills only

  // ---------------------------------------------------------------- bar turns solid after the hero
  const bar = document.querySelector('[data-bar]');
  const onScroll = () => bar.classList.toggle('is-solid', scrollY > 40);
  addEventListener('scroll', onScroll, { passive: true }); onScroll();

  const year = document.querySelector('[data-year]');
  if (year) year.textContent = new Date().getFullYear();

  // ---------------------------------------------------------------- reveal on scroll
  const reveals = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && !reduced) {
    const io = new IntersectionObserver((entries) => {
      for (const e of entries) if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
    reveals.forEach((el) => io.observe(el));
  } else {
    reveals.forEach((el) => el.classList.add('in'));
  }

  // ---------------------------------------------------------------- typed stamp (screen readers get the full text at once)
  const stamp = document.querySelector('[data-type]');
  if (stamp && !reduced) {
    const text = stamp.textContent;
    stamp.setAttribute('aria-label', text);
    stamp.textContent = '';
    let i = 0;
    const tick = () => {
      stamp.textContent = text.slice(0, ++i);
      if (i < text.length) setTimeout(tick, 70 + Math.random() * 60);
    };
    setTimeout(tick, 500);
  }

  // ---------------------------------------------------------------- decorative loops
  // Each <video data-src> is attached only if the file exists (the trailer session delivers them),
  // plays only while on screen, and fades in over its still image.
  const loops = [...document.querySelectorAll('video[data-src]')];
  if (!lean && loops.length && 'IntersectionObserver' in window) {
    const watcher = new IntersectionObserver((entries) => {
      for (const e of entries) {
        const v = e.target;
        if (!v.src) continue;
        if (e.isIntersecting) v.play().catch(() => {});      // Low Power Mode may refuse: the still stays
        else v.pause();
      }
    }, { threshold: 0.25 });

    loops.forEach(async (v) => {
      try {
        const head = await fetch(v.dataset.src, { method: 'HEAD' });
        if (!head.ok) return;
      } catch { return; }
      v.src = v.dataset.src;
      v.addEventListener('playing', () => v.classList.add('is-on'), { once: true });
      watcher.observe(v);
    });
    document.addEventListener('visibilitychange', () => { if (document.hidden) loops.forEach((v) => v.pause()); });
  }

  // ---------------------------------------------------------------- analytics (cookie-free Umami; a no-op when the script is blocked or off the live domain)
  // Links carry data-umami-event in the HTML (downloads, feedback, releases...). These are the events HTML attributes cannot express.
  const track = (name, data) => { try { if (window.umami) window.umami.track(name, data); } catch {} };

  document.querySelectorAll('[data-bar] nav a').forEach((a) =>
    a.addEventListener('click', () => track('ls-nav', { section: a.getAttribute('href').slice(1) })));

  document.querySelectorAll('[data-soon]').forEach((el) =>
    el.addEventListener('click', () => track('ls-soon-click', { platform: el.dataset.soon })));

  const trailer = document.querySelector('#trailer video');
  if (trailer) {
    const marks = { 25: false, 50: false, 75: false };
    let started = false;
    trailer.addEventListener('play', () => { if (!started) { started = true; track('ls-trailer-play'); } });
    trailer.addEventListener('timeupdate', () => {
      if (!trailer.duration) return;
      const pct = (trailer.currentTime / trailer.duration) * 100;
      for (const m in marks) if (!marks[m] && pct >= m) { marks[m] = true; track('ls-trailer-progress', { percent: Number(m) }); }
    });
    trailer.addEventListener('ended', () => track('ls-trailer-complete'));
  }

  // Which sections people actually reach (once each per visit).
  if ('IntersectionObserver' in window) {
    const seen = new IntersectionObserver((entries) => {
      for (const e of entries) if (e.isIntersecting) { track('ls-section-view', { section: e.target.id }); seen.unobserve(e.target); }
    }, { rootMargin: '0px 0px -50% 0px' });          // counts once a section reaches mid-screen, however tall it is
    document.querySelectorAll('main section[id]:not(#top)').forEach((s) => seen.observe(s));
  }

  // ---------------------------------------------------------------- gallery lightbox
  const box = document.querySelector('[data-lightbox]');
  const links = [...document.querySelectorAll('[data-gallery] a')];
  if (box && typeof box.showModal === 'function' && links.length) {
    const img = box.querySelector('[data-lb-img]');
    const cap = box.querySelector('[data-lb-cap]');
    let index = 0, opener = null;

    const show = (i) => {
      index = (i + links.length) % links.length;
      const a = links[index];
      img.src = a.href;
      img.alt = a.querySelector('img').alt;
      cap.textContent = a.dataset.caption || '';
      new Image().src = links[(index + 1) % links.length].href;     // warm the next one
    };
    const open = (i, from) => { opener = from; show(i); if (!box.open) box.showModal(); };

    links.forEach((a, i) => a.addEventListener('click', (e) => { e.preventDefault(); open(i, a); track('ls-gallery-open', { image: a.dataset.caption || String(i + 1) }); }));
    box.querySelector('[data-lb-close]').addEventListener('click', () => box.close());
    box.querySelector('[data-lb-prev]').addEventListener('click', () => show(index - 1));
    box.querySelector('[data-lb-next]').addEventListener('click', () => show(index + 1));
    box.addEventListener('click', (e) => { if (e.target === box) box.close(); });       // click outside the picture
    box.addEventListener('close', () => { img.removeAttribute('src'); if (opener) opener.focus(); });
    box.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowLeft') show(index - 1);
      else if (e.key === 'ArrowRight') show(index + 1);
    });
  }

  // ---------------------------------------------------------------- download count (GitHub release assets; hidden if the API is unreachable or rate-limited)
  const count = document.querySelector('[data-dl-count]');
  if (count) {
    fetch('https://api.github.com/repos/glennsvendsen/last-signal/releases', { headers: { Accept: 'application/vnd.github+json' } })
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then((rel) => {
        const n = rel.reduce((sum, r) => sum + (r.assets || []).reduce((a, x) => a + (x.download_count || 0), 0), 0);
        if (n > 0) { count.textContent = n.toLocaleString('en') + (n === 1 ? ' download' : ' downloads'); count.hidden = false; }
      })
      .catch(() => {});
  }
})();
