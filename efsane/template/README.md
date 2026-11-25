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

## Sahne tipleri (engine.js DRAW.*)
- `hook` kalabalık + spot + figür (`pose` zaman çizgisi, `back` sırt yazısı)
- `title` seri başlığı · `reveal` büyük isim + lakap (`lines`, `nick`)
- `map` animasyonlu harita: `cam:[[t,lon,lat,ölçek]]`, `hl:{ÜlkeAdı:renk}` (Natural Earth İngilizce adları), `routes`, `pins`
- `gym` çocukluk salonu + büyük sayı (`big`) · `board` kalkış panosu + damga · `idcard` kimlik kartı isim değişimi
- `counter` sayaç (`from,to,pre,post,label`) · `lift` kaldırış (pose, attempts, big, roar, drop, xs) · `medals` · `duel` iki sporcu karşılaştırma tablosu
- `memorial` veda (items: order / years / sign / film) · `outro` istatistik kartı + "Sıradaki efsane kim olsun?" çağrısı
Halter dışı sporlar için yeni sahne tipleri (saha, kort, ring, pist) ve pozlar eklenir; figür her zaman ARKADAN/siluet, yüz yok, logo yok, gerçek fotoğraf yok.

## Müzik ruh halleri (mood)
tension, hit, warm, dark, escape, rise, epic, sad, elegy, outro. Efektler: heart, hit, whoosh, ping, stamp, scratch, tick, tickroll, roar, plate, clang, buzz, chime.
