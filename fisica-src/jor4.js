/* =====================================================================
   Jornadas e exemplos animados — Oscilações, ondas, som e óptica
   ===================================================================== */
const lensImg=s=>{ const f=(s.p.t==='c'?1:-1)*s.p.f, p=s.p.p; if(Math.abs(1/f-1/p)<1e-9) return null; const pi=1/(1/f-1/p); return {pi,A:-pi/p}; };

LX.mhs.jor=[
 {t:'cena',h:'O balanço',p:`<p>No parquinho, você empurra um balanço. Se empurrar no ritmo certo, ele sobe cada vez mais; fora do ritmo, atrapalha. O balanço tem um <b>ritmo próprio</b>.</p><p>Relógios antigos usavam esse ritmo para marcar o tempo. Do que ele depende?</p>`},
 {t:'aposta',q:'Dois pêndulos do mesmo comprimento: um com bola de 1 kg, outro com bola de 4 kg. Qual balança mais rápido?',o:['os dois no mesmo ritmo','o mais pesado','o mais leve']},
 {t:'lab',sim:'mhs',p:'À esquerda, uma massa presa a uma mola; à direita, um pêndulo com a mesma massa. <b>Desafio:</b> aumente a massa para <b>2 kg</b> e veja quem muda de ritmo.',goal:s=>eq(s.p.m,2)&&s.t>1,ok:'A mola ficou <b>mais lenta</b>; o pêndulo nem ligou para a massa. Compare os períodos T nos dois.',dica:'Arraste o controle de massa até o fim.'},
 {t:'medir',sim:'mhs',p:'Agora mude o <b>comprimento do pêndulo</b> e anote o período, para quatro comprimentos.',rec:s=>[s.p.L,2*Math.PI*Math.sqrt(s.p.L/GRAV)],key:s=>[s.p.L],cols:['comprimento L (m)','período T (s)'],need:4,dec:2,
  depois:{q:'Compare L = 0,5 m com L = 2 m (quatro vezes mais comprido). O período…',o:['dobra','quadruplica','fica igual'],why:'O período cresce com a <b>raiz</b> do comprimento: √4 = 2. A curva vai ficando mais deitada.'}},
 {t:'deduz',p:'Monte as fórmulas dos períodos.',linhas:[
   {txt:'O período do pêndulo cresce com a raiz de L e diminui com a gravidade: T ∝ ___',o:['√(L/g)','L/g','g/L']},
   {txt:'Com o fator 2π: T<sub>pêndulo</sub> = ___',o:['2π·√(L/g)','2π·L/g','√(2π·L)']},
   {txt:'Na mola, quem faz o papel de L/g é m/k (massa sobre rigidez): T<sub>mola</sub> = ___',o:['2π·√(m/k)','2π·√(k/m)','2π·m/k']}],fim:'T<sub class="up">pêndulo</sub> = 2π·√(L/g)      T<sub class="up">mola</sub> = 2π·√(m/k)'},
 {t:'q',q:'Um relógio de pêndulo é levado para a Lua, onde g é 6 vezes menor. Ele…',o:['atrasa: o pêndulo balança mais devagar','adianta','continua certo'],why:'g menor → T maior. Cada "tique" demora mais, e o relógio atrasa.'},
 {t:'n',q:'Qual é o período de um pêndulo de 2,5 m? (g = 10 m/s²; π ≈ 3,14)',a:2*Math.PI*.5,u:'s',why:'T = 2π·√(2,5/10) = 2π·0,5 ≈ 3,14 s.'},
 {t:'mundo',h:'Oscilações na sua volta',itens:[['Balanço','Para empurrar bem, acompanhe o período dele.'],['Suspensão do carro','Molas e amortecedores evitam que o carro fique balançando.'],['Relógio de quartzo','Um cristal vibra 32 768 vezes por segundo, sempre no mesmo ritmo.']]}];
LX.mhs.exa={q:'Um bloco de <b>0,4 kg</b> preso a uma mola de <b>k = 40 N/m</b> oscila. Qual é o período? E a frequência? (π ≈ 3,14)',sim:'mhs',set:{m:.4,k:40,L:1,A:.06},ty:999,passos:[
 {txt:'m/k = 0,4/40 = <b>0,01</b>, e √0,01 = 0,1.',ask:{q:'Quanto vale m/k?',a:.01}},
 {txt:'T = 2π·√(m/k) = 2 × 3,14 × 0,1 ≈ <b>0,63 s</b>. Veja duas oscilações completas da mola.',ask:{q:'Qual é o período?',a:.628,u:'s',tol:.03},ate:1.26},
 {txt:'Frequência: f = 1/T = 1/0,63 ≈ <b>1,6 Hz</b>: um pouco mais de uma ida e volta e meia por segundo.',ask:{q:'Qual é a frequência?',a:1.59,u:'Hz',tol:.04}}]};

LX.ondas.jor=[
 {t:'cena',h:'A ola no estádio',p:`<p>Na "ola" do estádio, cada torcedor só levanta e senta no lugar. Mesmo assim, a onda atravessa a arquibancada inteira.</p><p>Uma <b>onda</b> leva energia de um lugar a outro <b>sem levar a matéria junto</b>.</p>`},
 {t:'q',q:'Observe a fita vermelha amarrada na corda do laboratório. Enquanto a onda passa, a fita…',o:['só sobe e desce, sem sair do lugar','anda para a direita junto com a onda','anda para a esquerda'],why:'Cada pedaço da corda só oscila. Quem viaja é o formato da onda, e com ele a energia.'},
 {t:'lab',sim:'wave',p:'<b>Desafio:</b> sem mudar a velocidade da corda (4 m/s), faça o comprimento de onda λ (distância entre duas cristas) ficar <b>2 m</b>.',goal:s=>eq(s.p.v,4)&&eq(s.p.v/s.p.f,2),ok:'Com o dobro da frequência (2 Hz), as cristas ficam com metade da distância.',dica:'Mude a frequência. Balançar mais rápido aproxima as cristas.'},
 {t:'medir',sim:'wave',p:'Mantendo <b>v = 4 m/s</b>, anote o comprimento de onda para <b>quatro frequências</b>.',rec:s=>eq(s.p.v,4)?[s.p.f,s.p.v/s.p.f]:null,recMsg:'Coloque a velocidade em 4 m/s.',cols:['frequência f (Hz)','comprimento de onda λ (m)'],need:4,dec:2,
  depois:{q:'Multiplique f por λ em cada linha. O que você obtém?',o:['sempre 4: a velocidade da onda','números diferentes','sempre 1'],why:'f·λ = v, sempre. Frequência maior, comprimento de onda menor, e a velocidade (que depende da corda) não muda.'}},
 {t:'deduz',p:'Por que v = λ·f?',linhas:[
   {txt:'Em um período T, a fonte faz uma oscilação e a onda avança um λ. Então v = ___',o:['λ/T','λ·T','T/λ']},
   {txt:'Como a frequência é f = 1/T: v = ___',o:['λ·f','λ/f','f/λ']}],fim:'v = λ·f      f = '+frac('1','T')},
 {t:'q',q:'Se você balançar a corda mais forte (maior amplitude), a velocidade da onda…',o:['não muda: ela depende só do meio','aumenta','diminui'],why:'Amplitude tem a ver com a energia. A velocidade depende da corda (tensão e espessura).'},
 {t:'n',q:'Uma rádio FM transmite em 100 MHz (1×10⁸ Hz). As ondas viajam a 3×10⁸ m/s. Qual é o comprimento de onda?',a:3,u:'m',why:'λ = v/f = 3×10⁸ / 1×10⁸ = 3 m.'},
 {t:'mundo',h:'Ondas na sua volta',itens:[['Mar','As ondas chegam à praia, mas a água no fundo só gira no lugar.'],['Terremoto','Ondas sísmicas levam energia por centenas de quilômetros.'],['Wi-Fi','Ondas de uns 12 cm levam dados até o seu celular.']]}];
LX.ondas.exa={q:'Numa corda, as ondas viajam a <b>4 m/s</b>. Uma pessoa balança a ponta <b>2 vezes por segundo</b>. Qual é o comprimento de onda e o período?',sim:'wave',set:{f:2,v:4,A:.6},ty:999,passos:[
 {txt:'A frequência é o número de oscilações por segundo: <b>f = 2 Hz</b>.'},
 {txt:'λ = v/f = 4/2 = <b>2 m</b>: confira a cota entre duas cristas.',ask:{q:'Qual é o comprimento de onda?',a:2,u:'m'},ate:2},
 {txt:'Período: T = 1/f = <b>0,5 s</b>. A fita vermelha sobe e desce uma vez a cada meio segundo.',ask:{q:'Qual é o período?',a:.5,u:'s'},ate:4}]};

LX.som.jor=[
 {t:'cena',h:'A sirene que muda',p:`<p>Uma ambulância passa por você: a sirene soa <b>mais aguda</b> quando ela chega e <b>mais grave</b> quando vai embora. Mas a sirene não mudou!</p><p>O som é uma onda no ar, viajando a 340 m/s. O que muda é como as ondas chegam até você.</p>`},
 {t:'lab',sim:'doppler',p:'A fonte emite 440 Hz. <b>Desafio:</b> pare a fonte (velocidade zero).',goal:s=>s.p.M===0,ok:'Parada, as frentes de onda são círculos com o mesmo centro: os dois ouvintes escutam os mesmos 440 Hz.',dica:'Leve a velocidade da fonte até zero.'},
 {t:'lab',sim:'doppler',cfg:{M:0},p:'<b>Desafio:</b> faça o ouvinte da frente escutar <b>mais de 600 Hz</b>.',goal:s=>s.p.M<1&&440/(1-s.p.M)>600,ok:'À frente da fonte, as frentes de onda ficam <b>espremidas</b>: chegam mais vezes por segundo, frequência maior, som mais agudo.',dica:'Aumente a velocidade da fonte, mas sem passar do som.'},
 {t:'q',q:'Atrás da fonte, as frentes de onda ficam…',o:['mais espaçadas: frequência menor, som mais grave','mais juntas','iguais às da frente'],why:'É o <b>efeito Doppler</b>: aproximação, mais agudo; afastamento, mais grave.'},
 {t:'lab',sim:'doppler',p:'<b>Desafio:</b> faça a fonte andar <b>mais rápido que o som</b>.',goal:s=>s.p.M>=1,ok:'A fonte passa as próprias ondas, que se acumulam num cone: o <b>estrondo sônico</b> dos jatos supersônicos.',dica:'Passe de 1,0 × a velocidade do som.'},
 {t:'deduz',p:'Outra aplicação do som: o eco.',linhas:[
   {txt:'Você grita para um paredão e ouve o eco depois de um tempo t. O som foi e voltou: percorreu ___ a distância até o paredão.',o:['2 vezes','a mesma','metade']},
   {txt:'Então a distância é d = ___',o:['v·t/2','v·t','2·v·t']}],fim:'d = '+frac('v·t','2')+'   (eco)'},
 {t:'n',q:'Você vê o relâmpago e ouve o trovão 3 s depois. A que distância caiu o raio? (som: 340 m/s)',a:1020,u:'m',why:'A luz chega quase na hora; o som leva 3 s: d = 340 × 3 = 1020 m. Aqui não há volta: não divida por 2.'},
 {t:'q',q:'Um violão e um piano tocam a mesma nota. O que faz os sons serem diferentes?',o:['o timbre (a forma da onda)','a frequência','a velocidade do som'],why:'Mesma nota = mesma frequência. A forma da onda muda de instrumento para instrumento.'},
 {t:'mundo',h:'Som na sua volta',itens:[['Radar de trânsito','Usa o efeito Doppler de ondas de rádio para medir a velocidade dos carros.'],['Ultrassom','Ecos de sons agudos demais para ouvirmos formam a imagem do bebê.'],['Morcegos','Se orientam pelo eco dos próprios gritos.']]}];
LX.som.exa={q:'Uma ambulância com sirene de <b>440 Hz</b> anda à metade da velocidade do som (<b>170 m/s</b>, só para o exemplo). Que frequência ouvem as pessoas à frente e atrás?',sim:'doppler',set:{M:.5},tx:.5,ty:52,passos:[
 {txt:'À frente, as frentes chegam espremidas: f\' = f·v/(v − v<sub>f</sub>) = 440 × 340/170.',ate:2},
 {txt:'= <b>880 Hz</b>, uma oitava acima.',ask:{q:'Que frequência ouve quem está à frente?',a:880,u:'Hz'},tags:[['à frente: 880 Hz','vel']]},
 {txt:'Atrás: f\' = 440 × 340/(340 + 170) = 440 × 340/510 ≈ <b>293 Hz</b>, bem mais grave.',ask:{q:'E quem está atrás?',a:293.3,u:'Hz',tol:.02},ate:4,tags:[['atrás: 293 Hz','force']]}]};

LX.estacionarias.jor=[
 {t:'cena',h:'As notas do violão',p:`<p>Num violão, cada corda presa nas duas pontas vibra num padrão que <b>não anda</b>: uma onda estacionária. Apertando a corda num traste, você encurta a parte que vibra e a nota sobe.</p><p>Como o comprimento decide a nota?</p>`},
 {t:'aposta',q:'Você aperta a corda bem no meio. A frequência da nota…',o:['dobra','cai pela metade','fica igual']},
 {t:'lab',sim:'harm',p:'<b>Desafio:</b> na corda, faça aparecer o <b>3º modo</b> de vibração. Conte os nós (pontos parados).',goal:s=>s.p.tipo==='corda'&&s.p.n===3,ok:'3 "barrigas" (ventres) e 4 nós, contando as pontas. Cada barriga é meia onda.',dica:'Mude o "Modo de vibração".'},
 {t:'medir',sim:'harm',p:'Corda de <b>1 m</b>, ondas a <b>340 m/s</b>. Anote a frequência dos modos 1 a 4.',rec:s=>s.p.tipo==='corda'&&eq(s.p.L,1)&&s.p.v===340?[s.p.n,s.def.mode(s).f]:null,recMsg:'Use corda, L = 1 m e v = 340 m/s.',cols:['modo n','frequência (Hz)'],need:4,dec:0,
  depois:{q:'A frequência do modo n é…',o:['n vezes a do 1º modo','n² vezes a do 1º modo','igual em todos'],why:'170, 340, 510, 680 Hz: múltiplos da fundamental. São os <b>harmônicos</b>.'}},
 {t:'deduz',p:'Monte a fórmula da corda presa.',linhas:[
   {txt:'No modo n cabem n meias ondas na corda: n·λ/2 = ___',o:['L','2L','L/2']},
   {txt:'Então λ = 2L/n e f = v/λ = ___',o:['n·v/(2L)','2L/(n·v)','n·v·2L']}],fim:'f<sub class="up">n</sub> = n·'+frac('v','2L')},
 {t:'lab',sim:'harm',p:'Num tubo <b>fechado</b> numa ponta, a ponta fechada é nó e a aberta é ventre. <b>Desafio:</b> faça um tubo fechado com fundamental de <b>85 Hz</b> (som a 340 m/s).',goal:s=>s.p.tipo==='fechado'&&s.p.n===1&&s.p.v===340&&Math.abs(s.def.mode(s).f-85)<.5,ok:'L = 1 m. No tubo fechado cabe só um quarto de onda no fundamental: f = v/(4L).',dica:'Use f = v/(4L) e descubra o comprimento.'},
 {t:'n',q:'Uma corda de violão de 0,65 m vibra no fundamental; as ondas nela viajam a 286 m/s. Qual é a frequência?',a:220,u:'Hz',why:'f = v/(2L) = 286/1,3 = 220 Hz: a nota lá.'},
 {t:'mundo',h:'Ressonância na sua volta',itens:[['Flauta','Tapar os furos muda o comprimento do tubo de ar que vibra.'],['Taça que estoura','Uma voz na frequência natural da taça faz a amplitude crescer até quebrar.'],['Ponte de Tacoma (1940)','O vento excitou a ponte no ritmo dela, e ela desabou.']]}];
LX.estacionarias.exa={q:'Uma corda de violão de <b>0,65 m</b> vibra no modo fundamental, e as ondas nela viajam a <b>286 m/s</b>. Qual é a frequência da nota? E a do 2º harmônico?',sim:'harm',set:{tipo:'corda',n:1,L:.65,v:286},ty:56,passos:[
 {txt:'No fundamental cabe meia onda na corda: λ = 2L = <b>1,3 m</b>.',ask:{q:'Qual é o comprimento de onda?',a:1.3,u:'m'},ate:1.5},
 {txt:'f = v/λ = 286/1,3 = <b>220 Hz</b>: a nota lá.',ask:{q:'Qual é a frequência?',a:220,u:'Hz'}},
 {txt:'No 2º harmônico cabem duas meias ondas: λ = 0,65 m e f = <b>440 Hz</b>, uma oitava acima.',ask:{q:'Qual é a frequência do 2º harmônico?',a:440,u:'Hz'},set:{n:2},ate:3}]};

LX.espectro.jor=[
 {t:'cena',h:'Tudo é a mesma coisa',p:`<p>O sinal do celular, o forno de micro-ondas, o controle remoto, a luz do Sol e o raio X do hospital parecem coisas totalmente diferentes.</p><p>Mas são <b>a mesma coisa</b>: ondas eletromagnéticas. Só muda o comprimento de onda.</p>`},
 {t:'lab',sim:'spectrum',cfg:{x:0},p:'A régua vai de ondas de 1 km (rádio) até 1 pm (gama). <b>Desafio:</b> encontre a <b>luz visível</b>.',goal:s=>s.p.x<=Math.log10(700e-9)&&s.p.x>=Math.log10(400e-9),ok:'É uma faixa minúscula, de 400 a 700 nm. Todo o resto do espectro é invisível para nós.',dica:'Fica perto de 1 μm (um milésimo de milímetro).'},
 {t:'lab',sim:'spectrum',cfg:{x:0},p:'<b>Desafio:</b> agora encontre a onda do forno de <b>micro-ondas</b>, com cerca de 12 cm.',goal:s=>{ const l=10**s.p.x; return l>.1&&l<.15; },ok:'12 cm: o tamanho de um palmo. As micro-ondas agitam as moléculas de água da comida.',dica:'Fica entre 1 mm e 1 m. Use o botão "Micro-ondas" se quiser conferir.'},
 {t:'q',q:'Andando do rádio para os raios gama, a frequência…',o:['aumenta, e o comprimento de onda diminui','diminui','fica igual'],why:'Todas viajam à mesma velocidade c. Comprimento menor exige frequência maior.'},
 {t:'deduz',p:'Use a equação das ondas.',linhas:[
   {txt:'Toda onda eletromagnética viaja a c = 3×10⁸ m/s no vácuo, então c = ___',o:['λ·f','λ/f','f/λ']},
   {txt:'Se o comprimento de onda cai pela metade, a frequência ___',o:['dobra','cai pela metade','não muda']}],fim:'c = λ·f = 3×10⁸ m/s'},
 {t:'q',q:'Por que ultravioleta e raios X são perigosos e as ondas do celular não?',o:['a energia de cada fóton cresce com a frequência','os raios X são mais rápidos','o celular não emite ondas'],why:'Fótons de alta frequência têm energia para quebrar moléculas do DNA. Os de rádio e micro-ondas, não.'},
 {t:'n',q:'Uma rádio FM transmite em 90 MHz (9×10⁷ Hz). Qual é o comprimento de onda? (c = 3×10⁸ m/s)',a:3e8/9e7,u:'m',why:'λ = 3×10⁸ / 9×10⁷ ≈ 3,3 m.'},
 {t:'mundo',h:'O espectro na sua volta',itens:[['Controle remoto','Pisca em infravermelho: aponte para a câmera do celular e veja.'],['Protetor solar','Bloqueia o ultravioleta.'],['Raio X','Atravessa a pele mas é barrado pelos ossos.']]}];
LX.espectro.exa={q:'Um forno de micro-ondas funciona em <b>2,45 GHz</b>. Qual é o comprimento das ondas? (c = 3×10⁸ m/s)',sim:'spectrum',set:{x:Math.log10(530e-9)},ty:999,passos:[
 {txt:'Em hertz: 2,45 GHz = <b>2,45×10⁹ Hz</b>.',ask:{q:'Qual é o expoente? (2,45 × 10^?)',a:9}},
 {txt:'λ = c/f = 3×10⁸ / 2,45×10⁹ ≈ <b>0,12 m = 12 cm</b>. Veja onde isso fica na régua.',ask:{q:'Qual é o comprimento de onda, em metros?',a:.1224,u:'m',tol:.03},set:{x:Math.log10(.1224)}},
 {txt:'Cada fóton dessa onda tem pouquíssima energia (10⁻⁵ eV): esquenta a água, mas não danifica moléculas.'}]};

LX.espelhos.jor=[
 {t:'cena',h:'A colher',p:`<p>Olhe-se numa colher brilhante. Pelo lado de dentro (côncavo) você aparece <b>de cabeça para baixo</b>. Pelo lado de fora (convexo), <b>direito e pequenininho</b>.</p><p>O formato do espelho decide como os raios de luz se cruzam.</p>`},
 {t:'lab',sim:'mirror',p:'Espelho côncavo, vela longe (25 cm). A imagem é real e invertida. <b>Desafio:</b> aproxime a vela até a imagem ficar <b>direita</b>.',goal:s=>s.p.t==='c'&&s.p.p<s.p.f,ok:'Dentro do foco, a imagem fica <b>direita e maior</b>, atrás do espelho (virtual). É o espelho de maquiagem.',dica:'Leve a vela para mais perto que o foco F.'},
 {t:'lab',sim:'mirror',p:'<b>Desafio:</b> faça a imagem ficar do <b>mesmo tamanho</b> da vela.',goal:s=>s.p.t==='c'&&Math.abs(s.p.p-2*s.p.f)<1e-9,ok:'No centro de curvatura C (p = 2f): imagem invertida, do mesmo tamanho, no mesmo lugar do objeto.',dica:'Coloque a vela exatamente no ponto C.'},
 {t:'medir',sim:'mirror',cfg:{p:30},p:'Côncavo com f = 10 cm. Anote a posição da vela e a da imagem para <b>quatro posições</b> além do foco.',rec:s=>{ const r=lensImg(s); return s.p.t==='c'&&s.p.f===10&&s.p.p>10&&r?[s.p.p,r.pi]:null; },recMsg:'Use o espelho côncavo com f = 10 cm e a vela além de 10 cm.',cols:['vela p (cm)','imagem p\' (cm)'],need:4,dec:1,
  depois:{q:'Quanto mais perto do foco está a vela, a imagem…',o:['vai para mais longe e fica maior','chega mais perto','não muda'],why:'É o princípio do projetor: objeto pouco além do foco, imagem grande e longe.'}},
 {t:'lab',sim:'mirror',p:'<b>Desafio:</b> troque para o espelho <b>convexo</b> e ponha a vela a 40 cm.',goal:s=>s.p.t==='v'&&s.p.p===40,ok:'No convexo a imagem é sempre <b>direita, menor e virtual</b>: o espelho mostra uma área grande. É o espelho de garagem e o retrovisor.',dica:'Mude o tipo de espelho e a distância.'},
 {t:'deduz',p:'A equação dos espelhos (Gauss) liga f, p e p\': 1/f = 1/p + 1/p\'. Teste com f = 10 cm e p = 30 cm.',linhas:[
   {txt:'1/p\' = 1/10 − 1/30 = ___',o:['2/30','1/20','1/40']},
   {txt:'Então p\' = ___',o:['15 cm','20 cm','30 cm']},
   {txt:'Aumento: A = −p\'/p = ___',o:['−0,5 (invertida, metade do tamanho)','0,5','−2']}],fim:frac('1','f')+' = '+frac('1','p')+' + '+frac('1','p\'')+'      A = −'+frac('p\'','p')},
 {t:'n',q:'Um espelho côncavo tem f = 20 cm. Um objeto está a 60 cm dele. A que distância se forma a imagem?',a:30,u:'cm',why:'1/p\' = 1/20 − 1/60 = 2/60 → p\' = 30 cm (real, invertida, com metade do tamanho).'},
 {t:'mundo',h:'Espelhos na sua volta',itens:[['Retrovisor','Convexo: mostra uma área maior, mas os carros parecem mais longe.'],['Farol do carro','A lâmpada fica no foco de um espelho côncavo e o feixe sai paralelo.'],['Antena parabólica','Junta as ondas do satélite no foco.']]}];
LX.espelhos.exa={q:'Uma vela está a <b>30 cm</b> de um espelho côncavo de distância focal <b>10 cm</b>. Onde se forma a imagem e como ela é?',sim:'mirror',set:{t:'c',f:10,p:30},ty:999,passos:[
 {txt:'Equação de Gauss: 1/p\' = 1/f − 1/p = 1/10 − 1/30 = 2/30.'},
 {txt:'<b>p\' = 15 cm</b>, na frente do espelho: imagem real (pode ser projetada numa tela).',ask:{q:'A que distância se forma a imagem?',a:15,u:'cm'}},
 {txt:'Aumento: A = −15/30 = <b>−0,5</b>: invertida e com metade do tamanho.',ask:{q:'Qual é o aumento A?',a:-.5}}]};

LX.refracao.jor=[
 {t:'cena',h:'O canudo quebrado',p:`<p>Um canudo dentro de um copo d'água parece <b>quebrado</b> na superfície. E a piscina parece mais rasa do que é.</p><p>A luz muda de direção quando passa de um meio para outro: é a <b>refração</b>.</p>`},
 {t:'lab',sim:'refr',p:'Um laser passa do ar para a água. <b>Desafio:</b> faça o raio entrar na água <b>sem desviar</b>.',goal:s=>s.p.a===0&&s.p.n1===1&&s.p.n2===1.33,ok:'Entrando perpendicular à superfície (θ = 0°), a luz não desvia. O desvio só aparece quando ela chega inclinada.',dica:'Mude o ângulo de incidência.'},
 {t:'medir',sim:'refr',p:'Do ar para a água: anote o <b>seno</b> do ângulo de entrada e o do ângulo de saída para <b>quatro ângulos</b>. (A tabela calcula os senos para você.)',rec:s=>s.p.n1===1&&s.p.n2===1.33&&s.p.a>0?[Math.sin(s.p.a*Math.PI/180),Math.sin(s.p.a*Math.PI/180)/1.33]:null,recMsg:'Use ar em cima, água embaixo e um ângulo maior que zero.',key:s=>[s.p.a],cols:['sen θ₁','sen θ₂'],need:4,dec:3,
  depois:{q:'Divida sen θ₂ por sen θ₁ em cada linha. O resultado…',o:['é sempre o mesmo (≈ 0,75 = 1/1,33)','muda muito','é sempre 1'],why:'É uma reta pela origem. A razão entre os senos é fixa para cada par de meios: a lei de Snell.'}},
 {t:'deduz',p:'Cada meio tem um índice de refração n (ar 1, água 1,33, vidro 1,5).',linhas:[
   {txt:'A tabela mostrou sen θ₂ = sen θ₁/1,33. Com n₁ = 1 e n₂ = 1,33: n₁·sen θ₁ = ___',o:['n₂·sen θ₂','n₂/sen θ₂','sen θ₂']}],fim:'n₁·sen θ₁ = n₂·sen θ₂   (lei de Snell)'},
 {t:'lab',sim:'refr',p:'Agora a luz sai da água para o ar. <b>Desafio:</b> encontre um ângulo em que ela <b>não consegue sair</b>.',goal:s=>s.p.n1===1.33&&s.p.n2===1&&1.33*Math.sin(s.p.a*Math.PI/180)>1,ok:'Acima de uns 49°, a luz é toda refletida: <b>reflexão total</b>. É assim que a luz fica presa dentro da fibra óptica.',dica:'Ponha água em cima e ar embaixo, e aumente o ângulo.'},
 {t:'q',q:'Por que o diamante brilha tanto?',o:['tem índice de refração altíssimo: a luz sofre reflexão total várias vezes lá dentro antes de sair','porque é duro','porque é caro'],why:'Com n = 2,42, o ângulo limite é só 24°: a luz fica "presa" e sai concentrada pelas faces de cima.'},
 {t:'n',q:'Um raio passa do ar para a água (n = 1,33) com 30° de incidência. Qual é o seno do ângulo de refração? (sen 30° = 0,5)',a:.5/1.33,u:'',why:'sen θ₂ = 1 × 0,5/1,33 ≈ 0,376, o que dá θ₂ ≈ 22°: o raio se aproxima da normal.',dica:'Use n₁·sen θ₁ = n₂·sen θ₂.'},
 {t:'mundo',h:'Refração na sua volta',itens:[['Fibra óptica','A internet viaja como luz presa por reflexão total.'],['Arco-íris','Cada cor refrata um pouco diferente nas gotas de chuva.'],['Miragem no asfalto','Camadas de ar quente desviam a luz do céu, que parece água no chão.']]}];
LX.refracao.exa={q:'Um laser passa do ar para a água (n = 1,33) fazendo <b>30°</b> com a normal. Qual é o ângulo dentro da água? (sen 30° = 0,5)',sim:'refr',set:{n1:1,n2:1.33,a:30},ty:999,passos:[
 {txt:'Lei de Snell: 1 × sen 30° = 1,33 × sen θ₂.'},
 {txt:'sen θ₂ = 0,5/1,33 ≈ <b>0,376</b>.',ask:{q:'Quanto vale sen θ₂?',a:.376,tol:.02}},
 {txt:'θ₂ ≈ <b>22°</b>: o raio se aproxima da normal, porque a água é mais refringente que o ar.',ask:{q:'Qual é o ângulo θ₂, aproximadamente? (em graus)',a:22.08,u:'°',tol:.04}}]};

LX.lentes.jor=[
 {t:'cena',h:'Lupa, câmera e óculos',p:`<p>Com uma lupa, letras pequenas ficam enormes. Com a mesma lupa ao sol, dá para concentrar a luz num ponto e queimar um papel.</p><p>A câmera do celular e o seu olho também têm lentes. Elas desviam a luz por refração para formar imagens.</p>`},
 {t:'lab',sim:'lens',p:'Lente convergente, vela a 25 cm. <b>Desafio:</b> forme uma imagem <b>invertida e do mesmo tamanho</b> da vela.',goal:s=>s.p.t==='c'&&Math.abs(s.p.p-2*s.p.f)<1e-9,ok:'Com a vela a 2f (o dobro da distância focal), a imagem real se forma a 2f do outro lado, do mesmo tamanho.',dica:'Ponha a vela a uma distância igual a duas vezes f.'},
 {t:'lab',sim:'lens',p:'<b>Desafio:</b> use a lente como <b>lupa</b>: imagem direita e maior.',goal:s=>s.p.t==='c'&&s.p.p<s.p.f,ok:'Com o objeto entre a lente e o foco, a imagem é virtual, direita e ampliada. É a lupa.',dica:'Aproxime a vela da lente, mais perto que o foco.'},
 {t:'medir',sim:'lens',cfg:{p:30},p:'Convergente com f = 10 cm. Anote p e p\' para <b>quatro posições</b> da vela além do foco.',rec:s=>{ const r=lensImg(s); return s.p.t==='c'&&s.p.f===10&&s.p.p>10&&r?[s.p.p,r.pi]:null; },recMsg:'Use a lente convergente com f = 10 cm e a vela além de 10 cm.',cols:['vela p (cm)','imagem p\' (cm)'],need:4,dec:1,
  depois:{q:'Com a vela muito longe, onde fica a imagem?',o:['perto do foco do outro lado','muito longe também','sobre a lente'],why:'Raios de objetos distantes chegam quase paralelos e se juntam no foco. É assim que a lupa queima o papel com a luz do Sol.'}},
 {t:'deduz',p:'A vergência V mede o "grau" da lente: V = 1/f, com f em metros. A unidade é a dioptria (di), o "grau" dos óculos.',linhas:[
   {txt:'Uma lente com f = 50 cm tem V = 1/0,5 = ___',o:['2 di','0,5 di','50 di']},
   {txt:'Lentes divergentes têm f negativo. Uma lente de −2 di tem f = ___',o:['−50 cm','−2 m','−0,2 cm']}],fim:'V = '+frac('1','f')+'   (f em metros)'},
 {t:'q',q:'Uma pessoa míope vê mal de longe, porque o olho forma a imagem antes da retina. A lente que corrige é…',o:['divergente (grau negativo)','convergente','qualquer uma'],why:'A divergente "abre" os raios, empurrando a imagem para trás, até a retina.'},
 {t:'n',q:'Uma lupa tem f = 10 cm, e você a usa a 5 cm de uma letra. Qual é o aumento? (1/p\' = 1/f − 1/p; A = −p\'/p)',a:2,u:'vezes',why:'1/p\' = 1/10 − 1/5 = −1/10 → p\' = −10 cm (virtual). A = −(−10)/5 = 2: a letra parece duas vezes maior.',dica:'p\' vai dar negativo: imagem virtual.'},
 {t:'mundo',h:'Lentes na sua volta',itens:[['Câmera do celular','A lente forma uma imagem real, invertida e pequena sobre o sensor.'],['Olho humano','O cristalino muda de formato para focar perto e longe.'],['Projetor','Objeto pouco além do foco: imagem real, enorme e longe, na parede.']]}];
LX.lentes.exa={q:'Você usa uma lupa de distância focal <b>10 cm</b> a <b>5 cm</b> de uma letra. Onde se forma a imagem? Quantas vezes maior a letra parece?',sim:'lens',set:{t:'c',f:10,p:5},ty:999,passos:[
 {txt:'1/p\' = 1/f − 1/p = 1/10 − 1/5 = −1/10.'},
 {txt:'<b>p\' = −10 cm</b>: o sinal negativo diz que a imagem é virtual, do mesmo lado da letra (é para onde você olha através da lupa).',ask:{q:'Qual é a posição da imagem p\'? (com sinal)',a:-10,u:'cm'}},
 {txt:'Aumento: A = −p\'/p = −(−10)/5 = <b>2</b>: direita e duas vezes maior.',ask:{q:'Qual é o aumento?',a:2}}]};
