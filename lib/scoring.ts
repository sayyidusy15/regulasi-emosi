export type Answers = Record<number, number>;

export const erq30Subscales = [
  {key:"behavioral_activation",label:"Behavioral Activation",items:[4,14,23],mean:14.78,sd:3.62},
  {key:"problem_solving",label:"Problem Solving",items:[6,16,25],mean:16.12,sd:3.32},
  {key:"situational_avoidance",label:"Situational Avoidance",items:[5,15,24],mean:14.56,sd:4.10},
  {key:"social_withdrawal",label:"Social Withdrawal",items:[11,21,30],mean:13.10,sd:4.92},
  {key:"distraction",label:"Distraction",items:[9,19,28],mean:15.48,sd:3.69},
  {key:"rumination",label:"Rumination",items:[8,18,27],mean:10.39,sd:4.59},
  {key:"acceptance",label:"Acceptance",items:[10,20,29],mean:14.89,sd:4.04},
  {key:"cognitive_reappraisal",label:"Cognitive Reappraisal",items:[1,3,12],mean:14.97,sd:3.97},
  {key:"expressive_suppression",label:"Expressive Suppression",items:[2,13,22],mean:12.52,sd:4.86},
  {key:"social_sharing",label:"Social Sharing",items:[7,17,26],mean:12.01,sd:4.97},
] as const;

export function scoreErq30(answers:Answers){
  if(Object.keys(answers).length!==30)throw new Error("Semua 30 jawaban diperlukan untuk menghitung hasil.");
  return erq30Subscales.map(subscale=>{
    const score=subscale.items.reduce((sum,item)=>{
      const answer=answers[item];
      if(!Number.isInteger(answer)||answer<1||answer>7)throw new Error(`Jawaban Q${String(item).padStart(2,"0")} harus bernilai 1–7.`);
      return sum+answer;
    },0);
    const category=score>=subscale.mean+subscale.sd?"high":score<=subscale.mean-subscale.sd?"low":"average";
    return {...subscale,score,category};
  });
}
