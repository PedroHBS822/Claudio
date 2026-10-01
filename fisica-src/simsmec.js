/* =====================================================================
   Laboratórios de mecânica com cenário (substituem as versões simples)
   A física e o estado (s.x, s.t, s.v…) são os mesmos das versões
   anteriores; muda o desenho: cena, rastro estroboscópico, cronômetro.
   ===================================================================== */

/* km/h ↔ m/s: carro na estrada de 100 m */
SIMS.conv=(host)=>Sim(host,{alt:'Carro andando numa estrada de 100 metros, com uma bandeira a cada segundo, velocímetro e cronômetro',anim:true,h:w=>w<560?270:250,
  ctrls:[{k:'v',l:'Velocidade',min:0,max:180,step:1,v:72,u:'km/h'}],
  init(s){ s.x=0; s.marks=[]; },
  step(s,dt){ const ms=s.p.v/3.6; const before=Math.floor(s.t); s.x+=ms*dt; if(Math.floor(s.t+dt)>before) s.marks.push(s.x); if(s.x>=100){ s.x=100; s.play(false); } },
  done:s=>s.x>=100,
  draw(g,s){ const L=34,Rr=g.W-34,ry=g.H-82,rh=38,k=(Rr-L)/100,X=m=>L+m*k;
    SK.sky(g,ry); SK.hills(g,ry,0); SK.tree(g,g.W*.62,ry,46); SK.tree(g,g.W*.86,ry,38); SK.grass(g,ry+rh,g.H-ry-rh); SK.road(g,ry,rh,0);
    for(let m=0;m<=100;m+=10){ g.rect(X(m)-1.5,ry-10,3,10,'#e9edf2',null,1); g.text(m+' m',X(m),ry+rh+16,{size:11,c:COL.ink,align:'center',mono:true,bold:m%50===0}); }
    s.marks.forEach((m,i)=>{ g.line(X(m),ry-34,X(m),ry+rh,COL.vel,1.5,[4,3]); g.tag((i+1)+' s',X(m),ry-42,COL.vel); });
    SK.car(g,X(s.x),ry+rh*.62,Math.min(64,g.W*.14),COL.force,s.x/.3);
    SK.gauge(g,52,62,30,s.p.v,180,'km/h',COL.force); SK.watch(g,g.W-46,52,22,s.t);
    g.tag(`${nt(s.p.v)} km/h = ${nt(s.p.v/3.6)} m/s`,g.W/2,26,COL.ink,'center',15); },
  reads:s=>[['Em km/h',nt(s.p.v)+' km/h'],['Em m/s',nt(s.p.v/3.6)+' m/s'],['A cada segundo anda',nt(s.p.v/3.6)+' m'],['Tempo para 100 m',s.p.v?nt(100/(s.p.v/3.6))+' s':'—']]});

/* MU e MUV: carro na estrada com rastro a cada segundo e gráficos */
SIMS.mov=(host,cfg)=>Sim(host,{alt:'Carro numa estrada com uma imagem a cada segundo, e os gráficos de posição e velocidade',anim:true,h:w=>w<560?480:420,
  legend:[['vel','posição s(t)'],['acc','velocidade v(t): a área sob a curva é o deslocamento']],
  ctrls:[{k:'s0',l:'Posição inicial s₀',min:-20,max:40,step:5,v:0,u:'m'},{k:'v0',l:'Velocidade inicial v₀',min:-10,max:20,step:1,v:cfg.acc?2:8,u:'m/s'}].concat(cfg.acc?[{k:'a',l:'Aceleração a',min:-4,max:4,step:.5,v:1.5,u:'m/s²'}]:[]),
  init(s){ s.pos=[]; s.vel=[]; s.gh=[]; const a=s.p.a||0, f=t=>s.p.s0+s.p.v0*t+a*t*t/2; let lo=Infinity,hi=-Infinity; for(let t=0;t<=10;t+=.1){ lo=Math.min(lo,f(t)); hi=Math.max(hi,f(t)); } s.lo=Math.min(lo,0); s.hi=Math.max(hi,10); s.x=s.p.s0; s.v=s.p.v0; s.pos.push([0,s.x]); s.vel.push([0,s.v]); s.gh.push(s.x); },
  step(s,dt){ const a=s.p.a||0, t=Math.min(10,s.t+dt); if(Math.floor(t+1e-9)>Math.floor(s.t+1e-9)) s.gh.push(s.p.s0+s.p.v0*Math.floor(t+1e-9)+a*Math.floor(t+1e-9)**2/2); s.x=s.p.s0+s.p.v0*t+a*t*t/2; s.v=s.p.v0+a*t; s.pos.push([t,s.x]); s.vel.push([t,s.v]); if(t>=10) s.play(false); },
  done:s=>s.t>=10,
  draw(g,s){ const L=40,Rr=g.W-40,span=s.hi-s.lo,X=m=>L+(m-s.lo)/span*(Rr-L), ry=78, rh=34, cw=Math.min(50,g.W*.11);
    SK.sky(g,ry); SK.hills(g,ry); SK.road(g,ry,rh,0); g.rect(0,ry+rh,g.W,26,isDark()?mix(COL.paper,COL.ok,.2):mix(COL.ok,COL.paper,.55));
    const st=span>200?50:span>80?20:10; for(let m=Math.ceil(s.lo/st)*st;m<=s.hi;m+=st){ g.line(X(m),ry+rh,X(m),ry+rh+5,COL.ink,1.2); g.text(m+' m',X(m),ry+rh+18,{size:10.5,c:COL.ink,align:'center',mono:true}); }
    s.gh.forEach((x,i)=>{ if(i===s.gh.length-1&&Math.abs(x-s.x)<.01) return; g.ctx.save(); g.ctx.globalAlpha=.28; SK.car(g,X(x),ry+rh*.66,cw,COL.vel,0); g.ctx.restore(); g.tag(i+' s',X(x),ry-34,COL.vel,'center',11); });
    const dir=s.v<0?-1:1; g.ctx.save(); if(dir<0){ g.ctx.translate(2*X(s.x),0); g.ctx.scale(-1,1); } SK.car(g,X(s.x),ry+rh*.66,cw,COL.vel,s.x/.3*dir); g.ctx.restore();
    if(Math.abs(s.v)>.05) g.arrow(X(s.x),ry-12,X(s.x)+clamp(s.v*5,-90,90),ry-12,COL.acc,'v = '+nt(s.v)+' m/s',3);
    SK.watch(g,g.W-30,26,13,Math.min(s.t,10));
    const top=ry+rh+56, gh=g.H-top-44, narrow=g.W<560, gw=narrow?g.W-70:(g.W-110)/2;
    const vr=[Math.min(0,s.p.v0,s.p.v0+(s.p.a||0)*10)-1,Math.max(0,s.p.v0,s.p.v0+(s.p.a||0)*10)+1];
    if(narrow){ const h2=(gh-40)/2; g.plot(50,top,gw,h2,{xr:[0,10],yr:[s.lo,s.hi],series:[{pts:s.pos,c:COL.vel,dot:true}],yl:'s (m)'}); g.plot(50,top+h2+40,gw,h2,{xr:[0,10],yr:vr,series:[{pts:s.vel,c:COL.acc,dot:true,fill:alpha(COL.acc,.2)}],xl:'t (s)',yl:'v (m/s)'}); }
    else { g.plot(50,top,gw,gh,{xr:[0,10],yr:[s.lo,s.hi],series:[{pts:s.pos,c:COL.vel,dot:true}],xl:'t (s)',yl:'posição s (m)'}); g.plot(100+gw,top,gw,gh,{xr:[0,10],yr:vr,series:[{pts:s.vel,c:COL.acc,dot:true,fill:alpha(COL.acc,.2)}],xl:'t (s)',yl:'velocidade v (m/s)'}); } },
  reads:s=>[['Tempo t',nt(Math.min(s.t,10))+' s'],['Posição s',nt(s.x)+' m'],['Velocidade v',nt(s.v)+' m/s'],['Deslocamento Δs = s − s₀',nt(s.x-s.p.s0)+' m']]});

/* queda livre: prédio, duas bolas e fotos a cada 0,5 s */
const GS=[[9.8,'Terra'],[1.6,'Lua'],[3.7,'Marte'],[24.8,'Júpiter']];
SIMS.fall=(host)=>Sim(host,{alt:'Duas bolas de massas diferentes caindo juntas ao lado de um prédio, com uma foto a cada meio segundo',anim:true,h:w=>w<560?400:380,
  ctrls:[{k:'h',l:'Altura de queda',min:5,max:100,step:5,v:45,u:'m'},{k:'g',l:'Onde?',opts:GS.map(x=>[x[0],x[1]]),v:9.8}],
  init(s){ s.y=0; s.v=0; s.tr=[[0,0]]; s.T=Math.sqrt(2*s.p.h/s.p.g); },
  step(s,dt){ const t=Math.min(s.T,s.t+dt); s.y=s.p.g*t*t/2; s.v=s.p.g*t; s.tr.push([t,s.v]); if(t>=s.T) s.play(false); },
  done:s=>s.t>=s.T,
  draw(g,s){ const top=34,bot=g.H-34,cw=Math.min(230,g.W*.44),k=(bot-top)/s.p.h, moon=s.p.g<2;
    if(moon){ g.rect(0,0,g.W,bot,isDark()?'#0b0f1a':'#1d2333'); for(let i=0;i<40;i++) g.rect((i*97)%g.W,(i*61)%bot,1.5,1.5,'#fff'); g.rect(0,bot,g.W,g.H-bot,'#9aa0a8'); }
    else { SK.sky(g,bot); SK.grass(g,bot,g.H-bot); }
    SK.building(g,8,top-6,cw*.32,bot-top+6);
    for(let m=0;m<=s.p.h;m+=s.p.h>50?20:10){ const yy=top+m*k; g.line(cw*.32+8,yy,cw*.32+16,yy,moon?'#ddd':COL.ink,1.4); g.text(nt(s.p.h-m)+' m',cw*.32+19,yy+4,{size:10.5,c:moon?'#ddd':COL.ink,mono:true}); }
    const xa=cw*.6, xb=cw*.85, n=Math.floor(Math.min(s.t,s.T)/.5);
    for(let i=1;i<=n;i++){ const yy=top+s.p.g*(i*.5)**2/2*k; g.ctx.save(); g.ctx.globalAlpha=.25; SK.ball(g,xa,yy,11,COL.force); SK.ball(g,xb,yy,6,COL.vel); g.ctx.restore(); g.text(nt(i*.5)+' s',xb+12,yy+4,{size:10,c:moon?'#ccc':COL.muted,mono:true}); }
    const yy=top+s.y*k; SK.ball(g,xa,yy,12,COL.force,s.t*3); SK.ball(g,xb,yy,6.5,COL.vel,s.t*5);
    if(s.v>.3) g.arrow(xa-22,yy,xa-22,yy+clamp(s.v*2.2,10,90),COL.acc,null,2.5);
    g.tag('10 kg',xa,yy-22,COL.force,'center',11); g.tag('0,1 kg',xb,yy-18,COL.vel,'center',11);
    SK.watch(g,cw-6,top+14,14,Math.min(s.t,s.T));
    const vmax=s.p.g*s.T; g.plot(cw+50,top,g.W-cw-70,bot-top-12,{xr:[0,Math.max(1,s.T)],yr:[0,vmax*1.05],series:[{pts:s.tr,c:COL.acc,dot:true}],xl:'t (s)',yl:'velocidade (m/s)'}); },
  reads:s=>[['Tempo',nt(Math.min(s.t,s.T))+' s'],['Distância caída',nt(s.y)+' m'],['Velocidade',nt(s.v)+' m/s'],['Tempo total de queda',nt(s.T)+' s'],['Velocidade ao chegar',nt(s.p.g*s.T)+' m/s']]});

/* lançamento oblíquo num campo de futebol (também é o experimento da página inicial) */
SIMS.proj=(host,cfg)=>{ const hero=!!cfg.hero; const angs=[30,45,60];
  return Sim(host,{alt:'Bola chutada num campo, com o rastro do voo; 30° e 60° caem no mesmo lugar',anim:true,autoplay:hero,h:hero?260:340,speed:hero?1.4:1,
  legend:hero?[['force','30°'],['vel','45°'],['acc','60°']]:[['vel','vₓ (constante)'],['acc','v_y (muda por causa da gravidade)']],
  ctrls:hero?[]:[{k:'v0',l:'Velocidade de lançamento',min:5,max:30,step:1,v:20,u:'m/s'},{k:'th',l:'Ângulo',min:10,max:80,step:5,v:cfg.th||45,u:'°'},{k:'g',l:'Onde?',opts:[[10,'Terra (g=10)'],[1.6,'Lua']],v:10}],
  init(s){ if(hero){ s.p.v0=18; s.p.g=10; s.k=s.k||0; s.p.th=angs[s.k%3]; s.done=s.done||[]; s.wait=0; } s.tr=[]; s.x=0; s.y=0; s.top=null; },
  step(s,dt){ if(hero&&s.wait>0){ s.wait-=dt; if(s.wait<=0){ s.k++; if(s.k%3===0) s.done=[]; s.t=0; s.def.init(s); } return; }
    const th=s.p.th*Math.PI/180, vx=s.p.v0*Math.cos(th), vy=s.p.v0*Math.sin(th), T=2*vy/s.p.g, t=Math.min(T,s.t+dt);
    s.x=vx*t; s.y=vy*t-s.p.g*t*t/2; s.tr.push([s.x,Math.max(0,s.y),t]); if(!s.top&&t>=vy/s.p.g) s.top=[vx*vy/s.p.g,vy*vy/(2*s.p.g)];
    if(t>=T){ if(hero){ s.done.push({tr:s.tr,k:s.k%3}); s.wait=.9; } else s.play(false); } },
  done:s=>!hero&&s.tr.length>1&&s.y<=0,
  draw(g,s){ const g0=s.p.g, R=s.p.v0**2/g0, H=s.p.v0**2/(2*g0), W=g.W, x0=40, base=g.H-(hero?30:38), k=Math.min((W-80)/(R*1.08),(base-34)/(H*1.12));
    if(g0<2){ g.rect(0,0,W,base,isDark()?'#0b0f1a':'#1d2333'); g.rect(0,base,W,g.H-base,'#9aa0a8'); } else { SK.sky(g,base); SK.hills(g,base); SK.grass(g,base,g.H-base); for(let x=0;x<W;x+=60) g.rect(x,base,30,g.H-base,alpha('#ffffff',isDark()?.03:.12)); }
    g.line(0,base,W,base,'#f4f6f8',2);
    for(let m=0;m<=R*1.05;m+=R>60?20:R>25?10:5){ g.line(x0+m*k,base,x0+m*k,base+6,'#f4f6f8',1.4); g.text(m+' m',x0+m*k,base+19,{size:10.5,c:g0<2?'#eee':COL.ink,align:'center',mono:true}); }
    SK.person(g,x0-16,base,34,isDark()?'#d0d6df':'#2b3340','push');
    const cols=[COL.force,COL.vel,COL.acc], P=p=>[x0+p[0]*k,base-p[1]*k];
    (s.done||[]).forEach(d=>g.poly(d.tr.map(P),cols[d.k],2.5));
    const c=hero?cols[s.k%3]:COL.ink; g.ctx.save(); g.ctx.setLineDash([3,5]); g.poly(s.tr.map(P),hero?c:alpha(COL.ink,.6),2); g.ctx.restore();
    if(!hero){ let nt0=0; s.tr.forEach(p=>{ if(p[2]>=nt0-1e-9){ nt0+=.25; const [px,py]=P(p); g.ctx.save(); g.ctx.globalAlpha=.3; SK.ball(g,px,py,6,COL.force); g.ctx.restore(); } }); }
    if(!hero&&s.top){ const [tx,ty]=P(s.top); g.line(tx,ty,tx,base,COL.energy,1.2,[4,4]); g.tag('altura máx. '+nt(s.top[1])+' m',tx,ty-18,COL.energy,'center',11.5); }
    const landed=!hero&&s.tr.length>2&&s.t>=2*s.p.v0*Math.sin(s.p.th*Math.PI/180)/g0-1e-6;
    const [px,py]=[x0+s.x*k,base-Math.max(0,s.y)*k]; SK.ball(g,px,py,7.5,hero?c:COL.force,s.t*6);
    if(!hero&&s.tr.length){ const th=s.p.th*Math.PI/180, vx=s.p.v0*Math.cos(th), vy=s.p.v0*Math.sin(th)-g0*Math.min(s.t,2*s.p.v0*Math.sin(th)/g0), sc=2.2; if(!landed){ g.arrow(px,py,px+vx*sc,py,COL.vel,'vₓ',2.5); if(Math.abs(vy)>.5) g.arrow(px,py,px,py-vy*sc,COL.acc,'v_y',2.5); } }
    if(landed) SK.dim(g,x0,base-12,px,base-12,'alcance '+nt(s.x)+' m',COL.ink);
    if(hero) g.tag('30° e 60° caem no mesmo lugar',W/2,18,COL.ink,'center',13); },
  reads:s=>{ if(hero) return [['Velocidade de lançamento','18 m/s'],['Ângulo atual',s.p.th+'°'],['Alcance',nt(s.p.v0**2*Math.sin(2*s.p.th*Math.PI/180)/s.p.g)+' m']];
    const th=s.p.th*Math.PI/180,v=s.p.v0,g0=s.p.g; return [['vₓ = v₀·cos θ',nt(v*Math.cos(th))+' m/s'],['v<sub>y</sub> inicial = v₀·sen θ',nt(v*Math.sin(th))+' m/s'],['Tempo de voo',nt(2*v*Math.sin(th)/g0)+' s'],['Altura máxima',nt((v*Math.sin(th))**2/(2*g0))+' m'],['Alcance',nt(v*v*Math.sin(2*th)/g0)+' m']]; }}); };

/* movimento circular: roda-gigante (ou bola no barbante, quando há força) */
SIMS.mcu=(host,cfg)=>Sim(host,{alt:cfg.force?'Bola girando presa num barbante; corte o barbante e veja para onde ela vai':'Roda-gigante girando com os vetores de velocidade e aceleração centrípeta',anim:true,h:340,
  legend:[['vel','velocidade (tangente)'],['acc','aceleração centrípeta (para o centro)']].concat(cfg.force?[['force','força centrípeta (tração do barbante)']]:[]),
  ctrls:[{k:'R',l:'Raio R',min:.5,max:3,step:.1,v:1.5,u:'m'},{k:'T',l:'Período T (uma volta)',min:.5,max:5,step:.1,v:2,u:'s'}].concat(cfg.force?[{k:'m',l:'Massa',min:.2,max:5,step:.1,v:1,u:'kg'}]:[]),
  btns:cfg.force?[{l:'✂ Cortar o barbante',f(s){ if(!s.free){ s.free=true; const w=2*Math.PI/s.p.T; s.fv=[-Math.sin(s.ang)*w*s.p.R,Math.cos(s.ang)*w*s.p.R]; s.fp=[Math.cos(s.ang)*s.p.R,Math.sin(s.ang)*s.p.R]; if(!s.playing) s.play(true); } }}]:[],
  init(s){ s.ang=0; s.free=false; s.tr=[]; s.hist=[]; },
  step(s,dt){ if(s.free){ s.fp[0]+=s.fv[0]*dt; s.fp[1]+=s.fv[1]*dt; s.tr.push(s.fp.slice()); if(Math.hypot(...s.fp)>6) s.play(false); } else { s.ang+=2*Math.PI/s.p.T*dt; s.hist.push(s.ang); if(s.hist.length>40) s.hist.shift(); } },
  draw(g,s){ const cx=g.W/2, cy=g.H/2-(cfg.force?0:14), k=(Math.min(g.W,g.H)/2-34)/3, R=s.p.R*k, w=2*Math.PI/s.p.T, v=w*s.p.R, ac=v*v/s.p.R;
    if(!cfg.force){ SK.sky(g,g.H-26); SK.grass(g,g.H-26,26); g.poly([[cx,cy],[cx-R*.55-20,g.H-26],[cx-R*.55-8,g.H-26],[cx,cy+14]],null,0,isDark()?'#7d8796':'#5d6878',true); g.poly([[cx,cy],[cx+R*.55+20,g.H-26],[cx+R*.55+8,g.H-26],[cx,cy+14]],null,0,isDark()?'#7d8796':'#5d6878',true);
      g.circle(cx,cy,R,null,isDark()?'#c7cfdb':'#46505f',3); for(let i=0;i<12;i++){ const a=s.ang+i*Math.PI/6; g.line(cx,cy,cx+Math.cos(a)*R,cy-Math.sin(a)*R,isDark()?'#8f99a8':'#7b8696',1.2); const hx=cx+Math.cos(a)*R, hy=cy-Math.sin(a)*R; if(i) g.rect(hx-6,hy+2,12,10,mix(COL.vel,COL.paper,.4),null,3); } g.circle(cx,cy,6,COL.ink); }
    else { g.circle(cx,cy,R,null,COL.line,1.5,[4,4]); SK.person(g,cx,cy+44,40,isDark()?'#d0d6df':'#2b3340'); g.circle(cx,cy,5,COL.ink); }
    const p=s.free?s.fp:[Math.cos(s.ang)*s.p.R,Math.sin(s.ang)*s.p.R], px=cx+p[0]*k, py=cy-p[1]*k;
    if(!s.free&&s.hist.length>1){ g.ctx.save(); for(let i=1;i<s.hist.length;i++){ const a=s.hist[i]; g.ctx.globalAlpha=i/s.hist.length*.5; g.circle(cx+Math.cos(a)*R,cy-Math.sin(a)*R,3,COL.vel); } g.ctx.restore(); }
    if(s.free) g.poly(s.tr.map(q=>[cx+q[0]*k,cy-q[1]*k]),COL.muted,1.5,null); else if(cfg.force) g.line(cx,cy,px,py,COL.force,2);
    if(cfg.force) SK.ball(g,px,py,10,COL.energy,s.ang*3); else { g.rect(px-11,py-2,22,18,COL.energy,mix(COL.energy,'#000',.4),5,1.5); g.circle(px,py,3,COL.ink); }
    const tv=s.free?[s.fv[0]/v,s.fv[1]/v]:[-Math.sin(s.ang),Math.cos(s.ang)], vs=clamp(v*10,18,90); g.arrow(px,py,px+tv[0]*vs,py-tv[1]*vs,COL.vel,'v',3);
    if(!s.free){ const as=clamp(ac*4,14,R-12), u=[-Math.cos(s.ang),-Math.sin(s.ang)]; g.arrow(px,py,px+u[0]*as,py-u[1]*as,cfg.force?COL.force:COL.acc,cfg.force?'F':'a',3); }
    if(s.free) g.tag('sem o barbante, a bola segue reto pela tangente (inércia)',g.W/2,g.H-14,COL.ink,'center',12.5);
    g.tag('v = '+nt(v)+' m/s',14,18,COL.vel,'left',12); g.tag('a = '+nt(ac)+' m/s²',14,42,COL.acc,'left',12); },
  reads:s=>{ const v=2*Math.PI*s.p.R/s.p.T, ac=v*v/s.p.R; return [['Frequência f = 1/T',nt(1/s.p.T)+' Hz'],['Velocidade v = 2πR/T',nt(v)+' m/s'],['Aceleração centrípeta v²/R',nt(ac)+' m/s²']].concat(cfg.force?[['Força centrípeta m·v²/R',nt(s.p.m*ac)+' N']]:[]); }});

/* caixa empurrada: Newton e atrito (a câmera acompanha a caixa) */
SIMS.block=(host,cfg)=>Sim(host,{alt:'Pessoa empurrando uma caixa de madeira, com o diagrama de forças e o gráfico da velocidade',anim:true,h:320,
  legend:[['force','força aplicada e atrito'],['vel','peso e normal'],['acc','aceleração']],
  ctrls:[{k:'m',l:'Massa',min:1,max:20,step:1,v:5,u:'kg'},{k:'F',l:'Força aplicada',min:0,max:100,step:1,v:20,u:'N'}].concat(cfg.fric?[{k:'ue',l:'Atrito estático μₑ',min:0,max:1,step:.05,v:.5},{k:'uc',l:'Atrito cinético μ_c',min:0,max:1,step:.05,v:.3}]:[]),
  init(s){ s.x=0; s.v=0; s.vt=[[0,0]]; s.dust=[]; },
  forces(s){ const N=s.p.m*GRAV, F=s.p.F; if(!cfg.fric) return {N,F,fat:0,kind:'sem atrito',a:F/s.p.m};
    const ue=s.p.ue, uc=Math.min(s.p.uc,ue); if(s.v<1e-6&&F<=ue*N) return {N,F,fat:F,kind:'estático (segura a caixa)',a:0};
    const fat=uc*N; return {N,F,fat,kind:'cinético',a:(F-fat)/s.p.m}; },
  step(s,dt){ const f=s.def.forces(s); s.v=Math.max(0,s.v+f.a*dt); s.x+=s.v*dt; s.vt.push([s.t+dt,s.v]); if(cfg.fric&&s.v>0&&Math.random()<.5) s.dust.push({x:s.x,y:0,a:1}); s.dust.forEach(d=>{ d.a-=dt*1.5; d.y+=dt*14; }); s.dust=s.dust.filter(d=>d.a>0); if(s.t>8) s.play(false); },
  done:s=>s.t>8,
  draw(g,s){ const f=s.def.forces(s), y=g.H-56, W=g.W, k=26, bw=58+s.p.m*2.2, bh=40+s.p.m*1.4, bx=W*.34, cx=bx+bw/2, cy=y-bh/2;
    g.rect(0,0,W,y,isDark()?mix(COL.paper,'#2a3550',.4):mix('#e9eef5',COL.paper,.2)); g.rect(0,y-90,W,4,alpha(COL.ink,.08));
    const floor=isDark()?'#3b3f47':'#c9b79c'; g.rect(0,y,W,g.H-y,floor); const off=(s.x*k)%60;
    for(let x=-60;x<W+60;x+=60){ const xx=x-off; g.line(xx,y,xx-20,g.H,alpha('#000',.15),1.5); }
    for(let m=Math.floor((s.x*k-bx)/ (k*2))*2-2;m<=(s.x*k+W)/k;m+=2){ const xx=bx+(m-s.x)*k; if(xx<-20||xx>W+20) continue; g.line(xx,y,xx,y+7,COL.ink,1.2); g.text(m+' m',xx,y+20,{size:10,c:COL.ink,mono:true,align:'center'}); }
    s.dust.forEach(d=>{ g.ctx.save(); g.ctx.globalAlpha=d.a*.6; g.circle(bx+(d.x-s.x)*k-2,y-4-d.y*.3,3+(1-d.a)*4,'#bfa98a'); g.ctx.restore(); });
    if(s.p.F>0) SK.person(g,bx-30,y,74,isDark()?'#d0d6df':'#2b3340','push');
    SK.crate(g,bx,y-bh,bw,bh,s.p.m+' kg');
    const sc=v=>clamp(v*1.1,0,120);
    g.arrow(cx-bw*.25,cy+10,cx-bw*.25,cy+10+sc(s.p.m*GRAV)+bh/2-10,COL.vel,'P = '+nt(s.p.m*GRAV)+' N',3); g.arrow(cx+bw*.25,y-bh,cx+bw*.25,y-bh-sc(f.N),COL.vel,'N',3);
    if(s.p.F>0) g.arrow(bx+bw+2,cy,bx+bw+2+sc(s.p.F),cy,COL.force,'F = '+nt(s.p.F)+' N',3);
    if(f.fat>0) g.arrow(bx,y-5,bx-sc(f.fat),y-5,COL.force,'Fat = '+nt(f.fat)+' N',3,[0,14]);
    if(f.a>0) g.arrow(cx-24,y-bh-26,cx-24+clamp(f.a*10,12,90),y-bh-26,COL.acc,'a = '+nt(f.a)+' m/s²',2.5);
    g.plot(W-190,22,170,104,{xr:[0,8],yr:[0,Math.max(5,(s.p.F/s.p.m)*8*.6)],series:[{pts:s.vt,c:COL.acc,dot:true}],yl:'v (m/s)',xl:'t (s)'}); },
  reads:s=>{ const f=s.def.forces(s); return [['Peso P = m·g',nt(s.p.m*GRAV)+' N'],['Normal N',nt(f.N)+' N']].concat(cfg.fric?[['Atrito',nt(f.fat)+' N · '+f.kind],['Atrito máximo μₑ·N',nt(s.p.ue*f.N)+' N']]:[]).concat([['Força resultante',nt(s.p.F-f.fat)+' N'],['Aceleração a = F<sub>R</sub>/m',nt(f.a)+' m/s²'],['Velocidade',nt(s.v)+' m/s']]); }});

/* elevador com balança */
SIMS.elev=(host,cfg={})=>Sim(host,{alt:'Pessoa numa balança dentro de um elevador que acelera',anim:true,h:350,
  legend:[['force','peso (a Terra puxa a pessoa)'],['vel','normal (a balança empurra a pessoa)'],['muted','reação: a pessoa empurra a balança']],
  ctrls:[{k:'m',l:'Massa da pessoa',min:40,max:100,step:5,v:60,u:'kg'},{k:'a',l:'Aceleração do elevador (+ para cima)',min:-10,max:4,step:.5,v:cfg.a??2,u:'m/s²'}],
  init(s){ s.y=0; s.v=0; },
  step(s,dt){ s.v+=s.p.a*dt; s.y+=s.v*dt; if(Math.abs(s.y)>9) s.play(false); },
  done:s=>Math.abs(s.y)>9,
  draw(g,s){ const N=Math.max(0,s.p.m*(GRAV+s.p.a)), P=s.p.m*GRAV, cx=g.W*.34, ew=150, eh=200, ey=(g.H-eh)/2, fl=40;
    const wall=isDark()?mix(COL.paper,'#5a6577',.35):mix('#d6dce4',COL.paper,.1); g.rect(cx-ew/2-26,0,ew+52,g.H,wall);
    const off=((s.y*fl)%fl+fl)%fl; for(let yy=-fl+off;yy<g.H+fl;yy+=fl){ g.line(cx-ew/2-26,yy,cx+ew/2+26,yy,alpha(COL.ink,.18),1.2); const fn=Math.round((ey+eh-yy)/fl+s.y); g.text(fn+'º',cx-ew/2-14,yy-6,{size:10,c:COL.muted,mono:true,align:'center'}); }
    g.line(cx-12,0,cx-12,ey,COL.muted,1.5); g.line(cx+12,0,cx+12,ey,COL.muted,1.5);
    const cab=g.ctx.createLinearGradient(cx-ew/2,0,cx+ew/2,0); cab.addColorStop(0,isDark()?'#4b5566':'#c4ccd6'); cab.addColorStop(.5,isDark()?'#6b7688':'#eef2f6'); cab.addColorStop(1,isDark()?'#4b5566':'#c4ccd6');
    g.rect(cx-ew/2,ey,ew,eh,cab,COL.ink,8,2); g.line(cx,ey+8,cx,ey+eh-8,alpha(COL.ink,.25),1.5);
    const fy=ey+eh-16; g.rect(cx-34,fy,68,10,COL.sunk,COL.ink,3,1.5); g.rect(cx-14,fy+2,28,6,'#1f2933',null,2); g.text(nt(N/GRAV,3),cx,fy+7.5,{size:7,c:'#7CFC9A',mono:true,align:'center'});
    SK.person(g,cx,fy,110,isDark()?'#d0d6df':'#2b3340');
    const sc=v=>clamp(v*.1,0,110); g.arrow(cx+40,fy-56,cx+40,fy-56+sc(P),COL.force,'P',3); g.arrow(cx-40,fy-4,cx-40,fy-4-sc(N),COL.vel,'N',3); if(N>0) g.arrow(cx+62,fy+6,cx+62,fy+6+sc(N)*.45,COL.muted,"N'",2);
    if(s.p.a) g.arrow(cx+ew/2+44,g.H/2,cx+ew/2+44,g.H/2-Math.sign(s.p.a)*clamp(Math.abs(s.p.a)*12,12,60),COL.acc,'a',3);
    const x2=Math.min(g.W*.76,g.W-90); g.rect(x2-74,34,148,84,'#1f2933',COL.ink,12,2); g.text('a balança marca',x2,56,{size:11.5,c:'#b8c4d0',align:'center'}); g.text(nt(N/GRAV,3)+' kg',x2,96,{size:26,bold:true,c:'#7CFC9A',align:'center',mono:true});
    g.tag(s.p.a>0?'acelerando para cima: N > P':s.p.a<0&&s.p.a>-10?'acelerando para baixo: N < P':s.p.a<=-10?'queda livre: "sem peso"':'a = 0: N = P',x2,140,s.p.a<=-10?COL.force:COL.ink,'center',12); },
  reads:s=>{ const N=Math.max(0,s.p.m*(GRAV+s.p.a)); return [['Peso P = m·g',nt(s.p.m*GRAV)+' N'],['Normal N = m·(g + a)',nt(N)+' N'],['Resultante N − P = m·a',nt(N-s.p.m*GRAV)+' N'],['Balança marca N/g',nt(N/GRAV)+' kg']]; }});

/* plano inclinado */
SIMS.incl=(host)=>Sim(host,{alt:'Caixa numa rampa com o peso decomposto em duas partes',anim:true,h:340,
  legend:[['vel','peso e suas componentes'],['force','atrito'],['acc','normal']],
  ctrls:[{k:'th',l:'Inclinação θ',min:0,max:60,step:1,v:30,u:'°'},{k:'m',l:'Massa',min:1,max:10,step:1,v:2,u:'kg'},{k:'mu',l:'Coeficiente de atrito μ',min:0,max:1,step:.05,v:.3}],
  init(s){ s.d=0; s.v=0; },
  phys(s){ const th=s.p.th*Math.PI/180, P=s.p.m*GRAV, Px=P*Math.sin(th), Py=P*Math.cos(th), N=Py, fmax=s.p.mu*N; const slides=Px>fmax+1e-9; return {th,P,Px,Py,N,fmax,fat:slides?fmax:Px,slides,a:slides?(Px-fmax)/s.p.m:0}; },
  step(s,dt){ const f=s.def.phys(s); if(f.slides){ s.v+=f.a*dt; s.d+=s.v*dt; } if(s.d>6||!f.slides) s.play(false); },
  done:s=>s.d>6,
  draw(g,s){ const f=s.def.phys(s), th=f.th, L=Math.min(g.W*.8,540), x0=g.W*.08, y0=g.H-30, x1=x0+L*Math.cos(th), y1=y0-L*Math.sin(th);
    SK.sky(g,y0); SK.grass(g,y0,g.H-y0);
    const ramp=g.ctx.createLinearGradient(0,y1,0,y0); ramp.addColorStop(0,isDark()?'#6b5a45':'#c7a57a'); ramp.addColorStop(1,isDark()?'#4d4033':'#a8865c');
    g.poly([[x0,y0],[x1,y0],[x1,y1]],mix(isDark()?'#4d4033':'#a8865c','#000',.3),2,ramp,true);
    if(th>.01){ g.ctx.save(); g.ctx.strokeStyle=COL.energy; g.ctx.lineWidth=2; g.ctx.beginPath(); g.ctx.arc(x0,y0,46,-th,0); g.ctx.stroke(); g.ctx.restore(); g.tag(s.p.th+'°',x0+60,y0-12,COL.energy,'left',12); }
    const ux=-Math.cos(th), uy=Math.sin(th), nx=-Math.sin(th), ny=-Math.cos(th), t=clamp(.35+s.d/12,0,.95);
    const bx=x1+ux*L*t, by=y1+uy*L*t, cx=bx+nx*24, cy=by+ny*24;
    const c=g.ctx; c.save(); c.translate(cx,cy); c.rotate(-th); SK.crate(g,-32,-24,64,48); c.restore();
    const sc=v=>clamp(v*2.2,0,110); g.arrow(cx,cy,cx,cy+sc(f.P),COL.vel,'P',3);
    g.arrow(cx,cy,cx+ux*sc(f.Px),cy+uy*sc(f.Px),COL.vel,'P·sen θ',2); g.arrow(cx,cy,cx-nx*sc(f.Py),cy-ny*sc(f.Py),COL.vel,'P·cos θ',2);
    g.arrow(cx,cy,cx+nx*sc(f.N),cy+ny*sc(f.N),COL.acc,'N',3); if(f.fat>1e-6) g.arrow(bx-ux*34,by-uy*34,bx-ux*(34+sc(f.fat)),by-uy*(34+sc(f.fat)),COL.force,'Fat',3);
    g.tag(f.slides?'a caixa escorrega':'o atrito segura a caixa',g.W-14,24,f.slides?COL.force:COL.ok,'right',14); },
  reads:s=>{ const f=s.def.phys(s); return [['P·sen θ (puxa ladeira abaixo)',nt(f.Px)+' N'],['P·cos θ = N',nt(f.Py)+' N'],['Atrito máximo μ·N',nt(f.fmax)+' N'],['Aceleração',nt(f.a)+' m/s²'],['Ângulo em que começa a escorregar',nt(Math.atan(s.p.mu)*180/Math.PI)+'°']]; }});
