// Sabah vs Barcelona — UCL league phase MD5, 25 Nov 2026, 20:45 TSİ (18:45 CET), Baku Olympic Stadium
window.M = {
  theme: {
    acc: '#2EE6D6', danger: '#FF9F1C',
    h: { code: 'SAB', name: 'SABAH', col: '#E8338A', colD: '#7A1849', ink: '#0B0B0F', textCol: '#FF6FB5', stripe: '#111114',
      tok: ['#5A5A64', '#2A2A31', '#111115'], tokRim: '#FF4FA3', tagBar: '#E8338A', run: '#FF7DBE', trail: '#FF5FAE',
      intro: ['#17171C', '#2B2B33'], introText: '#FF6FB5', card: ['#3A2A33', '#121015'], glow: '#FF9ACB',
      shirt: '#1C1C21', shirtD: '#0A0A0D', trim: '#FF4FA3', numCol: '#FF4FA3', numStroke: null },
    a: { code: 'BAR', name: 'BARCELONA', col: '#A50044', colD: '#4E0020', ink: '#FFFFFF', textCol: '#6FA8FF', stripe: '#EDBB00',
      tok: ['#C8406F', '#A50044', '#5E0027'], tokRim: '#2F7BE0', tagBar: '#004D98', run: '#7FB0FF', trail: '#5A9BFF',
      intro: ['#004D98', '#A50044'], introText: '#FFFFFF', card: ['#1F3E78', '#2A0A18'], glow: '#9CC2FF',
      shirt: '#A50044', shirtD: '#5E0027', stripes: 'rgba(0,77,152,.95)', trim: '#EDBB00', numCol: '#EDBB00', numStroke: null }
  },
  hud: { comp: 'ŞAMPİYONLAR LİGİ · 5. HAFTA' },
  intro: { hSmall: '', hBig: 'SABAH', aSmall: '', aBig: 'BARCELONA', strip: 'ŞAMPİYONLAR LİGİ · LİG AŞAMASI · 5. HAFTA',
    date: '25 KASIM 2026 · 20:45 TSİ', venue: 'BAKÜ OLİMPİYAT STADYUMU' },
  players: {
    pok: ['POKATILOV', 'h'], zed: ['ZEDADKA', 'h'], sol: ['SOLVET', 'h'], alm: ['ALMEIDA', 'h'], puc: ['PUCHACZ', 'h'], lep: ['LEPINJICA', 'h'],
    rak: ['RAKHMONALIEV', 'h'], isa: ['ISAYEV', 'h'], sev: ['SEVERINA', 'h'], mic: ['MICKELS', 'h'], mbi: ['MBINA', 'h'],
    jga: ['J. GARCÍA', 'a'], kou: ['KOUNDÉ', 'a'], cub: ['CUBARSÍ', 'a'], gma: ['G. MARTÍN', 'a'], can: ['CANCELO', 'a'], ber: ['BERNAL', 'a'],
    ped: ['PEDRI', 'a'], fer: ['FERMÍN', 'a'], ade: ['ADEYEMI', 'a'], gor: ['GORDON', 'a'], rap: ['RAPHINHA', 'a']
  },
  context: {
    rows: [
      { label: 'ŞL SIRASI', h: 31, a: 5, hw: .15, aw: .9, suffix: '.' },
      { label: 'ŞL PUANI', h: 3, a: 9, hw: .33, aw: 1 },
      { label: "ŞL'DE ATTIĞI GOL", h: 4, a: 14, hw: .29, aw: 1 }
    ],
    chips: [
      { side: 'h', title: 'FORM', body: "Ligde Sumqayıt'ı 5-1 yendi; öncesinde 5 maç galibiyetsizdi" },
      { side: 'a', title: 'FORM', body: 'La Liga lideri (36 puan); son 4 maçı kazandı' },
      { side: 'h', title: 'EKSİKLER', body: "Stoper McCarthy cezalı: Dortmund'a golü atan isim" },
      { side: 'a', title: 'EKSİKLER', body: "Lamine Yamal Bakü'ye gitmedi; Rodri ve Christensen sakat" }
    ],
    footer: 'İLK RESMÎ KARŞILAŞMA · SABAH İLK ŞL SEZONUNDA',
    caption: "La Liga lideri Barça, Lamine Yamal'sız ve rotasyonlu bir kadroyla Bakü'de. Sabah ŞL'deki tek galibiyetini bu statta Slavia Prag'a karşı aldı."
  },
  lineup: {
    formH: 'SABAH · 4-3-3', formA: 'BARCELONA · 4-3-3',
    kickoff: {
      pok: [.5, .95], zed: [.84, .80], sol: [.62, .85], alm: [.38, .85], puc: [.16, .80], lep: [.5, .73], rak: [.64, .66], isa: [.36, .66],
      sev: [.84, .57], mic: [.16, .57], mbi: [.5, .54],
      jga: [.5, .05], kou: [.16, .20], cub: [.38, .15], gma: [.62, .15], can: [.84, .20], ber: [.5, .27], fer: [.36, .34], ped: [.64, .34],
      ade: [.18, .42], gor: [.82, .42], rap: [.5, .46]
    },
    caption: "İspanyol basını Barça'da 4-3-3 ve sahte 9 Raphinha'yı, Azerbaycan basını Sabah'ta 4-3-3'ü bekliyor. Şüpheli: Barça'da sağ bek, pivot ve forvet; Sabah'ta Isayev ve Severina."
  },
  cards: [
    { name: 'FERMÍN', side: 'a', role: 'BARCELONA · ORTA SAHA', line: 'Son 2 lig maçında 4 gol. Ceza sahasına geç giren koşucu.',
      fig: { shirtName: 'FERMÍN', num: '7', skin: '#D9A782', skinD: '#B3825F', hair: '#1E1612', hairL: '#3A2B21', hairCover: .48 } },
    { name: 'RAPHINHA', side: 'a', role: 'BARCELONA · SAHTE 9', line: "Lamine yokken hücumun lideri. Aston Villa'ya 2 gol attı.",
      fig: { shirtName: 'RAPHINHA', num: '11', skin: '#B07A55', skinD: '#8A5C3E', hair: '#1A1310', hairL: '#33261D', hairCover: .44, curly: true } },
    { name: 'MICKELS', side: 'h', role: 'SABAH · SOL KANAT', line: 'Sezonda 12 gol, 5\'i Avrupa\'da. Kontraların ucu.',
      fig: { shirtName: 'MICKELS', num: '20', skin: '#5E3B29', skinD: '#45291C', hair: '#121010', hairL: '#2A2220', hairCover: .40, curly: true } },
    { name: 'PUCHACZ', side: 'h', role: 'SABAH · SOL BEK', line: "Duran topların sahibi. Dortmund'a golün asisti onun serbest vuruşu.",
      fig: { shirtName: 'PUCHACZ', num: '27', skin: '#EBC2A4', skinD: '#C99878', hair: '#6B4E32', hairL: '#8A6A48', hairCover: .5 } }
  ],
  cardsCaption: "Barça'da Fermín ve Raphinha, Sabah'ta Mickels'in hızı ve Puchacz'ın duran topları maçı belirleyebilir.",
  scen: [],
  pred: {
    consensusLabel: 'OPTA SÜPER BİLGİSAYARI: BARÇA KAZANIR %81,2', consensus: 'BASIN TAHMİNLERİ · 1-3 · 1-4 · 0-4 · 0-5',
    main: { tag: 'ANA SENARYO', score: '0 – 3', text: "Barça topa sahip olur; Raphinha'nın geriye gelişleri Sabah'ın dörtlüsünü açar, Fermín koşularla skoru yapar. McCarthy'siz Sabah duran topta da etkisini kaybeder." },
    alt: { tag: 'ALTERNATİF', score: '1 – 2', text: "Barça son maçlarda erken gol yiyor (Villarreal 7', Atlético 9'). Sabah ilk dakikalarda kontrayla ya da duran topla gol bulursa maç sona kadar sıkı geçer." },
    breakLabel: 'KIRILMA NOKTASI: İLK 10 DAKİKA', breakMin: 10
  }
};

// ---- Scenario 1: Barça's weapon — Raphinha false 9 drops, Fermín attacks the channel
M.scen.push({
  base: { pok: [.5, .95], zed: [.80, .85], sol: [.58, .86], alm: [.42, .86], puc: [.20, .85], lep: [.5, .77], rak: [.64, .75], isa: [.36, .75], sev: [.80, .72], mic: [.20, .72], mbi: [.5, .60],
    jga: [.5, .18], cub: [.38, .42], gma: [.62, .42], kou: [.14, .56], can: [.86, .56], ber: [.5, .52], ped: [.62, .63], fer: [.36, .65], ade: [.08, .76], gor: [.92, .76], rap: [.5, .80] },
  moves: [[0.4, 1.2, 'rap', [.53, .69]], [0.6, 1.4, 'sol', [.55, .77]], [0.8, 1.5, 'lep', [.58, .74]],
    [1.6, 3.0, 'fer', [.41, .89]], [1.9, 3.0, 'alm', [.47, .88]], [1.6, 2.8, 'ade', [.10, .84]], [1.6, 2.8, 'puc', [.15, .86]],
    [1.8, 3.0, 'isa', [.34, .82]], [1.6, 3.0, 'gor', [.70, .88]], [2.0, 3.0, 'zed', [.66, .89]], [2.9, 3.4, 'pok', [.46, .94]]],
  ball: [[0, 'ber'], [0.5, 'ber'], [0.9, 'ped'], [1.3, 'ped'], [1.7, 'rap'], [2.0, 'rap'], [2.8, [.41, .885]], [2.9, 'fer'], [3.2, 'fer'], [3.6, [.54, 1.005]]],
  lines: [[0.2, 1.7, ['puc', 'alm', 'sol', 'zed'], 'SABAH SAVUNMA ÇİZGİSİ']],
  zones: [[0.8, 2.8, [.36, .86, 'acc'], .07, .045, 'KANAL']],
  runs: [['rap', 0.4, 1.2, 'run'], ['fer', 1.6, 3.0, 'run'], ['gor', 1.6, 3.0, 'run']],
  hls: [[0.4, 2.4, 'rap'], [1.6, 9, 'fer'], [0.6, 1.8, 'sol']],
  flashes: [[1.2, 2.1, 'SAHTE 9', 'acc', 'RAPHINHA STOPERİ ÇEKİYOR'], [3.7, 5.4, 'GOL FIRSATI', 'acc', 'RAPHINHA → FERMÍN']],
  cam: [[0, { x: .5, y: .66, dist: 74, el: 54, yaw: -6 }], [1.6, { x: .46, y: .74, dist: 64, el: 50, yaw: -8 }], [3.0, { x: .46, y: .84, dist: 54, el: 46, yaw: -6 }], [8.5, { x: .47, y: .82, dist: 62, el: 48, yaw: -4 }]],
  kicker: "SENARYO 1 · BARÇA'NIN SİLAHI", title: 'SAHTE 9 VE GEÇ KOŞU',
  cap: "Lamine yokken Raphinha sahte 9 oynar. Geriye gelip Solvet'i peşinden çektiğinde Almeida ile Puchacz arasında kanal açılır; Fermín son 2 lig maçında 4 gol attı."
});

// ---- Scenario 2: Sabah's weapon — turnover, Mbina holds, Mickels behind Koundé (high line)
M.scen.push({
  base: { jga: [.5, .12], kou: [.18, .46], cub: [.40, .43], gma: [.60, .43], can: [.84, .56], ber: [.50, .57], ped: [.64, .66], fer: [.36, .68], ade: [.10, .72], gor: [.88, .76], rap: [.50, .80],
    pok: [.5, .95], zed: [.82, .86], sol: [.58, .88], alm: [.42, .88], puc: [.22, .84], lep: [.50, .78], rak: [.62, .76], isa: [.40, .75], sev: [.82, .66], mic: [.18, .62], mbi: [.50, .56] },
  moves: [[0.2, 0.8, 'rak', [.63, .69]], [0.6, 1.4, 'mbi', [.49, .51]], [0.8, 1.5, 'cub', [.46, .47]],
    [1.6, 2.8, 'mic', [.22, .28]], [1.8, 3.2, 'kou', [.25, .32]], [1.8, 3.2, 'gma', [.50, .30]], [2.8, 3.8, 'mic', [.36, .15]],
    [1.8, 3.6, 'mbi', [.52, .22]], [3.0, 3.8, 'kou', [.33, .20]], [3.3, 3.9, 'jga', [.44, .09]], [1.6, 3.4, 'sev', [.74, .36]]],
  ball: [[0, 'ped'], [0.5, 'ped'], [0.8, 'rak'], [1.0, 'rak'], [1.4, 'mbi'], [1.8, 'mbi'], [2.6, [.22, .29]], [2.75, 'mic'], [3.8, 'mic'], [4.3, [.52, -.005]]],
  lines: [[0.2, 2.0, ['kou', 'cub', 'gma', 'can'], 'BARÇA YÜKSEK ÇİZGİ']],
  zones: [[1.0, 3.0, [.24, .30, 'danger'], .13, .08, 'BEK ARKASI']],
  runs: [['mic', 1.6, 2.8, 'run'], ['mic', 2.8, 3.8, 'drib'], ['mbi', 1.8, 3.6, 'run']],
  hls: [[0.6, 1.6, 'rak'], [1.2, 2.2, 'mbi'], [1.6, 9, 'mic'], [1.8, 3.4, 'kou']],
  goldAfter: 1.3,
  flashes: [[0.8, 1.6, 'TOP KAYBI', 'danger', 'RAKHMONALIEV ARAYA GİRDİ'], [4.5, 6.2, 'KONTRA TEHLİKESİ', 'danger', 'MBINA → MICKELS']],
  cam: [[0, { x: .52, y: .66, dist: 72, el: 54, yaw: 6 }], [1.6, { x: .40, y: .48, dist: 74, el: 52, yaw: -8 }], [2.8, { x: .30, y: .30, dist: 60, el: 48, yaw: -12 }],
    [4.0, { x: .40, y: .18, dist: 54, el: 46, yaw: -8 }], [8.5, { x: .38, y: .20, dist: 62, el: 50, yaw: -10 }]],
  kicker: "SENARYO 2 · SABAH'IN KOZU", title: 'YÜKSEK ÇİZGİNİN ARKASI',
  cap: "Barça'nın yüksek çizgisi hem silah hem risk: Villarreal top kayıplarından 7 dakikada 2 gol buldu. Sabah topu kazanıp Mbina'ya oynarsa Mickels, Koundé'nin arkasına koşar."
});

// ---- Scenario 3: Sabah set piece — Puchacz free kick, far-post run (McCarthy suspended)
M.scen.push({
  base: { puc: [.29, .27], sol: [.44, .22], alm: [.53, .21], mbi: [.47, .19], lep: [.62, .22], mic: [.36, .18], rak: [.56, .32], isa: [.72, .31], sev: [.80, .22], zed: [.80, .50], pok: [.5, .92],
    jga: [.5, .03], kou: [.37, .13], cub: [.45, .135], gma: [.54, .125], can: [.63, .13], ber: [.49, .16], fer: [.59, .16], ped: [.40, .26], gor: [.72, .19], ade: [.30, .31], rap: [.50, .42] },
  moves: [[0.8, 2.0, 'sol', [.62, .07]], [0.8, 2.0, 'mbi', [.39, .07]], [0.9, 2.0, 'alm', [.50, .10]], [0.9, 2.0, 'lep', [.72, .13]],
    [1.0, 2.0, 'gma', [.565, .085]], [1.0, 2.0, 'cub', [.43, .09]], [1.0, 2.0, 'can', [.67, .095]], [2.2, 2.6, 'jga', [.54, .03]]],
  ball: [[0, 'puc'], [1.4, 'puc'], [2.2, [.62, .07], { h: 3.2 }], [2.35, [.62, .07]], [2.75, [.55, -.005], { h: .5 }]],
  zones: [[0.4, 4.0, [.62, .075, 'danger'], .06, .035, 'ARKA DİREK']],
  runs: [['sol', 0.8, 2.0, 'run'], ['mbi', 0.8, 2.0, 'run'], ['alm', 0.9, 2.0, 'run']],
  hls: [[0, 1.6, 'puc'], [1.2, 9, 'sol']],
  goldAfter: 1.2,
  flashes: [[2.9, 4.6, 'DURAN TOP TEHDİDİ', 'danger', 'PUCHACZ → SOLVET']],
  cam: [[0, { x: .40, y: .20, dist: 66, el: 54, yaw: -8 }], [1.6, { x: .50, y: .13, dist: 50, el: 50, yaw: -2 }], [2.6, { x: .56, y: .10, dist: 44, el: 46, yaw: 2 }], [8.5, { x: .56, y: .12, dist: 50, el: 48, yaw: 2 }]],
  kicker: 'SENARYO 3 · DURAN TOP', title: "PUCHACZ'IN SERBEST VURUŞU",
  cap: "Sabah'ın Dortmund'a golü Puchacz'ın serbest vuruşundan geldi; o golü atan McCarthy cezalı. Hava topunda yük artık Solvet'te: arka direğe koşusu Barça'nın tek zayıf anı olabilir."
});
