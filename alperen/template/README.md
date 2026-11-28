# Alperen maç analizi — Instagram story şablonu (v2, onaylı)

Her Houston Rockets maçından sonra Alperen Şengün'ün maç analizi: dikey 1080x1920, 30 fps, ~44–52 sn. Yayın grafiği tarzı (koyu antrasit zemin, Rockets kırmızısı, Bebas Neue + Inter). Ses yok: özgün sentez müzik (120 BPM) + vuruşa kilitli grafikler + şut sesleri.
Onaylı örnek: `videos/2026-11-25_hou-phx_analiz.mp4` ← `template/mac_2026-11-25_hou-phx.json` (kullanıcı 28.11.2026'da onayladı). Fotoğraflar SADECE küçük yuvarlak rozet (≤260 px); büyük/tam ekran foto YASAK.

## Kurulum
```
pip install --break-system-packages numpy scipy pillow   # yoksa
cd alperen/template && ln -sf fonts fonts 2>/dev/null; ls fonts   # Bebas Neue burada; Inter: /usr/share/fonts/opentype/inter/
```
Inter yoksa: `curl -sSL -o fonts/Inter.ttf https://raw.githubusercontent.com/google/fonts/main/ofl/inter/Inter%5Bopsz,wght%5D.ttf` ve render.py'deki IB/IK/IM yollarını ona çevir.

## Komutlar (alperen/template içinden)
```
python3 render.py mac.json ../gorseller x.mp4 preview 2.5 8 15 24 30 36.5 40 46   # prev/ karelerini AÇ BAK
python3 render.py mac.json ../gorseller video.mp4
python3 music.py mac.json music.wav
ffmpeg -y -i video.mp4 -i music.wav -map 0:v -map 1:a -c:v copy -af loudnorm=I=-14:TP=-1.5:LRA=11 -ar 44100 -c:a aac -b:a 160k -shortest -movflags +faststart ../videos/<YYYY-MM-DD>_hou-<rakip>_analiz.mp4
```

## VERİ (hafızadan rakam yok)
1. Maçın ESPN gameId'si: WebFetch `https://site.api.espn.com/apis/site/v2/sports/basketball/nba/scoreboard?dates=YYYYMMDD` (ABD tarihi) → Rockets maçının `id`'si, skor, iç saha/deplasman, durum "Final".
2. Şutlar + box score: WebFetch `https://site.api.espn.com/apis/site/v2/sports/basketball/nba/summary?event=<id>`. Sayfa ~450 bin karakter: offset 0, 100000, 200000, 300000, 400000 ile HEPSİNİ oku. Prompt: "List EVERY play where Alperen Sengun is the shooter (field goals made/missed/blocked and free throws), in order: period.number, clock.displayValue, full text, scoringPlay, scoreValue, coordinate.x, coordinate.y". Bir offsette box score'u da iste (MIN, FG, 3PT, FT, OREB, DREB, AST, STL, BLK, TO, PF, +/-) ve çeyrek skorlarını.
3. ESPN'de box score eksikse CBS: `https://www.cbssports.com/nba/gametracker/boxscore/NBA_<YYYYMMDD>_<DEP>@<EV>/` (kodlar: HOU, PHO, LAL…). CBS şut tiplerini (kanca, turnike, smaç) de verir.
4. KONTROL: şut listesindeki FGA/FGM/3PA/3PM/FTA/FTM ve toplam sayı box score ile birebir tutmalı (2×ikilik + 3×üçlük + FT = sayı). Tutmuyorsa eksik şutu offsetleri yeniden okuyarak bul; bulunamazsa videoyu yapma, kullanıcıya bildir.
5. Koordinatlar: ESPN x 0–50 (pota x=25), y = potadan uzaklık (ft). Serbest atışlarda koordinat -214748340 (yok say). Üçlük kanat/köşe: |x-25| > 21 ve y < 9 → KÖŞE; değilse x<25 SOL KANAT (x<17) / ORTA (17–33) / SAĞ KANAT (x>33).
6. Bölgeler: pota dibi = mesafe ≤ 4,5 ft; boyalı alan = 4,5–14 ft ve 17≤x≤33; orta mesafe = diğer ikilikler; üçlükler bölge bölge.
7. Kilometre taşı (triple-double, kariyer rekoru, kulüp tarihi) ve takımın sıradaki maçı web'de en az 2 kaynakla doğrulanır.

## mac.json alanları (örneğe bak)
`match` (date, comp: "NBA" | "NBA CUP" | "PLAY-OFF"…, home/away kodları, hs/as = ev/dep skoru, venue), `line`, `quarters` (her çeyrek: Alperen sayı, fg, ft?, team=[HOU, rakip]), `shots` (q, clk, tip TÜRKÇE BÜYÜK HARF: KANCA, FADEAWAY, TURNİKE, PENETRE TURNİKE, SMAÇ, TAMAMLAMA, İKİLİK, ORTA MESAFE, ÜÇLÜK · SOL KANAT…; bloklanan şuta "· BLOK" ekle; ft, x, y, m, three), `zones` (rim, paint, mid, left, right, corner — "isabet/deneme"), `fts` ([çeyrek, dakika, 1/0]), `insights` (map: 3 satır, quarters: 2 satır, ft, ft_tag, play, record, record_title), `scenes`, `sections`, `hits`, `whoosh`, `shot_sfx`, `shot_t0`, `shot_dt`, `zone_t`, `jersey`.
- HOU deplasmandaysa header'da yine `home`=HOU yazılır ama "@" ile: home "HOU", away "@PHX" gibi; skorlar HOU önce.
- Rozet fotoğrafları `../gorseller/b_<jersey>_<no>_<poz>.jpg` (ad listesi aşağıda). İç saha kirmizi, deplasman beyaz/siyah.

## Sahne düzeni ve zamanlama (120 BPM; vuruş 0,5 sn, ölçü 2 sn; sahne başları 2'nin katı)
| sahne | süre | içerik |
|---|---|---|
| intro | 4 | skor kartı + rozet + "ALPEREN · MAÇ ANALİZİ" (ilk kare boş değil) |
| card | 6 | 6 kutu: SAYI, RİBAUND (hücum alt yazı), ASİST, SAHA İÇİ, ÜÇLÜK, SERBEST ATIŞ; triple-double/double-double rozeti, alt satır |
| map | 16 (şut sayısına göre 14–20) | şutlar zaman sırasıyla, her vuruşta bir şut (shot_t0 = sahne başı + 1, shot_dt = 0,5; 24+ şutta 0,25); sonra zone_t'de bölge özeti + 3 içgörü |
| quarters | 8 | çeyrek çubukları + takım çeyrek skorları + 2 içgörü |
| ft | 4 | serbest atış topları (FTA=0 ise sahneyi çıkar, süreyi diğerlerine dağıt) |
| play | 4 | asist/top kaybı + hücum ribaundu (ya da maçın öne çıkan diğer katkısı: blok, top çalma) |
| final | 6 | kilometre taşı ya da maçın özeti + istatistik satırı + @demiralpgoals |
Müzik bölümleri: intro(intro) → card(full, hit) → map şutlar(groove) → bölge özeti(build) → quarters(full, hit) → ft(break) → play(full, hit) → final(outro, hit) → son 2 sn outro_tail. `shot_sfx` = her şut ve serbest atış için [zaman, isabet].

## Rozet görselleri (no_poz)
01_kukreme 02_smac 03_post-up 04_pas 05_ribaund-smac 06_uc-parmak 07_eller-basta 08_odak 09_havlu-gurur 10_kanca 11_penetre 12_blok 13_isaret 14_sarilma 15_hakem 16_bank-huzun 17_mola 18_siluet
Galibiyet finali: 06_uc-parmak (rekor) / 09_havlu-gurur / 13_isaret. Mağlubiyet: 07_eller-basta, 16_bank-huzun; card rozeti 08_odak.

## KALICI KURALLAR
- Analiz önce gelir: şut haritası, bölgeler, serbest atış, çeyrekler ZORUNLU. Fotoğraf yalnız küçük rozet.
- Her rakam doğrulanmış veriden; içgörüler veriden hesaplanır (ör. "kancalar 2/6", "ikinci yarı 4/7"). Yorum abartısız, hakaret/suçlama yok.
- Mağlubiyette ton dürüst: zayıf yanları da yaz (ör. top kaybı, serbest atış), "slam/kutlama" dili yok.
- Alperen'e söylemediği söz atfedilmez.
- Kulüp/NBA logosu yok. Instagram güvenli alanı: üst 250 px'e yazı koyma; önemli içerik y 260–1620.
- Önizleme karelerinde taşan/çakışan etiket varsa (özellikle bölge etiketleri şut işaretlerinin üstüne binerse) etiket konumunu kaydır.
