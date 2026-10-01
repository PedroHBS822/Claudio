/* =====================================================================
   Laboratórios de estática, fluidos, termologia e ondas
   ===================================================================== */

/* termômetros: Celsius, Fahrenheit e Kelvin */
SIMS.temp=(host)=>Sim(host,{alt:'Três termômetros nas escalas Celsius, Fahrenheit e Kelvin',h:320,
  ctrls:[{k:'C',l:'Temperatura',min:-273,max:200,step:1,v:37,u:'°C',live:true}],
  draw(g,s){ const C=s.p.C, sc=[['Celsius','°C',C,-273.15,200],['Fahrenheit','°F',C*1.8+32,-459.67,392],['Kelvin','K',C+273.15,0,473.15]], top=40, bot=g.H-50, w=g.W/3;
    const marks=[[-273.15,'zero absoluto'],[0,'gelo derrete'],[37,'corpo humano'],[100,'água ferve']];
    sc.forEach(([n,u,v,lo,hi],i)=>{ const cx=w*i+w/2, Y=x=>bot-(x-lo)/(hi-lo)*(bot-top);
      g.rect(cx-9,top-6,18,bot-top+12,COL.card,COL.ink,9,1.5); g.circle(cx,bot+14,15,COL.force,COL.ink,1.5); g.rect(cx-5,Y(v),10,bot-Y(v)+8,COL.force,null,3);
      marks.forEach(([mc,lab])=>{ const mv=i===0?mc:i===1?mc*1.8+32:mc+273.15, yy=Y(mv); g.line(cx+10,yy,cx+22,yy,COL.muted,1.2); g.text(nt(mv,4),cx+25,yy+4,{size:10.5,c:COL.muted,mono:true}); if(i===0) g.text(lab,cx-14,yy+4,{size:10.5,c:COL.muted,align:'right'}); });
      g.text(n,cx,18,{size:13,bold:true,align:'center'}); g.text(nt(v,4)+' '+u,cx,g.H-8,{size:15,bold:true,align:'center',mono:true,c:COL.force}); }); },
  reads:s=>[['Celsius',nt(s.p.C,4)+' °C'],['Fahrenheit = 1,8·C + 32',nt(s.p.C*1.8+32,4)+' °F'],['Kelvin = C + 273',nt(s.p.C+273.15,5)+' K'],['Variação: 1 °C equivale a','1,8 °F e 1 K']]});

/* dilatação linear */
const MAT=[[12e-6,'aço'],[23e-6,'alumínio'],[17e-6,'cobre'],[9e-6,'vidro']];
SIMS.dilat=(host)=>Sim(host,{alt:'Barra que se alonga quando aquecida (desenho exagerado)',h:240,
  ctrls:[{k:'al',l:'Material',opts:MAT.map(x=>[x[0],x[1]]),v:12e-6,live:true},{k:'L0',l:'Comprimento inicial',min:1,max:100,step:1,v:20,u:'m',live:true},{k:'dT',l:'Aquecimento ΔT',min:0,max:200,step:5,v:50,u:'°C',live:true}],
  draw(g,s){ const dL=s.p.L0*s.p.al*s.p.dT, x0=30, W=g.W-60, base=W*.72, ex=dL/s.p.L0*500;
    g.text('frio',x0,54,{size:12,c:COL.muted}); g.rect(x0,62,base,24,COL.vel+'66',COL.ink,4);
    g.text('aquecido (alongamento exagerado 500 vezes)',x0,120,{size:12,c:COL.muted}); g.rect(x0,128,base*(1+ex),24,COL.force+'88',COL.ink,4);
    g.line(x0+base,56,x0+base,170,COL.muted,1,[4,4]); g.line(x0+base*(1+ex),150,x0+base*(1+ex),170,COL.muted,1,[4,4]);
    if(ex>0) g.arrow(x0+base,176,x0+base*(1+ex),176,COL.force,'ΔL',2);
    g.text('ΔL = '+nt(dL*1000)+' mm',g.W/2,g.H-14,{size:18,bold:true,align:'center',mono:true}); },
  reads:s=>{ const dL=s.p.L0*s.p.al*s.p.dT; return [['Coeficiente α',nf(s.p.al)+' °C<sup>−1</sup>'],['ΔL = L₀·α·ΔT',nt(dL*1000)+' mm'],['Comprimento final',nt(s.p.L0+dL,6)+' m'],['Aumento percentual',nt(dL/s.p.L0*100)+' %']]; }});

/* calorimetria: misturando dois corpos */
SIMS.calor=(host)=>Sim(host,{alt:'Dois corpos trocando calor até a mesma temperatura',anim:true,h:300,
  legend:[['force','corpo quente'],['vel','corpo frio']],
  ctrls:[{k:'m1',l:'Massa de água quente',min:100,max:1000,step:50,v:200,u:'g'},{k:'T1',l:'Temperatura da água quente',min:40,max:100,step:5,v:80,u:'°C'},{k:'c2',l:'Corpo frio',opts:[[1,'água (c = 1)'],[.11,'ferro (c = 0,11)'],[.22,'alumínio (c = 0,22)']],v:1},{k:'m2',l:'Massa do corpo frio',min:100,max:1000,step:50,v:300,u:'g'},{k:'T2',l:'Temperatura do corpo frio',min:0,max:35,step:5,v:20,u:'°C'}],
  init(s){ s.a=s.p.T1; s.b=s.p.T2; s.ta=[[0,s.a]]; s.tb=[[0,s.b]]; s.Te=(s.p.m1*s.p.T1+s.p.m2*s.p.c2*s.p.T2)/(s.p.m1+s.p.m2*s.p.c2); },
  step(s,dt){ const C1=s.p.m1, C2=s.p.m2*s.p.c2, q=(s.a-s.b)*120*dt; s.a-=q/C1; s.b+=q/C2; s.ta.push([s.t+dt,s.a]); s.tb.push([s.t+dt,s.b]); if(s.t>10) s.play(false); },
  done:s=>s.t>10,
  draw(g,s){ const w=Math.min(220,g.W*.36), x0=20, y0=40, h=g.H-80;
    const col=T=>`hsl(${clamp(220-T*2.2,0,220)} 75% 55%)`; g.rect(x0,y0,w,h/2-8,col(s.a),COL.ink,8); g.text('água quente',x0+w/2,y0+22,{size:12.5,bold:true,align:'center',c:'#fff'}); g.text(nt(s.a,3)+' °C',x0+w/2,y0+48,{size:18,bold:true,align:'center',mono:true,c:'#fff'});
    g.rect(x0,y0+h/2+8,w,h/2-8,col(s.b),COL.ink,8); g.text(s.p.c2===1?'água fria':s.p.c2<.2?'ferro':'alumínio',x0+w/2,y0+h/2+30,{size:12.5,bold:true,align:'center',c:'#fff'}); g.text(nt(s.b,3)+' °C',x0+w/2,y0+h/2+56,{size:18,bold:true,align:'center',mono:true,c:'#fff'});
    g.arrow(x0+w+8,y0+h/4,x0+w+8,y0+h*.75,COL.energy,'Q',3);
    const r=g.plot(x0+w+60,y0,g.W-x0-w-80,h,{xr:[0,10],yr:[0,100],series:[{pts:s.ta,c:COL.force,dot:true},{pts:s.tb,c:COL.vel,dot:true}],xl:'tempo',yl:'temperatura (°C)'}); g.line(r.X(0),r.Y(s.Te),r.X(10),r.Y(s.Te),COL.muted,1,[5,5]); g.text('equilíbrio '+nt(s.Te,3)+' °C',r.X(10)-4,r.Y(s.Te)-6,{size:11,c:COL.muted,align:'right'}); },
  reads:s=>{ const Te=s.Te; return [['Temperatura de equilíbrio',nt(Te,3)+' °C'],['Calor cedido pela água quente m·c·ΔT',nt(s.p.m1*(s.p.T1-Te),3)+' cal'],['Calor recebido pelo corpo frio',nt(s.p.m2*s.p.c2*(Te-s.p.T2),3)+' cal'],['Capacidade térmica m·c (quente | frio)',nt(s.p.m1)+' | '+nt(s.p.m2*s.p.c2)+' cal/°C']]; }});

/* curva de aquecimento da água (−20 °C a 120 °C) */
SIMS.phase=(host)=>Sim(host,{alt:'Gráfico de temperatura contra calor recebido, com patamares de mudança de estado',anim:true,h:320,
  ctrls:[{k:'m',l:'Massa de gelo',min:50,max:500,step:50,v:100,u:'g'},{k:'P',l:'Potência do aquecedor',min:1,max:4,step:.5,v:2,f:v=>nsig(v,2)+'×'}],
  segs(m){ return [[m*.5*20,'aquecendo o gelo'],[m*80,'derretendo (0 °C)'],[m*1*100,'aquecendo a água'],[m*540,'fervendo (100 °C)'],[m*.5*20,'aquecendo o vapor']]; },
  TofQ(s,Q){ const S=s.def.segs(s.p.m); let q=Q; const T0=[-20,0,0,100,100], k=[.5*s.p.m,0,s.p.m,0,.5*s.p.m];
    for(let i=0;i<5;i++){ if(q<=S[i][0]||i===4) return {T:k[i]?T0[i]+Math.min(q,S[i][0])/k[i]:T0[i],phase:S[i][1],i,frac:q/S[i][0]}; q-=S[i][0]; } },
  init(s){ s.Q=0; s.tot=s.def.segs(s.p.m).reduce((a,b)=>a+b[0],0); s.pts=[[0,-20]]; },
  step(s,dt){ s.Q=Math.min(s.tot,s.Q+s.tot/24*s.p.P*dt); s.pts.push([s.Q/1000,s.def.TofQ(s,s.Q).T]); if(s.Q>=s.tot) s.play(false); },
  done:s=>s.Q>=s.tot,
  draw(g,s){ const st=s.def.TofQ(s,s.Q), pw=g.W*.64, r=g.plot(50,26,pw,g.H-74,{xr:[0,s.tot/1000],yr:[-30,130],series:[{pts:s.pts,c:COL.force,dot:true}],xl:'calor recebido (kcal)',yl:'temperatura (°C)'});
    let acc=0; s.def.segs(s.p.m).forEach((sg,i)=>{ acc+=sg[0]; if(i<4) g.line(r.X(acc/1000),26,r.X(acc/1000),g.H-48,COL.line,1,[3,3]); });
    const bx=pw+80, bw=g.W-bx-20, cy=g.H/2-10; g.text(st.phase,bx+bw/2,40,{size:13.5,bold:true,align:'center'}); g.text(nt(st.T,3)+' °C',bx+bw/2,66,{size:22,bold:true,align:'center',mono:true});
    const n=12; for(let i=0;i<n;i++){ const x=bx+10+(i%4)*(bw-20)/3, y=cy+Math.floor(i/4)*26; const melted=st.i>1||(st.i===1&&i/n<st.frac), vap=st.i>3||(st.i===3&&i/n<st.frac); if(vap) g.circle(x,y-30-(i%3)*6,4,COL.muted); else if(melted) g.circle(x,y,7,COL.vel); else g.rect(x-7,y-7,14,14,COL.vel+'77',COL.vel,2,1.5); } },
  reads:s=>{ const S=s.def.segs(s.p.m), st=s.def.TofQ(s,s.Q); return [['Calor recebido até agora',nt(s.Q)+' cal'],['Fase',st.phase],['Derreter todo o gelo: m·L<sub>f</sub>',nt(S[1][0])+' cal'],['Ferver toda a água: m·L<sub>v</sub>',nt(S[3][0])+' cal']]; }});

/* gases ideais: PV = nRT */
SIMS.gas=(host)=>Sim(host,{alt:'Partículas de gás num cilindro com pistão, e o diagrama pressão × volume',anim:true,autoplay:true,h:320,
  legend:[['force','isoterma da temperatura atual'],['vel','estado do gás']],
  ctrls:[{k:'T',l:'Temperatura',min:100,max:600,step:10,v:300,u:'K',live:true},{k:'V',l:'Volume',min:2,max:10,step:.5,v:5,u:'L',live:true}],
  init(s){ s.pt=[]; for(let i=0;i<40;i++){ const a=Math.random()*Math.PI*2; s.pt.push({x:Math.random(),y:Math.random(),vx:Math.cos(a),vy:Math.sin(a)}); } s.hits=0; },
  onParam(s){},
  step(s,dt){ const sp=.35*Math.sqrt(s.p.T/300), wf=s.p.V/10; s.pt.forEach(p=>{ p.x+=p.vx*sp*dt/wf; p.y+=p.vy*sp*dt; if(p.x<0){p.x=-p.x;p.vx*=-1;} if(p.x>1){p.x=2-p.x;p.vx*=-1;} if(p.y<0){p.y=-p.y;p.vy*=-1;} if(p.y>1){p.y=2-p.y;p.vy*=-1;} }); },
  draw(g,s){ const n=.2, R=.082, P=n*R*s.p.T/s.p.V, cw=Math.min(g.W*.42,300), x0=20, y0=30, h=g.H-70, ww=cw*s.p.V/10;
    g.rect(x0,y0,cw,h,COL.card,COL.ink,6,1.5); g.rect(x0+ww,y0,10,h,COL.muted,COL.ink,2,1.5); g.line(x0+ww+10,y0+h/2,x0+cw+14,y0+h/2,COL.ink,4);
    const hot=clamp((s.p.T-100)/500,0,1); s.pt.forEach(p=>g.circle(x0+4+p.x*(ww-8),y0+4+p.y*(h-8),4,`hsl(${220-hot*210} 80% 55%)`));
    g.text(s.p.V+' L',x0+ww/2,y0+h+18,{size:12,align:'center',c:COL.muted,mono:true});
    const px=x0+cw+70, pw=g.W-px-20; const iso=T=>{ const a=[]; for(let V=2;V<=10;V+=.25) a.push([V,n*R*T/V]); return a; };
    const r=g.plot(px,y0,pw,h,{xr:[0,10],yr:[0,5],series:[{pts:iso(200),c:COL.line,w:1.5},{pts:iso(400),c:COL.line,w:1.5},{pts:iso(600),c:COL.line,w:1.5},{pts:iso(s.p.T),c:COL.force,w:2.5}],xl:'volume (L)',yl:'pressão (atm)'});
    g.circle(r.X(s.p.V),r.Y(P),7,COL.vel,COL.ink,1.5); },
  reads:s=>{ const n=.2, R=.082, P=n*R*s.p.T/s.p.V; return [['Pressão P = nRT/V',nt(P)+' atm'],['P·V',nt(P*s.p.V)+' atm·L'],['P·V/T (sempre igual: n·R)',nt(P*s.p.V/s.p.T,3)+' atm·L/K'],['Quantidade de gás','0,2 mol'],['Temperatura em °C',nt(s.p.T-273,3)+' °C']]; }});

/* máquina térmica: rendimento */
SIMS.engine=(host)=>Sim(host,{alt:'Máquina térmica entre uma fonte quente e uma fria, com setas de energia',h:300,
  ctrls:[{k:'Tq',l:'Fonte quente T<sub>q</sub>',min:400,max:1500,step:50,v:800,u:'K',live:true},{k:'Tf',l:'Fonte fria T<sub>f</sub>',min:250,max:500,step:10,v:300,u:'K',live:true},{k:'Q1',l:'Calor recebido por ciclo Q₁',min:100,max:2000,step:100,v:1000,u:'J',live:true},{k:'k',l:'Máquina',opts:[[1,'ideal (Carnot)'],[.5,'real (metade da ideal)']],v:1,live:true}],
  draw(g,s){ const eta=(1-s.p.Tf/s.p.Tq)*s.p.k, W=eta*s.p.Q1, Q2=s.p.Q1-W, cx=g.W*.42, sc=v=>clamp(v/s.p.Q1*34,2,34);
    g.rect(cx-110,14,220,46,COL.force+'33',COL.force,10); g.text('fonte quente · '+s.p.Tq+' K',cx,42,{size:14,bold:true,align:'center'});
    g.rect(cx-110,g.H-60,220,46,COL.vel+'33',COL.vel,10); g.text('fonte fria · '+s.p.Tf+' K',cx,g.H-32,{size:14,bold:true,align:'center'});
    g.circle(cx,g.H/2,40,COL.card,COL.ink,2.5); g.text('motor',cx,g.H/2+5,{size:14,bold:true,align:'center'});
    const ln=(x1,y1,x2,y2,w,c,l)=>{ g.ctx.save(); g.ctx.lineCap='butt'; g.line(x1,y1,x2,y2,c,w); g.ctx.restore(); g.arrow(x2-(x2-x1)*.001,y2-(y2-y1)*.001,x2+(x2-x1)*.12,y2+(y2-y1)*.12,c,l,2); };
    ln(cx,62,cx,g.H/2-52,sc(s.p.Q1),COL.force,'Q₁ = '+nt(s.p.Q1)+' J'); ln(cx,g.H/2+42,cx,g.H-86,sc(Q2),COL.vel,'Q₂ = '+nt(Q2)+' J'); ln(cx+42,g.H/2,cx+130,g.H/2,sc(W),COL.energy,'W = '+nt(W)+' J');
    g.text('rendimento '+nt(eta*100,3)+'%',g.W-16,g.H/2+60,{size:18,bold:true,align:'right'}); },
  reads:s=>{ const ec=1-s.p.Tf/s.p.Tq, eta=ec*s.p.k, W=eta*s.p.Q1; return [['Rendimento de Carnot 1 − T<sub>f</sub>/T<sub>q</sub>',nt(ec*100,3)+' %'],['Rendimento desta máquina',nt(eta*100,3)+' %'],['Trabalho W = η·Q₁',nt(W)+' J'],['Calor rejeitado Q₂ = Q₁ − W',nt(s.p.Q1-W)+' J']]; }});

/* ondas numa corda */
SIMS.wave=(host)=>Sim(host,{alt:'Onda viajando numa corda com o comprimento de onda marcado',anim:true,autoplay:true,h:260,
  legend:[['vel','onda'],['force','um ponto da corda (só sobe e desce)'],['energy','comprimento de onda λ']],
  ctrls:[{k:'f',l:'Frequência f',min:.5,max:4,step:.25,v:1,u:'Hz',live:true},{k:'v',l:'Velocidade na corda v',min:1,max:8,step:.5,v:4,u:'m/s',live:true},{k:'A',l:'Amplitude',min:.2,max:1,step:.1,v:.6,u:'m',live:true}],
  step(){},
  draw(g,s){ const lam=s.p.v/s.p.f, x0=20, W=g.W-40, k=W/10, cy=g.H/2+6, amp=s.p.A*45, Y=x=>cy-amp*Math.sin(2*Math.PI*(x/lam-s.p.f*s.t));
    for(let m=0;m<=10;m++){ g.line(x0+m*k,g.H-22,x0+m*k,g.H-16,COL.muted,1); g.text(m+'',x0+m*k,g.H-4,{size:10.5,c:COL.muted,align:'center',mono:true}); } g.text('m',g.W-12,g.H-4,{size:10.5,c:COL.muted});
    g.line(x0,cy,x0+W,cy,COL.line,1,[4,4]); const pts=[]; for(let x=0;x<=10;x+=.04) pts.push([x0+x*k,Y(x)]); g.poly(pts,COL.vel,3);
    const px=3; g.circle(x0+px*k,Y(px),7,COL.force); g.line(x0+px*k,cy-amp-6,x0+px*k,cy+amp+6,COL.force,1,[2,3]);
    let c1=(s.p.f*s.t+.25)*lam; c1=((c1%lam)+lam)%lam; if(c1+lam<=10){ const y=cy-amp-18; g.line(x0+c1*k,y,x0+(c1+lam)*k,y,COL.energy,2); g.line(x0+c1*k,y-6,x0+c1*k,y+6,COL.energy,2); g.line(x0+(c1+lam)*k,y-6,x0+(c1+lam)*k,y+6,COL.energy,2); g.text('λ = '+nt(lam)+' m',x0+(c1+lam/2)*k,y-8,{size:13,bold:true,align:'center',c:COL.energy}); } },
  reads:s=>[['Comprimento de onda λ = v/f',nt(s.p.v/s.p.f)+' m'],['Período T = 1/f',nt(1/s.p.f)+' s'],['Conferindo v = λ·f',nt(s.p.v/s.p.f*s.p.f)+' m/s'],['O que muda a velocidade','o meio (a corda), não a fonte']]});

/* efeito Doppler */
SIMS.doppler=(host)=>Sim(host,{alt:'Fonte sonora em movimento emitindo frentes de onda circulares',anim:true,autoplay:true,h:300,
  ctrls:[{k:'M',l:'Velocidade da fonte (em relação ao som)',min:0,max:1.3,step:.05,v:.5,f:v=>nsig(v*340,3)+' m/s ('+nsig(v,2)+'× o som)'}],
  init(s){ s.x=-.8; s.fr=[]; s.acc=0; },
  step(s,dt){ const c=.25; s.x+=s.p.M*c*dt; s.acc+=dt; if(s.acc>=.35){ s.acc=0; s.fr.push({x:s.x,t:s.t}); } if(s.fr.length>30) s.fr.shift(); if(s.x>.9){ s.x=-.8; s.fr=[]; } },
  draw(g,s){ const k=g.W/2.1, X=x=>g.W/2+x*k, cy=g.H/2, c=.25;
    s.fr.forEach(f=>{ const r=(s.t-f.t)*c*k; g.circle(X(f.x),cy,r,null,COL.vel,1.5); });
    g.circle(X(s.x),cy,9,COL.force); g.text('ouvinte atrás',30,g.H-14,{size:12,c:COL.muted}); g.text('ouvinte à frente',g.W-30,g.H-14,{size:12,c:COL.muted,align:'right'});
    g.circle(22,cy,7,COL.ink); g.circle(g.W-22,cy,7,COL.ink); if(s.p.M>=1) g.text('a fonte passa o próprio som: cone de choque (estrondo sônico)',g.W/2,22,{size:13,bold:true,align:'center',c:COL.force}); },
  reads:s=>{ const f0=440, M=s.p.M; return [['Frequência emitida','440 Hz (lá)'],['Ouvinte à frente f·v/(v − v<sub>f</sub>)',M<1?nt(f0/(1-M))+' Hz (mais agudo)':'—'],['Ouvinte atrás f·v/(v + v<sub>f</sub>)',nt(f0/(1+M))+' Hz (mais grave)'],['Velocidade do som no ar','340 m/s']]; }});
