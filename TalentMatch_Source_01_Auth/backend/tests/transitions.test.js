import test from 'node:test';
import assert from 'node:assert/strict';
import {canApply,canTransitionMilestone,canReview} from '../src/services/transitions.js';
test('only freelancer may submit a milestone',()=>{
  assert.equal(canTransitionMilestone('OPEN','SUBMITTED','FREELANCER'),true);
  assert.equal(canTransitionMilestone('OPEN','SUBMITTED','CLIENT'),false);
});
test('only client may approve a submission',()=>{
  assert.equal(canTransitionMilestone('SUBMITTED','APPROVED','CLIENT'),true);
  assert.equal(canTransitionMilestone('SUBMITTED','APPROVED','FREELANCER'),false);
  assert.equal(canTransitionMilestone('APPROVED','REVISION','CLIENT'),false);
});
test('cannot apply to a closed job or own job',()=>{
  assert.equal(canApply({status:'PUBLISHED',clientId:'client'},'freelancer'),true);
  assert.equal(canApply({status:'IN_PROGRESS',clientId:'client'},'freelancer'),false);
  assert.equal(canApply({status:'PUBLISHED',clientId:'client'},'client'),false);
});
test('reviews only allowed after completion',()=>{
  assert.equal(canReview('IN_PROGRESS','client','freelancer'),false);
  assert.equal(canReview('COMPLETED','client','freelancer'),true);
  assert.equal(canReview('COMPLETED','client','client'),false);
});
