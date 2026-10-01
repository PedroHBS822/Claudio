/* =====================================================================
   Laboratórios novos: condução de calor, MHS, ondas estacionárias,
   espectro eletromagnético e campo magnético de um fio
   ===================================================================== */

/* condução de calor pela lei de Fourier */
const MATS=[[400,'cobre'],[50,'aço'],[0.8,'vidro'],[0.15,'madeira'],[0.03,'isopor']];
SIMS.conduc=(host)=>Sim(host,{alt:'Placa de um material entre um lado quente e um frio, com o calor atravessando por condução',anim:true,autoplay:true,h:300,
  legend:[['force','lado quente'],['vel','lado frio'],['energy','calor atravessando a placa']],
  ctrls:[{k:'k',l:'Material',opts:MATS.map(m=>[m[0],m[1]]),v:50,live:true},{k:'L',l:'Espessura L',min:1,max:20,step:1,v:5,u:'cm',live:true},{k:'A',l:'Área A',min:.5,max:4,step:.5,v:1,u:'m²',live:true},{k:'dT',l:'Diferença de temperatura ΔT',min:5,max:80,step:5,v:30,u:'°C',live:true}],
  phi:s=>s.p.k*s.p.A*s.p.dT/(s.p.L/100),
  inten:s=>clamp((Math.log10(s.def.phi(s))+1)/7,.03,1),
  init(s){ s.q=[]; s.acc=0; },
  step(s,dt){ const I=s.def.inten(s); s.acc+=dt*(.6+30*I); while(s.acc>=1){ s.acc--; s.q.push({x:0,y:.08+.84*Math.random()}); } const v=.12+.8*I; s.q.forEach(p=>p.x+=v*dt); s.q=s.q.filter(p=>p.x<1); },
  geo(s){ const W=s.W, H=s.H, bw=Math.max(58,Math.min(90,W*.12)), sw=26+(s.p.L-1)/19*Math.max(40,W-2*bw-120), x0=(W-sw)/2, sh=(H-120)*(.4+.6*s.p.A/4), y0=58+(H-120-sh)/2; return {bw,sw,x0,sh,y0}; },
  draw(g,s){ const {bw,sw,x0,sh,y0}=s.def.geo(s), phi=s.def.phi(s), I=s.def.inten(s), Tf=20, Tq=20+s.p.dT, name=MATS.find(m=>m[0]===s.p.k)[1];
    g.rect(x0-bw,y0-14,bw,sh+28,COL.force+'30',COL.force,8,2); g.text(nt(Tq)+' °C',x0-bw/2,y0+sh/2+5,{size:14,bold:true,align:'center',c:COL.force});
    g.rect(x0+sw,y0-14,bw,sh+28,COL.vel+'30',COL.vel,8,2); g.text(nt(Tf)+' °C',x0+sw+bw/2,y0+sh/2+5,{size:14,bold:true,align:'center',c:COL.vel});
    const c=g.ctx, gr=c.createLinearGradient(x0,0,x0+sw,0); gr.addColorStop(0,COL.force); gr.addColorStop(1,COL.vel);
    c.save(); c.globalAlpha=.45; g.rect(x0,y0,sw,sh,gr); c.restore(); g.rect(x0,y0,sw,sh,null,COL.ink,0,1.5);
    s.q.forEach(p=>{ const x=x0-bw*.2+p.x*(sw+bw*.4), y=y0+p.y*sh; g.circle(x,y,3.2,COL.energy); });
    const ay=34, aw=Math.max(sw+bw,120); g.arrow(g.W/2-aw/2,ay,g.W/2+aw/2,ay,COL.energy,null,2+7*I);
    g.text('Φ = '+nt(phi)+' W',g.W/2,ay-14,{size:14,bold:true,align:'center',c:COL.energy});
    g.text(name,x0+sw/2,y0+sh+34,{size:13,bold:true,align:'center'});
    const yb=y0+sh+8; g.line(x0,yb,x0+sw,yb,COL.muted,1.2); g.line(x0,yb-4,x0,yb+4,COL.muted,1.2); g.line(x0+sw,yb-4,x0+sw,yb+4,COL.muted,1.2);
    g.text('L = '+s.p.L+' cm',x0+sw/2,y0+sh+50,{size:11.5,align:'center',c:COL.muted,mono:true}); },
  reads:s=>{ const phi=s.def.phi(s); return [['Fluxo de calor Φ = k·A·ΔT/L',nf(phi)+' W'],['Energia que atravessa em 1 hora',nf(phi*3600)+' J'],['Condutividade k do material',nsig(s.p.k,3)+' W/(m·K)'],['O material é',s.p.k<=.2?'isolante':s.p.k>=40?'bom condutor':'mau condutor']]; }});

/* MHS: massa-mola e pêndulo lado a lado */
SIMS.mhs=(host,cfg={})=>Sim(host,{alt:'Bloco preso a uma mola e um pêndulo oscilando lado a lado, com o gráfico da posição de cada um no tempo',anim:true,autoplay:true,h:w=>w<560?440:400,
  legend:[['vel','massa na mola'],['force','pêndulo']],
  ctrls:[{k:'m',l:'Massa m (a mesma nos dois)',min:.1,max:2,step:.1,v:cfg.m??.5,u:'kg',live:true},{k:'k',l:'Constante da mola k',min:5,max:80,step:5,v:cfg.k??20,u:'N/m',live:true},{k:'L',l:'Comprimento do pêndulo L',min:.2,max:2.5,step:.1,v:cfg.L??1,u:'m',live:true},{k:'A',l:'Amplitude (mola · pêndulo)',min:.02,max:.1,step:.01,v:.06,f:v=>nsig(v*100,2)+' cm · '+nsig(v*150,2)+'°',live:true}],
  step(){},
  pos(s,t){ const ws=Math.sqrt(s.p.k/s.p.m), wp=Math.sqrt(GRAV/s.p.L); return [Math.cos(ws*t),Math.cos(wp*t)]; },
  draw(g,s){ const W=g.W, H=g.H, top=18, gh=Math.min(130,H*.3), gy=H-gh-30, zone=gy-top-36, t=s.t, [xs,xp]=s.def.pos(s,t), sz=16+14*Math.cbrt(s.p.m);
    g.line(14,top,W-14,top,COL.ink,3);
    for(let x=18;x<W-14;x+=12) g.line(x,top,x+8,top-8,COL.line,1);
    /* mola */
    const cx=W*.27, yEq=top+zone*.55, sc=zone*.32/.1, yb=yEq+xs*s.p.A*sc, y1=top+2, y2=yb-sz/2, n=14, pts=[[cx,y1],[cx,y1+8]];
    for(let i=1;i<n;i++) pts.push([cx+(i%2?11:-11),y1+8+(y2-y1-16)*i/n]); pts.push([cx,y2-8],[cx,y2]); g.poly(pts,COL.muted,2);
    g.line(cx-sz,yEq,cx+sz,yEq,COL.line,1,[4,4]); g.rect(cx-sz/2,yb-sz/2,sz,sz,COL.vel,COL.ink,4,1.5);
    g.text('T = '+nt(2*Math.PI*Math.sqrt(s.p.m/s.p.k))+' s',cx+20,top+24,{size:13,bold:true,c:COL.vel});
    /* pêndulo */
    const px=W*.68, lp=30+(zone-20)*(s.p.L/2.5), th=s.p.A*150*Math.PI/180*xp, bx=px+lp*Math.sin(th), by=top+lp*Math.cos(th);
    g.line(px,top,px,top+lp+sz/2,COL.line,1,[4,4]); g.line(px,top,bx,by,COL.muted,2); g.circle(px,top,4,COL.ink); g.circle(bx,by,sz/2+1,COL.force,COL.ink,1.5);
    g.text('T = '+nt(2*Math.PI*Math.sqrt(s.p.L/GRAV))+' s',px+16,top+24,{size:13,bold:true,c:COL.force});
    /* gráfico */
    const t0=Math.max(0,t-6), pv=[], pp=[]; for(let u=t0;u<=t+1e-9;u+=.02){ const [a,b]=s.def.pos(s,u); pv.push([u,a]); pp.push([u,b]); }
    g.plot(42,gy,W-58,gh,{xr:[t0,t0+6],yr:[-1.2,1.2],series:[{pts:pv,c:COL.vel,dot:true},{pts:pp,c:COL.force,dot:true}],xl:'tempo (s)',yl:'posição ÷ amplitude'}); },
  reads:s=>{ const Ts=2*Math.PI*Math.sqrt(s.p.m/s.p.k), Tp=2*Math.PI*Math.sqrt(s.p.L/GRAV); return [['Período da mola 2π√(m/k)',nt(Ts)+' s'],['Período do pêndulo 2π√(L/g)',nt(Tp)+' s'],['Frequências (mola · pêndulo)',nt(1/Ts)+' Hz · '+nt(1/Tp)+' Hz'],['Energia da mola k·A²/2',nt(.5*s.p.k*s.p.A**2)+' J']]; }});

/* ondas estacionárias em cordas e tubos */
SIMS.harm=(host,cfg={})=>Sim(host,{alt:'Onda estacionária numa corda ou dentro de um tubo, com nós e ventres marcados',anim:true,autoplay:true,h:290,
  legend:[['vel','onda agora'],['muted','limites da vibração'],['force','nós (pontos parados)']],
  ctrls:[{k:'tipo',l:'Onde está a onda',opts:[['corda','corda presa'],['aberto','tubo aberto'],['fechado','tubo fechado']],v:cfg.tipo??'corda',live:true},{k:'n',l:'Modo de vibração',min:1,max:5,step:1,v:cfg.n??1,f:v=>v+'º modo',live:true},{k:'L',l:'Comprimento L',min:.2,max:2,step:.1,v:cfg.L??1,u:'m',live:true},{k:'v',l:'Velocidade da onda v',min:100,max:400,step:10,v:cfg.v??340,u:'m/s',live:true}],
  mode(s){ const L=s.p.L, t=s.p.tipo, h=t==='fechado'?2*s.p.n-1:s.p.n, lam=t==='fechado'?4*L/h:2*L/h, f1=t==='fechado'?s.p.v/(4*L):s.p.v/(2*L);
    const y=t==='corda'?u=>Math.sin(h*Math.PI*u):t==='aberto'?u=>Math.cos(h*Math.PI*u):u=>Math.sin(h*Math.PI*u/2);
    const nodes=[]; for(let j=0;j<=2*h;j++){ const u=t==='corda'?j/h:t==='aberto'?(j+.5)/h:2*j/h; if(u<=1+1e-9) nodes.push(u); }
    return {h,lam,f:s.p.v/lam,f1,y,nodes}; },
  step(){},
  draw(g,s){ const m=s.def.mode(s), x0=34, x1=g.W-34, cy=g.H/2-6, amp=Math.min(62,g.H*.24), X=u=>x0+u*(x1-x0), ph=Math.cos(2*Math.PI*.8*s.t);
    if(s.p.tipo==='corda'){ g.rect(x0-10,cy-40,8,80,COL.muted,COL.ink,2,1); g.rect(x1+2,cy-40,8,80,COL.muted,COL.ink,2,1); }
    else { const th=amp+16; g.line(x0,cy-th,x1,cy-th,COL.ink,3); g.line(x0,cy+th,x1,cy+th,COL.ink,3); if(s.p.tipo==='fechado') g.line(x0,cy-th,x0,cy+th,COL.ink,5);
      g.text(s.p.tipo==='fechado'?'fechado':'aberto',x0,cy+th+18,{size:11.5,c:COL.muted,align:'center'}); g.text('aberto',x1,cy+th+18,{size:11.5,c:COL.muted,align:'center'}); }
    const up=[],dn=[],now=[]; for(let i=0;i<=240;i++){ const u=i/240, y=m.y(u); up.push([X(u),cy-amp*y]); dn.push([X(u),cy+amp*y]); now.push([X(u),cy-amp*y*ph]); }
    g.poly(up,COL.muted,1.2); g.poly(dn,COL.muted,1.2); g.poly(now,COL.vel,3);
    m.nodes.forEach(u=>g.circle(X(u),cy,5,COL.force,COL.card,1.5));
    g.text(`${m.h}º harmônico · λ = ${nt(m.lam)} m · f = ${nt(m.f)} Hz`,g.W/2,26,{size:14,bold:true,align:'center'});
    g.text(s.p.tipo==='corda'?'nas pontas presas: nós':s.p.tipo==='aberto'?'nas pontas abertas: ventres':'ponta fechada: nó · ponta aberta: ventre',g.W/2,g.H-12,{size:12,align:'center',c:COL.muted}); },
  reads:s=>{ const m=s.def.mode(s); return [['Harmônico',m.h+'º'+(s.p.tipo==='fechado'?' (só ímpares)':'')],['Comprimento de onda λ',nt(m.lam)+' m'],['Frequência f = v/λ',nt(m.f)+' Hz'],['Fundamental deste '+(s.p.tipo==='corda'?'fio':'tubo'),nt(m.f1)+' Hz'],['Nós (pontos parados)',String(m.nodes.length)]]; }});

/* espectro eletromagnético */
const BANDS=[[3,-.5,'ondas de rádio','rádio','rádio AM e FM, TV aberta, radioamador','energy'],[-.5,-3,'micro-ondas','micro-ondas','forno de micro-ondas, Wi-Fi, celular, radar','ok'],[-3,Math.log10(700e-9),'infravermelho','infraverm.','calor do Sol e do fogo, controle remoto, câmera térmica','force'],[Math.log10(700e-9),Math.log10(400e-9),'luz visível','visível','a única faixa que nossos olhos enxergam',''],[Math.log10(400e-9),-8,'ultravioleta','UV','bronzeado e queimadura de sol, lâmpada germicida','acc'],[-8,-11,'raios X','raios X','radiografia e tomografia','vel'],[-11,-13,'raios gama','gama','núcleos radioativos, radioterapia','muted']];
function fmtLam(m){ const u=m>=1?[1,'m']:m>=1e-3?[1e-3,'mm']:m>=1e-6?[1e-6,'μm']:m>=1e-9?[1e-9,'nm']:[1e-12,'pm']; return nsig(m/u[0],3)+' '+u[1]; }
function bandOf(x){ return BANDS.find(b=>x<=b[0]&&x>b[1])||(x>3?BANDS[0]:BANDS[BANDS.length-1]); }
SIMS.spectrum=(host,cfg={})=>{ const setX=(s,v)=>{ s.p.x=v; const inp=$(`#${host.id}-x`); if(inp){ inp.value=v; $(`#${host.id}-x-o`).textContent=fmtLam(10**v); } };
  return Sim(host,{alt:'Régua do espectro eletromagnético, das ondas de rádio aos raios gama, com a onda escolhida desenhada acima',h:w=>w<560?300:270,
  ctrls:[{k:'x',l:'Comprimento de onda λ (escala de potências de 10)',min:-12,max:3,step:.02,v:cfg.x??Math.log10(530e-9),f:v=>fmtLam(10**v),live:true}],
  btns:[{l:'Rádio FM',f:s=>setX(s,Math.log10(3))},{l:'Micro-ondas',f:s=>setX(s,Math.log10(.122))},{l:'Luz verde',f:s=>setX(s,Math.log10(530e-9))},{l:'Ultravioleta',f:s=>setX(s,Math.log10(300e-9))},{l:'Raio X',f:s=>setX(s,Math.log10(.1e-9))}],
  draw(g,s){ const W=g.W, x0=16, x1=W-16, X=v=>x0+(3-v)/15*(x1-x0), by=g.H*.52, bh=34, x=s.p.x, lam=10**x, b=bandOf(x), nm=lam*1e9;
    const wc=nm>=380&&nm<=750?lamColor(nm):COL.ink, vis=clamp(8+(x+12)/15*230,8,238), cy=by-62, A=Math.min(24,g.H*.08);
    const pts=[]; for(let px=x0;px<=x1;px+=1.5) pts.push([px,cy-A*Math.sin(2*Math.PI*(px-x0)/vis)]); g.poly(pts,wc,2.4);
    BANDS.forEach(([a,c,,short,,col])=>{ const xa=X(Math.min(a,3)), xc=X(Math.max(c,-12)); if(!col){ const gr=g.ctx.createLinearGradient(xa,0,xc,0); [[700,0],[620,.25],[580,.42],[530,.58],[470,.78],[400,1]].forEach(([l,o])=>gr.addColorStop(o,lamColor(l))); g.rect(xa,by,xc-xa,bh,gr); }
      else g.rect(xa,by,xc-xa,bh,COL[col]+'40'); });
    g.rect(x0,by,x1-x0,bh,null,COL.line,0,1);
    BANDS.forEach(([a,c,,short],i)=>{ const xm=(X(Math.min(a,3))+X(Math.max(c,-12)))/2; if(short==='visível'){ g.line(xm,by+bh,xm,by+bh+14,COL.muted,1); g.text(short,xm,by+bh+26,{size:11,align:'center',c:COL.muted}); } else g.text(W<500?({'micro-ondas':'micro','infraverm.':'IV','raios X':'X'}[short]||short):short,xm,by+bh/2+4,{size:W<500?10:11.5,align:'center',c:COL.ink,bold:true}); });
    [[3,'1 km'],[0,'1 m'],[-3,'1 mm'],[-6,'1 μm'],[-9,'1 nm'],[-12,'1 pm']].forEach(([v,t])=>{ g.line(X(v),by-4,X(v),by,COL.muted,1); g.text(t,X(v),by-8,{size:10.5,align:v===3?'left':v===-12?'right':'center',c:COL.muted,mono:true}); });
    const mx=X(x); g.line(mx,by-2,mx,by+bh+2,COL.ink,2.5); g.poly([[mx-7,by+bh+12],[mx+7,by+bh+12],[mx,by+bh+3]],null,0,COL.ink,true);
    g.text(b[2],clamp(mx,x0+50,x1-50),by+bh+50,{size:14,bold:true,align:'center'});
    g.text('frequência e energia do fóton aumentam →',x1,g.H-8,{size:11.5,align:'right',c:COL.muted}); },
  reads:s=>{ const lam=10**s.p.x, b=bandOf(s.p.x), E=1240e-9/lam; return [['Faixa',b[2]],['Comprimento de onda λ',fmtLam(lam)],['Frequência f = c/λ',nf(3e8/lam)+' Hz'],['Energia de cada fóton',nf(E)+' eV'+(E>=10?' (ionizante)':'')],['Onde aparece',b[4]]]; }}); };

/* campo magnético de um fio reto: linhas circulares, bússolas e uma sonda */
SIMS.wireB=(host)=>Sim(host,{alt:'Fio com corrente visto de cima, com linhas de campo circulares, bússolas e uma sonda arrastável',h:w=>w<560?Math.round(w*.85+200):350,
  legend:[['force','norte das bússolas'],['energy','sonda: campo naquele ponto'],['acc','B contra a distância']],
  ctrls:[{k:'i',l:'Corrente i',min:1,max:20,step:1,v:10,u:'A',live:true},{k:'dir',l:'Sentido da corrente',opts:[['sai','saindo da tela'],['entra','entrando na tela']],v:'sai',live:true}],
  init(s){ if(!s.pr) s.pr=[6,-4]; },
  geo(s){ const W=s.W, H=s.H, narrow=W<560, rw=narrow?W:Math.min(W*.56,H), rh=narrow?Math.round(W*.85):H, cx=rw/2, cy=rh/2, k=(Math.min(rw,rh)/2-14)/20;
    return {narrow,rw,rh,cx,cy,k,gx:narrow?46:rw+54,gy:narrow?rh+26:34,gw:narrow?W-64:W-rw-72,gh:narrow?H-rh-72:H-90}; },
  B:(i,dcm)=>2e-7*i/(dcm/100),
  drag:{ down(s,x,y){ const q=s.def.geo(s), px=q.cx+s.pr[0]*q.k, py=q.cy+s.pr[1]*q.k; return Math.hypot(px-x,py-y)<22; },
    move(s,x,y){ const q=s.def.geo(s); let dx=(x-q.cx)/q.k, dy=(y-q.cy)/q.k; const d=Math.hypot(dx,dy); if(d<1){ dx=dx/(d||1); dy=d?dy/d:-1; } else if(d>20){ dx*=20/d; dy*=20/d; } s.pr=[dx,dy]; } },
  draw(g,s){ const q=s.def.geo(s), sg=s.p.dir==='sai'?1:-1, tan=(dx,dy)=>{ const r=Math.hypot(dx,dy)||1; return [sg*dy/r,-sg*dx/r]; };
    g.ctx.save(); g.ctx.beginPath(); g.ctx.rect(0,0,q.rw,q.rh); g.ctx.clip();
    [2,4,7,11,16].forEach(r=>{ const R=r*q.k; g.circle(q.cx,q.cy,R,null,COL.acc+'66',1.4); [0,Math.PI].forEach(a0=>{ const a=a0+Math.PI/4, x=q.cx+R*Math.cos(a), y=q.cy+R*Math.sin(a), [tx,ty]=tan(x-q.cx,y-q.cy); g.arrow(x-tx*6,y-ty*6,x+tx*6,y+ty*6,COL.acc,null,1.6); }); });
    const st=Math.max(30,q.rw/10); for(let x=st/2;x<q.rw;x+=st) for(let y=st/2;y<q.rh;y+=st){ const dx=x-q.cx, dy=y-q.cy; if(Math.hypot(dx,dy)<1.6*q.k+10) continue; const [tx,ty]=tan(dx,dy), L=Math.min(9,st*.3);
      g.line(x,y,x+tx*L,y+ty*L,COL.force,3); g.line(x,y,x-tx*L,y-ty*L,COL.muted,3); g.circle(x,y,1.8,COL.ink); }
    g.circle(q.cx,q.cy,13,COL.card,COL.ink,2.2); if(sg>0) g.circle(q.cx,q.cy,4,COL.ink); else { g.line(q.cx-6,q.cy-6,q.cx+6,q.cy+6,COL.ink,2.2); g.line(q.cx-6,q.cy+6,q.cx+6,q.cy-6,COL.ink,2.2); }
    const px=q.cx+s.pr[0]*q.k, py=q.cy+s.pr[1]*q.k, d=Math.hypot(...s.pr), B=s.def.B(s.p.i,d), [tx,ty]=tan(s.pr[0],s.pr[1]), L=clamp(20+18*Math.log10(B/1e-6),14,70);
    g.line(q.cx,q.cy,px,py,COL.muted,1,[3,4]); g.text('d = '+nt(d)+' cm',(q.cx+px)/2+8,(q.cy+py)/2-6,{size:12,mono:true,c:COL.muted});
    g.circle(px,py,8,COL.energy,COL.ink,1.5); g.arrow(px,py,px+tx*L,py+ty*L,COL.energy,'B',3);
    const cap=sg>0?'corrente saindo da tela: campo anti-horário':'corrente entrando na tela: campo horário'; g.font(11.5); g.rect(4,q.rh-24,g.ctx.measureText(cap).width+10,20,COL.paper+'e6',null,5); g.text(cap,9,q.rh-10,{size:11.5,c:COL.muted});
    g.ctx.restore();
    if(q.gw>80&&q.gh>60){ const top=20*s.p.i, pts=[]; for(let x=1;x<=20;x+=.1) pts.push([x,s.def.B(s.p.i,x)*1e6]);
      const r=g.plot(q.gx,q.gy,q.gw,q.gh,{xr:[0,20],yr:[0,top*1.05],series:[{pts,c:COL.acc}],xl:'distância d (cm)',yl:'B (μT)'});
      if(50<top) { g.line(r.X(0),r.Y(50),r.X(20),r.Y(50),COL.muted,1.2,[5,4]); g.text('Terra ≈ 50 μT',r.X(20)-4,r.Y(50)-6,{size:11,align:'right',c:COL.muted}); }
      g.circle(r.X(d),r.Y(B*1e6),6,COL.energy,COL.ink,1.5); } },
  reads:s=>{ const d=Math.hypot(...s.pr), B=s.def.B(s.p.i,d); return [['Distância da sonda d',nt(d)+' cm'],['Campo B = μ₀·i/(2π·d)',nf(B)+' T'],['Em microtesla',nt(B*1e6)+' μT'],['Comparado ao campo da Terra (≈ 50 μT)',nt(B/5e-5)+' vezes']]; }});
