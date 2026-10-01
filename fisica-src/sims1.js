/* =====================================================================
   Laboratórios de fundamentos e mecânica (g = 10 m/s² em todo o curso)
   ===================================================================== */
const GRAV=10;

/* potências de 10: régua logarítmica do átomo à galáxia */
const SCALE=[[-10,'átomo','1×10⁻¹⁰ m'],[-7,'vírus','1×10⁻⁷ m'],[-5,'célula humana','1×10⁻⁵ m'],[-4,'espessura de um fio de cabelo','1×10⁻⁴ m'],[-3,'grão de areia','1×10⁻³ m'],[-2,'largura de um dedo','1×10⁻² m'],[0,'uma criança','1 m'],[2,'campo de futebol','1×10² m'],[5,'São Paulo–Rio (360 km)','3,6×10⁵ m'],[7,'diâmetro da Terra','1,3×10⁷ m'],[8,'distância Terra–Lua','3,8×10⁸ m'],[9,'diâmetro do Sol','1,4×10⁹ m'],[11,'distância Terra–Sol','1,5×10¹¹ m'],[16,'um ano-luz','9,5×10¹⁵ m'],[21,'diâmetro da Via Láctea','1×10²¹ m']];
const PREF={'-9':'nano (n)','-6':'micro (μ)','-3':'mili (m)','-2':'centi (c)','3':'quilo (k)','6':'mega (M)','9':'giga (G)','12':'tera (T)'};
SIMS.pow10=(host)=>Sim(host,{alt:'Régua de potências de 10 com objetos do átomo à galáxia',h:230,
  ctrls:[{k:'e',l:'Expoente (10ⁿ metros)',min:-10,max:21,step:1,v:0,f:v=>'10'+[...String(v)].map(c=>SUP[c]).join('')+' m',live:true}],
  draw(g,s){ const L=20,Rr=g.W-20,y=120,X=e=>L+(e+10)/31*(Rr-L), e=s.p.e;
    g.line(L,y,Rr,y,COL.muted,2); for(let k=-10;k<=21;k++){ g.line(X(k),y-(k%5?5:9),X(k),y+(k%5?5:9),COL.muted,1.2); if(k%5===0) g.text('10'+[...String(k)].map(c=>SUP[c]).join(''),X(k),y+26,{size:12,c:COL.muted,align:'center',mono:true}); }
    SCALE.forEach(o=>g.circle(X(o[0]),y,4,o[0]===e?COL.force:COL.card,COL.ink,1.5));
    g.circle(X(e),y,9,null,COL.accent,3);
    const near=SCALE.reduce((a,b)=>Math.abs(b[0]-e)<Math.abs(a[0]-e)?b:a);
    g.text('10'+[...String(e)].map(c=>SUP[c]).join('')+' m',g.W/2,40,{size:24,bold:true,align:'center',mono:true});
    g.text(`objeto mais próximo dessa ordem: ${near[1]} (${near[2]})`,g.W/2,64,{size:13.5,c:COL.muted,align:'center'});
    g.text('cada tracinho = 10 vezes maior que o anterior',g.W/2,g.H-18,{size:12,c:COL.muted,align:'center'}); },
  reads:s=>{ const e=s.p.e; const dec=e>=0?(e<=9?(10**e).toLocaleString('pt-BR')+' m':'1 seguido de '+e+' zeros'):(e>=-6?'0,'+'0'.repeat(-e-1)+'1 m':'0,000…1 ('+(-e)+' casas)'); return [['Notação científica','1×10<sup>'+e+'</sup> m'],['Escrito por extenso',dec],['Prefixo do SI',PREF[e]||'—'],['Objeto dessa ordem',SCALE.reduce((a,b)=>Math.abs(b[0]-e)<Math.abs(a[0]-e)?b:a)[1]]]; }});

/* vetores: arraste as pontas */
SIMS.vec=(host)=>Sim(host,{alt:'Dois vetores arrastáveis e a resultante',h:w=>Math.min(360,Math.max(280,w*.55)),
  legend:[['vel','vetor A'],['force','vetor B'],['acc','resultante R']],
  ctrls:[{k:'m',l:'Operação',opts:[['s','R = A + B'],['d','R = A − B']],v:'s',live:true}],
  init(s){ if(!s.A){ s.A=[4,1]; s.B=[1,3]; } },
  geo(s){ const u=Math.min(34,s.W/16), O=[s.W*.22,s.H*.78]; return {u,O,P:v=>[O[0]+v[0]*u,O[1]-v[1]*u]}; },
  drag:{ down(s,x,y){ const {P}=s.def.geo(s); const A=s.A, Bt=s.p.m==='s'?[A[0]+s.B[0],A[1]+s.B[1]]:[A[0]-s.B[0],A[1]-s.B[1]]; const pa=P(A),pb=P(Bt);
      s.dr=Math.hypot(x-pb[0],y-pb[1])<22?'B':Math.hypot(x-pa[0],y-pa[1])<22?'A':null; return !!s.dr; },
    move(s,x,y){ const {u,O}=s.def.geo(s); const v=[Math.round((x-O[0])/u*2)/2,Math.round((O[1]-y)/u*2)/2];
      if(s.dr==='A') s.A=v; else { s.B=s.p.m==='s'?[v[0]-s.A[0],v[1]-s.A[1]]:[s.A[0]-v[0],s.A[1]-v[1]]; } } },
  draw(g,s){ const {u,O,P}=s.def.geo(s); const A=s.A,B=s.p.m==='s'?s.B:[-s.B[0],-s.B[1]],Rv=[A[0]+B[0],A[1]+B[1]];
    for(let x=O[0]%u;x<g.W;x+=u) g.line(x,0,x,g.H,COL.line,.6); for(let y=O[1]%u;y<g.H;y+=u) g.line(0,y,g.W,y,COL.line,.6);
    g.line(0,O[1],g.W,O[1],COL.muted,1.2); g.line(O[0],0,O[0],g.H,COL.muted,1.2); g.text('x',g.W-12,O[1]-6,{c:COL.muted}); g.text('y',O[0]+6,12,{c:COL.muted});
    const pr=P(Rv); g.line(pr[0],pr[1],pr[0],O[1],COL.acc,1.2,[4,4]); g.line(pr[0],pr[1],O[0],pr[1],COL.acc,1.2,[4,4]);
    g.arrow(O[0],O[1],pr[0],pr[1],COL.acc,'R',3.5);
    const pa=P(A); g.arrow(O[0],O[1],pa[0],pa[1],COL.vel,'A',3.5);
    const pb=P([A[0]+B[0],A[1]+B[1]]); g.arrow(pa[0],pa[1],pb[0],pb[1],COL.force,s.p.m==='s'?'B':'−B',3.5);
    g.circle(pa[0],pa[1],7,null,COL.vel,2); g.circle(pb[0],pb[1],7,null,COL.force,2);
    g.text('arraste as bolinhas nas pontas',10,20,{c:COL.muted,size:12.5}); },
  reads:s=>{ const B=s.p.m==='s'?s.B:[-s.B[0],-s.B[1]], Rv=[s.A[0]+B[0],s.A[1]+B[1]], m=v=>nt(Math.hypot(v[0],v[1])), ang=v=>nt(Math.atan2(v[1],v[0])*180/Math.PI,3)+'°';
    return [['A = (Aₓ, A<sub>y</sub>)',`(${nt(s.A[0])}, ${nt(s.A[1])}) · módulo ${m(s.A)}`],['B',`(${nt(s.B[0])}, ${nt(s.B[1])}) · módulo ${m(s.B)}`],['R (componentes somadas)',`(${nt(Rv[0])}, ${nt(Rv[1])})`],['Módulo de R',m(Rv)],['Ângulo de R com o eixo x',ang(Rv)]]; }});

/* trabalho de uma força inclinada */
SIMS.work=(host)=>Sim(host,{alt:'Caixa puxada por uma corda inclinada; só a componente horizontal realiza trabalho',anim:true,h:260,
  legend:[['force','força F'],['vel','Fₓ = F·cos θ (realiza trabalho)'],['muted','F_y (não realiza trabalho)']],
  ctrls:[{k:'F',l:'Força F',min:0,max:50,step:1,v:20,u:'N'},{k:'th',l:'Ângulo da corda θ',min:0,max:90,step:5,v:30,u:'°'},{k:'d',l:'Distância d',min:1,max:10,step:1,v:5,u:'m'}],
  init(s){ s.x=0; s.v=0; },
  step(s,dt){ const m=2, a=s.p.F*Math.cos(s.p.th*Math.PI/180)/m; s.v+=a*dt; s.x=Math.min(s.p.d,s.x+s.v*dt); if(s.x>=s.p.d||a<=0) s.play(false); },
  done:s=>s.x>=s.p.d,
  draw(g,s){ const th=s.p.th*Math.PI/180, y=g.H-50, x0=40, k=(g.W-160)/10, bx=x0+s.x*k;
    g.ground(y); g.line(x0,y+22,x0+s.p.d*k,y+22,COL.muted,1.5); g.line(x0,y+16,x0,y+28,COL.muted,1.5); g.line(x0+s.p.d*k,y+16,x0+s.p.d*k,y+28,COL.muted,1.5); g.text('d = '+s.p.d+' m',x0+s.p.d*k/2,y+40,{size:12,c:COL.muted,align:'center'});
    g.rect(bx,y-44,60,44,COL.sunk,COL.ink,6); g.text('2 kg',bx+30,y-17,{size:12,align:'center',bold:true});
    const ox=bx+60, oy=y-30, L=clamp(s.p.F*3.2,0,150); g.arrow(ox,oy,ox+L*Math.cos(th),oy-L*Math.sin(th),COL.force,'F',3);
    g.arrow(ox,oy,ox+L*Math.cos(th),oy,COL.vel,'Fₓ',2.5); g.line(ox+L*Math.cos(th),oy,ox+L*Math.cos(th),oy-L*Math.sin(th),COL.muted,1.5,[4,4]);
    const W=s.p.F*Math.cos(th)*s.x, Wm=Math.max(1,s.p.F*s.p.d); g.rect(g.W-40,30,18,y-60,COL.sunk,COL.line,4,1); const hh=(y-60)*clamp(W/Wm,0,1); g.rect(g.W-40,y-30-hh,18,hh,COL.energy,null,4); g.text('W',g.W-31,22,{size:12,align:'center',c:COL.muted}); },
  reads:s=>{ const th=s.p.th*Math.PI/180, Fx=s.p.F*Math.cos(th), W=Fx*s.p.d, a=Fx/2, t=a>0?Math.sqrt(2*s.p.d/a):Infinity; return [['Fₓ = F·cos θ',nt(Fx)+' N'],['Trabalho W = F·d·cos θ',nt(W)+' J'],['Trabalho feito até agora',nt(Fx*s.x)+' J'],['Tempo gasto (sem atrito, 2 kg)',isFinite(t)?nt(t)+' s':'—'],['Potência média W/Δt',isFinite(t)?nt(W/t)+' W':'—']]; }});

/* pista em U: energia cinética, potencial e térmica */
SIMS.ramp=(host,cfg)=>Sim(host,{alt:'Skatista numa pista em U com barras de energia',anim:true,h:320,sub:8,
  legend:[['vel','cinética'],['acc','potencial'],['force','térmica (dissipada)']],
  ctrls:[{k:'h0',l:'Altura de partida',min:2,max:10,step:.5,v:8,u:'m'},{k:'m',l:'Massa',min:30,max:90,step:5,v:60,u:'kg'}].concat(cfg.fric?[{k:'mu',l:'Atrito',min:0,max:.3,step:.02,v:.06}]:[]),
  init(s){ const L=10,Hm=10; s.L=L; s.Hm=Hm; s.x=-L*Math.sqrt(s.p.h0/Hm); s.v=0; s.E0=s.p.m*GRAV*s.p.h0; s.stopped=false; },
  yx:(s,x)=>s.Hm*(x/s.L)**2,
  step(s,dt){ if(s.stopped) return; const mu=s.p.mu||0, sl=2*s.Hm*s.x/s.L**2, ph=Math.atan(sl), sn=Math.sin(ph), cs=Math.cos(ph);
    let a=-GRAV*sn; if(Math.abs(s.v)>1e-3) a-=Math.sign(s.v)*mu*GRAV*cs; else if(Math.abs(sn)<=mu*cs){ s.v=0; s.stopped=true; s.play(false); return; } else a-=Math.sign(-sn)*mu*GRAV*cs;
    const v0=s.v; s.v+=a*dt; if(mu>0&&v0!==0&&Math.sign(s.v)!==Math.sign(v0)) s.v=0; s.x=clamp(s.x+s.v*cs*dt,-s.L,s.L); if(s.t>40) s.play(false); },
  draw(g,s){ const L=s.L, W=g.W*.68, x0=18, base=g.H-24, k=Math.min(W/(2*L),(base-30)/s.Hm), X=x=>x0+(x+L)*k, Y=y=>base-y*k;
    const pts=[]; for(let x=-L;x<=L+1e-9;x+=L/40) pts.push([X(x),Y(s.def.yx(s,x))]); g.poly(pts,COL.ink,3);
    g.line(X(-L)-4,Y(s.p.h0),X(-L)+60,Y(s.p.h0),COL.muted,1,[4,4]); g.text('h₀',X(-L)+64,Y(s.p.h0)+4,{size:12,c:COL.muted});
    const y=s.def.yx(s,s.x), sl=2*s.Hm*s.x/L**2, nx=-sl/Math.hypot(1,sl), ny=1/Math.hypot(1,sl); g.circle(X(s.x)+nx*9,Y(y)-ny*9,9,COL.force);
    const Ep=s.p.m*GRAV*y, Ec=.5*s.p.m*s.v*s.v, Et=Math.max(0,s.E0-Ep-Ec), bx=g.W*.74, bw=(g.W-bx-16)/4-6, bh=g.H-70, E0=s.E0;
    [[Ec,COL.vel,'Ec'],[Ep,COL.acc,'Ep'],[Et,COL.force,'Térm.'],[E0,COL.ink,'Total']].forEach(([v,c,l],i)=>{ const x=bx+i*(bw+6), h=bh*v/E0; g.rect(x,30,bw,bh,COL.sunk,null,4); g.rect(x,30+bh-h,bw,h,c,null,4); g.text(l,x+bw/2,g.H-22,{size:11,align:'center',c:COL.muted}); }); },
  reads:s=>{ const y=s.def.yx(s,s.x), Ep=s.p.m*GRAV*y, Ec=.5*s.p.m*s.v*s.v; return [['Altura',nt(y)+' m'],['Velocidade',nt(Math.abs(s.v))+' m/s'],['Energia cinética ½mv²',nt(Ec)+' J'],['Energia potencial mgh',nt(Ep)+' J'],['Energia mecânica Ec + Ep',nt(Ec+Ep)+' J'].concat([])].concat(cfg.fric?[['Energia virou calor',nt(Math.max(0,s.E0-Ec-Ep))+' J']]:[]); }});

/* impulso: a área do gráfico F×t muda a quantidade de movimento */
SIMS.impulse=(host)=>Sim(host,{alt:'Chute numa bola: gráfico da força no tempo e a velocidade final',anim:true,h:300,
  legend:[['force','força durante o contato'],['energy','área = impulso']],
  ctrls:[{k:'F',l:'Força máxima',min:100,max:2000,step:50,v:800,u:'N'},{k:'dt',l:'Tempo de contato',min:.005,max:.05,step:.005,v:.02,u:'s',f:v=>nsig(v*1000,3)+' ms'},{k:'m',l:'Massa da bola',min:.2,max:1,step:.05,v:.45,u:'kg'}],
  init(s){ s.x=0; s.ph=0; },
  step(s,dt){ s.ph+=dt; if(s.ph>1) s.x+=s.def.vf(s)*dt*.12; if(s.x>60) s.play(false); },
  vf:s=>.5*s.p.F*s.p.dt/s.p.m, done:s=>s.x>60,
  draw(g,s){ const w=Math.min(g.W*.52,380), x=46, y=24, h=g.H-80, I=.5*s.p.F*s.p.dt, frac=clamp(s.ph,0,1);
    const tri=[[0,0],[s.p.dt/2,s.p.F],[s.p.dt,0]].map(p=>p), pts=[]; for(let i=0;i<=40*frac;i++){ const t=i/40*s.p.dt; pts.push([t*1000,t<=s.p.dt/2?2*s.p.F*t/s.p.dt:2*s.p.F*(1-t/s.p.dt)]); }
    g.plot(x,y,w,h,{xr:[0,50],yr:[0,2000],series:[{pts,c:COL.force,fill:COL.energy+'55',dot:frac<1}],xl:'t (ms)',yl:'força (N)'});
    const bx=x+w+30+Math.min(s.x*4,g.W-x-w-60), by=g.H-60; g.ground(by+14); g.circle(bx,by,14,COL.card,COL.ink,2.5);
    if(frac>=1) g.arrow(bx+16,by-26,bx+16+clamp(s.def.vf(s)*2,10,90),by-26,COL.vel,'v',3);
    g.text('I = área = '+nt(I)+' N·s',x+w/2,y+20,{size:14,bold:true,align:'center'}); },
  reads:s=>{ const I=.5*s.p.F*s.p.dt; return [['Impulso I = área do gráfico',nt(I)+' N·s'],['Força média (metade da máxima)',nt(s.p.F/2)+' N'],['Quantidade de movimento final Q = I',nt(I)+' kg·m/s'],['Velocidade final v = Q/m',nt(I/s.p.m)+' m/s'],['Em km/h',nt(I/s.p.m*3.6)+' km/h']]; }});

/* colisões em uma dimensão */
SIMS.coll=(host)=>Sim(host,{alt:'Dois carrinhos que colidem, com barras de quantidade de movimento e energia',anim:true,h:300,
  legend:[['vel','carrinho 1'],['force','carrinho 2'],['acc','total']],
  ctrls:[{k:'m1',l:'Massa 1',min:1,max:5,step:.5,v:2,u:'kg'},{k:'v1',l:'Velocidade 1',min:-4,max:8,step:1,v:5,u:'m/s'},{k:'m2',l:'Massa 2',min:1,max:5,step:.5,v:2,u:'kg'},{k:'v2',l:'Velocidade 2',min:-6,max:4,step:1,v:0,u:'m/s'},{k:'e',l:'Coeficiente de restituição e',min:0,max:1,step:.1,v:1,f:v=>nsig(v,2)+(v===1?' (elástica)':v===0?' (grudam)':'')}],
  init(s){ s.x1=-5; s.x2=1.5; s.u1=s.p.v1; s.u2=s.p.v2; s.hit=false; },
  step(s,dt){ s.x1+=s.u1*dt; s.x2+=s.u2*dt; const w1=.5+s.p.m1*.12, w2=.5+s.p.m2*.12;
    if(!s.hit&&s.x1+w1/2>=s.x2-w2/2&&s.u1>s.u2){ s.hit=true; const {m1,m2,e}=s.p, Q=m1*s.u1+m2*s.u2, d=s.u1-s.u2; s.u1=(Q-m2*e*d)/(m1+m2); s.u2=(Q+m1*e*d)/(m1+m2); }
    if(s.t>6||Math.abs(s.x1)>14&&Math.abs(s.x2)>14) s.play(false); },
  done:s=>s.t>6,
  draw(g,s){ const y=90, k=g.W/24, X=x=>g.W/2+x*k, w1=(.5+s.p.m1*.12)*k, w2=(.5+s.p.m2*.12)*k; g.ground(y+16);
    g.rect(X(s.x1)-w1/2,y-26,w1,30,COL.vel,null,6); g.text(nt(s.p.m1)+' kg',X(s.x1),y-6,{size:12,bold:true,align:'center',c:COL.card});
    g.rect(X(s.x2)-w2/2,y-26,w2,30,COL.force,null,6); g.text(nt(s.p.m2)+' kg',X(s.x2),y-6,{size:12,bold:true,align:'center',c:COL.card});
    [[s.x1,s.u1,COL.vel],[s.x2,s.u2,COL.force]].forEach(([x,u,c])=>{ if(Math.abs(u)>.05) g.arrow(X(x),y-36,X(x)+u*9,y-36,c,null,2.5); });
    const Q0=[s.p.m1*s.p.v1,s.p.m2*s.p.v2], Q=[s.p.m1*s.u1,s.p.m2*s.u2], E0=.5*s.p.m1*s.p.v1**2+.5*s.p.m2*s.p.v2**2, E=.5*s.p.m1*s.u1**2+.5*s.p.m2*s.u2**2, top=150, mid=g.W/2, qs=Math.max(1,Math.abs(Q0[0])+Math.abs(Q0[1]),Math.abs(Q[0])+Math.abs(Q[1]));
    g.text('quantidade de movimento Q = m·v',16,top,{size:12.5,c:COL.muted}); g.line(mid*.5,top+10,mid*.5,top+86,COL.line,1);
    [[Q[0],COL.vel],[Q[1],COL.force],[Q[0]+Q[1],COL.acc]].forEach(([q,c],i)=>{ const yy=top+18+i*24, ww=q/qs*mid*.45; g.rect(Math.min(mid*.5,mid*.5+ww),yy,Math.abs(ww),16,c,null,3); });
    g.text('energia cinética',mid+16,top,{size:12.5,c:COL.muted}); const es=Math.max(E0,1); g.rect(mid+16,top+18,(g.W-mid-40)*E0/es,16,COL.line,null,3); g.rect(mid+16,top+42,(g.W-mid-40)*E/es,16,COL.energy,null,3); g.text('antes',mid+20,top+30,{size:11}); g.text('agora',mid+20,top+54,{size:11}); },
  reads:s=>{ const Q0=s.p.m1*s.p.v1+s.p.m2*s.p.v2, Q=s.p.m1*s.u1+s.p.m2*s.u2, E0=.5*s.p.m1*s.p.v1**2+.5*s.p.m2*s.p.v2**2, E=.5*s.p.m1*s.u1**2+.5*s.p.m2*s.u2**2;
    return [['Q total antes',nt(Q0)+' kg·m/s'],['Q total agora',nt(Q)+' kg·m/s'],['Energia cinética antes → agora',nt(E0)+' → '+nt(E)+' J'],['Velocidades agora',nt(s.u1)+' e '+nt(s.u2)+' m/s'],['Colisão',s.p.v1<=s.p.v2?'não acontece (o 1 não alcança o 2)':s.p.e===1?'elástica: conserva a energia':s.p.e===0?'perfeitamente inelástica: saem juntos':'parcialmente elástica']]; }});

/* órbitas: leis de Kepler */
SIMS.orbit=(host)=>Sim(host,{alt:'Planeta orbitando uma estrela; áreas varridas em tempos iguais',anim:true,autoplay:false,h:340,sub:20,speed:1.6,
  legend:[['energy','estrela'],['vel','planeta'],['acc','áreas varridas em intervalos iguais de tempo']],
  ctrls:[{k:'v',l:'Velocidade inicial (1 = órbita circular)',min:.6,max:1.5,step:.05,v:.8,f:v=>nsig(v,3)+' × v<sub>circ</sub>'.replace(/<[^>]+>/g,'')},{k:'ar',l:'Mostrar áreas',opts:[[1,'sim'],[0,'não']],v:1,live:true}],
  init(s){ s.r=[1,0]; s.u=[0,s.p.v]; s.tr=[[1,0]]; s.marks=[[1,0]]; s.acc=0; const v=s.p.v; s.esc=v*v>=2; if(!s.esc){ s.a=1/(2-v*v); s.other=2*s.a-1; s.Tp=2*Math.PI*s.a**1.5; s.dtM=s.Tp/12; } else { s.dtM=.6; } },
  step(s,dt){ const r=Math.hypot(s.r[0],s.r[1]), a=[-s.r[0]/r**3,-s.r[1]/r**3]; s.u[0]+=a[0]*dt; s.u[1]+=a[1]*dt; s.r[0]+=s.u[0]*dt; s.r[1]+=s.u[1]*dt;
    s.tr.push(s.r.slice()); if(s.tr.length>4000) s.tr.shift(); s.acc+=dt; if(s.acc>=s.dtM){ s.acc-=s.dtM; s.marks.push(s.r.slice()); if(s.marks.length>13) s.marks.shift(); } if(s.esc&&r>8) s.play(false); },
  draw(g,s){ const xmin=s.esc?-2:-s.other, xmax=s.esc?6:1, b=s.esc?3:s.a*Math.sqrt(1-((s.a-1)/s.a)**2), cx0=(xmin+xmax)/2, k=Math.min((g.W-40)/(xmax-xmin),(g.H-40)/(2*Math.max(b,.3))), X=x=>g.W/2+(x-cx0)*k, Y=y=>g.H/2-y*k;
    if(s.p.ar){ for(let i=0;i+1<s.marks.length;i++){ const a=s.marks[i],bb=s.marks[i+1]; g.poly([[X(0),Y(0)],[X(a[0]),Y(a[1])],[X(bb[0]),Y(bb[1])]],null,0,i%2?COL.acc+'40':COL.acc+'22',true); } }
    g.poly(s.tr.map(p=>[X(p[0]),Y(p[1])]),COL.line,1.5); g.circle(X(0),Y(0),12,COL.energy); g.circle(X(s.r[0]),Y(s.r[1]),6,COL.vel);
    const sp=Math.hypot(s.u[0],s.u[1]); g.arrow(X(s.r[0]),Y(s.r[1]),X(s.r[0])+s.u[0]/sp*clamp(sp*30,12,60),Y(s.r[1])-s.u[1]/sp*clamp(sp*30,12,60),COL.vel,null,2.5); },
  reads:s=>{ const r=Math.hypot(s.r[0],s.r[1]), sp=Math.hypot(s.u[0],s.u[1]); return [['Distância à estrela',nt(r)+' (raio inicial = 1)'],['Velocidade',nt(sp)+' × v<sub>circ</sub>'],['Órbita',s.esc?'aberta: o planeta escapa':Math.abs(s.p.v-1)<.01?'circular':'elíptica (a estrela fica num foco)'],['Mais perto → mais rápido',s.esc?'—':`no periélio: ${nt(Math.max(s.p.v,1/s.p.v*(2-s.p.v*s.p.v>0?1:1)))}`]].slice(0,3).concat(s.esc?[]:[['Período (cresce com a órbita)',nt(s.Tp/(2*Math.PI))+' × o da órbita circular']]); }});
