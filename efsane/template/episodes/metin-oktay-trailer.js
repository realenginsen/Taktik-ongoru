// Efsanenin Hikâyesi #1 — Metin Oktay · Cuma story trailer kapanış kartı
const SP = {}; for (let k = 1; k <= 16; k++) SP['c' + k] = { src: `assets/metin/c${k}.png`, s: k <= 8 ? .62 : 1 };
const EP = {
  meta: { no: 1, slug: 'metin-oktay-trailer', name: 'Metin Oktay', sport: 'Futbol' }, theme: {}, sprites: SP, body: { h: 1.77 },
  scenes: [
    { name: 'promo', type: 'promo', dur: 3.4, img: 'c16', fadeIn: .15, fadeOut: .3, leak: false, kicker: 'EFSANENİN HİKÂYESİ · BÖLÜM 1', big: 'PAZAR 10:00', line1: 'METİN OKTAY', line2: '“Taçsız Kral”', foot: '@DEMIRALPGOALS' }
  ]
};
