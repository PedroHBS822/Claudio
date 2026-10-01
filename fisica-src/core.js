/* =====================================================================
   Física do Zero — núcleo: estado, rotas, lição, prática e laboratório
   ===================================================================== */
const MODS=[]; const LES=[]; const LX={}; const SIMS={};
function mod(id,t,sub,lessons){ const m={id,t,sub,lessons}; MODS.push(m); lessons.forEach(l=>{ l.mod=m; l.idx=LES.length; LES.push(l); LX[l.id]=l; }); }
/* encaixa lições num módulo já criado (depois de `after`, ou no começo) e renumera o curso */
function addLessons(modId,after,lessons){ const m=MODS.find(x=>x.id===modId); const i=after?m.lessons.findIndex(l=>l.id===after)+1:0; m.lessons.splice(i,0,...lessons); lessons.forEach(l=>{ l.mod=m; LX[l.id]=l; }); LES.length=0; MODS.forEach(mm=>mm.lessons.forEach(l=>{ l.idx=LES.length; LES.push(l); })); }

/* ---------- utilidades ---------- */
const $=(s,r=document)=>r.querySelector(s), $$=(s,r=document)=>[...r.querySelectorAll(s)];
const R=(a,b,st=1)=>{ const n=Math.round((b-a)/st); return +(a+st*Math.floor(Math.random()*(n+1))).toFixed(6); };
const pick=a=>a[Math.floor(Math.random()*a.length)];
const shuffle=a=>{ a=a.slice(); for(let i=a.length-1;i>0;i--){ const j=Math.floor(Math.random()*(i+1)); [a[i],a[j]]=[a[j],a[i]]; } return a; };
const clamp=(x,a,b)=>Math.max(a,Math.min(b,x));
const SUP={'-':'⁻','0':'⁰','1':'¹','2':'²','3':'³','4':'⁴','5':'⁵','6':'⁶','7':'⁷','8':'⁸','9':'⁹'};
const NF=new Intl.NumberFormat('pt-BR',{maximumSignificantDigits:3});
function nsig(x,sig){ return new Intl.NumberFormat('pt-BR',{maximumSignificantDigits:sig}).format(x); }
/* número para HTML: 3 algarismos significativos, notação científica quando muito grande ou pequeno */
function nf(x,sig=3){ if(!isFinite(x)) return '—'; if(x===0) return '0'; const a=Math.abs(x);
  if(a>=1e6||a<1e-3){ const e=Math.floor(Math.log10(a)); let m=x/10**e; if(Math.abs(+m.toPrecision(sig))>=10){ m/=10; return nsig(m,sig)+'×10<sup>'+(e+1)+'</sup>'; } return nsig(+m.toPrecision(sig),sig)+'×10<sup>'+e+'</sup>'; }
  return nsig(+x.toPrecision(sig),sig); }
/* o mesmo, em texto puro (para o canvas) */
function nt(x,sig=3){ return nf(x,sig).replace(/<sup>(-?\d+)<\/sup>/,(m,e)=>'^'+e).replace(/\^(-?\d+)/,(m,e)=>[...e].map(c=>SUP[c]).join('')); }
function parseNum(str){ let t=String(str).trim().replace(/\s+/g,'').replace(/[−–]/g,'-');
  if(!t) return NaN;
  if(/^-?[1-9]\d{0,2}(\.\d{3})+(,\d+)?$/.test(t)) t=t.replace(/\./g,'');
  t=t.replace(',','.').replace(/[x×*·]10\^?\(?(-?\d+)\)?$/i,'e$1').replace(/^10\^\(?(-?\d+)\)?$/,'1e$1');
  return /^-?(\d+\.?\d*|\.\d+)(e-?\d+)?$/i.test(t)?Number(t):NaN; }
const frac=(a,b)=>`<span class="frac"><span>${a}</span><span>${b}</span></span>`;
const esc=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));

/* ---------- progresso: neste navegador e, quando dá, na conta do Claude ---------- */
const KEY='fisica_do_zero_v1', DAY=864e5, BOX=[1,3,7,16,35];
function normP(p){ p=p&&typeof p==='object'?p:{}; p.l=p.l&&typeof p.l==='object'?p.l:{}; p.mod=p.mod&&typeof p.mod==='object'?p.mod:{}; p.days=Array.isArray(p.days)?p.days:[]; return p; }
let P=normP((()=>{ try{ return JSON.parse(localStorage.getItem(KEY)); }catch(e){ return null; } })());
const SYNC={doc:null,state:'local',busy:false,again:false,timer:0,sent:''};
const canon=v=>Array.isArray(v)?'['+v.map(canon).join(',')+']':v&&typeof v==='object'?'{'+Object.keys(v).sort().map(k=>JSON.stringify(k)+':'+canon(v[k])).join(',')+'}':JSON.stringify(v===undefined?null:v);
const cloudData=()=>({v:1,l:P.l,mod:P.mod,days:P.days});
function saveLocal(){ try{ localStorage.setItem(KEY,JSON.stringify(P)); }catch(e){} }
function save(){ saveLocal(); if(SYNC.doc){ clearTimeout(SYNC.timer); SYNC.timer=setTimeout(push,1200); } }
/* uma escrita por vez, e só quando os dados mudaram */
async function push(){ if(!SYNC.doc) return; if(SYNC.busy){ SYNC.again=true; return; }
  const data=cloudData(), c=canon(data); if(c===SYNC.sent) return;
  SYNC.busy=true;
  try{ await SYNC.doc.set(JSON.parse(JSON.stringify(data))); SYNC.sent=c; SYNC.state='cloud'; }
  catch(e){ if(e&&['invalid_argument','revoked','not_granted','capability_disabled','capability_removed'].includes(e.code)){ SYNC.doc=null; SYNC.state='local'; } else SYNC.state='erro'; }
  SYNC.busy=false; syncBadge(); if(SYNC.again){ SYNC.again=false; push(); } }
/* junta o progresso local com o da conta: em cada lição vale o mais avançado */
function mergeP(a,b){ const out=normP({...a}); out.l={};
  const rank=x=>[x.s||0,x.box||0,x.n||0];
  new Set([...Object.keys(a.l),...Object.keys(b.l)]).forEach(id=>{ const x=a.l[id], y=b.l[id];
    if(!x||!y){ out.l[id]={...(x||y)}; return; }
    const rx=rank(x), ry=rank(y); let win=x; for(let i=0;i<3;i++){ if(rx[i]!==ry[i]){ win=rx[i]>ry[i]?x:y; break; } }
    const lose=win===x?y:x, w={...win}; ['pr','prr','lab','ex','jd'].forEach(k=>{ if(w[k]==null&&lose[k]!=null) w[k]=lose[k]; }); if(lose.ji>(w.ji||0)) w.ji=lose.ji; out.l[id]=w; });
  out.mod={...b.mod}; Object.keys(a.mod).forEach(k=>{ out.mod[k]=Math.max(+a.mod[k]||0,+out.mod[k]||0); });
  out.days=[...new Set([...b.days,...a.days])].filter(d=>typeof d==='string').sort().slice(-400);
  return out; }
async function initSync(){ const cl=window.claude; if(!cl||typeof cl.use!=='function') return;
  try{ const [db,user]=await Promise.all([cl.use('db'),cl.use('user')]); if(!db||!user) return;
    const id=await user.id(); if(!id) return;
    const doc=db.doc('data/users/'+id+'/progresso'), snap=await doc.get(), rem=snap.exists?snap.data():null;
    const before=canon(cloudData());
    if(rem&&rem.v===1){ const r=normP({l:rem.l,mod:rem.mod,days:rem.days}); SYNC.sent=canon({v:1,l:r.l,mod:r.mod,days:r.days}); const last=P.last; P=mergeP(P,r); P.last=last; saveLocal(); }
    SYNC.doc=doc; SYNC.state='cloud'; syncBadge(); push();
    if(canon(cloudData())!==before) refreshAfterSync();
  }catch(e){ SYNC.doc=null; SYNC.state='local'; syncBadge(); } }
function syncText(){ return SYNC.state==='cloud'?'Progresso salvo na sua conta: continue em qualquer aparelho.':SYNC.state==='erro'?'Não consegui salvar na sua conta agora. O progresso está guardado neste navegador.':'Progresso salvo neste navegador.'; }
function syncBadge(){ $$('.syncnote').forEach(el=>{ el.textContent=syncText(); el.classList.toggle('cloud',SYNC.state==='cloud'); }); }

function ls(id){ return P.l[id]||(P.l[id]={s:0,st:0,n:0,c:0,box:0,due:0}); }
const isDue=id=>{ const x=P.l[id]; return !!x&&x.s===2&&x.due<=Date.now(); };
const dueList=()=>LES.filter(l=>isDue(l.id));
const mastered=()=>LES.filter(l=>(P.l[l.id]||{}).s===2).length;
const begun=x=>!!x&&(x.s===1||(x.s!==2&&(x.ji>0||x.jd)));
function statusDot(id){ const x=P.l[id]; return `<span class="dot ${isDue(id)?'due':x&&x.s===2?'s2':begun(x)?'s1':''}" aria-hidden="true"></span>`; }
function statusText(id){ const x=P.l[id]; return isDue(id)?'revisão pendente':x&&x.s===2?'dominada':begun(x)?'em andamento':'não iniciada'; }
function nextLesson(){ const last=P.last&&LX[P.last]; if(last&&(P.l[last.id]||{}).s!==2) return last; return LES.find(l=>(P.l[l.id]||{}).s!==2)||LES[0]; }

/* dias de estudo seguidos */
const ymd=d=>d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0');
function markDay(){ const t=ymd(new Date()); if(!P.days.includes(t)){ P.days.push(t); P.days.sort(); if(P.days.length>400) P.days=P.days.slice(-400); } }
function streakDays(){ const set=new Set(P.days), d=new Date(); if(!set.has(ymd(d))){ d.setDate(d.getDate()-1); if(!set.has(ymd(d))) return 0; } let n=0; while(set.has(ymd(d))){ n++; d.setDate(d.getDate()-1); } return n; }
const normTxt=s=>String(s).normalize('NFD').replace(/[̀-ͯ]/g,'').toLowerCase();

/* ---------- cores do tema, lidas dos tokens CSS ---------- */
const COL={};
function readCols(){ const cs=getComputedStyle(document.documentElement);
  ['paper','card','sunk','ink','muted','line','accent','vel','force','acc','energy','ok','bad'].forEach(k=>COL[k]=cs.getPropertyValue('--'+k).trim()); }
readCols();
const LIVE=new Set();
function themeChanged(){ readCols(); LIVE.forEach(s=>s.render()); }
try{ matchMedia('(prefers-color-scheme: dark)').addEventListener('change',themeChanged); }catch(e){}
new MutationObserver(themeChanged).observe(document.documentElement,{attributes:true,attributeFilter:['data-theme','class','style']});

/* ---------- desenho ---------- */
function G(ctx,W,H){ const g={ctx,W,H,
  font(sz=13,kind='display',bold=false){ ctx.font=`${bold?'700 ':'500 '}${sz}px ${kind==='mono'?'"JetBrains Mono", ui-monospace, monospace':'"Bricolage Grotesque", system-ui, sans-serif'}`; },
  text(t,x,y,o={}){ g.font(o.size||13,o.mono?'mono':'display',o.bold); ctx.fillStyle=o.c||COL.ink; ctx.textAlign=o.align||'left'; ctx.textBaseline=o.base||'alphabetic'; ctx.fillText(t,x,y); },
  line(x1,y1,x2,y2,c=COL.ink,w=2,dash){ ctx.save(); ctx.strokeStyle=c; ctx.lineWidth=w; if(dash) ctx.setLineDash(dash); ctx.beginPath(); ctx.moveTo(x1,y1); ctx.lineTo(x2,y2); ctx.stroke(); ctx.restore(); },
  poly(pts,c=COL.ink,w=2,fill,close){ if(pts.length<2) return; ctx.save(); ctx.beginPath(); ctx.moveTo(pts[0][0],pts[0][1]); for(let i=1;i<pts.length;i++) ctx.lineTo(pts[i][0],pts[i][1]); if(close) ctx.closePath(); if(fill){ ctx.fillStyle=fill; ctx.fill(); } if(c){ ctx.strokeStyle=c; ctx.lineWidth=w; ctx.lineJoin='round'; ctx.stroke(); } ctx.restore(); },
  circle(x,y,r,fill,stroke,w=2){ ctx.beginPath(); ctx.arc(x,y,r,0,Math.PI*2); if(fill){ ctx.fillStyle=fill; ctx.fill(); } if(stroke){ ctx.strokeStyle=stroke; ctx.lineWidth=w; ctx.stroke(); } },
  rect(x,y,w,h,fill,stroke,r=0,lw=2){ ctx.beginPath(); if(ctx.roundRect&&r) ctx.roundRect(x,y,w,h,r); else ctx.rect(x,y,w,h); if(fill){ ctx.fillStyle=fill; ctx.fill(); } if(stroke){ ctx.strokeStyle=stroke; ctx.lineWidth=lw; ctx.stroke(); } },
  arrow(x1,y1,x2,y2,c,label,w=3,lpos){ const dx=x2-x1,dy=y2-y1,L=Math.hypot(dx,dy); if(L<2) return; const ux=dx/L,uy=dy/L,hs=Math.min(11+w,L*.45);
    const path=()=>{ ctx.beginPath(); ctx.moveTo(x1,y1); ctx.lineTo(x2-ux*hs*.8,y2-uy*hs*.8); };
    const head=()=>{ ctx.beginPath(); ctx.moveTo(x2,y2); ctx.lineTo(x2-ux*hs-uy*hs*.55,y2-uy*hs+ux*hs*.55); ctx.lineTo(x2-ux*hs+uy*hs*.55,y2-uy*hs-ux*hs*.55); ctx.closePath(); };
    ctx.save(); ctx.lineCap='round'; ctx.lineJoin='round';
    ctx.strokeStyle=COL.paper; ctx.globalAlpha=.85; ctx.lineWidth=w+4; path(); ctx.stroke(); head(); ctx.stroke(); ctx.globalAlpha=1;
    ctx.strokeStyle=c; ctx.fillStyle=c; ctx.lineWidth=w; path(); ctx.stroke(); head(); ctx.fill(); ctx.restore();
    if(label){ const lx=x2+ux*14+(lpos||[0,0])[0], ly=y2+uy*14+(lpos||[0,0])[1]; g.tag(label,lx,ly,c,ux<-.3?'right':ux>.3?'left':'center'); } },
  /* etiqueta legível sobre qualquer fundo */
  tag(t,x,y,c,align='center',size=12.5){ g.font(size,'display',true); const w=ctx.measureText(t).width+10, h=size+7, x0=align==='left'?x-3:align==='right'?x-w+3:x-w/2;
    ctx.save(); ctx.globalAlpha=.88; g.rect(x0,y-h/2,w,h,COL.card,null,h/2); ctx.restore(); g.text(t,x0+w/2,y+1,{c,size,bold:true,align:'center',base:'middle'}); },
  /* gráfico: caixa (x,y,w,h), faixas xr/yr, séries [{pts:[[x,y]...],c}] */
  plot(x,y,w,h,o){ const xr=o.xr,yr=o.yr; const X=v=>x+(v-xr[0])/(xr[1]-xr[0])*w, Y=v=>y+h-(v-yr[0])/(yr[1]-yr[0])*h;
    g.rect(x,y,w,h,COL.card,COL.line,0,1);
    const tk=(a,b)=>{ const span=b-a, raw=span/4, p=10**Math.floor(Math.log10(raw)), m=raw/p, st=(m<1.5?1:m<3?2:m<7?5:10)*p; const out=[]; for(let v=Math.ceil(a/st)*st;v<=b+1e-9;v+=st) out.push(+v.toFixed(10)); return out; };
    tk(xr[0],xr[1]).forEach(v=>{ g.line(X(v),y,X(v),y+h,COL.line,1); g.text(nt(v),X(v),y+h+14,{c:COL.muted,size:11,align:'center',mono:true}); });
    tk(yr[0],yr[1]).forEach(v=>{ g.line(x,Y(v),x+w,Y(v),COL.line,1); g.text(nt(v),x-5,Y(v)+4,{c:COL.muted,size:11,align:'right',mono:true}); });
    if(yr[0]<0&&yr[1]>0) g.line(x,Y(0),x+w,Y(0),COL.muted,1.2);
    ctx.save(); ctx.beginPath(); ctx.rect(x,y,w,h); ctx.clip();
    (o.series||[]).forEach(se=>{ if(se.fill){ const pts=se.pts.map(p=>[X(p[0]),Y(p[1])]); if(pts.length>1){ pts.push([pts[pts.length-1][0],Y(0)],[pts[0][0],Y(0)]); g.poly(pts,null,0,se.fill,true); } }
      g.poly(se.pts.map(p=>[X(p[0]),Y(p[1])]),se.c,se.w||2.5); if(se.dot&&se.pts.length){ const p=se.pts[se.pts.length-1]; g.circle(X(p[0]),Y(p[1]),4.5,se.c); } });
    ctx.restore();
    if(o.xl) g.text(o.xl,x+w,y+h+28,{c:COL.muted,size:12,align:'right'});
    if(o.yl) g.text(o.yl,x+4,y-7,{c:COL.muted,size:12});
    return {X,Y}; },
  ground(y){ g.line(0,y,W,y,COL.muted,2); ctx.save(); ctx.strokeStyle=COL.line; ctx.lineWidth=1; for(let i=-20;i<W;i+=12){ ctx.beginPath(); ctx.moveTo(i,y+10); ctx.lineTo(i+10,y); ctx.stroke(); } ctx.restore(); }
 }; return g; }

/* ---------- laboratório genérico ---------- */
const REDUCED=matchMedia('(prefers-reduced-motion: reduce)').matches;
function Sim(host,def){
  const s={p:{},t:0,playing:false,def,rate:1,host}; (def.ctrls||[]).forEach(c=>s.p[c.k]=c.v);
  const ctrlHTML=(def.ctrls||[]).map(c=>c.opts
    ?`<div class="ctrl"><label>${c.l}</label><div class="seg" role="group" aria-label="${c.l}">${c.opts.map(o=>`<button type="button" data-k="${c.k}" data-v="${o[0]}" class="${o[0]===c.v?'on':''}">${o[1]}</button>`).join('')}</div></div>`
    :`<div class="ctrl"><label for="${host.id}-${c.k}"><span>${c.l}</span><output id="${host.id}-${c.k}-o">${fmtC(c,c.v)}</output></label><input type="range" id="${host.id}-${c.k}" data-k="${c.k}" min="${c.min}" max="${c.max}" step="${c.step}" value="${c.v}"></div>`).join('');
  const xb=(def.btns||[]).map((b,i)=>`<button class="btn sm ghost" type="button" data-act="x${i}">${b.l}</button>`).join('');
  const spd=def.anim?`<span class="spd" role="group" aria-label="Velocidade da simulação"><span class="spdl">câmera lenta</span>${[[.25,'¼×'],[.5,'½×'],[1,'1×']].map(([r,t])=>`<button type="button" data-rate="${r}" class="${r===1?'on':''}" aria-label="${t}">${t}</button>`).join('')}</span>`:'';
  host.innerHTML=`<div class="lab"><div class="labcv"><canvas aria-label="${esc(def.alt||'Simulação')}" role="img"></canvas></div>${def.legend?`<div class="legend">${def.legend.map(([c,t])=>`<span><i style="background:var(--${c})"></i>${t}</span>`).join('')}</div>`:''}<div class="labui${ctrlHTML||def.drag?'':' solo'}">${ctrlHTML||def.drag?`<div class="ctrls">${ctrlHTML||'<p class="eyebrow" style="margin:0">Arraste os elementos no desenho</p>'}</div>`:''}<div class="reads" aria-live="polite"></div></div><div class="labbar">${def.anim?`<button class="btn sm" type="button" data-act="play">▶ Iniciar</button><button class="btn sm ghost" type="button" data-act="reset">↺ Reiniciar</button>`:''}${xb}${spd}<button class="btn sm ghost labx" type="button" data-act="big" aria-label="Ampliar o laboratório">⤢ Ampliar</button></div></div>`;
  const lab=$('.lab',host), cv=$('canvas',host), ctx=cv.getContext('2d'), rdEl=$('.reads',host); let lastR='', prevVals=[];
  function fmtC(c,v){ return c.f?c.f(v):(nsig(v,4)+(c.u?' '+c.u:'')); }
  function size(){ const w=cv.clientWidth||600; let h=typeof def.h==='function'?def.h(w):(def.h||300); if(lab.classList.contains('big')) h=Math.max(h,Math.min(innerHeight-230,w*.62)); cv.style.height=h+'px'; const d=Math.min(2,window.devicePixelRatio||1); cv.width=Math.round(w*d); cv.height=Math.round(h*d); ctx.setTransform(d,0,0,d,0,0); s.W=w; s.H=h; }
  s.render=()=>{ if(!s.W) return; ctx.clearRect(0,0,s.W,s.H); const g=G(ctx,s.W,s.H); def.draw(g,s); if(s.overlay) s.overlay(g,s);
    if(def.reads){ const rows=def.reads(s), vals=rows.map(r=>r[1]); const r=rows.map(([a,b],i)=>`<div class="rd${!s.playing&&prevVals.length&&prevVals[i]!==b?' chg':''}"><span>${a}</span><b>${b}</b></div>`).join(''); if(vals.join('|')!==prevVals.join('|')||!lastR){ rdEl.innerHTML=r; lastR=r; prevVals=vals; } } };
  s.reset=()=>{ s.t=0; s.playing=false; s.until=null; s.stopWhen=null; setPlay(); def.init&&def.init(s); s.render(); };
  let raf=0,last=0;
  function frame(now){ raf=0; const dt=Math.min(.05,(now-last)/1000||0); last=now;
    if(s.playing){ const n=def.sub||1; let tot=dt*(def.speed||1)*s.rate; if(s.until!=null) tot=Math.min(tot,Math.max(0,s.until-s.t));
      for(let i=0;i<n;i++){ def.step(s,tot/n); s.t+=tot/n; }
      if(s.stopWhen&&s.stopWhen(s)){ s.stopWhen=null; s.until=null; s.playing=false; setPlay(); const cb=s.onUntil; s.onUntil=null; s.render(); cb&&cb(); return; }
      if(s.until!=null&&s.t>=s.until-1e-9){ s.t=s.until; s.until=null; s.playing=false; setPlay(); const cb=s.onUntil; s.onUntil=null; s.render(); cb&&cb(); return; } }
    s.render(); if(s.playing) raf=requestAnimationFrame(frame); }
  s.play=on=>{ s.playing=on; setPlay(); if(on&&!raf){ last=performance.now(); raf=requestAnimationFrame(frame); } };
  /* roda a animação até o instante t (usado nos exemplos animados) */
  s.runTo=(t,cb)=>{ if(typeof t==='function'){ s.stopWhen=t; s.until=null; s.onUntil=cb; if(t(s)){ s.stopWhen=null; cb&&cb(); return; } s.play(true); return; } s.stopWhen=null; if(t<s.t-1e-9) s.reset(); s.until=t; s.onUntil=cb; if(REDUCED){ while(s.t<t-1e-9){ const d=Math.min(.02,t-s.t); def.step(s,d); s.t+=d; } s.t=t; s.until=null; s.onUntil=null; s.render(); cb&&cb(); } else s.play(true); };
  function setPlay(){ const b=$('[data-act=play]',host); if(b) b.textContent=s.playing?'❚❚ Pausar':(s.t>0?'▶ Continuar':'▶ Iniciar'); }
  host.addEventListener('input',e=>{ const k=e.target.dataset.k; if(!k) return; const c=def.ctrls.find(x=>x.k===k); s.p[k]=+e.target.value; $(`#${host.id}-${k}-o`).textContent=fmtC(c,s.p[k]); if(c.live){ def.onParam&&def.onParam(s,k); s.render(); } else s.reset(); });
  host.addEventListener('click',e=>{ const b=e.target.closest('button'); if(!b||!host.contains(b)) return;
    if(b.dataset.rate){ s.rate=+b.dataset.rate; $$('[data-rate]',host).forEach(x=>x.classList.toggle('on',x===b)); return; }
    if(b.dataset.k){ const k=b.dataset.k,c=def.ctrls.find(x=>x.k===k); const raw=b.dataset.v; s.p[k]=isNaN(+raw)?raw:+raw; $$(`button[data-k="${k}"]`,host).forEach(x=>x.classList.toggle('on',x===b)); if(c.live){ def.onParam&&def.onParam(s,k); s.render(); } else s.reset(); return; }
    const a=b.dataset.act; if(a==='big'){ const on=!lab.classList.contains('big'); lab.classList.toggle('big',on); document.body.classList.toggle('noscroll',on); b.textContent=on?'✕ Fechar':'⤢ Ampliar'; b.setAttribute('aria-label',on?'Fechar a tela ampliada':'Ampliar o laboratório'); size(); s.render(); return; }
    if(a==='play'){ if(!s.playing&&def.done&&def.done(s)) s.reset(); s.until=null; s.stopWhen=null; s.play(!s.playing); } else if(a==='reset') s.reset(); else if(a&&a[0]==='x'){ def.btns[+a.slice(1)].f(s); s.render(); } });
  if(def.drag){ const pos=e=>{ const r=cv.getBoundingClientRect(); return [e.clientX-r.left,e.clientY-r.top]; }; let dragging=false;
    cv.addEventListener('pointerdown',e=>{ const [x,y]=pos(e); if(def.drag.down(s,x,y)){ dragging=true; cv.setPointerCapture(e.pointerId); cv.style.cursor='grabbing'; s.render(); e.preventDefault(); } });
    cv.addEventListener('pointermove',e=>{ const [x,y]=pos(e); if(!dragging){ if(def.drag.hover) cv.style.cursor=def.drag.down({...s,dr:null,def},x,y)?'grab':'default'; return; } def.drag.move(s,x,y); s.render(); });
    const up=()=>{ if(dragging){ dragging=false; cv.style.cursor='grab'; def.drag.up&&def.drag.up(s); s.render(); } }; cv.addEventListener('pointerup',up); cv.addEventListener('pointercancel',up); cv.style.cursor='grab'; }
  /* atalhos de teclado: espaço inicia/pausa, R reinicia, Esc fecha a tela ampliada */
  lab.tabIndex=-1; lab.addEventListener('keydown',e=>{ if(e.target.matches('input,textarea')) return; if(e.key===' '&&def.anim){ e.preventDefault(); $('[data-act=play]',host)?.click(); } else if((e.key==='r'||e.key==='R')&&def.anim) s.reset(); else if(e.key==='Escape'&&lab.classList.contains('big')) $('[data-act=big]',host).click(); });
  new ResizeObserver(()=>{ size(); if(def.onResize) def.onResize(s); s.render(); }).observe(cv);
  size(); def.init&&def.init(s); LIVE.add(s); s.render();
  if(def.anim&&def.autoplay&&!REDUCED) s.play(true);
  s.dispose=()=>{ s.playing=false; LIVE.delete(s); if(lab.classList.contains('big')) document.body.classList.remove('noscroll'); };
  return s; }

/* ---------- blocos de conteúdo ---------- */
function formulaCard(f,compact){ const sym=f.s?`<div class="tblw"><table class="sym"><tbody>${f.s.map(r=>`<tr><td>${r[0]}</td><td>${r[1]}</td><td>${r[2]||''}</td></tr>`).join('')}</tbody></table></div>`:'';
  return `<div class="fcard"><div class="fml">${f.f.replace(/ {3,}/g,'<span class="gap"></span>')}</div>${compact&&sym?`<details class="symd"><summary>O que é cada símbolo</summary>${sym}</details>`:sym}${f.n?`<p class="fnote">${f.n}</p>`:''}</div>`; }
/* HTML da lição → texto simples (para buscar e para mandar ao tutor) */
function plain(h){ const t=String(h).replace(/<span class="frac"><span>(.*?)<\/span><span>(.*?)<\/span><\/span>/g,'($1)/($2)').replace(/<sup>(.*?)<\/sup>/g,'^$1').replace(/<sub[^>]*>(.*?)<\/sub>/g,'_$1').replace(/<li>/g,'\n- ').replace(/<\/p>|<br\s*\/?>/g,'\n');
  return (new DOMParser().parseFromString(t,'text/html').body.textContent||'').replace(/[ \t\u00a0]+/g,' ').replace(/ *\n\s*/g,'\n').trim(); }
/* markdown mínimo e seguro para as respostas do tutor */
function mdInline(t){ return esc(t).replace(/\*\*(.+?)\*\*/g,'<b>$1</b>').replace(/(^|[^*\w])\*([^*\s][^*]*?)\*(?![*\w])/g,'$1<i>$2</i>').replace(/`([^`]+)`/g,'<code>$1</code>').replace(/\^\(?(-?[0-9A-Za-z]+)\)?/g,'<sup>$1</sup>'); }
function md(s){ let html='',list=null,para=[]; const close=()=>{ if(list){ html+=`</${list}>`; list=null; } }, flush=()=>{ if(para.length){ html+='<p>'+para.map(mdInline).join('<br>')+'</p>'; para=[]; } };
  for(const raw of String(s).split('\n')){ const l=raw.trim(); let m;
    if(!l){ flush(); close(); continue; }
    if((m=l.match(/^#{1,6}\s+(.*)/))){ flush(); close(); html+='<p><b>'+mdInline(m[1].replace(/\*\*/g,''))+'</b></p>'; continue; }
    if((m=l.match(/^[-•*]\s+(.*)/))){ flush(); if(list!=='ul'){ close(); html+='<ul>'; list='ul'; } html+='<li>'+mdInline(m[1])+'</li>'; continue; }
    if((m=l.match(/^\d+[.)]\s+(.*)/))){ flush(); if(list!=='ol'){ close(); html+='<ol>'; list='ol'; } html+='<li>'+mdInline(m[1])+'</li>'; continue; }
    close(); para.push(l); }
  flush(); close(); return html; }

/* ---------- tutor com IA: usa o Claude de quem está vendo e some quando não há ---------- */
const AI={fn:null};
const TUTOR='Você é o tutor do site "Física do Zero", que ensina física do ensino médio a estudantes brasileiros que se preparam para o ENEM e vestibulares. Responda em português do Brasil, falando direto com o aluno ("você"), de forma curta, correta e encorajadora. Use g = 10 m/s² quando precisar. Escreva fórmulas em texto simples (ex.: v = λ·f, 3×10^8 m/s), nunca em LaTeX; pode usar **negrito** e listas com "-". Não invente dados que não estejam no enunciado.';
async function initAI(){ const cl=window.claude; if(!cl||typeof cl.use!=='function') return; try{ const s=await cl.use('sample'); if(s){ AI.fn=s; document.documentElement.classList.add('has-ai'); } }catch(e){} }
function aiOff(){ AI.fn=null; document.documentElement.classList.remove('has-ai'); }
function aiErr(e){ const c=e&&e.code;
  if(['not_granted','sampling_disabled','not_declared','capability_disabled','capability_removed'].includes(c)){ aiOff(); return c==='not_granted'?'Sem a sua permissão o tutor fica desligado nesta visita. O resto do site funciona normalmente.':'O tutor com IA não está disponível aqui.'; }
  return ({rate_limited:'Muitas perguntas em pouco tempo. Espere um pouco e tente de novo.',queue_overflow:'Muitas perguntas em pouco tempo. Espere um pouco e tente de novo.',session_expired:'Sua sessão do Claude expirou. Entre de novo para usar o tutor.',refused:'O tutor não respondeu a esse pedido. Tente perguntar de outro jeito.',empty_completion:'O tutor não conseguiu responder. Tente perguntar de outro jeito.',invalid_json:'A questão veio num formato que não consegui ler. Tente criar outra.',prompt_too_large:'A pergunta ficou longa demais. Tente algo mais curto.'})[c]||'Não consegui falar com o tutor agora. Tente de novo em instantes.'; }
/* pergunta ao Claude e mostra a resposta chegando aos poucos dentro de `out` */
async function aiAsk(out,input,o={}){
  if(!AI.fn){ out.innerHTML=`<div class="aibox"><p class="aierr">O tutor com IA não está disponível aqui.</p></div>`; return null; }
  const ctl=new AbortController();
  out.innerHTML=`<div class="aibox" aria-live="polite"><div class="aitxt"><p class="think">${o.wait||'Pensando'}</p></div><div class="aibar"><button class="btn sm ghost" type="button">Parar</button><span class="aitag">Resposta gerada por IA. Confira com a lição.</span></div></div>`;
  const txt=$('.aitxt',out), stop=$('.aibar button',out); stop.onclick=()=>ctl.abort();
  const opts={modelTier:o.tier||'quick',signal:ctl.signal}; if(o.cache===false) opts.cache=false;
  if(!o.json) opts.onText=({text})=>{ txt.innerHTML=md(text); };
  try{ const r=o.json?await AI.fn.json(input,opts):await AI.fn(input,opts); stop.remove(); if(o.json) return r;
    txt.innerHTML=md(r.text)+(r.truncated?'<p class="aitag">(resposta cortada por ser longa)</p>':''); return r.text; }
  catch(e){ stop.remove(); const keep=e&&e.text&&!o.json&&e.code!=='refused'?md(e.text):'';
    txt.innerHTML=keep+(e&&e.code==='cancelled'?'<p class="aitag">Interrompido.</p>':`<p class="aierr">${esc(aiErr(e))}</p>`); return null; } }
function lessonCtx(l){ return `Lição "${plain(l.t)}" (módulo "${l.mod.t}").\n\nTexto da lição:\n${plain(l.idea)}\n\nFórmulas: ${l.f.map(f=>plain(f.f)+(f.n?' — '+plain(f.n):'')).join(' | ')}\n\nPara lembrar: ${(l.keep||[]).map(plain).join(' | ')}`.slice(0,7000); }
const AIPILL='<span class="aipill">IA</span>';

/* ---------- prática ---------- */
function Practice(host,lessons,o={}){
  let cur=null,curL=null,tries=0,lastGen=-1,done=false,ans=[],k=0;
  const needed=3, exam=!!o.exam, maxTries=exam?1:2, total=o.queue?o.queue.length:0;
  o.score=0; o.missed=[];
  function streakHTML(){
    if(exam) return `<div class="streak"><span>Questão ${k} de ${total}</span><span aria-hidden="true">·</span><span>${esc(curL.t)}</span><span aria-hidden="true">·</span><span>${o.score} acerto${o.score===1?'':'s'}</span></div>`;
    if(o.review) return `<div class="streak">Revisão · ${esc(curL.t)}</div>`;
    const x=P.l[curL.id]||{}, st=x.st||0; return `<div class="streak"><span>Acertos seguidos:</span>${[0,1,2].map(i=>`<i class="${i<Math.min(st,needed)?'on':''}"></i>`).join('')}<span>${x.s===2?'lição dominada':'3 seguidos para dominar'}</span></div>`; }
  function next(){
    if(o.queue){ if(!o.queue.length){ host.innerHTML=o.onEmpty?o.onEmpty(o):''; return; } curL=o.queue.shift(); k++; }
    else curL=lessons[0];
    let gi; do{ gi=Math.floor(Math.random()*curL.probs.length); }while(curL.probs.length>1&&gi===lastGen); lastGen=gi;
    cur=curL.probs[gi](); tries=0; done=false; ans=[];
    cur.hint0=cur.hint||(cur.sol&&cur.sol.length>1?cur.sol[0]:'');
    if(cur.o){ const order=shuffle(cur.o.map((_,i)=>i)); cur.opts=order.map(i=>cur.o[i]); cur.ai=order.indexOf(cur.a||0); }
    draw(); }
  function draw(){
    const q=cur, id=host.id;
    host.innerHTML=`<div class="prac">${streakHTML()}<div class="q">${q.q}</div>${q.o
      ?`<div class="opts">${q.opts.map((t,i)=>`<button class="opt" type="button" data-i="${i}"><span class="k">${'ABCDE'[i]}</span><span>${t}</span></button>`).join('')}</div>`
      :`<form class="ans" autocomplete="off"><label class="sr" for="${id}-in">Sua resposta</label><input id="${id}-in" inputmode="decimal" placeholder="sua resposta"><span class="u">${q.u||''}</span><button class="btn" type="submit">Verificar</button>${q.hint0&&!exam?`<button class="btn ghost sm" type="button" data-act="hint">Dica</button>`:''}</form><p class="fmt">Use vírgula ou ponto para decimais. Notação científica: 3e8 ou 3x10^8.</p>`}<div class="fbx"></div></div>`;
    const inp=$('input',host); if(inp&&o.focus!==false) inp.focus({preventScroll:true});
  }
  function solHTML(){ return cur.sol?`<div class="sol"><b>Resolução</b><ol>${cur.sol.map(x=>`<li>${x}</li>`).join('')}</ol></div>`:''; }
  function whyPrompt(){ const q=cur, mc=!!q.o, right=mc?plain(q.o[0]):nt(q.a)+(q.u?' '+q.u:'');
    return TUTOR+`\n\nO aluno está estudando a lição "${plain(curL.t)}" e errou esta questão:\n${plain(q.q)}\n`
      +(mc?`Alternativas: ${q.opts.map((t,i)=>'ABCDE'[i]+') '+plain(t)).join('  ')}\n`:'')
      +`Resposta(s) do aluno, em ordem: ${ans.join(' ; ')}\nResposta correta: ${right}\n`
      +(q.sol?`Resolução do site: ${q.sol.map(plain).join(' → ')}\n`:'')+(q.why?`Comentário do site: ${plain(q.why)}\n`:'')
      +`\nEm no máximo 130 palavras: diga qual raciocínio provavelmente levou à resposta do aluno, onde exatamente está o erro e um jeito de lembrar para não errar de novo. Não repita a resolução inteira.`; }
  function finish(ok,msg){
    done=true; markDay();
    if(exam){ if(ok) o.score++; else o.missed.push(curL); }
    else { const x=ls(curL.id); x.n++; if(ok&&tries===1) x.c++;
      if(o.review){ if(ok&&tries===1){ x.box=Math.min(BOX.length-1,x.box+1); x.due=Date.now()+BOX[x.box]*DAY; } else { x.box=0; x.due=Date.now()+DAY; } }
      else { if(x.s===0) x.s=1; x.st=ok&&tries===1?x.st+1:0; if(x.st>=needed&&x.s!==2){ x.s=2; x.box=0; x.due=Date.now()+BOX[0]*DAY; msg+=`<div class="mastered"><div style="font-size:30px" aria-hidden="true">★</div><div><b>Lição dominada!</b><br><span style="font-size:15px">Ela volta na revisão amanhã, depois em 3, 7, 16 e 35 dias. É assim que o conteúdo passa para a memória de longo prazo.</span></div></div>`; } } }
    save(); o.onChange&&o.onChange();
    const last=o.queue&&!o.queue.length;
    $('.fbx',host).innerHTML=msg+`<div class="row" style="margin-top:12px"><button class="btn" type="button" data-act="next">${last?(exam?'Ver resultado':'Concluir'):'Próxima questão'} →</button>${!ok||tries>1?`<button class="btn ghost ai" type="button" data-act="why">${AIPILL} Por que eu errei?</button>`:''}</div><div class="aiout"></div>`;
    $$('.opt',host).forEach(b=>b.disabled=true); const f=$('form',host); if(f) $$('input,button',f).forEach(b=>b.disabled=true);
    const s=$('.streak',host); if(s) s.outerHTML=streakHTML(); $('[data-act=next]',host).focus({preventScroll:true});
  }
  host.addEventListener('submit',e=>{ e.preventDefault(); if(done) return; const raw=$('input',host).value, v=parseNum(raw), fb=$('.fbx',host);
    if(isNaN(v)){ fb.innerHTML=`<div class="fb info">Digite só o número (a unidade já está indicada ao lado). Exemplo: 12,5</div>`; return; }
    tries++; ans.push(raw.trim()+(cur.u?' '+cur.u:'')); const tol=cur.tol||.02, near=(a,b)=>Math.abs(a-b)<=Math.max(tol*Math.abs(b),1e-9);
    if(near(v,cur.a)) return finish(true,`<div class="fb ok"><b>${tries===1?'Isso!':'Agora sim.'}</b> ${nf(cur.a)} ${cur.u||''}.${tries>1?' Como precisou de uma segunda tentativa, a sequência recomeça.':''}</div>`+solHTML());
    const trap=(cur.traps||[]).find(t=>near(v,t[0]));
    if(tries<maxTries){ fb.innerHTML=`<div class="fb bad"><b>Ainda não.</b> ${trap?trap[1]:(cur.hint||'Confira as unidades e refaça a conta.')} Tente de novo.</div>`; $('input',host).select(); return; }
    finish(false,`<div class="fb bad"><b>A resposta é ${nf(cur.a)} ${cur.u||''}.</b> ${trap?trap[1]:''}</div>`+solHTML()); });
  host.addEventListener('click',e=>{ const b=e.target.closest('button'); if(!b||!host.contains(b)) return;
    if(b.dataset.act==='next') return next();
    if(b.dataset.act==='hint'){ $('.fbx',host).innerHTML=`<div class="fb info hint"><b>Dica:</b> ${cur.hint0}</div>`; return; }
    if(b.dataset.act==='why'){ b.disabled=true; aiAsk($('.aiout',host),whyPrompt()); return; }
    if(b.dataset.i!=null&&!done){ const i=+b.dataset.i; tries++; ans.push('ABCDE'[i]+') '+plain(cur.opts[i])); const ok=i===cur.ai;
      if(ok||tries>=maxTries||cur.opts.length<=2){ $$('.opt',host).forEach((x,j)=>{ if(j===cur.ai) x.classList.add('right'); else if(j===i) x.classList.add('wrong'); });
        return finish(ok,`<div class="fb ${ok?'ok':'bad'}"><b>${ok?(tries===1?'Isso!':'Agora sim.'):'Não é essa.'}</b> ${cur.why||''}</div>`+solHTML()); }
      b.classList.add('wrong'); b.disabled=true; $('.fbx',host).innerHTML=`<div class="fb bad"><b>Ainda não.</b> ${(cur.w&&cur.w[cur.o.indexOf(cur.opts[i])])||'Releia a pergunta e pense no que o laboratório mostrou.'} Tente outra alternativa.</div>`; } });
  next(); return {next}; }

/* questão criada pela IA: treino extra, fora do domínio da lição */
async function genQuestion(l,out,btn){
  btn.disabled=true;
  const r=await aiAsk(out,TUTOR+'\n\n'+lessonCtx(l)+'\n\nCrie UMA questão inédita de múltipla escolha no estilo do ENEM sobre esta lição, com um pequeno contexto do cotidiano, 5 alternativas e só uma correta. Se houver conta, escolha números que deem resultado exato e use g = 10 m/s². Resolva a questão antes de responder e confira que só uma alternativa está certa. Responda só com JSON neste formato: {"enunciado": "...", "alternativas": ["...", "...", "...", "...", "..."], "correta": 0, "explicacao": "resolução em até 90 palavras"}. "correta" é o índice (0 a 4) da alternativa certa; as alternativas não levam letra na frente.',{json:true,tier:'default',cache:false,wait:'Criando a questão. Isso pode levar até um minuto'});
  btn.disabled=false; if(r==null) return;
  const alts=Array.isArray(r.alternativas)?r.alternativas.map(t=>String(t).replace(/^\s*[A-Ea-e][).:-]\s+/,'').trim()):[];
  if(typeof r.enunciado!=='string'||!r.enunciado.trim()||alts.length<3||alts.length>5||alts.some(t=>!t)||!Number.isInteger(r.correta)||r.correta<0||r.correta>=alts.length){ out.innerHTML=`<div class="aibox"><p class="aierr">A questão veio incompleta. Tente criar outra.</p></div>`; return; }
  btn.innerHTML=`${AIPILL} Criar outra questão`;
  out.innerHTML=`<div class="prac aiq"><div class="streak"><span class="aipill">IA</span><span>Questão criada por IA: pode conter erros e não conta para o domínio.</span></div><div class="q">${md(r.enunciado)}</div><div class="opts">${alts.map((t,i)=>`<button class="opt" type="button" data-i="${i}"><span class="k">${'ABCDE'[i]}</span><span>${mdInline(t)}</span></button>`).join('')}</div><div class="fbx"></div></div>`;
  $('.opts',out).addEventListener('click',e=>{ const b=e.target.closest('.opt'); if(!b||b.disabled) return; const i=+b.dataset.i, ok=i===r.correta;
    $$('.opt',out).forEach((x,j)=>{ x.disabled=true; if(j===r.correta) x.classList.add('right'); else if(j===i) x.classList.add('wrong'); });
    $('.fbx',out).innerHTML=`<div class="fb ${ok?'ok':'bad'}"><b>${ok?'Isso!':'A resposta é '+'ABCDE'[r.correta]+'.'}</b></div>${r.explicacao?`<div class="sol"><b>Resolução (da IA)</b>${md(String(r.explicacao))}</div>`:''}`; }); }

/* ---------- telas ---------- */
let SIMNOW=[], SQ='';
const CHN=8;
function disposeSims(){ SIMNOW.forEach(s=>s.dispose()); SIMNOW=[]; if(JCLEAN){ JCLEAN(); JCLEAN=null; } }
function srch(l){ return l.srch||(l.srch=normTxt(l.t+' '+l.mod.t+' '+plain((l.keep||[]).join(' ')))); }
function sidebar(){ const cur=location.hash.slice(1), d=dueList().length;
  return `<a class="brand" href="#"><svg width="34" height="34" viewBox="0 0 34 34" aria-hidden="true"><circle cx="17" cy="17" r="15.5" fill="none" stroke="var(--accent)" stroke-width="2"/><path d="M5 22 Q12 4 17 17 T29 12" fill="none" stroke="var(--ink)" stroke-width="2.2" stroke-linecap="round"/><circle cx="17" cy="17" r="2.6" fill="var(--force)"/></svg><span><b>Física do Zero</b><small>ensino médio, do começo</small></span></a>
  <div class="sidebtns"><a class="btn sm ghost" href="#">Início</a><a class="btn sm ghost" href="#revisao">Revisão${d?` <span class="cnt">${d}</span>`:''}</a><a class="btn sm ghost" href="#formulas">Fórmulas</a></div>
  <div class="sidesearch"><label class="sr" for="sq">Buscar lição</label><input type="search" id="sq" class="search" placeholder="Buscar lição ou assunto" value="${esc(SQ)}" autocomplete="off"></div>
  <nav class="sidenav" aria-label="Lições">${MODS.map((m,mi)=>`<div class="mod"><h4>${mi+1}. ${m.t}</h4>${m.lessons.map(l=>`<a class="lk ${cur===l.id?'on':''}" href="#${l.id}" data-s="${esc(srch(l))}">${statusDot(l.id)}<span>${l.t}</span></a>`).join('')}<a class="lk chal ${cur==='desafio-'+m.id?'on':''}" href="#desafio-${m.id}" data-s="${esc(normTxt('desafio prova '+m.t))}"><span class="star" aria-hidden="true">★</span><span>Desafio do módulo${P.mod[m.id]!=null?` · ${P.mod[m.id]}/${CHN}`:''}</span></a></div>`).join('')}<p class="empty" id="snone" hidden>Nenhuma lição encontrada.</p></nav>
  <p class="syncnote${SYNC.state==='cloud'?' cloud':''}">${syncText()}</p>`; }
function filterSide(){ const q=normTxt(SQ.trim()); let any=false;
  $$('#side .mod').forEach(m=>{ let vis=0; $$('.lk',m).forEach(a=>{ const on=!q||a.dataset.s.includes(q); a.hidden=!on; if(on) vis++; }); m.hidden=!vis; if(vis) any=true; });
  const n=$('#snone'); if(n) n.hidden=any; }
function renderSide(){ $('#side').innerHTML=sidebar(); filterSide(); }

function viewHome(){
  const nx=nextLesson(), m=mastered(), d=dueList().length, started=LES.some(l=>begun(P.l[l.id])||(P.l[l.id]||{}).s>0), sd=streakDays(), nxs=P.l[nx.id]||{}, where=nxs.jd?'falta praticar':nxs.ji>0&&nx.jor?`jornada: passo ${nxs.ji+1} de ${nx.jor.length}`:'';
  return `<div class="wide"><section class="hero"><div><p class="eyebrow">Física do ensino médio · ${LES.length} lições</p><h1>Física do Zero, <span>entendida de verdade</span></h1>
    <p class="lead">Cada lição começa numa situação do dia a dia. Você experimenta no laboratório, mede, monta a fórmula com as próprias mãos e só então pratica, com números sempre novos.</p>
    <div class="row"><a class="btn" href="#${nx.id}">${started?'Continuar':'Começar'}: ${esc(nx.t)}${where?` <small class="btnsub">(${where})</small>`:''} →</a>${d?`<a class="btn ghost" href="#revisao">Revisar ${d} lição${d>1?'ões':''}</a>`:''}</div>
    <div class="stats"><div><b>${m}/${LES.length}</b><span>lições dominadas</span></div><div><b>${d}</b><span>revisões para hoje</span></div><div><b>${sd}</b><span>${sd===1?'dia seguido':'dias seguidos'} estudando</span></div></div>
    <p class="ai aihint">${AIPILL} <span>Tutor com IA ligado: em cada lição você pode pedir outra explicação, perguntar por que errou, tirar dúvidas e criar questões estilo ENEM.</span></p></div>
    <div class="herolab" id="herolab"></div></section>
  <h2 class="sech">Como cada lição funciona</h2>
  <div class="method"><div><h3>1. Veja no dia a dia</h3><p>Cada lição começa numa situação real: o ônibus que freia, a bola chutada, o elevador que sobe.</p></div><div><h3>2. Experimente e meça</h3><p>No laboratório você cumpre desafios, anota medidas e vê o gráfico se formar. O padrão aparece para você.</p></div><div><h3>3. Construa a fórmula</h3><p>Você monta a fórmula passo a passo a partir do que mediu. Ela vira uma conclusão sua, não algo para decorar.</p></div><div><h3>4. Pratique e revise</h3><p>Três acertos seguidos dominam a lição. Depois ela volta em 1, 3, 7, 16 e 35 dias. No fim de cada módulo, um desafio misturado.</p></div></div>
  <h2 class="sech">Mapa do curso</h2>
  <div class="map">${MODS.map((mo,mi)=>{ const k=mo.lessons.filter(l=>(P.l[l.id]||{}).s===2).length, best=P.mod[mo.id]; return `<div class="mapcard"><p class="eyebrow" style="margin:0">Módulo ${mi+1}</p><h3>${mo.t}</h3><div class="bar" aria-label="${k} de ${mo.lessons.length} dominadas"><i style="width:${k/mo.lessons.length*100}%"></i></div>${mo.lessons.map(l=>`<a class="lk" href="#${l.id}">${statusDot(l.id)}<span>${l.t}</span></a>`).join('')}<a class="lk chal" href="#desafio-${mo.id}"><span class="star" aria-hidden="true">★</span><span>Desafio do módulo${best!=null?` · melhor: ${best}/${CHN}`:''}</span></a></div>`; }).join('')}</div>
  <p class="syncnote home${SYNC.state==='cloud'?' cloud':''}">${syncText()}</p></div>`; }

function chipCls(id){ const x=P.l[id]; return isDue(id)?'due':x&&x.s===2?'ok':''; }
function stepsHTML(l){ const x=P.l[l.id]||{};
  return (l.jor?[['jor','Descobrir',!!x.jd,true],['ex','Ver o exemplo',!!x.ex,!!(l.ex||l.exa)],['prac','Dominar',x.s===2,true]]:[['pred','Prever',x.pr!=null,!!l.pred],['lab','Experimentar',!!x.lab,true],['ex','Ver o exemplo',!!x.ex,!!l.ex],['prac','Dominar',x.s===2,true]]).filter(s=>s[3])
    .map(([k,t,d])=>`<li><button type="button" class="${d?'done':''}" data-go="${k}"><span class="ck" aria-hidden="true">${d?'✓':''}</span>${t}${d?'<span class="sr"> (feito)</span>':''}</button></li>`).join(''); }
function updateHead(l){ const s=$('#steps'); if(s) s.innerHTML=stepsHTML(l); const c=$('#lstat'); if(c){ c.textContent=statusText(l.id); c.className='chip '+chipCls(l.id); } }

function viewLesson(l){
  if(l.jor) return viewJourneyLesson(l);
  const mi=MODS.indexOf(l.mod), prev=LES[l.idx-1], next=LES[l.idx+1], endMod=!next||next.mod!==l.mod;
  let n=0; const H=t=>`<h2><span class="n">${String(++n).padStart(2,'0')}</span>${t}</h2>`;
  return `<article class="col"><header class="lhead"><p class="eyebrow">Módulo ${mi+1} · ${esc(l.mod.t)} · Lição ${l.idx+1} de ${LES.length}</p><h1>${l.t}</h1>
    <div class="chips"><span class="chip">${l.min||12} min</span><span class="chip ${chipCls(l.id)}" id="lstat">${statusText(l.id)}</span></div>
    <ol class="steps" id="steps" aria-label="Etapas da lição">${stepsHTML(l)}</ol></header>
  <section class="sec prose">${H('A ideia')}${l.idea}<div class="ai aiask" id="aiidea"><span>Não ficou claro? Peça ao tutor:</span><button class="btn sm ghost" type="button" data-ai="simples">Explique mais simples</button><button class="btn sm ghost" type="button" data-ai="analogia">Dê uma analogia</button><button class="btn sm ghost" type="button" data-ai="fundo">Quero ir mais fundo</button></div><div class="aiout"></div></section>
  ${l.pred?`<section class="sec">${H('Preveja antes de experimentar')}<div class="pred" id="pred"><div class="q">${l.pred.q}</div><div class="opts">${l.pred.o.map((t,i)=>`<button class="opt" type="button" data-p="${i}"><span class="k">${'ABCD'[i]}</span><span>${t}</span></button>`).join('')}</div><div class="pfb"></div></div></section>`:''}
  <section class="sec"><h2 style="font-size:22px;margin-bottom:12px;display:flex;align-items:baseline;gap:10px"><span class="n" style="font-family:var(--mono);font-size:13px;color:var(--accent)">${String(++n).padStart(2,'0')}</span>Laboratório</h2></section>
  <div class="wide" style="margin-top:-22px"><div id="lab"></div></div>
  ${l.tasks?`<section class="sec prose" style="margin-top:14px"><div class="note"><b>Experimente:</b><ul class="tasks">${l.tasks.map(t=>`<li>${t}</li>`).join('')}</ul></div></section>`:''}
  <section class="sec prose">${H('A fórmula')}${l.f.map(f=>formulaCard(f)).join('')}${l.fn?`<div>${l.fn}</div>`:''}</section>
  ${l.ex?`<section class="sec">${H('Exemplo resolvido')}<div class="note ex"><div class="q">${l.ex.q}</div><ol class="st"></ol><div class="row" style="margin-top:12px"><button class="btn sm" type="button" data-ex="1">Mostrar o primeiro passo</button></div></div></section>`:''}
  <section class="sec">${H('Pratique')}<p class="lead2">Os números mudam a cada questão. Tente resolver sem olhar o exemplo; se errar, você ganha uma segunda chance com uma pista sobre o erro.</p><div id="prac"></div>
    <div class="ai aigen"><button class="btn sm ghost" type="button" id="aigen">${AIPILL} Criar uma questão estilo ENEM</button><span class="aitag">Treino extra; não conta para o domínio.</span></div><div id="aiq"></div></section>
  ${l.traps?`<section class="sec prose">${H('Erros comuns')}<ul>${l.traps.map(t=>`<li>${t}</li>`).join('')}</ul></section>`:''}
  ${l.keep?`<section class="sec prose">${H('Para lembrar')}<div class="note"><ul style="margin:0">${l.keep.map(t=>`<li>${t}</li>`).join('')}</ul></div></section>`:''}
  <section class="sec ai" id="chat">${H('Tire sua dúvida')}<p class="lead2">Pergunte ao tutor qualquer coisa sobre esta lição. Ele é o Claude e usa o seu plano; na primeira pergunta, pede a sua permissão.</p>
    <div class="chat"><div class="msgs"></div><div class="row sugg">${['Onde isso aparece no dia a dia?','Como esse assunto cai no ENEM?','Me passe um exercício parecido com o exemplo'].map(t=>`<button class="btn sm ghost" type="button" data-sug>${t}</button>`).join('')}</div>
    <form class="chatf"><label class="sr" for="chatin">Sua pergunta</label><textarea id="chatin" rows="2" placeholder="Ex.: por que a massa não aparece nessa fórmula?"></textarea><button class="btn" type="submit">Perguntar</button></form></div></section>
  <nav class="navrow" aria-label="Navegação entre lições">${prev?`<a class="btn ghost" href="#${prev.id}">← ${esc(prev.t)}</a>`:'<span></span>'}${endMod?`<a class="btn ghost" href="#desafio-${l.mod.id}">★ Desafio do módulo</a>`:''}${next?`<a class="btn" href="#${next.id}">${esc(next.t)} →</a>`:`<a class="btn" href="#">Voltar ao início</a>`}</nav></article>`; }

/* lição no formato jornada: descobrir primeiro, resumo depois */
function viewJourneyLesson(l){
  const mi=MODS.indexOf(l.mod), prev=LES[l.idx-1], next=LES[l.idx+1], endMod=!next||next.mod!==l.mod, x=P.l[l.id]||{};
  let n=0; const H=t=>`<h2><span class="n">${String(++n).padStart(2,'0')}</span>${t}</h2>`;
  return `<article class="col"><header class="lhead"><p class="eyebrow">Módulo ${mi+1} · ${esc(l.mod.t)} · Lição ${l.idx+1} de ${LES.length}</p><h1>${l.t}</h1>
    <div class="chips"><span class="chip">${l.min||12} min</span><span class="chip ${chipCls(l.id)}" id="lstat">${statusText(l.id)}</span></div>
    <ol class="steps" id="steps" aria-label="Etapas da lição">${stepsHTML(l)}</ol></header>
  <section class="sec">${H('Descubra')}<p class="lead2">Nada de decorar: você vai ver a situação, mexer, medir e montar a fórmula. Cada passo libera o próximo.</p><div id="jor"></div></section>
  <section class="sec">${H('Resumo da lição')}<details class="fold" id="resumo"${x.jd?' open':''}><summary>${x.jd?'O que você descobriu':'Abrir o resumo (melhor depois da jornada)'}</summary><div class="prose">${l.idea}${l.f.map(f=>formulaCard(f)).join('')}${l.fn?`<div>${l.fn}</div>`:''}${l.keep?`<div class="note"><b>Para lembrar</b><ul style="margin:6px 0 0">${l.keep.map(t=>`<li>${t}</li>`).join('')}</ul></div>`:''}</div>
    <div class="ai aiask" id="aiidea"><span>Ainda confuso? Peça ao tutor:</span><button class="btn sm ghost" type="button" data-ai="simples">Explique mais simples</button><button class="btn sm ghost" type="button" data-ai="analogia">Dê uma analogia</button><button class="btn sm ghost" type="button" data-ai="fundo">Quero ir mais fundo</button></div><div class="aiout"></div></details></section>
  <section class="sec">${H('Laboratório livre')}<details class="fold" id="livre"><summary>Abrir o laboratório para explorar à vontade</summary><div id="lab"></div>${l.tasks?`<div class="note" style="margin-top:12px"><b>Ideias para testar:</b><ul class="tasks">${l.tasks.map(t=>`<li>${t}</li>`).join('')}</ul></div>`:''}</details></section>
  ${l.exa?`<section class="sec">${H('Exemplo animado')}<p class="lead2">Um problema resolvido acontecendo na tela. Antes de cada conta, tente prever o número.</p><div id="exa"></div></section>`:l.ex?`<section class="sec">${H('Exemplo resolvido')}<div class="note ex"><div class="q">${l.ex.q}</div><ol class="st"></ol><div class="row" style="margin-top:12px"><button class="btn sm" type="button" data-ex="1">Mostrar o primeiro passo</button></div></div></section>`:''}
  <section class="sec">${H('Pratique')}<p class="lead2">Os números mudam a cada questão. Três acertos seguidos de primeira dominam a lição; se errar, você ganha uma pista e uma segunda chance.</p><div id="prac"></div>
    <div class="ai aigen"><button class="btn sm ghost" type="button" id="aigen">${AIPILL} Criar uma questão estilo ENEM</button><span class="aitag">Treino extra; não conta para o domínio.</span></div><div id="aiq"></div></section>
  ${l.traps?`<section class="sec prose">${H('Erros comuns')}<ul>${l.traps.map(t=>`<li>${t}</li>`).join('')}</ul></section>`:''}
  <section class="sec ai" id="chat">${H('Tire sua dúvida')}<p class="lead2">Pergunte ao tutor qualquer coisa sobre esta lição. Ele é o Claude e usa o seu plano; na primeira pergunta, pede a sua permissão.</p>
    <div class="chat"><div class="msgs"></div><div class="row sugg">${['Onde isso aparece no dia a dia?','Como esse assunto cai no ENEM?','Me passe um exercício parecido com o exemplo'].map(t=>`<button class="btn sm ghost" type="button" data-sug>${t}</button>`).join('')}</div>
    <form class="chatf"><label class="sr" for="chatin">Sua pergunta</label><textarea id="chatin" rows="2" placeholder="Ex.: por que a massa não aparece nessa fórmula?"></textarea><button class="btn" type="submit">Perguntar</button></form></div></section>
  <nav class="navrow" aria-label="Navegação entre lições">${prev?`<a class="btn ghost" href="#${prev.id}">← ${esc(prev.t)}</a>`:'<span></span>'}${endMod?`<a class="btn ghost" href="#desafio-${l.mod.id}">★ Desafio do módulo</a>`:''}${next?`<a class="btn" href="#${next.id}">${esc(next.t)} →</a>`:`<a class="btn" href="#">Voltar ao início</a>`}</nav></article>`; }

const IDEA_ASK={simples:'Explique de novo a ideia central desta lição, de um jeito mais simples, para quem está vendo o assunto pela primeira vez. Use um exemplo concreto com números. No máximo 170 palavras.',
  analogia:'Explique a ideia central desta lição com uma analogia do dia a dia de um estudante brasileiro. Depois, em uma frase, diga onde a analogia deixa de funcionar. No máximo 170 palavras.',
  fundo:'Aprofunde esta lição para quem já entendeu o básico: de onde vem a fórmula principal (raciocínio curto) e uma aplicação ou pegadinha que costuma cair no ENEM ou em vestibulares. No máximo 220 palavras.'};
function mountChat(l){ const box=$('#chat'); if(!box) return; const msgs=$('.msgs',box), ta=$('textarea',box), turns=[]; let busy=false;
  const rules=TUTOR+'\n\nVocê está conversando com um aluno que estuda esta lição do site:\n\n'+lessonCtx(l)+'\n\nResponda à pergunta do aluno em no máximo 180 palavras. Se a pergunta fugir de física ou dos estudos, traga a conversa de volta para a lição com gentileza.';
  async function send(q){ q=q.trim(); if(!q||busy) return; busy=true; ta.value='';
    msgs.insertAdjacentHTML('beforeend',`<div class="msg me">${esc(q)}</div><div class="msg bot"></div>`); const out=msgs.lastElementChild;
    turns.push({role:'user',content:q}); while(turns.length>12) turns.splice(0,2);
    const text=await aiAsk(out,[{role:'user',content:rules},...turns],{cache:false});
    if(text) turns.push({role:'assistant',content:text}); else turns.pop(); busy=false; }
  $('form',box).addEventListener('submit',e=>{ e.preventDefault(); send(ta.value); });
  ta.addEventListener('keydown',e=>{ if(e.key==='Enter'&&!e.shiftKey&&!e.isComposing){ e.preventDefault(); send(ta.value); } });
  $$('[data-sug]',box).forEach(b=>b.addEventListener('click',()=>send(b.textContent))); }

function mountLesson(l){
  const x=()=>P.l[l.id]||{}, upd=()=>updateHead(l);
  if(l.jor){ Jornada($('#jor'),l,first=>{ upd(); renderSide(); const d=$('#resumo'); if(d&&first){ d.open=true; $('summary',d).textContent='O que você descobriu'; } });
    const lv=$('#livre'); lv.addEventListener('toggle',()=>{ if(lv.open&&!lv.dataset.m){ lv.dataset.m=1; SIMNOW.push(SIMS[l.lab.sim]($('#lab'),l.lab.cfg||{})); } }); }
  else { SIMNOW.push(SIMS[l.lab.sim]($('#lab'),l.lab.cfg||{}));
    const lab=$('#lab'), touch=()=>{ if(!x().lab){ ls(l.id).lab=1; save(); upd(); } }; ['input','pointerdown','click'].forEach(ev=>lab.addEventListener(ev,touch)); }
  $('#steps').addEventListener('click',e=>{ const b=e.target.closest('[data-go]'); if(!b) return; const el=$({pred:'#pred',lab:'#lab',ex:'.ex, #exa',prac:'#prac',jor:'#jor'}[b.dataset.go]); if(el) el.scrollIntoView({behavior:REDUCED?'auto':'smooth',block:'start'}); });
  const pr=$('#pred'); if(pr){
    const reveal=()=>{ $$('.opt',pr).forEach((b,j)=>{ b.disabled=true; if(j===l.pred.a) b.classList.add('right'); else if(j===x().pr) b.classList.add('wrong'); }); $('.pfb',pr).innerHTML=`<div class="fb ${x().pr===l.pred.a?'ok':'info'}"><b>${x().pr===l.pred.a?'Previsão certa.':'A resposta é '+'ABCD'[l.pred.a]+'.'}</b> ${l.pred.why}</div>`; };
    const pend=()=>{ $$('.opt',pr).forEach((b,j)=>{ b.disabled=true; b.classList.toggle('pick',j===x().pr); }); $('.pfb',pr).innerHTML=`<div class="fb info">Previsão anotada. Agora confira no laboratório abaixo e depois veja a resposta.<div class="row" style="margin-top:8px"><button class="btn sm" type="button" data-rev="1">Ver a resposta</button></div></div>`; };
    if(x().pr!=null) (x().prr?reveal:pend)();
    pr.addEventListener('click',e=>{ const b=e.target.closest('button'); if(!b) return; if(b.dataset.p!=null&&x().pr==null){ ls(l.id).pr=+b.dataset.p; save(); pend(); upd(); } else if(b.dataset.rev){ ls(l.id).prr=1; save(); reveal(); } }); }
  const ex=$('.ex'); if(ex){ let k=0; const ol=$('ol',ex), bt=$('[data-ex]',ex);
    bt.addEventListener('click',()=>{ if(k<l.ex.s.length){ ol.insertAdjacentHTML('beforeend',`<li><span>${l.ex.s[k]}</span></li>`); k++; } bt.textContent=k<l.ex.s.length?'Próximo passo':'Pronto'; if(k>=l.ex.s.length){ bt.disabled=true; if(!x().ex){ ls(l.id).ex=1; save(); upd(); } } }); }
  if(l.exa&&$('#exa')) ExPlayer($('#exa'),l,upd);
  Practice($('#prac'),[l],{onChange:()=>{ renderSide(); upd(); },focus:false});
  const ai=$('#aiidea'); ai.addEventListener('click',e=>{ const b=e.target.closest('[data-ai]'); if(!b) return; const k=b.dataset.ai;
    aiAsk(ai.nextElementSibling,TUTOR+'\n\n'+lessonCtx(l)+'\n\nPedido do aluno: '+IDEA_ASK[k],{tier:k==='fundo'?'default':'quick'}); });
  const gb=$('#aigen'); gb.addEventListener('click',()=>genQuestion(l,$('#aiq'),gb));
  mountChat(l);
}

function viewReview(){ const d=dueList();
  return `<div class="col"><p class="eyebrow">Revisão espaçada</p><h1 class="ptitle">Revisão de hoje</h1>
  <p class="lead2">Uma questão de cada lição que está na hora de relembrar, misturadas. Acertar de primeira empurra a próxima revisão para mais longe; errar traz a lição de volta amanhã.</p>
  ${d.length?`<div class="revlist">${d.map(l=>`<a class="lk" href="#${l.id}">${statusDot(l.id)}<span>${l.t}</span></a>`).join('')}</div><div id="rev"></div>`
   :`<div class="note"><p class="empty" style="margin:0">Nenhuma revisão pendente. ${mastered()?'As lições dominadas voltam aqui quando chegar a hora.':'Domine uma lição (3 acertos seguidos) e ela aparece aqui no dia seguinte.'}</p><div class="row" style="margin-top:12px"><a class="btn" href="#${nextLesson().id}">Ir para: ${esc(nextLesson().t)}</a></div></div>`}</div>`; }

function viewChallenge(m){ const mi=MODS.indexOf(m), best=P.mod[m.id];
  return `<div class="col"><p class="eyebrow">Módulo ${mi+1} · Desafio</p><h1 class="ptitle">${m.t}</h1>
  <p class="lead2">${CHN} questões misturadas de todas as lições do módulo, sem dica e com uma tentativa cada, como numa prova.${best!=null?` Seu melhor resultado até agora: <b>${best}/${CHN}</b>.`:''}</p><div id="chal"></div>
  <nav class="navrow" aria-label="Navegação"><a class="btn ghost" href="#${m.lessons[0].id}">← Lições do módulo</a><a class="btn ghost" href="#">Início</a></nav></div>`; }
function mountChallenge(m){ const q=[]; while(q.length<CHN) q.push(...shuffle(m.lessons)); q.length=CHN;
  const host=$('#chal');
  Practice(host,m.lessons,{exam:true,queue:q,onChange:renderSide,focus:false,onEmpty:o=>{
    const prev=P.mod[m.id], rec=prev==null||o.score>prev; P.mod[m.id]=Math.max(prev||0,o.score); save(); renderSide();
    const miss=[...new Set(o.missed)];
    return `<div class="result"><div class="score"><b>${o.score}</b><span>/${CHN}</span></div><div><h2>${o.score===CHN?'Gabaritou!':o.score>=6?'Muito bom.':o.score>=4?'No caminho certo.':'Hora de rever o módulo.'}</h2><p>${rec&&o.score>0?'Novo recorde neste módulo. ':''}${miss.length?'Vale rever: '+miss.map(l=>`<a href="#${l.id}">${l.t}</a>`).join(', ')+'.':'Você acertou questões de todas as lições.'}</p><div class="row"><button class="btn" type="button" data-act="again">Fazer outro desafio</button><a class="btn ghost" href="#">Início</a></div></div></div>`; }});
  host.addEventListener('click',e=>{ if(e.target.closest('[data-act=again]')) route(); }); }

function viewFormulas(){ return `<div class="col"><p class="eyebrow">Consulta rápida</p><h1 class="ptitle">Formulário</h1><p class="lead2">Todas as fórmulas do curso, na ordem das lições. Digite para filtrar por assunto, grandeza ou símbolo.</p>
  <label class="sr" for="fq">Buscar fórmula</label><input type="search" id="fq" class="search big" placeholder="Ex.: velocidade, calor, lente, pressão" autocomplete="off">
  <div id="flist">${MODS.map((m,mi)=>`<section class="fmod"><h2>${mi+1}. ${m.t}</h2>${m.lessons.map(l=>`<div class="fitem" data-s="${esc(normTxt(l.t+' '+m.t+' '+plain(l.f.map(f=>f.f+' '+(f.s||[]).map(r=>r.join(' ')).join(' ')+' '+(f.n||'')).join(' '))))}"><h3><a href="#${l.id}">${l.t}</a></h3>${l.f.map(f=>formulaCard(f,true)).join('')}</div>`).join('')}</section>`).join('')}</div>
  <p class="empty" id="fnone" hidden>Nenhuma fórmula encontrada. Tente outra palavra.</p></div>`; }
function mountFormulas(){ const inp=$('#fq'); inp.addEventListener('input',()=>{ const q=normTxt(inp.value.trim()); let any=false;
  $$('.fmod').forEach(s=>{ let v=0; $$('.fitem',s).forEach(it=>{ const on=!q||it.dataset.s.includes(q); it.hidden=!on; if(on) v++; }); s.hidden=!v; if(v) any=true; }); $('#fnone').hidden=any; }); }

const own=(o,k)=>Object.prototype.hasOwnProperty.call(o,k);
function route(){
  disposeSims(); const h=location.hash.slice(1), main=$('#main'); let title='Física do Zero';
  const chm=h.startsWith('desafio-')&&MODS.find(m=>'desafio-'+m.id===h);
  if(h==='revisao'){ main.innerHTML=viewReview(); title='Revisão · Física do Zero'; const d=dueList(); if(d.length) Practice($('#rev'),d,{review:true,queue:shuffle(d),onChange:renderSide,onEmpty:()=>`<div class="mastered"><div style="font-size:30px" aria-hidden="true">★</div><div><b>Revisão concluída.</b><br><span style="font-size:15px">Volte amanhã para a próxima rodada.</span></div></div>`}); }
  else if(h==='formulas'){ main.innerHTML=viewFormulas(); mountFormulas(); title='Formulário · Física do Zero'; }
  else if(chm){ main.innerHTML=viewChallenge(chm); mountChallenge(chm); title=`Desafio: ${chm.t} · Física do Zero`; }
  else if(own(LX,h)){ const l=LX[h]; main.innerHTML=viewLesson(l); mountLesson(l); P.last=h; save(); title=`${l.t} · Física do Zero`; }
  else { main.innerHTML=viewHome(); SIMNOW.push(SIMS.proj($('#herolab'),{hero:true})); }
  renderSide(); closeSide(); window.scrollTo(0,0); document.title=title; }
/* quando o progresso da conta chega, atualiza sem atrapalhar quem está no meio de uma questão */
function refreshAfterSync(){ const h=location.hash.slice(1); if(!h) return route(); renderSide(); if(own(LX,h)) updateHead(LX[h]); }
function closeSide(){ $('#side').classList.remove('open'); const sc=$('.scrim'); if(sc) sc.remove(); }
function boot(){
  document.body.insertAdjacentHTML('afterbegin',`<div class="app"><aside class="side" id="side" aria-label="Mapa do curso"></aside><div style="min-width:0"><div class="topbar"><a class="brand" href="#"><b>Física do Zero</b></a><button class="btn sm ghost" type="button" id="menu" aria-controls="side">Lições</button></div><main class="main" id="main"></main></div></div>`);
  $('#menu').addEventListener('click',()=>{ $('#side').classList.add('open'); document.body.insertAdjacentHTML('beforeend','<div class="scrim"></div>'); $('.scrim').addEventListener('click',closeSide); });
  $('#side').addEventListener('input',e=>{ if(e.target.id==='sq'){ SQ=e.target.value; filterSide(); } });
  addEventListener('hashchange',route); route(); initAI(); initSync(); }
