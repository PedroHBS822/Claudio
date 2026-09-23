
/* =====================================================================
   MatLingo v2 — novas habilidades e cartões de memória
   ===================================================================== */
const pad2=n=>String(n).padStart(2,'0');
const MONTHS=[['janeiro',31],['fevereiro',28],['março',31],['abril',30],['maio',31],['junho',30],['julho',31],['agosto',31],['setembro',30],['outubro',31],['novembro',30],['dezembro',31]];

insertSkill('u1','num',{id:'arred',name:'Arredondamento e estimativa',icon:'🎯',tip:'Olhe o algarismo à direita da casa pedida: se for 5 ou mais, arredonda para cima; se for menor que 5, para baixo.',
theory:`<p><b>Arredondar</b> é trocar um número por outro "redondo" próximo, para facilitar contas e estimativas.</p>
<h3>Regra</h3><p>Olhe o algarismo logo à direita da casa desejada: <b>0 a 4</b> → mantém; <b>5 a 9</b> → aumenta 1.</p>
<div class="ex">Ex.: 487 para a centena mais próxima → o algarismo das dezenas é 8 (≥ 5) → <b>500</b></div>
<div class="ex">3,42 para o inteiro mais próximo → décimo 4 (< 5) → <b>3</b></div>
<h3>Estimativa</h3><p>Arredonde antes de calcular para ter uma ideia do resultado: 398 + 207 ≈ 400 + 200 = 600.</p>`,
gens:[
 lv=>{const c=pick([[10,'dezena'],[100,'centena'],[1000,'unidade de milhar']]);let n;do{n=R(c[0]<100?11:c[0]+1,c[0]*50);}while(n%c[0]===0);const r=Math.round(n/c[0])*c[0];return NUM(`Arredonde <b>${nf(n)}</b> para a <b>${c[1]}</b> mais próxima.`,r,`O algarismo à direita da casa da ${c[1]} é ${Math.floor(n%c[0]/(c[0]/10))} → ${Math.floor(n%c[0]/(c[0]/10))>=5?'arredonda para cima':'mantém'}: <b>${nf(r)}</b>.`,'Olhe o algarismo logo à direita da casa pedida.');},
 lv=>{let v;do{v=R(11,999)/10;}while(Math.round(v*10)%10===5||Math.round(v*10)%10===0);return NUM(`Arredonde <b>${fmt(v)}</b> para o número inteiro mais próximo.`,Math.round(v),`O décimo é ${Math.round(v*10)%10} → <b>${Math.round(v)}</b>.`,'Olhe o primeiro algarismo depois da vírgula.');},
 lv=>{const a=R(1,9)*100+pick([-3,-2,-1,1,2,3])*R(1,9),b=R(1,9)*100+pick([-2,-1,1,2])*R(1,9);const e=Math.round(a/100)*100+Math.round(b/100)*100;return MC(`Qual é a melhor <b>estimativa</b> para <b>${a} + ${b}</b>?`,nf(e),[nf(e+100),nf(e-100),nf(e+200)],`${a} ≈ ${Math.round(a/100)*100} e ${b} ≈ ${Math.round(b/100)*100} → ${nf(e)} (o valor exato é ${a+b}).`,'Arredonde cada parcela para a centena mais próxima.');},
 lv=>{const n=R(101,999),r=Math.round(n/100)*100,sh=pick([r,r,r+100,r-100].filter(x=>x>0));return TF(`${n} arredondado para a centena mais próxima é ${sh}.`,sh===r,`O algarismo das dezenas é ${Math.floor(n%100/10)} → ${r}.`,'Olhe o algarismo das dezenas.');},
 lv=>{const p=R(3,9)*10-pick([1,2]),q=R(2,5);return MC(`Cada caderno custa <b>R$ ${p},90</b>. Comprando <b>${q}</b>, o gasto aproximado é:`,`R$ ${(p+1)*q}`,[`R$ ${p*q}`,`R$ ${(p+1)*q+10}`,`R$ ${(p+1)*q-20}`],`R$ ${p},90 ≈ R$ ${p+1}; ${q} × ${p+1} = R$ ${(p+1)*q}.`,'Arredonde o preço e multiplique.');},
]});
insertSkill('u1','med',{id:'hora',name:'Horas e calendário',icon:'🕐',tip:'Ponteiro pequeno = horas; grande = minutos (cada número vale 5 min). 1 h = 60 min; 1 semana = 7 dias; 1 ano = 12 meses.',
theory:`<h3>Relógio de ponteiros</h3><p>O ponteiro <b>pequeno</b> marca as horas; o <b>grande</b> marca os minutos. Cada número do relógio vale 5 minutos para o ponteiro grande.</p><div class="ex">Grande no 3 e pequeno logo depois do 8 → 8h15</div>
<h3>Calendário</h3><p>1 semana = 7 dias · 1 ano = 12 meses = 365 dias (366 no bissexto) · Meses com 30 dias: abril, junho, setembro, novembro. Fevereiro tem 28 (ou 29).</p>
<h3>Duração</h3><p>Conte até a próxima hora cheia e depois some: de 8h40 a 10h15 → 20 min + 1 h + 15 min = 1 h 35 min = 95 min.</p>`,
gens:[
 lv=>{const h=R(1,12),m=pick([0,5,10,15,20,25,30,35,40,45,50,55]);const t=(H,M)=>`${H}h${pad2(M)}`;return MC('Que horas o relógio está marcando?',t(h,m),[t(m/5||12,h*5%60),t(h%12+1,m),t(h,(m+30)%60),t(h===1?12:h-1,m)],`O ponteiro pequeno indica ${h} h e o grande está no ${m/5||12} → ${m} min.`,'Ponteiro grande: cada número vale 5 minutos.',{visual:clockSVG(h,m)});},
 lv=>{const n=R(2,10);return NUM(`Quantos dias há em <b>${n} semanas</b>?`,7*n,`${n} × 7 = <b>${7*n} dias</b>.`,'1 semana = 7 dias.',{unit:'dias'});},
 lv=>{const m=pick(MONTHS);return MC(`Quantos dias tem o mês de <b>${m[0]}</b> (ano não bissexto)?`,m[1],[28,30,31].filter(x=>x!==m[1]).concat([29]),`${m[0][0].toUpperCase()+m[0].slice(1)} tem ${m[1]} dias.`,'Abril, junho, setembro e novembro têm 30 dias; fevereiro, 28.');},
 lv=>{const h1=R(7,15),m1=pick([10,20,25,40,45,50]),d=R(40,150),e=h1*60+m1+d;return NUM(`Uma aula começou às <b>${h1}h${pad2(m1)}</b> e terminou às <b>${Math.floor(e/60)}h${pad2(e%60)}</b>. Quantos minutos durou?`,d,`De ${h1}h${pad2(m1)} até ${Math.floor(e/60)}h${pad2(e%60)}: ${Math.floor(d/60)} h ${d%60} min = <b>${d} min</b>.`,'Conte até a hora cheia e depois some o restante.',{unit:'min'});},
 lv=>{const a=R(1,4),half=Math.random()<.5;return NUM(`Quantos meses há em <b>${a} ano${a>1?'s':''}${half?' e meio':''}</b>?`,12*a+(half?6:0),`${a} × 12${half?' + 6':''} = <b>${12*a+(half?6:0)} meses</b>.`,'1 ano = 12 meses; meio ano = 6 meses.',{unit:'meses'});},
 lv=>{const D=['domingo','segunda-feira','terça-feira','quarta-feira','quinta-feira','sexta-feira','sábado'];const d=R(0,6),n=R(8,40);return MC(`Hoje é <b>${D[d]}</b>. Que dia da semana será daqui a <b>${n} dias</b>?`,D[(d+n)%7],D.filter((_,i)=>i!==(d+n)%7),`${n} = ${Math.floor(n/7)} semanas + ${n%7} dias → ${D[(d+n)%7]}.`,'A cada 7 dias o dia da semana se repete: use o resto da divisão por 7.');},
]});
insertSkill('u1','din',{id:'graf1',name:'Gráficos e tabelas',icon:'📊',tip:'Leia o título, as categorias (eixo horizontal) e a escala (eixo vertical) antes de responder.',
theory:`<p>Gráficos de barras comparam quantidades: a <b>altura</b> de cada barra mostra o valor, lido na escala do eixo vertical.</p>
<ul><li>Maior barra → maior valor (moda, "o mais votado").</li><li>Diferença entre barras → subtração.</li><li>Total → soma de todas as barras.</li></ul>
<div class="ex">Futebol 30, Vôlei 15, Basquete 20 → total 65; futebol teve 15 votos a mais que vôlei.</div>`,
gens:(()=>{ const sets=[['Esportes',['Futebol','Vôlei','Basquete','Natação']],['Frutas',['Maçã','Banana','Uva','Laranja']],['Sabores',['Chocolate','Morango','Creme','Limão']],['Transporte',['Ônibus','Carro','Bicicleta','A pé']]];
  const mk=()=>{const s=pick(sets);let v;do{v=[...Array(4)].map(()=>R(1,9)*5);}while(new Set(v).size<4);return {s,v,svg:chartSVG(s[1].map(x=>x.slice(0,8)),v,5)};};
  return [
  lv=>{const {s,v,svg}=mk();const i=v.indexOf(Math.max(...v));return MC(`O gráfico mostra uma votação (${s[0].toLowerCase()}). Qual opção foi a <b>mais votada</b>?`,s[1][i],s[1],`A barra mais alta é a de ${s[1][i]} (${v[i]} votos).`,'Procure a barra mais alta.',{visual:svg,keep:true});},
  lv=>{const {s,v,svg}=mk();const i=R(0,3);return NUM(`Quantos votos teve <b>${s[1][i]}</b>?`,v[i],`A barra de ${s[1][i]} chega em ${v[i]}.`,'Siga o topo da barra até a escala da esquerda.',{visual:svg});},
  lv=>{const {s,v,svg}=mk();const i=v.indexOf(Math.max(...v)),j=v.indexOf(Math.min(...v));return NUM(`Quantos votos <b>${s[1][i]}</b> teve a mais que <b>${s[1][j]}</b>?`,v[i]-v[j],`${v[i]} − ${v[j]} = <b>${v[i]-v[j]}</b>.`,'Leia os dois valores e subtraia.',{visual:svg});},
  lv=>{const {s,v,svg}=mk();return NUM('Quantas pessoas votaram <b>ao todo</b>?',v.reduce((a,b)=>a+b,0),`${v.join(' + ')} = <b>${v.reduce((a,b)=>a+b,0)}</b>.`,'Some os valores de todas as barras.',{visual:svg});},
  lv=>{const {s,v,svg}=mk();const i=v.indexOf(Math.min(...v));return MC('Qual opção recebeu <b>menos</b> votos?',s[1][i],s[1],`A barra mais baixa é a de ${s[1][i]} (${v[i]}).`,'Procure a barra mais baixa.',{visual:svg,keep:true});},
 ];})()});
insertSkill('u2','fracop',{id:'dizima',name:'Dízimas periódicas',icon:'🔁',tip:'Período de 1 algarismo: 0,aaa… = a/9. Período de 2 algarismos: 0,abab… = ab/99. Toda dízima periódica é um número racional.',
theory:`<p>Uma <b>dízima periódica</b> tem casas decimais que se repetem infinitamente: 0,333… · 0,1212…</p>
<h3>Fração geratriz</h3><div class="formula">0,aaa… = ${F('a',9)} · 0,abab… = ${F('ab',99)}</div>
<div class="ex">0,777… = ${F(7,9)} · 0,4545… = ${F(45,99)} = ${F(5,11)} · 1,333… = 1 + ${F(3,9)} = ${F(4,3)}</div>
<h3>Quando uma fração gera dízima?</h3><p>Simplificada, se o denominador tiver fator primo diferente de 2 e 5: ${F(1,3)}, ${F(2,7)} geram dízimas; ${F(3,8)}, ${F(7,20)} dão decimais exatos.</p>
<p>Toda dízima periódica é <b>racional</b> (pode ser escrita como fração).</p>`,
gens:[
 lv=>{const d=R(1,8);return FRAC(`Qual é a fração geratriz de <b>0,${String(d).repeat(3)}…</b>? (ex.: 2/9)`,d,9,`Período de um algarismo: 0,${d}${d}${d}… = ${F(d,9)} = ${Fs(d,9)}.`,'Período de 1 algarismo: divida por 9.');},
 lv=>{let ab;do{ab=R(10,98);}while(ab%11===0);const p=String(ab);return FRAC(`Qual é a fração geratriz de <b>0,${p}${p}${p}…</b>?`,ab,99,`Período de dois algarismos: ${F(ab,99)} = ${Fs(ab,99)}.`,'Período de 2 algarismos: divida por 99.');},
 lv=>{const f=pick([[1,3],[2,3],[1,9],[4,9],[5,9],[8,9],[4,11],[1,11]]);const dec=fmt(round(f[0]/f[1],4)).replace(/,(\d{2})\d*$/,',$1')+'…';return MC(`Qual fração corresponde a <b>${(f[0]/f[1]).toFixed(4).replace('.',',')}…</b>?`,Fs(f[0],f[1]),[Fs(f[0],f[1]*10),Fs(f[0]+1,f[1]),Fs(f[0],10),Fs(f[1],f[0]*10)],`${Fs(f[0],f[1])} = ${f[0]} ÷ ${f[1]} = ${(f[0]/f[1]).toFixed(4).replace('.',',')}…`,'Teste dividindo o numerador pelo denominador.');},
 lv=>{const good=pick([[1,3],[2,7],[5,6],[1,9],[4,15],[7,12]]);const bad=shuffle([[3,8],[7,20],[1,4],[2,5],[9,16],[3,25]]).slice(0,3);return MC('Qual fração gera uma <b>dízima periódica</b>?',F(good[0],good[1]),bad.map(b=>F(b[0],b[1])),`${F(good[0],good[1])}: o denominador tem fator primo diferente de 2 e 5 → dízima. As outras dão decimais exatos.`,'Fatore o denominador: só 2 e 5 → decimal exato.');},
 lv=>{const s=pick([['Toda dízima periódica é um número racional.',true],['0,999… é igual a 1.',true],['√2 = 1,414… é uma dízima periódica.',false],['1/8 gera uma dízima periódica.',false]]);return TF(s[0],s[1],'Dízimas periódicas têm fração geratriz (são racionais); 0,999… = 9/9 = 1; √2 é irracional (não periódico); 1/8 = 0,125 (exato).','Lembre: dízima periódica ↔ fração.');},
]});
insertSkill('u2','eq1',{id:'ineq',name:'Inequações do 1º grau',icon:'↔️',tip:'Resolva como equação, mas ao multiplicar ou dividir por número NEGATIVO, inverta o sinal da desigualdade.',
theory:`<p>Inequações usam &lt;, &gt;, ≤ ou ≥. A solução é um <b>intervalo</b> de valores.</p>
<div class="ex">3x − 2 > 10 → 3x > 12 → <b>x > 4</b></div>
<h3>Atenção ao sinal negativo</h3><p>Multiplicando ou dividindo por número negativo, a desigualdade <b>inverte</b>:</p><div class="ex">−2x + 3 ≤ 11 → −2x ≤ 8 → <b>x ≥ −4</b></div>
<p>"Maior inteiro que satisfaz x &lt; 8" é 7; "menor inteiro que satisfaz x &gt; 4" é 5.</p>`,
gens:[
 lv=>{const a=R(2,6),k=RNZ(-5,8),b=RNZ(-10,10),s=pick(['>','<','≥','≤']);const o={'>':'<','<':'>','≥':'≤','≤':'≥'},H=c=>({'>':'&gt;','<':'&lt;'}[c]||c);return MC(`Resolva: <b>${lin(a,b)} ${H(s)} ${fmt(a*k+b)}</b>`,`x ${H(s)} ${fmt(k)}`,[`x ${H(o[s])} ${fmt(k)}`,`x ${H(s)} ${fmt(-k)}`,`x ${H(s)} ${fmt(k+1)}`],`${a}x ${H(s)} ${fmt(a*k)} → x ${H(s)} ${fmt(k)} (dividimos por ${a}, positivo: o sinal se mantém).`,'Isole x como numa equação.');},
 lv=>{const a=-R(2,5),k=RNZ(-5,6),b=RNZ(-10,10),s=pick(['>','<','≥','≤']);const o={'>':'<','<':'>','≥':'≤','≤':'≥'},H=c=>({'>':'&gt;','<':'&lt;'}[c]||c);return MC(`Resolva: <b>${lin(a,b)} ${H(s)} ${fmt(a*k+b)}</b>`,`x ${H(o[s])} ${fmt(k)}`,[`x ${H(s)} ${fmt(k)}`,`x ${H(o[s])} ${fmt(-k)}`,`x ${H(s)} ${fmt(-k)}`],`${fmt(a)}x ${H(s)} ${fmt(a*k)} → dividindo por ${fmt(a)} (negativo), o sinal <b>inverte</b>: x ${H(o[s])} ${fmt(k)}.`,'Dividiu por negativo? Inverta o sinal!');},
 lv=>{const a=R(2,6),k=R(1,10),b=R(-8,8);return NUM(`Qual é o <b>menor número inteiro</b> que satisfaz <b>${lin(a,b)} &gt; ${fmt(a*k+b)}</b>?`,k+1,`${a}x &gt; ${fmt(a*k)} → x &gt; ${k}. O menor inteiro maior que ${k} é <b>${k+1}</b>.`,'Resolva e pegue o primeiro inteiro acima do limite.');},
 lv=>{const b=R(2,15),k=R(3,15);return NUM(`O dobro de um número, mais <b>${b}</b>, é menor que <b>${2*k+b}</b>. Qual é o <b>maior inteiro</b> possível?`,k-1,`2x + ${b} &lt; ${2*k+b} → 2x &lt; ${2*k} → x &lt; ${k}. Maior inteiro: <b>${k-1}</b>.`,'Monte a inequação e resolva.');},
 lv=>{const s=pick([['Ao multiplicar os dois lados de uma inequação por −1, o sinal se inverte.',true],['Somar o mesmo número aos dois lados muda o sentido da desigualdade.',false],['x = 5 satisfaz x ≥ 5.',true],['x = 5 satisfaz x > 5.',false]]);return TF(s[0],s[1],'Só multiplicar/dividir por negativo inverte o sinal; ≥ inclui o próprio número, > não inclui.','Revise as regras das inequações.');},
]});
insertSkill('u3','pit',{id:'tales',name:'Semelhança e Teorema de Tales',icon:'🔺',tip:'Figuras semelhantes têm lados proporcionais (razão k) e ângulos iguais. Áreas ficam multiplicadas por k².',
theory:`<p>Dois triângulos são <b>semelhantes</b> quando têm os mesmos ângulos; então seus lados são <b>proporcionais</b>.</p>
<div class="formula">${F("a'",'a')} = ${F("b'",'b')} = ${F("c'",'c')} = k</div><p>Se os lados são multiplicados por k, a área é multiplicada por <b>k²</b>.</p>
<h3>Sombras</h3><div class="ex">Um poste faz sombra de 6 m quando uma pessoa de 1,8 m faz sombra de 1,2 m: ${F('H',6)} = ${F('1,8','1,2')} → H = 9 m</div>
<h3>Teorema de Tales</h3><p>Retas paralelas cortadas por transversais determinam segmentos proporcionais: ${F('a','b')} = ${F('c','d')}.</p>`,
gens:[
 lv=>{const k=pick([2,3,4,1.5,2.5]),a=R(2,12);return NUM(`Dois triângulos são semelhantes com razão <b>k = ${fmt(k)}</b> (o maior é ${fmt(k)} vezes o menor). Um lado do menor mede <b>${a} cm</b>. Quanto mede o lado correspondente do maior?`,a*k,`${a} × ${fmt(k)} = <b>${fmt(a*k)} cm</b>.`,'Multiplique pela razão de semelhança.',{unit:'cm'});},
 lv=>{const p=pick([[1.8,1.2,6,9],[1.5,1,8,12],[2,1,5,10],[1.6,0.8,7,14],[1.5,2,12,9]]);return NUM(`Uma pessoa de <b>${fmt(p[0])} m</b> projeta sombra de <b>${fmt(p[1])} m</b>. No mesmo instante, um prédio projeta sombra de <b>${p[2]} m</b>. Qual a altura do prédio?`,p[3],`${F('H',p[2])} = ${F(fmt(p[0]),fmt(p[1]))} → H = ${p[2]} · ${fmt(p[0])} ÷ ${fmt(p[1])} = <b>${p[3]} m</b>.`,'Monte a proporção altura/sombra.',{unit:'m'});},
 lv=>{const a=R(2,8),b=a+R(1,5),k=R(2,4);return FILL('Pelo Teorema de Tales, complete:',`${F(a,b)} = <span class="fr"><span>${a*k}</span><span>@@</span></span>`,b*k,`Segmentos proporcionais: x = ${b} · ${a*k} ÷ ${a} = <b>${b*k}</b>.`,'Multiplique em cruz.');},
 lv=>{const k=pick([2,3,4,5]);return MC(`Se os lados de uma figura são multiplicados por <b>${k}</b>, a área fica multiplicada por:`,String(k*k),[String(k),String(2*k),String(k**3)],`Área ∝ k² = ${k}² = ${k*k}.`,'A área depende de duas dimensões.');},
 lv=>{const s=pick([['Dois triângulos com os três ângulos iguais são semelhantes.',true],['Todo par de retângulos é semelhante.',false],['Todos os quadrados são semelhantes entre si.',true],['Em figuras semelhantes, os perímetros têm a mesma razão k dos lados.',true]]);return TF(s[0],s[1],'Triângulos com ângulos iguais são semelhantes; quadrados sempre; retângulos nem sempre; perímetros seguem a razão k (áreas, k²).','Semelhança = mesma forma, tamanhos proporcionais.');},
]});
insertSkill('u3','tales',{id:'relmet',name:'Relações métricas no triângulo',icon:'📐',tip:'No triângulo retângulo com altura h sobre a hipotenusa a (projeções m e n): h² = m·n; b² = a·m; c² = a·n; a·h = b·c.',
theory:`<p>Traçando a altura h relativa à hipotenusa a, ela fica dividida nas projeções <b>m</b> e <b>n</b> (m + n = a).</p>
<div class="formula">h² = m · n · b² = a · m · c² = a · n · a · h = b · c</div>
<div class="ex">m = 4 e n = 9 → h² = 36 → h = 6</div><div class="ex">Catetos 6 e 8, hipotenusa 10 → h = 6·8/10 = 4,8</div>`,
gens:[
 lv=>{const p=pick([[4,9,6],[1,4,2],[2,8,4],[3,12,6],[4,16,8],[9,16,12],[1,9,3],[2,18,6],[8,18,12]]);return NUM(`Num triângulo retângulo, a altura relativa à hipotenusa a divide em projeções de <b>${p[0]}</b> e <b>${p[1]}</b>. Quanto mede a altura?`,p[2],`h² = m·n = ${p[0]}·${p[1]} = ${p[0]*p[1]} → h = <b>${p[2]}</b>.`,'h² = m·n.');},
 lv=>{const [b,c,a]=pick([[3,4,5],[6,8,10],[9,12,15],[12,16,20]]);return NUM(`Um triângulo retângulo tem catetos <b>${b}</b> e <b>${c}</b> e hipotenusa <b>${a}</b>. Qual a altura relativa à hipotenusa?`,b*c/a,`a·h = b·c → h = ${b}·${c}/${a} = <b>${fmt(b*c/a)}</b>.`,'a·h = b·c.',{keys:[',']});},
 lv=>{const p=pick([[25,15,9],[50,30,18],[10,6,3.6],[20,12,7.2]]);return NUM(`Num triângulo retângulo de hipotenusa <b>${p[0]}</b>, um cateto mede <b>${p[1]}</b>. Qual a projeção desse cateto sobre a hipotenusa?`,p[2],`b² = a·m → m = ${p[1]}²/${p[0]} = ${p[1]*p[1]}/${p[0]} = <b>${fmt(p[2])}</b>.`,'b² = a·m.',{keys:[',']});},
 lv=>{const q=pick([['h² (altura relativa à hipotenusa)','m · n'],['b² (cateto b)','a · m'],['a · h','b · c'],['a² (hipotenusa)','b² + c²']]);return MC(`No triângulo retângulo (hipotenusa a, catetos b e c, projeções m e n), <b>${q[0]}</b> é igual a:`,q[1],['m · n','a · m','b · c','b² + c²','a · n'].filter(x=>x!==q[1]),`Relação métrica: ${q[0]} = ${q[1]}.`,'Revise as relações métricas.');},
]});
insertSkill('u4','conj',{id:'funcao',name:'Funções: conceito, composta e inversa',icon:'🔣',tip:'Função associa a cada x um único y. Composta: f(g(x)) → calcule g primeiro. Inversa: troque x e y e isole.',
theory:`<p>Uma <b>função</b> f: A → B associa a cada elemento x de A <b>um único</b> y = f(x) de B.</p>
<h3>Domínio</h3><ul><li>f(x) = 1/(x − a): x ≠ a (não se divide por zero)</li><li>f(x) = √(x − a): x ≥ a</li></ul>
<h3>Função composta</h3><p>f(g(x)): aplique primeiro g e depois f.</p><div class="ex">f(x) = 2x + 1, g(x) = x − 3 → f(g(5)) = f(2) = 5</div>
<h3>Função inversa</h3><p>Troque x por y e isole y: f(x) = 3x − 6 → f⁻¹(x) = (x + 6)/3.</p>`,
gens:[
 lv=>{const a=RNZ(-4,4),b=R(-6,6),c=RNZ(-3,3),d=R(-5,5),k=R(-3,4);const g=c*k+d;return NUM(`Sendo <b>f(x) = ${lin(a,b)}</b> e <b>g(x) = ${lin(c,d)}</b>, calcule <b>f(g(${fmt(k)}))</b>.`,a*g+b,`g(${fmt(k)}) = ${fmt(g)}; f(${fmt(g)}) = ${a}·${par(g)} ${b<0?'− '+(-b):'+ '+b} = <b>${fmt(a*g+b)}</b>.`,'Calcule primeiro a função de dentro.',{keys:['−']});},
 lv=>{const a=RNZ(-5,5),b=R(-10,10),y0=R(-5,8);const y=a*y0+b;return NUM(`Sendo <b>f(x) = ${lin(a,b)}</b>, calcule <b>f⁻¹(${fmt(y)})</b>.`,y0,`f⁻¹(y) é o x tal que f(x) = y: ${lin(a,b)} = ${fmt(y)} → x = <b>${fmt(y0)}</b>.`,'Resolva f(x) = valor dado.',{keys:['−']});},
 lv=>{const a=R(-6,9),t=Math.random()<.5;return t?MC(`Qual é o domínio de <b>f(x) = ${F(1,lin(1,-a))}</b>?`,`x ≠ ${fmt(a)}`,[`x ≠ ${fmt(-a)}`,`x > ${fmt(a)}`,'todos os reais'],`O denominador não pode ser zero: x − ${par(a)} ≠ 0 → x ≠ ${fmt(a)}.`,'Não existe divisão por zero.'):MC(`Qual é o domínio de <b>f(x) = √(${lin(1,-a)})</b>?`,`x ≥ ${fmt(a)}`,[`x > ${fmt(a)}`,`x ≤ ${fmt(a)}`,`x ≥ ${fmt(-a)}`],`O radicando não pode ser negativo: x − ${par(a)} ≥ 0 → x ≥ ${fmt(a)}.`,'Raiz quadrada de negativo não é real.');},
 lv=>{const a=RNZ(-4,5),b=R(-6,6);const xs=[0,1,2,3];return MC(`A tabela mostra x → f(x): ${xs.map(x=>`(${x}, ${fmt(a*x+b)})`).join(' ')}. Qual é a lei da função?`,`f(x) = ${lin(a,b)}`,[`f(x) = ${lin(b||1,a)}`,`f(x) = ${lin(a,-b||1)}`,`f(x) = ${lin(-a,b)}`],`Quando x aumenta 1, f aumenta ${fmt(a)} (a = ${fmt(a)}); f(0) = ${fmt(b)} (b).`,'Olhe f(0) e quanto f varia quando x aumenta 1.');},
 lv=>{const a=R(-3,3),b=R(-4,4),k=R(-3,4);return NUM(`Dada <b>f(x) = ${quad(1,a,b)}</b>, calcule <b>f(${fmt(k)})</b>.`,k*k+a*k+b,`f(${fmt(k)}) = ${par(k)}² ${a<0?'− '+(-a):'+ '+a}·${par(k)} ${b<0?'− '+(-b):'+ '+b} = <b>${fmt(k*k+a*k+b)}</b>.`,'Substitua x pelo número.',{keys:['−']});},
]});
insertSkill('u4','fquad',{id:'polin',name:'Polinômios',icon:'🧮',tip:'P(a) = resto da divisão de P(x) por (x − a). Se P(a) = 0, a é raiz. P(1) = soma dos coeficientes.',
theory:`<p>Polinômio: P(x) = aₙxⁿ + … + a₁x + a₀. O <b>grau</b> é o maior expoente com coeficiente não nulo.</p>
<h3>Valor numérico e raízes</h3><p>P(a) é o valor do polinômio em x = a. Se P(a) = 0, então a é <b>raiz</b>.</p>
<h3>Teorema do resto</h3><div class="formula">Resto de P(x) ÷ (x − a) = P(a)</div>
<p>Soma dos coeficientes = P(1). Termo independente = P(0).</p>
<div class="ex">P(x) = x³ − 2x + 5 → resto da divisão por (x − 2) = P(2) = 8 − 4 + 5 = 9</div>`,
gens:[
 lv=>{const c=[R(1,3),R(-4,4),R(-5,5),R(-6,6)],k=R(-2,3);const v=c[0]*k**3+c[1]*k*k+c[2]*k+c[3];return NUM(`Calcule <b>P(${fmt(k)})</b> para <b>P(x) = ${poly(c,['x<sup>3</sup>',X2,'x',''])}</b>.`,v,`Substituindo x = ${fmt(k)}: <b>${fmt(v)}</b>.`,'Substitua x e calcule com cuidado os sinais.',{keys:['−']});},
 lv=>{const c=[R(1,3),R(-4,4),R(-5,5),R(-6,6)],a=R(-3,3);const v=c[0]*a**3+c[1]*a*a+c[2]*a+c[3];return NUM(`Qual é o <b>resto</b> da divisão de <b>P(x) = ${poly(c,['x<sup>3</sup>',X2,'x',''])}</b> por <b>(${lin(1,-a)})</b>?`,v,`Teorema do resto: resto = P(${fmt(a)}) = <b>${fmt(v)}</b>.`,'O resto da divisão por (x − a) é P(a).',{keys:['−']});},
 lv=>{const c=[R(1,5),RNZ(-5,5),R(-6,6),RNZ(-9,9)];return NUM(`Qual é a <b>soma dos coeficientes</b> de <b>P(x) = ${poly(c,['x<sup>3</sup>',X2,'x',''])}</b>?`,c.reduce((a,b)=>a+b,0),`Soma dos coeficientes = P(1) = ${c.map(fmt).join(' + ').replace(/\+ −/g,'− ')} = <b>${fmt(c.reduce((a,b)=>a+b,0))}</b>.`,'Calcule P(1).',{keys:['−']});},
 lv=>{let r=shuffle([-3,-2,-1,1,2,3,4]).slice(0,3);const c=[1,-(r[0]+r[1]+r[2]),r[0]*r[1]+r[0]*r[2]+r[1]*r[2],-r[0]*r[1]*r[2]];const cand=[-4,-3,-2,-1,0,1,2,3,4,5].filter(x=>!r.includes(x));return MC(`Qual número é <b>raiz</b> de <b>P(x) = ${poly(c,['x<sup>3</sup>',X2,'x',''])}</b>?`,fmt(r[0]),shuffle(cand).slice(0,3).map(fmt),`P(${fmt(r[0])}) = 0. As raízes são ${r.map(fmt).join(', ')}.`,'Substitua cada opção: raiz zera o polinômio.');},
 lv=>{const n=R(2,7),lead=RNZ(-5,5);return MC(`Qual é o <b>grau</b> de <b>P(x) = ${poly([lead,R(1,5),R(-5,5)],['x<sup>'+n+'</sup>',X2,''])}</b>?`,String(n),[String(n+1),'2',fmt(lead)].filter(x=>x!==String(n)),`O maior expoente com coeficiente não nulo é ${n}.`,'Grau = maior expoente.');},
]});
insertSkill('u4','fafim',{id:'modul',name:'Módulo e função modular',icon:'｜',tip:'|x| é a distância de x até 0. |x − a| = b → x = a ± b. |x| < a → −a < x < a.',
theory:`<div class="formula">|x| = x, se x ≥ 0 · |x| = −x, se x < 0</div><p>O módulo é a <b>distância</b> até zero na reta; nunca é negativo. |a − b| é a distância entre a e b.</p>
<h3>Equações e inequações</h3><ul><li>|x − a| = b (b ≥ 0) → x = a − b ou x = a + b</li><li>|x| < a → −a < x < a</li><li>|x| > a → x < −a ou x > a</li></ul>
<div class="ex">|x − 3| = 5 → x = −2 ou x = 8</div><p>O gráfico de f(x) = |x| tem forma de "V", com vértice na origem.</p>`,
gens:[
 lv=>{const a=RNZ(-12,12),b=RNZ(-12,12);return NUM(`Calcule <b>|${fmt(a)}| + |${fmt(b)}|</b>`,Math.abs(a)+Math.abs(b),`|${fmt(a)}| = ${Math.abs(a)} e |${fmt(b)}| = ${Math.abs(b)} → <b>${Math.abs(a)+Math.abs(b)}</b>.`,'Módulo tira o sinal (é distância até zero).');},
 lv=>{const p=R(-15,15),q=R(-15,15);return NUM(`Qual é a distância entre <b>${fmt(p)}</b> e <b>${fmt(q)}</b> na reta numérica?`,Math.abs(p-q),`|${fmt(p)} − ${par(q)}| = <b>${Math.abs(p-q)}</b>.`,'Distância = |a − b|.');},
 lv=>{const a=R(-6,8),b=R(1,9);const S=(x,y)=>`S = {${fmt(Math.min(x,y))}, ${fmt(Math.max(x,y))}}`;return MC(`Resolva <b>|${lin(1,-a)}| = ${b}</b>`,S(a-b,a+b),[S(-a-b,-a+b),`S = {${fmt(a+b)}}`,S(b-a,a+b)],`x − ${par(a)} = ±${b} → x = ${fmt(a-b)} ou x = ${fmt(a+b)}.`,'|x − a| = b tem duas soluções: a − b e a + b.');},
 lv=>{const a=R(1,9),t=Math.random()<.5;return t?MC(`Resolva <b>|x| &lt; ${a}</b>`,`−${a} &lt; x &lt; ${a}`,[`x &lt; ${a}`,`x &lt; −${a} ou x &gt; ${a}`,`0 &lt; x &lt; ${a}`],`Distância até 0 menor que ${a}: −${a} < x < ${a}.`,'|x| < a: x fica "entre" −a e a.'):MC(`Resolva <b>|x| &gt; ${a}</b>`,`x &lt; −${a} ou x &gt; ${a}`,[`−${a} &lt; x &lt; ${a}`,`x &gt; ${a}`,`x &gt; −${a}`],`Distância até 0 maior que ${a}: x < −${a} ou x > ${a}.`,'|x| > a: x fica "fora" do intervalo.');},
 lv=>{const k=R(-6,6);return NUM(`Dada <b>f(x) = |2x − 6|</b>, calcule <b>f(${fmt(k)})</b>.`,Math.abs(2*k-6),`f(${fmt(k)}) = |2·${par(k)} − 6| = |${fmt(2*k-6)}| = <b>${Math.abs(2*k-6)}</b>.`,'Calcule dentro do módulo e depois tire o sinal.');},
]});
insertSkill('u5','trig',{id:'leissc',name:'Lei dos senos e dos cossenos',icon:'📏',tip:'Lei dos cossenos: a² = b² + c² − 2bc·cos Â. Lei dos senos: a/sen Â = b/sen B̂ = 2R.',
theory:`<p>Valem para <b>qualquer</b> triângulo (não só o retângulo).</p>
<h3>Lei dos cossenos</h3><div class="formula">a² = b² + c² − 2·b·c·cos Â</div><p>Use quando conhece <b>dois lados e o ângulo entre eles</b>. cos 60° = 1/2; cos 120° = −1/2.</p><div class="ex">b = 8, c = 5, Â = 60° → a² = 64 + 25 − 40 = 49 → a = 7</div>
<h3>Lei dos senos</h3><div class="formula">${F('a','sen Â')} = ${F('b','sen B̂')} = ${F('c','sen Ĉ')} = 2R</div><p>Use com <b>dois ângulos e um lado</b>. R é o raio da circunferência circunscrita.</p>`,
gens:[
 lv=>{const p=pick([[8,5,7],[8,3,7],[15,8,13],[16,6,14],[16,10,14],[7,15,13],[5,8,7]]);return NUM(`Num triângulo, dois lados medem <b>${p[0]}</b> e <b>${p[1]}</b> e formam um ângulo de <b>60°</b>. Quanto mede o terceiro lado? (cos 60° = 0,5)`,p[2],`a² = ${p[0]}² + ${p[1]}² − 2·${p[0]}·${p[1]}·0,5 = ${p[0]**2} + ${p[1]**2} − ${p[0]*p[1]} = ${p[2]**2} → a = <b>${p[2]}</b>.`,'Lei dos cossenos: a² = b² + c² − 2bc·cos Â.');},
 lv=>{const p=pick([[3,5,7],[5,3,7],[7,8,13],[5,16,19],[6,10,14]]);return NUM(`Dois lados de <b>${p[0]}</b> e <b>${p[1]}</b> formam um ângulo de <b>120°</b>. Quanto mede o terceiro lado? (cos 120° = −0,5)`,p[2],`a² = ${p[0]**2} + ${p[1]**2} − 2·${p[0]}·${p[1]}·(−0,5) = ${p[0]**2+p[1]**2+p[0]*p[1]} → a = <b>${p[2]}</b>.`,'Com ângulo obtuso, o cosseno é negativo: o termo vira soma.');},
 lv=>{const a=R(2,20);return NUM(`Num triângulo, o lado oposto a um ângulo de <b>30°</b> mede <b>${a}</b>. Qual o raio da circunferência circunscrita? (sen 30° = 0,5)`,a,`${F(a,'sen 30°')} = 2R → ${a}/0,5 = 2R → R = <b>${a}</b>.`,'Lei dos senos: a/sen Â = 2R.');},
 lv=>{const a=R(2,12);return MC(`Num triângulo, o lado oposto a <b>30°</b> mede <b>${a}</b>. Quanto mede o lado oposto a <b>45°</b>?`,`${a}√2`,[`${2*a}`,`${a}√3`,`${a}/2`],`${F(a,'1/2')} = ${F('b','√2/2')} → b = ${a}·(√2/2)·2 = ${a}√2.`,'Lei dos senos: a/sen A = b/sen B.');},
 lv=>{const q=pick([['Conheço dois lados e o ângulo entre eles.','Lei dos cossenos'],['Conheço dois ângulos e um lado.','Lei dos senos'],['Conheço os três lados e quero um ângulo.','Lei dos cossenos'],['O triângulo é retângulo e conheço dois lados.','Teorema de Pitágoras']]);return MC(`Qual ferramenta usar? <b>${q[0]}</b>`,q[1],['Lei dos cossenos','Lei dos senos','Teorema de Pitágoras'],`${q[0]} → ${q[1]}.`,'Cossenos: lados + ângulo entre eles. Senos: pares lado/ângulo oposto.',{keep:true});},
]});
insertSkill('u5','comb',{id:'binom',name:'Binômio de Newton',icon:'🔺',tip:'(x + y)ⁿ tem n + 1 termos; coeficientes = linha n do triângulo de Pascal = C(n, k). Soma dos coeficientes: troque as letras por 1.',
theory:`<div class="formula">(x + y)<sup>n</sup> = Σ C(n, k) · x<sup>n−k</sup> · y<sup>k</sup></div>
<ul><li>Tem <b>n + 1</b> termos.</li><li>Os coeficientes formam a linha n do <b>triângulo de Pascal</b>: 1, 3, 3, 1 (n = 3); 1, 4, 6, 4, 1 (n = 4).</li><li>Soma dos coeficientes: substitua as variáveis por 1 → (1 + 1)ⁿ = 2ⁿ.</li></ul>
<div class="ex">(x + 1)³ = x³ + 3x² + 3x + 1</div><div class="ex">Coeficiente de x² em (x + 1)⁵ = C(5, 2) = 10</div>`,
gens:[
 lv=>{const n=R(2,15);return NUM(`Quantos termos tem o desenvolvimento de <b>(x + y)<sup>${n}</sup></b>?`,n+1,`n + 1 = <b>${n+1}</b> termos.`,'(x + y)ⁿ tem n + 1 termos.');},
 lv=>{const n=R(2,10),b=pick([1,2]);return NUM(`Qual é a soma dos coeficientes de <b>(x + ${b})<sup>${n}</sup></b>?`,(1+b)**n,`Substituindo x = 1: (1 + ${b})<sup>${n}</sup> = <b>${nf((1+b)**n)}</b>.`,'Troque a variável por 1.');},
 lv=>{const n=R(3,8),k=R(1,n-1);return NUM(`Qual é o coeficiente de <b>x<sup>${k}</sup></b> em <b>(x + 1)<sup>${n}</sup></b>?`,nCr(n,k),`C(${n}, ${k}) = <b>${nCr(n,k)}</b>.`,'Use o triângulo de Pascal ou C(n, k).');},
 lv=>{const n=R(3,6);const row=[...Array(n+1)].map((_,k)=>nCr(n,k)).join(', ');return MC(`Qual é a linha <b>${n}</b> do triângulo de Pascal?`,row,[[...Array(n)].map((_,k)=>nCr(n-1,k)).join(', '),[...Array(n+2)].map((_,k)=>nCr(n+1,k)).join(', '),[...Array(n+1)].map((_,k)=>k+1).join(', ')],`Coeficientes de (x + y)<sup>${n}</sup>: ${row}.`,'Cada número é a soma dos dois acima dele.');},
 lv=>{const a=R(1,4);return MC(`Desenvolva <b>(x + ${a})<sup>3</sup></b>`,poly([1,3*a,3*a*a,a**3],['x<sup>3</sup>',X2,'x','']),[poly([1,a**3],['x<sup>3</sup>','']),poly([1,3*a,3*a,a**3],['x<sup>3</sup>',X2,'x','']),poly([1,a,a*a,a**3],['x<sup>3</sup>',X2,'x',''])],`Coeficientes 1, 3, 3, 1: x³ + 3·${a}x² + 3·${a*a}x + ${a**3}.`,'Linha 3 do triângulo de Pascal: 1, 3, 3, 1.');},
]});
insertSkill('u5','prob',{id:'estat2',name:'Estatística: dispersão',icon:'📉',tip:'Variância = média dos quadrados dos desvios; desvio padrão = √variância. Somar constante não muda a dispersão; multiplicar por k multiplica o desvio por k.',
theory:`<p>Medidas de dispersão mostram o quanto os dados se <b>espalham</b> em torno da média.</p>
<div class="formula">Variância = ${F('Σ(xᵢ − x̄)²','n')} · Desvio padrão = √variância</div>
<div class="ex">Dados 4, 8, 4, 8: média 6; desvios −2, 2, −2, 2; variância = 16/4 = 4; desvio padrão = 2</div>
<ul><li>Somar k a todos os dados: média + k, desvio padrão <b>igual</b>.</li><li>Multiplicar todos por k: média × k, desvio padrão × k.</li><li>Desvio padrão 0 → todos os dados iguais.</li></ul>`,
gens:[
 lv=>{const m=R(5,20),a=R(1,5),n=pick([2,3]);const v=shuffle([...Array(n)].flatMap(()=>[m-a,m+a]));return NUM(`Qual é o <b>desvio padrão</b> dos dados: ${v.join(', ')}?`,a,`Média ${m}; cada desvio vale ±${a}; variância = ${a*a}; desvio padrão = <b>${a}</b>.`,'Calcule a média e os desvios de cada valor.');},
 lv=>{const m=R(5,20),a=R(1,5);const v=shuffle([m-a,m+a,m-a,m+a]);return NUM(`Qual é a <b>variância</b> dos dados: ${v.join(', ')}?`,a*a,`Média ${m}; desvios ao quadrado = ${a*a} cada; variância = <b>${a*a}</b>.`,'Variância = média dos quadrados dos desvios.');},
 lv=>{const k=R(2,10),t=Math.random()<.5;return MC(`Se ${t?`<b>somarmos ${k}</b> a`:`<b>multiplicarmos por ${k}</b>`} todos os dados, o desvio padrão:`,t?'não muda':`fica multiplicado por ${k}`,['não muda',`fica multiplicado por ${k}`,`aumenta ${k}`,`fica multiplicado por ${k*k}`].filter(x=>x!==(t?'não muda':`fica multiplicado por ${k}`)),t?'Somar uma constante desloca os dados, mas não muda o espalhamento.':`Multiplicar os dados por ${k} multiplica as distâncias à média por ${k}.`,'Pense no espalhamento dos dados.');},
 lv=>{const m=R(10,20);const sets=[[m,m,m,m],[m-1,m+1,m-1,m+1],[m-3,m+3,m-2,m+2],[m-8,m+8,m-6,m+6]];const i=R(2,3);const S=v=>`{${v.join(', ')}}`;return MC('Qual conjunto tem <b>maior dispersão</b>? (todos têm a mesma média)',S(sets[3]),[S(sets[0]),S(sets[1]),S(sets[2])],'Os valores mais afastados da média geram maior desvio padrão.','Veja qual conjunto está mais "espalhado".');},
 lv=>TF('Se todos os valores de um conjunto são iguais, o desvio padrão é zero.',true,'Não há afastamento em relação à média → desvio padrão 0.','Desvio padrão mede afastamento da média.'),
]});

/* ------------------------ UNIDADE 6 — RUMO AO ENEM ------------------------ */
UNITS.push({id:'u6',title:'Rumo ao ENEM',sub:'Problemas contextualizados: escalas, gráficos, geometria do dia a dia, finanças e lógica',color:'#2b70c9',dark:'#1f569e',skills:[
{id:'enemesc',name:'Escalas, receitas e misturas',icon:'🗺️',tip:'Tudo é proporção: identifique a razão (escala, receita, concentração) e aplique a regra de três.',
theory:`<h3>Escalas</h3><p>Escala 1 : 50 (planta) → 1 cm no desenho = 50 cm reais. Mapa 1 : 200 000 → 1 cm = 2 km.</p>
<h3>Receitas</h3><p>Se a receita serve 4 e você quer servir 10, multiplique tudo por 10/4 = 2,5.</p>
<h3>Misturas</h3><p>"1 parte de concentrado para 3 de água" → 4 partes no total; o concentrado é 1/4 da mistura.</p>
<div class="ex">2 L de suco na proporção 1 : 3 → concentrado = 2000/4 = 500 mL</div>`,
gens:[
 lv=>{const e=pick([50,100,200]),cm=R(2,15);return NUM(`Numa planta na escala <b>1 : ${e}</b>, uma parede mede <b>${cm} cm</b>. Qual o comprimento real, em metros?`,cm*e/100,`${cm} × ${e} = ${cm*e} cm = <b>${fmt(cm*e/100)} m</b>.`,'Multiplique pela escala e converta cm → m.',{unit:'m',keys:[',']});},
 lv=>{const s=pick([2,4,6]),t=s*pick([2,3]),q=pick([200,300,150,250]);return NUM(`Uma receita para <b>${s} pessoas</b> usa <b>${q} g</b> de farinha. Quantos gramas são necessários para <b>${t} pessoas</b>?`,q*t/s,`Fator ${t}/${s} = ${t/s}: ${q} × ${t/s} = <b>${q*t/s} g</b>.`,'Descubra quantas vezes a receita aumentou.',{unit:'g'});},
 lv=>{const p=pick([3,4,5]),L=pick([1,2,3]);return NUM(`Um suco é feito com <b>1 parte</b> de concentrado para <b>${p} partes</b> de água. Para fazer <b>${L} L</b> de suco, quantos mL de concentrado são necessários?`,L*1000/(p+1),`Total de partes: ${p+1}. Concentrado = ${L*1000}/${p+1} = <b>${fmt(L*1000/(p+1))} mL</b>.`,'Some as partes para achar a fração do concentrado.',{unit:'mL',tol:0.5});},
 lv=>{const e=pick([100000,200000,500000]),km=R(2,20)*e/100000;return NUM(`Num mapa de escala <b>1 : ${nf(e)}</b>, duas cidades distam <b>${fmt(km)} km</b>. Qual a distância no mapa, em cm?`,km*100000/e,`${fmt(km)} km = ${nf(km*100000)} cm; ÷ ${nf(e)} = <b>${fmt(km*100000/e)} cm</b>.`,'Converta km para cm e divida pela escala.',{unit:'cm'});},
 lv=>{const c=pick([5,10,20]),V=pick([2,4,5]);return NUM(`Um remédio deve ser diluído: <b>${c} mL</b> para cada <b>1 L</b> de água. Quantos mL para <b>${V} L</b>?`,c*V,`${c} × ${V} = <b>${c*V} mL</b>.`,'Proporção direta.',{unit:'mL'});},
]},
{id:'enemgraf',name:'Gráficos e porcentagens no ENEM',icon:'📈',tip:'Variação percentual = (novo − antigo) ÷ antigo × 100. Leia a escala do gráfico com cuidado.',
theory:`<div class="formula">variação % = ${F('valor novo − valor antigo','valor antigo')} × 100</div>
<div class="ex">De 40 para 50: (50 − 40)/40 = 0,25 → aumento de 25%</div><div class="ex">De 80 para 60: (60 − 80)/80 = −0,25 → queda de 25%</div>
<p>Em gráficos de linha, observe tendências (subida, queda), o maior e o menor valor e a média do período.</p>`,
gens:(()=>{ const M=['Jan','Fev','Mar','Abr','Mai'];
  const mk=()=>{let v;do{v=[...Array(5)].map(()=>R(2,10)*10);}while(new Set(v).size<5);return {v,svg:lineSVG(M,v,20)};};
  return [
  lv=>{const {v,svg}=mk();const i=v.indexOf(Math.max(...v));return MC('O gráfico mostra o preço de um produto (R$). Em qual mês o preço foi <b>maior</b>?',M[i],M,`O ponto mais alto é ${M[i]} (R$ ${v[i]}).`,'Procure o ponto mais alto da linha.',{visual:svg,keep:true});},
  lv=>{const p=pick([[40,50],[80,100],[50,60],[20,30],[60,90],[100,80],[80,60],[50,40]]);const pct=(p[1]-p[0])/p[0]*100;return NUM(`O preço de um produto passou de <b>R$ ${p[0]}</b> para <b>R$ ${p[1]}</b>. Qual foi a variação percentual? (use sinal negativo para queda)`,pct,`(${p[1]} − ${p[0]}) ÷ ${p[0]} × 100 = <b>${fmt(pct)}%</b>.`,'Divida a diferença pelo valor antigo.',{unit:'%',keys:['−',',']});},
  lv=>{const {v,svg}=mk();return NUM('Qual foi o preço <b>médio</b> no período mostrado?',v.reduce((a,b)=>a+b,0)/5,`(${v.join(' + ')}) ÷ 5 = <b>${fmt(v.reduce((a,b)=>a+b,0)/5)}</b>.`,'Some os 5 valores e divida por 5.',{visual:svg,unit:'R$',keys:[',']});},
  lv=>{const {v,svg}=mk();const d=v.slice(1).map((x,i)=>x-v[i]);const i=d.indexOf(Math.max(...d));if(d[i]<=0) return MC('Pelo gráfico, o preço:', 'Não subiu em nenhum mês',['Subiu todos os meses','Ficou constante','Dobrou'],'Todas as variações foram quedas.','Compare meses vizinhos.',{visual:svg});return MC('Entre quais meses consecutivos ocorreu o <b>maior aumento</b>?',`${M[i]} → ${M[i+1]}`,M.slice(0,4).map((m,j)=>`${m} → ${M[j+1]}`),`De ${M[i]} (R$ ${v[i]}) para ${M[i+1]} (R$ ${v[i+1]}): +R$ ${d[i]}.`,'Calcule a diferença entre meses vizinhos.',{visual:svg,keep:true});},
  lv=>{const t=R(2,9)*100,p=pick([10,15,20,25,30,40]);return NUM(`Numa pesquisa com <b>${t}</b> pessoas, <b>${p}%</b> preferem a opção A. Quantas pessoas são?`,t*p/100,`${p}% de ${t} = <b>${t*p/100}</b>.`,'Porcentagem de um total.',{unit:'pessoas'});},
 ];})()},
{id:'enemgeo',name:'Geometria do cotidiano',icon:'🏠',tip:'Área para pisos, tinta e terrenos (m²); volume para caixas, piscinas e reservatórios (1 m³ = 1000 L).',
theory:`<ul><li><b>Pisos/azulejos</b>: nº de peças = área do cômodo ÷ área de uma peça.</li><li><b>Tinta</b>: latas = área ÷ rendimento por lata (arredonde para cima!).</li><li><b>Reservatórios</b>: V = comprimento × largura × profundidade; 1 m³ = 1000 L.</li></ul>
<div class="ex">Piscina 8 m × 4 m × 1,5 m = 48 m³ = 48 000 L</div><div class="ex">Sala 4 m × 5 m com piso 0,5 m × 0,5 m → 20 ÷ 0,25 = 80 peças</div>`,
gens:[
 lv=>{const c=R(4,12),l=R(2,6),p=pick([1,1.5,2]);return NUM(`Uma piscina tem <b>${c} m</b> de comprimento, <b>${l} m</b> de largura e <b>${fmt(p)} m</b> de profundidade. Quantos <b>litros</b> ela comporta?`,c*l*p*1000,`V = ${c}·${l}·${fmt(p)} = ${fmt(c*l*p)} m³ = <b>${nf(c*l*p*1000)} L</b>.`,'Calcule em m³ e multiplique por 1000.',{unit:'L'});},
 lv=>{const a=R(3,8),b=R(3,8),t=pick([0.5,0.25]);const side=t===0.5?'50 cm × 50 cm':'25 cm × 100 cm';return NUM(`Uma sala de <b>${a} m × ${b} m</b> será coberta com peças de <b>${side}</b>. Quantas peças são necessárias (sem perdas)?`,a*b/t,`Área da sala: ${a*b} m²; área da peça: ${fmt(t)} m² → ${a*b} ÷ ${fmt(t)} = <b>${a*b/t}</b> peças.`,'Divida a área da sala pela área de uma peça (em m²).');},
 lv=>{const A=R(30,120),r=pick([20,25,40]);return NUM(`Uma lata de tinta pinta <b>${r} m²</b>. Quantas latas são necessárias para pintar <b>${A} m²</b>?`,Math.ceil(A/r),`${A} ÷ ${r} = ${fmt(round(A/r,2))} → como não se compra fração de lata: <b>${Math.ceil(A/r)} latas</b>.`,'Arredonde para cima!',{unit:'latas'});},
 lv=>{const L=R(4,10)*2,x=R(1,3);return NUM(`De uma folha quadrada de <b>${L} cm</b> de lado, cortam-se quadrados de <b>${x} cm</b> nos cantos e dobram-se as abas para formar uma caixa. Qual o volume da caixa?`,(L-2*x)**2*x,`Base: (${L} − ${2*x})² = ${(L-2*x)**2} cm²; altura ${x} cm → V = <b>${(L-2*x)**2*x} cm³</b>.`,'O lado da base diminui 2x; a altura é x.',{unit:'cm³'});},
 lv=>{const r=pick([1,2,3]),h=pick([2,3,4]);return NUM(`Uma caixa-d'água cilíndrica tem raio <b>${r} m</b> e altura <b>${h} m</b>. Quantos litros cabem? (π = 3)`,3*r*r*h*1000,`V = 3·${r}²·${h} = ${3*r*r*h} m³ = <b>${nf(3*r*r*h*1000)} L</b>.`,'V = π·r²·h; 1 m³ = 1000 L.',{unit:'L'});},
]},
{id:'enemfin',name:'Finanças do dia a dia',icon:'🛒',tip:'Compare sempre o preço por unidade e o total pago. Parcelado: total = nº de parcelas × valor da parcela.',
theory:`<h3>À vista × parcelado</h3><p>Total parcelado = parcelas × valor. Juros embutidos = (total parcelado − à vista) ÷ à vista.</p>
<div class="ex">À vista R$ 900 ou 10 × R$ 99 = R$ 990 → 90/900 = 10% a mais</div>
<h3>Qual embalagem compensa?</h3><p>Calcule o preço por unidade (por kg, por litro): o menor é o mais vantajoso.</p>
<h3>Descontos e aumentos</h3><p>Desconto de 20% → paga 80% · Aumento de 10% → paga 110%.</p>`,
gens:[
 lv=>{const v=R(5,20)*100,n=pick([5,10]),j=pick([5,10,20]);const par=v*(1+j/100)/n;return NUM(`Um celular custa <b>R$ ${nf(v)}</b> à vista ou <b>${n} × ${money(round(par,2))}</b>. Quantos por cento a mais se paga no parcelado?`,j,`Total parcelado: ${n} × ${money(round(par,2))} = R$ ${nf(v*(1+j/100))}; a mais: R$ ${nf(v*j/100)} → ${nf(v*j/100)}/${nf(v)} = <b>${j}%</b>.`,'Calcule o total parcelado e compare com o à vista.',{unit:'%'});},
 lv=>{const a=pick([[1,8],[2,15],[5,35]]),b=pick([[1,9],[2,14],[5,38]].filter(x=>x[0]!==a[0]));const pa=a[1]/a[0],pb=b[1]/b[0];if(pa===pb)return TF('Pacotes com o mesmo preço por kg custam o mesmo por kg.',true,'Iguais.','');return MC(`Arroz: pacote de <b>${a[0]} kg</b> por <b>R$ ${a[1]}</b> ou pacote de <b>${b[0]} kg</b> por <b>R$ ${b[1]}</b>. Qual é mais vantajoso?`,pa<pb?`O de ${a[0]} kg`:`O de ${b[0]} kg`,[pa<pb?`O de ${b[0]} kg`:`O de ${a[0]} kg`,'Tanto faz'],`Preço por kg: R$ ${fmt(round(pa,2))} × R$ ${fmt(round(pb,2))}.`,'Compare o preço por kg.');},
 lv=>{const s=R(15,60)*100,p=pick([10,15,20,25,30]);return NUM(`De um salário de <b>R$ ${nf(s)}</b>, <b>${p}%</b> vão para o aluguel. Quanto sobra?`,s*(1-p/100),`Aluguel: ${p}% de ${nf(s)} = ${nf(s*p/100)}. Sobra: <b>R$ ${nf(s*(1-p/100))}</b>.`,'Calcule o que sobra: (100 − p)%.');},
 lv=>{const v=R(2,20)*50,d=pick([10,20,25]),a=pick([10,20]);const f=v*(1+a/100)*(1-d/100);return NUM(`Uma loja aumentou em <b>${a}%</b> um produto de <b>R$ ${v}</b> e depois anunciou <b>${d}% de desconto</b>. Qual o preço final?`,f,`${v} × ${fmt(1+a/100)} × ${fmt(1-d/100)} = <b>R$ ${fmt(round(f,2))}</b>.`,'Aplique os fatores em sequência.',{keys:[',']});},
 lv=>{const c=pick([1000,2000,5000]),i=pick([1,2]),n=pick([2,3]);const m=c*(1+i/100)**n;return NUM(`Deixando <b>R$ ${nf(c)}</b> numa aplicação que rende <b>${i}% ao mês</b> (juros compostos), quanto terá após <b>${n} meses</b>? (arredonde aos centavos)`,round(m,2),`M = ${nf(c)} · (${fmt(1+i/100)})<sup>${n}</sup> = <b>R$ ${fmt(round(m,2))}</b>.`,'M = C·(1 + i)ⁿ.',{keys:[','],tol:0.02});},
]},
{id:'enemlog',name:'Raciocínio lógico e contagem',icon:'🧩',tip:'Procure padrões, organize os dados em tabelas e, na dúvida, teste casos pequenos.',
theory:`<ul><li><b>Sequências</b>: descubra a regra (soma, multiplica, alterna).</li><li><b>Apertos de mão</b> entre n pessoas: n(n − 1)/2.</li><li><b>Princípio da casa dos pombos</b>: com n gavetas, n + 1 objetos garantem 2 na mesma gaveta.</li><li><b>Calendário</b>: dias da semana se repetem a cada 7 dias (use o resto da divisão por 7).</li></ul>
<div class="ex">10 pessoas se cumprimentam uma vez cada: 10·9/2 = 45 apertos de mão</div>`,
gens:[
 lv=>{const n=R(4,15);return NUM(`Numa reunião com <b>${n}</b> pessoas, cada uma aperta a mão de todas as outras uma única vez. Quantos apertos de mão ocorrem?`,n*(n-1)/2,`C(${n}, 2) = ${n}·${n-1}/2 = <b>${n*(n-1)/2}</b>.`,'Cada par de pessoas = 1 aperto: n(n − 1)/2.');},
 lv=>{const c=R(2,6);return NUM(`Uma gaveta tem meias de <b>${c} cores</b> diferentes, misturadas no escuro. Quantas meias, no mínimo, é preciso tirar para <b>garantir</b> um par da mesma cor?`,c+1,`No pior caso, pega uma de cada cor (${c}); a próxima forma par: <b>${c+1}</b>.`,'Princípio da casa dos pombos.');},
 lv=>{const a=R(1,5),t=pick(['mult','quad','fib']);let s,next,rule;if(t==='mult'){const q=pick([2,3]);s=[0,1,2,3].map(i=>a*q**i);next=a*q**4;rule=`multiplicar por ${q}`;}else if(t==='quad'){s=[1,2,3,4].map(i=>i*i+a);next=25+a;rule='somar ímpares crescentes (3, 5, 7, 9…)';}else{s=[a,a+1];while(s.length<5)s.push(s[s.length-1]+s[s.length-2]);next=s[4];s=s.slice(0,4);rule='cada termo é a soma dos dois anteriores';}return FILL('Qual é o próximo termo?',`${s.join(', ')}, @@`,next,`A regra é ${rule}: <b>${next}</b>.`,'Compare termos vizinhos: diferença? razão? soma dos anteriores?');},
 lv=>{const p=R(3,6),c=R(2,5);return NUM(`Uma senha tem <b>${c}</b> letras escolhidas entre <b>${p}</b> letras disponíveis, podendo repetir. Quantas senhas são possíveis?`,p**c,`Princípio multiplicativo: ${p}<sup>${c}</sup> = <b>${nf(p**c)}</b>.`,'Cada posição tem as mesmas opções.');},
 lv=>{const D=['domingo','segunda-feira','terça-feira','quarta-feira','quinta-feira','sexta-feira','sábado'];const d=R(0,6),n=R(40,200);return MC(`Se hoje é <b>${D[d]}</b>, que dia da semana será daqui a <b>${n} dias</b>?`,D[(d+n)%7],D.filter((_,i)=>i!==(d+n)%7),`${n} ÷ 7 deixa resto ${n%7} → avance ${n%7} dias: ${D[(d+n)%7]}.`,'Use o resto da divisão por 7.');},
]},
]});

/* ------------------------ Cartões de memória (evocação ativa) ------------------------ */
const CARDS={
 add:[['Nome dos números que se somam','parcelas'],['Nome do resultado da adição','soma (ou total)'],['Propriedade: a + b = b + a','comutativa (a ordem não altera a soma)'],['Elemento neutro da adição','0 (zero)']],
 sub:[['Em a − b = c, o nome de a','minuendo'],['Em a − b = c, o nome de b','subtraendo'],['Resultado da subtração','diferença'],['Prova real da subtração','diferença + subtraendo = minuendo']],
 mul:[['Nome dos números que se multiplicam','fatores'],['Resultado da multiplicação','produto'],['Elemento neutro da multiplicação','1 (um)'],['Qualquer número multiplicado por zero','dá sempre zero'],['Triplo de um número','o número × 3']],
 div:[['Relação fundamental da divisão','dividendo = divisor × quociente + resto'],['Divisão exata','resto igual a zero'],['O resto da divisão é sempre','menor que o divisor'],['Resultado da divisão','quociente']],
 num:[['Números pares terminam em','0, 2, 4, 6 ou 8'],['Sucessor de n','n + 1'],['Antecessor de n','n − 1'],['Valor do algarismo 3 em 4.382','300 (3 centenas)']],
 arred:[['Arredondar quando o algarismo seguinte é 5 a 9','arredonda para cima'],['Arredondar quando o algarismo seguinte é 0 a 4','mantém (arredonda para baixo)'],['487 para a centena mais próxima','500'],['Estimar 398 + 207','400 + 200 = 600']],
 frac1:[['Numerador','quantas partes foram tomadas'],['Denominador','em quantas partes iguais o todo foi dividido'],['Frações equivalentes a 1/2','2/4, 3/6, 4/8…'],['Fração de uma quantidade','divide pelo denominador e multiplica pelo numerador']],
 dec:[['0,1 como fração','1/10 (um décimo)'],['Somar números decimais','vírgula embaixo de vírgula'],['Multiplicar um decimal por 100','vírgula anda 2 casas para a direita'],['Dividir um decimal por 10','vírgula anda 1 casa para a esquerda']],
 med:[['1 km em metros','1000 m'],['1 m em centímetros','100 cm'],['1 kg em gramas','1000 g'],['1 L em mililitros','1000 mL'],['Unidade maior → menor','multiplica']],
 hora:[['1 hora em minutos','60 minutos'],['1 dia em horas','24 horas'],['Meses com 30 dias','abril, junho, setembro e novembro'],['Ponteiro grande no número 3','15 minutos'],['1 semana','7 dias']],
 geo1:[['Perímetro','soma de todos os lados'],['Perímetro do quadrado','4 × lado'],['Perímetro do retângulo','2 × (base + altura)'],['Polígono de 6 lados','hexágono'],['Polígono de 5 lados','pentágono']],
 din:[['Troco','valor pago − preço'],['R$ 1,00 em centavos','100 centavos'],['Custo de várias unidades iguais','preço unitário × quantidade']],
 graf1:[['Barra mais alta do gráfico','maior valor'],['Diferença entre duas barras','subtraia os valores'],['Total de um gráfico de barras','soma de todas as barras']],
 int:[['Sinais iguais na multiplicação','resultado positivo'],['Sinais diferentes na multiplicação','resultado negativo'],['a − (−b)','a + b (menos com menos vira mais)'],['Maior entre −7 e −2','−2 (mais perto do zero)']],
 fracop:[['Soma de frações com denominadores diferentes','iguala os denominadores (MMC) e soma os numeradores'],['Multiplicação de frações','numerador × numerador e denominador × denominador'],['Divisão de frações','multiplica a 1ª pelo inverso da 2ª'],['Simplificar uma fração','divide numerador e denominador pelo MDC']],
 dizima:[['0,777… como fração','7/9'],['0,4545… como fração','45/99 = 5/11'],['Fração geratriz de período de 1 algarismo','algarismo ÷ 9'],['Toda dízima periódica é','um número racional']],
 pot:[['a<sup>m</sup> · a<sup>n</sup>','a<sup>m+n</sup> (soma os expoentes)'],['a<sup>m</sup> ÷ a<sup>n</sup>','a<sup>m−n</sup> (subtrai os expoentes)'],['(a<sup>m</sup>)<sup>n</sup>','a<sup>m·n</sup> (multiplica os expoentes)'],['a<sup>0</sup> (a ≠ 0)','1'],['a<sup>−n</sup>','1 / a<sup>n</sup>']],
 raiz:[['√49','7, pois 7² = 49'],['√(a²·b)','a√b'],['√(a · b)','√a · √b'],['Quadrados perfeitos até 100','1, 4, 9, 16, 25, 36, 49, 64, 81, 100']],
 expr:[['Ordem das operações','( ) → potências e raízes → × e ÷ → + e −'],['5 + 3 × 4','17 (a multiplicação vem antes)'],['Entre × e ÷ (ou + e −)','resolve na ordem, da esquerda para a direita']],
 mmc:[['MMC','menor múltiplo comum'],['MDC','maior divisor comum'],['MMC(a,b) × MDC(a,b)','a × b'],['Número primo','tem exatamente dois divisores: 1 e ele mesmo'],['Divisível por 3','soma dos algarismos é múltipla de 3']],
 porc:[['25% como fração','1/4'],['x% de V','V × x ÷ 100'],['Desconto de 20%','multiplicar por 0,8'],['Aumento de 15%','multiplicar por 1,15'],['Quantos % a é de b','a ÷ b × 100']],
 prop:[['Propriedade fundamental da proporção','produto dos meios = produto dos extremos'],['Regra de três direta','multiplica cruzado'],['Regra de três inversa','multiplica em linha (reto)'],['Escala 1 : 100 000','1 cm no mapa = 1 km real']],
 eq1:[['Princípio da balança','fazer a mesma operação nos dois lados'],['"O dobro de um número"','2x'],['"A metade de um número"','x/2'],['Solução de 3x + 5 = 20','x = 5']],
 ineq:[['Multiplicar/dividir uma inequação por negativo','inverte o sinal da desigualdade'],['Solução de 3x − 2 > 10','x > 4'],['Menor inteiro que satisfaz x > 4','5'],['Diferença entre > e ≥','≥ inclui o próprio número']],
 area:[['Área do triângulo','base × altura ÷ 2'],['Área do trapézio','(B + b) × h ÷ 2'],['Área do círculo','π · r²'],['Comprimento da circunferência','2 · π · r'],['Área do losango','D × d ÷ 2']],
 ang:[['Ângulos complementares','somam 90°'],['Ângulos suplementares','somam 180°'],['Soma dos ângulos internos de um triângulo','180°'],['Soma dos ângulos internos de um polígono de n lados','(n − 2) · 180°'],['Ângulos opostos pelo vértice','são iguais']],
 pit:[['Teorema de Pitágoras','a² = b² + c²'],['Hipotenusa','lado oposto ao ângulo reto (o maior)'],['Diagonal do quadrado de lado ℓ','ℓ√2'],['Terno pitagórico mais famoso','3, 4, 5']],
 tales:[['Triângulos com os mesmos ângulos','são semelhantes'],['Lados multiplicados por k → área','multiplicada por k²'],['Teorema de Tales','paralelas cortadas por transversais geram segmentos proporcionais'],['Problema de sombras','altura ÷ sombra é igual para os dois objetos']],
 relmet:[['h² (altura sobre a hipotenusa)','m · n'],['b² (cateto)','a · m'],['a · h (hipotenusa × altura)','b · c']],
 alg:[['(a + b)²','a² + 2ab + b²'],['(a − b)²','a² − 2ab + b²'],['(a + b)(a − b)','a² − b²'],['Fatoração de x² − 49','(x + 7)(x − 7)']],
 sist:[['Método da adição','somar as equações para eliminar uma incógnita'],['Método da substituição','isolar uma letra e substituir na outra equação'],['Carros e motos: total de rodas','4C + 2M']],
 eq2:[['Fórmula de Bhaskara','x = (−b ± √Δ) / 2a'],['Δ (discriminante)','b² − 4ac'],['Δ < 0','nenhuma raiz real'],['Soma das raízes','−b/a'],['Produto das raízes','c/a']],
 est:[['Média aritmética','soma dos valores ÷ quantidade'],['Mediana','valor central dos dados em ordem'],['Moda','valor que mais se repete'],['Amplitude','maior valor − menor valor']],
 notc:[['Forma da notação científica','a × 10ⁿ, com 1 ≤ a < 10'],['3 200 000 em notação científica','3,2 × 10⁶'],['0,0005 em notação científica','5 × 10⁻⁴'],['(a·10ᵐ)·(b·10ⁿ)','(a·b)·10ᵐ⁺ⁿ']],
 conj:[['A ∪ B (união)','elementos que estão em A ou em B'],['A ∩ B (interseção)','elementos comuns a A e B'],['n(A ∪ B)','n(A) + n(B) − n(A ∩ B)'],['√2 e π são','números irracionais']],
 funcao:[['Definição de função','cada x tem um único y'],['Domínio de 1/(x − a)','x ≠ a'],['Domínio de √(x − a)','x ≥ a'],['f(g(x))','aplica g primeiro, depois f'],['Como achar a inversa','troca x por y e isola y']],
 fafim:[['Lei da função afim','f(x) = ax + b'],['a > 0 na função afim','função crescente'],['Raiz da função afim','x = −b/a'],['Coeficiente angular por dois pontos','a = Δy / Δx'],['b na função afim','onde a reta corta o eixo y']],
 modul:[['|x| (módulo)','distância de x até o zero'],['|x − a| = b','x = a − b ou x = a + b'],['|x| < a','−a < x < a'],['Distância entre a e b na reta','|a − b|']],
 fquad:[['x do vértice','−b / 2a'],['y do vértice','−Δ / 4a'],['a > 0 na parábola','concavidade para cima (tem mínimo)'],['a < 0 na parábola','concavidade para baixo (tem máximo)']],
 polin:[['Resto da divisão de P(x) por (x − a)','P(a) (teorema do resto)'],['a é raiz de P quando','P(a) = 0'],['Soma dos coeficientes de P','P(1)'],['Grau de um polinômio','maior expoente com coeficiente não nulo']],
 fexp:[['Resolver aˣ = aᵏ','x = k (igualar expoentes)'],['Base entre 0 e 1','função exponencial decrescente'],['Todo gráfico de y = aˣ passa por','(0, 1)'],['Solução de 4ˣ = 8','x = 3/2']],
 log:[['logₐ b = x significa','aˣ = b'],['log(M·N)','log M + log N'],['log(M/N)','log M − log N'],['log Mⁿ','n · log M'],['logₐ 1','0']],
 pa:[['Termo geral da PA','aₙ = a₁ + (n − 1)·r'],['Soma dos termos da PA','Sₙ = (a₁ + aₙ)·n / 2'],['Razão da PA','diferença entre termos consecutivos'],['1 + 2 + … + 100','5050']],
 pg:[['Termo geral da PG','aₙ = a₁ · qⁿ⁻¹'],['Soma infinita da PG (|q| < 1)','a₁ / (1 − q)'],['Razão da PG','quociente entre termos consecutivos'],['Soma finita da PG','a₁(qⁿ − 1) / (q − 1)']],
 juros:[['Juros simples','J = C · i · t'],['Montante composto','M = C · (1 + i)ᵗ'],['Descontos de 10% e depois 20%','28% no total (e não 30%)'],['Montante simples','M = C + J']],
 trig:[['Seno','cateto oposto ÷ hipotenusa'],['Cosseno','cateto adjacente ÷ hipotenusa'],['Tangente','cateto oposto ÷ cateto adjacente'],['sen 30°','1/2'],['sen 45° = cos 45°','√2/2'],['tg 60°','√3']],
 leissc:[['Lei dos cossenos','a² = b² + c² − 2bc·cos Â'],['Lei dos senos','a / sen Â = b / sen B̂ = 2R'],['Quando usar a lei dos cossenos','dois lados e o ângulo entre eles'],['cos 120°','−1/2']],
 ciclo:[['180° em radianos','π rad'],['Grau → radiano','multiplicar por π/180'],['Relação fundamental','sen²x + cos²x = 1'],['Quadrante com seno + e cosseno −','2º quadrante'],['90° em radianos','π/2 rad']],
 mat:[['Determinante 2×2','ad − bc'],['Ordem de A(m×n)·B(n×p)','m × p'],['Matriz transposta','troca linhas por colunas'],['Regra de Sarrus','calcula determinante 3×3']],
 comb:[['n! (fatorial)','n · (n−1) · … · 1'],['Permutação de n elementos','n!'],['Arranjo (a ordem importa)','n! / (n − p)!'],['Combinação (a ordem não importa)','n! / (p!(n − p)!)'],['0!','1 (por definição)']],
 binom:[['Número de termos de (x + y)ⁿ','n + 1'],['Coeficientes de (x + y)ⁿ','linha n do triângulo de Pascal'],['Soma dos coeficientes de (x + 1)ⁿ','2ⁿ'],['Linha 4 do triângulo de Pascal','1, 4, 6, 4, 1']],
 prob:[['Probabilidade','casos favoráveis ÷ casos possíveis'],['P(não A)','1 − P(A)'],['Eventos independentes: P(A e B)','P(A) · P(B)'],['Resultados ao lançar dois dados','36'],['P(soma 7) com dois dados','1/6']],
 estat2:[['Desvio padrão','raiz quadrada da variância'],['Variância','média dos quadrados dos desvios'],['Somar k a todos os dados → desvio padrão','não muda'],['Desvio padrão zero','todos os dados iguais']],
 esp:[['Volume do cilindro','π · r² · h'],['Volume do cone','π · r² · h ÷ 3'],['Volume da esfera','4 · π · r³ ÷ 3'],['Relação de Euler','V − A + F = 2'],['1 dm³','1 litro']],
 gan:[['Distância entre dois pontos','√[(Δx)² + (Δy)²]'],['Ponto médio','média das coordenadas'],['Equação reduzida da reta','y = mx + n'],['Circunferência de centro (a, b) e raio r','(x − a)² + (y − b)² = r²']],
 cpx:[['i²','−1'],['Conjugado de a + bi','a − bi'],['Módulo de a + bi','√(a² + b²)'],['i³','−i'],['Potências de i se repetem a cada','4 expoentes']],
 enemesc:[['Escala 1 : 50','1 cm no desenho = 50 cm reais'],['Receita para 4 → para 10 pessoas','multiplica tudo por 2,5'],['Mistura 1 : 3','concentrado = 1/4 do total']],
 enemgraf:[['Variação percentual','(novo − antigo) ÷ antigo × 100'],['De 40 para 50','aumento de 25%'],['De 80 para 60','queda de 25%']],
 enemgeo:[['1 m³ em litros','1000 L'],['Número de pisos','área do cômodo ÷ área de uma peça'],['Latas de tinta','área ÷ rendimento (arredonde para cima)']],
 enemfin:[['Juros embutidos no parcelado','(total parcelado − à vista) ÷ à vista'],['Qual embalagem compensa','a de menor preço por unidade (kg, L)'],['Desconto de 20%','paga 80% do preço']],
 enemlog:[['Apertos de mão entre n pessoas','n(n − 1) / 2'],['Princípio da casa dos pombos','n gavetas e n + 1 objetos → 2 na mesma gaveta'],['Dia da semana daqui a N dias','avance o resto de N ÷ 7']],
};
