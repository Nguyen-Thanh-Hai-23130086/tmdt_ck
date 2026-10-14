import test from 'node:test';
import assert from 'node:assert/strict';
import {scoreFreelancer} from '../src/services/matching.js';
test('matching scores exact overlapping skills with explanations',()=>{
  const r=scoreFreelancer({skills:['React','Node.js']},{skills:['react','Node.js','Figma'],hourlyRate:400000,experienceYears:5});
  assert.equal(r.score,100);assert.deepEqual(r.matchedSkills,['react','Node.js']);assert.match(r.explanation,/2\/2/);
});
test('matching never exceeds 100 points with duplicated candidate skills',()=>{
  const r=scoreFreelancer({skills:['React']},{skills:['React','React','React'],hourlyRate:10000,experienceYears:30});
  assert.equal(r.score,100);
});
test('matching is deterministic for disjoint skill sets',()=>{
  const j={skills:['Figma']},p={skills:['Java'],hourlyRate:700000,experienceYears:1};
  assert.equal(scoreFreelancer(j,p).score,12);assert.deepEqual(scoreFreelancer(j,p).matchedSkills,[]);
});
