"""Real Chromium DOM interaction tests for the workspace in an isolated document.
The sandbox blocks HTTP navigation; set_content keeps HTML/CSS/JS interactions testable.
This is NOT an HTTP/Tomcat/MySQL E2E test.
"""
from pathlib import Path
import re
import os
import shutil
from playwright.sync_api import sync_playwright

WEB = Path(__file__).resolve().parents[1] / 'src' / 'web'
HTML = (WEB / 'html' / 'workspace.html').read_text()
HTML = re.sub(r'<link[^>]*stylesheet[^>]*>', '', HTML)
HTML = HTML.replace('<script src="../js/workspace.js"></script>', '')
CSS = '\n'.join((WEB / 'css' / f).read_text() for f in ['talentmatch.css','workspace.css'])
HTML = HTML.replace('</head>', '<style>' + CSS + '</style></head>')
JS = (WEB / 'js' / 'workspace.js').read_text()


def start(browser, role, width):
    page = browser.new_page(viewport={'width': width, 'height': 900})
    errors = []
    page.on('pageerror', lambda error: errors.append(str(error)))
    page.set_content(HTML, wait_until='domcontentloaded')
    page.evaluate('''(role) => {
        const memory = new Map([['tm_demo_role',role]]);
        Object.defineProperty(window,'localStorage',{configurable:true,value:{
            getItem(k){return memory.has(k)?memory.get(k):null;},
            setItem(k,v){memory.set(k,String(v));},removeItem(k){memory.delete(k);}
        }});
        history.pushState=()=>{};
    }''', role)
    page.on('dialog', lambda d: d.accept())
    page.add_script_tag(content=JS)
    page.locator('.tm-hero').wait_for(timeout=6000)
    return page, errors


def run():
    checked = 0
    with sync_playwright() as pw:
        chromium_path = os.environ.get('TM_CHROMIUM_PATH') or shutil.which('chromium') or shutil.which('google-chrome')
        browser = pw.chromium.launch(headless=True, executable_path=chromium_path, args=['--no-sandbox', '--disable-dev-shm-usage', '--disable-gpu'])
        try:
            for role, width, nav_count in [('FREELANCER',1440,4),('CLIENT',768,6),('ADMIN',390,7)]:
                page, errors = start(browser, role, width)
                page.set_default_timeout(3500)
                assert page.locator('#workNav a').count() == nav_count, (role,'sidebar')
                assert page.locator('.tm-stat').count() == 4, (role,'metrics')
                assert page.locator('.tm-hero').count() == 1, (role,'role-specific hero')
                assert page.evaluate('document.documentElement.scrollWidth <= window.innerWidth + 2'), (role,'horizontal overflow')
                checked += 4
                page.locator('#accountButton').click()
                assert page.locator('#accountMenu').is_visible()
                page.keyboard.press('Escape')
                assert not page.locator('#accountMenu').is_visible()
                checked += 2
                page.locator('#notificationButton').click()
                page.locator('#notificationMenu').wait_for(state='visible')
                assert page.locator('#notificationItems').inner_text().strip()
                checked += 1
                page.locator('#notificationButton').click()
                assert not page.locator('#notificationMenu').is_visible()
                checked += 1
                if role == 'FREELANCER':
                    assert page.locator('#dashboardSearch').count() == 1
                    page.locator('#workNav [data-nav="applications"]').click()
                    assert page.locator('.tm-tabs a').count() == 3
                    page.locator('.tm-tabs [data-tab="invitations"]').click()
                    assert 'Lời mời' in page.locator('#mainContent').inner_text()
                    assert page.locator('[data-action="ACCEPTED"]').count() >= 1
                    page.locator('[data-action="ACCEPTED"]').first.click()
                    assert 'ACCEPTED' in page.locator('#mainContent').inner_text()
                    checked += 5
                    page.locator('#accountButton').click()
                    page.locator('[data-account-view="profile"]').first.click()
                    assert page.locator('#profileEdit').count() == 1
                    checked += 1
                elif role == 'CLIENT':
                    page.locator('#sideToggle').click()
                    assert page.locator('#dashboardSearch').count() == 1
                    page.locator('#workNav [data-nav="jobs"]').click()
                    assert page.locator('#viewTitle').inner_text() == 'Tuyển dụng & tìm người'
                    page.locator('#createBtn').click()
                    page.locator('input[name="title"]').fill('Việc làm trình duyệt kiểm thử')
                    page.locator('textarea[name="content"]').fill('Nội dung thử nghiệm')
                    page.locator('#editForm button[type="submit"]').click()
                    assert 'Việc làm trình duyệt kiểm thử' in page.locator('#mainContent').inner_text()
                    checked += 4
                    page.locator('#sideToggle').click()
                    page.locator('#workNav [data-nav="applications"]').click()
                    assert page.locator('.tm-tabs a').count() == 3
                    checked += 1
                elif role == 'ADMIN':
                    page.locator('#sideToggle').click()
                    assert page.evaluate("document.body.classList.contains('tm-sidebar-open')")
                    checked += 1
                    page.locator('#workNav [data-nav="users"]').click()
                    assert page.locator('.tm-tabs a').count() == 2
                    assert page.locator('article.tm-listcard').count() > 0
                    assert page.locator('#mainContent [data-action="SUSPENDED"]').count() > 0
                    checked += 3
                assert not errors, (role,errors)
                checked += 1
                page.close()
        finally:
            browser.close()
    print(f'PASS {checked} Chromium DOM assertions (3 roles: 1440/768/390; isolated HTML/CSS/JS, not HTTP E2E)')

if __name__=='__main__':
    run()
