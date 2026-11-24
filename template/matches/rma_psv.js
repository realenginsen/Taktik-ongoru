// Real Madrid vs PSV — UCL league phase MD5, 24 Nov 2026, 23:00 TSİ
window.M = {
  theme: {
    acc: '#A78BFA', danger: '#FF9F1C',
    h: { code: 'RMA', name: 'REAL MADRID', col: '#F4F6F9', colD: '#9AA3B0', ink: '#0B1C3D', textCol: '#FFFFFF', stripe: '#C9A13B',
      tok: ['#FFFFFF', '#EEF1F5', '#BFC6D0'], tokRim: '#C9A13B', tagBar: '#C9A13B', run: '#E9D7A0', trail: '#FFFFFF',
      intro: ['#DDE3EC', '#FFFFFF'], introText: '#0B1C3D', card: ['#7D8796', '#1E2533'], glow: '#F2E3B0',
      shirt: '#F7F7F7', shirtD: '#AEB6C2', trim: '#0B1C3D', numCol: '#0B1C3D', numStroke: null },
    a: { code: 'PSV', name: 'PSV', col: '#E30613', colD: '#8B0010', ink: '#FFFFFF', textCol: '#FF4D5A', stripe: '#FFFFFF',
      tok: ['#FF7A7A', '#E30613', '#9A0510'], tokRim: '#FFFFFF', tagBar: '#E30613', run: '#FF6B6B', trail: '#FF4B4B',
      intro: ['#E30613', '#A8000D'], introText: '#FFFFFF', card: ['#A3101A', '#3A0A10'], glow: '#FF8A8A',
      shirt: '#E30613', shirtD: '#7E0A10', stripes: 'rgba(245,245,245,.92)', trim: '#FFFFFF', numCol: '#111111', numStroke: 'rgba(255,255,255,.9)' }
  },
  hud: { comp: 'ŞAMPİYONLAR LİGİ · 5. HAFTA' },
  intro: { hSmall: 'REAL', hBig: 'MADRID', aSmall: '', aBig: 'PSV', strip: 'ŞAMPİYONLAR LİGİ · LİG AŞAMASI · 5. HAFTA',
    date: '24 KASIM 2026 · 23:00 TSİ', venue: 'SANTIAGO BERNABÉU · MADRİD' },
  players: {
    cou: ['COURTOIS', 'h'], val: ['VALVERDE', 'h'], kna: ['KONATÉ', 'h'], hui: ['HUIJSEN', 'h'], cuc: ['CUCURELLA', 'h'], tch: ['TCHOUAMÉNI', 'h'],
    ber: ['BERNARDO', 'h'], gul: ['GÜLER', 'h'], bel: ['BELLINGHAM', 'h'], vin: ['VINÍCIUS', 'h'], mba: ['MBAPPÉ', 'h'],
    kov: ['KOVÁŘ', 'a'], des: ['DEST', 'a'], gee: ['GEERTRUIDA', 'a'], obi: ['OBISPO', 'a'], kos: ['KOSTIĆ', 'a'], san: ['SANO', 'a'],
    mij: ['MIJNANS', 'a'], til: ['TIL', 'a'], vbo: ['VAN BOMMEL', 'a'], per: ['PERIŠIĆ', 'a'], pep: ['PEPI', 'a']
  },
  context: {
    rows: [
      { label: 'ŞL PUANI', h: 12, a: 4, hw: 1, aw: .33 },
      { label: 'ŞL GALİBİYET / 4 MAÇ', h: 4, a: 1, hw: 1, aw: .25 },
      { label: "ŞL'DE YEDİĞİ GOL", h: 7, a: 4, hw: .7, aw: .4 }
    ],
    chips: [
      { side: 'h', title: 'SERİ', body: "9 maçtır kazanıyor; ŞL'de 4'te 4" },
      { side: 'a', title: 'FORM', body: 'Eredivisie lideri; son 3 lig maçında 16 gol' },
      { side: 'h', title: 'ZAAF', body: "ŞL'de 4 maçta 7 gol yedi; Celta ve AEK karşısında geriye düştü" },
      { side: 'a', title: 'EKSİKLER', body: 'Kaptan Mauro Júnior yıl sonuna kadar yok; Pléa, Nagalo, Schouten da eksik' }
    ],
    footer: 'REKABET · 8 MAÇ · PSV TEK GALİBİYETİNİ 1971\'DE ALDI',
    caption: "Real 9 maçlık galibiyet serisiyle geliyor ama savunması sallantılı. PSV ligde gol yağdırıyor, Avrupa'da ise 4 maçta 3 gol atabildi."
  },
  lineup: {
    formH: 'REAL MADRID · 4-2-3-1', formA: 'PSV · 4-3-3',
    kickoff: {
      cou: [.5, .95], val: [.84, .80], kna: [.62, .85], hui: [.38, .85], cuc: [.16, .80], tch: [.42, .70], ber: [.60, .70],
      gul: [.84, .60], bel: [.5, .62], vin: [.16, .60], mba: [.5, .54],
      kov: [.5, .05], des: [.16, .20], gee: [.38, .15], obi: [.62, .15], kos: [.84, .20], san: [.5, .27], mij: [.36, .33], til: [.64, .33],
      vbo: [.18, .42], per: [.82, .42], pep: [.5, .46]
    },
    caption: "İspanyol basını Real'de Konaté–Huijsen ve sağda Güler'i, Hollanda basını PSV'de Til'in orta sahaya çekilip Pepi'nin forvete dönmesini bekliyor. Şüpheli: Real stoperleri, PSV'de Pepi/N. Fernández."
  },
  cards: [
    { name: 'VINÍCIUS JR', side: 'h', role: 'REAL MADRID · SOL KANAT', line: "Dest'in arkasındaki alan onun. Celta'ya karşı oyuna girip maçı değiştirdi.",
      fig: { shirtName: 'VINI JR.', num: '7', skin: '#6B4630', skinD: '#4E3222', hair: '#141010', hairL: '#2B211C', hairCover: .45, curly: true } },
    { name: 'MBAPPÉ', side: 'h', role: 'REAL MADRID · SANTRFOR', line: "ŞL'de oynadığı 4 maçın hepsinde gol attı.",
      fig: { shirtName: 'MBAPPÉ', num: '10', skin: '#7A5038', skinD: '#5B3A28', hair: '#4A3020', hairL: '#62412C', hairCover: .28 } },
    { name: 'DEST', side: 'a', role: 'PSV · SAĞ BEK', line: "Yüksek çizginin sağ ucu; Vinícius'la baş başa kalacak.",
      fig: { shirtName: 'DEST', num: '8', skin: '#A9785A', skinD: '#855C43', hair: '#1C1410', hairL: '#34271F', hairCover: .48, curly: true } },
    { name: 'PERIŠIĆ', side: 'a', role: 'PSV · SOL KANAT', line: '37 yaşında hâlâ orta ustası; Kostić ile sol kanadı taşıyor.',
      fig: { shirtName: 'PERIŠIĆ', num: '5', skin: '#EAC3A6', skinD: '#C79A7C', hair: '#3A2A1E', hairL: '#57402E', hairCover: .5 } }
  ],
  cardsCaption: "Real'de Vinícius ve Mbappé'nin hızı, PSV'de Dest'in savunması ve Perišić'in ortaları maçı belirleyecek.",
  scen: [],
  pred: {
    consensusLabel: 'BASIN TAHMİNLERİ', consensus: 'ÇOĞUNLUK 3-1 REAL · AYKIRI TAHMİN 4-2',
    main: { tag: 'ANA SENARYO', score: '3 – 1', text: "PSV'nin yüksek çizgisi Vinícius ve Mbappé'nin koşularına alan bırakır. PSV'nin golü sol kanattan bir ortayla gelir." },
    alt: { tag: 'ALTERNATİF', score: '2 – 2', text: "PSV erken golü bulursa maç açılır. Real bu sezon yine geri dönebilir ama savunmadaki boşluklar beraberliğe kapı aralar." },
    breakLabel: "KIRILMA NOKTASI: PSV'NİN İLK PRESİ KIRILDIĞINDA", breakMin: null
  }
};

// ---- Scenario 1: PSV's high press & high line -> space behind (Real's weapon)
M.scen.push({
  base: { cou: [.5, .92], kna: [.64, .84], hui: [.36, .84], val: [.88, .72], cuc: [.12, .72], tch: [.45, .72], ber: [.58, .70], bel: [.5, .58], gul: [.86, .52], vin: [.14, .52], mba: [.5, .46],
    pep: [.44, .76], til: [.62, .74], mij: [.47, .64], san: [.56, .60], vbo: [.16, .64], per: [.84, .64], des: [.16, .48], kos: [.84, .48], gee: [.40, .44], obi: [.60, .44], kov: [.5, .22] },
  moves: [[0.6, 1.3, 'pep', [.39, .80]], [0.8, 1.4, 'bel', [.45, .66]], [1.0, 1.6, 'san', [.48, .62]],
    [2.0, 3.0, 'vin', [.22, .29]], [2.2, 3.6, 'des', [.22, .34]], [2.6, 3.6, 'gee', [.34, .32]], [3.0, 4.0, 'vin', [.30, .16]],
    [2.4, 4.0, 'mba', [.48, .14]], [2.6, 4.2, 'obi', [.54, .19]], [4.0, 4.6, 'kov', [.42, .08]], [2.4, 3.8, 'kos', [.70, .34]]],
  ball: [[0, 'cou'], [0.6, 'cou'], [1.1, 'hui'], [1.4, 'hui'], [1.8, 'bel'], [2.1, 'bel'], [3.0, [.22, .30], { h: 3 }], [3.05, 'vin'], [4.0, 'vin'], [4.5, 'mba'], [4.8, 'mba'], [5.1, [.47, -.005]]],
  lines: [[0.2, 2.6, ['gee', 'obi', 'des', 'kos'], 'PSV SAVUNMA ÇİZGİSİ']],
  zones: [[0.8, 3.2, [.36, .30, 'acc'], .26, .10, 'BOŞLUK']],
  runs: [['vin', 2.0, 3.0, 'run'], ['mba', 2.4, 4.0, 'run'], ['vin', 3.0, 4.0, 'drib']],
  hls: [[1.4, 2.3, 'bel'], [2.0, 9, 'vin'], [4.0, 9, 'mba']],
  flashes: [[1.75, 2.6, 'PRES KIRILDI', 'acc', 'HUIJSEN → BELLINGHAM'], [5.3, 7.0, 'GOL FIRSATI', 'acc', 'VINÍCIUS → MBAPPÉ']],
  cam: [[0, { x: .45, y: .62, dist: 82, el: 56, yaw: -6 }], [2.0, { x: .32, y: .42, dist: 76, el: 52, yaw: -12 }], [3.6, { x: .30, y: .24, dist: 56, el: 46, yaw: -14 }],
    [5.0, { x: .42, y: .14, dist: 48, el: 42, yaw: -6 }], [8.5, { x: .42, y: .18, dist: 58, el: 46, yaw: -8 }]],
  kicker: "SENARYO 1 · REAL'İN SİLAHI", title: "PSV'NİN PRESİ VE ARKASINDAKİ BOŞLUK",
  cap: "Bosz'un PSV'si önde adam adama baskı yapar, savunma çizgisi yüksektir. İlk pres kırıldığında Vinícius Dest'in arkasına, Mbappé iki stoperin arasına koşar."
});

// ---- Scenario 2: no Mauro Júnior -> pocket between the lines
M.scen.push({
  base: { cou: [.5, .86], val: [.80, .55], kna: [.62, .66], hui: [.38, .66], cuc: [.20, .55], tch: [.45, .50], ber: [.58, .48], bel: [.40, .34], gul: [.86, .32], vin: [.12, .30], mba: [.50, .24],
    kov: [.5, .04], des: [.16, .18], gee: [.40, .15], obi: [.60, .15], kos: [.84, .18], san: [.50, .27], mij: [.40, .33], til: [.62, .33], vbo: [.18, .38], per: [.82, .38], pep: [.50, .44] },
  moves: [[0.6, 1.6, 'gul', [.66, .26]], [0.8, 1.6, 'til', [.58, .38]], [1.0, 1.8, 'mij', [.44, .37]], [1.6, 2.4, 'san', [.60, .23]],
    [1.8, 3.2, 'val', [.88, .26]], [2.0, 3.2, 'kos', [.86, .20]], [2.2, 3.6, 'mba', [.70, .12]], [2.4, 3.6, 'obi', [.66, .12]], [3.6, 4.4, 'kov', [.60, .06]]],
  ball: [[0, 'tch'], [0.6, 'tch'], [1.1, 'ber'], [1.5, 'ber'], [2.0, 'gul'], [2.6, 'gul'], [3.3, 'mba'], [3.9, 'mba'], [4.3, [.45, -.005]]],
  zones: [[0.4, 2.6, [.62, .29, 'acc'], .09, .055, 'ARA BOŞLUK']],
  runs: [['gul', 0.6, 1.6, 'run'], ['mba', 2.2, 3.6, 'run'], ['val', 1.8, 3.2, 'run']],
  hls: [[0.6, 9, 'gul'], [2.2, 9, 'mba'], [1.6, 2.4, 'san']],
  flashes: [[2.0, 2.9, 'ÇİZGİLER ARASI', 'acc', 'GÜLER BOŞLUKTA'], [4.5, 6.2, 'GOL FIRSATI', 'acc', 'GÜLER → MBAPPÉ']],
  cam: [[0, { x: .55, y: .38, dist: 72, el: 54, yaw: 6 }], [2.0, { x: .62, y: .28, dist: 60, el: 50, yaw: 10 }], [3.6, { x: .62, y: .16, dist: 52, el: 46, yaw: 10 }], [8.5, { x: .58, y: .20, dist: 60, el: 48, yaw: 6 }]],
  kicker: 'SENARYO 2 · PSV\'NİN AÇIĞI', title: "MAURO JÚNIOR'SUZ ORTA SAHA",
  cap: "Kaptan Mauro Júnior yok, Sano'nun yanında yeni bir ikili oynayacak. Güler sağdan içeri kayıp çizgiler arasında topu alırsa Mbappé'nin koşusu açılır."
});

// ---- Scenario 3: PSV's answer — left-side overload & far-post cross (Real's weakness)
M.scen.push({
  base: { kov: [.5, .10], gee: [.40, .40], obi: [.62, .40], des: [.20, .52], san: [.50, .50], mij: [.40, .58], til: [.60, .60], kos: [.80, .56], per: [.84, .66], vbo: [.20, .72], pep: [.50, .74],
    cou: [.5, .95], val: [.80, .80], kna: [.60, .84], hui: [.42, .84], cuc: [.22, .80], tch: [.50, .74], ber: [.62, .70], bel: [.42, .62], gul: [.80, .64], vin: [.22, .60], mba: [.50, .48] },
  moves: [[0.4, 1.4, 'per', [.72, .74]], [0.6, 1.6, 'val', [.74, .80]], [1.0, 2.6, 'kos', [.92, .82]], [1.2, 2.4, 'gul', [.86, .72]],
    [2.4, 3.6, 'til', [.38, .88]], [2.4, 3.4, 'pep', [.56, .88]], [2.6, 3.4, 'kna', [.58, .88]], [2.6, 3.4, 'hui', [.47, .89]], [2.6, 3.6, 'cuc', [.30, .86]], [3.4, 4.0, 'cou', [.48, .93]]],
  ball: [[0, 'san'], [0.6, 'san'], [1.2, 'per'], [1.8, 'per'], [2.4, 'kos'], [2.8, 'kos'], [3.5, [.38, .885], { h: 3 }], [3.65, [.38, .885]], [4.0, [.45, .995], { h: .5 }]],
  zones: [[1.8, 6, [.36, .89, 'danger'], .06, .035, 'ARKA DİREK']],
  runs: [['per', 0.4, 1.4, 'run'], ['kos', 1.0, 2.6, 'run'], ['til', 2.4, 3.6, 'run']],
  hls: [[1.0, 9, 'kos'], [2.4, 9, 'til'], [0.6, 2.4, 'val']],
  flashes: [[1.2, 2.1, "SOL KANATTA 2'YE 1", 'danger', 'KOSTIĆ + PERIŠIĆ'], [4.3, 6.0, 'ARKA DİREK TEHLİKESİ', 'danger', 'KOSTIĆ → TIL']],
  goldAfter: 2.7,
  cam: [[0, { x: .66, y: .62, dist: 70, el: 52, yaw: 10 }], [1.6, { x: .74, y: .72, dist: 60, el: 48, yaw: 14 }], [3.0, { x: .52, y: .84, dist: 54, el: 46, yaw: 6 }], [8.5, { x: .52, y: .82, dist: 62, el: 50, yaw: 6 }]],
  kicker: "SENARYO 3 · PSV'NİN CEVABI", title: 'SOL KANAT VE ARKA DİREK',
  cap: "Real'in zaafı: ŞL'de 4 maçta 7 gol yedi ve hava toplarında zorlanıyor. Kostić'in bindirmesi ve Perišić'in içeri kat edişi, arka direkte Til'i bulabilir."
});
