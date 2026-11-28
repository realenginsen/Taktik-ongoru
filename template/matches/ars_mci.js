// Arsenal vs Manchester City — Premier League 2026-27, 12. hafta, 29 Nov 2026, 19:30 TSİ (16:30 GMT)
window.M = {
  theme: {
    acc: '#B7FF3C', danger: '#C77DFF',
    h: { code: 'ARS', name: 'ARSENAL', col: '#EF0107', colD: '#8E0A0F', ink: '#FFFFFF', textCol: '#FF5A5F', stripe: '#FFFFFF',
      tok: ['#FF8A8A', '#E3131B', '#9B0A0F'], tokRim: '#FFFFFF', tagBar: '#EF0107', run: '#FF6B6B', trail: '#FF4B4B',
      intro: ['#7A0008', '#E3131B'], introText: '#FFFFFF', card: ['#A3101A', '#3A0A10'], glow: '#FF8A8A',
      shirt: '#E3131B', shirtD: '#7E0A10', trim: '#FFFFFF', numCol: '#FFFFFF', numStroke: null, sleeves: '#F2F2F2' },
    a: { code: 'MCI', name: 'MAN CITY', col: '#6CABDD', colD: '#2E6A9E', ink: '#0B1E3A', textCol: '#8CC8F0', stripe: '#FFFFFF',
      tok: ['#C4E3F8', '#6CABDD', '#3C7DB3'], tokRim: '#0B1E3A', tagBar: '#6CABDD', run: '#9BD0F5', trail: '#8CC8F0',
      intro: ['#3C7DB3', '#6CABDD'], introText: '#0B1E3A', card: ['#2E6A9E', '#0B1E3A'], glow: '#BFE0F7',
      shirt: '#6CABDD', shirtD: '#3C7DB3', trim: '#FFFFFF', numCol: '#FFFFFF', numStroke: '#0B1E3A' }
  },
  hud: { comp: 'PREMIER LİG · 12. HAFTA' },
  intro: { hSmall: '', hBig: 'ARSENAL', aSmall: 'MANCHESTER', aBig: 'CITY', strip: 'PREMIER LİG · 12. HAFTA',
    date: '29 KASIM 2026 · 19:30 TSİ', venue: 'EMIRATES STADYUMU · LONDRA' },
  players: {
    ray: ['RAYA', 'h'], tim: ['TIMBER', 'h'], kon: ['KONSA', 'h'], gab: ['GABRIEL', 'h'], cal: ['CALAFIORI', 'h'],
    gui: ['GUIMARÃES', 'h'], ric: ['RICE', 'h'], mad: ['MADUEKE', 'h'], ode: ['ØDEGAARD', 'h'], eze: ['EZE', 'h'], hav: ['HAVERTZ', 'h'],
    don: ['DONNARUMMA', 'a'], nun: ['NUNES', 'a'], dia: ['DIAS', 'a'], gue: ['GUÉHI', 'a'], gva: ['GVARDIOL', 'a'],
    and: ['ANDERSON', 'a'], fer: ['FERNÁNDEZ', 'a'], ndi: ['NDIAYE', 'a'], che: ['CHERKI', 'a'], dok: ['DOKU', 'a'], haa: ['HAALAND', 'a']
  },
  context: {
    rows: [
      { label: 'LİG SIRASI', h: 1, a: 3, hw: 1, aw: .7, suffix: '.' },
      { label: 'PUAN', h: 28, a: 22, hw: 1, aw: .79 },
      { label: 'YEDİĞİ GOL', h: 7, a: 14, hw: .5, aw: 1 }
    ],
    chips: [
      { side: 'h', title: 'FORM', body: 'Lider. İç sahada 5 lig maçının 5\'ini kazandı: 10 gol attı, 2 yedi' },
      { side: 'a', title: 'FORM', body: 'Ligde 4 maçtır kazanamıyor; 10 maçtır kalesini gole kapatamadı' },
      { side: 'h', title: 'EKSİKLER', body: "Saka ve Zubimendi yok. Raya'nın omzu şüpheli; alternatif Kepa" },
      { side: 'a', title: 'EKSİKLER', body: 'Semenyo (diz) yok. Guéhi ve Khusanov şüpheli' }
    ],
    footer: 'SON 4 KARŞILAŞMA · CITY 2 · ARSENAL 1 · BERABERLİK 1',
    caption: "Lider Arsenal ile 6 puan gerideki City karşı karşıya. Maresca'nın City'si en çok net pozisyon bulan takım, ama son 4 maçta golle biten 4 hata yaptı."
  },
  lineup: {
    formH: 'ARSENAL · 4-2-3-1', formA: 'MAN CITY · 4-2-3-1',
    kickoff: {
      ray: [.5, .95], tim: [.84, .80], kon: [.62, .85], gab: [.38, .85], cal: [.16, .80], gui: [.40, .70], ric: [.60, .70],
      mad: [.84, .60], ode: [.5, .62], eze: [.16, .60], hav: [.5, .545],
      don: [.5, .05], nun: [.16, .20], dia: [.38, .15], gue: [.62, .15], gva: [.84, .20], and: [.40, .30], fer: [.60, .30],
      ndi: [.16, .40], che: [.5, .38], dok: [.84, .40], haa: [.5, .455]
    },
    caption: "Sports Mole, Standard, SI ve Opta Analyst çoğunluğu. Şüpheli: Arsenal'de kale (Raya/Kepa), forvet (Havertz/Gyökeres); City'de sol bek (Gvardiol/O'Reilly), ön libero (Fernández/Bouaddi)."
  },
  cards: [
    { name: 'MADUEKE', side: 'h', role: 'ARSENAL · SAĞ KANAT', line: "Son 5 maçın 3'ünde gol attı. Gvardiol'un arkası onun alanı.",
      fig: { shirtName: 'MADUEKE', num: '20', skin: '#5E3B29', skinD: '#45291C', hair: '#121010', hairL: '#2A2220', hairCover: .42, curly: true } },
    { name: 'RICE', side: 'h', role: 'ARSENAL · ORTA SAHA', line: "5 asistle ligin asist lideri. Anfield'daki golü onun alçak ortasından geldi.",
      fig: { shirtName: 'RICE', num: '41', skin: '#EBC2A4', skinD: '#C99878', hair: '#5A3E28', hairL: '#7E5A3C', hairCover: .5 } },
    { name: 'HAALAND', side: 'a', role: 'MAN CITY · SANTRFOR', line: "9 golle gol kralı. Arsenal'e son 4 lig maçında gol attı.",
      fig: { shirtName: 'HAALAND', num: '9', skin: '#F1CDB4', skinD: '#CFA58A', hair: '#D9B86E', hairL: '#F0D89A', hairCover: .5, bun: true } },
    { name: 'DOKU', side: 'a', role: 'MAN CITY · SOL KANAT', line: "Sol kanatta birebirin adamı. Timber ile düellosu City'nin en net yolu.",
      fig: { shirtName: 'DOKU', num: '11', skin: '#5A3A28', skinD: '#3F281B', hair: '#0E0B0A', hairL: '#221A16', hairCover: .36 } }
  ],
  cardsCaption: "Arsenal'de Madueke ve Rice, City'de Doku–Haaland hattı maçın kaderini belirleyebilir.",
  scen: [],
  pred: {
    probLabel: 'OPTA SÜPER BİLGİSAYARI · KAZANMA OLASILIĞI',
    probs: [{ label: 'ARS', v: 54.4, side: 'h' }, { label: 'X', v: 23.4, side: null }, { label: 'MCI', v: 22.2, side: 'a' }],
    main: { tag: 'ANA SENARYO', score: '2 – 1', text: "Arsenal önde baskıyla City'nin hata eğilimini zorlar ve iç sahadaki 5'te 5 serisini sürdürür. 10 maçtır gol yiyen City, Haaland ile bir gol bulur." },
    alt: { tag: 'ALTERNATİF', score: '1 – 1', text: "Arsenal son iki maçında öne geçtiği skoru koruyamadı (Newcastle 2-2, Dortmund 1-1). City kanattan ya da duran toptan bir gol bulursa puanlar paylaşılır." },
    breakLabel: "KIRILMA NOKTASI: CITY'NİN GERİDEN OYUN KURMASI", breakMin: null
  }
};

// ---- Scenario 1: Arsenal high press on City's build-up -> Madueke wins it off Gvardiol
M.scen.push({
  base: { don: [.5, .05], nun: [.14, .20], dia: [.36, .10], gue: [.64, .10], gva: [.88, .18], and: [.44, .24], fer: [.58, .27], ndi: [.14, .38], che: [.5, .36], dok: [.86, .40], haa: [.5, .46],
    hav: [.52, .15], ode: [.46, .25], mad: [.72, .21], eze: [.28, .20], ric: [.62, .35], gui: [.42, .37], tim: [.84, .43], kon: [.60, .56], gab: [.40, .56], cal: [.16, .45], ray: [.5, .84] },
  moves: [[0.9, 1.8, 'mad', [.85, .17]], [1.0, 1.8, 'hav', [.70, .11]], [1.0, 1.8, 'ric', [.60, .30]], [2.0, 2.8, 'mad', [.78, .08]],
    [1.8, 2.8, 'hav', [.56, .06]], [2.0, 2.9, 'ode', [.45, .11]], [2.0, 2.9, 'dia', [.50, .06]], [1.8, 2.8, 'gue', [.64, .06]], [1.9, 2.9, 'gva', [.82, .13]]],
  ball: [[0, 'gue'], [0.5, 'gue'], [0.95, 'gva'], [1.8, 'gva'], [1.9, [.85, .17]], [1.95, 'mad'], [2.8, 'mad'], [3.15, 'ode'], [3.35, 'ode'], [3.7, [.53, -.005]]],
  zones: [[0.6, 2.2, [.85, .17, 'acc'], .08, .06, 'PRES TUZAĞI']],
  runs: [['mad', 0.9, 1.8, 'run'], ['mad', 2.0, 2.8, 'drib'], ['hav', 1.8, 2.8, 'run'], ['ode', 2.0, 2.9, 'run']],
  hls: [[0.9, 9, 'mad'], [0.9, 2.0, 'gva'], [3.0, 9, 'ode']],
  flashes: [[1.95, 2.8, 'TOP KAZANILDI', 'acc', 'MADUEKE PRESİ'], [3.8, 5.6, 'GOL FIRSATI', 'acc', 'MADUEKE → ØDEGAARD']],
  cam: [[0, { x: .66, y: .20, dist: 70, el: 56, yaw: 8 }], [1.8, { x: .72, y: .16, dist: 64, el: 52, yaw: 10 }], [3.0, { x: .62, y: .11, dist: 60, el: 50, yaw: 6 }], [8.5, { x: .60, y: .12, dist: 64, el: 52, yaw: 6 }]],
  kicker: "SENARYO 1 · ARSENAL'İN SİLAHI", title: 'ÖNDE PRES, KAPILAN TOP',
  cap: "Opta'ya göre City son 4 maçta golle biten 4 hata yaptı; Forest'ın ilk golü Gvardiol'dan kapılan topla geldi. Arsenal de Slavia ve Liverpool'a önde kazandığı toplarla gol buldu."
});

// ---- Scenario 2: City's wing — Doku 1v1 vs Timber, cut-back to Haaland
M.scen.push({
  base: { haa: [.50, .66], che: [.54, .56], dok: [.86, .56], ndi: [.16, .58], and: [.46, .42], fer: [.60, .44], gva: [.84, .44], nun: [.20, .40], dia: [.40, .30], gue: [.60, .30], don: [.5, .06],
    ray: [.5, .95], tim: [.82, .72], kon: [.60, .80], gab: [.42, .80], cal: [.20, .74], gui: [.44, .66], ric: [.60, .64], mad: [.76, .54], ode: [.5, .50], eze: [.24, .55], hav: [.53, .35] },
  moves: [[1.4, 2.0, 'tim', [.84, .64]], [1.6, 2.8, 'gva', [.92, .76]], [2.0, 3.2, 'dok', [.82, .89]], [2.2, 3.2, 'tim', [.80, .85]],
    [2.2, 3.2, 'haa', [.46, .87]], [2.2, 3.2, 'kon', [.57, .87]], [2.2, 3.2, 'gab', [.36, .85]], [2.4, 3.4, 'che', [.56, .76]], [1.6, 3.0, 'mad', [.84, .66]]],
  ball: [[0, 'fer'], [0.5, 'fer'], [0.9, 'gva'], [1.1, 'gva'], [1.5, 'dok'], [3.2, 'dok'], [3.5, 'haa'], [3.6, 'haa'], [3.9, [.47, 1.005]]],
  lines: [[0.6, 2.6, ['cal', 'gab', 'kon', 'tim'], 'ARSENAL SAVUNMA ÇİZGİSİ']],
  zones: [[2.0, 3.8, [.47, .87, 'danger'], .07, .04, 'GERİ PAS ALANI']],
  runs: [['dok', 2.0, 3.2, 'drib'], ['haa', 2.2, 3.2, 'run'], ['gva', 1.6, 2.8, 'run']],
  hls: [[1.5, 3.4, 'dok'], [1.4, 3.2, 'tim'], [2.2, 9, 'haa']],
  flashes: [[2.4, 3.2, '1V1', 'danger', 'DOKU – TIMBER'], [4.0, 5.8, 'GOL FIRSATI', 'danger', 'DOKU → HAALAND']],
  cam: [[0, { x: .68, y: .58, dist: 76, el: 56, yaw: 10 }], [1.6, { x: .74, y: .66, dist: 68, el: 52, yaw: 12 }], [3.0, { x: .64, y: .82, dist: 60, el: 48, yaw: 8 }],
    [4.0, { x: .58, y: .85, dist: 58, el: 48, yaw: 4 }], [8.5, { x: .58, y: .84, dist: 64, el: 50, yaw: 4 }]],
  kicker: "SENARYO 2 · CITY'NİN SİLAHI", title: 'DOKU KANADI, HAALAND BİTİRİR',
  cap: "City 22 golle ligin en golcü takımı ve en çok net pozisyona (36) giren ekip. Haaland 9 golle krallık lideri; Arsenal'e karşı son 4 lig maçında gol attı."
});

// ---- Scenario 3: City corner — Haaland decoy, Dias attacks the space
M.scen.push({
  base: { che: [.985, .99], haa: [.46, .88], dia: [.56, .84], gue: [.40, .86], and: [.62, .90], ndi: [.30, .92], dok: [.72, .84], fer: [.52, .76], gva: [.30, .72], nun: [.66, .64], don: [.5, .10],
    ray: [.50, .975], gab: [.47, .915], kon: [.57, .915], tim: [.38, .935], cal: [.66, .955], ric: [.55, .87], gui: [.44, .86], ode: [.72, .80], eze: [.22, .76], mad: [.80, .72], hav: [.50, .80] },
  moves: [[0.6, 1.6, 'dia', [.49, .905]], [0.6, 1.6, 'ric', [.535, .885]], [0.6, 1.5, 'haa', [.38, .93]], [0.6, 1.5, 'tim', [.36, .95]], [0.6, 1.5, 'gab', [.43, .94]],
    [0.6, 1.4, 'gue', [.60, .94]], [0.6, 1.4, 'kon', [.62, .925]], [1.6, 2.2, 'ray', [.46, .985]]],
  ball: [[0, 'che'], [0.8, 'che'], [1.7, [.49, .905], { h: 4 }], [1.75, [.49, .905], { h: 2 }], [2.1, [.44, 1.005], { h: 1 }]],
  zones: [[0.6, 3.6, [.49, .905, 'danger'], .07, .035]],
  runs: [['dia', 0.6, 1.6, 'run'], ['haa', 0.6, 1.5, 'run']],
  hls: [[0, 1.0, 'che'], [0.6, 1.8, 'haa'], [0.6, 9, 'dia']],
  flashes: [[0.9, 1.8, 'KORNER', 'danger', 'HAALAND YEM KOŞUSU'], [2.3, 4.0, 'KAFA VURUŞU', 'danger', 'DIAS']],
  goldAfter: 2.2,
  cam: [[0, { x: .66, y: .84, dist: 60, el: 62, yaw: 10 }], [1.2, { x: .56, y: .86, dist: 50, el: 64, yaw: 6 }], [2.2, { x: .50, y: .87, dist: 46, el: 64, yaw: 4 }], [8.5, { x: .52, y: .86, dist: 54, el: 64, yaw: 4 }]],
  kicker: 'SENARYO 3 · DURAN TOP', title: 'KORNERDE BOŞALAN ALAN',
  cap: "Arteta, Newcastle'daki 2-2'de taçtan ve duran toplardan gol yediklerini söyledi; Slavia da uzun taçtan skoru buldu. Haaland arka direğe adam çekerse Dias boşalan alana girer."
});
