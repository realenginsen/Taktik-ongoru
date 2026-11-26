// Efsanenin Hikâyesi #2 — Naim Süleymanoğlu · Cuma story teaser (Cep Herkülü film müziği 146,75→166,4)
const EP = {
  meta: { no: 2, slug: 'naim-suleymanoglu-trailer', name: 'Naim Süleymanoğlu', sport: 'Halter' }, theme: {},
  sprites: (() => { const o = {}; for (let k = 1; k <= 16; k++) o['c' + k] = { src: `assets/naim2/c${k}.png`, s: k <= 8 ? .685 : 1 }; return o; })(),
  body: { h: 1.47, sh: 1.2, th: 1.38, head: 1.0, neck: 1.35, traps: 1.6, hair: 'short', hairCol: '#16100c' },
  scenes: [
    { name: 'teaser', type: 'teaser', dur: 19.65, img: 'c16', fadeIn: 0, fadeOut: .9, leak: false, push: 0,
      cards: [
        { t: 0.0, img: 'c12', k: 'MELBOURNE · 1986', l1: 'Bir yemekten sonra ortadan kayboldu.' },
        { t: 3.43, dossier: 'BUKALEMUN', k: 'BULGAR GİZLİ SERVİSİ', l1: 'Peşine bir operasyon açtılar.' },
        { t: 6.86, img: 'c11', k: 'BİR İSİM', l1: 'Adını bile elinden aldılar.' },
        { t: 10.29, sprite: 'c7', sScale: 2.1, k: 'SEUL · 1988', l1: 'Boyu 1,47.', l2: 'Kaldırdığı 190 kilo.' },
        { t: 14.65, img: 'c16', final: true, big: ['CEP', 'HERKÜLÜ'], name: 'NAİM SÜLEYMANOĞLU', when: 'PAZAR 10:00', k: 'EFSANENİN HİKÂYESİ · BÖLÜM 2' }
      ] }
  ]
};
