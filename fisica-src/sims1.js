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
