import sys, json, os, numpy as np, cv2
from PIL import Image
SRC = {'a':os.path.join(os.path.dirname(__file__),'../kaynak/a.png'),'b':os.path.join(os.path.dirname(__file__),'../kaynak/b.png'),'c':os.path.join(os.path.dirname(__file__),'../kaynak/c.png')}
OUT = sys.argv[1]; os.makedirs(OUT, exist_ok=True)
LABELS = ['kukreme','smac','post-up','pas','ribaund-smac','uc-parmak','eller-basta','odak','havlu-gurur','kanca','penetre','blok','isaret','sarilma','hakem','bank-huzun','mola','siluet']
MOODS = {'kukreme':['cosku','rekor','galibiyet'],'smac':['guc','galibiyet'],'post-up':['oyun'],'pas':['asist','oyun'],'ribaund-smac':['ribaund','guc'],'uc-parmak':['rekor','triple-double','galibiyet'],
 'eller-basta':['maglubiyet','kacan'],'odak':['giris','odak'],'havlu-gurur':['final','galibiyet','gurur'],'kanca':['sayi','oyun'],'penetre':['oyun','sayi'],'blok':['savunma'],
 'isaret':['taraftar','galibiyet','rekor'],'sarilma':['takim','galibiyet'],'hakem':['gerilim'],'bank-huzun':['maglubiyet','huzun'],'mola':['gerilim','takim'],'siluet':['giris','final','tarih']}
FORMA = ['kirmizi','beyaz','siyah']
sr = cv2.dnn_superres.DnnSuperResImpl_create(); sr.readModel(os.environ.get('EDSR','EDSR_x4.pb')); sr.setModel('edsr',4)
def runs(mask):
    out=[];s=None
    for i,v in enumerate(list(mask)+[False]):
        if v and s is None: s=i
        if not v and s is not None: out.append((s,i-1)); s=None
    return out
def cuts(mask, n):
    r=[x for x in runs(mask)]
    # interior boundaries: choose gaps -> segments between runs
    segs=[]; prev=0
    for s,e in r:
        if s-prev>20: segs.append((prev,s-1))
        prev=e+1
    if len(mask)-prev>20: segs.append((prev,len(mask)-1))
    return segs
index=[]
for key,path in SRC.items():
    im=np.asarray(Image.open(path).convert('RGB')); g=im.mean(2); H,W=g.shape
    white = (g>200).mean(0)>0.9
    sets = cuts(white|((g<25).mean(0)>0.95),3)
    # merge to 3 sets by white separators only
    wr=[r for r in runs(white) if 0<r[0]<W-5]
    bounds=[0]+[ (a+b)//2 for a,b in wr]+[W]
    # dedupe close
    b2=[bounds[0]]
    for b in bounds[1:]:
        if b-b2[-1]>100: b2.append(b)
    assert len(b2)==4, (key,b2)
    for si in range(3):
        x0,x1=b2[si],b2[si+1]; sub=g[:,x0:x1]
        dark=lambda m: m
        rows=cuts(((sub<30)|(sub>200)).mean(1)>0.85,6)
        cols=cuts(((sub<30)|(sub>200)).mean(0)>0.85,3)
        if len(cols)!=3:
            w=(x1-x0); cols=[(int(w*i/3)+3,int(w*(i+1)/3)-3) for i in range(3)]
        assert len(rows)==6,(key,si,rows)
        for ri,(ya,yb) in enumerate(rows):
            for ci,(xa,xb) in enumerate(cols):
                n=ri*3+ci; lab=LABELS[n]
                cell=im[ya+2:yb-1, x0+xa+2:x0+xb-1]
                up=sr.upsample(cv2.cvtColor(cell,cv2.COLOR_RGB2BGR))
                name=f'{key}_{FORMA[si]}_{n+1:02d}_{lab}.jpg'
                cv2.imwrite(os.path.join(OUT,name),up,[cv2.IMWRITE_JPEG_QUALITY,92])
                index.append({'file':name,'kaynak':key,'forma':FORMA[si],'no':n+1,'poz':lab,'duygu':MOODS[lab],'w':up.shape[1],'h':up.shape[0],'oran':'kare' if key!='c' else 'dikey'})
json.dump(index,open(os.path.join(OUT,'index.json'),'w'),ensure_ascii=False,indent=1)
print(len(index))
