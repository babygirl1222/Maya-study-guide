
// Tabs
const tabs = document.querySelectorAll('.tab');
const panels = document.querySelectorAll('.panel');
tabs.forEach(b=>{
  b.addEventListener('click',()=>{
    tabs.forEach(x=>x.classList.remove('active'));
    panels.forEach(p=>p.classList.remove('show'));
    b.classList.add('active');
    document.getElementById(b.dataset.target).classList.add('show');
    if(b.dataset.target==='streak'){ bumpStreak(); }
  });
});

// Hide banner
setTimeout(()=>{ const b=document.getElementById('welcomeBanner'); b&&b.remove(); }, 3200);

// Streak
const streakEl = document.getElementById('streakDays');
function todayKey(){ const d=new Date(); return `${d.getFullYear()}-${d.getMonth()+1}-${d.getDate()}`; }
function loadStreak(){ const s=JSON.parse(localStorage.getItem('maya_streak')||'{"days":0,"last":""}'); streakEl.textContent = s.days||0; }
function bumpStreak(){
  const key='maya_streak'; const d=JSON.parse(localStorage.getItem(key)||'{"days":0,"last":""}'); const t=todayKey();
  if(d.last!==t){ d.days=(d.days||0)+1; d.last=t; localStorage.setItem(key, JSON.stringify(d)); streakEl.textContent=d.days; }
}
document.getElementById('markMinuteBtn').addEventListener('click', bumpStreak);
loadStreak();

// Reflections auto-rotate
const thoughts = [
  "You showed up for yourself today — that is enough.",
  "Breathe. Calm is your superpower.",
  "Trust your training. You are capable and kind.",
  "Tiny reps count. Two minutes now beats zero later.",
  "Eyes up. One hill at a time.",
  "You can do hard things, gently.",
  "Calm is contagious. You bring it to every call."
];
const reflectionCard = document.getElementById('reflectionCard');
function rotateReflection(){ reflectionCard.textContent = thoughts[Math.floor(Math.random()*thoughts.length)]; }
rotateReflection(); setInterval(rotateReflection, 5000);

// Quizzes
const banks = {
  q1: [
    {q:"First three items to confirm on a 9-1-1 call?", c:["Location -> Callback -> Nature","Nature -> Name -> Location","Callback -> Nature -> Location","Nature -> Location -> Callback"], a:0},
    {q:"Caller: 'My dad isn't breathing!' Ask first:", c:["Pulse & skin color","Is he awake? Is he breathing normally?","Medications & age","Time last seen well"], a:1},
    {q:"Best address verification:", c:["Ask to repeat once","Repeat full address back incl. apt/unit","Assume GPS is accurate","Only ask cross streets"], a:1},
    {q:"Stay on the line until arrival:", c:["Domestic disturbance, suspect on scene","Minor fender-bender","Past theft","Mis-dial"], a:0},
    {q:"Proper radio check:", c:["Radio check anyone?","Dispatch, 2-1, radio check.","Key up silently","Check check check can you hear me?"], a:1},
    {q:"NATO phonetics for RPD-12:", c:["Ranger-Paul-David-1-2","Romeo-Papa-Delta-1-2","Roger-Peter-Doug-12","Raptor-Pluto-Delta-1-2"], a:1},
    {q:"Ack pair:", c:["Affirm / 10-9","Copy / 10-4","Wilco / 10-20","Stand by / 10-8"], a:1},
    {q:"Urgent officer-safety traffic:", c:["Talk over others","CAD only","Declare 'Emergency traffic' and wait","Wait for a long pause"], a:2},
    {q:"Avoid clipped audio:", c:["Speak loudly right away","Key-pause-speak","Hold mic 1 inch away","Talk faster"], a:1},
    {q:"'Unit 3-4, go to TAC-2.' You:", c:["Copy TAC-2; switch; check in on TAC-2","Switch silently","10-4 and stay primary","Ask why before switching"], a:0}
  ],
  q2: [
    {q:"Confirming jurisdiction helps:", c:["Assign correct agency","Decide caller credibility","Record phone brand","Choose phonetics set"], a:0},
    {q:"Best quick location tool:", c:["Nearest landmark/cross street","Caller's favorite store","ZIP code only","Map color"], a:0},
    {q:"When a road is the boundary:", c:["Ask which direction/side of road","Ignore and dispatch city","Assume county","Send both agencies immediately"], a:0},
    {q:"Documentation rule:", c:["Facts > feelings","Paraphrase every quote","Skip times","Use emojis for tone"], a:0},
    {q:"Key CAD times:", c:["Created, Dispatch, Enroute, On scene, Clear","Lunch, Break, Fuel, End","Open, Close","Ping, Ring"], a:0},
    {q:"Sensitive data handling:", c:["Only for official business","Share to group chat","Save to personal notes","Run plates for friends"], a:0},
    {q:"Mile markers help:", c:["Pinpoint highway incidents","Verify phone carriers","Estimate caller age","Decide shift change"], a:0},
    {q:"If unsure of city/county line:", c:["Ask clarifiers; cross streets; landmarks","Guess based on accent","Dispatch both silently","Delay until mapped"], a:0},
    {q:"When to quote a caller:", c:["Only when necessary/important","Always for drama","Never","Only if funny"], a:0},
    {q:"Correct record keeping:", c:["Objective language, timestamps, units","Opinions, feelings, guesses","Memes","All caps"], a:0}
  ],
  q3: [
    {q:"Priority info for responders:", c:["Weapons/suspects/hazards","Caller hobby","Music playing","TV volume"], a:0},
    {q:"Burglary in progress:", c:["Keep caller safe/quiet; get suspect info","Tell caller to investigate","Confront suspect","Delay to finish other calls"], a:0},
    {q:"MVC with injuries:", c:["Hazards, number of patients, entrapment","Ask favorite car color","Chat about insurance","End call quickly"], a:0},
    {q:"Missing child:", c:["Description, clothing, last known, direction","Favorite toy only","Punish guardians","Wait an hour"], a:0},
    {q:"Test tip:", c:["Read fully; eliminate wrong answers","Answer fast","Never change answers","Ignore keywords"], a:0},
    {q:"Mindset:", c:["Calm focus; verify location in scenarios","Rush through","Skip hard ones entirely","Use slang"], a:0},
    {q:"In-progress violent call:", c:["Update officers; prioritize safety info","Stay silent","Talk about weather","Share gossip"], a:0},
    {q:"EMD/EPD/ETC:", c:["Structured protocols for call-taking","Fun trivia","CAD themes","Spare docs"], a:0},
    {q:"Unit status importance:", c:["Know who is available/clear","Good for memes","Only for TL","Not needed"], a:0},
    {q:"After-dispatch follow-up:", c:["Monitor channel; log updates","Clock out","Delete call","Change channel randomly"], a:0}
  ]
};

function shuffle(arr){ for(let i=arr.length-1;i>0;i--){ const j=Math.floor(Math.random()*(i+1)); [arr[i],arr[j]]=[arr[j],arr[i]]; } return arr; }
function pick10(bank){ return shuffle(bank.slice()).slice(0,10); }

const sel = document.getElementById('quizSelect');
const start = document.getElementById('startQuiz');
const area = document.getElementById('quizArea');
const qIndexEl = document.getElementById('qIndex');
const qTotalEl = document.getElementById('qTotal');
const qText = document.getElementById('qText');
const choicesEl = document.getElementById('choices');
const nextBtn = document.getElementById('nextBtn');
const finishBtn = document.getElementById('finishBtn');
const result = document.getElementById('quizResult');
const scoreEl = document.getElementById('score');
const scoreTotalEl = document.getElementById('scoreTotal');

let current = []; let idx = 0; let selected = -1; let score = 0;

function renderQ(){
  const q = current[idx];
  qIndexEl.textContent = (idx+1);
  qTotalEl.textContent = current.length;
  qText.textContent = q.q;
  choicesEl.innerHTML = '';
  q.c.forEach((text, i)=>{
    const div = document.createElement('div');
    div.className = 'choice';
    div.textContent = text;
    div.addEventListener('click', ()=>{
      [...choicesEl.children].forEach(c=>c.classList.remove('active'));
      div.classList.add('active');
      selected = i;
    });
    choicesEl.appendChild(div);
  });
  selected = -1;
  nextBtn.classList.remove('hidden');
  finishBtn.classList.add('hidden');
}

start.addEventListener('click', ()=>{
  const key = sel.value;
  current = pick10(banks[key]);
  idx = 0; score = 0; selected = -1;
  area.classList.remove('hidden');
  result.classList.add('hidden');
  renderQ();
  bumpStreak();
});

nextBtn.addEventListener('click', ()=>{
  if(selected === -1) return;
  if(selected === current[idx].a) score++;
  idx++;
  if(idx >= current.length){
    area.classList.add('hidden');
    scoreEl.textContent = score;
    scoreTotalEl.textContent = current.length;
    result.classList.remove('hidden');
    return;
  }
  if(idx === current.length-1){
    nextBtn.classList.add('hidden');
    finishBtn.classList.remove('hidden');
  }
  renderQ();
});

finishBtn.addEventListener('click', ()=>{
  if(selected === -1) return;
  if(selected === current[idx].a) score++;
  area.classList.add('hidden');
  scoreEl.textContent = score;
  scoreTotalEl.textContent = current.length;
  result.classList.remove('hidden');
});

if('serviceWorker' in navigator){ window.addEventListener('load', ()=> navigator.serviceWorker.register('./service-worker.js')); }
