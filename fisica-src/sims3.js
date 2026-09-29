/* =====================================================================
   Laboratórios de óptica, eletricidade, magnetismo e física moderna
   ===================================================================== */

/* diagrama de raios para espelhos esféricos e lentes (aproximação de raios paraxiais) */
function rayDiagram(g,s,kind){
  const mirror=kind==='mirror', conv=s.p.t==='c', f=(conv?1:-1)*s.p.f, p=s.p.p, inf=Math.abs(1/f-1/p)<1e-9, pi=inf?Infinity:1/(1/f-1/p), A=inf?Infinity:-pi/p;
  const xm=mirror?g.W*.66:g.W*.5, cy=g.H*.55, span=Math.max(p,Math.min(Math.abs(pi),60),2*s.p.f)*1.08, k=(mirror?xm-20:xm-20)/span, ho=Math.min(46,g.H*.2);
  const side=mirror?-1:1, xo=xm-p*k, ix=inf?null:(mirror?xm-pi*k:xm+pi*k), hi=inf?0:A*ho;
  g.line(0,cy,g.W,cy,COL.muted,1.2);
  if(mirror){ const bulge=conv?14:-14; g.ctx.save(); g.ctx.strokeStyle=COL.ink; g.ctx.lineWidth=3; g.ctx.beginPath(); g.ctx.moveTo(xm-bulge,cy-g.H*.42); g.ctx.quadraticCurveTo(xm+bulge,cy,xm-bulge,cy+g.H*.42); g.ctx.stroke(); g.ctx.restore(); g.text(conv?'lado refletor ←':'lado refletor ←',xm-4,cy-g.H*.42-6,{size:11,c:COL.muted,align:'right'}); }
  else { g.line(xm,cy-g.H*.42,xm,cy+g.H*.42,COL.ink,2.5); const tip=(y,d)=>{ g.line(xm,y,xm-8,y+d*8*(conv?1:-1),COL.ink,2.5); g.line(xm,y,xm+8,y+d*8*(conv?1:-1),COL.ink,2.5); }; tip(cy-g.H*.42,1); tip(cy+g.H*.42,-1); }
  const fx=xm+side*f*k, lab=(x,t)=>{ g.line(x,cy-5,x,cy+5,COL.ink,2); g.text(t,x,cy+20,{size:12,align:'center',c:COL.muted,bold:true}); };
  if(mirror){ lab(xm-f*k,'F'); lab(xm-2*f*k,'C'); } else { lab(xm-s.p.f*k,conv?'F':'F\''); lab(xm+s.p.f*k,conv?'F\'':'F'); }
  const O=[xo,cy-ho]; g.arrow(xo,cy,xo,cy-ho,COL.vel,'objeto',3);
  const rays=[[xm,cy-ho],mirror?[xm,cy]:[xm,cy]], out=(H,dir,c,dash)=>{ const L=2000/Math.hypot(dir[0],dir[1]); g.line(H[0],H[1],H[0]+dir[0]*L,H[1]+dir[1]*L,c,2,dash); };
  const cols=[COL.force,COL.acc];
  rays.forEach((H,i)=>{ g.line(O[0],O[1],H[0],H[1],cols[i],2);
    if(inf){ const v=[xm-O[0],cy-O[1]]; out(H,mirror?[-v[0],v[1]]:v,cols[i]); return; }
    const I=[ix,cy-hi], real=pi>0; if(real) out(H,[I[0]-H[0],I[1]-H[1]],cols[i]); else { out(H,[H[0]-I[0],H[1]-I[1]],cols[i]); g.line(H[0],H[1],I[0],I[1],cols[i],1.5,[5,5]); } });
  if(!inf&&Math.abs(pi)<400) g.arrow(ix,cy,ix,cy-hi,COL.energy,'imagem',3);
  return {pi,A,inf}; }
function rayReads(s,kind){ const conv=s.p.t==='c', f=(conv?1:-1)*s.p.f, p=s.p.p, inf=Math.abs(1/f-1/p)<1e-9; if(inf) return [['Posição da imagem p\'','no infinito (imagem imprópria)'],['Por quê?','o objeto está exatamente no foco']];
  const pi=1/(1/f-1/p), A=-pi/p, real=pi>0; return [['Posição da imagem p\'',nt(pi)+' cm'+(kind==='mirror'?(real?' (na frente do espelho)':' (atrás do espelho)'):(real?' (do outro lado da lente)':' (do mesmo lado do objeto)'))],['Aumento A = −p\'/p',nt(A)],['Natureza',`${real?'real':'virtual'}, ${A<0?'invertida':'direita'}, ${Math.abs(A)>1.001?'maior':Math.abs(A)<.999?'menor':'do mesmo tamanho'}`],['Vergência V = 1/f (f em metros)',nt(1/(f/100))+' di']]; }
SIMS.mirror=(host)=>Sim(host,{alt:'Espelho esférico com raios de luz formando a imagem de um objeto',h:w=>Math.min(360,Math.max(280,w*.5)),
  legend:[['vel','objeto'],['energy','imagem'],['force','raio paralelo ao eixo'],['acc','raio que bate no vértice']],
  ctrls:[{k:'t',l:'Espelho',opts:[['c','côncavo'],['v','convexo']],v:'c',live:true},{k:'f',l:'Distância focal |f|',min:5,max:20,step:1,v:10,u:'cm',live:true},{k:'p',l:'Distância do objeto p',min:2,max:40,step:1,v:25,u:'cm',live:true}],
  draw(g,s){ rayDiagram(g,s,'mirror'); }, reads:s=>rayReads(s,'mirror')});
SIMS.lens=(host)=>Sim(host,{alt:'Lente com raios de luz formando a imagem de um objeto',h:w=>Math.min(360,Math.max(280,w*.5)),
  legend:[['vel','objeto'],['energy','imagem'],['force','raio paralelo ao eixo'],['acc','raio pelo centro óptico']],
  ctrls:[{k:'t',l:'Lente',opts:[['c','convergente'],['v','divergente']],v:'c',live:true},{k:'f',l:'Distância focal |f|',min:5,max:20,step:1,v:10,u:'cm',live:true},{k:'p',l:'Distância do objeto p',min:2,max:40,step:1,v:25,u:'cm',live:true}],
  draw(g,s){ rayDiagram(g,s,'lens'); }, reads:s=>rayReads(s,'lens')});

/* refração e reflexão total */
const NS=[[1,'ar (1,00)'],[1.33,'água (1,33)'],[1.5,'vidro (1,50)'],[2.42,'diamante (2,42)']];
SIMS.refr=(host)=>Sim(host,{alt:'Raio de luz passando de um meio para outro e mudando de direção',h:320,
  legend:[['force','raio incidente'],['vel','raio refratado'],['muted','raio refletido']],
  ctrls:[{k:'n1',l:'Meio de cima',opts:NS.map(x=>[x[0],x[1]]),v:1,live:true},{k:'n2',l:'Meio de baixo',opts:NS.map(x=>[x[0],x[1]]),v:1.33,live:true},{k:'a',l:'Ângulo de incidência θ₁',min:0,max:89,step:1,v:40,u:'°',live:true}],
  draw(g,s){ const cx=g.W/2, cy=g.H/2, L=Math.min(g.W*.45,g.H*.47), a=s.p.a*Math.PI/180, sn=s.p.n1*Math.sin(a)/s.p.n2, tir=sn>1;
    g.rect(0,cy,g.W,g.H-cy,COL.vel+(s.p.n2>1.4?'30':s.p.n2>1?'1e':'08'),null,0); if(s.p.n1>1) g.rect(0,0,g.W,cy,COL.vel+(s.p.n1>1.4?'30':'1e'),null,0);
    g.line(0,cy,g.W,cy,COL.ink,1.5); g.line(cx,cy-L,cx,cy+L,COL.muted,1,[5,5]); g.text('normal',cx+6,cy-L+12,{size:11,c:COL.muted});
    const si=[cx-Math.sin(a)*L,cy-Math.cos(a)*L]; g.line(si[0],si[1],cx,cy,COL.force,3); g.arrow(si[0],si[1],(si[0]+cx)/2,(si[1]+cy)/2,COL.force,null,3);
    g.arrow(cx,cy,cx+Math.sin(a)*L,cy-Math.cos(a)*L,tir?COL.force:COL.muted,tir?'reflexão total':null,tir?3:1.5);
    if(!tir){ const b=Math.asin(sn); g.arrow(cx,cy,cx+Math.sin(b)*L,cy+Math.cos(b)*L,COL.vel,'θ₂ = '+nt(b*180/Math.PI,3)+'°',3); }
    g.text(NS.find(x=>x[0]===s.p.n1)[1],12,20,{size:12,c:COL.muted}); g.text(NS.find(x=>x[0]===s.p.n2)[1],12,g.H-10,{size:12,c:COL.muted});
    g.text('θ₁ = '+s.p.a+'°',si[0]+8,si[1]+16,{size:12,c:COL.force,bold:true}); },
  reads:s=>{ const a=s.p.a*Math.PI/180, sn=s.p.n1*Math.sin(a)/s.p.n2; return [['n₁·sen θ₁',nt(s.p.n1*Math.sin(a),3)],['θ₂ (Snell: n₁ sen θ₁ = n₂ sen θ₂)',sn>1?'não existe: reflexão total':nt(Math.asin(sn)*180/Math.PI,3)+'°'],['Ângulo limite',s.p.n1>s.p.n2?nt(Math.asin(s.p.n2/s.p.n1)*180/Math.PI,3)+'°':'não há (a luz vai para um meio mais refringente)'],['Velocidade da luz embaixo c/n₂',nf(3e8/s.p.n2)+' m/s']]; }});

/* lei de Coulomb */
SIMS.coulomb=(host)=>Sim(host,{alt:'Duas cargas elétricas com as forças de atração ou repulsão',h:250,
  legend:[['force','carga positiva'],['vel','carga negativa']],
  ctrls:[{k:'q1',l:'Carga 1',min:-5,max:5,step:1,v:2,u:'μC',live:true},{k:'q2',l:'Carga 2',min:-5,max:5,step:1,v:-3,u:'μC',live:true},{k:'d',l:'Distância',min:.1,max:1,step:.05,v:.3,u:'m',live:true}],
  draw(g,s){ const F=9e-3*s.p.q1*s.p.q2/s.p.d**2, k=(g.W-120)/1.1, cy=g.H/2+10, x1=g.W/2-s.p.d*k/2, x2=g.W/2+s.p.d*k/2, rep=F>0, L=F===0?0:clamp(18+24*Math.log10(1+Math.abs(F)*10),10,110);
    g.line(x1,cy+44,x2,cy+44,COL.muted,1.2); g.text('d = '+nt(s.p.d)+' m',(x1+x2)/2,cy+60,{size:12,c:COL.muted,align:'center'});
    [[x1,s.p.q1,-1],[x2,s.p.q2,1]].forEach(([x,q,sd])=>{ const r=12+Math.abs(q)*3, c=q>0?COL.force:q<0?COL.vel:COL.muted; g.circle(x,cy,r,c,COL.ink,1.5); g.text(q>0?'+':q<0?'−':'0',x,cy+6,{size:18,bold:true,align:'center',c:'#fff'}); g.text(nt(q)+' μC',x,cy-r-8,{size:12,align:'center',bold:true});
      if(L) g.arrow(x+sd*(r+4)*(rep?1:-1),cy,x+sd*(rep?1:-1)*(r+4+L),cy,COL.ink,'F',3,[0,-16]); });
    g.text(F===0?'sem força (uma das cargas é zero)':rep?'sinais iguais: repulsão':'sinais opostos: atração',g.W/2,26,{size:15,bold:true,align:'center'}); },
  reads:s=>{ const F=9e-3*s.p.q1*s.p.q2/s.p.d**2; return [['F = k·|q₁·q₂|/d²',nt(Math.abs(F))+' N'],['Com o dobro da distância',nt(Math.abs(F)/4)+' N (4× menor)'],['Força em cada carga','mesmo valor, sentidos opostos (ação e reação)'],['Constante k','9×10<sup>9</sup> N·m²/C²']]; }});

/* campo e potencial elétrico: arraste as cargas e a sonda */
SIMS.field=(host)=>Sim(host,{alt:'Mapa de vetores do campo elétrico de duas cargas arrastáveis',h:w=>Math.min(380,Math.max(290,w*.55)),
  legend:[['force','carga positiva'],['vel','carga negativa'],['energy','sonda: campo naquele ponto']],
  ctrls:[{k:'q1',l:'Carga A',min:-4,max:4,step:1,v:3,u:'μC',live:true},{k:'q2',l:'Carga B',min:-4,max:4,step:1,v:-3,u:'μC',live:true}],
  init(s){ if(!s.c){ s.c=[[.6,.5],[1.4,.5]]; s.pr=[1,.2]; } },
  geo:s=>{ const k=s.W/2; return {k,X:x=>x*k,Y:y=>y*k,ix:x=>x/k}; },
  E(s,x,y){ let ex=0,ey=0,V=0; [[s.c[0],s.p.q1],[s.c[1],s.p.q2]].forEach(([c,q])=>{ const dx=x-c[0], dy=y-c[1], r=Math.max(.03,Math.hypot(dx,dy)), e=9e3*q/(r*r); ex+=e*dx/r; ey+=e*dy/r; V+=9e3*q/r; }); return [ex,ey,V]; },
  drag:{ down(s,x,y){ const {k}=s.def.geo(s), pts=[s.c[0],s.c[1],s.pr]; s.dr=pts.findIndex(p=>Math.hypot(p[0]*k-x,p[1]*k-y)<20); return s.dr>=0; },
    move(s,x,y){ const {k}=s.def.geo(s), p=[clamp(x/k,.02,1.98),clamp(y/k,.02,s.H/k-.02)]; if(s.dr===2) s.pr=p; else s.c[s.dr]=p; } },
  draw(g,s){ const {k}=s.def.geo(s), st=Math.max(26,g.W/22);
    for(let x=st/2;x<g.W;x+=st) for(let y=st/2;y<g.H;y+=st){ const [ex,ey]=s.def.E(s,x/k,y/k), m=Math.hypot(ex,ey); if(!m) continue; const a=clamp(Math.log10(m)/3.5,.08,1), L=st*.42; g.ctx.globalAlpha=a; g.arrow(x-ex/m*L/2,y-ey/m*L/2,x+ex/m*L/2,y+ey/m*L/2,COL.ink,null,1.4); g.ctx.globalAlpha=1; }
    [[s.c[0],s.p.q1,'A'],[s.c[1],s.p.q2,'B']].forEach(([c,q,n])=>{ g.circle(c[0]*k,c[1]*k,14,q>0?COL.force:q<0?COL.vel:COL.muted,COL.ink,1.5); g.text(q>0?'+':q<0?'−':'0',c[0]*k,c[1]*k+6,{size:16,bold:true,align:'center',c:'#fff'}); });
    const [ex,ey]=s.def.E(s,...s.pr), m=Math.hypot(ex,ey), px=s.pr[0]*k, py=s.pr[1]*k; g.circle(px,py,7,COL.energy,COL.ink,1.5); if(m) g.arrow(px,py,px+ex/m*46,py+ey/m*46,COL.energy,'E',3);
    g.text('arraste as cargas e a sonda amarela',10,g.H-10,{size:12,c:COL.muted}); },
  reads:s=>{ const [ex,ey,V]=s.def.E(s,...s.pr); return [['Campo na sonda |E|',nf(Math.hypot(ex,ey)*1e3)+' N/C'],['Potencial na sonda V',nf(V*1e3)+' V'],['Força numa carga de +1 μC ali',nf(Math.hypot(ex,ey)*1e3*1e-6)+' N'],['Sentido do campo','sai das cargas + e entra nas −']]; }});

/* lei de Ohm */
SIMS.ohm=(host)=>Sim(host,{alt:'Circuito com bateria e resistor; as bolinhas mostram a corrente',anim:true,autoplay:true,h:280,
  ctrls:[{k:'U',l:'Tensão da bateria U',min:0,max:24,step:1,v:12,u:'V',live:true},{k:'R',l:'Resistência R',min:1,max:100,step:1,v:20,u:'Ω',live:true}],
  init(s){ s.ph=0; }, step(s,dt){ s.ph+=dt*s.p.U/s.p.R*.9; },
  draw(g,s){ const x0=30, y0=30, w=Math.min(g.W*.5,320), h=g.H-70, I=s.p.U/s.p.R, per=2*(w+h);
    g.rect(x0,y0,w,h,null,COL.ink,6,3); g.rect(x0-10,y0+h/2-26,20,52,COL.card,null,0); g.line(x0-14,y0+h/2-10,x0+14,y0+h/2-10,COL.ink,4); g.line(x0-8,y0+h/2+6,x0+8,y0+h/2+6,COL.ink,4); g.text('+',x0+20,y0+h/2-8,{size:14,bold:true}); g.text(s.p.U+' V',x0+22,y0+h/2+14,{size:12,mono:true});
    g.rect(x0+w/2-40,y0-10,80,20,COL.energy,COL.ink,4); g.text(s.p.R+' Ω',x0+w/2,y0+30,{size:13,bold:true,align:'center',mono:true});
    const pos=d=>{ d=((d%per)+per)%per; if(d<w) return [x0+d,y0]; d-=w; if(d<h) return [x0+w,y0+d]; d-=h; if(d<w) return [x0+w-d,y0+h]; d-=w; return [x0,y0+h-d]; };
    for(let i=0;i<24;i++){ const [x,y]=pos(i*per/24+s.ph*60); g.circle(x,y,4,COL.vel); }
    const r=g.plot(x0+w+60,y0,g.W-x0-w-80,h,{xr:[0,24],yr:[0,Math.max(1,24/s.p.R)*1.1],series:[{pts:[[0,0],[24,24/s.p.R]],c:COL.force}],xl:'U (V)',yl:'I (A)'}); g.circle(r.X(s.p.U),r.Y(I),6,COL.vel,COL.ink,1.5); },
  reads:s=>{ const I=s.p.U/s.p.R; return [['Corrente I = U/R',nt(I)+' A'],['Potência dissipada P = U·I',nt(s.p.U*I)+' W'],['Carga que passa por segundo',nt(I)+' C'],['Elétrons por segundo',nf(I/1.6e-19)]]; }});

/* associação de resistores */
SIMS.resist=(host)=>Sim(host,{alt:'Três resistores em série ou em paralelo com correntes e tensões',h:300,
  ctrls:[{k:'mode',l:'Ligação',opts:[['s','em série'],['p','em paralelo']],v:'s',live:true},{k:'U',l:'Tensão da fonte',min:1,max:24,step:1,v:12,u:'V',live:true},{k:'R1',l:'R₁',min:1,max:30,step:1,v:10,u:'Ω',live:true},{k:'R2',l:'R₂',min:1,max:30,step:1,v:20,u:'Ω',live:true},{k:'R3',l:'R₃',min:1,max:30,step:1,v:30,u:'Ω',live:true}],
  calc(s){ const R=[s.p.R1,s.p.R2,s.p.R3], U=s.p.U; if(s.p.mode==='s'){ const Req=R[0]+R[1]+R[2], I=U/Req; return {Req,I,it:R.map(()=>I),ut:R.map(r=>r*I)}; } const Req=1/(1/R[0]+1/R[1]+1/R[2]); return {Req,I:U/Req,it:R.map(r=>U/r),ut:R.map(()=>U)}; },
  draw(g,s){ const c=s.def.calc(s), x0=40, x1=g.W-40, y0=40, y1=g.H-40, R=[s.p.R1,s.p.R2,s.p.R3], th=i=>clamp(1.5+i*6,1.5,8);
    g.line(x0,y0,x0,y1,COL.ink,th(c.I)); g.line(x0,y1,x1,y1,COL.ink,th(c.I)); g.text(s.p.U+' V',x0+8,(y0+y1)/2+4,{size:13,bold:true,mono:true}); g.line(x0-12,(y0+y1)/2-6,x0+12,(y0+y1)/2-6,COL.ink,4); g.line(x0-6,(y0+y1)/2+6,x0+6,(y0+y1)/2+6,COL.ink,4);
    const box=(x,y,i)=>{ g.rect(x-34,y-12,68,24,COL.energy,COL.ink,4); g.text('R'+'₁₂₃'[i]+' = '+R[i]+' Ω',x,y+5,{size:11.5,bold:true,align:'center'}); g.text(nt(c.it[i])+' A · '+nt(c.ut[i])+' V',x,y+28,{size:11.5,align:'center',mono:true,c:COL.muted}); };
    if(s.p.mode==='s'){ g.line(x0,y0,x1,y0,COL.ink,th(c.I)); g.line(x1,y0,x1,y1,COL.ink,th(c.I)); [.25,.5,.75].forEach((f,i)=>box(x0+(x1-x0)*f,y0,i)); }
    else { const xs=[.4,.6,.8].map(f=>x0+(x1-x0)*f); g.line(x0,y0,xs[2],y0,COL.ink,th(c.I)); xs.forEach((x,i)=>{ g.line(x,y0,x,y1,COL.ink,th(c.it[i])); box(x,(y0+y1)/2-10,i); }); g.line(xs[2],y1,x1,y1,COL.ink,1); }
    g.text('espessura do fio ∝ corrente',g.W-10,g.H-10,{size:11.5,c:COL.muted,align:'right'}); },
  reads:s=>{ const c=s.def.calc(s); return [['Resistência equivalente',nt(c.Req)+' Ω'],['Corrente total I = U/R<sub>eq</sub>',nt(c.I)+' A'],['Potência total',nt(s.p.U*c.I)+' W'],['Regra',s.p.mode==='s'?'mesma corrente em todos; as tensões somam':'mesma tensão em todos; as correntes somam']]; }});

/* consumo de energia elétrica */
const APPL=[['chuveiro',5500,.5],['ar-condicionado',1400,8],['geladeira',150,24],['ferro de passar',1000,.5],['TV',100,5],['lâmpada LED',9,6]];
SIMS.consumo=(host)=>Sim(host,{alt:'Barras com o gasto mensal de energia de aparelhos domésticos',h:300,
  ctrls:[{k:'a',l:'Aparelho que você controla',opts:APPL.map((x,i)=>[i,x[0]]),v:0,live:true},{k:'h',l:'Horas por dia de uso',min:.25,max:24,step:.25,v:.5,u:'h',live:true},{k:'tf',l:'Tarifa',min:.5,max:1.2,step:.05,v:.85,f:v=>'R$ '+nsig(v,3)+' por kWh',live:true}],
  draw(g,s){ const rows=APPL.map((x,i)=>{ const h=i===s.p.a?s.p.h:x[2]; return [x[0],x[1],h,x[1]*h*30/1000,i===s.p.a]; }), mx=Math.max(...rows.map(r=>r[3])), x0=Math.min(150,g.W*.34), w=g.W-x0-92, rh=(g.H-40)/rows.length;
    rows.forEach((r,i)=>{ const y=20+i*rh; g.text(r[0],x0-10,y+rh/2+4,{size:12.5,align:'right',bold:r[4]}); g.rect(x0,y+4,w,rh-10,COL.sunk,null,4); g.rect(x0,y+4,w*r[3]/mx,rh-10,r[4]?COL.accent:COL.line,null,4); g.text(nt(r[3])+' kWh',x0+w+8,y+rh/2+4,{size:11.5,mono:true}); g.text(nsig(r[1],4)+' W · '+nsig(r[2],3)+' h/dia',x0+6,y+rh/2+4,{size:10.5,c:r[4]?COL.card:COL.muted}); }); },
  reads:s=>{ const P=APPL[s.p.a][1], E=P*s.p.h*30/1000; return [['Potência',nsig(P,4)+' W = '+nt(P/1000)+' kW'],['Energia por dia P·Δt',nt(P*s.p.h/1000)+' kWh'],['Energia no mês (30 dias)',nt(E)+' kWh'],['Custo no mês',nt(E*s.p.tf)+' reais']]; }});

/* força magnética numa carga em movimento */
SIMS.magforce=(host)=>Sim(host,{alt:'Partícula carregada girando num campo magnético que entra na tela',anim:true,h:320,
  legend:[['vel','velocidade'],['force','força magnética (sempre perpendicular à velocidade)']],
  ctrls:[{k:'q',l:'Partícula',opts:[[1,'próton (+)'],[-1,'antipróton (−)']],v:1},{k:'v',l:'Velocidade',min:1,max:10,step:1,v:5,f:v=>v+'×10⁵ m/s'},{k:'B',l:'Campo magnético B',min:.02,max:.2,step:.02,v:.1,u:'T'}],
  init(s){ s.ang=-Math.PI/2; s.tr=[]; },
  step(s,dt){ s.ang+=s.p.q*dt*2.2*Math.sqrt(s.p.B/.1); },
  R:s=>1.67e-27*s.p.v*1e5/(1.6e-19*s.p.B),
  draw(g,s){ for(let x=18;x<g.W;x+=36) for(let y=18;y<g.H;y+=36){ g.circle(x,y,6,null,COL.line,1.2); g.line(x-4,y-4,x+4,y+4,COL.line,1.2); g.line(x-4,y+4,x+4,y-4,COL.line,1.2); }
    const R=s.def.R(s), rp=clamp(20+R/.52*(g.H/2-40),20,g.H/2-12), cx=g.W/2, cy=g.H/2, x=cx+rp*Math.cos(s.ang), y=cy-rp*Math.sin(s.ang);
    g.circle(cx,cy,rp,null,COL.muted,1,); const t=[-Math.sin(s.ang)*s.p.q,-Math.cos(s.ang)*s.p.q]; g.circle(x,y,9,s.p.q>0?COL.force:COL.vel,COL.ink,1.5);
    g.arrow(x,y,x+t[0]*50,y+t[1]*50,COL.vel,'v',3); g.arrow(x,y,x+(cx-x)/rp*40,y+(cy-y)/rp*40,COL.force,'F',3);
    g.text('B entra na tela (⊗)',10,g.H-10,{size:12,c:COL.muted}); },
  reads:s=>{ const v=s.p.v*1e5, F=1.6e-19*v*s.p.B, R=s.def.R(s); return [['Força F = |q|·v·B',nf(F)+' N'],['Raio da trajetória R = m·v/(|q|·B)',nt(R*100)+' cm'],['Período T = 2πm/(|q|·B)',nf(2*Math.PI*1.67e-27/(1.6e-19*s.p.B))+' s'],['Trabalho da força magnética','zero: ela só muda a direção']]; }});

/* indução: ímã entrando e saindo de uma bobina */
SIMS.induct=(host)=>Sim(host,{alt:'Ímã indo e voltando dentro de uma bobina ligada a um medidor',anim:true,autoplay:true,h:380,
  legend:[['acc','fluxo magnético Φ'],['force','tensão induzida (fem)']],
  ctrls:[{k:'w',l:'Rapidez do movimento',min:.5,max:3,step:.25,v:1.25,f:v=>nsig(v,3)+'×',live:true},{k:'N',l:'Número de espiras',min:10,max:200,step:10,v:50,live:true},{k:'mv',l:'Movimento',opts:[[1,'vai e volta'],[0,'ímã parado dentro']],v:1,live:true}],
  init(s){ s.hist=[]; },
  phi:x=>1/(1+(x/.6)**2)**1.5,
  step(s,dt){ const xm=t=>s.p.mv?2.2*Math.cos(s.p.w*t):0, x=xm(s.t), x2=xm(s.t+dt), dphi=(s.def.phi(x2)-s.def.phi(x))/dt, emf=-s.p.N*dphi*.02; s.x=x2; s.emf=emf; s.hist.push([s.t,s.def.phi(x2),emf]); while(s.hist.length&&s.hist[0][0]<s.t-6) s.hist.shift(); },
  draw(g,s){ const cy=86, cx=g.W*.36, k=Math.min(46,g.W/12), x=cx+(s.x||2.2)*k;
    for(let i=-3;i<=3;i++) g.ctx.save(), g.ctx.beginPath(), g.ctx.ellipse(cx+i*9,cy,7,34,0,0,Math.PI*2), g.ctx.strokeStyle=COL.energy, g.ctx.lineWidth=2.5, g.ctx.stroke(), g.ctx.restore();
    g.rect(x-50,cy-12,50,24,COL.force,COL.ink,3); g.rect(x,cy-12,50,24,COL.vel,COL.ink,3); g.text('N',x-25,cy+5,{size:13,bold:true,align:'center',c:'#fff'}); g.text('S',x+25,cy+5,{size:13,bold:true,align:'center',c:'#fff'});
    const gx=g.W*.82, gy=cy+22, e=s.emf||0; g.ctx.save(); g.ctx.beginPath(); g.ctx.arc(gx,gy,44,Math.PI,2*Math.PI); g.ctx.strokeStyle=COL.ink; g.ctx.lineWidth=2; g.ctx.stroke(); g.ctx.restore(); const an=-Math.PI/2+clamp(e/4,-1,1)*1.2; g.line(gx,gy,gx+Math.cos(an)*38,gy+Math.sin(an)*38,COL.force,3); g.text('galvanômetro',gx,gy+18,{size:11,c:COL.muted,align:'center'});
    const t1=s.t, top=cy+60, h=(g.H-top-30)/2-10, xr=[t1-6,t1];
    g.plot(50,top,g.W-70,h,{xr,yr:[0,1.05],series:[{pts:s.hist.map(p=>[p[0],p[1]]),c:COL.acc}],yl:'fluxo Φ'}); g.plot(50,top+h+26,g.W-70,h,{xr,yr:[-8,8],series:[{pts:s.hist.map(p=>[p[0],p[2]]),c:COL.force}],yl:'fem induzida',xl:'tempo (s)'}); },
  reads:s=>[['Fem agora (unidades do app)',nt(s.emf||0)],['Por que surge corrente?','o fluxo dentro da bobina está variando'],['Ímã parado','fluxo constante → fem zero'],['Mais espiras ou mais rápido','fem maior (Lei de Faraday)']]});

/* efeito fotoelétrico */
const METAIS=[[2.28,'sódio'],[4.3,'zinco'],[4.7,'cobre']];
function lamColor(l){ if(l<380) return '#9b7bff'; const t=[[380,[120,0,200]],[440,[0,40,255]],[490,[0,200,255]],[510,[0,220,80]],[580,[255,230,0]],[645,[255,40,0]],[700,[200,0,0]]]; let i=0; while(i<t.length-2&&l>t[i+1][0]) i++; const [a,ca]=t[i],[b,cb]=t[i+1], f=clamp((l-a)/(b-a),0,1); return `rgb(${ca.map((c,j)=>Math.round(c+(cb[j]-c)*f)).join(',')})`; }
SIMS.photo=(host)=>Sim(host,{alt:'Luz batendo numa placa metálica e arrancando elétrons',anim:true,autoplay:true,h:280,
  ctrls:[{k:'l',l:'Comprimento de onda da luz λ',min:200,max:700,step:10,v:450,u:'nm',live:true},{k:'I',l:'Intensidade (fótons por segundo)',min:1,max:10,step:1,v:5,live:true},{k:'W',l:'Metal',opts:METAIS.map(x=>[x[0],x[1]]),v:2.28,live:true}],
  init(s){ s.ph=[]; s.el=[]; s.acc=0; },
  step(s,dt){ const E=1240/s.p.l, K=E-s.p.W; s.acc+=dt*s.p.I*4; while(s.acc>=1){ s.acc--; s.ph.push({x:0,y:Math.random()}); }
    s.ph.forEach(p=>p.x+=dt*1.4); s.ph=s.ph.filter(p=>{ if(p.x>=1){ if(K>0) s.el.push({x:0,y:p.y,v:.3+Math.sqrt(K)*.5}); return false; } return true; });
    s.el.forEach(e=>e.x+=e.v*dt); s.el=s.el.filter(e=>e.x<1); },
  draw(g,s){ const E=1240/s.p.l, K=E-s.p.W, px=g.W*.55, c=lamColor(s.p.l);
    g.rect(14,g.H/2-40,40,80,c,COL.ink,8); g.text(s.p.l<380?'UV':'luz',34,g.H/2+5,{size:12,bold:true,align:'center',c:'#fff'});
    g.rect(px,30,14,g.H-60,COL.muted,COL.ink,2); g.text(METAIS.find(m=>m[0]===s.p.W)[1],px+7,22,{size:12,align:'center',bold:true});
    s.ph.forEach(p=>{ const x=60+p.x*(px-70), y=40+p.y*(g.H-80); g.poly([[x-10,y],[x-6,y-4],[x-2,y],[x+2,y+4],[x+6,y]],c,2.2); });
    s.el.forEach(e=>{ const x=px+18+e.x*(g.W-px-30), y=40+e.y*(g.H-80); g.circle(x,y,4.5,COL.vel); });
    g.text(K>0?'elétrons arrancados':'nenhum elétron: cada fóton tem pouca energia',g.W-12,g.H-12,{size:12.5,bold:true,align:'right',c:K>0?COL.ok:COL.force}); },
  reads:s=>{ const E=1240/s.p.l, K=E-s.p.W; return [['Energia de cada fóton E = h·f',nt(E)+' eV'],['Frequência f = c/λ',nf(3e8/(s.p.l*1e-9))+' Hz'],['Função trabalho do metal',nt(s.p.W)+' eV'],['Energia cinética máxima E − φ',K>0?nt(K)+' eV':'não há emissão'],['Maior λ que ainda arranca elétrons',nt(1240/s.p.W)+' nm']]; }});

/* decaimento radioativo */
SIMS.decay=(host)=>Sim(host,{alt:'Grade de 400 núcleos decaindo, com o gráfico da quantidade restante',anim:true,h:300,
  legend:[['vel','núcleos que restam (simulação)'],['force','previsão N₀/2ⁿ']],
  ctrls:[{k:'T',l:'Meia-vida',min:1,max:8,step:1,v:3,u:'s'}],
  init(s){ s.a=new Array(400).fill(1); s.N=400; s.h=[[0,400]]; },
  step(s,dt){ const p=1-Math.exp(-Math.LN2/s.p.T*dt); for(let i=0;i<400;i++) if(s.a[i]&&Math.random()<p){ s.a[i]=0; s.N--; } s.h.push([s.t+dt,s.N]); if(s.t>5*s.p.T) s.play(false); },
  done:s=>s.t>5*s.p.T,
  draw(g,s){ const gs=Math.min((g.H-40)/20,(g.W*.42)/20), x0=16, y0=20; for(let i=0;i<400;i++){ const x=x0+(i%20)*gs, y=y0+Math.floor(i/20)*gs; g.circle(x+gs/2,y+gs/2,gs*.36,s.a[i]?COL.vel:COL.line); }
    const px=x0+20*gs+50, th=[]; for(let t=0;t<=5*s.p.T;t+=s.p.T/10) th.push([t,400/2**(t/s.p.T)]);
    const r=g.plot(px,y0,g.W-px-20,g.H-60,{xr:[0,5*s.p.T],yr:[0,400],series:[{pts:th,c:COL.force,w:1.5},{pts:s.h,c:COL.vel,dot:true}],xl:'tempo (s)',yl:'núcleos restantes'});
    for(let n=1;n<=4;n++) g.line(r.X(n*s.p.T),r.Y(0),r.X(n*s.p.T),r.Y(400/2**n),COL.line,1,[3,3]); },
  reads:s=>[['Tempo',nt(s.t)+' s'],['Meias-vidas passadas',nt(s.t/s.p.T)],['Núcleos restantes',s.N+' de 400'],['Previsão N₀/2ⁿ',nt(400/2**(s.t/s.p.T))],['Cada núcleo','decai ao acaso; o conjunto segue a regra']]});

/* relatividade: relógio de luz */
SIMS.rel=(host)=>Sim(host,{alt:'Dois relógios de luz: um parado e um em movimento, que marca o tempo mais devagar',anim:true,autoplay:true,h:300,
  ctrls:[{k:'b',l:'Velocidade do relógio (fração de c)',min:0,max:.99,step:.01,v:.8,f:v=>nsig(v*100,3)+'% de c'}],
  init(s){ s.x=0; s.t0=0; s.t1=0; s.ph0=0; s.ph1=0; },
  step(s,dt){ const b=s.p.b, c=1.2; s.ph0+=dt*c; s.ph1+=dt*c*Math.sqrt(1-b*b); s.x+=dt*b*c; const fl=v=>Math.floor(v/2); s.t0=fl(s.ph0); s.t1=fl(s.ph1); },
  draw(g,s){ const H=g.H-90, top=40, w=g.W*.26, tri=p=>{ const q=p%2; return q<1?q:2-q; };
    const clock=(x,ph,lab,n)=>{ g.line(x-22,top,x+22,top,COL.ink,3); g.line(x-22,top+H,x+22,top+H,COL.ink,3); const y=top+H-tri(ph)*H; g.circle(x,y,6,COL.energy); g.text(lab,x,top+H+22,{size:12.5,align:'center',bold:true}); g.text(n+' tiques',x,top+H+40,{size:12,align:'center',mono:true,c:COL.muted}); };
    clock(w/2+10,s.ph0,'relógio parado',s.t0);
    const span=g.W-w-60, xx=w+40+((s.x*span/2.4)%span); clock(xx,s.ph1,'relógio em movimento',s.t1);
    g.text('γ = '+nt(1/Math.sqrt(1-s.p.b**2)),g.W-12,24,{size:16,bold:true,align:'right',mono:true}); },
  reads:s=>{ const gm=1/Math.sqrt(1-s.p.b**2); return [['Fator de Lorentz γ = 1/√(1 − v²/c²)',nt(gm)],['1 s no relógio que se move dura, para quem está parado',nt(gm)+' s'],['Uma régua de 1 m em movimento mede',nt(1/gm)+' m'],['A velocidade da luz','é a mesma para os dois observadores']]; }});
