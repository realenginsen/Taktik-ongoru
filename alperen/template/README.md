# Alperen maç analizi — Instagram story şablonu

Alperen Şengün'ün oynadığı her NBA maçından sonra 30–45 saniyelik dikey (1080x1920, 30 fps) story. Ses yok: özgün sentez müzik + müziğin vuruşlarına kilitli kartlar. Onaylı deneme: `videos/2026-11-25_hou-phx.mp4` (Rockets 116–104 Suns, 23/11/11 triple-double) → `template/mac_2026-11-25_hou-phx.json`.

## Dosyalar
- `template/render.py` — PIL kareleri → ffmpeg. `python3 render.py mac.json ../gorseller out.mp4 [preview t1 t2 ...]` (preview kareleri `prev/` altına).
- `template/music.py` — 120 BPM Re minör sentez müzik. `python3 music.py mac.json music.wav`. Bölüm tipleri: `intro` (riser + seyirci), `full` (davul, 808, melodi), `break` (yalnız pad + pluck), `build` (trampet rulosu + riser), `outro`, `outro_tail`. `hits` = boom + beyaz flaş + sarsıntı, `whoosh` = kart geçişleri.
- `template/slice.py` — kullanıcının 3x6'lık (18 kare) ızgaralarını keser, EDSR x4 ile büyütür, `gorseller/index.json` yazar. Gerekenler: `pip install --break-system-packages "opencv-contrib-python-headless==4.10.0.84"` + `curl -sSL -o EDSR_x4.pb https://raw.githubusercontent.com/Saafke/EDSR_Tensorflow/master/models/EDSR_x4.pb` (OpenCV 5 bu modeli açamaz). CPU'da yavaştır (~162 kare 20+ dk); yeni görsel gelmedikçe çalıştırma.
- `template/fonts/` — Bebas Neue, Anton (Türkçe karakterli). Inter sistemde: `/usr/share/fonts/opentype/inter/`.
- `gorseller/` — kare havuzu. Ad: `<kaynak>_<forma>_<no>_<poz>.jpg`. Kaynak a/b = kare hücre (~650–760 px), c = dikey ince hücre (~400x1100, düşük kalite; mümkünse a/b kullan). En iyi kalite **b** setinde.
- `state.json` — `aktif` (kilit), `posted` listesi.

## Görsel → duygu tablosu (no = ızgaradaki sıra, her forma için aynı)
| no | poz | kullan |
|---|---|---|
| 01 | kukreme | rekor/triple-double, büyük galibiyet, "TRIPLE DOUBLE" / doruk kartı |
| 02 | smac | SAYI kartı |
| 03 | post-up | sayı/oyun anlatımı |
| 04 | pas | ASİST kartı |
| 05 | ribaund-smac | RİBAUND kartı |
| 06 | uc-parmak | kilometre taşı / rekor / triple-double sayısı |
| 07 | eller-basta | mağlubiyet, kaçan son atış, kötü çeyrek |
| 08 | odak | geride kalınan çeyrek, gerilim (grade "cold" ile) |
| 09 | havlu-gurur | galibiyet finali |
| 10 | kanca | sayı anlatımı |
| 11 | penetre | geri dönüş, seri |
| 12 | blok | savunma, son dakikalar |
| 13 | isaret | taraftar, galibiyet |
| 14 | sarilma | takım galibiyeti |
| 15 | hakem | tartışmalı an, faul sorunu |
| 16 | bank-huzun | mağlubiyet finali |
| 17 | mola | gerilim, son dakikalar |
| 18 | siluet | giriş (her zaman ilk sahne), mağlubiyette sessiz final |
Forma: iç saha → kırmızı; deplasman → beyaz ya da siyah (maçta giyilen formaya yakın olanı seç). Aynı videoda tek forma.

## Akış (maç başına)
1. Box score'u en az 2 kaynaktan doğrula; kaynakları `kaynaklar` alanına yaz.
2. `template/mac_2026-11-25_hou-phx.json`'u kopyala, `mac.json` yaz. Sahne tipleri: `intro` (kicker/title/sub), `slam` (big/big2 — yalnız gerçekten büyük gecelerde: triple-double, 35+ sayı, kariyer rekoru), `stat` (num/label/notes ≤2), `story` (kicker/title/sub, `grade:"cold"` gerilim için), `record` (kicker/num/label/sub iki satır), `final` (home/hs/away/as/sub).
3. Sahne süreleri vuruşa (0,5 sn) ve ölçüye (2 sn) oturur; sahne başları 2'nin katı. Toplam 30–45 sn; final ≥ 4 sn.
4. Önizleme kareleri → AÇ BAK → tam render → `music.py` → birleştir:
```
ffmpeg -y -i video.mp4 -i music.wav -map 0:v -map 1:a -c:v copy -af loudnorm=I=-14:TP=-1.5:LRA=11 -ar 44100 -c:a aac -b:a 160k -shortest -movflags +faststart <slug>.mp4
```

## KALICI KURALLAR
- İlk kare asla siyah olmaz (intro siluet görüntüsüyle açılır).
- Metinler Instagram güvenli alanında: önemli yazılar y 1080–1720 arasında; üst 250 px'e yazı koyma.
- Rakamlar yalnızca doğrulanmış kaynaktan; çelişkide çoğunluk (ör. ESPN 10 asist yazdı, diğer 5 kaynak 11 → 11).
- Alperen'e söylemediği söz atfedilmez; anlatım 3. şahıs, ekran yazısıyla.
- Kulüp/NBA logosu eklenmez (görsellerdeki forma yazısı serbest).
- Mağlubiyette ton: hırs/rövanş (`eller-basta`, `bank-huzun`, `siluet` final); `slam` kullanılmaz.
- Final kartında skor + Alperen'in istatistik satırı + @demiralpgoals. Sıradaki maç doğrulanmışsa final `sub` altına eklenebilir.
