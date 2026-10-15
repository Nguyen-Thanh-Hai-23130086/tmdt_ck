"""Isolated Chromium UI regression sweep, not Tomcat/MySQL E2E.
Covers all workspace sections per role across five viewport widths.
"""
from pathlib import Path
import re, os, shutil
from playwright.sync_api import sync_playwright

BASE = Path(__file__).resolve().parents[1]
WEB = BASE / 'src/web'
html = (WEB/'html/workspace.html').read_text(encoding='utf8')
html = re.sub(r'<link[^>]*stylesheet[^>]*>', '', html).replace('<script src="../js/workspace.js"></script>','')
css = '\n'.join((WEB/'css'/fn).read_text(encoding='utf8') for fn in ('talentmatch.css','workspace.css'))
html = html.replace('</head>', '<style>'+css+'</style></head>')
js = (WEB/'js/workspace.js').read_text(encoding='utf8').replace(' // When the visitor follows a public job detail', ' window.__tmTestOpenView = openView;\n // When the visitor follows a public job detail')
ROLES = {
 'FREELANCER': ['dashboard','profile','settings','jobs','applications','invitations','agreements','projects','milestones','messages','payments','reviews','credits','premium','reports','notifications'],
 'CLIENT':['dashboard','company','settings','jobs','freelancers','applications','invitations','agreements','projects','milestones','messages','payments','reviews','credits','premium','reports','notifications'],
 'ADMIN':['dashboard','settings','users','jobs','freelancers','applications','invitations','agreements','projects','milestones','messages','payments','reviews','credits','reports','categories','premium','policies','notifications']
}


def main():
 failures=[]; checks=0
 out=BASE/'docs'/'screenshots';out.mkdir(exist_ok=True, parents=True)
 with sync_playwright() as pw:
  browser=pw.chromium.launch(headless=True, executable_path=os.environ.get('TM_CHROMIUM_PATH') or shutil.which('chromium'),args=['--no-sandbox','--disable-dev-shm-usage','--disable-gpu'])
  for role in ROLES:
   for width in (1440,1280,768,390,360):
    page=browser.new_page(viewport={'width':width,'height':900})
    page.on('pageerror',lambda exc,role=role,width=width:failures.append((role,width,'script',str(exc))))
    page.set_content(html,wait_until='domcontentloaded')
    page.evaluate('''role => {const values=new Map([['tm_demo_role',role]]); Object.defineProperty(window,'localStorage',{configurable:true,value:{getItem:k=>values.get(k)||null,setItem:(k,v)=>values.set(k,String(v)),removeItem:k=>values.delete(k)}});history.pushState=()=>{};}''',role)
    page.on('dialog',lambda d:d.accept())
    page.add_script_tag(content=js)
    try:page.locator('.tm-hero').wait_for(timeout=5000)
    except Exception as exc:failures.append((role,width,'start',str(exc)));page.close();continue
    navlinks=page.locator('#workNav [data-nav]')
    if width<=830:
     page.locator('#sideToggle').click()
     if not page.locator('#sidebarBackdrop').is_visible():failures.append((role,width,'backdrop','not visible'))
     page.locator('#sidebarBackdrop').click(position={'x':width-15,'y':150})
     if page.locator('#sidebarBackdrop').is_visible():failures.append((role,width,'backdrop','not closed'))
     checks+=2
    # header should remain on screen while scrolling tall workspace content
    page.evaluate('window.scrollTo(0,600)')
    y=page.locator('header.tm-top').bounding_box()['y']
    if abs(y)>2:failures.append((role,width,'sticky',str(y)))
    page.evaluate('window.scrollTo(0,0)')
    checks+=1
    for view in ROLES[role]:
     page.evaluate('''async view=>await window.__tmTestOpenView(view)''',view)
     try:
      page.wait_for_function('''view => document.querySelector('#viewTitle') && document.querySelector('#mainContent') && document.querySelector('#mainContent').innerHTML.length > 60''',arg=view,timeout=3000)
      page.wait_for_timeout(10)
     except Exception as exc:failures.append((role,width,view,'empty or error '+str(exc)[:80]));continue
     metrics=page.evaluate('''()=>{let html=document.documentElement;let main=document.querySelector('.tm-main');let toolbar=document.querySelector('.tm-toolbar');return {doc:html.scrollWidth,win:innerWidth,heading:document.querySelector('#viewTitle').innerText,content:document.querySelector('#mainContent').innerText.length,filter:toolbar?Array.from(toolbar.querySelectorAll('select')).map(el=>Math.round(el.getBoundingClientRect().width)):[],toolbarWidth:toolbar?Math.round(toolbar.getBoundingClientRect().width):0}}''')
     if metrics['doc']>width+2:failures.append((role,width,view,f"overflow doc={metrics['doc']}"))
     if metrics['content']<10:failures.append((role,width,view,'blank content'))
     if any(w> min(metrics['toolbarWidth']+1,450) for w in metrics['filter']):failures.append((role,width,view,'filter too wide'))
     checks+=3
     if width==1440 and view=='dashboard':
      page.screenshot(path=str(out/f'{role.lower()}_ui_standardized_1440.png'),full_page=True)
     if width==390 and view=='projects':
      page.screenshot(path=str(out/f'{role.lower()}_projects_390.png'),full_page=True)
    if width==1440:
     # Exercise the actual sidebar and tab click handlers, not only view rendering.
     navkeys=page.locator('#workNav a[data-nav]').evaluate_all('(links)=>links.map(a=>a.dataset.nav)')
     for key in navkeys:
      page.locator(f'#workNav [data-nav="{key}"]').click()
      page.wait_for_function('key => document.querySelector(`#workNav [data-nav="${key}"]`)?.classList.contains("active")',arg=key)
      checks+=1
      tabs=page.locator('.tm-tabs a[data-tab]').evaluate_all('(links)=>links.map(a=>a.dataset.tab)')
      for tab in tabs:
       page.locator(f'.tm-tabs [data-tab="{tab}"]').click()
       assert page.locator(f'.tm-tabs [data-tab="{tab}"]').get_attribute('aria-current')=='page', (role,tab)
       checks+=1
     page.locator('#accountButton').click()
     assert page.locator('#accountMenu').is_visible()
     page.keyboard.press('Escape')
     assert not page.locator('#accountMenu').is_visible()
     checks+=2
    page.close()
  browser.close()
 print(f'Workspace UI check {checks} assertions/measurements; roles 3, widths 5, views {sum(len(v) for v in ROLES.values())} x 5')
 for f in failures[:60]:print('FAIL',*f)
 if failures:raise AssertionError(f'{len(failures)} check failures')
 print('PASS all UI sweep checks (isolated DOM, not network/Tomcat E2E)')
if __name__=='__main__':main()
