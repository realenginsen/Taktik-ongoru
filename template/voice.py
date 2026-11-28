"""Seslendirme (OmniVoice klonu) — audio_<kod>.wav üstüne sahne sahne anlatım ekler.

Kullanım:  MATCH=<kod> python3 voice.py   (önce render.py full + audio.py çalışmış olmalı)
Çıktı:     audio_<kod>_vo.wav   (müzik anlatım sırasında kısılır)
Çıkış kodu 2: OmniVoice/model erişilemedi -> videoyu anlatımsız (audio_<kod>.wav) birleştir.

Metin: matches/<kod>.js içinde  M.vo = { intro: '...', context: '...', lineups: '...', cards: '...', s1: '...', ..., pred: '...' }
Sahne süresine sığmalı: kabaca saniye başına 2.3 kelime (intro 4.5 sn, context 7, lineups 6.5, cards 7, senaryo 8.5, pred 8.5).
Rakamları yazıyla yaz ("üç-sıfır", "yüzde elli dört").
Referans ses: ../voice/ref.wav (+ varsa ../voice/ref.txt transkript).
"""
import json, os, subprocess, sys, wave
import numpy as np

HERE = os.path.dirname(os.path.abspath(__file__))
MATCH = os.environ.get('MATCH')
REF = os.path.join(HERE, '..', 'voice', 'ref.wav')
REF_TXT = os.path.join(HERE, '..', 'voice', 'ref.txt')
SR = 44100
LEAD = 0.45          # sahne başından sonra anlatımın başladığı an (sn)
TAIL = 0.55          # sahne sonundan önce bırakılan pay (sn)
DUCK_DB = -10.0      # anlatım sırasında müzik kısma

def load_vo():
    js = ("global.window=global;const fs=require('fs');eval(fs.readFileSync(process.argv[1],'utf8'));"
          "console.log(JSON.stringify({vo:M.vo||{},dur:Object.fromEntries((M.scen||[]).map((s,i)=>['s'+(i+1),s.dur||8.5]))}))")
    out = subprocess.check_output(['node', '-e', js, os.path.join(HERE, 'matches', MATCH + '.js')])
    return json.loads(out)

def read_wav(p):
    with wave.open(p) as w:
        ch, sr, n = w.getnchannels(), w.getframerate(), w.getnframes()
        x = np.frombuffer(w.readframes(n), np.int16).astype(np.float32) / 32768
    return x.reshape(-1, ch), sr

def resample(x, sr_in, sr_out):
    n = int(round(len(x) * sr_out / sr_in))
    return np.interp(np.linspace(0, len(x) - 1, n), np.arange(len(x)), x).astype(np.float32)

def tempo(x, sr, f):
    """ffmpeg atempo ile perdeyi koruyarak hızlandır."""
    tmp_in, tmp_out = os.path.join(HERE, '_vo_in.wav'), os.path.join(HERE, '_vo_out.wav')
    with wave.open(tmp_in, 'wb') as w:
        w.setnchannels(1); w.setsampwidth(2); w.setframerate(sr); w.writeframes((np.clip(x, -1, 1) * 32767).astype(np.int16).tobytes())
    subprocess.run(['ffmpeg', '-y', '-loglevel', 'error', '-i', tmp_in, '-filter:a', f'atempo={f:.3f}', tmp_out], check=True)
    y, _ = read_wav(tmp_out); os.remove(tmp_in); os.remove(tmp_out)
    return y[:, 0]

def main():
    if not MATCH: sys.exit('MATCH=<kod> gerekli')
    data = load_vo(); vo = data['vo']
    if not vo: sys.exit('matches/%s.js içinde M.vo yok' % MATCH)
    ev = json.load(open(os.path.join(HERE, f'audio_events_{MATCH}.json')))
    starts = {d['name']: d['t'] for d in ev['drops']}
    names = [d['name'] for d in ev['drops']]
    ends = {nm: (starts[names[i + 1]] if i + 1 < len(names) else ev['total']) for i, nm in enumerate(names)}

    try:
        import torch
        from omnivoice import OmniVoice
        model = OmniVoice.from_pretrained('k2-fsa/OmniVoice', device_map='cpu', dtype=torch.float32)
        ref_text = open(REF_TXT, encoding='utf8').read().strip() if os.path.exists(REF_TXT) else None
        prompt = model.create_voice_clone_prompt(ref_audio=REF, ref_text=ref_text) if ref_text else model.create_voice_clone_prompt(ref_audio=REF)
    except Exception as e:  # ağ (huggingface.co) / kurulum sorunu
        print('VOICE_UNAVAILABLE', repr(e)[:400]); sys.exit(2)

    mix, sr = read_wav(os.path.join(HERE, f'audio_{MATCH}.wav'))
    total_n = len(mix)
    voice = np.zeros(total_n, np.float32)
    items = [(nm, t) for nm, t in vo.items() if nm in starts and t.strip()]
    steps = int(os.environ.get('VO_STEPS', '16'))   # CPU'da hız için 32 yerine 16 adım
    audios = model.generate(text=[t for _, t in items], language=['tr'] * len(items),
                            voice_clone_prompt=[prompt] * len(items), num_step=steps)
    for (nm, text), audio in zip(items, audios):
        x = resample(np.asarray(audio, np.float32), 24000, SR)
        room = ends[nm] - starts[nm] - LEAD - TAIL
        dur = len(x) / SR
        if dur > room:
            f = min(dur / room, 1.25)
            x = tempo(x, SR, f)
            if len(x) / SR > room: print(f'UYARI {nm}: anlatım {len(x)/SR:.1f}s > {room:.1f}s, kısalt'); x = x[:int(room * SR)]
        x = x / (np.max(np.abs(x)) + 1e-9) * 0.9
        i0 = int((starts[nm] + LEAD) * SR)
        voice[i0:i0 + len(x)] += x[:max(0, total_n - i0)]
        print(f'vo {nm}: {len(x)/SR:.1f}s / {room:.1f}s', flush=True)

    # müzik kısma zarfı (yumuşak)
    act = (np.abs(voice) > 1e-3).astype(np.float32)
    k = int(0.25 * SR); act = np.convolve(act, np.ones(k) / k, 'same'); act = np.clip(act * 4, 0, 1)
    k2 = int(0.35 * SR); act = np.convolve(act, np.ones(k2) / k2, 'same')
    g = 10 ** (DUCK_DB * act / 20)
    out = mix * g[:, None] + voice[:, None] * 0.95
    out = np.tanh(out * 1.05) * 0.95
    pcm = (np.clip(out, -1, 1) * 32767).astype(np.int16)
    with wave.open(os.path.join(HERE, f'audio_{MATCH}_vo.wav'), 'wb') as w:
        w.setnchannels(mix.shape[1]); w.setsampwidth(2); w.setframerate(sr); w.writeframes(pcm.tobytes())
    print('voice ok')

if __name__ == '__main__':
    main()
