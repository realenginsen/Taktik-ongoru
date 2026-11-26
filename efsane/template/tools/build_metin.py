import json, re
import numpy as np, subprocess
_sr=22050
_x=np.frombuffer(subprocess.run(['ffmpeg','-loglevel','error','-i','voice/metin_vo_cem.mp3','-ac','1','-ar',str(_sr),'-f','f32le','-'],capture_output=True).stdout,np.float32)
_w=int(.01*_sr); _F=_w/_sr; _db=np.array([20*np.log10(np.sqrt(np.mean(_x[i:i+_w]**2))+1e-9) for i in range(0,len(_x)-_w,_w)])
def snap_end(t):
    i=int((t-.35)/_F)
    while i<len(_db)-6 and not (_db[i:i+6]<-58).all(): i+=1
    return min(i*_F+.06, t+.3)
def snap_start(t):
    j=int((t+.15)/_F)
    while j>3 and not ((_db[j-4:j]<-58).all() and _db[j]>=-58): j-=1
    return max(j*_F-.04, t-.5)
S={ # sentence id: (src0, src1, text)
'v1a':(0.13,3.16,'10 Haziran 1959. Dolmabahçe.'),'v1b':(3.36,4.88,'37. dakika...'),'v1c':(4.95,7.28,'Bir şut... ve ağlar yırtılıyor.'),
'v2a':(8.28,9.52,'İzmir, Karşıyaka.'),'v2b':(9.84,11.48,'Bir fabrika işçisinin oğlu.'),
'v3':(11.82,14.24,'Çocukken... koyu bir Beşiktaşlı.'),'v4':(14.31,16.8,'Futbol, ona ilk bayramlıklarına mal oluyor.'),
'v5a':(17.33,18.8,'15 yaşında ilk lisans.'),'v5b':(18.96,21.28,'18’inde, İzmir’in gol kralı.'),
'v6a':(21.58,24.28,'Gündüz Kılıç onu yalnızca 15 dakika izliyor.'),'v6b':(24.4,26.88,'Ve İstanbul’a tek bir cümleyle dönüyor:'),
'v6q':(26.95,29.12,None),'v6c':(29.25,30.72,'Bedeli... bir Chevrolet.'),
'v7a':(31.76,32.96,'1957.'),'v7b':(33.2,36.32,'Fenerbahçe ona açık bir çek uzatıyor: “Rakamı sen yaz.”'),'v7c':(36.72,38.24,'Cevabı tek cümle:'),'v7q':(38.31,40.32,None),
'v8':(40.39,43.68,'İki yıl sonra... Fenerbahçe’nin kalesinde... o şut.'),
'v9a':(44.78,46.48,'Profesyonel ligin ilk gol kralı.'),'v9b':(46.72,48.64,'Bir derbide... tam dört gol.'),
'v10a':(49.35,51.04,'Ama her kralın bir bedeli var.'),'v10b':(51.5,53.52,'Bir dönem Toptaşı Cezaevi’nde yatıyor.'),'v10c':(53.68,55.28,'Çıktığı gün... iki gol atıyor.'),
'v11a':(55.81,58.4,'Eşi soruyor: “Ben mi, Galatasaray mı?”'),'v11b':(58.47,59.2,'Cevabı:'),'v11q':(59.23,61.36,None),
'v12a':(61.43,65.28,'1965’te hayatı film oluyor; başrolde kendisi.'),'v12b':(65.36,69.92,'Senaristin anlatımına göre eşi, filmi durdurmak için tazminat bile teklif ediyor.'),
'v13':(70.12,73.2,'Setteki dedikodulara ise Ajda Pekkan’ın cevabı net:'),'v13q':(73.27,74.72,None),
'v14a':(75.83,77.28,'1969.'),'v14b':(77.33,80.08,'Vedasında rakip olarak Fenerbahçe’yi istiyor.'),'v14c':(80.16,83.28,'Tek şart: 10 dakika sarı-lacivert forma giymesi.'),'v14d':(83.35,85.28,'Cevabı: “Şeref duyarım.”'),
'v15a':(85.35,87.36,'Bıraktıktan sonra dönmeyi düşünüyor.'),'v15b':(87.41,89.44,'Bir köşe yazısı onu durduruyor:'),'v15q':(89.5,91.07,None),
'v16a':(92.08,94.24,'13 Eylül 1991.'),'v16b':(94.48,95.84,'Boğaziçi Köprüsü.'),'v16c':(95.9,96.8,'55 yaşında.'),
'v17a':(97.67,99.68,'Ona sorsalar, şöyle derdi:'),'v17q':(99.75,102.9,None),
}
def V(at, ids):
    """ids: consecutive sentence ids played as one clip from first src0 to last src1 at scene time 'at' -> (vo entry, subs)"""
    s0=snap_start(S[ids[0]][0]); s1=snap_end(S[ids[-1]][1])
    subs=[]
    for k in ids:
        a,b,tx=S[k]
        if tx: subs.append([round(at+a-s0,2), round(at+b-s0+.45,2), tx, 1])
    return [round(at,2), round(s0,2), round(s1,2)], subs, round(at+s1-s0,2)
def at_of(at, ids, k):  # scene time where sentence k starts
    s0=snap_start(S[ids[0]][0]); return round(at+S[k][0]-s0,2)
J=json.dumps
scenes=[]
def add(txt): scenes.append(txt)
def vo_block(clips):
    vos=[];subs=[]
    for at,ids in clips:
        v,sb,_=V(at,ids); vos.append(v); subs+=sb
    return f"vo: {J(vos)}, subs: {J(subs,ensure_ascii=False)}"
# 1 hook
ids1=['v1a','v1b','v1c']; kick=at_of(.4,ids1,'v1c')+.15
add(f"""{{ name: 'hook', type: 'pitch', dur: 8.2, mood: 'tension', energy: [[0, .2], [8.2, .4]], leak: false,
  sprites: [[0, 'c2'], [{kick-1.3:.2f}, 'c3'], [{kick:.2f}, 'c4']], sScale: 1.25, flashes: [[0, 8, 5]], zoom: .1, zoomT: [0, 8.2],
  ballFly: [{kick+.1:.2f}, {kick+1.4:.2f}, [700, 1300, 980, 820]], header: [[.3, '10 HAZİRAN 1959', 'DOLMABAHÇE']],
  {vo_block([(.4,ids1)])}, sfx: [[0, 'murmur'], [{kick+.1:.2f}, 'hit'], [{kick+.3:.2f}, 'whoosh']] }}""")
add("""{ name: 'title', type: 'title', dur: 3, mood: 'hit', energy: [[0, .6], [3, .35]], fadeIn: .05, leak: false, push: .05, shake: [[.05, 10]], sfx: [[.05, 'hit'], [.05, 'boom']] }""")
add(f"""{{ name: 'dogum', type: 'map', dur: 4.4, mood: 'warm', cam: [[0, 30, 40, 8], [3.4, 27.3, 38.6, 70], [4.4, 27.15, 38.5, 80]], hl: {{ Turkey: '#7a1a1a' }},
  pins: [{{ lon: 27.11, lat: 38.46, label: 'KARŞIYAKA', t: 1.4, col: '#e30a17' }}], header: [[0, 'İZMİR · KARŞIYAKA', '2 ŞUBAT 1936', 84]],
  {vo_block([(.3,['v2a','v2b'])])}, sfx: [[1.4, 'ping']] }}""")
c=[(.3,['v3']),(2.95,['v4']),(5.7,['v5a','v5b'])]
add(f"""{{ name: 'cocukluk', type: 'still', img: 'c9', kb: {{ z0: 1.02, z1: 1.16, y0: .02, y1: -.03 }}, dur: 10.4, mood: 'warm', push: .02, src: 'A Spor · Fanatik',
  header: [[0, 'İZMİR SOKAKLARI', 'ÇOCUKLUK']], big: {{ v: '15', l: 'YAŞINDA İLK LİSANS', t: 5.7, x: 800, y: 1330 }},
  {vo_block(c)}, sfx: [[5.7, 'stamp']] }}""")
add(f"""{{ name: 'kesif', type: 'still', img: 'c10', kb: {{ z0: 1.12, z1: 1.0, x0: .03, x1: -.02 }}, dur: 8.6, mood: 'rise', push: .02,
  header: [[0, '1955', 'İSTANBUL YOLU', 84]], quote: {{ t: {at_of(.3,['v6a','v6b','v6q'],'v6q')-.1:.2f}, text: 'Kulübü satın, Metin’i alın.', by: 'GÜNDÜZ KILIÇ' }},
  {vo_block([(.3,['v6a','v6b','v6q'])])}, sfx: [[0, 'plane']] }}""")
add(f"""{{ name: 'araba', type: 'car', dur: 4.6, mood: 'warm', big: '1 OTOMOBİL', label: '5 YILLIK SÖZLEŞMENİN BEDELİ', textT: 1.5,
  header: [[0, 'GALATASARAY', 'TRANSFER', 84]], {vo_block([(.5,['v6c'])])}, sfx: [[.2, 'whoosh'], [1.5, 'hit']] }}""")
add("""{ name: 'gevrek', type: 'paper', dur: 5.4, mood: 'rise', rumor: true, src: 'futbolsever anlatımları · doğrulanmamıştır', breath: true,
  date: 'BEBEK · İLK TAKSİT GÜNÜ', headline: 'Bütün taksit bir gevrekçiye', stamp: 'RİVAYET', stampT: 1.6,
  subs: [[.3, 5.2, 'Rivayet: ilk taksidini gevrekleri denize düşen bir satıcıya veriyor.']], sfx: [[.2, 'shutter'], [1.6, 'stamp']] }""")
ids7=['v7c','v7q']
_v7,_s7,_e7=V(8.3,ids7)
EK=[(0.05,1.3,'1957.'),(1.65,5.65,'Dönemin Fenerbahçe yöneticisi Müslim Bağcılar, ona açık bir çek uzatıyor:'),(6.6,7.6,'“Rakamı sen yaz.”')]
_subs=[[round(.3+a,2),round(.3+b+.45,2),tx,1] for a,b,tx in EK]+_s7
add(f"""{{ name: 'cek', type: 'paper', style: 'cheque', dur: {_e7+2.4:.2f}, mood: 'rise', src: 'A Spor · Küre Ansiklopedi', date: '1957 · FENERBAHÇE', headline: '“Rakamı sen yaz.”', headT: 6.9, giver: 'Müslim Bağcılar',
  quote: {{ t: {at_of(8.3,ids7,'v7q')-.1:.2f}, text: 'Bizi sevenleri üzmeyelim baba.', by: 'METİN OKTAY' }},
  vo: {J([[.3,0.0,7.75,'b'],_v7])}, subs: {J(_subs,ensure_ascii=False)}, sfx: [[.2, 'shutter'], [6.9, 'whoosh']] }}""")
add(f"""{{ name: 'derbi', type: 'pitch', dur: 4.4, mood: 'tension', sprites: [[0, 'c2'], [2.8, 'c3'], [3.9, 'c4']], sScale: 1.25, zoom: .12, zoomT: [0, 4.4], flashes: [[0, 4.4, 6]],
  header: [[0, '10 HAZİRAN 1959', 'DERBİ', 84]], {vo_block([(.3,['v8'])])}, sfx: [[0, 'heart'], [2.6, 'riser']] }}""")
add("""{ name: 'netgoal', type: 'netgoal', dur: 8.0, mood: 'epic', hit: 1.0, lens: 3.0, gol: 1.3, roar: [1.0, 7.5], flash: [1.0], shake: [[1.0, 14]], leak: false, fadeIn: 0,
  sprites: [[0, 'c4'], [1.05, 'c7']], sScale: 1.25, fx: 300, header: [[0, '37. DAKİKA', 'AĞLARI DELEN GOL', 80]], breath: true,
  subs: [[3.2, 7.8, 'Top ağları yırtıp dışarı çıkıyor.']], sfx: [[1.0, 'hit'], [1.0, 'boom'], [1.05, 'roar'], [1.2, 'shutter']] }""")
add("""{ name: 'netgoal2', type: 'still', img: 'c12', kb: { z0: 1.0, z1: 1.18, x0: -.02, x1: .03 }, dur: 4.2, mood: 'epic', flashes: [[0, 4, 10]], breath: true, sfx: [[.2, 'shutter']] }""")
add(f"""{{ name: 'skor', type: 'score', dur: 6.0, mood: 'epic', date: '18 ARALIK 1960 · İNÖNÜ', home: 'GALATASARAY', hs: 5, away: 'FENERBAHÇE', as: 0,
  scorer: {{ t: {at_of(.3,['v9a','v9b'],'v9b')+.9:.2f}, n: 'METİN OKTAY', g: 4 }}, {vo_block([(.3,['v9a','v9b'])])}, sfx: [[1.4, 'tick'], [1.7, 'tick'], [2.0, 'tick'], [2.3, 'tick'], [2.6, 'tick']] }}""")
add("""{ name: 'palermo', type: 'map', dur: 5.6, mood: 'escape', breath: true, cam: [[0, 29, 41, 30], [2.6, 21, 39.5, 38], [5.6, 20.5, 39, 42]], hl: { Italy: '#4a3a24', Turkey: '#7a2a20' },
  routes: [{ a: [28.98, 41.01], b: [13.36, 38.12], t0: .8, t1: 3.0, plane: true }], pins: [{ lon: 28.98, lat: 41.01, label: 'İSTANBUL', t: .3 }, { lon: 13.36, lat: 38.12, label: 'PALERMO', t: 2.9, below: true }],
  header: [[0, '1961–62', 'PALERMO', 84]], subs: [[.4, 5.4, 'Palermo’da 12 maçta 3 gol. Alışamıyor, bir yıl sonra dönüyor.']], sfx: [[.8, 'plane'], [2.9, 'ping']] }""")
add("""{ name: 'rekor', type: 'counter', dur: 4.8, mood: 'rise', breath: true, from: 0, to: 38, t0: .2, t1: 1.9, pre: '', post: ' GOL', size: 200, label: '1962-63 · SADECE 26 MAÇTA',
  header: [[0, 'DÖNÜŞ', 'REKOR SEZON', 84]], subs: [[.3, 4.6, 'Döndüğü sezon 26 maçta 38 gol.']], sfx: [[.2, 'tickroll'], [1.9, 'hit']] }""")
add(f"""{{ name: 'cezaevi', type: 'paper', dur: 6.8, mood: 'dark', src: 'TFF TamSaha, Şubat 2026', date: 'TOPTAŞI CEZAEVİ', headline: 'Hücreden sahaya', sub: 'Çıktığı gün Karagümrük’e iki gol', photo: 'c13',
  {vo_block([(.3,['v10a','v10b','v10c'])])}, sfx: [[2.2, 'clang']] }}""")
ids11=['v11a','v11b','v11q']
add(f"""{{ name: 'vefa', type: 'still', img: 'c11', kb: {{ z0: 1.0, z1: 1.14, x0: -.02, x1: .03 }}, dur: 7.0, mood: 'dark', header: [[0, 'BİR SEÇİM', 'VEFA', 84]],
  quote: {{ t: {at_of(.3,ids11,'v11q')-.1:.2f}, text: 'Galatasaray. O daha vefalı.', by: 'METİN OKTAY' }}, {vo_block([(.3,ids11)])}, sfx: [] }}""")
add(f"""{{ name: 'film', type: 'still', img: 'c14', kb: {{ z0: 1.12, z1: 1.0, x0: .02, x1: -.02 }}, dur: 9.2, mood: 'warm', flicker: true, src: 'Senarist Safa Önal’ın anlatımı (NTV)',
  header: [[0, '1965', 'SİNEMA', 84]], stamp: {{ text: 'TAÇSIZ KRAL', t: 1.8, y: 1390 }}, {vo_block([(.2,['v12a','v12b'])])}, sfx: [[.2, 'shutter'], [1.8, 'stamp']] }}""")
add(f"""{{ name: 'ajda', type: 'paper', dur: 6.4, mood: 'warm', rumor: [0, 3.4], src: 'Ajda Pekkan’ın yazısı (Sözcü)', date: 'SET DEDİKODUSU · 1965', headline: 'Taçsız Kral ve Ajda?', hsize: 96,
  quote: {{ t: {at_of(.2,['v13','v13q'],'v13q')-.1:.2f}, text: 'Aklımızdan bile geçemezdi.', by: 'AJDA PEKKAN' }}, {vo_block([(.2,['v13','v13q'])])}, sfx: [[.2, 'shutter']] }}""")
add("""{ name: 'yumruk', type: 'pitch', dur: 6.0, mood: 'tension', breath: true, src: 'Cumhuriyet', sprites: [[0, 'c1'], [2.6, 'c7']], sScale: 1.2, zoom: .1, zoomT: [0, 2.6], shake: [[2.6, 12]], flash: [2.6],
  board: { t: 3.4, k: 'KARİYERİ BOYUNCA', v: 'TEK KIRMIZI KART', min: '1' }, header: [[0, 'BİR DERBİ', 'SABRIN SONU', 84]],
  subs: [[.3, 5.8, 'Hiç sinirlenmeyen adam, tahrik eden rakibine bir kez yumruk atıyor: tek kırmızı kartı.']], sfx: [[2.6, 'hit'], [2.7, 'gasp'], [3.4, 'buzz']] }""")
ids14=['v14a','v14b','v14c','v14d']; sw=at_of(.3,ids14,'v14d')+1.6
add(f"""{{ name: 'jubile', type: 'swap', dur: 14.0, mood: 'warm', swapT: {sw:.2f}, clock: {sw+1.0:.2f}, header: [[0, '23 AĞUSTOS 1969', 'JÜBİLE', 84]],
  {vo_block([(.3,ids14)])}, sfx: [[{sw:.2f}, 'whoosh'], [{sw+.4:.2f}, 'roar'], [{sw+1.0:.2f}, 'tickroll']] }}""")
ids15=['v15a','v15b','v15q']
add(f"""{{ name: 'palyaco', type: 'still', img: 'c15', kb: {{ z0: 1.0, z1: 1.12 }}, dur: 7.6, mood: 'dark', src: 'TFF TamSaha, Şubat 2026', header: [[0, 'BIRAKTIKTAN SONRA', 'DÖNÜŞ MÜ?', 80]],
  quote: {{ t: {at_of(.3,ids15,'v15q')-.1:.2f}, text: 'Krallar palyaço olmaz!', by: 'NECMİ TANYOLAÇ' }}, {vo_block([(.3,ids15)])}, sfx: [] }}""")
_v16,_s16,_e16=V(.9,['v16a','v16b','v16c'])
P2=[(9.3,10.7,'Ona hiç taç takılmadı...'),(11.65,13.8,'Ama tribünler, ona bir isim verdi:')]
p2at=_e16+.9
_sub2=_s16+[[round(p2at+a-9.2,2),round(p2at+b-9.2+.4,2),tx,1] for a,b,tx in P2]
SON_DUR=round(p2at+(13.9-9.2)+.35,2)
add(f"""{{ name: 'son', type: 'memorial', dur: {SON_DUR}, mood: 'elegy', noBar: true, fadeOut: 0, items: [{{ kind: 'years', l: '1936 – 1991', t: .3 }}], header: [[0, 'İSTANBUL', '13 EYLÜL 1991', 84]],
  vo: {J([_v16,[round(p2at,2),9.2,13.9,'b']])}, subs: {J(_sub2,ensure_ascii=False)} }}""")
add("""{ name: 'tac', type: 'reveal', dur: 7.2, mood: 'epic', fadeIn: 0, leak: false, still: 'c16', lines: [['TAÇSIZ', 170, 1262], ['KRAL', 170, 1420]], nick: '', nickY: 1500,
  flash: [0], shake: [[0, 16]], push: .06, sfx: [[0, 'boom'], [0, 'hit']] }""")
ids17=['v17a','v17q']
add(f"""{{ name: 'din', type: 'still', img: 'c16', kb: {{ z0: 1.1, z1: 1.18 }}, dur: 7.6, mood: 'outro', src: 'Goal.com · Galatasaray arşivi',
  quote: {{ t: {at_of(.6,ids17,'v17q')-.1:.2f}, text: 'Galatasaraylılık… din gibi, mezhep gibi.', by: 'METİN OKTAY' }}, {vo_block([(.6,ids17)])} }}""")
add("""{ name: 'kapanis', type: 'outro', dur: 9.0, mood: 'outro', fadeOut: 1.0, who: 'METİN OKTAY', years: '1936 – 1991 · TAÇSIZ KRAL',
  stats: [{ v: 6, l: 'GOL KRALLIĞI' }, { v: 217, l: 'LİG GOLÜ' }, { v: 18, l: 'FENERBAHÇE’YE GOL' }, { v: 13, l: 'BEŞİKTAŞ’A GOL' }], sfx: [] }""")
src=open('tools/metin_base.js').read().replace("sport: 'Futbol' }","sport: 'Futbol', titleSub: ['METİN OKTAY', '“Taçsız Kral”'] }")
head=src[:src.index('  scenes: [')]

open('episodes/metin-oktay.js','w').write(head+"  scenes: [\n    "+",\n    ".join(scenes)+"\n  ]\n};\n")
