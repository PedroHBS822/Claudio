
/* =====================================================================
   Preparação FUVEST — banco de questões, simulados, diagnóstico e
   "montar resolução" (compartilhado por todos os cursos)
   ===================================================================== */
const LETTERS='ABCDE';
const FUV_BANK=(typeof FUVQ!=='undefined'?FUVQ:[]).map(q=>Object.assign({origin:'bank',set:'Banco original (estilo FUVEST)',src:'Estilo FUVEST'},q,{tags:(q.tags||[]).filter(t=>SK[t])}));
function fv(){ const d={stats:{},hist:[],wrong:[],imp:[],seen:{},pv:{}}; if(!S.fuv) S.fuv=d; for(const k in d) if(S.fuv[k]==null) S.fuv[k]=d[k]; return S.fuv; }
function fuvAll(){ return FUV_BANK.concat(fv().imp); }
function fuvById(id){ return OFC_Q[id]||fuvAll().find(q=>q.id===id); }
const fuvText=q=>q.origin!=='imp'?q.q:esc(q.q).replace(/\n/g,'<br>');
const fuvAlt=(q,i)=>q.origin!=='imp'?q.alts[i]:esc(q.alts[i]);
const fuvStep=(q,s)=>q.origin!=='imp'?s:esc(s);

/* ---------- Provas oficiais (FUVEST 1ª fase e ENEM), carregadas sob demanda ---------- */
const OFC_MAN=typeof OFICIAIS_MAN!=='undefined'?OFICIAIS_MAN:[];
const OFC={},OFC_Q={};
function OFICIAIS_ADD(pid,qs){ const m=OFC_MAN.find(x=>x.id===pid); if(!m)return;
  OFC[pid]=qs.map(o=>{ const q=Object.assign({},o,{origin:'oficial',pid,exam:m.exam,year:m.year,set:m.label,stage:m.sub.split(' · ')[0],src:`${m.label} · Questão ${o.n}`,why:[],steps:[],trap:[],
    tags:autoTags(stripHtml(o.q.replace(/<(br|\/p|\/td)[^>]*>/g,' $&'))+' '+o.alts.map(stripHtml).join(' '))}); OFC_Q[q.id]=q; return q; }); }
const OFC_FILES={};
function ofcLoad(pid){ if(OFC[pid]) return Promise.resolve(OFC[pid]); const m=OFC_MAN.find(x=>x.id===pid); if(!m) return Promise.reject(new Error('prova desconhecida'));
  const p=OFC_FILES[m.file]||(OFC_FILES[m.file]=new Promise((res,rej)=>{ const sc=document.createElement('script'); sc.src=m.file; sc.async=true; sc.onload=res;
    sc.onerror=()=>{ delete OFC_FILES[m.file]; sc.remove(); rej(new Error('falha ao carregar '+m.file)); }; document.head.appendChild(sc); }));
  return p.then(()=>{ if(!OFC[pid]) throw new Error('prova vazia'); return OFC[pid]; }); }
function ofcPidOf(id){ let m=/^fuv(\d{4})-/.exec(id); if(m) return 'fuvest-'+m[1]; m=/^enem(\d{4})(r?)-/.exec(id); if(m) return 'enem-'+m[1]+(m[2]?'-reaplicacao':''); return null; }
function ofcEnsure(ids){ const p=[...new Set(ids.map(ofcPidOf).filter(x=>x&&!OFC[x]))]; if(!p.length) return Promise.resolve(); toast('⏳ Carregando as provas…',1200); return Promise.all(p.map(ofcLoad)); }
function ofcMan(q){ return OFC_MAN.find(x=>x.id===q.pid)||{sub:''}; }
function ofcRun(pids,fn){ const need=pids.filter(p=>!OFC[p]); if(need.length){ const m=OFC_MAN.find(x=>x.id===need[0]); toast(`⏳ Carregando ${need.length>1?need.length+' provas':m.label}…`,1400); }
  Promise.all(pids.map(ofcLoad)).then(()=>{ if(need.length) $('#toastroot').innerHTML=''; fn(); },()=>toast('Não foi possível carregar a prova. Verifique se a pasta <b>provas/</b> está ao lado do app.',4200)); }
/* Origem da questão: sempre visível para o aluno saber de onde e de quando ela é */
function fuvSrcShort(q){ return q.origin==='oficial'?`${q.set} · Q${q.n}`:q.origin==='bank'?'Estilo FUVEST (original do app)':esc(q.src); }
function fuvSrcChip(q){
  if(q.origin==='oficial') return `<div class="srcchip ${q.exam==='ENEM'?'enem':'fuv'}"><b>${q.exam==='ENEM'?'📘':'🎓'} ${esc(q.set)} · Questão ${q.n}</b><span>${esc(ofcMan(q).sub)} · prova oficial · gabarito oficial ${q.exam==='ENEM'?'do INEP':'da FUVEST'}</span></div>`;
  if(q.origin==='bank') return `<div class="srcchip bank"><b>✍️ Estilo FUVEST</b><span>Questão original do ${BRAND.app}, no formato da 1ª fase (não é de prova oficial)</span></div>`;
  return `<div class="srcchip imp"><b>📥 ${esc(q.src)}</b><span>Importada por você</span></div>`; }

/* ---------- Resolução em vídeo (YouTube) ----------
   Não há como escolher um vídeo para cada uma das milhares de questões, então o app abre a
   busca do YouTube já filtrada pela prova, pelo ano e pelo número da questão. O segundo botão
   busca pelo começo do enunciado, útil quando o vídeo usa a numeração de outro caderno. */
function ytSearch(t){ return 'https://www.youtube.com/results?search_query='+encodeURIComponent(t); }
function ofcVideo(q){ if(q.origin!=='oficial') return '';
  const m=ofcMan(q),y=m.year||(/\d{4}/.exec(q.set)||[''])[0],rea=m.ed==='reaplicacao';
  const byNum=`${q.exam} ${y}${rea?' reaplicação':''} questão ${q.n} resolução`;
  const words=stripHtml(q.q.replace(/<[^>]+>/g,' ')).split(' ').filter(w=>w.length>1&&!/^(https?:|www\.|\()/.test(w)).slice(0,12).join(' ');
  return `<div class="vidbox"><b>🎬 Resolução em vídeo</b><small>Abre o YouTube com os vídeos que resolvem esta questão (professores e cursinhos). Confira se o vídeo é de ${esc(q.set)}.</small>
   <div class="vidbtns"><a class="btn sm red" href="${ytSearch(byNum)}" target="_blank" rel="noopener">▶ ${q.exam} ${y} · questão ${q.n}</a>${words.length>20?`<a class="btn sm ghost" href="${ytSearch(q.exam+' '+y+' '+words)}" target="_blank" rel="noopener">🔎 Buscar pelo enunciado</a>`:''}</div></div>`; }

/* ---------- Leituras obrigatórias (ficam no curso de Português) ---------- */
const BOOKS_UNIT='p7';
function booksCard(){ return `<div class="practice-card" style="margin-top:12px"><div class="pic" style="background:#f3e3ff">📚</div><div class="grow"><h3>Leituras obrigatórias da FUVEST 2027</h3><p>As 9 obras da lista, todas de autoras de língua portuguesa: resumo, personagens, temas, vídeos e questões sobre cada livro${COURSE_ID==='por'?'':' (no curso de Português)'}.</p><button class="btn sm purple" data-fa="livros">${COURSE_ID==='por'?'Estudar os livros':'Abrir no curso de Português'}</button></div></div>`; }
function gotoUnit(id){ if(L&&!$('#lesson').classList.contains('hidden')) return; VIEW='learn'; render(); const el=document.getElementById('unit-'+id); if(el) el.scrollIntoView({behavior:'smooth',block:'start'}); }

/* ---------- Tela principal ---------- */
function renderFuvest(){
  const F=fv(),all=fuvAll(),nb=FUV_BANK.length,ni=F.imp.length,nbuild=all.filter(q=>q.steps&&q.steps.length>=2).length,nw=F.wrong.filter(id=>fuvById(id)||ofcPidOf(id)).length;
  const sets={}; all.forEach(q=>{ sets[q.set]=(sets[q.set]||0)+1; });
  const topics=Object.entries(F.stats).filter(([id])=>SK[id]).map(([id,[c,w]])=>({id,c,w,acc:c/(c+w)})).filter(t=>t.c+t.w>0).sort((a,b)=>a.acc-b.acc||b.w-a.w);
  const tagCount={}; all.forEach(q=>q.tags.forEach(t=>tagCount[t]=(tagCount[t]||0)+1));
  let h=`<h2 class="section-title">🎓 Provas: FUVEST e ENEM</h2>${ofcSection()}
  <h2 class="section-title" style="margin-top:26px">✍️ Treino no estilo FUVEST</h2>
  <div class="card fuvhero"><p>Questões <b>originais do ${BRAND.app}</b> no formato da 1ª fase: cada alternativa errada tem a explicação do erro, há resolução passo a passo e o modo <b>Montar resolução</b>, em que você organiza a solução inteira.</p>
   <div class="fuvcount"><span><b>${nb}</b> questões originais</span><span><b>${ni}</b> importadas por você</span></div>
   <p class="muted" style="font-size:13px;margin-top:8px">Para treinar com provas que ainda não estão no banco oficial (como os simulados do seu cursinho), use <b>Importar questões</b>: elas ganham correção, diagnóstico e plano de revisão.</p></div>
  <div class="practice-card"><div class="pic" style="background:#fff4d6">📝</div><div class="grow"><h3>Mini-simulado</h3><p>10 questões · 30 min · correção comentada no final, como na prova.</p><button class="btn gold sm" data-fa="sim10" ${all.length?'':'disabled'}>Começar</button></div></div>
  <div class="practice-card"><div class="pic" style="background:#ffdfe0">🏁</div><div class="grow"><h3>Simulado longo</h3><p>${Math.min(20,all.length)} questões · ${Math.min(20,all.length)*3} min (≈ 3 min por questão, ritmo da FUVEST).</p><button class="btn red sm" data-fa="sim20" ${all.length?'':'disabled'}>Começar</button></div></div>
  <div class="practice-card"><div class="pic" style="background:var(--blue-l)">🎯</div><div class="grow"><h3>Treino com correção imediata</h3><p>A cada erro: por que a alternativa marcada está errada, a resolução e o que revisar.</p><button class="btn blue sm" data-fa="treino" ${all.length?'':'disabled'}>Treinar</button></div></div>
  <div class="practice-card"><div class="pic" style="background:#f3e3ff">🧩</div><div class="grow"><h3>Montar resolução</h3><p>Monte a solução inteira na ordem certa — há passos com erros comuns para você evitar. ${nbuild} questões disponíveis.</p><button class="btn sm purple" data-fa="build" ${nbuild?'':'disabled'}>Montar</button></div></div>
  ${nw?`<div class="practice-card"><div class="pic" style="background:var(--red-l)">🔁</div><div class="grow"><h3>Refazer questões erradas</h3><p>${nw} questão${nw>1?'es':''} que você errou esperando uma segunda chance.</p><button class="btn red sm" data-fa="redo">Refazer</button></div></div>`:''}
  <h2 class="section-title" style="margin-top:24px">📊 Seu diagnóstico</h2>`;
  if(!topics.length) h+=`<div class="card"><p class="muted">Responda questões para ver quais assuntos você domina e quais precisa revisar.</p></div>`;
  else h+=`<div class="card"><p class="muted" style="font-size:14px;margin-bottom:8px">Assuntos ordenados do mais fraco para o mais forte (todas as questões FUVEST respondidas).</p>${topics.slice(0,8).map(t=>fuvTopicRow(t.id,t.c,t.w)).join('')}</div>`;
  if(F.hist.length) h+=`<h2 class="section-title" style="margin-top:24px">🗓️ Histórico de simulados</h2><div class="card">${F.hist.slice(-6).reverse().map(x=>`<div class="mr"><span>${x.d.split('-').reverse().join('/')} · ${esc(x.title||(x.k==='sim20'?'Simulado longo':'Mini-simulado'))}</span><span><b style="color:${memColor(x.c/x.n)}">${x.c}/${x.n}</b> · ${Math.round(x.t/60)} min</span></div>`).join('')}</div>`;
  h+=`<h2 class="section-title" style="margin-top:24px">📚 Banco de questões</h2><div class="list">${Object.entries(sets).map(([name,n])=>`<div class="item"><div class="ico" style="background:${name.startsWith('Banco')?BRAND.body:'#ff9600'}">${name.startsWith('Banco')?'✍️':'📥'}</div><div class="grow"><b>${esc(name)}</b><small>${n} questão${n>1?'es':''}</small></div><button class="btn sm ghost" data-fa="set" data-set="${esc(name)}">Treinar</button>${name.startsWith('Banco')?'':`<button class="link" style="color:var(--red)" data-fa="del" data-set="${esc(name)}">apagar</button>`}</div>`).join('')}</div>
  <div class="row" style="margin-top:12px;flex-wrap:wrap"><button class="btn" data-fa="import">📥 Importar questões</button>${ni?'<button class="btn ghost" data-fa="export">💾 Exportar importadas</button>':''}</div>
  <h2 class="section-title" style="margin-top:24px">🏷️ Treinar por assunto</h2><div class="tagcloud">${Object.entries(tagCount).sort((a,b)=>b[1]-a[1]).map(([id,n])=>`<button class="chip" data-fa="topic" data-skill="${id}">${SK[id].icon} ${SK[id].name} · ${n}</button>`).join('')}</div>`;
  return h;
}
function ofcSection(){
  if(!OFC_MAN.length) return '';
  const F=fv(),tab=S.ofcTab==='ENEM'?'ENEM':'FUVEST',area=BRAND.course;
  const cnt=ex=>OFC_MAN.filter(m=>m.exam===ex).reduce((a,m)=>a+m.n,0), yrs=ex=>{ const y=OFC_MAN.filter(m=>m.exam===ex).map(m=>m.year); return y.length?`${Math.min(...y)}–${Math.max(...y)}`:''; };
  const rows=OFC_MAN.filter(m=>m.exam===tab).map(m=>{ const r=F.pv[m.id]||{},d=Object.keys(r).length,c=Object.values(r).filter(Boolean).length;
    return `<div class="item ofcrow"><div class="ico yr ${m.exam==='ENEM'?'enem':'fuv'}">${m.ed==='reaplicacao'?'R':''}${String(m.year).slice(2)}</div><div class="grow"><b>${esc(m.label)}</b><small>${esc(m.sub)} · ${m.n} questões</small>${d?`<span class="minibar"><i style="width:${d/m.n*100}%;background:${memColor(c/d)}"></i></span><small>${d}/${m.n} feitas · ${c} certa${c===1?'':'s'}</small>`:''}</div><div class="ofcbtns"><button class="btn sm" data-fa="oprova" data-pid="${m.id}">Fazer prova</button><button class="btn sm ghost" data-fa="otreinop" data-pid="${m.id}">Treinar</button></div></div>`; }).join('');
  return `<div class="card ofchero"><p>Questões <b>reais</b> das provas, com o <b>gabarito oficial</b>. Toda questão mostra de qual prova e de que ano ela é e o seu número no caderno.</p>
   <div class="fuvcount"><span><b>${nf(cnt('FUVEST'))}</b> de ${area} · FUVEST ${yrs('FUVEST')}</span><span><b>${nf(cnt('ENEM'))}</b> de ${area} · ENEM ${yrs('ENEM')}</span></div>
   <div class="seg ofctabs" role="tablist">${['FUVEST','ENEM'].map(x=>`<button class="${tab===x?'on':''}" role="tab" aria-selected="${tab===x}" data-fa="otab" data-tab="${x}">${x==='FUVEST'?'🎓 FUVEST':'📘 ENEM'}</button>`).join('')}</div>
   <div class="row" style="flex-wrap:wrap;gap:8px;margin-top:12px"><button class="btn gold sm" data-fa="osim">📝 Simulado ${tab} · 10 questões</button><button class="btn blue sm" data-fa="otreino">🎯 Treino ${tab} com correção</button></div></div>
  ${tab==='FUVEST'?booksCard():''}<div class="list" style="margin-top:12px">${rows}</div>
  <p class="muted" style="font-size:13px;margin-top:10px">${tab==='FUVEST'?'1ª fase (Conhecimentos Gerais), só as questões de '+area+'. <b>FUVEST 2025, FUVEST 2026 e os simulados oficiais de 2026 ainda não estão no banco</b>: enquanto isso, cole-os em <b>Importar questões</b>, mais abaixo.':'Provas regulares e reaplicações. A numeração é a do caderno de referência; nos cadernos de outras cores só muda a ordem das questões.'} Textos transcritos dos cadernos oficiais pelos projetos abertos ${tab==='FUVEST'?'BLUEX':'enem-api'}, com o gabarito oficial ${tab==='FUVEST'?'da FUVEST':'do INEP'}; as figuras vêm dos próprios cadernos.</p>`; }
function fuvTopicRow(id,c,w){ const s=SK[id],acc=c/(c+w||1),lv=sk(id).lv;
  return `<div class="topicrow"><span class="ti" style="background:${s.unit.color}">${s.icon}</span><span class="tn"><b>${s.name}</b><small>${c} certas · ${w} erradas${lv?'':' · ainda não estudado na trilha'}</small><span class="minibar"><i style="width:${acc*100}%;background:${memColor(acc)}"></i></span></span><span class="tb"><button class="btn sm ghost" data-theory="${id}">Aula</button><button class="btn sm" ${lv?`data-practice="${id}"`:`data-start="${id}"`}>${lv?'Revisar':'Estudar'}</button></span></div>`; }

/* ---------- Sessões ---------- */
function startFuv(kind,opts={}){
  const F=fv(); let pool=opts.pool||fuvAll();
  if(opts.set) pool=pool.filter(q=>q.set===opts.set);
  if(opts.skill) pool=pool.filter(q=>q.tags.includes(opts.skill));
  if(kind==='redo') pool=F.wrong.map(fuvById).filter(Boolean);
  if(kind==='build') pool=pool.filter(q=>q.steps&&q.steps.length>=2);
  if(!pool.length){ toast('Nenhuma questão disponível para esse modo.'); return; }
  const n=opts.n||(kind==='sim10'?10:kind==='sim20'?20:kind==='build'?6:10);
  const qs=opts.ordered?pool.slice(0,n):shuffle(pool).sort((a,b)=>(F.seen[a.id]||0)-(F.seen[b.id]||0)).slice(0,n);
  closeModal(); OPEN_POP=null;
  const exam=opts.exam!=null?opts.exam:kind==='sim10'||kind==='sim20';
  L={mode:'fuv',kind,exam,title:opts.title||'',queue:qs.map(q=>q.id),i:0,total:qs.length,done:0,correct:0,wrong:0,blank:0,combo:0,maxCombo:0,t0:Date.now(),per:{},missed:[],answers:[],state:'answer',sel:null,lives:null,timeLeft:exam?qs.length*180:null,timer:null};
  $('#lesson').classList.remove('hidden'); document.body.style.overflow='hidden';
  if(exam) L.timer=setInterval(()=>{ if(!L||L.mode!=='fuv'||L.state==='result')return; L.timeLeft--; fuvTop(); if(L.timeLeft<=0){ toast('⏰ Tempo esgotado!'); fuvFinish(); } },1000);
  fuvRender();
}
function fuvTop(){ const bar=$('#lprog'); bar.className='pbar'+(L.exam?' blue':' purple'); bar.firstElementChild.style.width=(L.i/L.total*100)+'%';
  const st=$('#lstat'); if(L.exam){ const m=Math.floor(Math.max(0,L.timeLeft)/60),s=Math.max(0,L.timeLeft)%60; st.className='ltimer'; st.innerHTML=`⏱ ${m}:${pad(s)} · ${L.i+1}/${L.total}`; } else { st.className='lhearts'; st.innerHTML=`<span style="color:var(--purple)">${Math.min(L.i+1,L.total)}/${L.total}</span>`; } }
function fuvCur(){ return fuvById(L.queue[L.i]); }
function fuvPseudo(q){ const tag=q.tags.find(t=>SK[t]); return {skill:tag||ALL[0].id,type:'mc',prompt:fuvText(q),hint:q.steps&&q.steps.length?'Comece assim: '+fuvStep(q,q.steps[0]):'Identifique o assunto, anote os dados e escolha a fórmula.',answer:`(${LETTERS[q.ans]}) ${fuvAlt(q,q.ans)}`,exp:q.steps&&q.steps.length?q.steps.map((s,i)=>`${i+1}. ${fuvStep(q,s)}`).join('<br>'):(q.why&&q.why[q.ans])||''}; }
function fuvHead(q){ return `${fuvSrcChip(q)}${q.tags.length?`<div class="fuvtag">${q.tags.map(t=>SK[t].icon+' '+SK[t].name).join(' · ')}</div>`:''}`; }
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
  if(q.pid){ const r=F.pv[q.pid]||(F.pv[q.pid]={}); r[q.id]=ok?1:0; }
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
  $('#lfootin').innerHTML=`<div class="fbtxt"><div class="fbicon">${ok?'✔':'✘'}</div><div style="min-width:0"><div class="fbtitle">${ok?pick(PRAISE):`Você marcou (${LETTERS[L.sel]}); a correta é (${LETTERS[q.ans]})`}</div><div class="fbdetail">${fuvSrcShort(q)} · ${ok?(q.origin==='oficial'?'confira o gabarito e os assuntos abaixo.':'confira a resolução abaixo.'):'veja abaixo o que você errou e o que revisar.'}</div></div></div><div class="fbactions"><button class="link" data-act="lchat">💬 Tirar dúvida</button>${q.steps&&q.steps.length>=2?'<button class="link" data-fa="buildthis">🧩 Montar a resolução</button>':''}<button class="btn ${ok?'':'red'}" data-fa="next" id="bCont">Continuar</button></div>`;
  setTimeout(()=>{ const d=$('#lqbox .diag'); if(d&&!ok) d.scrollIntoView({behavior:'smooth',block:'start'}); },80);
}
/* Diagnóstico de uma questão: o que errou + resolução + o que revisar */
function fuvDiag(q,sel,open){
  const ok=sel===q.ans, blank=sel==null;
  const ofc=q.origin==='oficial';
  const why=(!ok&&!blank&&q.why&&q.why[sel])?q.why[sel]:(!ok&&!blank?(ofc?`Pelo gabarito oficial, a resposta é (${LETTERS[q.ans]}). Refaça a conta com calma, comparando sua alternativa com a correta, e revise os assuntos abaixo. Se travar, toque em <b>💬 Tirar dúvida</b>.`:'Essa alternativa não satisfaz o enunciado. Compare com a resolução abaixo para achar o passo em que seu raciocínio se desviou.'):'');
  const steps=q.steps&&q.steps.length?`<ol class="solsteps">${q.steps.map(s=>`<li>${fuvStep(q,s)}</li>`).join('')}</ol>`:(q.why&&q.why[q.ans]?`<p>${fuvStep(q,q.why[q.ans])}</p>`:ofc?'':'<p class="muted">Sem resolução cadastrada para esta questão.</p>');
  const rev=fuvRev(q,ok);
  return `<div class="diag ${ok?'good':'badd'}">${blank?`<div class="dline"><b>⚪ Em branco.</b> A correta é (${LETTERS[q.ans]}) ${fuvAlt(q,q.ans)}.</div>`:ok?`<div class="dline"><b>✅ Correto:</b> (${LETTERS[q.ans]}) ${fuvAlt(q,q.ans)}</div>`:`<div class="dline"><b>❌ Você marcou (${LETTERS[sel]}):</b> ${fuvAlt(q,sel)}</div><div class="dwhy"><b>Onde está o erro:</b> ${fuvStep(q,why)}</div><div class="dline"><b>✅ Correta: (${LETTERS[q.ans]})</b> ${fuvAlt(q,q.ans)}</div>`}
   ${steps?`<details ${open?'open':''}><summary><b>📝 Resolução passo a passo</b></summary>${steps}</details>`:`<div class="dline muted" style="font-size:13.5px">Fonte: ${esc(q.src)} (${esc(ofcMan(q).sub)}). Gabarito oficial ${q.exam==='ENEM'?'do INEP':'da FUVEST'}.</div>`}${ofc&&!ok?ofcVideo(q):''}${rev}</div>`; }
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
  if(L.exam) fv().hist.push({d:today(),k:L.kind,c,n,t:secs,title:L.title||''});
  checkAch(); save(); beep(acc>=0.5?SND.done:SND.fail); if(acc>=0.6) confetti();
  const per=Object.entries(L.per).filter(([id])=>SK[id]).sort((a,b)=>(a[1].c/(a[1].c+a[1].w))-(b[1].c/(b[1].c+b[1].w)));
  const weak=per.filter(([,p])=>p.w>0).map(([id])=>id);
  const rs=(col,hd,v)=>`<div class="rstat" style="--c:${col}"><div class="h">${hd}</div><div class="v">${v}</div></div>`;
  $('#lqbox').innerHTML=`<div class="result" style="justify-content:flex-start">
   <div class="ms">${mascot(acc>=0.5?'happy':'sad')}</div><h1 class="${acc<0.5?'fail':''}">${L.kind==='oprova'?'Prova concluída!':L.exam?'Simulado concluído!':L.kind==='build'?'Resoluções montadas!':'Treino concluído!'}</h1>${L.title?`<p class="muted" style="font-weight:800;margin-top:-8px">${esc(L.title)}</p>`:''}
   <div class="rstats">${rs('#58cc02','Acertos',`${c}/${n}`)}${rs('#ffc800','XP ganho','⚡ '+xp)}${rs('#1cb0f6','Tempo',`⏱ ${Math.floor(secs/60)}:${pad(secs%60)}`)}</div>
   ${L.exam&&L.blank?`<p class="muted">${L.blank} em branco (não respondidas).</p>`:''}
   ${per.length?`<div class="card fuvres"><b>📊 Desempenho por assunto</b>${per.map(([id,p])=>`<div class="topicrow"><span class="ti" style="background:${SK[id].unit.color}">${SK[id].icon}</span><span class="tn"><b>${SK[id].name}</b><small>${p.c} de ${p.c+p.w} certas</small><span class="minibar"><i style="width:${p.c/(p.c+p.w)*100}%;background:${memColor(p.c/(p.c+p.w))}"></i></span></span></div>`).join('')}</div>`:''}
   ${weak.length?`<div class="card fuvres" style="border-color:var(--orange)"><b>📚 Seu plano de revisão</b><p class="muted" style="font-size:14px">Estes assuntos causaram seus erros. ${weak.some(id=>sk(id).lv)?'Os que você já estudou foram antecipados na revisão espaçada.':''}</p>${weak.map(id=>fuvTopicRow(id,L.per[id].c,L.per[id].w)).join('')}
     ${weak.some(id=>sk(id).lv)?`<button class="btn gold block" style="margin-top:10px" data-fa="revweak">Revisar esses assuntos agora</button>`:''}</div>`:''}
   <div class="card fuvres"><b>📝 Correção comentada</b>${L.answers.map((a,k)=>{const q=fuvById(a.id);if(!q)return '';return `<details class="corr"><summary><span class="cs ${a.ok?'ok':a.sel==null?'bl':'no'}">${a.ok?'✔':a.sel==null?'–':'✘'}</span> ${k+1}. ${fuvSrcShort(q)}${q.tags.length?' · '+q.tags.map(t=>SK[t].name).join(', '):''}${a.build?' · montagem':''}</summary>${fuvSrcChip(q)}<div class="fuvq small">${fuvText(q)}</div>${fuvDiag(q,a.sel,true)}${!a.ok&&q.steps&&q.steps.length>=2?`<button class="btn sm purple" data-fa="buildid" data-q="${q.id}">🧩 Montar esta resolução</button>`:''}</details>`;}).join('')}</div></div>`;
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
/* Assuntos de uma questão pelo texto: pontua cada habilidade pelas palavras-chave do glossário
   (frequência × especificidade: termos de várias palavras valem mais) e fica com as mais fortes */
function autoTags(txt){ const m=' '+normChat(txt)+' ',sc={};
  GLOSS.forEach(g=>{ if(!SK[g.s])return; g.k.forEach(k=>{ if(k.length<4)return; let i=0,n=0; while((i=m.indexOf(' '+k,i))>=0){ n++; i+=k.length+1; } if(n) sc[g.s]=(sc[g.s]||0)+Math.min(n,3)*(k.includes(' ')?3:1)*(k.length>=7?1.5:1); }); });
  const arr=Object.entries(sc).sort((a,b)=>b[1]-a[1]); if(!arr.length) return [];
  return arr.filter(x=>x[1]>=arr[0][1]*0.5).slice(0,3).map(x=>x[0]); }
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
  modal(`<h2>📥 Importar questões</h2><p class="muted" style="font-size:14px">Cole questões que ainda não estão no banco: FUVEST 2025 e 2026 e os simulados oficiais (em <a href="https://www.fuvest.br" target="_blank" rel="noopener">fuvest.br</a>) ou os simulados do seu cursinho. Escreva a fonte com o ano (ex.: <b>### Simulado FUVEST 2026 · Q12</b>) para saber sempre de onde a questão veio. Uma questão por bloco, começando com <b>###</b> e a fonte. Os <b>assuntos</b> ligam a questão à trilha (se faltar, o app tenta descobrir pelo texto). <b>resolução</b> e <b>erro X</b> são opcionais, mas com eles a correção e o modo Montar resolução ficam muito melhores. Também aceita JSON.</p>
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
  modal(`<h2>💾 Exportar questões importadas</h2><p class="muted" style="font-size:14px">Copie este texto e guarde-o (ou cole em "Importar questões" em outro aparelho).</p><textarea id="exptxt" class="imptxt" readonly></textarea><div class="actions"><button class="btn block" data-fa="copyexp">Copiar</button><button class="btn ghost block" data-close>Fechar</button></div>`);
  $('#exptxt').value=data; }

/* ---------- Eventos do módulo ---------- */
document.addEventListener('click',e=>{
  const t=e.target.closest('[data-fa],[data-fi],[data-bp],[data-bu]'); if(!t)return; const d=t.dataset;
  if(d.fi!=null){ fuvSelect(+d.fi); return; }
  if(d.bp!=null&&L&&L.state==='build'){ L.build.chosen.push(+d.bp); beep(SND.tap); fuvBuildDraw(); return; }
  if(d.bu!=null&&L&&L.state==='build'){ L.build.chosen.splice(+d.bu,1); fuvBuildDraw(); return; }
  switch(d.fa){
    case 'sim10': case 'sim20': case 'treino': case 'build': startFuv(d.fa); break;
    case 'redo': ofcEnsure(fv().wrong).then(()=>startFuv('redo'),()=>startFuv('redo')); break;
    case 'otab': S.ofcTab=d.tab; save(); render(); break;
    case 'livros': if(UNITS.some(u=>u.id===BOOKS_UNIT)) gotoUnit(BOOKS_UNIT); else { lsSet('lingo_goto',BOOKS_UNIT); switchCourse('por'); } break;
    case 'oprova': { const m=OFC_MAN.find(x=>x.id===d.pid); if(!m)break; const mins=m.n*3;
      modal(`<div class="center"><h2 style="padding:0">${esc(m.label)}</h2><p class="muted">${esc(m.sub)}</p><p>${m.n} questões oficiais em ordem, com cronômetro de <b>${mins>=60?Math.floor(mins/60)+' h '+(mins%60?mins%60+' min':''):mins+' min'}</b> (3 min por questão, o ritmo da prova). A correção com o gabarito oficial aparece no final. Você pode encerrar quando quiser.</p></div><div class="actions"><button class="btn block" data-fa="oprovago" data-pid="${m.id}">Começar a prova</button><button class="btn ghost block" data-fa="otreinop" data-pid="${m.id}">Prefiro correção a cada questão</button></div>`); break; }
    case 'oprovago': { const m=OFC_MAN.find(x=>x.id===d.pid); closeModal(); ofcRun([m.id],()=>startFuv('oprova',{pool:OFC[m.id],ordered:true,n:OFC[m.id].length,exam:true,title:`${m.label} · ${m.sub.split(' · ')[0]}`})); break; }
    case 'otreinop': { const m=OFC_MAN.find(x=>x.id===d.pid); closeModal(); ofcRun([m.id],()=>startFuv('otreino',{pool:OFC[m.id],title:m.label})); break; }
    case 'osim': case 'otreino': { const tab=S.ofcTab==='ENEM'?'ENEM':'FUVEST'; let pids=OFC_MAN.filter(m=>m.exam===tab).map(m=>m.id); if(pids.length>5) pids=shuffle(pids).slice(0,5); const sim=d.fa==='osim';
      ofcRun(pids,()=>startFuv(d.fa,{pool:pids.flatMap(p=>OFC[p]),exam:sim,title:`${sim?'Simulado':'Treino'} ${tab} · questões oficiais`})); break; }
    case 'set': startFuv('treino',{set:d.set}); break;
    case 'topic': startFuv('treino',{skill:d.skill}); break;
    case 'del': modal(`<h2>Apagar "${esc(d.set)}"?</h2><p class="muted">As questões importadas deste conjunto serão removidas deste aparelho.</p><div class="actions"><button class="btn red block" data-fa="delyes" data-set="${esc(d.set)}">Apagar</button><button class="btn ghost block" data-close>Cancelar</button></div>`); break;
    case 'delyes': { const F=fv(); F.imp=F.imp.filter(q=>q.set!==d.set); save(); closeModal(); render(); toast('Conjunto apagado.'); break; }
    case 'import': importModal(); break;
    case 'impex': $('#imptxt').value=IMPORT_HELP; break;
    case 'impgo': doImport(); break;
    case 'export': exportImp(); break;
    case 'copyexp': { const t=$('#exptxt'); t.select(); let ok=false; try{ ok=document.execCommand('copy'); }catch(e){} if(navigator.clipboard) navigator.clipboard.writeText(t.value).then(()=>toast('Copiado! 📋'),()=>{ if(!ok) toast('Selecione o texto e copie manualmente.'); }); else toast(ok?'Copiado! 📋':'Selecione o texto e copie manualmente.'); break; }
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
