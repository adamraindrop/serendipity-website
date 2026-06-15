/* Serendipity — HubSpot Readiness Score
   Logic/content from the signed-off prototype (v1.2). Data verbatim;
   the radar + category bars are recolored to the brand data-viz language
   (brand-blue lines, gold key points, teal = win). */
(function () {
// ====== BRAND DATA-VIZ COLORS ======
var C = { line:"#E2E8EE", accent:"#175477", gold:"#E9B44C", goldDeep:"#C8902F",
          teal:"#0E7C86", ink2:"#51606E", alert:"#B4472E" };

// ====== DATA ======
const CATS = [
 {key:"data", name:"CRM Data Readiness", intro:"First, the state of your customer data today.", weight:1},
 {key:"sales", name:"Sales Process Clarity", intro:"Now, how deals actually move through your business.", weight:1},
 {key:"mktg", name:"Marketing Process Clarity", intro:"Next, how strangers become leads, and what happens to them.", weight:1},
 {key:"report", name:"Reporting Visibility", intro:"How you see (or don't see) what's working.", weight:1},
 {key:"adopt", name:"Team Adoption & Training", intro:"The #1 predictor of CRM success: your people.", weight:1.25},
 {key:"auto", name:"Automation Readiness", intro:"What automation would amplify today, good or bad.", weight:1},
 {key:"lead", name:"Leadership Alignment", intro:"Finally, the questions that decide most projects before they start.", weight:1.25},
];
const QS = [
 {c:0,q:"Where does your customer and prospect information live today?",opts:["Scattered: inboxes, phones, and personal spreadsheets; no single list exists","Mostly in spreadsheets or an old system, with side copies everywhere","In one main system, but with known gaps and side spreadsheets","In one system everyone uses, with rules for how data gets in"],flag:{on:0,title:"No single source of customer truth",stat:"B2B contact data decays ~22% per year. Without one owned system, every list you have is quietly rotting, and migration becomes archaeology."}},
 {c:0,q:"Who is responsible for keeping your customer data clean?",opts:["No one. It's nobody's job","Everyone, which means no one in practice","One person tries to, alongside their real job","A named owner with time set aside, plus rules that prevent bad data entering"],flag:{on:0,title:"Nobody owns the data",stat:"Unowned data is the #1 reason reports get distrusted and CRMs get abandoned. Garbage in, garbage out, at scale."}},
 {c:0,q:"If you moved systems tomorrow, do you know what data you'd take and what you'd leave behind?",opts:["We'd move everything and sort it out later","We haven't thought about it","Rough idea of what matters, nothing written down","Yes, we know what's worth migrating, what gets archived, and what gets deleted"],flag:{on:0,title:"\"Migrate everything\" plan",stat:"Moving a mess into HubSpot gives you the same mess with a nicer interface. Migration triage is step one of every successful implementation."}},
 {c:1,q:"If two of your salespeople described how a deal moves from first call to close, would you get the same answer?",opts:["No, every rep does it their own way","Roughly similar, but the details differ a lot","Mostly the same; the process is understood but not written down","Yes, it's documented, and deals follow defined steps"],flag:{on:0,title:"No defined sales process",stat:"A CRM mirrors your process. If every rep sells differently, HubSpot will faithfully record the chaos, it can't invent the process for you."}},
 {c:1,q:"What has to be true for a deal to move to the next stage of your pipeline?",opts:["We don't really have stages","Whatever the rep feels, stages move on gut","We have stage definitions, but they're loose and people interpret them differently","Each stage has specific, checkable criteria (e.g., budget confirmed, decision-maker met)"]},
 {c:1,q:"Do sales and marketing agree on what a \"qualified lead\" is?",opts:["We've never discussed it","We use the words but mean different things","There's a shared understanding, but it's not written down","Yes, written criteria both teams signed off on"],flag:{on:0,title:"No shared definition of a lead",stat:"Only ~8% of companies have a documented lead definition both teams signed. It's the single most common root cause of the sales-vs-marketing blame loop."}},
 {c:2,q:"What happens in the first 24 hours after someone fills out a form on your website?",opts:["We don't have forms / nothing happens automatically","Someone gets an email notification and follows up when they can","There's a follow-up routine, but it depends on who's available","Defined response: instant confirmation, routed to the right person, follow-up SLA"],flag:{on:0,title:"Leads go unanswered",stat:"Speed-to-lead is one of the strongest conversion levers in B2B, and one of the first things a good HubSpot build fixes. Right now, leads are leaking."}},
 {c:2,q:"Can you say which marketing channel produced your last 10 customers?",opts:["No idea","We could guess","We track where leads come from, but not through to revenue","Yes, we track source from first touch to closed revenue"]},
 {c:2,q:"What happens to leads who aren't ready to buy yet?",opts:["Nothing, if they don't buy, they're forgotten","They sit in a list somewhere","Occasional newsletters keep us vaguely in touch","A deliberate nurture path keeps them warm until they're ready"]},
 {c:3,q:"How do you find out how the business is doing on sales right now?",opts:["I ask people and get verbal updates","Someone builds me a spreadsheet when I ask","We have reports, but I don't fully trust them","I open a dashboard and believe what it says"]},
 {c:3,q:"When sales and marketing report numbers in the same meeting, do they match?",opts:["We don't compare them","Rarely, there's always an argument about whose number is right","Usually close, with some reconciling","Yes, one agreed definition for each metric"],flag:{on:1,title:"Two versions of the truth",stat:"When every meeting starts with an argument about whose number is right, decisions stall. One agreed data model is the fix, and it's a design decision, not a report."}},
 {c:3,q:"If a board member asked \"what did you get for last quarter's marketing spend?\", could you answer with numbers?",opts:["No","Activity numbers only (emails sent, clicks)","Leads generated, but not revenue impact","Yes, pipeline and revenue attributable to marketing"]},
 {c:4,q:"Who would own HubSpot day-to-day at your company?",opts:["No idea, we haven't thought about it","Whoever has spare time","A named person, on top of their full-time job","A named owner with real time allocated (or a partner/admin engaged)"],flag:{on:0,title:"No system owner",stat:"CRMs without a named owner drift within months: duplicate fields, broken workflows, dying dashboards. Ownership is a pre-launch decision."}},
 {c:4,q:"What happened with the last software tool you rolled out to the team?",opts:["It failed, people went back to the old way","Mixed, some use it, some never did","Adopted eventually, after a rocky start","Smooth, we planned training and follow-through, and it stuck"],flag:{on:0,title:"A rollout already failed here",stat:"63% of CRM failures trace to training and adoption gaps, not software. Whatever sank the last tool will sink this one unless it's addressed head-on."}},
 {c:4,q:"How would your sales team react to being asked to log everything in a CRM?",opts:["Open revolt, they see it as surveillance and busywork","Grumbling compliance that fades after a month","They'd do it if they saw it helping them sell","They already work this way and would expect it"]},
 {c:5,q:"If you automated your follow-up process tomorrow, what would happen?",opts:["Disaster, the process doesn't work reliably even when humans do it","Unclear, the process changes depending on who runs it","Mostly fine, with some embarrassing edge cases","It would just get faster, the process is consistent today"],flag:{on:0,title:"Process isn't automation-ready",stat:"Automation amplifies whatever process it touches. Automating a broken follow-up process just delivers the wrong email faster. Process first, then automation."}},
 {c:5,q:"When a new lead comes in, how does it get to the right person?",opts:["It often doesn't, leads slip through","Someone forwards it when they see it","A simple rule or rotation, manually maintained","Automatic routing with a backstop so nothing is missed"],flag:{on:0,title:"Leads are slipping through",stat:"Lead routing with a backstop is week-one HubSpot work, and one of the fastest ROI wins available. Every slipped lead is paid-for demand, wasted."}},
 {c:5,q:"What's your philosophy on automation?",opts:["\"Buy the tool and it'll fix our process\"","\"Automate everything as fast as possible\"","\"Automate the obvious stuff and see\"","\"Fix the process first, then automate what's proven\""]},
 {c:6,q:"Who at the leadership level owns this project's success?",opts:["No one yet, it would be delegated down","The department head who wants the tool","An exec is supportive but hands-off","A named executive sponsor who will personally use the system and defend the budget"],flag:{on:0,title:"No executive sponsor",stat:"CRM projects without an executive sponsor fail at roughly 3x the rate. Delegating the system down tells the team it's optional, and they'll treat it that way."}},
 {c:6,q:"What's budgeted beyond the software license?",opts:["Nothing, the license is the budget","A little implementation help, nothing for training","Implementation plus some training","Implementation, training, adoption time, and ongoing optimization"],flag:{on:0,title:"License-only budget",stat:"Successful implementations follow a 40/40/20 split: planning, adoption, technology. A license-only budget funds the 20% and skips the 80% that determines success."}},
 {c:6,q:"If HubSpot were live today, what would your leadership team do differently on Monday morning?",opts:["Honestly, probably nothing","Not sure, we'd hope to \"have better visibility\"","We'd check a couple of new reports","We'd run our weekly meeting from it and retire the spreadsheets"]},
];
const STAGES=[
 {min:0,max:45,name:"Flying Blind",desc:"HubSpot would record the chaos, not fix it. The good news: every gap below is fixable, and fixing them first is what separates implementations that work from the 50% that fail."},
 {min:45.01,max:65,name:"Foundations",desc:"Real building blocks exist, but gaps in process and ownership would surface fast under a new system. Fix the fundamentals below first and the investment compounds."},
 {min:65.01,max:85,name:"Ready to Build",desc:"You're more prepared than most companies that go live. A structured implementation would convert this readiness into adoption, visibility, and pipeline, fast."},
 {min:85.01,max:100,name:"Ready to Scale",desc:"Rare air: your processes and alignment are ahead of the curve. The opportunity now is sophistication: automation, attribution, AI-assisted workflows, and reporting leadership actually runs on."},
];
const VERDICTS={
 data:["Your data isn't ready to migrate, triage and ownership come first.","Workable data with known gaps; a structured cleanup pass pre-migration pays for itself.","Clean enough to migrate with confidence, rare and valuable."],
 sales:["No consistent sales process to model, the CRM would mirror improvisation.","A real process exists but lives in habit, not definition; pipeline stages need exit criteria.","A documented, repeatable process. HubSpot can model this on day one."],
 mktg:["The lead journey is undefined; demand is leaking before any tool could capture it.","Channels exist but the funnel isn't instrumented end to end.","A mapped funnel ready to be measured to revenue."],
 report:["Decisions run on gut and verbal updates; the data to change that doesn't exist yet.","Reports exist but trust is partial, definitions and sources need to be unified.","Dashboards your leadership actually believes, the foundation for forecasting."],
 adopt:["Adoption is the project's biggest risk; without ownership and training it will stall.","Mixed adoption signals, a champion structure and role-based training would de-risk launch.","A team that already works in systems; rollout friction will be low."],
 auto:["Automating now would amplify broken processes; sequence is process then automation.","Selective automation is in reach once the core processes are documented.","Processes consistent enough to automate aggressively, the fun part."],
 lead:["Leadership alignment is the gap most likely to sink this project, sponsor, budget, and outcomes are undefined.","Leadership is supportive but not yet committed in numbers, ownership, or budget.","Sponsored, funded, and outcome-defined, the way winning projects start."],
};
const ACTIONS={
 data:"Run a migration triage: define what migrates, what archives, what dies, and name a data owner before go-live.",
 sales:"Write exit criteria for every pipeline stage on one page; get every rep to agree it matches reality.",
 mktg:"Map every path a stranger takes to become a lead, then define the first-24-hours response for each.",
 report:"Agree one definition per core metric (lead, opportunity, win) between sales and marketing, in writing.",
 adopt:"Name the HubSpot owner and a champion per team; budget role-based training, not a single kickoff.",
 auto:"List your top 5 repetitive tasks and document the current process for each, that's your automation roadmap.",
 lead:"Secure a named executive sponsor and define 2-3 numbers this project must move within 12 months.",
};
const QUALS=[
 {q:"What's the company's approximate annual revenue?",sub:"So we can benchmark you against companies your size.",opts:["Under $1M","$1M – $5M","$5M – $20M","$20M – $100M","$100M+"]},
 {q:"What best describes your business?",sub:"Readiness patterns differ a lot by category.",opts:["Manufacturing / industrial","Professional services","Software / technology","Business services","Distribution / wholesale","Healthcare / life sciences","Other"],otherIdx:6},
 {q:"What are you running today for CRM?",sub:"This shapes which recommendations you'll see.",opts:["No real CRM, spreadsheets and inboxes","HubSpot, but we're not getting full value from it","Salesforce","Another CRM (Zoho, Pipedrive, Dynamics, etc.)"]},
];
const CRM_NOTES=[
 "You're starting from a clean slate, no bad CRM habits to unlearn. Sequencing readiness BEFORE the tool puts you ahead of most first-time CRM buyers.",
 "You already own the platform, this scorecard is your rescue map. Most 'HubSpot isn't working' situations trace to the weak areas below, not the software.",
 "Coming from Salesforce: migrations succeed on data triage and adoption planning, both scored below. Done right, teams switch in ~3 months with both systems running in parallel.",
 "Switching CRMs is the perfect forcing function: fix the process gaps below BEFORE migrating, and the new system starts clean instead of inheriting old problems.",
];

// ====== STATE ======
let idx=0, qidx=0, qualOther="";
const answers=new Array(QS.length).fill(null);
const qualAnswers=new Array(QUALS.length).fill(null);
const TOTAL=QUALS.length+QS.length;
const $=id=>document.getElementById(id);

function startQuiz(){show("quiz");renderQual();}
function show(id){["intro","quiz","gate","results"].forEach(s=>$(s).classList.add("hidden"));$(id).classList.remove("hidden");window.scrollTo({top:0});}
function setProgress(done){
  $("barfill").style.width=(done/TOTAL*100)+"%";
  const left=TOTAL-done, mins=Math.max(1,Math.ceil(left*10/60));
  $("prognote").textContent=`Question ${done+1} of ${TOTAL} · about ${mins} minute${mins>1?"s":""} left`;
}
function renderQual(){
  setProgress(qidx);
  const q=QUALS[qidx];let h="";
  if(qidx===0){h+=`<div class="q-kicker">First, about your business</div><p class="q-sub">Three quick taps so we can benchmark your score against similar companies.</p>`;}
  h+=`<div class="q-text">${q.q}</div><p class="q-sub q-sub-tight">${q.sub}</p>`;
  q.opts.forEach((o,i)=>{
    if(q.otherIdx===i){h+=`<div id="other-wrap"><button class="opt" onclick="SQ.showOther()">${o}…</button></div>`;}
    else{h+=`<button class="opt" onclick="SQ.answerQual(${i})">${o}</button>`;}
  });
  if(qidx>0)h+=`<button class="nav-back" onclick="SQ.qualBack()">← Previous question</button>`;
  $("qbox").innerHTML=h;
}
function showOther(){
  $("other-wrap").innerHTML=`<div class="other-row"><input type="text" id="other-in" placeholder="Tell us your industry…" autofocus><button class="btn btn-gold" onclick="SQ.submitOther()">Next <span class="arrow">→</span></button></div>`;
  $("other-in").focus();
  $("other-in").addEventListener("keydown",e=>{if(e.key==="Enter")submitOther();});
}
function submitOther(){qualOther=($("other-in").value||"").trim();answerQual(QUALS[qidx].otherIdx);}
function answerQual(i){qualAnswers[qidx]=i;qidx++;if(qidx>=QUALS.length){render();}else{renderQual();}}
function qualBack(){qidx--;renderQual();}
function render(){
  const q=QS[idx], cat=CATS[q.c];
  const firstOfCat = idx===0 || QS[idx-1].c!==q.c;
  setProgress(QUALS.length+idx);
  let h="";
  if(firstOfCat && q.c===3){h+=`<div class="q-halfway">You're past halfway, your data, sales, and marketing scores are already locked in.</div>`;}
  if(firstOfCat){h+=`<div class="q-kicker">Part ${q.c+1} of 7 · ${cat.name}</div><p class="q-sub">${cat.intro}</p>`;}
  else{h+=`<div class="q-kicker q-kicker-dim">${cat.name}</div>`;}
  h+=`<div class="q-text">${q.q}</div>`;
  q.opts.forEach((o,i)=>{h+=`<button class="opt" onclick="SQ.answer(${i})">${o}</button>`;});
  h+=`<button class="nav-back" onclick="SQ.back()">← Previous question</button>`;
  $("qbox").innerHTML=h;
}
function answer(i){answers[idx]=i;idx++;if(idx>=QS.length){buildTeaser();show("gate");}else{render();}}
function back(){if(idx===0){qidx=QUALS.length-1;show("quiz");renderQual();}else{idx--;render();}}

function buildTeaser(){
  const r=scoreIt();
  $("t-num").textContent=r.overall;
  $("t-stage").textContent=r.stage.name;
  const n=r.flags.length;
  $("t-risks").innerHTML = n>0
    ? `<b>${n} critical risk${n>1?"s":""} identified</b>, which of your answers put an implementation at risk, and why`
    : `<b>Critical risk check</b>, which answers help (or hurt) an implementation, and why`;
  const reco=recommend(r);const words=reco.title.split(" ");
  $("t-reco-lead").textContent=words.slice(0,2).join(" ")+" ";
  $("t-reco-blur").textContent=words.slice(2).join(" ");
}

// ====== SCORING ======
function scoreIt(){
  const cs=CATS.map(()=>({sum:0,n:0}));const flags=[];
  QS.forEach((q,i)=>{const a=answers[i]??0;cs[q.c].sum+=a+1;cs[q.c].n++;
    if(q.flag&&a===q.flag.on)flags.push(q.flag);});
  const catPct=cs.map(c=>c.sum/(c.n*4)*100);
  let w=0,t=0;CATS.forEach((c,i)=>{w+=catPct[i]*c.weight;t+=c.weight;});
  let overall=Math.round(w/t);
  let stage=STAGES.find(s=>overall>=s.min&&overall<=s.max)||STAGES[0];
  if(flags.length>=3&&overall>65){stage=STAGES[1];}
  return {catPct:catPct.map(Math.round),overall,stage,flags};
}
// ====== RECOMMENDATION ENGINE (6 paths) ======
function recommend(r){
  const crm=qualAnswers[2]??0;const catName=i=>CATS[i].name;
  const sorted=CATS.map((c,i)=>({i,p:r.catPct[i]})).sort((a,b)=>a.p-b.p);
  const weak1=sorted[0], weak2=sorted[1];const dataPct=r.catPct[0];
  const leadAdopt=(r.catPct[4]+r.catPct[6])/2;
  const seg=["manufacturing","professional services","software","business services","distribution","healthcare",(qualOther||"B2B")][qualAnswers[1]??6];
  const segProof=(qualAnswers[1]===0)?" We've run this exact play for manufacturing sales teams. 100% CRM adoption across a 26-rep team in one year.":"";
  let title,why,first;
  if(crm===1){
    title="A HubSpot Portal Audit & Rebuild";
    why=`You already own the right platform, the gap is how it's set up and used. Your scorecard points at ${catName(weak1.i)} (${weak1.p}%) and ${catName(weak2.i)} (${weak2.p}%) as the reasons HubSpot isn't paying for itself yet. An audit finds exactly what to rebuild, in what order, without starting over.${segProof}`;
    first=`a portal walkthrough focused on your two weakest areas, and the rebuild sequence`;
  } else if(crm===2||crm===3){
    if(dataPct<60){
      title="A Migration With Data Triage First";
      why=`Moving to HubSpot is the right move for a ${seg} company, but your CRM Data Readiness score (${dataPct}%) says migrating as-is would carry today's data problems into the new system. Triage first (what migrates, what archives, what dies), then a phased migration with both systems running in parallel.${segProof}`;
      first=`your data triage plan and a phased migration timeline (~3 months, no productivity loss)`;
    } else {
      title="A Phased CRM Migration to HubSpot";
      why=`Your data scored ${dataPct}%, solid enough to migrate without a full cleanup project first, which removes the biggest switching risk. The work is sequencing: map your process into HubSpot, migrate clean, and train against ${catName(weak1.i)}, your scorecard's weakest area (${weak1.p}%), so the new system sticks where the old one didn't.${segProof}`;
      first=`your migration sequence and what changes for your team day-to-day`;
    }
  } else {
    if(leadAdopt<50){
      title="A Foundation Sprint, Then Implementation";
      why=`A ${seg} company at your stage is exactly who HubSpot is built for, and your scores say the win is sequencing. ${catName(weak1.i)} (${weak1.p}%) is the kind of gap that sinks implementations when it's skipped, and it's fixable in weeks: ownership, definitions, and process on one page BEFORE the build starts. Companies that do this first are why some implementations work and half fail.`;
      first=`the 2-3 week foundation plan (ownership, definitions, process) and what the build looks like after`;
    } else if(r.overall>=66){
      title="A Full HubSpot Implementation";
      why=`You're more ready than most companies that go live, process, alignment, and ownership are largely in place. For a ${seg} company at your readiness level, a structured implementation converts that preparation into pipeline visibility fast, with ${catName(weak1.i)} (${weak1.p}%) addressed inside the build rather than as a blocker.${segProof}`;
      first=`scoping the build: pipelines, reporting, and a go-live plan with adoption baked in`;
    } else {
      title="A Guided Implementation With an Adoption Plan";
      why=`You have real foundations, and a ${seg} business without a CRM is leaving pipeline on the table every week. The scorecard says implement now, but with ${catName(weak1.i)} (${weak1.p}%) and ${catName(weak2.i)} (${weak2.p}%) addressed inside the rollout: training, ownership, and process definitions built alongside the system, not after it.${segProof}`;
      first=`the implementation plan, with your two weakest areas built into the rollout sequence`;
    }
  }
  return {title,why,first,weak1:catName(weak1.i)};
}

// ====== GATE -> RESULTS ======
function unlock(){
  const name=($("g-name").value||"").trim();
  const email=($("g-email").value||"").trim();
  const ok=/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const err=$("g-error");
  if(!name||!ok){err.style.display="block";err.textContent=!name?"Please add your name.":"Please enter a valid work email (e.g. test@test.com).";return;}
  err.style.display="none";
  showResults();
}
function showResults(){
  const r=scoreIt();show("results");
  $("r-num").textContent=r.overall;
  $("r-stage").textContent=r.stage.name;
  $("r-stagedesc").textContent=r.stage.desc;
  const rev=["under $1M","$1–5M","$5–20M","$20–100M","$100M+"][qualAnswers[0]??1];
  const seg=["manufacturing","professional services","software","business services","distribution","healthcare","B2B"][qualAnswers[1]??6];
  $("r-bench").textContent=`Directional benchmark: ${rev} ${seg} companies typically land in the Foundations band before a structured implementation. (Calibrates with live data.)`;
  const crmNote=CRM_NOTES[qualAnswers[2]??0];
  const old=$("crm-note");if(old)old.remove();
  $("r-stagedesc").insertAdjacentHTML("afterend",`<p class="crm-note" id="crm-note"><b>Where you're coming from:</b> ${crmNote}</p>`);
  const reco=recommend(r);
  $("reco-title").textContent=reco.title;
  $("reco-why").textContent=reco.why;
  $("reco-first").textContent=reco.first;
  document.querySelector("#cta-final p").textContent=`Book a free 30-minute Readiness Review. We'll walk your scorecard and map out ${reco.title.charAt(0).toLowerCase()+reco.title.slice(1)} for your team, no pitch, just the plan.`;
  // category bars + verdicts
  let ch="";CATS.forEach((c,i)=>{const p=r.catPct[i];const col=p<50?C.alert:(p<=75?C.goldDeep:C.teal);
    const v=VERDICTS[c.key][p<50?0:(p<=75?1:2)];
    ch+=`<div class="cat-line"><div class="cat-nm">${c.name}${c.weight>1?" *":""}</div><div class="cat-tr"><i style="width:${p}%;background:${col}"></i></div><div class="cat-pc">${p}%</div></div><div class="cat-verdict">${v}</div>`;});
  ch+=`<p class="cat-foot">* Weighted 1.25×, adoption and leadership predict implementation success more than tooling.</p>`;
  $("r-cats").innerHTML=ch;
  // risks
  if(r.flags.length){$("r-risks-wrap").classList.remove("hidden");
    $("r-risks").innerHTML=r.flags.map(f=>`<div class="risk"><b>${f.title}</b><span>${f.stat}</span></div>`).join("");}
  else{$("r-risks-wrap").classList.add("hidden");}
  // weakest 3 actions
  const order=CATS.map((c,i)=>({i,p:r.catPct[i]})).sort((a,b)=>a.p-b.p).slice(0,3);
  $("r-actions").innerHTML=order.map((o,k)=>`<div class="action"><div class="action-n">${k+1}</div><div><b>${CATS[o.i].name}</b>, ${ACTIONS[CATS[o.i].key]}</div></div>`).join("");
  drawRadar(r.catPct);
}

// ====== DEMO (sample scorecard) ======
function demoScorecard(){
  qualAnswers[0]=2; qualAnswers[1]=0; qualAnswers[2]=2; qualOther="";
  const demo={0:[1,1,0],1:[2,1,1],2:[1,2,0],3:[1,1,0],4:[2,1,2],5:[1,2,1],6:[2,2,2]};
  QS.forEach((q,i)=>{const arr=demo[q.c]; const pos=QS.slice(0,i).filter(x=>x.c===q.c).length; answers[i]=arr[pos];});
  showResults();
  const oldB=$("demo-banner");if(oldB)oldB.remove();
  $("results").insertAdjacentHTML("afterbegin",
    `<div class="demo-banner" id="demo-banner"><span>Sample scorecard, a $5–20M manufacturing company currently on Salesforce. Your results will reflect your own answers.</span><button onclick="location.href='assessment.html'">Take the real assessment</button></div>`);
}

// ====== RADAR (SVG) — brand data-viz colors ======
function drawRadar(p){
  const S=340,Cc=S/2,R=110,N=7;const pt=(i,r)=>{const a=Math.PI*2*i/N-Math.PI/2;return[Cc+r*Math.cos(a),Cc+r*Math.sin(a)];};
  let s=`<svg width="${S}" height="${S}" viewBox="0 0 ${S} ${S}" role="img" aria-label="Readiness radar across seven areas">`;
  [0.25,0.5,0.75,1].forEach(f=>{s+=`<polygon points="${Array.from({length:N},(_,i)=>pt(i,R*f).join(",")).join(" ")}" fill="none" stroke="${C.line}" stroke-width="1"/>`;});
  for(let i=0;i<N;i++){const[x,y]=pt(i,R);s+=`<line x1="${Cc}" y1="${Cc}" x2="${x}" y2="${y}" stroke="${C.line}"/>`;}
  s+=`<polygon points="${p.map((v,i)=>pt(i,R*v/100).join(",")).join(" ")}" fill="rgba(233,180,76,.20)" stroke="${C.goldDeep}" stroke-width="2"/>`;
  p.forEach((v,i)=>{const[x,y]=pt(i,R*v/100);s+=`<circle cx="${x}" cy="${y}" r="3.5" fill="${C.goldDeep}"/>`;});
  const labels=["Data","Sales","Marketing","Reporting","Adoption","Automation","Leadership"];
  labels.forEach((l,i)=>{const[x,y]=pt(i,R+26);s+=`<text x="${x}" y="${y}" text-anchor="middle" font-size="11" font-family="Archivo,sans-serif" fill="${C.ink2}">${l}</text>`;});
  s+=`</svg>`;$("radar").innerHTML=s;
}

// ====== PUBLIC API (for inline onclick) ======
window.SQ={startQuiz,showOther,submitOther,answerQual,qualBack,answer,back,unlock,demoScorecard};
document.addEventListener("DOMContentLoaded",function(){
  if(location.hash==="#sample"){demoScorecard();}
});
})();
