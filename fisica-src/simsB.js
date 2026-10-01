/* =====================================================================
   Laboratórios com cenário: termologia
   ===================================================================== */
const tempCol=T=>{ const f=clamp(T/100,0,1); return f<.5?mix('#3b82f6','#a855f7',f*2):mix('#a855f7','#ef4444',(f-.5)*2); };

/* termômetros de vidro: Celsius, Fahrenheit e Kelvin */
SIMS.temp=(host,cfg={})=>Sim(host,{alt:'Três termômetros de vidro nas escalas Celsius, Fahrenheit e Kelvin',h:340,
  ctrls:[{k:'C',l:'Temperatura',min:-273,max:200,step:1,v:cfg.C??37,u:'°C',live:true}],
  draw(g,s){ const C=s.p.C, sc=[['Celsius','°C',C,-273.15,200],['Fahrenheit','°F',C*1.8+32,-459.67,392],['Kelvin','K',C+273.15,0,473.15]], top=46, bot=g.H-58, w=g.W/3;
    const bg=g.ctx.createLinearGradient(0,0,g.W,0); bg.addColorStop(0,alpha(tempCol(C),.10)); bg.addColorStop(1,alpha(tempCol(C),.22)); g.rect(0,0,g.W,g.H,bg);
    const marks=[[-273.15,'zero absoluto'],[0,'gelo derrete'],[37,'corpo humano'],[100,'água ferve']];
    sc.forEach(([n,u,v,lo,hi],i)=>{ const cx=w*i+w/2, Y=x=>bot-(x-lo)/(hi-lo)*(bot-top);
      const glass=g.ctx.createLinearGradient(cx-11,0,cx+11,0); glass.addColorStop(0,alpha('#ffffff',.5)); glass.addColorStop(.5,alpha('#ffffff',.9)); glass.addColorStop(1,alpha('#ffffff',.45));
      g.rect(cx-11,top-8,22,bot-top+16,isDark()?'#2a3442':glass,COL.ink,11,1.5); g.circle(cx,bot+16,17,'#e5484d',COL.ink,1.5); g.circle(cx-5,bot+11,4,alpha('#ffffff',.6));
      g.rect(cx-5,Y(v),10,bot-Y(v)+12,'#e5484d',null,4);
      marks.forEach(([mc,lab])=>{ const mv=i===0?mc:i===1?mc*1.8+32:mc+273.15, yy=Y(mv); g.line(cx+12,yy,cx+24,yy,COL.ink,1.2); g.text(nt(mv,4),cx+27,yy+4,{size:10.5,c:COL.ink,mono:true}); if(i===0) g.text(lab,cx-16,yy+4,{size:10.5,c:COL.muted,align:'right'}); });
      g.text(n,cx,22,{size:13.5,bold:true,align:'center'}); g.tag(nt(v,4)+' '+u,cx,g.H-14,'#e5484d','center',15); });
    const sit=C<=-273?'zero absoluto':C<0?'gelo':C<15?'frio':C<30?'agradável':C<36?'calor':C<=38?'temperatura do corpo':C<42?'febre':C<100?'muito quente':'água fervendo ou mais'; g.tag(sit,g.W/2,g.H*.5,COL.ink,'center',12.5); },
  reads:s=>[['Celsius',nt(s.p.C,4)+' °C'],['Fahrenheit = 1,8·C + 32',nt(s.p.C*1.8+32,4)+' °F'],['Kelvin = C + 273',nt(s.p.C+273.15,5)+' K'],['Variação: 1 °C equivale a','1,8 °F e 1 K']]});

/* dilatação: trilho de trem ao sol (alongamento exagerado) */
const MAT=[[12e-6,'aço'],[23e-6,'alumínio'],[17e-6,'cobre'],[9e-6,'vidro']];
SIMS.dilat=(host,cfg={})=>Sim(host,{alt:'Trilho de trem que se alonga quando aquecido pelo sol (desenho exagerado)',h:280,
  ctrls:[{k:'al',l:'Material',opts:MAT.map(x=>[x[0],x[1]]),v:cfg.al??12e-6,live:true},{k:'L0',l:'Comprimento inicial',min:1,max:100,step:1,v:cfg.L0??20,u:'m',live:true},{k:'dT',l:'Aquecimento ΔT',min:0,max:200,step:5,v:cfg.dT??50,u:'°C',live:true}],
  draw(g,s){ const dL=s.p.L0*s.p.al*s.p.dT, x0=30, W=g.W-60, base=W*.72, ex=dL/s.p.L0*500, hot=clamp(s.p.dT/200,0,1), y1=96, y2=196;
    SK.sky(g,g.H); g.rect(0,0,g.W,g.H,alpha('#ff9a3c',hot*.18));
    const sx=g.W-60, sy=44; g.circle(sx,sy,16+hot*10,`rgba(255,200,60,${.4+hot*.6})`); g.circle(sx,sy,12+hot*6,'#ffd866');
    const rail=(y,len,lab,col)=>{ g.rect(x0-10,y+8,len+60,22,isDark()?'#5b4a36':'#b89a72'); for(let x=x0;x<x0+len+40;x+=26) g.rect(x,y+4,10,22,isDark()?'#6b4f33':'#7a5a3a',null,2); g.rect(x0,y-4,len,12,col,mix(col,'#000',.4),3,1.5); g.rect(x0,y-4,len,4,alpha('#ffffff',.4),null,2); g.text(lab,x0,y-14,{size:12,c:COL.ink,bold:true}); };
    rail(y1,base,'frio',isDark()?'#9aa6b6':'#7b8696'); rail(y2,base*(1+ex),'aquecido em '+s.p.dT+' °C (alongamento exagerado 500 vezes)',mix('#7b8696','#e5484d',hot*.6));
    g.line(x0+base,y1-20,x0+base,y2+30,COL.muted,1,[4,4]); if(ex>0) g.arrow(x0+base,y2+40,x0+base*(1+ex),y2+40,COL.force,'ΔL',2);
    g.tag('ΔL = '+nt(dL*1000)+' mm',g.W/2,g.H-16,COL.force,'center',15); },
  reads:s=>{ const dL=s.p.L0*s.p.al*s.p.dT; return [['Coeficiente α',nf(s.p.al)+' °C<sup>−1</sup>'],['ΔL = L₀·α·ΔT',nt(dL*1000)+' mm'],['Comprimento final',nt(s.p.L0+dL,6)+' m'],['Aumento percentual',nt(dL/s.p.L0*100)+' %']]; }});

/* calorimetria: dois corpos dentro de uma caixa de isopor */
SIMS.calor=(host,cfg={})=>Sim(host,{alt:'Água quente e um corpo frio dentro de uma caixa de isopor, trocando calor até a mesma temperatura',anim:true,h:320,
  legend:[['force','corpo quente'],['vel','corpo frio']],
  ctrls:[{k:'m1',l:'Massa de água quente',min:100,max:1000,step:50,v:cfg.m1??200,u:'g'},{k:'T1',l:'Temperatura da água quente',min:40,max:100,step:5,v:cfg.T1??80,u:'°C'},{k:'c2',l:'Corpo frio',opts:[[1,'água (c = 1)'],[.11,'ferro (c = 0,11)'],[.22,'alumínio (c = 0,22)']],v:cfg.c2??1},{k:'m2',l:'Massa do corpo frio',min:100,max:1000,step:50,v:cfg.m2??300,u:'g'},{k:'T2',l:'Temperatura do corpo frio',min:0,max:35,step:5,v:cfg.T2??20,u:'°C'}],
  init(s){ s.a=s.p.T1; s.b=s.p.T2; s.ta=[[0,s.a]]; s.tb=[[0,s.b]]; s.Te=(s.p.m1*s.p.T1+s.p.m2*s.p.c2*s.p.T2)/(s.p.m1+s.p.m2*s.p.c2); },
  step(s,dt){ const C1=s.p.m1, C2=s.p.m2*s.p.c2, q=(s.a-s.b)*120*dt; s.a-=q/C1; s.b+=q/C2; s.ta.push([s.t+dt,s.a]); s.tb.push([s.t+dt,s.b]); if(s.t>10) s.play(false); },
  done:s=>s.t>10,
  draw(g,s){ const narrow=g.W<560, bw=narrow?g.W-30:Math.min(320,g.W*.44), x0=15, y0=24, bh=narrow?150:g.H-50;
    g.rect(x0,y0,bw,bh,isDark()?'#d8dde4':'#f4f6f8',isDark()?'#aab3c0':'#c9ced6',14,3); for(let i=0;i<40;i++) g.circle(x0+8+(i*37)%(bw-16),y0+8+(i*23)%(bh-16),1.6,alpha('#9aa3ad',.5));
    g.text('caixa de isopor (isolada)',x0+bw/2,y0+bh-8,{size:10.5,align:'center',c:'#5b6472'});
    const gw=(bw-60)/2, gy=y0+30, gh=bh-60;
    g.rect(x0+20,gy+gh*.2,gw,gh*.8,tempCol(s.a),mix(tempCol(s.a),'#000',.3),8,2); g.rect(x0+20,gy,gw,gh,null,'#7b8696',8,2);
    if(s.a>45) for(let i=0;i<3;i++){ const sx=x0+20+gw*(.25+i*.25), ph=(s.t*1.5+i*.4)%1; g.ctx.save(); g.ctx.globalAlpha=(1-ph)*.5*clamp((s.a-45)/40,0,1); g.circle(sx+6*Math.sin(ph*6),gy+gh*.15-ph*24,5+ph*4,'#ffffff'); g.ctx.restore(); }
    const metal=s.p.c2!==1, bx=x0+40+gw; if(metal){ const mc=s.p.c2<.2?'#7b8696':'#b9c2cc'; g.rect(bx,gy+gh*.45,gw,gh*.55,mix(mc,tempCol(s.b),.35),mix(mc,'#000',.4),6,2); g.rect(bx+6,gy+gh*.48,gw*.4,6,alpha('#ffffff',.5),null,3); }
    else { g.rect(bx,gy+gh*.2,gw,gh*.8,tempCol(s.b),mix(tempCol(s.b),'#000',.3),8,2); g.rect(bx,gy,gw,gh,null,'#7b8696',8,2); }
    g.tag(nt(s.a,3)+' °C',x0+20+gw/2,gy+gh*.55,COL.ink,'center',14); g.tag(nt(s.b,3)+' °C',bx+gw/2,gy+gh*.72,COL.ink,'center',14);
    g.text('água quente',x0+20+gw/2,gy-6,{size:11.5,bold:true,align:'center',c:'#2b3340'}); g.text(s.p.c2===1?'água fria':s.p.c2<.2?'ferro':'alumínio',bx+gw/2,gy-6,{size:11.5,bold:true,align:'center',c:'#2b3340'});
    if(Math.abs(s.a-s.b)>.5) g.arrow(x0+20+gw-6,gy+gh*.7,bx+8,gy+gh*.7,COL.energy,'calor',3);
    const px=narrow?50:x0+bw+56, py=narrow?y0+bh+30:y0, pw=narrow?g.W-70:g.W-px-20, ph=narrow?g.H-py-40:g.H-70;
    if(pw>80&&ph>50){ const r=g.plot(px,py,pw,ph,{xr:[0,10],yr:[0,100],series:[{pts:s.ta,c:COL.force,dot:true},{pts:s.tb,c:COL.vel,dot:true}],xl:'tempo',yl:'temperatura (°C)'}); g.line(r.X(0),r.Y(s.Te),r.X(10),r.Y(s.Te),COL.muted,1,[5,5]); g.tag('equilíbrio '+nt(s.Te,3)+' °C',r.X(10)-4,r.Y(s.Te)-12,COL.ink,'right',11); } },
  reads:s=>{ const Te=s.Te; return [['Temperatura de equilíbrio',nt(Te,3)+' °C'],['Calor cedido pela água quente m·c·ΔT',nt(s.p.m1*(s.p.T1-Te),3)+' cal'],['Calor recebido pelo corpo frio',nt(s.p.m2*s.p.c2*(Te-s.p.T2),3)+' cal'],['Capacidade térmica m·c (quente | frio)',nt(s.p.m1)+' | '+nt(s.p.m2*s.p.c2)+' cal/°C']]; }});

/* curva de aquecimento: panela no fogão, do gelo ao vapor */
SIMS.phase=(host,cfg={})=>Sim(host,{alt:'Panela no fogão com gelo que derrete, ferve e vira vapor, e o gráfico da temperatura pelo calor recebido',anim:true,h:w=>w<560?440:340,
  ctrls:[{k:'m',l:'Massa de gelo',min:50,max:500,step:50,v:cfg.m??100,u:'g'},{k:'P',l:'Potência do fogão',min:1,max:4,step:.5,v:2,f:v=>nsig(v,2)+'×'}],
  segs(m){ return [[m*.5*20,'aquecendo o gelo'],[m*80,'derretendo (0 °C)'],[m*1*100,'aquecendo a água'],[m*540,'fervendo (100 °C)'],[m*.5*20,'aquecendo o vapor']]; },
  TofQ(s,Q){ const S=s.def.segs(s.p.m); let q=Q; const T0=[-20,0,0,100,100], k=[.5*s.p.m,0,s.p.m,0,.5*s.p.m];
    for(let i=0;i<5;i++){ if(q<=S[i][0]||i===4) return {T:k[i]?T0[i]+Math.min(q,S[i][0])/k[i]:T0[i],phase:S[i][1],i,frac:q/S[i][0]}; q-=S[i][0]; } },
  init(s){ s.Q=0; s.tot=s.def.segs(s.p.m).reduce((a,b)=>a+b[0],0); s.pts=[[0,-20]]; },
  step(s,dt){ s.Q=Math.min(s.tot,s.Q+s.tot/24*s.p.P*dt); s.pts.push([s.Q/1000,s.def.TofQ(s,s.Q).T]); if(s.Q>=s.tot) s.play(false); },
  done:s=>s.Q>=s.tot,
  draw(g,s){ const st=s.def.TofQ(s,s.Q), narrow=g.W<560, sw=narrow?g.W:Math.min(260,g.W*.32), sh=narrow?200:g.H, cx=sw/2, py=sh-70, pw=Math.min(150,sw*.6);
    g.rect(0,0,sw,sh,isDark()?mix(COL.paper,'#3a3f48',.5):'#eef1f4'); g.rect(cx-pw/2-20,py+26,pw+40,sh-py-26,isDark()?'#2a2f37':'#c9ced6');
    for(let i=0;i<7;i++){ const fx=cx-pw*.4+i*pw*.8/6, fh=(8+s.p.P*5)*(0.75+.25*Math.sin(s.t*12+i*1.7)); g.poly([[fx-6,py+26],[fx,py+26-fh],[fx+6,py+26]],null,0,s.playing?(i%2?'#ff9f43':'#ffcc4d'):alpha('#ff9f43',.25),true); }
    g.rect(cx-pw/2,py-70,pw,74,isDark()?'#9aa3ad':'#7b8696',mix('#7b8696','#000',.4),8,2); g.rect(cx-pw/2-12,py-62,12,6,'#3a3f48',null,2); g.rect(cx+pw/2,py-62,12,6,'#3a3f48',null,2);
    const liq=st.i>=1?(st.i===1?st.frac:1):0, vapor=st.i>=3?(st.i===3?st.frac:1):0, lvl=(1-vapor)*48;
    if(liq>0&&lvl>0){ g.rect(cx-pw/2+4,py-4-lvl,pw-8,lvl,alpha('#4f9cff',.8),null,5); }
    const ice=st.i<1?1:st.i===1?1-st.frac:0; for(let i=0;i<5;i++){ if(i/5>=ice) continue; const ix=cx-pw/2+14+i*(pw-36)/4, iy=py-24-(liq>0?lvl*.4:0); g.rect(ix,iy,16,16,alpha('#dff3ff',.95),'#8cc8ee',3,1.5); }
    if(st.i>=3&&st.i<5) for(let i=0;i<8;i++){ const ph=(s.t*1.3+i*.13)%1; g.circle(cx-pw/2+12+(i*29)%(pw-24),py-4-lvl*(ph),2+ph*2,alpha('#ffffff',.8)); }
    if(st.i>=3) for(let i=0;i<4;i++){ const ph=(s.t*.8+i*.25)%1; g.ctx.save(); g.ctx.globalAlpha=(1-ph)*.6; g.circle(cx-pw*.3+i*pw*.2+8*Math.sin(ph*5),py-80-ph*60,8+ph*10,'#ffffff'); g.ctx.restore(); }
    g.tag(nt(st.T,3)+' °C',cx,24,COL.force,'center',16); g.tag(st.phase,cx,52,COL.ink,'center',12);
    const px=narrow?50:sw+56, pY=narrow?sh+16:26, pW=narrow?g.W-70:g.W-px-20, pH=narrow?g.H-sh-58:g.H-74;
    const r=g.plot(px,pY,pW,pH,{xr:[0,s.tot/1000],yr:[-30,130],series:[{pts:s.pts,c:COL.force,dot:true}],xl:'calor recebido (kcal)',yl:'temperatura (°C)'});
    let acc=0; s.def.segs(s.p.m).forEach((sg,i)=>{ acc+=sg[0]; if(i<4) g.line(r.X(acc/1000),pY,r.X(acc/1000),pY+pH,COL.line,1,[3,3]); }); },
  reads:s=>{ const S=s.def.segs(s.p.m), st=s.def.TofQ(s,s.Q); return [['Calor recebido até agora',nt(s.Q)+' cal'],['Fase',st.phase],['Derreter todo o gelo: m·L<sub>f</sub>',nt(S[1][0])+' cal'],['Ferver toda a água: m·L<sub>v</sub>',nt(S[3][0])+' cal']]; }});

/* gás num cilindro com pistão, chama e manômetro */
SIMS.gas=(host,cfg={})=>Sim(host,{alt:'Partículas de gás num cilindro com pistão sobre uma chama, com manômetro e o diagrama pressão × volume',anim:true,autoplay:true,h:340,
  legend:[['force','isoterma da temperatura atual'],['vel','estado do gás']],
  ctrls:[{k:'T',l:'Temperatura',min:100,max:600,step:10,v:cfg.T??300,u:'K',live:true},{k:'V',l:'Volume',min:2,max:10,step:.5,v:cfg.V??5,u:'L',live:true}],
  init(s){ s.pt=[]; for(let i=0;i<46;i++){ const a=Math.random()*Math.PI*2; s.pt.push({x:Math.random(),y:Math.random(),vx:Math.cos(a),vy:Math.sin(a)}); } },
  step(s,dt){ const sp=.35*Math.sqrt(s.p.T/300), hf=s.p.V/10; s.pt.forEach(p=>{ p.x+=p.vx*sp*dt; p.y+=p.vy*sp*dt/hf; if(p.x<0){p.x=-p.x;p.vx*=-1;} if(p.x>1){p.x=2-p.x;p.vx*=-1;} if(p.y<0){p.y=-p.y;p.vy*=-1;} if(p.y>1){p.y=2-p.y;p.vy*=-1;} }); },
  draw(g,s){ const n=.2, R=.082, P=n*R*s.p.T/s.p.V, narrow=g.W<560, cw=Math.min(170,g.W*.3), x0=24, yb=g.H-58, hmax=g.H-110, hh=hmax*s.p.V/10, yt=yb-hh, hot=clamp((s.p.T-100)/500,0,1), gc=`hsl(${220-hot*210} 80% 55%)`;
    g.rect(0,0,g.W,g.H,isDark()?mix(COL.paper,'#2a3550',.3):'#f1f4f8');
    const steel=g.ctx.createLinearGradient(x0-8,0,x0+cw+8,0); steel.addColorStop(0,isDark()?'#5b6472':'#c4ccd6'); steel.addColorStop(.5,isDark()?'#8a95a6':'#f4f6f8'); steel.addColorStop(1,isDark()?'#5b6472':'#c4ccd6');
    g.rect(x0-8,yb-hmax-20,8,hmax+28,steel,COL.ink,2,1.5); g.rect(x0+cw,yb-hmax-20,8,hmax+28,steel,COL.ink,2,1.5); g.rect(x0-8,yb,cw+16,8,steel,COL.ink,2,1.5);
    g.rect(x0,yt,cw,hh,alpha(gc,.14)); s.pt.forEach(p=>g.circle(x0+5+p.x*(cw-10),yb-5-p.y*(hh-10),4,gc));
    g.rect(x0,yt-14,cw,14,'#7b8696',COL.ink,3,1.5); g.rect(x0+cw/2-5,yt-60,10,46,'#9aa3ad',COL.ink,2,1); g.rect(x0+cw/2-22,yt-66,44,8,'#5b6472',COL.ink,2,1);
    for(let i=0;i<7;i++){ const fx=x0+cw*(.1+i*.13), fh=(6+hot*28)*(0.75+.25*Math.sin(s.t*11+i*1.3)); g.poly([[fx-7,yb+34],[fx,yb+34-fh],[fx+7,yb+34]],null,0,i%2?'#ff9f43':'#ffcc4d',true); }
    g.rect(x0-10,yb+34,cw+20,8,'#3a3f48',null,3); g.tag(nt(s.p.V)+' L',x0+cw/2,yt+hh/2,COL.ink,'center',12);
    const gx=x0+cw+56, gy=yb-hmax/2; g.line(x0+cw+8,gy+20,gx-30,gy+20,'#7b8696',4); SK.gauge(g,gx,gy,30,P,4,'atm',COL.force); g.tag(nt(s.p.T)+' K',gx,gy+62,gc,'center',12);
    if(!narrow){ const px=gx+70, pw=g.W-px-20; const iso=T=>{ const a=[]; for(let V=2;V<=10;V+=.25) a.push([V,n*R*T/V]); return a; };
      const r=g.plot(px,30,pw,g.H-80,{xr:[0,10],yr:[0,5],series:[{pts:iso(200),c:COL.line,w:1.5},{pts:iso(400),c:COL.line,w:1.5},{pts:iso(600),c:COL.line,w:1.5},{pts:iso(s.p.T),c:COL.force,w:2.5}],xl:'volume (L)',yl:'pressão (atm)'});
      g.circle(r.X(s.p.V),r.Y(P),7,COL.vel,COL.ink,1.5); g.tag(nt(P)+' atm',r.X(s.p.V)+10,r.Y(P)-14,COL.vel,'left',11.5); } },
  reads:s=>{ const n=.2, R=.082, P=n*R*s.p.T/s.p.V; return [['Pressão P = nRT/V',nt(P)+' atm'],['P·V',nt(P*s.p.V)+' atm·L'],['P·V/T (sempre igual: n·R)',nt(P*s.p.V/s.p.T,3)+' atm·L/K'],['Quantidade de gás','0,2 mol'],['Temperatura em °C',nt(s.p.T-273,3)+' °C']]; }});

/* máquina térmica: caldeira, motor com volante e radiador */
SIMS.engine=(host,cfg={})=>Sim(host,{alt:'Máquina térmica: caldeira quente, motor girando um volante e radiador frio, com as setas de energia',anim:true,autoplay:true,h:330,
  ctrls:[{k:'Tq',l:'Fonte quente T<sub>q</sub>',min:400,max:1500,step:50,v:cfg.Tq??800,u:'K',live:true},{k:'Tf',l:'Fonte fria T<sub>f</sub>',min:250,max:500,step:10,v:cfg.Tf??300,u:'K',live:true},{k:'Q1',l:'Calor recebido por ciclo Q₁',min:100,max:2000,step:100,v:cfg.Q1??1000,u:'J',live:true},{k:'k',l:'Máquina',opts:[[1,'ideal (Carnot)'],[.5,'real (metade da ideal)']],v:cfg.k??1,live:true}],
  step(){},
  eta:s=>(1-s.p.Tf/s.p.Tq)*s.p.k,
  draw(g,s){ const eta=s.def.eta(s), W=eta*s.p.Q1, Q2=s.p.Q1-W, cx=g.W*.4, cy=g.H/2, sc=v=>clamp(v/s.p.Q1*30,2,30);
    g.rect(0,0,g.W,g.H,isDark()?mix(COL.paper,'#2a3550',.3):'#f1f4f8');
    const box=(y,col,lab)=>{ g.rect(cx-120,y,240,50,alpha(col,.22),col,12,2); g.tag(lab,cx,y+25,col,'center',13.5); };
    box(12,'#e5484d','fonte quente · '+s.p.Tq+' K'); box(g.H-62,'#1c6fd1','fonte fria · '+s.p.Tf+' K');
    for(let i=0;i<6;i++){ const fx=cx-100+i*40, fh=10+6*Math.sin(s.t*10+i); g.poly([[fx-6,12],[fx,12-fh*.2],[fx+6,12]],null,0,'#ff9f43',true); }
    const band=(x1,y1,x2,y2,w,c)=>{ g.ctx.save(); g.ctx.lineCap='butt'; g.ctx.globalAlpha=.85; g.line(x1,y1,x2,y2,c,w); g.ctx.restore(); };
    band(cx,62,cx,cy-36,sc(s.p.Q1),'#e5484d'); g.arrow(cx,cy-60,cx,cy-36,'#e5484d',null,2); g.tag('Q₁ = '+nt(s.p.Q1)+' J',cx-24,(62+cy-36)/2,'#e5484d','right',12);
    band(cx,cy+36,cx,g.H-62,sc(Q2),'#1c6fd1'); g.arrow(cx,g.H-86,cx,g.H-62,'#1c6fd1',null,2); g.tag('Q₂ = '+nt(Q2)+' J',cx-24,(cy+36+g.H-62)/2,'#1c6fd1','right',12);
    band(cx+36,cy,cx+120,cy,sc(W),COL.energy); g.arrow(cx+100,cy,cx+124,cy,COL.energy,null,2);
    g.circle(cx,cy,34,isDark()?'#6b7688':'#cfd5dc',COL.ink,2.5); for(let i=0;i<8;i++){ const a=i/8*Math.PI*2+s.t*eta*8; g.rect(cx+Math.cos(a)*30-4,cy+Math.sin(a)*30-4,8,8,isDark()?'#6b7688':'#cfd5dc',COL.ink,2,1.5); } g.text('motor',cx,cy+5,{size:12,bold:true,align:'center'});
    const fx=cx+170, fr=Math.min(46,g.W*.08); g.circle(fx,cy,fr,null,COL.ink,5); for(let i=0;i<6;i++){ const a=i/6*Math.PI*2+s.t*eta*6; g.line(fx,cy,fx+Math.cos(a)*fr,cy+Math.sin(a)*fr,COL.ink,2.5); } g.circle(fx,cy,6,COL.energy);
    g.tag('W = '+nt(W)+' J',fx,cy-fr-16,COL.energy,'center',12.5);
    g.tag('rendimento '+nt(eta*100,3)+'%',Math.min(g.W-80,fx+fr+80),cy+fr+30,COL.ink,'center',15); },
  reads:s=>{ const ec=1-s.p.Tf/s.p.Tq, eta=ec*s.p.k, W=eta*s.p.Q1; return [['Rendimento de Carnot 1 − T<sub>f</sub>/T<sub>q</sub>',nt(ec*100,3)+' %'],['Rendimento desta máquina',nt(eta*100,3)+' %'],['Trabalho W = η·Q₁',nt(W)+' J'],['Calor rejeitado Q₂ = Q₁ − W',nt(s.p.Q1-W)+' J']]; }});
