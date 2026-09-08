import assert from 'node:assert/strict';
import {salarySchedule, loanMath, buildSchedule, applyPayments} from './core.js';

let tests=0;
function ok(cond,msg){tests++; assert.ok(cond,msg)}

// 1) Default math
let m=loanMath({loanAmount:10000,termMonths:6,numberOfPayments:12,monthlyInterestRate:.05,latePenaltyRate:.05});
ok(Math.abs(m.interest-3000)<1e-9,'interest');
ok(Math.abs(m.total-13000)<1e-9,'total');
ok(Math.abs(m.regular-1083.3333333333333)<1e-9,'regular');

// 2) Salary schedule, first salary date is first due date
for(let d1=1; d1<=31; d1++) for(let d2=1; d2<=31; d2++){
  const dates=salarySchedule('2026-09-03',d1,d2,12);
  ok(dates.length===12,'12 dates');
  for(let i=1;i<dates.length;i++) ok(dates[i]>dates[i-1],`ascending ${d1}/${d2}/${i}`);
  ok(dates[0].getDate()===Math.min(d1,30),'first salary day');
}

// 3) Each supported payment count has exactly that many schedule rows.
for(let n=1;n<=12;n++) ok(buildSchedule({loanDate:'2026-09-03',loanAmount:10000,termMonths:6,numberOfPayments:n,salaryDay1:19,salaryDay2:4,graceDays:3,monthlyInterestRate:.05,latePenaltyRate:.05}).length===n,`count ${n}`);

// 4) 3-month / 6-payment
m=loanMath({loanAmount:5000,termMonths:3,numberOfPayments:6,monthlyInterestRate:.05,latePenaltyRate:.05});
ok(Math.abs(m.total-5750)<1e-9,'3m total');
ok(Math.abs(m.regular-958.3333333333334)<1e-9,'3m regular');

// 5) Grace: 9/15 due, grace ends 9/18, 9/18 no late trigger, 9/19 late.
const input={loanDate:'2026-09-03',loanAmount:10000,termMonths:6,numberOfPayments:12,salaryDay1:15,salaryDay2:30,graceDays:3,monthlyInterestRate:.05,latePenaltyRate:.05};
const sched=buildSchedule(input);
ok(sched[0].dueDate.toISOString().slice(0,10)==='2026-09-15','first due');
ok(sched[0].graceEnd.toISOString().slice(0,10)==='2026-09-18','grace end');
ok(sched[0].penaltyTrigger.toISOString().slice(0,10)==='2026-09-19','penalty trigger');
let r=applyPayments(input,[{paymentNumber:1,date:'2026-09-18',amount:sched[0].regularPayment}]);
ok(r[0].currentPenalty===0,'no penalty in grace');
r=applyPayments(input,[{paymentNumber:1,date:'2026-09-19',amount:sched[0].regularPayment}]);
ok(r[0].currentPenalty>0,'late penalty');

// 6) 1000 random scenarios
for(let i=0;i<1000;i++){
  const term=1+Math.floor(Math.random()*6), payments=1+Math.floor(Math.random()*12), amount=1000+Math.random()*49000;
  const d1=1+Math.floor(Math.random()*31), d2=1+Math.floor(Math.random()*31);
  const x={loanDate:'2026-01-03',loanAmount:amount,termMonths:term,numberOfPayments:payments,salaryDay1:d1,salaryDay2:d2,graceDays:3,monthlyInterestRate:.05,latePenaltyRate:.05};
  const s=buildSchedule(x);
  ok(s.length===payments,'random row count');
  ok(Math.abs(s.reduce((a,b)=>a+b.principalDue,0)-amount)<0.00001,'principal reconciles');
  ok(Math.abs(s.reduce((a,b)=>a+b.interest,0)-(amount*.05*term))<0.00001,'interest reconciles');
  for(let j=1;j<s.length;j++) ok(s[j].dueDate>s[j-1].dueDate,'random dates asc');
}
console.log(`PASS: ${tests} assertions.`);
