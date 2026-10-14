// In-memory API contract tests. Real PostgreSQL/SMTP/provider tests are separate;
// these exercise Express handlers using controlled database and provider doubles.
import test,{mock} from 'node:test';
import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import http from 'node:http';

process.env.GOOGLE_CLIENT_ID='unit-google-id';
process.env.GOOGLE_CLIENT_SECRET='unit-google-secret';
process.env.FACEBOOK_APP_ID='unit-facebook-id';
process.env.FACEBOOK_APP_SECRET='unit-facebook-secret';
process.env.FRONTEND_URL='http://localhost:5173';
process.env.BACKEND_URL='http://localhost:4000';
const state={users:new Map(),tokens:new Map(),sessions:new Map(),oauth:new Map(),oauthStates:new Map(),sent:[],failMail:false,nonce:'',counter:0,fbValid:true,fbUserId:'fb-123',googleJwtInvalid:false};
const id=()=>`mock_${++state.counter}`;
const fresh=(obj,where)=>Object.entries(where||{}).every(([k,v])=>{
  if(k==='expiresAt')return obj.expiresAt>v.gt;
  if(k==='createdAt')return obj.createdAt>v.gt;
  return obj[k]===v;
});
function lookup(collection,where){return [...collection.values()].find(row=>fresh(row,where));}
const db={
  user:{
    create:async({data})=>{
      if(lookup(state.users,{email:data.email})){const e=new Error('duplicate');e.code='P2002';throw e;}
      const u={...data,id:id(),locked:false,emailVerifiedAt:data.emailVerifiedAt??null};delete u.freelancer;delete u.oauthAccounts;
      state.users.set(u.id,u);
      if(data.oauthAccounts){const linked=data.oauthAccounts.create;const account={...linked,id:id(),userId:u.id};state.oauth.set(`${linked.provider}:${linked.providerUserId}`,account);}
      return u;
    },
    findUnique:async({where})=>where.email?lookup(state.users,{email:where.email}):state.users.get(where.id),
    update:async({where,data})=>{const u=state.users.get(where.id);Object.assign(u,data);return u;}
  },
  emailToken:{
    create:async({data})=>{const row={...data,id:id(),createdAt:new Date()};state.tokens.set(row.id,row);return row;},
    findUnique:async({where})=>lookup(state.tokens,where),
    findFirst:async({where})=>[...state.tokens.values()].filter(r=>fresh(r,where)).sort((a,b)=>b.createdAt-a.createdAt)[0]||null,
    count:async({where})=>[...state.tokens.values()].filter(r=>fresh(r,where)).length,
    deleteMany:async({where})=>{let count=0;for(const [key,row] of state.tokens){if(fresh(row,where)){state.tokens.delete(key);count++;}}return {count};}
  },
  session:{
    create:async({data})=>{const row={...data,id:id()};state.sessions.set(row.id,row);return row;},
    findUnique:async({where})=>{const row=lookup(state.sessions,where);return row?{...row,user:state.users.get(row.userId)}:null;},
    deleteMany:async({where})=>{let count=0;for(const [key,row] of state.sessions){if(fresh(row,where)){state.sessions.delete(key);count++;}}return {count};}
  },
  oAuthState:{
    create:async({data})=>{state.oauthStates.set(data.stateHash,data);return data;},
    findUnique:async({where})=>state.oauthStates.get(where.stateHash),
    deleteMany:async({where})=>{const existed=state.oauthStates.delete(where.stateHash);return {count:existed?1:0};}
  },
  oAuthAccount:{
    findUnique:async({where})=>{const {provider,providerUserId}=where.provider_providerUserId;const found=state.oauth.get(`${provider}:${providerUserId}`);return found?{...found,user:state.users.get(found.userId)}:null;},
    create:async({data})=>{const k=`${data.provider}:${data.providerUserId}`;const row={...data,id:id()};state.oauth.set(k,row);return row;}
  },
  $transaction:async fn=>fn(db),
  $queryRaw:async()=>[]
};
mock.module('../src/lib/db.js',{namedExports:{db}});
mock.module('../src/lib/mail.js',{namedExports:{sendAccountEmail:async(to,purpose,token)=>{
  state.sent.push({to,purpose,token});
  if(state.failMail)throw new Error('mock mail outage');
  return {provider:'smtp',accepted:true};
}}});
mock.module('jose',{namedExports:{createRemoteJWKSet:()=>()=>({}),jwtVerify:async()=>{if(state.googleJwtInvalid)throw new Error('invalid signature');return {payload:{sub:'google-user-11',email:'google-new@example.com',email_verified:true,nonce:state.nonce,exp:Math.floor(Date.now()/1000)+3600,name:'Google Test'}}}}});
const {default:express}=await import('express');
const {default:cookieParser}=await import('cookie-parser');
const {default:authRouter}=await import('../src/routes/auth.js');
const {default:oauthRouter}=await import('../src/routes/oauth.js');
const {identify}=await import('../src/middleware/auth.js');
const {errorHandler}=await import('../src/lib/errors.js');
const app=express();app.use(express.json());app.use(cookieParser());app.use(identify);app.use('/auth',authRouter);app.use('/oauth',oauthRouter);app.use(errorHandler);
const srv=http.createServer(app);await new Promise(resolve=>srv.listen(0,'127.0.0.1',resolve));
const api=`http://127.0.0.1:${srv.address().port}`;
const nativeFetch=globalThis.fetch;
let fbEmail='facebook-new@example.com';
globalThis.fetch=async(url,opts)=>{
  const u=new URL(url);
  if(u.hostname==='oauth2.googleapis.com')return new Response(JSON.stringify({id_token:'stub-jwt'}),{status:200});
  if(u.hostname==='graph.facebook.com'){
    if(u.pathname.endsWith('/oauth/access_token'))return new Response(JSON.stringify({access_token:'stub-fb-token'}),{status:200});
    if(u.pathname.endsWith('/debug_token'))return new Response(JSON.stringify({data:{is_valid:state.fbValid,app_id:'unit-facebook-id',user_id:state.fbUserId}}),{status:200});
    if(u.pathname.endsWith('/me'))return new Response(JSON.stringify({id:state.fbUserId,name:'Facebook Test',...(fbEmail?{email:fbEmail}:{})}),{status:200});
  }
  return nativeFetch(url,opts);
};
test.after(()=>{globalThis.fetch=nativeFetch;srv.close();});
async function request(url,method='GET',body,cookie){
  const res=await nativeFetch(api+url,{method,headers:{...(body?{'Content-Type':'application/json'}:{}),...(cookie?{Cookie:cookie}:{})},body:body?JSON.stringify(body):undefined,redirect:'manual'});
  const data=res.headers.get('content-type')?.includes('json')?await res.json():null;
  return {status:res.status,data,location:res.headers.get('location'),cookie:res.headers.get('set-cookie')?.split(';')[0]};
}
function post(url,body,cookie){return request(url,'POST',body,cookie)}
function lastToken(purpose){return state.sent.filter(x=>x.purpose===purpose).at(-1)?.token}
async function oauth(provider,opts={}){
  const params=new URLSearchParams();if(opts.role)params.set('role',opts.role);if(opts.link)params.set('link','1');
  const start=await request(`/oauth/${provider}/start${params.size?'?'+params:''}`,'GET',null,opts.cookie);
  assert.equal(start.status,302);
  const u=new URL(start.location),stateValue=u.searchParams.get('state');
  if(provider==='google')state.nonce=JSON.parse(state.oauthStates.get(crypto.createHash('sha256').update(stateValue).digest('hex')).verifier).nonce;
  const callback=`/oauth/${provider}/callback?state=${encodeURIComponent(stateValue)}&code=fake-code`;
  return {start,callback};
}

test('registration email outage preserves pending user, retry, invalid/expired/single-use verification',async()=>{
  state.failMail=true;
  const data={fullName:'First User',email:'first@example.com',password:'LongPassword!123',role:'CLIENT',agreed:true};
  assert.equal((await post('/auth/register',{...data,password:'onlyletters'})).status,400);
  const created=await post('/auth/register',data);
  assert.equal(created.status,201);assert.equal(created.data.emailSent,false);
  assert.ok(lookup(state.users,{email:data.email}));
  assert.equal((await post('/auth/register',data)).status,409);
  assert.equal((await post('/auth/login',{email:data.email,password:data.password})).status,403);
  state.failMail=false;
  assert.equal((await post('/auth/resend-verification',{email:data.email})).status,200);
  const token=lastToken('VERIFY');assert.ok(token);
  const before=state.sent.length;
  await post('/auth/resend-verification',{email:data.email});
  assert.equal(state.sent.length,before,'per-account cooldown prevents a duplicate email');
  assert.equal((await post('/auth/verify-email',{token:'x'.repeat(44)})).status,400);
  const row=[...state.tokens.values()].find(r=>r.purpose==='VERIFY');row.expiresAt=new Date(0);
  assert.equal((await post('/auth/verify-email',{token})).status,400);
  row.expiresAt=new Date(Date.now()+10_000);
  assert.equal((await post('/auth/verify-email',{token})).status,200);
  assert.equal((await post('/auth/verify-email',{token})).status,400);
});

test('login, credential errors, protected me, logout invalidates session',async()=>{
  const bad=await post('/auth/login',{email:'first@example.com',password:'wrong'});assert.equal(bad.status,401);
  const okay=await post('/auth/login',{email:'first@example.com',password:'LongPassword!123'});assert.equal(okay.status,200);
  assert.equal((await request('/auth/me','GET',null,okay.cookie)).status,200);
  assert.equal((await post('/auth/logout',{},okay.cookie)).status,200);
  assert.equal((await request('/auth/me','GET',null,okay.cookie)).status,401);
});

test('password reset does not enumerate, rejects invalid/replayed, revokes sessions',async()=>{
  const existing=await post('/auth/forgot-password',{email:'first@example.com'});
  const missing=await post('/auth/forgot-password',{email:'missing@example.com'});
  assert.equal(existing.status,200);assert.equal(existing.data.message,missing.data.message);
  const token=lastToken('RESET');
  assert.equal((await post('/auth/reset-password',{token:'invalid-token'.repeat(5),password:'AnotherPassword!456'})).status,400);
  const old=await post('/auth/login',{email:'first@example.com',password:'LongPassword!123'});
  assert.equal(old.status,200);
  assert.equal((await post('/auth/reset-password',{token,password:'AnotherPassword!456'})).status,200);
  assert.equal((await post('/auth/reset-password',{token,password:'AnotherPassword!456'})).status,400);
  assert.equal((await request('/auth/me','GET',null,old.cookie)).status,401);
  assert.equal((await post('/auth/login',{email:'first@example.com',password:'AnotherPassword!456'})).status,200);
});

test('Google OAuth PKCE, nonce, code exchange, state one-use, verified session and email collision',async()=>{
  const flow=await oauth('google');
  assert.ok(new URL(flow.start.location).searchParams.get('code_challenge'));
  const bad=await request(flow.callback,'GET',null,'tm_oauth_google=incorrect');
  assert.equal(bad.location,'http://localhost:5173/login?oauth=failed');
  const good=await request(flow.callback,'GET',null,flow.start.cookie);
  assert.equal(good.status,302);assert.equal(good.location,'http://localhost:5173/dashboard');
  assert.ok([...state.sessions.values()].some(s=>state.users.get(s.userId).email==='google-new@example.com'));
  const reused=await request(flow.callback,'GET',null,flow.start.cookie);
  assert.match(reused.location,/oauth=failed/);
  state.users.set('collision',{id:'collision',email:'collide@example.com',locked:false,emailVerifiedAt:new Date(),role:'CLIENT'});
  // A verified email match without a linked provider identity must NOT auto-merge.
  const flow2=await oauth('google');
  const existingAccount=state.oauth.get('google:google-user-11');state.oauth.delete('google:google-user-11');
  state.users.get(existingAccount.userId).email='google-new@example.com';
  const conflict=await request(flow2.callback,'GET',null,flow2.start.cookie);
  assert.match(conflict.location,/oauth=existing_email/);
});

test('Facebook OAuth requires mailbox proof; cancellation, absent email handled',async()=>{
  fbEmail='fb-new@example.com';
  const flow=await oauth('facebook');
  const redirected=await request(flow.callback,'GET',null,flow.start.cookie);
  assert.match(redirected.location,/\/check-email\?/);
  assert.equal(redirected.cookie?.startsWith('tm_session='),false);
  assert.equal((await post('/auth/verify-email',{token:lastToken('VERIFY')})).status,200);
  const nextFlow=await oauth('facebook');
  const loggedIn=await request(nextFlow.callback,'GET',null,nextFlow.start.cookie);
  assert.equal(loggedIn.location,'http://localhost:5173/dashboard');
  const cancelledFlow=await oauth('facebook');
  const cancelled=await request(cancelledFlow.callback.replace('&code=fake-code','&error=access_denied'),'GET',null,cancelledFlow.start.cookie);
  assert.match(cancelled.location,/oauth=cancelled/);
  fbEmail='';
  const stillLinked=await oauth('facebook');
  assert.equal((await request(stillLinked.callback,'GET',null,stillLinked.start.cookie)).location,'http://localhost:5173/dashboard');
  state.oauth.delete('facebook:fb-123');
  const noEmail=await oauth('facebook');
  const rejected=await request(noEmail.callback,'GET',null,noEmail.start.cookie);
  assert.match(rejected.location,/oauth=missing_email/);
});


test('invalid provider tokens and explicit secure account linking',async()=>{
  const g=await oauth('google');
  state.googleJwtInvalid=true;
  assert.match((await request(g.callback,'GET',null,g.start.cookie)).location,/oauth=failed/);
  state.googleJwtInvalid=false;
  const f=await oauth('facebook');
  state.fbValid=false;
  assert.match((await request(f.callback,'GET',null,f.start.cookie)).location,/oauth=failed/);
  state.fbValid=true;
  const session=await post('/auth/login',{email:'first@example.com',password:'AnotherPassword!456'});
  assert.equal(session.status,200);
  state.fbUserId='fb-linked-777';fbEmail='';
  const link=await oauth('facebook',{link:true,cookie:session.cookie});
  const bothCookies=session.cookie+'; '+link.start.cookie;
  const linked=await request(link.callback,'GET',null,bothCookies);
  assert.equal(linked.location,'http://localhost:5173/profile?linked=facebook');
  const fromLinkedProvider=await oauth('facebook');
  assert.equal((await request(fromLinkedProvider.callback,'GET',null,fromLinkedProvider.start.cookie)).location,'http://localhost:5173/dashboard');
});
