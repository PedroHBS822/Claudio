/* =====================================================================
   Exemplo animado: o problema acontece no laboratório, passo a passo.
   l.exa = {q, sim, cfg, set:{...}, fn(s), passos:[{txt, ate, set, fn(s), tags:[[texto,cor]], ask:{q,a,u,tol}}]}
   - set / fn: mudam o laboratório antes do passo (parâmetros ou estado)
   - ate: anima até esse instante (s)
   - tags: etiquetas que aparecem no desenho durante o passo
   - ask: "tente antes": o aluno prevê o número; o texto e a animação vêm depois
   ===================================================================== */
function ExPlayer(host,l,onDone){
  const E=l.exa; let k=-1, s=null, answered={}, tick=0;
  host.innerHTML=`<div class="exa"><div class="exq"><p class="jtag">Problema</p><div>${E.q}</div></div><div class="exlab locked" id="exlab"></div>
    <div class="expanel"><ol class="exsteps"></ol><div class="exask" aria-live="polite"></div>
    <div class="exctl"><button class="btn ghost" type="button" data-x="prev" disabled>← Voltar</button><button class="btn ghost" type="button" data-x="replay" disabled>↺ Ver de novo</button><button class="btn" type="button" data-x="next">Começar ▶</button></div></div></div>`;
  s=SIMS[E.sim]($('#exlab',host),E.cfg||{}); SIMNOW.push(s);
  /* mantém as etiquetas desenhadas mesmo com a animação parada */
  tick=setInterval(()=>{ if(!s.playing&&host.isConnected) s.render(); },120); SIMNOW.push({dispose(){ clearInterval(tick); }});
  const applySets=upto=>{ Object.assign(s.p,E.set||{}); if(E.fn) E.fn(s); for(let i=0;i<=upto;i++){ const P=E.passos[i]; if(P&&P.set) Object.assign(s.p,P.set); } };
  const lastAte=upto=>{ for(let i=upto;i>=0;i--) if(E.passos[i].ate!=null) return E.passos[i].ate; return 0; };
  function ff(t){ s.reset(); const n=s.def.sub||1; let guard=0; while(s.t<t-1e-9&&guard++<5000){ const d=Math.min(.01,t-s.t); for(let i=0;i<n;i++) s.def.step(s,d/n); s.t+=d; } s.playing=false; s.render(); }
  function overlay(i){ const P=E.passos[i]; s.overlay=P&&(P.tags||P.ov)?(g,st)=>{ (P.tags||[]).forEach(([t,c],j)=>g.tag(t,g.W*(E.tx??.5),(E.ty??22)+j*26,COL[c]||c||COL.ink,'center',13.5)); P.ov&&P.ov(g,st); }:null; }
  /* monta o laboratório no estado do passo i (sem animar) */
  function settle(i){ applySets(i); ff(i>=0?lastAte(i):0); for(let j=0;j<=i;j++) if(E.passos[j].fn) E.passos[j].fn(s); overlay(i); s.render(); }
  function list(){ const ol=$('.exsteps',host); ol.innerHTML=E.passos.slice(0,k+1).map((P,i)=>{ const hidden=P.ask&&!answered[i]; return `<li class="${i===k?'on':''}"><span>${hidden?'<span class="exwait">Tente prever antes de ver.</span>':P.txt}</span></li>`; }).join(''); }
  function show(animate){ const P=E.passos[k]; list(); $('.exask',host).innerHTML='';
    $('[data-x=prev]',host).disabled=k<=0; $('[data-x=replay]',host).disabled=k<0;
    const nb=$('[data-x=next]',host); nb.textContent=k>=E.passos.length-1?'Concluído ✓':'Próximo passo ▶'; nb.disabled=k>=E.passos.length-1;
    if(P.ask&&!answered[k]){ nb.disabled=true; ask(P); return; }
    run(P,animate); if(k===E.passos.length-1){ const x=ls(l.id); if(!x.ex){ x.ex=1; save(); onDone&&onDone(); } } }
  function run(P,animate){ applySets(k); if(P.fn) P.fn(s); overlay(k);
    if(P.ate!=null&&animate){ s.runTo(P.ate); } else if(P.ate!=null){ settle(k); } else s.render(); }
  function ask(P){ const box=$('.exask',host); let tries=0;
    box.innerHTML=`<div class="extry"><p class="jtag">Tente antes</p><div>${P.ask.q}</div><form class="ans" autocomplete="off"><input inputmode="decimal" placeholder="sua previsão" aria-label="Sua previsão"><span class="u">${P.ask.u||''}</span><button class="btn sm" type="submit">Conferir</button><button class="btn sm ghost" type="button" data-show>Mostrar</button></form><div class="jfb"></div></div>`;
    const finish=(msg)=>{ answered[k]=true; box.innerHTML=msg?`<div class="extry done">${msg}</div>`:''; list(); const nb=$('[data-x=next]',host); nb.disabled=k>=E.passos.length-1; run(P,true); if(k===E.passos.length-1){ const x=ls(l.id); if(!x.ex){ x.ex=1; save(); onDone&&onDone(); } } };
    $('form',box).addEventListener('submit',e=>{ e.preventDefault(); const v=parseNum($('input',box).value); if(isNaN(v)) return; tries++; const tol=P.ask.tol||.02, ok=Math.abs(v-P.ask.a)<=Math.max(tol*Math.abs(P.ask.a),1e-9);
      if(ok) finish(`<div class="fb ok"><b>Acertou a previsão!</b> Veja acontecer.</div>`); else if(tries>=2) finish(`<div class="fb info"><b>Era ${nf(P.ask.a)} ${P.ask.u||''}.</b> Veja como chegar lá.</div>`); else $('.jfb',box).innerHTML='<div class="fb bad">Quase. Pense no passo anterior e tente de novo.</div>'; });
    $('[data-show]',box).addEventListener('click',()=>finish('')); $('input',box).focus({preventScroll:true}); }
  host.addEventListener('click',e=>{ const b=e.target.closest('[data-x]'); if(!b||b.disabled) return; const a=b.dataset.x;
    if(a==='next'&&k<E.passos.length-1){ k++; if(k===0) settle(-1); show(true); }
    else if(a==='prev'&&k>0){ k--; settle(k); show(false); }
    else if(a==='replay'){ settle(-1); applySets(k); for(let j=0;j<=k;j++) if(E.passos[j].fn) E.passos[j].fn(s); overlay(k); const t=lastAte(k); if(t>0) s.runTo(t); } });
  settle(-1); }
