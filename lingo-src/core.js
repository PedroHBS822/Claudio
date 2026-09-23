<script>
"use strict";
/* =====================================================================
   MatLingo — utilitários
   ===================================================================== */
const R=(a,b)=>Math.floor(Math.random()*(b-a+1))+a;
const pick=a=>a[Math.floor(Math.random()*a.length)];
const shuffle=a=>{a=a.slice();for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]];}return a;};
const gcd=(a,b)=>{a=Math.abs(a);b=Math.abs(b);while(b){[a,b]=[b,a%b];}return a||1;};
const lcm=(a,b)=>a/gcd(a,b)*b;
const RNZ=(a,b)=>{let v=0;while(v===0)v=R(a,b);return v;};
const fact=n=>n<=1?1:n*fact(n-1);
const nCr=(n,r)=>{let v=1;for(let i=1;i<=r;i++)v=v*(n-r+i)/i;return Math.round(v);};
const round=(n,d=6)=>Math.round(n*10**d)/10**d;
/* número -> texto pt-BR (vírgula decimal, sinal de menos tipográfico) */
function fmt(n){ if(typeof n==='string')return n; const r=round(n,4); let s=String(Math.abs(r)); if(s.includes('e')) s=Math.abs(r).toFixed(8).replace(/0+$/,''); s=s.replace('.',','); return (r<0?'−':'')+s; }
/* milhares com ponto */
function nf(n){ const neg=n<0; n=Math.abs(n); const [i,d]=String(round(n,4)).split('.'); const ii=i.replace(/\B(?=(\d{3})+(?!\d))/g,'.'); return (neg?'−':'')+ii+(d?','+d:''); }
const money=v=>'R$ '+nf(round(v,2)).replace(/,(\d)$/,',$10').replace(/^([^,]*)$/,'$1,00');
const par=n=>n<0?`(${fmt(n)})`:fmt(n);
const sgn=(n,first)=>first?fmt(n):(n<0?` − ${fmt(-n)}`:` + ${fmt(n)}`);
/* frações */
function F(n,d){ if(typeof n==='number'&&typeof d==='number'&&d<0){n=-n;d=-d;} const neg=typeof n==='number'&&n<0; return `${neg?'−':''}<span class="fr"><span>${neg?-n:n}</span><span>${d}</span></span>`; }
function simp(n,d){ if(d<0){n=-n;d=-d;} const g=gcd(n,d); return [n/g,d/g]; }
function Fs(n,d){ [n,d]=simp(n,d); return d===1?fmt(n):F(n,d); }
function fkey(n,d){ [n,d]=simp(n,d); return d===1?String(n):`${n}/${d}`; }
const X2='x<sup>2</sup>';
function mono(c,v,first){ /* coeficiente*variável com sinal */ if(c===0)return ''; const a=Math.abs(c); const body=(a===1&&v?'':fmt(a))+v; if(first) return (c<0?'−':'')+body; return c<0?` − ${body}`:` + ${body}`; }
function poly(cs,vars){ let s='',first=true; cs.forEach((c,i)=>{ if(c===0)return; s+=mono(c,vars[i],first); first=false; }); return s||'0'; }
const lin=(a,b,v='x')=>poly([a,b],[v,'']);
const quad=(a,b,c)=>poly([a,b,c],[X2,'x','']);
function stripHtml(h){ return String(h).replace(/<sup>(.*?)<\/sup>/g,'^$1').replace(/<span class="fr"><span>(.*?)<\/span><span>(.*?)<\/span><\/span>/g,'$1/$2').replace(/<[^>]+>/g,'').replace(/\s+/g,' ').trim(); }
function norm(s){ return String(s).toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g,'').replace(/−|–/g,'-').replace(/[×·*]/g,'').replace(/\s+/g,'').replace(/^[a-z]\s*=/,''); }
function parseNum(s){
  s=String(s).trim().toLowerCase().replace(/−|–/g,'-').replace(/\s+/g,'').replace(/^r\$/,'').replace(/reais|graus|°|%/g,'');
  s=s.replace(/^[a-z]=/,'');
  let sm=s.match(/^(-?\d+(?:[.,]\d+)?)(?:\*|x|×|·)10\^?\(?(-?\d+)\)?$/)||s.match(/^(-?\d+(?:[.,]\d+)?)e(-?\d+)$/); if(sm) return parseFloat(sm[1].replace(',','.'))*10**parseInt(sm[2]);
  if(/^-?\d{1,3}(\.\d{3})+(,\d+)?$/.test(s)) s=s.replace(/\./g,'');
  s=s.replace(',','.');
  let m;
  if((m=s.match(/^(-?\d+(?:\.\d+)?)\/(-?\d+(?:\.\d+)?)$/))){ const d=parseFloat(m[2]); return d===0?NaN:parseFloat(m[1])/d; }
  if(/^-?(\d+\.?\d*|\.\d+)$/.test(s)) return parseFloat(s);
  return NaN;
}
function numEq(u,v,tol){ const p=parseNum(u); if(isNaN(p))return false; return Math.abs(p-v)<=(tol||1e-6*Math.max(1,Math.abs(v))); }

/* =====================================================================
   Construtores de questões
   ===================================================================== */
const DEFHINT='Leia o enunciado com calma e, se precisar, abra a aula desta habilidade.';
function MC(prompt,correct,wrongs,exp,hint,o={}){
  hint=hint||DEFHINT;
  correct=String(correct); const n=o.n||4; const opts=[correct];
  for(const w of wrongs){ const s=String(w); if(!opts.includes(s)&&stripHtml(s)!==stripHtml(correct)&&opts.length<n) opts.push(s); }
  const sc=stripHtml(correct); const c=/^[−-]?[\d.,]+$/.test(sc)?parseNum(sc.replace(/\./g,'')):NaN;
  if(opts.length<n&&!isNaN(c)){ for(let k=1;opts.length<n&&k<60;k++){ const v=fmt(c+(k%2?Math.ceil(k/2):-Math.ceil(k/2))*(o.step||1)); if(!opts.includes(v))opts.push(v);} }
  if(o.keep){ const ord=wrongs.map(String); opts.sort((a,b)=>ord.indexOf(a)-ord.indexOf(b)); }
  return {type:'mc',prompt,options:o.keep?opts:shuffle(opts),correct,answer:correct,exp,hint,visual:o.visual};
}
function TF(statement,truth,exp,hint,o={}){
  hint=hint||DEFHINT;
  return {type:'tf',prompt:statement,options:['Verdadeiro','Falso'],correct:truth?'Verdadeiro':'Falso',answer:truth?'Verdadeiro':'Falso',exp,hint,visual:o.visual};
}
function NUM(prompt,value,exp,hint,o={}){
  hint=hint||DEFHINT;
  return {type:'input',numeric:true,prompt,value,key:o.key||String(round(value,4)).replace('.',','),answer:o.answer||nf(value),
    check:u=>numEq(u,value,o.tol)||(o.accept||[]).some(a=>norm(a)===norm(u)),exp,hint,unit:o.unit,visual:o.visual,keys:o.keys};
}
function FRAC(prompt,n,d,exp,hint,o={}){ /* resposta fracionária (aceita qualquer forma equivalente) */
  return NUM(prompt,n/d,exp,hint,Object.assign({key:fkey(n,d),answer:Fs(n,d),keys:['/','−']},o));
}
function TXT(prompt,accepts,exp,hint,o={}){
  hint=hint||DEFHINT;
  return {type:'input',numeric:false,prompt,key:accepts[0],answer:o.answer||accepts[0],check:u=>accepts.some(a=>norm(a)===norm(u)),exp,hint,visual:o.visual,keys:o.keys};
}
function FILL(prompt,sentence,value,exp,hint,o={}){
  const q=NUM(prompt,value,exp,hint,o); q.type='fill'; q.sentence=sentence; return q;
}
function BANK(prompt,sentence,correct,wrongs,exp,hint,o={}){
  const q=MC(prompt,correct,wrongs,exp,hint,o); q.type='bank'; q.sentence=sentence; return q;
}

/* =====================================================================
   Ilustrações SVG
   ===================================================================== */
const SV=(w,h,body)=>`<svg viewBox="0 0 ${w} ${h}" width="${w}" height="${h}" xmlns="http://www.w3.org/2000/svg" font-family="inherit" font-weight="800">${body}</svg>`;
function pieSVG(n,k,color='#1cb0f6'){
  const cx=80,cy=80,r=70; let p='';
  if(n===1) return SV(160,160,`<circle cx="80" cy="80" r="70" fill="${color}" stroke="#3c3c3c" stroke-width="3"/>`);
  for(let i=0;i<n;i++){ const a1=-Math.PI/2+i*2*Math.PI/n,a2=a1+2*Math.PI/n;
    const x1=cx+r*Math.cos(a1),y1=cy+r*Math.sin(a1),x2=cx+r*Math.cos(a2),y2=cy+r*Math.sin(a2);
    p+=`<path d="M${cx},${cy} L${x1.toFixed(2)},${y1.toFixed(2)} A${r},${r} 0 0 1 ${x2.toFixed(2)},${y2.toFixed(2)} Z" fill="${i<k?color:'#fff'}" stroke="#3c3c3c" stroke-width="3" stroke-linejoin="round"/>`; }
  return SV(160,160,p);
}
function barSVG(n,k,color='#58cc02'){ const w=Math.min(40,260/n); let p=''; for(let i=0;i<n;i++) p+=`<rect x="${4+i*w}" y="4" width="${w}" height="50" rx="4" fill="${i<k?color:'#fff'}" stroke="#3c3c3c" stroke-width="3"/>`; return SV(n*w+8,58,p); }
function rectSVG(wl,hl,wr=1.6,fill='#ddf4ff'){ const W=200,H=Math.max(60,Math.min(150,200/wr)); return SV(W+90,H+60,`<rect x="45" y="15" width="${W}" height="${H}" rx="4" fill="${fill}" stroke="#1899d6" stroke-width="4"/><text x="${45+W/2}" y="${H+48}" text-anchor="middle" fill="#1899d6" font-size="20">${wl}</text><text x="${W+55}" y="${15+H/2+7}" fill="#1899d6" font-size="20">${hl}</text>`); }
function squareSVG(l){ return SV(200,180,`<rect x="40" y="15" width="130" height="130" rx="4" fill="#d7ffb8" stroke="#58a700" stroke-width="4"/><text x="105" y="172" text-anchor="middle" fill="#58a700" font-size="20">${l}</text>`); }
/* triângulo retângulo: rótulos a (vertical), b (horizontal), c (hipotenusa), theta opcional no vértice inferior direito */
function rtSVG(a,b,c,theta){ const body=`<polygon points="40,20 40,170 250,170" fill="#fff4d6" stroke="#ff9600" stroke-width="4" stroke-linejoin="round"/><polyline points="40,150 60,150 60,170" fill="none" stroke="#ff9600" stroke-width="3"/>
 <text x="30" y="100" text-anchor="end" fill="#e07b00" font-size="20">${a}</text><text x="145" y="196" text-anchor="middle" fill="#e07b00" font-size="20">${b}</text><text x="158" y="85" fill="#e07b00" font-size="20">${c}</text>${theta?`<path d="M215,170 A35,35 0 0 0 222,150" fill="none" stroke="#ce82ff" stroke-width="3"/><text x="196" y="160" fill="#a568cc" font-size="18">${theta}</text>`:''}`; return SV(290,205,body); }
function triSVG(A,B,C){ return SV(280,190,`<polygon points="30,165 250,165 110,25" fill="#f3e3ff" stroke="#ce82ff" stroke-width="4" stroke-linejoin="round"/><text x="58" y="155" fill="#a568cc" font-size="18">${A}</text><text x="222" y="155" text-anchor="end" fill="#a568cc" font-size="18">${B}</text><text x="110" y="62" text-anchor="middle" fill="#a568cc" font-size="18">${C}</text>`); }
function circleSVG(lbl,diam){ return SV(200,180,`<circle cx="100" cy="90" r="75" fill="#ddf4ff" stroke="#1899d6" stroke-width="4"/><circle cx="100" cy="90" r="4" fill="#1899d6"/><line x1="${diam?25:100}" y1="90" x2="175" y2="90" stroke="#1899d6" stroke-width="3" stroke-dasharray="6 4"/><text x="${diam?100:138}" y="80" text-anchor="middle" fill="#1899d6" font-size="18">${lbl}</text>`); }
function angleSVG(deg){ const r=110,a=deg*Math.PI/180,x=40+r*Math.cos(a),y=160-r*Math.sin(a); const ax=40+40*Math.cos(a/2),ay=160-40*Math.sin(a/2);
  return SV(270,190,`<line x1="40" y1="160" x2="${40+r+40}" y2="160" stroke="#3c3c3c" stroke-width="4" stroke-linecap="round"/><line x1="40" y1="160" x2="${x.toFixed(1)}" y2="${y.toFixed(1)}" stroke="#3c3c3c" stroke-width="4" stroke-linecap="round"/><path d="M${40+30},160 A30,30 0 ${deg>180?1:0} 0 ${(40+30*Math.cos(a)).toFixed(1)},${(160-30*Math.sin(a)).toFixed(1)}" fill="none" stroke="#ff4b4b" stroke-width="3"/><text x="${(ax+14).toFixed(0)}" y="${(ay-4).toFixed(0)}" fill="#ea2b2b" font-size="16">?</text>`); }
function trapSVG(B,b,h){ return SV(300,180,`<polygon points="30,150 270,150 200,30 90,30" fill="#fff4d6" stroke="#ff9600" stroke-width="4" stroke-linejoin="round"/><line x1="145" y1="30" x2="145" y2="150" stroke="#ff9600" stroke-width="2" stroke-dasharray="6 4"/><text x="150" y="174" text-anchor="middle" fill="#e07b00" font-size="18">${B}</text><text x="145" y="22" text-anchor="middle" fill="#e07b00" font-size="18">${b}</text><text x="152" y="98" fill="#e07b00" font-size="18">${h}</text>`); }
function boxSVG(a,b,c){ return SV(260,190,`<polygon points="30,70 170,70 170,170 30,170" fill="#ddf4ff" stroke="#1899d6" stroke-width="3"/><polygon points="30,70 80,30 220,30 170,70" fill="#b8e6ff" stroke="#1899d6" stroke-width="3"/><polygon points="170,70 220,30 220,130 170,170" fill="#8fd5ff" stroke="#1899d6" stroke-width="3"/><text x="100" y="188" text-anchor="middle" fill="#1899d6" font-size="16">${a}</text><text x="236" y="104" fill="#1899d6" font-size="16">${c}</text><text x="206" y="162" fill="#1899d6" font-size="16">${b}</text>`); }
function cylSVG(r,h){ return SV(200,200,`<ellipse cx="100" cy="160" rx="60" ry="18" fill="#d7ffb8" stroke="#58a700" stroke-width="3"/><rect x="40" y="40" width="120" height="120" fill="#d7ffb8"/><line x1="40" y1="40" x2="40" y2="160" stroke="#58a700" stroke-width="3"/><line x1="160" y1="40" x2="160" y2="160" stroke="#58a700" stroke-width="3"/><ellipse cx="100" cy="40" rx="60" ry="18" fill="#b5f08a" stroke="#58a700" stroke-width="3"/><line x1="100" y1="40" x2="160" y2="40" stroke="#58a700" stroke-width="2" stroke-dasharray="5 4"/><text x="130" y="34" text-anchor="middle" fill="#58a700" font-size="15">${r}</text><text x="170" y="105" fill="#58a700" font-size="15">${h}</text>`); }
function gridPtSVG(pts){ /* plano cartesiano com pontos [x,y,label] em -6..6 */ const s=14,o=100; let g=''; for(let i=-6;i<=6;i++){ g+=`<line x1="${o+i*s}" y1="${o-6*s}" x2="${o+i*s}" y2="${o+6*s}" stroke="#e5e5e5"/><line x1="${o-6*s}" y1="${o+i*s}" x2="${o+6*s}" y2="${o+i*s}" stroke="#e5e5e5"/>`; }
  g+=`<line x1="${o-6*s}" y1="${o}" x2="${o+6*s}" y2="${o}" stroke="#777" stroke-width="2"/><line x1="${o}" y1="${o-6*s}" x2="${o}" y2="${o+6*s}" stroke="#777" stroke-width="2"/>`;
  pts.forEach(([x,y,l])=>{ g+=`<circle cx="${o+x*s}" cy="${o-y*s}" r="5" fill="#ff4b4b"/><text x="${o+x*s+7}" y="${o-y*s-7}" fill="#ea2b2b" font-size="14">${l}</text>`; }); return SV(200,200,g); }
const MX=M=>`<span class="mx"><table>${M.map(r=>'<tr>'+r.map(v=>`<td>${fmt(v)}</td>`).join('')+'</tr>').join('')}</table></span>`;
const SYS=(...l)=>`<span class="sys">${l.join('<br>')}</span>`;

/* =====================================================================
   CONTEÚDO — Unidades, habilidades, teoria e geradores
   ===================================================================== */
