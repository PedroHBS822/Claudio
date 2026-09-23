
/* =====================================================================
   Preparação FUVEST — banco de questões, simulados, diagnóstico e
   "montar resolução" (compartilhado por MatLingo e FisLingo)
   ===================================================================== */
const LETTERS='ABCDE';
const FUV_BANK=(typeof FUVQ!=='undefined'?FUVQ:[]).map(q=>Object.assign({origin:'bank',set:'Banco original (estilo FUVEST)',src:'Estilo FUVEST'},q,{tags:(q.tags||[]).filter(t=>SK[t])}));
function fv(){ const d={stats:{},hist:[],wrong:[],imp:[],seen:{}}; if(!S.fuv) S.fuv=d; for(const k in d) if(S.fuv[k]==null) S.fuv[k]=d[k]; return S.fuv; }
function fuvAll(){ return FUV_BANK.concat(fv().imp); }
function fuvById(id){ return fuvAll().find(q=>q.id===id); }
const fuvText=q=>q.origin==='bank'?q.q:esc(q.q).replace(/\n/g,'<br>');
const fuvAlt=(q,i)=>q.origin==='bank'?q.alts[i]:esc(q.alts[i]);
const fuvStep=(q,s)=>q.origin==='bank'?s:esc(s);

/* ---------- Tela principal ---------- */
function renderFuvest(){
  const F=fv(),all=fuvAll(),nb=FUV_BANK.length,ni=F.imp.length,nbuild=all.filter(q=>q.steps&&q.steps.length>=2).length,nw=F.wrong.filter(id=>fuvById(id)).length;
  const sets={}; all.forEach(q=>{ sets[q.set]=(sets[q.set]||0)+1; });
  const topics=Object.entries(F.stats).filter(([id])=>SK[id]).map(([id,[c,w]])=>({id,c,w,acc:c/(c+w)})).filter(t=>t.c+t.w>0).sort((a,b)=>a.acc-b.acc||b.w-a.w);
  const tagCount={}; all.forEach(q=>q.tags.forEach(t=>tagCount[t]=(tagCount[t]||0)+1));
  let h=`<h2 class="section-title">🎓 Preparação FUVEST</h2>
  <div class="card fuvhero"><p>Treine no formato da <b>1ª fase</b> (5 alternativas), veja <b>exatamente o que errou</b> e receba um <b>plano de revisão</b> ligado à trilha. No modo <b>Montar resolução</b>, você organiza a solução inteira, passo a passo.</p>
   <div class="fuvcount"><span><b>${nb}</b> questões originais no estilo FUVEST</span><span><b>${ni}</b> importadas por você</span></div>
   <p class="muted" style="font-size:13px;margin-top:8px">As questões do banco foram escritas para este app no estilo e nível da FUVEST — não são cópias das provas oficiais. Para treinar com as <b>provas oficiais</b> (em <a href="https://www.fuvest.br" target="_blank" rel="noopener">fuvest.br</a>) e com os <b>simulados do seu cursinho</b>, use <b>Importar questões</b>: elas ganham correção, diagnóstico e plano de revisão.</p></div>
  <div class="practice-card"><div class="pic" style="background:#fff4d6">📝</div><div class="grow"><h3>Mini-simulado</h3><p>10 questões · 30 min · correção comentada no final, como na prova.</p><button class="btn gold sm" data-fa="sim10" ${all.length?'':'disabled'}>Começar</button></div></div>
  <div class="practice-card"><div class="pic" style="background:#ffdfe0">🏁</div><div class="grow"><h3>Simulado longo</h3><p>${Math.min(20,all.length)} questões · ${Math.min(20,all.length)*3} min (≈ 3 min por questão, ritmo da FUVEST).</p><button class="btn red sm" data-fa="sim20" ${all.length?'':'disabled'}>Começar</button></div></div>
  <div class="practice-card"><div class="pic" style="background:var(--blue-l)">🎯</div><div class="grow"><h3>Treino com correção imediata</h3><p>A cada erro: por que a alternativa marcada está errada, a resolução e o que revisar.</p><button class="btn blue sm" data-fa="treino" ${all.length?'':'disabled'}>Treinar</button></div></div>
  <div class="practice-card"><div class="pic" style="background:#f3e3ff">🧩</div><div class="grow"><h3>Montar resolução</h3><p>Monte a solução inteira na ordem certa — há passos com erros comuns para você evitar. ${nbuild} questões disponíveis.</p><button class="btn sm purple" data-fa="build" ${nbuild?'':'disabled'}>Montar</button></div></div>
  ${nw?`<div class="practice-card"><div class="pic" style="background:var(--red-l)">🔁</div><div class="grow"><h3>Refazer questões erradas</h3><p>${nw} questão${nw>1?'es':''} que você errou esperando uma segunda chance.</p><button class="btn red sm" data-fa="redo">Refazer</button></div></div>`:''}
  <h2 class="section-title" style="margin-top:24px">📊 Seu diagnóstico</h2>`;
  if(!topics.length) h+=`<div class="card"><p class="muted">Responda questões para ver quais assuntos você domina e quais precisa revisar.</p></div>`;
  else h+=`<div class="card"><p class="muted" style="font-size:14px;margin-bottom:8px">Assuntos ordenados do mais fraco para o mais forte (todas as questões FUVEST respondidas).</p>${topics.slice(0,8).map(t=>fuvTopicRow(t.id,t.c,t.w)).join('')}</div>`;
  if(F.hist.length) h+=`<h2 class="section-title" style="margin-top:24px">🗓️ Histórico de simulados</h2><div class="card">${F.hist.slice(-6).reverse().map(x=>`<div class="mr"><span>${x.d.split('-').reverse().join('/')} · ${x.k==='sim20'?'Simulado longo':'Mini-simulado'}</span><span><b style="color:${memColor(x.c/x.n)}">${x.c}/${x.n}</b> · ${Math.round(x.t/60)} min</span></div>`).join('')}</div>`;
  h+=`<h2 class="section-title" style="margin-top:24px">📚 Banco de questões</h2><div class="list">${Object.entries(sets).map(([name,n])=>`<div class="item"><div class="ico" style="background:${name.startsWith('Banco')?BRAND.body:'#ff9600'}">${name.startsWith('Banco')?'✍️':'📥'}</div><div class="grow"><b>${esc(name)}</b><small>${n} questão${n>1?'es':''}</small></div><button class="btn sm ghost" data-fa="set" data-set="${esc(name)}">Treinar</button>${name.startsWith('Banco')?'':`<button class="link" style="color:var(--red)" data-fa="del" data-set="${esc(name)}">apagar</button>`}</div>`).join('')}</div>
  <div class="row" style="margin-top:12px;flex-wrap:wrap"><button class="btn" data-fa="import">📥 Importar questões</button>${ni?'<button class="btn ghost" data-fa="export">💾 Exportar importadas</button>':''}</div>
  <h2 class="section-title" style="margin-top:24px">🏷️ Treinar por assunto</h2><div class="tagcloud">${Object.entries(tagCount).sort((a,b)=>b[1]-a[1]).map(([id,n])=>`<button class="chip" data-fa="topic" data-skill="${id}">${SK[id].icon} ${SK[id].name} · ${n}</button>`).join('')}</div>`;
  return h;
}
function fuvTopicRow(id,c,w){ const s=SK[id],acc=c/(c+w||1),lv=sk(id).lv;
  return `<div class="topicrow"><span class="ti" style="background:${s.unit.color}">${s.icon}</span><span class="tn"><b>${s.name}</b><small>${c} certas · ${w} erradas${lv?'':' · ainda não estudado na trilha'}</small><span class="minibar"><i style="width:${acc*100}%;background:${memColor(acc)}"></i></span></span><span class="tb"><button class="btn sm ghost" data-theory="${id}">Aula</button><button class="btn sm" ${lv?`data-practice="${id}"`:`data-start="${id}"`}>${lv?'Revisar':'Estudar'}</button></span></div>`; }

/* ---------- Sessões ---------- */
function startFuv(kind,opts={}){
  const F=fv(); let pool=fuvAll();
  if(opts.set) pool=pool.filter(q=>q.set===opts.set);
  if(opts.skill) pool=pool.filter(q=>q.tags.includes(opts.skill));
  if(kind==='redo') pool=pool.filter(q=>F.wrong.includes(q.id));
  if(kind==='build') pool=pool.filter(q=>q.steps&&q.steps.length>=2);
  if(!pool.length){ toast('Nenhuma questão disponível para esse modo.'); return; }
  const n=kind==='sim10'?10:kind==='sim20'?20:kind==='build'?6:10;
  const qs=shuffle(pool).sort((a,b)=>(F.seen[a.id]||0)-(F.seen[b.id]||0)).slice(0,n);
  closeModal(); OPEN_POP=null;
  const exam=kind==='sim10'||kind==='sim20';
  L={mode:'fuv',kind,exam,queue:qs.map(q=>q.id),i:0,total:qs.length,done:0,correct:0,wrong:0,blank:0,combo:0,maxCombo:0,t0:Date.now(),per:{},missed:[],answers:[],state:'answer',sel:null,lives:null,timeLeft:exam?qs.length*180:null,timer:null};
  $('#lesson').classList.remove('hidden'); document.body.style.overflow='hidden';
  if(exam) L.timer=setInterval(()=>{ if(!L||L.mode!=='fuv'||L.state==='result')return; L.timeLeft--; fuvTop(); if(L.timeLeft<=0){ toast('⏰ Tempo esgotado!'); fuvFinish(); } },1000);
  fuvRender();
}
function fuvTop(){ const bar=$('#lprog'); bar.className='pbar'+(L.exam?' blue':' purple'); bar.firstElementChild.style.width=(L.i/L.total*100)+'%';
  const st=$('#lstat'); if(L.exam){ const m=Math.floor(Math.max(0,L.timeLeft)/60),s=Math.max(0,L.timeLeft)%60; st.className='ltimer'; st.innerHTML=`⏱ ${m}:${pad(s)} · ${L.i+1}/${L.total}`; } else { st.className='lhearts'; st.innerHTML=`<span style="color:var(--purple)">${Math.min(L.i+1,L.total)}/${L.total}</span>`; } }
function fuvCur(){ return fuvById(L.queue[L.i]); }
function fuvPseudo(q){ const tag=q.tags.find(t=>SK[t]); return {skill:tag||ALL[0].id,type:'mc',prompt:fuvText(q),hint:q.steps&&q.steps.length?'Comece assim: '+fuvStep(q,q.steps[0]):'Identifique o assunto, anote os dados e escolha a fórmula.',answer:`(${LETTERS[q.ans]}) ${fuvAlt(q,q.ans)}`,exp:q.steps&&q.steps.length?q.steps.map((s,i)=>`${i+1}. ${fuvStep(q,s)}`).join('<br>'):(q.why&&q.why[q.ans])||''}; }
function fuvHead(q){ return `<div class="fuvtag">${q.origin==='bank'?'✍️ Estilo FUVEST':'📥 '+esc(q.src)}${q.area?' · '+esc(q.area):q.tags.length?' · '+q.tags.map(t=>SK[t].name).join(', '):''}</div>`; }
function fuvRender(){
  if(L.i>=L.queue.length) return fuvFinish();
  const q=fuvCur(); if(!q){ L.i++; return fuvRender(); }
  if(L.kind==='build') return fuvBuildRender(q);
  L.state='answer'; L.sel=null; L.cur=fuvPseudo(q);
  $('#lqbox').innerHTML=`${fuvHead(q)}<div class="fuvq">${fuvText(q)}</div>${q.visual?`<div class="visual">${q.visual}</div>`:''}
   <div class="opts fuvopts" id="opts">${q.alts.map((a,i)=>`<button class="opt" data-fi="${i}"><span class="k">${LETTERS[i]}</span><span>${fuvAlt(q,i)}</span></button>`).join('')}</div>`;
  $('#lbody').scrollTop=0; $('#lfoot').className='lfoot';
  $('#lfootin').innerHTML=`<div class="footrow"><div class="tools">${q.tags[0]?`<button class="toolbtn" data-theory="${q.tags[0]}" title="Aula">📖<span class="t"> Aula</span></button>`:''}${L.exam?'':'<button class="toolbtn" data-act="lchat" title="Dúvida">💬<span class="t"> Dúvida</span></button>'}${L.exam?'<button class="toolbtn" data-fa="skip" title="Deixar em branco">⏭<span class="t"> Pular</span></button>':''}</div><button class="btn" id="bCheck" data-fa="check" disabled>${L.exam?'Confirmar':'Verificar'}</button></div>`;
  fuvTop();
}
function fuvSelect(i){ if(!L||L.mode!=='fuv'||L.state!=='answer')return; const q=fuvCur(); if(i>=q.alts.length)return; L.sel=i; beep(SND.tap); document.querySelectorAll('#opts .opt').forEach((b,j)=>b.classList.toggle('sel',j===i)); $('#bCheck').disabled=false; }
function fuvRecord(q,ok,sel){ const F=fv(); F.seen[q.id]=(F.seen[q.id]||0)+1;
  q.tags.forEach(t=>{ const s=F.stats[t]||(F.stats[t]=[0,0]); ok?s[0]++:s[1]++; const p=L.per[t]||(L.per[t]={c:0,w:0}); ok?p.c++:p.w++;
    if(!ok){ const st=sk(t); if(st.lv>=1&&st.stab) st.stab=Math.max(0.5,round(st.stab*0.6,2)); } });
  F.wrong=F.wrong.filter(id=>id!==q.id); if(!ok) F.wrong.unshift(q.id); if(F.wrong.length>200) F.wrong.length=200;
  L.answers.push({id:q.id,sel,ok}); S.answered++; if(ok) S.correct++; save(); }
function fuvCheck(skip){
  if(!L||L.mode!=='fuv'||L.state!=='answer')return; const q=fuvCur();
  if(skip){ L.blank++; L.answers.push({id:q.id,sel:null,ok:false}); const F=fv(); F.seen[q.id]=(F.seen[q.id]||0)+1; q.tags.forEach(t=>{ const p=L.per[t]||(L.per[t]={c:0,w:0}); p.w++; }); L.i++; return fuvRender(); }
  if(L.sel==null)return; const ok=L.sel===q.ans; fuvRecord(q,ok,L.sel);
  if(ok){ L.correct++; L.combo++; L.maxCombo=Math.max(L.maxCombo,L.combo); } else { L.wrong++; L.combo=0; L.missed.push(q.id); }
  if(L.exam){ L.i++; return fuvRender(); }
  L.state='feedback'; beep(ok?SND.ok:SND.bad);
  document.querySelectorAll('#opts .opt').forEach((b,j)=>{ if(j===q.ans)b.classList.add('right'); else if(j===L.sel)b.classList.add('wrong'); b.classList.remove('sel'); }); $('#opts').classList.add('done');
  const box=$('#lqbox'); box.insertAdjacentHTML('beforeend',fuvDiag(q,L.sel,true)); if(!ok){ box.classList.remove('shake'); void box.offsetWidth; box.classList.add('shake'); }
  $('#lfoot').className='lfoot '+(ok?'ok':'bad');
  $('#lfootin').innerHTML=`<div class="fbtxt"><div class="fbicon">${ok?'✔':'✘'}</div><div style="min-width:0"><div class="fbtitle">${ok?pick(PRAISE):`Você marcou (${LETTERS[L.sel]}); a correta é (${LETTERS[q.ans]})`}</div><div class="fbdetail">${ok?'Confira a resolução abaixo.':'Veja abaixo o que você errou e o que revisar.'}</div></div></div><div class="fbactions"><button class="link" data-act="lchat">💬 Tirar dúvida</button>${q.steps&&q.steps.length>=2?'<button class="link" data-fa="buildthis">🧩 Montar a resolução</button>':''}<button class="btn ${ok?'':'red'}" data-fa="next" id="bCont">Continuar</button></div>`;
  setTimeout(()=>{ const d=$('#lqbox .diag'); if(d&&!ok) d.scrollIntoView({behavior:'smooth',block:'start'}); },80);
}
/* Diagnóstico de uma questão: o que errou + resolução + o que revisar */
function fuvDiag(q,sel,open){
  const ok=sel===q.ans, blank=sel==null;
  const why=(!ok&&!blank&&q.why&&q.why[sel])?q.why[sel]:(!ok&&!blank?'Essa alternativa não satisfaz o enunciado. Compare com a resolução abaixo para achar o passo em que seu raciocínio se desviou.':'');
  const steps=q.steps&&q.steps.length?`<ol class="solsteps">${q.steps.map(s=>`<li>${fuvStep(q,s)}</li>`).join('')}</ol>`:(q.why&&q.why[q.ans]?`<p>${fuvStep(q,q.why[q.ans])}</p>`:'<p class="muted">Sem resolução cadastrada para esta questão.</p>');
  const rev=fuvRev(q,ok);
  return `<div class="diag ${ok?'good':'badd'}">${blank?`<div class="dline"><b>⚪ Em branco.</b> A correta é (${LETTERS[q.ans]}) ${fuvAlt(q,q.ans)}.</div>`:ok?`<div class="dline"><b>✅ Correto:</b> (${LETTERS[q.ans]}) ${fuvAlt(q,q.ans)}</div>`:`<div class="dline"><b>❌ Você marcou (${LETTERS[sel]}):</b> ${fuvAlt(q,sel)}</div><div class="dwhy"><b>Onde está o erro:</b> ${fuvStep(q,why)}</div><div class="dline"><b>✅ Correta: (${LETTERS[q.ans]})</b> ${fuvAlt(q,q.ans)}</div>`}
   <details ${open?'open':''}><summary><b>📝 Resolução passo a passo</b></summary>${steps}</details>${rev}</div>`; }
function fuvRev(q,ok){ return q.tags.length?`<div class="revbox"><b>📚 O que revisar</b>${q.tags.map(t=>{const s=SK[t],lv=sk(t).lv;return `<div class="revrow"><span>${s.icon} <b>${s.name}</b><small>${lv?`memória ${Math.round(retention(t)*100)}% · nível ${lv}/5`:'ainda não estudado na trilha'}</small></span><span><button class="btn sm ghost" data-theory="${t}">Aula</button><button class="btn sm" ${lv?`data-practice="${t}"`:`data-start="${t}"`}>${lv?'Praticar':'Estudar'}</button></span></div>`;}).join('')}${!ok&&q.tags.some(t=>sk(t).lv)?'<small class="muted">Esses assuntos foram antecipados na sua revisão espaçada.</small>':''}</div>`:''; }
function fuvNext(){ if(!L||L.mode!=='fuv')return; if(L.kind==='build-one'){ L.kind=L.prevKind; L.state='result'; $('#lqbox').innerHTML=L.resHTML; $('#lfoot').className='lfoot'; $('#lfootin').innerHTML=L.resFoot; return; } L.i++; fuvRender(); }

/* ---------- Montar resolução ---------- */
function fuvBuildRender(q,after){
  L.state='build'; L.cur=fuvPseudo(q);
  const pool=shuffle(q.steps.map((s,i)=>({t:s,i})).concat((q.trap||[]).map((s,j)=>({t:s,i:-1-j}))));
  L.build={q:q.id,pool,chosen:[],after:!!after};
  const box=$('#lqbox');
  box.innerHTML=`${fuvHead(q)}<div class="fuvq">${fuvText(q)}</div>${q.visual?`<div class="visual">${q.visual}</div>`:''}
   <h2 class="qtitle" style="margin:14px 0 4px">🧩 Monte a resolução</h2><p class="muted" style="font-size:14px">Toque nos passos na ordem certa. ${q.trap&&q.trap.length?`<b>Atenção:</b> ${q.trap.length} passo${q.trap.length>1?'s contêm':' contém'} um erro comum e não deve${q.trap.length>1?'m':''} entrar.`:''} Toque num passo escolhido para devolvê-lo.</p>
   <ol class="buildlist" id="blist"></ol><div class="steppool" id="bpool"></div>`;
  $('#lbody').scrollTop=0; $('#lfoot').className='lfoot';
  $('#lfootin').innerHTML=`<div class="footrow"><div class="tools">${q.tags[0]?`<button class="toolbtn" data-theory="${q.tags[0]}">📖<span class="t"> Aula</span></button>`:''}<button class="toolbtn" data-act="lchat">💬<span class="t"> Dúvida</span></button></div><button class="btn" id="bCheck" data-fa="bcheck" disabled>Verificar resolução</button></div>`;
  fuvBuildDraw(); fuvTop(); }
function fuvBuildDraw(){ const b=L.build,q=fuvById(b.q);
  $('#blist').innerHTML=b.chosen.length?b.chosen.map((k,pos)=>`<li><button class="bstep chosen" data-bu="${pos}">${fuvStep(q,b.pool[k].t)}</button></li>`).join(''):'<li class="bempty">Sua resolução aparece aqui…</li>';
  $('#bpool').innerHTML=b.pool.map((p,k)=>b.chosen.includes(k)?'':`<button class="bstep" data-bp="${k}">${fuvStep(q,p.t)}</button>`).join('');
  const c=$('#bCheck'); if(c) c.disabled=!b.chosen.length; }
function fuvBuildCheck(){ const b=L.build,q=fuvById(b.q); if(!b.chosen.length)return;
  const seq=b.chosen.map(k=>b.pool[k].i); const ok=seq.length===q.steps.length&&seq.every((v,i)=>v===i);
  let right=0; const marks=seq.map((v,pos)=>{ if(v<0) return 'trap'; if(v===pos){right++;return 'ok';} return 'pos'; });
  L.state='build-done';
  if(!b.after){ fuvRecordBuild(q,ok); }
  beep(ok?SND.ok:SND.bad);
  $('#blist').innerHTML=seq.map((v,pos)=>`<li class="m-${marks[pos]}"><span class="bstep static">${fuvStep(q,b.pool[b.chosen[pos]].t)}</span><em>${marks[pos]==='ok'?'✔ posição certa':marks[pos]==='pos'?'↕ passo certo, posição errada':'✘ contém um erro'}</em></li>`).join('');
  $('#bpool').innerHTML='';
  const missing=q.steps.filter((_,i)=>!seq.includes(i)).length;
  $('#lqbox').insertAdjacentHTML('beforeend',`<div class="diag ${ok?'good':'badd'}"><div class="dline"><b>${ok?'✅ Resolução completa e na ordem certa!':`Você acertou ${right} de ${q.steps.length} passos na posição certa${missing?` e deixou ${missing} de fora`:''}${seq.some(v=>v<0)?'; incluiu passo com erro':''}.`}</b></div>
   ${(q.trap||[]).length?`<div class="dwhy"><b>Passos com erro (armadilhas):</b><ul>${q.trap.map(t=>`<li>${fuvStep(q,t)}</li>`).join('')}</ul></div>`:''}
   <details open><summary><b>📝 Resolução correta</b></summary><ol class="solsteps">${q.steps.map(s=>`<li>${fuvStep(q,s)}</li>`).join('')}</ol></details>
   <div class="dline"><b>Resposta:</b> (${LETTERS[q.ans]}) ${fuvAlt(q,q.ans)}</div>${fuvRev(q,ok)}</div>`);
  $('#lfoot').className='lfoot '+(ok?'ok':'bad');
  $('#lfootin').innerHTML=`<div class="fbtxt"><div class="fbicon">${ok?'✔':'✘'}</div><div><div class="fbtitle">${ok?'Resolução perfeita!':'Compare com a resolução correta'}</div><div class="fbdetail">${right}/${q.steps.length} passos na posição certa</div></div></div><div class="fbactions">${ok?'':'<button class="link" data-fa="rebuild">↺ Tentar de novo</button>'}<button class="btn ${ok?'':'red'}" data-fa="next" id="bCont">Continuar</button></div>`; }
function fuvRecordBuild(q,ok){ const F=fv(); F.seen[q.id]=(F.seen[q.id]||0)+1; q.tags.forEach(t=>{ const s=F.stats[t]||(F.stats[t]=[0,0]); ok?s[0]++:s[1]++; const p=L.per[t]||(L.per[t]={c:0,w:0}); ok?p.c++:p.w++; }); L.answers.push({id:q.id,sel:ok?q.ans:null,ok,build:true}); if(ok)L.correct++; else { L.wrong++; L.missed.push(q.id); } save(); }

/* ---------- Resultado ---------- */
function fuvFinish(){
  if(!L||L.state==='result')return; if(L.timer)clearInterval(L.timer);
  // questões não alcançadas no simulado contam como em branco
  if(L.exam) for(let k=L.i;k<L.queue.length;k++){ const q=fuvById(L.queue[k]); if(q){ L.answers.push({id:q.id,sel:null,ok:false}); L.blank++; q.tags.forEach(t=>{const p=L.per[t]||(L.per[t]={c:0,w:0}); p.w++;}); } }
  L.state='result'; L.cur=null; { const st=$('#lstat'); st.className='lhearts'; st.innerHTML=`<span style="color:var(--purple)">✔ ${L.answers.filter(a=>a.ok).length}/${L.answers.length}</span>`; }
  const n=L.answers.length,c=L.answers.filter(a=>a.ok).length,secs=Math.round((Date.now()-L.t0)/1000),acc=n?c/n:0;
  const xp=n?10+2*c:0; if(xp) markStudy(xp); S.gems+=L.exam?5+c:2;
  if(L.exam) fv().hist.push({d:today(),k:L.kind,c,n,t:secs});
  checkAch(); save(); beep(acc>=0.5?SND.done:SND.fail); if(acc>=0.6) confetti();
  const per=Object.entries(L.per).filter(([id])=>SK[id]).sort((a,b)=>(a[1].c/(a[1].c+a[1].w))-(b[1].c/(b[1].c+b[1].w)));
  const weak=per.filter(([,p])=>p.w>0).map(([id])=>id);
  const rs=(col,hd,v)=>`<div class="rstat" style="--c:${col}"><div class="h">${hd}</div><div class="v">${v}</div></div>`;
  $('#lqbox').innerHTML=`<div class="result" style="justify-content:flex-start">
   <div class="ms">${mascot(acc>=0.5?'happy':'sad')}</div><h1 class="${acc<0.5?'fail':''}">${L.exam?'Simulado concluído!':L.kind==='build'?'Resoluções montadas!':'Treino concluído!'}</h1>
   <div class="rstats">${rs('#58cc02','Acertos',`${c}/${n}`)}${rs('#ffc800','XP ganho','⚡ '+xp)}${rs('#1cb0f6','Tempo',`⏱ ${Math.floor(secs/60)}:${pad(secs%60)}`)}</div>
   ${L.exam&&L.blank?`<p class="muted">${L.blank} em branco (não respondidas).</p>`:''}
   ${per.length?`<div class="card fuvres"><b>📊 Desempenho por assunto</b>${per.map(([id,p])=>`<div class="topicrow"><span class="ti" style="background:${SK[id].unit.color}">${SK[id].icon}</span><span class="tn"><b>${SK[id].name}</b><small>${p.c} de ${p.c+p.w} certas</small><span class="minibar"><i style="width:${p.c/(p.c+p.w)*100}%;background:${memColor(p.c/(p.c+p.w))}"></i></span></span></div>`).join('')}</div>`:''}
   ${weak.length?`<div class="card fuvres" style="border-color:var(--orange)"><b>📚 Seu plano de revisão</b><p class="muted" style="font-size:14px">Estes assuntos causaram seus erros. ${weak.some(id=>sk(id).lv)?'Os que você já estudou foram antecipados na revisão espaçada.':''}</p>${weak.map(id=>fuvTopicRow(id,L.per[id].c,L.per[id].w)).join('')}
     ${weak.some(id=>sk(id).lv)?`<button class="btn gold block" style="margin-top:10px" data-fa="revweak">Revisar esses assuntos agora</button>`:''}</div>`:''}
   <div class="card fuvres"><b>📝 Correção comentada</b>${L.answers.map((a,k)=>{const q=fuvById(a.id);if(!q)return '';return `<details class="corr"><summary><span class="cs ${a.ok?'ok':a.sel==null?'bl':'no'}">${a.ok?'✔':a.sel==null?'–':'✘'}</span> Questão ${k+1} · ${q.tags.map(t=>SK[t].name).join(', ')||esc(q.area||'')}${a.build?' · montagem':''}</summary><div class="fuvq small">${fuvText(q)}</div>${fuvDiag(q,a.sel,true)}${!a.ok&&q.steps&&q.steps.length>=2?`<button class="btn sm purple" data-fa="buildid" data-q="${q.id}">🧩 Montar esta resolução</button>`:''}</details>`;}).join('')}</div></div>`;
  $('#lbody').scrollTop=0; $('#lprog').firstElementChild.style.width='100%';
  $('#lfoot').className='lfoot'; $('#lfootin').innerHTML=`<div class="footrow" style="justify-content:flex-end"><button class="btn" data-act="quit" id="bCont">Concluir</button></div>`;
  L.weak=weak; L.resHTML=$('#lqbox').innerHTML; L.resFoot=$('#lfootin').innerHTML;
}

/* ---------- Importação ---------- */
const IMPORT_HELP=`### FUVEST 2024 · Q12
assuntos: progressão aritmética, probabilidade
Os ângulos internos de um triângulo estão em PA e o maior mede 80°. O menor mede:
A) 20°
B) 30°
C) 40°
D) 50°
E) 60°
gabarito: C
erro A: confundiu a razão com o menor ângulo
resolução:
- Ângulos: a − r, a, a + r
- 3a = 180° ⇒ a = 60°
- 60° + r = 80° ⇒ r = 20°
- Menor: 60° − 20° = 40°`;
function autoTags(txt){ const m=' '+normChat(txt)+' ',out=[]; GLOSS.forEach(g=>{ if(out.includes(g.s)||!SK[g.s])return; if(g.k.some(k=>k.length>=4&&m.includes(' '+k))) out.push(g.s); }); return out.slice(0,3); }
function mapTag(t){ const n=normChat(t); if(!n)return null; if(SK[n])return n; const bn=ALL.find(s=>normChat(s.name)===n)||ALL.find(s=>normChat(s.name).includes(n)||n.includes(normChat(s.name))); if(bn)return bn.id; const g=findGloss(n); return g&&SK[g.s]?g.s:null; }
function parseImport(raw){
  raw=raw.trim(); const out=[],errs=[];
  if(raw.startsWith('[')||raw.startsWith('{')){ try{ let arr=JSON.parse(raw); if(!Array.isArray(arr)) arr=arr.questoes||[arr];
      arr.forEach((o,k)=>{ const alts=o.alternativas||o.alts||[]; const g=String(o.gabarito??o.ans??'').trim().toUpperCase(); const ans=/^[A-E]$/.test(g)?LETTERS.indexOf(g):+g;
        if(!o.enunciado&&!o.q||alts.length<2||!(ans>=0&&ans<alts.length)){ errs.push(`Item ${k+1}: faltam enunciado, alternativas ou gabarito.`); return; }
        const why=[]; if(o.erros) Object.entries(o.erros).forEach(([L_,t])=>{ why[LETTERS.indexOf(L_.toUpperCase())]=t; });
        const src=o.fonte||o.src||'Importada'; out.push(mkImp(src,o.assuntos||o.tags||[],o.enunciado||o.q,alts,ans,why,o.resolucao||o.steps||[],o.erradas||o.trap||[])); }); }catch(e){ errs.push('JSON inválido: '+e.message); } return {out,errs}; }
  const blocks=raw.split(/^\s*#{2,3}\s*/m).map(b=>b.trim()).filter(Boolean);
  blocks.forEach((b,k)=>{ const lines=b.split('\n'); const src=lines.shift().trim()||'Importada'; let tags=[],en=[],alts=[],ans=-1,why=[],steps=[],traps=[],mode='en';
    lines.forEach(l=>{ const t=l.trim(); let m;
      if(/^#(?!#)/.test(t)) return;
      if(!t){ if(mode==='en') en.push(''); return; }
      if((m=t.match(/^(assuntos?|tags?|mat[eé]rias?)\s*:\s*(.*)$/i))){ tags=m[2].split(/[,;]/).map(x=>x.trim()).filter(Boolean); return; }
      if((m=t.match(/^(gabarito|resposta|correta)\s*:\s*\(?([A-Ea-e])\)?/i))){ ans=LETTERS.indexOf(m[2].toUpperCase()); mode='x'; return; }
      if((m=t.match(/^erro\s*\(?([A-Ea-e])\)?\s*:\s*(.*)$/i))){ why[LETTERS.indexOf(m[1].toUpperCase())]=m[2]; return; }
      if(/^resolu[cç][aã]o\s*:?\s*$/i.test(t)){ mode='res'; return; }
      if((m=t.match(/^resolu[cç][aã]o\s*:\s*(.+)$/i))){ steps=m[1].split('|').map(x=>x.trim()).filter(Boolean); mode='res'; return; }
      if(/^(passos? )?errad[oa]s?\s*:?\s*$/i.test(t)||/^armadilhas?\s*:?\s*$/i.test(t)){ mode='trap'; return; }
      if(mode==='res'||mode==='trap'){ const s=t.replace(/^(\d+[\.\)]|[-•*])\s*/,''); (mode==='res'?steps:traps).push(s); return; }
      if((m=t.match(/^\(?([A-Ea-e])\s*[\)\.\-:]\s*(.+)$/))&&(alts.length===LETTERS.indexOf(m[1].toUpperCase()))){ alts.push(m[2]); mode='alt'; return; }
      if(mode==='alt'&&alts.length){ alts[alts.length-1]+=' '+t; return; }
      en.push(t); });
    const enun=en.join('\n').trim();
    if(!enun||alts.length<2||ans<0||ans>=alts.length){ errs.push(`Questão ${k+1} ("${src.slice(0,40)}"): ${!enun?'sem enunciado':alts.length<2?'alternativas não encontradas (use A) … E))':'gabarito ausente ou inválido'}.`); return; }
    out.push(mkImp(src,tags,enun,alts,ans,why,steps,traps)); });
  return {out,errs}; }
function mkImp(src,tags,q,alts,ans,why,steps,trap){ const set=String(src).split(/[·|–—]/)[0].replace(/\bQ(uest[aã]o)?\s*\d+\b/i,'').trim()||'Importadas';
  let tg=(Array.isArray(tags)?tags:String(tags).split(',')).map(mapTag).filter(Boolean); if(!tg.length) tg=autoTags(q+' '+alts.join(' '));
  let h=0; const str=src+q; for(let i=0;i<str.length;i++) h=(h*31+str.charCodeAt(i))|0;
  return {id:'imp'+Math.abs(h).toString(36),origin:'imp',set,src:String(src),area:'',tags:[...new Set(tg)],q:String(q),alts:alts.map(String),ans,why:why.map(x=>x==null?x:String(x)),steps:(steps||[]).map(String),trap:(trap||[]).map(String)}; }
function importModal(){
  modal(`<h2>📥 Importar questões</h2><p class="muted" style="font-size:14px">Cole as questões das provas oficiais (baixe em <a href="https://www.fuvest.br" target="_blank" rel="noopener">fuvest.br</a>) ou dos simulados do seu cursinho. Uma questão por bloco, começando com <b>###</b> e a fonte. Os <b>assuntos</b> ligam a questão à trilha (se faltar, o app tenta descobrir pelo texto). <b>resolução</b> e <b>erro X</b> são opcionais, mas com eles a correção e o modo Montar resolução ficam muito melhores. Também aceita JSON.</p>
   <textarea id="imptxt" class="imptxt" placeholder="${esc(IMPORT_HELP)}"></textarea>
   <div class="row" style="flex-wrap:wrap;margin-top:8px"><label class="btn sm ghost" style="cursor:pointer">📄 Abrir arquivo .txt/.json<input type="file" id="impfile" accept=".txt,.json,text/plain,application/json" hidden></label><button class="link" data-fa="impex">ver exemplo</button></div>
   <div id="impmsg" class="muted" style="font-size:14px;margin-top:8px"></div>
   <div class="actions"><button class="btn block" data-fa="impgo">Importar</button><button class="btn ghost block" data-close>Cancelar</button></div>`);
  const f=$('#impfile'); f.addEventListener('change',()=>{ const file=f.files[0]; if(!file)return; const r=new FileReader(); r.onload=()=>{ $('#imptxt').value=r.result; }; r.readAsText(file); });
}
function doImport(){ const raw=$('#imptxt').value; if(!raw.trim()){ $('#impmsg').innerHTML='Cole as questões primeiro.'; return; }
  const {out,errs}=parseImport(raw); const F=fv(); let added=0; out.forEach(q=>{ if(!F.imp.some(x=>x.id===q.id)){ F.imp.push(q); added++; } });
  try{ save(); }catch(e){}
  const untagged=out.filter(q=>!q.tags.length).length;
  if(!out.length){ $('#impmsg').innerHTML=`<span style="color:var(--red)">Nenhuma questão reconhecida.</span><br>${errs.slice(0,5).map(esc).join('<br>')}`; return; }
  closeModal(); render(); toast(`📥 ${added} questão${added!==1?'es':''} importada${added!==1?'s':''}${errs.length?` · ${errs.length} com problema`:''}`,3200);
  if(errs.length||untagged) setTimeout(()=>modal(`<h2>Importação concluída</h2><p><b>${added}</b> questões adicionadas.</p>${untagged?`<p class="muted">${untagged} questão(ões) ficaram sem assunto identificado — o diagnóstico por assunto não vai considerá-las. Adicione a linha <b>assuntos:</b> para ligá-las à trilha.</p>`:''}${errs.length?`<p style="color:var(--red)">Problemas:</p><ul style="padding-left:20px;font-size:14px">${errs.slice(0,10).map(e=>`<li>${esc(e)}</li>`).join('')}</ul>`:''}<div class="actions"><button class="btn block" data-close>Ok</button></div>`),400); }
function exportImp(){ const data=JSON.stringify(fv().imp.map(q=>({fonte:q.src,assuntos:q.tags,enunciado:q.q,alternativas:q.alts,gabarito:LETTERS[q.ans],erros:Object.fromEntries(q.why.map((w,i)=>[LETTERS[i],w]).filter(x=>x[1])),resolucao:q.steps,erradas:q.trap})),null,1);
  const a=document.createElement('a'); a.href=URL.createObjectURL(new Blob([data],{type:'application/json'})); a.download=BRAND.app.toLowerCase()+'-questoes-importadas.json'; document.body.appendChild(a); a.click(); a.remove(); }

/* ---------- Eventos do módulo ---------- */
document.addEventListener('click',e=>{
  const t=e.target.closest('[data-fa],[data-fi],[data-bp],[data-bu]'); if(!t)return; const d=t.dataset;
  if(d.fi!=null){ fuvSelect(+d.fi); return; }
  if(d.bp!=null&&L&&L.state==='build'){ L.build.chosen.push(+d.bp); beep(SND.tap); fuvBuildDraw(); return; }
  if(d.bu!=null&&L&&L.state==='build'){ L.build.chosen.splice(+d.bu,1); fuvBuildDraw(); return; }
  switch(d.fa){
    case 'sim10': case 'sim20': case 'treino': case 'build': case 'redo': startFuv(d.fa); break;
    case 'set': startFuv('treino',{set:d.set}); break;
    case 'topic': startFuv('treino',{skill:d.skill}); break;
    case 'del': modal(`<h2>Apagar "${esc(d.set)}"?</h2><p class="muted">As questões importadas deste conjunto serão removidas deste aparelho.</p><div class="actions"><button class="btn red block" data-fa="delyes" data-set="${esc(d.set)}">Apagar</button><button class="btn ghost block" data-close>Cancelar</button></div>`); break;
    case 'delyes': { const F=fv(); F.imp=F.imp.filter(q=>q.set!==d.set); save(); closeModal(); render(); toast('Conjunto apagado.'); break; }
    case 'import': importModal(); break;
    case 'impex': $('#imptxt').value=IMPORT_HELP; break;
    case 'impgo': doImport(); break;
    case 'export': exportImp(); break;
    case 'check': fuvCheck(false); break;
    case 'endsim': closeModal(); fuvFinish(); break;
    case 'skip': fuvCheck(true); break;
    case 'next': fuvNext(); break;
    case 'buildthis': { const q=fuvCur(); fuvBuildRender(q,true); break; }
    case 'buildid': { const q=fuvById(d.q); L.prevKind=L.kind; L.kind='build-one'; fuvBuildRender(q,true); break; }
    case 'bcheck': fuvBuildCheck(); break;
    case 'rebuild': { const q=fuvById(L.build.q); fuvBuildRender(q,true); break; }
    case 'revweak': { const ids=(L.weak||[]).filter(id=>sk(id).lv); quitLesson(); if(ids.length) startSession('review',{ids:ids.slice(0,6)}); break; }
  }
});
function fuvKey(e){
  if(L.state==='answer'){ const k=e.key.toUpperCase(); const i=LETTERS.indexOf(k); if(i>=0&&k.length===1){ fuvSelect(i); return; } if(/^[1-5]$/.test(e.key)){ fuvSelect(+e.key-1); return; } if(e.key==='Enter'){ e.preventDefault(); fuvCheck(false); } }
  else if(e.key==='Enter'){ e.preventDefault(); if(L.state==='feedback'||L.state==='build-done'){ fuvNext(); } else if(L.state==='build') fuvBuildCheck(); else if(L.state==='result') quitLesson(); }
}
