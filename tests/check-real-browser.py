"""Optional Chromium desktop-fallback smoke test; no external VR renderer needed.
Requires: pip install playwright, and a local Chromium binary.
"""
from pathlib import Path
from playwright.sync_api import sync_playwright
root=Path(__file__).resolve().parents[1]
html=(root/'index.html').read_text()
html=html.replace('<script src="https://aframe.io/releases/1.8.0/aframe.min.js"></script>','')
html=html.replace('<link rel="stylesheet" href="styles.css" />',f'<style>{(root/"styles.css").read_text()}</style>')
for name in ['content.js','app.js']:
    html=html.replace(f'<script src="{name}"></script>',f'<script>{(root/name).read_text()}</script>')
with sync_playwright() as p:
    browser=p.chromium.launch(executable_path='/usr/bin/chromium', headless=True,
      args=['--no-sandbox','--disable-gpu','--disable-dev-shm-usage'])
    page=browser.new_page(viewport={'width':1440,'height':900},device_scale_factor=1)
    page.set_content(html, wait_until='domcontentloaded', timeout=15000)
    page.wait_for_function('typeof GATEWAY_STATUS === "function"',timeout=10000)
    assert page.evaluate('GATEWAY_STATUS().xp')==0
    page.locator('#choices .choice').nth(0).click()
    assert page.evaluate('GATEWAY_STATUS().missionStep')==0
    for i in [1,2,0]:page.locator('#choices .choice').nth(i).click()
    assert page.evaluate('GATEWAY_STATUS().xp')==100
    page.locator('#next').click()
    page.locator('#choices .choice').nth(0).click()
    assert page.evaluate('GATEWAY_STATUS().xp')==200
    # Complete every remaining chapter using the genuine Chromium DOM.
    for chapter_num in range(1,5):
        page.keyboard.press(str(chapter_num+1))
        rounds=page.evaluate(f'GATEWAY_CHAPTERS[{chapter_num}].rounds.map(r=>({{kind:r.kind||"quiz", answers:r.options.map(o=>o.correct), sequence:r.sequence||null, tickets:r.tickets||null}}))')
        for index, round in enumerate(rounds):
            if round['kind']=='timeline':
                picks=round['sequence']
            elif round['kind']=='dispatch':
                picks=[ticket['answer'] for ticket in round['tickets']]
            else:
                picks=[round['answers'].index(True)]
            for choice in picks:
                page.locator('#choices .choice').nth(choice).click()
            if index<len(rounds)-1:
                page.locator('#next').click()
    assert page.evaluate('GATEWAY_STATUS().xp')==1000
    assert page.evaluate('GATEWAY_STATUS().completed')==5
    assert page.locator('#pathResult').is_visible()
    page.keyboard.press('1')
    page.screenshot(path=str(root.parent/'interalliance_gateway_desktop_preview.png'))
    browser.close()
print('PASS: real Chromium DOM, all ten checkpoints, result, and desktop screenshot')
