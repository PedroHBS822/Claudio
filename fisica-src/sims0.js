/* =====================================================================
   Kit de cenas: céu, estrada, carro, bola, caixa, pessoa, prédio,
   cronômetro, velocímetro e cotas. Tudo a partir dos tokens do tema,
   então funciona no claro e no escuro.
   ===================================================================== */
function hexRGB(c){ c=String(c).trim(); if(c.startsWith('rgb')) return c.match(/[\d.]+/g).slice(0,3).map(Number); if(c[0]==='#'){ c=c.slice(1); if(c.length===3) c=[...c].map(x=>x+x).join(''); return [0,2,4].map(i=>parseInt(c.slice(i,i+2),16)); } return [128,128,128]; }
function mix(a,b,t){ const A=hexRGB(a), B=hexRGB(b); return `rgb(${A.map((v,i)=>Math.round(v+(B[i]-v)*t)).join(',')})`; }
function alpha(c,a){ const A=hexRGB(c); return `rgba(${A.join(',')},${a})`; }
const isDark=()=>{ const [r,g,b]=hexRGB(COL.paper); return r+g+b<300; };

const SK={
  /* céu com nuvens; off desloca as nuvens (paralaxe) */
  sky(g,y,off=0){ const c=g.ctx, gr=c.createLinearGradient(0,0,0,y), d=isDark();
    gr.addColorStop(0,d?mix(COL.paper,'#1b2a4a',.8):mix('#7fb6f2',COL.paper,.35)); gr.addColorStop(1,d?mix(COL.paper,'#24365c',.5):mix('#cfe5fb',COL.paper,.25));
    c.fillStyle=gr; c.fillRect(0,0,g.W,y);
    if(d){ c.fillStyle='rgba(255,255,255,.55)'; for(let i=0;i<26;i++){ const x=((i*137.5+off*.05)%g.W+g.W)%g.W, yy=(i*53)%Math.max(10,y-10); c.fillRect(x,yy,1.4,1.4); } }
    else { c.fillStyle='rgba(255,255,255,.75)'; [[.15,.25,1],[.55,.15,1.3],[.85,.32,.9]].forEach(([fx,fy,sc])=>{ const x=((fx*g.W-off*.15)%(g.W+120)+g.W+120)%(g.W+120)-60, yy=fy*y; [[0,0,22],[18,-6,17],[36,2,19],[-16,4,14]].forEach(([dx,dy,r])=>{ c.beginPath(); c.arc(x+dx*sc,yy+dy*sc,r*sc,0,7); c.fill(); }); }); } },
  hills(g,y,off=0){ const c=g.ctx; c.fillStyle=isDark()?mix(COL.paper,COL.ok,.18):mix(COL.ok,COL.paper,.62); c.beginPath(); c.moveTo(0,y); for(let x=0;x<=g.W+20;x+=20){ c.lineTo(x,y-14-10*Math.sin((x+off*.3)/70)-6*Math.sin((x+off*.3)/23)); } c.lineTo(g.W,y); c.closePath(); c.fill(); },
  grass(g,y,h){ const c=g.ctx, gr=c.createLinearGradient(0,y,0,y+h); gr.addColorStop(0,isDark()?mix(COL.paper,COL.ok,.28):mix(COL.ok,COL.paper,.45)); gr.addColorStop(1,isDark()?mix(COL.paper,COL.ok,.14):mix(COL.ok,COL.paper,.62)); c.fillStyle=gr; c.fillRect(0,y,g.W,h); },
  /* estrada com faixas que andam conforme off (em pixels) */
  road(g,y,h,off=0){ const c=g.ctx; c.fillStyle=isDark()?mix(COL.paper,'#000',.25):mix('#3d4552',COL.paper,.15); c.fillRect(0,y,g.W,h);
    c.fillStyle=isDark()?'#d9dee6':'#f4f6f8'; c.fillRect(0,y,g.W,2); c.fillRect(0,y+h-2,g.W,2);
    c.fillStyle='#f2c94c'; const per=40, o=((off%per)+per)%per; for(let x=-per+o*-1;x<g.W+per;x+=per) c.fillRect(x,y+h/2-1.5,22,3); },
  shadow(g,x,y,w,a=.25){ const c=g.ctx; c.save(); c.fillStyle=`rgba(0,0,0,${a})`; c.beginPath(); c.ellipse(x,y,w/2,Math.max(2,w*.09),0,0,7); c.fill(); c.restore(); },
  /* carro: x = centro, y = chão; rot = ângulo das rodas (rad) */
  car(g,x,y,w,col,rot=0){ const c=g.ctx, h=w*.28, r=w*.12, wy=y-r;
    SK.shadow(g,x,y+1,w*.95,.22);
    c.save(); c.fillStyle=col; c.strokeStyle=mix(col,'#000',.35); c.lineWidth=1.5;
    c.beginPath(); c.moveTo(x-w/2,wy-2); c.lineTo(x-w/2,wy-h*.75); c.quadraticCurveTo(x-w/2,wy-h,x-w*.42,wy-h); c.lineTo(x-w*.27,wy-h); c.lineTo(x-w*.14,wy-h*1.75); c.lineTo(x+w*.17,wy-h*1.75); c.lineTo(x+w*.31,wy-h); c.lineTo(x+w*.44,wy-h*.92); c.quadraticCurveTo(x+w/2,wy-h*.8,x+w/2,wy-h*.45); c.lineTo(x+w/2,wy-2); c.closePath(); c.fill(); c.stroke();
    c.fillStyle=isDark()?'#9fc3ea':'#d7ecff'; c.beginPath(); c.moveTo(x-w*.23,wy-h*1.02); c.lineTo(x-w*.12,wy-h*1.62); c.lineTo(x-w*.0,wy-h*1.62); c.lineTo(x-w*.0,wy-h*1.02); c.closePath(); c.fill();
    c.beginPath(); c.moveTo(x+w*.03,wy-h*1.02); c.lineTo(x+w*.03,wy-h*1.62); c.lineTo(x+w*.15,wy-h*1.62); c.lineTo(x+w*.26,wy-h*1.02); c.closePath(); c.fill();
    c.fillStyle='#ffd866'; c.beginPath(); c.ellipse(x+w*.47,wy-h*.62,w*.025,h*.12,0,0,7); c.fill(); c.fillStyle='#e5484d'; c.fillRect(x-w/2,wy-h*.7,w*.03,h*.22);
    [[x-w*.3],[x+w*.3]].forEach(([wx])=>{ c.fillStyle='#1c1f24'; c.beginPath(); c.arc(wx,wy,r,0,7); c.fill(); c.fillStyle='#9aa3ad'; c.beginPath(); c.arc(wx,wy,r*.5,0,7); c.fill(); c.strokeStyle='#1c1f24'; c.lineWidth=1.6; for(let k=0;k<4;k++){ const a=rot+k*Math.PI/2; c.beginPath(); c.moveTo(wx,wy); c.lineTo(wx+Math.cos(a)*r*.5,wy+Math.sin(a)*r*.5); c.stroke(); } });
    c.restore(); },
  /* bola com brilho; spin desenha uma costura girando */
  ball(g,x,y,r,col,spin){ const c=g.ctx, gr=c.createRadialGradient(x-r*.35,y-r*.4,r*.15,x,y,r); gr.addColorStop(0,mix(col,'#ffffff',.55)); gr.addColorStop(.6,col); gr.addColorStop(1,mix(col,'#000',.35));
    c.save(); c.fillStyle=gr; c.beginPath(); c.arc(x,y,r,0,7); c.fill();
    if(spin!=null){ c.strokeStyle=alpha('#ffffff',.55); c.lineWidth=Math.max(1,r*.12); c.beginPath(); c.arc(x,y,r*.62,spin,spin+2.2); c.stroke(); }
    c.restore(); },
  /* caixa de madeira */
  crate(g,x,y,w,h,label){ const c=g.ctx, wood=isDark()?'#a0703f':'#c98d4f', dark=mix(wood,'#000',.35);
    SK.shadow(g,x+w/2,y+h,w*1.05,.2);
    c.save(); c.fillStyle=wood; c.strokeStyle=dark; c.lineWidth=2; g.rect(x,y,w,h,wood,dark,4,2);
    c.strokeStyle=alpha(dark,.55); c.lineWidth=1; for(let k=1;k<4;k++){ c.beginPath(); c.moveTo(x+3,y+h*k/4); c.lineTo(x+w-3,y+h*k/4); c.stroke(); }
    c.strokeStyle=dark; c.lineWidth=3; c.beginPath(); c.moveTo(x+4,y+4); c.lineTo(x+w-4,y+h-4); c.stroke(); c.lineWidth=2; c.strokeRect(x+3,y+3,w-6,h-6); c.restore();
    if(label) g.tag(label,x+w/2,y+h/2,'#3b2a14'); },
  /* pessoa estilizada; pose: 'stand' | 'push' */
  person(g,x,y,h,col,pose='stand'){ const c=g.ctx, hd=h*.13; c.save(); c.lineCap='round'; c.strokeStyle=col; c.fillStyle=col;
    const lean=pose==='push'?h*.18:0, hipX=x, hipY=y-h*.45, shX=x+lean, shY=y-h*.8;
    c.lineWidth=h*.085; c.beginPath(); c.moveTo(hipX,hipY); c.lineTo(shX,shY); c.stroke();
    c.beginPath(); c.arc(shX+lean*.25,shY-hd*1.15,hd,0,7); c.fill();
    c.lineWidth=h*.07; c.beginPath(); c.moveTo(hipX,hipY); c.lineTo(hipX-(pose==='push'?h*.22:h*.08),y); c.moveTo(hipX,hipY); c.lineTo(hipX+h*.08,y); c.stroke();
    c.lineWidth=h*.06; c.beginPath(); if(pose==='push'){ c.moveTo(shX,shY+h*.04); c.lineTo(shX+h*.28,shY+h*.1); } else { c.moveTo(shX,shY+h*.04); c.lineTo(shX-h*.12,shY+h*.32); c.moveTo(shX,shY+h*.04); c.lineTo(shX+h*.12,shY+h*.32); } c.stroke(); c.restore(); },
  building(g,x,y,w,h){ const c=g.ctx, wall=isDark()?mix(COL.paper,'#8892a3',.3):mix('#b8c1cc',COL.paper,.25); g.rect(x,y,w,h,wall,mix(wall,'#000',.3),3,1.5);
    const cols=Math.max(2,Math.floor(w/22)), rows=Math.max(2,Math.floor(h/26)); for(let i=0;i<cols;i++) for(let j=0;j<rows;j++){ const wx=x+6+i*(w-12)/cols, wy=y+8+j*(h-12)/rows; c.fillStyle=(i*7+j*3)%5===0?'#ffe08a':(isDark()?'#2c3a52':'#e8f2fc'); c.fillRect(wx,wy,(w-12)/cols-6,(h-12)/rows-9); } },
  tree(g,x,y,s){ const c=g.ctx; c.fillStyle=isDark()?'#5b4630':'#8a6a45'; c.fillRect(x-s*.06,y-s*.45,s*.12,s*.45); c.fillStyle=isDark()?mix(COL.paper,COL.ok,.45):mix(COL.ok,'#000',.05); [[0,-.62,.3],[-.17,-.5,.22],[.17,-.5,.22]].forEach(([dx,dy,r])=>{ c.beginPath(); c.arc(x+dx*s,y+dy*s,r*s,0,7); c.fill(); }); },
  /* cronômetro analógico + digital */
  watch(g,x,y,r,t){ const c=g.ctx; g.circle(x,y,r+3,COL.card,COL.ink,2); g.rect(x-4,y-r-9,8,6,COL.ink,null,2);
    for(let k=0;k<12;k++){ const a=k/12*Math.PI*2; g.line(x+Math.sin(a)*r*.78,y-Math.cos(a)*r*.78,x+Math.sin(a)*r*.92,y-Math.cos(a)*r*.92,COL.muted,k%3?1:2); }
    const a=(t%1)*Math.PI*2; g.line(x,y,x+Math.sin(a)*r*.75,y-Math.cos(a)*r*.75,COL.force,2); g.circle(x,y,2.5,COL.ink);
    g.text(nsig(Math.floor(t*100)/100,4).replace(/^(\d+)$/,'$1,00')+' s',x,y+r+18,{size:13,bold:true,mono:true,align:'center'}); },
  /* velocímetro em arco */
  gauge(g,x,y,r,v,vmax,unit,col=COL.accent){ const c=g.ctx, a0=Math.PI*.8, a1=Math.PI*2.2, f=clamp(Math.abs(v)/vmax,0,1);
    c.save(); c.lineCap='round'; c.lineWidth=r*.16; c.strokeStyle=COL.line; c.beginPath(); c.arc(x,y,r,a0,a1); c.stroke();
    c.strokeStyle=col; c.beginPath(); c.arc(x,y,r,a0,a0+(a1-a0)*f); c.stroke(); c.restore();
    const an=a0+(a1-a0)*f; g.line(x,y,x+Math.cos(an)*r*.8,y+Math.sin(an)*r*.8,COL.ink,2.5); g.circle(x,y,4,COL.ink);
    g.text(nsig(Math.round(v*10)/10,3),x,y+r*.55,{size:Math.max(12,r*.42),bold:true,mono:true,align:'center'}); g.text(unit,x,y+r*.55+13,{size:10.5,c:COL.muted,align:'center'}); },
  /* cota entre dois pontos, com etiqueta */
  dim(g,x1,y1,x2,y2,label,col=COL.muted){ const dx=x2-x1, dy=y2-y1, L=Math.hypot(dx,dy)||1, nx=-dy/L*6, ny=dx/L*6;
    g.line(x1,y1,x2,y2,col,1.4); g.line(x1-nx,y1-ny,x1+nx,y1+ny,col,1.4); g.line(x2-nx,y2-ny,x2+nx,y2+ny,col,1.4); if(label) g.tag(label,(x1+x2)/2,(y1+y2)/2,col); },
  /* destaque pulsante para chamar atenção num ponto (exemplos) */
  pulse(g,x,y,r,col=COL.energy){ const k=(performance.now()/900)%1; g.ctx.save(); g.ctx.globalAlpha=1-k; g.circle(x,y,r*(1+k*.8),null,col,3); g.ctx.restore(); }
};
