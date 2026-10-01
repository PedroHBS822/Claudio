/* =====================================================================
   Laboratórios com cenário: eletricidade, magnetismo e física moderna
   ===================================================================== */
function glowBall(g,x,y,r,col,label){ const c=g.ctx, gl=c.createRadialGradient(x,y,r*.5,x,y,r*2.2); gl.addColorStop(0,alpha(col,.45)); gl.addColorStop(1,alpha(col,0)); c.fillStyle=gl; c.beginPath(); c.arc(x,y,r*2.2,0,7); c.fill(); SK.ball(g,x,y,r,col); if(label) g.text(label,x,y+6,{size:Math.max(12,r*.9),bold:true,align:'center',c:'#fff'}); }
function bulb(g,x,y,r,on){ const c=g.ctx, b=clamp(on,0,1); if(b>.02){ const gl=c.createRadialGradient(x,y,2,x,y,r*4); gl.addColorStop(0,`rgba(255,220,90,${.75*b})`); gl.addColorStop(1,'rgba(255,220,90,0)'); c.fillStyle=gl; c.beginPath(); c.arc(x,y,r*4,0,7); c.fill(); }
  g.circle(x,y,r,b>.02?mix('#fff3c4','#ffd23f',b):(isDark()?'#3a3f48':'#e6e9ee'),COL.ink,1.6); g.rect(x-r*.45,y+r*.8,r*.9,r*.6,'#9aa3ad',COL.ink,2,1); g.ctx.save(); g.ctx.strokeStyle=b>.02?'#ff9f1a':'#9aa3ad'; g.ctx.lineWidth=1.5; g.ctx.beginPath(); g.ctx.moveTo(x-r*.35,y+r*.5); g.ctx.lineTo(x-r*.15,y-r*.2); g.ctx.lineTo(x+r*.15,y+r*.1); g.ctx.lineTo(x+r*.35,y-r*.2); g.ctx.lineTo(x+r*.35,y+r*.5); g.ctx.stroke(); g.ctx.restore(); }
function zigzag(g,x1,y,x2,col=COL.ink){ const n=8, w=(x2-x1)/n, pts=[[x1,y]]; for(let i=1;i<n;i++) pts.push([x1+i*w,y+(i%2?-8:8)]); pts.push([x2,y]); g.poly(pts,col,2.5); }
function battery(g,x,y,h,U){ const w=h*.42; g.rect(x-w/2,y-h/2,w,h,isDark()?'#3a3f48':'#2b3340',COL.ink,6,1.5); g.rect(x-w/2,y-h/2,w,h*.38,'#f2c94c',null,6); g.rect(x-w*.18,y-h/2-6,w*.36,6,'#9aa3ad',COL.ink,2,1); g.text('+',x,y-h/2+h*.24,{size:14,bold:true,align:'center',c:'#2b3340'}); g.text(nt(U)+' V',x,y+h*.2,{size:12,bold:true,align:'center',c:'#fff',mono:true}); }

/* lei de Coulomb: esferas carregadas em suportes */
SIMS.coulomb=(host,cfg={})=>Sim(host,{alt:'Duas esferas carregadas em suportes isolantes, com as forças de atração ou repulsão',h:270,
  legend:[['force','carga positiva'],['vel','carga negativa']],
  ctrls:[{k:'q1',l:'Carga 1',min:-5,max:5,step:1,v:cfg.q1??2,u:'μC',live:true},{k:'q2',l:'Carga 2',min:-5,max:5,step:1,v:cfg.q2??-3,u:'μC',live:true},{k:'d',l:'Distância',min:.1,max:1,step:.05,v:cfg.d??.3,u:'m',live:true}],
  draw(g,s){ const F=9e-3*s.p.q1*s.p.q2/s.p.d**2, k=(g.W-140)/1.1, base=g.H-26, cy=base-110, x1=g.W/2-s.p.d*k/2, x2=g.W/2+s.p.d*k/2, rep=F>0, L=F===0?0:clamp(18+24*Math.log10(1+Math.abs(F)*10),10,110);
    g.rect(0,0,g.W,g.H,isDark()?mix(COL.paper,'#2a3550',.3):'#f1f4f8'); g.rect(0,base,g.W,g.H-base,isDark()?'#5b4a36':'#c9b79c');
    [[x1,s.p.q1,-1],[x2,s.p.q2,1]].forEach(([x,q,sd])=>{ g.rect(x-3,cy,6,base-cy,alpha('#9fd8ff',.6),alpha('#3d6f9e',.6),2,1); g.rect(x-22,base-8,44,8,'#5b6472',null,3);
      const r=14+Math.abs(q)*3, c=q>0?'#e5484d':q<0?'#1c6fd1':'#9aa3ad'; glowBall(g,x,cy,r,c,q>0?'+':q<0?'−':'0'); g.tag(nt(q)+' μC',x,cy-r-16,c,'center',12);
      if(L) g.arrow(x+sd*(r+4)*(rep?1:-1),cy,x+sd*(rep?1:-1)*(r+4+L),cy,COL.ink,'F',3,[0,-18]); });
    SK.dim(g,x1,base-26,x2,base-26,'d = '+nt(s.p.d)+' m',COL.ink);
    g.tag(F===0?'sem força (uma das cargas é zero)':rep?'sinais iguais: repulsão':'sinais opostos: atração',g.W/2,24,COL.ink,'center',14); g.tag('F = '+nt(Math.abs(F))+' N',g.W/2,52,COL.force,'center',13); },
  reads:s=>{ const F=9e-3*s.p.q1*s.p.q2/s.p.d**2; return [['F = k·|q₁·q₂|/d²',nt(Math.abs(F))+' N'],['Com o dobro da distância',nt(Math.abs(F)/4)+' N (4× menor)'],['Força em cada carga','mesmo valor, sentidos opostos (ação e reação)'],['Constante k','9×10<sup>9</sup> N·m²/C²']]; }});

/* lei de Ohm: pilha, resistor e lâmpada */
SIMS.ohm=(host,cfg={})=>Sim(host,{alt:'Circuito com bateria, resistor e lâmpada; as bolinhas mostram a corrente',anim:true,autoplay:true,h:300,
  ctrls:[{k:'U',l:'Tensão da bateria U',min:0,max:24,step:1,v:cfg.U??12,u:'V',live:true},{k:'R',l:'Resistência R',min:1,max:100,step:1,v:cfg.R??20,u:'Ω',live:true}],
  init(s){ s.ph=0; }, step(s,dt){ s.ph+=dt*s.p.U/s.p.R*.9; },
  draw(g,s){ const narrow=g.W<560, x0=46, y0=40, w=narrow?g.W-92:Math.min(g.W*.5,330), h=narrow?150:g.H-80, I=s.p.U/s.p.R, P=s.p.U*I, per=2*(w+h);
    g.rect(0,0,g.W,g.H,isDark()?mix(COL.paper,'#2a3550',.3):'#f1f4f8'); g.rect(x0-20,y0-20,w+40,h+40,isDark()?'#1d4d3a':'#2f7a55',null,10); for(let i=0;i<60;i++) g.circle(x0-14+(i*53)%(w+28),y0-14+(i*37)%(h+28),1.2,alpha('#ffffff',.18));
    const wire='#d9a066'; g.rect(x0,y0,w,h,null,wire,4,4);
    g.rect(x0-16,y0+h/2-40,32,80,isDark()?mix(COL.paper,'#2a3550',.3):'#f1f4f8'); battery(g,x0,y0+h/2,74,s.p.U);
    g.rect(x0+w*.2-4,y0-8,w*.36+8,16,isDark()?mix(COL.paper,'#2a3550',.3):'#f1f4f8'); zigzag(g,x0+w*.2,y0,x0+w*.56,'#f2c94c'); g.tag(s.p.R+' Ω',x0+w*.38,y0+24,COL.ink,'center',12);
    bulb(g,x0+w,y0+h*.45,15,P/30); g.tag(nt(P)+' W',x0+w-30,y0+h*.45,COL.energy,'right',11.5);
    const pos=d=>{ d=((d%per)+per)%per; if(d<w) return [x0+d,y0]; d-=w; if(d<h) return [x0+w,y0+d]; d-=h; if(d<w) return [x0+w-d,y0+h]; d-=w; return [x0,y0+h-d]; };
    if(I>0) for(let i=0;i<28;i++){ const [x,y]=pos(i*per/28-s.ph*60); g.circle(x,y,3.5,'#7cc4ff'); }
    g.tag('I = '+nt(I)+' A',x0+w/2,y0+h+2,'#1c6fd1','center',12.5);
    if(!narrow){ const r=g.plot(x0+w+80,y0-10,g.W-x0-w-100,h+20,{xr:[0,24],yr:[0,Math.max(1,24/s.p.R)*1.1],series:[{pts:[[0,0],[24,24/s.p.R]],c:COL.force}],xl:'U (V)',yl:'I (A)'}); g.circle(r.X(s.p.U),r.Y(I),6,COL.vel,COL.ink,1.5); } },
  reads:s=>{ const I=s.p.U/s.p.R; return [['Corrente I = U/R',nt(I)+' A'],['Potência dissipada P = U·I',nt(s.p.U*I)+' W'],['Carga que passa por segundo',nt(I)+' C'],['Elétrons por segundo',nf(I/1.6e-19)]]; }});

/* associação de resistores: três lâmpadas em série ou em paralelo */
SIMS.resist=(host,cfg={})=>Sim(host,{alt:'Três lâmpadas (resistores) em série ou em paralelo, com corrente e tensão em cada uma',h:320,
  ctrls:[{k:'mode',l:'Ligação',opts:[['s','em série'],['p','em paralelo']],v:cfg.mode??'s',live:true},{k:'U',l:'Tensão da fonte',min:1,max:24,step:1,v:cfg.U??12,u:'V',live:true},{k:'R1',l:'R₁',min:1,max:30,step:1,v:cfg.R1??10,u:'Ω',live:true},{k:'R2',l:'R₂',min:1,max:30,step:1,v:cfg.R2??20,u:'Ω',live:true},{k:'R3',l:'R₃',min:1,max:30,step:1,v:cfg.R3??30,u:'Ω',live:true}],
  calc(s){ const R=[s.p.R1,s.p.R2,s.p.R3], U=s.p.U; if(s.p.mode==='s'){ const Req=R[0]+R[1]+R[2], I=U/Req; return {Req,I,it:R.map(()=>I),ut:R.map(r=>r*I)}; } const Req=1/(1/R[0]+1/R[1]+1/R[2]); return {Req,I:U/Req,it:R.map(r=>U/r),ut:R.map(()=>U)}; },
  draw(g,s){ const c=s.def.calc(s), x0=46, x1=g.W-30, y0=44, y1=g.H-40, R=[s.p.R1,s.p.R2,s.p.R3], th=i=>clamp(1.5+i*5,1.5,8), wire='#d9a066';
    g.rect(0,0,g.W,g.H,isDark()?mix(COL.paper,'#2a3550',.3):'#f1f4f8');
    g.line(x0,y0,x0,y1,wire,th(c.I)); g.line(x0,y1,x1,y1,wire,th(c.I)); g.rect(x0-16,(y0+y1)/2-38,32,76,isDark()?mix(COL.paper,'#2a3550',.3):'#f1f4f8'); battery(g,x0,(y0+y1)/2,70,s.p.U);
    const lamp=(x,y,i)=>{ const P=c.it[i]*c.ut[i]; bulb(g,x,y,14,P/8); g.tag('R'+'₁₂₃'[i]+' = '+R[i]+' Ω',x,y-30,COL.ink,'center',11); g.text(nt(c.it[i])+' A · '+nt(c.ut[i])+' V',x,y+36,{size:11,align:'center',mono:true,c:COL.ink}); };
    if(s.p.mode==='s'){ g.line(x0,y0,x1,y0,wire,th(c.I)); g.line(x1,y0,x1,y1,wire,th(c.I)); [.3,.55,.8].forEach((f,i)=>lamp(x0+(x1-x0)*f,y0,i)); }
    else { const xs=[.4,.62,.84].map(f=>x0+(x1-x0)*f); g.line(x0,y0,xs[2],y0,wire,th(c.I)); xs.forEach((x,i)=>{ g.line(x,y0,x,y1,wire,th(c.it[i])); lamp(x,(y0+y1)/2-6,i); }); g.line(xs[2],y1,x1,y1,wire,1); }
    g.text('espessura do fio ∝ corrente · brilho ∝ potência',g.W-10,g.H-10,{size:11.5,c:COL.muted,align:'right'}); },
  reads:s=>{ const c=s.def.calc(s); return [['Resistência equivalente',nt(c.Req)+' Ω'],['Corrente total I = U/R<sub>eq</sub>',nt(c.I)+' A'],['Potência total',nt(s.p.U*c.I)+' W'],['Regra',s.p.mode==='s'?'mesma corrente em todos; as tensões somam':'mesma tensão em todos; as correntes somam']]; }});

/* força magnética: partícula numa câmara escura com campo entrando na tela */
SIMS.magforce=(host,cfg={})=>Sim(host,{alt:'Partícula carregada girando num campo magnético que entra na tela, deixando um rastro brilhante',anim:true,h:330,
  legend:[['vel','velocidade'],['force','força magnética (sempre perpendicular à velocidade)']],
  ctrls:[{k:'q',l:'Partícula',opts:[[1,'próton (+)'],[-1,'antipróton (−)']],v:cfg.q??1},{k:'v',l:'Velocidade',min:1,max:10,step:1,v:cfg.v??5,f:v=>v+'×10⁵ m/s'},{k:'B',l:'Campo magnético B',min:.02,max:.2,step:.02,v:cfg.B??.1,u:'T'}],
  init(s){ s.ang=-Math.PI/2; s.tr=[]; },
  step(s,dt){ s.ang+=s.p.q*dt*2.2*Math.sqrt(s.p.B/.1); s.tr.push(s.ang); if(s.tr.length>70) s.tr.shift(); },
  R:s=>1.67e-27*s.p.v*1e5/(1.6e-19*s.p.B),
  draw(g,s){ g.rect(0,0,g.W,g.H,'#0b0f1a'); for(let x=18;x<g.W;x+=36) for(let y=18;y<g.H;y+=36){ g.circle(x,y,6,null,'rgba(150,170,210,.35)',1.2); g.line(x-4,y-4,x+4,y+4,'rgba(150,170,210,.35)',1.2); g.line(x-4,y+4,x+4,y-4,'rgba(150,170,210,.35)',1.2); }
    const R=s.def.R(s), rp=clamp(20+R/.52*(g.H/2-40),20,g.H/2-12), cx=g.W/2, cy=g.H/2, P=a=>[cx+rp*Math.cos(a),cy-rp*Math.sin(a)], [x,y]=P(s.ang), col=s.p.q>0?'#ff5a4e':'#4f9cff';
    g.circle(cx,cy,rp,null,'rgba(255,255,255,.12)',1); s.tr.forEach((a,i)=>{ const [tx,ty]=P(a); g.ctx.save(); g.ctx.globalAlpha=i/s.tr.length*.8; g.circle(tx,ty,2.5+i/s.tr.length*2,col); g.ctx.restore(); });
    glowBall(g,x,y,8,col); const t=[-Math.sin(s.ang)*s.p.q,-Math.cos(s.ang)*s.p.q];
    g.arrow(x,y,x+t[0]*50,y+t[1]*50,'#7cc4ff','v',3); g.arrow(x,y,x+(cx-x)/rp*40,y+(cy-y)/rp*40,'#ffb347','F',3);
    g.tag('B entra na tela (⊗)',12,g.H-14,'#1c6fd1','left',11.5); g.tag('R = '+nt(R*100)+' cm',g.W-12,22,'#ffb347','right',12); },
  reads:s=>{ const v=s.p.v*1e5, F=1.6e-19*v*s.p.B, R=s.def.R(s); return [['Força F = |q|·v·B',nf(F)+' N'],['Raio da trajetória R = m·v/(|q|·B)',nt(R*100)+' cm'],['Período T = 2πm/(|q|·B)',nf(2*Math.PI*1.67e-27/(1.6e-19*s.p.B))+' s'],['Trabalho da força magnética','zero: ela só muda a direção']]; }});

/* indução: ímã entrando numa bobina de cobre ligada a uma lâmpada */
SIMS.induct=(host,cfg={})=>Sim(host,{alt:'Ímã indo e voltando dentro de uma bobina de cobre ligada a uma lâmpada e a um medidor',anim:true,autoplay:true,h:390,
  legend:[['acc','fluxo magnético Φ'],['force','tensão induzida (fem)']],
  ctrls:[{k:'w',l:'Rapidez do movimento',min:.5,max:3,step:.25,v:cfg.w??1.25,f:v=>nsig(v,3)+'×',live:true},{k:'N',l:'Número de espiras',min:10,max:200,step:10,v:cfg.N??50,live:true},{k:'mv',l:'Movimento',opts:[[1,'vai e volta'],[0,'ímã parado dentro']],v:cfg.mv??1,live:true}],
  init(s){ s.hist=[]; s.peak=0; },
  phi:x=>1/(1+(x/.6)**2)**1.5,
  step(s,dt){ const xm=t=>s.p.mv?2.2*Math.cos(s.p.w*t):0, x=xm(s.t), x2=xm(s.t+dt), dphi=(s.def.phi(x2)-s.def.phi(x))/dt, emf=-s.p.N*dphi*.02; s.x=x2; s.emf=emf; s.peak=Math.max(s.peak*.995,Math.abs(emf)); s.hist.push([s.t,s.def.phi(x2),emf]); while(s.hist.length&&s.hist[0][0]<s.t-6) s.hist.shift(); },
  draw(g,s){ const cy=92, cx=g.W*.36, k=Math.min(46,g.W/12), x=cx+(s.x??2.2)*k, nt0=Math.round(s.p.N/25)+3;
    g.rect(0,0,g.W,cy+64,isDark()?mix(COL.paper,'#2a3550',.3):'#f1f4f8'); g.rect(cx-60,cy+38,130,8,isDark()?'#5b4a36':'#b89a72',null,3);
    for(let i=0;i<nt0;i++){ const xx=cx-(nt0-1)*5+i*10; g.ctx.save(); g.ctx.beginPath(); g.ctx.ellipse(xx,cy,7,36,0,0,Math.PI*2); g.ctx.strokeStyle='#c8762f'; g.ctx.lineWidth=3.2; g.ctx.stroke(); g.ctx.strokeStyle='rgba(255,220,170,.5)'; g.ctx.lineWidth=1; g.ctx.stroke(); g.ctx.restore(); }
    g.rect(x-52,cy-13,52,26,'#e5484d',COL.ink,4,1.5); g.rect(x,cy-13,52,26,'#1c6fd1',COL.ink,4,1.5); g.text('N',x-26,cy+5,{size:13,bold:true,align:'center',c:'#fff'}); g.text('S',x+26,cy+5,{size:13,bold:true,align:'center',c:'#fff'});
    const e=s.emf||0, gx=g.W*.82, gy=cy+16; g.line(cx+(nt0)*5,cy+30,gx-52,gy+10,'#c8762f',2); g.line(cx-(nt0)*5,cy+30,cx-(nt0)*5,cy+52,'#c8762f',2);
    bulb(g,g.W*.64,cy-20,13,Math.abs(e)/5); g.line(g.W*.64,cy-6,g.W*.64,cy+20,'#c8762f',2);
    g.ctx.save(); g.ctx.beginPath(); g.ctx.arc(gx,gy,44,Math.PI,2*Math.PI); g.ctx.fillStyle=COL.card; g.ctx.fill(); g.ctx.strokeStyle=COL.ink; g.ctx.lineWidth=2; g.ctx.stroke(); g.ctx.restore();
    for(let i=-4;i<=4;i++){ const a=-Math.PI/2+i*.3; g.line(gx+Math.cos(a)*36,gy+Math.sin(a)*36,gx+Math.cos(a)*42,gy+Math.sin(a)*42,COL.muted,1.2); }
    const an=-Math.PI/2+clamp(e/4,-1,1)*1.2; g.line(gx,gy,gx+Math.cos(an)*38,gy+Math.sin(an)*38,COL.force,3); g.circle(gx,gy,4,COL.ink); g.text('medidor',gx,gy+18,{size:11,c:COL.muted,align:'center'});
    const t1=s.t, top=cy+80, h=(g.H-top-30)/2-10, xr=[t1-6,t1];
    g.plot(50,top,g.W-70,h,{xr,yr:[0,1.05],series:[{pts:s.hist.map(p=>[p[0],p[1]]),c:COL.acc}],yl:'fluxo Φ'}); g.plot(50,top+h+26,g.W-70,h,{xr,yr:[-8,8],series:[{pts:s.hist.map(p=>[p[0],p[2]]),c:COL.force}],yl:'fem induzida',xl:'tempo (s)'}); },
  reads:s=>[['Fem agora (unidades do app)',nt(s.emf||0)],['Pico recente da fem',nt(s.peak||0)],['Por que surge corrente?','o fluxo dentro da bobina está variando'],['Mais espiras ou mais rápido','fem maior (lei de Faraday)']]});

/* efeito fotoelétrico: lanterna, placa de metal e elétrons */
const METAIS=[[2.28,'sódio'],[4.3,'zinco'],[4.7,'cobre']];
function lamColor(l){ if(l<380) return '#9b7bff'; const t=[[380,[120,0,200]],[440,[0,40,255]],[490,[0,200,255]],[510,[0,220,80]],[580,[255,230,0]],[645,[255,40,0]],[700,[200,0,0]]]; let i=0; while(i<t.length-2&&l>t[i+1][0]) i++; const [a,ca]=t[i],[b,cb]=t[i+1], f=clamp((l-a)/(b-a),0,1); return `rgb(${ca.map((c,j)=>Math.round(c+(cb[j]-c)*f)).join(',')})`; }
SIMS.photo=(host,cfg={})=>Sim(host,{alt:'Lanterna disparando fótons numa placa de metal que solta elétrons',anim:true,autoplay:true,h:290,
  ctrls:[{k:'l',l:'Comprimento de onda da luz λ',min:200,max:700,step:10,v:cfg.l??450,u:'nm',live:true},{k:'I',l:'Intensidade (fótons por segundo)',min:1,max:10,step:1,v:cfg.I??5,live:true},{k:'W',l:'Metal',opts:METAIS.map(x=>[x[0],x[1]]),v:cfg.W??2.28,live:true}],
  init(s){ s.ph=[]; s.el=[]; s.acc=0; s.n=0; },
  step(s,dt){ const E=1240/s.p.l, K=E-s.p.W; s.acc+=dt*s.p.I*4; while(s.acc>=1){ s.acc--; s.ph.push({x:0,y:Math.random()}); }
    s.ph.forEach(p=>p.x+=dt*1.4); s.ph=s.ph.filter(p=>{ if(p.x>=1){ if(K>0){ s.el.push({x:0,y:p.y,v:.3+Math.sqrt(K)*.5}); s.n++; } return false; } return true; });
    s.el.forEach(e=>e.x+=e.v*dt); s.el=s.el.filter(e=>e.x<1); },
  draw(g,s){ const E=1240/s.p.l, K=E-s.p.W, px=g.W*.58, c=lamColor(s.p.l);
    g.rect(0,0,g.W,g.H,'#0b0f1a'); const beam=g.ctx.createLinearGradient(60,0,px,0); beam.addColorStop(0,alpha(c,.28)); beam.addColorStop(1,alpha(c,.06)); g.poly([[60,g.H/2-22],[px,30],[px,g.H-30],[60,g.H/2+22]],null,0,beam,true);
    g.rect(8,g.H/2-26,52,52,'#3a3f48','#9aa3ad',8,2); g.rect(52,g.H/2-30,14,60,'#5b6472',null,4); g.circle(64,g.H/2,14,c); g.tag(s.p.l<380?'UV':'luz',34,g.H/2,'#2b3340','center',10.5);
    const mg=g.ctx.createLinearGradient(px,0,px+16,0); mg.addColorStop(0,'#c4ccd6'); mg.addColorStop(1,'#7b8696'); g.rect(px,30,16,g.H-60,mg,'#2b3340',3,1.5); g.tag(METAIS.find(m=>m[0]===s.p.W)[1],px+8,18,'#2b3340','center',11.5);
    s.ph.forEach(p=>{ const x=70+p.x*(px-80), y=g.H/2+(p.y-.5)*(g.H-80)*p.x; g.ctx.save(); g.ctx.shadowColor=c; g.ctx.shadowBlur=8; g.poly([[x-12,y],[x-8,y-4],[x-4,y],[x,y+4],[x+4,y]],c,2.4); g.ctx.restore(); });
    s.el.forEach(e=>{ const x=px+22+e.x*(g.W-px-34), y=40+e.y*(g.H-80); glowBall(g,x,y,4.5,'#4f9cff'); });
    g.tag(K>0?'elétrons arrancados: '+s.n:'nenhum elétron: cada fóton tem pouca energia',g.W-12,g.H-14,K>0?COL.ok:COL.force,'right',12); g.tag('fóton: '+nt(E)+' eV',g.W*.3,22,'#2b3340','center',12); },
  reads:s=>{ const E=1240/s.p.l, K=E-s.p.W; return [['Energia de cada fóton E = h·f',nt(E)+' eV'],['Frequência f = c/λ',nf(3e8/(s.p.l*1e-9))+' Hz'],['Função trabalho do metal',nt(s.p.W)+' eV'],['Energia cinética máxima E − φ',K>0?nt(K)+' eV':'não há emissão'],['Maior λ que ainda arranca elétrons',nt(1240/s.p.W)+' nm']]; }});

/* relatividade: relógio de luz dentro de uma nave */
SIMS.rel=(host,cfg={})=>Sim(host,{alt:'Dois relógios de luz: um parado e outro dentro de uma nave em movimento, que marca o tempo mais devagar',anim:true,autoplay:true,h:310,
  ctrls:[{k:'b',l:'Velocidade da nave (fração de c)',min:0,max:.99,step:.01,v:cfg.b??.8,f:v=>nsig(v*100,3)+'% de c'}],
  init(s){ s.x=0; s.t0=0; s.t1=0; s.ph0=0; s.ph1=0; },
  step(s,dt){ const b=s.p.b, c=1.2; s.ph0+=dt*c; s.ph1+=dt*c*Math.sqrt(1-b*b); s.x+=dt*b*c; const fl=v=>Math.floor(v/2); s.t0=fl(s.ph0); s.t1=fl(s.ph1); },
  draw(g,s){ g.rect(0,0,g.W,g.H,'#070a16'); for(let i=0;i<60;i++){ const sx=((i*137.3-s.x*40*(1+i%3))%g.W+g.W)%g.W, sy=(i*71.7)%g.H; g.rect(sx,sy,1.4+(s.p.b>.5?s.p.b*6*(i%2):0),1.4,'rgba(255,255,255,.6)'); }
    const H=g.H-110, top=50, w=g.W*.26, tri=p=>{ const q=p%2; return q<1?q:2-q; };
    const clock=(x,ph,lab,n)=>{ g.line(x-22,top,x+22,top,'#cfd5dc',3); g.line(x-22,top+H,x+22,top+H,'#cfd5dc',3); const y=top+H-tri(ph)*H; glowBall(g,x,y,6,'#ffd166'); g.tag(lab,x,top+H+22,'#2b3340','center',12); g.tag(n+' tiques',x,top+H+48,'#2b3340','center',12); };
    g.rect(w/2+10-40,top-14,80,H+28,null,'rgba(255,255,255,.25)',10,1.5); clock(w/2+10,s.ph0,'relógio parado',s.t0);
    const span=g.W-w-80, xx=w+60+((s.x*span/2.4)%span); g.poly([[xx-44,top-16],[xx+30,top-16],[xx+66,top+H/2],[xx+30,top+H+16],[xx-44,top+H+16]],'#9aa3ad',2,alpha('#5b6472',.55),true);
    g.poly([[xx-44,top+H/2-20],[xx-44-20-s.p.b*30,top+H/2],[xx-44,top+H/2+20]],null,0,'#ff9f43',true); clock(xx,s.ph1,'na nave',s.t1);
    g.tag('γ = '+nt(1/Math.sqrt(1-s.p.b**2)),g.W-12,22,'#2b3340','right',14); },
  reads:s=>{ const gm=1/Math.sqrt(1-s.p.b**2); return [['Fator de Lorentz γ = 1/√(1 − v²/c²)',nt(gm)],['1 s na nave dura, para quem está parado',nt(gm)+' s'],['Uma régua de 1 m em movimento mede',nt(1/gm)+' m'],['A velocidade da luz','é a mesma para os dois observadores']]; }});
