# Efsanenin Hikâyesi — belgesel video şablonu

Dikey (1080x1920, 30 fps) 2:30–3:00 dk sporcu belgeseli. Canvas 2D sahne motoru (engine.js), Playwright ile kare render, ffmpeg, sıfırdan sentezlenmiş müzik/efekt (audio.py).

## Kurulum
```
npm i            # @fontsource/playfair-display, inter, bebas-neue, world-atlas, topojson-client
pip install playwright numpy scipy pillow --break-system-packages   # varsa atla
# /usr/bin/google-chrome yoksa: python3 -m playwright install chromium ve render.py'de executable_path'i kaldır
node build_geo.js   # geo.js (Natural Earth 50m ülke sınırları) — repoda hazır, sadece yoksa
```

## Bölüm başına iş akışı
1. `episodes/<slug>.js` yaz (örnek: `episodes/naim-suleymanoglu.js`). Her sahne: `{name, type, dur, mood, header:[[t,kicker,başlık,(boyut)]], subs:[[t0,t1,metin]], sfx:[[t,ad]], (duck), ...tip alanları}`.
   Altyazı süresi: kelime × 0,35 sn + 1 sn; en fazla 2 satır.
2. Önizleme: `EPI=<slug> python3 render.py preview sahne:t sahne:t ...` → `prev_<slug>/` karelerini AÇIP BAK.
3. Tam render: `EPI=<slug> python3 render.py full` → `out_<slug>/*.mp4` + `audio_events_<slug>.json` (~5-6 dk)
4. Ses: `EPI=<slug> python3 audio.py` → `audio_<slug>.wav`
5. Birleştir:
```
(for s in <sahne adları sırayla>; do echo "file 'out_<slug>/$s.mp4'"; done) > list.txt
ffmpeg -f concat -safe 0 -i list.txt -c copy joined.mp4
ffmpeg -i joined.mp4 -i audio_<slug>.wav -map 0:v -map 1:a -c:v copy -af loudnorm=I=-14:TP=-1.5:LRA=11 -ar 44100 -c:a aac -b:a 160k -shortest -movflags +faststart final.mp4
```

## Sporcu vücudu (EP.body) — her bölümde ZORUNLU
Figür gerçek ölçekte çizilir (sahne: 1 m ≈ 335 px; platform 4 m, bar 2,2 m). Sporcunun gerçek boyunu ve yapısını araştırıp ver:
`body: { h: boy_m, sh: omuz_genişliği (1=ortalama), th: kas_kalınlığı, neck, traps, head, hair: 'short'|'curly'|'long'|'bald', hairCol, skin, skinD }`
Örnek: Naim (1,47 m, kompakt, çok kaslı) `{h:1.47, sh:1.2, th:1.38, neck:1.35, traps:1.6}`; uzun ince bir koşucu `{h:1.95, sh:1.0, th:.85, traps:.6}`.
Kıyafet: `opt.outfit = {top, pants}` (takım elbise, eşofman vb.). Yüz yok; figür arkadan.

## Sahne tipleri (engine.js DRAW.*)
- `hook` kalabalık + spot + figür (`pose` zaman çizgisi, `back` sırt yazısı, `chalk` tebeşir anları, `flashes` foto flaşları)
- `title` seri başlığı · `reveal` büyük isim + lakap (`lines`, `nick`)
- `map` animasyonlu harita: `cam:[[t,lon,lat,ölçek]]`, `hl:{ÜlkeAdı:renk}` (Natural Earth İngilizce adları), `routes` (`plane:true` uçak simgesi), `pins`
- `village` alacakaranlık köy, parallaks dağlar, patikada yürüyen çocuk · `gym` çocukluk salonu + büyük sayı
- `corridor` tek kaçış noktalı koridor, uzaklaşan figür, ışığa açılan kapı (`doorT`) · `family` sınırın iki yanında aile / sporcu, kar, yıl sayacı
- `board` kalkış panosu + damga · `idcard` kimlik kartı isim değişimi · `counter` sayaç + para yağmuru + `quote` alıntı kartı
- `lift` kaldırış (pose, attempts, big[count], roar, drop, xs, `lights` hakem ışıkları, chalk, flashes, zoom/zoomOut, whip)
- `duel` iki sporcu tablosu (satır başına hakem ışıkları) · `hug` iki sporcu sarılır · `medals` · `magazine` dergi kapağı (logosuz) → Washington
- `memorial` veda (items: years+mum / order / metro / house / sign / film; `full:true` tam ekran) · `outro` istatistik + "Sıradaki efsane kim olsun?"
Genel: `push` (yavaş kamera itmesi), `shake:[[t,şiddet]]`, `leak:false` (ışık sızıntısını kapat), `flash:[t]`.
Halter dışı sporlar için yeni sahne tipleri (saha, kort, ring, pist, havuz) ve pozlar eklenir; mevcut tipler bozulmaz.

## Müzik (audio.py) — akışla yükselip alçalır
- Her sahnede `mood` + `energy:[[t,0..1]]` eğrisi ver. Enerji katmanları açar: <.3 yalnız pad/piyano; >.3 bas; >.55 ostinato + taiko; >.78 trampet, koro, bakır.
- Tempo ruh haline göre 66–104 BPM arasında yumuşak geçer. Özgün 8 ölçülük Re minör ana tema: sakin bölümde piyano, doruk anlarda yaylı+bakır.
- Büyük andan önce: `duck` ile müziği kıs, `heart`/`riser` koy; anın kendisinde enerji 1 + `hit`/`boom`/`roar`. Sahne geçişlerinde `whoosh`/`reverse`.
- Ruh halleri: tension, hit, warm, dark, escape, rise, epic, sad, elegy, outro. Efektler: heart, hit, boom, riser, reverse, whoosh, ping, stamp, scratch, tick, tickroll, roar, gasp, murmur, plane, shutter, plate, clang, buzz, chime.
