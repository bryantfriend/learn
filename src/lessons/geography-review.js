// Reviews retrieve earlier ideas for a different purpose on each visit.
const formats=[
 {name:'Mistake clinic',task:'Find the error in the proposed answer. Replace it, explain the misconception and write a clue that would help another pupil avoid it.'},
 {name:'Evidence hearing',task:'Give a verdict using the supplied evidence. A partner challenges one claim; respond by distinguishing what is supported from what is still unknown.'},
 {name:'Teach the missing step',task:'Prepare a three-step explanation for someone who missed the lesson. Include an example, a common wrong turn and a check. Partners follow the steps and report any gap.'},
 {name:'Design a counterexample',task:'Create a changed case in which a tempting answer fails. Show the original reasoning, change one condition and explain what must now be reconsidered.'},
 {name:'Field notebook rescue',task:'Create a compact field-note record with the question, relevant facts, method and conclusion. Mark an uncertainty and name a concrete observation that could resolve it.'}
];
export function reviewMission(mission,p,serial,station){
 const format=formats[serial%formats.length];
 return {title:`${format.name} · ${p.objective}`,source:`Review case: ${p.prompt} Proposed answer: “${p.wrong}”. Method note: ${p.model}`,
  task:`Station ${station+1}: ${format.task}`,
  answer:`Correction: ${p.correct} ${p.explanation} A complete response must explain the method, not simply copy the correct choice. For a changed case, accept different answers only when the new condition actually supports them.`,
  exit:`State one error you can now catch in ${p.objective.toLowerCase()}. Correct it with a specific example.`,
  reviewFormat:format.name};
}
