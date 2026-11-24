// Arsenal vs Borussia Dortmund — UCL league phase MD5, 24 Nov 2026, 23:00 TSİ
window.M = {
  theme: {
    acc: '#2EE6D6', danger: '#FF3D8B',
    h: { code: 'ARS', name: 'ARSENAL', col: '#EF0107', colD: '#8E0A0F', ink: '#FFFFFF', textCol: '#FF5A5F', stripe: '#FFFFFF',
      tok: ['#FF8A8A', '#E3131B', '#9B0A0F'], tokRim: '#FFFFFF', tagBar: '#EF0107', run: '#FF6B6B', trail: '#FF4B4B',
      intro: ['#7A0008', '#E3131B'], introText: '#FFFFFF', card: ['#A3101A', '#3A0A10'], glow: '#FF8A8A',
      shirt: '#E3131B', shirtD: '#7E0A10', trim: '#FFFFFF', numCol: '#FFFFFF', numStroke: null, sleeves: '#F2F2F2' },
    a: { code: 'BVB', name: 'DORTMUND', col: '#FDE100', colD: '#B89F00', ink: '#111111', textCol: '#FDE100', stripe: '#111111',
      tok: ['#FFF7A8', '#FDE100', '#C9AE00'], tokRim: '#111111', tagBar: '#FDE100', run: '#FFE94D', trail: '#FDE100',
      intro: ['#FDE100', '#E8C900'], introText: '#111111', card: ['#8A7A00', '#2A2600'], glow: '#FFF27A',
      shirt: '#F7DA00', shirtD: '#A88F00', trim: '#111111', numCol: '#111111', numStroke: null }
  },
  hud: { comp: 'ŞAMPİYONLAR LİGİ · 5. HAFTA' },
  intro: { hSmall: '', hBig: 'ARSENAL', aSmall: 'BORUSSIA', aBig: 'DORTMUND', strip: 'ŞAMPİYONLAR LİGİ · LİG AŞAMASI · 5. HAFTA',
    date: '24 KASIM 2026 · 23:00 TSİ', venue: 'EMIRATES STADYUMU · LONDRA' },
  players: {
    kep: ['KEPA', 'h'], whi: ['WHITE', 'h'], kon: ['KONSA', 'h'], gab: ['GABRIEL', 'h'], hin: ['HINCAPIÉ', 'h'], lsk: ['LEWIS-SKELLY', 'h'],
    ric: ['RICE', 'h'], mad: ['MADUEKE', 'h'], ode: ['ØDEGAARD', 'h'], eze: ['EZE', 'h'], gyo: ['GYÖKERES', 'h'],
    kob: ['KOBEL', 'a'], ant: ['ANTON', 'a'], sch: ['SCHLOTTERBECK', 'a'], ben: ['BENSEBAINI', 'a'], rye: ['RYERSON', 'a'], nme: ['NMECHA', 'a'],
    bel: ['BELLINGHAM', 'a'], sve: ['SVENSSON', 'a'], kar: ['KARETSAS', 'a'], bei: ['BEIER', 'a'], sil: ['F. SILVA', 'a']
  },
  context: {
    rows: [
      { label: 'ŞL SIRASI', h: 3, a: 12, hw: .9, aw: .55, suffix: '.' },
      { label: 'ŞL PUANI', h: 10, a: 9, hw: .83, aw: .75 },
      { label: 'GALİBİYET / SON 5 MAÇ', h: 3, a: 4, hw: .6, aw: .8 }
    ],
    chips: [
      { side: 'h', title: 'SERİ', body: 'Premier Lig lideri; ŞL lig aşamasında 16 maçtır yenilmiyor' },
      { side: 'a', title: 'SERİ', body: 'Bundesliga lideri; ligde henüz yenilmedi' },
      { side: 'h', title: 'EKSİKLER', body: 'Raya (omuz) yerine Kepa. Saka ve Zubimendi yok' },
      { side: 'a', title: 'EKSİKLER', body: 'Emre Can, Konstantelias, Inácio, Kaba. Guirassy döndü' }
    ],
    footer: "ŞL'DE 8 MAÇ · ARSENAL 4 GALİBİYET · BVB 3 · 1 BERABERLİK",
    caption: "İki lig lideri karşı karşıya. Arsenal kalesinde Raya yerine Kepa var; Dortmund'da Guirassy kadroya döndü ama yedek başlaması bekleniyor."
  },
  lineup: {
    formH: 'ARSENAL · 4-2-3-1', formA: 'DORTMUND · 3-4-2-1',
    kickoff: {
      kep: [.5, .95], whi: [.84, .80], kon: [.62, .85], gab: [.38, .85], hin: [.16, .80], lsk: [.40, .70], ric: [.60, .70],
      mad: [.84, .60], ode: [.5, .62], eze: [.16, .60], gyo: [.5, .54],
      kob: [.5, .05], ant: [.30, .16], sch: [.5, .15], ben: [.70, .16], rye: [.10, .29], nme: [.40, .29], bel: [.60, .29],
      sve: [.90, .29], bei: [.36, .40], kar: [.64, .40], sil: [.5, .46]
    },
    caption: "Kaynakların çoğu Arsenal'de Kepa, Hincapié ve Ødegaard'ı, Dortmund'da 3-4-2-1 ve forvette Fábio Silva'yı bekliyor. Şüpheli: sol bek Hincapié/Calafiori, BVB'de Bensebaini/Gadou."
  },
  cards: [
    { name: 'MADUEKE', side: 'h', role: 'ARSENAL · SAĞ KANAT', line: "Svensson ile 1'e 1. Son haftaların en formda ismi.",
      fig: { shirtName: 'MADUEKE', num: '20', skin: '#5E3B29', skinD: '#45291C', hair: '#121010', hairL: '#2A2220', hairCover: .42, curly: true } },
    { name: 'RICE', side: 'h', role: 'ARSENAL · ORTA SAHA', line: 'Kornerlerin sahibi, duran top planının merkezi.',
      fig: { shirtName: 'RICE', num: '41', skin: '#EBC2A4', skinD: '#C99878', hair: '#5A3E28', hairL: '#7E5A3C', hairCover: .5 } },
    { name: 'BELLINGHAM', side: 'a', role: 'DORTMUND · ORTA SAHA', line: "Arsenal'in iki ön liberosu arasındaki boşluğun adamı.",
      fig: { shirtName: 'BELLINGHAM', num: '7', skin: '#9A6A4A', skinD: '#77513A', hair: '#17110E', hairL: '#2E231D', hairCover: .46, curly: true } },
    { name: 'FÁBIO SILVA', side: 'a', role: 'DORTMUND · SANTRFOR', line: 'Guirassy yedekteyse hücumun ucu; topu tutup kontraları başlatır.',
      fig: { shirtName: 'F. SILVA', num: '21', skin: '#C99B76', skinD: '#A57A5A', hair: '#2A1C14', hairL: '#46301F', hairCover: .5 } }
  ],
  cardsCaption: "Arsenal'de Madueke ve Rice, Dortmund'da Bellingham ve Fábio Silva maçın kaderini belirleyebilir.",
  scen: [],
  pred: {
    probLabel: 'OPTA SÜPER BİLGİSAYARI · KAZANMA OLASILIĞI',
    probs: [{ label: 'ARS', v: 65.2, side: 'h' }, { label: 'X', v: 19, side: null }, { label: 'BVB', v: 15.8, side: 'a' }],
    main: { tag: 'ANA SENARYO', score: '2 – 1', text: "Arsenal kanatlardan ve duran toplardan Dortmund'un beşli savunmasını zorlar; Dortmund geçişte bir gol bulur ama skoru çeviremez." },
    alt: { tag: 'ALTERNATİF', score: '1 – 1', text: "Dortmund ilk yarım saati golsüz geçirirse maç dengelenir; Guirassy'nin oyuna girişi kırılma anı olabilir." },
    breakLabel: 'KIRILMA NOKTASI: İLK 30 DAKİKA', breakMin: 30
  }
};

// ----- scenarios -----
const ARS_ATT = { kep: [.5, .86], whi: [.80, .52], kon: [.63, .64], gab: [.37, .64], hin: [.20, .55], lsk: [.42, .49], ric: [.60, .47], mad: [.90, .34], ode: [.58, .31], eze: [.12, .27], gyo: [.48, .20] };
const BVB_LOW = { kob: [.5, .04], ant: [.32, .13], sch: [.5, .12], ben: [.68, .13], rye: [.14, .18], sve: [.86, .19], nme: [.42, .25], bel: [.58, .25], bei: [.30, .33], kar: [.70, .33], sil: [.5, .40] };

M.scen.push({
  base: { ...ARS_ATT, ...BVB_LOW },
  moves: [[1.6, 2.4, 'sve', [.87, .29]], [1.6, 2.6, 'ben', [.75, .16]], [1.6, 2.6, 'kar', [.80, .31]], [2.6, 4.0, 'mad', [.90, .09]], [3.0, 4.2, 'sve', [.86, .15]],
    [2.6, 4.2, 'gyo', [.55, .09]], [2.6, 4.2, 'eze', [.30, .11]], [2.8, 4.4, 'ode', [.60, .20]], [3.4, 4.6, 'sch', [.54, .085]], [3.2, 4.4, 'ant', [.34, .10]], [4.3, 5.0, 'bel', [.56, .19]]],
  ball: [[0, 'ric'], [1.2, 'ric'], [2.0, 'mad'], [4.0, 'mad'], [4.5, 'ode'], [4.9, 'ode'], [5.3, [.48, -.005]]],
  runs: [['mad', 2.6, 4.0, 'drib'], ['gyo', 2.6, 4.2, 'run'], ['eze', 2.6, 4.2, 'run'], ['ode', 2.8, 4.4, 'run']],
  hls: [[2.0, 9, 'mad'], [4.4, 9, 'ode'], [1.6, 4.2, 'sve']],
  flashes: [[5.5, 7.2, 'GOL FIRSATI', 'acc', 'MADUEKE → ØDEGAARD']],
  cam: [[0, { x: .68, y: .40, dist: 74, el: 48, yaw: 12 }], [1.6, { x: .78, y: .33, dist: 62, el: 46, yaw: 16 }], [4.0, { x: .74, y: .17, dist: 54, el: 44, yaw: 14 }],
    [5.4, { x: .58, y: .14, dist: 46, el: 42, yaw: 4 }], [8.5, { x: .60, y: .18, dist: 58, el: 46, yaw: 8 }]],
  chapter: '04', kicker: 'SENARYO 1', title: 'MADUEKE SAĞ KANATTA',
  cap: "Madueke, Svensson ile 1'e 1'de çizgiye iner. Dortmund'un beşlisi ceza sahasına gömülürse geri pas, ceza yayına gelen Ødegaard'a kalır."
});
M.scen.push({
  base: { kep: [.5, .80], hin: [.30, .48], lsk: [.55, .44], whi: [.38, .18], kon: [.45, .15], gab: [.64, .17], gyo: [.50, .11], ode: [.64, .26], eze: [.38, .26], mad: [.88, .12], ric: [.985, .012],
    kob: [.5, .03], sch: [.53, .07], ant: [.46, .075], ben: [.60, .085], nme: [.44, .115], bel: [.56, .12], rye: [.36, .10], sve: [.68, .11], kar: [.42, .23], bei: [.60, .23], sil: [.50, .42] },
  moves: [[1.0, 2.3, 'gab', [.555, .06]], [1.0, 2.3, 'kon', [.42, .065]], [1.1, 2.2, 'whi', [.36, .09]], [0.8, 2.0, 'gyo', [.50, .05]], [1.4, 2.4, 'ben', [.58, .07]],
    [1.0, 2.2, 'ode', [.62, .20]], [2.5, 3.0, 'kob', [.53, .025]]],
  ball: [[0, 'ric'], [1.6, 'ric'], [2.4, [.555, .07], { h: 3.4 }], [2.55, [.555, .07]], [2.95, [.53, -.005], { h: .4 }]],
  runs: [['gab', 1.0, 2.3, 'run'], ['kon', 1.0, 2.3, 'run'], ['gyo', 0.8, 2.0, 'run']],
  zones: [[0.4, 2.6, [.56, .07, 'acc'], .07, .04]],
  hls: [[0.3, 1.8, 'ric'], [1.6, 9, 'gab']],
  flashes: [[3.1, 4.8, 'DURAN TOP TEHDİDİ', 'acc', 'RICE → GABRIEL']],
  cam: [[0, { x: .74, y: .12, dist: 62, el: 54, yaw: -4 }], [1.8, { x: .66, y: .10, dist: 56, el: 50, yaw: -2 }], [3.0, { x: .57, y: .09, dist: 48, el: 46, yaw: 2 }], [8.5, { x: .58, y: .11, dist: 56, el: 48, yaw: 4 }]],
  chapter: '05', kicker: 'SENARYO 2', title: "ARSENAL'İN SİLAHI: DURAN TOP",
  cap: "Arsenal'in ligdeki gol beklentisinin üçte biri duran toplardan geliyor. Rice'ın kornerleri ve Gabriel'in ön direk koşusu Dortmund'un en zor sınavı."
});
M.scen.push({
  base: { kob: [.5, .05], ant: [.28, .14], sch: [.5, .12], ben: [.72, .14], rye: [.08, .30], sve: [.92, .30], nme: [.44, .25], bel: [.58, .27], bei: [.32, .40], kar: [.66, .40], sil: [.50, .47],
    gyo: [.50, .22], ode: [.57, .31], eze: [.24, .24], mad: [.78, .24], ric: [.62, .40], lsk: [.40, .41], whi: [.86, .50], hin: [.16, .50], kon: [.60, .60], gab: [.40, .60], kep: [.5, .86] },
  moves: [[0.5, 1.2, 'gyo', [.50, .155]], [0.5, 1.1, 'nme', [.44, .20]], [1.1, 1.7, 'lsk', [.44, .27]], [1.0, 1.8, 'bel', [.55, .37]], [1.0, 1.8, 'ode', [.50, .25]],
    [2.1, 3.0, 'bel', [.52, .50]], [2.0, 3.8, 'bei', [.27, .73]], [2.0, 3.4, 'sil', [.47, .62]], [2.2, 3.8, 'gab', [.38, .70]], [2.2, 4.0, 'hin', [.20, .64]],
    [2.2, 3.8, 'kon', [.56, .70]], [2.0, 3.2, 'ric', [.58, .48]], [3.6, 4.2, 'kep', [.42, .88]], [3.8, 4.4, 'bei', [.35, .82]]],
  ball: [[0, 'sch'], [1.0, 'sch'], [1.4, 'nme'], [1.6, 'nme'], [2.0, 'bel'], [3.0, 'bel'], [3.8, 'bei'], [4.4, 'bei'], [4.8, [.55, .995]]],
  runs: [['bei', 2.0, 3.8, 'run'], ['bel', 2.1, 3.0, 'drib'], ['sil', 2.0, 3.4, 'run']],
  hls: [[1.6, 9, 'bel'], [2.0, 9, 'bei']],
  zones: [[2.2, 6, [.26, .72, 'danger'], .12, .08]],
  flashes: [[1.75, 2.6, 'PRES KIRILDI', 'acc', 'NMECHA → BELLINGHAM'], [5.0, 6.6, 'KONTRA TEHLİKESİ', 'danger', 'BELLINGHAM → BEIER']],
  cam: [[0, { x: .48, y: .22, dist: 64, el: 52, yaw: -6 }], [1.6, { x: .50, y: .32, dist: 56, el: 50, yaw: -4 }], [2.6, { x: .42, y: .52, dist: 66, el: 50, yaw: -10 }],
    [4.2, { x: .34, y: .76, dist: 52, el: 46, yaw: -14 }], [8.5, { x: .40, y: .78, dist: 62, el: 50, yaw: -8 }]],
  chapter: '06', kicker: 'SENARYO 3', title: "DORTMUND'UN KOZU",
  cap: "Arsenal önde baskı yaparsa Bellingham iki ön liberonun arasında topu alır. Döndüğü anda Beier'in bek arkasına koşusu Kepa'yı sınar."
});
(() => {
  const base = { kob: [.5, .04], rye: [.12, .16], ant: [.31, .13], sch: [.5, .12], ben: [.69, .13], sve: [.88, .16], bei: [.27, .27], nme: [.43, .26], bel: [.58, .26], kar: [.73, .27], sil: [.5, .42],
    kep: [.5, .80], hin: [.12, .42], gab: [.35, .56], kon: [.64, .56], whi: [.88, .42], lsk: [.40, .44], ric: [.62, .44], eze: [.07, .24], mad: [.92, .24], ode: [.50, .34], gyo: [.45, .195] };
  const moves = [];
  ['rye', 'ant', 'sch', 'ben', 'sve', 'bei', 'nme', 'bel', 'kar'].forEach(p => { const [x, y] = base[p]; moves.push([0.6, 1.6, p, [x - .05, y]]); moves.push([2.4, 3.6, p, [x + .05, y]]); });
  moves.push([4.0, 4.5, 'bel', [.55, .31]], [4.6, 5.4, 'sil', [.47, .50]], [4.7, 6.6, 'kar', [.70, .66]], [4.8, 6.4, 'kon', [.58, .64]], [4.8, 6.4, 'gab', [.40, .62]],
    [4.8, 6.2, 'ric', [.66, .52]], [4.8, 6.4, 'lsk', [.36, .50]], [6.4, 7.0, 'kep', [.53, .88]]);
  M.scen.push({
    dur: 9.0, base, moves,
    ball: [[0, 'lsk'], [0.5, 'lsk'], [1.0, 'hin'], [1.6, 'hin'], [2.2, 'lsk'], [2.4, 'lsk'], [2.9, 'ric'], [3.1, 'ric'], [3.6, 'whi'], [3.8, 'whi'], [4.2, 'ode'], [4.45, 'bel'], [4.6, 'bel'],
      [5.3, 'sil'], [5.9, 'sil'], [6.4, 'kar'], [6.7, 'kar'], [7.1, [.47, .995]]],
    runs: [['kar', 4.7, 6.6, 'run'], ['sil', 4.6, 5.4, 'run']],
    hls: [[4.4, 5.0, 'bel'], [5.2, 9, 'sil'], [5.0, 9, 'kar']],
    zones: [[0.4, 3.9, [.5, .20, 'acc'], .40, .11]],
    flashes: [[1.9, 2.9, 'SABIR TESTİ', 'acc', 'ARSENAL ÖNÜNDE PAS DÖNDÜRÜYOR'], [7.3, 8.6, '1-1 İHTİMALİ', 'danger', 'SILVA → KARETSAS']],
    goldAfter: 4.5,
    cam: [[0, { x: .5, y: .30, dist: 84, el: 56, yaw: -4 }], [3.8, { x: .52, y: .30, dist: 76, el: 54, yaw: 4 }], [5.2, { x: .55, y: .55, dist: 72, el: 50, yaw: 8 }],
      [6.8, { x: .60, y: .78, dist: 56, el: 46, yaw: 12 }], [9, { x: .56, y: .78, dist: 64, el: 50, yaw: 6 }]],
    chapter: '07', kicker: 'ALTERNATİF SENARYO', title: 'DORTMUND BLOĞU DAYANIRSA',
    cap: "Dortmund ağustostan beri ilk 30 dakikada gol yemedi. Blok dayanırsa Arsenal önünde pas döndürür; bir top kaybında Silva'nın duvarı ve Karetsas'ın koşusu skoru eşitleyebilir."
  });
})();
