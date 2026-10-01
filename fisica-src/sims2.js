/* =====================================================================
   Laboratórios de estática, fluidos, termologia e ondas
   ===================================================================== */

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
