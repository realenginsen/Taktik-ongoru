import sys
from playwright.sync_api import sync_playwright
with sync_playwright() as p:
    b=p.chromium.launch(executable_path="/usr/bin/google-chrome")
    pg=b.new_page(viewport={"width":1080,"height":1920})
    pg.goto("file://"+sys.argv[1]); pg.wait_for_timeout(800)
    pg.evaluate("document.fonts.ready")
    pg.screenshot(path=sys.argv[2])
    # overflow check
    print(pg.evaluate("""()=>{const w=document.querySelector(".wrap");return [w.scrollHeight,w.clientHeight]}"""))
    b.close()
