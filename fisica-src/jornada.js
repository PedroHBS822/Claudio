/* =====================================================================
   Jornada de descoberta: a lição vira uma sequência de telas curtas.
   O aluno parte de uma situação do dia a dia, mexe no laboratório até
   cumprir um desafio, mede, percebe o padrão e monta a fórmula sozinho.

   Tipos de passo (l.jor = [...]):
   cena    {p}                         situação do dia a dia
   nota    {h,p}                       explicação curta
   q       {q,o,a:0,why,w}             pergunta de raciocínio (a 1ª opção é a certa)
   n       {q,a,u,tol,why,dica}        conta rápida
   lab     {p,sim,cfg,goal(s),ok,dica} desafio: libera quando goal(s) for verdadeiro
   medir   {p,sim,cfg,rec(s),cols,need,depois:{q...}}  anotar medidas, ver o gráfico
   deduz   {p,linhas:[{txt:'… ___ …',o,why}],fim}      montar a fórmula
   ordem   {q,itens,why}               tocar os itens na ordem certa
   mundo   {h,itens:[[título,texto]]}  onde isso aparece na sua volta
   ===================================================================== */
const JTAG={aposta:'Aposte',cena:'Situação',nota:'Entenda',q:'Pense',n:'Faça a conta',lab:'Desafio no laboratório',medir:'Meça e descubra',deduz:'Construa a fórmula',ordem:'Coloque em ordem',mundo:'Na sua volta'};
let JCLEAN=null, JORCTX=null;
function jPlot(host,rows,cols){
  host.innerHTML='<canvas role="img" aria-label="Gráfico das suas medidas"></canvas>'; const cv=$('canvas',host), w=cv.clientWidth||host.clientWidth||480, h=230, d=Math.min(2,window.devicePixelRatio||1);
  cv.style.height=h+'px'; cv.width=Math.round(w*d); cv.height=Math.round(h*d); const ctx=cv.getContext('2d'); ctx.setTransform(d,0,0,d,0,0); const g=G(ctx,w,h);
  const xs=rows.map(r=>r[0]), ys=rows.map(r=>r[1]), xr=[Math.min(0,...xs),Math.max(...xs,0)*1.12||1], yr=[Math.min(0,...ys),Math.max(...ys,0)*1.15||1];
  const r=g.plot(52,18,w-72,h-66,{xr,yr,series:[],xl:cols[0],yl:cols[1]});
  const srt=rows.slice().sort((a,b)=>a[0]-b[0]); if(srt.length>1) g.poly([[r.X(0),r.Y(0)],...srt.map(p=>[r.X(p[0]),r.Y(p[1])])].slice(srt[0][0]===0?1:0),COL.muted,1.5);
  srt.forEach(p=>g.circle(r.X(p[0]),r.Y(p[1]),6,COL.force,COL.card,1.5)); }

/* cada tipo de passo desenha o corpo e chama done() quando o aluno cumpriu */
const JSTEP={
  cena(b,st,done){ b.innerHTML=`<div class="jtext">${st.p}</div>`; done(); },
  nota(b,st,done){ b.innerHTML=`<div class="jtext">${st.p}</div>`; done(); },
  mundo(b,st,done){ b.innerHTML=`${st.p?`<div class="jtext">${st.p}</div>`:''}<div class="jworld">${st.itens.map(([t,d])=>`<div><b>${t}</b><p>${d}</p></div>`).join('')}</div>`; done(); },
  q(b,st,done){ const order=shuffle(st.o.map((_,i)=>i)); let tries=0, over=false;
    b.innerHTML=`<div class="jtext">${st.q}</div><div class="opts">${order.map((k,j)=>`<button class="opt" type="button" data-k="${k}"><span class="k">${'ABCDE'[j]}</span><span>${st.o[k]}</span></button>`).join('')}</div><div class="jfb" aria-live="polite"></div>`;
    b.addEventListener('click',e=>{ const t=e.target.closest('.opt'); if(!t||over||t.disabled) return; const k=+t.dataset.k; tries++;
      if(k===0){ over=true; t.classList.add('right'); $$('.opt',b).forEach(x=>x.disabled=true); $('.jfb',b).innerHTML=`<div class="fb ok"><b>${tries===1?'Isso!':'Agora sim.'}</b> ${st.why||''}</div>`; done(); return; }
      t.classList.add('wrong'); t.disabled=true;
      if(tries>=2){ over=true; $$('.opt',b).forEach(x=>{ x.disabled=true; if(+x.dataset.k===0) x.classList.add('right'); }); $('.jfb',b).innerHTML=`<div class="fb info"><b>A certa é a destacada em verde.</b> ${st.why||''}</div>`; done(); }
      else $('.jfb',b).innerHTML=`<div class="fb bad"><b>Ainda não.</b> ${(st.w&&st.w[k-1])||'Pense de novo no que você viu até aqui.'}</div>`; }); },
  aposta(b,st,done){ b.innerHTML=`<div class="jtext">${st.q}</div><div class="opts">${st.o.map((t,j)=>`<button class="opt" type="button" data-k="${j}"><span class="k">${'ABCDE'[j]}</span><span>${t}</span></button>`).join('')}</div><div class="jfb" aria-live="polite"></div>`;
    b.addEventListener('click',e=>{ const t=e.target.closest('.opt'); if(!t||t.disabled) return; $$('.opt',b).forEach(x=>{ x.disabled=true; x.classList.toggle('pick',x===t); }); $('.jfb',b).innerHTML=`<div class="fb info"><b>Aposta anotada.</b> ${st.depois||'Continue para conferir no laboratório.'}</div>`; done(); }); },
  n(b,st,done){ let tries=0, over=false;
    b.innerHTML=`<div class="jtext">${st.q}</div><form class="ans" autocomplete="off"><input inputmode="decimal" placeholder="sua resposta" aria-label="Sua resposta"><span class="u">${st.u||''}</span><button class="btn" type="submit">Verificar</button></form><div class="jfb" aria-live="polite"></div>`;
    $('form',b).addEventListener('submit',e=>{ e.preventDefault(); if(over) return; const v=parseNum($('input',b).value); if(isNaN(v)){ $('.jfb',b).innerHTML='<div class="fb info">Digite só o número. Exemplo: 12,5</div>'; return; }
      tries++; const tol=st.tol||.02, ok=Math.abs(v-st.a)<=Math.max(tol*Math.abs(st.a),1e-9);
      if(ok||tries>=2){ over=true; $$('input,button',b).forEach(x=>x.disabled=true); $('.jfb',b).innerHTML=`<div class="fb ${ok?'ok':'info'}"><b>${ok?'Isso!':'A resposta é '+nf(st.a)+' '+(st.u||'')+'.'}</b> ${st.why||''}</div>`; done(); }
      else $('.jfb',b).innerHTML=`<div class="fb bad"><b>Ainda não.</b> ${st.dica||'Refaça a conta com calma.'}</div>`; }); },
  lab(b,st,done,ctx){ b.innerHTML=`<div class="jtext">${st.p}</div><div class="jlab" id="jl${ctx.i}"></div><div class="jgoal"><span class="gi" aria-hidden="true"></span><span class="gt">Desafio em aberto</span><button class="btn sm ghost" type="button" data-hint>Preciso de uma dica</button></div><div class="jfb" aria-live="polite"></div>`;
    const s=SIMS[st.sim]($(`#jl${ctx.i}`),st.cfg||{}); ctx.sims.push(s); let hints=0;
    const win=()=>{ clearInterval(ctx.timer); const gl=$('.jgoal',b); gl.classList.add('won'); $('.gt',gl).textContent='Desafio cumprido'; $('[data-hint]',gl)?.remove(); $('.jfb',b).innerHTML=`<div class="fb ok"><b>Conseguiu!</b> ${st.ok||''}</div>`; done(); };
    ctx.timer=setInterval(()=>{ try{ if(st.goal(s)) win(); }catch(e){} },250);
    $('[data-hint]',b).addEventListener('click',e=>{ hints++; if(hints===1){ $('.jfb',b).innerHTML=`<div class="fb info hint"><b>Dica:</b> ${st.dica||'Mexa nos controles e observe o que muda.'}</div>`; e.target.textContent='Pular este desafio'; } else { $('.jfb',b).innerHTML=`<div class="fb info">${st.ok||''}</div>`; clearInterval(ctx.timer); done(); } }); },
  medir(b,st,done,ctx){ const rows=[]; b.innerHTML=`<div class="jtext">${st.p}</div><div class="jlab" id="jl${ctx.i}"></div><div class="jrec"><button class="btn" type="button" data-rec>Anotar medida</button><span class="jneed">0 de ${st.need} medidas</span></div><div class="jfb" aria-live="polite"></div>
    <div class="tblw"><table class="jtab"><thead><tr>${st.cols.map(c=>`<th>${c}</th>`).join('')}</tr></thead><tbody></tbody></table></div><div class="jplot"></div><div class="jafter"></div>`;
    const s=SIMS[st.sim]($(`#jl${ctx.i}`),st.cfg||{}); ctx.sims.push(s);
    $('[data-rec]',b).addEventListener('click',()=>{ const fb=$('.jfb',b); let r=null; try{ r=st.rec(s); }catch(e){}
      if(!r){ fb.innerHTML=`<div class="fb info">${st.recMsg||'Ainda não dá para anotar: faça o experimento primeiro.'}</div>`; return; }
      r=r.map(v=>+(+v).toFixed(st.dec??2)); if(rows.some(x=>x.every((v,j)=>v===r[j]))){ fb.innerHTML='<div class="fb info">Essa medida você já anotou. Mude alguma coisa e anote outra.</div>'; return; }
      fb.innerHTML=''; rows.push(r); $('tbody',b).insertAdjacentHTML('beforeend',`<tr>${r.map(v=>`<td>${nsig(v,4)}</td>`).join('')}</tr>`); $('.jneed',b).textContent=`${rows.length} de ${st.need} medidas`;
      if(rows.length===st.need){ $('[data-rec]',b).disabled=true; if(st.plot!==false) jPlot($('.jplot',b),rows.map(r=>[r[st.px||0],r[st.py??1]]),[st.cols[st.px||0],st.cols[st.py??1]]);
        const a=document.createElement('div'); $('.jafter',b).append(a); JSTEP.q(a,st.depois,done); } }); },
  deduz(b,st,done){ let k=0; b.innerHTML=`${st.p?`<div class="jtext">${st.p}</div>`:''}<ol class="jder"></ol><div class="jfim"></div>`; const ol=$('.jder',b);
    const line=()=>{ const L=st.linhas[k], order=shuffle(L.o.map((_,i)=>i));
      ol.insertAdjacentHTML('beforeend',`<li><div class="jl">${L.txt.replace('___','<span class="blank">?</span>')}</div><div class="jopts">${order.map(i=>`<button class="btn sm ghost" type="button" data-i="${i}">${L.o[i]}</button>`).join('')}</div><div class="jwhy"></div></li>`);
      const li=ol.lastElementChild;
      li.addEventListener('click',e=>{ const t=e.target.closest('[data-i]'); if(!t||t.disabled) return;
        if(+t.dataset.i===0){ $('.blank',li).outerHTML=`<span class="filled">${L.o[0]}</span>`; $('.jopts',li).remove(); $('.jwhy',li).innerHTML=L.why?`<span>${L.why}</span>`:''; k++;
          if(k<st.linhas.length) line(); else { if(st.fim) $('.jfim',b).innerHTML=`<div class="jresult"><p class="jtag">Você chegou em</p><div class="fml">${st.fim.replace(/ {3,}/g,'<span class="gap"></span>')}</div></div>`; done(); } }
        else { t.classList.add('no'); t.disabled=true; $('.jwhy',li).innerHTML=`<span class="bad">${(L.w&&L.w[+t.dataset.i-1])||'Não encaixa. Tente outra.'}</span>`; } }); };
    line(); },
  ordem(b,st,done){ let k=0; const order=shuffle(st.itens.map((_,i)=>i));
    b.innerHTML=`<div class="jtext">${st.q}</div><ol class="jord"></ol><div class="jpool">${order.map(i=>`<button class="opt" type="button" data-i="${i}"><span>${st.itens[i]}</span></button>`).join('')}</div><div class="jfb" aria-live="polite"></div>`;
    b.addEventListener('click',e=>{ const t=e.target.closest('.jpool .opt'); if(!t) return; const i=+t.dataset.i;
      if(i===k){ $('.jord',b).insertAdjacentHTML('beforeend',`<li>${st.itens[i]}</li>`); t.remove(); k++; $('.jfb',b).innerHTML='';
        if(k===st.itens.length){ $('.jfb',b).innerHTML=`<div class="fb ok"><b>Isso!</b> ${st.why||''}</div>`; done(); } }
      else { t.classList.add('shake'); setTimeout(()=>t.classList.remove('shake'),400); $('.jfb',b).innerHTML='<div class="fb bad">Esse não vem agora. Qual acontece antes?</div>'; } }); }
};

function Jornada(host,l,onDone){
  const J=l.jor, st0=P.l[l.id]||{}; let reached=st0.jd?J.length:Math.min(st0.ji||0,J.length-1), i=st0.jd?0:reached, ctx=null;
  function clean(){ if(!ctx) return; clearInterval(ctx.timer); ctx.sims.forEach(s=>s.dispose()); ctx=null; }
  JCLEAN=clean;
  function render(scroll){ clean(); const st=J[i]; ctx={i,sims:[],timer:0}; JORCTX=ctx;
    host.innerHTML=`<div class="jor"><div class="jbar"><div class="jdots">${J.map((s,k)=>`<button type="button" class="jd${k<reached?' done':''}${k===i?' on':''}" data-go="${k}" ${k>reached?'disabled':''} aria-label="Passo ${k+1}: ${JTAG[s.t]}"></button>`).join('')}</div><span class="jcount">${i+1} de ${J.length}</span></div>
      <div class="jcard jt-${st.t}"><p class="jtag">${JTAG[st.t]}</p>${st.h?`<h3>${st.h}</h3>`:''}<div class="jbody"></div></div>
      <div class="jnav"><button class="btn ghost" type="button" data-nav="back" ${i?'':'disabled'}>← Voltar</button><button class="btn sm ghost ai" type="button" data-nav="ai">${AIPILL} Não entendi</button><button class="btn" type="button" data-nav="next" disabled>${i===J.length-1?'Concluir':'Continuar'} →</button></div><div class="aiout"></div></div>`;
    JSTEP[st.t]($('.jbody',host),st,()=>{ const nb=$('[data-nav=next]',host); if(nb) nb.disabled=false; },ctx);
    if(i<reached) $('[data-nav=next]',host).disabled=false;
    if(scroll) host.scrollIntoView({behavior:REDUCED?'auto':'smooth',block:'start'}); }
  function finish(scroll){ clean(); const x=ls(l.id); const first=!x.jd; if(first){ x.jd=1; x.ji=J.length; save(); } onDone&&onDone(first);
    host.innerHTML=`<div class="jor"><div class="jcard jend"><div class="jstar" aria-hidden="true">★</div><h3>Você descobriu a física desta lição.</h3><p>Agora confira o resumo, veja um exemplo resolvido e pratique até dominar.</p><div class="row"><button class="btn" type="button" data-to="prac">Praticar agora</button><button class="btn ghost" type="button" data-to="resumo">Ver o resumo</button><button class="btn ghost" type="button" data-again>Refazer a jornada</button></div></div></div>`;
    if(scroll) host.scrollIntoView({behavior:REDUCED?'auto':'smooth',block:'start'}); }
  host.addEventListener('click',e=>{ const t=e.target.closest('button'); if(!t||!host.contains(t)) return;
    if(t.dataset.go!=null&&!t.disabled){ i=+t.dataset.go; render(true); }
    else if(t.dataset.nav==='back'&&i>0){ i--; render(true); }
    else if(t.dataset.nav==='next'){ if(i+1>reached&&i<J.length-1){ reached=i+1; const x=ls(l.id); x.ji=Math.max(x.ji||0,reached); save(); } if(i===J.length-1) finish(true); else { i++; render(true); } }
    else if(t.dataset.nav==='ai'){ t.disabled=true; const st=J[i]; aiAsk($('.aiout',host),TUTOR+'\n\n'+lessonCtx(l)+`\n\nO aluno está num passo da atividade guiada desta lição e não entendeu. Conteúdo do passo:\n${plain([st.h,st.p,st.q,(st.linhas||[]).map(x=>x.txt).join(' / ')].filter(Boolean).join('\n'))}\n\nExplique esse passo de outro jeito, com um exemplo do dia a dia, em no máximo 120 palavras. Se houver uma pergunta ou desafio, dê uma pista, mas não entregue a resposta.`); }
    else if(t.dataset.to){ const el=$(t.dataset.to==='prac'?'#prac':'#resumo'); if(el){ if(el.tagName==='DETAILS') el.open=true; el.scrollIntoView({behavior:REDUCED?'auto':'smooth',block:'start'}); } }
    else if(t.dataset.again!=null){ i=0; render(true); } });
  if(st0.jd) finish(false); else render(false); }
