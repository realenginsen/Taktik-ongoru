import base64, json, os, subprocess, sys
from playwright.sync_api import sync_playwright

HERE = os.path.dirname(os.path.abspath(__file__))
FPS = 30
EPI = os.environ["EPI"]

def open_page(p):
    b = p.chromium.launch(executable_path="/usr/bin/google-chrome",
                          args=["--allow-file-access-from-files", "--disable-web-security"])
    pg = b.new_page(viewport={"width": 1080, "height": 1920})
    pg.goto("file://" + os.path.join(HERE, "index.html") + "?e=" + EPI)
    pg.on("pageerror", lambda e: print("PAGEERR", e))
    pg.evaluate("fontsReady()")
    return b, pg

def shot(pg, name, t, frame=0):
    url = pg.evaluate("([n,t,f]) => renderScene(n,t,f)", [name, t, frame])
    return base64.b64decode(url.split(",", 1)[1])

def preview(pairs, outdir):
    os.makedirs(outdir, exist_ok=True)
    with sync_playwright() as p:
        b, pg = open_page(p)
        for name, t in pairs:
            with open(os.path.join(outdir, f"{name}_{t}.jpg"), "wb") as f:
                f.write(shot(pg, name, t))
        b.close()

def full(names=None):
    with sync_playwright() as p:
        b, pg = open_page(p)
        scenes = pg.evaluate("sceneList()")
        with open(os.path.join(HERE, f"audio_events_{EPI}.json"), "w") as f:
            json.dump(pg.evaluate("audioEvents()"), f)
        for sc in scenes:
            if names and sc["name"] not in names: continue
            n = int(round(sc["dur"] * FPS))
            tmp = os.path.join(HERE, "out_" + EPI, sc["name"] + ".part.mp4")
            fin = os.path.join(HERE, "out_" + EPI, sc["name"] + ".mp4")
            os.makedirs(os.path.dirname(tmp), exist_ok=True)
            ff = subprocess.Popen(["ffmpeg", "-y", "-loglevel", "error", "-f", "image2pipe", "-c:v", "mjpeg", "-framerate", str(FPS), "-i", "-",
                                   "-c:v", "libx264", "-preset", "veryfast", "-crf", "20", "-pix_fmt", "yuv420p", "-r", str(FPS), tmp], stdin=subprocess.PIPE)
            for i in range(n):
                ff.stdin.write(shot(pg, sc["name"], i / FPS, i))
            ff.stdin.close()
            if ff.wait() != 0: sys.exit("ffmpeg failed " + sc["name"])
            os.replace(tmp, fin)
            print("done", sc["name"], flush=True)
        b.close()

if __name__ == "__main__":
    if sys.argv[1] == "preview":
        pairs = [(a.split(":")[0], float(a.split(":")[1])) for a in sys.argv[2:]]
        preview(pairs, os.path.join(HERE, "prev_" + EPI))
    else:
        full(sys.argv[2:] or None)
