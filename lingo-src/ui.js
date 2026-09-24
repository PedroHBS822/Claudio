
/* =====================================================================
   Navegação e telas
   ===================================================================== */
let VIEW='learn',OPEN_POP=null;
const NAV=[['learn','🏠','Aprender'],['review','🧠','Revisar'],['fuvest','🎓','Provas'],['lessons','📖','Aulas'],['profile','👤','Perfil']];
const LOGO=`<svg viewBox="0 0 120 120">${mascot().replace(/^<svg[^>]*>|<\/svg>$/g,'')}</svg><span>${BRAND.app}</span>`;
function applyTheme(){ const r=document.documentElement; if(S.theme==='auto') r.removeAttribute('data-theme'); else r.setAttribute('data-theme',S.theme); }
function statsHTML(){ const lvl=lvlOf(S.xp); return `
 <button class="stat fire ${S.last===today()?'':'off'}" data-act="streak" title="Ofensiva"><span class="ic">🔥</span>${S.streak}</button>
 <button class="stat gem" data-act="gems" title="Gemas"><span class="ic">💎</span>${S.gems}</button>
 <button class="stat heart" data-act="hearts" title="Vidas"><span class="ic">❤️</span>${S.hearts}</button>
 <button class="stat lvl" data-act="level" title="Nível"><span class="ic">⭐</span>${lvl}</button>`; }
function navHTML(){ const d=dueList().length; return NAV.map(([id,ic,t])=>`<button class="navbtn ${VIEW===id?'active':''}" data-view="${id}"><span class="ic">${ic}</span>${id==='review'&&d?`<span class="badge">${d}</span>`:''}<span>${t}</span></button>`).join(''); }
function goalCard(){ const x=xpToday(),p=Math.min(100,x/S.goal*100); return `<div class="card"><div class="row between"><h3>🎯 Meta diária</h3><span class="muted" style="font-weight:800">${x}/${S.goal} XP</span></div><div class="pbar gold" style="margin-top:8px"><i style="width:${p}%"></i></div><p class="muted" style="margin-top:8px;font-size:14px">${x>=S.goal?'Meta cumprida hoje! 🎉':'Complete lições para alcançar sua meta.'}</p></div>`; }
function levelCard(){ const n=lvlOf(S.xp),a=lvlStart(n),b=lvlStart(n+1),p=(S.xp-a)/(b-a)*100; return `<div class="card"><div class="row between"><h3>⭐ Nível ${n}</h3><span class="muted" style="font-weight:800">${S.xp-a}/${b-a} XP</span></div><div class="pbar blue" style="margin-top:8px"><i style="width:${p}%"></i></div><p class="muted" style="margin-top:8px;font-size:14px">Total: <b>${nf(S.xp)} XP</b> · faltam ${b-S.xp} XP para o nível ${n+1}.</p></div>`; }
function reviewCard(){ const d=dueList(); return `<div class="card"><h3>🧠 Revisões pendentes</h3><p class="muted" style="font-size:14px;margin-bottom:12px">${d.length?`${d.length} habilidade(s) precisam de revisão hoje para não serem esquecidas.`:learned().length?'Tudo em dia! Volte amanhã para revisar.':'Conclua lições para começar a revisão espaçada.'}</p>${d.length?`<button class="btn block" data-act="review-due">Revisar agora</button>`:''}</div>`; }
function planCard(){ const d=dueList().length,c=learned().length?cardsToday():0,m=(S.mist||[]).length,cur=currentSkill();
  const rows=[];
  if(d) rows.push(['🧠',`Revisar ${d} assunto${d>1?'s':''} esfriando`,'Antes que esqueça!','data-act="review-due"','#ff9600']);
  if(c) rows.push(['🗂️',`${c} cartões de memória`,'Evocação ativa · 2 min','data-act="cards"','#ce82ff']);
  if(cur) rows.push([cur.icon,`${sk(cur.id).lv?'Continuar':'Aprender'}: ${cur.name}`,`Unidade ${cur.ui+1}`,`data-start="${cur.id}"`,cur.unit.color]);
  if(m&&rows.length<3) rows.push(['📕',`${m} erro${m>1?'s':''} no caderno`,'Reaprenda o que errou','data-act="mistakes"','#ff4b4b']);
  if(!rows.length) return '';
  return `<div class="card plan"><h3>📋 Plano de hoje</h3>${rows.map(r=>`<button class="planrow" ${r[3]}><span class="pi" style="background:${r[4]}">${r[0]}</span><span class="pt"><b>${r[1]}</b><small>${r[2]}</small></span><span class="pc">›</span></button>`).join('')}</div>`; }
function memRing(p,size){ const r=46,c=2*Math.PI*r; return `<svg viewBox="0 0 110 110" width="${size||110}" height="${size||110}" aria-hidden="true"><circle cx="55" cy="55" r="${r}" fill="none" stroke="var(--border)" stroke-width="12"/><circle cx="55" cy="55" r="${r}" fill="none" stroke="${memColor(p)}" stroke-width="12" stroke-linecap="round" stroke-dasharray="${(c*p).toFixed(1)} ${c.toFixed(1)}" transform="rotate(-90 55 55)"/><text x="55" y="63" text-anchor="middle" font-size="25" font-weight="900" fill="currentColor">${Math.round(p*100)}%</text></svg>`; }
function memCard(){ const l=learned(); if(!l.length) return ''; const R=avgRetention(); const n=[0,0,0]; l.forEach(id=>{const r=retention(id); n[r>=0.9?0:r>=0.7?1:2]++;});
  return `<div class="card memcard"><div class="row">${memRing(R,92)}<div><h3>Sua memória</h3><div class="muted" style="font-size:14px">${l.length} habilidade${l.length>1?'s':''} aprendida${l.length>1?'s':''}</div><div class="memleg"><span style="--c:#58cc02">${n[0]} fresca${n[0]===1?'':'s'}</span><span style="--c:#ff9600">${n[1]} esfriando</span><span style="--c:#ff4b4b">${n[2]} esquecendo</span></div></div></div></div>`; }
function render(){
  applyTheme(); regen();
  $('#toplogo').innerHTML=LOGO; $('#topstats').innerHTML=statsHTML();
  $('#sidebar').innerHTML=`<div class="logo">${LOGO}</div>`+navHTML(); $('#bottomnav').innerHTML=navHTML();
  $('#rightpanel').innerHTML=`<div class="stats" style="justify-content:space-between">${statsHTML()}</div>${planCard()}${goalCard()}${memCard()}${levelCard()}<div class="card"><h3>⚡ Desafio relâmpago</h3><p class="muted" style="font-size:14px;margin-bottom:12px">Quantas questões você acerta em 60 segundos? Recorde: <b>${S.timedBest}</b></p><button class="btn blue block" data-act="timed">Jogar</button></div>`;
  const v=$('#view');
  if(VIEW==='learn') v.innerHTML=renderLearn();
  else if(VIEW==='review') v.innerHTML=renderReview();
  else if(VIEW==='lessons') v.innerHTML=renderLessons();
  else if(VIEW==='fuvest') v.innerHTML=renderFuvest();
  else v.innerHTML=renderProfile();
}
const OFFS=[0,-46,-72,-46,0,46,72,46];
function unitNodes(u){ const out=[]; const n=u.skills.length;
  u.skills.forEach((s,i)=>{ out.push({t:'skill',s}); if((i+1)%4===0&&i<n-1) out.push({t:'chk',key:u.id+'-'+((i+1)/4),ids:u.skills.slice(i-3,i+1).map(x=>x.id)}); });
  const lastStart=Math.floor((n-1)/4)*4; out.push({t:'chk',key:u.id+'-f',ids:u.skills.slice(lastStart).map(x=>x.id)});
  out.push({t:'trophy',u}); return out; }
function renderLearn(){
  const cur=currentSkill();
  let h=`<div class="mobile-only" style="display:grid;gap:12px;margin-bottom:18px">${planCard()}${goalCard()}</div>`;
  UNITS.forEach((u,ui)=>{
    const open=isUnlocked(u.skills[0].idx), done=u.skills.filter(s=>sk(s.id).lv>=1).length;
    h+=`<div class="unit ${open?'':'locked'}"><div class="unit-head" style="background:${u.color};--cd:${u.dark}"><div class="uh-t"><h2><span class="ukick">Unidade ${ui+1}</span>${u.title}</h2><p>${u.sub}</p><div class="uprog"><i style="width:${done/u.skills.length*100}%"></i></div><small>${done}/${u.skills.length} habilidades</small></div><div class="uh-b"><button class="guide" data-guide="${ui}">📖 Guia</button>${!open?`<button class="guide" data-jump="${ui}">⏩ Pular</button>`:''}</div></div><div class="path">`;
    unitNodes(u).forEach((nd,i)=>{
      const off=OFFS[i%8]*(ui%2?-1:1);
      if(nd.t==='skill'){ const s=nd.s,st=sk(s.id),lv=st.lv,un=isUnlocked(s.idx),due=isDue(s.id),R=lv?retention(s.id):1;
        const cls=!un?'locked':lv>=5?'gold':'', frozen=lv>=1&&R<0.65, isCur=cur&&cur.id===s.id;
        h+=`<div class="prow ${OPEN_POP===s.id?'open':''}"><div class="nodewrap" style="transform:translateX(${off}px)">
          ${isCur&&OPEN_POP!==s.id?`<div class="startlbl" style="--c:${u.color}">${lv===0?'COMEÇAR':'CONTINUAR'}</div>`:''}
          ${un&&lv>0&&lv<5?`<div class="ring" style="--p:${lv/5*100};--c:${u.color}"></div>`:''}
          <button class="node ${cls} ${frozen?'frozen':''}" data-node="${s.id}" style="${un&&lv<5?`--c:${u.color};--cd:${u.dark}`:''}" aria-label="${s.name}"><span class="nic">${lv>=5?'★':s.icon}</span></button>
          ${lv>0?`<div class="crown">${lv}</div>`:''}${frozen?'<div class="duebadge ice" title="Quase esquecida">❄</div>':due?'<div class="duebadge" title="Revisão pendente">↻</div>':''}
          <div class="nlabel">${s.name}</div>
        </div>${OPEN_POP===s.id?popHTML(s,off):''}</div>`;
      } else if(nd.t==='chk'){ const id='chk:'+nd.key, av=S.unlockAll||nd.ids.every(x=>sk(x).lv>=1), dn=!!S.chk[nd.key];
        h+=`<div class="prow ${OPEN_POP===id?'open':''}"><div class="nodewrap" style="transform:translateX(${off}px)"><button class="node chest ${av?'':'locked'} ${dn?'opened':''}" data-node="${id}" aria-label="Ponto de revisão"><span class="nic">${dn?'🧠':'🎁'}</span></button><div class="nlabel">${dn?'Revisão':'Baú de revisão'}</div></div>${OPEN_POP===id?chkPop(nd,off,av,dn):''}</div>`;
      } else { const id='tro:'+u.id, av=S.unlockAll||u.skills.every(x=>sk(x).lv>=1), dn=!!S.trophy[u.id];
        h+=`<div class="prow ${OPEN_POP===id?'open':''}" style="height:118px"><div class="nodewrap" style="transform:translateX(${off}px)"><button class="trophybtn ${dn?'won':av?'ready':''}" data-node="${id}" aria-label="Teste da unidade">🏆</button><div class="nlabel">${dn?'Unidade dominada':'Teste da unidade'}</div></div>${OPEN_POP===id?trophyPop(u,ui,off,av,dn):''}</div>`; }
    });
    h+='</div></div>';
  });
  h+=`<div class="endcard">${mascot('happy').replace('<svg','<svg width="90"')}<p>Fim da trilha por enquanto! Mantenha tudo <b>fresco</b> com revisões e cartões de memória. 🎓</p></div>`;
  return h;
}
function popHTML(s,off){
  const u=s.unit,st=sk(s.id),un=isUnlocked(s.idx),R=retention(s.id);
  if(!un) return `<div class="pop locked"><div class="arrow" style="left:calc(50% + ${off}px)"></div><h4>${s.icon} ${s.name}</h4><p>Complete a habilidade anterior para desbloquear.</p><div class="btns"><button class="btn ghost dark block" data-theory="${s.id}">📖 Espiar a aula</button></div></div>`;
  const nd=nextReviewDays(s.id);
  const mem=st.lv?`<div class="popmem"><div class="row between"><span>🧠 Memória: <b>${Math.round(R*100)}%</b> · ${memLabel(R)}</span><span>${isDue(s.id)?'revisar hoje':'revisar em '+nd+' d'}</span></div><div class="minibar"><i style="width:${R*100}%;background:#fff"></i></div></div>`:'';
  return `<div class="pop" style="--c:${u.color};--cd:${u.dark}"><div class="arrow" style="left:calc(50% + ${off}px)"></div><h4>${s.icon} ${s.name}</h4><p>${st.lv===0?'Nova habilidade! Uma aula rápida abre a lição.':`Nível ${st.lv}/5`}</p>${mem}<div class="btns">
   <button class="btn white block" data-start="${s.id}">${st.lv===0?'Começar':st.lv>=5?'Lição extra':'Lição '+(st.lv+1)} · +15 XP</button>
   ${st.lv>=1?`<button class="btn clear block" data-practice="${s.id}">🧠 Revisar (sem perder vidas)</button>`:''}
   <button class="btn clear block" data-theory="${s.id}">📖 Ler a aula</button></div></div>`;
}
function chkPop(nd,off,av,dn){ const names=nd.ids.map(x=>SK[x].name).join(', ');
  if(!av) return `<div class="pop locked"><div class="arrow" style="left:calc(50% + ${off}px)"></div><h4>🎁 Baú de revisão</h4><p>Conclua ${names} para abrir este baú.</p></div>`;
  return `<div class="pop" style="--c:#ffc800;--cd:#e5a500;color:#5b3f00"><div class="arrow" style="left:calc(50% + ${off}px)"></div><h4>${dn?'🧠 Ponto de revisão':'🎁 Baú de revisão'}</h4><p>Revise juntos: ${names}.${dn?'':' Abra o baú: <b>+20 💎</b>.'}</p><div class="btns"><button class="btn white block" style="color:#b07d00" data-chk="${nd.key}">${dn?'Revisar de novo':'Abrir o baú'}</button></div></div>`; }
function trophyPop(u,ui,off,av,dn){
  if(!av) return `<div class="pop locked"><div class="arrow" style="left:calc(50% + ${off}px)"></div><h4>🏆 Teste da unidade</h4><p>Conclua todas as habilidades da unidade para fazer o teste final.</p></div>`;
  return `<div class="pop" style="--c:#ffc800;--cd:#e5a500;color:#5b3f00"><div class="arrow" style="left:calc(50% + ${off}px)"></div><h4>🏆 Teste da Unidade ${ui+1}</h4><p>${dn?'Você já dominou esta unidade! Refaça para manter a memória.':'15 questões de toda a unidade, até 2 erros. Vale <b>+50 💎</b> e o troféu dourado.'}</p><div class="btns"><button class="btn white block" style="color:#b07d00" data-unit="${ui}" data-act="unit">${dn?'Refazer teste':'Fazer o teste'}</button></div></div>`; }
function renderReview(){
  const d=dueList(),ls=learned(),m=(S.mist||[]).length,c=ls.length?cardsToday():0;
  let h=`<h2 class="section-title">Revisar e lembrar</h2>${memCard()||`<div class="card"><h3>🧠 Sua memória</h3><p class="muted">Conclua lições para começar. O app acompanha quanto você lembra de cada assunto e traz de volta no momento certo.</p></div>`}
  <div style="height:14px"></div>
  <div class="practice-card"><div class="pic" style="background:#fff4d6">🧠</div><div class="grow"><h3>Revisão inteligente</h3><p>${d.length?`${d.length} assunto${d.length>1?'s':''} no ponto ideal de revisão (memória ≈ 90%).`:'Nada vencendo hoje: vamos reforçar os mais fracos.'} Foca nas questões que você mais erra. +1 ❤️</p><button class="btn gold sm" data-act="${d.length?'review-due':'review-all'}" ${ls.length?'':'disabled'}>Revisar agora</button></div></div>
  <div class="practice-card"><div class="pic" style="background:#f3e3ff">🗂️</div><div class="grow"><h3>Cartões de memória</h3><p>${c?`${c} cartões para hoje.`:'Nenhum cartão para hoje.'} Tente lembrar a fórmula/conceito antes de virar — é o jeito mais eficaz de fixar.</p><button class="btn sm purple" data-act="cards" ${c?'':'disabled'}>Estudar cartões</button></div></div>
  <div class="practice-card"><div class="pic" style="background:var(--red-l)">📕</div><div class="grow"><h3>Caderno de erros</h3><p>${m?`${m} questão${m>1?'es':''} que você errou, com números novos para reaprender de verdade.`:'Vazio! Seus erros aparecem aqui para você reaprender.'}</p><button class="btn red sm" data-act="mistakes" ${m?'':'disabled'}>Reaprender</button>${m?' <button class="link" data-act="mistlist">ver lista</button>':''}</div></div>
  <div class="practice-card"><div class="pic" style="background:var(--blue-l)">⚡</div><div class="grow"><h3>Desafio relâmpago</h3><p>60 segundos, questões de tudo que está desbloqueado. Recorde: <b>${S.timedBest}</b>.</p><button class="btn blue sm" data-act="timed">Jogar</button></div></div>`;
  if(ls.length){
    h+=`<h2 class="section-title" style="margin-top:26px">Mapa da memória</h2><p class="muted" style="margin:-6px 0 12px;font-size:14px">Cada bloco é um assunto. A cor mostra quanto você ainda lembra dele hoje. Toque para praticar.</p>`;
    UNITS.forEach((u,ui)=>{ const ids=u.skills.filter(s=>sk(s.id).lv>=1); if(!ids.length)return;
      h+=`<div class="memunit"><b style="color:${u.color}">Unidade ${ui+1} · ${u.title}</b><div class="memgrid">${ids.map(s=>{const R=retention(s.id);const nd=nextReviewDays(s.id);return `<button class="memtile" data-practice="${s.id}" style="--m:${memColor(R)}"><span class="mi">${s.icon}</span><span class="mn">${s.name}</span><span class="mb"><i style="width:${R*100}%"></i></span><span class="mp">${Math.round(R*100)}% · ${isDue(s.id)?'revisar hoje':nd+' d'}</span></button>`;}).join('')}</div></div>`; });
  } else h+=`<div class="empty">${mascot().replace('<svg','<svg width="110"')}<p>Você ainda não concluiu nenhuma lição. Vá em <b>Aprender</b> e comece pela ${BRAND.firstName}!</p></div>`;
  h+=`<details class="card how"><summary><b>🔬 Como o ${BRAND.app} te faz lembrar</b></summary><ul>
   <li><b>Evocação ativa:</b> tentar lembrar (antes de ver a resposta) fixa muito mais do que reler. Por isso há cartões e questões "Relembre".</li>
   <li><b>Repetição espaçada:</b> estimamos sua memória de cada assunto (curva do esquecimento) e agendamos a revisão quando ela cai para ~90%. Cada revisão bem-sucedida aumenta o intervalo: 1 dia → 3 → 7 → 20…</li>
   <li><b>Intercalação:</b> as lições misturam assuntos antigos, e os baús de revisão juntam 4 habilidades — isso treina a escolher o método certo.</li>
   <li><b>Aprender com o erro:</b> o que você erra volta no fim da lição e entra no caderno de erros, reaparecendo com números novos.</li>
   <li><b>Foco no ponto fraco:</b> dentro de cada assunto, os tipos de questão que você mais erra aparecem com mais frequência.</li></ul></details>`;
  return h;
}
function renderLessons(){
  let h=`<h2 class="section-title">Aulas e explicações</h2><p class="muted" style="margin-bottom:12px">Teoria resumida com exemplos de cada assunto — ${BRAND.range}.</p><input class="ansin" id="lsearch" placeholder="🔎 Buscar assunto (${BRAND.searchEx})" style="font-size:17px;padding:12px 14px;margin-bottom:16px" autocomplete="off">`;
  UNITS.forEach((u,ui)=>{ h+=`<div class="lgroup"><h3 style="margin:18px 0 10px;font-weight:900;color:${u.color}">Unidade ${ui+1} · ${u.title}</h3><div class="list">`+u.skills.map(s=>`<div class="item" data-name="${normChat(s.name+' '+s.tip)}"><div class="ico" style="background:${u.color}">${s.icon}</div><div class="grow"><b>${s.name}</b><small>${s.tip.length>90?s.tip.slice(0,88)+'…':s.tip}</small></div><button class="btn sm ghost" data-theory="${s.id}">Ler</button></div>`).join('')+'</div></div>'; });
  return h;
}
function weekHTML(){ const L=['D','S','T','Q','Q','S','S']; let h='<div class="week">'; for(let i=6;i>=0;i--){ const k=addDays(today(),-i); const [y,m,d]=k.split('-').map(Number); const wd=new Date(y,m-1,d).getDay(); h+=`<div>${L[wd]}<span class="${S.days[k]?'on':''} ${i===0?'today':''}">${S.days[k]?'🔥':''}</span></div>`; } return h+'</div>'; }
function xpChart(){ const L=['D','S','T','Q','Q','S','S'],ks=[...Array(7)].map((_,i)=>addDays(today(),i-6)),v=ks.map(k=>S.days[k]||0),mx=Math.max(S.goal,...v);
  return `<div class="xpchart">${ks.map((k,i)=>{const [y,m,d]=k.split('-').map(Number);return `<div><small>${v[i]||''}</small><i style="height:${Math.max(3,v[i]/mx*90)}px;${v[i]>=S.goal?'background:var(--gold)':''}"></i><span>${L[new Date(y,m-1,d).getDay()]}</span></div>`;}).join('')}<b style="bottom:${S.goal/mx*90+22}px">meta</b></div>`; }
function renderProfile(){
  const acc=S.answered?Math.round(S.correct/S.answered*100):0, mastered=ALL.filter(s=>sk(s.id).lv>=5).length, done=learned().length;
  return `<div class="row" style="margin-bottom:18px"><div class="avatar">${esc((S.name||'E').trim()[0]||'E').toUpperCase()}</div><div class="grow" style="flex:1;min-width:0"><input class="namein" id="namein" value="${esc(S.name)}" maxlength="24" aria-label="Seu nome"><div class="muted" style="padding-left:10px;font-size:14px">Estudando desde ${S.created.split('-').reverse().join('/')}</div></div></div>
  <h2 class="section-title">Estatísticas</h2><div class="grid2">
   <div class="statbox"><span class="ic">🔥</span><div><div class="big">${S.streak}</div><small>Ofensiva atual</small></div></div>
   <div class="statbox"><span class="ic">🏅</span><div><div class="big">${S.best}</div><small>Maior ofensiva</small></div></div>
   <div class="statbox"><span class="ic">⚡</span><div><div class="big">${nf(S.xp)}</div><small>XP total</small></div></div>
   <div class="statbox"><span class="ic">⭐</span><div><div class="big">${lvlOf(S.xp)}</div><small>Nível</small></div></div>
   <div class="statbox"><span class="ic">📚</span><div><div class="big">${S.lessons}</div><small>Lições</small></div></div>
   <div class="statbox"><span class="ic">🎯</span><div><div class="big">${acc}%</div><small>Precisão (${nf(S.answered)} questões)</small></div></div>
   <div class="statbox"><span class="ic">✅</span><div><div class="big">${done}/${ALL.length}</div><small>Habilidades iniciadas</small></div></div>
   <div class="statbox"><span class="ic">💎</span><div><div class="big">${mastered}</div><small>Habilidades nível 5</small></div></div>
  </div>
  <div class="card" style="margin-top:16px"><h3>🔥 Últimos 7 dias</h3>${weekHTML()}${xpChart()}</div>
  <h2 class="section-title" style="margin-top:24px">Conquistas</h2><div class="ach">${ACH.map(a=>`<div class="${S.ach[a.id]?'':'off'}"><div class="e">${a.e}</div><b>${a.n}</b><small>${a.d}</small></div>`).join('')}</div>
  <h2 class="section-title" style="margin-top:24px">Configurações</h2><div class="card">
   <div class="setting"><div><b>Meta diária de XP</b><div class="muted" style="font-size:14px">Quanto você quer estudar por dia</div></div></div>
   <div class="seg" style="padding-bottom:12px">${[[10,'Leve'],[20,'Normal'],[30,'Séria'],[50,'Intensa']].map(([g,t])=>`<button class="${S.goal===g?'on':''}" data-goal="${g}">${t} · ${g} XP</button>`).join('')}</div>
   <div class="setting"><div><b>Efeitos sonoros</b></div><button class="switch ${S.sound?'on':''}" data-toggle="sound" aria-label="Som"></button></div>
   <div class="setting"><div><b>Tema</b></div><div class="seg">${[['auto','Auto'],['light','Claro'],['dark','Escuro']].map(([k,t])=>`<button class="${S.theme===k?'on':''}" data-theme="${k}">${t}</button>`).join('')}</div></div>
   <div class="setting"><div><b>Modo livre</b><div class="muted" style="font-size:14px">Desbloqueia todas as habilidades (ideal para professores e revisão de vestibular)</div></div><button class="switch ${S.unlockAll?'on':''}" data-toggle="unlockAll" aria-label="Modo livre"></button></div>
   <div class="setting"><div><b>Apagar progresso</b><div class="muted" style="font-size:14px">Recomeça do zero neste aparelho</div></div><button class="btn sm red" data-act="reset">Apagar</button></div>
  </div>
  <div class="card" style="margin-top:16px"><h3>Como funciona</h3><ul style="padding-left:20px;font-size:15px;color:var(--muted)"><li>Cada habilidade tem 5 níveis; cada lição concluída sobe um nível. Assuntos novos começam com uma aula rápida e um exemplo resolvido.</li><li>O app estima sua memória de cada assunto e agenda revisões quando ela cai para ~90%. Assuntos com ❄ estão quase esquecidos.</li><li>Baús 🎁 na trilha revisam 4 habilidades juntas; o 🏆 no fim da unidade é o teste final.</li><li>As lições misturam questões de revisão de habilidades anteriores (repetição espaçada).</li><li>Questões erradas voltam no fim da lição até você acertar.</li><li>Errar numa lição custa 1 ❤️. As vidas voltam com o tempo (1 a cada 30 min) ou praticando na aba Revisar.</li><li>Seu progresso fica salvo neste navegador.</li></ul></div>`;
}

/* =====================================================================
   Modais de informação
   ===================================================================== */
function openTheory(id,fromLesson){ const s=SK[id]; const un=isUnlocked(s.idx); modal(`<h2>${s.icon} ${s.name}</h2><div class="muted" style="font-weight:800;margin:-6px 0 8px">Unidade ${s.ui+1} · ${s.unit.title}</div><div class="theory">${s.theory}<h3>💡 Dica rápida</h3><p>${s.tip}</p>${s.cards?`<h3>🧠 Cartões de memória</h3><div class="cardlist">${s.cards.map(c=>`<div><span>${c[0]}</span><b>${c[1]}</b></div>`).join('')}</div>`:''}</div><div class="actions">${fromLesson?'<button class="btn block" data-close>Voltar à questão</button>':un?`<button class="btn block" data-start="${id}">Praticar agora</button><button class="btn ghost block" data-close>Fechar</button>`:'<button class="btn ghost block" data-close>Fechar</button>'}</div>`); }
function openGuide(ui){ const u=UNITS[ui]; modal(`<h2>📖 Guia · Unidade ${ui+1}</h2><p class="muted" style="margin-bottom:12px">${u.title} — ${u.sub}</p><div class="list">${u.skills.map(s=>`<div class="item"><div class="ico" style="background:${u.color}">${s.icon}</div><div class="grow"><b>${s.name}</b><small>${s.tip}</small></div><button class="btn sm ghost" data-theory="${s.id}">Ler</button></div>`).join('')}</div>`); }
function heartsModal(inLesson){
  regen(); const nx=nextHeartIn();
  modal(`<div class="center"><div style="font-size:34px;letter-spacing:4px">${'❤️'.repeat(S.hearts)}${'🤍'.repeat(MAXH-S.hearts)}</div><h2 style="padding:0;margin-top:10px">${S.hearts>0?`Você tem ${S.hearts} vida${S.hearts>1?'s':''}`:'Você ficou sem vidas!'}</h2><p class="muted">${S.hearts>=MAXH?'Vidas cheias. Cada erro numa lição custa 1 vida.':`Próxima vida em <b id="hnext">${nx}</b>. Recupere vidas praticando na aba Revisar (sem perder vidas) ou use gemas.`}</p></div>
  <div class="actions">${S.hearts<MAXH?`<button class="btn blue block" data-act="refill" ${S.gems>=REFILL?'':'disabled'}>Recarregar vidas · 💎 ${REFILL}</button><button class="btn block" data-act="review-all" ${learned().length?'':'disabled'}>🧠 Praticar para ganhar vida</button>`:''}${inLesson?'<button class="btn ghost dark block" data-act="quit">Sair da lição</button>':'<button class="btn ghost block" data-close>Fechar</button>'}</div>`,{noClose:!!inLesson});
}
function streakModal(){ modal(`<div class="center"><div style="font-size:64px">🔥</div><h2 style="padding:0">${S.streak} dia${S.streak===1?'':'s'} de ofensiva</h2><p class="muted">${S.last===today()?'Você já estudou hoje. Volte amanhã para manter a chama acesa!':'Faça uma lição hoje para '+(S.streak?'manter':'começar')+' sua ofensiva!'}</p></div>${weekHTML()}<p class="muted center" style="margin-top:14px">Maior ofensiva: <b>${S.best}</b> dias</p><div class="actions"><button class="btn block" data-close>Entendi</button></div>`); }
function levelModal(){ modal(`<h2>⭐ Seu nível</h2>${levelCard()}<div style="margin-top:12px">${goalCard()}</div><p class="muted" style="margin-top:12px">Ganhe XP concluindo lições (+15 a +25 XP), revisões e desafios. Cada nível exige um pouco mais de XP que o anterior.</p>`); }
function gemsModal(){ modal(`<div class="center"><div style="font-size:60px">💎</div><h2 style="padding:0">${S.gems} gemas</h2><p class="muted">Ganhe gemas concluindo lições (+5, ou +10 se for perfeita) e revisões (+3). Use ${REFILL} gemas para recarregar suas vidas.</p></div><div class="actions"><button class="btn block" data-close>Ok</button></div>`); }
function jumpModal(ui){ const prev=ALL.filter(s=>s.ui<ui); modal(`<div class="center"><div style="font-size:56px">⏩</div><h2 style="padding:0">Pular para a Unidade ${ui+1}?</h2><p class="muted">Faça um teste com 12 questões de ${prev.length} habilidades anteriores. Você pode errar no máximo 2 vezes. Se passar, tudo antes da Unidade ${ui+1} é desbloqueado.</p></div><div class="actions"><button class="btn block" data-act="jump" data-unit="${ui}">Começar teste</button><button class="btn ghost block" data-close>Agora não</button></div>`); }

/* =====================================================================
   Motor de lições
   ===================================================================== */
let L=null;
const TL={mc:'Escolha a resposta correta',tf:'Verdadeiro ou falso?',input:'Digite a resposta',fill:'Complete a lacuna',bank:'Toque na peça que completa'};
const PRAISE=['Muito bem!','Excelente!','Mandou bem!','Perfeito!','Isso aí!','Incrível!','Show de bola!','Você é fera!'];
function gweight(id,i){ const s=SK[id],g=sk(id).g[i]||[0,0]; let w=1+3*g[1]/(g[0]+g[1]+1); if(i===s.cardGi) w*=0.8; return w; }
function wpick(id,excl){ const s=SK[id]; let idx=s.gens.map((_,i)=>i); if(idx.length>1&&excl!=null) idx=idx.filter(i=>i!==excl); const tot=idx.reduce((a,i)=>a+gweight(id,i),0); let r=Math.random()*tot; for(const i of idx){ r-=gweight(id,i); if(r<=0) return i; } return idx[idx.length-1]; }
function makeQ(id,gi){ const s=SK[id]; const lv=Math.min(5,sk(id).lv); for(let t=0;t<6;t++){ const g=gi==null?wpick(id):gi; try{ const q=s.gens[g](lv); q.skill=id; q.gi=g; q.tries=0; return q; }catch(e){ console.error('Erro no gerador',id,g,e); gi=null; } } return null; }
function qsig(q){ return q.prompt+'|'+(q.sentence||''); }
function buildQs(ids,n,focus){ const out=[],seen=new Set(),ord={},last={}; ids.forEach(id=>ord[id]=focus?[]:shuffle(SK[id].gens.map((_,i)=>i)));
  for(let k=0;out.length<n&&k<n*8;k++){ const id=ids[k%ids.length],o=ord[id]; const gi=o.length?o.shift():wpick(id,last[id]); const q=makeQ(id,gi); if(!q||seen.has(qsig(q)))continue; seen.add(qsig(q)); last[id]=q.gi; out.push(q); }
  return out; }
function weakest(ids,n){ return ids.map(id=>{const s=sk(id);return [id,retention(id)-0.3*(s.w/(s.c+s.w+1))];}).sort((a,b)=>a[1]-b[1]).slice(0,n).map(x=>x[0]); }
function startSession(mode,opts={}){
  regen(); closeModal(); OPEN_POP=null;
  if(mode==='cards') return startCards();
  let qs=[],lives=null,intro=false;
  if(mode==='lesson'){
    if(S.hearts<=0){ heartsModal(false); return; }
    const id=opts.skill; qs=buildQs([id],10); intro=sk(id).lv===0;
    const others=learned().filter(x=>x!==id); if(others.length){ const due=others.filter(isDue); const pool=due.length?due:weakest(others,4); [3,7].forEach(p=>{ const q=makeQ(pick(pool)); if(q){q.review=true;qs.splice(p,1,q);} }); }
  } else if(mode==='review'){
    let ids=opts.ids&&opts.ids.length?opts.ids:weakest(learned(),5); if(!ids.length){ toast('Conclua uma lição primeiro! 📚'); return; }
    qs=buildQs(shuffle(ids),12,true);
  } else if(mode==='chk'){ qs=buildQs(shuffle(opts.ids),12);
  } else if(mode==='unit'){ const ids=UNITS[opts.unit].skills.map(s=>s.id); qs=buildQs(shuffle(ids),15); lives=3;
  } else if(mode==='skill'){ qs=buildQs([opts.skill],10,true);
  } else if(mode==='mistakes'){ const seen=new Set(); (S.mist||[]).forEach(m=>{ const k=m.s+'#'+m.g; if(SK[m.s]&&SK[m.s].gens[m.g]&&!seen.has(k)&&qs.length<12){ seen.add(k); const q=makeQ(m.s,m.g); if(q){ q.mist=m; qs.push(q);} } });
    if(!qs.length){ toast('Seu caderno de erros está vazio! 🎉'); return; }
    if(qs.length<8){ const ids=[...new Set(qs.map(q=>q.skill))]; qs=qs.concat(buildQs(ids,8-qs.length,true)); }
  } else if(mode==='timed'){ const pool=ALL.filter(s=>isUnlocked(s.idx)).map(s=>s.id); opts.pool=pool; qs=buildQs(shuffle(pool).slice(0,8),8);
  } else if(mode==='jump'){ const ids=ALL.filter(s=>s.ui<opts.unit).map(s=>s.id); qs=buildQs(shuffle(ids).slice(0,12),12); lives=3; }
  if(!qs.length){ toast('Não foi possível gerar questões.'); return; }
  L={mode,skill:opts.skill,unit:opts.unit,ids:opts.ids,key:opts.key,pool:opts.pool,queue:qs,i:0,total:qs.length,done:0,correct:0,wrong:0,combo:0,maxCombo:0,t0:Date.now(),per:{},missed:[],lives,timeLeft:mode==='timed'?60:null,state:'answer',sel:null,timer:null};
  $('#lesson').classList.remove('hidden'); document.body.style.overflow='hidden';
  if(mode==='timed'){ L.timer=setInterval(()=>{ if(!L||L.state==='result')return; L.timeLeft--; updTop(); if(L.timeLeft<=0) finish(); },1000); }
  if(intro) renderIntro(); else nextQ();
}
function renderIntro(){
  const s=SK[L.skill]; L.state='intro'; const ex=(s.theory.match(/<div class="ex">([\s\S]*?)<\/div>/)||[])[1];
  $('#lqbox').innerHTML=`<div class="new-tag">✨ Nova habilidade · aula rápida</div><h2 class="qtitle">${s.icon} ${s.name}</h2>
   <div class="qwrap"><div class="ms">${mascot('happy')}</div><div class="bubble">${s.tip}</div></div>
   ${ex?`<div class="intro-ex"><b>✍️ Exemplo resolvido</b><div>${ex}</div></div>`:''}
   ${s.cards?`<div class="intro-cards"><b>🧠 Para guardar na memória</b>${s.cards.slice(0,4).map(c=>`<div class="icard"><span>${c[0]}</span><b>${c[1]}</b></div>`).join('')}</div>`:''}
   <p class="muted" style="margin-top:12px;font-size:14px">Leia com atenção: logo em seguida você vai praticar e, amanhã, revisar.</p>`;
  $('#lbody').scrollTop=0; $('#lfoot').className='lfoot';
  $('#lfootin').innerHTML=`<div class="footrow"><div class="tools"><button class="toolbtn" data-act="ltheory" title="Aula completa">📖<span class="t"> Aula completa</span></button></div><button class="btn" data-act="intro-go" id="bCont">Começar a praticar</button></div>`;
  updTop();
}
/* ---------- Cartões de memória (flashcards) ---------- */
function startCards(){ const p=cardPool(); let keys=p.due.slice(0,15); keys=keys.concat(shuffle(p.fresh).slice(0,Math.max(0,Math.min(8,15-keys.length))));
  if(!keys.length){ toast('Nenhum cartão para hoje! ✅'); return; }
  L={mode:'cards',queue:keys,i:0,total:keys.length,done:0,correct:0,wrong:0,combo:0,maxCombo:0,t0:Date.now(),per:{},missed:[],again:new Set(),state:'front'};
  $('#lesson').classList.remove('hidden'); document.body.style.overflow='hidden'; renderCard(); }
function cardData(k){ const j=k.lastIndexOf(':'),id=k.slice(0,j); return {s:SK[id],c:SK[id].cards[+k.slice(j+1)],id}; }
function renderCard(){
  if(L.i>=L.queue.length) return finish();
  const k=L.queue[L.i],{s,c}=cardData(k),st=cs(k); L.state='front'; L.cur=null;
  $('#lqbox').innerHTML=`<div class="new-tag" style="color:${s.unit.color}">${s.icon} ${s.name}${st.lastT?'':' · ✨ cartão novo'}${L.again.has(k)&&L.queue.indexOf(k)<L.i?' · ⟲ de novo':''}</div><h2 class="qtitle">Você lembra?</h2>
   <div class="flash" id="flash"><div class="fface front"><small>PERGUNTA</small><div>${c[0]}</div></div><div class="fface back"><small>RESPOSTA</small><div>${c[1]}</div><em>${c[0]}</em></div></div>
   <p class="muted center" style="margin-top:14px;font-size:14px">Diga (ou pense) a resposta antes de virar o cartão.</p>`;
  $('#lbody').scrollTop=0; $('#lfoot').className='lfoot';
  $('#lfootin').innerHTML=`<div class="footrow" style="justify-content:center"><button class="btn blue" style="min-width:260px" data-act="flip" id="bCont">Mostrar resposta</button></div>`;
  updTop(); }
function flipCard(){ if(!L||L.state!=='front')return; L.state='back'; $('#flash').classList.add('flipped'); beep(SND.tap);
  const k=L.queue[L.i],c=cs(k); const prev=g=>{ if(g===1) return '&lt;1 d'; const tmp=JSON.parse(JSON.stringify(c)); const back=S.cards[k]; S.cards[k]=tmp; cardRate(k,g); const d=S.cards[k].stab; S.cards[k]=back; return d<1?'1 d':Math.round(d)+' d'; };
  $('#lfootin').innerHTML=`<div class="rate"><button class="rbtn r1" data-rate="1"><b>Errei</b><small>${prev(1)}</small></button><button class="rbtn r2" data-rate="2"><b>Difícil</b><small>${prev(2)}</small></button><button class="rbtn r3" data-rate="3"><b>Lembrei</b><small>${prev(3)}</small></button><button class="rbtn r4" data-rate="4"><b>Fácil</b><small>${prev(4)}</small></button></div>`; }
function rateCard(g){ if(!L||L.state!=='back')return; const k=L.queue[L.i]; cardRate(k,g); S.cardsDone++; const id=cardData(k).id;
  const p=L.per[id]||(L.per[id]={c:0,w:0});
  if(g===1){ L.wrong++; p.w++; L.combo=0; beep(SND.bad); if(!L.again.has(k)){ L.again.add(k); L.queue.push(k); } else L.done++; }
  else { L.correct++; p.c++; L.combo++; L.maxCombo=Math.max(L.maxCombo,L.combo); L.done++; beep(SND.ok); }
  L.i++; save(); renderCard(); }
function updTop(){
  const p=L.mode==='timed'?(L.timeLeft/60*100):L.state==='intro'?0:(L.done/L.total*100);
  const bar=$('#lprog'); bar.className='pbar'+(L.mode==='timed'?' blue':L.mode==='cards'?' purple':L.combo>=5?' orange':''); bar.firstElementChild.style.width=Math.max(0,Math.min(100,p))+'%';
  const st=$('#lstat');
  if(L.mode==='lesson'){ st.className='lhearts'; st.innerHTML=`❤️ ${S.hearts}`; }
  else if(L.mode==='timed'){ st.className='ltimer'; st.innerHTML=`⏱ ${Math.max(0,L.timeLeft)}s · ✔ ${L.correct}`; }
  else if(L.lives!=null){ st.className='lhearts'; st.innerHTML='❤️'.repeat(Math.max(0,L.lives))||'💔'; }
  else if(L.mode==='cards'){ st.className='lhearts'; st.innerHTML=`<span style="color:var(--purple)">🗂️ ${Math.min(L.i+1,L.queue.length)}/${L.queue.length}</span>`; }
  else { st.className='lhearts'; st.innerHTML='<span style="color:var(--purple)">∞</span>'; }
}
function nextQ(){
  if(L.mode==='timed'&&L.i>=L.queue.length){ let q=null; for(let t=0;t<5&&!q;t++) q=makeQ(pick(L.pool)); if(q) L.queue.push(q); }
  if(L.i>=L.queue.length) return finish();
  L.cur=L.queue[L.i]; renderQ();
}
function keysHTML(q){ const ks=q.keys||(q.numeric?['−',',','/']:[]); return ks.length?`<div class="keys">${ks.map(k=>`<button type="button" data-key="${k}">${k}</button>`).join('')}</div>`:''; }
function renderQ(){
  const q=L.cur; L.state='answer'; L.sel=null; const box=$('#lqbox');
  let h=`<div class="combo">${L.combo>=3?`🔥 ${L.combo} acertos seguidos!`:''}</div>`;
  if(q.tries>0) h+=`<div class="rev-tag" style="color:var(--orange)">⟲ Erro anterior — tente de novo</div>`;
  else if(q.mist) h+=`<div class="rev-tag" style="color:var(--red)">📕 Caderno de erros · ${SK[q.skill].name}</div>`;
  else if(q.review) h+=`<div class="rev-tag">↻ Revisão · ${SK[q.skill].name}</div>`;
  else if(L.mode!=='lesson'&&L.mode!=='skill') h+=`<div class="new-tag">${SK[q.skill].icon} ${SK[q.skill].name}</div>`;
  h+=`<h2 class="qtitle">${TL[q.type]}</h2><div class="qwrap"><div class="ms">${mascot()}</div><div class="bubble">${q.prompt}</div></div>`;
  if(q.visual) h+=`<div class="visual">${q.visual}</div>`;
  if(q.type==='mc'){ const g2=q.options.every(o=>stripHtml(o).length<16); h+=`<div class="opts ${g2?'g2':''}" id="opts">${q.options.map((o,i)=>`<button class="opt" data-i="${i}"><span class="k">${i+1}</span><span>${o}</span></button>`).join('')}</div>`; }
  else if(q.type==='tf'){ h+=`<div class="opts tf" id="opts">${q.options.map((o,i)=>`<button class="opt" data-i="${i}"><span class="e">${i?'✘':'✔'}</span>${o}</button>`).join('')}</div>`; }
  else if(q.type==='input'){ h+=`<input id="ans" class="ansin" inputmode="decimal" autocomplete="off" autocapitalize="off" spellcheck="false" placeholder="Digite sua resposta" enterkeyhint="done" aria-label="Resposta">${q.unit?`<div class="unit-note">Responda em: ${q.unit}</div>`:''}${keysHTML(q)}`; }
  else if(q.type==='fill'){ h+=`<div class="sentence">${q.sentence.replace('@@','<input id="ans" class="blank" inputmode="decimal" autocomplete="off" autocapitalize="off" spellcheck="false" enterkeyhint="done" aria-label="Lacuna">')}</div>${keysHTML(q)}`; }
  else if(q.type==='bank'){ h+=`<div class="sentence">${q.sentence.replace('@@','<span class="slot" id="slot"></span>')}</div><div class="tiles" id="tiles">${q.options.map((o,i)=>`<button class="tile" data-i="${i}">${o}</button>`).join('')}</div>`; }
  box.innerHTML=h; $('#lbody').scrollTop=0;
  $('#lfoot').className='lfoot';
  $('#lfootin').innerHTML=`<div class="footrow"><div class="tools">${L.mode==='jump'?'':'<button class="toolbtn" data-act="ltheory" title="Ver aula">📖<span class="t"> Aula</span></button>'}<button class="toolbtn" data-act="lchat" title="Tirar dúvida">💬<span class="t"> Dúvida</span></button></div><button class="btn" id="bCheck" data-act="check" disabled>Verificar</button></div>`;
  const inp=$('#ans'); if(inp){ inp.addEventListener('input',()=>{$('#bCheck').disabled=!inp.value.trim();}); if(matchMedia('(pointer:fine)').matches) setTimeout(()=>inp.focus(),50); }
  updTop();
}
function selectOpt(i){
  const q=L.cur; if(L.state!=='answer'||!q.options||i>=q.options.length) return; L.sel=q.options[i]; beep(SND.tap);
  if(q.type==='bank'){ const slot=$('#slot'); slot.innerHTML=`<button class="tile" data-unslot="1">${q.options[i]}</button>`; document.querySelectorAll('#tiles .tile').forEach((t,j)=>t.classList.toggle('used',j===i)); }
  else document.querySelectorAll('#opts .opt').forEach((b,j)=>b.classList.toggle('sel',j===i));
  $('#bCheck').disabled=false;
}
function unslot(){ if(L.state!=='answer')return; L.sel=null; $('#slot').innerHTML=''; document.querySelectorAll('#tiles .tile').forEach(t=>t.classList.remove('used')); $('#bCheck').disabled=true; }
function check(){
  if(!L||L.state!=='answer')return; const q=L.cur; let ok;
  if(q.type==='mc'||q.type==='tf'||q.type==='bank'){ if(L.sel==null)return; ok=L.sel===q.correct; }
  else { const inp=$('#ans'); const val=inp.value.trim(); if(!val)return;
    if(q.numeric&&isNaN(parseNum(val))&&!q.check(val)){ toast('Formato não reconhecido. Exemplos: 12 · −3 · 2,5 · 3/4'); inp.classList.remove('shake'); void inp.offsetWidth; inp.classList.add('shake'); return; }
    ok=q.check(val); inp.classList.add(ok?'ok':'bad'); inp.readOnly=true; }
  L.state='feedback'; q.tries++;
  const p=L.per[q.skill]||(L.per[q.skill]={c:0,w:0}); const st=sk(q.skill); S.answered++;
  const gs=st.g[q.gi]||(st.g[q.gi]=[0,0]); if(ok) gs[0]++; else gs[1]++;
  if(!ok) logMistake(q); else if(q.tries===1&&L.mode!=='lesson') resolveMistake(q);
  if(q.cardKey&&q.tries===1) cardRate(q.cardKey,ok?3:1);
  if(ok){ p.c++; st.c++; S.correct++; L.correct++; L.combo++; L.maxCombo=Math.max(L.maxCombo,L.combo); L.done++; beep(SND.ok); }
  else { p.w++; st.w++; L.wrong++; L.combo=0; beep(SND.bad); if(!L.missed.includes(q)) L.missed.push(q);
    if(L.mode==='lesson') loseHeart(); if(L.lives!=null) L.lives--;
    if(['lesson','review','skill','mistakes','chk'].includes(L.mode)&&q.tries<3) L.queue.push(q); else L.done++;
    if(L.mode==='lesson'||L.lives!=null){ const s=$('#lstat'); s.classList.remove('pulse'); void s.offsetWidth; s.classList.add('pulse'); } }
  if(q.type==='mc'||q.type==='tf'){ document.querySelectorAll('#opts .opt').forEach(b=>{ const o=q.options[+b.dataset.i]; if(o===q.correct)b.classList.add('right'); else if(o===L.sel)b.classList.add('wrong'); b.classList.remove('sel'); }); $('#opts').classList.add('done'); }
  if(q.type==='bank'){ const t=$('#slot .tile'); if(t){ t.style.borderColor=ok?'var(--green)':'var(--red)'; t.style.color=ok?'var(--green-t)':'var(--red-t)'; } }
  const box=$('#lqbox'); box.classList.remove('shake','pulse'); void box.offsetWidth; if(!ok) box.classList.add('shake');
  const ms=box.querySelector('.qwrap .ms'); if(ms) ms.innerHTML=mascot(ok?'happy':'sad');
  save(); updTop();
  const f=$('#lfoot'); f.className='lfoot '+(ok?'ok':'bad');
  const ansTxt=q.answer+(q.unit&&!/R\$/.test(q.answer)?` ${q.unit}`:'');
  $('#lfootin').innerHTML=`<div class="fbtxt"><div class="fbicon">${ok?'✔':'✘'}</div><div style="min-width:0"><div class="fbtitle">${ok?pick(PRAISE):'Resposta correta:'}</div><div class="fbdetail">${ok?`<div class="why">${q.exp||''}</div>`:`<div class="ans">${ansTxt}</div><div class="why">${q.exp||''}</div><div class="savednote">📕 Guardado no caderno de erros — vai voltar para você reaprender.</div>`}</div></div></div><div class="fbactions">${ok?'':'<button class="link" data-act="lchat">💬 Por que errei?</button>'}<button class="btn ${ok?'':'red'}" data-act="cont" id="bCont">Continuar</button></div>`;
  if(L.combo>0&&L.combo%5===0) toast(`🔥 ${L.combo} acertos seguidos!`,1400);
  if(L.mode==='timed'&&ok){ const cur=q; setTimeout(()=>{ if(L&&L.cur===cur&&L.state==='feedback') cont(); },650); }
  else if(matchMedia('(pointer:fine)').matches) setTimeout(()=>{ const b=$('#bCont'); if(b) b.focus({preventScroll:true}); },30);
}
function cont(){
  if(!L||L.state!=='feedback')return;
  if(L.mode==='lesson'&&S.hearts<=0){ heartsModal(true); return; }
  if(L.lives!=null&&L.lives<=0) return finish(true);
  L.i++; nextQ();
}
function quitLesson(){ if(L&&L.timer)clearInterval(L.timer); L=null; closeModal(); $('#lesson').classList.add('hidden'); document.body.style.overflow=''; closeChat(); render(); }
function askQuit(){
  if(!L||L.state==='result') return quitLesson();
  if(L.mode==='timed'){ return finish(); }
  if(L.mode==='fuv'&&L.state==='result') return quitLesson();
  if(L.mode==='fuv'&&L.exam){ modal(`<div class="center"><h2 style="padding:0">Encerrar o simulado?</h2><p class="muted">As questões não respondidas contam como em branco e você verá a correção comentada.</p></div><div class="actions"><button class="btn block" data-close>Continuar o simulado</button><button class="btn red block" data-fa="endsim">Encerrar e corrigir</button></div>`); return; }
  if(L.mode==='cards'){ return L.done?finish():quitLesson(); }
  modal(`<div class="center"><div style="width:120px;margin:0 auto">${mascot('sad')}</div><h2 style="padding:0">Espere, não vá embora!</h2><p class="muted">Se sair agora, você perderá o progresso desta ${L.mode==='lesson'?'lição':'sessão'}.</p></div><div class="actions"><button class="btn block" data-close>Continuar estudando</button><button class="btn ghost dark block" data-act="quit">Sair</button></div>`);
}
function finish(failed){
  if(!L||L.state==='result')return; if(L.timer)clearInterval(L.timer);
  L.state='result';
  const answered=L.correct+L.wrong, acc=answered?L.correct/answered:0, secs=Math.round((Date.now()-L.t0)/1000);
  let xp=0,gems=0,title='',sub='',fail=!!failed;
  const perfect=L.wrong===0&&answered>0;
  if(L.mode==='lesson'){ xp=15+(perfect?5:0)+Math.min(5,Math.floor(L.maxCombo/5)*2); gems=perfect?10:5; const st=sk(L.skill); st.lv=Math.min(5,st.lv+1); st.n++; S.lessons++; if(perfect)S.perfect++; title=perfect?'Lição perfeita!':'Lição concluída!'; sub=`${SK[L.skill].name} · nível ${st.lv}/5`; }
  else if(['review','skill','mistakes','chk'].includes(L.mode)){ xp=10+Math.min(10,L.correct); gems=3; S.reviews++; const had=S.hearts; S.hearts=Math.min(MAXH,S.hearts+1); if(S.hearts>=MAXH)S.heartTs=0; title=L.mode==='mistakes'?'Erros revisados!':'Revisão concluída!'; sub=had<MAXH?'+1 ❤️ recuperada':'Memória fortalecida 🧠';
    if(L.mode==='chk'){ if(!S.chk[L.key]){ gems+=20; title='Baú aberto! 🎁'; } S.chk[L.key]=today(); } }
  else if(L.mode==='cards'){ xp=Math.min(20,5+L.correct); gems=2; title='Cartões revisados!'; sub=`${L.correct} lembrados · ${L.wrong} para rever`; if(!L.done)fail=true; }
  else if(L.mode==='timed'){ xp=L.correct*2; const rec=L.correct>S.timedBest; if(rec)S.timedBest=L.correct; title='Tempo esgotado!'; sub=rec?`🏆 Novo recorde: ${L.correct} acertos!`:`${L.correct} acertos · recorde ${S.timedBest}`; if(L.correct===0)fail=true; }
  else if(L.mode==='unit'){ const u=UNITS[L.unit]; if(!fail&&L.lives>0){ xp=40; if(!S.trophy[u.id]) gems=50; S.trophy[u.id]=today(); title='Unidade dominada! 🏆'; sub=`Unidade ${L.unit+1} · ${u.title}`; } else { fail=true; title='Quase lá!'; sub='Revise os assuntos em que errou e tente o teste de novo.'; } }
  else if(L.mode==='jump'){ if(!fail&&L.lives>0){ xp=30; gems=20; ALL.filter(s=>s.ui<L.unit).forEach(s=>{ const st=sk(s.id); if(st.lv<1){ st.lv=1; st.stab=1; st.lastT=Date.now(); } }); title='Teste aprovado!'; sub=`Unidade ${L.unit+1} desbloqueada ⏩`; } else { fail=true; title='Não foi dessa vez'; sub='Estude as unidades anteriores e tente de novo.'; } }
  if(L.mode!=='cards') Object.entries(L.per).forEach(([id,p])=>{ if(sk(id).lv>=1) memUpdate(id,p.c/(p.c+p.w||1)); });
  let streakUp=false; if(xp>0) streakUp=markStudy(xp);
  S.gems+=gems; checkAch(); save();
  beep(fail?SND.fail:SND.done); if(!fail) confetti();
  const mm=Math.floor(secs/60),ss=secs%60;
  const rs=(c,hd,v)=>`<div class="rstat" style="--c:${c}"><div class="h">${hd}</div><div class="v">${v}</div></div>`;
  const memIds=L.mode==='cards'?[]:Object.keys(L.per).filter(id=>sk(id).lv>=1).slice(0,5);
  const memBox=memIds.length?`<div class="card memres"><b>🧠 Memória atualizada</b>${memIds.map(id=>{const R=retention(id),nd=nextReviewDays(id);return `<div class="mr"><span>${SK[id].icon} ${SK[id].name}</span><span class="muted">próxima revisão ${nd<=0?'hoje':nd===1?'amanhã':'em '+nd+' dias'}</span></div>`;}).join('')}<small class="muted">Revisar no dia certo faz o intervalo crescer: você passa a lembrar por mais tempo com menos esforço.</small></div>`:'';
  const missed=L.missed.length?`<div class="mistakes"><details><summary>📝 Revisar ${L.missed.length} questão(ões) que você errou</summary>${L.missed.map(q=>`<div class="mq"><div>${q.type==='fill'||q.type==='bank'?q.prompt+'<br>'+q.sentence.replace('@@','<b>___</b>'):q.prompt}</div><div style="margin-top:6px;color:var(--green-t);font-weight:800">✔ ${q.answer}${q.unit&&!/R\$/.test(q.answer)?' '+q.unit:''}</div><div class="muted" style="font-size:14px">${q.exp||''}</div></div>`).join('')}</details></div>`:'';
  $('#lqbox').innerHTML=`<div class="result"><div class="ms">${mascot(fail?'sad':'happy')}</div><h1 class="${fail?'fail':''}">${title}</h1><p class="muted" style="font-weight:800">${sub}</p>
   <div class="rstats">${rs('#ffc800','XP ganho','⚡ '+xp)}${rs('#58cc02',L.mode==='cards'?'Lembrados':'Precisão',Math.round(acc*100)+'%')}${L.mode==='timed'?rs('#1cb0f6','Acertos','✔ '+L.correct):rs('#1cb0f6','Tempo',`⏱ ${mm}:${pad(ss)}`)}</div>
   ${streakUp?`<div class="card" style="border-color:var(--orange);width:100%"><b style="color:var(--orange)">🔥 Ofensiva de ${S.streak} dia${S.streak>1?'s':''}!</b><div class="muted" style="font-size:14px">Volte amanhã para continuar a sequência.</div></div>`:''}
   ${gems?`<div class="muted" style="font-weight:800">+${gems} 💎 gemas</div>`:''}${xpToday()>=S.goal&&xpToday()-xp<S.goal?'<div style="font-weight:900;color:var(--gold-d)">🎯 Meta diária cumprida!</div>':''}
   ${memBox}${missed}</div>`;
  $('#lbody').scrollTop=0; $('#lprog').firstElementChild.style.width=(fail?L.done/L.total*100:100)+'%';
  $('#lfoot').className='lfoot';
  $('#lfootin').innerHTML=`<div class="footrow" style="justify-content:flex-end">${L.mode==='timed'?'<button class="btn ghost" data-act="timed">Jogar de novo</button>':''}${L.mode==='unit'&&fail?`<button class="btn ghost" data-act="review-unit" data-unit="${L.unit}">Revisar a unidade</button>`:''}<button class="btn" data-act="quit" id="bCont">Continuar</button></div>`;
  updTopFinal();
}
function updTopFinal(){ const st=$('#lstat'); if(L&&L.mode==='lesson'){st.innerHTML=`❤️ ${S.hearts}`;} }

/* =====================================================================
   Chat
   ===================================================================== */
let chatStarted=false;
function botMsg(html){ const b=$('#chatb'); const d=document.createElement('div'); d.className='msg bot'; d.innerHTML=html; b.appendChild(d); b.scrollTop=b.scrollHeight; }
function meMsg(t){ const b=$('#chatb'); const d=document.createElement('div'); d.className='msg me'; d.textContent=t; b.appendChild(d); b.scrollTop=b.scrollHeight; }
function chips(){ const inL=L&&L.cur&&L.state!=='result'&&!$('#lesson').classList.contains('hidden'); const c=inL?(L.state==='feedback'?['Por que essa é a resposta?','Explique o conceito','Me dê outra dica']:['Me dê uma dica','Como resolvo?','Explique o conceito','Mostrar resposta']):BRAND.chips; $('#chips').innerHTML=c.map(x=>`<button class="chip" data-chip="${esc(x)}">${x}</button>`).join(''); }
function openChat(){
  const c=$('#chat'); c.classList.add('open'); c.setAttribute('aria-hidden','false'); $('#chatav').innerHTML=mascot();
  const inL=L&&L.cur&&L.state!=='result'&&!$('#lesson').classList.contains('hidden');
  if(!chatStarted){ chatStarted=true; botMsg(`Olá! Eu sou o <b>${BRAND.tutor}</b> ${BRAND.sym}, seu tira-dúvidas. Posso explicar conceitos, dar dicas na questão atual e fazer contas (ex.: <b>2^10</b>, <b>raiz de 144</b>, <b>15% de 80</b>).`); }
  if(inL){ const q=L.cur; if(L.chatQ!==q){ L.chatQ=q; botMsg(`Estou vendo sua questão de <b>${SK[q.skill].name}</b>:<div class="ex">${q.type==='fill'||q.type==='bank'?q.sentence.replace('@@','___'):q.prompt}</div>${L.state==='feedback'?'Quer que eu explique a resolução?':'Quer uma <b>dica</b> ou o <b>método</b> para resolver?'}`); } }
  chips(); if(matchMedia('(pointer:fine)').matches) setTimeout(()=>$('#chatin').focus(),260);
}
function closeChat(){ const c=$('#chat'); c.classList.remove('open'); c.setAttribute('aria-hidden','true'); }
function ask(text){ if(!text.trim())return; meMsg(text); const b=$('#chatb'); const t=document.createElement('div'); t.className='msg bot typing'; t.textContent='•••'; b.appendChild(t); b.scrollTop=b.scrollHeight; setTimeout(()=>{ t.remove(); let r; try{ r=tutor(text); }catch(e){ r='Ops, me confundi. Pode reformular?'; } botMsg(r); chips(); },450+Math.random()*350); }

/* =====================================================================
   Eventos
   ===================================================================== */
document.addEventListener('click',e=>{
  const t=e.target.closest('button,[data-node]');
  if(!t){ if(OPEN_POP&&!e.target.closest('.pop')){ OPEN_POP=null; if(VIEW==='learn') render(); } return; }
  const d=t.dataset;
  if(d.view){ VIEW=d.view; OPEN_POP=null; render(); window.scrollTo(0,0); return; }
  if(d.node){ OPEN_POP=OPEN_POP===d.node?null:d.node; render(); beep(SND.tap); return; }
  if(d.start){ closeModal(); startSession('lesson',{skill:d.start}); return; }
  if(d.practice){ startSession('skill',{skill:d.practice}); return; }
  if(d.theory){ openTheory(d.theory,!!(L&&!$('#lesson').classList.contains('hidden')&&L.state!=='result')); return; }
  if(d.guide!=null){ openGuide(+d.guide); return; }
  if(d.jump!=null){ jumpModal(+d.jump); return; }
  if(d.goal){ S.goal=+d.goal; save(); render(); return; }
  if(d.theme){ S.theme=d.theme; save(); render(); return; }
  if(d.toggle){ S[d.toggle]=!S[d.toggle]; save(); render(); return; }
  if(d.key){ const inp=$('#ans'); if(inp&&!inp.readOnly){ const k=d.key==='−'?'-':d.key; const s=inp.selectionStart??inp.value.length,en=inp.selectionEnd??inp.value.length; inp.value=inp.value.slice(0,s)+k+inp.value.slice(en); inp.focus(); inp.setSelectionRange(s+1,s+1); inp.dispatchEvent(new Event('input')); } return; }
  if(d.chip){ ask(d.chip); return; }
  if(d.chk){ const u=UNITS.find(x=>d.chk.startsWith(x.id+'-')); const nd=unitNodes(u).find(n=>n.t==='chk'&&n.key===d.chk); startSession('chk',{ids:nd.ids,key:d.chk}); return; }
  if(d.rate){ rateCard(+d.rate); return; }
  if(t.classList.contains('opt')&&L&&L.mode!=='fuv'){ selectOpt(+d.i); return; }
  if(t.classList.contains('tile')&&L){ if(d.unslot) unslot(); else if(d.i!=null) selectOpt(+d.i); return; }
  switch(d.act){
    case 'streak': streakModal(); break;
    case 'gems': gemsModal(); break;
    case 'hearts': heartsModal(false); break;
    case 'level': levelModal(); break;
    case 'review-due': { const ids=dueList(); if(ids.length) startSession('review',{ids:ids.slice(0,6)}); else toast('Nenhuma revisão pendente! ✅'); break; }
    case 'review-all': { const inLesson=L&&!$('#lesson').classList.contains('hidden'); if(inLesson){ if(L.timer)clearInterval(L.timer); L=null; $('#lesson').classList.add('hidden'); } startSession('review',{}); break; }
    case 'mistakes': startSession('mistakes'); break;
    case 'cards': startSession('cards'); break;
    case 'flip': flipCard(); break;
    case 'intro-go': L.state='answer'; nextQ(); break;
    case 'unit': startSession('unit',{unit:+d.unit}); break;
    case 'review-unit': { const u=+d.unit; quitLesson(); startSession('review',{ids:weakest(UNITS[u].skills.map(s=>s.id),5)}); break; }
    case 'mistlist': modal(`<h2>📕 Caderno de erros</h2><p class="muted" style="margin-bottom:10px">Questões que você errou recentemente. No treino, elas voltam com números novos.</p><div class="list">${(S.mist||[]).slice(0,40).map(m=>`<div class="item" style="display:block"><small style="color:${SK[m.s]?SK[m.s].unit.color:'inherit'};font-weight:800">${SK[m.s]?SK[m.s].icon+' '+SK[m.s].name:''}</small><div style="font-size:15px">${esc(m.p)}</div><div style="color:var(--green-t);font-weight:800;font-size:14px">✔ ${esc(m.a)}</div></div>`).join('')}</div><div class="actions"><button class="btn red block" data-act="mistakes">Reaprender agora</button></div>`); break;
    case 'nudge-go': closeModal(); { const ids=dueList(); startSession('review',{ids:ids.slice(0,6)}); } break;
    case 'timed': { if(L&&L.timer)clearInterval(L.timer); L=null; startSession('timed'); break; }
    case 'jump': startSession('jump',{unit:+d.unit}); break;
    case 'refill': if(S.gems>=REFILL){ S.gems-=REFILL; S.hearts=MAXH; S.heartTs=0; save(); closeModal(); toast('❤️ Vidas recarregadas!'); if(L&&L.state==='feedback'){ updTop(); } else render(); } break;
    case 'quit': quitLesson(); break;
    case 'check': check(); break;
    case 'cont': cont(); break;
    case 'ltheory': openTheory(L.cur.skill,true); break;
    case 'lchat': openChat(); break;
    case 'reset': modal(`<h2>Apagar todo o progresso?</h2><p class="muted">XP, ofensiva, níveis e conquistas deste aparelho serão perdidos. Isso não pode ser desfeito.</p><div class="actions"><button class="btn red block" data-act="reset-yes">Sim, apagar tudo</button><button class="btn ghost block" data-close>Cancelar</button></div>`); break;
    case 'reset-yes': S=defState(); save(); closeModal(); VIEW='learn'; render(); toast('Progresso apagado.'); break;
  }
});
$('#lclose').addEventListener('click',askQuit);
$('#fab').addEventListener('click',openChat);
$('#chatclose').addEventListener('click',closeChat);
$('#chatf').addEventListener('submit',e=>{ e.preventDefault(); const i=$('#chatin'); const v=i.value; i.value=''; ask(v); });
document.addEventListener('input',e=>{
  if(e.target.id==='namein'){ S.name=e.target.value.slice(0,24)||'Estudante'; save(); const av=document.querySelector('.avatar'); if(av) av.textContent=(S.name.trim()[0]||'E').toUpperCase(); }
  if(e.target.id==='lsearch'){ const q=normChat(e.target.value); document.querySelectorAll('#view .item[data-name]').forEach(it=>{ it.style.display=!q||it.dataset.name.includes(q)?'':'none'; }); }
});
document.addEventListener('keydown',e=>{
  if(e.key==='Escape'){ if($('#chat').classList.contains('open')) closeChat(); else if(modalOpen()&&$('.modal-bg .close')) closeModal(); return; }
  if(!L||$('#lesson').classList.contains('hidden')||modalOpen()) return;
  if(document.activeElement&&document.activeElement.id==='chatin') return;
  if(L.mode==='fuv'){ fuvKey(e); return; }
  if(L.mode==='cards'){ if((e.key==='Enter'||e.key===' ')&&L.state==='front'){ e.preventDefault(); flipCard(); } else if(L.state==='back'&&/^[1-4]$/.test(e.key)) rateCard(+e.key); else if(e.key==='Enter'&&L.state==='result'){ e.preventDefault(); quitLesson(); } return; }
  if(e.key==='Enter'){ e.preventDefault(); if(L.state==='intro'){ L.state='answer'; nextQ(); } else if(L.state==='answer') check(); else if(L.state==='feedback') cont(); else if(L.state==='result') quitLesson(); return; }
  if(L.state==='answer'&&/^[1-9]$/.test(e.key)&&['mc','tf','bank'].includes(L.cur.type)){ selectOpt(+e.key-1); }
});
setInterval(()=>{ const h=S.hearts; regen(); if(S.hearts!==h){ if(!L||$('#lesson').classList.contains('hidden')) render(); } const hn=$('#hnext'); if(hn) hn.textContent=nextHeartIn(); },1000);
document.addEventListener('visibilitychange',()=>{ if(!document.hidden){ checkStreak(); regen(); if(!L||$('#lesson').classList.contains('hidden')) render(); } });

/* =====================================================================
   Início
   ===================================================================== */
checkStreak(); render();
setTimeout(()=>{ const d=dueList(); if(d.length&&S.nudged!==today()&&S.last!==today()&&!modalOpen()){ S.nudged=today(); save();
  modal(`<div class="center"><div style="width:120px;margin:0 auto">${mascot()}</div><h2 style="padding:0">Hora de relembrar!</h2><p class="muted">${d.length} assunto${d.length>1?'s estão':' está'} esfriando: <b>${d.slice(0,3).map(id=>SK[id].name).join(', ')}${d.length>3?'…':''}</b>. Uma revisão rápida agora faz você lembrar deles por muito mais tempo.</p></div><div class="actions"><button class="btn block" data-act="nudge-go">Revisar agora (3 min)</button><button class="btn ghost block" data-close>Depois</button></div>`); } },500);
if(!S.lessons&&!localStorage.getItem(LSK+'_hi')){ try{localStorage.setItem(LSK+'_hi','1');}catch(e){} setTimeout(()=>modal(`<div class="center"><div style="width:140px;margin:0 auto">${mascot('happy')}</div><h2 style="padding:0">Bem-vindo ao ${BRAND.app}!</h2><p class="muted">${BRAND.welcome} Eu sou o <b>${BRAND.tutor}</b> e vou te ajudar no caminho!</p></div><div class="actions"><button class="btn block" data-start="${BRAND.first}">Começar do básico</button><button class="btn ghost block" data-close>Explorar a trilha</button></div><p class="muted center" style="font-size:13px;margin-top:12px">Já sabe o básico? Use o botão <b>⏩ Pular</b> nas unidades para fazer um teste de nivelamento.</p>`),350); }
</script>
</body>
</html>
