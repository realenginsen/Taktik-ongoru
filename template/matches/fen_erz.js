// Fenerbahçe vs Erzurumspor FK — Trendyol Süper Lig 2026-27, 13. hafta, 29 Nov 2026, 19:00 TSİ
window.M = {
  theme: {
    acc: '#2EE6A0', danger: '#FF3D8B',
    h: { code: 'FB', name: 'FENERBAHÇE', col: '#FFE600', colD: '#0F1B4C', ink: '#0F1B4C', textCol: '#FFE600', stripe: '#0F1B4C',
      tok: ['#FFF6A0', '#FFE600', '#C9B400'], tokRim: '#0F1B4C', tagBar: '#FFE600', run: '#FFF06A', trail: '#FFE600',
      intro: ['#0F1B4C', '#1C2E78'], introText: '#FFE600', card: ['#1C2E78', '#0A1030'], glow: '#FFF27A',
      shirt: '#FFE600', shirtD: '#B8A500', stripes: 'rgba(15,27,76,.95)', trim: '#0F1B4C', numCol: '#FFFFFF', numStroke: '#0F1B4C' },
    a: { code: 'ERZ', name: 'ERZURUMSPOR', col: '#1E5BB8', colD: '#0F3A7A', ink: '#FFFFFF', textCol: '#7FB2FF', stripe: '#FFFFFF',
      tok: ['#8FBCFF', '#1E5BB8', '#0F3A7A'], tokRim: '#FFFFFF', tagBar: '#1E5BB8', run: '#8FBCFF', trail: '#7FB2FF',
      intro: ['#0F3A7A', '#1E5BB8'], introText: '#FFFFFF', card: ['#1E4F9E', '#0A1E40'], glow: '#A9CCFF',
      shirt: '#1E5BB8', shirtD: '#0F3A7A', stripes: 'rgba(255,255,255,.9)', trim: '#FFFFFF', numCol: '#FFFFFF', numStroke: '#0F3A7A' }
  },
  hud: { comp: 'SÜPER LİG · 13. HAFTA' },
  intro: { hSmall: '', hBig: 'FENERBAHÇE', aSmall: '', aBig: 'ERZURUMSPOR', strip: 'TRENDYOL SÜPER LİG · 13. HAFTA',
    date: '29 KASIM 2026 · 19:00 TSİ', venue: 'CHOBANI STADYUMU · KADIKÖY' },
  players: {
    ede: ['EDERSON', 'h'], sem: ['SEMEDO', 'h'], skr: ['ŠKRINIAR', 'h'], opp: ['OPPONG', 'h'], bro: ['A. BROWN', 'h'],
    ism: ['İSMAİL', 'h'], kan: ['KANTÉ', 'h'], gre: ['GREENWOOD', 'h'], irf: ['İRFAN CAN', 'h'], ogu: ['OĞUZ', 'h'], mur: ['MURIQI', 'h'],
    tas: ['TAŞKIRAN', 'a'], ger: ['GERXHALIU', 'a'], yum: ['YUMLU', 'a'], muj: ['MUJAKIC', 'a'], yak: ['YAKUP', 'a'], gio: ['GIORBELIDZE', 'a'],
    bai: ['BAIYE', 'a'], owu: ['OWUSU', 'a'], rod: ['RODRIGUEZ', 'a'], ker: ['KERK', 'a'], dia: ['DIABATE', 'a']
  },
  context: {
    rows: [
      { label: 'LİG SIRASI', h: 6, a: 12, hw: .85, aw: .5, suffix: '.' },
      { label: 'PUAN', h: 20, a: 14, hw: 1, aw: .7 },
      { label: 'ATTIĞI GOL', h: 31, a: 10, hw: 1, aw: .32 }
    ],
    chips: [
      { side: 'h', title: 'FORM', body: "Ligin en golcüsü (31). Emre Belözoğlu ile 3 maçta yenilgi yok: 5-0, 2-2, 1-0" },
      { side: 'a', title: 'FORM', body: 'Üst üste 3 yenilgi; son 4 maçın hepsinde gol yedi. Deplasmanda 6 maçta 5 gol' },
      { side: 'h', title: 'EKSİKLER', body: 'Asensio, Aké ve Oosterwolde yok. Brown derbi cezasını tamamladı' },
      { side: 'a', title: 'EKSİKLER', body: 'Ebosele ve Orhan Ovacıklı sakat. 3 gün sonra kupa maçı var' }
    ],
    footer: 'SON 6 KARŞILAŞMA · FENERBAHÇE 5 GALİBİYET · 1 BERABERLİK',
    caption: "6. sıradaki Fenerbahçe liderin 11 puan gerisinde. Erzurumspor deplasmanda kapanıyor, son golleri Kerk'in ara paslarıyla geldi."
  },
  lineup: {
    formH: 'FENERBAHÇE · 4-2-3-1', formA: 'ERZURUMSPOR · 3-5-2',
    kickoff: {
      ede: [.5, .95], sem: [.84, .80], skr: [.62, .85], opp: [.38, .85], bro: [.16, .80], ism: [.40, .70], kan: [.60, .70],
      gre: [.84, .60], irf: [.5, .62], ogu: [.16, .60], mur: [.5, .53],
      tas: [.5, .05], ger: [.32, .15], yum: [.5, .14], muj: [.68, .15], yak: [.10, .28], gio: [.90, .28],
      owu: [.34, .32], bai: [.5, .29], rod: [.66, .32], ker: [.40, .45], dia: [.60, .45]
    },
    caption: "Habertürk, Sabah, Ajansspor, Star, TRT Spor ve Aydın Havadisleri tahminlerinin çoğunluğu. Şüpheli: orta saha (İsmail/Kanté/Guendouzi), sol kanat (Oğuz/Kerem), sağ bek (Semedo/Mert Müldür). Erzurumspor'da sağ kanat bek (Yakup/Orhan)."
  },
  cards: [
    { name: 'GREENWOOD', side: 'h', role: 'FENERBAHÇE · SAĞ KANAT', line: "Ligde 7 gol, 2 asist. Kocaelispor'da son dakikada kafayla attı.",
      fig: { shirtName: 'GREENWOOD', num: '11', skin: '#B9835C', skinD: '#936343', hair: '#1A1310', hairL: '#33261D', hairCover: .44 } },
    { name: 'İRFAN CAN', side: 'h', role: 'FENERBAHÇE · 10 NUMARA', line: "5 gol, 3 asist. Çorum'a iki golü ceza sahası dışından attı.",
      fig: { shirtName: 'KAHVECI', num: '17', skin: '#E2B898', skinD: '#BE9070', hair: '#2A1E16', hairL: '#45332A', hairCover: .5 } },
    { name: 'KERK', side: 'a', role: 'ERZURUMSPOR · FORVET', line: "Hücumun beyni. Diabate'nin Rizespor ve Çorum gollerinde asist onun.",
      fig: { shirtName: 'KERK', num: '9', skin: '#5A3A28', skinD: '#3F281B', hair: '#0E0B0A', hairL: '#221A16', hairCover: .34 } },
    { name: 'DIABATE', side: 'a', role: 'ERZURUMSPOR · FORVET', line: 'Savunma arkasına koşuların adamı. Son iki golü ara pasla geldi.',
      fig: { shirtName: 'DIABATE', num: '19', skin: '#4A2E20', skinD: '#33201A', hair: '#0E0B0A', hairL: '#1E1612', hairCover: .3 } }
  ],
  cardsCaption: "Fenerbahçe'de Greenwood ve İrfan Can, Erzurumspor'da Kerk–Diabate hattı maçın kaderini belirleyebilir.",
  scen: [],
  pred: {
    probLabel: 'xGENIUS MODELİ · KAZANMA OLASILIĞI',
    probs: [{ label: 'FB', v: 77, side: 'h' }, { label: 'X', v: 16, side: null }, { label: 'ERZ', v: 7, side: 'a' }],
    main: { tag: 'ANA SENARYO', score: '3 – 0', text: "Fenerbahçe beşli bloğu kanatlar ve ceza sahası dışı şutlarla açar. Erzurumspor'un kaleciden kısa çıkışı da pres tuzağına dönüşür." },
    alt: { tag: 'ALTERNATİF', score: '2 – 1', text: "Fenerbahçe Kocaelispor'da iki duran top golü yedi. Kerk–Diabate hattı bir geçiş golü bulursa maç son dakikalara kadar açık kalır." },
    breakLabel: 'KIRILMA NOKTASI: İLK 30 DAKİKADA GOL', breakMin: 30
  }
};

// ---- Scenario 1: between the lines vs the 5-man block -> İrfan Can long shot
M.scen.push({
  base: { tas: [.5, .04], yak: [.14, .18], ger: [.34, .14], yum: [.5, .13], muj: [.66, .14], gio: [.86, .18], owu: [.36, .26], bai: [.5, .25], rod: [.64, .26], ker: [.42, .38], dia: [.58, .38],
    ede: [.5, .84], sem: [.82, .42], skr: [.62, .58], opp: [.38, .58], bro: [.18, .44], ism: [.44, .48], kan: [.58, .46], gre: [.88, .28], irf: [.54, .36], ogu: [.12, .27], mur: [.50, .20] },
  moves: [[1.4, 2.4, 'gio', [.87, .23]], [1.4, 2.4, 'rod', [.70, .26]], [1.4, 2.6, 'bai', [.58, .27]], [1.6, 2.8, 'irf', [.52, .215]],
    [2.4, 3.0, 'gre', [.80, .25]], [2.0, 3.2, 'mur', [.46, .15]], [3.0, 3.6, 'owu', [.46, .245]], [1.0, 2.0, 'kan', [.64, .40]]],
  ball: [[0, 'skr'], [0.6, 'skr'], [1.0, 'kan'], [1.3, 'kan'], [1.9, 'gre'], [3.0, 'gre'], [3.35, 'irf'], [3.6, 'irf'], [4.0, [.47, -.005], { h: 1.5 }]],
  lines: [[1.4, 3.4, ['yak', 'ger', 'yum', 'muj', 'gio'], 'ERZURUMSPOR BEŞLİ SAVUNMA']],
  zones: [[1.6, 3.6, [.54, .205, 'acc'], .12, .045, 'ÇİZGİLER ARASI']],
  runs: [['irf', 1.6, 2.8, 'run'], ['gre', 2.4, 3.0, 'drib'], ['mur', 2.0, 3.2, 'run']],
  hls: [[1.9, 3.2, 'gre'], [1.6, 9, 'irf']],
  flashes: [[4.1, 5.8, 'UZAKTAN ŞUT', 'acc', 'GREENWOOD → İRFAN CAN']],
  cam: [[0, { x: .58, y: .40, dist: 80, el: 56, yaw: 4 }], [1.8, { x: .64, y: .30, dist: 66, el: 52, yaw: 6 }], [3.2, { x: .60, y: .21, dist: 64, el: 50, yaw: 4 }],
    [4.2, { x: .56, y: .17, dist: 62, el: 50, yaw: 2 }], [8.5, { x: .56, y: .19, dist: 66, el: 52, yaw: 2 }]],
  kicker: "SENARYO 1 · FENERBAHÇE'NİN ANAHTARI", title: 'ÇİZGİLER ARASI VE UZAK ŞUT',
  cap: "Erzurumspor deplasmanda beşli savunmayla derin kalıyor. Kanat bek Greenwood'a çıkınca çizgiler arası açılır; İrfan Can Çorum'u 5-0 yendikleri maçta iki golü ceza sahası dışından attı."
});

// ---- Scenario 2: high press on goalkeeper's short build-up
M.scen.push({
  base: { tas: [.5, .04], ger: [.22, .09], yum: [.5, .11], muj: [.78, .09], yak: [.08, .24], gio: [.92, .24], bai: [.5, .22], owu: [.34, .30], rod: [.66, .30], ker: [.40, .44], dia: [.60, .44],
    mur: [.5, .17], gre: [.70, .15], ogu: [.30, .15], irf: [.52, .27], ism: [.38, .35], kan: [.62, .35], sem: [.84, .37], bro: [.16, .37], skr: [.60, .53], opp: [.40, .53], ede: [.5, .82] },
  moves: [[0.9, 1.7, 'gre', [.75, .11]], [1.8, 2.6, 'mur', [.57, .07]], [2.2, 2.9, 'irf', [.52, .20]], [2.0, 2.8, 'bai', [.49, .27]],
    [2.6, 3.6, 'ogu', [.38, .10]], [2.9, 3.6, 'yum', [.45, .085]], [3.0, 3.8, 'ger', [.32, .07]]],
  ball: [[0, 'tas'], [0.5, 'tas'], [1.05, 'muj'], [1.7, 'muj'], [2.15, 'tas'], [2.55, 'tas'], [2.95, [.52, .20]], [3.0, 'irf'], [3.3, 'irf'], [3.7, 'ogu'], [3.9, 'ogu'], [4.2, [.45, -.005]]],
  zones: [[0.4, 2.9, [.5, .12, 'acc'], .22, .07, 'PRES TUZAĞI']],
  runs: [['gre', 0.9, 1.7, 'run'], ['mur', 1.8, 2.6, 'run'], ['irf', 2.2, 2.9, 'run'], ['ogu', 2.6, 3.6, 'run']],
  hls: [[0.9, 2.2, 'gre'], [1.8, 3.0, 'mur'], [2.2, 9, 'irf'], [3.6, 9, 'ogu']],
  flashes: [[3.0, 3.9, 'TOP KAPILDI', 'acc', 'KISA PASA ARAYA GİRİŞ'], [4.3, 6.0, 'GOL FIRSATI', 'acc', 'İRFAN CAN → OĞUZ']],
  cam: [[0, { x: .52, y: .16, dist: 68, el: 58, yaw: 0 }], [2.0, { x: .54, y: .13, dist: 70, el: 56, yaw: 0 }], [3.4, { x: .50, y: .12, dist: 64, el: 52, yaw: -2 }], [8.5, { x: .50, y: .13, dist: 68, el: 54, yaw: -2 }]],
  kicker: 'SENARYO 2 · PRES KIRILMASI', title: 'KALECİDEN KISA OYUN TUZAĞI',
  cap: "Erzurumspor, Çorum'a 3-1 yenildiği maçta ikinci golü Taşkıran'ın kısa çıkışında kapılan topla yedi. Fenerbahçe önde basarsa geriden oyun kurmak Erzurum için risk."
});

// ---- Scenario 3: Erzurumspor's weapon — turnover, Kerk through ball behind the line
M.scen.push({
  base: { ede: [.5, .84], sem: [.84, .44], skr: [.62, .58], opp: [.38, .58], bro: [.16, .44], ism: [.42, .46], kan: [.58, .44], gre: [.86, .26], irf: [.52, .30], ogu: [.16, .26], mur: [.50, .18],
    tas: [.5, .04], yak: [.14, .18], ger: [.34, .14], yum: [.5, .13], muj: [.66, .14], gio: [.86, .18], owu: [.38, .30], bai: [.5, .33], rod: [.64, .30], ker: [.44, .44], dia: [.62, .46] },
  moves: [[0.8, 1.3, 'ker', [.42, .48]], [1.4, 2.0, 'ker', [.42, .56]], [1.4, 2.6, 'dia', [.52, .72]], [2.6, 3.4, 'dia', [.52, .84]],
    [1.6, 2.8, 'skr', [.63, .70]], [1.6, 2.8, 'opp', [.41, .70]], [2.8, 3.4, 'ede', [.5, .89]], [0.6, 1.6, 'ism', [.46, .50]], [1.0, 2.4, 'kan', [.52, .58]]],
  ball: [[0, 'ism'], [0.5, 'ism'], [0.9, [.48, .38]], [0.95, 'bai'], [1.1, 'bai'], [1.4, 'ker'], [2.0, 'ker'], [2.6, [.52, .72]], [2.65, 'dia'], [3.4, 'dia'], [3.7, [.54, 1.005]]],
  lines: [[0.2, 2.4, ['bro', 'opp', 'skr', 'sem'], 'FENERBAHÇE SAVUNMA ÇİZGİSİ']],
  zones: [[1.4, 3.0, [.5, .68, 'danger'], .16, .08, 'ÇİZGİ ARKASI']],
  runs: [['ker', 1.4, 2.0, 'drib'], ['dia', 1.4, 2.6, 'run'], ['dia', 2.6, 3.4, 'drib']],
  hls: [[0.6, 1.6, 'bai'], [1.3, 2.6, 'ker'], [1.4, 9, 'dia']],
  flashes: [[1.0, 1.9, 'TOP KAYBI', 'danger', 'ORTA SAHADA ARAYA GİRİŞ'], [3.8, 5.6, 'GOL FIRSATI', 'danger', 'KERK → DIABATE']],
  cam: [[0, { x: .48, y: .40, dist: 72, el: 54, yaw: -4 }], [1.4, { x: .48, y: .52, dist: 72, el: 52, yaw: 0 }], [2.6, { x: .52, y: .72, dist: 60, el: 48, yaw: 0 }],
    [3.6, { x: .52, y: .82, dist: 54, el: 46, yaw: 0 }], [8.5, { x: .52, y: .80, dist: 62, el: 50, yaw: 0 }]],
  kicker: "SENARYO 3 · ERZURUMSPOR'UN SİLAHI", title: 'TOP KAYBI VE ARA PAS',
  cap: "Diabate, Rizespor ve Çorum maçlarındaki gollerini Kerk'in pasıyla attı. Fenerbahçe de Göztepe'ye orta sahadaki top kaybının ardından savunma arkasına atılan topla gol yedi."
});
