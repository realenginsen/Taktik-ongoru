// PSG vs AS Roma — UCL league phase MD5, 25 Nov 2026, 23:00 TSİ (21:00 CET), Parc des Princes
window.M = {
  theme: {
    acc: '#FFD23F', danger: '#B266FF',
    h: { code: 'PSG', name: 'PARIS SG', col: '#2F6BFF', colD: '#0B1A3A', ink: '#FFFFFF', textCol: '#7FA6FF', stripe: '#3BD17A',
      tok: ['#55555F', '#22222A', '#0B0B0F'], tokRim: '#3BD17A', tagBar: '#2F6BFF', run: '#6FE39A', trail: '#3BD17A',
      intro: ['#0B1A3A', '#004170'], introText: '#FFFFFF', card: ['#1F2A44', '#0A0D16'], glow: '#8FF0B4',
      shirt: '#18181C', shirtD: '#07070A', stripes: 'rgba(59,209,122,.55)', trim: '#3BD17A', numCol: '#F7D117', numStroke: null },
    a: { code: 'ROM', name: 'ROMA', col: '#A51C30', colD: '#5A0E1A', ink: '#FFFFFF', textCol: '#FF6A7D', stripe: '#F0BC42',
      tok: ['#FFFFFF', '#E9E9EE', '#B9B9C2'], tokRim: '#A51C30', tagBar: '#A51C30', run: '#FF8A9A', trail: '#FF5A6E',
      intro: ['#A51C30', '#7A1222'], introText: '#FFFFFF', card: ['#7A1222', '#2A0A10'], glow: '#FF9AA8',
      shirt: '#F2F2F4', shirtD: '#B9B9C2', trim: '#A51C30', numCol: '#A51C30', numStroke: null }
  },
  hud: { comp: 'ŞAMPİYONLAR LİGİ · 5. HAFTA' },
  intro: { hSmall: 'PARIS', hBig: 'SAINT-GERMAIN', aSmall: 'AS', aBig: 'ROMA', strip: 'ŞAMPİYONLAR LİGİ · LİG AŞAMASI · 5. HAFTA',
    date: '25 KASIM 2026 · 23:00 TSİ', venue: 'PARC DES PRINCES · PARİS' },
  players: {
    saf: ['SAFONOV', 'h'], hak: ['HAKIMI', 'h'], mar: ['MARQUINHOS', 'h'], pac: ['PACHO', 'h'], men: ['N. MENDES', 'h'], vit: ['VITINHA', 'h'],
    nev: ['J. NEVES', 'h'], fab: ['F. RUIZ', 'h'], akl: ['AKLIOUCHE', 'h'], dem: ['DEMBÉLÉ', 'h'], may: ['MAYULU', 'h'],
    svi: ['SVILAR', 'a'], man: ['MANCINI', 'a'], ndi: ["N'DICKA", 'a'], her: ['HERMOSO', 'a'], mol: ['MOLINA', 'a'], cri: ['CRISTANTE', 'a'],
    kon: ['KONÉ', 'a'], wes: ['WESLEY', 'a'], sou: ['SOULÉ', 'a'], mor: ['MORA', 'a'], mal: ['MALEN', 'a']
  },
  context: {
    rows: [
      { label: 'ŞL SIRASI', h: 1, a: 20, hw: 1, aw: .3, suffix: '.' },
      { label: 'ŞL PUANI', h: 12, a: 4, hw: 1, aw: .33 },
      { label: "ŞL'DE ATTIĞI GOL", h: 20, a: 10, hw: 1, aw: .5 }
    ],
    chips: [
      { side: 'h', title: 'FORM', body: "Tüm kulvarlarda 12 maçtır kazanıyor; Villarreal'i 6-0 yendi" },
      { side: 'a', title: 'FORM', body: "Serie A'da 2. ve yenilgisiz; Malen Parma'ya 4 gol attı" },
      { side: 'h', title: 'EKSİKLER', body: 'Kvaratskhelia ve Doué çapraz bağ sakatlığıyla yok' },
      { side: 'a', title: 'EKSİKLER', body: 'Pellegrini ve Rensch yok; Balerdi tam hazır değil' }
    ],
    footer: "İLK RESMÎ KARŞILAŞMA · LUIS ENRIQUE 2011-12'DE ROMA'YI ÇALIŞTIRDI",
    caption: "Lider PSG iki sol kanadını sakatlıkla kaybetti. Roma, Real Madrid ve Man United'a 2-0 öndeyken kaybetti; deplasmanda son 33 Avrupa maçında gol yedi."
  },
  lineup: {
    formH: 'PSG · 4-3-3', formA: 'ROMA · 3-4-2-1',
    kickoff: {
      saf: [.5, .95], hak: [.84, .80], mar: [.62, .85], pac: [.38, .85], men: [.16, .80], vit: [.5, .72], nev: [.66, .64], fab: [.34, .64],
      akl: [.82, .54], dem: [.5, .55], may: [.18, .54],
      svi: [.5, .05], man: [.30, .15], ndi: [.5, .13], her: [.70, .15], mol: [.10, .30], cri: [.40, .29], kon: [.60, .29], wes: [.90, .30],
      sou: [.34, .40], mor: [.66, .40], mal: [.5, .45]
    },
    caption: "L'Équipe PSG'de sahte 9 Dembélé'yi, İtalyan basını Roma'da 3-4-2-1'i bekliyor. Şüpheli: Mayulu/Torres, Neves/Zaïre-Emery, Mora/Dybala, Koné/De Roon."
  },
  cards: [
    { name: 'DEMBÉLÉ', side: 'h', role: 'PSG · SAHTE 9', line: "Bu ŞL'de 3 maçta 3 gol, 3 asist. Sakatlık sonrası ilk 11'e dönüyor.",
      fig: { shirtName: 'DEMBÉLÉ', num: '10', skin: '#5E3B29', skinD: '#45291C', hair: '#121010', hairL: '#2A2220', hairCover: .34 } },
    { name: 'HAKIMI', side: 'h', role: 'PSG · SAĞ BEK', line: "Sol kanat sakatken genişlik onda. Nice'te Doué'nin golünü hazırladı.",
      fig: { shirtName: 'HAKIMI', num: '2', skin: '#B9835C', skinD: '#936343', hair: '#1A1310', hairL: '#33261D', hairCover: .42, curly: true } },
    { name: 'MALEN', side: 'a', role: 'ROMA · FORVET', line: "Serie A'nın 12 golle gol kralı. Parma'ya 4 gol attı.",
      fig: { shirtName: 'MALEN', num: '14', skin: '#5E3B29', skinD: '#45291C', hair: '#121010', hairL: '#2A2220', hairCover: .38 } },
    { name: 'KONÉ', side: 'a', role: 'ROMA · ORTA SAHA', line: "Gasperini'nin adam adama planında Vitinha'nın gölgesi olacak.",
      fig: { shirtName: 'KONÉ', num: '17', skin: '#4E3123', skinD: '#3A2318', hair: '#121010', hairL: '#2A2220', hairCover: .36 } }
  ],
  cardsCaption: "PSG'de Dembélé ve Hakimi, Roma'da Malen'in bitiriciliği ve Koné'nin Vitinha'yı takibi maçı belirleyebilir.",
  scen: [],
  pred: {
    probLabel: 'OPTA SÜPER BİLGİSAYARI · KAZANMA OLASILIĞI',
    probs: [{ label: 'PSG', v: 65.2, side: 'h' }, { label: 'X', v: 18.2, side: null }, { label: 'ROM', v: 16.6, side: 'a' }],
    main: { tag: 'ANA SENARYO', score: '3 – 1', text: "Roma'nın adam adama savunması Dembélé'nin geriye gelişleriyle bozulur, PSG arkaya koşularla skoru açar. Roma golünü Malen'in geçişinden bulur." },
    alt: { tag: 'ALTERNATİF', score: '2 – 2', text: "Roma 9 maçtır gol atıyor. Koné'nin baskısı Vitinha'yı erken etkisizleştirir ve Malen fırsatları değerlendirirse Roma Paris'ten puanla dönebilir." },
    breakLabel: "KIRILMA NOKTASI: ROMA'NIN İLK PRESİ KIRILDIĞINDA", breakMin: null
  }
};

// ---- Scenario 1: PSG's weapon — Dembélé false 9 drops, N'Dicka follows (man-marking), Akliouche runs the vacated channel
M.scen.push({
  base: { saf: [.5, .95], hak: [.86, .52], mar: [.62, .74], pac: [.38, .74], men: [.14, .54], vit: [.5, .58], nev: [.64, .50], fab: [.36, .48],
    akl: [.80, .34], dem: [.50, .26], may: [.20, .32],
    svi: [.5, .06], man: [.32, .18], ndi: [.50, .18], her: [.68, .18], mol: [.12, .30], cri: [.40, .42], kon: [.54, .52], wes: [.84, .30],
    sou: [.32, .56], mor: [.62, .60], mal: [.5, .66] },
  moves: [[0.3, 1.3, 'dem', [.52, .36]], [0.4, 1.4, 'ndi', [.52, .30]], [0.6, 1.4, 'kon', [.53, .55]],
    [1.5, 2.9, 'akl', [.58, .13]], [1.6, 2.9, 'her', [.64, .16]], [1.6, 2.9, 'man', [.42, .14]], [1.5, 2.8, 'may', [.36, .14]], [2.8, 3.3, 'svi', [.54, .06]], [1.5, 2.8, 'nev', [.62, .36]]],
  ball: [[0, 'vit'], [0.6, 'vit'], [1.1, 'dem'], [1.5, 'dem'], [2.6, [.58, .135]], [2.7, 'akl'], [3.0, 'akl'], [3.4, [.46, -.005]]],
  lines: [[0.1, 1.5, ['man', 'ndi', 'her'], 'ROMA ÜÇLÜ SAVUNMA']],
  zones: [[1.2, 2.8, [.55, .17, 'acc'], .08, .05, 'BOŞALAN ALAN']],
  runs: [['dem', 0.3, 1.3, 'run'], ['akl', 1.5, 2.9, 'run'], ['may', 1.5, 2.8, 'run']],
  hls: [[0.3, 1.8, 'dem'], [0.4, 1.8, 'ndi'], [1.5, 9, 'akl']],
  goldAfter: 1.4,
  flashes: [[1.2, 2.1, 'SAHTE 9', 'acc', "N'DICKA DEMBÉLÉ'Yİ TAKİP EDİYOR"], [3.5, 5.3, 'GOL FIRSATI', 'acc', 'DEMBÉLÉ → AKLIOUCHE']],
  cam: [[0, { x: .52, y: .36, dist: 76, el: 54, yaw: 6 }], [1.5, { x: .54, y: .26, dist: 66, el: 50, yaw: 4 }], [2.9, { x: .52, y: .15, dist: 56, el: 46, yaw: 2 }], [8.5, { x: .52, y: .17, dist: 62, el: 48, yaw: 4 }]],
  kicker: "SENARYO 1 · PSG'NİN SİLAHI", title: 'SAHTE 9 VE BOŞALAN ALAN',
  cap: "Gasperini'nin Roma'sı adam adama savunur. Dembélé geriye geldiğinde N'Dicka peşinden çıkarsa üçlü savunmanın ortası boşalır; Akliouche oraya koşar."
});

// ---- Scenario 2: Roma's weapon — Koné's man-press on Vitinha, Malen runs behind the advanced Hakimi
M.scen.push({
  base: { saf: [.5, .95], hak: [.86, .48], mar: [.60, .74], pac: [.40, .74], men: [.14, .56], vit: [.52, .66], nev: [.66, .52], fab: [.34, .54],
    akl: [.80, .36], dem: [.50, .34], may: [.20, .36],
    svi: [.5, .06], man: [.32, .30], ndi: [.50, .28], her: [.68, .30], mol: [.12, .44], cri: [.44, .56], kon: [.58, .60], wes: [.86, .40],
    sou: [.34, .62], mor: [.66, .62], mal: [.56, .66] },
  moves: [[0.2, 0.9, 'kon', [.53, .67]], [1.0, 2.6, 'mal', [.76, .82]], [1.0, 2.4, 'hak', [.80, .62]], [1.2, 2.8, 'mar', [.68, .84]],
    [2.6, 3.6, 'mal', [.62, .88]], [1.0, 2.8, 'sou', [.42, .82]], [1.4, 3.2, 'pac', [.48, .86]], [3.0, 3.6, 'saf', [.55, .95]]],
  ball: [[0, 'vit'], [0.6, 'vit'], [0.9, 'kon'], [1.2, 'kon'], [2.4, [.76, .82]], [2.6, 'mal'], [3.6, 'mal'], [4.1, [.45, 1.005]]],
  lines: [[0.1, 1.6, ['men', 'pac', 'mar', 'hak'], 'PSG DÖRTLÜ SAVUNMA']],
  zones: [[1.0, 3.0, [.76, .80, 'danger'], .10, .07, 'HAKIMI ARKASI']],
  runs: [['mal', 1.0, 2.6, 'run'], ['mal', 2.6, 3.6, 'drib'], ['sou', 1.0, 2.8, 'run']],
  hls: [[0.2, 1.4, 'kon'], [0.4, 1.2, 'vit'], [1.0, 9, 'mal'], [1.0, 2.4, 'hak']],
  goldAfter: 1.0,
  flashes: [[0.9, 1.7, 'TOP KAPMA', 'danger', "KONÉ VITINHA'NIN ÜZERİNDE"], [4.2, 6.0, 'GEÇİŞ TEHLİKESİ', 'danger', 'KONÉ → MALEN']],
  cam: [[0, { x: .54, y: .62, dist: 72, el: 54, yaw: 6 }], [1.4, { x: .64, y: .72, dist: 70, el: 52, yaw: 8 }], [2.8, { x: .64, y: .84, dist: 58, el: 48, yaw: 6 }], [8.5, { x: .60, y: .84, dist: 64, el: 50, yaw: 4 }]],
  kicker: "SENARYO 2 · ROMA'NIN SİLAHI", title: "PRES VE HAKIMI'NİN ARKASI",
  cap: "Koné, Vitinha'yı adam adama takip edecek. Top kazanıldığı an Malen, ileri çıkan Hakimi'nin arkasına koşar; Serie A'da 12 golle gol kralı."
});

// ---- Scenario 3: PSG set piece — Vitinha's delivery, Fabián Ruiz attacks the far post (as at Villarreal)
M.scen.push({
  base: { vit: [.29, .27], pac: [.44, .22], mar: [.53, .21], fab: [.47, .19], nev: [.62, .22], dem: [.36, .18], akl: [.56, .32], hak: [.72, .31], may: [.80, .22], men: [.80, .50], saf: [.5, .92],
    svi: [.5, .03], man: [.37, .13], ndi: [.45, .135], her: [.54, .125], cri: [.63, .13], kon: [.49, .16], wes: [.59, .16], mol: [.40, .26], sou: [.72, .19], mor: [.30, .31], mal: [.50, .42] },
  moves: [[0.8, 2.0, 'fab', [.62, .07]], [0.8, 2.0, 'pac', [.39, .07]], [0.9, 2.0, 'mar', [.50, .10]], [0.9, 2.0, 'nev', [.72, .13]],
    [1.0, 2.0, 'her', [.565, .085]], [1.0, 2.0, 'ndi', [.43, .09]], [1.0, 2.0, 'cri', [.67, .095]], [2.2, 2.6, 'svi', [.54, .03]]],
  ball: [[0, 'vit'], [1.4, 'vit'], [2.2, [.62, .07], { h: 3.2 }], [2.35, [.62, .07]], [2.75, [.55, -.005], { h: .5 }]],
  zones: [[0.4, 4.0, [.62, .075, 'acc'], .06, .035, 'ARKA DİREK']],
  runs: [['fab', 0.8, 2.0, 'run'], ['pac', 0.8, 2.0, 'run'], ['mar', 0.9, 2.0, 'run']],
  hls: [[0, 1.6, 'vit'], [1.2, 9, 'fab']],
  goldAfter: 1.2,
  flashes: [[2.9, 4.6, 'DURAN TOP', 'acc', 'VITINHA → F. RUIZ']],
  cam: [[0, { x: .40, y: .20, dist: 66, el: 54, yaw: -8 }], [1.6, { x: .50, y: .13, dist: 50, el: 50, yaw: -2 }], [2.6, { x: .56, y: .10, dist: 44, el: 46, yaw: 2 }], [8.5, { x: .56, y: .12, dist: 50, el: 48, yaw: 2 }]],
  kicker: 'SENARYO 3 · DURAN TOP', title: "VITINHA'NIN ORTASI",
  cap: "PSG, Villarreal'e attığı 6 golün 2'sini duran toptan buldu; biri Vitinha'nın serbest vuruşundan Fabián Ruiz'in golüydü. Roma'nın adam adama yapısı arka direği açık bırakabilir."
});
