"""Isolated Chromium DOM test: public avatar uses session data, no demo identity."""
from pathlib import Path
import re
import os
import shutil
from playwright.sync_api import sync_playwright
web=Path(__file__).resolve().parents[1]/'src/web'
html=(web/'html/home.html').read_text()
html=re.sub(r'<link[^>]*stylesheet[^>]*>','',html)
html=re.sub(r'<script src="[^"]+"></script>','',html)
html=html.replace('</head>','<style>'+(web/'css/talentmatch.css').read_text()+'</style></head>')
script=(web/'js/site.js').read_text()
with sync_playwright() as pw:
 path=os.environ.get('TM_CHROMIUM_PATH') or shutil.which('chromium') or shutil.which('google-chrome')
 browser=pw.chromium.launch(headless=True,executable_path=path,args=['--no-sandbox','--disable-dev-shm-usage','--disable-gpu'])
 for guest in (False,True):
  page=browser.new_page()
  errors=[];page.on('pageerror',lambda e:errors.append(str(e)))
  page.set_content(html)
  if guest:page.evaluate("window.fetch = async () => ({ok:false})")
  else:page.evaluate("window.fetch = async () => ({ok:true, json:async()=>({user:{name:'Doanh nghiệp kiểm thử',email:'client@example.test',role:'CLIENT'}})})")
  page.add_script_tag(content=script)
  if guest:
   page.locator('.tm-login-shortcut').wait_for()
   assert page.locator('#avatarMenu').count()==0
  else:
   page.locator('#avatarButton').click()
   assert page.locator('#avatarMenu').is_visible()
   assert page.locator('#avatarMenu strong').inner_text()=='Doanh nghiệp kiểm thử'
   assert 'view=company' in page.locator('#avatarMenu a[href*="workspace.html"]').get_attribute('href')
   page.keyboard.press('Escape')
   assert not page.locator('#avatarMenu').is_visible()
  assert not errors,errors
  page.close()
 browser.close()
print('PASS 6 public-header DOM assertions (guest + authenticated mock; not live API)')
