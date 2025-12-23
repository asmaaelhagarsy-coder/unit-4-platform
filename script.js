
// Generic JS for Save & Shine lessons
let VOICE = null;
function pickVoice(){
  const voices = speechSynthesis.getVoices();
  VOICE = voices.find(v=>/en-GB|UK|British/i.test(v.lang+" "+v.name)) || voices[0];
}
if (typeof speechSynthesis !== 'undefined'){
  speechSynthesis.onvoiceschanged = pickVoice; pickVoice();
}
function speak(text,{rate=0.85,pitch=1.0}={}){
  if (typeof speechSynthesis==='undefined') return;
  const u = new SpeechSynthesisUtterance(text);
  u.lang = 'en-GB';
  u.voice = VOICE; u.rate = rate; u.pitch = pitch; speechSynthesis.speak(u);
}
// Cheer sound using WebAudio (no external files)
function cheer(){
  const ac = new (window.AudioContext || window.webkitAudioContext)();
  const o=ac.createOscillator(), g=ac.createGain(); o.type='triangle';
  o.frequency.setValueAtTime(660, ac.currentTime);
  o.frequency.linearRampToValueAtTime(880, ac.currentTime+0.25);
  g.gain.setValueAtTime(0.001, ac.currentTime);
  g.gain.exponentialRampToValueAtTime(0.2, ac.currentTime+0.02);
  g.gain.exponentialRampToValueAtTime(0.0001, ac.currentTime+0.35);
  o.connect(g); g.connect(ac.destination); o.start(); o.stop(ac.currentTime+0.4);
  confetti();
}
function buzz(){
  const ac = new (window.AudioContext || window.webkitAudioContext)();
  const o=ac.createOscillator(), g=ac.createGain(); o.type='sawtooth';
  o.frequency.setValueAtTime(200, ac.currentTime);
  g.gain.setValueAtTime(0.001, ac.currentTime);
  g.gain.exponentialRampToValueAtTime(0.15, ac.currentTime+0.05);
  g.gain.exponentialRampToValueAtTime(0.0001, ac.currentTime+0.3);
  o.connect(g); g.connect(ac.destination); o.start(); o.stop(ac.currentTime+0.32);
}
// Light-weight confetti
function confetti(){
  const c = document.getElementById('confetti');
  const el = document.createElement('div');
  const size = Math.random()*8+6;
  el.style.position='absolute';
  el.style.left = Math.random()*100+'%';
  el.style.top = '-10px';
  el.style.width = el.style.height = size+'px';
  el.style.borderRadius = '50%';
  el.style.background = ['#22c55e','#0ea5e9','#f59e0b','#e11d48'][Math.floor(Math.random()*4)];
  c.appendChild(el);
  const dur = 1000+Math.random()*1000;
  el.animate([{transform:'translateY(0)'},{transform:'translateY(120vh)'}],{duration:dur,easing:'ease-in'}).onfinish=()=>el.remove();
}

function $(q){return document.querySelector(q)}
function $all(q){return Array.from(document.querySelectorAll(q))}

async function bootstrap(){
  const data = await (await fetch('data.json')).json();
  document.querySelector('.brand').textContent = data.title;
  document.querySelector('.welcome').textContent = data.welcome;
  // Build tabs based on data flags
  const tabs = [];
  tabs.push({id:'vocab',label:'Vocabulary'});
  tabs.push({id:'games',label:'Games'});
  tabs.push({id:'reading',label:'Reading'});
  if (data.grammar) tabs.push({id:'grammar',label:'Grammar'});
  tabs.push({id:'exam',label:'Exam'});
  const tabsWrap = document.querySelector('.tabs');
  tabs.forEach((t,i)=>{
    const b=document.createElement('button');b.className='tab'+(i===0?' active':'');b.textContent=t.label;b.dataset.target=t.id;tabsWrap.appendChild(b);
  });
  const show=(id)=>{$all('.tab').forEach(x=>x.classList.toggle('active',x.dataset.target===id));$all('.section').forEach(s=>s.classList.toggle('active',s.id===id));};
  tabsWrap.addEventListener('click',e=>{if(e.target.classList.contains('tab'))show(e.target.dataset.target)});
  // Build sections
  buildVocab(data);
  buildGames(data);
  buildReading(data);
  if (data.grammar) buildGrammar(data);
  buildExam(data);
}

function buildVocab(data){
  const wrap = document.getElementById('vocab');
  const grid = document.createElement('div'); grid.className='grid'; wrap.appendChild(grid);
  data.vocab.forEach(v=>{
    const card=document.createElement('div');card.className='card';
    const h=document.createElement('h3');h.textContent=v.en;card.appendChild(h);
    const p=document.createElement('p');p.textContent='Arabic: '+v.ar;card.appendChild(p);
    const ex=document.createElement('p');ex.innerHTML='<span class="small">Example:</span> '+v.ex;card.appendChild(ex);
    const btn=document.createElement('button');btn.className='play';btn.textContent='▶';btn.onclick=()=>speak(v.en+' . '+v.ex,{rate:0.85});card.appendChild(btn);
    grid.appendChild(card);
  });
  const hr=document.createElement('div');hr.className='hr';wrap.appendChild(hr);
  const test=document.createElement('div');test.className='card';
  test.innerHTML='<h3>Spelling Test</h3><p>Type the English word when you see its Arabic meaning.</p>';
  const start=document.createElement('button');start.className='btn';start.textContent='Start';start.onclick=()=>startSpelling(data.vocab);
  test.appendChild(start); wrap.appendChild(test);
}

function startSpelling(list){
  const pool = [...list]; pool.sort(()=>Math.random()-0.5);
  let score=0, i=0; const wrap=document.getElementById('vocab');
  const area=document.createElement('div'); area.className='quiz-card'; wrap.appendChild(area);
  function next(){
    if(i>=pool.length){ area.innerHTML=`<p class="score">Your score: ${score}/${pool.length}</p>`; cheer(); return; }
    const item=pool[i];
    area.innerHTML=`<p><b>Arabic:</b> ${item.ar}</p><input id="ans" class="draggable" placeholder="Type English here"/><div class="row"><button id="submit" class="btn">Check</button><button id="replay" class="btn secondary">Hear again</button></div>`;
    speak(item.en,{rate:0.8});
    $('#submit').onclick=()=>{
      const val=$('#ans').value.trim().toLowerCase();
      if(val===item.en.toLowerCase()){score++; cheer(); i++; next();}
      else{buzz();$('#ans').classList.add('incorrect'); setTimeout(()=>{$('#ans').classList.remove('incorrect')},600);}
    };
    $('#replay').onclick=()=>speak(item.en,{rate:0.8});
  }
  next();
}

function buildGames(data){
  const wrap=document.getElementById('games');
  // Match game: Arabic -> English drag into dropzones
  const card=document.createElement('div');card.className='card';wrap.appendChild(card);
  const t=document.createElement('h3');t.textContent='Matching Cards';card.appendChild(t);
  const row=document.createElement('div');row.className='row';card.appendChild(row);
  const left=document.createElement('div');left.className='dropzone';left.style.flex='1';left.innerHTML='<p class="small">Drop English cards onto their Arabic meanings.</p>';row.appendChild(left);
  const right=document.createElement('div');right.className='dropzone';right.style.flex='1';row.appendChild(right);
  // Arabic targets
  const pairs = data.games.match; // [{ar,en}]
  pairs.forEach((p,idx)=>{
    const z=document.createElement('div');z.className='draggable';z.textContent=p.ar;z.dataset.target=p.en.toLowerCase();left.appendChild(z);
  });
  // English cards
  pairs.slice().sort(()=>Math.random()-0.5).forEach(p=>{
    const d=document.createElement('div');d.className='draggable';d.textContent=p.en;d.draggable=true;d.dataset.en=p.en.toLowerCase();
    d.addEventListener('dragstart',e=>{e.dataTransfer.setData('text/plain',d.dataset.en)});
    right.appendChild(d);
  });
  // Dropping
  left.addEventListener('dragover',e=>e.preventDefault());
  left.addEventListener('drop',e=>{
    const en=e.dataTransfer.getData('text/plain');
    const target=e.target.closest('.draggable');
    if(!target) return;
    if(target.dataset.target===en){target.classList.add('correct'); cheer();}
    else{target.classList.add('incorrect'); buzz(); setTimeout(()=>target.classList.remove('incorrect'),600);}
  });

  // Quiz (Kahoot-style)
  const q=document.createElement('div');q.className='quiz-card';wrap.appendChild(q);
  let qi=0, score=0; const quiz=data.games.quiz;
  function render(){
    if(qi>=quiz.length){q.innerHTML=`<p class="score">Quiz score: ${score}/${quiz.length}</p>`; cheer(); return;}
    const item=quiz[qi];
    q.innerHTML=`<p><b>Arabic meaning:</b> ${item.ar}</p>`;
    item.options.forEach((opt,idx)=>{
      const o=document.createElement('div');o.className='option';o.textContent=opt;o.onclick=()=>{
        if(idx===item.answerIndex){o.classList.add('correct');score++;cheer();}
        else{o.classList.add('wrong');buzz();}
        setTimeout(()=>{qi++;render()},500);
      }; q.appendChild(o);
    });
  }
  render();
}

function buildReading(data){
  const wrap=document.getElementById('reading');
  const grid=document.createElement('div');grid.className='grid';wrap.appendChild(grid);
  data.reading.sentences.forEach((s,idx)=>{
    const c=document.createElement('div');c.className='card';
    const h=document.createElement('h3');h.textContent='Sentence '+(idx+1);c.appendChild(h);
    const p=document.createElement('p');p.textContent=s;c.appendChild(p);
    const b=document.createElement('button');b.className='play';b.textContent='▶';b.onclick=()=>speak(s,{rate:0.83});c.appendChild(b);
    grid.appendChild(c);
  });
  const hr=document.createElement('div');hr.className='hr';wrap.appendChild(hr);
  const q=document.createElement('div');q.className='quiz-card';wrap.appendChild(q);
  let i=0, score=0; const mcq=data.reading.mcq;
  function render(){
    if(i>=mcq.length){q.innerHTML=`<p class="score">Reading score: ${score}/${mcq.length}</p>`; cheer(); return;}
    const it=mcq[i];
    q.innerHTML=`<p>${it.q}</p>`;
    it.options.forEach((op,idx)=>{
      const d=document.createElement('div');d.className='option';d.textContent=op;d.onclick=()=>{
        if(idx===it.a){d.classList.add('correct');score++;cheer();}
        else{d.classList.add('wrong');buzz();}
        setTimeout(()=>{i++;render()},500);
      }; q.appendChild(d);
    });
  }
  render();
}

function buildGrammar(data){
  const wrap=document.getElementById('grammar');
  const card=document.createElement('div');card.className='card';wrap.appendChild(card);
  const h=document.createElement('h3');h.textContent='Verbs + infinitive or -ing (UK)';card.appendChild(h);
  const p=document.createElement('p');p.innerHTML=data.grammar.explain;card.appendChild(p);
  const q=document.createElement('div');q.className='quiz-card';wrap.appendChild(q);
  let i=0,score=0; const items=data.grammar.items;
  function render(){
    if(i>=items.length){q.innerHTML=`<p class="score">Grammar score: ${score}/${items.length}</p>`; cheer(); return;}
    const it=items[i];
    q.innerHTML=`<p>${it.q}</p>`;
    it.options.forEach((op,idx)=>{
      const d=document.createElement('div');d.className='option';d.textContent=op;d.onclick=()=>{
        if(idx===it.a){d.classList.add('correct'); score++; cheer();}
        else{d.classList.add('wrong'); buzz();}
        setTimeout(()=>{i++;render()},500);
      }; q.appendChild(d);
    });
  }
  render();
}

function buildExam(data){
  const wrap=document.getElementById('exam');
  const info=document.createElement('div');info.className='small';info.innerHTML='Instructions: Choose the best answer. (Interface in English only)';wrap.appendChild(info);
  const q=document.createElement('div');q.className='quiz-card';wrap.appendChild(q);
  let i=0,score=0; const items=data.exam;
  function render(){
    if(i>=items.length){q.innerHTML=`<p class="score">Final score: ${score}/${items.length}</p>`; cheer(); return;}
    const it=items[i];
    q.innerHTML=`<p>${it.q}</p>`;
    it.options.forEach((op,idx)=>{
      const d=document.createElement('div');d.className='option';d.textContent=op;d.onclick=()=>{
        if(idx===it.a){d.classList.add('correct');score++;cheer();}
        else{d.classList.add('wrong');buzz();}
        setTimeout(()=>{i++;render()},500);
      }; q.appendChild(d);
    });
  }
  render();
}

document.addEventListener('DOMContentLoaded', bootstrap);
