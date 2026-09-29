/* =====================================================================
   Física do Zero — núcleo: estado, rotas, lição, prática e laboratório
   ===================================================================== */
const MODS=[]; const LES=[]; const LX={}; const SIMS={};
function mod(id,t,sub,lessons){ const m={id,t,sub,lessons}; MODS.push(m); lessons.forEach(l=>{ l.mod=m; l.idx=LES.length; LES.push(l); LX[l.id]=l; }); }

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
  if(/^-?\d{1,3}(\.\d{3})+(,\d+)?$/.test(t)) t=t.replace(/\./g,'');
  t=t.replace(',','.').replace(/[x×*·]10\^?\(?(-?\d+)\)?$/i,'e$1').replace(/^10\^\(?(-?\d+)\)?$/,'1e$1');
  return /^-?(\d+\.?\d*|\.\d+)(e-?\d+)?$/i.test(t)?Number(t):NaN; }
const frac=(a,b)=>`<span class="frac"><span>${a}</span><span>${b}</span></span>`;
const esc=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));

/* ---------- progresso (neste navegador) ---------- */
const KEY='fisica_do_zero_v1', DAY=864e5, BOX=[1,3,7,16,35];
let P=(()=>{ try{ return JSON.parse(localStorage.getItem(KEY))||{}; }catch(e){ return {}; } })();
P.l=P.l||{};
function save(){ try{ localStorage.setItem(KEY,JSON.stringify(P)); }catch(e){} }
function ls(id){ return P.l[id]||(P.l[id]={s:0,st:0,n:0,c:0,box:0,due:0}); }
const isDue=id=>{ const x=P.l[id]; return !!x&&x.s===2&&x.due<=Date.now(); };
const dueList=()=>LES.filter(l=>isDue(l.id));
const mastered=()=>LES.filter(l=>(P.l[l.id]||{}).s===2).length;
function statusDot(id){ const x=P.l[id]; return `<span class="dot ${isDue(id)?'due':x&&x.s===2?'s2':x&&x.s===1?'s1':''}" aria-hidden="true"></span>`; }
function statusText(id){ const x=P.l[id]; return isDue(id)?'revisão pendente':x&&x.s===2?'dominada':x&&x.s===1?'em andamento':'não iniciada'; }
function nextLesson(){ return LES.find(l=>(P.l[l.id]||{}).s!==2)||LES[0]; }

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
  arrow(x1,y1,x2,y2,c,label,w=3,lpos){ const dx=x2-x1,dy=y2-y1,L=Math.hypot(dx,dy); if(L<2) return; const ux=dx/L,uy=dy/L,hs=Math.min(11,L*.45);
    ctx.save(); ctx.strokeStyle=c; ctx.fillStyle=c; ctx.lineWidth=w; ctx.lineCap='round'; ctx.beginPath(); ctx.moveTo(x1,y1); ctx.lineTo(x2-ux*hs*.8,y2-uy*hs*.8); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(x2,y2); ctx.lineTo(x2-ux*hs-uy*hs*.55,y2-uy*hs+ux*hs*.55); ctx.lineTo(x2-ux*hs+uy*hs*.55,y2-uy*hs-ux*hs*.55); ctx.closePath(); ctx.fill(); ctx.restore();
    if(label){ const lx=x2+ux*12+(lpos||[0,0])[0], ly=y2+uy*12+(lpos||[0,0])[1]; g.text(label,lx,ly,{c,size:13,bold:true,align:ux<-.3?'right':ux>.3?'left':'center',base:'middle'}); } },
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
  const s={p:{},t:0,playing:false,def}; (def.ctrls||[]).forEach(c=>s.p[c.k]=c.v);
  const ctrlHTML=(def.ctrls||[]).map(c=>c.opts
    ?`<div class="ctrl"><label>${c.l}</label><div class="seg" role="group" aria-label="${c.l}">${c.opts.map(o=>`<button type="button" data-k="${c.k}" data-v="${o[0]}" class="${o[0]===c.v?'on':''}">${o[1]}</button>`).join('')}</div></div>`
    :`<div class="ctrl"><label for="${host.id}-${c.k}"><span>${c.l}</span><output id="${host.id}-${c.k}-o">${fmtC(c,c.v)}</output></label><input type="range" id="${host.id}-${c.k}" data-k="${c.k}" min="${c.min}" max="${c.max}" step="${c.step}" value="${c.v}"></div>`).join('');
  host.innerHTML=`<div class="lab"><div class="labcv"><canvas aria-label="${esc(def.alt||'Simulação')}" role="img"></canvas></div>${def.legend?`<div class="legend">${def.legend.map(([c,t])=>`<span><i style="background:var(--${c})"></i>${t}</span>`).join('')}</div>`:''}<div class="labui${ctrlHTML||def.drag?'':' solo'}">${ctrlHTML||def.drag?`<div class="ctrls">${ctrlHTML||'<p class="eyebrow" style="margin:0">Arraste os elementos no desenho</p>'}</div>`:''}<div class="reads" aria-live="polite"></div></div>${def.anim?`<div class="labbar"><button class="btn sm" type="button" data-act="play">▶ Iniciar</button><button class="btn sm ghost" type="button" data-act="reset">↺ Reiniciar</button>${(def.btns||[]).map((b,i)=>`<button class="btn sm ghost" type="button" data-act="x${i}">${b.l}</button>`).join('')}</div>`:(def.btns?`<div class="labbar">${def.btns.map((b,i)=>`<button class="btn sm ghost" type="button" data-act="x${i}">${b.l}</button>`).join('')}</div>`:'')}</div>`;
  const cv=$('canvas',host), ctx=cv.getContext('2d'), rdEl=$('.reads',host); let lastR='';
  function fmtC(c,v){ return c.f?c.f(v):(nsig(v,4)+(c.u?' '+c.u:'')); }
  function size(){ const w=cv.clientWidth||600; const h=typeof def.h==='function'?def.h(w):(def.h||300); cv.style.height=h+'px'; const d=Math.min(2,window.devicePixelRatio||1); cv.width=Math.round(w*d); cv.height=Math.round(h*d); ctx.setTransform(d,0,0,d,0,0); s.W=w; s.H=h; }
  s.render=()=>{ if(!s.W) return; ctx.clearRect(0,0,s.W,s.H); def.draw(G(ctx,s.W,s.H),s); if(def.reads){ const r=def.reads(s).map(([a,b])=>`<div class="rd"><span>${a}</span><b>${b}</b></div>`).join(''); if(r!==lastR){ rdEl.innerHTML=r; lastR=r; } } };
  s.reset=()=>{ s.t=0; s.playing=false; setPlay(); def.init&&def.init(s); s.render(); };
  let raf=0,last=0;
  function frame(now){ raf=0; const dt=Math.min(.05,(now-last)/1000||0); last=now; if(s.playing){ const k=def.speed||1, n=def.sub||1; for(let i=0;i<n;i++){ def.step(s,dt*k/n); s.t+=dt*k/n; } } s.render(); if(s.playing) raf=requestAnimationFrame(frame); }
  s.play=on=>{ s.playing=on; setPlay(); if(on&&!raf){ last=performance.now(); raf=requestAnimationFrame(frame); } };
  function setPlay(){ const b=$('[data-act=play]',host); if(b) b.textContent=s.playing?'❚❚ Pausar':(s.t>0?'▶ Continuar':'▶ Iniciar'); }
  host.addEventListener('input',e=>{ const k=e.target.dataset.k; if(!k) return; const c=def.ctrls.find(x=>x.k===k); s.p[k]=+e.target.value; $(`#${host.id}-${k}-o`).textContent=fmtC(c,s.p[k]); if(c.live){ def.onParam&&def.onParam(s,k); s.render(); } else s.reset(); });
  host.addEventListener('click',e=>{ const b=e.target.closest('button'); if(!b||!host.contains(b)) return;
    if(b.dataset.k){ const k=b.dataset.k,c=def.ctrls.find(x=>x.k===k); const raw=b.dataset.v; s.p[k]=isNaN(+raw)?raw:+raw; $$(`button[data-k="${k}"]`,host).forEach(x=>x.classList.toggle('on',x===b)); if(c.live){ def.onParam&&def.onParam(s,k); s.render(); } else s.reset(); return; }
    const a=b.dataset.act; if(a==='play'){ if(!s.playing&&def.done&&def.done(s)) s.reset(); s.play(!s.playing); } else if(a==='reset') s.reset(); else if(a&&a[0]==='x'){ def.btns[+a.slice(1)].f(s); s.render(); } });
  if(def.drag){ const pos=e=>{ const r=cv.getBoundingClientRect(); return [e.clientX-r.left,e.clientY-r.top]; }; let dragging=false;
    cv.addEventListener('pointerdown',e=>{ const [x,y]=pos(e); if(def.drag.down(s,x,y)){ dragging=true; cv.setPointerCapture(e.pointerId); s.render(); e.preventDefault(); } });
    cv.addEventListener('pointermove',e=>{ if(!dragging) return; const [x,y]=pos(e); def.drag.move(s,x,y); s.render(); });
    const up=()=>{ if(dragging){ dragging=false; def.drag.up&&def.drag.up(s); s.render(); } }; cv.addEventListener('pointerup',up); cv.addEventListener('pointercancel',up); cv.style.cursor='grab'; }
  new ResizeObserver(()=>{ size(); if(def.onResize) def.onResize(s); s.render(); }).observe(cv);
  size(); def.init&&def.init(s); LIVE.add(s); s.render();
  if(def.anim&&def.autoplay&&!REDUCED) s.play(true);
  s.dispose=()=>{ s.playing=false; LIVE.delete(s); };
  return s; }

/* ---------- blocos de conteúdo ---------- */
function formulaCard(f){ return `<div class="fcard"><div class="fml">${f.f.replace(/ {3,}/g,'<span class="gap"></span>')}</div>${f.s?`<div class="tblw"><table class="sym"><tbody>${f.s.map(r=>`<tr><td>${r[0]}</td><td>${r[1]}</td><td>${r[2]||''}</td></tr>`).join('')}</tbody></table></div>`:''}${f.n?`<p style="margin:10px 0 0;font-size:15px;color:var(--muted)">${f.n}</p>`:''}</div>`; }

/* ---------- prática ---------- */
function Practice(host,lessons,o={}){
  let cur=null,curL=null,tries=0,lastGen=-1,done=false;
  const needed=3;
  function streakHTML(){ if(o.review) return `<div class="streak">Revisão · ${esc(curL.t)}</div>`; const st=ls(curL.id).st; return `<div class="streak"><span>Acertos seguidos:</span>${[0,1,2].map(i=>`<i class="${i<Math.min(st,needed)?'on':''}"></i>`).join('')}<span>${ls(curL.id).s===2?'lição dominada':'3 seguidos para dominar'}</span></div>`; }
  function next(){
    if(o.queue){ if(!o.queue.length){ host.innerHTML=o.onEmpty?o.onEmpty():''; return; } curL=o.queue.shift(); }
    else curL=lessons[0];
    let gi; do{ gi=Math.floor(Math.random()*curL.probs.length); }while(curL.probs.length>1&&gi===lastGen); lastGen=gi;
    cur=curL.probs[gi](); tries=0; done=false;
    if(cur.o){ const order=shuffle(cur.o.map((_,i)=>i)); cur.opts=order.map(i=>cur.o[i]); cur.ai=order.indexOf(cur.a||0); }
    draw(); }
  function draw(){
    const q=cur, id=host.id;
    host.innerHTML=`<div class="prac">${streakHTML()}<div class="q">${q.q}</div>${q.o
      ?`<div class="opts">${q.opts.map((t,i)=>`<button class="opt" type="button" data-i="${i}"><span class="k">${'ABCDE'[i]}</span><span>${t}</span></button>`).join('')}</div>`
      :`<form class="ans" autocomplete="off"><label class="sr" for="${id}-in" style="position:absolute;left:-9999px">Sua resposta</label><input id="${id}-in" inputmode="decimal" placeholder="sua resposta" aria-label="Sua resposta"><span class="u">${q.u||''}</span><button class="btn" type="submit">Verificar</button>${q.hint?`<button class="btn ghost sm" type="button" data-act="hint">Dica</button>`:''}</form><p style="margin:8px 0 0;font-size:13.5px;color:var(--muted)">Use vírgula ou ponto para decimais. Notação científica: 3e8 ou 3x10^8.</p>`}<div class="fbx"></div></div>`;
    const inp=$('input',host); if(inp&&o.focus!==false) inp.focus({preventScroll:true});
  }
  function solHTML(){ return cur.sol?`<div class="sol"><b>Resolução</b><ol>${cur.sol.map(x=>`<li>${x}</li>`).join('')}</ol></div>`:''; }
  function finish(ok,msg){
    done=true; const x=ls(curL.id); x.n++; if(ok&&tries===1) x.c++;
    if(o.review){ if(ok&&tries===1){ x.box=Math.min(BOX.length-1,x.box+1); x.due=Date.now()+BOX[x.box]*DAY; } else { x.box=0; x.due=Date.now()+DAY; } }
    else { if(x.s===0) x.s=1; x.st=ok&&tries===1?x.st+1:0; if(x.st>=needed&&x.s!==2){ x.s=2; x.box=0; x.due=Date.now()+BOX[0]*DAY; msg+=`<div class="mastered"><div style="font-size:30px" aria-hidden="true">★</div><div><b>Lição dominada!</b><br><span style="font-size:15px">Ela volta na revisão amanhã, depois em 3, 7, 16 e 35 dias. É assim que o conteúdo passa para a memória de longo prazo.</span></div></div>`; } }
    save(); o.onChange&&o.onChange();
    $('.fbx',host).innerHTML=msg+`<div class="row" style="margin-top:12px"><button class="btn" type="button" data-act="next">${o.queue&&!o.queue.length?'Concluir':'Próxima questão'} →</button></div>`;
    $$('.opt',host).forEach(b=>b.disabled=true); const f=$('form',host); if(f) $$('input,button',f).forEach(b=>b.disabled=true);
    const s=$('.streak',host); if(s) s.outerHTML=streakHTML(); $('[data-act=next]',host).focus({preventScroll:true});
  }
  host.addEventListener('submit',e=>{ e.preventDefault(); if(done) return; const v=parseNum($('input',host).value); const fb=$('.fbx',host);
    if(isNaN(v)){ fb.innerHTML=`<div class="fb info">Digite só o número (a unidade já está indicada ao lado). Exemplo: 12,5</div>`; return; }
    tries++; const tol=cur.tol||.02, near=(a,b)=>Math.abs(a-b)<=Math.max(tol*Math.abs(b),1e-9);
    if(near(v,cur.a)) return finish(true,`<div class="fb ok"><b>${tries===1?'Isso!':'Agora sim.'}</b> ${nf(cur.a)} ${cur.u||''}.${tries>1?' Como precisou de uma segunda tentativa, a sequência recomeça.':''}</div>`+solHTML());
    const trap=(cur.traps||[]).find(t=>near(v,t[0]));
    if(tries===1){ fb.innerHTML=`<div class="fb bad"><b>Ainda não.</b> ${trap?trap[1]:(cur.hint||'Confira as unidades e refaça a conta.')} Tente de novo.</div>`; $('input',host).select(); return; }
    finish(false,`<div class="fb bad"><b>A resposta é ${nf(cur.a)} ${cur.u||''}.</b> ${trap?trap[1]:''}</div>`+solHTML()); });
  host.addEventListener('click',e=>{ const b=e.target.closest('button'); if(!b) return;
    if(b.dataset.act==='next') return next();
    if(b.dataset.act==='hint'){ $('.fbx',host).innerHTML=`<div class="fb info hint"><b>Dica:</b> ${cur.hint}</div>`; return; }
    if(b.dataset.i!=null&&!done){ const i=+b.dataset.i; tries++; const ok=i===cur.ai;
      if(ok||tries>=2||cur.opts.length<=2){ $$('.opt',host).forEach((x,j)=>{ if(j===cur.ai) x.classList.add('right'); else if(j===i) x.classList.add('wrong'); });
        return finish(ok,`<div class="fb ${ok?'ok':'bad'}"><b>${ok?(tries===1?'Isso!':'Agora sim.'):'Não é essa.'}</b> ${cur.why||''}</div>`+solHTML()); }
      b.classList.add('wrong'); b.disabled=true; $('.fbx',host).innerHTML=`<div class="fb bad"><b>Ainda não.</b> ${(cur.w&&cur.w[cur.o.indexOf(cur.opts[i])])||'Releia a pergunta e pense no que o laboratório mostrou.'} Tente outra alternativa.</div>`; } });
  next(); return {next}; }

/* ---------- telas ---------- */
let SIMNOW=[];
function disposeSims(){ SIMNOW.forEach(s=>s.dispose()); SIMNOW=[]; }
function sidebar(){ const cur=location.hash.slice(1);
  return `<a class="brand" href="#"><svg width="34" height="34" viewBox="0 0 34 34" aria-hidden="true"><circle cx="17" cy="17" r="15.5" fill="none" stroke="var(--accent)" stroke-width="2"/><path d="M5 22 Q12 4 17 17 T29 12" fill="none" stroke="var(--ink)" stroke-width="2.2" stroke-linecap="round"/><circle cx="17" cy="17" r="2.6" fill="var(--force)"/></svg><span><b>Física do Zero</b><small>ensino médio, do começo</small></span></a>
  <div class="sidebtns"><a class="btn sm ghost" href="#">Início</a><a class="btn sm ghost" href="#revisao">Revisão${dueList().length?` (${dueList().length})`:''}</a></div>
  <nav class="sidenav" aria-label="Lições">${MODS.map((m,mi)=>`<div class="mod"><h4>${mi+1}. ${m.t}</h4>${m.lessons.map(l=>`<a class="lk ${cur===l.id?'on':''}" href="#${l.id}">${statusDot(l.id)}<span>${l.t}</span></a>`).join('')}</div>`).join('')}</nav>`; }
function renderSide(){ $('#side').innerHTML=sidebar(); }

function viewHome(){
  const nx=nextLesson(), m=mastered(), d=dueList().length, started=LES.some(l=>(P.l[l.id]||{}).s>0);
  return `<div class="wide"><section class="hero"><div><p class="eyebrow">Física do ensino médio · ${LES.length} lições</p><h1>Física do Zero, <span>entendida de verdade</span></h1>
    <p class="lead">Cada ideia aparece primeiro num experimento que você controla, depois na fórmula e por fim em exercícios com números sempre novos, até você acertar sozinho.</p>
    <div class="row"><a class="btn" href="#${nx.id}">${started?'Continuar':'Começar'}: ${esc(nx.t)} →</a>${d?`<a class="btn ghost" href="#revisao">Revisar ${d} lição${d>1?'ões':''}</a>`:''}</div>
    <div class="stats"><div><b>${m}/${LES.length}</b><span>lições dominadas</span></div><div><b>${d}</b><span>revisões para hoje</span></div><div><b>${MODS.length}</b><span>módulos</span></div></div></div>
    <div class="herolab" id="herolab"></div></section>
  <h2 class="sech">Como cada lição funciona</h2>
  <div class="method"><div><h3>1. Preveja</h3><p>Antes de ver a resposta, você aposta no que vai acontecer. Errar a previsão faz o cérebro prestar atenção.</p></div><div><h3>2. Experimente</h3><p>No laboratório, você muda os valores e vê o efeito na hora, com vetores e gráficos.</p></div><div><h3>3. Entenda</h3><p>A fórmula aparece com cada símbolo explicado e um exemplo resolvido passo a passo.</p></div><div><h3>4. Pratique e revise</h3><p>Três acertos seguidos dominam a lição. Depois ela volta em 1, 3, 7, 16 e 35 dias.</p></div></div>
  <h2 class="sech">Mapa do curso</h2>
  <div class="map">${MODS.map((mo,mi)=>{ const k=mo.lessons.filter(l=>(P.l[l.id]||{}).s===2).length; return `<div class="mapcard"><p class="eyebrow" style="margin:0">Módulo ${mi+1}</p><h3>${mo.t}</h3><div class="bar" aria-label="${k} de ${mo.lessons.length} dominadas"><i style="width:${k/mo.lessons.length*100}%"></i></div>${mo.lessons.map(l=>`<a class="lk" href="#${l.id}">${statusDot(l.id)}<span>${l.t}</span></a>`).join('')}</div>`; }).join('')}</div>
  <p style="color:var(--muted);font-size:14px;margin-top:26px">Seu progresso fica salvo neste navegador.</p></div>`; }

function viewLesson(l){
  const mi=MODS.indexOf(l.mod), x=P.l[l.id], prev=LES[l.idx-1], next=LES[l.idx+1];
  let n=0; const H=t=>`<h2><span class="n">${String(++n).padStart(2,'0')}</span>${t}</h2>`;
  return `<article class="col"><header class="lhead"><p class="eyebrow">Módulo ${mi+1} · ${esc(l.mod.t)} · Lição ${l.idx+1}</p><h1>${l.t}</h1>
    <div class="chips"><span class="chip">${l.min||12} min</span><span class="chip ${isDue(l.id)?'due':x&&x.s===2?'ok':''}">${statusText(l.id)}</span></div></header>
  <section class="sec prose">${H('A ideia')}${l.idea}</section>
  ${l.pred?`<section class="sec">${H('Preveja antes de experimentar')}<div class="pred" id="pred"><div class="q">${l.pred.q}</div><div class="opts">${l.pred.o.map((t,i)=>`<button class="opt" type="button" data-p="${i}"><span class="k">${'ABCD'[i]}</span><span>${t}</span></button>`).join('')}</div><div class="pfb"></div></div></section>`:''}
  <section class="sec"><h2 style="font-size:22px;margin-bottom:12px;display:flex;align-items:baseline;gap:10px"><span class="n" style="font-family:var(--mono);font-size:13px;color:var(--accent)">${String(++n).padStart(2,'0')}</span>Laboratório</h2></section>
  <div class="wide" style="margin-top:-22px"><div id="lab"></div></div>
  ${l.tasks?`<section class="sec prose" style="margin-top:14px"><div class="note"><b>Experimente:</b><ul class="tasks">${l.tasks.map(t=>`<li>${t}</li>`).join('')}</ul></div></section>`:''}
  <section class="sec prose">${H('A fórmula')}${l.f.map(formulaCard).join('')}${l.fn?`<div>${l.fn}</div>`:''}</section>
  ${l.ex?`<section class="sec">${H('Exemplo resolvido')}<div class="note ex"><div class="q">${l.ex.q}</div><ol class="st"></ol><div class="row" style="margin-top:12px"><button class="btn sm" type="button" data-ex="1">Mostrar o primeiro passo</button></div></div></section>`:''}
  <section class="sec">${H('Pratique')}<p style="margin:0 0 12px;color:var(--muted);font-size:15.5px">Os números mudam a cada questão. Tente resolver sem olhar o exemplo; se errar, você ganha uma segunda chance com uma pista sobre o erro.</p><div id="prac"></div></section>
  ${l.traps?`<section class="sec prose">${H('Erros comuns')}<ul>${l.traps.map(t=>`<li>${t}</li>`).join('')}</ul></section>`:''}
  ${l.keep?`<section class="sec prose">${H('Para lembrar')}<div class="note"><ul style="margin:0">${l.keep.map(t=>`<li>${t}</li>`).join('')}</ul></div></section>`:''}
  <nav class="navrow" aria-label="Navegação entre lições">${prev?`<a class="btn ghost" href="#${prev.id}">← ${esc(prev.t)}</a>`:'<span></span>'}${next?`<a class="btn" href="#${next.id}">${esc(next.t)} →</a>`:`<a class="btn" href="#">Voltar ao início</a>`}</nav></article>`; }

function mountLesson(l){
  SIMNOW.push(SIMS[l.lab.sim]($('#lab'),l.lab.cfg||{}));
  const pr=$('#pred'); if(pr){ const x=ls(l.id);
    const reveal=()=>{ $$('.opt',pr).forEach((b,j)=>{ b.disabled=true; if(j===l.pred.a) b.classList.add('right'); else if(j===x.pr) b.classList.add('wrong'); }); $('.pfb',pr).innerHTML=`<div class="fb ${x.pr===l.pred.a?'ok':'info'}"><b>${x.pr===l.pred.a?'Previsão certa.':'A resposta é '+'ABCD'[l.pred.a]+'.'}</b> ${l.pred.why}</div>`; };
    const pend=()=>{ $$('.opt',pr).forEach((b,j)=>{ b.disabled=true; b.classList.toggle('pick',j===x.pr); }); $('.pfb',pr).innerHTML=`<div class="fb info">Previsão anotada. Agora confira no laboratório abaixo e depois veja a resposta.<div class="row" style="margin-top:8px"><button class="btn sm" type="button" data-rev="1">Ver a resposta</button></div></div>`; };
    if(x.pr!=null) (x.prr?reveal:pend)();
    pr.addEventListener('click',e=>{ const b=e.target.closest('button'); if(!b) return; if(b.dataset.p!=null&&x.pr==null){ x.pr=+b.dataset.p; save(); pend(); } else if(b.dataset.rev){ x.prr=1; save(); reveal(); } }); }
  const ex=$('.ex'); if(ex){ let k=0; const ol=$('ol',ex), bt=$('[data-ex]',ex);
    bt.addEventListener('click',()=>{ if(k<l.ex.s.length){ ol.insertAdjacentHTML('beforeend',`<li><span>${l.ex.s[k]}</span></li>`); k++; } bt.textContent=k<l.ex.s.length?'Próximo passo':'Pronto'; if(k>=l.ex.s.length) bt.disabled=true; }); }
  Practice($('#prac'),[l],{onChange:renderSide,focus:false});
}

function viewReview(){ const d=dueList();
  return `<div class="col"><p class="eyebrow">Revisão espaçada</p><h1 style="font-size:40px;margin:6px 0 10px">Revisão de hoje</h1>
  <p style="color:var(--muted)">Uma questão de cada lição que está na hora de relembrar, misturadas. Acertar de primeira empurra a próxima revisão para mais longe; errar traz a lição de volta amanhã.</p>
  ${d.length?`<div class="revlist">${d.map(l=>`<a class="lk" href="#${l.id}">${statusDot(l.id)}<span>${l.t}</span></a>`).join('')}</div><div id="rev"></div>`
   :`<div class="note"><p class="empty" style="margin:0">Nenhuma revisão pendente. ${mastered()?'As lições dominadas voltam aqui quando chegar a hora.':'Domine uma lição (3 acertos seguidos) e ela aparece aqui no dia seguinte.'}</p><div class="row" style="margin-top:12px"><a class="btn" href="#${nextLesson().id}">Ir para: ${esc(nextLesson().t)}</a></div></div>`}</div>`; }

function route(){
  disposeSims(); const h=location.hash.slice(1), main=$('#main');
  if(h==='revisao'){ main.innerHTML=viewReview(); const d=dueList(); if(d.length) Practice($('#rev'),d,{review:true,queue:shuffle(d),onChange:renderSide,onEmpty:()=>`<div class="mastered"><div style="font-size:30px" aria-hidden="true">★</div><div><b>Revisão concluída.</b><br><span style="font-size:15px">Volte amanhã para a próxima rodada.</span></div></div>`}); }
  else if(LX[h]){ const l=LX[h]; main.innerHTML=viewLesson(l); mountLesson(l); P.last=h; save(); }
  else { main.innerHTML=viewHome(); SIMNOW.push(SIMS.proj($('#herolab'),{hero:true})); }
  renderSide(); closeSide(); window.scrollTo(0,0); document.title=LX[h]?`${LX[h].t} · Física do Zero`:'Física do Zero'; }
function closeSide(){ $('#side').classList.remove('open'); const sc=$('.scrim'); if(sc) sc.remove(); }
function boot(){
  document.body.insertAdjacentHTML('afterbegin',`<div class="app"><aside class="side" id="side" aria-label="Mapa do curso"></aside><div style="min-width:0"><div class="topbar"><a class="brand" href="#"><b>Física do Zero</b></a><button class="btn sm ghost" type="button" id="menu" aria-controls="side">Lições</button></div><main class="main" id="main"></main></div></div>`);
  $('#menu').addEventListener('click',()=>{ $('#side').classList.add('open'); document.body.insertAdjacentHTML('beforeend','<div class="scrim"></div>'); $('.scrim').addEventListener('click',closeSide); });
  addEventListener('hashchange',route); route(); }
