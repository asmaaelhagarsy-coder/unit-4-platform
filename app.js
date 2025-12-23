/** Save & Shine – Mini Platform (Unit 4)
 * Author: Asmaa Mahmoud El-Hagarsi + M365 Copilot
 * All-in-one mini platform: 4 lessons + Unit exam
 * Offline-friendly: uses Web Speech API if available; basic sounds via WebAudio.
 */

// ---------- Helpers: Text-to-speech (British), sounds, confetti ----------
let voices = [];
function loadVoices(){
  voices = speechSynthesis.getVoices();
}
window.speechSynthesis?.addEventListener('voiceschanged', loadVoices);
loadVoices();

function speak(text, rate=0.85){
  if(!('speechSynthesis' in window)){alert('Speech not supported on this device.');return}
  const utter = new SpeechSynthesisUtterance(text);
  // Prefer British female
  const preferred = voices.find(v=>/en-GB/i.test(v.lang) && /Google UK English Female|Hazel|Liberty/i.test(v.name))
                  || voices.find(v=>/en-GB/i.test(v.lang))
                  || voices[0];
  if(preferred) utter.voice = preferred; 
  utter.rate = rate; utter.pitch = 1.0;
  speechSynthesis.cancel();
  speechSynthesis.speak(utter);
}

// Cheer sound via WebAudio
const audioCtx = new (window.AudioContext||window.webkitAudioContext)();
function beep(type='ok'){
  const o = audioCtx.createOscillator();
  const g = audioCtx.createGain();
  o.connect(g); g.connect(audioCtx.destination);
  if(type==='ok'){o.frequency.value=880; g.gain.value=0.05}
  else{o.frequency.value=220; g.gain.value=0.05}
  o.type='square'; o.start(); setTimeout(()=>o.stop(), 200);
}

// Confetti
const canvas = document.getElementById('confetti');
const ctx = canvas.getContext('2d');
function resize(){canvas.width=innerWidth; canvas.height=innerHeight}
window.addEventListener('resize',resize); resize();
function confetti(){
  const pieces = Array.from({length:80}).map(()=>({
    x: Math.random()*canvas.width,
    y: -10,
    r: Math.random()*6+2,
    c: ['#2ecc71','#3498db','#ff8a65','#f1c40f','#8e44ad'][Math.floor(Math.random()*5)],
    vy: Math.random()*3+2,
    vx: (Math.random()-0.5)*2
  }));
  let frames=0;
  function draw(){
    ctx.clearRect(0,0,canvas.width,canvas.height);
    pieces.forEach(p=>{p.y+=p.vy; p.x+=p.vx; ctx.fillStyle=p.c; ctx.beginPath(); ctx.arc(p.x,p.y,p.r,0,Math.PI*2); ctx.fill();});
    frames++; if(frames<120) requestAnimationFrame(draw);
  }
  draw();
}

// ---------- Data: Vocabulary, readings, grammar, exams ----------
const data = {
  lessons: {
    1: {
      title: 'Lesson 1 — Go Green',
      vocabulary: [
        {en:'concerns', ar:'مخاوف', ex:'There are concerns about pollution.'},
        {en:'slogan', ar:'شعار', ex:'The campaign uses a simple slogan.'},
        {en:'depletion', ar:'استنزاف', ex:'Depletion of resources is a serious issue.'},
        {en:'landfills', ar:'مكبات النفايات', ex:'Recycling reduces waste in landfills.'},
        {en:'renewable energy', ar:'طاقة متجددة', ex:'Solar power is renewable energy.'},
        {en:'eco-friendly', ar:'صديق للبيئة', ex:'We prefer eco-friendly products.'},
        {en:'recycle', ar:'يُعيد التدوير', ex:'We recycle paper and plastic.'},
        {en:'reuse', ar:'يُعيد الاستخدام', ex:'Reuse bottles to cut waste.'},
        {en:'global warming', ar:'الاحتباس الحراري', ex:'Global warming is a global concern.'},
        {en:'initiative', ar:'مبادرة', ex:'Students started a green initiative.'},
        {en:'resources', ar:'موارد', ex:'Natural resources must be protected.'},
        {en:'pollution', ar:'تلوث', ex:'Factories should reduce pollution.'},
        {en:'reduce', ar:'يقلل', ex:'We reduce waste by recycling.'},
        {en:'manufacturing', ar:'التصنيع', ex:'Green manufacturing saves energy.'},
        {en:'sustainable', ar:'مستدام', ex:'Sustainable practices help the future.'}
      ],
      reading: [
        'Factories caused air and water pollution in the past.',
        'Going green means making eco-friendly changes.',
        'Green manufacturing uses renewable energy and clean technology.',
        'Companies try to reduce waste and reuse materials.',
        'Global warming is a serious concern for the world.',
        'Working together can build a sustainable future.'
      ],
      readingMCQ: [
        {q:'"Going green" mostly means…', opts:['painting factories green','making eco-friendly changes','using more vehicles','avoiding technology'], a:1},
        {q:'Renewable energy helps prevent…', opts:['depletion of resources','global warming','landfills','campaigns'], a:0},
        {q:'One aim of green manufacturing is to…', opts:['increase waste','reuse materials','use more natural resources','focus on profits only'], a:1},
        {q:'Global warming is a…', opts:['local rule','minor issue','major concern','new slogan'], a:2}
      ]
    },
    2: {
      title: 'Lesson 2 — One Bag at a Time',
      vocabulary: [
        {en:'reusable', ar:'قابل لإعادة الاستخدام', ex:'Use reusable bags many times.'},
        {en:'campaign', ar:'حملة', ex:'The town started a clean-up campaign.'},
        {en:'waste', ar:'نفايات / يهدر', ex:'We must reduce plastic waste.'},
        {en:'reduce', ar:'يقلل', ex:'Reduce plastic to keep areas clean.'},
        {en:'swap', ar:'يستبدل', ex:'People swap old bags for new ones.'},
        {en:'community', ar:'مجتمع', ex:'The community supports the project.'},
        {en:'alternative', ar:'بديل', ex:'Cloth bags are a good alternative.'},
        {en:'volunteer', ar:'متطوع', ex:'Volunteers helped the campaign.'},
        {en:'Bag Swap Day', ar:'يوم تبديل الحقائب', ex:'Families enjoyed Bag Swap Day.'},
        {en:'local shops', ar:'المحال المحلية', ex:'Local shops reduced plastic use.'}
      ],
      reading: [
        'Ahmed planned a campaign to reduce plastic use.',
        'He explained why reusable bags are better.',
        'The campaign organized a fun Bag Swap Day.',
        'Many local shops joined the campaign.',
        'Families enjoyed the event and supported change.',
        'The area became cleaner after the campaign.'
      ],
      readingMCQ: [
        {q:'Reusable bags are better because they…', opts:['are fashionable','can be used many times','are made of plastic','are expensive'], a:1},
        {q:'The event that made the campaign fun was…', opts:['a discount day','a Bag Swap Day','a picnic','a quiz'], a:1},
        {q:'Which happened after the campaign?', opts:['shops closed','more shops stopped using plastic','bags got expensive','people stopped shopping'], a:1},
        {q:'The campaign’s main goal was to…', opts:['promote new shops','reduce plastic use','ask for money','describe recycling paper'], a:1}
      ]
    },
    3: {
      title: 'Lesson 3 — Small Actions Can Make a Difference',
      vocabulary: [
        {en:'turn off', ar:'يُطفئ', ex:'Turn off lights when leaving.'},
        {en:'unplug', ar:'يفصل الكهرباء', ex:'Unplug devices to save energy.'},
        {en:'plant trees', ar:'يزرع الأشجار', ex:'Plant trees to clean the air.'},
        {en:'walk or cycle', ar:'يمشي أو يركب دراجة', ex:'Walk or cycle to reduce pollution.'},
        {en:'save energy', ar:'يوفر الطاقة', ex:'Saving energy protects the planet.'},
        {en:'avoid', ar:'يتجنب', ex:'Avoid using harmful chemicals.'},
        {en:'prefer', ar:'يُفضّل', ex:'I prefer reusable products.'},
        {en:'begin', ar:'يبدأ', ex:'We begin a green project soon.'}
      ],
      reading: [
        'Simple habits protect the environment every day.',
        'Turn off lights and unplug devices to save energy.',
        'Planting trees gives us fresh air.',
        'Walking or cycling reduces pollution.',
        'Working together creates a cleaner future.',
        'Small actions make a big difference.'
      ],
      readingMCQ: [
        {q:'Saving energy can be done by…', opts:['using more lights','unplugging devices','driving more','burning plastic'], a:1},
        {q:'Planting trees makes the air…', opts:['polluted','fresh','dirty','limited'], a:1},
        {q:'Walking or cycling helps to…', opts:['increase waste','reduce pollution','use more chemicals','stop recycling'], a:1},
        {q:'Small actions can have a big…', opts:['impact','problem','landfill','concern'], a:0}
      ],
      grammarRule: `Verbs + infinitive or -ing (Gerunds)\n• Some verbs are followed by -ing: enjoy, avoid, suggest.\n• Some verbs are followed by to + infinitive: decide, plan, agree, hope, want.\n• Some verbs can take both with a change in meaning: remember, stop, try, begin/start.`,
      grammarMCQ: [
        {q:'She enjoys ____ music.', opts:['to listen','listening','listen','to listening'], a:1},
        {q:'He promised ____ me with the project.', opts:['helping','to help','help','to helping'], a:1},
        {q:'They avoid ____ junk food.', opts:['eating','eat','to eating','to eat'], a:0},
        {q:'We decided ____ a new car.', opts:['buying','to buying','to buy','buy'], a:2},
        {q:"Please remember ____ off the lights before leaving.", opts:['turning','to turn','turn','to turning'], a:1},
        {q:'She suggested ____ a break.', opts:['to take','take','taking','to taking'], a:2},
        {q:'He stopped ____ a coffee break.', opts:['taking','to take','take','to taking'], a:0},
        {q:'I\'ll never forget ____ the Eiffel Tower for the first time.', opts:['to see','seeing','see','to seeing'], a:1},
        {q:'Nada agreed ____ to the party.', opts:['come','to come','coming','to coming'], a:1},
        {q:'We plan ____ a campaign to protect nature.', opts:['start','to start','starting','to starting'], a:1},
      ]
    },
    4: {
      title: 'Lesson 4 — Helping our community',
      vocabulary: [
        {en:'survey', ar:'يَمسَح / يستقصي', ex:'The team will survey water sources.'},
        {en:'leak', ar:'تسرّب', ex:'A small leak wastes many liters of water.'},
        {en:'record', ar:'يُسجل', ex:'They record observations in notebooks.'},
        {en:'assembly', ar:'جمعية/الطابور المدرسي', ex:'Students shared ideas at the school assembly.'},
        {en:'impact', ar:'تأثير كبير', ex:'Small actions can have a big impact.'},
        {en:'tap', ar:'صنبور', ex:'Turn off taps after washing.'},
        {en:'fountain', ar:'نافورة (مياه)', ex:'Check the water fountain for leaks.'},
        {en:'save water', ar:'توفير الماء', ex:'Using bottles helps save water.'}
      ],
      reading: [
        'Students formed a Water Team to save water at school.',
        'They surveyed taps and fountains for drips and leaks.',
        'The team recorded their observations in notebooks.',
        'They presented ideas at the school assembly.',
        'Other classes began to save water too.',
        'Small changes made a big impact on the community.'
      ],
      readingMCQ: [
        {q:'The Water Team\'s first task was to…', opts:['plant trees','check water sources for leaks','clean the lab','collect rainwater'], a:1},
        {q:'Why is fixing small leaks important?', opts:['it saves paper cups','it prevents wasting water','it cleans chairs','it looks better'], a:1},
        {q:'What did they present at the assembly?', opts:['games','photos and ideas','a play','bottles of water'], a:1},
        {q:'The story shows that small actions can have a big…', opts:['impact','problem','landfill','slogan'], a:0}
      ]
    }
  },
  // Unit exam bank (MCQ only; instructions English-only)
  exam: [
    // Vocabulary
    {q:'We must ____ the environment from pollution.', opts:['protect','pollute','ignore','waste'], a:0},
    {q:'Factories should reduce air ____.', opts:['pollution','energy','recycle','climate'], a:0},
    {q:'Solar power is a form of ____ energy.', opts:['renewable','waste','harmful','limited'], a:0},
    {q:'We need to ____ water to save resources.', opts:['conserve','throw','spend','waste'], a:0},
    {q:'People should ____ plastic to protect nature.', opts:['recycle','burn','ignore','pollute'], a:0},
    {q:'Global warming affects the world\'s ____.', opts:['climate','waste','energy','pollution'], a:0},
    {q:'Using ____ products helps the planet.', opts:['eco-friendly','harmful','dirty','toxic'], a:0},
    {q:'We must reduce ____ to keep our cities clean.', opts:['waste','energy','climate','resources'], a:0},
    {q:'Wind and solar are ____ sources of energy.', opts:['renewable','limited','harmful','toxic'], a:0},
    {q:'Planting trees helps to fight air ____.', opts:['pollution','recycle','energy','climate'], a:0},
    // Grammar (gerund vs infinitive)
    {q:'She decided ____ a new eco-friendly car.', opts:['buy','to buy','buying','to buying'], a:1},
    {q:'He enjoys ____ about saving energy.', opts:['talk','to talk','talking','to talking'], a:2},
    {q:'We plan ____ a campaign to protect nature.', opts:['start','to start','starting','to starting'], a:1},
    {q:'They suggested ____ plastic waste.', opts:['reduce','to reduce','reducing','to reducing'], a:2},
    {q:'I want ____ more about recycling.', opts:['learn','to learn','learning','to learning'], a:1},
    {q:'She avoided ____ harmful chemicals.', opts:['use','to use','using','to using'], a:2},
    {q:'We hope ____ a green project soon.', opts:['begin','to begin','beginning','to beginning'], a:1},
    {q:'He finished ____ the article on global warming.', opts:['read','to read','reading','to reading'], a:2},
    {q:'They agreed ____ the meeting about sustainability.', opts:['attend','to attend','attending','to attending'], a:1},
    {q:'She likes ____ trees in her garden.', opts:['plant','to plant','planting','to planting'], a:2},
  ]
};

// ---------- UI builders ----------
const sections = {};
function $(sel, root=document){return root.querySelector(sel)}
function $all(sel, root=document){return Array.from(root.querySelectorAll(sel))}

function buildTopTabs(){
  const wrap = $('.tabs');
  ['Lesson 1','Lesson 2','Lesson 3','Lesson 4','Unit Exam'].forEach((t,i)=>{
    const el = document.createElement('div'); el.className='tab'; el.textContent=t; 
    el.addEventListener('click',()=>activateSection(i)); wrap.appendChild(el);
  });
}

function activateSection(i){
  $all('.tab').forEach((t,idx)=>t.classList.toggle('active', idx===i));
  $all('.section').forEach((s,idx)=>s.classList.toggle('active', idx===i));
}

function buildLesson(n){
  const sec = document.createElement('div'); sec.className='section';
  const subtabs = document.createElement('div'); subtabs.className='subtabs'; sec.appendChild(subtabs);
  const content = document.createElement('div'); content.className='lesson-content'; sec.appendChild(content);
  const subtitles = ['Vocabulary','Games','Reading'];
  if(n===3) subtitles.push('Grammar');
  subtitles.forEach((st,idx)=>{
    const s = document.createElement('div'); s.className='subtab'; s.textContent=st;
    s.addEventListener('click',()=>activateSub(content, subtabs, n, idx)); subtabs.appendChild(s);
  });
  document.querySelector('.container').appendChild(sec); sections[n]=sec;
  // default
  activateSub(content, subtabs, n, 0);
}

function activateSub(content, subtabs, n, idx){
  $all('.subtab', subtabs).forEach((t, i)=>t.classList.toggle('active', i===idx));
  content.innerHTML='';
  const L = data.lessons[n];
  if(idx===0) renderVocab(content, L.vocabulary);
  else if(idx===1) renderGames(content, L.vocabulary, n);
  else if(idx===2) renderReading(content, L.reading, L.readingMCQ);
  else renderGrammar(content, data.lessons[3].grammarRule, data.lessons[3].grammarMCQ);
}

// Vocabulary view
function renderVocab(root, vocab){
  const tools = document.createElement('div');
  tools.innerHTML = `<div class="qcard"><b>Dictation Mode:</b> Type the English word for the given Arabic meaning. Slow British voice is used for pronunciation.<br><button class="btn small" id="startDict">Start</button> <button class="btn small warning" id="stopDict">Stop</button></div>`;
  root.appendChild(tools);
  $('#startDict', tools).onclick=()=>dictation(vocab);
  $('#stopDict', tools).onclick=()=>stopDictation();

  const grid = document.createElement('div'); grid.className='cards'; root.appendChild(grid);
  vocab.forEach(item=>{
    const c = document.createElement('div'); c.className='card';
    c.innerHTML = `<h3>${item.en}</h3><div class="ar">${item.ar}</div><div class="ex">Example: ${item.ex}</div>`;
    const btns = document.createElement('div'); btns.className='btns';
    const b1 = document.createElement('button'); b1.className='btn'; b1.textContent='🔊 Word'; b1.onclick=()=>speak(item.en);
    const b2 = document.createElement('button'); b2.className='btn secondary'; b2.textContent='🔊 Example'; b2.onclick=()=>speak(item.ex);
    btns.appendChild(b1); btns.appendChild(b2); c.appendChild(btns); grid.appendChild(c);
  });
}

let dictRunning=false; let dictIndex=0; let dictVocab=[];
function dictation(vocab){
  dictRunning=true; dictIndex=0; dictVocab=[...vocab].sort(()=>Math.random()-0.5);
  nextPrompt();
}
function stopDictation(){dictRunning=false; $('.dictArea')?.remove();}
function nextPrompt(){
  if(!dictRunning) return;
  const area = document.createElement('div'); area.className='dictArea qcard';
  area.innerHTML=`<div><b>Type the English word for:</b> <span style="color:#c62828">${dictVocab[dictIndex].ar}</span></div>
    <input id="dictInput" class="input" style="width:100%;padding:10px;margin-top:8px;border-radius:10px;border:1px solid #ccc" placeholder="Type here..." />
    <button class="btn" id="checkDict">Check</button> <button class="btn secondary" id="repeat">Repeat word</button>`;
  $('.lesson-content').prepend(area);
  speak(dictVocab[dictIndex].en);
  $('#checkDict', area).onclick=()=>{
    const val = $('#dictInput', area).value.trim().toLowerCase();
    const target = dictVocab[dictIndex].en.toLowerCase();
    if(val===target){
      beep('ok'); confetti();
      area.innerHTML = `<b>Correct!</b> ${dictVocab[dictIndex].en} ✓`;
      setTimeout(()=>{area.remove(); dictIndex++; if(dictIndex<dictVocab.length) nextPrompt(); else {dictRunning=false; alert('Well done! Dictation finished.');}}, 600);
    }else{
      beep('bad');
      area.style.background='#ffebee';
      $('#dictInput', area).style.borderColor='#e53935';
    }
  };
  $('#repeat', area).onclick=()=>speak(dictVocab[dictIndex].en);
}

// Games view
function renderGames(root, vocab, lessonNo){
  const wrap = document.createElement('div'); root.appendChild(wrap);
  // Matching
  wrap.innerHTML = `<h3>Card Matching (Drag & Drop)</h3>`;
  const board = document.createElement('div'); board.className='board'; wrap.appendChild(board);
  const left = document.createElement('div'); left.className='pair'; board.appendChild(left);
  const right = document.createElement('div'); right.className='pair'; board.appendChild(right);

  const shuffled = [...vocab].sort(()=>Math.random()-0.5).slice(0,6);
  shuffled.forEach((item,i)=>{
    const dz = document.createElement('div'); dz.className='dropzone'; dz.dataset.target=item.en.toLowerCase(); dz.textContent=item.ar; left.appendChild(dz);
  });
  const words = shuffled.map(i=>i.en);
  words.sort(()=>Math.random()-0.5).forEach(w=>{
    const dr = document.createElement('div'); dr.className='draggable'; dr.draggable=true; dr.textContent=w; dr.dataset.word=w.toLowerCase(); right.appendChild(dr);
    dr.addEventListener('dragstart',e=>{e.dataTransfer.setData('text/plain', dr.dataset.word)});
  });
  $all('.dropzone', left).forEach(dz=>{
    dz.addEventListener('dragover',e=>e.preventDefault());
    dz.addEventListener('drop',e=>{
      const w = e.dataTransfer.getData('text/plain');
      if(w===dz.dataset.target){ dz.style.background='#e8f5e9'; dz.style.borderColor='var(--green)'; dz.textContent=dz.textContent+`  ✓`; beep('ok'); confetti(); }
      else{ dz.style.background='#ffebee'; dz.style.borderColor='#e53935'; beep('bad'); }
    });
  });

  // Kahoot-style quiz
  const quiz = document.createElement('div'); quiz.className='quiz'; wrap.appendChild(quiz);
  const q = document.createElement('div'); q.className='qcard'; quiz.appendChild(q);
  q.innerHTML = `<h3>Kahoot-style Quiz</h3><div id="kQuestion"></div><div id="kOptions"></div><div class="progress"><div class="bar" id="kBar"></div></div>`;
  const quizBank = [...vocab].sort(()=>Math.random()-0.5).slice(0,8);
  let qi=0, score=0;
  function ask(){
    const item = quizBank[qi];
    $('#kQuestion').innerHTML = `Meaning: <b style="color:#c62828">${item.ar}</b>`;
    const pool = [...vocab.map(v=>v.en)];
    const opts = new Set([item.en]);
    while(opts.size<4){opts.add(pool[Math.floor(Math.random()*pool.length)])}
    const arr=[...opts].sort(()=>Math.random()-0.5);
    const box = $('#kOptions'); box.innerHTML='';
    arr.forEach((o,idx)=>{
      const el = document.createElement('div'); el.className='option'; el.textContent=o;
      el.onclick=()=>{
        if(o===item.en){el.classList.add('correct'); score++; beep('ok'); confetti();}
        else{el.classList.add('wrong'); beep('bad');}
        setTimeout(()=>{qi++; $('#kBar').style.width=((qi)/quizBank.length*100)+'%'; if(qi<quizBank.length) ask(); else alert(`Quiz finished! Score: ${score}/${quizBank.length}`)}, 500);
      };
      box.appendChild(el);
    });
  }
  ask();
}

// Reading view
function renderReading(root, sentences, mcq){
  const list = document.createElement('div'); root.appendChild(list);
  sentences.forEach((s,idx)=>{
    const el = document.createElement('div'); el.className='sentence';
    el.innerHTML = `<div>${idx+1}. ${s}</div><div class="btns"><button class="btn small">🔊 Play</button></div>`;
    $('button', el).onclick=()=>speak(s,0.8);
    list.appendChild(el);
  });
  const quiz = document.createElement('div'); quiz.className='mcq'; root.appendChild(quiz);
  quiz.innerHTML = `<h3>Vocabulary Check (MCQ)</h3>`;
  mcq.forEach((it,i)=>{
    const card = document.createElement('div'); card.className='qcard';
    const opts = it.opts.map((o,idx)=>`<div class="option" data-i="${idx}">${o}</div>`).join('');
    card.innerHTML = `<div>${i+1}. ${it.q}</div>${opts}`;
    quiz.appendChild(card);
    $all('.option', card).forEach(op=>op.onclick=()=>{
      const idx = Number(op.dataset.i);
      if(idx===it.a){op.classList.add('correct'); beep('ok'); confetti();}
      else{op.classList.add('wrong'); beep('bad');}
    });
  });
}

// Grammar view
function renderGrammar(root, rule, bank){
  const box = document.createElement('div'); box.className='rule'; box.textContent=rule; root.appendChild(box);
  const quiz = document.createElement('div'); quiz.className='mcq'; root.appendChild(quiz);
  quiz.innerHTML = `<h3>Grammar Practice: Choose the correct form</h3>`;
  bank.forEach((it,i)=>{
    const card = document.createElement('div'); card.className='qcard';
    const opts = it.opts.map((o,idx)=>`<div class="option" data-i="${idx}">${o}</div>`).join('');
    card.innerHTML = `<div>${i+1}. ${it.q}</div>${opts}`;
    quiz.appendChild(card);
    $all('.option', card).forEach(op=>op.onclick=()=>{
      const idx = Number(op.dataset.i);
      if(idx===it.a){op.classList.add('correct'); beep('ok'); confetti();}
      else{op.classList.add('wrong'); beep('bad');}
    });
  });
}

// Unit exam
function renderExam(){
  const sec = document.createElement('div'); sec.className='section'; document.querySelector('.container').appendChild(sec);
  const head = document.createElement('div'); head.className='exam-header'; head.innerHTML = `<b>Unit 4 — Save & Shine</b><br>Interactive MCQ Exam (English-only instructions)`; sec.appendChild(head);
  const box = document.createElement('div'); box.className='mcq'; sec.appendChild(box);
  let i=0, score=0;
  function ask(){
    box.innerHTML='';
    const it = data.exam[i];
    const card = document.createElement('div'); card.className='qcard';
    card.innerHTML = `<div>${i+1}/${data.exam.length}. ${it.q}</div>`;
    const opts = it.opts.map((o,idx)=>{
      const el = document.createElement('div'); el.className='option'; el.textContent=o; el.dataset.i=idx; 
      el.onclick=()=>{
        if(idx===it.a){el.classList.add('correct'); score++; beep('ok'); confetti();}
        else{el.classList.add('wrong'); beep('bad');}
        setTimeout(()=>{i++; $('#bar').style.width=((i)/data.exam.length*100)+'%'; if(i<data.exam.length) ask(); else box.innerHTML = `<div class='qcard'><h3>Finished!</h3><p>Your score: ${score}/${data.exam.length}</p></div>`;}, 500);
      };
      return el;
    });
    opts.forEach(o=>card.appendChild(o)); box.appendChild(card);
  }
  const prog = document.createElement('div'); prog.className='progress'; prog.innerHTML='<div id="bar" class="bar"></div>'; sec.appendChild(prog);
  ask();
}

// ---------- Bootstrapping ----------
function init(){
  buildTopTabs();
  [1,2,3,4].forEach(buildLesson);
  renderExam();
  activateSection(0);
}

window.addEventListener('DOMContentLoaded', init);
