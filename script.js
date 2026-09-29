document.addEventListener('DOMContentLoaded', () => {
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];    // Configuració global de Chart.js   if (window.Chart) {     Chart.defaults.font.family = "'JetBrains Mono', monospace";     Chart.defaults.font.size = 11;     Chart.defaults.color = '#5d5a50';     Chart.defaults.borderColor = '#e1ded6';   }    /* Imatges que falten: marca d'error integrada */   $$('img').forEach(i => {
    const mark = () => i.setAttribute('data-missing', 'Imatge no disponible');
    i.addEventListener('error', mark);
    if (i.complete && !i.naturalWidth && i.getAttribute('src')) mark();
  });

  /* Barra de progrés de lectura superior */
  const bar = $('#progress');
  if (bar) {
    const onScroll = () => {
      const h = document.documentElement.scrollHeight - innerHeight;
      bar.style.width = (h > 0 ? (scrollY / h) * 100 : 0) + '%';
    };
    addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* Índex lateral actiu segons secció visible */
  const links = $$('.side-in a');   if (links.length) {     const io = new IntersectionObserver(es => es.forEach(e => {       if (e.isIntersecting) {         document.dispatchEvent(new CustomEvent('sec', { detail: e.target.id }));         links.forEach(l => l.classList.toggle('active', l.getAttribute('href') === '#' + e.target.id));       }     }), { rootMargin: '-30\% 0px -60\% 0px' });     $$('section[id]').forEach(s => io.observe(s));
  }

  /* Pestañes de disseny CAD del braç robòtic */
  const cad = [
    { img: 'img/inmoov.jpg', t: 'Antebraç InMoov', d: "Base escollida per la seva estructura sòlida: allotjaments per als servos, passos interns per als fils i una articulació que permet girar el canell. La mà original és complexa de muntar i es desajusta amb l'ús." },
    { img: 'img/brainyhand.jpg', t: 'Mà BrainyHand', d: "Alternativa més simple, amb menys peces i frontisses flexibles. No té rotació de canell i no encaixa directament amb l'antebraç d'InMoov." },
    { img: 'img/fusion.jpg', t: 'Redisseny a Fusion 360', d: "Vaig modelar una peça base nova per a la mà, amb les distàncies i els forats del canell d'InMoov. A l'esquerra, el disseny original; a la dreta, el modificat amb l'ancoratge." },
    { img: 'img/brazo.jpg', t: 'Braç ensamblat', d: "Resultat final: mà i antebraç units, amb els sis servos a la part posterior de l'antebraç i els dits accionats amb fil de niló." }
  ];
  const panel = $('#cad-panel'), tabs = $$('.tab');
  if (panel && tabs.length) {
    function showCad(i, anim = true) {
      tabs.forEach((b, k) => {
        b.classList.toggle('active', k === i);
        b.setAttribute('aria-selected', k === i);
      });
      const apply = () => {
        const cadImg = $('#cad-img');
        const cadTitle = $('#cad-title');
        const cadDesc = $('#cad-desc');
        if (cadImg) { cadImg.src = cad[i].img; cadImg.alt = cad[i].t; }
        if (cadTitle) cadTitle.textContent = cad[i].t;
        if (cadDesc) cadDesc.textContent = cad[i].d;
        panel.classList.remove('fade');
      };
      if (!anim) return apply();
      panel.classList.add('fade');
      setTimeout(apply, 250);
    }
    tabs.forEach((b, i) => b.addEventListener('click', () => showCad(i)));
    showCad(0, false);
  }

  /* Etiquetes i fletxes sobre la imatge del guant */
  const g = $('#glove');
  if (g) {
    const marks = [
      { txt: 'Sensors de flexió', lx: 80, ly: 5, tx: 86, ty: 38, side: 't' },
      { txt: 'IMU MPU6050', lx: 62, ly: 86, tx: 62, ty: 50, side: 'b' },
      { txt: "Caixa d'electrònica", lx: 20, ly: 86, tx: 20, ty: 70, side: 'b' }
    ];
    const W = 923, H = 501;
    let svg = `<svg viewBox="0 0 ${W} ${H}" aria-hidden="true"><defs><marker id="ah" markerWidth="10" markerHeight="10" refX="8" refY="5" orient="auto" markerUnits="userSpaceOnUse"><path d="M0,0 L10,5 L0,10 z" fill="#22252a"/></marker></defs>`;
    marks.forEach(m => {
      const y1 = m.side === 't' ? m.ly + 9 : m.ly;
      svg += `<line x1="${(m.lx * W) / 100}" y1="${(y1 * H) / 100}" x2="${(m.tx * W) / 100}" y2="${(m.ty * H) / 100}" stroke="#22252a" stroke-width="2" marker-end="url(#ah)"/>`;
      g.insertAdjacentHTML('beforeend', `<span class="tag" style="left:${m.lx}%;top:${m.ly}%">${m.txt}</span>`);
    });
    g.insertAdjacentHTML('beforeend', svg + '</svg>');
  }

  /* Gràfica d'estudi ADC vs angle del dit */
  const chartEl = $('#chart');
  if (window.Chart && chartEl) {
    new Chart(chartEl, {
      type: 'scatter',
      data: {
        datasets: [{
          data: [[0, 2317], [45, 2143], [90, 1993], [135, 1824], [180, 1633]].map(([x, y]) => ({ x, y })),
          showLine: true,
          borderColor: '#22252a',
          backgroundColor: '#22252a',
          pointRadius: 4
        }]
      },
      options: {
        plugins: { legend: { display: false } },
        scales: {
          x: { title: { display: true, text: 'Angle del dit (°)' } },
          y: { title: { display: true, text: 'Lectura ADC' } }
        }
      }
    });
  }

  /* Calculadora interactiva map() */
  const adc = $('#adc');
  if (adc) {
    const calc = () => {
      const x = +adc.value;
      const valEl = $('#adc-v');
      const angEl = $('#adc-a');       if (valEl) valEl.textContent = x;       if (angEl) angEl.textContent = Math.trunc(((x - 1530) * (0 - 180)) / (2100 - 1530)) + 180;     };     adc.addEventListener('input', calc);     calc();   }    /* Aparició gradual dels elements al fer scroll */   const rv = new IntersectionObserver(es => es.forEach(e => {     if (e.isIntersecting) {       e.target.classList.add('in');       rv.unobserve(e.target);     }   }), { threshold: 0.06 });   $$('section > *').forEach(el => { el.classList.add('rv'); rv.observe(el); });

  /* Gràfic de calibratge dels 5 sensors */
  const cCal = $('#c-cal');
  if (window.Chart && cCal) {
    new Chart(cCal, {
      type: 'bar',
      data: {
        labels: ['Polze', 'Índex', 'Cor', 'Anular', 'Menyic'],
        datasets: [{
          data: [[1530, 2100], [1530, 2100], [1700, 2300], [1650, 2100], [1730, 2000]],
          backgroundColor: '#22252a',
          borderSkipped: false
        }]
      },
      options: {
        indexAxis: 'y',
        plugins: { legend: { display: false } },
        scales: {
          x: { min: 1400, max: 2400, title: { display: true, text: 'Lectura ADC' } }
        }
      }
    });
  }

  /* Llista de materials, cerca i càlcul de pressupost */
  const parts = [
    ['Wemos D1 R32 (ESP32)', 'Electrònica', 2, 10.5],
    ['MPU6050 (GY-521)', 'Electrònica', 1, 3.5],
    ['Flex sensor FS-L-0055-253-ST', 'Electrònica', 5, 14],
    ['Resistència 47 kΩ', 'Electrònica', 5, 0.05],
    ['Condensador de desacoblament', 'Electrònica', 1, 0.3],
    ['Placa de coure per a PCB', 'Electrònica', 2, 3],
    ['Servo digital DM996 15 kg·cm', 'Actuació', 6, 9],
    ['Fil de niló per als tendons', 'Actuació', 1, 4],
    ['Bateria Li-ion 18650', 'Alimentació', 2, 5],
    ['Portabateries 2 × 18650', 'Alimentació', 1, 1.5],
    ['Bateria Li-ion 5500 mAh (guant)', 'Alimentació', 1, 15],
    ['Font de laboratori Promax FAC-363B', 'Alimentació', 1, 0],
    ['Filament PLA (1 kg)', 'Fabricació', 1, 20],
    ['Filament TPU (1 kg)', 'Fabricació', 1, 25],
    ['Guant', 'Fabricació', 1, 5]
  ];

  let prices = null;
  try { prices = JSON.parse(localStorage.getItem('prices')); } catch {}
  if (!Array.isArray(prices) || prices.length !== parts.length) prices = parts.map(p => p[3]);

  const norm = s => s.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
  const eur = v => v.toLocaleString('ca-ES', { style: 'currency', currency: 'EUR' });

  const chipsContainer = $('#chips');
  const tb = $('#mt tbody');

  if (chipsContainer && tb) {
    let cat = 'Totes';
    chipsContainer.innerHTML = ['Totes', ...new Set(parts.map(p => p[1]))].map(c => `<button class="chip${c === cat ? ' on' : ''}">${c}</button>`).join('');

    tb.innerHTML = parts.map((p, i) => `<tr data-i="${i}"><td>${p[0]}</td><td><span class="pill">${p[1]}</span></td><td>${p[2]}</td><td><input type="number" min="0" step="0.01" value="${prices[i]}" aria-label="Preu de ${p[0]}"></td><td class="sub"></td></tr>`).join('') + '<tr id="none" hidden><td colspan="5">Cap component coincideix amb la cerca.</td></tr>';

    const rows = $$('tr[data-i]', tb);

    function upd() {
      const searchInput = $('#q');
      const q = searchInput ? norm(searchInput.value) : '';
      let tot = 0, n = 0, all = 0;

      rows.forEach(r => {
        const i = +r.dataset.i, p = parts[i], sub = p[2] * (+prices[i] || 0);
        all += sub;
        const subEl = $('.sub', r);
        if (subEl) subEl.textContent = eur(sub);

        const show = (cat === 'Totes' || p[1] === cat) && norm(p[0] + ' ' + p[1]).includes(q);
        r.hidden = !show;
        if (show) { tot += sub; n++; }
      });

      const noneEl = $('#none');
      const totEl = $('#tot');
      const grandEl = $('#grand');

      if (noneEl) noneEl.hidden = n > 0;
      if (totEl) totEl.textContent = eur(tot);
      if (grandEl) grandEl.textContent = eur(all);
    }

    const qInput = $('#q');     if (qInput) qInput.addEventListener('input', upd);      chipsContainer.addEventListener('click', e => {       if (!e.target.matches('.chip')) return;       cat = e.target.textContent;       $$('.chip').forEach(c => c.classList.toggle('on', c === e.target));
      upd();
    });

    tb.addEventListener('input', e => {
      const r = e.target.closest('tr[data-i]');
      if (!r) return;
      prices[+r.dataset.i] = e.target.value;
      try { localStorage.setItem('prices', JSON.stringify(prices)); } catch {}
      upd();
    });

    addEventListener('keydown', e => {
      if (e.key === '/' && !['INPUT', 'TEXTAREA'].includes(document.activeElement.tagName)) {
        e.preventDefault();
        if (qInput) qInput.focus();
      }
    });

    upd();
  }

  /* Visor d'imatges Lightbox amb zoom i arrossegament */
  const lb = $('#lb'), li = $('#lb-img'), xBtn = $('#lb-x');
  if (lb && li) {
    let s = 1, x = 0, y = 0, drag = false, sx = 0, sy = 0;
    const draw = () => li.style.transform = `translate(${x}px,${y}px) scale(${s})`;
    const close = () => lb.hidden = true;

    $$('img.zoom').forEach(i => i.addEventListener('click', () => {
      li.src = i.src;
      li.alt = i.alt;
      s = 1; x = y = 0;
      draw();
      lb.hidden = false;
    }));

    if (xBtn) xBtn.addEventListener('click', close);
    lb.addEventListener('click', e => { if (e.target === lb) close(); });
    addEventListener('keydown', e => { if (e.key === 'Escape') close(); });

    lb.addEventListener('wheel', e => {
      e.preventDefault();
      s = Math.min(4, Math.max(1, s + (e.deltaY < 0 ? 0.2 : -0.2)));
      if (s === 1) x = y = 0;
      draw();
    }, { passive: false });

    li.addEventListener('pointerdown', e => {
      drag = true;
      sx = e.clientX - x;
      sy = e.clientY - y;
      li.setPointerCapture(e.pointerId);
    });

    li.addEventListener('pointermove', e => {
      if (drag) {
        x = e.clientX - sx;
        y = e.clientY - sy;
        draw();
      }
    });

    li.addEventListener('pointerup', () => drag = false);
  }
});
