/* ==========================================================================
   ARNT Academy — контент сайта
   Весь контент живёт здесь. Чтобы добавить программу, урок, книгу, статью,
   факультет или AI-ментора — добавьте объект в нужный массив.
   Разметка страниц строится автоматически (js/app.js).
   ========================================================================== */

window.ARNT = {

  /* --- Юридическая информация (обязательно заполнить перед запуском) ---
     Пустые поля выводятся на сайте как «[заполнить]». */
  legal: {
    operator: 'ИП Ткачева А.С.',
    inn: '590426939979',
    ogrn: '326508100250714',
    address: '',         // адрес для корреспонденции
    email: 'arntacademy@gmail.com',
    policyDate: '25.11.2026'
  },

  /* --- Аналитика ---
     Номер счётчика Яндекс Метрики (только цифры). Счётчик запускается
     ТОЛЬКО после того, как посетитель нажал «Принять» в уведомлении о cookie. */
  analytics: {
    yandexMetrikaId: '',
    webvisor: false   // запись сессий; включайте только если указали это в Политике
  },

  /* Вход, регистрация и личный кабинет. true — включить обратно */
  accountsEnabled: false,

  /* --- Изображения (можно добавлять новые) --- */
  images: {
    library:  'assets/img/library.jpg',
    arina:    'assets/img/arina.jpg',
    bgFormats: 'assets/img/bg-1.jpg',
    anchor:   'assets/img/anchor.jpg',
    loss:     'assets/img/loss.jpg',
    sunk:     'assets/img/sunk.jpg',
    decoy:    'assets/img/decoy.jpg',
    bgTrial:  'assets/img/bg-8.jpg',
    bgConcept: 'assets/img/bg-4.jpg',
    bgLuxury:  'assets/img/bg-7.jpg',
    libraryGlass: 'assets/img/library-glass.jpg',
    reading:  'assets/img/reading-room.jpg',
    study:    'assets/img/green-study.jpg'
  },

  /* --- Факультеты. active:false — показываются как «скоро» --- */
  faculties: [
    { id: 'humanities', title: 'Гуманитарный факультет', ru: 'Психология, нейробиология, wellness, искусство и культура', active: true },
    { id: 'business',   title: 'Факультет бизнеса и идей', ru: 'Экономика поведения, лидерство, переговоры', active: false },
    { id: 'science',    title: 'Факультет естественных наук', ru: 'Биология, космос, экология', active: false }
  ],

  /* --- AI-менторы (заготовка для будущего подключения) --- */
  mentors: [
    { id: 'ada',   name: 'Ada',   role: 'Ментор по разговорной практике',  ru: 'Разговорная практика и произношение', active: false },
    { id: 'virgil', name: 'Virgil', role: 'Ментор по письму', ru: 'Эссе, стиль, академическое письмо', active: false }
  ],

  /* --- Программы. current: true — программа месяца --- */
  programmes: [
    {
      slug: 'the-art-of-decision-making',
      faculty: 'humanities',
      current: true,
      month: 'Январь 2027',
      start: 'Старт 1 января 2027',
      title: 'The Art of Decision-Making',
      ru: 'Искусство принятия решений',
      lead: 'Почему мы выбираем то, что выбираем? Месяц о скрытых механизмах, которые влияют на наши решения — от цены в магазине до важных жизненных выборов. Четыре недели — четыре когнитивных искажения.',
      level: 'B1+',
      weeks: [
        { n: 1, slug: 'anchoring-bias',  field: 'Психология',            title: 'Anchoring Bias',          sub: 'Эффект якоря', grammar: 'Сравнительная и превосходная степень', grammarEn: 'Comparatives & Superlatives', img: 'anchor', pos: '50% 48%' },
        { n: 2, slug: 'loss-aversion',   field: 'Поведенческая экономика', title: 'Loss Aversion',           sub: 'Неприятие потерь', grammar: 'Условные предложения 1 и 2 типа', grammarEn: 'First & Second Conditionals', img: 'loss', pos: '50% 40%' },
        { n: 3, slug: 'sunk-cost',       field: 'Психология',            title: 'The Sunk Cost Fallacy',   sub: 'Ошибка невозвратных затрат', grammar: 'Условные 3 типа, should have, I wish', grammarEn: 'Third Conditional & Regrets', img: 'sunk', pos: '50% 35%' },
        { n: 4, slug: 'decoy-effect',    field: 'Маркетинг и выбор',    title: 'The Decoy Effect',        sub: 'Эффект приманки', grammar: 'Пассивный залог', grammarEn: 'The Passive Voice', img: 'decoy', pos: '50% 55%' }
      ]
    }
  ],

  /* --- Уроки. week — номер недели программы. type: video | text | audio | interactive --- */
  lessons: [
    { id: 'anc-1', programme: 'the-art-of-decision-making', week: 1, type: 'video', minutes: 14,
      title: 'The first number wins',
      summary: 'Видеолекция: как случайное первое число влияет на наши оценки.',
      text: 'In a famous experiment, psychologists Amos Tversky and Daniel Kahneman spun a wheel of fortune that stopped at either 10 or 65. Participants were then asked to estimate the percentage of African countries in the United Nations. Those who saw 65 gave much higher estimates than those who saw 10. A completely random number had become an anchor.',
      vocab: [['to estimate','оценивать, прикидывать'],['anchor','якорь, точка отсчёта'],['participant','участник'],['random','случайный']] },
    { id: 'anc-2', programme: 'the-art-of-decision-making', week: 1, type: 'text', minutes: 10,
      title: 'Anchors in everyday life',
      summary: 'Текст для чтения: якоря в магазинах, переговорах и зарплатах.',
      text: 'Anchors are everywhere. A shop shows a "was £200, now £120" label, and the discount suddenly feels generous. In a salary negotiation, the first figure mentioned tends to shape the whole conversation. Even when we know an anchor is arbitrary, we rarely adjust far enough away from it.',
      vocab: [['discount','скидка'],['generous','щедрый'],['negotiation','переговоры'],['arbitrary','произвольный'],['to adjust','корректировать']] },
    { id: 'anc-3', programme: 'the-art-of-decision-making', week: 1, type: 'interactive', minutes: 12,
      title: 'Practice: the language of estimates',
      summary: 'Интерактивные задания на лексику недели.',
      quiz: [
        { q: 'The first figure in a negotiation often acts as an ___.', options: ['anchor','estimate','discount'], a: 0 },
        { q: 'Even when an anchor is ___, it still affects us.', options: ['generous','arbitrary','accurate'], a: 1 },
        { q: 'We rarely ___ far enough away from the anchor.', options: ['negotiate','spin','adjust'], a: 2 }
      ] },
    { id: 'loss-1', programme: 'the-art-of-decision-making', week: 2, type: 'video', minutes: 15,
      title: 'Why losing hurts more',
      summary: 'Видеолекция о теории перспектив Канемана и Тверски.',
      text: 'According to prospect theory, losses loom larger than gains. Losing one hundred pounds feels roughly twice as painful as winning one hundred pounds feels good. This asymmetry explains why we hold on to things, avoid risks that are actually in our favour, and work harder to avoid a penalty than to earn a reward.',
      vocab: [['to loom large','казаться значительным'],['gain','выигрыш, приобретение'],['asymmetry','асимметрия'],['penalty','штраф'],['in our favour','в нашу пользу']] },
    { id: 'loss-2', programme: 'the-art-of-decision-making', week: 2, type: 'audio', minutes: 9,
      title: 'Free trials and the fear of losing',
      summary: 'Аудио: как бизнес использует неприятие потерь.',
      text: 'Have you noticed how often companies offer a free trial? Once something feels like ours, giving it up registers as a loss. That is why cancelling a subscription can feel strangely difficult, and why "Don\'t miss out" is one of the most persuasive phrases in advertising.',
      vocab: [['free trial','бесплатный пробный период'],['to give up','отказаться'],['to cancel','отменять'],['persuasive','убедительный']] },
    { id: 'loss-3', programme: 'the-art-of-decision-making', week: 2, type: 'interactive', minutes: 10,
      title: 'Practice: gains and losses',
      summary: 'Задания на лексику недели.',
      quiz: [
        { q: 'According to prospect theory, losses ___ larger than gains.', options: ['loom','cancel','earn'], a: 0 },
        { q: '“Don’t miss out” is a very ___ phrase in advertising.', options: ['random','persuasive','arbitrary'], a: 1 }
      ] },
    { id: 'sunk-1', programme: 'the-art-of-decision-making', week: 3, type: 'text', minutes: 10,
      title: 'Throwing good money after bad',
      summary: 'Эссе об ошибке невозвратных затрат.',
      text: 'You have paid for a concert ticket, but on the evening you feel ill and would rather stay at home. Many people go anyway, because "the money is already spent". Economists call this the sunk cost fallacy: past investments that cannot be recovered should not influence future decisions, yet they very often do.',
      vocab: [['sunk cost','невозвратные затраты'],['fallacy','заблуждение, ошибка'],['investment','вложение'],['to recover','вернуть, возместить']] },
    { id: 'sunk-2', programme: 'the-art-of-decision-making', week: 3, type: 'audio', minutes: 8,
      title: 'Knowing when to quit',
      summary: 'Аудиоэссе: почему так трудно вовремя остановиться.',
      text: 'Quitting is often seen as a failure, but sometimes it is the wisest choice we can make. The question is not how much we have already invested, but whether the next hour, pound or year is worth it. Letting go of a sunk cost is an act of clarity, not weakness.',
      vocab: [['to quit','бросить, уйти'],['wise','мудрый'],['to let go of','отпустить'],['clarity','ясность']] },
    { id: 'sunk-3', programme: 'the-art-of-decision-making', week: 3, type: 'interactive', minutes: 10,
      title: 'Practice: letting go',
      summary: 'Задания на лексику недели.',
      quiz: [
        { q: 'Past investments that cannot be ___ should not guide our choices.', options: ['recovered','quit','loomed'], a: 0 },
        { q: 'Letting go of a sunk cost is an act of ___.', options: ['weakness','clarity','penalty'], a: 1 }
      ] },
    { id: 'decoy-1', programme: 'the-art-of-decision-making', week: 4, type: 'video', minutes: 14,
      title: 'The option nobody chooses',
      summary: 'Видеолекция об эффекте приманки на примере подписки The Economist.',
      text: 'Behavioural economist Dan Ariely described a magazine offer with three options: online only for 59 dollars, print only for 125 dollars, and print plus online for 125 dollars. Almost nobody chose print only, yet its presence made the combined offer look like a bargain. That useless middle option is the decoy.',
      vocab: [['decoy','приманка'],['option','вариант'],['bargain','выгодная покупка'],['presence','присутствие, наличие']] },
    { id: 'decoy-2', programme: 'the-art-of-decision-making', week: 4, type: 'interactive', minutes: 12,
      title: 'Final practice: the art of choosing',
      summary: 'Итоговое задание по всей программе месяца.',
      quiz: [
        { q: 'A ___ is an option designed to make another option look better.', options: ['decoy','anchor','sunk cost'], a: 0 },
        { q: 'Losses feel roughly ___ as strong as equal gains.', options: ['half','twice','ten times'], a: 1 },
        { q: 'Staying at a boring film because you paid for it is the ___ fallacy.', options: ['decoy','anchoring','sunk cost'], a: 2 }
      ] }
  ],

  /* --- Бесплатный пробный урок --- */
  /* Ссылка на бесплатный пробный урок (ProgressMe) */
  trialUrl: 'https://progressme.ru/invite/8a418ab1-80ea-4386-95fb-589c0d43bd86',

  trial: {
    title: 'Ваш выбор — действительно ваш?',
    titleEn: 'Are Your Choices Really Yours?',
    question: 'Как маркетинг влияет на наши решения и почему мы выбираем более дорогие товары?',
    intro: 'Познакомьтесь с эффектом приманки (The Decoy Effect) и изучите английский через поведенческую экономику.',
    field: 'Поведенческая экономика',
    level: 'от B1',
    duration: '5–7 минут',
    includes: ['Авторский видеоурок', '7 новых английских выражений', 'Интерактивное задание'],
    video: '', /* путь к видеофайлу урока, например 'assets/video/trial.mp4' */
    text: 'Imagine you are at the cinema, buying popcorn. A small costs three pounds and a large costs seven. You weigh up the options, and the small one makes sense. Now the cinema adds a medium for six pounds fifty. At first glance, nothing has changed — but suddenly the large stands out as a good deal and much better value for money. Many more people now buy it. The medium is a decoy: almost nobody wants it. Its only job is to make the expensive option look reasonable. Marketers use this trick everywhere, from coffee sizes to subscription plans, and most of us fall for it. So next time you choose, ask yourself: are your choices really yours?',
    vocab: [
      ['to weigh up the options', 'взвешивать варианты'],
      ['to make sense', 'иметь смысл'],
      ['at first glance', 'на первый взгляд'],
      ['to stand out', 'выделяться'],
      ['a good deal', 'выгодное предложение'],
      ['value for money', 'соотношение цены и качества'],
      ['to fall for something', 'попасться на (уловку)']
    ],
    quiz: [
      { q: 'The medium popcorn is a ___: its only job is to make the large one look better.', options: ['decoy', 'bargain', 'anchor'], a: 0 },
      { q: 'Before buying anything expensive, she likes to ___ the options.', options: ['fall for', 'weigh up', 'stand out'], a: 1 },
      { q: 'Next to the medium, the large popcorn suddenly looks like ___.', options: ['a sunk cost', 'a penalty', 'a good deal'], a: 2 },
      { q: 'Most of us ___ this marketing trick without noticing.', options: ['fall for', 'make sense', 'weigh up'], a: 0 },
      { q: 'Why do more people buy the large popcorn after the medium is added?', options: ['It becomes cheaper', 'It looks like better value for money', 'It is the only option left'], a: 1 }
    ]
  },

  /* --- ARNT Editions — книги --- */
  books: [
    { slug: 'the-quiet-mind', title: 'The Quiet Mind', sub: 'Essays on attention', year: 2026, pages: 184, price: '2 900 ₽', img: 'reading', pos: '50% 40%',
      desc: 'Сборник адаптированных эссе о внимании и тишине с параллельным глоссарием и вопросами для обсуждения. Уровень B2.' },
    { slug: 'a-grammar-of-beauty', title: 'A Grammar of Beauty', sub: 'Art in English', year: 2026, pages: 212, price: '3 200 ₽', img: 'study', pos: '50% 30%',
      desc: 'Как говорить и писать об искусстве по-английски: от описания картины до критического эссе. Уровень B2—C1.' },
    { slug: 'the-reading-room', title: 'The Reading Room', sub: 'A literary companion', year: 2025, pages: 256, price: '3 400 ₽', img: 'library', pos: '50% 50%',
      desc: 'Литературный компаньон: фрагменты классики с комментариями, историей идей и упражнениями. Уровень C1.' }
  ],

  /* --- ARNT Journal — статьи --- */
  articles: [
    { slug: 'why-we-learn-through-ideas', category: 'Method', date: '18 Nov 2026', read: 6, title: 'Why we learn through ideas, not textbooks', img: 'library', pos: '40% 40%',
      lead: 'Язык запоминается, когда он нужен для мысли. Почему содержание важнее грамматических таблиц.',
      body: ['Большинство учебников предлагают язык без смысла: диалоги в аэропорту, письма несуществующим коллегам. Мозг вежливо забывает такие тексты — они ему не нужны.', 'Когда же вы читаете о том, почему мы забываем, или о том, как искусство влияет на нейроны, язык становится инструментом мысли. Новое слово «прикреплено» к идее — и остаётся.', 'Именно поэтому каждая программа ARNT строится вокруг одной большой темы. Мы не учим английский — мы думаем на нём.'] },
    { slug: 'the-vocabulary-of-wellbeing', category: 'Wellness', date: '11 Nov 2026', read: 5, title: 'The vocabulary of wellbeing', img: 'reading', pos: '50% 70%',
      lead: 'Двадцать слов, которые помогут точнее говорить о своём состоянии.',
      body: ['Английский язык удивительно богат словами для оттенков состояния: restless, drained, content, serene.', 'Точное слово — это уже половина понимания. Когда мы можем назвать чувство, мы можем с ним работать.'] },
    { slug: 'reading-slowly', category: 'Culture', date: '4 Nov 2026', read: 7, title: 'On reading slowly', img: 'study', pos: '50% 20%',
      lead: 'Медленное чтение как практика внимания и самый недооценённый способ учить язык.',
      body: ['Медленное чтение — это не про скорость, а про глубину. Одна страница, прочитанная трижды, даёт больше, чем глава, пролистанная за минуту.', 'Попробуйте: выберите абзац, прочитайте его вслух, выпишите три слова и одну мысль. Это и есть ритуал ARNT.'] }
  ],

  /* --- Материалы библиотеки (личный кабинет) --- */
  library: [
    { title: 'Glossary: The Art of Decision-Making', kind: 'PDF', field: 'All' },
    { title: 'Essay templates for C1', kind: 'Guide', field: 'Writing' },
    { title: 'Behavioural economics reading list', kind: 'List', field: 'Psychology' },
    { title: 'Phrasal verbs of thinking', kind: 'Cards', field: 'Psychology' },
    { title: 'Describing art: 120 phrases', kind: 'PDF', field: 'Art & Culture' },
    { title: 'Slow reading worksheet', kind: 'Worksheet', field: 'Wellness' }
  ],

  /* --- Discussion Club: стартовые обсуждения --- */
  club: [
    { id: 't1', author: 'Maria K.', week: 1, title: 'Have you ever been anchored by a price?', text: 'I bought a coat because it was “70% off”. Now I am not sure it was a good deal at all. What about you?', replies: [['Ivan S.','Same here! The original price made the new one look tiny. Classic anchoring.']] },
    { id: 't2', author: 'Anna L.', week: 3, title: 'When did you decide to quit something?', text: 'Share a moment when you let go of a sunk cost. Was it hard?', replies: [] }
  ],

  /* --- Форматы обучения (тарифы) --- */
  plans: [
    { id: 'independent', n: '01', title: 'ARNT Independent', price: '2 490 ₽', per: 'в месяц · подписка', badge: 'Подписка', url: 'https://t.me/ARNT_Independent_bot', sub: 'Самостоятельное обучение', note: 'Учитесь в собственном темпе.',
      features: ['4 модуля в месяц', '4 видеоурока по 15 минут каждую неделю', 'Лексика и грамматика', 'Чтение и аудирование (Reading & Listening)', 'Интерактивные задания', 'Личный кабинет'] },
    { id: 'interactive', n: '02', title: 'ARNT Interactive', price: '6 490 ₽', per: 'в месяц · подписка', badge: 'Подписка', url: 'https://t.me/ARNT_Interactive_bot', sub: 'Обучение с разговорной практикой', note: 'Изучайте и применяйте английский в общении.', featured: true,
      features: ['Всё из ARNT Independent', 'Разговорные клубы (Speaking Clubs) — 4 встречи в месяц', '2 группы по уровню английского', 'Тематические дискуссии', 'Практика новой лексики', 'Работа над беглостью речи', 'Общение с участниками'] },
    { id: 'individual', n: '03', title: 'Индивидуальные уроки', sub: 'Один на один с Ариной Ткачевой', price: '4 500 ₽', per: 'за урок', cta: 'Записаться',
      /* ссылка для записи; пока нет отдельной — письмо на почту академии */
      url: 'mailto:arntacademy@gmail.com?subject=' + encodeURIComponent('Запись на индивидуальный урок'),
      note: 'Английский в вашем темпе и под ваши цели.',
      features: ['Урок один на один с Ариной Ткачевой', 'Программа под ваши цели и уровень', 'Оплата за каждый урок'] }
  ],

  /* --- Что вы будете развивать --- */
  skills: [
    ['Speaking', 'Говорение', 'Свободно поддерживаете разговор на тему недели и аргументируете своё мнение.'],
    ['Vocabulary', 'Словарный запас', 'Используете в речи новые выражения каждой темы, а не просто узнаёте их.'],
    ['Grammar', 'Грамматика', 'Уверенно применяете грамматику в живой речи, а не только в упражнениях.'],
    ['Listening', 'Аудирование', 'Прокачиваете понимание английской речи на слух.'],
    ['Reading', 'Чтение', 'Читаете оригинальные статьи и эссе без адаптации.'],
    ['Writing', 'Письмо', 'Ясно и грамотно излагаете мысли письменно — от комментария до эссе.']
  ],

  /* --- Направления обучения --- */
  directions: [
    { title: 'Neuroscience', ru: 'Как устроены мозг, память и внимание', img: 'study', pos: '50% 25%' },
    { title: 'Psychology', ru: 'Мышление, эмоции и поведение человека', img: 'library', pos: '30% 40%' },
    { title: 'Wellness', ru: 'Отдых, ритуалы и баланс', img: 'reading', pos: '50% 65%' },
    { title: 'Art & Culture', ru: 'Живопись, архитектура, литература и кино', img: 'library', pos: '70% 20%' },
    { title: 'Philosophy', ru: 'Большие вопросы и идеи, изменившие мир', img: 'reading', pos: '50% 20%' },
    { title: 'Business & Society', ru: 'Экономика, общество и современный мир', img: 'study', pos: '50% 70%' }
  ],

  /* --- Основатель --- */
founder: {
    name: 'Арина Ткачева',
    role: 'Основательница и руководитель обучения',
    quote: 'Я хотела создать место, где английский — не предмет, а способ мышления.',
    bio: ['Основательница ARNT Academy — синхронный переводчик и преподаватель английского языка с многолетним опытом работы со студентами.', 'Идея академии родилась из простого наблюдения: взрослые люди быстрее всего учат язык, когда им по-настоящему интересно. Поэтому в ARNT нет «тем для уровня» — есть психология, наука, искусство и культура, о которых хочется говорить.'],
    /* Путь и образование — порядок сверху вниз */
    path: [
      { place: 'Пермь', title: 'Родной город', text: 'Арина родилась в Перми.' },
      { place: 'Санкт-Петербург', title: 'НИУ ВШЭ', text: 'Высшая школа экономики, направление «Государственное управление».' },
      { place: 'Бельгия', title: 'Vlerick Business School', text: 'Программа Innovation & Entrepreneurship — инновации и предпринимательство.' },
      { place: 'Магистратура', title: 'Преподаватель английского языка', text: 'Магистерская программа по подготовке преподавателей английского языка.' },
      { place: 'США', title: 'Онлайн-обучение', text: 'Онлайн-обучение в американской школе предпринимательства.' }
    ],
    countries: 23,
    languages: 4,
    /* Фото для коллажа: положите файлы в assets/img/founder/ и перечислите здесь */
    gallery: ['5', '3', '1', '6', '2', '4'].map((n) => 'assets/img/founder/' + n + '.jpg')
  }
};
