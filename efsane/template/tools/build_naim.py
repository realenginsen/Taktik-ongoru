import json, numpy as np, subprocess
VOF='voice/naim_vo_cem.mp3'
_sr=22050
_x=np.frombuffer(subprocess.run(['ffmpeg','-loglevel','error','-i',VOF,'-ac','1','-ar',str(_sr),'-f','f32le','-'],capture_output=True).stdout,np.float32)
_w=int(.01*_sr); _F=_w/_sr; _db=np.array([20*np.log10(np.sqrt(np.mean(_x[i:i+_w]**2))+1e-9) for i in range(0,len(_x)-_w,_w)])
def snap_end(t):
    i=int((t-.35)/_F)
    while i<len(_db)-6 and not (_db[i:i+6]<-58).all(): i+=1
    return min(i*_F+.06, t+.3)
def snap_start(t):
    j=int((t+.15)/_F)
    while j>3 and not ((_db[j-4:j]<-58).all() and _db[j]>=-58): j-=1
    return max(j*_F-.04, t-.5)
S={'n1a':(0.16,2.48,'Seul, 1988.'),'n1b':(2.56,4.58,'Boyu: 1,47 metre.'),'n1c':(5.04,6.88,'Barda... 190 kilo.'),
'n2a':(8.13,11.16,'Bulgaristan, Kırcaali. Türk bir ailenin oğlu.'),'n2b':(11.44,13.6,'Babası hem madenci, hem çiftçi.'),'n2c':(14.06,16.28,'9 yaşında bir antrenör onu fark ediyor.'),
'n2d':(16.48,18.32,'10 yaşında ailesinden ayrılıyor.'),'n2e':(18.4,20.16,'15’inde... dünya rekoru.'),'n2f':(20.54,21.44,'Kendi sözleriyle:'),'n2q':(21.76,25.2,None),
'n3a':(25.68,27.84,'Sonra bir gün, adı elinden alınıyor.'),'n3b':(28.27,31.04,'Bulgaristan’daki Türklerin isimleri zorla değiştiriliyor.'),'n3c':(31.42,33.82,'Naim’in yeni adı: Naum Şalamanov.'),
'n4a':(34.24,37.12,'Aralık 1986. Melbourne.'),'n4b':(37.19,40.24,'Yarışmanın ardından bir yemek... ve ortadan kayboluyor.'),
'n4c':(40.54,44.8,'Nasıl kaçtığına dair üç ayrı anlatım var. Hangisi doğru, hâlâ bilinmiyor.'),
'n4d':(45.15,49.52,'Bulgar gizli servisi peşine düşüyor. Dosyadaki operasyonun adı: Bukalemun.'),
'n4e':(49.65,52.4,'Ahmet Özal’a göre bu, bir ajanlar savaşıydı.'),'n4f':(52.47,54.4,'Özal’ın uçağı onu Ankara’ya getiriyor.'),'n4g':(54.64,56.96,'Adı yeniden: Naim Süleymanoğlu.'),
'n5a':(57.03,59.04,'Ama ailesi Bulgaristan’da kalıyor.'),'n5b':(59.26,61.76,'Olimpiyata çıkabilmesi için Türkiye ödeme yapıyor.'),'n5c':(62.0,63.76,'Belgelere göre 1 milyon dolar.'),'n5d':(63.92,65.92,'Bazı kaynaklara göre... 7 milyon.'),
'n6a':(66.32,69.04,'Seul. Koparmada 152,5 kilo.'),'n6b':(69.12,71.36,'Silkmede bar, 190’a çıkıyor...'),
'n6c':(71.43,73.68,'Kendi ağırlığının üç katından fazlası.'),'n6d':(73.84,75.84,'O gece, altı dünya rekoru.'),'n6e':(75.91,77.68,'Ve Time dergisinin kapağı.'),
'n7a':(77.75,78.68,'Hiç evlenmiyor.'),'n7b':(78.8,82.08,'Kendi itirafıyla: “Evlenmedim... ama çocuklarım var.”'),'n7c':(82.15,83.84,'Yakınlarına göre şöyle derdi:'),'n7q':(83.92,86.88,None),
'n7d':(86.95,91.28,'Yakın dostu bir gazeteci, onun halter dersinden sınıfta kaldığını bile haber yapıyor.'),'n7e':(91.52,92.8,'Naim... kızmıyor.'),
'n8a':(93.4,96.96,'Atlanta 1996. Karşısında Yunan Leonidis.'),'n8b':(97.09,101.44,'Rekorlar el değiştiriyor... ve Leonidis 190 kiloda başarısız oluyor.'),
'n8c':(101.52,104.48,'Naim, üç olimpiyat altını kazanan ilk halterci.'),'n8d':(104.61,106.24,'Ve ağlayan rakibine sarılıyor.'),
'n9a':(106.64,109.6,'Sidney 2000. Dördüncü altın için dönüyor.'),'n9b':(109.92,111.84,'Üç deneme... üçü de başarısız.'),
'n10a':(112.36,114.8,'Hastalığını gizliyor: “Kimseye söylemeyin.”'),'n10b':(114.88,118.0,'18 Kasım 2017. Elli yaşında.'),
'n11a':(118.08,120.4,'Bir metre kırk yedi santim...'),'n11b':(120.47,122.82,'Ama dünya, ona tek bir isim verdi:')}
J=lambda o: json.dumps(o,ensure_ascii=False)
def V(at, ids):
    s0=max(0,snap_start(S[ids[0]][0])); s1=snap_end(S[ids[-1]][1]); subs=[]
    for k in ids:
        a,b,tx=S[k]
        if tx: subs.append([round(at+a-s0,2), round(at+b-s0+.45,2), tx, 1])
    return [round(at,2), round(s0,2), round(s1,2)], subs, round(at+s1-s0,2)
def at_of(at, ids, k): return round(at+S[k][0]-max(0,snap_start(S[ids[0]][0])),2)
def vob(clips):
    vos=[];subs=[]
    for at,ids in clips: v,sb,_=V(at,ids); vos.append(v); subs+=sb
    return f"vo: {J(vos)}, subs: {J(subs)}"
def end(at,ids): return V(at,ids)[2]
sc=[]; add=sc.append
add(f"""{{ name: 'hook', type: 'hook', dur: 7.8, mood: 'tension', back: 'TÜRKİYE', leak: false, sprites: [[0, 'c2'], [4.6, 'c3']], sScale: 1.6, flashes: [[0, 7.8, 7]],
  header: [[.3, 'SEUL · 1988', '60 KG']], {vob([(.4,['n1a','n1b','n1c'])])}, sfx: [[0, 'heart'], [4.6, 'riser']] }}""")
add("""{ name: 'title', type: 'title', dur: 3, mood: 'hit', fadeIn: .05, leak: false, push: .05, shake: [[.05, 10]], sfx: [[.05, 'hit'], [.05, 'boom']] }""")
add(f"""{{ name: 'dogum', type: 'map', dur: 4.2, mood: 'warm', cam: [[0, 22, 46, 10], [3.0, 25.4, 42.0, 78], [4.2, 25.4, 41.8, 86]], hl: {{ Bulgaria: '#5b4524', Turkey: '#7a1a1a' }},
  pins: [{{ lon: 25.37, lat: 41.65, label: 'KIRCAALİ', t: 2.2 }}], header: [[0, 'BULGARİSTAN · KIRCAALİ', '23 OCAK 1967', 84]], {vob([(.3,['n2a'])])}, sfx: [[2.2, 'ping']] }}""")
add(f"""{{ name: 'koy', type: 'still', img: 'c9', kb: {{ z0: 1.02, z1: 1.16, y0: .02, y1: -.03 }}, dur: 5.6, mood: 'warm', push: .02, header: [[0, 'RODOPLAR', 'ÇOCUKLUK']], {vob([(.3,['n2b','n2c'])])} }}""")
ok=['n2d','n2e','n2f','n2q']
add(f"""{{ name: 'okul', type: 'still', img: 'c10', kb: {{ z0: 1.12, z1: 1.0, x0: .03, x1: -.02 }}, dur: {end(.3,ok)+1.1:.2f}, mood: 'warm', src: 'Fanatik röportajı',
  big: {{ v: '15', l: 'YAŞINDA DÜNYA REKORU', t: {at_of(.3,ok,'n2e')+.6:.2f}, x: 800, y: 1330 }}, quote: {{ t: {at_of(.3,ok,'n2q')-.1:.2f}, text: 'Altın madalyalar aldım, karşılığında çocukluğumu kaybettim.', by: 'NAİM SÜLEYMANOĞLU' }},
  header: [[0, 'SPOR OKULU', 'AİLEDEN UZAKTA', 84]], {vob([(.3,ok)])}, sfx: [[{at_of(.3,ok,'n2e')+.6:.2f}, 'hit']] }}""")
im=['n3a','n3b','n3c']; st=at_of(.3,im,'n3c')+1.5
add(f"""{{ name: 'isim', type: 'still', img: 'c11', kb: {{ z0: 1.0, z1: 1.14, x0: -.02, x1: .03 }}, stamp: {{ text: 'NAUM ŞALAMANOV', t: {st:.2f}, y: 1390 }}, dur: {end(.3,im)+.8:.2f}, mood: 'dark',
  header: [[0, '1984–1985 · BULGARİSTAN', 'İSİMLER DEĞİŞİYOR', 76]], shake: [[{st:.2f}, 6]], {vob([(.3,im)])}, sfx: [[{st:.2f}, 'stamp']] }}""")
add(f"""{{ name: 'koridor', type: 'still', img: 'c12', kb: {{ z0: 1.0, z1: 1.22, y0: 0, y1: .02 }}, flicker: true, dur: {end(.3,['n4a','n4b'])+.6:.2f}, mood: 'tension', doorT: 4.0, push: .04, leak: false,
  header: [[0, 'MELBOURNE', 'ARALIK 1986', 84]], {vob([(.3,['n4a','n4b'])])}, sfx: [[0, 'murmur'], [4.0, 'reverse']] }}""")
add(f"""{{ name: 'anlatim', type: 'paper', dur: {end(.3,['n4c'])+1.6:.2f}, mood: 'tension', src: 'Sports Illustrated · Fanatik · T. Bayındır', date: 'MELBOURNE · ARALIK 1986', headline: 'Nasıl kaçtı? Üç anlatım', hsize: 80,
  items: [[1.0, 'Basın: Tuvalete gideceğini söyleyip dönmedi'], [2.2, 'Kendi anlatımı: Sigara içmeye çıkıp kaçtı'], [3.4, 'Tayfun Bayındır: Kafeteryanın arka kapısından çıkarıldı']],
  {vob([(.3,['n4c'])])}, sfx: [[1.0, 'tick'], [2.2, 'tick'], [3.4, 'tick']] }}""")
add(f"""{{ name: 'dosya', type: 'paper', style: 'dossier', dur: {end(.3,['n4d'])+.8:.2f}, mood: 'tension', src: 'Bulgar arşiv belgeleri (NOVA TV)', kicker: 'OPERASYON', headline: 'BUKALEMUN', sub: 'Hedef: Naim Süleymanoğlu’nu geri döndürmek', stamp: 'ÇOK GİZLİ', stampT: {at_of(.3,['n4d'],'n4d')+3.6:.2f},
  {vob([(.3,['n4d'])])}, sfx: [[.2, 'shutter'], [{at_of(.3,['n4d'],'n4d')+3.6:.2f}, 'stamp']] }}""")
kc=['n4e','n4f']; kd=end(.3,kc)+.8
add(f"""{{ name: 'kacis', type: 'map', dur: {kd:.2f}, mood: 'escape', src: 'Ahmet Özal (Posta)', cam: [[0, 145, -33, 26], [2.4, 73, 8, 5.6], [{kd:.2f}, 71, 10, 5.9]], hl: {{ Australia: '#4a3a24', 'United Kingdom': '#4a3a24', Turkey: '#7a2a20' }},
  routes: [{{ a: [144.96, -37.81], b: [-0.13, 51.51], t0: 1.0, t1: 3.2, plane: true }}, {{ a: [-0.13, 51.51], b: [32.86, 39.93], t0: 3.3, t1: 4.8, col: '#e05a48', plane: true }}],
  pins: [{{ lon: 144.96, lat: -37.81, label: 'MELBOURNE', t: .2, below: true }}, {{ lon: -0.13, lat: 51.51, label: 'LONDRA', t: 3.2 }}, {{ lon: 32.86, lat: 39.93, label: 'ANKARA', t: 4.8, below: true }}],
  header: [[0, 'MELBOURNE → LONDRA → ANKARA', 'ARALIK 1986', 80]], {vob([(.3,kc)])}, sfx: [[1.0, 'plane'], [4.8, 'ping']] }}""")
add(f"""{{ name: 'isimgeri', type: 'reveal', dur: {end(1.0,['n4g'])+.9:.2f}, mood: 'rise', still: 'c16', lines: [['NAİM', 130, 1262], ['SÜLEYMANOĞLU', 96, 1366]], nick: '', nickY: 1448, shake: [[.15, 12]], push: .05,
  {vob([(1.0,['n4g'])])}, sfx: [[.15, 'hit'], [.15, 'boom']] }}""")
add(f"""{{ name: 'aile', type: 'still', img: 'c13', snow: true, kb: {{ z0: 1.0, z1: 1.12, x0: .02, x1: -.02 }}, dur: {end(.3,['n5a'])+.6:.2f}, mood: 'sad', years: [[0, '1987'], [1.4, '1988']], header: [[0, 'BEDELİN ÖTEKİ YÜZÜ', 'AİLE', 84]], {vob([(.3,['n5a'])])} }}""")
bd=['n5b','n5c','n5d']
add(f"""{{ name: 'bedel', type: 'counter', dur: {end(.3,bd)+.8:.2f}, mood: 'rise', from: 0, to: 1000000, t0: {at_of(.3,bd,'n5c'):.2f}, t1: {at_of(.3,bd,'n5c')+1.5:.2f}, pre: '$', post: '+', size: 190, label: 'OLİMPİYAT İZNİ İÇİN',
  rumor: [{at_of(.3,bd,'n5d'):.2f}, {end(.3,bd)+.8:.2f}], src: 'Bulgar belgeleri · IWF', header: [[0, 'SEUL YOLUNDA', 'BEDEL']], {vob([(.3,bd)])}, sfx: [[{at_of(.3,bd,'n5c'):.2f}, 'tickroll']] }}""")
add(f"""{{ name: 'seul', type: 'lift', dur: 21.0, mood: 'epic', back: 'TÜRKİYE', push: 0,
  sprites: [[0, 'c1'], [1.0, 'c2'], [3.2, 'c3'], [7.7, 'c4'], [8.3, 'c5'], [10.6, 'c6'], [12.9, 'c7'], [19.0, 'c8']], sScale: 1.6, zoom: .06, zoomT: [3, 12.9], zoomOut: [12.9, 14],
  attempts: [{{ name: 'KOPARMA', t: .4, items: [[.6, '145', ''], [1.1, '150,5', 'wr'], [1.6, '152,5', 'wr']] }}, {{ name: 'SİLKME', t: 3.2, items: [[3.4, '175', ''], [3.9, '188,5', 'wr'], [12.9, '190', 'wr']] }}],
  attemptsOut: 10.3, lights: [[12.9, '---'], [13.25, 'www']], roar: [12.9, 18], flash: [12.9], flashes: [[0, 6, 4], [12.9, 17, 26]], shake: [[12.9, 14]],
  big: [{{ v: '190 KG', count: .9, from: 0, to: 190, suf: ' KG', l: 'SİLKME · DÜNYA REKORU', t: 13.3, t1: 17.0, y: 540 }}, {{ v: '342,5 KG', count: .9, from: 0, to: 342.5, dec: 1, suf: ' KG', l: 'TOPLAM · DÜNYA REKORU', t: 17.1, t1: 20.8, y: 540, size: 190 }}],
  header: [[0, '60 KG · OLİMPİYAT OYUNLARI', 'SEUL 1988', 84]], {vob([(.3,['n6a','n6b']),(13.8,['n6c','n6d'])])},
  sfx: [[.6, 'tick'], [1.1, 'tick'], [1.6, 'tick'], [3.4, 'tick'], [3.9, 'tick'], [6.6, 'heart'], [8.3, 'plate'], [10.4, 'riser'], [11.7, 'plate'], [12.9, 'hit'], [12.9, 'roar'], [13.0, 'shutter'], [14.5, 'shutter']] }}""")
add(f"""{{ name: 'kapak', type: 'magazine', dur: {end(.4,['n6e'])+1.4:.2f}, mood: 'epic', headline: 'EVERYBODY WINS', date: '3 EKİM 1988', t2: 99, portrait: 'c16', header: [[0, 'ULUSLARARASI BASKI', 'TIME KAPAĞI', 80]], {vob([(.4,['n6e'])])}, sfx: [[.2, 'shutter']] }}""")
it=['n7a','n7b','n7c','n7q']
add(f"""{{ name: 'itiraf', type: 'paper', dur: {end(.3,it)+.9:.2f}, mood: 'warm', src: 'Fanatik röportajı · Habertürk', date: 'KENDİ İTİRAFI', headline: '“Hiç evlenmedim ama çocuklarım var”', hsize: 76, photo: 'c16',
  quote: {{ t: {at_of(.3,it,'n7q')-.1:.2f}, text: 'Ben evlilik imzasını kâğıda değil, kalbime attım.', by: 'NAİM · YAKINLARININ ANLATIMI' }}, {vob([(.3,it)])}, sfx: [[.2, 'shutter']] }}""")
gz=['n7d','n7e']
add(f"""{{ name: 'gizli', type: 'paper', dur: {end(.3,gz)+1.0:.2f}, mood: 'warm', src: 'Tayfun Bayındır, “Cep Herkülü Naim”', date: 'YAKIN DOSTUNUN KALEMİNDEN', headline: 'Cep Herkülü’nün bilinmeyenleri', hsize: 72,
  items: [[1.0, 'Üniversitede halter dersinden sınıfta kaldı'], [2.4, 'Sigara içtiği haber oldu, hiç kızmadı'], [3.8, 'Rakip haltercilerle bir bar kavgasına karıştı']], {vob([(.3,gz)])}, sfx: [[1.0, 'tick'], [2.4, 'tick'], [3.8, 'tick']] }}""")
at=['n8a','n8b','n8c']; xb=at_of(.3,at,'n8b')+3.3; md=at_of(.3,at,'n8c')+.3
add(f"""{{ name: 'atlanta', type: 'duel', dur: {end(.3,at)+.8:.2f}, mood: 'epic', a: {{ name: 'SÜLEYMANOĞLU', short: 'NAİM', nat: 'TÜRKİYE' }}, b: {{ name: 'LEONİDİS', short: 'LEONİDİS', nat: 'YUNANİSTAN' }},
  rows: [{{ who: 'a', kg: '185', res: 'wr', t: {xb-4.4:.2f} }}, {{ who: 'b', kg: '187,5', res: 'wr', t: {xb-3.2:.2f} }}, {{ who: 'a', kg: '187,5', res: 'ok', t: {xb-2.0:.2f} }}, {{ who: 'b', kg: '190', res: 'x', t: {xb:.2f} }}],
  total: {{ a: '335', b: '332,5', t: {xb+.8:.2f} }}, medals: {{ t: {md:.2f}, y: ['1988', '1992', '1996'], c: ['SEUL', 'BARSELONA', 'ATLANTA'] }}, header: [[0, 'ATLANTA · 22 TEMMUZ 1996', 'DÜELLO']],
  {vob([(.3,at)])}, sfx: [[{xb:.2f}, 'buzz'], [{xb:.2f}, 'gasp'], [{md:.2f}, 'chime'], [{md+.3:.2f}, 'chime'], [{md+.6:.2f}, 'chime']] }}""")
add(f"""{{ name: 'sarilma', type: 'still', img: 'c14', kb: {{ z0: 1.0, z1: 1.12 }}, dur: {end(.3,['n8d'])+1.2:.2f}, mood: 'warm', flashes: [[0, 3, 10]], {vob([(.3,['n8d'])])}, sfx: [[.2, 'shutter']] }}""")
sd=['n9a','n9b']; x0=at_of(.3,sd,'n9b')+.2
add(f"""{{ name: 'sidney', type: 'lift', dur: {end(.3,sd)+1.4:.2f}, mood: 'sad', sprites: [[0, 'c1'], [1.4, 'c3'], [2.6, 'c4'], [{x0-.4:.2f}, 'c1']], grade: 'sad', sScale: 1.6,
  xs: [{x0:.2f}, {x0+.8:.2f}, {x0+1.6:.2f}], xsY: 600, lights: [[{x0:.2f}, 'rrr'], [{x0+.5:.2f}, '---'], [{x0+.8:.2f}, 'rrr'], [{x0+1.3:.2f}, '---'], [{x0+1.6:.2f}, 'rrr']],
  big: [{{ v: '145 KG', l: 'KOPARMA', t: .6, t1: {end(.3,sd)+1.4:.2f}, y: 500, size: 150 }}], shake: [[{x0-.4:.2f}, 9]], header: [[0, 'SİDNEY · 2000', 'DÖRDÜNCÜ ALTIN?', 84]],
  {vob([(.3,sd)])}, sfx: [[{x0-.4:.2f}, 'clang'], [{x0:.2f}, 'buzz'], [{x0+.8:.2f}, 'buzz'], [{x0+1.6:.2f}, 'buzz']] }}""")
add(f"""{{ name: 'veda', type: 'memorial', dur: {end(.5,['n10a','n10b'])+1.2:.2f}, mood: 'elegy', items: [{{ kind: 'years', l: '1967 – 2017', t: .3 }}], header: [[0, 'İSTANBUL', '18 KASIM 2017', 84]], src: 'Sabah', {vob([(.5,['n10a','n10b'])])} }}""")
add(f"""{{ name: 'son', type: 'hook', dur: {end(.5,['n11a','n11b'])+.35:.2f}, mood: 'elegy', fadeOut: 0, back: 'TÜRKİYE', sprites: [[0, 'c1']], sScale: 1.0, {vob([(.5,['n11a','n11b'])])} }}""")
add("""{ name: 'cep', type: 'reveal', dur: 7.0, mood: 'epic', fadeIn: 0, leak: false, still: 'c16', lines: [['CEP', 190, 1262], ['HERKÜLÜ', 150, 1420]], nick: '', nickY: 1500, flash: [0], shake: [[0, 16]], push: .06, sfx: [[0, 'boom'], [0, 'hit']] }""")
add("""{ name: 'kapanis', type: 'outro', dur: 9.0, mood: 'outro', fadeOut: 1.0, who: 'NAİM SÜLEYMANOĞLU', years: '1967 – 2017 · CEP HERKÜLÜ',
  stats: [{ v: 3, l: 'OLİMPİYAT ALTINI' }, { v: 7, l: 'DÜNYA ŞAMPİYONLUĞU' }, { v: 46, l: 'DÜNYA REKORU' }, { v: 1.47, dec: 2, suf: ' M', l: 'BOY' }], sfx: [] }""")
src=open('tools/naim_base.js').read()
head=src[:src.index('  scenes: [')].replace("sport: 'Halter' }","sport: 'Halter', titleSub: ['NAİM SÜLEYMANOĞLU', '“Cep Herkülü”'] }")
open('episodes/naim-suleymanoglu.js','w').write(head+"  scenes: [\n    "+",\n    ".join(sc)+"\n  ]\n};\n")
