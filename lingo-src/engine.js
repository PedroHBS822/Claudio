
/* =====================================================================
   Índices
   ===================================================================== */
const ALL=[],SK={};
if(typeof CARDS!=='undefined') UNITS.forEach(u=>u.skills.forEach(s=>{ if(!s.cards&&CARDS[s.id]) s.cards=CARDS[s.id]; }));
UNITS.forEach((u,ui)=>u.skills.forEach(s=>{s.unit=u;s.ui=ui;s.idx=ALL.length;ALL.push(s);SK[s.id]=s;}));
/* Gerador de "relembrar": transforma os cartões de memória em questões (prática de evocação) */
function cardGen(s){ return lv=>{ const C=s.cards,i=R(0,C.length-1),[f,b]=C[i];
  const sib=s.unit.skills.filter(x=>x!==s&&x.cards);
  const backs=shuffle(C.filter((_,j)=>j!==i).map(c=>c[1])).concat(shuffle(sib.flatMap(x=>x.cards.map(c=>c[1]))));
  const fronts=shuffle(C.filter((_,j)=>j!==i).map(c=>c[0])).concat(shuffle(sib.flatMap(x=>x.cards.map(c=>c[0]))));
  const t=Math.random(); let q;
  if(t<0.55) q=MC(`🧠 <b>Relembre:</b> ${f}`,b,backs,`<b>${f}</b>: ${b}.`,s.tip);
  else if(t<0.8) q=MC(`🧠 <b>A que se refere?</b><br>${b}`,f,fronts,`${b} → <b>${f}</b>.`,s.tip);
  else { const ok=Math.random()<.5; q=TF(`${f}: <b>${ok?b:backs[0]}</b>`,ok,`O correto é: <b>${f}</b>: ${b}.`,s.tip); }
  q.card=true; q.cardKey=cardKey(s.id,i); return q; }; }
ALL.forEach(s=>{ if(s.cards&&s.cards.length>=2){ s.cardGi=s.gens.length; s.gens.push(cardGen(s)); } });

/* =====================================================================
   Mascote
   ===================================================================== */
function mascot(mood){
  const sad=mood==='sad',happy=mood==='happy';
  return `<svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><ellipse cx="60" cy="113" rx="34" ry="5" fill="rgba(0,0,0,.12)"/>
  <path d="M30 26 L38 8 L50 22Z" fill="${BRAND.dark}"/><path d="M90 26 L82 8 L70 22Z" fill="${BRAND.dark}"/>
  <path d="M20 68 Q18 20 60 18 Q102 20 100 68 Q100 110 60 110 Q20 110 20 68Z" fill="${BRAND.body}"/>
  <path d="M20 72 Q8 70 10 56" stroke="${BRAND.dark}" stroke-width="8" fill="none" stroke-linecap="round"/><path d="M100 72 Q112 ${happy?'52 106 42':'70 110 56'}" stroke="${BRAND.dark}" stroke-width="8" fill="none" stroke-linecap="round"/>
  <ellipse cx="60" cy="82" rx="27" ry="22" fill="${BRAND.belly}"/>
  <circle cx="43" cy="50" r="15" fill="#fff"/><circle cx="77" cy="50" r="15" fill="#fff"/>
  ${happy?'<path d="M35 52 Q43 42 51 52" stroke="#3c3c3c" stroke-width="5" fill="none" stroke-linecap="round"/><path d="M69 52 Q77 42 85 52" stroke="#3c3c3c" stroke-width="5" fill="none" stroke-linecap="round"/>':`<circle cx="46" cy="${sad?55:52}" r="7" fill="#3c3c3c"/><circle cx="74" cy="${sad?55:52}" r="7" fill="#3c3c3c"/><circle cx="48" cy="${sad?52:49}" r="2.5" fill="#fff"/><circle cx="76" cy="${sad?52:49}" r="2.5" fill="#fff"/>`}
  ${sad?'<path d="M32 34 L52 40" stroke="#3c3c3c" stroke-width="4" stroke-linecap="round"/><path d="M88 34 L68 40" stroke="#3c3c3c" stroke-width="4" stroke-linecap="round"/>':''}
  <path d="M53 64 L60 ${sad?68:72} L67 64Z" fill="#ff9600"/>
  <text x="60" y="98" text-anchor="middle" font-size="24" font-weight="900" fill="${BRAND.dark}" font-family="Georgia,serif">${BRAND.sym}</text></svg>`;
}

/* =====================================================================
   Estado e persistência
   ===================================================================== */
const LSK=BRAND.lsKey;
const pad=n=>String(n).padStart(2,'0');
const dkey=d=>`${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())}`;
const today=()=>dkey(new Date());
const addDays=(k,n)=>{const [y,m,d]=k.split('-').map(Number);return dkey(new Date(y,m-1,d+n));};
const diffDays=(a,b)=>{const p=k=>{const [y,m,d]=k.split('-').map(Number);return new Date(y,m-1,d).getTime();};return Math.round((p(b)-p(a))/864e5);};
function defState(){return {name:'Estudante',xp:0,gems:100,hearts:5,heartTs:0,streak:0,best:0,last:null,days:{},goal:20,sound:true,unlockAll:false,theme:'auto',skills:{},cards:{},mist:[],chk:{},trophy:{},nudged:null,cardsDone:0,lessons:0,reviews:0,correct:0,answered:0,perfect:0,ach:{},timedBest:0,created:today()};}
let S=defState();
try{const raw=localStorage.getItem(LSK);if(raw)S=Object.assign(defState(),JSON.parse(raw));}catch(e){}
/* Perfil compartilhado entre os cursos (nome, ofensiva, gemas, vidas, meta e preferências) */
const COMMON=['name','gems','hearts','heartTs','streak','best','last','days','goal','sound','theme'];
try{ const c=JSON.parse(localStorage.getItem(PKEY)||'null'); if(c) COMMON.forEach(k=>{ if(c[k]!==undefined) S[k]=c[k]; }); }catch(e){}
function save(){ try{ localStorage.setItem(LSK,JSON.stringify(S)); const c={}; COMMON.forEach(k=>c[k]=S[k]); localStorage.setItem(PKEY,JSON.stringify(c));
  localStorage.setItem('lingo_resumo_'+COURSE_ID,JSON.stringify({xp:S.xp,done:ALL.filter(x=>S.skills[x.id]&&S.skills[x.id].lv>=1).length,total:ALL.length,t:Date.now()})); }catch(e){} }
const DAY=864e5;
const dayStart=k=>{const [y,m,d]=k.split('-').map(Number);return new Date(y,m-1,d).getTime();};
/* estado de uma habilidade (com migração do formato antigo int/due para stab/lastT) */
function sk(id){ let s=S.skills[id]; if(!s) s=S.skills[id]={lv:0,ease:2.5,stab:0,lastT:0,c:0,w:0,n:0,g:{}};
  if(s.stab==null){ s.stab=s.lv?(s.int||1):0; s.lastT=s.lv&&s.due?dayStart(addDays(s.due,-(s.int||1))):(s.lv?Date.now():0); delete s.int; delete s.due; }
  if(!s.g) s.g={}; return s; }
const MAXH=5,HEART_MS=30*60*1000,REFILL=50;
function regen(){ if(S.hearts>=MAXH){S.heartTs=0;return;} if(!S.heartTs)S.heartTs=Date.now(); const n=Math.floor((Date.now()-S.heartTs)/HEART_MS); if(n>0){S.hearts=Math.min(MAXH,S.hearts+n);S.heartTs=S.hearts>=MAXH?0:S.heartTs+n*HEART_MS;save();} }
function loseHeart(){ if(S.hearts>=MAXH)S.heartTs=Date.now(); S.hearts=Math.max(0,S.hearts-1); }
function nextHeartIn(){ if(S.hearts>=MAXH||!S.heartTs)return ''; const ms=HEART_MS-(Date.now()-S.heartTs); const m=Math.max(0,Math.floor(ms/60000)),s=Math.max(0,Math.floor(ms%60000/1000)); return `${m}:${pad(s)}`; }
function checkStreak(){ const t=today(); if(S.last&&S.last!==t&&S.last!==addDays(t,-1)&&S.streak>0){ S.streak=0; save(); } }
function markStudy(xp){ const t=today(); let up=false; if(S.last!==t){ S.streak=(S.last===addDays(t,-1))?S.streak+1:1; S.last=t; up=true; } S.best=Math.max(S.best,S.streak); S.days[t]=(S.days[t]||0)+xp; S.xp+=xp; return up; }
const xpToday=()=>S.days[today()]||0;
const lvlOf=xp=>{let n=1;while(25*n*(n+1)<=xp)n++;return n;};
const lvlStart=n=>25*(n-1)*n;
function isUnlocked(i){ return S.unlockAll||i===0||sk(ALL[i].id).lv>=1||sk(ALL[i-1].id).lv>=1; }
/* ===== Modelo de memória (curva do esquecimento) =====
   Retenção estimada R(t) = 0,9^(t/estabilidade): cai para 90% após "stab" dias.
   Revisar quando R chega a ~90% (o momento ideal: difícil o bastante para fortalecer, fácil o bastante para lembrar).
   Quanto mais "esquecido" (R menor) e ainda assim acertado, maior o ganho de estabilidade (efeito do espaçamento). */
const eod=()=>dayStart(today())+DAY;
function retention(id,at){ const s=sk(id); if(s.lv<1||!s.lastT||!s.stab) return 1; const t=((at||Date.now())-s.lastT)/DAY; return Math.pow(0.9,Math.max(0,t)/s.stab); }
function isDue(id){ const s=sk(id); return s.lv>=1&&s.lastT>0&&(eod()-s.lastT)/DAY>=s.stab; }
function nextReviewDays(id){ const s=sk(id); return Math.max(0,Math.ceil((s.lastT+s.stab*DAY-dayStart(today()))/DAY)-1); }
function memUpdate(id,acc){ const s=sk(id); const R=retention(id);
  if(!s.stab||!s.lastT){ s.stab=acc>=0.7?1:0.5; }
  else if(acc>=0.9){ s.stab=Math.max(s.stab+0.5,s.stab*(1+s.ease*(1.3-R))); s.ease=Math.min(3,s.ease+0.05); }
  else if(acc>=0.7){ s.stab=Math.max(s.stab,s.stab*(1+(s.ease-1)*(1.3-R)*0.5)); }
  else { s.stab=Math.max(0.5,s.stab*0.4); s.ease=Math.max(1.3,s.ease-0.15); }
  s.stab=Math.min(round(s.stab,2),365); s.lastT=Date.now(); }
function avgRetention(){ const l=learned(); return l.length?l.reduce((a,id)=>a+retention(id),0)/l.length:0; }
const memColor=R=>R>=0.9?'#58cc02':R>=0.8?'#ffc800':R>=0.65?'#ff9600':'#ff4b4b';
const memLabel=R=>R>=0.9?'fresca':R>=0.8?'esfriando':R>=0.65?'esquecendo':'quase esquecida';
/* ===== Cartões de memória (flashcards) — repetição espaçada por cartão ===== */
function cardKey(id,i){ return id+':'+i; }
function cs(k){ return S.cards[k]||(S.cards[k]={stab:0,lastT:0,ease:2.5,n:0}); }
function cardR(k){ const c=cs(k); if(!c.lastT) return 0; return Math.pow(0.9,((Date.now()-c.lastT)/DAY)/c.stab); }
function cardDue(k){ const c=cs(k); return !c.lastT||(eod()-c.lastT)/DAY>=c.stab; }
function cardRate(k,g){ const c=cs(k),R=c.lastT?cardR(k):1; c.n++;
  if(g===1){ c.stab=Math.max(0.2,(c.stab||0.5)*0.3); c.ease=Math.max(1.3,c.ease-0.2); }
  else if(!c.stab){ c.stab=[0,0,0.6,1,3][g]; }
  else if(g===2){ c.stab=Math.max(c.stab,c.stab*1.2); c.ease=Math.max(1.3,c.ease-0.1); }
  else if(g===3){ c.stab=Math.max(c.stab+0.5,c.stab*(1+c.ease*(1.3-R))); }
  else { c.stab=Math.max(c.stab+1,c.stab*(1+c.ease*(1.3-R))*1.3); c.ease=Math.min(3,c.ease+0.1); }
  c.stab=Math.min(round(c.stab,2),365); c.lastT=Date.now(); }
function cardPool(){ const due=[],fresh=[]; learned().forEach(id=>(SK[id].cards||[]).forEach((_,i)=>{ const k=cardKey(id,i); if(!cs(k).lastT) fresh.push(k); else if(cardDue(k)) due.push(k); })); due.sort((a,b)=>cardR(a)-cardR(b)); return {due,fresh}; }
function cardsToday(){ const p=cardPool(); return p.due.length+Math.min(8,p.fresh.length); }
/* ===== Caderno de erros ===== */
function logMistake(q){ S.mist=S.mist||[]; const p=stripHtml(q.type==='fill'||q.type==='bank'?q.prompt+' '+q.sentence.replace('@@','___'):q.prompt).slice(0,170); S.mist=S.mist.filter(m=>!(m.s===q.skill&&m.g===q.gi&&m.p===p)); S.mist.unshift({s:q.skill,g:q.gi,p,a:stripHtml(q.answer).slice(0,70),t:Date.now()}); if(S.mist.length>80) S.mist.length=80; }
function resolveMistake(q){ const i=(S.mist||[]).findIndex(m=>m.s===q.skill&&m.g===q.gi); if(i>=0) S.mist.splice(i,1); }
function learned(){ return ALL.filter(s=>sk(s.id).lv>=1).map(s=>s.id); }
function dueList(){ return learned().filter(isDue).sort((a,b)=>retention(a)-retention(b)); }
function strength(id){ const s=sk(id); if(s.lv<1)return 0; const R=retention(id); return R>=0.9?4:R>=0.8?3:R>=0.65?2:1; }
function srsUpdate(id,acc){ memUpdate(id,acc); }
function currentSkill(){ for(const s of ALL){ if(isUnlocked(s.idx)&&sk(s.id).lv===0)return s; } return ALL.find(s=>sk(s.id).lv<5)||null; }

/* =====================================================================
   Conquistas
   ===================================================================== */
const ACH=[
 {id:'first',e:'🎓',n:'Primeiros passos',d:'Conclua sua primeira lição',t:()=>S.lessons>=1},
 {id:'l10',e:'📚',n:'Estudioso',d:'Conclua 10 lições',t:()=>S.lessons>=10},
 {id:'l50',e:'🏛️',n:'Maratonista',d:'Conclua 50 lições',t:()=>S.lessons>=50},
 {id:'perfect',e:'💯',n:'Perfeição',d:'Termine uma lição sem erros',t:()=>S.perfect>=1},
 {id:'rev5',e:'🧠',n:'Memória afiada',d:'Conclua 5 sessões de revisão',t:()=>S.reviews>=5},
 {id:'s3',e:'🔥',n:'Aquecendo',d:'Ofensiva de 3 dias',t:()=>S.best>=3},
 {id:'s7',e:'🌋',n:'Semana em chamas',d:'Ofensiva de 7 dias',t:()=>S.best>=7},
 {id:'s30',e:'☄️',n:'Imparável',d:'Ofensiva de 30 dias',t:()=>S.best>=30},
 {id:'x100',e:'⚡',n:'Centena',d:'Acumule 100 XP',t:()=>S.xp>=100},
 {id:'x1000',e:'🌟',n:'Milhar',d:'Acumule 1000 XP',t:()=>S.xp>=1000},
 {id:'x5000',e:'👑',n:'Lenda',d:'Acumule 5000 XP',t:()=>S.xp>=5000},
 {id:'master',e:'💎',n:'Mestre',d:'Leve uma habilidade ao nível 5',t:()=>ALL.some(s=>sk(s.id).lv>=5)},
 {id:'timed',e:'⏱️',n:'Relâmpago',d:'Acerte 15 no desafio de 60 s',t:()=>S.timedBest>=15},
 {id:'cards50',e:'🗂️',n:'Memória de elefante',d:'Revise 50 cartões de memória',t:()=>S.cardsDone>=50},
 {id:'cards300',e:'🐘',n:'Memória fotográfica',d:'Revise 300 cartões de memória',t:()=>S.cardsDone>=300},
 {id:'chk1',e:'🎁',n:'Baú aberto',d:'Complete um ponto de revisão da trilha',t:()=>Object.keys(S.chk).length>=1},
 {id:'trophy1',e:'🏆',n:'Campeão da unidade',d:'Passe no teste de uma unidade',t:()=>Object.keys(S.trophy).length>=1},
 {id:'fresh',e:'🧊',n:'Nada esquecido',d:'Tenha 10 habilidades com memória acima de 90%',t:()=>learned().filter(id=>retention(id)>=0.9).length>=10},
 ...UNITS.map((u,i)=>({id:'unit'+i,e:['🥉','🥈','🥇','🏅','🎖️','🏆','👑','🌟'][i%8],n:`Unidade ${i+1} concluída`,d:u.title,t:()=>u.skills.every(s=>sk(s.id).lv>=1)})),
];
function checkAch(){ const got=[]; ACH.forEach(a=>{ if(!S.ach[a.id]&&a.t()){ S.ach[a.id]=today(); got.push(a);} }); got.forEach((a,i)=>setTimeout(()=>toast(`${a.e} Conquista desbloqueada: <b>${a.n}</b>`),900+i*2200)); }

/* =====================================================================
   Som (Web Audio, sem arquivos externos)
   ===================================================================== */
let AC=null;
function beep(notes){ if(!S.sound)return; try{ AC=AC||new (window.AudioContext||window.webkitAudioContext)(); if(AC.state==='suspended')AC.resume(); let t=AC.currentTime+0.01; notes.forEach(([f,d,type,v])=>{ const o=AC.createOscillator(),g=AC.createGain(); o.type=type||'sine'; o.frequency.value=f; g.gain.setValueAtTime(0.0001,t); g.gain.exponentialRampToValueAtTime(v||0.2,t+0.015); g.gain.exponentialRampToValueAtTime(0.0001,t+d); o.connect(g); g.connect(AC.destination); o.start(t); o.stop(t+d+0.03); t+=d*0.75; }); }catch(e){} }
const SND={ok:[[784,.12],[1175,.25]],bad:[[233,.16,'square',.07],[175,.3,'square',.07]],done:[[523,.13],[659,.13],[784,.13],[1047,.4]],fail:[[392,.2,'triangle'],[330,.2,'triangle'],[262,.4,'triangle']],tap:[[520,.05,'sine',.06]]};

/* =====================================================================
   Tira-Dúvidas (assistente offline)
   ===================================================================== */
function normChat(s){ return String(s).toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g,'').replace(/[?!.,;:]/g,' ').replace(/\s+/g,' ').trim(); }
function findGloss(m){ const w=' '+m+' '; let best=null,bl=0; GLOSS.forEach(g=>g.k.forEach(k=>{ const hit=k.length<=3?w.includes(' '+k+' '):w.includes(k); if(hit&&k.length>bl){best=g;bl=k.length;} })); return best; }
/* calculadora segura (sem eval) */
function evalExpr(src){
  const s=src.replace(/×|x(?=\s*\d)/g,'*').replace(/÷|:/g,'/').replace(/−|–/g,'-').replace(/,/g,'.').replace(/\s+/g,'').replace(/sqrt|raiz/gi,'√');
  let i=0;
  const num=()=>{const m=s.slice(i).match(/^\d+(\.\d+)?|^\.\d+/);if(!m)throw 0;i+=m[0].length;return parseFloat(m[0]);};
  const atom=()=>{ if(s[i]==='('){i++;const v=expr();if(s[i]!==')')throw 0;i++;return v;} if(s[i]==='√'){i++;const v=unary();if(v<0)throw 0;return Math.sqrt(v);} if(s[i]==='π'){i++;return Math.PI;} return num(); };
  const power=()=>{ let b=atom(); if(s[i]==='%'){i++;b/=100;} if(s[i]==='^'){i++;return b**unary();} return b; };
  const unary=()=>{ if(s[i]==='-'){i++;return -unary();} if(s[i]==='+'){i++;return unary();} return power(); };
  const term=()=>{ let v=unary(); while(s[i]==='*'||s[i]==='/'){const o=s[i++];const r=unary();v=o==='*'?v*r:v/r;} return v; };
  const expr=()=>{ let v=term(); while(s[i]==='+'||s[i]==='-'){const o=s[i++];const r=term();v=o==='+'?v+r:v-r;} return v; };
  const v=expr(); if(i!==s.length||!isFinite(v))throw 0; return v;
}
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function tutor(raw){
  const m=normChat(raw);
  const q=(L&&L.cur&&L.state!=='result'&&!$('#lesson').classList.contains('hidden'))?L.cur:null;
  const answered=q&&L.state==='feedback';
  const aula=id=>`<br><button class="chip" data-theory="${id}" style="margin-top:8px">📖 Abrir aula: ${SK[id].name}</button>`;
  if(!m) return 'Pode perguntar! 🙂';
  if(/^(oi|ola|opa|bom dia|boa tarde|boa noite|e ai|hey|hello|salve)\b/.test(m)) return `Olá, ${esc(S.name)}! 👋 Eu sou o ${BRAND.tutor}. ${q?'Estou vendo sua questão atual — quer uma <b>dica</b>?':'Pergunte sobre qualquer assunto (ex.: '+BRAND.askEx+') ou digite uma conta.'}`;
  if(/obrigad|valeu|vlw|brigad/.test(m)) return 'Por nada! Continue praticando — a repetição é o segredo. 💪';
  /* porcentagem rápida */
  let pm=raw.replace(/−/g,'-').match(/(-?\d+(?:[.,]\d+)?)\s*%\s*de\s*(-?\d+(?:[.,]\d+)?)/i);
  if(pm){ const p=parseFloat(pm[1].replace(',','.')),v=parseFloat(pm[2].replace(',','.')); return `🧮 ${fmt(p)}% de ${fmt(v)} = ${fmt(v)} × ${fmt(p)}/100 = <b>${fmt(v*p/100)}</b>`; }
  let rm=m.match(/raiz (?:quadrada )?de (\d+(?:\.\d+)?)/); if(rm){ const v=parseFloat(rm[1]); return `🧮 √${fmt(v)} = <b>${fmt(round(Math.sqrt(v),4))}</b>${Number.isInteger(Math.sqrt(v))?` (pois ${Math.sqrt(v)}² = ${v})`:' (aproximadamente)'}`; }
  const ex=raw.replace(/quanto (é|e)|calcule|calcular|resolva|conta|\?|=/gi,'').trim();
  if(/^[\d\s+\-−*/×÷^().,√π%:x]+$/i.test(ex)&&/\d/.test(ex)&&/[+\-−*/×÷^√%:x]/.test(ex)){ try{ const v=evalExpr(ex); return `🧮 ${esc(ex)} = <b>${fmt(round(v,6))}</b>${q&&!answered?'<br><small>Use a calculadora para conferir, mas tente entender o raciocínio! 😉</small>':''}`; }catch(e){} }
  if(q){
    const s=SK[q.skill];
    if(/mostrar resposta|mostra a resposta|revela|revelar/.test(m)){ q.revealed=true; return `Tudo bem! A resposta é <b>${q.answer}</b>.<div class="ex">${q.exp}</div>Entenda o porquê e depois responda. 😉`; }
    if(/resposta|gabarito|qual (e|eh) a certa|qual a certa|resultado/.test(m)){ if(answered) return `✅ A resposta é <b>${q.answer}</b>.<div class="ex">${q.exp}</div>`; return `Tente primeiro! 😄 Uma dica: ${q.hint||s.tip}<br><small>Se quiser mesmo ver, digite <b>mostrar resposta</b>.</small>`; }
    if(/dica|ajuda|nao sei|travei|help|socorro|empaquei|me ajuda/.test(m)) return `💡 <b>Dica:</b> ${q.hint||s.tip}`;
    if(/por que|porque|pq|explica|explique|passo|como (resolv|faz|faco|calcul|chego)|nao entendi|errei|resolucao/.test(m)){ if(answered) return `📝 <b>Resolução:</b><div class="ex">${q.exp}</div>💡 ${s.tip}`; return `🧭 <b>Como pensar (${s.name}):</b><br>${s.tip}<br><br>💡 ${q.hint||''}<br><small>Depois de responder, pergunte "por quê?" para ver a resolução completa.</small>`; }
    if(/conceito|teoria|aula|materia|conteudo|formula|o que (e|eh) isso/.test(m)&&!findGloss(m)) return `📘 <b>${s.name}</b><br>${s.tip}${aula(s.id)}`;
  }
  const g=findGloss(m);
  if(g) return `📘 <b>${g.n}</b><br>${g.t}${aula(g.s)}`;
  if(/formula|formulas/.test(m)) return `Posso te passar fórmulas de: ${BRAND.formulas}… Qual delas?`;
  if(/xp|vida|coracao|ofensiva|streak|gema/.test(m)) return 'Você ganha <b>XP</b> concluindo lições e revisões. Cada erro numa lição custa 1 ❤️ (recupera 1 a cada 30 min, ou pratique na aba Revisar para ganhar vidas). A 🔥 <b>ofensiva</b> conta os dias seguidos em que você estudou.';
  return `Hmm, não encontrei isso na minha memória. 🤔 Tente perguntar sobre um tema (ex.: ${BRAND.askEx}) ou digite uma conta como <b>12*7+3</b>, <b>2^10</b>, <b>raiz de 144</b> ou <b>15% de 80</b>.${q?' Sobre a questão atual, peça uma <b>dica</b>.':''}`;
}

/* =====================================================================
   Helpers de DOM
   ===================================================================== */
const $=s=>document.querySelector(s);
function toast(html,ms=2400){ const t=document.createElement('div'); t.className='toast'; t.innerHTML=html; $('#toastroot').innerHTML=''; $('#toastroot').appendChild(t); setTimeout(()=>t.remove(),ms); }
function confetti(){ const cs=['#58cc02','#1cb0f6','#ffc800','#ff4b4b','#ce82ff','#ff9600']; for(let i=0;i<70;i++){ const c=document.createElement('div'); c.className='confetti'; c.style.left=Math.random()*100+'vw'; c.style.background=pick(cs); c.style.animationDuration=(1.8+Math.random()*1.8)+'s'; c.style.animationDelay=(Math.random()*.4)+'s'; c.style.borderRadius=Math.random()<.5?'50%':'2px'; document.body.appendChild(c); setTimeout(()=>c.remove(),4200); } }
function modal(html,opts={}){ const root=$('#modalroot'); root.innerHTML=`<div class="modal-bg"><div class="modal" role="dialog" aria-modal="true">${opts.noClose?'':'<button class="close" data-close aria-label="Fechar">✕</button>'}${html}</div></div>`; const bg=root.firstChild; bg.addEventListener('click',e=>{ if((e.target===bg&&!opts.noClose)||e.target.closest('[data-close]')) closeModal(); }); return bg; }
function closeModal(){ $('#modalroot').innerHTML=''; }
const modalOpen=()=>!!$('#modalroot').firstChild;
