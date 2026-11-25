// CSKA Sofia vs Trabzonspor — UECL league phase MD4, 26 Nov 2026, 23:00 TSİ (21:00 CET), Balgarska Armia, Sofia
window.M = {
  theme: {
    acc: '#3BF0A0', danger: '#FFB020',
    h: { code: 'CSKA', name: 'CSKA SOFYA', col: '#C8102E', colD: '#7A0A1C', ink: '#FFFFFF', textCol: '#FF4D5E', stripe: '#FFFFFF',
      tok: ['#FF7A86', '#C8102E', '#7E0A1C'], tokRim: '#FFFFFF', tagBar: '#C8102E', run: '#FF6B78', trail: '#FF4B5A',
      intro: ['#C8102E', '#8A0A1E'], introText: '#FFFFFF', card: ['#9E0F24', '#3A0810'], glow: '#FF8A94',
      shirt: '#C8102E', shirtD: '#7E0A1C', trim: '#FFFFFF', numCol: '#FFFFFF', numStroke: null },
    a: { code: 'TS', name: 'TRABZONSPOR', col: '#2A6FD6', colD: '#123A78', ink: '#FFFFFF', textCol: '#6FA8FF', stripe: '#7A1E3A',
      tok: ['#8DBBFF', '#2A6FD6', '#15418A'], tokRim: '#FFFFFF', tagBar: '#2A6FD6', run: '#7FB0FF', trail: '#6FA8FF',
      intro: ['#7A1E3A', '#2A6FD6'], introText: '#FFFFFF', card: ['#1E4F9E', '#0B1F45'], glow: '#9CC4FF',
      shirt: '#2A6FD6', shirtD: '#15418A', trim: '#7A1E3A', numCol: '#FFFFFF', numStroke: '#7A1E3A' }
  },
  hud: { comp: 'KONFERANS LİGİ · 4. HAFTA' },
  intro: { hSmall: 'CSKA', hBig: 'SOFYA', aSmall: '', aBig: 'TRABZONSPOR', strip: 'UEFA KONFERANS LİGİ · LİG AŞAMASI · 4. HAFTA',
    date: '26 KASIM 2026 · 23:00 TSİ', venue: 'BALGARSKA ARMİYA STADYUMU · SOFYA' },
  players: {
    lap: ['LAPOUKHOV', 'h'], pas: ['PASTOR', 'h'], alm: ['ALMEIDA', 'h'], rod: ['RODRIGUES', 'h'], mar: ['MARTINO', 'h'], gba: ['GBAMIN', 'h'],
    jor: ['JORDÃO', 'h'], sen: ['SENSI', 'h'], pit: ['PITTAS', 'h'], zwa: ['ZWARTS', 'h'], pan: ['PANAYOTOV', 'h'],
    ona: ['ONANA', 'a'], pin: ['PINA', 'a'], nwa: ['NWAIWU', 'a'], cen: ['CENK', 'a'], esk: ['ESKİHELLAÇ', 'a'], fab: ['FABINHO', 'a'],
    ozt: ['OZAN', 'a'], bou: ['BOUCHOUARI', 'a'], sal: ['SALAH', 'a'], onu: ['ONUACHU', 'a'], sav: ['SAVIOLO', 'a']
  },
  context: {
    rows: [
      { label: 'KL SIRASI', h: 28, a: 12, hw: .43, aw: 1, suffix: '.' },
      { label: 'KL PUANI', h: 1, a: 6, hw: .17, aw: 1 },
      { label: "KL'DE YEDİĞİ GOL", h: 6, a: 3, hw: 1, aw: .5 }
    ],
    chips: [
      { side: 'h', title: 'FORM', body: "Ligde zirvede; Levski'yi 3-0 yendi, Botev'le 3-3" },
      { side: 'a', title: 'FORM', body: 'Reis ile ligde 7 maçta 7 galibiyet, 18-3 averaj' },
      { side: 'h', title: 'EKSİKLER', body: 'Leo Pereira sakat; T. Ivanov kontrolde' },
      { side: 'a', title: 'EKSİKLER', body: 'Muçi, Savić, Malinovskyi, Okay dahil 8 eksik' }
    ],
    footer: 'İLK RESMİ KARŞILAŞMA · GISDOL – REIS',
    caption: "Trabzonspor, KuPS maçındaki olaylar nedeniyle deplasman taraftarı olmadan oynuyor. Gisdol: 'Kâğıt üstünde favori Trabzonspor, 200 milyona karşı 25 milyon.'"
  },
  lineup: {
    formH: 'CSKA SOFYA · 4-3-3', formA: 'TRABZONSPOR · 4-3-3',
    kickoff: {
      lap: [.5, .95], pas: [.84, .80], alm: [.62, .85], rod: [.38, .85], mar: [.16, .80], gba: [.5, .72], jor: [.65, .64], sen: [.35, .64],
      pit: [.82, .56], zwa: [.5, .54], pan: [.18, .56],
      ona: [.5, .05], pin: [.16, .20], nwa: [.38, .15], cen: [.62, .15], esk: [.84, .20], fab: [.5, .28], ozt: [.36, .36], bou: [.64, .36],
      sal: [.18, .44], onu: [.5, .46], sav: [.82, .44]
    },
    caption: "Şüpheli: CSKA'da sağ bekte Pastor/Ouorou, forvette Zwarts/Godoy, solda Panayotov/Yordanov. Trabzonspor'da sol bekte Eskihellaç/Cabral, Muçi'nin yerine Bouchouari ya da Mendy."
  },
  cards: [
    { name: 'SALAH', side: 'a', role: 'TRABZONSPOR · SAĞ KANAT', line: "Bu sezon 9 gol, 3 asist. Martino ile eşleşmesi maçın anahtarı.",
      fig: { shirtName: 'SALAH', num: '10', skin: '#A8714E', skinD: '#85553A', hair: '#1A1410', hairL: '#33281F', hairCover: .42, curly: true } },
    { name: 'ONUACHU', side: 'a', role: 'TRABZONSPOR · FORVET', line: 'Ortalarda ve duran topta hedef adam; CSKA stoperleriyle hava mücadelesi.',
      fig: { shirtName: 'ONUACHU', num: '30', skin: '#4A3022', skinD: '#352117', hair: '#0E0C0B', hairL: '#211D1A', hairCover: .30 } },
    { name: 'ZWARTS', side: 'h', role: 'CSKA · FORVET', line: "Bu sezon 24 maçta 13 gol. Botev'e çalımla attı.",
      fig: { shirtName: 'ZWARTS', num: '10', skin: '#EBC6A8', skinD: '#C99E80', hair: '#4A3524', hairL: '#6A4E36', hairCover: .38 } },
    { name: 'GBAMIN', side: 'h', role: 'CSKA · ORTA SAHA', line: "Levski'ye ve Botev'e gol attı; ceza sahası önünden şut tehdidi.",
      fig: { shirtName: 'GBAMIN', num: '5', skin: '#5A3B29', skinD: '#42291C', hair: '#0E0C0B', hairL: '#221E1B', hairCover: .32 } }
  ],
  cardsCaption: "Gisdol: 'Salah'a tek savunmacı koyamazsın, birçok çözüm arıyoruz.' CSKA'da gol yükü Zwarts'ta, şut tehdidi orta sahadan Gbamin'de.",
  scen: [],
  pred: {
    consensusLabel: 'BASIN VE MODEL TAHMİNLERİ: TRABZONSPOR FAVORİ', consensus: 'SPORTS MOLE 1-2 · SCOREGPT 1-2',
    main: { tag: 'ANA SENARYO', score: '1 – 2', text: "CSKA Konferans Ligi'nde 3 maçın hepsinde gol attı ama hepsinde 2 gol yedi. Trabzonspor topa sahip olur, kilidi Salah–Pina kanadı ve duran top açar." },
    alt: { tag: 'ALTERNATİF', score: '1 – 1', text: "Freiburg'a karşı %63 topa sahip olan Trabzonspor yalnızca 2 isabetli şut buldu. CSKA önde basıp Gbamin'le skoru bulursa Muçi'siz orta saha bloğu açmakta zorlanır." },
    breakLabel: 'KIRILMA NOKTASI: İKİNCİ YARI BAŞI', breakMin: 50
  }
};

// ---- Scenario 1: Trabzonspor right flank — Salah cuts inside dragging Martino, Pina overlaps, low cross to Onuachu at the near post
M.scen.push({
  base: { sal: [.22, .62], pin: [.14, .50], ozt: [.36, .58], fab: [.50, .48], bou: [.62, .60], onu: [.48, .76], sav: [.80, .68], nwa: [.38, .30], cen: [.62, .30], esk: [.86, .46], ona: [.5, .06],
    mar: [.22, .70], pan: [.20, .56], sen: [.36, .66], gba: [.50, .70], jor: [.62, .66], rod: [.40, .80], alm: [.58, .80], pas: [.80, .78], pit: [.78, .56], zwa: [.58, .41], lap: [.5, .97] },
  moves: [[0.6, 1.6, 'sal', [.30, .74]], [0.7, 1.6, 'mar', [.27, .77]], [0.6, 2.0, 'pin', [.08, .85]], [0.8, 2.1, 'pan', [.13, .79]],
    [1.8, 3.0, 'onu', [.44, .93]], [2.0, 3.0, 'rod', [.39, .905]], [2.0, 3.0, 'alm', [.56, .88]], [3.0, 3.4, 'lap', [.54, .97]]],
  ball: [[0, 'sal'], [1.6, 'sal'], [2.05, 'pin'], [2.5, 'pin'], [2.95, 'onu'], [3.4, [.53, 1.005], { h: .5 }]],
  lines: [[0.2, 1.6, ['mar', 'rod', 'alm', 'pas'], 'CSKA SAVUNMA ÇİZGİSİ']],
  zones: [[1.4, 2.8, [.09, .84, 'acc'], .06, .05, 'BEK ARKASI'], [2.4, 3.8, [.44, .925, 'acc'], .06, .035, 'ÖN DİREK']],
  runs: [['sal', 0.6, 1.6, 'drib'], ['pin', 0.6, 2.0, 'run'], ['onu', 1.8, 3.0, 'run']],
  hls: [[0, 1.8, 'sal'], [0.7, 1.8, 'mar'], [1.6, 2.8, 'pin'], [2.6, 9, 'onu']],
  goldAfter: 2.6,
  flashes: [[1.7, 2.6, 'BİNDİRME', 'acc', "SALAH MARTINO'YU ÇEKİYOR"], [3.5, 5.3, 'ALÇAK ORTA', 'acc', 'PINA → ONUACHU']],
  cam: [[0, { x: .28, y: .64, dist: 70, el: 56, yaw: 4 }], [1.6, { x: .26, y: .76, dist: 62, el: 54, yaw: 4 }], [2.8, { x: .40, y: .84, dist: 54, el: 52, yaw: 0 }], [8.5, { x: .42, y: .84, dist: 60, el: 52, yaw: 0 }]],
  kicker: 'SENARYO 1 · KANAT VE ALÇAK ORTA', title: 'SALAH İÇERİ, PINA DIŞARI',
  cap: "Botev, CSKA'ya iki golü de sağdan gelen alçak ortalarla attı; ikisinde de Martino geride kaldı. Salah içe kat edip Martino'yu çekerse Pina'nın bindirmesi açılır."
});

// ---- Scenario 2: Trabzonspor set piece — corner from the right, Onuachu attacks the central zone vs Almeida
M.scen.push({
  base: { bou: [.015, .995], onu: [.52, .84], cen: [.62, .85], nwa: [.38, .85], ozt: [.30, .88], sal: [.44, .76], fab: [.56, .70], pin: [.24, .62], esk: [.70, .58], sav: [.70, .80], ona: [.5, .10],
    lap: [.5, .985], alm: [.50, .88], rod: [.38, .935], gba: [.54, .925], jor: [.31, .92], sen: [.63, .925], mar: [.23, .96], pas: [.70, .93], pan: [.33, .79], pit: [.62, .76], zwa: [.50, .62] },
  moves: [[0.8, 2.0, 'onu', [.455, .93]], [0.8, 2.0, 'alm', [.48, .915]], [0.9, 2.0, 'cen', [.60, .95]], [0.9, 2.0, 'nwa', [.34, .955]],
    [0.9, 2.0, 'ozt', [.30, .97]], [2.0, 2.6, 'lap', [.56, .985]]],
  ball: [[0, 'bou'], [1.3, 'bou'], [2.1, [.455, .93], { h: 3.0 }], [2.15, 'onu'], [2.55, [.56, 1.005], { h: .9 }]],
  zones: [[1.4, 3.6, [.455, .93, 'acc'], .06, .035, 'HAVA TOPU']],
  runs: [['onu', 0.8, 2.0, 'run'], ['cen', 0.9, 2.0, 'run'], ['nwa', 0.9, 2.0, 'run']],
  hls: [[0, 1.4, 'bou'], [0.8, 9, 'onu'], [0.8, 2.2, 'alm']],
  goldAfter: 2.1,
  flashes: [[2.7, 4.5, 'DURAN TOP', 'acc', "ONUACHU ALMEIDA'YA KARŞI"]],
  cam: [[0, { x: .30, y: .90, dist: 58, el: 54, yaw: -6 }], [1.4, { x: .42, y: .91, dist: 50, el: 54, yaw: -2 }], [2.4, { x: .48, y: .91, dist: 46, el: 52, yaw: 0 }], [8.5, { x: .48, y: .91, dist: 50, el: 52, yaw: 0 }]],
  kicker: "SENARYO 2 · TRABZONSPOR'UN İKİNCİ SİLAHI", title: 'KORNERDE ONUACHU',
  cap: "CSKA, Konferans Ligi'nde oynadığı 3 maçın hepsinde 2 gol yedi. Muçi ve Savić yokken Trabzonspor'un en güvenilir planı, Onuachu'yu ceza sahasının ortasında hava topuna sokmak."
});

// ---- Scenario 3: CSKA's route — high press on Fabinho's first touch, Zwarts lays off, Gbamin shoots from 20 m
M.scen.push({
  base: { nwa: [.38, .19], cen: [.62, .19], fab: [.50, .30], ozt: [.34, .38], bou: [.66, .38], pin: [.14, .30], esk: [.86, .30], sal: [.18, .50], onu: [.50, .55], sav: [.82, .50], ona: [.5, .06],
    zwa: [.46, .25], pan: [.22, .27], pit: [.78, .27], jor: [.60, .41], sen: [.40, .42], gba: [.50, .52], mar: [.16, .62], rod: [.38, .68], alm: [.62, .68], pas: [.84, .62], lap: [.5, .94] },
  moves: [[0.2, 0.9, 'zwa', [.42, .22]], [0.5, 1.1, 'jor', [.535, .325]], [1.1, 1.6, 'zwa', [.48, .21]], [1.3, 2.4, 'fab', [.54, .245]],
    [1.0, 2.3, 'gba', [.44, .31]], [1.5, 2.4, 'nwa', [.43, .195]], [1.2, 2.4, 'ozt', [.36, .33]], [2.6, 3.0, 'ona', [.44, .035]]],
  ball: [[0, 'nwa'], [0.5, 'nwa'], [0.85, 'fab'], [1.1, 'jor'], [1.5, 'zwa'], [2.25, 'zwa'], [2.55, 'gba'], [3.0, [.43, -.005], { h: 1.4 }]],
  zones: [[0.7, 1.8, [.52, .31, 'danger'], .07, .04, 'PRES'], [2.1, 3.3, [.45, .30, 'danger'], .08, .04, '']],
  runs: [['zwa', 0.2, 0.9, 'run'], ['jor', 0.5, 1.1, 'run'], ['gba', 1.0, 2.3, 'run']],
  hls: [[0.4, 1.8, 'jor'], [0.6, 1.4, 'fab'], [1.4, 2.4, 'zwa'], [2.2, 9, 'gba']],
  goldAfter: 2.55,
  flashes: [[1.2, 2.1, 'TOP KAZANIMI', 'danger', "JORDÃO FABINHO'YU SIKIŞTIRDI"], [3.2, 5.0, 'UZAKTAN ŞUT', 'danger', 'GBAMIN 20 METREDEN']],
  cam: [[0, { x: .50, y: .30, dist: 66, el: 56, yaw: -4 }], [1.4, { x: .48, y: .26, dist: 58, el: 54, yaw: -4 }], [2.6, { x: .46, y: .20, dist: 54, el: 50, yaw: 0 }], [8.5, { x: .46, y: .20, dist: 60, el: 50, yaw: 0 }]],
  kicker: "SENARYO 3 · CSKA'NIN YOLU", title: 'PRES VE UZAKTAN ŞUT',
  cap: "Gbamin son iki lig maçında da gol attı; Botev'e 20 metreden. CSKA ikinci yarıda presi öne taşıyor; Fabinho'nun ilk pası baskı altında kalırsa ceza sahası önü açılır."
});
