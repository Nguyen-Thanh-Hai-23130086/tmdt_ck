// Rule-based matching, not AI. Every point has an explainable source.
export function scoreFreelancer(job,profile){
  const wanted=new Set((job.skills||[]).map(s=>s.toLowerCase().trim()));
  const matched=(profile.skills||[]).filter(s=>wanted.has(s.toLowerCase().trim()));
  const skillScore=wanted.size?Math.min(70,Math.round(70*matched.length/wanted.size)):35;
  const rateScore=profile.hourlyRate<=600000?20:10;
  const expScore=Math.min(10,profile.experienceYears*2);
  return {score:skillScore+rateScore+expScore,matchedSkills:matched,explanation:`Kỹ năng trùng: ${matched.length}/${wanted.size}; mức giá và kinh nghiệm đóng góp phần còn lại.`};
}
