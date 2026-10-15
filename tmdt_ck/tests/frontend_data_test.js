/* Runs meaningful frontend data/encoding tests without a browser or external packages. */
const fs=require('fs'),vm=require('vm'),path=require('path');
const root=path.join(__dirname,'../src/web/js');let passed=0;
function check(label,result){if(!result)throw Error('FAIL '+label);passed++;console.log('PASS '+label)}
const doc={querySelector:selector=>selector==='.footer'?{}:null,getElementById:()=>null};
const context={document:doc,window:{location:{search:''}},URLSearchParams,Intl,console};
vm.createContext(context);vm.runInContext(fs.readFileSync(path.join(root,'talentmatch.js'),'utf8'),context);
check('original job dataset retained',vm.runInContext('jobs.length===4',context));
check('original candidate dataset retained',vm.runInContext('candidates.length===4',context));
check('XSS HTML escaping',vm.runInContext("safe('<img src=x onerror=alert(1)>').includes('&lt;img')",context));
check('original source repaired Vietnamese',vm.runInContext("jobs[0].description.includes('triển')",context));
check('currency formatting',vm.runInContext("formatCurrency(100000).includes('100.000')",context));
const source=fs.readFileSync(path.join(root,'workspace.js'),'utf8');
const testCode=source.replace(/setup\(\)\.then\([\s\S]*?\)\.catch\([\s\S]*?\);\s*\}\)\(\);\s*$/,'globalThis.TEST={sections,cfg,demoSeed,store};})();');
if(testCode===source)throw Error('Cannot isolate workspace initialization');
const sandbox={console,structuredClone,URLSearchParams,localStorage:{getItem:()=>null,setItem:()=>{}},location:{search:''},window:{},document:{}};
vm.createContext(sandbox);vm.runInContext(testCode,sandbox);const x=sandbox.TEST;
check('demo users total 20',x.demoSeed.users.length===20);
check('14 demo freelancers',x.demoSeed.freelancers.length===14);
check('admin nav covers 13+ sections',x.sections.ADMIN.length>=13);
check('freelancer nav covers core flows', ['applications','milestones','agreements','messages','payments','reports','premium'].every(k=>x.sections.FREELANCER.some(s=>s[0]===k)));
check('client nav covers core flows',['jobs','invitations','applications','projects','payments','reviews'].every(k=>x.sections.CLIENT.some(s=>s[0]===k)));
check('status arrays configured for every record type',Object.values(x.cfg).every(z=>Array.isArray(z.states)));
check('sample milestone references sample project',x.demoSeed.milestones.every(y=>x.demoSeed.projects.some(p=>p.id===y.projectId)));
console.log('Frontend data checks passed:',passed);
