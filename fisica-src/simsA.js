/* =====================================================================
   Laboratórios com cenário: energia, momento, gravitação, estática e fluidos
   ===================================================================== */

/* trabalho: pessoa puxa uma caixa com uma corda inclinada */
SIMS.work=(host,cfg={})=>Sim(host,{alt:'Pessoa puxando uma caixa com uma corda inclinada; só a parte horizontal da força realiza trabalho',anim:true,h:290,
  legend:[['force','força F (na corda)'],['vel','Fₓ = F·cos θ (realiza trabalho)'],['muted','F_y (não realiza trabalho)']],
  ctrls:[{k:'F',l:'Força F',min:0,max:50,step:1,v:cfg.F??20,u:'N'},{k:'th',l:'Ângulo da corda θ',min:0,max:90,step:5,v:cfg.th??30,u:'°'},{k:'d',l:'Distância d',min:1,max:10,step:1,v:cfg.d??5,u:'m'}],
  init(s){ s.x=0; s.v=0; },
  step(s,dt){ const m=2, a=s.p.F*Math.cos(s.p.th*Math.PI/180)/m; s.v+=a*dt; s.x=Math.min(s.p.d,s.x+s.v*dt); if(s.x>=s.p.d||a<=0) s.play(false); },
  done:s=>s.x>=s.p.d,
  draw(g,s){ const th=s.p.th*Math.PI/180, y=g.H-56, x0=36, k=(g.W-250)/10, bw=56, bh=44, bx=x0+s.x*k;
    SK.sky(g,y); SK.hills(g,y); SK.grass(g,y,g.H-y); g.rect(0,y,g.W,10,isDark()?'#5b4a36':'#c9a978');
    SK.dim(g,x0,y+26,x0+s.p.d*k,y+26,'d = '+s.p.d+' m',COL.ink); g.rect(x0+s.p.d*k+bw-2,y-60,3,60,COL.ink); g.poly([[x0+s.p.d*k+bw+1,y-60],[x0+s.p.d*k+bw+22,y-53],[x0+s.p.d*k+bw+1,y-46]],null,0,COL.force,true);
    SK.crate(g,bx,y-bh,bw,bh,'2 kg');
    const ox=bx+bw, oy=y-bh*.6, L=40+clamp(s.p.F*2.6,0,130), hx=ox+L*Math.cos(th), hy=oy-L*Math.sin(th);
    g.line(ox,oy,hx,hy,isDark()?'#e8d9b0':'#8a6a2f',2.5); const arm=[Math.cos(th),-Math.sin(th)]; g.line(hx,hy,hx+arm[0]*34,hy+arm[1]*34,isDark()?'#d0d6df':'#2b3340',9); g.circle(hx,hy,8,'#e0a87a',isDark()?'#d0d6df':'#2b3340',2);
    const A=clamp(s.p.F*2.2,0,110); if(s.p.F>0){ g.arrow(ox,oy,ox+A*Math.cos(th),oy-A*Math.sin(th),COL.force,'F = '+nt(s.p.F)+' N',3); g.arrow(ox,oy,ox+A*Math.cos(th),oy,COL.vel,'Fₓ',2.5,[0,14]); g.line(ox+A*Math.cos(th),oy,ox+A*Math.cos(th),oy-A*Math.sin(th),COL.muted,1.5,[4,4]); }
    const W=s.p.F*Math.cos(th)*s.x, Wm=Math.max(1,s.p.F*s.p.d), tx=g.W-48, th2=y-70; g.rect(tx,30,26,th2,COL.card,COL.line,8,1.5); const hh=th2*clamp(W/Wm,0,1); g.rect(tx,30+th2-hh,26,hh,COL.energy,null,8); g.tag('W = '+nt(W)+' J',tx+13,18,COL.energy,'center',11.5); },
  reads:s=>{ const th=s.p.th*Math.PI/180, Fx=s.p.F*Math.cos(th), W=Fx*s.p.d, a=Fx/2, t=a>0?Math.sqrt(2*s.p.d/a):Infinity; return [['Fₓ = F·cos θ',nt(Fx)+' N'],['Trabalho W = F·d·cos θ',nt(W)+' J'],['Trabalho feito até agora',nt(Fx*s.x)+' J'],['Tempo gasto (sem atrito, 2 kg)',isFinite(t)?nt(t)+' s':'—'],['Potência média W/Δt',isFinite(t)?nt(W/t)+' W':'—']]; }});

/* pista de skate em U: energia cinética, potencial e térmica */
SIMS.ramp=(host,cfg)=>Sim(host,{alt:'Skatista numa pista em U com barras de energia cinética, potencial e térmica',anim:true,h:340,sub:8,
  legend:[['vel','cinética'],['acc','potencial'],['force','térmica (dissipada)']],
  ctrls:[{k:'h0',l:'Altura de partida',min:2,max:10,step:.5,v:cfg.h0??8,u:'m'},{k:'m',l:'Massa',min:30,max:90,step:5,v:60,u:'kg'}].concat(cfg.fric?[{k:'mu',l:'Atrito',min:0,max:.3,step:.02,v:cfg.mu??.06}]:[]),
  init(s){ const L=10,Hm=10; s.L=L; s.Hm=Hm; s.x=-L*Math.sqrt(s.p.h0/Hm); s.v=0; s.E0=s.p.m*GRAV*s.p.h0; s.stopped=false; s.peak=s.p.h0; },
  yx:(s,x)=>s.Hm*(x/s.L)**2,
  step(s,dt){ if(s.stopped) return; const mu=s.p.mu||0, sl=2*s.Hm*s.x/s.L**2, ph=Math.atan(sl), sn=Math.sin(ph), cs=Math.cos(ph);
    let a=-GRAV*sn; if(Math.abs(s.v)>1e-3) a-=Math.sign(s.v)*mu*GRAV*cs; else if(Math.abs(sn)<=mu*cs){ s.v=0; s.stopped=true; s.play(false); return; } else a-=Math.sign(-sn)*mu*GRAV*cs;
    const v0=s.v; s.v+=a*dt; if(mu>0&&v0!==0&&Math.sign(s.v)!==Math.sign(v0)){ s.v=0; s.peak=s.def.yx(s,s.x); } s.x=clamp(s.x+s.v*cs*dt,-s.L,s.L); if(s.t>40) s.play(false); },
  draw(g,s){ const L=s.L, W=g.W*.66, x0=18, base=g.H-26, k=Math.min(W/(2*L),(base-34)/s.Hm), X=x=>x0+(x+L)*k, Y=y=>base-y*k;
    SK.sky(g,base); SK.grass(g,base,g.H-base);
    const pts=[]; for(let x=-L;x<=L+1e-9;x+=L/50) pts.push([X(x),Y(s.def.yx(s,x))]);
    const conc=g.ctx.createLinearGradient(0,Y(s.Hm),0,base); conc.addColorStop(0,isDark()?'#5c6370':'#c8ccd2'); conc.addColorStop(1,isDark()?'#3f454f':'#a7adb6');
    g.poly(pts.concat([[X(L),base],[X(-L),base]]),null,0,conc,true); g.poly(pts,isDark()?'#d9dde3':'#59606b',4);
    g.line(X(-L)-4,Y(s.p.h0),X(-L)+64,Y(s.p.h0),COL.energy,1.5,[5,4]); g.tag('h₀ = '+nt(s.p.h0)+' m',X(-L)+70,Y(s.p.h0),COL.energy,'left',11.5);
    const y=s.def.yx(s,s.x), sl=2*s.Hm*s.x/L**2, an=Math.atan2(-sl,1), nx=-sl/Math.hypot(1,sl), ny=1/Math.hypot(1,sl), bx=X(s.x)+nx*5, by=Y(y)-ny*5;
    const c=g.ctx; c.save(); c.translate(bx,by); c.rotate(an); g.rect(-16,-3,32,5,COL.force,null,3); g.circle(-10,4,3,COL.ink); g.circle(10,4,3,COL.ink); c.restore();
    c.save(); c.translate(bx,by); c.rotate(an*.6); SK.person(g,0,-4,46,isDark()?'#d0d6df':'#2b3340'); c.restore();
    if(Math.abs(s.v)>.2) g.arrow(bx,by-56,bx+Math.sign(s.v)*clamp(Math.abs(s.v)*5,14,70),by-56,COL.vel,'v = '+nt(Math.abs(s.v))+' m/s',2.5);
    const Ep=s.p.m*GRAV*y, Ec=.5*s.p.m*s.v*s.v, Et=Math.max(0,s.E0-Ep-Ec), bxx=g.W*.71, bw=(g.W-bxx-16)/4-8, bh=g.H-84, E0=s.E0;
    [[Ec,COL.vel,'Ec'],[Ep,COL.acc,'Ep'],[Et,COL.force,'calor'],[E0,COL.ink,'total']].forEach(([v,col,l],i)=>{ const x=bxx+i*(bw+8), h=bh*clamp(v/E0,0,1); g.rect(x,34,bw,bh,COL.card,COL.line,6,1); g.rect(x,34+bh-h,bw,h,col,null,6); g.text(l,x+bw/2,g.H-30,{size:11,align:'center',c:COL.ink,bold:true}); g.text((v/1000).toFixed(1).replace('.',',')+' kJ',x+bw/2,26,{size:10,align:'center',c:COL.muted,mono:true}); }); },
  reads:s=>{ const y=s.def.yx(s,s.x), Ep=s.p.m*GRAV*y, Ec=.5*s.p.m*s.v*s.v; return [['Altura',nt(y)+' m'],['Velocidade',nt(Math.abs(s.v))+' m/s'],['Energia cinética ½mv²',nt(Ec)+' J'],['Energia potencial mgh',nt(Ep)+' J'],['Energia mecânica Ec + Ep',nt(Ec+Ep)+' J']].concat(cfg.fric?[['Energia virou calor',nt(Math.max(0,s.E0-Ec-Ep))+' J']]:[]); }});

/* impulso: chute; a área do gráfico F×t muda a quantidade de movimento */
SIMS.impulse=(host)=>Sim(host,{alt:'Chute numa bola: gráfico da força durante o contato e a bola saindo do campo',anim:true,h:310,
  legend:[['force','força durante o contato'],['energy','área = impulso']],
  ctrls:[{k:'F',l:'Força máxima',min:100,max:2000,step:50,v:800,u:'N'},{k:'dt',l:'Tempo de contato',min:.005,max:.05,step:.005,v:.02,u:'s',f:v=>nsig(v*1000,3)+' ms'},{k:'m',l:'Massa da bola',min:.2,max:1,step:.05,v:.45,u:'kg'}],
  init(s){ s.x=0; s.ph=0; },
  step(s,dt){ s.ph+=dt; if(s.ph>1) s.x+=s.def.vf(s)*dt*.12; if(s.x>60) s.play(false); },
  vf:s=>.5*s.p.F*s.p.dt/s.p.m, done:s=>s.x>60,
  draw(g,s){ const narrow=g.W<560, w=narrow?g.W-70:Math.min(g.W*.48,380), x=50, y=24, h=narrow?120:g.H-80, I=.5*s.p.F*s.p.dt, frac=clamp(s.ph,0,1), base=g.H-26;
    SK.sky(g,base); SK.grass(g,base,g.H-base);
    const gx0=narrow?20:x+w+30, gx1=g.W-20; g.rect(gx1-8,base-70,6,70,'#f4f6f8'); g.rect(gx1-60,base-70,58,5,'#f4f6f8');
    const pts=[]; for(let i=0;i<=40*frac;i++){ const t=i/40*s.p.dt; pts.push([t*1000,t<=s.p.dt/2?2*s.p.F*t/s.p.dt:2*s.p.F*(1-t/s.p.dt)]); }
    g.plot(x,y,w,h,{xr:[0,50],yr:[0,2000],series:[{pts,c:COL.force,fill:alpha(COL.energy,.35),dot:frac<1}],xl:'t (ms)',yl:'força (N)'});
    g.tag('I = área = '+nt(I)+' N·s',x+w/2,y+18,COL.ink,'center',13);
    const bx=gx0+30+Math.min(s.x*4,gx1-gx0-90), by=base-11; SK.person(g,gx0+6,base,54,isDark()?'#d0d6df':'#2b3340',frac<1?'push':'stand'); SK.shadow(g,bx,base,20); SK.ball(g,bx,by,11,'#f4f6f8',s.x*.8);
    if(frac>=1) g.arrow(bx+14,by-24,bx+14+clamp(s.def.vf(s)*2,10,90),by-24,COL.vel,'v = '+nt(s.def.vf(s))+' m/s',3); },
  reads:s=>{ const I=.5*s.p.F*s.p.dt; return [['Impulso I = área do gráfico',nt(I)+' N·s'],['Força média (metade da máxima)',nt(s.p.F/2)+' N'],['Quantidade de movimento final Q = I',nt(I)+' kg·m/s'],['Velocidade final v = Q/m',nt(I/s.p.m)+' m/s'],['Em km/h',nt(I/s.p.m*3.6)+' km/h']]; }});

/* colisões em uma dimensão: carrinhos num trilho */
function cart(g,x,y,w,col,label){ const h=26; SK.shadow(g,x,y+2,w); g.rect(x-w/2,y-h-6,w,h,col,mix(col,'#000',.35),7,1.5); g.rect(x-w/2+6,y-h,w-12,8,alpha('#ffffff',.25),null,3); g.circle(x-w*.3,y-4,5,'#1c1f24'); g.circle(x+w*.3,y-4,5,'#1c1f24'); g.circle(x-w*.3,y-4,2,'#9aa3ad'); g.circle(x+w*.3,y-4,2,'#9aa3ad'); g.text(label,x,y-h/2-2,{size:12,bold:true,align:'center',c:'#fff'}); }
SIMS.coll=(host,cfg={})=>Sim(host,{alt:'Dois carrinhos num trilho que colidem, com barras de quantidade de movimento e de energia',anim:true,h:330,
  legend:[['vel','carrinho 1'],['force','carrinho 2'],['acc','total']],
  ctrls:[{k:'m1',l:'Massa 1',min:1,max:5,step:.5,v:cfg.m1??2,u:'kg'},{k:'v1',l:'Velocidade 1',min:-4,max:8,step:1,v:cfg.v1??5,u:'m/s'},{k:'m2',l:'Massa 2',min:1,max:5,step:.5,v:cfg.m2??2,u:'kg'},{k:'v2',l:'Velocidade 2',min:-6,max:4,step:1,v:cfg.v2??0,u:'m/s'},{k:'e',l:'Coeficiente de restituição e',min:0,max:1,step:.1,v:cfg.e??1,f:v=>nsig(v,2)+(v===1?' (elástica)':v===0?' (grudam)':'')}],
  init(s){ s.x1=-5; s.x2=1.5; s.u1=s.p.v1; s.u2=s.p.v2; s.hit=false; s.hitT=-9; },
  step(s,dt){ s.x1+=s.u1*dt; s.x2+=s.u2*dt; const w1=.5+s.p.m1*.12, w2=.5+s.p.m2*.12;
    if(!s.hit&&s.x1+w1/2>=s.x2-w2/2&&s.u1>s.u2){ s.hit=true; s.hitT=s.t; s.hx=(s.x1+w1/2); const {m1,m2,e}=s.p, Q=m1*s.u1+m2*s.u2, d=s.u1-s.u2; s.u1=(Q-m2*e*d)/(m1+m2); s.u2=(Q+m1*e*d)/(m1+m2); }
    if(s.t>6||Math.abs(s.x1)>14&&Math.abs(s.x2)>14) s.play(false); },
  done:s=>s.t>6,
  draw(g,s){ const y=118, k=g.W/24, X=x=>g.W/2+x*k, w1=(.5+s.p.m1*.12)*k, w2=(.5+s.p.m2*.12)*k;
    g.rect(0,0,g.W,y+30,isDark()?mix(COL.paper,'#2a3550',.4):mix('#e9eef5',COL.paper,.2)); g.rect(0,y,g.W,8,isDark()?'#8f99a8':'#6b7686',null,2); g.rect(0,y+8,g.W,22,isDark()?'#2a2f37':'#d5d9df');
    for(let x=-12;x<=12;x+=2){ g.line(X(x),y+8,X(x),y+14,COL.muted,1); }
    const flash=s.t-s.hitT; if(flash>=0&&flash<.35){ const r=10+flash*90; g.ctx.save(); g.ctx.globalAlpha=1-flash/.35; g.circle(X(s.hx),y-18,r,null,COL.energy,4); g.ctx.restore(); }
    cart(g,X(s.x1),y,Math.max(36,w1),COL.vel,nt(s.p.m1)+' kg'); cart(g,X(s.x2),y,Math.max(36,w2),COL.force,nt(s.p.m2)+' kg');
    [[s.x1,s.u1,COL.vel],[s.x2,s.u2,COL.force]].forEach(([x,u,c])=>{ if(Math.abs(u)>.05) g.arrow(X(x),y-46,X(x)+u*9,y-46,c,nt(u)+' m/s',2.5); });
    const Q=[s.p.m1*s.u1,s.p.m2*s.u2], Q0=[s.p.m1*s.p.v1,s.p.m2*s.p.v2], E0=.5*s.p.m1*s.p.v1**2+.5*s.p.m2*s.p.v2**2, E=.5*s.p.m1*s.u1**2+.5*s.p.m2*s.u2**2, top=y+50, mid=g.W/2, qs=Math.max(1,Math.abs(Q0[0])+Math.abs(Q0[1]),Math.abs(Q[0])+Math.abs(Q[1]));
    g.text('quantidade de movimento Q = m·v',16,top,{size:12.5,c:COL.ink,bold:true}); const zx=mid*.5; g.line(zx,top+8,zx,top+84,COL.muted,1);
    [[Q[0],COL.vel,'carrinho 1'],[Q[1],COL.force,'carrinho 2'],[Q[0]+Q[1],COL.acc,'total']].forEach(([q,c,l],i)=>{ const yy=top+14+i*24, ww=q/qs*mid*.42; g.rect(Math.min(zx,zx+ww),yy,Math.abs(ww),16,c,null,4); g.text(nt(q)+' kg·m/s',zx+(ww>=0?Math.max(ww,0)+6:6),yy+12,{size:10.5,mono:true,c:COL.ink}); });
    g.text('energia cinética',mid+16,top,{size:12.5,c:COL.ink,bold:true}); const es=Math.max(E0,1), bw=g.W-mid-40;
    g.rect(mid+16,top+14,bw*E0/es,16,COL.line,null,4); g.rect(mid+16,top+38,bw*E/es,16,COL.energy,null,4); g.text('antes: '+nt(E0)+' J',mid+20,top+26,{size:10.5,c:COL.ink}); g.text('agora: '+nt(E)+' J',mid+20,top+50,{size:10.5,c:COL.ink}); },
  reads:s=>{ const Q0=s.p.m1*s.p.v1+s.p.m2*s.p.v2, Q=s.p.m1*s.u1+s.p.m2*s.u2, E0=.5*s.p.m1*s.p.v1**2+.5*s.p.m2*s.p.v2**2, E=.5*s.p.m1*s.u1**2+.5*s.p.m2*s.u2**2;
    return [['Q total antes',nt(Q0)+' kg·m/s'],['Q total agora',nt(Q)+' kg·m/s'],['Energia cinética antes → agora',nt(E0)+' → '+nt(E)+' J'],['Velocidades agora',nt(s.u1)+' e '+nt(s.u2)+' m/s'],['Colisão',s.p.v1<=s.p.v2?'não acontece (o 1 não alcança o 2)':s.p.e===1?'elástica: conserva a energia':s.p.e===0?'perfeitamente inelástica: saem juntos':'parcialmente elástica']]; }});

/* órbitas no espaço: leis de Kepler */
SIMS.orbit=(host,cfg={})=>Sim(host,{alt:'Planeta orbitando uma estrela no espaço; áreas varridas em tempos iguais',anim:true,autoplay:false,h:360,sub:20,speed:1.6,
  legend:[['energy','estrela'],['vel','planeta'],['acc','áreas varridas em intervalos iguais de tempo']],
  ctrls:[{k:'v',l:'Velocidade inicial (1 = órbita circular)',min:.6,max:1.5,step:.05,v:cfg.v??.8,f:v=>nsig(v,3)+' × v circular'},{k:'ar',l:'Mostrar áreas',opts:[[1,'sim'],[0,'não']],v:1,live:true}],
  init(s){ s.r=[1,0]; s.u=[0,s.p.v]; s.tr=[[1,0]]; s.marks=[[1,0]]; s.acc=0; const v=s.p.v; s.esc=v*v>=2; if(!s.esc){ s.a=1/(2-v*v); s.other=2*s.a-1; s.Tp=2*Math.PI*s.a**1.5; s.dtM=s.Tp/12; } else { s.dtM=.6; } },
  step(s,dt){ const r=Math.hypot(s.r[0],s.r[1]), a=[-s.r[0]/r**3,-s.r[1]/r**3]; s.u[0]+=a[0]*dt; s.u[1]+=a[1]*dt; s.r[0]+=s.u[0]*dt; s.r[1]+=s.u[1]*dt;
    s.tr.push(s.r.slice()); if(s.tr.length>4000) s.tr.shift(); s.acc+=dt; if(s.acc>=s.dtM){ s.acc-=s.dtM; s.marks.push(s.r.slice()); if(s.marks.length>13) s.marks.shift(); } if(s.esc&&r>8) s.play(false); },
  draw(g,s){ const c=g.ctx, bg=c.createRadialGradient(g.W/2,g.H/2,10,g.W/2,g.H/2,g.W*.7); bg.addColorStop(0,'#1a2140'); bg.addColorStop(1,'#070a16'); c.fillStyle=bg; c.fillRect(0,0,g.W,g.H);
    for(let i=0;i<70;i++){ const x=(i*157.3)%g.W, y=(i*91.7)%g.H; c.fillStyle=`rgba(255,255,255,${.25+.5*((i*7)%10)/10})`; c.fillRect(x,y,i%9?1.2:2,i%9?1.2:2); }
    const xmin=s.esc?-2:-s.other, xmax=s.esc?6:1, b=s.esc?3:s.a*Math.sqrt(1-((s.a-1)/s.a)**2), cx0=(xmin+xmax)/2, k=Math.min((g.W-40)/(xmax-xmin),(g.H-40)/(2*Math.max(b,.3))), X=x=>g.W/2+(x-cx0)*k, Y=y=>g.H/2-y*k;
    if(s.p.ar){ for(let i=0;i+1<s.marks.length;i++){ const a=s.marks[i],bb=s.marks[i+1]; g.poly([[X(0),Y(0)],[X(a[0]),Y(a[1])],[X(bb[0]),Y(bb[1])]],null,0,i%2?'rgba(183,148,255,.38)':'rgba(183,148,255,.2)',true); } }
    g.poly(s.tr.map(p=>[X(p[0]),Y(p[1])]),'rgba(255,255,255,.35)',1.5);
    const glow=c.createRadialGradient(X(0),Y(0),2,X(0),Y(0),46); glow.addColorStop(0,'rgba(255,214,102,1)'); glow.addColorStop(.3,'rgba(255,170,40,.55)'); glow.addColorStop(1,'rgba(255,150,0,0)'); c.fillStyle=glow; c.beginPath(); c.arc(X(0),Y(0),46,0,7); c.fill(); SK.ball(g,X(0),Y(0),13,'#ffc94a');
    SK.ball(g,X(s.r[0]),Y(s.r[1]),7.5,'#4f9cff');
    const sp=Math.hypot(s.u[0],s.u[1]), L=clamp(sp*30,12,60); g.arrow(X(s.r[0]),Y(s.r[1]),X(s.r[0])+s.u[0]/sp*L,Y(s.r[1])-s.u[1]/sp*L,'#7cc4ff','v = '+nt(sp),2.5);
    g.text('estrela',X(0),Y(0)+30,{size:11,c:'#ffd98a',align:'center'}); },
  reads:s=>{ const r=Math.hypot(s.r[0],s.r[1]), sp=Math.hypot(s.u[0],s.u[1]); return [['Distância à estrela',nt(r)+' (raio inicial = 1)'],['Velocidade',nt(sp)+' × v circular'],['Órbita',s.esc?'aberta: o planeta escapa':Math.abs(s.p.v-1)<.01?'circular':'elíptica (a estrela fica num foco)']].concat(s.esc?[]:[['Período (cresce com a órbita)',nt(s.Tp/(2*Math.PI))+' × o da órbita circular']]); }});

/* gangorra no parquinho: momento de uma força */
SIMS.lever=(host,cfg={})=>Sim(host,{alt:'Gangorra num parquinho com duas crianças em distâncias ajustáveis',h:310,
  legend:[['vel','lado esquerdo'],['force','lado direito']],
  ctrls:[{k:'m1',l:'Massa esquerda',min:10,max:80,step:5,v:cfg.m1??40,u:'kg'},{k:'d1',l:'Distância esquerda',min:.5,max:3,step:.25,v:cfg.d1??1.5,u:'m'},{k:'m2',l:'Massa direita',min:10,max:80,step:5,v:cfg.m2??20,u:'kg'},{k:'d2',l:'Distância direita',min:.5,max:3,step:.25,v:cfg.d2??2.5,u:'m'}],
  draw(g,s){ const M1=s.p.m1*GRAV*s.p.d1, M2=s.p.m2*GRAV*s.p.d2, diff=M1-M2, ang=clamp(diff/300,-1,1)*.2, cx=g.W/2, base=g.H-26, cy=base-50, k=Math.min(80,(g.W-60)/6.6);
    SK.sky(g,base); SK.hills(g,base); SK.tree(g,40,base,70); SK.grass(g,base,g.H-base);
    g.poly([[cx,cy],[cx-24,base],[cx+24,base]],mix(COL.force,'#000',.3),2,COL.force,true);
    const c=g.ctx; c.save(); c.translate(cx,cy); c.rotate(ang); g.rect(-3.3*k,-7,6.6*k,11,isDark()?'#a0703f':'#c98d4f',isDark()?'#5b3d1e':'#7a5025',4,1.5);
    for(let d=-3;d<=3;d++) g.line(d*k,-7,d*k,4,alpha('#000',.35),1);
    const kid=(d,m,col,sgn)=>{ const h=34+m*.45; SK.person(g,sgn*d*k,-7,h,col); g.tag(nt(m)+' kg',sgn*d*k,-7-h-12,col,'center',11.5); };
    kid(s.p.d1,s.p.m1,COL.vel,-1); kid(s.p.d2,s.p.m2,COL.force,1);
    SK.dim(g,0,16,-s.p.d1*k,16,nt(s.p.d1)+' m',COL.vel); SK.dim(g,0,16,s.p.d2*k,16,nt(s.p.d2)+' m',COL.force); c.restore();
    g.tag(Math.abs(diff)<1e-9?'equilíbrio: os momentos se anulam':diff>0?'gira para a esquerda':'gira para a direita',cx,22,Math.abs(diff)<1e-9?COL.ok:COL.ink,'center',14);
    const bw=Math.min(150,g.W*.28); [[M1,COL.vel,16],[M2,COL.force,g.W-16-bw]].forEach(([M,col,x])=>{ g.rect(x,44,bw,12,COL.card,COL.line,4,1); g.rect(x,44,bw*clamp(M/2400,0,1),12,col,null,4); g.tag('M = '+nt(M)+' N·m',x+bw/2,70,col,'center',11); }); },
  reads:s=>{ const M1=s.p.m1*GRAV*s.p.d1, M2=s.p.m2*GRAV*s.p.d2; return [['Momento esquerdo m₁·g·d₁',nt(M1)+' N·m'],['Momento direito m₂·g·d₂',nt(M2)+' N·m'],['Para equilibrar, a massa direita deveria ser',nt(s.p.m1*s.p.d1/s.p.d2)+' kg'],['Força no apoio',nt((s.p.m1+s.p.m2)*GRAV)+' N']]; }});

/* pressão hidrostática: mergulhador com um sensor */
const LIQ=[[1000,'água'],[800,'álcool'],[13600,'mercúrio']];
SIMS.press=(host,cfg={})=>Sim(host,{alt:'Mergulhador descendo num lago com um sensor de pressão; gráfico da pressão pela profundidade',h:340,
  ctrls:[{k:'rho',l:'Líquido',opts:LIQ.map(x=>[x[0],x[1]]),v:1000},{k:'h',l:'Profundidade do sensor',min:0,max:10,step:.5,v:cfg.h??4,u:'m',live:true},{k:'atm',l:'Somar a pressão do ar?',opts:[[1,'sim'],[0,'não']],v:1,live:true}],
  draw(g,s){ const narrow=g.W<560, tw=narrow?g.W*.48:Math.min(260,g.W*.4), x0=0, y0=40, th=g.H-60, k=th/10, ph=v=>s.p.rho*GRAV*v+(s.p.atm?1e5:0);
    SK.sky(g,y0); const base=s.p.rho>5000?'#9aa3ad':s.p.rho<900?'#9fd8c8':'#3f8fd8', wg=g.ctx.createLinearGradient(0,y0,0,y0+th); wg.addColorStop(0,mix(base,COL.paper,.35)); wg.addColorStop(1,mix(base,'#04122b',.45)); g.rect(x0,y0,tw,th,wg); g.rect(x0,y0+th,tw,g.H-y0-th,isDark()?'#4d4033':'#c9b183');
    g.ctx.save(); g.ctx.strokeStyle='rgba(255,255,255,.6)'; g.ctx.lineWidth=2; g.ctx.beginPath(); for(let x=0;x<=tw;x+=6) g.ctx.lineTo(x0+x,y0+2*Math.sin(x/12)); g.ctx.stroke(); g.ctx.restore();
    for(let m=0;m<=10;m+=2){ g.line(x0+tw-10,y0+m*k,x0+tw,y0+m*k,'#fff',1.4); g.text(m+' m',x0+tw-14,y0+m*k+4,{size:10.5,c:'#fff',mono:true,align:'right',bold:true}); }
    const sx=x0+tw*.42, sy=y0+s.p.h*k; g.line(sx,y0-30,sx,sy,isDark()?'#ddd':'#333',1.5); g.rect(sx-16,y0-34,32,8,'#5b6472',null,3);
    for(let a=0;a<12;a++){ const an=a/12*Math.PI*2, L=8+ph(s.p.h)/1.8e4; g.arrow(sx+Math.cos(an)*(L+14),sy+Math.sin(an)*(L+14),sx+Math.cos(an)*12,sy+Math.sin(an)*12,'#ff7a5c',null,1.6); }
    SK.ball(g,sx,sy,10,COL.energy); g.tag(nt(ph(s.p.h)/1e5)+' atm',sx+22,sy-18,COL.ink,'left',12);
    const px=x0+tw+56, pw=g.W-px-18, pmax=ph(10)*1.05; const pts=[]; for(let v=0;v<=10;v+=.5) pts.push([v,ph(v)/1e5]);
    const r=g.plot(px,y0,pw,th,{xr:[0,10],yr:[0,pmax/1e5],series:[{pts,c:COL.force}],xl:'profundidade (m)',yl:'pressão (atm)'}); g.circle(r.X(s.p.h),r.Y(ph(s.p.h)/1e5),6,COL.energy,COL.ink,1.5); },
  reads:s=>{ const ph=s.p.rho*GRAV*s.p.h, pt=ph+(s.p.atm?1e5:0); return [['Pressão da coluna ρ·g·h',nf(ph)+' Pa'],['Pressão do ar na superfície',s.p.atm?'1,0×10<sup>5</sup> Pa':'não somada'],['Pressão total no sensor',nf(pt)+' Pa'],['Em atmosferas',nt(pt/1e5)+' atm'],['Cada 10 m de água somam','1 atm']]; }});

/* empuxo num lago: flutua ou afunda */
SIMS.buoy=(host,cfg={})=>Sim(host,{alt:'Bloco colocado num lago: flutua ou afunda, com as setas de peso e empuxo',anim:true,h:320,
  legend:[['force','peso'],['vel','empuxo']],
  ctrls:[{k:'rb',l:'Densidade do bloco',min:200,max:3000,step:50,v:cfg.rb??600,u:'kg/m³'},{k:'V',l:'Volume do bloco',min:1,max:20,step:1,v:cfg.V??8,u:'L'},{k:'rf',l:'Líquido',opts:[[1000,'água'],[1030,'água do mar'],[800,'álcool']],v:1000}],
  init(s){ s.y=-1.4; s.v=0; },
  step(s,dt){ const V=s.p.V/1000, side=Math.cbrt(V), sub=clamp(s.y,0,1), P=s.p.rb*V*GRAV, E=s.p.rf*V*sub*GRAV, m=s.p.rb*V; let a=(P-E)/m-2.2*s.v; if(s.y>=2.2&&a>0){ a=0; s.v=0; } s.v+=a*dt; s.y=Math.min(2.2,s.y+s.v*dt/(side*4)); if(s.t>12) s.play(false); },
  done:s=>s.t>12,
  draw(g,s){ const V=s.p.V/1000, side=Math.cbrt(V), bs=40+side*150, tw=Math.min(g.W*.58,380), wl=118, bot=g.H-18, cx=tw/2+10;
    SK.sky(g,wl); SK.hills(g,wl); g.rect(tw+20,wl,g.W-tw-20,g.H-wl,isDark()?mix(COL.paper,COL.ok,.25):mix(COL.ok,COL.paper,.5));
    const wg=g.ctx.createLinearGradient(0,wl,0,bot); wg.addColorStop(0,isDark()?'#1f5a8c':'#6db6ef'); wg.addColorStop(1,isDark()?'#0d2a46':'#2a6fb3'); g.rect(0,wl,tw+20,bot-wl,wg); g.rect(0,bot,tw+20,g.H-bot,isDark()?'#4d4033':'#c9b183');
    const top=wl-bs+s.y*bs, yb=Math.min(top,bot-bs), wood=s.p.rb<1000, col=wood?(isDark()?'#a0703f':'#c98d4f'):s.p.rb>2000?'#8f99a8':'#b9a07a';
    if(wood) SK.crate(g,cx-bs/2,yb,bs,bs); else { g.rect(cx-bs/2,yb,bs,bs,col,mix(col,'#000',.4),6,2); g.rect(cx-bs/2+6,yb+6,bs*.35,bs*.12,alpha('#ffffff',.35),null,3); }
    g.ctx.save(); g.ctx.globalAlpha=.35; g.rect(0,Math.max(wl,yb),tw+20,Math.max(0,Math.min(bot,yb+bs)-Math.max(wl,yb)),isDark()?'#1f5a8c':'#6db6ef'); g.ctx.restore();
    g.ctx.save(); g.ctx.strokeStyle='rgba(255,255,255,.75)'; g.ctx.lineWidth=2; g.ctx.beginPath(); for(let x=0;x<=tw+20;x+=6) g.ctx.lineTo(x,wl+2*Math.sin(x/14+s.t*2)); g.ctx.stroke(); g.ctx.restore();
    const sub=clamp((yb+bs-wl)/bs,0,1), P=s.p.rb*V*GRAV, E=s.p.rf*V*sub*GRAV, sc=v=>clamp(v*.9,0,120);
    g.arrow(cx+14,yb+bs/2,cx+14,yb+bs/2+sc(P),COL.force,'P = '+nt(P)+' N',3); if(E>0) g.arrow(cx-14,yb+bs/2,cx-14,yb+bs/2-sc(E),COL.vel,'E = '+nt(E)+' N',3);
    const tx=tw+30; g.tag(s.p.rb<s.p.rf?'flutua':s.p.rb===s.p.rf?'fica parado em qualquer altura':'afunda',tx+(g.W-tx)/2,40,s.p.rb<s.p.rf?COL.ok:COL.force,'center',14);
    g.tag('submerso: '+nt(sub*100,3)+'%',tx+(g.W-tx)/2,68,COL.ink,'center',12); },
  reads:s=>{ const V=s.p.V/1000, P=s.p.rb*V*GRAV, fr=Math.min(1,s.p.rb/s.p.rf), E=s.p.rf*V*fr*GRAV; return [['Peso P = ρ<sub>bloco</sub>·V·g',nt(P)+' N'],['Empuxo máximo (todo submerso) ρ<sub>líq</sub>·V·g',nt(s.p.rf*V*GRAV)+' N'],['No equilíbrio',s.p.rb<=s.p.rf?`flutua com ${nt(fr*100,3)}% submerso (E = P = ${nt(E)} N)`:`afunda; peso aparente ${nt(P-s.p.rf*V*GRAV)} N`]]; }});
