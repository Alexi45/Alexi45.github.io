/* ═══════════════════════════════════════════════════════════
   Alejandro Riscart Rosado — web personal
   ═══════════════════════════════════════════════════════════ */

(function () {
  'use strict';

  var html = document.documentElement;
  var mq = window.matchMedia;
  var reduceMotion = mq && mq('(prefers-reduced-motion: reduce)').matches;
  var finePointer = mq && mq('(hover: hover) and (pointer: fine)').matches;
  var EMAIL = 'jarlaaxlety@gmail.com';

  function store(k, v) { try { localStorage.setItem(k, v); } catch (e) { /* sin storage */ } }
  function recall(k) { try { return localStorage.getItem(k); } catch (e) { return null; } }
  function $(s) { return document.querySelector(s); }
  function $$(s) { return Array.prototype.slice.call(document.querySelectorAll(s)); }

  /* ─────────── Tema claro / oscuro ─────────── */

  var themeBtn = $('#themeBtn');

  function applyTheme(theme) {
    html.setAttribute('data-theme', theme);
    var meta = $('meta[name="theme-color"]');
    if (meta) meta.setAttribute('content', theme === 'dark' ? '#07090f' : '#fafbfd');
    themeBtn.setAttribute('aria-label', theme === 'dark' ? 'Cambiar a tema claro' : 'Cambiar a tema oscuro');
    store('theme', theme);
  }
  function toggleTheme() {
    applyTheme(html.getAttribute('data-theme') === 'dark' ? 'light' : 'dark');
  }

  applyTheme(recall('theme') || (mq && mq('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'));
  themeBtn.addEventListener('click', toggleTheme);

  /* ─────────── Idioma ES / EN ───────────
     El español vive en el HTML (mejor para SEO) y cada elemento traducible lleva
     un data-en con su versión inglesa. Al arrancar guardamos el original en
     data-es y a partir de ahí solo intercambiamos.                            */

  var langBtn = $('#langBtn');
  var langLabel = $('#langLabel');
  var translatables = $$('[data-en]');

  translatables.forEach(function (el) {
    if (el.tagName === 'TITLE') el.setAttribute('data-es', el.textContent);
    else if (el.tagName === 'META') el.setAttribute('data-es', el.getAttribute('content'));
    else el.setAttribute('data-es', el.innerHTML);
  });

  function lang() { return html.getAttribute('lang') === 'en' ? 'en' : 'es'; }

  function applyLang(l) {
    var attr = l === 'en' ? 'data-en' : 'data-es';
    translatables.forEach(function (el) {
      var v = el.getAttribute(attr);
      if (v === null) return;
      if (el.tagName === 'TITLE') document.title = v;
      else if (el.tagName === 'META') el.setAttribute('content', v);
      else el.innerHTML = v;
    });
    html.setAttribute('lang', l);
    langLabel.textContent = l === 'en' ? 'ES' : 'EN';
    langBtn.setAttribute('aria-label', l === 'en' ? 'Cambiar a español' : 'Switch to English');
    var pi = $('#paletteInput');
    if (pi) pi.placeholder = l === 'en' ? 'Search a section or action…' : 'Buscar sección o acción…';
    store('lang', l);
  }
  function toggleLang() { applyLang(lang() === 'en' ? 'es' : 'en'); }

  var saved = recall('lang');
  applyLang(saved || ((navigator.language || 'es').toLowerCase().indexOf('es') === 0 ? 'es' : 'en'));
  langBtn.addEventListener('click', toggleLang);

  /* ─────────── Foto y CV ─────────── */

  var portrait = $('#portraitImg');
  var monogram = $('#monogram');

  function showPortrait() {
    portrait.hidden = false;
    monogram.style.display = 'none';
  }

  portrait.addEventListener('load', showPortrait);
  portrait.addEventListener('error', function () { portrait.remove(); });

  // Con la caché caliente la imagen ya está lista antes de llegar aquí y el
  // evento 'load' no vuelve a dispararse: hay que comprobarlo a mano.
  if (portrait.complete) {
    if (portrait.naturalWidth > 0) showPortrait();
    else portrait.remove();
  }

  var cvLinks = $$('[data-cv]');
  if (cvLinks.length && /^https?:$/.test(location.protocol) && window.fetch) {
    fetch(cvLinks[0].getAttribute('href'), { method: 'HEAD' })
      .then(function (r) { if (!r.ok) throw 0; })
      .catch(function () { cvLinks.forEach(function (el) { el.remove(); }); });
  }

  /* ─────────── Copiar el email ─────────── */

  var copyBtn = $('#copyMail');
  var copyLabel = $('#copyMailLabel');

  function copyEmail() {
    function done() {
      copyBtn.classList.add('copied');
      copyLabel.textContent = lang() === 'en' ? 'Copied!' : '¡Copiado!';
      setTimeout(function () {
        copyBtn.classList.remove('copied');
        copyLabel.textContent = EMAIL;
      }, 1800);
    }
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(EMAIL).then(done, function () { location.href = 'mailto:' + EMAIL; });
    } else {
      location.href = 'mailto:' + EMAIL;
    }
  }
  copyBtn.addEventListener('click', copyEmail);

  /* ─────────── Nav, progreso y sección activa ─────────── */

  var nav = $('#nav');
  var burger = $('#burger');
  var navLinks = $('#navLinks');
  var progress = $('#progress');

  var linkFor = {};
  $$('#navLinks a').forEach(function (a) { linkFor[a.getAttribute('href').slice(1)] = a; });
  function clearActive() {
    Object.keys(linkFor).forEach(function (k) { linkFor[k].classList.remove('active'); });
  }

  var ticking = false;
  function onScroll() {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(function () {
      var y = window.scrollY;
      nav.classList.toggle('scrolled', y > 8);
      var max = html.scrollHeight - window.innerHeight;
      progress.style.transform = 'scaleX(' + (max > 0 ? Math.min(y / max, 1) : 0) + ')';
      if (y < 180) clearActive();
      ticking = false;
    });
  }
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll, { passive: true });

  function closeMenu() {
    navLinks.classList.remove('open');
    burger.setAttribute('aria-expanded', 'false');
  }
  burger.addEventListener('click', function () {
    var open = navLinks.classList.toggle('open');
    burger.setAttribute('aria-expanded', String(open));
    burger.setAttribute('aria-label', open ? 'Cerrar menú' : 'Abrir menú');
  });
  navLinks.addEventListener('click', function (e) { if (e.target.closest('a')) closeMenu(); });

  if ('IntersectionObserver' in window) {
    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        var link = linkFor[en.target.id];
        if (link && en.isIntersecting) { clearActive(); link.classList.add('active'); }
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    $$('section[id]').forEach(function (s) { spy.observe(s); });
  }

  /* ─────────── Marquesina: duplicamos la lista para que el bucle no salte ─────────── */

  var track = $('#marqueeTrack');
  if (track) {
    var set = track.firstElementChild;
    var items = Array.prototype.slice.call(set.children);
    var target = Math.max(window.innerWidth, 1440) + 120;

    // Un solo juego tiene que ser más ancho que la pantalla; si no, al saltar
    // el bucle (translateX -50%) se vería un hueco.
    var guard = 0;
    while (set.scrollWidth < target && guard++ < 12) {
      items.forEach(function (li) { set.appendChild(li.cloneNode(true)); });
    }

    var clone = set.cloneNode(true);
    clone.setAttribute('aria-hidden', 'true');
    track.appendChild(clone);
  }

  /* ─────────── Foco que sigue al cursor ─────────── */

  if (finePointer && !reduceMotion) {
    $$('.spotlight').forEach(function (el) {
      el.addEventListener('pointermove', function (e) {
        var r = el.getBoundingClientRect();
        el.style.setProperty('--mx', (e.clientX - r.left) + 'px');
        el.style.setProperty('--my', (e.clientY - r.top) + 'px');
      });
    });
  }

  /* ─────────── Botones magnéticos ─────────── */

  if (finePointer && !reduceMotion) {
    $$('.magnetic').forEach(function (el) {
      var raf = null;
      el.addEventListener('pointermove', function (e) {
        if (raf) return;
        raf = requestAnimationFrame(function () {
          var r = el.getBoundingClientRect();
          var dx = (e.clientX - (r.left + r.width / 2)) * 0.22;
          var dy = (e.clientY - (r.top + r.height / 2)) * 0.32;
          el.style.transform = 'translate(' + dx + 'px,' + dy + 'px)';
          raf = null;
        });
      });
      el.addEventListener('pointerleave', function () { el.style.transform = ''; });
    });
  }

  /* ─────────── Cursor personalizado ─────────── */

  if (finePointer && !reduceMotion) {
    html.classList.add('custom-cursor');
    var dot = $('#cursorDot');
    var ring = $('#cursorRing');
    var mx = window.innerWidth / 2, my = window.innerHeight / 2;
    var rx = mx, ry = my;

    document.addEventListener('pointermove', function (e) {
      mx = e.clientX; my = e.clientY;
      dot.style.transform = 'translate(' + mx + 'px,' + my + 'px)';
    }, { passive: true });

    (function loop() {
      rx += (mx - rx) * 0.16;
      ry += (my - ry) * 0.16;
      ring.style.transform = 'translate(' + rx + 'px,' + ry + 'px)';
      requestAnimationFrame(loop);
    })();

    document.addEventListener('pointerover', function (e) {
      var hot = e.target.closest('a, button, input, .card, .stat, .skill-card, .tags li, .marquee-set li');
      ring.classList.toggle('hot', !!hot);
    });
    document.addEventListener('pointerleave', function () { ring.classList.remove('hot'); });
  }

  /* ─────────── Campo de puntos del hero ─────────── */

  var canvas = $('#field');
  if (canvas && !reduceMotion && canvas.getContext) {
    var ctx = canvas.getContext('2d');
    var dots = [];
    var dpr = Math.min(window.devicePixelRatio || 1, 1.6);
    var pointer = { x: -9999, y: -9999 };
    var visible = true;
    var GAP = 34, REACH = 150;

    function rgb() {
      return getComputedStyle(html).getPropertyValue('--dot').trim() || '10, 13, 22';
    }
    var color = rgb();

    function build() {
      var r = canvas.getBoundingClientRect();
      canvas.width = Math.round(r.width * dpr);
      canvas.height = Math.round(r.height * dpr);
      dots = [];
      for (var y = GAP / 2; y < r.height; y += GAP) {
        for (var x = GAP / 2; x < r.width; x += GAP) {
          dots.push({ x: x, y: y, p: (x + y) * 0.012 });
        }
      }
    }

    function draw(t) {
      requestAnimationFrame(draw);
      if (!visible) return;
      var r = canvas.getBoundingClientRect();
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, r.width, r.height);

      for (var i = 0; i < dots.length; i++) {
        var d = dots[i];
        var wob = Math.sin(t * 0.0007 + d.p) * 1.6;
        var px = d.x + wob, py = d.y + Math.cos(t * 0.0006 + d.p) * 1.6;

        var dx = px - pointer.x, dy = py - pointer.y;
        var dist = Math.sqrt(dx * dx + dy * dy);
        var near = dist < REACH ? 1 - dist / REACH : 0;
        var push = near * near * 12;

        if (near > 0 && dist > 0) { px += (dx / dist) * push; py += (dy / dist) * push; }

        var alpha = 0.13 + near * 0.62;
        var size = 0.9 + near * 1.5;

        ctx.fillStyle = 'rgba(' + color + ',' + alpha.toFixed(3) + ')';
        ctx.beginPath();
        ctx.arc(px, py, size, 0, 6.2832);
        ctx.fill();
      }
    }

    build();
    requestAnimationFrame(draw);

    window.addEventListener('resize', build, { passive: true });
    window.addEventListener('pointermove', function (e) {
      var r = canvas.getBoundingClientRect();
      pointer.x = e.clientX - r.left;
      pointer.y = e.clientY - r.top;
    }, { passive: true });
    window.addEventListener('pointerleave', function () { pointer.x = pointer.y = -9999; });

    // El tema cambia el color de los puntos
    new MutationObserver(function () { color = rgb(); })
      .observe(html, { attributes: true, attributeFilter: ['data-theme'] });

    // No dibujar cuando el hero no se ve
    if ('IntersectionObserver' in window) {
      new IntersectionObserver(function (e) { visible = e[0].isIntersecting; })
        .observe(canvas.parentNode);
    }
  }

  /* ─────────── Aparición al hacer scroll ─────────── */

  var revealables = $$(
    '.section-head, .about-text, .stat, .tl-item, .case, .card, .skill-card, .certs, .contact-actions'
  );

  if ('IntersectionObserver' in window && !reduceMotion) {
    revealables.forEach(function (el, i) {
      el.classList.add('reveal');
      el.style.transitionDelay = Math.min(i % 5, 4) * 65 + 'ms';
    });
    var reveal = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add('in'); reveal.unobserve(en.target); }
      });
    }, { threshold: 0.08, rootMargin: '0px 0px -60px 0px' });
    revealables.forEach(function (el) { reveal.observe(el); });
  }

  /* ─────────── Contadores ─────────── */

  function countUp(el) {
    var target = parseInt(el.getAttribute('data-count'), 10);
    var suffix = el.getAttribute('data-suffix') || '';
    if (reduceMotion) { el.textContent = target + suffix; return; }
    var start = performance.now(), dur = 1100;
    (function frame(now) {
      var p = Math.min((now - start) / dur, 1);
      el.textContent = Math.round(target * (1 - Math.pow(1 - p, 3))) + (p === 1 ? suffix : '');
      if (p < 1) requestAnimationFrame(frame);
    })(start);
  }

  if ('IntersectionObserver' in window) {
    var counters = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { countUp(en.target); counters.unobserve(en.target); }
      });
    }, { threshold: 0.6 });
    $$('[data-count]').forEach(function (el) { counters.observe(el); });
  }

  /* ─────────── Número real de repos, en vivo desde GitHub ───────────
     Si la API falla o hay límite de peticiones, se queda el valor escrito. */

  var repoEl = $('#repoCount');
  if (repoEl && window.fetch && /^https?:$/.test(location.protocol)) {
    fetch('https://api.github.com/users/Alexi45')
      .then(function (r) { return r.ok ? r.json() : Promise.reject(); })
      .then(function (d) {
        if (typeof d.public_repos === 'number' && d.public_repos > 0) {
          repoEl.setAttribute('data-count', d.public_repos);
          repoEl.setAttribute('data-suffix', '');
          repoEl.textContent = d.public_repos;
        }
      })
      .catch(function () { /* nos quedamos con el número estático */ });
  }

  /* ─────────── Paleta de comandos (⌘K) ─────────── */

  var palette = $('#palette');
  var pInput = $('#paletteInput');
  var pList = $('#paletteList');
  var lastFocus = null;
  var filtered = [];
  var cursorIndex = 0;

  function go(hash) {
    return function () {
      var el = $(hash);
      if (el) el.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' });
    };
  }
  function open(url) { return function () { window.open(url, '_blank', 'noopener'); }; }

  var COMMANDS = [
    { es: 'Sobre mí', en: 'About', ico: '01', hint: 'sobre-mi', run: go('#sobre-mi') },
    { es: 'Experiencia', en: 'Experience', ico: '02', hint: 'experiencia', run: go('#experiencia') },
    { es: 'Proyectos', en: 'Work', ico: '03', hint: 'proyectos', run: go('#proyectos') },
    { es: 'Stack', en: 'Stack', ico: '04', hint: 'skills', run: go('#skills') },
    { es: 'Formación', en: 'Education', ico: '05', hint: 'formacion', run: go('#formacion') },
    { es: 'Contacto', en: 'Contact', ico: '06', hint: 'contacto', run: go('#contacto') },
    { es: 'Copiar mi email', en: 'Copy my email', ico: '@', hint: EMAIL, run: copyEmail },
    { es: 'Escribirme un correo', en: 'Send me an email', ico: '✉', hint: 'mailto', run: function () { location.href = 'mailto:' + EMAIL; } },
    { es: 'Abrir GitHub', en: 'Open GitHub', ico: '↗', hint: 'Alexi45', run: open('https://github.com/Alexi45') },
    { es: 'Abrir LinkedIn', en: 'Open LinkedIn', ico: '↗', hint: 'in/…', run: open('https://www.linkedin.com/in/alejandro-riscart-rosado-53802123b/') },
    { es: 'Cambiar el tema', en: 'Toggle theme', ico: '◐', hint: 'claro / oscuro', run: toggleTheme },
    { es: 'Cambiar el idioma', en: 'Toggle language', ico: '文', hint: 'ES / EN', run: toggleLang },
    { es: 'Guardar esta página como PDF', en: 'Save this page as PDF', ico: '⎙', hint: 'imprimir', run: function () { window.print(); } }
  ];

  var COMBINING = /[\u0300-\u036f]/g;

  function normalize(s) {
    return s.toLowerCase().normalize('NFD').replace(COMBINING, '');
  }

  function render() {
    var q = normalize(pInput.value.trim());
    var l = lang();
    filtered = COMMANDS.filter(function (c) {
      return !q || normalize(c[l] + ' ' + c.hint).indexOf(q) !== -1;
    });
    cursorIndex = 0;
    pList.innerHTML = '';

    if (!filtered.length) {
      var empty = document.createElement('li');
      empty.className = 'palette-empty';
      empty.textContent = l === 'en' ? 'Nothing found' : 'No hay resultados';
      pList.appendChild(empty);
      return;
    }

    filtered.forEach(function (c, i) {
      var li = document.createElement('li');
      li.setAttribute('role', 'option');
      li.setAttribute('aria-selected', String(i === 0));
      li.innerHTML = '<span class="p-ico"></span><span class="p-name"></span><span class="p-hint"></span>';
      li.querySelector('.p-ico').textContent = c.ico;
      li.querySelector('.p-name').textContent = c[l];
      li.querySelector('.p-hint').textContent = c.hint;
      li.addEventListener('click', function () { runAt(i); });
      li.addEventListener('pointermove', function () { move(i); });
      pList.appendChild(li);
    });
  }

  function move(i) {
    if (!filtered.length) return;
    var items = pList.children;
    if (items[cursorIndex]) items[cursorIndex].setAttribute('aria-selected', 'false');
    cursorIndex = (i + filtered.length) % filtered.length;
    var el = items[cursorIndex];
    if (el) {
      el.setAttribute('aria-selected', 'true');
      if (el.scrollIntoView) el.scrollIntoView({ block: 'nearest' });
    }
  }

  function runAt(i) {
    var cmd = filtered[i];
    closePalette();
    if (cmd) setTimeout(cmd.run, 90);
  }

  function openPalette() {
    lastFocus = document.activeElement;
    palette.hidden = false;
    pInput.value = '';
    render();
    pInput.focus();
  }

  function closePalette() {
    palette.hidden = true;
    if (lastFocus && lastFocus.focus) lastFocus.focus();
  }

  $('#paletteBtn').addEventListener('click', openPalette);
  palette.addEventListener('click', function (e) { if (e.target.hasAttribute('data-close')) closePalette(); });
  pInput.addEventListener('input', render);

  pInput.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowDown') { e.preventDefault(); move(cursorIndex + 1); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); move(cursorIndex - 1); }
    else if (e.key === 'Enter') { e.preventDefault(); runAt(cursorIndex); }
  });

  document.addEventListener('keydown', function (e) {
    var k = (e.key || '').toLowerCase();
    if (k === 'k' && (e.metaKey || e.ctrlKey)) {
      e.preventDefault();
      palette.hidden ? openPalette() : closePalette();
      return;
    }
    if (e.key !== 'Escape') return;
    if (!palette.hidden) closePalette();
    else if (navLinks.classList.contains('open')) { closeMenu(); burger.focus(); }
  });

  /* ─────────── Arranque ─────────── */

  document.getElementById('year').textContent = new Date().getFullYear();
  html.classList.add('ready');
})();
