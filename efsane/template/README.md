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

## Sporcu illüstrasyonları (EP.sprites) — ana karakter
Kullanıcı her sporcu için TEK bir prompt ile 3x3 poz sayfası üretir (yeşil zemin #00B140, aynı ölçek, ön açı; 9. hücre göğüs portresi).
Görsel `efsane/<slug>/kaynak/` altına konur; hücreler kesilip yeşil zemin temizlenir → `assets/<slug>/p1..p9.png` (örnek dilimleme: README altındaki komut).
`EP.sprites = {p1:{src, s}}`: s = 335 / (görseldeki_px_per_metre) / .82 — figür yüksekliği gerçek boya (m) bölünerek bulunur; bütün pozlar aynı ölçek mantığıyla.
Kullanım: `hook`/`lift` sahnesinde `sprites:[[t,'p3'],...]` (çapraz geçişli poz dizisi), `sScale` (sahne büyütmesi), `grade:'sad'`; `reveal`/`magazine` sahnesinde `portrait:'p9'`.
İllüstrasyon görünen karelere otomatik "Temsili illüstrasyon" notu düşülür. Uzak planlardaki vektör figürler `sil:true` ile siluet çizilir (köy, koridor, aile, sarılma).

Dilimleme: hücre sınırlarını beyaz ızgara çizgilerinden bul; yeşillik = G - max(R,B); alfa = clip(1 - (yeşillik-25)/45); yeşil taşmayı bastır; MinFilter(3) + hafif blur; bbox kırp; 2x Lanczos büyüt.

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

## Tek prompt kalıbı (1. bölümde kullanılan, Naim)
```text
Character pose sheet of Naim Suleymanoglu, Turkish Olympic weightlifter, Seoul 1988, age 21. Very short man (147 cm, 60 kg) with a compact, powerful but lean natural athlete build: broad shoulders, thick neck, strong arms and thighs, NOT a bodybuilder, normal proportions for his height. Short dark hair, face exactly like the reference photo. Red weightlifting singlet with white "TURKIYE" lettering, dark lifting belt, white lifting shoes, wrist wraps.
A 3x3 grid of nine full-body images, same character, same scale and same front camera angle in every cell, plain flat chroma-green background (#00B140), no shadows, nothing touching the cell edges:
1 standing relaxed, 2 rubbing chalk on his hands, 3 start position crouched over a loaded barbell, 4 pulling the barbell to mid-thigh, 5 deep front squat with barbell on shoulders, 6 split jerk with barbell overhead, 7 standing tall with barbell locked overhead, 8 celebrating with both fists raised (barbell dropped), 9 chest-up portrait, proud calm face.
Barbell loaded with red, blue, yellow and green bumper plates. Cinematic painted illustration, graphic-novel realism, warm dramatic light, not a photograph, no text other than TURKIYE, no logos, no Olympic rings.
```
Başka sporda 1–8. hücreler o sporun ikonik hareketinin aşamalarıyla değiştirilir (ör. tenis: hazırlık, top atma, servis vuruşu...). 9. hücre her zaman göğüs portresidir.

## GÜNCEL AKIŞ (v4+): tek prompt → 4x4 görsel → tüm bölüm
Kullanıcıdan her bölüm için TEK görsel istenir: 4x4 ızgara, 16 hücre.
- Hücre 1–8: yeşil zeminli, aynı ölçek ve ön açıdan, sporun ikonik hareketinin aşamaları + sevinç (sprites, `sScale: 1.6`).
- Hücre 9–15: hikâye kareleri (çocukluk, ilk antrenör, dram, kırılma anı, aile, rakip/dostluk, veda), kendi arka planlarıyla (`type: 'still'`, `img: 'c9'`, `kb` Ken Burns, `snow`, `flicker`, `stamp`, `big`, `years`).
- Hücre 16: göğüs portresi (`reveal` sahnesinde `still: 'c16'`, `magazine` sahnesinde `portrait: 'c16'`).
Örnek: `episodes/naim-suleymanoglu.js` + kaynak görsel `efsane/naim-suleymanoglu/kaynak/naim_tek_prompt_4x4.png`.
Dilimleme: hücre sınırlarını beyaz çizgilerden ölç; 1–8 yeşil anahtarlama (README yukarıda) + 3x Lanczos + UnsharpMask; 9–16 kırp + 3x büyüt. Sprite ölçeği: s = 335 / (ayakta duran figür px yüksekliği / gerçek boy m) / .82.

### 4x4 prompt kalıbı (Naim örneği — sporcuya göre uyarla)
```text
One square image divided into a 4x4 grid of 16 equal cells separated by thin white lines. The same man appears in every cell with a consistent face, hair and body: <AD>, <ÜLKE> <SPOR>, face exactly like the reference photo. <BOY cm, KİLO kg, VÜCUT YAPISI, normal proportions, SAÇ>. Style for all cells: cinematic painted illustration, graphic-novel realism, warm dramatic light, film grain, not a photograph, no logos, no Olympic rings, no text except "<FORMA YAZISI>".
Cells 1-8 (rows 1-2): <YER YIL>, age <YAŞ>, <FORMA/EKİPMAN>. Full body, front view, identical scale and camera angle in all eight, plain flat chroma-green background (#00B140), no shadows, nothing touching the cell edges. 1 ... 8 <hareket aşamaları + sevinç>.
Cells 9-16 (rows 3-4): full illustrated scenes with their own backgrounds, no green, subject centered. 9 ... 15 <hikâyenin 7 anı, yaş ve dönem belirtilerek>. 16 chest-up portrait, proud calm face, dark background.
```
Kullanıcıya: "En yüksek çözünürlükte (en az 2048, mümkünse 4096) üret, kullanım hakkın olan bir fotoğrafı yüz referansı ekle."

## Kullanıcı müziği (music_mix.py)
Kullanıcı müzik verirse sentez müzik yerine o kullanılır: `episodes/<slug>.music.json` (src, bpm, phase, drop, anchor = videodaki doruk anı, body döngüsü, outro, shape eğrisi). Önce `audio.py` (efekt izi), sonra `music_mix.py`. BPM ve drop'u ses analiziyle bul (onset otokorelasyonu, RMS sıçraması); drop'u bölümün doruk anına hizala, gövdeyi ölçü sınırlarından döngüle, hikâyenin sakin yerlerinde `shape` ile müziği boğuk/alçak yap.
Müzik vermezse audio.py'nin sentez müziği kullanılır (sabit 72 BPM, tıklamasız).

## KALICI KURALLAR (v5)
- **Süre ≤ 178 sn** (Instagram Reels sınırı 3:00). Toplam süreyi `node` ile kontrol et.
- **İlk kare asla siyah değil:** motor ilk sahnede fadeIn'i kapatır; hook dolu görüntüyle açılır. Kapak (thumb_offset) güçlü bir kareden seçilir (ör. doruk anı), siyah kare olmaz.
- **Magazin + rivayet katmanı zorunlu:** her bölümde en az 4–5 "vay be" bilgisi (dedikodu, perde arkası, kendi itirafları, çelişen anlatımlar).
- **Hukuki güvenlik:** her iddia kaynağına atfedilir (`src` alanı → ekranda "Kaynak: …"); doğrulanmamış hikâyeler `rumor` (RİVAYET rozeti) ile işaretlenir; yaşayan kişiye dair iddia varsa kendi yalanlaması/cevabı da verilir; özel kişilerin (çocuklar, eşler, isimsiz rakipler) adı verilmez; ölüm/hastalık/özel hayat yargısız, olgusal anlatılır; suç isnadı yapılmaz, sadece kaynakta yazan aktarılır.
- Sahne tipleri: `paper` (gazete sayfası: headline, sub, photo|items, stamp) ve `paper` + `style:'dossier'` (gizli dosya); tüm sahnelerde `rumor:[t0,t1]|true` ve `src:'…'`.
- Kullanıcı müziği: `mode:"story"` (şarkı doruktan ~14 sn önce girer, bir kez çalar, finalde kısa dönüş).
