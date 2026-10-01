/* =====================================================================
   Laboratórios de óptica, eletricidade, magnetismo e física moderna
   ===================================================================== */

/* campo e potencial elétrico: arraste as cargas e a sonda */
SIMS.field=(host,cfg={})=>Sim(host,{alt:'Mapa de vetores do campo elétrico de duas cargas arrastáveis',h:w=>Math.min(380,Math.max(290,w*.55)),
  legend:[['force','carga positiva'],['vel','carga negativa'],['energy','sonda: campo naquele ponto']],
  ctrls:[{k:'q1',l:'Carga A',min:-4,max:4,step:1,v:cfg.q1??3,u:'μC',live:true},{k:'q2',l:'Carga B',min:-4,max:4,step:1,v:cfg.q2??-3,u:'μC',live:true}],
  init(s){ if(!s.c){ s.c=[[.6,.5],[1.4,.5]]; s.pr=[1,.2]; } },
  geo:s=>{ const k=s.W/2; return {k,X:x=>x*k,Y:y=>y*k,ix:x=>x/k}; },
  E(s,x,y){ let ex=0,ey=0,V=0; [[s.c[0],s.p.q1],[s.c[1],s.p.q2]].forEach(([c,q])=>{ const dx=x-c[0], dy=y-c[1], r=Math.max(.03,Math.hypot(dx,dy)), e=9e3*q/(r*r); ex+=e*dx/r; ey+=e*dy/r; V+=9e3*q/r; }); return [ex,ey,V]; },
  drag:{ down(s,x,y){ const {k}=s.def.geo(s), pts=[s.c[0],s.c[1],s.pr]; s.dr=pts.findIndex(p=>Math.hypot(p[0]*k-x,p[1]*k-y)<20); return s.dr>=0; },
    move(s,x,y){ const {k}=s.def.geo(s), p=[clamp(x/k,.02,1.98),clamp(y/k,.02,s.H/k-.02)]; if(s.dr===2) s.pr=p; else s.c[s.dr]=p; } },
  draw(g,s){ const {k}=s.def.geo(s), st=Math.max(26,g.W/22);
    for(let x=st/2;x<g.W;x+=st) for(let y=st/2;y<g.H;y+=st){ const [ex,ey]=s.def.E(s,x/k,y/k), m=Math.hypot(ex,ey); if(!m) continue; const a=clamp(Math.log10(m)/3.5,.08,1), L=st*.42; g.ctx.globalAlpha=a; g.arrow(x-ex/m*L/2,y-ey/m*L/2,x+ex/m*L/2,y+ey/m*L/2,COL.ink,null,1.4); g.ctx.globalAlpha=1; }
    [[s.c[0],s.p.q1,'A'],[s.c[1],s.p.q2,'B']].forEach(([c,q,n])=>{ glowBall(g,c[0]*k,c[1]*k,14,q>0?'#e5484d':q<0?'#1c6fd1':'#9aa3ad',q>0?'+':q<0?'−':'0'); });
    const [ex,ey]=s.def.E(s,...s.pr), m=Math.hypot(ex,ey), px=s.pr[0]*k, py=s.pr[1]*k; g.circle(px,py,7,COL.energy,COL.ink,1.5); if(m) g.arrow(px,py,px+ex/m*46,py+ey/m*46,COL.energy,'E',3);
    g.text('arraste as cargas e a sonda amarela',10,g.H-10,{size:12,c:COL.muted}); },
  reads:s=>{ const [ex,ey,V]=s.def.E(s,...s.pr); return [['Campo na sonda |E|',nf(Math.hypot(ex,ey)*1e3)+' N/C'],['Potencial na sonda V',nf(V*1e3)+' V'],['Força numa carga de +1 μC ali',nf(Math.hypot(ex,ey)*1e3*1e-6)+' N'],['Sentido do campo','sai das cargas + e entra nas −']]; }});

/* consumo de energia elétrica */
const APPL=[['chuveiro',5500,.5],['ar-condicionado',1400,8],['geladeira',150,24],['ferro de passar',1000,.5],['TV',100,5],['lâmpada LED',9,6]];
SIMS.consumo=(host,cfg={})=>Sim(host,{alt:'Barras com o gasto mensal de energia de aparelhos domésticos',h:300,
  ctrls:[{k:'a',l:'Aparelho que você controla',opts:APPL.map((x,i)=>[i,x[0]]),v:cfg.a??0,live:true},{k:'h',l:'Horas por dia de uso',min:.25,max:24,step:.25,v:cfg.h??.5,u:'h',live:true},{k:'tf',l:'Tarifa',min:.5,max:1.2,step:.05,v:.85,f:v=>'R$ '+nsig(v,3)+' por kWh',live:true}],
  draw(g,s){ const rows=APPL.map((x,i)=>{ const h=i===s.p.a?s.p.h:x[2]; return [x[0],x[1],h,x[1]*h*30/1000,i===s.p.a]; }), mx=Math.max(...rows.map(r=>r[3])), x0=Math.min(150,g.W*.34), w=g.W-x0-92, rh=(g.H-40)/rows.length;
    rows.forEach((r,i)=>{ const y=20+i*rh; g.text(r[0],x0-10,y+rh/2+4,{size:12.5,align:'right',bold:r[4]}); g.rect(x0,y+4,w,rh-10,COL.sunk,null,4); g.rect(x0,y+4,w*r[3]/mx,rh-10,r[4]?COL.accent:COL.line,null,4); g.text(nt(r[3])+' kWh',x0+w+8,y+rh/2+4,{size:11.5,mono:true}); g.text(nsig(r[1],4)+' W · '+nsig(r[2],3)+' h/dia',x0+6,y+rh/2+4,{size:10.5,c:r[4]?COL.card:COL.muted}); }); },
  reads:s=>{ const P=APPL[s.p.a][1], E=P*s.p.h*30/1000; return [['Potência',nsig(P,4)+' W = '+nt(P/1000)+' kW'],['Energia por dia P·Δt',nt(P*s.p.h/1000)+' kWh'],['Energia no mês (30 dias)',nt(E)+' kWh'],['Custo no mês',nt(E*s.p.tf)+' reais']]; }});

/* decaimento radioativo */
SIMS.decay=(host,cfg={})=>Sim(host,{alt:'Grade de 400 núcleos decaindo, com o gráfico da quantidade restante',anim:true,h:300,
  legend:[['vel','núcleos que restam (simulação)'],['force','previsão N₀/2ⁿ']],
  ctrls:[{k:'T',l:'Meia-vida',min:1,max:8,step:1,v:cfg.T??3,u:'s'}],
  init(s){ s.a=new Array(400).fill(1); s.N=400; s.h=[[0,400]]; },
  step(s,dt){ const p=1-Math.exp(-Math.LN2/s.p.T*dt); for(let i=0;i<400;i++) if(s.a[i]&&Math.random()<p){ s.a[i]=0; s.N--; } s.h.push([s.t+dt,s.N]); if(s.t>5*s.p.T) s.play(false); },
  done:s=>s.t>5*s.p.T,
  draw(g,s){ const gs=Math.min((g.H-40)/20,(g.W*.42)/20), x0=16, y0=20; for(let i=0;i<400;i++){ const x=x0+(i%20)*gs, y=y0+Math.floor(i/20)*gs; g.circle(x+gs/2,y+gs/2,gs*.36,s.a[i]?COL.vel:COL.line); }
    const px=x0+20*gs+50, th=[]; for(let t=0;t<=5*s.p.T;t+=s.p.T/10) th.push([t,400/2**(t/s.p.T)]);
    const r=g.plot(px,y0,g.W-px-20,g.H-60,{xr:[0,5*s.p.T],yr:[0,400],series:[{pts:th,c:COL.force,w:1.5},{pts:s.h,c:COL.vel,dot:true}],xl:'tempo (s)',yl:'núcleos restantes'});
    for(let n=1;n<=4;n++) g.line(r.X(n*s.p.T),r.Y(0),r.X(n*s.p.T),r.Y(400/2**n),COL.line,1,[3,3]); },
  reads:s=>[['Tempo',nt(s.t)+' s'],['Meias-vidas passadas',nt(s.t/s.p.T)],['Núcleos restantes',s.N+' de 400'],['Previsão N₀/2ⁿ',nt(400/2**(s.t/s.p.T))],['Cada núcleo','decai ao acaso; o conjunto segue a regra']]});
