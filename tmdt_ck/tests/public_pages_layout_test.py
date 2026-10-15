"""Static Chromium layout smoke test for public pages, not HTTP navigation E2E."""
from pathlib import Path
from playwright.sync_api import sync_playwright
import re, shutil
ROOT=Path(__file__).resolve().parents[1]/'src/web'
PAGES=['home.html','jobs.html','job-detail.html','candidates.html','candidate-detail.html','profile.html','about.html']
CSS=(ROOT/'css/talentmatch.css').read_text(encoding='utf8')
failures=[];checks=0
with sync_playwright() as pw:
 browser=pw.chromium.launch(executable_path=shutil.which('chromium'),headless=True,args=['--no-sandbox','--disable-dev-shm-usage'])
 for page_name in PAGES:
  text=(ROOT/'html'/page_name).read_text(encoding='utf8')
  text=re.sub(r'<link[^>]*stylesheet[^>]*>','',text)
  text=re.sub(r'<script\b[^>]*>\s*</script>','',text)
  text=text.replace('</head>','<style>'+CSS+'</style></head>')
  for width in (1440,1280,768,390,360):
   page=browser.new_page(viewport={'width':width,'height':800})
   page.set_content(text)
   data=page.evaluate('''()=>({doc:document.documentElement.scrollWidth,screen:innerWidth,header:document.querySelector('header.topbar')?.getBoundingClientRect().height,stick:getComputedStyle(document.querySelector('header.topbar')).position})''')
   if data['doc']>width+2:failures.append((page_name,width,'overflow',data['doc']))
   if data['stick']!='sticky':failures.append((page_name,width,'not sticky',data['stick']))
   checks+=2
   page.close()
 browser.close()
print(f'Public page layout measurements: {checks} (7 pages x 5 widths)')
for f in failures:print('FAIL',*f)
if failures:raise AssertionError(f'{len(failures)} layout concerns')
print('PASS static public-page layout checks (isolated DOM/CSS)')
