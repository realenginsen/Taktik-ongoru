// Feyenoord vs Ajax — Eredivisie 2026-27, 14. hafta (De Klassieker), 29 Nov 2026, 16:30 TSİ
window.M = {
  theme: {
    acc: '#2EE6D6', danger: '#FFB020',
    h: { code: 'FEY', name: 'FEYENOORD', col: '#E1001A', colD: '#8E0A12', ink: '#FFFFFF', textCol: '#FF5A64', stripe: '#FFFFFF',
      tok: ['#FF8A8A', '#E1001A', '#9B0A10'], tokRim: '#FFFFFF', tagBar: '#E1001A', run: '#FF6B6B', trail: '#FF4B4B',
      intro: ['#7A0008', '#E1001A'], introText: '#FFFFFF', card: ['#A3101A', '#3A0A10'], glow: '#FF8A8A',
      shirt: '#E1001A', shirtD: '#7E0A10', trim: '#111111', numCol: '#FFFFFF', numStroke: 'rgba(0,0,0,.55)', sleeves: '#F4F4F4' },
    a: { code: 'AJA', name: 'AJAX', col: '#F4F6F9', colD: '#9AA3B0', ink: '#B5001A', textCol: '#FFFFFF', stripe: '#D2122E',
      tok: ['#FFFFFF', '#EEF1F5', '#BFC6D0'], tokRim: '#D2122E', tagBar: '#D2122E', run: '#F5C2C7', trail: '#FFFFFF',
      intro: ['#DDE3EC', '#FFFFFF'], introText: '#B5001A', card: ['#7D8796', '#1E2533'], glow: '#FFD6DA',
      shirt: '#F7F7F7', shirtD: '#AEB6C2', trim: '#D2122E', numCol: '#D2122E', numStroke: null }
  },
  hud: { comp: 'EREDİVİSİE · 14. HAFTA' },
  intro: { hSmall: '', hBig: 'FEYENOORD', aSmall: '', aBig: 'AJAX', strip: 'EREDİVİSİE · 14. HAFTA · DE KLASSIEKER',
    date: '29 KASIM 2026 · 16:30 TSİ', venue: 'DE KUIP · ROTTERDAM' },
  players: {
    kas: ['KASTENMEIER', 'h'], rea: ['READ', 'h'], kra: ['KRAAIJEVELD', 'h'], mar: ['MÁRMOL', 'h'], lop: ['J. LÓPEZ', 'h'], van: ['VANHOUTTE', 'h'],
    tar: ['TARGHALLINE', 'h'], zec: ['ZECHIËL', 'h'], had: ['HADJ MOUSSA', 'h'], fer: ['FERRI', 'h'], val: ['VALENTE', 'h'],
    tst: ['TER STEGEN', 'a'], ros: ['ROSA', 'a'], bou: ['BOUWMAN', 'a'], baa: ['BAAS', 'a'], wij: ['WIJNDAL', 'a'], amr: ['AMRABAT', 'a'],
    kla: ['KLAASSEN', 'a'], bra: ['BRANDT', 'a'], bnd: ['BOUNIDA', 'a'], tol: ['TOLU', 'a'], glo: ['GLOUKH', 'a']
  },
  context: {
    rows: [
      { label: 'LİG SIRASI', h: 5, a: 2, hw: .55, aw: .9, suffix: '.' },
      { label: 'PUAN', h: 25, a: 28, hw: .89, aw: 1 },
      { label: 'YEDİĞİ GOL', h: 20, a: 15, hw: 1, aw: .75 }
    ],
    chips: [
      { side: 'h', title: 'KRİZ', body: 'Tüm kulvarlarda 7 maçtır kazanamıyor; son 5 lig maçında 13 gol yedi' },
      { side: 'a', title: 'FORM', body: 'Son 6 maçta 5 galibiyet, 1 beraberlik; deplasmanda 6 lig maçının 5\'ini kazandı' },
      { side: 'h', title: 'EKSİKLER', body: 'Bos, Beelen, Nieuwkoop, St. Juste ve Wessels yok; Watanabe döndü' },
      { side: 'a', title: 'EKSİKLER', body: "Mokio (kırık) ve Dolberg (diz) yok; Brandt'ın 90 dakikası şüpheli" }
    ],
    footer: 'SON 5 KLASİK · AJAX 3 · BERABERLİK 1 · FEYENOORD 1 (6-0, NİSAN 2024)',
    caption: "Ligin 2.'si ile 5.'si arasında 3 puan var. Feyenoord krizde, Ajax formda ama pres yoğunluğu düşük ve sol kanadı açık veriyor."
  },
  lineup: {
    formH: 'FEYENOORD · 4-3-3', formA: 'AJAX · 4-3-3',
    kickoff: {
      kas: [.5, .95], rea: [.84, .80], kra: [.62, .85], mar: [.38, .85], lop: [.16, .80], van: [.5, .71], tar: [.35, .65], zec: [.65, .63],
      had: [.84, .56], fer: [.5, .54], val: [.16, .56],
      tst: [.5, .05], ros: [.16, .20], bou: [.38, .15], baa: [.62, .15], wij: [.84, .20], amr: [.5, .28], kla: [.35, .34], bra: [.65, .34],
      bnd: [.16, .43], tol: [.5, .46], glo: [.84, .43]
    },
    caption: "Hollanda basınının (VI, Voetbalzone, Voetbalprimeur, 1908.nl) çoğunluğu. Şüpheli: Feyenoord'da kale (Kastenmeier/Ernst), sol bek (López/Watanabe), forvet (Ferri/Van Persie); Ajax'ta sağ kanat (Bounida/Klaassen/Berghuis) ve Brandt'ın ilk 11'i."
  },
  cards: [
    { name: 'HADJ MOUSSA', side: 'h', role: 'FEYENOORD · SAĞ KANAT', line: "Ligin ortak gol kralı. Wijndal'ın arkasındaki alan onun.",
      fig: { shirtName: 'HADJ MOUSSA', num: '23', skin: '#B07E5C', skinD: '#8A5F43', hair: '#141010', hairL: '#2B211C', hairCover: .45, curly: true } },
    { name: 'FERRI', side: 'h', role: 'FEYENOORD · SANTRFOR', line: 'Ligde 7 gol, 3 asist. İlk 11 için Van Persie ile yarışıyor.',
      fig: { shirtName: 'FERRI', num: '19', skin: '#D8AE8E', skinD: '#B48A6C', hair: '#3A2A1E', hairL: '#57402E', hairCover: .5 } },
    { name: 'TOLU', side: 'a', role: 'AJAX · SANTRFOR', line: "AZ'yi kafayla yıktı; Twente ve Midtjylland'a da kafa golü attı.",
      fig: { shirtName: 'TOLU', num: '99', skin: '#5A3A28', skinD: '#3F281B', hair: '#0E0B0A', hairL: '#221A16', hairCover: .3 } },
    { name: 'GLOUKH', side: 'a', role: 'AJAX · SOL KANAT', line: 'Eredivisie asist lideri: 7. Ortaları ve duran topları Tolu\'yu arıyor.',
      fig: { shirtName: 'GLOUKH', num: '10', skin: '#D9B08F', skinD: '#B58C6D', hair: '#2E2018', hairL: '#4A3628', hairCover: .48 } }
  ],
  cardsCaption: "Feyenoord'da Hadj Moussa'nın sağ kanadı ve Ferri'nin bitiriciliği, Ajax'ta Gloukh–Tolu ikilisinin ortaları maçı belirleyecek.",
  scen: [],
  pred: {
    consensusLabel: 'BASIN TAHMİNLERİ', consensus: 'ÇOĞUNLUK 1-2 AJAX · xGENIUS MODELİ 2-1 FEYENOORD',
    main: { tag: 'ANA SENARYO', score: '1 – 2', text: "Ajax ilk baskıyı atlatır; gollerini Feyenoord'un top kayıplarından ve bir duran toptan bulur. Feyenoord'un golü sağ kanattan, Wijndal'ın arkasından gelir." },
    alt: { tag: 'ALTERNATİF', score: '2 – 1', text: "Feyenoord, Excelsior ve Heerenveen'e karşı ilk dakikalarda gol buldu. Erken gol gelirse Ajax'ın düşük presi cezalandırılır, De Kuip maçı taşır." },
    breakLabel: "KIRILMA NOKTASI: FEYENOORD'UN İLK TOP KAYBI", breakMin: null
  }
};

// ---- Scenario 1: space behind Wijndal (Ajax left side) -> Feyenoord's right-side transition
M.scen.push({
  base: { tst: [.5, .06], ros: [.16, .40], bou: [.40, .30], baa: [.62, .32], wij: [.86, .60], amr: [.52, .46], kla: [.36, .56], bra: [.64, .58], bnd: [.20, .66], tol: [.48, .70], glo: [.76, .66],
    kas: [.5, .94], rea: [.84, .80], kra: [.60, .84], mar: [.40, .84], lop: [.16, .80], van: [.56, .72], tar: [.42, .74], zec: [.66, .62], had: [.86, .50], fer: [.50, .50], val: [.18, .52] },
  moves: [[0.3, 1.0, 'zec', [.75, .63]], [1.2, 2.4, 'had', [.84, .32]], [2.4, 3.4, 'had', [.80, .16]], [1.4, 3.4, 'wij', [.84, .40]],
    [1.6, 3.4, 'fer', [.56, .15]], [2.0, 3.4, 'baa', [.70, .17]], [2.2, 3.6, 'bou', [.46, .11]], [1.4, 3.2, 'amr', [.58, .36]], [1.6, 3.2, 'rea', [.88, .58]], [3.4, 4.0, 'tst', [.52, .05]]],
  ball: [[0, 'glo'], [0.5, 'glo'], [1.0, [.75, .63]], [1.05, 'zec'], [1.4, 'zec'], [2.4, [.84, .32]], [2.45, 'had'], [3.4, 'had'], [3.8, 'fer'], [4.0, 'fer'], [4.3, [.47, -.005]]],
  lines: [[1.4, 3.0, ['ros', 'bou', 'baa', 'wij'], 'AJAX SAVUNMA ÇİZGİSİ']],
  zones: [[1.0, 3.0, [.84, .33, 'acc'], .10, .13, "WIJNDAL'IN ARKASI"]],
  runs: [['had', 1.2, 2.4, 'run'], ['had', 2.4, 3.4, 'drib'], ['fer', 1.6, 3.4, 'run'], ['rea', 1.6, 3.2, 'run']],
  hls: [[0.3, 1.6, 'zec'], [1.2, 9, 'had'], [3.4, 9, 'fer']],
  flashes: [[1.1, 2.0, 'TOP KAZANILDI', 'acc', 'ZECHIËL ARAYA GİRDİ'], [4.4, 6.0, 'GOL FIRSATI', 'acc', 'HADJ MOUSSA → FERRI']],
  cam: [[0, { x: .66, y: .58, dist: 80, el: 56, yaw: 8 }], [1.4, { x: .76, y: .44, dist: 70, el: 52, yaw: 12 }], [3.0, { x: .70, y: .22, dist: 56, el: 46, yaw: 12 }],
    [4.4, { x: .62, y: .16, dist: 56, el: 46, yaw: 6 }], [8.5, { x: .62, y: .20, dist: 64, el: 50, yaw: 6 }]],
  kicker: "SENARYO 1 · FEYENOORD'UN SİLAHI", title: "WIJNDAL'IN ARKASINDAKİ ALAN",
  cap: "FR-Fans verisine göre Ajax'ın açık oyunda verdiği pozisyonların %36,3'ü sol kanadından geliyor. Wijndal ileri çıktığında top kazanılırsa Hadj Moussa arkaya koşar, Ferri ceza sahasında bekler."
});

// ---- Scenario 2: Feyenoord build-up turnover -> Ajax counter behind the high line
M.scen.push({
  base: { kas: [.5, .86], rea: [.86, .44], kra: [.62, .56], mar: [.38, .56], lop: [.14, .46], van: [.50, .48], tar: [.36, .40], zec: [.62, .34], had: [.84, .26], fer: [.50, .20], val: [.22, .30],
    tst: [.5, .05], ros: [.18, .22], bou: [.40, .15], baa: [.60, .15], wij: [.82, .20], amr: [.48, .28], bra: [.62, .40], kla: [.36, .44], bnd: [.24, .37], tol: [.50, .62], glo: [.76, .54] },
  moves: [[0.6, 1.3, 'bnd', [.23, .315]], [1.0, 2.0, 'kla', [.38, .50]], [2.2, 3.0, 'tol', [.56, .78]], [3.0, 3.8, 'tol', [.54, .86]],
    [2.2, 3.6, 'kra', [.62, .76]], [2.2, 3.6, 'mar', [.45, .79]], [2.0, 3.6, 'glo', [.74, .80]], [3.2, 3.8, 'kas', [.50, .90]], [1.4, 2.6, 'van', [.44, .56]], [1.4, 2.8, 'val', [.28, .40]]],
  ball: [[0, 'tar'], [0.4, 'tar'], [0.9, 'val'], [1.25, 'val'], [1.35, 'bnd'], [1.7, 'bnd'], [2.1, 'kla'], [2.4, 'kla'], [3.0, [.56, .78]], [3.05, 'tol'], [3.9, 'tol'], [4.2, [.53, 1.005]]],
  lines: [[0.2, 2.4, ['lop', 'mar', 'kra', 'rea'], 'FEYENOORD SAVUNMA ÇİZGİSİ']],
  zones: [[1.6, 3.2, [.52, .72, 'danger'], .18, .09, 'ÇİZGİ ARKASI']],
  runs: [['bnd', 0.6, 1.3, 'run'], ['tol', 2.2, 3.0, 'run'], ['tol', 3.0, 3.8, 'drib'], ['glo', 2.0, 3.6, 'run']],
  hls: [[0.6, 1.8, 'bnd'], [1.8, 2.8, 'kla'], [2.2, 9, 'tol']],
  flashes: [[1.3, 2.2, 'TOP KAYBI', 'danger', 'BOUNIDA PRESİ'], [4.3, 6.0, 'GOL FIRSATI', 'danger', 'KLAASSEN → TOLU']],
  cam: [[0, { x: .36, y: .36, dist: 72, el: 54, yaw: -8 }], [1.6, { x: .42, y: .50, dist: 76, el: 52, yaw: -4 }], [3.0, { x: .52, y: .74, dist: 60, el: 48, yaw: 0 }],
    [4.2, { x: .52, y: .84, dist: 52, el: 46, yaw: 0 }], [8.5, { x: .52, y: .80, dist: 62, el: 50, yaw: 0 }]],
  kicker: "SENARYO 2 · AJAX'IN SİLAHI", title: 'TOP KAYBI VE HIZLI ÇIKIŞ',
  cap: "Feyenoord, Excelsior'a yenildiği maçta ilk golü Valente'nin top kaybının ardından gelen ara pasla yedi. Ajax, Thun'a karşı da iki golü top kazanıp hızlı çıkarak buldu."
});

// ---- Scenario 3: Ajax corner -> Tolu in the air (Feyenoord concede from corners)
M.scen.push({
  base: { kas: [.50, .975], kra: [.47, .915], mar: [.58, .92], rea: [.38, .935], lop: [.66, .955], van: [.56, .865], tar: [.30, .84], zec: [.72, .84], val: [.22, .74], had: [.80, .74], fer: [.50, .76],
    glo: [.985, .99], tol: [.46, .86], bou: [.58, .84], baa: [.40, .85], kla: [.68, .89], bra: [.64, .76], amr: [.40, .70], bnd: [.30, .91], ros: [.26, .62], wij: [.76, .62], tst: [.5, .10] },
  moves: [[0.6, 1.6, 'tol', [.48, .905]], [0.6, 1.6, 'kra', [.495, .925]], [0.6, 1.4, 'baa', [.40, .91]], [0.6, 1.4, 'bou', [.60, .95]], [0.6, 1.4, 'mar', [.61, .925]],
    [0.6, 1.5, 'kla', [.70, .965]], [0.8, 1.6, 'bnd', [.30, .95]], [1.6, 2.2, 'kas', [.46, .985]]],
  ball: [[0, 'glo'], [0.8, 'glo'], [1.7, [.48, .905], { h: 4 }], [1.75, [.48, .905], { h: 2 }], [2.1, [.43, 1.005], { h: 1 }]],
  zones: [[0.6, 3.6, [.48, .905, 'danger'], .07, .035]],
  runs: [['tol', 0.6, 1.6, 'run'], ['bou', 0.6, 1.4, 'run']],
  hls: [[0, 1.0, 'glo'], [0.6, 9, 'tol']],
  flashes: [[0.9, 1.8, 'KORNER', 'danger', 'GLOUKH ORTASI'], [2.3, 4.0, 'KAFA VURUŞU', 'danger', 'TOLU']],
  goldAfter: 2.2,
  cam: [[0, { x: .66, y: .84, dist: 58, el: 62, yaw: 10 }], [1.2, { x: .56, y: .85, dist: 48, el: 64, yaw: 6 }], [2.2, { x: .50, y: .86, dist: 44, el: 64, yaw: 4 }], [8.5, { x: .52, y: .85, dist: 52, el: 64, yaw: 4 }]],
  kicker: "SENARYO 3 · DURAN TOP", title: 'KORNER VE TOLU',
  cap: "Feyenoord hem Excelsior hem Heerenveen maçında kornerden gol yedi. Ajax'ta Gloukh ligin asist lideri, Tolu ise Midtjylland'a kornerden, AZ'ye ortadan kafayla attı."
});
