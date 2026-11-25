# Story şablonları (DemiralpGoals "Bugün TV'de")
- esnaf_lokantasi_ornek.html / .jpg: onaylanmış örnek (25 Kasım 2026). Stil, ton ve yerleşim referansı.
- HTML, fontları `node_modules/@fontsource/...` göreli yolundan yükler: şablonu kopyaladığın klasörde
  `npm i @fontsource/bebas-neue @fontsource/inter @fontsource/caveat @fontsource/playfair-display` çalıştır.
- Render: `python3 render.py /abs/yol/story.html /abs/yol/story.png` (1080x1920), sonra Pillow ile kalite 90 JPEG.
- Üst ve alt ~200 px dekor; kritik bilgi 205–1715 px arasında kalır. Taşma kontrolü: `.wrap` scrollHeight <= clientHeight.
