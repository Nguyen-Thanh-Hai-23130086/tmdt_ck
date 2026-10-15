"""Validate static links/assets and JS syntax. Does not claim visual browser E2E."""
from pathlib import Path
from html.parser import HTMLParser
import subprocess

class Links(HTMLParser):
    def __init__(self):
        super().__init__();self.assets=[];self.links=[]
    def handle_starttag(self,tag,attrs):
        a=dict(attrs)
        if tag=='script' and 'src' in a:self.assets.append(a['src'])
        if tag=='link' and a.get('rel')=='stylesheet' and 'href' in a:self.assets.append(a['href'])
        if tag=='a' and 'href' in a:self.links.append(a['href'])

root=Path(__file__).resolve().parent.parent
pages=root/'src/web/html';scripts=root/'src/web/js'
assert len(list(pages.glob('*.html')))>=9
for page in pages.glob('*.html'):
    parser=Links();parser.feed(page.read_text('utf8'))
    for url in parser.assets:
        assert (page.parent/url).exists(),f'{page.name}: asset missing {url}'
    for url in parser.links:
        href=url.split('#')[0].split('?')[0]
        if href.endswith('.html'):assert (page.parent/href).exists(),f'{page.name}: broken link {url}'
for script in scripts.glob('*.js'):
    subprocess.run(['node','--check',str(script)],check=True)
source=(scripts/'talentmatch.js').read_text()
assert '|| jobs[0]' not in source and '|| candidates[0]' not in source
assert 'Không tìm thấy công việc' in source and 'Không tìm thấy Freelancer' in source
assert '<form id="registerForm"' in (pages/'login_register.html').read_text()
print('PASS static HTML links/assets, JS syntax, invalid-ID and registration states')
