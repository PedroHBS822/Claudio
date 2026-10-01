/* =====================================================================
   Laboratórios com cenário: ondas, som e óptica
   ===================================================================== */

/* onda numa corda: uma pessoa balança a ponta */
SIMS.wave=(host,cfg={})=>Sim(host,{alt:'Pessoa balançando a ponta de uma corda; a onda viaja e uma fita marca um ponto que só sobe e desce',anim:true,autoplay:true,h:280,
  legend:[['vel','onda'],['force','fita num ponto da corda (só sobe e desce)'],['energy','comprimento de onda λ']],
  ctrls:[{k:'f',l:'Frequência f',min:.5,max:4,step:.25,v:cfg.f??1,u:'Hz',live:true},{k:'v',l:'Velocidade na corda v',min:1,max:8,step:.5,v:cfg.v??4,u:'m/s',live:true},{k:'A',l:'Amplitude',min:.2,max:1,step:.1,v:cfg.A??.6,u:'m',live:true}],
  step(){},
  draw(g,s){ const lam=s.p.v/s.p.f, x0=58, W=g.W-80, k=W/10, base=g.H-34, cy=base-80, amp=Math.min(s.p.A*45,60), Y=x=>cy-amp*Math.sin(2*Math.PI*(x/lam-s.p.f*s.t));
    SK.sky(g,base); SK.grass(g,base,g.H-base); g.rect(x0+W-4,cy-80,10,base-cy+80,isDark()?'#6b4f33':'#8a6a45',null,2);
    for(let m=0;m<=10;m++){ g.line(x0+m*k,base,x0+m*k,base+6,COL.ink,1); g.text(m+'',x0+m*k,base+18,{size:10.5,c:COL.ink,align:'center',mono:true}); } g.text('m',g.W-14,base+18,{size:10.5,c:COL.ink});
    g.line(x0,cy,x0+W,cy,alpha(COL.ink,.25),1,[4,4]);
    const pts=[]; for(let x=0;x<=10;x+=.04) pts.push([x0+x*k,Y(x)]); g.poly(pts,isDark()?'#d9b77a':'#8a5a2b',5); g.poly(pts,alpha('#ffffff',.25),1.5);
    SK.person(g,x0-26,base,78,isDark()?'#d0d6df':'#2b3340','push'); g.line(x0-8,base-62,x0,Y(0),isDark()?'#d0d6df':'#2b3340',4);
    const px=3; g.line(x0+px*k,cy-amp-8,x0+px*k,cy+amp+8,COL.force,1,[2,3]); g.rect(x0+px*k-4,Y(px)-2,8,16,COL.force,null,2);
    let c1=(s.p.f*s.t+.25)*lam; c1=((c1%lam)+lam)%lam; if(c1+lam<=10){ const y=cy-amp-22; SK.dim(g,x0+c1*k,y,x0+(c1+lam)*k,y,'λ = '+nt(lam)+' m',COL.energy); } },
  reads:s=>[['Comprimento de onda λ = v/f',nt(s.p.v/s.p.f)+' m'],['Período T = 1/f',nt(1/s.p.f)+' s'],['Conferindo v = λ·f',nt(s.p.v/s.p.f*s.p.f)+' m/s'],['O que muda a velocidade','o meio (a corda), não a fonte']]});

/* efeito Doppler: ambulância (ou jato) passando entre dois ouvintes */
SIMS.doppler=(host,cfg={})=>Sim(host,{alt:'Ambulância passando por uma rua e emitindo frentes de onda; ouvintes à frente e atrás',anim:true,autoplay:true,h:320,
  ctrls:[{k:'M',l:'Velocidade da fonte (em relação ao som)',min:0,max:1.3,step:.05,v:cfg.M??.5,f:v=>nsig(v*340,3)+' m/s ('+nsig(v,2)+'× o som)'}],
  init(s){ s.x=-.8; s.fr=[]; s.acc=0; },
  step(s,dt){ const c=.25; s.x+=s.p.M*c*dt; s.acc+=dt; if(s.acc>=.35){ s.acc=0; s.fr.push({x:s.x,t:s.t}); } if(s.fr.length>30) s.fr.shift(); if(s.x>.9){ s.x=-.8; s.fr=[]; } },
  draw(g,s){ const k=g.W/2.1, X=x=>g.W/2+x*k, ry=g.H/2+10, c=.25, M=s.p.M, f0=440;
    SK.sky(g,ry-30); SK.grass(g,ry+30,g.H-ry-30); SK.road(g,ry-30,60,0);
    g.ctx.save(); g.ctx.beginPath(); g.ctx.rect(0,0,g.W,g.H); g.ctx.clip();
    s.fr.forEach(f=>{ const r=(s.t-f.t)*c*k; g.ctx.globalAlpha=clamp(1-r/(g.W*.9),.15,1); g.circle(X(f.x),ry,r,null,isDark()?'#7cc4ff':'#1c6fd1',2); }); g.ctx.restore();
    const sx=X(s.x); if(M>=1){ g.poly([[sx+26,ry],[sx-20,ry-9],[sx-26,ry-22],[sx-14,ry-9],[sx-24,ry],[sx-14,ry+9],[sx-26,ry+22],[sx-20,ry+9]],COL.ink,1.5,'#9aa3ad',true); }
    else { g.rect(sx-24,ry-14,48,24,'#f4f6f8','#c03',6,2); g.rect(sx-8,ry-10,16,4,'#e5484d',null,1); g.rect(sx-2,ry-14,4,12,'#e5484d',null,1); g.rect(sx-6,ry-20,12,6,(Math.floor(s.t*6)%2)?'#e5484d':'#1c6fd1',null,2); g.circle(sx-14,ry+11,5,'#1c1f24'); g.circle(sx+14,ry+11,5,'#1c1f24'); }
    SK.person(g,22,ry+44,46,isDark()?'#d0d6df':'#2b3340'); SK.person(g,g.W-22,ry+44,46,isDark()?'#d0d6df':'#2b3340');
    g.tag('ouve '+nt(f0/(1+M))+' Hz (grave)',26,ry+66,COL.force,'left',12); g.tag(M<1?'ouve '+nt(f0/(1-M))+' Hz (agudo)':'estrondo sônico!',g.W-26,ry+66,M<1?COL.vel:COL.force,'right',12);
    g.tag('a fonte emite 440 Hz',g.W/2,22,COL.ink,'center',12.5); if(M>=1) g.tag('mais rápida que o som: cone de choque',g.W/2,48,COL.force,'center',12.5); },
  reads:s=>{ const f0=440, M=s.p.M; return [['Frequência emitida','440 Hz (lá)'],['Ouvinte à frente f·v/(v − v<sub>f</sub>)',M<1?nt(f0/(1-M))+' Hz (mais agudo)':'—'],['Ouvinte atrás f·v/(v + v<sub>f</sub>)',nt(f0/(1+M))+' Hz (mais grave)'],['Velocidade do som no ar','340 m/s']]; }});

/* diagrama de raios com uma vela como objeto (espelhos esféricos e lentes) */
function candle(g,x,base,h,col,alphaV=1,flip=false){ if(Math.abs(h)<2) return; const c=g.ctx, w=Math.max(6,Math.abs(h)*.28), sg=h>0?1:-1, H=Math.abs(h)*.78;
  c.save(); c.globalAlpha=alphaV; g.rect(x-w/2,sg>0?base-H:base,w,H,col,mix(col,'#000',.35),3,1.2);
  const fy=sg>0?base-H:base+H, fh=Math.abs(h)*.22*sg; c.fillStyle='#ffcc4d'; c.beginPath(); c.moveTo(x-w*.35,fy); c.quadraticCurveTo(x,fy-fh*2.2,x+w*.35,fy); c.closePath(); c.fill(); c.fillStyle='#ff7a1a'; c.beginPath(); c.moveTo(x-w*.18,fy); c.quadraticCurveTo(x,fy-fh*1.3,x+w*.18,fy); c.closePath(); c.fill(); c.restore(); }
function rayDiagram(g,s,kind){
  const mirror=kind==='mirror', conv=s.p.t==='c', f=(conv?1:-1)*s.p.f, p=s.p.p, inf=Math.abs(1/f-1/p)<1e-9, pi=inf?Infinity:1/(1/f-1/p), A=inf?Infinity:-pi/p;
  const xm=mirror?g.W*.66:g.W*.5, cy=g.H*.56, span=Math.max(p,Math.min(Math.abs(pi),60),2*s.p.f)*1.08, k=(xm-20)/span, ho=Math.min(54,g.H*.22);
  const side=mirror?-1:1, xo=xm-p*k, ix=inf?null:(mirror?xm-pi*k:xm+pi*k), hi=inf?0:A*ho;
  g.rect(0,0,g.W,g.H,isDark()?'#0e1522':'#eef3f9'); g.rect(0,cy+ho+18,g.W,g.H-cy-ho-18,isDark()?'#2a2f37':'#dde3ea');
  g.line(0,cy,g.W,cy,alpha(COL.ink,.4),1.2,[6,4]);
  if(mirror){ const bulge=conv?16:-16, top=cy-g.H*.42, bot=cy+g.H*.42; g.ctx.save(); g.ctx.lineCap='round'; g.ctx.strokeStyle=isDark()?'#c7cfdb':'#46505f'; g.ctx.lineWidth=7; g.ctx.beginPath(); g.ctx.moveTo(xm-bulge,top); g.ctx.quadraticCurveTo(xm+bulge,cy,xm-bulge,bot); g.ctx.stroke(); g.ctx.strokeStyle=isDark()?'#e6f2ff':'#b8d8f5'; g.ctx.lineWidth=3; g.ctx.beginPath(); g.ctx.moveTo(xm-bulge-3,top); g.ctx.quadraticCurveTo(xm+bulge-3,cy,xm-bulge-3,bot); g.ctx.stroke(); g.ctx.restore(); }
  else { const lw=conv?16:6; g.ctx.save(); g.ctx.fillStyle=alpha('#7cc4ff',.35); g.ctx.strokeStyle=isDark()?'#9fc3ea':'#3d6f9e'; g.ctx.lineWidth=2; g.ctx.beginPath(); const top=cy-g.H*.42, bot=cy+g.H*.42;
    if(conv){ g.ctx.moveTo(xm,top); g.ctx.quadraticCurveTo(xm+lw*2,cy,xm,bot); g.ctx.quadraticCurveTo(xm-lw*2,cy,xm,top); } else { g.ctx.moveTo(xm-10,top); g.ctx.lineTo(xm+10,top); g.ctx.quadraticCurveTo(xm+2,cy,xm+10,bot); g.ctx.lineTo(xm-10,bot); g.ctx.quadraticCurveTo(xm-2,cy,xm-10,top); }
    g.ctx.fill(); g.ctx.stroke(); g.ctx.restore(); }
  const lab=(x,t)=>{ g.circle(x,cy,3.5,COL.ink); g.text(t,x,cy+18,{size:12,align:'center',c:COL.ink,bold:true}); };
  if(mirror){ lab(xm-f*k,'F'); lab(xm-2*f*k,'C'); } else { lab(xm-s.p.f*k,conv?'F':'F\''); lab(xm+s.p.f*k,conv?'F\'':'F'); }
  candle(g,xo,cy,ho,'#e9e4d8');
  const O=[xo,cy-ho*.95], rays=[[xm,cy-ho*.95],[xm,cy]], cols=['#ff5a4e','#b794ff'];
  const out=(H,dir,c,dash)=>{ const L=2000/Math.hypot(dir[0],dir[1]); g.ctx.save(); g.ctx.shadowColor=c; g.ctx.shadowBlur=isDark()?8:0; g.line(H[0],H[1],H[0]+dir[0]*L,H[1]+dir[1]*L,c,2.2,dash); g.ctx.restore(); };
  rays.forEach((H,i)=>{ g.ctx.save(); g.ctx.shadowColor=cols[i]; g.ctx.shadowBlur=isDark()?8:0; g.line(O[0],O[1],H[0],H[1],cols[i],2.2); g.ctx.restore();
    if(inf){ const v=[xm-O[0],cy-O[1]]; out(H,mirror?[-v[0],v[1]]:v,cols[i]); return; }
    const I=[ix,cy-hi*.95], real=pi>0; if(real) out(H,[I[0]-H[0],I[1]-H[1]],cols[i]); else { out(H,[H[0]-I[0],H[1]-I[1]],cols[i]); g.line(H[0],H[1],I[0],I[1],cols[i],1.5,[5,5]); } });
  if(!inf&&Math.abs(pi)<400){ const real=pi>0; candle(g,ix,cy,hi,'#ffd98a',real?1:.45); g.tag(real?'imagem real':'imagem virtual',ix,hi>0?cy+40:cy+Math.abs(hi)+18,COL.energy,'center',11.5); }
  g.tag('objeto',xo,cy+26,COL.ink,'center',11.5);
  return {pi,A,inf}; }
function rayReads(s,kind){ const conv=s.p.t==='c', f=(conv?1:-1)*s.p.f, p=s.p.p, inf=Math.abs(1/f-1/p)<1e-9; if(inf) return [['Posição da imagem p\'','no infinito (imagem imprópria)'],['Por quê?','o objeto está exatamente no foco']];
  const pi=1/(1/f-1/p), A=-pi/p, real=pi>0; return [['Posição da imagem p\'',nt(pi)+' cm'+(kind==='mirror'?(real?' (na frente do espelho)':' (atrás do espelho)'):(real?' (do outro lado da lente)':' (do mesmo lado do objeto)'))],['Aumento A = −p\'/p',nt(A)],['Natureza',`${real?'real':'virtual'}, ${A<0?'invertida':'direita'}, ${Math.abs(A)>1.001?'maior':Math.abs(A)<.999?'menor':'do mesmo tamanho'}`],['Vergência V = 1/f (f em metros)',nt(1/(f/100))+' di']]; }
SIMS.mirror=(host,cfg={})=>Sim(host,{alt:'Espelho esférico com raios de luz formando a imagem de uma vela',h:w=>Math.min(380,Math.max(300,w*.5)),
  legend:[['energy','imagem'],['force','raio paralelo ao eixo'],['acc','raio que bate no vértice']],
  ctrls:[{k:'t',l:'Espelho',opts:[['c','côncavo'],['v','convexo']],v:cfg.t??'c',live:true},{k:'f',l:'Distância focal |f|',min:5,max:20,step:1,v:cfg.f??10,u:'cm',live:true},{k:'p',l:'Distância do objeto p',min:2,max:40,step:1,v:cfg.p??25,u:'cm',live:true}],
  draw(g,s){ rayDiagram(g,s,'mirror'); }, reads:s=>rayReads(s,'mirror')});
SIMS.lens=(host,cfg={})=>Sim(host,{alt:'Lente com raios de luz formando a imagem de uma vela',h:w=>Math.min(380,Math.max(300,w*.5)),
  legend:[['energy','imagem'],['force','raio paralelo ao eixo'],['acc','raio pelo centro óptico']],
  ctrls:[{k:'t',l:'Lente',opts:[['c','convergente'],['v','divergente']],v:cfg.t??'c',live:true},{k:'f',l:'Distância focal |f|',min:5,max:20,step:1,v:cfg.f??10,u:'cm',live:true},{k:'p',l:'Distância do objeto p',min:2,max:40,step:1,v:cfg.p??25,u:'cm',live:true}],
  draw(g,s){ rayDiagram(g,s,'lens'); }, reads:s=>rayReads(s,'lens')});

/* refração: laser entrando num aquário */
const NS=[[1,'ar (1,00)'],[1.33,'água (1,33)'],[1.5,'vidro (1,50)'],[2.42,'diamante (2,42)']];
SIMS.refr=(host,cfg={})=>Sim(host,{alt:'Laser apontado para a superfície entre dois meios; o raio muda de direção ao passar',h:340,
  legend:[['force','raio incidente'],['vel','raio refratado'],['muted','raio refletido']],
  ctrls:[{k:'n1',l:'Meio de cima',opts:NS.map(x=>[x[0],x[1]]),v:cfg.n1??1,live:true},{k:'n2',l:'Meio de baixo',opts:NS.map(x=>[x[0],x[1]]),v:cfg.n2??1.33,live:true},{k:'a',l:'Ângulo de incidência θ₁',min:0,max:89,step:1,v:cfg.a??40,u:'°',live:true}],
  draw(g,s){ const cx=g.W/2, cy=g.H/2, L=Math.min(g.W*.45,g.H*.46), a=s.p.a*Math.PI/180, sn=s.p.n1*Math.sin(a)/s.p.n2, tir=sn>1;
    const fill=n=>n>2?alpha('#b9d4ff',.55):n>1.4?alpha('#9fd8ff',.45):n>1?alpha('#3f8fd8',.35):(isDark()?'#0e1522':'#f1f5fb');
    g.rect(0,0,g.W,cy,fill(s.p.n1)); g.rect(0,cy,g.W,g.H-cy,fill(s.p.n2));
    if(s.p.n2>1&&s.p.n2<1.4){ g.ctx.save(); g.ctx.strokeStyle='rgba(255,255,255,.7)'; g.ctx.lineWidth=2; g.ctx.beginPath(); for(let x=0;x<=g.W;x+=6) g.ctx.lineTo(x,cy+2*Math.sin(x/16)); g.ctx.stroke(); g.ctx.restore(); }
    g.line(0,cy,g.W,cy,COL.ink,1.5); g.line(cx,cy-L,cx,cy+L,COL.muted,1,[5,5]); g.text('normal',cx+6,cy-L+12,{size:11,c:COL.muted});
    const glow=(x1,y1,x2,y2,c,w)=>{ g.ctx.save(); g.ctx.shadowColor=c; g.ctx.shadowBlur=10; g.line(x1,y1,x2,y2,c,w); g.ctx.restore(); };
    const si=[cx-Math.sin(a)*L,cy-Math.cos(a)*L]; glow(si[0],si[1],cx,cy,'#ff3b30',3.2);
    const c=g.ctx; c.save(); c.translate(si[0],si[1]); c.rotate(Math.atan2(cy-si[1],cx-si[0])); g.rect(-40,-7,40,14,'#2b3340',null,4); g.rect(-6,-4,6,8,'#ff3b30',null,2); c.restore();
    if(tir) glow(cx,cy,cx+Math.sin(a)*L,cy-Math.cos(a)*L,'#ff3b30',3); else g.line(cx,cy,cx+Math.sin(a)*L*.7,cy-Math.cos(a)*L*.7,alpha('#ff3b30',.35),1.5);
    if(!tir){ const b=Math.asin(sn); glow(cx,cy,cx+Math.sin(b)*L,cy+Math.cos(b)*L,'#ff3b30',3); g.tag('θ₂ = '+nt(b*180/Math.PI,3)+'°',cx+Math.sin(b)*L*.6+10,cy+Math.cos(b)*L*.6,COL.vel,'left',12); }
    else g.tag('reflexão total!',cx+Math.sin(a)*L*.6+10,cy-Math.cos(a)*L*.6,COL.force,'left',12.5);
    if(a>.02){ c.save(); c.strokeStyle=COL.force; c.lineWidth=1.5; c.beginPath(); c.arc(cx,cy,34,-Math.PI/2-a,-Math.PI/2); c.stroke(); c.restore(); }
    g.tag(NS.find(x=>x[0]===s.p.n1)[1],12,20,COL.ink,'left',12); g.tag(NS.find(x=>x[0]===s.p.n2)[1],12,g.H-16,COL.ink,'left',12);
    g.tag('θ₁ = '+s.p.a+'°',cx-50,cy-52,COL.force,'right',12); },
  reads:s=>{ const a=s.p.a*Math.PI/180, sn=s.p.n1*Math.sin(a)/s.p.n2; return [['n₁·sen θ₁',nt(s.p.n1*Math.sin(a),3)],['θ₂ (Snell: n₁ sen θ₁ = n₂ sen θ₂)',sn>1?'não existe: reflexão total':nt(Math.asin(sn)*180/Math.PI,3)+'°'],['Ângulo limite',s.p.n1>s.p.n2?nt(Math.asin(s.p.n2/s.p.n1)*180/Math.PI,3)+'°':'não há (a luz vai para um meio mais refringente)'],['Velocidade da luz embaixo c/n₂',nf(3e8/s.p.n2)+' m/s']]; }});
