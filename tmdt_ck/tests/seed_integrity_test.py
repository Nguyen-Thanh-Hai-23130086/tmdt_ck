"""Offline verification of reproducible demo seed, not a MySQL import test."""
from pathlib import Path
import re,base64,hashlib
root=Path(__file__).resolve().parent.parent
sql=(root/'database/seed_demo.sql').read_text()
assert 'DROP TABLE' not in '\n'.join(line for line in (root/'database/schema.sql').read_text().upper().splitlines() if not line.lstrip().startswith('--'))
users=re.findall(r"INSERT INTO users\(full_name,email,password,role,status\) VALUES\('.*?','([^']+)','([^']+)','(ADMIN|CLIENT|FREELANCER)'",sql)
assert len(users)==20,len(users)
assert len({x[0] for x in users})==20
assert [r for *_,r in users].count('ADMIN')==1
assert [r for *_,r in users].count('CLIENT')==5
assert [r for *_,r in users].count('FREELANCER')==14
for email,encoded,role in users:
    alg,it,salt,key=encoded.split('$');assert alg=='pbkdf2_sha256' and int(it)==160000
    assert hashlib.pbkdf2_hmac('sha256',b'Demo@2026Safe!',base64.b64decode(salt),160000)==base64.b64decode(key)
seeds=re.findall(r"SELECT '(seed-[^']+|category-[^']+)'",sql)
assert len(seeds)==len(set(seeds))
assert sum(1 for s in seeds if s.startswith('seed-job-'))==10
assert sum(1 for s in seeds if s.startswith('seed-app-'))==14
assert sum(1 for s in seeds if s.startswith('seed-project-'))==5
assert sum(1 for s in seeds if s.startswith('seed-milestone-'))==10
assert 'ON DUPLICATE KEY UPDATE' in sql
print('PASS seed account count, roles, unique emails, 20 hashes, records and idempotence markers')
