const transitions = {
  OPEN:['SUBMITTED'],
  SUBMITTED:['REVISION','APPROVED'],
  REVISION:['SUBMITTED'],
  APPROVED:[]
};
export function canTransitionMilestone(from,to,role){
  if(!transitions[from]?.includes(to)) return false;
  return (to==='SUBMITTED' && role==='FREELANCER') || (['APPROVED','REVISION'].includes(to) && role==='CLIENT');
}
export const canApply = (job, freelancerId) => job.status==='PUBLISHED' && job.clientId!==freelancerId;
export const canReview = (jobStatus, authorId, targetId) => jobStatus==='COMPLETED' && authorId!==targetId;
