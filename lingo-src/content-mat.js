const BRAND={app:'MatLingo',chatPh:'ex.: o que é MMC?',tutor:'Professor Pi',sym:'π',body:'#58cc02',dark:'#58a700',belly:'#d7ffb8',lsKey:'matlingo_v1',first:'add',
 welcome:'Matemática do <b>Fundamental I ao Ensino Médio</b> em lições curtas, com repetição espaçada, vidas, XP e ofensiva.',
 range:'do Fundamental I ao Ensino Médio',searchEx:'ex.: logaritmo',firstName:'Adição',
 chips:['O que é MMC?','Fórmula de Bhaskara','Como calcular porcentagem?','Teorema de Pitágoras','Propriedades do logaritmo','15% de 80'],
 askEx:'<i>"o que é MDC?"</i>, <i>"fórmula de Bhaskara"</i>, <i>"como calcular porcentagem"</i>',
 formulas:'Bhaskara, Pitágoras, área, volume, juros, PA, PG, logaritmos, trigonometria'};
const NAMES=['Ana','Pedro','Lia','Caio','Bia','Téo','Maria','João','Luna','Davi','Júlia','Rafa'];
const UNITS=[];

/* ------------------------ UNIDADE 1 — FUNDAMENTAL I ------------------------ */
UNITS.push({id:'u1',title:'Fundamental I',sub:'1º ao 5º ano · operações, frações, medidas',color:'#58cc02',dark:'#58a700',skills:[
{id:'add',name:'Adição',icon:'➕',tip:'Some unidades com unidades, dezenas com dezenas. Se passar de 9, "vai um" para a próxima casa.',
theory:`<p><b>Adição</b> é juntar quantidades. Os números somados são as <b>parcelas</b> e o resultado é a <b>soma</b>.</p>
<div class="formula">parcela + parcela = soma</div>
<h3>Como somar números grandes</h3><p>Alinhe as casas (unidades embaixo de unidades) e some da direita para a esquerda. Quando uma coluna passar de 9, escreva a unidade e <b>"vai um"</b> para a próxima coluna.</p>
<div class="ex">Ex.: 47 + 38 → 7 + 8 = 15 (escreve 5, vai 1) → 4 + 3 + 1 = 8 → <b>85</b></div>
<h3>Truques de cálculo mental</h3><ul><li>Decompor: 58 + 27 = 58 + 20 + 7 = 78 + 7 = 85</li><li>Arredondar: 99 + 46 = 100 + 46 − 1 = 145</li><li>A ordem não altera a soma: 3 + 9 = 9 + 3 (comutativa)</li></ul>
<h3>Palavras-chave em problemas</h3><p>"ganhou", "juntou", "ao todo", "total", "a mais" → normalmente indicam adição.</p>`,
gens:[
 lv=>{const m=[10,20,50,100,500,1000][lv]||1000;const a=R(1,m),b=R(1,m),c=a+b;return NUM(`Quanto é <b>${nf(a)} + ${nf(b)}</b>?`,c,`${nf(a)} + ${nf(b)} = <b>${nf(c)}</b>. Some unidades com unidades, dezenas com dezenas e não esqueça do "vai um".`,`Decomponha ${nf(b)} em dezenas e unidades e some por partes.`);},
 lv=>{const m=[10,30,60,100,300,800][lv]||800;const a=R(2,m),b=R(2,m),c=a+b;const nm=pick(NAMES),it=pick(['figurinhas','bolinhas de gude','moedas','canetas','cartas']);return MC(`${nm} tinha <b>${a}</b> ${it} e ganhou mais <b>${b}</b>. Com quantas ${it} ficou?`,c,[c+1,c-1,c+10,Math.abs(a-b)],`"Ganhou" indica <b>adição</b>: ${a} + ${b} = ${c}.`,'Quando alguém ganha, a quantidade aumenta: use adição.');},
 lv=>{const m=[10,20,50,100,500,1000][lv]||1000;const a=R(1,m),b=R(1,m),c=a+b;return FILL('Qual número completa a conta?',`${a} + @@ = ${c}`,b,`Use a operação inversa: ${c} − ${a} = <b>${b}</b>.`,`Quanto falta de ${a} para chegar a ${c}?`);},
 lv=>{const m=[10,20,50,100,500,1000][lv]||1000;const a=R(1,m),b=R(1,m),c=a+b;const s=pick([c,c,c+1,c-1,c+10,c-10].filter(v=>v>0));return TF(`${a} + ${b} = ${s}`,s===c,`${a} + ${b} = <b>${c}</b>.`,'Faça a conta com calma e compare com o resultado mostrado.');},
 lv=>{const m=[9,15,30,60,200,500][lv]||500;const a=R(1,m),b=R(1,m),c=R(1,m),s=a+b+c;return NUM(`Calcule: <b>${a} + ${b} + ${c}</b>`,s,`${a} + ${b} = ${a+b}; ${a+b} + ${c} = <b>${s}</b>.`,'Some duas parcelas primeiro e depois a terceira.');},
]},
{id:'sub',name:'Subtração',icon:'➖',tip:'Subtraia da direita para a esquerda. Se o algarismo de cima for menor, "empreste" 1 da casa vizinha.',
theory:`<p><b>Subtração</b> é tirar, comparar ou completar. Em <b>a − b = c</b>: a é o <b>minuendo</b>, b é o <b>subtraendo</b> e c é a <b>diferença</b>.</p>
<h3>Empréstimo (reagrupamento)</h3><div class="ex">Ex.: 52 − 17 → 2 − 7 não dá: pega 1 dezena emprestada → 12 − 7 = 5; 4 − 1 = 3 → <b>35</b></div>
<h3>Prova real</h3><p>A subtração é a operação inversa da adição: se 52 − 17 = 35, então 35 + 17 = 52.</p>
<h3>Palavras-chave</h3><p>"perdeu", "gastou", "sobrou", "quanto falta", "diferença", "a menos".</p>`,
gens:[
 lv=>{const m=[10,20,50,100,500,1000][lv]||1000;const a=R(2,m),b=R(1,a),c=a-b;return NUM(`Quanto é <b>${nf(a)} − ${nf(b)}</b>?`,c,`${nf(a)} − ${nf(b)} = <b>${nf(c)}</b>. Confira: ${nf(c)} + ${nf(b)} = ${nf(a)}.`,'Se um algarismo de cima for menor que o de baixo, pegue 1 emprestado da casa ao lado.');},
 lv=>{const m=[15,30,60,120,400,900][lv]||900;const a=R(5,m),b=R(1,a-1),c=a-b;const nm=pick(NAMES);return MC(`${nm} tinha <b>${a}</b> balas e deu <b>${b}</b> para os amigos. Quantas balas sobraram?`,c,[a+b,c+1,c-1,c+10],`"Deu/sobrou" indica <b>subtração</b>: ${a} − ${b} = ${c}.`,'Quando algo é retirado, a quantidade diminui.');},
 lv=>{const m=[10,20,50,100,500,1000][lv]||1000;const a=R(2,m),b=R(1,a),c=a-b;return FILL('Complete a subtração:',`${a} − @@ = ${c}`,b,`${a} − ${c} = <b>${b}</b>.`,`Pense: ${a} menos quanto dá ${c}?`);},
 lv=>{const m=[20,50,100,200,1000,2000][lv]||2000;const a=R(10,m),b=R(1,a),c=a-b;return MC(`Qual é a <b>diferença</b> entre ${a} e ${b}?`,c,[a+b,c+1,c-1,c+10],`Diferença = maior − menor = ${a} − ${b} = ${c}.`,'Diferença é o resultado de uma subtração.');},
 lv=>{const y=R(1990,2015),n=R(2016,2026);return NUM(`Uma pessoa nasceu em <b>${y}</b>. Quantos anos ela completa em <b>${n}</b>?`,n-y,`${n} − ${y} = <b>${n-y}</b> anos.`,'Subtraia o ano de nascimento do ano atual.');},
]},
{id:'mul',name:'Multiplicação',icon:'✖️',tip:'Multiplicar é somar parcelas iguais: 4 × 3 = 3 + 3 + 3 + 3. Decore a tabuada até 10!',
theory:`<p><b>Multiplicação</b> é uma soma de parcelas iguais: <b>4 × 3 = 3 + 3 + 3 + 3 = 12</b>. Os números são os <b>fatores</b> e o resultado é o <b>produto</b>.</p>
<h3>Propriedades</h3><ul><li>Comutativa: 6 × 7 = 7 × 6</li><li>Elemento neutro: n × 1 = n</li><li>Qualquer número × 0 = 0</li><li>Distributiva: 7 × 12 = 7 × 10 + 7 × 2 = 84</li></ul>
<h3>Dobro, triplo, quádruplo</h3><p>Dobro = × 2; triplo = × 3; quádruplo = × 4; quíntuplo = × 5.</p>
<div class="ex">Ex.: 23 × 4 = 20 × 4 + 3 × 4 = 80 + 12 = <b>92</b></div>`,
gens:[
 lv=>{const a=lv<3?R(2,[5,7,10][lv]):R(11,20+lv*8),b=R(2,10),p=a*b;return NUM(`Quanto é <b>${a} × ${b}</b>?`,p,`${a} × ${b} = <b>${p}</b>.`,a>10?`Use a distributiva: ${a} × ${b} = ${Math.floor(a/10)*10} × ${b} + ${a%10} × ${b}.`:`Some ${b} parcelas de ${a}, ou use a tabuada do ${b}.`);},
 lv=>{const a=R(2,10),b=R(2,10),p=a*b;return FILL('Complete a tabuada:',`${a} × @@ = ${p}`,b,`${p} ÷ ${a} = <b>${b}</b>.`,`Qual número vezes ${a} dá ${p}?`);},
 lv=>{const cx=R(2,lv<3?9:25),q=pick([6,10,12,4,8,5]);const t=cx*q;return MC(`Uma loja tem <b>${cx}</b> caixas com <b>${q}</b> ovos em cada. Quantos ovos há ao todo?`,t,[cx+q,t+q,t-q,t+1],`Grupos iguais → multiplicação: ${cx} × ${q} = ${t}.`,'Várias caixas com a mesma quantidade: multiplique.');},
 lv=>{const w=pick([['dobro',2],['triplo',3],['quádruplo',4],['quíntuplo',5]]);const n=R(3,lv<3?15:60);return MC(`Qual é o <b>${w[0]}</b> de ${n}?`,n*w[1],[n+w[1],n*(w[1]+1),n*(w[1]-1)||n*2+1],`${w[0][0].toUpperCase()+w[0].slice(1)} significa multiplicar por ${w[1]}: ${n} × ${w[1]} = ${n*w[1]}.`,`${w[0]} = × ${w[1]}.`);},
 lv=>{const a=R(2,10),b=R(2,10),p=a*b,s=pick([p,p,p+a,p-b,p+1]);return TF(`${a} × ${b} = ${s}`,s===p,`${a} × ${b} = <b>${p}</b>.`,'Revise a tabuada.');},
]},
{id:'div',name:'Divisão',icon:'➗',tip:'Dividir é repartir em partes iguais. Confira: quociente × divisor + resto = dividendo.',
theory:`<p><b>Divisão</b> é repartir igualmente ou descobrir quantas vezes um número cabe em outro.</p>
<div class="formula">dividendo = divisor × quociente + resto</div>
<p>O resto é sempre <b>menor que o divisor</b>. Se o resto é 0, a divisão é <b>exata</b>.</p>
<div class="ex">Ex.: 17 ÷ 5 → 5 × 3 = 15, sobra 2. Quociente 3, resto 2. Prova: 5 × 3 + 2 = 17.</div>
<h3>Dica</h3><p>A divisão é a operação inversa da multiplicação: 56 ÷ 8 = 7 porque 8 × 7 = 56.</p>`,
gens:[
 lv=>{const a=R(2,10),q=R(2,lv<3?10:25),p=a*q;return NUM(`Quanto é <b>${p} ÷ ${a}</b>?`,q,`${p} ÷ ${a} = <b>${q}</b>, pois ${a} × ${q} = ${p}.`,`Qual número multiplicado por ${a} dá ${p}?`);},
 lv=>{const a=R(3,9),q=R(2,12),r=R(1,a-1),n=a*q+r;return NUM(`Qual é o <b>resto</b> da divisão de ${n} por ${a}?`,r,`${a} × ${q} = ${a*q}; ${n} − ${a*q} = <b>${r}</b>. O resto (${r}) é menor que o divisor (${a}).`,`Encontre o maior múltiplo de ${a} que não passa de ${n}.`);},
 lv=>{const k=R(2,8),q=R(2,lv<3?10:20),t=k*q,nm=pick(NAMES);return MC(`${nm} quer repartir <b>${t}</b> figurinhas igualmente entre <b>${k}</b> amigos. Quantas cada um recebe?`,q,[t-k,q+1,q-1,t*k],`Repartir igualmente → divisão: ${t} ÷ ${k} = ${q}.`,'Repartir em partes iguais é dividir.');},
 lv=>{const a=R(2,10),q=R(2,10),p=a*q;return FILL('Complete:','@@ ÷ '+a+' = '+q,p,`${a} × ${q} = <b>${p}</b> (a multiplicação desfaz a divisão).`,'Use a operação inversa: multiplique.');},
 lv=>{const a=R(3,9),q=R(2,12),r=R(0,a-1),n=a*q+r;return MC(`Na divisão de ${n} por ${a}, qual é o <b>quociente</b>?`,q,[q+1,q-1,r||q+2,a],`${a} × ${q} = ${a*q} ≤ ${n} e ${a} × ${q+1} = ${a*(q+1)} > ${n}. Quociente = ${q}${r?`, resto ${r}`:''}.`,'Quociente é quantas vezes o divisor cabe no dividendo.');},
]},
{id:'num',name:'Números e padrões',icon:'🔢',tip:'Procure o que muda de um termo para o outro: some ou subtraia sempre o mesmo valor?',
theory:`<h3>Sistema de numeração decimal</h3><p>Cada algarismo tem um <b>valor posicional</b>: no número 4.382, o 4 vale 4.000, o 3 vale 300, o 8 vale 80 e o 2 vale 2.</p>
<table><tr><th>Milhar</th><th>Centena</th><th>Dezena</th><th>Unidade</th></tr><tr><td>4</td><td>3</td><td>8</td><td>2</td></tr></table>
<h3>Par e ímpar</h3><p><b>Pares</b> terminam em 0, 2, 4, 6 ou 8. <b>Ímpares</b> terminam em 1, 3, 5, 7 ou 9.</p>
<h3>Sucessor e antecessor</h3><p>Sucessor de n = n + 1. Antecessor de n = n − 1.</p>
<h3>Sequências</h3><p>Descubra a regra: 3, 7, 11, 15… aumenta 4 a cada termo, então o próximo é 19.</p>`,
gens:[
 lv=>{const s=R(1,30),r=R(2,4+lv*2)*(Math.random()<.25?-1:1),t=[0,1,2,3,4].map(i=>s+(r<0?60:0)+i*r),k=R(2,4);const parts=t.map((v,i)=>i===k?'@@':v);return FILL('Complete a sequência:',parts.join(', '),t[k],`A regra é ${r>0?'somar':'subtrair'} ${Math.abs(r)}: ${t.join(', ')}.`,'Compare dois termos vizinhos para descobrir a regra.');},
 lv=>{const ev=R(5,lv<3?99:9999)*2;const od=()=>R(5,lv<3?99:9999)*2+1;return MC('Qual destes números é <b>par</b>?',nf(ev),[nf(od()),nf(od()),nf(od())],`${nf(ev)} termina em ${ev%10}, algarismo par.`,'Olhe apenas para o último algarismo.');},
 lv=>{let n,ds,p;do{n=R(1000,9999);ds=String(n).split('').map(Number);p=R(0,3);}while(ds[p]===0||ds.filter(d=>d===ds[p]).length>1);const v=ds[p]*10**(3-p);const w=[0,1,2,3].filter(i=>i!==3-p).map(e=>nf(ds[p]*10**e));return MC(`No número <b>${nf(n)}</b>, qual é o valor posicional do algarismo <b>${ds[p]}</b>?`,nf(v),w,`O ${ds[p]} está na casa das ${['unidades de milhar','centenas','dezenas','unidades'][p]}, então vale ${nf(v)}.`,'Da direita para a esquerda: unidade, dezena, centena, milhar.');},
 lv=>{const n=R(10,lv<3?999:99999),s=Math.random()<.5;return NUM(`Qual é o <b>${s?'sucessor':'antecessor'}</b> de ${nf(n)}?`,s?n+1:n-1,`${s?'Sucessor = n + 1':'Antecessor = n − 1'} → ${nf(s?n+1:n-1)}.`,s?'Sucessor é o número que vem logo depois.':'Antecessor é o número que vem logo antes.');},
 lv=>{const a=R(0,lv<3?99:9999),b=pick([a,a+R(1,20),Math.max(0,a-R(1,20))]);const c=a>b?'>':a<b?'<':'=';return BANK('Qual sinal completa corretamente?',`${nf(a)} @@ ${nf(b)}`,c,['>','<','='],`${nf(a)} ${c} ${nf(b)}. "&gt;" significa maior que e "&lt;" menor que: a abertura do sinal fica virada para o número maior.`,'A abertura do sinal fica virada para o número maior.',{keep:true});},
 lv=>{const a=R(100,9999),b=R(100,9999);if(a===b)return TF(`${nf(a)} é igual a ${nf(b)}`,true,'São iguais.','Compare.');return MC(`Qual número é o <b>maior</b>?`,nf(Math.max(a,b)),[nf(Math.min(a,b))],`Compare primeiro a quantidade de algarismos, depois da esquerda para a direita: ${nf(Math.max(a,b))} > ${nf(Math.min(a,b))}.`,'Compare casa por casa, da esquerda para a direita.',{n:2});},
]},
{id:'frac1',name:'Frações',icon:'🍕',tip:'Numerador (em cima) = partes tomadas; denominador (embaixo) = em quantas partes iguais o todo foi dividido.',
theory:`<p>Uma <b>fração</b> representa partes de um todo dividido em partes <b>iguais</b>.</p><div class="formula">${F('numerador','denominador')}</div>
<p>Em ${F(3,4)}: o todo foi dividido em <b>4</b> partes e tomamos <b>3</b>.</p>
<h3>Fração de uma quantidade</h3><p>Divida pelo denominador e multiplique pelo numerador.</p><div class="ex">${F(3,4)} de 20 → 20 ÷ 4 = 5 → 5 × 3 = <b>15</b></div>
<h3>Frações equivalentes</h3><p>Multiplique (ou divida) numerador e denominador pelo mesmo número: ${F(1,2)} = ${F(2,4)} = ${F(3,6)}.</p>
<h3>Comparar</h3><p>Com o mesmo denominador, é maior a que tem o maior numerador: ${F(5,8)} > ${F(3,8)}.</p>`,
gens:[
 lv=>{const n=R(3,8),k=R(1,n-1);return MC('Que fração do círculo está pintada?',F(k,n),[F(n-k,n),F(n,k),F(k,n+1),F(k+1,n),F(k,n-k)],`O círculo tem ${n} partes iguais e ${k} estão pintadas: ${F(k,n)}.`,'Conte o total de partes (denominador) e as pintadas (numerador).',{visual:pieSVG(n,k)});},
 lv=>{const d=pick([2,3,4,5,10]),n=R(1,d-1),q=d*R(2,lv<3?10:25);return NUM(`Quanto é ${F(n,d)} de <b>${q}</b>?`,q/d*n,`${q} ÷ ${d} = ${q/d}; ${q/d} × ${n} = <b>${q/d*n}</b>.`,'Divida pelo denominador e multiplique pelo numerador.');},
 lv=>{const d=R(2,6),n=R(1,d-1),k=R(2,5);return FILL('Complete a fração equivalente:',`${F(n,d)} = <span class="fr"><span>@@</span><span>${d*k}</span></span>`,n*k,`O denominador foi multiplicado por ${k} (${d} × ${k} = ${d*k}); faça o mesmo com o numerador: ${n} × ${k} = <b>${n*k}</b>.`,`Por quanto ${d} foi multiplicado para virar ${d*k}?`);},
 lv=>{const d=R(5,12);const ns=shuffle([...Array(d-1)].map((_,i)=>i+1)).slice(0,4);const mx=Math.max(...ns);return MC('Qual fração é a <b>maior</b>?',F(mx,d),ns.filter(v=>v!==mx).map(v=>F(v,d)),`Todas têm denominador ${d}; a maior é a de maior numerador: ${F(mx,d)}.`,'Denominadores iguais: compare os numeradores.');},
 lv=>{const n=R(3,8),k=R(1,n-1);return FRAC('Que fração da barra está pintada? (ex.: 2/5)',k,n,`São ${k} partes pintadas de ${n}: ${F(k,n)}.`,'Numerador = partes pintadas; denominador = total de partes.',{visual:barSVG(n,k)});},
]},
{id:'dec',name:'Números decimais',icon:'🔟',tip:'Alinhe as vírgulas para somar ou subtrair. Multiplicar por 10, 100, 1000 anda a vírgula 1, 2, 3 casas para a direita.',
theory:`<p>Números decimais representam partes de um inteiro usando a <b>vírgula</b>: 0,1 = ${F(1,10)} (décimo), 0,01 = ${F(1,100)} (centésimo).</p>
<h3>Somar e subtrair</h3><p>Coloque <b>vírgula embaixo de vírgula</b> e complete com zeros.</p><div class="ex">2,5 + 1,25 = 2,50 + 1,25 = <b>3,75</b></div>
<h3>Multiplicar por 10, 100, 1000</h3><p>A vírgula anda 1, 2 ou 3 casas para a <b>direita</b>. Dividir: para a <b>esquerda</b>.</p><div class="ex">3,47 × 100 = 347 · 5,2 ÷ 10 = 0,52</div>
<h3>Comparar</h3><p>Compare a parte inteira; depois décimos, centésimos… 0,5 = 0,50 > 0,45.</p>`,
gens:[
 lv=>{const a=R(10,lv<3?999:9999),b=R(10,lv<3?999:9999);return NUM(`Quanto é <b>${fmt(a/100)} + ${fmt(b/100)}</b>?`,(a+b)/100,`Vírgula embaixo de vírgula: ${fmt(a/100)} + ${fmt(b/100)} = <b>${fmt((a+b)/100)}</b>.`,'Complete com zeros para ficar com a mesma quantidade de casas decimais.',{keys:[',']});},
 lv=>{const d=pick([10,100]),n=R(1,d-1);return MC(`Como se escreve ${F(n,d)} na forma decimal?`,fmt(n/d),[fmt(n/(d===10?100:10)),fmt(n),fmt(n/1000)],`${F(n,d)} = ${n} ÷ ${d} = ${fmt(n/d)}.`,d===10?'Décimos: 1 casa depois da vírgula.':'Centésimos: 2 casas depois da vírgula.');},
 lv=>{const x=R(1,9)/10,y=R(10,99)/100;if(x===y)return TF(`${fmt(x)} = ${fmt(y)}`,true,'Iguais.','');const mx=Math.max(x,y),mn=Math.min(x,y);return MC('Qual é o <b>maior</b> número?',fmt(mx),[fmt(mn)],`Compare com o mesmo número de casas: ${fmt(x).padEnd(4,'0')} e ${fmt(y)} → ${fmt(mx)} é maior.`,'Escreva os dois com duas casas decimais e compare.',{n:2});},
 lv=>{const v=R(101,9999)/100,m=pick([10,100,1000]);return NUM(`Quanto é <b>${fmt(v)} × ${nf(m)}</b>?`,v*m,`Multiplicar por ${nf(m)} anda a vírgula ${String(m).length-1} casa(s) para a direita: <b>${fmt(v*m)}</b>.`,'Conte os zeros e ande a vírgula para a direita.',{keys:[',']});},
 lv=>{const a=R(200,999),b=R(10,a-50);return NUM(`Quanto é <b>${fmt(a/100)} − ${fmt(b/100)}</b>?`,(a-b)/100,`${fmt(a/100)} − ${fmt(b/100)} = <b>${fmt((a-b)/100)}</b>.`,'Alinhe as vírgulas e subtraia.',{keys:[',']});},
]},
{id:'med',name:'Medidas',icon:'📏',tip:'1 m = 100 cm; 1 km = 1000 m; 1 kg = 1000 g; 1 L = 1000 mL; 1 h = 60 min.',
theory:`<h3>Comprimento</h3><p>1 km = 1000 m · 1 m = 100 cm · 1 cm = 10 mm</p>
<h3>Massa</h3><p>1 t = 1000 kg · 1 kg = 1000 g</p>
<h3>Capacidade</h3><p>1 L = 1000 mL</p>
<h3>Tempo</h3><p>1 dia = 24 h · 1 h = 60 min · 1 min = 60 s</p>
<div class="formula">unidade maior → menor: <u>multiplique</u> · menor → maior: <u>divida</u></div>
<div class="ex">3,5 m = 3,5 × 100 = 350 cm · 2500 g = 2500 ÷ 1000 = 2,5 kg</div>`,
gens:[
 lv=>{const c=pick([['m','cm',100],['km','m',1000],['kg','g',1000],['L','mL',1000],['h','min',60],['min','s',60],['cm','mm',10],['dia(s)','h',24],['t','kg',1000]]);const v=lv<2?R(2,9):R(2,40)/(c[2]===60||c[2]===24?2:4);return NUM(`Quantos <b>${c[1]}</b> há em <b>${fmt(v)} ${c[0]}</b>?`,v*c[2],`1 ${c[0].replace('(s)','')} = ${c[2]} ${c[1]}, então ${fmt(v)} × ${c[2]} = <b>${fmt(v*c[2])} ${c[1]}</b>.`,`Da unidade maior para a menor, multiplique por ${c[2]}.`,{unit:c[1]});},
 lv=>{const c=pick([['cm','m',100],['m','km',1000],['g','kg',1000],['mL','L',1000],['min','h',60]]);const k=pick([1,2,3,5,1.5,2.5,4,0.5]);const v=k*c[2];return NUM(`Quantos <b>${c[1]}</b> são <b>${nf(v)} ${c[0]}</b>?`,k,`Da menor para a maior, divida: ${nf(v)} ÷ ${c[2]} = <b>${fmt(k)} ${c[1]}</b>.`,`Divida por ${c[2]}.`,{unit:c[1]});},
 lv=>{const it=pick([['a distância entre duas cidades','quilômetro (km)'],['o comprimento de um lápis','centímetro (cm)'],['a massa de uma pessoa','quilograma (kg)'],['a água de uma piscina','litro (L)'],['um remédio em gotas de xarope','mililitro (mL)'],['a massa de um caminhão carregado','tonelada (t)'],['a espessura de uma moeda','milímetro (mm)']]);return MC(`Qual unidade é mais adequada para medir <b>${it[0]}</b>?`,it[1],shuffle(['quilômetro (km)','centímetro (cm)','quilograma (kg)','litro (L)','mililitro (mL)','tonelada (t)','milímetro (mm)','grama (g)']).filter(u=>u!==it[1]),`Para ${it[0]}, o mais prático é ${it[1]}.`,'Pense no tamanho do que está sendo medido.');},
 lv=>{const h=R(1,5),m=R(5,55);return NUM(`Quantos minutos há em <b>${h} h ${m} min</b>?`,h*60+m,`${h} × 60 = ${h*60}; ${h*60} + ${m} = <b>${h*60+m} min</b>.`,'Transforme as horas em minutos (× 60) e some os minutos.',{unit:'min'});},
 lv=>{const s=R(7,20),d=R(20,110);const e=s*60+d,eh=Math.floor(e/60)%24,em=e%60;return MC(`Um filme começou às <b>${s}h00</b> e durou <b>${d} minutos</b>. A que horas terminou?`,`${eh}h${String(em).padStart(2,'0')}`,[`${eh+1}h${String(em).padStart(2,'0')}`,`${s}h${d}`,`${eh}h${String((em+10)%60).padStart(2,'0')}`,`${s+1}h${String(d%60).padStart(2,'0')}`,`${eh}h${String((em+50)%60).padStart(2,'0')}`],`${d} min = ${Math.floor(d/60)} h ${d%60} min. ${s}h00 + ${Math.floor(d/60)} h ${d%60} min = ${eh}h${String(em).padStart(2,'0')}.`,'Transforme os minutos em horas e minutos.');},
]},
{id:'geo1',name:'Formas e perímetro',icon:'🔷',tip:'Perímetro é a soma de todos os lados (o contorno da figura).',
theory:`<h3>Polígonos</h3><table><tr><th>Lados</th><th>Nome</th></tr><tr><td>3</td><td>Triângulo</td></tr><tr><td>4</td><td>Quadrilátero</td></tr><tr><td>5</td><td>Pentágono</td></tr><tr><td>6</td><td>Hexágono</td></tr><tr><td>7</td><td>Heptágono</td></tr><tr><td>8</td><td>Octógono</td></tr><tr><td>10</td><td>Decágono</td></tr></table>
<h3>Perímetro</h3><p>É a <b>medida do contorno</b>: soma de todos os lados.</p>
<div class="formula">Retângulo: P = 2 × (base + altura) · Quadrado: P = 4 × lado</div>
<div class="ex">Retângulo 8 cm × 3 cm → P = 8 + 3 + 8 + 3 = <b>22 cm</b></div>`,
gens:[
 lv=>{const p=pick([['triângulo',3],['quadrilátero',4],['pentágono',5],['hexágono',6],['heptágono',7],['octógono',8],['decágono',10]]);return MC(`Quantos lados tem um <b>${p[0]}</b>?`,p[1],[3,4,5,6,7,8,10].filter(v=>v!==p[1]).sort(()=>Math.random()-.5),`O ${p[0]} tem ${p[1]} lados.`,'Tri = 3, penta = 5, hexa = 6, octo = 8, deca = 10.');},
 lv=>{const p=pick([['Triângulo',3],['Quadrilátero',4],['Pentágono',5],['Hexágono',6],['Octógono',8],['Decágono',10]]);return MC(`Como se chama o polígono de <b>${p[1]} lados</b>?`,p[0],['Triângulo','Quadrilátero','Pentágono','Hexágono','Octógono','Decágono'].filter(v=>v!==p[0]).sort(()=>Math.random()-.5),`Polígono de ${p[1]} lados: ${p[0]}.`,'Lembre dos prefixos gregos.');},
 lv=>{const w=R(3,lv<3?15:40),h=R(2,w);return NUM(`Qual é o <b>perímetro</b> do retângulo?`,2*(w+h),`P = ${w} + ${h} + ${w} + ${h} = <b>${2*(w+h)} cm</b>.`,'Some os quatro lados: dois iguais à base e dois iguais à altura.',{visual:rectSVG(w+' cm',h+' cm',w/h),unit:'cm'});},
 lv=>{const l=R(2,lv<3?12:30),s=Math.random()<.5;return s?NUM(`Qual é o perímetro de um quadrado de lado <b>${l} cm</b>?`,4*l,`P = 4 × ${l} = <b>${4*l} cm</b>.`,'O quadrado tem 4 lados iguais.',{visual:squareSVG(l+' cm'),unit:'cm'}):NUM(`Um quadrado tem perímetro <b>${4*l} cm</b>. Quanto mede cada lado?`,l,`${4*l} ÷ 4 = <b>${l} cm</b>.`,'Divida o perímetro por 4.',{unit:'cm'});},
 lv=>{const a=R(3,12),b=R(3,12),c=R(Math.abs(a-b)+1,a+b-1);return NUM(`Um triângulo tem lados de <b>${a} cm</b>, <b>${b} cm</b> e <b>${c} cm</b>. Qual é o perímetro?`,a+b+c,`${a} + ${b} + ${c} = <b>${a+b+c} cm</b>.`,'Some os três lados.',{visual:triSVG(a,b,c),unit:'cm'});},
]},
{id:'din',name:'Dinheiro e problemas',icon:'💰',tip:'Troco = valor pago − preço. Leia o problema com calma e identifique a operação.',
theory:`<h3>Real (R$)</h3><p>R$ 1,00 = 100 centavos. Escrevemos os centavos com duas casas: R$ 3,50.</p>
<h3>Troco</h3><div class="formula">troco = valor pago − preço</div><div class="ex">Compra de R$ 13,75 paga com R$ 20,00 → troco = 20,00 − 13,75 = <b>R$ 6,25</b></div>
<h3>Problemas em etapas</h3><ol style="padding-left:20px"><li>Leia e sublinhe os dados.</li><li>Descubra o que a pergunta pede.</li><li>Escolha as operações (juntar, tirar, repetir, repartir).</li><li>Calcule e confira se a resposta faz sentido.</li></ol>`,
gens:[
 lv=>{const p=R(150,4800),pay=[2000,5000,10000].find(v=>v>p);return NUM(`Uma compra custou <b>${money(p/100)}</b> e foi paga com uma nota de <b>${money(pay/100)}</b>. Qual é o troco (em reais)?`,(pay-p)/100,`Troco = ${money(pay/100)} − ${money(p/100)} = <b>${money((pay-p)/100)}</b>.`,'Subtraia o preço do valor pago.',{keys:[','],answer:money((pay-p)/100)});},
 lv=>{const q=R(2,6),p=R(3,30)+pick([0,0.5,0.25,0.9]);return NUM(`Um caderno custa <b>${money(p)}</b>. Quanto custam <b>${q}</b> cadernos (em reais)?`,q*p,`${q} × ${money(p)} = <b>${money(q*p)}</b>.`,'Multiplique o preço pela quantidade.',{keys:[','],answer:money(q*p)});},
 lv=>{const n=pick([2,5,10,20]),k=R(2,12);return MC(`Quantas notas de <b>R$ ${n}</b> são necessárias para formar <b>R$ ${n*k}</b>?`,k,[k+1,k-1,n*k-n,k*2],`R$ ${n*k} ÷ R$ ${n} = ${k} notas.`,'Divida o total pelo valor da nota.');},
 lv=>{const s=R(20,80),c=R(5,s-5),g=R(5,40);const nm=pick(NAMES);return NUM(`${nm} tinha <b>R$ ${s}</b>, gastou <b>R$ ${c}</b> num lanche e depois ganhou <b>R$ ${g}</b> da avó. Com quanto ficou?`,s-c+g,`${s} − ${c} = ${s-c}; ${s-c} + ${g} = <b>R$ ${s-c+g}</b>.`,'Faça em duas etapas: primeiro o gasto, depois o ganho.');},
 lv=>{const t=R(3,9)*pick([6,12]),k=pick([3,4,6]);return MC(`Um grupo de <b>${k}</b> amigos vai dividir igualmente uma conta de <b>R$ ${t}</b>. Quanto cada um paga?`,money(t/k),[money(t/k+1),money(t-k),money(t/k-1)],`R$ ${t} ÷ ${k} = ${money(t/k)}.`,'Dividir igualmente → divisão.');},
]},
]});

/* ------------------------ UNIDADE 2 — FUNDAMENTAL II (6º–7º) ------------------------ */
UNITS.push({id:'u2',title:'Fundamental II · parte 1',sub:'6º e 7º ano · inteiros, potências, porcentagem, equações',color:'#1cb0f6',dark:'#1899d6',skills:[
{id:'int',name:'Números inteiros',icon:'🌡️',tip:'Sinais iguais: some e mantenha o sinal. Sinais diferentes: subtraia e fique com o sinal do maior (em valor absoluto). Na multiplicação: iguais → +, diferentes → −.',
theory:`<p>Os <b>inteiros</b> (ℤ) incluem os negativos: …, −3, −2, −1, 0, 1, 2, 3, …</p>
<h3>Adição</h3><ul><li>Sinais iguais: some os valores e mantenha o sinal: (−3) + (−5) = −8</li><li>Sinais diferentes: subtraia e use o sinal do maior módulo: (−9) + 4 = −5</li></ul>
<h3>Subtração</h3><p>Subtrair é somar o oposto: 3 − (−4) = 3 + 4 = 7.</p>
<h3>Multiplicação e divisão</h3><table><tr><th>Sinais</th><th>Resultado</th></tr><tr><td>+ · + ou − · −</td><td>+</td></tr><tr><td>+ · − ou − · +</td><td>−</td></tr></table>
<h3>Comparação</h3><p>Na reta numérica, quanto mais à esquerda, menor: −7 < −2 < 0 < 3.</p>`,
gens:[
 lv=>{const a=RNZ(-20,20),b=RNZ(-20,20);return NUM(`Quanto é <b>${fmt(a)} + ${par(b)}</b>?`,a+b,(Math.sign(a)===Math.sign(b)?`Sinais iguais: some ${Math.abs(a)} + ${Math.abs(b)} e mantenha o sinal`:`Sinais diferentes: subtraia ${Math.max(Math.abs(a),Math.abs(b))} − ${Math.min(Math.abs(a),Math.abs(b))} e use o sinal do maior módulo`)+` → <b>${fmt(a+b)}</b>.`,'Olhe os sinais antes de calcular.',{keys:['−']});},
 lv=>{const a=RNZ(-12,12),b=RNZ(-12,12),p=a*b;return MC(`Quanto é <b>${par(a)} × ${par(b)}</b>?`,fmt(p),[fmt(-p),fmt(a+b),fmt(-(a+b))],`${Math.abs(a)} × ${Math.abs(b)} = ${Math.abs(p)}; sinais ${Math.sign(a)===Math.sign(b)?'iguais → positivo':'diferentes → negativo'}: <b>${fmt(p)}</b>.`,'Sinais iguais dão +, sinais diferentes dão −.');},
 lv=>{const t=R(-10,5),d=R(3,15),up=Math.random()<.5;const f=up?t+d:t-d;return NUM(`A temperatura era <b>${fmt(t)} °C</b> e ${up?'subiu':'caiu'} <b>${d} °C</b>. Qual é a nova temperatura?`,f,`${fmt(t)} ${up?'+':'−'} ${d} = <b>${fmt(f)} °C</b>.`,'Imagine um termômetro: subir soma, cair subtrai.',{keys:['−'],unit:'°C'});},
 lv=>{const s=[...new Set([...Array(6)].map(()=>R(-15,15)))].slice(0,4);while(s.length<4)s.push(s.length*7-20);const mn=Math.min(...s);return MC('Qual é o <b>menor</b> número?',fmt(mn),s.filter(v=>v!==mn).map(fmt),`Na reta numérica, ${fmt(mn)} é o que está mais à esquerda.`,'Entre negativos, quanto maior o módulo, menor o número.');},
 lv=>{const a=RNZ(-12,12),b=RNZ(-12,12);return NUM(`Quanto é <b>${fmt(a)} − ${par(b)}</b>?`,a-b,`Subtrair é somar o oposto: ${fmt(a)} ${b<0?'+ '+(-b):'− '+b} = <b>${fmt(a-b)}</b>.`,'Troque "− (número)" por "+ (oposto)".',{keys:['−']});},
 lv=>{const q=RNZ(-9,9),d=RNZ(-9,9),n=q*d;return NUM(`Quanto é <b>${fmt(n)} ÷ ${par(d)}</b>?`,q,`${Math.abs(n)} ÷ ${Math.abs(d)} = ${Math.abs(q)}; sinais ${Math.sign(n)===Math.sign(d)?'iguais → +':'diferentes → −'} → <b>${fmt(q)}</b>.`,'A regra de sinais da divisão é igual à da multiplicação.',{keys:['−']});},
]},
{id:'fracop',name:'Operações com frações',icon:'🧮',tip:'Para somar/subtrair, iguale os denominadores (MMC). Para multiplicar, numerador × numerador e denominador × denominador. Para dividir, multiplique pelo inverso.',
theory:`<h3>Adição e subtração</h3><p>Denominadores iguais: some os numeradores. Diferentes: encontre o <b>MMC</b> e transforme em frações equivalentes.</p><div class="ex">${F(1,2)} + ${F(1,3)} = ${F(3,6)} + ${F(2,6)} = ${F(5,6)}</div>
<h3>Multiplicação</h3><div class="formula">${F('a','b')} × ${F('c','d')} = ${F('a·c','b·d')}</div>
<h3>Divisão</h3><p>Conserve a primeira e multiplique pelo <b>inverso</b> da segunda.</p><div class="ex">${F(2,3)} ÷ ${F(4,5)} = ${F(2,3)} × ${F(5,4)} = ${F(10,12)} = ${F(5,6)}</div>
<h3>Simplificação</h3><p>Divida numerador e denominador pelo MDC: ${F(12,18)} = ${F(2,3)} (÷6). Digite frações como <b>5/6</b>.</p>`,
gens:[
 lv=>{const b=R(2,lv<3?6:12),d=R(2,lv<3?6:12),a=R(1,b-1),c=R(1,d-1),n=a*d+c*b,m=b*d;return FRAC(`Calcule <b>${F(a,b)} + ${F(c,d)}</b> (ex.: 7/6)`,n,m,`MMC(${b}, ${d}) = ${lcm(b,d)}. ${F(a*lcm(b,d)/b,lcm(b,d))} + ${F(c*lcm(b,d)/d,lcm(b,d))} = <b>${Fs(n,m)}</b>.`,'Iguale os denominadores com o MMC antes de somar.');},
 lv=>{const b=R(2,8),d=R(2,8),a=R(1,b),c=R(1,d-1);const n=a*d-c*b,m=b*d;return FRAC(`Calcule <b>${F(a,b)} − ${F(c,d)}</b>`,n,m,`Com denominador comum ${m}: ${F(a*d,m)} − ${F(c*b,m)} = ${F(n,m)} = <b>${Fs(n,m)}</b>.`,'Iguale os denominadores antes de subtrair.',{keys:['/','−']});},
 lv=>{const b=R(2,9),d=R(2,9),a=R(1,b+2),c=R(1,d-1);return MC(`Quanto é <b>${F(a,b)} × ${F(c,d)}</b>?`,Fs(a*c,b*d),[Fs(a+c,b+d),Fs(a*d,b*c),Fs(a*c,b+d),Fs(a+c,b*d),Fs(a*d+c*b,b*d),Fs(a*c+1,b*d)],`Numerador × numerador e denominador × denominador: ${F(a*c,b*d)} = ${Fs(a*c,b*d)}.`,'Multiplique "em linha reta".');},
 lv=>{const a=R(1,7),b=R(2,9),c=R(1,7),d=R(2,9);return FRAC(`Calcule <b>${F(a,b)} ÷ ${F(c,d)}</b>`,a*d,b*c,`${F(a,b)} × ${F(d,c)} = ${F(a*d,b*c)} = <b>${Fs(a*d,b*c)}</b>.`,'Multiplique a primeira pelo inverso da segunda.');},
 lv=>{let p,q;do{q=R(2,9);p=R(1,q-1);}while(gcd(p,q)!==1);const k=R(2,8);return TXT(`Simplifique ao máximo a fração <b>${F(p*k,q*k)}</b> (ex.: 2/3)`,[`${p}/${q}`],`MDC(${p*k}, ${q*k}) = ${k*gcd(p*k/k,q)}. Dividindo ambos por ${k}: <b>${F(p,q)}</b>.`,`Divida numerador e denominador por ${k}.`,{answer:F(p,q),keys:['/']});},
]},
{id:'pot',name:'Potenciação',icon:'⚡',tip:'aⁿ é a multiplicado n vezes. aᵐ·aⁿ = aᵐ⁺ⁿ; aᵐ÷aⁿ = aᵐ⁻ⁿ; (aᵐ)ⁿ = aᵐ·ⁿ; a⁰ = 1; a⁻ⁿ = 1/aⁿ.',
theory:`<p><b>a<sup>n</sup></b> = a × a × … × a (n vezes). a é a <b>base</b> e n o <b>expoente</b>.</p><div class="ex">2<sup>5</sup> = 2 × 2 × 2 × 2 × 2 = 32</div>
<h3>Propriedades</h3><ul><li>a<sup>m</sup> · a<sup>n</sup> = a<sup>m+n</sup></li><li>a<sup>m</sup> ÷ a<sup>n</sup> = a<sup>m−n</sup></li><li>(a<sup>m</sup>)<sup>n</sup> = a<sup>m·n</sup></li><li>a<sup>0</sup> = 1 (a ≠ 0)</li><li>a<sup>−n</sup> = ${F(1,'a<sup>n</sup>')}</li></ul>
<h3>Base negativa</h3><p>Expoente par → positivo; ímpar → negativo: (−2)<sup>3</sup> = −8; (−2)<sup>4</sup> = 16. Atenção: −2<sup>4</sup> = −16 (sem parênteses!).</p>`,
gens:[
 lv=>{const a=R(2,lv<3?6:10),n=a<=3?R(2,lv<3?5:7):R(2,3);return NUM(`Quanto é <b>${a}<sup>${n}</sup></b>?`,a**n,`${a}<sup>${n}</sup> = ${Array(n).fill(a).join(' × ')} = <b>${nf(a**n)}</b>.`,`Multiplique ${a} por ele mesmo ${n} vezes.`);},
 lv=>{const b=R(2,9),m=R(2,9),n=R(2,9),t=R(0,2);const s=[`${b}<sup>${m}</sup> · ${b}<sup>${n}</sup> = ${b}<sup>@@</sup>`,`${b}<sup>${m+n}</sup> ÷ ${b}<sup>${n}</sup> = ${b}<sup>@@</sup>`,`(${b}<sup>${m}</sup>)<sup>${n}</sup> = ${b}<sup>@@</sup>`][t];const v=[m+n,m,m*n][t];return FILL('Complete o expoente:',s,v,['Mesma base na multiplicação: <b>some</b> os expoentes','Mesma base na divisão: <b>subtraia</b> os expoentes','Potência de potência: <b>multiplique</b> os expoentes'][t]+` → ${v}.`,'Use as propriedades das potências.');},
 lv=>{const t=R(0,2),a=R(2,9);if(t===0)return NUM(`Quanto é <b>${a*R(1,50)}<sup>0</sup></b>?`,1,'Todo número diferente de zero elevado a 0 é <b>1</b>.','Lembre: a⁰ = 1.');const n=t===1?1:R(2,3);const b=t===1?a:R(2,4);return FRAC(`Quanto é <b>${b}<sup>−${n}</sup></b>? (ex.: 1/8)`,1,b**n,`Expoente negativo inverte a base: ${b}<sup>−${n}</sup> = ${F(1,b+'<sup>'+n+'</sup>')} = <b>${F(1,b**n)}</b>.`,'a⁻ⁿ = 1/aⁿ.');},
 lv=>{const a=R(2,5),n=R(2,5);const v=(-a)**n;return MC(`Quanto é <b>(−${a})<sup>${n}</sup></b>?`,fmt(v),[fmt(-v),fmt(-a*n),fmt(a*n)],`Base negativa com expoente ${n%2?'ímpar → resultado negativo':'par → resultado positivo'}: <b>${fmt(v)}</b>.`,'Expoente par deixa positivo; ímpar mantém negativo.');},
 lv=>{const a=R(2,12);return MC(`Qual é o valor de <b>${a}<sup>2</sup></b>?`,a*a,[2*a,a+2,a*a+a],`${a}<sup>2</sup> = ${a} × ${a} = ${a*a} (não é ${a} × 2!).`,'Elevar ao quadrado é multiplicar o número por ele mesmo.');},
]},
{id:'raiz',name:'Radiciação',icon:'√',tip:'√a = b porque b² = a. Para simplificar, procure quadrados perfeitos: √12 = √(4·3) = 2√3.',
theory:`<p>A raiz é a operação inversa da potência: <b>√49 = 7</b> porque 7<sup>2</sup> = 49. <b>∛8 = 2</b> porque 2<sup>3</sup> = 8.</p>
<h3>Quadrados perfeitos</h3><p>1, 4, 9, 16, 25, 36, 49, 64, 81, 100, 121, 144, 169, 196, 225…</p>
<h3>Estimativa</h3><p>√50 está entre 7 e 8, pois 49 < 50 < 64.</p>
<h3>Simplificação</h3><div class="formula">√(a²·b) = a√b</div><div class="ex">√72 = √(36·2) = 6√2</div>
<h3>Propriedades</h3><p>√(a·b) = √a · √b · √a · √a = a</p>`,
gens:[
 lv=>{const k=R(2,lv<3?12:25);return NUM(`Quanto é <b>√${k*k}</b>?`,k,`${k}<sup>2</sup> = ${k*k}, então √${k*k} = <b>${k}</b>.`,'Qual número multiplicado por ele mesmo dá esse valor?');},
 lv=>{const k=R(2,lv<3?5:10);return NUM(`Quanto é <b>∛${k**3}</b>?`,k,`${k}<sup>3</sup> = ${k**3}, então ∛${k**3} = <b>${k}</b>.`,'Qual número elevado ao cubo dá esse valor?');},
 lv=>{let n;do{n=R(5,150);}while(Number.isInteger(Math.sqrt(n)));const f=Math.floor(Math.sqrt(n));return MC(`<b>√${n}</b> está entre quais números inteiros?`,`${f} e ${f+1}`,[`${f-1} e ${f}`,`${f+1} e ${f+2}`,`${Math.floor(n/2)} e ${Math.floor(n/2)+1}`],`${f}<sup>2</sup> = ${f*f} < ${n} < ${(f+1)**2} = ${f+1}<sup>2</sup>.`,'Procure os quadrados perfeitos vizinhos.');},
 lv=>{const b=pick([2,3,5,6,7]),a=R(2,lv<3?5:9);return FILL('Simplifique o radical:',`√${a*a*b} = @@√${b}`,a,`${a*a*b} = ${a*a} · ${b}, e √${a*a} = ${a}. Logo √${a*a*b} = <b>${a}√${b}</b>.`,`Procure um quadrado perfeito que divida ${a*a*b}.`);},
 lv=>{const a=R(2,9),b=R(2,9);return NUM(`Calcule <b>√${a*a} + √${b*b}</b>`,a+b,`√${a*a} = ${a} e √${b*b} = ${b}; soma = <b>${a+b}</b>. (Cuidado: √${a*a}+√${b*b} ≠ √${a*a+b*b}!)`,'Calcule cada raiz separadamente.');},
]},
{id:'expr',name:'Expressões numéricas',icon:'🧩',tip:'Ordem: parênteses → potências e raízes → multiplicações e divisões (da esquerda p/ direita) → adições e subtrações.',
theory:`<h3>Ordem das operações</h3><ol style="padding-left:20px"><li><b>( )</b> parênteses, depois <b>[ ]</b> colchetes, depois <b>{ }</b> chaves</li><li>Potências e raízes</li><li>Multiplicações e divisões (na ordem em que aparecem)</li><li>Adições e subtrações (na ordem em que aparecem)</li></ol>
<div class="ex">5 + 3 × 4 = 5 + 12 = <b>17</b> (e não 32!)</div><div class="ex">(5 + 3) × 4 = 8 × 4 = <b>32</b></div><div class="ex">2<sup>3</sup> − 12 ÷ 4 = 8 − 3 = <b>5</b></div>`,
gens:[
 lv=>{const a=R(2,20),b=R(2,9),c=R(2,9),d=R(1,20);const v=a+b*c-d;return NUM(`Calcule: <b>${a} + ${b} × ${c} − ${d}</b>`,v,`Primeiro a multiplicação: ${b} × ${c} = ${b*c}. Depois: ${a} + ${b*c} − ${d} = <b>${fmt(v)}</b>.`,'Multiplicação vem antes de adição e subtração.',{keys:['−']});},
 lv=>{const a=R(2,15),b=R(2,15),c=R(2,6),d=R(1,20);const v=(a+b)*c-d;return NUM(`Calcule: <b>(${a} + ${b}) × ${c} − ${d}</b>`,v,`Parênteses: ${a} + ${b} = ${a+b}. Depois ${a+b} × ${c} = ${(a+b)*c}. Por fim ${(a+b)*c} − ${d} = <b>${v}</b>.`,'Resolva primeiro o que está entre parênteses.');},
 lv=>{const a=R(2,9),b=R(2,9),c=R(2,9);const v=a*a-b*c;return NUM(`Calcule: <b>${a}<sup>2</sup> − ${b} × ${c}</b>`,v,`Potência: ${a}<sup>2</sup> = ${a*a}. Multiplicação: ${b} × ${c} = ${b*c}. ${a*a} − ${b*c} = <b>${fmt(v)}</b>.`,'Potências primeiro, depois multiplicação, depois subtração.',{keys:['−']});},
 lv=>{const a=R(2,20),b=R(2,9),c=R(2,9);const v=a+b*c;return MC(`Qual é o valor de <b>${a} + ${b} × ${c}</b>?`,v,[(a+b)*c,a+b+c,a*b+c],`A multiplicação vem primeiro: ${b} × ${c} = ${b*c}; ${a} + ${b*c} = ${v}. Fazer (${a} + ${b}) × ${c} = ${(a+b)*c} é o erro mais comum!`,'Não resolva da esquerda para a direita sem olhar as prioridades.');},
 lv=>{const b=R(2,9),q=R(2,9),c=R(2,9),d=R(2,9);const a=b*q,v=q+c*d;return NUM(`Calcule: <b>${a} ÷ ${b} + ${c} × ${d}</b>`,v,`${a} ÷ ${b} = ${q}; ${c} × ${d} = ${c*d}; ${q} + ${c*d} = <b>${v}</b>.`,'Faça divisão e multiplicação antes da adição.');},
]},
{id:'mmc',name:'MMC, MDC e primos',icon:'🔗',tip:'MMC: menor múltiplo comum (use para "quando se encontram de novo"). MDC: maior divisor comum (use para "dividir em partes iguais, do maior tamanho possível").',
theory:`<h3>Números primos</h3><p>Têm exatamente 2 divisores: 1 e ele mesmo. 2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31… (1 não é primo; 2 é o único primo par.)</p>
<h3>MMC — Mínimo Múltiplo Comum</h3><p>Menor número que é múltiplo de todos. Ex.: múltiplos de 4: 4, 8, <b>12</b>… de 6: 6, <b>12</b>… → MMC(4, 6) = 12.</p>
<h3>MDC — Máximo Divisor Comum</h3><p>Maior número que divide todos. Divisores de 12: 1, 2, 3, 4, <b>6</b>, 12; de 18: 1, 2, 3, <b>6</b>, 9, 18 → MDC = 6.</p>
<div class="formula">MMC(a, b) × MDC(a, b) = a × b</div>
<h3>Critérios de divisibilidade</h3><ul><li>por 2: termina em número par</li><li>por 3: soma dos algarismos divisível por 3</li><li>por 4: dois últimos algarismos formam múltiplo de 4</li><li>por 5: termina em 0 ou 5</li><li>por 9: soma dos algarismos divisível por 9</li><li>por 10: termina em 0</li></ul>`,
gens:[
 lv=>{const g=R(2,6),x=R(1,6),y=R(2,7);const a=g*x,b=g*y;if(a===b)return NUM(`MMC(${a}, ${a*2})?`,a*2,`${a*2} já é múltiplo de ${a}.`,'');return NUM(`Qual é o <b>MMC(${a}, ${b})</b>?`,lcm(a,b),`Múltiplos de ${a}: ${[1,2,3,4].map(i=>a*i).join(', ')}… O primeiro múltiplo comum com ${b} é <b>${lcm(a,b)}</b>.`,'Liste os múltiplos do maior número até achar um que o outro também divida.');},
 lv=>{const g=R(2,12),x=R(1,6),y=R(1,7);const a=g*x,b=g*(x===y?y+1:y);return NUM(`Qual é o <b>MDC(${a}, ${b})</b>?`,gcd(a,b),`O maior número que divide ${a} e ${b} ao mesmo tempo é <b>${gcd(a,b)}</b>.`,'Liste os divisores do menor número e teste no maior.');},
 lv=>{let a,b;do{a=pick([4,6,8,10,12,15,18,20]);b=pick([6,8,9,10,12,15,20,30]);}while(a===b);return NUM(`Dois ônibus saem juntos do terminal. Um parte a cada <b>${a} min</b> e o outro a cada <b>${b} min</b>. Depois de quantos minutos sairão juntos de novo?`,lcm(a,b),`Buscamos o menor múltiplo comum: MMC(${a}, ${b}) = <b>${lcm(a,b)} min</b>.`,'"Encontrar-se novamente" → MMC.',{unit:'min'});},
 lv=>{const pr=[2,3,5,7,11,13,17,19,23,29,31,37,41,43,47,53,59,61,67,71,73,79,83,89,97];const cp=[1,9,15,21,27,33,39,49,51,57,63,69,77,81,87,91,93];return MC('Qual destes números é <b>primo</b>?',pick(pr),shuffle(cp),'Um primo tem exatamente dois divisores: 1 e ele mesmo. Os outros têm mais divisores (ex.: 51 = 3 × 17; 91 = 7 × 13).','Teste a divisão por 2, 3, 5 e 7.');},
 lv=>{const d=pick([2,3,4,5,9,10]);const n=R(100,9999);const ok=n%d===0;const rule={2:'termina em algarismo par',3:'a soma dos algarismos é divisível por 3',4:'os dois últimos algarismos formam múltiplo de 4',5:'termina em 0 ou 5',9:'a soma dos algarismos é divisível por 9',10:'termina em 0'}[d];const sd=String(n).split('').reduce((s,c)=>s+ +c,0);return TF(`${nf(n)} é divisível por ${d}.`,ok,`Critério: ${rule}.${d===3||d===9?` Soma dos algarismos = ${sd}.`:''} Portanto, ${ok?'<b>é</b>':'<b>não é</b>'} divisível por ${d}.`,`Use o critério de divisibilidade por ${d}.`);},
 lv=>{const g=R(3,12),x=R(2,6);let y=R(2,6);if(x===y)y++;return NUM(`Uma costureira tem duas fitas de <b>${g*x} cm</b> e <b>${g*y} cm</b>. Quer cortá-las em pedaços iguais, do maior tamanho possível, sem sobras. Qual o tamanho de cada pedaço?`,gcd(g*x,g*y),`Maior tamanho que divide as duas → MDC(${g*x}, ${g*y}) = <b>${gcd(g*x,g*y)} cm</b>.`,'"Maior pedaço possível sem sobra" → MDC.',{unit:'cm'});},
]},
{id:'porc',name:'Porcentagem',icon:'％',tip:'x% = x/100. Para calcular x% de V: V × x ÷ 100. Desconto de d%: multiplique por (1 − d/100).',
theory:`<p><b>Porcentagem</b> é uma fração de denominador 100: 25% = ${F(25,100)} = 0,25.</p>
<div class="formula">x% de V = V × ${F('x',100)}</div><div class="ex">30% de 250 = 250 × 0,30 = <b>75</b></div>
<h3>Atalhos</h3><ul><li>50% = metade · 25% = um quarto · 10% = divide por 10 · 1% = divide por 100</li></ul>
<h3>Aumentos e descontos</h3><ul><li>Aumento de 20%: multiplica por 1,20</li><li>Desconto de 15%: multiplica por 0,85</li></ul>
<h3>Quanto % é?</h3><div class="formula">porcentagem = ${F('parte','todo')} × 100</div><div class="ex">12 de 48 → ${F(12,48)} = 0,25 = <b>25%</b></div>`,
gens:[
 lv=>{const p=pick([5,10,15,20,25,30,40,50,60,75,80]),V=R(1,lv<3?20:50)*20;return NUM(`Quanto é <b>${p}% de ${nf(V)}</b>?`,V*p/100,`${nf(V)} × ${p}/100 = <b>${fmt(V*p/100)}</b>.`,p===10?'10% é dividir por 10.':`Calcule 1% (÷100) ou 10% (÷10) e ajuste.`);},
 lv=>{const p=pick([10,20,25,30,50]),V=R(2,40)*20;return NUM(`Uma camiseta de <b>R$ ${V}</b> está com <b>${p}% de desconto</b>. Qual é o novo preço?`,V*(1-p/100),`Desconto = ${p}% de ${V} = ${V*p/100}. Novo preço = ${V} − ${V*p/100} = <b>R$ ${fmt(V*(1-p/100))}</b>.`,`Calcule ${p}% do preço e subtraia.`);},
 lv=>{const p=pick([5,10,20,25,50]),V=R(2,40)*20;return NUM(`Um salário de <b>R$ ${nf(V*10)}</b> teve aumento de <b>${p}%</b>. Qual é o novo salário?`,V*10*(1+p/100),`Aumento = ${p}% de ${nf(V*10)} = ${nf(V*10*p/100)}. Novo = <b>R$ ${nf(V*10*(1+p/100))}</b>.`,'Calcule o aumento e some ao valor inicial.');},
 lv=>{let y,p,x;do{y=pick([20,25,40,50,80,200,500,60,120]);p=pick([10,20,25,40,50,60,75,30]);x=y*p/100;}while(!Number.isInteger(x));return NUM(`<b>${x}</b> é quantos por cento de <b>${y}</b>?`,p,`${F(x,y)} = ${fmt(x/y)} = <b>${p}%</b>.`,'Divida a parte pelo todo e multiplique por 100.',{unit:'%'});},
 lv=>{const f=pick([[1,2,50],[1,4,25],[3,4,75],[1,5,20],[1,10,10],[2,5,40]]);return BANK('Qual fração corresponde à porcentagem?',`${f[2]}% = @@`,F(f[0],f[1]),[F(1,2),F(1,4),F(3,4),F(1,5),F(1,10),F(2,5),F(f[2],10)],`${f[2]}% = ${F(f[2],100)} = ${F(f[0],f[1])}.`,'Escreva como fração de denominador 100 e simplifique.');},
 lv=>{const f=pick([[1,2,50],[1,4,25],[3,4,75],[1,5,20],[2,5,40],[1,10,10],[3,10,30],[1,20,5],[1,8,12.5],[3,5,60]]);return MC(`A fração ${F(f[0],f[1])} corresponde a quantos por cento?`,fmt(f[2])+'%',[fmt(f[0]*10)+'%',fmt(f[1]*10)+'%',fmt(f[2]/2)+'%',fmt(100-f[2])+'%'],`${F(f[0],f[1])} = ${f[0]} ÷ ${f[1]} = ${fmt(f[2]/100)} = <b>${fmt(f[2])}%</b>.`,'Divida o numerador pelo denominador e multiplique por 100.');},
]},
{id:'prop',name:'Razão, proporção e regra de três',icon:'⚖️',tip:'Grandezas diretamente proporcionais: multiplique cruzado. Inversamente proporcionais (mais trabalhadores → menos dias): multiplique em linha.',
theory:`<p><b>Razão</b> entre a e b é ${F('a','b')}. <b>Proporção</b> é a igualdade de duas razões: ${F(2,3)} = ${F(4,6)}.</p>
<div class="formula">${F('a','b')} = ${F('c','d')} ⟹ a · d = b · c</div>
<h3>Regra de três direta</h3><p>Se uma grandeza aumenta e a outra também aumenta na mesma razão.</p><div class="ex">3 cadernos → R$ 24; 5 cadernos → x. 3x = 5 · 24 → x = <b>R$ 40</b></div>
<h3>Regra de três inversa</h3><p>Se uma aumenta e a outra diminui.</p><div class="ex">6 pedreiros → 10 dias; 4 pedreiros → x. 4x = 6 · 10 → x = <b>15 dias</b></div>
<h3>Escala</h3><p>1 : 100 000 significa 1 cm no mapa = 100 000 cm = 1 km real.</p>`,
gens:[
 lv=>{const a=R(2,8),u=R(2,15),b=R(2,12)+(0);const it=pick(['cadernos','canetas','pães','bolos','livros']);if(a===b)return NUM(`Se ${a} ${it} custam R$ ${a*u}, quanto custa 1?`,u,`${a*u} ÷ ${a} = ${u}.`,'');return NUM(`Se <b>${a}</b> ${it} custam <b>R$ ${a*u}</b>, quanto custam <b>${b}</b> ${it}?`,b*u,`Regra de três direta: ${a}x… cada um custa ${a*u} ÷ ${a} = ${u}; ${b} × ${u} = <b>R$ ${b*u}</b>.`,'Descubra o preço de 1 unidade e multiplique.');},
 lv=>{const P=pick([24,36,48,60,72,120]);const ds=[...Array(12)].map((_,i)=>i+2).filter(d=>P%d===0);let w1=pick(ds),w2=pick(ds);if(w1===w2)w2=ds.find(d=>d!==w1);return NUM(`<b>${w1}</b> pedreiros constroem um muro em <b>${P/w1}</b> dias. Em quantos dias <b>${w2}</b> pedreiros construiriam o mesmo muro?`,P/w2,`Grandezas <b>inversamente</b> proporcionais: ${w1} × ${P/w1} = ${w2} × x → x = ${P} ÷ ${w2} = <b>${P/w2} dias</b>.`,'Mais trabalhadores → menos dias: é inversa, multiplique em linha.',{unit:'dias'});},
 lv=>{const a=R(2,9),b=R(2,9),k=R(2,6);return FILL('Complete a proporção:',`${F(a,b)} = <span class="fr"><span>${a*k}</span><span>@@</span></span>`,b*k,`Multiplicando em cruz: ${a} · x = ${b} · ${a*k} → x = <b>${b*k}</b>.`,`O numerador foi multiplicado por ${k}.`);},
 lv=>{const s=pick([100000,200000,500000,1000000]),cm=R(1,9);return NUM(`Num mapa de escala <b>1 : ${nf(s)}</b>, uma distância de <b>${cm} cm</b> no mapa corresponde a quantos <b>km</b> reais?`,cm*s/100000,`${cm} × ${nf(s)} = ${nf(cm*s)} cm = <b>${fmt(cm*s/100000)} km</b> (1 km = 100 000 cm).`,'Multiplique pela escala e converta cm em km (÷ 100 000).',{unit:'km'});},
 lv=>{let a,b,g;do{g=R(2,8);a=g*R(1,6);b=g*R(1,6);}while(a===b);return MC(`A razão entre <b>${a}</b> e <b>${b}</b>, na forma mais simples, é:`,Fs(a,b),[Fs(b,a),F(a,b),Fs(a+1,b),Fs(a,b+g)],`${F(a,b)} dividindo por ${gcd(a,b)} = ${Fs(a,b)}.`,'Escreva a/b e simplifique.');},
 lv=>{const v=pick([40,50,60,80,90,100]),t=R(2,6),t2=R(2,8);return NUM(`Um carro a <b>${v} km/h</b> percorre quantos km em <b>${t2} horas</b>?`,v*t2,`Distância = velocidade × tempo = ${v} × ${t2} = <b>${v*t2} km</b>.`,'Em 1 hora anda '+v+' km.',{unit:'km'});},
]},
{id:'eq1',name:'Equações do 1º grau',icon:'🟰',tip:'Isole o x: o que está somando passa subtraindo, o que está multiplicando passa dividindo (faça a mesma operação dos dois lados).',
theory:`<p>Uma <b>equação</b> é uma igualdade com uma incógnita (x). Resolver é achar o valor que torna a igualdade verdadeira.</p>
<h3>Princípio da balança</h3><p>Faça a <b>mesma operação</b> nos dois lados.</p>
<div class="ex">3x + 5 = 20<br>3x = 20 − 5<br>3x = 15<br>x = 15 ÷ 3 = <b>5</b></div>
<div class="ex">2(x − 4) = 10 → 2x − 8 = 10 → 2x = 18 → x = <b>9</b></div>
<h3>Variáveis dos dois lados</h3><div class="ex">5x − 3 = 2x + 9 → 5x − 2x = 9 + 3 → 3x = 12 → x = <b>4</b></div>
<h3>Traduzindo problemas</h3><p>"o dobro de um número" = 2x · "a metade" = x/2 · "um número mais 5" = x + 5</p>`,
gens:[
 lv=>{const x=R(-10,12),a=R(2,9),b=RNZ(-20,20),c=a*x+b;return NUM(`Resolva: <b>${lin(a,b)} = ${fmt(c)}</b>`,x,`${a}x = ${fmt(c)} ${b<0?'+ '+(-b):'− '+b} = ${fmt(c-b)} → x = ${fmt(c-b)} ÷ ${a} = <b>${fmt(x)}</b>.`,`Passe o ${fmt(b)} para o outro lado com sinal trocado e depois divida por ${a}.`,{keys:['−']});},
 lv=>{const x=R(-6,10),a=R(2,6),b=RNZ(-8,8),c=a*(x+b);return NUM(`Resolva: <b>${a}(${lin(1,b)}) = ${fmt(c)}</b>`,x,`Divida por ${a}: ${lin(1,b)} = ${fmt(c/a)} → x = <b>${fmt(x)}</b>.`,`Divida os dois lados por ${a} primeiro.`,{keys:['−']});},
 lv=>{const n=R(1,20),m=pick([['dobro',2],['triplo',3],['quádruplo',4],['quíntuplo',5]]),b=R(1,20);return NUM(`O <b>${m[0]}</b> de um número, mais <b>${b}</b>, é igual a <b>${m[1]*n+b}</b>. Qual é o número?`,n,`${m[1]}x + ${b} = ${m[1]*n+b} → ${m[1]}x = ${m[1]*n} → x = <b>${n}</b>.`,`Monte a equação: ${m[1]}x + ${b} = ${m[1]*n+b}.`);},
 lv=>{const a=pick([2,3,4,5]),k=R(-5,8),x=a*k,b=RNZ(-9,9),c=k+b;return NUM(`Resolva: <b>${F('x',a)}${sgn(b)} = ${fmt(c)}</b>`,x,`${F('x',a)} = ${fmt(c)} ${b<0?'+ '+(-b):'− '+b} = ${fmt(k)} → x = ${fmt(k)} × ${a} = <b>${fmt(x)}</b>.`,`Isole x/${a} e depois multiplique por ${a}.`,{keys:['−']});},
 lv=>{const x=R(-6,9);let a=R(2,9),c=R(1,8);if(a===c)a++;const b=R(-10,10),d=a*x+b-c*x;return NUM(`Resolva: <b>${lin(a,b)} = ${lin(c,d)}</b>`,x,`${a}x − ${c}x = ${fmt(d)} ${b<0?'+ '+(-b):'− '+b} → ${a-c}x = ${fmt(d-b)} → x = <b>${fmt(x)}</b>.`,'Junte os termos com x de um lado e os números do outro.',{keys:['−']});},
 lv=>{const x=R(1,9),a=R(2,6),b=R(1,15);const opts=[x,x+1,x-1,-x,x+2].map(fmt);return MC(`Qual valor de x satisfaz <b>${lin(a,b)} = ${a*x+b}</b>?`,x,opts.slice(1),`Teste: ${a} · ${x} + ${b} = ${a*x+b}. ✔`,'Substitua cada opção na equação.');},
]},
]});

/* ------------------------ UNIDADE 3 — FUNDAMENTAL II (8º–9º) ------------------------ */
const TRIPLES=[[3,4,5],[6,8,10],[5,12,13],[8,15,17],[9,12,15],[7,24,25],[12,16,20],[20,21,29]];
UNITS.push({id:'u3',title:'Fundamental II · parte 2',sub:'8º e 9º ano · geometria, álgebra, 2º grau, estatística',color:'#ff9600',dark:'#e07b00',skills:[
{id:'area',name:'Áreas',icon:'📐',tip:'Retângulo: b·h. Triângulo: b·h/2. Trapézio: (B+b)·h/2. Círculo: π·r².',
theory:`<p><b>Área</b> mede a superfície ocupada por uma figura (unidades ao quadrado: cm², m²).</p>
<table><tr><th>Figura</th><th>Área</th></tr><tr><td>Quadrado</td><td>ℓ²</td></tr><tr><td>Retângulo</td><td>b · h</td></tr><tr><td>Triângulo</td><td>${F('b · h',2)}</td></tr><tr><td>Paralelogramo</td><td>b · h</td></tr><tr><td>Trapézio</td><td>${F('(B + b) · h',2)}</td></tr><tr><td>Losango</td><td>${F('D · d',2)}</td></tr><tr><td>Círculo</td><td>π · r²</td></tr></table>
<h3>Circunferência</h3><div class="formula">Comprimento C = 2 · π · r</div><div class="ex">Círculo de raio 5 (π ≈ 3,14): A = 3,14 · 25 = 78,5 · C = 2 · 3,14 · 5 = 31,4</div>`,
gens:[
 lv=>{const w=R(3,lv<3?15:30),h=R(2,w);return NUM('Qual é a <b>área</b> do retângulo (em cm²)?',w*h,`A = base × altura = ${w} × ${h} = <b>${w*h} cm²</b>.`,'Multiplique a base pela altura.',{visual:rectSVG(w+' cm',h+' cm',w/h),unit:'cm²'});},
 lv=>{const b=R(2,15)*2,h=R(2,15);return NUM(`Um triângulo tem base <b>${b} cm</b> e altura <b>${h} cm</b>. Qual é sua área?`,b*h/2,`A = ${F('b · h',2)} = ${F(b+' · '+h,2)} = <b>${b*h/2} cm²</b>.`,'Área do triângulo é metade de base × altura.',{unit:'cm²'});},
 lv=>{const r=R(1,10),t=Math.random()<.5;return t?NUM(`Qual é a <b>área</b> de um círculo de raio <b>${r} cm</b>? (use π = 3,14)`,3.14*r*r,`A = π · r² = 3,14 · ${r*r} = <b>${fmt(3.14*r*r)} cm²</b>.`,'A = π · r².',{visual:circleSVG('r = '+r),unit:'cm²',tol:0.02,keys:[',']}):NUM(`Qual é o <b>comprimento</b> da circunferência de raio <b>${r} cm</b>? (use π = 3,14)`,2*3.14*r,`C = 2 · π · r = 2 · 3,14 · ${r} = <b>${fmt(6.28*r)} cm</b>.`,'C = 2 · π · r.',{visual:circleSVG('r = '+r),unit:'cm',tol:0.02,keys:[',']});},
 lv=>{let B=R(6,20),b=R(2,B-2),h=R(2,12);if((B+b)*h%2)h++;return NUM('Qual é a área do trapézio (em cm²)?',(B+b)*h/2,`A = ${F('(B + b) · h',2)} = ${F(`(${B} + ${b}) · ${h}`,2)} = <b>${(B+b)*h/2} cm²</b>.`,'Some as bases, multiplique pela altura e divida por 2.',{visual:trapSVG(B+' cm',b+' cm',h+' cm'),unit:'cm²'});},
 lv=>{const l=R(2,20);return NUM(`Um quadrado tem área <b>${l*l} m²</b>. Quanto mede seu lado?`,l,`ℓ² = ${l*l} → ℓ = √${l*l} = <b>${l} m</b>.`,'Tire a raiz quadrada da área.',{unit:'m'});},
 lv=>{const D=R(2,12)*2,d=R(2,10);return NUM(`Um losango tem diagonais de <b>${D} cm</b> e <b>${d} cm</b>. Qual é sua área?`,D*d/2,`A = ${F('D · d',2)} = ${F(D+' · '+d,2)} = <b>${D*d/2} cm²</b>.`,'Área do losango = produto das diagonais ÷ 2.',{unit:'cm²'});},
]},
{id:'ang',name:'Ângulos e polígonos',icon:'📐',tip:'Complementares somam 90°, suplementares 180°. A soma dos ângulos internos de um triângulo é 180°; de um polígono de n lados é (n − 2)·180°.',
theory:`<h3>Classificação</h3><ul><li><b>Agudo</b>: menor que 90°</li><li><b>Reto</b>: exatamente 90°</li><li><b>Obtuso</b>: entre 90° e 180°</li><li><b>Raso</b>: 180°</li></ul>
<h3>Pares de ângulos</h3><ul><li>Complementares: somam <b>90°</b></li><li>Suplementares: somam <b>180°</b></li><li>Opostos pelo vértice: são <b>iguais</b></li></ul>
<h3>Polígonos</h3><div class="formula">Soma dos ângulos internos: S = (n − 2) · 180°</div><p>Triângulo: 180° · Quadrilátero: 360° · Pentágono: 540° · Hexágono: 720°. Em um polígono <b>regular</b>, cada ângulo interno = S ÷ n.</p>`,
gens:[
 lv=>{const a=R(5,85),s=Math.random()<.5;return s?NUM(`Qual é o <b>complemento</b> de um ângulo de ${a}°?`,90-a,`Complementares somam 90°: 90° − ${a}° = <b>${90-a}°</b>.`,'Complemento → quanto falta para 90°.',{unit:'°'}):NUM(`Qual é o <b>suplemento</b> de um ângulo de ${a+40}°?`,140-a,`Suplementares somam 180°: 180° − ${a+40}° = <b>${140-a}°</b>.`,'Suplemento → quanto falta para 180°.',{unit:'°'});},
 lv=>{const A=R(20,100),B=R(20,150-A),C=180-A-B;return NUM('Qual é a medida do ângulo desconhecido do triângulo?',C,`A soma dos ângulos internos é 180°: 180° − ${A}° − ${B}° = <b>${C}°</b>.`,'Os três ângulos de um triângulo somam 180°.',{visual:triSVG(A+'°',B+'°','?'),unit:'°'});},
 lv=>{const t=pick(['agudo','reto','obtuso','raso']);const a={agudo:R(10,80),reto:90,obtuso:R(100,170),raso:180}[t];return MC(`Um ângulo de <b>${a}°</b> é classificado como:`,t[0].toUpperCase()+t.slice(1),['Agudo','Reto','Obtuso','Raso'],`${a}° é ${t}: agudo < 90° = reto < obtuso < 180° = raso.`,'Compare com 90° e 180°.',{keep:true,visual:a<180?angleSVG(a):''});},
 lv=>{const p=pick([[3,'triângulo'],[4,'quadrilátero'],[5,'pentágono'],[6,'hexágono'],[8,'octógono'],[10,'decágono'],[12,'dodecágono']]);return NUM(`Qual é a soma dos ângulos internos de um <b>${p[1]}</b>?`,(p[0]-2)*180,`S = (n − 2) · 180° = (${p[0]} − 2) · 180° = <b>${(p[0]-2)*180}°</b>.`,'Use S = (n − 2) · 180°.',{unit:'°'});},
 lv=>{const a=R(20,160);return MC(`Duas retas se cruzam formando um ângulo de <b>${a}°</b>. Quanto mede o ângulo <b>oposto pelo vértice</b> a ele?`,a+'°',[(180-a)+'°',(90-a>0?90-a:a+10)+'°',(360-a)+'°'],'Ângulos opostos pelo vértice são congruentes (iguais).','Opostos pelo vértice têm a mesma medida.');},
 lv=>{const n=pick([3,4,5,6,8,9,10,12]);return NUM(`Quanto mede cada ângulo interno de um polígono <b>regular</b> de ${n} lados?`,(n-2)*180/n,`S = (${n} − 2) · 180° = ${(n-2)*180}°; cada ângulo = ${(n-2)*180} ÷ ${n} = <b>${fmt((n-2)*180/n)}°</b>.`,'Calcule a soma e divida pelo número de ângulos.',{unit:'°'});},
]},
{id:'pit',name:'Teorema de Pitágoras',icon:'📏',tip:'Num triângulo retângulo: hipotenusa² = cateto² + cateto². A hipotenusa é o maior lado, oposto ao ângulo reto.',
theory:`<p>Em todo <b>triângulo retângulo</b>, o quadrado da hipotenusa é igual à soma dos quadrados dos catetos.</p><div class="formula">a² = b² + c²</div>
<p>A <b>hipotenusa</b> (a) é o lado oposto ao ângulo de 90° e é sempre o maior lado.</p>
<div class="ex">Catetos 6 e 8: a² = 36 + 64 = 100 → a = <b>10</b></div><div class="ex">Hipotenusa 13 e cateto 5: c² = 169 − 25 = 144 → c = <b>12</b></div>
<h3>Ternos pitagóricos úteis</h3><p>(3, 4, 5) · (5, 12, 13) · (8, 15, 17) · (7, 24, 25) e seus múltiplos.</p>
<h3>Diagonal do quadrado</h3><div class="formula">d = ℓ√2</div>`,
gens:[
 lv=>{const [a,b,c]=pick(TRIPLES);return NUM('Qual é a medida da <b>hipotenusa</b>?',c,`x² = ${a}² + ${b}² = ${a*a} + ${b*b} = ${c*c} → x = <b>${c}</b>.`,'Hipotenusa² = soma dos quadrados dos catetos.',{visual:rtSVG(a,b,'x')});},
 lv=>{const [a,b,c]=pick(TRIPLES);return NUM('Qual é a medida do cateto <b>x</b>?',a,`x² = ${c}² − ${b}² = ${c*c} − ${b*b} = ${a*a} → x = <b>${a}</b>.`,'Cateto² = hipotenusa² − outro cateto².',{visual:rtSVG('x',b,c)});},
 lv=>{const [a,b,c]=pick(TRIPLES);const ok=Math.random()<.5;const cc=ok?c:c+pick([1,2,-1]);return TF(`Um triângulo com lados <b>${a}</b>, <b>${b}</b> e <b>${cc}</b> é retângulo.`,ok,`${a}² + ${b}² = ${a*a+b*b}${ok?' = ':' ≠ '}${cc}² = ${cc*cc}. ${ok?'Satisfaz':'Não satisfaz'} Pitágoras.`,'Verifique se o quadrado do maior lado é a soma dos quadrados dos outros.');},
 lv=>{const [a,b,c]=pick(TRIPLES.filter(t=>t[2]<=25));return NUM(`Uma escada de <b>${c} m</b> está apoiada numa parede, com o pé a <b>${a} m</b> da parede. A que altura ela toca a parede?`,b,`h² = ${c}² − ${a}² = ${c*c-a*a} → h = <b>${b} m</b>.`,'A escada é a hipotenusa.',{unit:'m'});},
 lv=>{const l=R(2,12);return MC(`Qual é a diagonal de um quadrado de lado <b>${l} cm</b>?`,`${l}√2 cm`,[`${2*l} cm`,`${l}√3 cm`,`${l*l} cm`,`2√${l} cm`],`d² = ${l}² + ${l}² = 2 · ${l*l} → d = ${l}√2 cm.`,'A diagonal divide o quadrado em dois triângulos retângulos.');},
]},
{id:'alg',name:'Expressões algébricas',icon:'🔤',tip:'(a + b)² = a² + 2ab + b²; (a − b)² = a² − 2ab + b²; (a + b)(a − b) = a² − b².',
theory:`<h3>Valor numérico</h3><p>Substitua a letra pelo número: se x = 3, 2x + 5 = 2 · 3 + 5 = 11.</p>
<h3>Termos semelhantes</h3><p>Só somamos termos com a mesma parte literal: 3x + 5x − 2x = 6x.</p>
<h3>Produtos notáveis</h3><div class="formula">(a + b)² = a² + 2ab + b²</div><div class="formula">(a − b)² = a² − 2ab + b²</div><div class="formula">(a + b)(a − b) = a² − b²</div>
<div class="ex">(x + 3)² = x² + 6x + 9 · (x + 5)(x − 5) = x² − 25</div>
<h3>Fatoração</h3><p>Fator comum: 4x + 8 = 4(x + 2). Diferença de quadrados: x² − 49 = (x + 7)(x − 7).</p>`,
gens:[
 lv=>{const a=RNZ(-6,9),b=R(-10,10),x=R(-5,6);return NUM(`Qual é o valor de <b>${lin(a,b)}</b> para <b>x = ${fmt(x)}</b>?`,a*x+b,`${a} · ${par(x)} ${b<0?'− '+(-b):'+ '+b} = ${fmt(a*x)} ${b<0?'− '+(-b):'+ '+b} = <b>${fmt(a*x+b)}</b>.`,'Substitua x pelo número (use parênteses se for negativo).',{keys:['−']});},
 lv=>{const a=R(2,9),b=R(2,9),c=R(1,9);return FILL('Reduza os termos semelhantes:',`${a}x + ${b}x − ${c}x = @@x`,a+b-c,`${a} + ${b} − ${c} = ${a+b-c}, então o resultado é <b>${fmt(a+b-c)}x</b>.`,'Opere apenas os coeficientes.',{keys:['−']});},
 lv=>{const a=R(1,9),m=Math.random()<.5?1:-1;return MC(`Desenvolva <b>(x ${m>0?'+':'−'} ${a})<sup>2</sup></b>`,quad(1,2*a*m,a*a),[quad(1,0,a*a),quad(1,a*m,a*a),quad(1,2*a*m,2*a),quad(1,-2*a*m,a*a)],`(a ${m>0?'+':'−'} b)² = a² ${m>0?'+':'−'} 2ab + b² → ${quad(1,2*a*m,a*a)}.`,'Quadrado do primeiro, 2 vezes o primeiro vezes o segundo, quadrado do segundo.');},
 lv=>{const a=R(2,9);return BANK('Complete o produto notável:',`(x + ${a})<sup>2</sup> = x<sup>2</sup> + @@ + ${a*a}`,`${2*a}x`,[`${a}x`,`${a*a}x`,`2x`,`${2*a}`],`O termo do meio é 2 · x · ${a} = ${2*a}x.`,'O termo do meio é o dobro do produto dos termos.');},
 lv=>{const a=R(2,12);return MC(`Qual é o resultado de <b>(x + ${a})(x − ${a})</b>?`,quad(1,0,-a*a),[quad(1,0,a*a),quad(1,-2*a,a*a),quad(1,0,-2*a),quad(1,-a,0)],`Produto da soma pela diferença: x² − ${a}² = ${quad(1,0,-a*a)}.`,'(a + b)(a − b) = a² − b².');},
 lv=>{const a=R(2,12);return MC(`Fatore <b>${quad(1,0,-a*a)}</b>`,`(x + ${a})(x − ${a})`,[`(x − ${a})<sup>2</sup>`,`(x + ${a})<sup>2</sup>`,`x(x − ${a})`,`(x − ${a*a})(x + 1)`],`Diferença de quadrados: x² − ${a}² = (x + ${a})(x − ${a}).`,'Reconheça a diferença de dois quadrados.');},
 lv=>{const a=R(2,9),b=RNZ(-9,9);return MC(`Aplique a distributiva: <b>${a}(${lin(1,b)})</b>`,lin(a,a*b),[lin(a,b),lin(1,a*b),lin(a,a+b)],`${a} · x ${b<0?'−':'+'} ${a} · ${Math.abs(b)} = ${lin(a,a*b)}.`,'Multiplique o número de fora por cada termo de dentro.');},
]},
{id:'sist',name:'Sistemas de equações',icon:'🔀',tip:'Adição: some as equações para eliminar uma incógnita. Substituição: isole uma letra e substitua na outra.',
theory:`<p>Um <b>sistema</b> tem duas equações e duas incógnitas; a solução é o par (x, y) que satisfaz ambas.</p>
<h3>Método da adição</h3><div class="ex">${SYS('x + y = 10','x − y = 4')}<br>Somando: 2x = 14 → x = 7; então y = 3.</div>
<h3>Método da substituição</h3><div class="ex">${SYS('y = 2x','x + y = 12')}<br>x + 2x = 12 → 3x = 12 → x = 4; y = 8.</div>
<h3>Problemas clássicos</h3><p>Carros e motos: se há C carros e M motos, veículos: C + M; rodas: 4C + 2M.</p>`,
gens:[
 lv=>{const x=R(-5,15),y=R(-5,15),ask=Math.random()<.5?'x':'y';return NUM(`Resolva o sistema e informe o valor de <b>${ask}</b>:<br>${SYS(`x + y = ${fmt(x+y)}`,`x − y = ${fmt(x-y)}`)}`,ask==='x'?x:y,`Somando as equações: 2x = ${fmt(2*x)} → x = ${fmt(x)}. Então y = ${fmt(x+y)} − ${par(x)} = ${fmt(y)}.`,'Some as duas equações: o y some.',{keys:['−']});},
 lv=>{const x=R(-4,8),y=R(-4,8);let a=R(1,4),b=R(1,4),c=R(1,4),d=RNZ(-4,4);if(a*d-b*c===0)d=d+1||2;return NUM(`Resolva e informe <b>x</b>:<br>${SYS(`${poly([a,b],['x','y'])} = ${fmt(a*x+b*y)}`,`${poly([c,d],['x','y'])} = ${fmt(c*x+d*y)}`)}`,x,`A solução é x = <b>${fmt(x)}</b> e y = ${fmt(y)}. Confira: ${a}·${par(x)} + ${b}·${par(y)} = ${fmt(a*x+b*y)} ✔`,'Multiplique uma equação para igualar os coeficientes de y e subtraia.',{keys:['−']});},
 lv=>{const c=R(3,25),m=R(3,25);return NUM(`Num estacionamento há <b>${c+m}</b> veículos entre carros e motos, com <b>${4*c+2*m}</b> rodas no total. Quantos são os <b>carros</b>?`,c,`${SYS('C + M = '+(c+m),'4C + 2M = '+(4*c+2*m))}<br>Multiplicando a 1ª por 2: 2C + 2M = ${2*(c+m)}. Subtraindo: 2C = ${2*c} → C = <b>${c}</b>.`,'Monte o sistema: C + M = total e 4C + 2M = rodas.');},
 lv=>{const x=R(-5,8),y=R(-5,8);if(x===y)return NUM(`Se x + y = ${2*x} e x − y = 0, quanto vale x?`,x,`2x = ${2*x} → x = ${x}.`,'',{keys:['−']});return MC(`Qual par (x, y) é solução do sistema?<br>${SYS(`x + y = ${fmt(x+y)}`,`x − y = ${fmt(x-y)}`)}`,`(${fmt(x)}, ${fmt(y)})`,[`(${fmt(y)}, ${fmt(x)})`,`(${fmt(x+1)}, ${fmt(y-1)})`,`(${fmt(-x)}, ${fmt(-y)})`],`x = ${fmt(x)} e y = ${fmt(y)} satisfazem as duas equações.`,'Teste cada par nas duas equações.');},
 lv=>{const a=R(2,20),b=R(1,a-1);return NUM(`A soma de dois números é <b>${a+b}</b> e a diferença entre eles é <b>${a-b}</b>. Qual é o <b>maior</b> número?`,a,`x + y = ${a+b} e x − y = ${a-b} → 2x = ${2*a} → x = <b>${a}</b>.`,'Monte o sistema e some as equações.');},
]},
{id:'eq2',name:'Equação do 2º grau',icon:'²',tip:'ax² + bx + c = 0: Δ = b² − 4ac; x = (−b ± √Δ) / 2a. Soma das raízes = −b/a; produto = c/a.',
theory:`<div class="formula">ax² + bx + c = 0 (a ≠ 0)</div>
<h3>Fórmula de Bhaskara</h3><div class="formula">Δ = b² − 4ac · x = ${F('−b ± √Δ','2a')}</div>
<ul><li>Δ > 0: duas raízes reais diferentes</li><li>Δ = 0: uma raiz real (dupla)</li><li>Δ < 0: nenhuma raiz real</li></ul>
<div class="ex">x² − 5x + 6 = 0 → Δ = 25 − 24 = 1 → x = ${F('5 ± 1',2)} → S = {2, 3}</div>
<h3>Soma e produto (Girard)</h3><div class="formula">S = x₁ + x₂ = ${F('−b','a')} · P = x₁ · x₂ = ${F('c','a')}</div>
<h3>Incompletas</h3><ul><li>x² − 9 = 0 → x = ±3</li><li>x² − 4x = 0 → x(x − 4) = 0 → S = {0, 4}</li></ul>`,
gens:[
 lv=>{const a=R(1,3),b=R(-10,10),c=R(-10,10);return NUM(`Calcule o discriminante <b>Δ</b> de <b>${quad(a,b,c)} = 0</b>`,b*b-4*a*c,`Δ = b² − 4ac = ${par(b)}² − 4 · ${a} · ${par(c)} = ${b*b} ${-4*a*c<0?'− '+(4*a*c):'+ '+(-4*a*c)} = <b>${fmt(b*b-4*a*c)}</b>.`,'Δ = b² − 4ac. Cuidado com os sinais!',{keys:['−']});},
 lv=>{const t=R(0,2);let a=1,b,c;if(t===0){const r1=R(-6,6),r2=R(-6,6)+ (Math.random()<.5?0:1);b=-(r1+r2);c=r1*r2;if(b*b-4*c===0)c-=1;}else if(t===1){const r=R(-6,6);b=-2*r;c=r*r;}else{b=R(-4,4);c=R(Math.floor(b*b/4)+1,15);}const D=b*b-4*a*c;const ans=D>0?'Duas raízes reais distintas':D===0?'Uma raiz real (dupla)':'Nenhuma raiz real';return MC(`Quantas raízes reais tem <b>${quad(a,b,c)} = 0</b>?`,ans,['Duas raízes reais distintas','Uma raiz real (dupla)','Nenhuma raiz real'],`Δ = ${par(b)}² − 4 · ${a} · ${par(c)} = ${D} → ${D>0?'Δ > 0':D===0?'Δ = 0':'Δ < 0'}: ${ans.toLowerCase()}.`,'Calcule Δ e observe o sinal.',{keep:true});},
 lv=>{let r1=R(-7,7),r2=R(-7,7);if(r1===r2)r2++;const [p,q]=[Math.min(r1,r2),Math.max(r1,r2)];const S=(x,y)=>`S = {${fmt(Math.min(x,y))}, ${fmt(Math.max(x,y))}}`;return MC(`Resolva <b>${quad(1,-(p+q),p*q)} = 0</b>`,S(p,q),[S(-p,-q),S(p,-q),S(p+1,q),S(-p,q)],`Soma = ${fmt(p+q)} e produto = ${fmt(p*q)}: os números são ${fmt(p)} e ${fmt(q)}. (Ou use Bhaskara.)`,'Procure dois números com soma −b e produto c.');},
 lv=>{const a=pick([1,1,2,3]),r1=R(-6,6),r2=R(-6,6),b=-a*(r1+r2),c=a*r1*r2,s=Math.random()<.5;return NUM(`Em <b>${quad(a,b,c)} = 0</b>, qual é o <b>${s?'soma':'produto'}</b> das raízes?`,s?r1+r2:r1*r2,s?`S = ${F('−b','a')} = ${F(fmt(-b),a)} = <b>${fmt(r1+r2)}</b>.`:`P = ${F('c','a')} = ${F(fmt(c),a)} = <b>${fmt(r1*r2)}</b>.`,s?'Soma = −b/a.':'Produto = c/a.',{keys:['−']});},
 lv=>{const r=R(1,12);return MC(`Resolva <b>x<sup>2</sup> − ${r*r} = 0</b>`,`S = {−${r}, ${r}}`,[`S = {${r}}`,`S = {${r*r}}`,`S = {−${r*r}, ${r*r}}`,`S = {0, ${r}}`],`x² = ${r*r} → x = ±√${r*r} = ±${r}.`,'Isole x² e tire a raiz (lembre do ±).');},
 lv=>{const k=RNZ(-9,9);return MC(`Resolva <b>${quad(1,-k,0)} = 0</b>`,`S = {${fmt(Math.min(0,k))}, ${fmt(Math.max(0,k))}}`,[`S = {${fmt(k)}}`,`S = {${fmt(Math.min(0,-k))}, ${fmt(Math.max(0,-k))}}`,`S = {1, ${fmt(k)}}`],`Coloque x em evidência: x(x ${k>0?'−':'+'} ${Math.abs(k)}) = 0 → x = 0 ou x = ${fmt(k)}.`,'Fatore colocando x em evidência.');},
]},
{id:'est',name:'Estatística básica',icon:'📊',tip:'Média = soma ÷ quantidade. Mediana = valor do meio (com os dados em ordem). Moda = valor que mais aparece.',
theory:`<h3>Medidas de tendência central</h3><ul><li><b>Média</b>: soma dos valores ÷ quantidade de valores.</li><li><b>Mediana</b>: coloque em ordem e pegue o termo central (se houver dois centrais, faça a média deles).</li><li><b>Moda</b>: valor que mais se repete.</li></ul>
<div class="ex">Dados: 2, 3, 3, 5, 7 → média = 20 ÷ 5 = 4 · mediana = 3 · moda = 3</div>
<h3>Amplitude</h3><p>Maior valor − menor valor. Mede a dispersão dos dados.</p>
<h3>Média ponderada</h3><div class="formula">M = ${F('x₁·p₁ + x₂·p₂ + …','p₁ + p₂ + …')}</div>`,
gens:[
 lv=>{let n,m,v,last;do{n=R(4,6);m=R(4,15);v=[...Array(n-1)].map(()=>R(1,25));last=m*n-v.reduce((a,b)=>a+b,0);}while(last<0||last>30);v=shuffle([...v,last]);return NUM(`Qual é a <b>média</b> dos valores: ${v.join(', ')}?`,m,`Soma = ${v.join(' + ')} = ${m*n}. Média = ${m*n} ÷ ${n} = <b>${m}</b>.`,'Some tudo e divida pela quantidade.');},
 lv=>{const n=pick([5,7,6]);const v=[...Array(n)].map(()=>R(1,40));const s=[...v].sort((a,b)=>a-b);const med=n%2?s[(n-1)/2]:(s[n/2-1]+s[n/2])/2;return NUM(`Qual é a <b>mediana</b> de: ${v.join(', ')}?`,med,`Em ordem: ${s.join(', ')}. ${n%2?`O termo central é <b>${med}</b>.`:`Os centrais são ${s[n/2-1]} e ${s[n/2]}; média = <b>${fmt(med)}</b>.`}`,'Primeiro coloque os dados em ordem crescente.',{keys:[',']});},
 lv=>{const mo=R(1,20);const others=shuffle([...Array(20)].map((_,i)=>i+1).filter(x=>x!==mo)).slice(0,R(3,5));const v=shuffle([mo,mo,mo,...others,others[0]]);return NUM(`Qual é a <b>moda</b> de: ${v.join(', ')}?`,mo,`O valor ${mo} aparece 3 vezes, mais que qualquer outro.`,'Conte quantas vezes cada valor aparece.');},
 lv=>{const v=[...Array(R(5,7))].map(()=>R(1,60));return NUM(`Qual é a <b>amplitude</b> dos dados: ${v.join(', ')}?`,Math.max(...v)-Math.min(...v),`Amplitude = maior − menor = ${Math.max(...v)} − ${Math.min(...v)} = <b>${Math.max(...v)-Math.min(...v)}</b>.`,'Subtraia o menor valor do maior.');},
 lv=>{const n1=R(4,10),n2=R(4,10),p1=pick([1,2,3]),p2=pick([1,2,3]);const tot=n1*p1+n2*p2;if(tot%(p1+p2))return NUM(`Média de ${n1} e ${n2}?`,(n1+n2)/2,`(${n1} + ${n2}) ÷ 2 = ${fmt((n1+n2)/2)}.`,'',{keys:[',']});return NUM(`Uma prova (peso ${p1}) teve nota <b>${n1}</b> e um trabalho (peso ${p2}) teve nota <b>${n2}</b>. Qual a média ponderada?`,tot/(p1+p2),`M = (${n1}·${p1} + ${n2}·${p2}) ÷ (${p1}+${p2}) = ${tot} ÷ ${p1+p2} = <b>${fmt(tot/(p1+p2))}</b>.`,'Multiplique cada nota pelo peso, some e divida pela soma dos pesos.');},
 lv=>{const q=pick([['Qual medida é o valor que mais se repete?','Moda'],['Qual medida exige colocar os dados em ordem e pegar o valor central?','Mediana'],['Qual medida é a soma dos valores dividida pela quantidade?','Média'],['Qual medida é a diferença entre o maior e o menor valor?','Amplitude']]);return MC(q[0],q[1],['Moda','Mediana','Média','Amplitude'],`${q[1]}: ${{Moda:'valor mais frequente',Mediana:'valor central dos dados ordenados',Média:'soma ÷ quantidade',Amplitude:'maior − menor'}[q[1]]}.`,'Revise as definições na aula.',{keep:true});},
]},
{id:'notc',name:'Notação científica',icon:'🔬',tip:'Formato a × 10ⁿ com 1 ≤ a < 10. Andar a vírgula para a esquerda aumenta n; para a direita diminui n.',
theory:`<div class="formula">N = a × 10<sup>n</sup>, com 1 ≤ a < 10 e n inteiro</div>
<div class="ex">3 200 000 = 3,2 × 10<sup>6</sup> (a vírgula andou 6 casas para a esquerda)</div><div class="ex">0,00045 = 4,5 × 10<sup>−4</sup> (a vírgula andou 4 casas para a direita)</div>
<h3>Operações</h3><ul><li>Multiplicação: multiplique os coeficientes e some os expoentes.</li><li>Divisão: divida os coeficientes e subtraia os expoentes.</li></ul>
<div class="ex">(2 × 10<sup>3</sup>) · (3 × 10<sup>4</sup>) = 6 × 10<sup>7</sup></div>`,
gens:[
 lv=>{const mi=R(11,99),e=R(3,9),N=mi*10**(e-1),m=mi/10;const o=(c,x)=>`${fmt(c)} × 10<sup>${x}</sup>`;return MC(`Escreva <b>${nf(N)}</b> em notação científica:`,o(m,e),[o(m,e-1),o(m,e+1),o(mi,e),o(mi,e-2)],`A vírgula anda ${e} casas para a esquerda: ${o(m,e)}. (O coeficiente deve estar entre 1 e 10.)`,'Conte quantas casas a vírgula anda até ficar depois do 1º algarismo.');},
 lv=>{const d=R(1,9),k=R(2,6);const dec='0,'+'0'.repeat(k-1)+d;return FILL('Complete o expoente:',`${dec} = ${d} × 10<sup>@@</sup>`,-k,`A vírgula anda ${k} casas para a direita, então o expoente é <b>−${k}</b>.`,'Números menores que 1 têm expoente negativo.',{keys:['−']});},
 lv=>{const mi=R(11,99),e=R(2,5);return NUM(`Quanto é <b>${fmt(mi/10)} × 10<sup>${e}</sup></b> na forma decimal comum?`,mi*10**(e-1),`Ande a vírgula ${e} casas para a direita: <b>${nf(mi*10**(e-1))}</b>.`,'Expoente positivo: vírgula para a direita.');},
 lv=>{let a=R(1,4),b=R(1,4);if(a*b>=10)b=1;const m=R(2,8),n=R(2,8);const o=(c,x)=>`${fmt(c)} × 10<sup>${x}</sup>`;return MC(`Quanto é <b>(${a} × 10<sup>${m}</sup>) · (${b} × 10<sup>${n}</sup>)</b>?`,o(a*b,m+n),[o(a*b,m*n),o(a+b,m+n),o(a*b,m+n+1),o(a*b,m+n-1),o(a+b,m*n+1)],`Multiplique os coeficientes (${a} · ${b} = ${a*b}) e some os expoentes (${m} + ${n} = ${m+n}).`,'Coeficiente × coeficiente; expoentes se somam.');},
 lv=>{const p=pick([['A distância Terra–Sol ≈ 150 000 000 km','1,5 × 10<sup>8</sup> km'],['A massa de uma bactéria ≈ 0,000000000001 g','1 × 10<sup>−12</sup> g'],['A velocidade da luz ≈ 300 000 km/s','3 × 10<sup>5</sup> km/s'],['O diâmetro de um fio de cabelo ≈ 0,00008 m','8 × 10<sup>−5</sup> m']]);const mt=p[1].match(/^(.*?) × 10<sup>(.*?)<\/sup> (.*)$/);const ex=parseInt(mt[2].replace('−','-'));const E=v=>String(v).replace('-','−');const wr=[`${mt[1]} × 10<sup>${E(ex+1)}</sup> ${mt[3]}`,`${mt[1]} × 10<sup>${E(ex-1)}</sup> ${mt[3]}`,`${mt[1]} × 10<sup>${E(-ex)}</sup> ${mt[3]}`];return MC(`${p[0]}. Em notação científica:`,p[1],wr,`Conte as casas que a vírgula percorre: ${p[1]}.`,'Conte os zeros com cuidado.');},
]},
]});

/* ------------------------ UNIDADE 4 — ENSINO MÉDIO: ÁLGEBRA E FUNÇÕES ------------------------ */
const fx=(a,b)=>`f(x) = ${lin(a,b)}`;
const LOG=(b,x)=>b===10?`log ${x}`:`log<sub>${b}</sub> ${x}`;
UNITS.push({id:'u4',title:'Ensino Médio · Álgebra e Funções',sub:'Conjuntos, funções, exponencial, log, PA, PG e finanças',color:'#ce82ff',dark:'#a568cc',skills:[
{id:'conj',name:'Conjuntos',icon:'🔵',tip:'∪ (união) junta tudo; ∩ (interseção) só os comuns; A − B: está em A e não em B. n(A∪B) = n(A) + n(B) − n(A∩B).',
theory:`<h3>Operações</h3><ul><li><b>União</b> A ∪ B: elementos de A <u>ou</u> de B.</li><li><b>Interseção</b> A ∩ B: elementos de A <u>e</u> de B.</li><li><b>Diferença</b> A − B: elementos de A que não estão em B.</li></ul>
<div class="formula">n(A ∪ B) = n(A) + n(B) − n(A ∩ B)</div>
<h3>Conjuntos numéricos</h3><ul><li>ℕ (naturais): 0, 1, 2, 3…</li><li>ℤ (inteiros): …, −2, −1, 0, 1, 2…</li><li>ℚ (racionais): podem ser escritos como fração (inclui decimais finitos e dízimas periódicas)</li><li>𝕀 (irracionais): decimais infinitos não periódicos, como √2 e π</li><li>ℝ (reais) = ℚ ∪ 𝕀</li></ul><p>ℕ ⊂ ℤ ⊂ ℚ ⊂ ℝ</p>`,
gens:[
 lv=>{const U=[1,2,3,4,5,6,7,8,9,10];const A=shuffle(U).slice(0,5).sort((a,b)=>a-b),B=shuffle(U).slice(0,5).sort((a,b)=>a-b);const I=A.filter(x=>B.includes(x));const S=s=>s.length?`{${s.join(', ')}}`:'∅';return MC(`Sendo A = ${S(A)} e B = ${S(B)}, quanto é <b>A ∩ B</b>?`,S(I),[S([...new Set([...A,...B])].sort((a,b)=>a-b)),S(A.filter(x=>!B.includes(x))),S(B.filter(x=>!A.includes(x))),S([0,...I]),S(I.slice(1)),S([...I,11])],`Interseção = elementos comuns aos dois: ${S(I)}.`,'Interseção: o que está em A E em B.');},
 lv=>{const U=[1,2,3,4,5,6,7,8,9,10,11,12];const A=shuffle(U).slice(0,R(4,6)),B=shuffle(U).slice(0,R(4,6));const un=new Set([...A,...B]).size;const S=s=>`{${[...s].sort((a,b)=>a-b).join(', ')}}`;return NUM(`Sendo A = ${S(A)} e B = ${S(B)}, quantos elementos tem <b>A ∪ B</b>?`,un,`A ∪ B = ${S(new Set([...A,...B]))}, com <b>${un}</b> elementos (os comuns contam uma vez só).`,'Junte tudo sem repetir.');},
 lv=>{const a=R(30,80),b=R(20,70),i=R(5,Math.min(a,b)-5);const t=Math.random()<.5;return t?NUM(`Numa pesquisa, <b>${a}</b> pessoas gostam de futebol, <b>${b}</b> de vôlei e <b>${i}</b> gostam dos dois. Quantas pessoas gostam de pelo menos um dos esportes?`,a+b-i,`n(F ∪ V) = ${a} + ${b} − ${i} = <b>${a+b-i}</b>.`,'Some os dois grupos e subtraia quem foi contado duas vezes.'):NUM(`Numa pesquisa, <b>${a}</b> pessoas gostam de futebol, <b>${b}</b> de vôlei e <b>${i}</b> gostam dos dois. Quantas gostam <b>só</b> de futebol?`,a-i,`Só futebol = ${a} − ${i} = <b>${a-i}</b>.`,'Retire quem gosta dos dois.');},
 lv=>{const it=pick([['−3','ℤ'],['7','ℕ'],[F(2,5),'ℚ'],['√2','𝕀'],['π','𝕀'],['0,333…','ℚ'],['−1,5','ℚ'],['√9','ℕ'],['−√16','ℤ'],['√3','𝕀'],['0,25','ℚ']]);return MC(`Qual é o <b>menor</b> conjunto numérico que contém o número <b>${it[0]}</b>?`,it[1],['ℕ','ℤ','ℚ','𝕀'],`${it[0]} ${{'ℕ':'é natural','ℤ':'é inteiro negativo (não é natural)','ℚ':'pode ser escrito como fração, mas não é inteiro','𝕀':'tem infinitas casas decimais sem período: é irracional'}[it[1]]}.`,'Lembre: ℕ ⊂ ℤ ⊂ ℚ ⊂ ℝ e 𝕀 = ℝ − ℚ.',{keep:true});},
 lv=>{const s=pick([['O conjunto vazio está contido em qualquer conjunto (∅ ⊂ A).',true],['Todo número inteiro é natural.',false],['Todo número natural é inteiro.',true],['√2 é um número racional.',false],['0,5 é um número racional.',true],['π é um número racional.',false],['A ∩ B está sempre contido em A ∪ B.',true],['−4 ∈ ℕ',false]]);return TF(s[0],s[1],s[1]?'A afirmação é verdadeira.':'A afirmação é falsa.','Revise as definições de conjuntos numéricos e operações.');},
]},
{id:'fafim',name:'Função afim',icon:'📈',tip:'f(x) = ax + b. a é a taxa de variação (inclinação); b é onde a reta corta o eixo y. Raiz: x = −b/a.',
theory:`<div class="formula">f(x) = ax + b</div><ul><li><b>a</b> (coeficiente angular): se a > 0 a função é <b>crescente</b>; se a < 0, <b>decrescente</b>.</li><li><b>b</b> (coeficiente linear): o gráfico corta o eixo y em (0, b).</li><li><b>Raiz (zero)</b>: f(x) = 0 → x = ${F('−b','a')}.</li></ul>
<h3>Taxa de variação a partir de dois pontos</h3><div class="formula">a = ${F('y₂ − y₁','x₂ − x₁')}</div>
<div class="ex">f(x) = 2x − 6: f(5) = 4 · raiz: 2x − 6 = 0 → x = 3 · crescente (a = 2 > 0)</div>`,
gens:[
 lv=>{const a=RNZ(-6,6),b=R(-10,10),k=R(-5,6);return NUM(`Dada <b>${fx(a,b)}</b>, calcule <b>f(${fmt(k)})</b>.`,a*k+b,`f(${fmt(k)}) = ${a} · ${par(k)} ${b<0?'− '+(-b):'+ '+b} = <b>${fmt(a*k+b)}</b>.`,'Substitua x pelo valor dado.',{keys:['−']});},
 lv=>{const r=R(-8,8),a=RNZ(-5,5),b=-a*r;return NUM(`Qual é a <b>raiz</b> de <b>${fx(a,b)}</b>?`,r,`${lin(a,b)} = 0 → ${a}x = ${fmt(-b)} → x = <b>${fmt(r)}</b>.`,'Iguale f(x) a zero e isole x.',{keys:['−']});},
 lv=>{const a=RNZ(-5,5),b=R(-6,6),x1=R(-4,2),x2=x1+R(1,5);return NUM(`Uma função afim passa pelos pontos <b>(${fmt(x1)}, ${fmt(a*x1+b)})</b> e <b>(${fmt(x2)}, ${fmt(a*x2+b)})</b>. Qual é o coeficiente angular <b>a</b>?`,a,`a = ${F('Δy','Δx')} = ${F(`${fmt(a*x2+b)} − ${par(a*x1+b)}`,`${fmt(x2)} − ${par(x1)}`)} = ${F(fmt(a*(x2-x1)),x2-x1)} = <b>${fmt(a)}</b>.`,'a = (y₂ − y₁)/(x₂ − x₁).',{keys:['−']});},
 lv=>{const a=RNZ(-7,7),b=R(-9,9);return MC(`A função <b>${fx(a,b)}</b> é:`,a>0?'Crescente':'Decrescente',['Crescente','Decrescente','Constante'],`O coeficiente angular é a = ${fmt(a)} ${a>0?'> 0 → crescente':'< 0 → decrescente'}.`,'Olhe o sinal do número que multiplica x.',{keep:true});},
 lv=>{const a=RNZ(-5,5),b=RNZ(-9,9);const P=(x,y)=>`(${fmt(x)}, ${fmt(y)})`;return MC(`Em que ponto o gráfico de <b>${fx(a,b)}</b> corta o <b>eixo y</b>?`,P(0,b),[P(b,0),P(0,a),P(0,-b)],`No eixo y, x = 0: f(0) = ${fmt(b)}. Ponto ${P(0,b)}.`,'Faça x = 0.');},
 lv=>{const a=pick([2,3,4,5]),b=pick([10,20,30,50]),k=R(3,20);return NUM(`Um táxi cobra <b>R$ ${b}</b> de bandeirada mais <b>R$ ${a}</b> por km. Quanto custa uma corrida de <b>${k} km</b>?`,b+a*k,`f(x) = ${a}x + ${b} → f(${k}) = ${a*k} + ${b} = <b>R$ ${b+a*k}</b>.`,'Monte f(x) = (preço por km)·x + bandeirada.');},
]},
{id:'fquad',name:'Função quadrática',icon:'🎢',tip:'f(x) = ax² + bx + c. Vértice: xv = −b/2a, yv = f(xv) (ou −Δ/4a). a > 0: parábola para cima (mínimo); a < 0: para baixo (máximo).',
theory:`<div class="formula">f(x) = ax² + bx + c (a ≠ 0)</div><p>O gráfico é uma <b>parábola</b>.</p><ul><li>a > 0: concavidade para <b>cima</b> → tem valor <b>mínimo</b></li><li>a < 0: concavidade para <b>baixo</b> → tem valor <b>máximo</b></li><li>c: ponto onde corta o eixo y, (0, c)</li></ul>
<h3>Vértice</h3><div class="formula">x<sub>v</sub> = ${F('−b','2a')} · y<sub>v</sub> = ${F('−Δ','4a')} = f(x<sub>v</sub>)</div>
<div class="ex">f(x) = x² − 6x + 5: x<sub>v</sub> = 6/2 = 3 · y<sub>v</sub> = 9 − 18 + 5 = −4 → mínimo −4. Raízes: 1 e 5.</div>`,
gens:[
 lv=>{const a=pick([1,-1,2,-2]),xv=R(-5,5),b=-2*a*xv,c=R(-9,9);return NUM(`Qual é o <b>x do vértice</b> de <b>f(x) = ${quad(a,b,c)}</b>?`,xv,`x<sub>v</sub> = ${F('−b','2a')} = ${F(fmt(-b),fmt(2*a))} = <b>${fmt(xv)}</b>.`,'Use xv = −b/(2a).',{keys:['−']});},
 lv=>{const a=pick([1,-1,2,-2]),xv=R(-4,4),b=-2*a*xv,c=R(-9,9),yv=a*xv*xv+b*xv+c;return NUM(`Qual é o <b>y do vértice</b> de <b>f(x) = ${quad(a,b,c)}</b>?`,yv,`x<sub>v</sub> = ${fmt(xv)}; y<sub>v</sub> = f(${fmt(xv)}) = <b>${fmt(yv)}</b>.`,'Ache xv = −b/2a e calcule f(xv).',{keys:['−']});},
 lv=>{const a=RNZ(-5,5),b=R(-6,6),c=R(-6,6);return MC(`A parábola de <b>f(x) = ${quad(a,b,c)}</b> tem concavidade voltada para:`,a>0?'Cima':'Baixo',['Cima','Baixo'],`a = ${fmt(a)} ${a>0?'> 0 → para cima':'< 0 → para baixo'}.`,'Olhe o sinal do coeficiente de x².',{keep:true});},
 lv=>{let r1=R(-6,6),r2=R(-6,6);if(r1===r2)r2+=2;const S=(x,y)=>`${fmt(Math.min(x,y))} e ${fmt(Math.max(x,y))}`;return MC(`Quais são as raízes (zeros) de <b>f(x) = ${quad(1,-(r1+r2),r1*r2)}</b>?`,S(r1,r2),[S(-r1,-r2),S(r1,-r2),S(r1+1,r2+1),S(r1-1,r2+2),S(r1+r2,r1*r2+1)],`Procure dois números com soma ${fmt(r1+r2)} e produto ${fmt(r1*r2)}: ${S(r1,r2)}.`,'Use soma e produto ou Bhaskara.');},
 lv=>{const a=pick([1,-1,2,-2]),xv=R(-4,4),b=-2*a*xv,c=R(-5,5),yv=a*xv*xv+b*xv+c;const w=a>0?'mínimo':'máximo',o=a>0?'máximo':'mínimo';return MC(`Sobre <b>f(x) = ${quad(a,b,c)}</b>, é correto afirmar que tem valor:`,`${w} igual a ${fmt(yv)}`,[`${o} igual a ${fmt(yv)}`,`${w} igual a ${fmt(xv)}`,`${w} igual a ${fmt(c)}`,`${w} igual a ${fmt(yv+1)}`,`${o} igual a ${fmt(yv-1)}`,`${w} igual a ${fmt(-yv-2)}`],`a ${a>0?'> 0: tem mínimo':'< 0: tem máximo'}; y<sub>v</sub> = f(${fmt(xv)}) = ${fmt(yv)}.`,'O sinal de a indica máximo ou mínimo; o valor é o y do vértice.');},
 lv=>{const a=RNZ(-3,3),b=R(-6,6),c=R(-9,9),k=R(-3,3);return NUM(`Dada <b>f(x) = ${quad(a,b,c)}</b>, calcule <b>f(${fmt(k)})</b>.`,a*k*k+b*k+c,`f(${fmt(k)}) = ${a}·${par(k)}² ${b<0?'− '+(-b):'+ '+b}·${par(k)} ${c<0?'− '+(-c):'+ '+c} = <b>${fmt(a*k*k+b*k+c)}</b>.`,'Substitua x e respeite a ordem das operações.',{keys:['−']});},
]},
{id:'fexp',name:'Função exponencial',icon:'🚀',tip:'Iguale as bases: se aˣ = aᵏ, então x = k. Se 0 < a < 1, a função é decrescente; se a > 1, crescente.',
theory:`<div class="formula">f(x) = a<sup>x</sup>, com a > 0 e a ≠ 1</div><ul><li>a > 1: <b>crescente</b></li><li>0 < a < 1: <b>decrescente</b></li><li>Passa sempre por (0, 1)</li></ul>
<h3>Equações exponenciais</h3><p>Escreva os dois lados na <b>mesma base</b> e iguale os expoentes.</p><div class="ex">2<sup>x</sup> = 32 → 2<sup>x</sup> = 2<sup>5</sup> → x = 5</div><div class="ex">4<sup>x</sup> = 8 → 2<sup>2x</sup> = 2<sup>3</sup> → 2x = 3 → x = 1,5</div>
<h3>Crescimento</h3><p>Uma população que dobra a cada período: P(t) = P₀ · 2<sup>t</sup>.</p>`,
gens:[
 lv=>{const b=pick([2,3,5]),k=R(1,b===2?8:b===3?5:4);return NUM(`Resolva: <b>${b}<sup>x</sup> = ${nf(b**k)}</b>`,k,`${nf(b**k)} = ${b}<sup>${k}</sup>, então x = <b>${k}</b>.`,`Escreva ${nf(b**k)} como potência de ${b}.`);},
 lv=>{const b=pick([2,3]),k=R(2,b===2?7:4),c=RNZ(-3,3);return NUM(`Resolva: <b>${b}<sup>x ${c>0?'+':'−'} ${Math.abs(c)}</sup> = ${b**k}</b>`,k-c,`${b**k} = ${b}<sup>${k}</sup> → x ${c>0?'+':'−'} ${Math.abs(c)} = ${k} → x = <b>${fmt(k-c)}</b>.`,'Iguale as bases e depois os expoentes.',{keys:['−']});},
 lv=>{const p=pick([[4,8,3,2],[8,4,2,3],[9,27,3,2],[27,9,2,3],[4,32,5,2],[25,125,3,2],[16,8,3,4],[8,16,4,3]]);return FRAC(`Resolva: <b>${p[0]}<sup>x</sup> = ${p[1]}</b> (pode responder em fração ou decimal)`,p[2],p[3],`Escreva na base comum: ${p[0]} e ${p[1]} são potências de ${p[0]%3===0?3:p[0]%5===0?5:2}. Igualando expoentes: ${p[3]}x = ${p[2]} → x = <b>${Fs(p[2],p[3])}</b>.`,'Transforme as duas bases numa base comum (2, 3 ou 5).',{keys:['/',',']});},
 lv=>{const n0=pick([100,200,500,1000]),T=pick([1,2,3]),t=T*R(2,5);return NUM(`Uma cultura começa com <b>${n0}</b> bactérias e a população <b>dobra a cada ${T} hora(s)</b>. Quantas bactérias haverá após <b>${t} horas</b>?`,n0*2**(t/T),`Número de duplicações = ${t} ÷ ${T} = ${t/T}. P = ${n0} · 2<sup>${t/T}</sup> = <b>${nf(n0*2**(t/T))}</b>.`,'P = P₀ · 2^(t/T).');},
 lv=>{const it=pick([['2','Crescente'],['3','Crescente'],[F(1,2),'Decrescente'],['0,3','Decrescente'],['10','Crescente'],[F(2,3),'Decrescente'],['1,5','Crescente']]);return MC(`A função <b>f(x) = (${it[0]})<sup>x</sup></b> é:`,it[1],['Crescente','Decrescente'],`A base ${it[1]==='Crescente'?'é maior que 1 → crescente':'está entre 0 e 1 → decrescente'}.`,'Compare a base com 1.',{keep:true});},
 lv=>{const k=R(1,6);return NUM(`Resolva: <b>(${F(1,2)})<sup>x</sup> = ${2**k}</b>`,-k,`(${F(1,2)})<sup>x</sup> = 2<sup>−x</sup> = 2<sup>${k}</sup> → −x = ${k} → x = <b>−${k}</b>.`,'1/2 = 2⁻¹.',{keys:['−']});},
]},
{id:'log',name:'Logaritmos',icon:'🪵',tip:'logₐ b = x ⟺ aˣ = b. log(M·N) = log M + log N; log(M/N) = log M − log N; log Mⁿ = n·log M.',
theory:`<div class="formula">log<sub>a</sub> b = x ⟺ a<sup>x</sup> = b (a > 0, a ≠ 1, b > 0)</div><p>O logaritmo é o <b>expoente</b>. Quando a base não aparece, ela é 10.</p>
<div class="ex">log<sub>2</sub> 8 = 3, pois 2<sup>3</sup> = 8 · log 1000 = 3 · log<sub>3</sub> ${F(1,9)} = −2</div>
<h3>Consequências</h3><ul><li>log<sub>a</sub> 1 = 0</li><li>log<sub>a</sub> a = 1</li><li>log<sub>a</sub> a<sup>n</sup> = n</li></ul>
<h3>Propriedades</h3><ul><li>log(M · N) = log M + log N</li><li>log(M ÷ N) = log M − log N</li><li>log M<sup>n</sup> = n · log M</li><li>Mudança de base: log<sub>a</sub> b = ${F('log b','log a')}</li></ul>`,
gens:[
 lv=>{const b=pick([2,3,5,10]),n=R(0,b===2?8:b===10?5:4);return NUM(`Calcule <b>${LOG(b,nf(b**n))}</b>`,n,`${b}<sup>${n}</sup> = ${nf(b**n)}, então ${LOG(b,nf(b**n))} = <b>${n}</b>.`,`A que expoente devo elevar ${b} para obter ${nf(b**n)}?`);},
 lv=>{const b=pick([2,3,5]),n=R(1,3);return NUM(`Calcule <b>${LOG(b,F(1,b**n))}</b>`,-n,`${b}<sup>−${n}</sup> = ${F(1,b**n)}, então o log vale <b>−${n}</b>.`,'Frações do tipo 1/bⁿ correspondem a expoentes negativos.',{keys:['−']});},
 lv=>{const b=pick([2,3,10]),n=R(1,b===2?6:3);return NUM(`Se <b>${LOG(b,'x')} = ${n}</b>, quanto vale x?`,b**n,`Pela definição: x = ${b}<sup>${n}</sup> = <b>${nf(b**n)}</b>.`,'Transforme o log em potência.');},
 lv=>{const b=2,m=R(1,5),n=R(1,5),t=Math.random()<.5;return NUM(`Calcule <b>${LOG(b,2**m)} ${t?'+':'−'} ${LOG(b,2**n)}</b>`,t?m+n:m-n,`${LOG(b,2**m)} = ${m} e ${LOG(b,2**n)} = ${n}; ${m} ${t?'+':'−'} ${n} = <b>${fmt(t?m+n:m-n)}</b>. (Também: ${LOG(b,t?'('+2**m+' · '+2**n+')':'('+2**m+' ÷ '+2**n+')')}.)`,'Calcule cada log separadamente.',{keys:['−']});},
 lv=>{const q=pick([['log(M · N) =','log M + log N',['log M · log N','log M − log N','M · log N']],['log(M ÷ N) =','log M − log N',['log M ÷ log N','log M + log N','log(M − N)']],['log M<sup>n</sup> =','n · log M',['(log M)<sup>n</sup>','log M + n','M · log n']],['log<sub>a</sub> 1 =','0',['1','a','Não existe']],['log<sub>a</sub> a =','1',['0','a','a²']]]);return MC(`Complete a propriedade: <b>${q[0]}</b>`,q[1],q[2],`Propriedade: ${q[0]} ${q[1]}.`,'Revise as propriedades na aula.');},
 lv=>{const n=R(2,4),b=pick([2,3]),k=R(1,3);return NUM(`Sabendo que ${LOG(b,b**k)} = ${k}, calcule <b>${LOG(b,`${b**k}<sup>${n}</sup>`)}</b>`,n*k,`log M<sup>n</sup> = n · log M = ${n} · ${k} = <b>${n*k}</b>.`,'O expoente "desce" multiplicando.');},
]},
{id:'pa',name:'Progressão aritmética',icon:'➡️',tip:'PA: soma-se sempre a mesma razão r. aₙ = a₁ + (n − 1)·r. Sₙ = (a₁ + aₙ)·n/2.',
theory:`<p>Uma <b>PA</b> é uma sequência em que cada termo é o anterior <b>somado</b> a uma constante <b>r</b> (razão).</p><div class="ex">(2, 5, 8, 11, …) → r = 3</div>
<div class="formula">a<sub>n</sub> = a<sub>1</sub> + (n − 1) · r</div><div class="formula">S<sub>n</sub> = ${F('(a<sub>1</sub> + a<sub>n</sub>) · n',2)}</div>
<div class="ex">a<sub>1</sub> = 2, r = 3: a<sub>10</sub> = 2 + 9 · 3 = 29 · S<sub>10</sub> = (2 + 29) · 10 / 2 = 155</div>
<p>Soma de Gauss: 1 + 2 + … + 100 = (1 + 100) · 100 / 2 = 5050.</p>`,
gens:[
 lv=>{const a1=R(-10,20),r=RNZ(-6,9),n=R(8,40);return NUM(`Numa PA, a<sub>1</sub> = <b>${fmt(a1)}</b> e a razão é <b>${fmt(r)}</b>. Qual é o <b>${n}º termo</b>?`,a1+(n-1)*r,`a<sub>${n}</sub> = ${fmt(a1)} + (${n} − 1) · ${par(r)} = ${fmt(a1)} + ${fmt((n-1)*r)} = <b>${fmt(a1+(n-1)*r)}</b>.`,'aₙ = a₁ + (n − 1)·r.',{keys:['−']});},
 lv=>{const a1=R(-10,20),r=RNZ(-8,9);const t=[0,1,2,3].map(i=>fmt(a1+i*r));return FILL('Qual é a razão da PA?',`(${t.join(', ')}, …) → r = @@`,r,`r = a<sub>2</sub> − a<sub>1</sub> = ${t[1]} − ${par(a1)} = <b>${fmt(r)}</b>.`,'Subtraia um termo do anterior.',{keys:['−']});},
 lv=>{const a1=R(1,15),r=R(1,8),n=R(5,20),an=a1+(n-1)*r;return NUM(`Calcule a soma dos <b>${n}</b> primeiros termos da PA (${a1}, ${a1+r}, ${a1+2*r}, …).`,(a1+an)*n/2,`a<sub>${n}</sub> = ${a1} + ${n-1}·${r} = ${an}. S = (${a1} + ${an}) · ${n} / 2 = <b>${nf((a1+an)*n/2)}</b>.`,'Ache o último termo e use Sₙ = (a₁ + aₙ)·n/2.');},
 lv=>{const a1=R(1,10),r=R(2,6),n=R(6,25);return NUM(`Quantos termos tem a PA <b>(${a1}, ${a1+r}, ${a1+2*r}, …, ${a1+(n-1)*r})</b>?`,n,`${a1+(n-1)*r} = ${a1} + (n − 1) · ${r} → n − 1 = ${n-1} → n = <b>${n}</b>.`,'Use aₙ = a₁ + (n − 1)·r e isole n.');},
 lv=>{const a=R(1,9),r=R(2,5),q=pick([2,3]);const pa=`(${[0,1,2,3].map(i=>a+i*r).join(', ')})`;return MC('Qual destas sequências é uma <b>PA</b>?',pa,[`(${[0,1,2,3].map(i=>a*q**i).join(', ')})`,`(${[1,4,9,16].map(x=>x+a-1).join(', ')})`,`(${[a,a+r,a+2*r+1,a+3*r+3].join(', ')})`],`Em ${pa} a diferença entre termos consecutivos é sempre ${r}.`,'Verifique se a diferença entre termos vizinhos é constante.');},
 lv=>{const n=pick([10,20,50,100]);return NUM(`Qual é a soma <b>1 + 2 + 3 + … + ${n}</b>?`,n*(n+1)/2,`S = (1 + ${n}) · ${n} / 2 = <b>${nf(n*(n+1)/2)}</b> (soma de Gauss).`,'Use a fórmula da soma da PA.');},
]},
{id:'pg',name:'Progressão geométrica',icon:'🔁',tip:'PG: multiplica-se sempre pela mesma razão q. aₙ = a₁·qⁿ⁻¹. Soma infinita (|q| < 1): S = a₁/(1 − q).',
theory:`<p>Uma <b>PG</b> é uma sequência em que cada termo é o anterior <b>multiplicado</b> por uma constante <b>q</b>.</p><div class="ex">(3, 6, 12, 24, …) → q = 2</div>
<div class="formula">a<sub>n</sub> = a<sub>1</sub> · q<sup>n−1</sup></div><div class="formula">S<sub>n</sub> = ${F('a<sub>1</sub> · (q<sup>n</sup> − 1)','q − 1')}</div><div class="formula">Soma infinita (−1 < q < 1): S = ${F('a<sub>1</sub>','1 − q')}</div>
<div class="ex">8 + 4 + 2 + 1 + … = 8 / (1 − ½) = 16</div>`,
gens:[
 lv=>{const a1=R(1,5),q=pick([2,3,-2]),n=R(3,q===3?6:8);return NUM(`Numa PG, a<sub>1</sub> = <b>${a1}</b> e q = <b>${fmt(q)}</b>. Qual é o <b>${n}º termo</b>?`,a1*q**(n-1),`a<sub>${n}</sub> = ${a1} · ${par(q)}<sup>${n-1}</sup> = ${a1} · ${fmt(q**(n-1))} = <b>${nf(a1*q**(n-1))}</b>.`,'aₙ = a₁ · qⁿ⁻¹.',{keys:['−']});},
 lv=>{const t=pick(['int','half','neg']);const a1=t==='half'?pick([64,128,96,48]):R(1,6);const q=t==='int'?pick([2,3,4]):t==='half'?0.5:-pick([2,3]);const s=[0,1,2,3].map(i=>fmt(a1*q**i));return NUM(`Qual é a razão <b>q</b> da PG (${s.join(', ')}, …)?`,q,`q = a<sub>2</sub> ÷ a<sub>1</sub> = ${s[1]} ÷ ${s[0]} = <b>${t==='half'?F(1,2):fmt(q)}</b>.`,'Divida um termo pelo anterior.',{keys:['/','−',','],answer:t==='half'?F(1,2):fmt(q)});},
 lv=>{const a1=R(1,5),q=pick([2,3]),n=R(3,6);return NUM(`Calcule a soma dos <b>${n}</b> primeiros termos da PG (${a1}, ${a1*q}, ${a1*q*q}, …).`,a1*(q**n-1)/(q-1),`S<sub>${n}</sub> = ${a1} · (${q}<sup>${n}</sup> − 1) / (${q} − 1) = <b>${nf(a1*(q**n-1)/(q-1))}</b>.`,'Use Sₙ = a₁(qⁿ − 1)/(q − 1), ou some termo a termo.');},
 lv=>{const d=pick([2,3,4]),a1=(d-1)*R(1,10)*d;return NUM(`Calcule a soma infinita: <b>${a1} + ${fmt(a1/d)} + ${fmt(a1/d/d)} + …</b>`,a1/(1-1/d),`q = ${F(1,d)}. S = ${F(a1,'1 − '+F(1,d))} = ${a1} ÷ ${F(d-1,d)} = <b>${fmt(a1/(1-1/d))}</b>.`,'S = a₁ / (1 − q).');},
 lv=>{const a=R(1,5),q=pick([2,3]),r=R(2,5);const pg=`(${[0,1,2,3].map(i=>a*q**i).join(', ')})`;return MC('Qual destas sequências é uma <b>PG</b>?',pg,[`(${[0,1,2,3].map(i=>a+i*r).join(', ')})`,`(${[a,a*q,a*q+q,a*q*q+1].join(', ')})`,`(${[1,4,9,16].map(x=>x*a).join(', ')})`],`Em ${pg} cada termo é o anterior × ${q}.`,'Verifique se a divisão entre termos vizinhos é constante.');},
]},
{id:'juros',name:'Matemática financeira',icon:'💸',tip:'Juros simples: J = C·i·t. Juros compostos: M = C·(1 + i)ᵗ. Descontos sucessivos se multiplicam, não se somam.',
theory:`<h3>Juros simples</h3><div class="formula">J = C · i · t · M = C + J</div><div class="ex">C = R$ 1000, i = 2% a.m., t = 5 meses → J = 1000 · 0,02 · 5 = R$ 100</div>
<h3>Juros compostos</h3><div class="formula">M = C · (1 + i)<sup>t</sup></div><div class="ex">R$ 1000 a 10% a.a. por 2 anos → 1000 · 1,1² = R$ 1210</div>
<h3>Aumentos e descontos sucessivos</h3><p>Desconto de 10% e depois 20%: 0,9 · 0,8 = 0,72 → desconto total de <b>28%</b> (não 30%!).</p>
<p>Atenção: i e t devem estar na <b>mesma unidade de tempo</b>.</p>`,
gens:[
 lv=>{const C=R(1,50)*100,i=pick([1,2,3,5,10]),t=R(2,12);return NUM(`Qual o juro <b>simples</b> de um capital de <b>R$ ${nf(C)}</b> a <b>${i}% ao mês</b> durante <b>${t} meses</b>?`,C*i*t/100,`J = C · i · t = ${nf(C)} · ${fmt(i/100)} · ${t} = <b>R$ ${nf(C*i*t/100)}</b>.`,'J = C·i·t, com i na forma decimal.');},
 lv=>{const C=R(1,50)*100,i=pick([2,4,5,10]),t=R(2,10);return NUM(`Um capital de <b>R$ ${nf(C)}</b> é aplicado a juros simples de <b>${i}% ao mês</b> por <b>${t} meses</b>. Qual é o <b>montante</b>?`,C*(1+i*t/100),`J = ${nf(C)} · ${fmt(i/100)} · ${t} = ${nf(C*i*t/100)}. M = C + J = <b>R$ ${nf(C*(1+i*t/100))}</b>.`,'Montante = capital + juros.');},
 lv=>{const C=pick([1000,2000,5000,10000]),i=pick([10,20]),t=pick([2,3]);return NUM(`Aplicando <b>R$ ${nf(C)}</b> a juros <b>compostos</b> de <b>${i}% ao ano</b>, qual será o montante após <b>${t} anos</b>?`,Math.round(C*(1+i/100)**t),`M = ${nf(C)} · (${fmt(1+i/100)})<sup>${t}</sup> = ${nf(C)} · ${fmt((1+i/100)**t)} = <b>R$ ${nf(Math.round(C*(1+i/100)**t))}</b>.`,'M = C·(1 + i)ᵗ.');},
 lv=>{const d1=pick([10,20,30,50]),d2=pick([10,20,25,50]);const tot=round(100-(100-d1)*(100-d2)/100,2);return MC(`Um produto teve desconto de <b>${d1}%</b> e depois outro de <b>${d2}%</b>. Qual o desconto total?`,fmt(tot)+'%',[(d1+d2)+'%',fmt(tot+2)+'%',Math.abs(d1-d2)+'%'],`Fatores: ${fmt(1-d1/100)} · ${fmt(1-d2/100)} = ${fmt((1-d1/100)*(1-d2/100))} → desconto de <b>${fmt(tot)}%</b>.`,'Multiplique os fatores (1 − d).');},
 lv=>{const i=pick([2,4,5,10,20,25]);return NUM(`A juros <b>simples</b> de <b>${i}% ao mês</b>, em quantos meses um capital <b>dobra</b>?`,100/i,`Dobrar → J = C: C · ${fmt(i/100)} · t = C → t = ${F(1,fmt(i/100))} = <b>${100/i} meses</b>.`,'Dobrar significa que os juros são iguais ao capital.',{unit:'meses'});},
]},
]});

/* ------------------------ UNIDADE 5 — ENSINO MÉDIO: GEOMETRIA, TRIGONOMETRIA, PROBABILIDADE ------------------------ */
const RAD=[[30,1,6],[45,1,4],[60,1,3],[90,1,2],[120,2,3],[135,3,4],[150,5,6],[180,1,1],[210,7,6],[225,5,4],[240,4,3],[270,3,2],[300,5,3],[315,7,4],[330,11,6],[360,2,1]];
const radH=(n,d)=>d===1?(n===1?'π':n+'π'):F((n===1?'':n)+'π',d);
const R3=h=>`<span class="fr"><span>${h}</span><span>2</span></span>`;
const TVAL={'1/2':F(1,2),'√2/2':R3('√2'),'√3/2':R3('√3'),'√3':'√3','√3/3':F('√3',3),'1':'1','0':'0'};
const cx=(a,b)=>{ if(b===0)return fmt(a); const bi=(Math.abs(b)===1?'':fmt(Math.abs(b)))+'i'; if(a===0)return (b<0?'−':'')+bi; return `${fmt(a)} ${b<0?'−':'+'} ${bi}`; };
UNITS.push({id:'u5',title:'Ensino Médio · Geometria e Probabilidade',sub:'Trigonometria, matrizes, combinatória, probabilidade, espacial, analítica e complexos',color:'#ff4b4b',dark:'#ea2b2b',skills:[
{id:'trig',name:'Trigonometria no triângulo',icon:'📐',tip:'SOH-CAH-TOA: sen = oposto/hipotenusa; cos = adjacente/hipotenusa; tg = oposto/adjacente.',
theory:`<p>No triângulo retângulo, para um ângulo agudo θ:</p><div class="formula">sen θ = ${F('cateto oposto','hipotenusa')} · cos θ = ${F('cateto adjacente','hipotenusa')} · tg θ = ${F('cateto oposto','cateto adjacente')}</div>
<h3>Ângulos notáveis</h3><table><tr><th></th><th>30°</th><th>45°</th><th>60°</th></tr><tr><th>sen</th><td>${F(1,2)}</td><td>${R3('√2')}</td><td>${R3('√3')}</td></tr><tr><th>cos</th><td>${R3('√3')}</td><td>${R3('√2')}</td><td>${F(1,2)}</td></tr><tr><th>tg</th><td>${F('√3',3)}</td><td>1</td><td>√3</td></tr></table>
<div class="ex">Rampa de 10 m com 30° de inclinação: altura = 10 · sen 30° = 5 m</div>`,
gens:[
 lv=>{const [a,b,c]=pick(TRIPLES.slice(0,6));const f=pick(['sen','cos','tg']);const v={sen:[a,c],cos:[b,c],tg:[a,b]}[f];return MC(`No triângulo, qual é o valor de <b>${f} θ</b>?`,Fs(v[0],v[1]),[Fs(a,c),Fs(b,c),Fs(a,b),Fs(b,a),Fs(c,a)].filter(x=>x!==Fs(v[0],v[1])),`Para θ: oposto = ${a}, adjacente = ${b}, hipotenusa = ${c}. ${f} θ = ${F(v[0],v[1])} = ${Fs(v[0],v[1])}.`,'SOH-CAH-TOA: identifique o cateto oposto e o adjacente a θ.',{visual:rtSVG(a,b,c,'θ')});},
 lv=>{const ang=pick([30,45,60]),f=pick(['sen','cos','tg']);const k={sen:{30:'1/2',45:'√2/2',60:'√3/2'},cos:{30:'√3/2',45:'√2/2',60:'1/2'},tg:{30:'√3/3',45:'1',60:'√3'}}[f][ang];return MC(`Qual é o valor de <b>${f} ${ang}°</b>?`,TVAL[k],Object.keys(TVAL).filter(x=>x!==k&&x!=='0').map(x=>TVAL[x]),`Pela tabela de ângulos notáveis, ${f} ${ang}° = ${TVAL[k]}.`,'Memorize: 1, 2, 3 → √1/2, √2/2, √3/2 para seno de 30°, 45°, 60°.');},
 lv=>{const t=pick(['rampa','sombra','cos']);if(t==='rampa'){const h=R(2,15)*2;return NUM(`Uma rampa de <b>${h} m</b> de comprimento forma um ângulo de <b>30°</b> com o solo. Qual é a altura atingida?`,h/2,`altura = ${h} · sen 30° = ${h} · ${F(1,2)} = <b>${h/2} m</b>.`,'A rampa é a hipotenusa; a altura é o cateto oposto: use seno.',{unit:'m'});}if(t==='sombra'){const s=R(3,30);return NUM(`Um prédio projeta uma sombra de <b>${s} m</b> quando os raios solares fazem <b>45°</b> com o chão. Qual a altura do prédio?`,s,`tg 45° = ${F('h',s)} = 1 → h = <b>${s} m</b>.`,'Use tangente: oposto/adjacente.',{unit:'m'});}const h=R(2,15)*2;return NUM(`Uma escada de <b>${h} m</b> forma <b>60°</b> com o chão. A que distância da parede está o pé da escada?`,h/2,`distância = ${h} · cos 60° = ${h} · ${F(1,2)} = <b>${h/2} m</b>.`,'A distância é o cateto adjacente ao ângulo: use cosseno.',{unit:'m'});},
 lv=>{const p=pick([['cos 60°',0.5],['sen 30°',0.5],['tg 45°',1],['sen 90°',1],['cos 0°',1],['sen 0°',0]]);return FILL('Complete:',`${p[0]} = @@`,p[1],`${p[0]} = <b>${fmt(p[1])}</b>.`,'Consulte a tabela de ângulos notáveis.',{keys:['/',',']});},
 lv=>{const [a,b,c]=pick(TRIPLES.slice(0,6));return TF(`Num triângulo retângulo de catetos ${a} e ${b} e hipotenusa ${c}, vale sen²θ + cos²θ = 1.`,true,`(${a}/${c})² + (${b}/${c})² = ${F(a*a+b*b,c*c)} = 1. É a relação fundamental.`,'Teste com os valores.');},
]},
{id:'ciclo',name:'Ciclo trigonométrico',icon:'⭕',tip:'180° = π rad. Quadrantes: 1º (0°–90°) todos +; 2º só seno +; 3º só tangente +; 4º só cosseno +.',
theory:`<div class="formula">180° = π rad → para converter graus em radianos, multiplique por ${F('π',180)}</div>
<div class="ex">60° = 60 · π/180 = ${F('π',3)} · ${F('3π',4)} = 3 · 180/4 = 135°</div>
<h3>Quadrantes e sinais</h3><table><tr><th>Quadrante</th><th>Ângulos</th><th>sen</th><th>cos</th><th>tg</th></tr><tr><td>1º</td><td>0°–90°</td><td>+</td><td>+</td><td>+</td></tr><tr><td>2º</td><td>90°–180°</td><td>+</td><td>−</td><td>−</td></tr><tr><td>3º</td><td>180°–270°</td><td>−</td><td>−</td><td>+</td></tr><tr><td>4º</td><td>270°–360°</td><td>−</td><td>+</td><td>−</td></tr></table>
<h3>Arcos côngruos</h3><p>Para ângulos maiores que 360°, subtraia voltas completas: 810° − 2 · 360° = 90°.</p>
<div class="formula">sen²x + cos²x = 1</div>`,
gens:[
 lv=>{const r=pick(RAD);return MC(`Quanto é <b>${r[0]}°</b> em radianos?`,radH(r[1],r[2]),shuffle(RAD.filter(x=>x!==r)).slice(0,5).map(x=>radH(x[1],x[2])),`${r[0]}° · ${F('π',180)} = ${radH(r[1],r[2])} rad.`,'Multiplique por π/180 e simplifique.');},
 lv=>{const r=pick(RAD.slice(0,8));return BANK('Toque no valor em radianos:',`${r[0]}° = @@`,radH(r[1],r[2]),RAD.slice(0,8).map(x=>radH(x[1],x[2])),`${r[0]}° · ${F('π',180)} = ${radH(r[1],r[2])}.`,'180° = π rad.');},
 lv=>{const r=pick(RAD);return NUM(`Quanto é <b>${radH(r[1],r[2])} rad</b> em graus?`,r[0],`Troque π por 180°: ${r[1]} · 180° ÷ ${r[2]} = <b>${r[0]}°</b>.`,'Substitua π por 180°.',{unit:'°'});},
 lv=>{let a;do{a=R(1,359);}while(a%90===0);const q=Math.floor(a/90)+1;return MC(`Em qual quadrante está o ângulo de <b>${a}°</b>?`,q+'º quadrante',['1º quadrante','2º quadrante','3º quadrante','4º quadrante'],`${a}° está entre ${(q-1)*90}° e ${q*90}°: ${q}º quadrante.`,'Cada quadrante tem 90°.',{keep:true});},
 lv=>{const q=pick([[1,'positivo','positivo'],[2,'positivo','negativo'],[3,'negativo','negativo'],[4,'negativo','positivo']]);return MC(`Em qual quadrante o seno é <b>${q[1]}</b> e o cosseno é <b>${q[2]}</b>?`,q[0]+'º quadrante',['1º quadrante','2º quadrante','3º quadrante','4º quadrante'],`O seno é o eixo vertical (y) e o cosseno o horizontal (x): ${q[0]}º quadrante.`,'sen ↔ y, cos ↔ x.',{keep:true});},
 lv=>{const r=R(0,359),k=R(1,3);return NUM(`Qual é a <b>1ª determinação positiva</b> (entre 0° e 360°) do ângulo de <b>${nf(r+360*k)}°</b>?`,r,`${nf(r+360*k)}° − ${k} · 360° = <b>${r}°</b>.`,'Subtraia voltas completas de 360°.',{unit:'°'});},
 lv=>{const s=pick([['sen 90° = 1',true],['cos 180° = −1',true],['sen 180° = 1',false],['cos 90° = 1',false],['sen²x + cos²x = 1 para todo x real',true],['sen 270° = 1',false],['cos 0° = 0',false],['tg 45° = 1',true]]);return TF(s[0],s[1],s[1]?'Correto!':'Falso. No ciclo: sen 90° = 1, sen 270° = −1, cos 0° = 1, cos 90° = 0, cos 180° = −1.','Visualize o ponto no ciclo: cos = x, sen = y.');},
]},
{id:'mat',name:'Matrizes e determinantes',icon:'🔲',tip:'det 2×2 = ad − bc. Produto A(m×n)·B(n×p) só existe se colunas de A = linhas de B; resultado m×p.',
theory:`<p>Uma <b>matriz</b> m×n tem m linhas e n colunas. O elemento a<sub>ij</sub> está na linha i e coluna j.</p>
<h3>Determinante 2×2</h3><div class="formula">det ${MX([['a','b'],['c','d']])} = ad − bc</div><div class="ex">det ${MX([[3,2],[1,4]])} = 3·4 − 2·1 = 10</div>
<h3>Determinante 3×3 (Sarrus)</h3><p>Repita as duas primeiras colunas, some os produtos das diagonais principais e subtraia os das secundárias.</p>
<h3>Produto de matrizes</h3><p>A<sub>m×n</sub> · B<sub>n×p</sub> = C<sub>m×p</sub>. O elemento c<sub>ij</sub> = (linha i de A) · (coluna j de B).</p>
<h3>Transposta</h3><p>Troca linhas por colunas: (A<sup>t</sup>)<sub>ij</sub> = a<sub>ji</sub>.</p>`,
gens:[
 lv=>{const M=[[R(-5,9),R(-5,9)],[R(-5,9),R(-5,9)]];const d=M[0][0]*M[1][1]-M[0][1]*M[1][0];return NUM(`Calcule o determinante: ${MX(M)}`,d,`det = ${par(M[0][0])}·${par(M[1][1])} − ${par(M[0][1])}·${par(M[1][0])} = ${fmt(M[0][0]*M[1][1])} − ${par(M[0][1]*M[1][0])} = <b>${fmt(d)}</b>.`,'Diagonal principal menos diagonal secundária.',{keys:['−']});},
 lv=>{const M=[...Array(3)].map(()=>[...Array(3)].map(()=>R(-2,3)));const [a,b,c]=M[0],[d,e,f]=M[1],[g,h,i]=M[2];const det=a*e*i+b*f*g+c*d*h-c*e*g-a*f*h-b*d*i;return NUM(`Calcule o determinante (regra de Sarrus): ${MX(M)}`,det,`Principais: ${a*e*i} + ${b*f*g} + ${c*d*h} = ${a*e*i+b*f*g+c*d*h}. Secundárias: ${c*e*g} + ${a*f*h} + ${b*d*i} = ${c*e*g+a*f*h+b*d*i}. det = <b>${fmt(det)}</b>.`,'Repita as duas primeiras colunas à direita e aplique Sarrus.',{keys:['−']});},
 lv=>{const A=[[R(-3,5),R(-3,5)],[R(-3,5),R(-3,5)]],B=[[R(-3,5),R(-3,5)],[R(-3,5),R(-3,5)]];const i=R(0,1),j=R(0,1);const v=A[i][0]*B[0][j]+A[i][1]*B[1][j];return NUM(`Sendo A = ${MX(A)} e B = ${MX(B)}, qual é o elemento <b>c<sub>${i+1}${j+1}</sub></b> de C = A · B?`,v,`c<sub>${i+1}${j+1}</sub> = (linha ${i+1} de A)·(coluna ${j+1} de B) = ${par(A[i][0])}·${par(B[0][j])} + ${par(A[i][1])}·${par(B[1][j])} = <b>${fmt(v)}</b>.`,'Multiplique a linha de A pela coluna de B, termo a termo, e some.',{keys:['−']});},
 lv=>{const [m,n,p]=shuffle([1,2,3,4,5]);return MC(`Se A é ${m}×${n} e B é ${n}×${p}, qual é a ordem de <b>A · B</b>?`,`${m}×${p}`,[`${n}×${n}`,`${p}×${m}`,`${m}×${n}`,`${n}×${p}`],`Linhas de A (${m}) × colunas de B (${p}): ${m}×${p}.`,'O resultado tem as linhas de A e as colunas de B.');},
 lv=>{const A=[[R(-4,6),R(-4,6)],[R(-4,6),R(-4,6)]],k=R(2,5),i=R(0,1),j=R(0,1);return NUM(`Sendo A = ${MX(A)}, qual é o elemento da linha ${i+1}, coluna ${j+1} de <b>${k}A</b>?`,k*A[i][j],`Multiplica-se cada elemento por ${k}: ${k} · ${par(A[i][j])} = <b>${fmt(k*A[i][j])}</b>.`,'Na multiplicação por escalar, todos os elementos são multiplicados.',{keys:['−']});},
 lv=>{const A=[[R(-4,9),R(-4,9),R(-4,9)],[R(-4,9),R(-4,9),R(-4,9)]];const i=R(0,2),j=R(0,1);return NUM(`Sendo A = ${MX(A)}, qual é o elemento <b>(A<sup>t</sup>)<sub>${i+1}${j+1}</sub></b> da transposta?`,A[j][i],`(A<sup>t</sup>)<sub>${i+1}${j+1}</sub> = a<sub>${j+1}${i+1}</sub> = <b>${fmt(A[j][i])}</b>.`,'Na transposta, linhas viram colunas.',{keys:['−']});},
]},
{id:'comb',name:'Análise combinatória',icon:'🎲',tip:'Ordem importa → arranjo/permutação. Ordem não importa → combinação C(n,p) = n!/(p!(n−p)!).',
theory:`<h3>Princípio multiplicativo</h3><p>Se uma escolha tem m opções e outra tem n, juntas têm m · n possibilidades.</p><div class="ex">3 camisas e 4 calças → 12 combinações de roupa</div>
<h3>Fatorial</h3><p>n! = n · (n − 1) · … · 1. 0! = 1. 5! = 120.</p>
<h3>Permutação</h3><div class="formula">P<sub>n</sub> = n!</div><p>Anagramas de AMOR: 4! = 24.</p>
<h3>Arranjo (ordem importa)</h3><div class="formula">A<sub>n,p</sub> = ${F('n!','(n − p)!')}</div><div class="ex">Pódio (1º, 2º, 3º) com 8 corredores: 8 · 7 · 6 = 336</div>
<h3>Combinação (ordem não importa)</h3><div class="formula">C<sub>n,p</sub> = ${F('n!','p! (n − p)!')}</div><div class="ex">Comissão de 3 entre 6 pessoas: C<sub>6,3</sub> = 20</div>`,
gens:[
 lv=>{const n=R(3,8);return NUM(`Quanto vale <b>${n}!</b>?`,fact(n),`${n}! = ${[...Array(n)].map((_,i)=>n-i).join(' · ')} = <b>${nf(fact(n))}</b>.`,'Multiplique todos os inteiros de n até 1.');},
 lv=>{const w=pick(['AMOR','LIVRO','PATO','BOLA','GATO','MESA','PRATO','SOL','NUVEM','BRASIL','FUTEBOL']);const n=new Set(w).size;return NUM(`Quantos <b>anagramas</b> tem a palavra <b>${w}</b>?`,fact(n),`São ${n} letras distintas: P<sub>${n}</sub> = ${n}! = <b>${nf(fact(n))}</b>.`,'Anagramas de letras distintas = n!.');},
 lv=>{const n=R(5,10);return NUM(`Uma corrida tem <b>${n}</b> atletas. De quantas maneiras podem ser ocupados o 1º, 2º e 3º lugares?`,n*(n-1)*(n-2),`A ordem importa (arranjo): ${n} · ${n-1} · ${n-2} = <b>${n*(n-1)*(n-2)}</b>.`,'Para o 1º lugar há n opções, para o 2º n − 1…');},
 lv=>{const n=R(4,10),p=R(2,3);return NUM(`De quantas maneiras podemos formar uma comissão de <b>${p}</b> pessoas escolhidas entre <b>${n}</b>?`,nCr(n,p),`A ordem não importa (combinação): C<sub>${n},${p}</sub> = ${F(`${n}!`,`${p}! · ${n-p}!`)} = <b>${nCr(n,p)}</b>.`,'Numa comissão, a ordem de escolha não importa.');},
 lv=>{const a=R(2,6),b=R(2,5),c=R(2,4);return NUM(`${pick(NAMES)} tem <b>${a}</b> camisetas, <b>${b}</b> calças e <b>${c}</b> pares de tênis. Quantos looks diferentes pode montar?`,a*b*c,`Princípio multiplicativo: ${a} · ${b} · ${c} = <b>${a*b*c}</b>.`,'Multiplique as opções de cada escolha.');},
 lv=>{const q=pick([['Escolher 3 alunos para uma comissão','Combinação'],['Formar senhas de 4 dígitos distintos','Arranjo'],['Organizar 5 livros diferentes numa prateleira','Permutação'],['Escolher 2 sabores de sorvete numa casquinha (sem importar a ordem)','Combinação'],['Eleger presidente e vice de um grêmio','Arranjo'],['Formar anagramas de uma palavra','Permutação']]);return MC(`Que tipo de contagem resolve: <b>${q[0]}</b>?`,q[1],['Arranjo','Combinação','Permutação'],`${q[1]}: ${{Arranjo:'a ordem importa e escolhemos parte dos elementos',Combinação:'a ordem não importa',Permutação:'reorganizamos todos os elementos'}[q[1]]}.`,'Pergunte-se: trocar a ordem gera um resultado diferente?',{keep:true});},
]},
{id:'prob',name:'Probabilidade',icon:'🎯',tip:'P = casos favoráveis ÷ casos possíveis. P(não A) = 1 − P(A). Eventos independentes: multiplique as probabilidades.',
theory:`<div class="formula">P(A) = ${F('casos favoráveis','casos possíveis')}</div><p>0 ≤ P ≤ 1 (ou 0% a 100%).</p>
<div class="ex">Dado: P(par) = ${F(3,6)} = ${F(1,2)}</div>
<h3>Complementar</h3><div class="formula">P(não A) = 1 − P(A)</div>
<h3>Eventos independentes</h3><p>P(A e B) = P(A) · P(B). Duas moedas: P(duas caras) = ${F(1,2)} · ${F(1,2)} = ${F(1,4)}.</p>
<h3>Dois dados</h3><p>São 36 resultados possíveis. Soma 7 ocorre de 6 formas → ${F(6,36)} = ${F(1,6)}.</p>
<p>Responda probabilidades como fração (ex.: <b>1/6</b>) ou decimal.</p>`,
gens:[
 lv=>{const e=pick([['sair um número par',3],['sair um número maior que 4',2],['sair o número 6',1],['sair um número primo',3],['sair um múltiplo de 3',2],['sair um número menor que 3',2],['sair um número maior que 1',5]]);return FRAC(`Lançando um dado comum, qual a probabilidade de <b>${e[0]}</b>? (ex.: 1/6)`,e[1],6,`Casos favoráveis: ${e[1]}; possíveis: 6. P = ${F(e[1],6)} = <b>${Fs(e[1],6)}</b>.`,'Conte os casos favoráveis entre 1, 2, 3, 4, 5, 6.');},
 lv=>{const r=R(2,8),b=R(2,8),g=R(2,6),c=pick([['vermelha',r],['azul',b],['verde',g]]);return FRAC(`Uma urna tem <b>${r}</b> bolas vermelhas, <b>${b}</b> azuis e <b>${g}</b> verdes. Sorteando uma, qual a probabilidade de ser <b>${c[0]}</b>?`,c[1],r+b+g,`P = ${F(c[1],r+b+g)} = <b>${Fs(c[1],r+b+g)}</b>.`,'Divida as bolas da cor pedida pelo total de bolas.');},
 lv=>{const e=pick([['duas caras',1,4],['pelo menos uma cara',3,4],['uma cara e uma coroa (em qualquer ordem)',1,2],['nenhuma cara',1,4]]);return FRAC(`Lançando duas moedas, qual a probabilidade de obter <b>${e[0]}</b>?`,e[1],e[2],`Espaço amostral: {CC, CK, KC, KK} (4 casos). P = <b>${F(e[1],e[2])}</b>.`,'Liste os 4 resultados possíveis.');},
 lv=>{const s=R(2,12),w=s<=7?s-1:13-s;return FRAC(`Lançando dois dados, qual a probabilidade de a soma ser <b>${s}</b>?`,w,36,`Há ${w} pares com soma ${s} entre 36 possíveis: ${F(w,36)} = <b>${Fs(w,36)}</b>.`,'São 36 pares; conte os que somam o valor pedido.');},
 lv=>{const p=R(1,19)*5;return NUM(`A probabilidade de chover amanhã é <b>${p}%</b>. Qual é a probabilidade de <b>não</b> chover (em %)?`,100-p,`P(não chover) = 100% − ${p}% = <b>${100-p}%</b>.`,'Use o evento complementar.',{unit:'%'});},
 lv=>{const e=pick([['um ás',4],['uma carta de copas',13],['uma figura (valete, dama ou rei)',12],['um rei vermelho',2]]);return FRAC(`De um baralho de 52 cartas, retira-se uma. Qual a probabilidade de ser <b>${e[0]}</b>?`,e[1],52,`P = ${F(e[1],52)} = <b>${Fs(e[1],52)}</b>.`,'O baralho tem 4 naipes com 13 cartas (A, 2–10, J, Q, K).');},
]},
{id:'esp',name:'Geometria espacial',icon:'🧊',tip:'Prisma/cilindro: V = área da base × altura. Pirâmide/cone: V = (área da base × altura)/3. Esfera: V = 4πr³/3.',
theory:`<table><tr><th>Sólido</th><th>Volume</th></tr><tr><td>Cubo</td><td>a³</td></tr><tr><td>Paralelepípedo</td><td>a · b · c</td></tr><tr><td>Cilindro</td><td>π r² h</td></tr><tr><td>Cone</td><td>${F('π r² h',3)}</td></tr><tr><td>Pirâmide</td><td>${F('A<sub>base</sub> · h',3)}</td></tr><tr><td>Esfera</td><td>${F('4 π r³',3)}</td></tr></table>
<h3>Relação de Euler (poliedros convexos)</h3><div class="formula">V − A + F = 2</div><p>Cubo: 8 − 12 + 6 = 2.</p>
<h3>Capacidade</h3><p>1 dm³ = 1 L · 1 m³ = 1000 L · 1 cm³ = 1 mL</p>`,
gens:[
 lv=>{const a=R(2,12);return NUM(`Qual é o volume de um cubo de aresta <b>${a} cm</b>?`,a**3,`V = a³ = ${a}³ = <b>${nf(a**3)} cm³</b>.`,'Volume do cubo = aresta³.',{unit:'cm³'});},
 lv=>{const a=R(2,15),b=R(2,10),c=R(2,10);return NUM('Qual é o volume do paralelepípedo (em cm³)?',a*b*c,`V = ${a} · ${b} · ${c} = <b>${nf(a*b*c)} cm³</b>.`,'Multiplique comprimento × largura × altura.',{visual:boxSVG(a+' cm',b+' cm',c+' cm'),unit:'cm³'});},
 lv=>{const r=R(1,6),h=R(2,12);return NUM('Qual é o volume do cilindro? (use π = 3)',3*r*r*h,`V = π r² h = 3 · ${r}² · ${h} = <b>${nf(3*r*r*h)}</b>.`,'Área da base (π r²) vezes a altura.',{visual:cylSVG('r = '+r,'h = '+h)});},
 lv=>{const t=pick(['cone','esfera']);const r=R(1,6),h=R(2,12);return t==='cone'?NUM(`Qual é o volume de um cone de raio <b>${r}</b> e altura <b>${h}</b>? (use π = 3)`,r*r*h,`V = ${F('π r² h',3)} = ${F('3 · '+r*r+' · '+h,3)} = <b>${nf(r*r*h)}</b>.`,'O cone tem 1/3 do volume do cilindro de mesma base e altura.'):NUM(`Qual é o volume de uma esfera de raio <b>${r}</b>? (use π = 3)`,4*r**3,`V = ${F('4 π r³',3)} = ${F('4 · 3 · '+r**3,3)} = <b>${nf(4*r**3)}</b>.`,'V = 4πr³/3.');},
 lv=>{const p=pick([['cubo',8,12,6],['tetraedro',4,6,4],['octaedro',6,12,8],['prisma triangular',6,9,5],['pirâmide de base quadrada',5,8,5],['prisma pentagonal',10,15,7]]);const m=R(0,2);const lbl=['vértices','arestas','faces'][m];const kn=[['V',p[1]],['A',p[2]],['F',p[3]]].filter((_,i)=>i!==m);return NUM(`Um poliedro convexo tem ${kn.map(k=>`<b>${k[1]}</b> ${{V:'vértices',A:'arestas',F:'faces'}[k[0]]}`).join(' e ')}. ${m===0?'Quantos':'Quantas'} <b>${lbl}</b> ele tem?`,[p[1],p[2],p[3]][m],`Euler: V − A + F = 2 → ${m===0?`V = 2 + ${p[2]} − ${p[3]}`:m===1?`A = ${p[1]} + ${p[3]} − 2`:`F = 2 − ${p[1]} + ${p[2]}`} = <b>${[p[1],p[2],p[3]][m]}</b> (é um ${p[0]}).`,'Use V − A + F = 2.');},
 lv=>{const a=pick([10,20,30,40,50]),b=pick([10,20,25]),c=pick([10,20,40]);return NUM(`Uma caixa-d'água tem dimensões internas de <b>${a} cm × ${b} cm × ${c} cm</b>. Quantos <b>litros</b> cabem nela?`,a*b*c/1000,`V = ${a} · ${b} · ${c} = ${nf(a*b*c)} cm³ = <b>${fmt(a*b*c/1000)} L</b> (1 L = 1000 cm³).`,'Calcule em cm³ e divida por 1000.',{unit:'L',keys:[',']});},
]},
{id:'gan',name:'Geometria analítica',icon:'📍',tip:'Distância: √((x₂−x₁)² + (y₂−y₁)²). Ponto médio: média das coordenadas. Inclinação: m = Δy/Δx. Circunferência: (x−a)² + (y−b)² = r².',
theory:`<h3>Distância entre pontos</h3><div class="formula">d = √[(x₂ − x₁)² + (y₂ − y₁)²]</div>
<h3>Ponto médio</h3><div class="formula">M = (${F('x₁ + x₂',2)}, ${F('y₁ + y₂',2)})</div>
<h3>Reta</h3><div class="formula">y = mx + n · m = ${F('y₂ − y₁','x₂ − x₁')}</div>
<h3>Circunferência</h3><div class="formula">(x − a)² + (y − b)² = r²</div><p>Centro C(a, b) e raio r.</p>
<div class="ex">A(1, 2), B(4, 6): d = √(9 + 16) = 5 · M = (2,5; 4) · m = 4/3</div>`,
gens:[
 lv=>{const [a,b,c]=pick(TRIPLES.slice(0,5));const x1=R(-5,5),y1=R(-5,5),sx=pick([1,-1]),sy=pick([1,-1]);const P=(x,y)=>`(${fmt(x)}, ${fmt(y)})`;return NUM(`Qual é a distância entre A${P(x1,y1)} e B${P(x1+sx*a,y1+sy*b)}?`,c,`d = √[(${a})² + (${b})²] = √${a*a+b*b} = <b>${c}</b>.`,'Calcule Δx e Δy, eleve ao quadrado, some e tire a raiz.');},
 lv=>{const x1=R(-6,6),y1=R(-6,6),x2=x1+2*R(-4,4),y2=y1+2*R(-4,4);const P=(x,y)=>`(${fmt(x)}, ${fmt(y)})`;const mx=(x1+x2)/2,my=(y1+y2)/2;return MC(`Qual é o ponto médio do segmento de A${P(x1,y1)} a B${P(x2,y2)}?`,P(mx,my),[P(my,mx),P(x2-x1,y2-y1),P(mx+1,my),P(x1+x2,y1+y2)],`M = (${F(`${fmt(x1)} + ${par(x2)}`,2)}, ${F(`${fmt(y1)} + ${par(y2)}`,2)}) = ${P(mx,my)}.`,'Faça a média dos x e a média dos y.');},
 lv=>{const m=RNZ(-4,4),x1=R(-4,3),x2=x1+R(1,4),n=R(-5,5);const P=(x,y)=>`(${fmt(x)}, ${fmt(y)})`;return NUM(`Qual é o coeficiente angular da reta que passa por ${P(x1,m*x1+n)} e ${P(x2,m*x2+n)}?`,m,`m = ${F(fmt(m*(x2-x1)),x2-x1)} = <b>${fmt(m)}</b>.`,'m = Δy/Δx.',{keys:['−']});},
 lv=>{const m=RNZ(-4,4),n=RNZ(-6,6);const Y=(a,b)=>'y = '+lin(a,b);return MC(`Qual é a equação da reta com coeficiente angular <b>${fmt(m)}</b> que corta o eixo y em <b>(0, ${fmt(n)})</b>?`,Y(m,n),[Y(n,m),Y(m,-n),Y(-m,n)],`y = mx + n com m = ${fmt(m)} e n = ${fmt(n)}: ${Y(m,n)}.`,'Use y = mx + n.');},
 lv=>{const a=RNZ(-5,5),b=R(-5,5),r=R(2,7);const t=(v,l)=>v===0?`${l}<sup>2</sup>`:`(${l} ${v>0?'−':'+'} ${Math.abs(v)})<sup>2</sup>`;const C=(x,y,rr)=>`C(${fmt(x)}, ${fmt(y)}) e r = ${rr}`;return MC(`Qual o centro e o raio da circunferência <b>${t(a,'x')} + ${t(b,'y')} = ${r*r}</b>?`,C(a,b,r),[C(-a,-b,r),C(a,b,r*r),C(-a,-b,r*r)],`Comparando com (x − a)² + (y − b)² = r²: centro (${fmt(a)}, ${fmt(b)}) e r = √${r*r} = ${r}.`,'O centro tem os sinais trocados em relação aos parênteses; r é a raiz do 2º membro.');},
 lv=>{const x=RNZ(-5,5),y=RNZ(-5,5);const q=x>0?(y>0?1:4):(y>0?2:3);return MC(`Em qual quadrante está o ponto <b>P(${fmt(x)}, ${fmt(y)})</b>?`,q+'º quadrante',['1º quadrante','2º quadrante','3º quadrante','4º quadrante'],`x ${x>0?'> 0':'< 0'} e y ${y>0?'> 0':'< 0'} → ${q}º quadrante.`,'1º (+,+), 2º (−,+), 3º (−,−), 4º (+,−).',{keep:true,visual:gridPtSVG([[x,y,'P']])});},
]},
{id:'cpx',name:'Números complexos',icon:'🌀',tip:'i² = −1. As potências de i se repetem de 4 em 4: i⁰=1, i¹=i, i²=−1, i³=−i. |a+bi| = √(a²+b²). Conjugado de a+bi é a−bi.',
theory:`<div class="formula">i² = −1 · z = a + bi (a = parte real, b = parte imaginária)</div>
<h3>Potências de i</h3><p>Ciclo de 4: i⁰ = 1, i¹ = i, i² = −1, i³ = −i. Para iⁿ, use o resto de n ÷ 4.</p><div class="ex">i<sup>23</sup>: 23 ÷ 4 deixa resto 3 → i<sup>23</sup> = −i</div>
<h3>Operações</h3><ul><li>Soma: some reais com reais e imaginários com imaginários.</li><li>Produto: aplique a distributiva e troque i² por −1.</li></ul><div class="ex">(2 + 3i)(1 − i) = 2 − 2i + 3i − 3i² = 2 + i + 3 = 5 + i</div>
<h3>Conjugado e módulo</h3><p>z̄ = a − bi · |z| = √(a² + b²)</p>`,
gens:[
 lv=>{const n=R(2,60);const v=['1','i','−1','−i'][n%4];return MC(`Quanto vale <b>i<sup>${n}</sup></b>?`,v,['1','i','−1','−i'],`${n} ÷ 4 deixa resto ${n%4}, então i<sup>${n}</sup> = i<sup>${n%4}</sup> = <b>${v}</b>.`,'Divida o expoente por 4 e use o resto.',{keep:true});},
 lv=>{const a=R(-6,6),b=RNZ(-6,6),c=R(-6,6),d=RNZ(-6,6);return MC(`Quanto é <b>(${cx(a,b)}) + (${cx(c,d)})</b>?`,cx(a+c,b+d),[cx(a+c,b-d),cx(a-c,b+d),cx(a*c,b*d),cx(b+d,a+c)],`Reais: ${fmt(a)} + ${par(c)} = ${fmt(a+c)}; imaginários: ${fmt(b)} + ${par(d)} = ${fmt(b+d)} → ${cx(a+c,b+d)}.`,'Some parte real com parte real e imaginária com imaginária.');},
 lv=>{const a=R(-4,5),b=RNZ(-4,4),c=R(-4,5),d=RNZ(-4,4);return MC(`Quanto é <b>(${cx(a,b)}) · (${cx(c,d)})</b>?`,cx(a*c-b*d,a*d+b*c),[cx(a*c+b*d,a*d+b*c),cx(a*c,b*d),cx(a*c-b*d,a*d-b*c),cx(a*c+b*d,a*d-b*c)],`Distributiva: ${fmt(a*c)} + ${par(a*d)}i + ${par(b*c)}i + ${par(b*d)}i². Como i² = −1: ${cx(a*c-b*d,a*d+b*c)}.`,'Distribua e troque i² por −1.');},
 lv=>{const [a,b,c]=pick(TRIPLES.slice(0,5));const sa=pick([1,-1]),sb=pick([1,-1]);return NUM(`Qual é o módulo de <b>z = ${cx(sa*a,sb*b)}</b>?`,c,`|z| = √(${a}² + ${b}²) = √${a*a+b*b} = <b>${c}</b>.`,'|a + bi| = √(a² + b²).');},
 lv=>{const a=RNZ(-9,9),b=RNZ(-9,9);return MC(`Qual é o conjugado de <b>z = ${cx(a,b)}</b>?`,cx(a,-b),[cx(-a,b),cx(-a,-b),cx(b,a)],`O conjugado troca o sinal da parte imaginária: ${cx(a,-b)}.`,'Conjugado: a + bi → a − bi.');},
 lv=>{const a=RNZ(-9,9),b=RNZ(-9,9),re=Math.random()<.5;return NUM(`Qual é a parte <b>${re?'real':'imaginária'}</b> de <b>z = ${cx(a,b)}</b>?`,re?a:b,`Em z = a + bi: a = ${fmt(a)} (real) e b = ${fmt(b)} (imaginária).`,'A parte imaginária é o número que multiplica i (sem o i).',{keys:['−']});},
]},
]});

const GLOSS=[
 {k:['adicao','somar','soma de numeros','parcela'],n:'Adição',s:'add',t:'Juntar quantidades. Some unidades com unidades, dezenas com dezenas; se passar de 9, "vai um". Ex.: 47 + 38 = 85.'},
 {k:['subtracao','subtrair','diferenca','emprestimo'],n:'Subtração',s:'sub',t:'Tirar ou comparar quantidades. Se o algarismo de cima for menor, "empreste" 1 da casa ao lado. Prova real: diferença + subtraendo = minuendo.'},
 {k:['tabuada','multiplicacao','multiplicar','vezes','produto de'],n:'Multiplicação',s:'mul',t:'Soma de parcelas iguais: 4 × 3 = 3 + 3 + 3 + 3 = 12. Use a distributiva para contas grandes: 23 × 4 = 20 × 4 + 3 × 4 = 92.'},
 {k:['divisao','dividir','resto','quociente','dividendo','divisor'],n:'Divisão',s:'div',t:'Repartir em partes iguais. Dividendo = divisor × quociente + resto, e o resto é sempre menor que o divisor.'},
 {k:['par e impar','numero par','impar','sucessor','antecessor','valor posicional'],n:'Números naturais',s:'num',t:'Pares terminam em 0, 2, 4, 6, 8. Sucessor = n + 1; antecessor = n − 1. Valor posicional: em 4.382, o 3 vale 300.'},
 {k:['fracao','fracoes','numerador','denominador','equivalente'],n:'Frações',s:'frac1',t:'Numerador = partes tomadas; denominador = partes iguais do todo. Frações equivalentes: multiplique em cima e embaixo pelo mesmo número (1/2 = 2/4). Para somar com denominadores diferentes, use o MMC.'},
 {k:['decimal','decimais','virgula','decimo','centesimo'],n:'Números decimais',s:'dec',t:'0,1 = 1/10 e 0,01 = 1/100. Para somar, alinhe as vírgulas. × 10, 100, 1000 anda a vírgula 1, 2, 3 casas para a direita.'},
 {k:['medida','converter','conversao','metro','centimetro','quilometro','grama','quilo','litro','unidade de medida'],n:'Medidas',s:'med',t:'1 km = 1000 m; 1 m = 100 cm; 1 kg = 1000 g; 1 L = 1000 mL; 1 h = 60 min. Da maior para a menor, multiplique; da menor para a maior, divida.'},
 {k:['perimetro','contorno'],n:'Perímetro',s:'geo1',t:'Soma de todos os lados. Retângulo: 2·(b + h). Quadrado: 4·ℓ.'},
 {k:['poligono','hexagono','pentagono','octogono','lados'],n:'Polígonos',s:'geo1',t:'Triângulo 3 lados, quadrilátero 4, pentágono 5, hexágono 6, heptágono 7, octógono 8, decágono 10. Soma dos ângulos internos: (n − 2)·180°.'},
 {k:['troco','dinheiro','reais','centavos'],n:'Dinheiro',s:'din',t:'Troco = valor pago − preço. R$ 1,00 = 100 centavos.'},
 {k:['negativo','inteiros','regra de sinais','sinais','jogo de sinais'],n:'Números inteiros',s:'int',t:'Adição: sinais iguais → some e mantenha o sinal; diferentes → subtraia e fique com o sinal do maior módulo. Multiplicação/divisão: sinais iguais dão +, diferentes dão −.'},
 {k:['simplificar','simplificacao','irredutivel'],n:'Simplificação de frações',s:'fracop',t:'Divida numerador e denominador pelo MDC deles: 12/18 → ÷6 → 2/3.'},
 {k:['potencia','potenciacao','expoente','elevado','ao quadrado','ao cubo'],n:'Potenciação',s:'pot',t:'aⁿ = a·a·…·a (n vezes). aᵐ·aⁿ = aᵐ⁺ⁿ; aᵐ÷aⁿ = aᵐ⁻ⁿ; (aᵐ)ⁿ = aᵐⁿ; a⁰ = 1; a⁻ⁿ = 1/aⁿ.'},
 {k:['raiz','radiciacao','radical','raiz quadrada','raiz cubica'],n:'Radiciação',s:'raiz',t:'√a = b porque b² = a. Simplifique procurando quadrados perfeitos: √72 = √(36·2) = 6√2.'},
 {k:['expressao numerica','ordem das operacoes','prioridade','parenteses'],n:'Expressões numéricas',s:'expr',t:'Ordem: parênteses → potências/raízes → × e ÷ (esquerda para direita) → + e − (esquerda para direita). Ex.: 5 + 3 × 4 = 17.'},
 {k:['mmc','minimo multiplo','multiplo comum'],n:'MMC',s:'mmc',t:'Mínimo Múltiplo Comum: o menor número que é múltiplo de todos. MMC(4, 6) = 12. Use em problemas de "quando vão coincidir novamente" e para somar frações.'},
 {k:['mdc','maximo divisor','divisor comum'],n:'MDC',s:'mmc',t:'Máximo Divisor Comum: o maior número que divide todos. MDC(12, 18) = 6. Use em problemas de "dividir em partes iguais do maior tamanho possível".'},
 {k:['primo','primos','divisibilidade','divisivel'],n:'Primos e divisibilidade',s:'mmc',t:'Primo tem só 2 divisores (1 e ele mesmo): 2, 3, 5, 7, 11, 13… Divisível por 3: soma dos algarismos múltipla de 3; por 5: termina em 0 ou 5.'},
 {k:['porcentagem','porcento','por cento','%','desconto','aumento'],n:'Porcentagem',s:'porc',t:'x% de V = V·x/100. Desconto de d%: multiplique por (1 − d/100). Aumento de a%: multiplique por (1 + a/100). "Quantos %": parte ÷ todo × 100.'},
 {k:['regra de tres','proporcao','razao','proporcional','escala'],n:'Regra de três',s:'prop',t:'Direta: as grandezas crescem juntas → multiplique cruzado. Inversa: uma cresce e a outra diminui (ex.: operários × dias) → multiplique em linha.'},
 {k:['equacao do primeiro','equacao de primeiro','1 grau','primeiro grau','isolar','incognita'],n:'Equação do 1º grau',s:'eq1',t:'Isole x fazendo a mesma operação dos dois lados: 3x + 5 = 20 → 3x = 15 → x = 5.'},
 {k:['area','areas'],n:'Área',s:'area',t:'Retângulo b·h; triângulo b·h/2; trapézio (B + b)·h/2; losango D·d/2; círculo π·r².'},
 {k:['circulo','circunferencia','comprimento da circunferencia','pi'],n:'Círculo',s:'area',t:'Área = π·r²; comprimento da circunferência = 2·π·r. π ≈ 3,14.'},
 {k:['angulo','complementar','suplementar','agudo','obtuso','oposto pelo vertice'],n:'Ângulos',s:'ang',t:'Complementares somam 90°; suplementares, 180°. Opostos pelo vértice são iguais. Ângulos internos de um triângulo somam 180°.'},
 {k:['pitagoras','hipotenusa','cateto'],n:'Teorema de Pitágoras',s:'pit',t:'Em um triângulo retângulo: hipotenusa² = cateto² + cateto² (a² = b² + c²). Ex.: catetos 3 e 4 → hipotenusa 5.'},
 {k:['produto notavel','produtos notaveis','quadrado da soma','quadrado da diferenca','fatoracao','fatorar'],n:'Produtos notáveis',s:'alg',t:'(a + b)² = a² + 2ab + b²; (a − b)² = a² − 2ab + b²; (a + b)(a − b) = a² − b².'},
 {k:['sistema','sistemas','substituicao','metodo da adicao'],n:'Sistemas de equações',s:'sist',t:'Adição: some/subtraia as equações para eliminar uma incógnita. Substituição: isole uma letra e substitua na outra equação.'},
 {k:['bhaskara','baskara','delta','discriminante','segundo grau','2 grau','equacao do segundo','quadratica'],n:'Equação do 2º grau',s:'eq2',t:'ax² + bx + c = 0 → Δ = b² − 4ac; x = (−b ± √Δ)/2a. Δ > 0: 2 raízes; Δ = 0: 1 raiz; Δ < 0: nenhuma real. Soma = −b/a; produto = c/a.'},
 {k:['media','mediana','moda','estatistica','amplitude'],n:'Estatística',s:'est',t:'Média = soma ÷ quantidade. Mediana = valor central dos dados ordenados. Moda = valor mais frequente. Amplitude = maior − menor.'},
 {k:['notacao cientifica','cientifica','potencia de 10'],n:'Notação científica',s:'notc',t:'a × 10ⁿ com 1 ≤ a < 10. 3 200 000 = 3,2 × 10⁶; 0,00045 = 4,5 × 10⁻⁴.'},
 {k:['conjunto','uniao','intersecao','racional','irracional','naturais'],n:'Conjuntos',s:'conj',t:'União (∪): tudo de A ou B. Interseção (∩): o que é comum. n(A∪B) = n(A) + n(B) − n(A∩B). ℕ ⊂ ℤ ⊂ ℚ ⊂ ℝ; irracionais: √2, π…'},
 {k:['funcao afim','funcao do primeiro','coeficiente angular','coeficiente linear','reta'],n:'Função afim',s:'fafim',t:'f(x) = ax + b. a > 0 crescente; a < 0 decrescente. Raiz: x = −b/a. Corta o eixo y em (0, b). a = Δy/Δx.'},
 {k:['funcao quadratica','parabola','vertice','concavidade','maximo','minimo'],n:'Função quadrática',s:'fquad',t:'f(x) = ax² + bx + c. Vértice: xv = −b/2a, yv = −Δ/4a. a > 0: concavidade para cima (mínimo); a < 0: para baixo (máximo).'},
 {k:['exponencial','equacao exponencial','mesma base'],n:'Função exponencial',s:'fexp',t:'f(x) = aˣ. Para resolver equações, iguale as bases: 4ˣ = 8 → 2²ˣ = 2³ → x = 3/2. Base > 1: crescente; 0 < base < 1: decrescente.'},
 {k:['logaritmo','log','logaritmos'],n:'Logaritmos',s:'log',t:'logₐ b = x ⟺ aˣ = b. log(MN) = log M + log N; log(M/N) = log M − log N; log Mⁿ = n·log M; logₐ 1 = 0; logₐ a = 1.'},
 {k:['progressao aritmetica','pa','termo geral','razao da pa'],n:'Progressão aritmética',s:'pa',t:'Soma-se sempre a razão r. aₙ = a₁ + (n − 1)r. Sₙ = (a₁ + aₙ)·n/2.'},
 {k:['progressao geometrica','pg','razao da pg'],n:'Progressão geométrica',s:'pg',t:'Multiplica-se sempre pela razão q. aₙ = a₁·qⁿ⁻¹. Sₙ = a₁(qⁿ − 1)/(q − 1). Soma infinita (|q| < 1): a₁/(1 − q).'},
 {k:['juros','juros simples','juros compostos','montante','capital','taxa'],n:'Juros',s:'juros',t:'Simples: J = C·i·t e M = C + J. Compostos: M = C·(1 + i)ᵗ. A taxa e o tempo devem estar na mesma unidade.'},
 {k:['seno','cosseno','tangente','sen','cos','tg','trigonometria','soh cah toa'],n:'Trigonometria',s:'trig',t:'sen = oposto/hipotenusa; cos = adjacente/hipotenusa; tg = oposto/adjacente. sen 30° = 1/2, sen 45° = √2/2, sen 60° = √3/2.'},
 {k:['radiano','radianos','ciclo trigonometrico','quadrante'],n:'Ciclo trigonométrico',s:'ciclo',t:'180° = π rad. Quadrantes: 1º tudo +; 2º só sen +; 3º só tg +; 4º só cos +.'},
 {k:['matriz','matrizes','determinante','sarrus','transposta'],n:'Matrizes',s:'mat',t:'det 2×2 = ad − bc. 3×3: regra de Sarrus. Produto A(m×n)·B(n×p) = C(m×p). Transposta troca linhas por colunas.'},
 {k:['fatorial','permutacao','arranjo','combinacao','anagrama','combinatoria'],n:'Combinatória',s:'comb',t:'n! = n·(n−1)·…·1. Permutação: n!. Arranjo (ordem importa): n!/(n−p)!. Combinação (ordem não importa): n!/(p!(n−p)!).'},
 {k:['probabilidade','chance','evento','espaco amostral'],n:'Probabilidade',s:'prob',t:'P = casos favoráveis ÷ casos possíveis. P(não A) = 1 − P(A). Eventos independentes: P(A e B) = P(A)·P(B).'},
 {k:['volume','cubo','cilindro','cone','esfera','prisma','piramide','euler','poliedro'],n:'Geometria espacial',s:'esp',t:'Cubo a³; paralelepípedo a·b·c; cilindro πr²h; cone πr²h/3; esfera 4πr³/3. Euler: V − A + F = 2. 1 dm³ = 1 L.'},
 {k:['distancia entre pontos','ponto medio','geometria analitica','plano cartesiano','equacao da reta','equacao da circunferencia'],n:'Geometria analítica',s:'gan',t:'d = √[(Δx)² + (Δy)²]. Ponto médio: média das coordenadas. Reta: y = mx + n. Circunferência: (x − a)² + (y − b)² = r².'},
 {k:['complexo','complexos','numero imaginario','unidade imaginaria','conjugado','modulo'],n:'Números complexos',s:'cpx',t:'i² = −1. Potências de i repetem de 4 em 4 (1, i, −1, −i). z = a + bi; conjugado a − bi; |z| = √(a² + b²).'},
];
