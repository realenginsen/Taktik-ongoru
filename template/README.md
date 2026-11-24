# Taktik Öngörü — maç önizleme video şablonu

Dikey (1080x1920, 30 fps) Instagram Reels videosu üretir: 3B taktik simülasyon, yayın tarzı grafikler, özgün müzik + efektler.

## Kurulum (yeni ortamda)
```
npm i @fontsource/bebas-neue @fontsource/inter @fontsource/barlow-condensed
pip install playwright numpy scipy --break-system-packages   # playwright zaten varsa atla
# Chromium: /usr/bin/google-chrome kullanılıyor; yoksa: python -m playwright install chromium  ve render.py'de executable_path'i kaldır
```

## Maç başına iş akışı
1. `matches/<kod>.js` dosyasını oluştur (örnekler: `ars_bvb.js`, `rma_psv.js`). Şema aşağıda.
2. Önizleme kareleri: `MATCH=<kod> python3 render.py preview intro:2.5 context:4 lineups:4 cards:4 s1:3 s2:3 pred:6`
   → `prev_<kod>/` altındaki kareleri MUTLAKA açıp bak (çakışan etiket, kadraj dışı oyuncu, okunmayan metin).
3. Tam render: `MATCH=<kod> python3 render.py full` → `out_<kod>/*.mp4` + `audio_events_<kod>.json`
4. Ses: `MATCH=<kod> python3 audio.py` → `audio_<kod>.wav` (özgün müzik + efekt, telifsiz)
5. Birleştir:
```
(for s in intro context lineups cards s1 s2 ... pred; do echo "file 'out_<kod>/$s.mp4'"; done) > list.txt
ffmpeg -f concat -safe 0 -i list.txt -c copy joined.mp4
ffmpeg -i joined.mp4 -i audio_<kod>.wav -map 0:v -map 1:a -c:v libx264 -preset medium -crf 22 -pix_fmt yuv420p -c:a aac -b:a 192k -shortest -movflags +faststart final.mp4
```

## Instagram kapak görseli
Video siyah ekranla (intro fade-in) başlar; Instagram varsayılan kapak olarak ilk kareyi aldığı için profilde siyah görünür.
`create_video_post` çağrısında MUTLAKA `thumb_offset: 2500` (ms) ver: kapak, maç adının tam göründüğü intro karesi olur.

## Koordinatlar
Saha normalize: x 0..1 (soldan sağa), y 0..1 (0 = üst kale, 1 = alt kale). Ev sahibi ('h') ALTTA, yukarı (y→0) hücum eder.
Deplasman ('a') ÜSTTE. Deplasmanın sağ beki/sağ kanadı ekranda SOLDA durur.

## matches/<kod>.js şeması
- `theme.acc` / `theme.danger`: iki takımın renkleriyle ÇAKIŞMAYAN vurgu ve tehlike renkleri.
- `theme.h` / `theme.a`: code, name, col, colD, ink, textCol, stripe, tok[3], tokRim, tagBar, run, trail, intro[2], introText, card[2], glow, shirt, shirtD, trim, numCol, numStroke, (sleeves), (stripes)
- `intro`: hSmall, hBig, aSmall, aBig, strip, date (TSİ), venue
- `players`: id → [GÖRÜNEN AD, 'h'|'a']
- `context`: rows[{label,h,a,hw,aw,suffix}], chips[4 × {side,title,body}], footer, caption
- `lineup`: formH, formA, kickoff{id:[x,y]}, caption (şüpheli pozisyonları yaz)
- `cards`: 4 × {name, side, role, line, fig:{shirtName,num,skin,skinD,hair,hairL,hairCover,(curly),(bun)}} — oyuncu ARKADAN, yüz yok. Numaraları UEFA kadro listesinden doğrula.
- `scen`: 2–4 senaryo. Her biri: base{id:[x,y]}, moves[[t0,t1,id,[x,y]]] (aynı oyuncunun hareketleri zamanda çakışmamalı),
  ball[[t, id | [x,y], ({h:yükseklik})]], runs[[id,t0,t1,'run'|'drib']], hls[[t0,t1,id]],
  zones[[t0,t1,[x,y,'acc'|'danger'],rx,ry,(etiket)]], lines[[t0,t1,[savunmacı id'leri],etiket]] (savunma çizgisi),
  flashes[[t,t_end,METİN,'acc'|'danger',ALT METİN]], cam[[t,{x,y,dist,el,yaw}]], kicker, title, cap, (dur), (goldAfter)
- `pred`: probs[{label,v,side}] + probLabel (Opta vb. varsa) YA DA consensusLabel + consensus; main/alt {tag,score,text}; breakLabel; breakMin (sayı ya da null)

## Analiz kuralları (kalıp senaryo YOK)
- Kadro: her takımın KENDİ ülke basını (İng: BBC/Sky/Sports Mole; İsp: Marca/AS; İta: Gazzetta/Corriere dello Sport/Sky Italia;
  Alm: kicker/Ruhr Nachrichten; Fra: L'Équipe; Hol: VI/ED/Voetbalzone; Tür: Fanatik/A Spor/Fotomaç) + basın toplantısı + sakat/cezalı listesi.
  En az 3 kaynak, pozisyon bazında çoğunluk; şüpheli pozisyonlar videoda yazılır.
- Senaryolar maçın hikâyesinden çıkar: son maçlarda nasıl gol atıp yedikleri, güçlü/zayıf yönler, eksiklerin yarattığı boşluk,
  kilit eşleşmeler, duran top, pres/savunma çizgisi. Her senaryo FARKLI tipte olmalı; sayı 2–4 arası maça göre değişir.
- Alternatif skor da o maçın verisine dayanır (ör. "PSV erken gol bulursa"); her maçta aynı "blok dayanırsa" kurgusu kullanılmaz.
- Rakamlar sadece kaynaklı. Bahis tavsiyesi yok.
