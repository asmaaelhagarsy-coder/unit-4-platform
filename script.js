
// ===== Helpers: Voice, Sound, Confetti =====
let VOICE = null;
function pickVoice(){
  const vs = speechSynthesis.getVoices();
  VOICE = vs.find(v=>/en-GB|UK|British/i.test(v.lang+" "+v.name)) || vs.find(v=>/en/i.test(v.lang)) || vs[0];
}
speechSynthesis.onvoiceschanged = pickVoice; pickVoice();
function speak(t,{rate=.83}={}){ try{ const u=new SpeechSynthesisUtterance(t); u.lang='en-GB'; if(VOICE) u.voice=VOICE; u.rate=rate; speechSynthesis.speak(u);}catch(e){} }
function cheer(){
  const ac=new (window.AudioContext||window.webkitAudioContext)();
  const o=ac.createOscillator(),g=ac.createGain(); o.type='triangle'; o.frequency.setValueAtTime(660,ac.currentTime); o.frequency.linearRampToValueAtTime(880,ac.currentTime+.25); g.gain.setValueAtTime(.001,ac.currentTime); g.gain.exponentialRampToValueAtTime(.2,ac.currentTime+.02); g.gain.exponentialRampToValueAtTime(.0001,ac.currentTime+.35); o.connect(g); g.connect(ac.destination); o.start(); o.stop(ac.currentTime+.4); confetti(); }
function buzz(){ const ac=new (window.AudioContext||window.webkitAudioContext)(); const o=ac.createOscillator(),g=ac.createGain(); o.type='sawtooth'; o.frequency.value=200; g.gain.value=.0001; g.gain.exponentialRampToValueAtTime(.12,ac.currentTime+.03); g.gain.exponentialRampToValueAtTime(.0001,ac.currentTime+.3); o.connect(g); g.connect(ac.destination); o.start(); o.stop(ac.currentTime+.32); }
function confetti(){ const c=document.getElementById('confetti'); for(let i=0;i<8;i++){ const el=document.createElement('div'); const size=Math.random()*8+6; el.style.cssText=`position:fixed;left:${Math.random()*100}% ; top:-10px;width:${size}px;height:${size}px;border-radius:50%;background:${['#22c55e','#0ea5e9','#f59e0b','#e11d48'][i%4]}`; c.appendChild(el); el.animate([{transform:'translateY(0)'},{transform:'translateY(120vh)'}],{duration:1000+Math.random()*1000,easing:'ease-in'}).onfinish=()=>el.remove(); }}

// ===== Data (12+ key words) =====
const DATA = {
  vocab:[
    {en:'eco-friendly', ar:'صديق للبيئة', ex:'Eco-friendly products reduce pollution.'},
    {en:'sustainable', ar:'مستدام', ex:'Sustainable choices protect resources.'},
    {en:'renewable energy', ar:'طاقة متجددة', ex:'Solar power is renewable energy.'},
    {en:'depletion', ar:'استنزاف', ex:'Recycling helps prevent resource depletion.'},
    {en:'landfills', ar:'مكبات النفايات', ex:'Recycling reduces waste in landfills.'},
    {en:'recycling', ar:'إعادة التدوير', ex:'Recycling turns waste into new products.'},
    {en:'reuse', ar:'إعادة الاستخدام', ex:'We reuse bottles to save resources.'},
    {en:'reduce', ar:'يقلّل', ex:'Factories should reduce air pollution.'},
    {en:'pollution', ar:'تلوث', ex:'Air pollution harms health.'},
    {en:'resources', ar:'موارد', ex:'We must protect natural resources.'},
    {en:'global warming', ar:'الاحتباس الحراري', ex:'Planting trees helps fight global warming.'},
    {en:'initiative', ar:'مبادرة', ex:'The school started a green initiative.'},
    {en:'slogan', ar:'شعار', ex:'“Go Green” is a popular slogan.'}
  ],
  reading:[
    'Factories can go green by using renewable energy.',
    'Recycling and reusing materials reduce waste.',
    'Green manufacturing protects natural resources.',
    'This slows the depletion of materials and landfills.',
    'Companies launch initiatives to fight global warming.',
    'Small changes build a sustainable future.'
  ],
  mcqReading:[
    {q:'Which source is renewable?', options:['Solar power','Diesel','Coal','Oil'], a:0},
    {q:'What action reduces waste?', options:['Recycling','Burning','Buying more','Ignoring'], a:0},
    {q:'Green manufacturing aims to ______ pollution.', options:['increase','reduce','celebrate','copy'], a:1}
  ],
  kahoot:[
    {ar:'صديق للبيئة', opts:['eco-friendly','resources','pollution','reuse'], a:0},
    {ar:'استنزاف', opts:['depletion','landfills','renewable energy','slogan'], a:0},
    {ar:'مستدام', opts:['sustainable','initiative','recycling','global warming'], a:0},
    {ar:'طاقة متجددة', opts:['pollution','resources','renewable energy','reduce'], a:2}
  ],
  colorQuiz:[
    {ar:'إعادة التدوير', opts:['initiative','recycling','reuse','landfills'], a:1},
    {ar:'مبادرة', opts:['slogan','initiative','eco-friendly','resources'], a:1},
    {ar:'شعار', opts:['reduce','slogan','depletion','pollution'], a:1}
  ],
  exam:[
    {q:'Choose the correct word: Factories should ______ air pollution.', options:['reduce','reuse','record','paint'], a:0},
    {q:'“Go Green” is a popular ______.', options:['mission','slogan','leak','assembly'], a:1},
    {q:'Solar power is a form of ______ energy.', options:['renewable','limited','harmful','toxic'], a:0},
    {q:'Recycling helps prevent the ______ of natural resources.', options:['impact','initiative','depletion','message'], a:2}
  ]
};

// ===== Tabs =====
const tabbar = document.querySelector('.tabs');
tabbar.addEventListener('click', e=>{ if(!e.target.classList.contains('tab')) return; document.querySelectorAll('.tab').forEach(b=>b.classList.remove('active')); e.target.classList.add('active'); document.querySelectorAll('.section').forEach(s=>s.classList.remove('active')); document.querySelector(e.target.dataset.target).classList.add('active');});

// ===== Build Vocabulary Cards =====
const vgrid = document.getElementById('vocabGrid');
DATA.vocab.forEach(v=>{
  const card=document.createElement('div'); card.className='card';
  card.innerHTML = `<h3>${v.en}</h3><span class="badge">Arabic: ${v.ar}</span><p class="example">Example: ${v.ex}</p>`;
  const btn=document.createElement('button'); btn.className='play'; btn.textContent='▶'; btn.onclick=()=>{ speak(v.en,{rate:.82}); setTimeout(()=>speak(v.ex,{rate:.84}),800); };
  card.appendChild(btn); vgrid.appendChild(card);
});

// ===== Dictation (Arabic → English typing) =====
(function(){
  const host=document.getElementById('dictation');
  const list=[...DATA.vocab].sort(()=>Math.random()-0.5);
  let i=0, score=0;
  function render(){
    if(i>=list.length){ host.innerHTML = `<p class="score">Your score: ${score}/${list.length}</p>`; cheer(); return; }
    const it=list[i];
    host.innerHTML = `<p><b>Arabic:</b> ${it.ar}</p>
      <input id="ans" type="text" placeholder="Type the English word" autocomplete="off"/>
      <div style="display:flex;gap:8px;margin-top:8px">
        <button class="btn" id="check">Check</button>
        <button class="btn secondary" id="hear">Hear again</button>
      </div>`;
    speak(it.en,{rate:.8});
    host.querySelector('#hear').onclick=()=>speak(it.en,{rate:.8});
    host.querySelector('#check').onclick=()=>{
      const val=host.querySelector('#ans').value.trim().toLowerCase();
      if(val===it.en.toLowerCase()){ score++; cheer(); i++; render(); }
      else{ buzz(); host.querySelector('#ans').classList.add('wrong'); setTimeout(()=>host.querySelector('#ans').classList.remove('wrong'),400); }
    };
  }
  render();
})();

// ===== Reading (6 short sentences + MCQ) =====
const rgrid=document.getElementById('readingGrid');
DATA.reading.forEach((s,idx)=>{
  const c=document.createElement('div'); c.className='card'; c.innerHTML=`<h3>Sentence ${idx+1}</h3><p>${s}</p>`; const b=document.createElement('button'); b.className='play'; b.textContent='▶'; b.onclick=()=>speak(s,{rate:.83}); c.appendChild(b); rgrid.appendChild(c);
});
(function(){
  const host=document.getElementById('readingQuiz'); let i=0,score=0; function draw(){ if(i>=DATA.mcqReading.length){ host.innerHTML=`<p class='score'>Reading score: ${score}/${DATA.mcqReading.length}</p>`; cheer(); return;} const it=DATA.mcqReading[i]; host.innerHTML=`<h3>Reading MCQ</h3><p>${it.q}</p>`; it.options.forEach((op,idx)=>{ const d=document.createElement('div'); d.className='option'; d.textContent=op; d.onclick=()=>{ if(idx===it.a){ d.classList.add('correct'); score++; cheer(); } else { d.classList.add('wrong'); buzz(); } setTimeout(()=>{i++; draw();},500); }; host.appendChild(d); }); } draw(); })();

// ===== Drag & Drop Match =====
(function(){
  const targets=document.getElementById('dndTargets');
  const sources=document.getElementById('dndSources');
  const pairs=DATA.vocab.slice(0,10); // use first 10 for compact board
  pairs.forEach(p=>{ const t=document.createElement('div'); t.className='target'; t.dataset.target=p.en.toLowerCase(); t.innerHTML=`<b>${p.ar}</b>`; targets.appendChild(t); });
  const shuffled=[...pairs].sort(()=>Math.random()-0.5);
  shuffled.forEach(p=>{ const s=document.createElement('div'); s.className='draggable'; s.draggable=true; s.textContent=p.en; s.dataset.en=p.en.toLowerCase(); s.addEventListener('dragstart',e=>e.dataTransfer.setData('text/plain',s.dataset.en)); sources.appendChild(s); });
  targets.addEventListener('dragover',e=>e.preventDefault());
  targets.addEventListener('drop',e=>{ const en=e.dataTransfer.getData('text/plain'); const target=e.target.closest('.target'); if(!target) return; if(target.dataset.target===en){ target.classList.add('correct'); target.style.borderColor='#22c55e'; target.style.background='#0b2a18'; cheer(); const src=[...sources.children].find(x=>x.dataset.en===en); if(src) src.style.display='none'; } else { target.classList.add('wrong'); buzz(); setTimeout(()=>target.classList.remove('wrong'),300); } });
})();

// ===== Kahoot-style MCQ (Arabic prompt → English word) =====
(function(){
  const host=document.getElementById('kahoot'); let i=0,score=0; function draw(){ if(i>=DATA.kahoot.length){ host.innerHTML=`<p class='score'>Quiz score: ${score}/${DATA.kahoot.length}</p>`; cheer(); return;} const it=DATA.kahoot[i]; host.innerHTML=`<h3>Kahoot-style</h3><p><b>Meaning (Arabic):</b> ${it.ar}</p>`; it.opts.forEach((op,idx)=>{ const d=document.createElement('div'); d.className='option'; d.textContent=op; d.onclick=()=>{ if(idx===it.a){ d.classList.add('correct'); score++; cheer(); } else { d.classList.add('wrong'); buzz(); } setTimeout(()=>{i++; draw();},500); }; host.appendChild(d); }); } draw(); })();

// ===== Color Blast (Arabic → English meaning) =====
(function(){
  const host=document.getElementById('colorQuiz'); let i=0,score=0; function draw(){ if(i>=DATA.colorQuiz.length){ host.innerHTML+=`<p class='score' style='margin-top:8px'>Score: ${score}/${DATA.colorQuiz.length}</p>`; cheer(); return; } const it=DATA.colorQuiz[i]; host.innerHTML=`<h3>Color Blast</h3><p><b>الكلمة بالعربي:</b> ${it.ar}</p>`; const colors=['color-1','color-2','color-3','color-4']; it.opts.forEach((op,idx)=>{ const b=document.createElement('button'); b.className='color-btn '+colors[idx%4]; b.textContent=op; b.onclick=()=>{ if(idx===it.a){ b.classList.add('correct'); cheer(); score++; } else { b.classList.add('wrong'); buzz(); } setTimeout(()=>{i++; draw();},480); }; host.appendChild(b); }); } draw(); })();

// ===== Mini Exam (vocab MCQ) =====
(function(){
  const host=document.getElementById('unitExam'); let i=0,score=0; function draw(){ if(i>=DATA.exam.length){ host.innerHTML=`<p class='score'>Final score: ${score}/${DATA.exam.length}</p>`; cheer(); return;} const it=DATA.exam[i]; host.innerHTML=`<h3>Mini Exam — Vocabulary</h3><p>${it.q}</p>`; it.options.forEach((op,idx)=>{ const d=document.createElement('div'); d.className='option'; d.textContent=op; d.onclick=()=>{ if(idx===it.a){ d.classList.add('correct'); score++; cheer(); } else { d.classList.add('wrong'); buzz(); } setTimeout(()=>{i++; draw();},500); }; host.appendChild(d); }); } draw(); })();
