/* ==========================================================================
   ARNT Academy — приложение (роутер + шаблоны страниц + личный кабинет)
   Контент берётся из js/data.js. Новые страницы добавляются в объект routes.
   ========================================================================== */
(function () {
  const D = window.ARNT;
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const img = (key) => D.images[key] || key;
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const ARR = '<span class="arr">→</span>';

  /* ---------- Хранилище (демо: localStorage; заменяется на API) ---------- */
  const store = {
    get: (k, d) => { try { return JSON.parse(localStorage.getItem('arnt_' + k)) ?? d; } catch { return d; } },
    set: (k, v) => localStorage.setItem('arnt_' + k, JSON.stringify(v))
  };
  const user = () => store.get('user', null);
  const done = () => store.get('done', []);
  const dict = () => store.get('dict', []);

  function toast(msg) {
    const t = $('#toast'); t.textContent = msg; t.classList.add('show');
    clearTimeout(t._t); t._t = setTimeout(() => t.classList.remove('show'), 2200);
  }

  /* ---------- Иконки ---------- */
  const ICON = {
    user: '<svg viewBox="0 0 24 24"><circle cx="12" cy="8" r="4"/><path d="M4 21c0-4.4 3.6-7 8-7s8 2.6 8 7"/></svg>',
    book: '<svg viewBox="0 0 24 24"><path d="M5 4h11a3 3 0 0 1 3 3v13H8a3 3 0 0 1-3-3z"/><path d="M5 17a3 3 0 0 1 3-3h11"/></svg>',
    video: '<svg viewBox="0 0 24 24"><path d="M8 6l10 6-10 6z"/></svg>',
    text: '<svg viewBox="0 0 24 24"><path d="M5 6h14M5 11h14M5 16h9"/></svg>',
    audio: '<svg viewBox="0 0 24 24"><path d="M4 10v4M8 7v10M12 4v16M16 8v8M20 11v2"/></svg>',
    interactive: '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="8"/><path d="M9 12l2 2 4-4"/></svg>',
    play: '<svg viewBox="0 0 24 24"><path d="M6 4l14 8-14 8z"/></svg>',
    pause: '<svg viewBox="0 0 24 24"><path d="M6 4h4v16H6zM14 4h4v16h-4z"/></svg>'
  };
  const TYPE_RU = { video: 'Видеоурок', text: 'Текст', audio: 'Аудио', interactive: 'Интерактив' };

  /* ---------- Общие данные ---------- */
  const programme = () => D.programmes.find((p) => p.current) || D.programmes[0];
  const lessonsOf = (slug, week) => D.lessons.filter((l) => l.programme === slug && (week == null || l.week === week));

  /* ---------- Навигация ---------- */
  const NAV = [
    ['programme', 'Программа'], ['trial', 'Пробный урок'], ['format', 'Обучение'],
    ['founder', 'Основательница'], ['membership', 'Форматы']
  ];
  function renderNav(route) {
    const u = user();
    const top = route.split('/')[0];
    const navHref = (h) => h === 'trial' ? `href="${D.trialUrl}" target="_blank" rel="noopener" data-needs-consent` : `href="#/${h}"`;
    $('#navLinks').innerHTML = NAV.map(([h, t]) => `<a ${navHref(h)} class="${top === h ? 'active' : ''}">${t}</a>`).join('') +
''; 
    $('#mobileMenu').innerHTML = NAV.map(([h, t]) => `<a ${navHref(h)}>${t}</a>`).join('');
  }
  $('#burger').addEventListener('click', () => document.body.classList.toggle('menu-open'));

  function renderFooter() {
    $('#footer').innerHTML = `
      <div class="wrap">
        <div class="footer__grid">
          <div>
            <img class="footer__crest" src="assets/img/logo-cream.png" alt="ARNT Academy">
            <p class="muted small" style="max-width:280px">Академия английского языка через идеи: психологию, нейробиологию, wellness, искусство и культуру.</p>
          </div>
          <div><h4>Академия</h4>
            <a href="#/philosophy">Философия</a><a href="#/programme">Программа месяца</a><a href="#/format">Как проходит обучение</a><a href="#/faculties">Факультеты</a><a href="#/founder">Основательница</a></div>
          <div><h4>Материалы</h4>
            <a href="${D.trialUrl}" target="_blank" rel="noopener" data-needs-consent>Бесплатный урок</a><a href="#/membership">Форматы обучения</a></div>
        </div>
        <div class="footer__bottom">
          <span>© ${new Date().getFullYear()} ARNT Academy · ${esc(D.legal.operator || 'Академия английского Арины Ткачевой')}${D.legal.inn ? ' · ИНН ' + esc(D.legal.inn) : ''}${D.legal.ogrn ? ' · ОГРНИП ' + esc(D.legal.ogrn) : ''}</span>
          <span class="footer__legal"><a href="#/privacy">Политика обработки персональных данных</a><a href="#/consent">Согласие на обработку данных</a><a href="#/cookies">Использование cookie</a><a href="#" data-cookie-settings>Настройки cookie</a><a href="#/legal">Сведения о продавце</a></span>
        </div>
      </div>`;
  }

  /* ---------- Повторяющиеся блоки ---------- */
  const marquee = (words) => {
    const row = words.map((w) => `<span>${w}</span>`).join('');
    return `<div class="marquee"><div class="marquee__track">${row}${row}${row}${row}</div></div>`;
  };
  const weekCard = (p, w) => `
    <a class="card reveal" href="#/programme/${w.slug}">
      <div class="card__img"><div class="ph" style="background-image:url(${img(w.img)});background-position:${w.pos}"></div>
        <div class="card__tag"><span>Неделя 0${w.n} · ${w.field}</span><span>→</span></div></div>
      <div class="card__title">${w.title}</div><div class="card__sub">${w.sub}</div>
      ${w.grammar ? `<div class="card__gram"><span>Грамматика</span>${w.grammarEn}<small>${w.grammar}</small></div>` : ''}
    </a>`;
  const bookCard = (b) => `
    <a class="book reveal" href="#/editions/${b.slug}">
      <div class="book__cover"><div class="ph" style="background-image:url(${img(b.img)});background-position:${b.pos}"></div>
        <div class="book__label"><span>ARNT Editions</span><div class="h3">${b.title}</div><span>${b.sub}</span></div></div>
      <div class="book__meta"><span>${b.year} · ${b.pages} pp.</span><span>${b.price}</span></div>
    </a>`;
  const articleRow = (a) => `
    <a class="article-row reveal" href="#/journal/${a.slug}">
      <div class="meta">${a.category}<br>${a.date}</div>
      <div><div class="h3">${a.title}</div><p>${a.lead}</p></div>
      <div class="thumb" style="background-image:url(${img(a.img)});background-position:${a.pos}"></div>
    </a>`;
  const pageHero = (eyebrow, title, lead, image, pos) => `
    <section class="page-hero ${image ? 'page-hero--img' : ''}">
      ${image ? `<div class="bg" style="background-image:url(${img(image)});background-position:${pos || 'center'}"></div>` : ''}
      <div class="wrap"><p class="eyebrow line">${eyebrow}</p><h1 class="h-display">${title}</h1>${lead ? `<p class="lead">${lead}</p>` : ''}</div>
    </section>`;

  const vocabGrid = (list) => {
    const mine = dict().map((d) => d.w);
    return `<div class="vocab">${list.map(([w, t]) => `<div><div><b>${esc(w)}</b><small>${esc(t)}</small></div>
      <button class="add-word ${mine.includes(w) ? 'added' : ''}" data-word="${esc(w)}" data-tr="${esc(t)}" title="В мой словарь">${mine.includes(w) ? '✓' : '+'}</button></div>`).join('')}</div>`;
  };
  const quizBlock = (quiz, id) => `<div class="quiz" data-quiz="${id}">${quiz.map((q, i) => `
      <div class="q" data-a="${q.a}"><div class="q__text">${i + 1}. ${esc(q.q)}</div>
        <div class="q__opts">${q.options.map((o, j) => `<button class="opt" data-i="${j}">${esc(o)}</button>`).join('')}</div></div>`).join('')}
      <p class="form-msg" data-quiz-result></p></div>`;
  const readingText = (t) => `<p class="reading">${t.split(/(\s+)/).map((w) => /\S/.test(w) ? `<span class="w">${esc(w)}</span>` : w).join('')}</p>`;
  const audioPlayer = (text) => `<div class="audio" data-audio="${esc(text)}"><button aria-label="Слушать">${ICON.play}</button><div class="track"><i></i></div><span class="type">English · UK</span></div>`;

  /* ---------- Cookie и Яндекс Метрика (только после согласия) ---------- */
  const cookieChoice = () => { try { return localStorage.getItem('arnt_cookie'); } catch { return null; } };
  let metrikaLoaded = false;
  function loadMetrika() {
    const id = D.analytics && D.analytics.yandexMetrikaId;
    if (!id || metrikaLoaded) return;
    metrikaLoaded = true;
    window.ym = window.ym || function () { (window.ym.a = window.ym.a || []).push(arguments); };
    window.ym.l = Date.now();
    const s = document.createElement('script');
    s.async = true; s.src = 'https://mc.yandex.ru/metrika/tag.js';
    document.head.appendChild(s);
    window.ym(Number(id), 'init', { clickmap: true, trackLinks: true, accurateTrackBounce: true, webvisor: !!D.analytics.webvisor, defer: true });
    window.ym(Number(id), 'hit', location.href);
  }
  function trackHit() {
    if (metrikaLoaded && window.ym) window.ym(Number(D.analytics.yandexMetrikaId), 'hit', location.href);
  }
  function setCookieChoice(v) {
    const prev = cookieChoice();
    try { localStorage.setItem('arnt_cookie', v); } catch {}
    $('#cookieBar').hidden = true;
    if (v === 'all') { loadMetrika(); toast('Настройки cookie сохранены'); return; }
    if (prev === 'all' && metrikaLoaded) {
      // отзыв согласия: удаляем cookie Метрики и перезагружаем страницу без счётчика
      document.cookie.split(';').map((c) => c.split('=')[0].trim()).filter((n) => n.startsWith('_ym')).forEach((n) => {
        document.cookie = n + '=; Max-Age=0; path=/';
        document.cookie = n + '=; Max-Age=0; path=/; domain=.' + location.hostname.replace(/^www\./, '');
      });
      location.reload(); return;
    }
    toast('Сохранено: только необходимые');
  }

  /* ---------- Согласие на обработку данных (галочка) ---------- */
  let consentGiven = false;
  try { consentGiven = sessionStorage.getItem('arnt_consent') === '1'; } catch {}
  const consentCheck = (lead = '') => `<label class="consent-check">
      <input type="checkbox" data-consent ${consentGiven ? 'checked' : ''}>
      <span>${lead ? lead + ' ' : ''}Я даю <a href="#/consent">согласие на обработку персональных данных</a> и принимаю <a href="#/privacy">Политику обработки персональных данных</a>.</span>
    </label>`;
  function setConsent(v) {
    consentGiven = v;
    try { sessionStorage.setItem('arnt_consent', v ? '1' : '0'); } catch {}
    document.body.classList.toggle('consent-ok', v);
    $$('[data-consent]').forEach((c) => { c.checked = v; });
    const go = $('#consentGo'); if (go) go.classList.toggle('is-disabled', !v);
  }
  function openConsentModal(href) {
    const m = $('#consentModal');
    $('#consentGo').href = href;
    m.hidden = false; setConsent(consentGiven);
  }

  /* ==========================================================================
     Страницы
     ========================================================================== */
  const P = {};

  /* --- Главная --- */
  P.home = () => {
    const p = programme();
    return `
    <section class="hero">
      <div class="hero__glass" style="background-image:url(${img('libraryGlass')})">
        <div class="hero__content">
          <p class="eyebrow">Академия английского Арины Ткачевой</p>
          <h1 class="h-display">ARNT Academy</h1>
          <p>Изучай английский через искусство, психологию, науку, культуру и идеи, которые расширяют мировоззрение.</p>
          <p class="hero__offer">Онлайн-курс английского языка · уровень от B1</p>
          <div class="hero__stats">
            <div><b>1</b><span>новая тема каждую неделю</span></div>
            <div><b>4</b><span>темы каждый месяц</span></div>
            <div><b>50</b><span>тем в год</span></div>
          </div>
          <a class="btn btn--solid" href="#/formats">Выбрать формат</a>
        </div>
      </div>
      <div class="hero__right" style="background-image:url(${img('library')})"></div>
    </section>

    <section class="section section--brown" id="program">
      <div class="wrap">
        <p class="eyebrow line">01 · Что вы получите</p>
        <h2 class="h2 reveal" style="max-width:760px">Английский язык и интеллектуальное развитие в одной образовательной программе.</h2>
        <div class="product">
          <p class="lead reveal">ARNT Academy — онлайн-программа английского языка для тех, кто уже говорит на уровне B1 и выше. Каждую неделю вы проходите одну новую тему — из психологии, нейробиологии, искусства, философии или культуры — и на ней прокачиваете английский.</p>
          <ul class="product__list reveal reveal-d1">
            <li><b>Каждую неделю</b>новая тема: видеоурок, тексты, аудио, лексика и интерактивные задания</li>
            <li><b>В личном кабинете</b>уроки, материалы и задания курса</li>
            <li><b>В формате Interactive</b>ещё и разговорные клубы (Speaking Clubs) — практика по теме недели</li>
          </ul>
        </div>
        <h3 class="h3" style="margin-top:80px">Что вы получите после месячного курса</h3>
        <div class="skills">${D.skills.map(([t, ru, d], i) => `<div class="reveal reveal-d${i % 3}"><span class="type">0${i + 1} · ${ru}</span><div class="h3">${t}</div><p>${d}</p></div>`).join('')}</div>
        <div class="skills-result reveal">
          <p class="quote">Каждый месяц — четыре освоенные темы, пополненный личный словарь и опыт рассуждать о них по-английски.</p>
          <p class="muted small">Программа доступна студентам с уровнем английского от B1. Результат зависит от исходного уровня и регулярности занятий.</p>
        </div>
      </div>
    </section>

    <section class="banner banner--concept">
      <div class="bg" data-parallax style="background-image:url(${img('bgConcept')});background-position:center 40%"></div>
      <div class="glass-card glass-card--wide reveal">
        <p class="eyebrow">Концепция обучения</p>
        <h2 class="h2">Представьте, сколько нового вы можете узнать за год, если каждую неделю будете посвящать время изучению одной интересной темы?</h2>
        <div class="concept-mini">
          ${[['01', 'Глобальная тема месяца'], ['04', 'Тематических модуля'], ['07', 'Дней на погружение в каждую тему'], ['50', 'Новых тем за год — наша цель']].map(([n, t]) =>
            `<div><b>${n}</b><span>${t}</span></div>`).join('')}
        </div>
        <p class="concept-text">Вы совершенствуете английский, расширяете кругозор и постепенно формируете собственную интеллектуальную базу.</p>
        <div class="chips" style="justify-content:center"><span>Уровень от B1</span><span>Новая тема каждую неделю</span><span>3 формата обучения</span></div>
      </div>
    </section>


    <section class="section photo-section photo-section--luxury">
      <div class="photo-section__bg" style="background-image:url(${img('bgLuxury')})"></div>
      <div class="wrap">
        <div class="luxury reveal">
          <p class="eyebrow line">Философия</p>
          <h2 class="h2">Образование —<br>новая роскошь</h2>
          <p class="quote">Я создала ARNT Academy для тех, кому недостаточно просто знать английский язык.</p>
          <p>Для тех, кто хочет понимать мир, открывать новые идеи, формировать собственное мнение и вести содержательные беседы.</p>
          <p>Каждую неделю мы исследуем новую тему через английский язык: от нейробиологии и психологии до искусства, философии и культуры.</p>
          <p class="sign">— Арина Ткачева, основательница ARNT Academy</p>
          <a class="btn" href="#/formats">Выбрать формат ${ARR}</a>
        </div>
      </div>
    </section>

    ${marquee(['ARNT Academy', 'Психология', 'Нейробиология', 'Благополучие', 'Искусство и культура', 'Философия', 'Общество'])}

    <section class="banner" style="min-height:620px">
      <div class="bg" data-parallax style="background-image:url(${img('bgTrial')});background-position:50% 30%"></div>
      <div class="glass-card reveal" style="max-width:580px">
        <p class="eyebrow">Начни бесплатно</p>
        <h2 class="h2">${D.trial.title}</h2>
        <p style="color:var(--white);opacity:.9;font-size:15px;margin:-10px 0 18px">${D.trial.question}</p>
        <p style="color:var(--white);opacity:.75;font-size:13px;margin:0 0 18px">${D.trial.includes.join(' · ')}</p>
        <p class="type" style="color:var(--white);opacity:.7;margin:0 0 28px">Уровень: ${D.trial.level} · ${D.trial.duration}</p>
        <a class="btn btn--solid" href="${D.trialUrl}" target="_blank" rel="noopener" data-needs-consent>Пройти урок ${ARR}</a>
        <div style="max-width:420px;margin:20px auto 0;text-align:left">${consentCheck('Урок проходит на платформе ProgressMe.')}</div>
      </div>
    </section>



    <section class="section">
      <div class="wrap">
        <p class="eyebrow line">03 · Что мы изучаем · ${p.month}</p>
        <h2 class="h2 reveal">${p.title}</h2>
        ${p.ru ? `<p class="quote" style="margin:10px 0 0">${p.ru}</p>` : ''}
        <p class="lead">${p.lead}</p>
        ${p.start ? `<div class="chips" style="justify-content:flex-start;margin-top:22px"><span>${p.start}</span><span>Набор открыт в декабре</span></div>` : ''}
        <div class="cards">${p.weeks.map((w) => weekCard(p, w)).join('')}</div>
        <div class="grammar-month">
          <div><p class="eyebrow line">Грамматика месяца</p><h3 class="h3">Грамматика в контексте темы</h3>
            <p class="muted small">Каждое правило разбираем на текстах и видео недели — так, как оно звучит в живой речи.</p></div>
          <ol>${p.weeks.filter((w) => w.grammar).map((w) => `<li><span class="type">Неделя 0${w.n}</span><b>${w.grammarEn}</b><small>${w.grammar}</small></li>`).join('')}</ol>
        </div>
        <a class="btn" href="#/programme">Вся программа месяца ${ARR}</a>
      </div>
    </section>

    <section class="section photo-section photo-section--formats" id="formats">
      <div class="photo-section__bg" style="background-image:url(${img('bgFormats')})"></div>
      <div class="wrap">
        <div class="section-head"><div><p class="eyebrow line">Форматы обучения</p><h2 class="h2">Выберите свой формат</h2></div></div>
        ${formatPlans()}
      </div>
    </section>






    ${founderBlock()}`;
  };

  const formatPlans = () => `<div class="plans plans--${D.plans.length}">
      ${D.plans.map((p) => {
        const ext = p.url && !p.url.startsWith('mailto:');
        return `<div class="plan ${p.featured ? 'featured' : ''}">
        <p class="eyebrow">Формат ${p.n}</p><div class="h2">${p.title}</div>
        <p class="muted" style="margin:10px 0 0">${p.sub}</p>
        ${p.price ? `<div class="price">${p.price}</div><span class="muted small">${p.per || ''}</span>` : ''}
        <ul>${p.features.map((f) => `<li>${f}</li>`).join('')}</ul>
        <p class="quote" style="font-size:20px">${p.note}</p>
        <a class="btn ${p.featured ? 'btn--solid' : ''}" ${p.url ? `href="${esc(p.url)}" ${ext ? 'target="_blank" rel="noopener"' : ''} data-needs-consent` : `href="#/formats"`}>${p.cta || 'Выбрать формат'} ${ARR}</a></div>`;
      }).join('')}
    </div>
    <div class="plans-consent">${consentCheck('Кнопки откроют Telegram-бот или почту ARNT Academy.')}</div>`;

  const FORMAT = [
    ['Одна тема в месяц', 'Глобальная тема месяца, разделённая на четыре недели. Глубина вместо разрозненных топиков.'],
    ['4 видеоурока', 'Каждую неделю — видеоурок 15 минут, лексика и грамматика, чтение и аудирование.'],
    ['Интерактивные задания', 'После каждого урока закрепляете новую лексику и грамматику в заданиях.'],
    ['Разговорные клубы', '4 встречи в месяц в формате ARNT Interactive — в группах по уровню английского.']
  ];
  const formatGrid = () => `<div class="grid-4">${FORMAT.map(([t, d], i) => `<div class="feature reveal reveal-d${i % 3}"><span class="num">0${i + 1}</span><div class="h3">${t}</div><p>${d}</p></div>`).join('')}</div>`;

  const founderBlock = () => `
    <section class="section section--brown">
      <div class="wrap founder">
        <div class="founder__img reveal" style="background-image:url(${img('arina')})"></div>
        <div class="reveal reveal-d1">
          <p class="eyebrow line">Основательница</p>
          <h2 class="h2">${D.founder.name}</h2>
          <p class="eyebrow" style="margin-top:12px">${D.founder.role}</p>
          <p class="quote">“${D.founder.quote}”</p>
          ${D.founder.bio.map((b) => `<p class="muted">${b}</p>`).join('')}
          <br><a class="btn" href="#/founder">Читать историю Арины ${ARR}</a>
        </div>
      </div>
    </section>`;

  /* --- Философия --- */
  P.philosophy = () => `
    ${pageHero('Философия', 'Английский как<br>способ мышления', 'Мы верим, что язык живёт там, где есть мысль.', 'library', '50% 30%')}
    <section class="section"><div class="wrap split">
      <div class="reveal"><p class="eyebrow line">Наши принципы</p><h2 class="h2">Глубина, красота<br>и внимание</h2></div>
      <div class="vline reveal">
        <p class="quote">«Мы не просто учим английский — мы думаем на нём».</p>
        <p>Обычные курсы учат язык ради языка. ARNT учит языку ради идей: каждый урок — это разговор о психологии, науке, искусстве и о том, как жить внимательнее.</p>
        <p>Мы выбираем медленность вместо спешки, глубину вместо количества и эстетику вместо шума. Наши студенты — взрослые люди, которым интересно думать.</p>
      </div></div></section>
    ${marquee(['Глубина', 'Красота', 'Внимание', 'Любопытство', 'Разговор', 'Глубина', 'Красота', 'Внимание'])}
    <section class="section"><div class="wrap">
      <p class="eyebrow line">Факультеты</p><h2 class="h2" style="margin-bottom:50px">Направления обучения</h2>
      ${facultyList()}
    </div></section>`;

  const facultyList = () => D.faculties.map((f) => `
    <div class="article-row reveal" style="grid-template-columns:1fr auto">
      <div><div class="h3">${f.title}</div><p>${f.ru}</p></div>
      ${f.active ? '<a class="link-arrow" href="#/programme">Открыть →</a>' : '<span class="soon">Скоро</span>'}
    </div>`).join('');
  P.faculties = () => `${pageHero('Факультеты', 'Факультеты академии', 'Академия растёт: новые факультеты и программы появляются по мере развития.')}
    <section class="section" style="padding-top:20px"><div class="wrap">${facultyList()}
    <h2 class="h2" style="margin:90px 0 40px">AI-менторы</h2>${mentorList()}</div></section>`;
  const mentorList = () => `<div class="grid-3">${D.mentors.map((m) => `<div class="feature reveal" style="border-top:1px solid var(--cream-20);padding-top:26px">
    <p class="eyebrow">${m.role}</p><div class="h3">${m.name}</div><p>${m.ru}</p><br>${m.active ? '' : '<span class="soon">Скоро</span>'}</div>`).join('')}</div>`;

  /* --- Программа месяца --- */
  P.programme = () => {
    const p = programme();
    return `
    ${pageHero('Программа месяца · ' + p.month + (p.start ? ' · ' + p.start : ''), p.title + (p.ru ? '<br><em style="font-size:.5em">' + p.ru + '</em>' : ''), p.lead, 'library', '50% 60%')}
    <section class="section"><div class="wrap">
      <div class="section-head"><div><p class="eyebrow line">Четыре недели · уровень ${p.level}</p><h2 class="h2">Одна идея —<br>четыре двери</h2></div>
        <a class="btn btn--solid" href="#/formats">Выбрать формат ${ARR}</a></div>
      <div class="cards">${p.weeks.map((w) => weekCard(p, w)).join('')}</div>
    </div></section>
    <section class="section section--brown"><div class="wrap">
      ${p.weeks.map((w) => `<a class="article-row article-row--week reveal" href="#/programme/${w.slug}">
        <div class="meta">Неделя 0${w.n}<br>${w.field}</div>
        <div><div class="h3">${w.title}</div><p>${w.sub} · ${lessonsOf(p.slug, w.n).length} уроков</p></div>
        <div class="meta" style="text-align:right">${[...new Set(lessonsOf(p.slug, w.n).map((l) => TYPE_RU[l.type]))].join(' · ')}</div></a>`).join('')}
    </div></section>`;
  };
  P.week = (slug) => {
    const p = programme(); const w = p.weeks.find((x) => x.slug === slug);
    if (!w) return P.notfound();
    const ls = lessonsOf(p.slug, w.n);
    return `
    ${pageHero(`Неделя 0${w.n} · ${w.field}`, w.title, w.sub, w.img, w.pos)}
    <section class="section"><div class="wrap">
      <p class="eyebrow line">Уроки недели</p>
      ${ls.map((l) => `<div class="lesson-row reveal"><span class="ic">${ICON[l.type]}</span>
        <div><div class="t">${l.title}</div><div class="s">${l.summary}</div></div>
        <span class="type">${TYPE_RU[l.type]}</span><span class="type min">${l.minutes} мин</span></div>`).join('')}
      <br><br><a class="btn btn--solid" href="#/formats">Выбрать формат ${ARR}</a>
      <a class="btn" href="#/programme" style="margin-left:10px">Все недели</a>
    </div></section>`;
  };

  /* --- Пробный урок --- */
  P.trial = () => {
    const t = D.trial;
    return `
    ${pageHero('Бесплатный урок · ' + t.field, t.title, t.question, 'reading', '50% 50%')}
    <section class="section" style="padding-top:20px"><div class="wrap" style="max-width:900px">
      <p class="lead" style="max-width:none">${t.intro}</p>
      <div class="chips" style="justify-content:flex-start;margin:26px 0 10px">${t.includes.map((x) => `<span>${x}</span>`).join('')}</div>
      <p class="type" style="margin:0 0 70px">Уровень: ${t.level} · Продолжительность: ${t.duration}</p>
      <p class="eyebrow line">01 · Видеоурок</p>
      ${t.video ? `<video controls src="${t.video}" style="width:100%"></video>` :
        `<div class="video" data-video="${esc(t.text)}" style="background-image:url(${img('study')});background-position:50% 40%"><span class="play">${ICON.play}</span><span class="vbar"></span></div>`}
      <br><p class="eyebrow line">Transcript</p>${readingText(t.text)}
      <br><br><p class="eyebrow line">02 · ${t.vocab.length} новых выражений</p>${vocabGrid(t.vocab)}
      <br><br><p class="eyebrow line">03 · Интерактивное задание</p>${quizBlock(t.quiz, 'trial')}
      <br><div class="glass-card" style="max-width:none;margin:40px 0 0;background:var(--brown)">
        <p class="eyebrow">Следующий шаг</p><h2 class="h2">Продолжите в полной программе</h2>
        <a class="btn btn--solid" href="#/formats">Выбрать формат ${ARR}</a></div>
    </div></section>`;
  };

  /* --- Формат --- */
  P.format = () => `
    ${pageHero('Обучение', 'Как проходит обучение', 'Один месяц — одна тема: глубоко, последовательно и красиво.', 'study', '50% 40%')}
    <section class="section"><div class="wrap">${formatGrid()}</div></section>
    <section class="section section--brown"><div class="wrap split">
      <div class="reveal"><p class="eyebrow line">Неделя в ARNT</p><h2 class="h2">Как устроена<br>учебная неделя</h2></div>
      <div class="vline reveal">
        ${[['Шаг 1', 'Видеоурок недели и ключевая лексика'], ['Шаг 2', 'Грамматика в контексте темы'], ['Шаг 3', 'Чтение и аудирование'], ['Шаг 4', 'Интерактивные задания'], ['Шаг 5', 'Разговорный клуб — в формате ARNT Interactive']].map(([d, t]) =>
          `<p style="display:flex;gap:30px;padding:14px 0;border-bottom:1px solid var(--cream-10);margin:0"><span class="type" style="width:100px">${d}</span>${t}</p>`).join('')}
      </div></div></section>
    <section class="section"><div class="wrap" style="text-align:center">
      <h2 class="h2">Попробуйте бесплатно</h2><br><a class="btn btn--solid" href="${D.trialUrl}" target="_blank" rel="noopener" data-needs-consent>Пройти пробный урок</a></div></section>`;

  /* --- Editions --- */
  P.editions = () => `
    ${pageHero('ARNT Editions', 'Books from<br>the Academy', 'Авторские книги академии: эссе, компаньоны и руководства для тех, кто читает по-английски вдумчиво.', 'reading', '50% 40%')}
    <section class="section"><div class="wrap grid-3">${D.books.map(bookCard).join('')}</div></section>`;
  P.book = (slug) => {
    const b = D.books.find((x) => x.slug === slug); if (!b) return P.notfound();
    return `<section class="section" style="padding-top:150px"><div class="wrap founder">
      <div style="max-width:440px;width:100%">${bookCard(b).replace('reveal', '')}</div>
      <div><p class="eyebrow line">ARNT Editions · ${b.year}</p><h1 class="h1">${b.title}</h1><p class="eyebrow" style="margin-top:12px">${b.sub}</p>
        <p class="lead">${b.desc}</p><p class="muted">${b.pages} страниц · твёрдый переплёт</p>
        <p class="quote" style="margin-top:30px">${b.price}</p>
        <button class="btn btn--solid" data-order="${b.title}">Order the book</button> <a class="btn" href="#/editions">All books</a></div>
    </div></section>`;
  };

  /* --- Journal --- */
  P.journal = () => `
    ${pageHero('ARNT Journal', 'The Journal', 'Образовательные статьи о языке, мышлении и культуре.')}
    <section class="section" style="padding-top:20px"><div class="wrap">
      <div class="tabs" data-filter-target=".article-row">
        ${['All', ...new Set(D.articles.map((a) => a.category))].map((c, i) => `<button class="tab ${i ? '' : 'active'}" data-filter="${c}">${c}</button>`).join('')}
      </div>
      ${D.articles.map((a) => articleRow(a).replace('class="article-row', `data-cat="${a.category}" class="article-row`)).join('')}
    </div></section>`;
  P.article = (slug) => {
    const a = D.articles.find((x) => x.slug === slug); if (!a) return P.notfound();
    return `${pageHero(a.category + ' · ' + a.date + ' · ' + a.read + ' min read', a.title, a.lead, a.img, a.pos)}
      <section class="section"><div class="wrap"><article class="prose">${a.body.map((p) => `<p>${p}</p>`).join('')}
      <br><a class="btn" href="#/journal">← Back to Journal</a></article></div></section>`;
  };

  /* --- Founder --- */
  P.founder = () => {
    const f = D.founder;
    return `${pageHero('Основательница', f.name, 'Синхронный переводчик и преподаватель английского языка, основательница ARNT Academy.')}
    ${founderBlock().replace(/<br><a class="btn" href="#\/founder">[^]*?<\/a>/, '<br><a class="btn btn--solid" href="#/formats">Выбрать формат ' + ARR + '</a>')}
    <section class="section">
      <div class="wrap">
        <p class="eyebrow line">Образование и путь</p>
        <h2 class="h2 reveal" style="margin-bottom:60px">От Перми до Бельгии:<br>путь Арины</h2>
        <div class="path">${f.path.map((p, i) => `
          <div class="path__item reveal">
            <span class="type">0${i + 1}</span>
            <div class="path__place">${p.place}</div>
            <div><div class="h3">${p.title}</div><p>${p.text}</p></div>
          </div>`).join('')}</div>
        <div class="facts">
          <div class="countries reveal">
            <b>${f.countries}</b>
            <div><p class="eyebrow">Страны</p><p class="quote" style="margin:0">Столько стран посетила Арина.</p></div>
          </div>
          <div class="countries reveal reveal-d1">
            <b>${f.languages}</b>
            <div><p class="eyebrow">Языки</p><p class="quote" style="margin:0">Столько языков знает Арина.</p></div>
          </div>
        </div>
      </div>
    </section>
    ${f.gallery.length ? `<section class="section section--brown">
      <div class="wrap">
        <div class="section-head"><div><p class="eyebrow line">Моменты</p><h2 class="h2">Жизнь за пределами<br>учебника</h2></div></div>
        <div class="collage">${f.gallery.map((g, i) => `<figure class="collage__item reveal reveal-d${i % 3}"><img src="${g}" alt="Арина Ткачева" loading="lazy"></figure>`).join('')}</div>
      </div>
    </section>` : ''}`;
  };

  /* --- Membership --- */
  P.membership = () => `
    ${pageHero('Форматы обучения', 'Выберите<br>свой формат', 'Три формата ARNT Academy: самостоятельное обучение, обучение с разговорной практикой и индивидуальные уроки. Уровень от B1.')}
    <section class="section" style="padding-top:20px"><div class="wrap">${formatPlans()}</div></section>`;

  /* --- Auth --- */
  const authLayout = (inner, image) => `<section class="auth"><div class="auth__img" style="background-image:url(${img(image)})"></div><div class="auth__form">${inner}</div></section>`;
  P.login = () => authLayout(`
    <p class="eyebrow line">Welcome back</p><h1 class="h1" style="margin-bottom:40px">Sign in</h1>
    <form data-auth="login">
      <label class="field"><span>E-mail</span><input class="input" type="email" name="email" required></label>
      <label class="field"><span>Password</span><input class="input" type="password" name="password" required minlength="4"></label>
      <button class="btn btn--solid">Sign in ${ARR}</button><p class="form-msg"></p>
    </form>
    <p class="muted small">Нет аккаунта? <a class="link-arrow" href="#/register">Join the Academy</a></p>`, 'library');
  P.register = (q) => authLayout(`
    <p class="eyebrow line">Join the Academy</p><h1 class="h1" style="margin-bottom:40px">Create account</h1>
    <form data-auth="register">
      <label class="field"><span>Name</span><input class="input" name="name" required></label>
      <label class="field"><span>E-mail</span><input class="input" type="email" name="email" required></label>
      <label class="field"><span>Password</span><input class="input" type="password" name="password" required minlength="4"></label>
      <label class="field"><span>Membership</span><select class="input" name="plan">${D.plans.map((p) => `<option value="${p.id}" ${q.plan === p.id || (!q.plan && p.featured) ? 'selected' : ''} style="color:#251802">${p.title} — ${p.sub}</option>`).join('')}</select></label>
      <button class="btn btn--solid">Create account ${ARR}</button><p class="form-msg"></p>
    </form>
    <p class="muted small">Уже учитесь? <a class="link-arrow" href="#/login">Sign in</a></p>`, 'reading');

  /* --- Юридические страницы --- */
  const L = (k) => esc(D.legal[k] || '[заполнить]');
  const legalPage = (eyebrow, title, sections) => `
    ${pageHero(eyebrow, title, 'Редакция от ' + D.legal.policyDate)}
    <section class="section" style="padding-top:10px"><div class="wrap"><article class="legal">
      ${sections.map(([h, body]) => `<h2>${h}</h2>${body}`).join('')}
    </article></div></section>`;
  const operatorBlock = () => `<p><b>Оператор:</b> ${L('operator')}<br><b>ИНН:</b> ${L('inn')}<br><b>ОГРНИП:</b> ${L('ogrn')}<br>${D.legal.address ? `<b>Адрес:</b> ${L('address')}<br>` : ''}<b>E-mail для обращений:</b> <a href="mailto:${L('email')}">${L('email')}</a></p>`;

  P.privacy = () => legalPage('Документ', 'Политика обработки персональных данных', [
    ['1. Общие положения', `<p>Настоящая Политика определяет порядок обработки и меры по защите персональных данных пользователей сайта ARNT Academy (далее — Сайт), а также клиентов, которые записываются на обучение и пробный урок. Политика разработана в соответствии с Федеральным законом от 27.07.2006 № 152-ФЗ «О персональных данных».</p>${operatorBlock()}
      <p>Используя Сайт и передавая персональные данные Оператору, пользователь подтверждает, что ознакомился с настоящей Политикой. Обработка данных осуществляется на основании отдельного <a href="#/consent">согласия на обработку персональных данных</a> либо для заключения и исполнения договора, стороной которого является пользователь.</p>`],
    ['2. Какие данные мы обрабатываем', `<ul><li>имя;</li><li>номер телефона и (или) адрес электронной почты;</li><li>имя пользователя и идентификатор в Telegram;</li><li>сведения об уровне английского языка и выбранном формате обучения;</li><li>сведения об оплате (сумма, дата, статус). Данные банковских карт Оператор не получает и не хранит — их обрабатывает платёжный сервис;</li><li>обезличенные данные о посещении Сайта (cookie, IP-адрес, сведения о браузере и устройстве) — только при согласии на аналитические cookie.</li></ul>
      <p>Специальные категории персональных данных (о здоровье, убеждениях и т. п.) и биометрические данные Оператор не обрабатывает.</p>`],
    ['3. Цели обработки', `<ul><li>запись на бесплатный пробный урок;</li><li>анализ посещаемости и улучшение Сайта (при согласии на аналитические cookie);</li><li>заключение и исполнение договора об оказании услуг обучения;</li><li>предоставление доступа к урокам, материалам и разговорным клубам;</li><li>связь с пользователем по вопросам обучения;</li><li>направление информационных сообщений — только с отдельного согласия, от них можно отказаться в любой момент.</li></ul>`],
    ['4. Как данные попадают к Оператору', `<p>Сам Сайт не содержит форм для ввода персональных данных. Аналитические cookie (Яндекс Метрика) используются только с согласия пользователя — см. раздел 10. Данные для записи на обучение передаются Оператору, когда пользователь:</p>
      <ul><li>переходит в Telegram-боты ARNT Academy и сообщает в них свои данные;</li><li>записывается на пробный урок через образовательную платформу ProgressMe;</li><li>пишет на электронную почту Оператора, например чтобы записаться на индивидуальный урок.</li></ul>
      <p>Telegram и ProgressMe являются самостоятельными сервисами и обрабатывают данные также по своим правилам. Сервис Telegram размещает серверы за пределами Российской Федерации; передавая данные через Telegram, пользователь соглашается на их трансграничную передачу.</p>`],
    ['5. Сроки и порядок обработки', `<p>Оператор осуществляет сбор, запись, систематизацию, накопление, хранение, уточнение, использование, удаление и уничтожение персональных данных. При сборе персональных данных граждан РФ Оператор обеспечивает их запись и хранение с использованием баз данных, находящихся на территории Российской Федерации.</p>
      <p>Данные хранятся до достижения целей обработки, но не дольше 3 лет с момента последнего взаимодействия либо до отзыва согласия, если более длительный срок не предусмотрен законом (например, для бухгалтерских документов).</p>`],
    ['6. Передача третьим лицам', `<p>Оператор не продаёт персональные данные и не передаёт их третьим лицам, за исключением случаев, необходимых для оказания услуг (платёжный сервис, образовательная платформа), а также случаев, предусмотренных законодательством РФ.</p>`],
    ['7. Защита данных', `<p>Оператор принимает правовые, организационные и технические меры для защиты данных от неправомерного доступа, изменения, распространения и уничтожения: ограничивает доступ к данным, использует защищённые каналы связи и надёжные пароли.</p>`],
    ['8. Права пользователя', `<p>Пользователь вправе получить сведения об обработке своих данных, потребовать их уточнения, блокирования или удаления, отозвать согласие на обработку, а также обжаловать действия Оператора в Роскомнадзоре или в суде. Для этого достаточно направить обращение на e-mail ${L('email')}. Оператор отвечает в течение 10 рабочих дней.</p>`],
    ['9. Несовершеннолетние', `<p>Услуги ARNT Academy предназначены для совершеннолетних. Данные лиц младше 18 лет обрабатываются только с согласия их законных представителей.</p>`],
    ['10. Cookie-файлы и веб-аналитика', `<p>Сайт использует технические cookie и хранилище браузера, необходимые для его работы, а также — <b>только с согласия пользователя</b> — сервис веб-аналитики Яндекс Метрика (ООО «ЯНДЕКС», Россия). Метрика собирает обезличенные сведения: IP-адрес, тип устройства и браузера, источник перехода, просмотренные страницы, время на сайте и действия на страницах. Цель — анализ посещаемости и улучшение сайта. Данные обрабатываются на серверах в Российской Федерации в соответствии с <a href="https://yandex.ru/legal/confidential/" target="_blank" rel="noopener">Политикой конфиденциальности Яндекса</a>.</p>
      <p>Согласие на аналитические cookie даётся кнопкой «Принять» в уведомлении и может быть отозвано в любой момент через ссылку «Настройки cookie» внизу сайта. Подробнее — в <a href="#/cookies">Уведомлении об использовании cookie</a>.</p>`],
    ['11. Изменение Политики', `<p>Оператор может обновлять Политику. Актуальная редакция всегда доступна на этой странице.</p>`]
  ]);

  P.consent = () => legalPage('Документ', 'Согласие на обработку персональных данных', [
    ['', `<p>Я, действуя свободно, своей волей и в своём интересе, даю согласие ${L('operator')} (ИНН ${L('inn')}, ОГРНИП ${L('ogrn')}${D.legal.address ? ', адрес: ' + L('address') : ''}) (далее — Оператор) на обработку моих персональных данных на следующих условиях.</p>
      <p><b>Перечень данных:</b> имя; номер телефона; адрес электронной почты; имя пользователя и идентификатор в Telegram; сведения об уровне английского языка и выбранном формате обучения; сведения об оплате.</p>
      <p><b>Цели:</b> запись на пробный урок; заключение и исполнение договора об оказании услуг обучения; связь со мной по вопросам обучения.</p>
      <p><b>Действия с данными:</b> сбор, запись, систематизация, накопление, хранение, уточнение, использование, передача (предоставление доступа) лицам, обеспечивающим оказание услуг, обезличивание, блокирование, удаление, уничтожение; с использованием средств автоматизации и без них.</p>
      <p><b>Трансграничная передача:</b> я понимаю, что при общении через Telegram мои данные могут обрабатываться на серверах за пределами РФ, и даю согласие на такую передачу.</p>
      <p><b>Срок:</b> согласие действует 3 года либо до его отзыва. Я могу отозвать согласие, направив заявление на e-mail ${L('email')}.</p>
      <p>С <a href="#/privacy">Политикой обработки персональных данных</a> ознакомлен(а).</p>`]
  ]);

  P.legal = () => legalPage('Документ', 'Сведения о продавце', [
    ['', `${operatorBlock()}<p>Услуги оказываются дистанционно. Условия оказания услуг, стоимость, порядок оплаты и возврата денежных средств указываются в договоре-оферте, с которым клиент знакомится до оплаты.</p>`]
  ]);

  P.cookies = () => legalPage('Документ', 'Уведомление об использовании cookie', [
    ['Что такое cookie', `<p>Cookie — небольшие файлы, которые сайт сохраняет в браузере. Похожим образом работает локальное хранилище браузера.</p>`],
    ['Необходимые (всегда включены)', `<p>Нужны для работы сайта и не требуют согласия:</p>
      <ul><li><b>arnt_cookie</b> — ваш выбор в уведомлении о cookie (хранилище браузера, бессрочно);</li><li><b>arnt_consent</b> — отметка о согласии на обработку данных (до закрытия вкладки);</li><li>результаты учебных заданий на сайте (хранилище браузера).</li></ul>
      <p>Эти данные остаются на вашем устройстве и Оператору не передаются.</p>`],
    ['Аналитические (только с вашего согласия)', `<p>Если вы нажали «Принять», подключается <b>Яндекс Метрика</b> (ООО «ЯНДЕКС», Россия). Она устанавливает cookie <b>_ym_uid</b>, <b>_ym_d</b>, <b>_ym_isad</b>, <b>_ym_visorc</b> и другие с префиксом <b>_ym</b> — сроком до 1 года. Метрика собирает обезличенные сведения о посещении: IP-адрес, устройство и браузер, источник перехода, просмотренные страницы, время на сайте и клики. Мы используем эти данные только для анализа посещаемости и улучшения сайта.</p>
      <p>Если вы выбрали «Только необходимые», Метрика не загружается.</p>`],
    ['Как изменить выбор', `<p>Нажмите <a href="#" data-cookie-settings>«Настройки cookie»</a> (ссылка есть и внизу каждой страницы) и выберите другой вариант. При отзыве согласия cookie Метрики удаляются. Также cookie можно удалить или запретить в настройках браузера.</p>`],
    ['Сторонние сервисы', `<p>При переходе в Telegram или на платформу ProgressMe эти сервисы могут использовать собственные cookie по своим правилам.</p>
      <p>Оператор: ${L('operator')}, ИНН ${L('inn')}. Подробнее — в <a href="#/privacy">Политике обработки персональных данных</a>.</p>`]
  ]);

  P.notfound = () => `${pageHero('404', 'Страница не найдена', 'Эта страница затерялась на полках библиотеки.')}<section class="wrap" style="padding-bottom:120px"><a class="btn" href="#/">На главную</a></section>`;

  /* ==========================================================================
     Личный кабинет
     ========================================================================== */
  const CAB_NAV = [
    ['', 'My Programme'], ['dictionary', 'My Dictionary'], ['library', 'Library'],
    ['progress', 'Progress'], ['club', 'Discussion Club'], ['mentors', 'AI Mentors']
  ];
  const cabLayout = (sub, inner) => {
    const u = user();
    return `<section class="cab">
      <aside class="cab__side">
        <div class="cab__user"><div><span class="type">${(D.plans.find((p) => p.id === u.plan) || {}).title || 'Member'}</span><b>${esc(u.name)}</b></div>
          <button class="icon-btn" data-logout>Sign out</button></div>
        <nav class="cab__nav">${CAB_NAV.map(([h, t]) => `<a href="#/cabinet${h ? '/' + h : ''}" class="${sub === h ? 'active' : ''}">${t}</a>`).join('')}</nav>
      </aside>
      <div class="cab__main">${inner}</div></section>`;
  };

  const lessonRow = (l) => `<a class="lesson-row ${done().includes(l.id) ? 'done' : ''}" href="#/cabinet/lesson/${l.id}">
    <span class="ic">${ICON[l.type]}</span><div><div class="t">${l.title}</div><div class="s">${l.summary}</div></div>
    <span class="type">${TYPE_RU[l.type]}</span><span class="type min">${done().includes(l.id) ? 'Done ✓' : l.minutes + ' min'}</span></a>`;

  const C = {};
  C[''] = (_, q) => {
    const p = programme(); const d = done();
    const nextWeek = p.weeks.find((w) => lessonsOf(p.slug, w.n).some((l) => !d.includes(l.id))) || p.weeks[p.weeks.length - 1];
    const wn = q.week ? +q.week : nextWeek.n;
    const w = p.weeks.find((x) => x.n === wn) || nextWeek;
    return `
      <div class="cab__head"><p class="eyebrow line">${p.month} · ${p.level}</p><h1 class="h1">${p.title}</h1></div>
      <div class="week-hero"><div class="bg" style="background-image:url(${img(w.img)});background-position:${w.pos}"></div>
        <p class="eyebrow">Week 0${w.n} · ${w.field} ${w.n === nextWeek.n ? '· This week' : ''}</p><h2 class="h2">${w.title}</h2><p class="muted">${w.sub}</p></div>
      <div class="tabs">${p.weeks.map((x) => `<a class="tab ${x.n === w.n ? 'active' : ''}" href="#/cabinet/week/${x.n}">Week 0${x.n}</a>`).join('')}</div>
      ${lessonsOf(p.slug, w.n).map(lessonRow).join('')}`;
  };
  C.week = (n) => C[''](null, { week: n });

  C.lesson = (id) => {
    const l = D.lessons.find((x) => x.id === id); if (!l) return '<p>Урок не найден.</p>';
    const p = programme(); const w = p.weeks.find((x) => x.n === l.week);
    const list = lessonsOf(l.programme); const i = list.indexOf(l); const next = list[i + 1];
    let body = '';
    if (l.type === 'video') body = (l.video ? `<video controls src="${l.video}" style="width:100%"></video>` :
      `<div class="video" data-video="${esc(l.text)}" style="background-image:url(${img(w.img)});background-position:${w.pos}"><span class="play">${ICON.play}</span><span class="vbar"></span></div>`) +
      `<br><p class="eyebrow line">Transcript</p>${readingText(l.text)}`;
    if (l.type === 'text') body = readingText(l.text);
    if (l.type === 'audio') body = audioPlayer(l.text) + `<br><details><summary class="link-arrow" style="cursor:pointer">Show transcript</summary><br>${readingText(l.text)}</details>`;
    if (l.vocab) body += `<br><br><p class="eyebrow line">Vocabulary</p>${vocabGrid(l.vocab)}`;
    if (l.quiz) body += quizBlock(l.quiz, l.id);
    const isDone = done().includes(l.id);
    return `
      <a class="link-arrow" href="#/cabinet/week/${l.week}">← Week 0${l.week} · ${w.title}</a>
      <div class="cab__head" style="margin-top:34px"><p class="eyebrow line">${TYPE_RU[l.type]} · ${l.minutes} min</p><h1 class="h1">${l.title}</h1><p class="lead">${l.summary}</p></div>
      <div style="max-width:900px">${body}
      <br><br><div style="display:flex;gap:12px;flex-wrap:wrap">
        <button class="btn ${isDone ? '' : 'btn--solid'}" data-complete="${l.id}">${isDone ? 'Completed ✓' : 'Mark as complete'}</button>
        ${next ? `<a class="btn" href="#/cabinet/lesson/${next.id}">Next: ${next.title} ${ARR}</a>` : ''}</div></div>`;
  };

  C.dictionary = () => {
    const list = dict();
    return `<div class="cab__head"><p class="eyebrow line">Personal lexicon · ${list.length} words</p><h1 class="h1">My Dictionary</h1></div>
      <form class="dict-form" data-dict-add>
        <label class="field" style="margin:0"><span>Word or phrase</span><input class="input" name="w" required></label>
        <label class="field" style="margin:0"><span>Translation / note</span><input class="input" name="t"></label>
        <button class="btn btn--solid">Add</button></form>
      <div class="tabs"><input class="input" data-dict-search placeholder="Search…" style="max-width:280px"></div>
      ${list.length ? `<table class="dict-table"><tr><th>Word</th><th>Meaning</th><th></th><th></th></tr>
      ${list.map((d, i) => `<tr data-row="${esc(d.w.toLowerCase() + ' ' + (d.t || '').toLowerCase())}"><td>${esc(d.w)}</td><td class="muted">${esc(d.t || '—')}</td>
        <td><button class="icon-btn" data-say="${esc(d.w)}" title="Произнести">♪</button></td><td style="text-align:right"><button class="icon-btn" data-del="${i}">Remove</button></td></tr>`).join('')}</table>`
        : '<p class="muted">Словарь пуст. Добавляйте слова из уроков кнопкой «+» или через форму выше.</p>'}`;
  };

  C.library = () => `<div class="cab__head"><p class="eyebrow line">Materials</p><h1 class="h1">Library</h1></div>
    <div class="tabs" data-filter-target=".lib-item">${['All', ...new Set(D.library.map((m) => m.kind))].map((c, i) => `<button class="tab ${i ? '' : 'active'}" data-filter="${c}">${c}</button>`).join('')}</div>
    ${D.library.map((m) => `<div class="lib-item" data-cat="${m.kind}"><span class="type">${m.kind}</span><div class="h3">${m.title}</div><span class="muted small">${m.field}</span>
      <button class="link-arrow" style="background:none;border:0;border-bottom:1px solid var(--cream-20);cursor:pointer;color:var(--cream)" data-open="${esc(m.title)}">Open →</button></div>`).join('')}
`;

  C.progress = () => {
    const p = programme(); const d = done(); const all = lessonsOf(p.slug);
    const pct = Math.round((all.filter((l) => d.includes(l.id)).length / all.length) * 100) || 0;
    const quiz = store.get('quiz', {}); const scores = Object.values(quiz);
    const acc = scores.length ? Math.round(scores.reduce((s, x) => s + x, 0) / scores.length) : 0;
    return `<div class="cab__head"><p class="eyebrow line">${p.title}</p><h1 class="h1">Progress</h1></div>
      <div class="stats">
        <div><b>${pct}%</b><span>Programme</span></div>
        <div><b>${all.filter((l) => d.includes(l.id)).length}/${all.length}</b><span>Lessons</span></div>
        <div><b>${dict().length}</b><span>Words saved</span></div>
        <div><b>${acc}%</b><span>Quiz accuracy</span></div></div>
      <p class="eyebrow line">By week</p>
      ${p.weeks.map((w) => { const ls = lessonsOf(p.slug, w.n); const c = ls.filter((l) => d.includes(l.id)).length; const v = ls.length ? Math.round(c / ls.length * 100) : 0;
        return `<div class="prog-row"><span class="type">Week 0${w.n}</span><div><div class="h3" style="font-size:20px">${w.title}</div><div class="bar"><i style="width:${v}%"></i></div></div><span class="type" style="text-align:right">${v}%</span></div>`; }).join('')}
      <br><br><p class="eyebrow line">By format</p>
      ${['video', 'text', 'audio', 'interactive'].map((t) => { const ls = all.filter((l) => l.type === t); const c = ls.filter((l) => d.includes(l.id)).length; const v = ls.length ? Math.round(c / ls.length * 100) : 0;
        return `<div class="prog-row"><span class="type">${TYPE_RU[t]}</span><div class="bar"><i style="width:${v}%"></i></div><span class="type" style="text-align:right">${c}/${ls.length}</span></div>`; }).join('')}`;
  };

  const threads = () => store.get('club', D.club);
  C.club = () => `<div class="cab__head"><p class="eyebrow line">Community</p><h1 class="h1">Discussion Club</h1>
      <p class="lead">Обсуждения недели — только на английском. Пишите свободно: здесь важна мысль, а не идеальная грамматика.</p></div>
    <form data-thread style="max-width:720px;margin-bottom:50px">
      <label class="field"><span>New discussion</span><input class="input" name="title" required placeholder="Your question"></label>
      <label class="field"><span>Your thoughts</span><textarea class="input" name="text" required></textarea></label>
      <button class="btn btn--solid">Start discussion</button></form>
    ${threads().map((t) => `<div class="thread"><span class="type">Week 0${t.week} · ${esc(t.author)}</span><div class="h3">${esc(t.title)}</div><p>${esc(t.text)}</p>
      ${t.replies.map(([a, r]) => `<div class="reply"><b>${esc(a)}</b>${esc(r)}</div>`).join('')}
      <form class="reply-form" data-reply="${t.id}"><input class="input" name="r" required placeholder="Reply in English…"><button class="btn">Reply</button></form></div>`).join('')}`;

  C.mentors = () => `<div class="cab__head"><p class="eyebrow line">Coming soon</p><h1 class="h1">AI Mentors</h1>
    <p class="lead">Персональные AI-менторы для разговорной практики и письма появятся в следующих обновлениях академии.</p></div>${mentorList()}`;

  /* ==========================================================================
     Роутер
     ========================================================================== */
  function parse() {
    const raw = location.hash.replace(/^#\/?/, '');
    const [path, qs] = raw.split('?');
    const q = Object.fromEntries(new URLSearchParams(qs || ''));
    return { parts: path.split('/').filter(Boolean), q, path };
  }

  function route() {
    const { parts, q, path } = parse();
    const [a, b, c] = parts;
    let html, scrollTo = null;
    if (['cabinet', 'login', 'register'].includes(a) && !D.accountsEnabled) { location.hash = '#/'; return; }
    if (a === 'cabinet') {
      if (!user()) { location.hash = '#/login'; return; }
      if (b === 'lesson') html = cabLayout('', C.lesson(c));
      else if (b === 'week') html = cabLayout('', C.week(c));
      else html = cabLayout(C[b || ''] ? (b || '') : '', (C[b || ''] || C[''])(c, q));
    } else if (!a) html = P.home();
    else if (a === 'formats') { html = P.home(); scrollTo = 'formats'; }
    else if (a === 'programme' && b) html = P.week(b);
    else if (a === 'editions' && b) html = P.book(b);
    else if (a === 'journal' && b) html = P.article(b);
    else if (P[a] && !['home', 'week', 'book', 'article', 'notfound'].includes(a)) html = P[a](q);
    else html = P.notfound();

    window.speechSynthesis && speechSynthesis.cancel();
    const app = $('#app');
    app.style.animation = 'none'; void app.offsetHeight; app.style.animation = '';
    app.innerHTML = html;
    $('#footer').style.display = a === 'cabinet' || a === 'login' || a === 'register' ? 'none' : '';
    document.body.classList.remove('menu-open');
    renderNav(path);
    const target = scrollTo && document.getElementById(scrollTo);
    if (target) requestAnimationFrame(() => target.scrollIntoView({ behavior: 'smooth' }));
    else window.scrollTo(0, 0);
    onScroll(); observe(); trackHit();
  }

  /* ---------- Анимации ---------- */
  let io;
  function observe() {
    io && io.disconnect();
    io = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }), { threshold: .12 });
    $$('.reveal').forEach((el) => io.observe(el));
  }
  function onScroll() {
    const { parts } = parse();
    $('#nav').classList.toggle('is-solid', window.scrollY > 40 || ['cabinet', 'login', 'register'].includes(parts[0]) || parts[0] === 'editions' && parts[1]);
    $$('[data-parallax]').forEach((el) => {
      const r = el.parentElement.getBoundingClientRect();
      if (r.bottom > 0 && r.top < innerHeight) el.style.transform = `translateY(${(r.top + r.height / 2 - innerHeight / 2) * -0.08}px)`;
    });
  }
  addEventListener('scroll', onScroll, { passive: true });

  /* ---------- Речь (аудио/видео-демо через Web Speech API) ---------- */
  function speak(text, onProgress, onEnd) {
    if (!('speechSynthesis' in window)) { toast('Аудио недоступно в этом браузере'); return null; }
    speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.lang = 'en-GB'; u.rate = .92;
    const v = speechSynthesis.getVoices().find((x) => x.lang === 'en-GB') || speechSynthesis.getVoices().find((x) => x.lang.startsWith('en'));
    if (v) u.voice = v;
    u.onboundary = (e) => onProgress && onProgress(e.charIndex / text.length);
    u.onend = () => onEnd && onEnd();
    speechSynthesis.speak(u);
    return u;
  }

  /* ---------- Делегирование событий ---------- */
  document.addEventListener('click', (e) => {
    const t = e.target;
    const need = t.closest('[data-needs-consent]');
    if (need && !consentGiven) { e.preventDefault(); openConsentModal(need.getAttribute('href')); return; }
    if (t.closest('[data-consent-close]') || t.id === 'consentModal') { $('#consentModal').hidden = true; return; }
    const go = t.closest('#consentGo');
    if (go && !consentGiven) { e.preventDefault(); toast('Отметьте согласие на обработку данных'); return; }
    if (go) { setTimeout(() => { $('#consentModal').hidden = true; }, 100); }
    const ck = t.closest('[data-cookie]');
    if (ck) { setCookieChoice(ck.dataset.cookie); return; }
    if (t.closest('[data-cookie-settings]')) { e.preventDefault(); $('#cookieBar').hidden = false; return; }
    const opt = t.closest('.opt');
    if (opt) {
      const q = opt.closest('.q'); if (q.dataset.answered) return;
      const ok = +opt.dataset.i === +q.dataset.a;
      q.dataset.answered = ok ? '1' : '0';
      $$('.opt', q).forEach((o) => o.classList.add(+o.dataset.i === +q.dataset.a ? 'correct' : 'wrong'));
      const quiz = opt.closest('.quiz'); const qs = $$('.q', quiz);
      if (qs.every((x) => x.dataset.answered)) {
        const score = qs.filter((x) => x.dataset.answered === '1').length;
        $('[data-quiz-result]', quiz).textContent = `Result: ${score} / ${qs.length}. ${score === qs.length ? 'Excellent.' : 'Review the vocabulary and try again later.'}`;
        const all = store.get('quiz', {}); all[quiz.dataset.quiz] = Math.round(score / qs.length * 100); store.set('quiz', all);
      }
      return;
    }
    const add = t.closest('.add-word');
    if (add) {
      const list = dict(); const w = add.dataset.word;
      if (!list.some((d) => d.w === w)) { list.unshift({ w, t: add.dataset.tr }); store.set('dict', list); }
      add.classList.add('added'); add.textContent = '✓'; toast(`«${w}» — в вашем словаре`);
      return;
    }
    const w = t.closest('.reading .w'); if (w) { w.classList.toggle('hl'); return; }
    const aud = t.closest('.audio button');
    if (aud) {
      const box = aud.closest('.audio'); const bar = $('.track i', box);
      if (box.dataset.playing) { speechSynthesis.cancel(); delete box.dataset.playing; aud.innerHTML = ICON.play; return; }
      box.dataset.playing = 1; aud.innerHTML = ICON.pause;
      speak(box.dataset.audio, (p) => bar.style.width = p * 100 + '%', () => { bar.style.width = '100%'; delete box.dataset.playing; aud.innerHTML = ICON.play; });
      return;
    }
    const vid = t.closest('.video');
    if (vid) {
      const bar = $('.vbar', vid);
      if (vid.classList.contains('playing')) { speechSynthesis.cancel(); vid.classList.remove('playing'); return; }
      vid.classList.add('playing');
      speak(vid.dataset.video, (p) => bar.style.width = p * 100 + '%', () => { bar.style.width = '100%'; vid.classList.remove('playing'); });
      return;
    }
    const say = t.closest('[data-say]'); if (say) { speak(say.dataset.say); return; }
    const comp = t.closest('[data-complete]');
    if (comp) {
      const d = done(); const id = comp.dataset.complete;
      store.set('done', d.includes(id) ? d.filter((x) => x !== id) : [...d, id]);
      toast(d.includes(id) ? 'Отметка снята' : 'Урок завершён'); route(); return;
    }
    const del = t.closest('[data-del]'); if (del) { const l = dict(); l.splice(+del.dataset.del, 1); store.set('dict', l); route(); return; }
    const flt = t.closest('[data-filter]');
    if (flt) {
      const bar = flt.closest('[data-filter-target]'); $$('.tab', bar).forEach((x) => x.classList.toggle('active', x === flt));
      $$(bar.dataset.filterTarget).forEach((el) => { el.style.display = flt.dataset.filter === 'All' || el.dataset.cat === flt.dataset.filter ? '' : 'none'; });
      return;
    }
    if (t.closest('[data-logout]')) { store.set('user', null); toast('Вы вышли из аккаунта'); location.hash = '#/'; return; }
    const ord = t.closest('[data-order]'); if (ord) { toast(`«${ord.dataset.order}» добавлена в заказ`); return; }
    const op = t.closest('[data-open]'); if (op) { toast(`Материал «${op.dataset.open}» откроется после подключения хранилища`); return; }
    if (t.closest('.mobile-menu a')) document.body.classList.remove('menu-open');
  });

  document.addEventListener('change', (e) => { if (e.target.matches('[data-consent]')) setConsent(e.target.checked); });

  document.addEventListener('input', (e) => {
    if (e.target.matches('[data-dict-search]')) {
      const v = e.target.value.toLowerCase();
      $$('[data-row]').forEach((r) => { r.style.display = r.dataset.row.includes(v) ? '' : 'none'; });
    }
  });

  document.addEventListener('submit', (e) => {
    const f = e.target; const data = Object.fromEntries(new FormData(f));
    if (f.matches('[data-auth]')) {
      e.preventDefault();
      const users = store.get('users', []); const msg = $('.form-msg', f);
      if (f.dataset.auth === 'register') {
        if (users.some((u) => u.email === data.email)) { msg.textContent = 'Этот e-mail уже зарегистрирован.'; return; }
        users.push(data); store.set('users', users);
        store.set('user', { name: data.name, email: data.email, plan: data.plan });
        toast('Добро пожаловать в ARNT Academy'); location.hash = '#/cabinet';
      } else {
        const u = users.find((x) => x.email === data.email && x.password === data.password);
        if (!u) { msg.textContent = 'Неверный e-mail или пароль.'; return; }
        store.set('user', { name: u.name, email: u.email, plan: u.plan }); location.hash = '#/cabinet';
      }
    } else if (f.matches('[data-subscribe]')) {
      e.preventDefault(); f.reset(); toast('Спасибо! Вы подписаны на рассылку');
    } else if (f.matches('[data-dict-add]')) {
      e.preventDefault(); const l = dict(); l.unshift({ w: data.w.trim(), t: data.t.trim() }); store.set('dict', l); route();
    } else if (f.matches('[data-thread]')) {
      e.preventDefault(); const th = threads();
      th.unshift({ id: 't' + Date.now(), author: user().name, week: programme().weeks[0].n, title: data.title, text: data.text, replies: [] });
      store.set('club', th); route();
    } else if (f.matches('[data-reply]')) {
      e.preventDefault(); const th = threads(); const x = th.find((t) => t.id === f.dataset.reply);
      x.replies.push([user().name, data.r]); store.set('club', th); route();
    }
  });

  renderFooter();
  document.body.classList.toggle('consent-ok', consentGiven);
  $('#consentModal').querySelector('.consent-slot').innerHTML = consentCheck();
  $('#cookieBar').hidden = !!cookieChoice();
  if (cookieChoice() === 'all') loadMetrika();
  addEventListener('hashchange', route);
  route();
})();
