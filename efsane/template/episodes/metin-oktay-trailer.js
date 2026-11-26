// Efsanenin Hikâyesi #1 — Metin Oktay · Cuma story teaser (Ezel jenerik intro vuruşlarına kilitli)
const SP = {}; for (let k = 1; k <= 16; k++) SP['c' + k] = { src: `assets/metin/c${k}.png`, s: k <= 8 ? .62 : 1 };
const EP = {
  meta: { no: 1, slug: 'metin-oktay-trailer', name: 'Metin Oktay', sport: 'Futbol' }, theme: {}, sprites: SP, body: { h: 1.77 },
  scenes: [
    { name: 'teaser', type: 'teaser', dur: 21.6, img: 'c16', fadeIn: 0, fadeOut: .9, leak: false, push: 0,
      cards: [
        { t: 0.03, img: 'c12', k: '1959 · DOLMABAHÇE', l1: 'Bir şut ağları deldi.' },
        { t: 4.17, cheque: true, k: 'FENERBAHÇE · 1957', l1: 'Ona açık çek uzattılar:', l2: '“Rakamı sen yaz.”' },
        { t: 8.31, img: 'c13', k: 'TOPTAŞI CEZAEVİ', l1: 'Çıktığı gün iki gol attı.' },
        { t: 12.45, img: 'c11', k: 'BİR SEÇİM', l1: '“Ben mi, Galatasaray mı?”' },
        { t: 16.59, img: 'c16', final: true, name: 'METİN OKTAY', when: 'PAZAR 10:00', k: 'EFSANENİN HİKÂYESİ · BÖLÜM 1' }
      ] }
  ]
};
