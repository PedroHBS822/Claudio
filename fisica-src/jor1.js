/* =====================================================================
   Jornadas de descoberta — Ferramentas, Cinemática e Dinâmica
   ===================================================================== */
const eq=(a,b,t=1e-6)=>Math.abs(a-b)<=t;

LX.grandezas.jor=[
 {t:'cena',h:'80 o quê?',p:`<p>Uma placa na estrada diz <b>"Velocidade máxima 80"</b>. Um turista americano pergunta: 80 o quê? Milhas por hora? Metros por segundo?</p><p>Na física, um número sozinho não diz nada. Toda medida precisa de duas partes: <b>o número e a unidade</b>.</p>`},
 {t:'q',q:'Qual destas informações está completa?',o:['O carro anda a 20 m/s','O carro anda a 20','A distância até lá é grande','Moro a 5 da escola'],why:'"20 m/s" diz quanto e em que unidade: 20 metros a cada segundo.',w:['20 o quê? Pode ser 20 km/h, 20 m/s…','"Grande" não é uma medida: não tem número nem unidade.','5 o quê? Minutos? Quilômetros? Quarteirões?']},
 {t:'lab',sim:'conv',p:'O carro percorre uma pista de 100 m, e uma marca aparece a cada segundo. <b>Desafio:</b> coloque a velocidade em <b>36 km/h</b>, dê play e veja quantos metros ele anda em cada segundo.',goal:s=>s.p.v===36&&s.marks.length>=1,ok:'A 36 km/h, o carro anda <b>10 metros a cada segundo</b>. Em m/s, 36 km/h são só 10.',dica:'Arraste o controle "Velocidade" até 36 e aperte "Iniciar".'},
 {t:'medir',sim:'conv',p:'Faça o carro andar com <b>três velocidades diferentes</b>. Depois que aparecer a primeira marca de 1 s, aperte "Anotar medida".',rec:s=>s.marks.length>=1?[s.p.v,s.p.v/3.6]:null,recMsg:'Dê play e espere a primeira marca de 1 segundo aparecer.',cols:['km/h','metros por segundo'],need:3,dec:2,
  depois:{q:'Compare as duas colunas. Para passar de km/h para metros por segundo, o que você faz com o número?',o:['divide por 3,6','divide por 60','multiplica por 3,6','divide por 1000'],why:'Em todas as linhas, a segunda coluna é a primeira dividida por 3,6. Por que 3,6? Vamos descobrir.',w:['Teste: 36 ÷ 60 = 0,6, mas a tabela diz 10.','Multiplicar deixaria o número maior, e a tabela mostra números menores.','36 ÷ 1000 = 0,036, e a tabela diz 10.']}},
 {t:'deduz',p:'De onde vem o 3,6? Complete cada linha.',linhas:[
   {txt:'1 km = ___ m',o:['1000','100','60'],why:'Quilo quer dizer mil.'},
   {txt:'1 hora = ___ segundos',o:['3600','60','100'],why:'60 minutos × 60 segundos.'},
   {txt:'Então 1 km/h = 1000 m em 3600 s = ___ m/s',o:['1000/3600','3600/1000','1000 × 3600'],why:'Metros divididos por segundos.'},
   {txt:'E 1000/3600 = 1/___',o:['3,6','36','60'],why:'Divida em cima e embaixo por 1000.'}],fim:'v<sub class="up">(m/s)</sub> = v<sub class="up">(km/h)</sub> ÷ 3,6'},
 {t:'n',q:'Um velocista olímpico corre 100 m em 10 s, ou seja, 10 m/s. Quanto é isso em km/h?',a:36,u:'km/h',why:'Para voltar de m/s para km/h, faça o caminho contrário: 10 × 3,6 = 36 km/h. É a velocidade de um carro na rua!',dica:'De m/s para km/h, o número tem de ficar maior.'},
 {t:'mundo',h:'Unidades na sua volta',itens:[['Velocímetro','Os carros mostram km/h, mas as contas de física usam m/s. 72 km/h = 20 m/s.'],['Previsão do tempo','Vento de 36 km/h é o mesmo que 10 m/s. O ar em volta de você anda 10 metros por segundo.'],['Receita de bolo','"2 xícaras" é uma medida com unidade. "2" sozinho estragaria o bolo.'],['Conta de luz','Vem em kWh, uma unidade de energia que você vai conhecer mais adiante.']]}];

LX.potencias.jor=[
 {t:'cena',h:'Números grandes demais',p:`<p>Seu coração bate cerca de <b>3 000 000 000</b> de vezes numa vida. Um vírus mede <b>0,0000001</b> metro. Contar zeros assim é pedir para errar.</p><p>A saída é contar <b>quantas vezes multiplicamos por 10</b>.</p>`},
 {t:'q',q:'Quantos zeros tem 3 bilhões (3 000 000 000)?',o:['9','6','12','3'],why:'3 bilhões = 3 × 1 000 000 000 = 3 × 10⁹. O expoente conta os zeros.',w:['6 zeros é um milhão.','12 zeros é um trilhão.','Conte de novo, de três em três.']},
 {t:'lab',sim:'pow10',p:'Na régua, cada tracinho é <b>10 vezes</b> maior que o anterior. <b>Desafio:</b> ande até o <b>grão de areia</b>.',goal:s=>s.p.e===-3,ok:'O grão de areia tem cerca de 10⁻³ m, um milímetro. O expoente negativo quer dizer "dividido por 10 três vezes".',dica:'Os objetos pequenos ficam à esquerda, com expoentes negativos.'},
 {t:'q',q:'Do grão de areia (10⁻³ m) até uma criança (10⁰ = 1 m) são 3 tracinhos. A criança é quantas vezes maior?',o:['1000 vezes','3 vezes','30 vezes','300 vezes'],why:'Cada tracinho multiplica por 10: 10 × 10 × 10 = 1000.',w:['Cada tracinho é "vezes 10", não "mais 1".','3 tracinhos multiplicam por 10 três vezes.','3 tracinhos multiplicam por 10 três vezes.']},
 {t:'deduz',p:'Como multiplicar potências de 10 sem contar zero por zero?',linhas:[
   {txt:'10² × 10³ = (10·10) × (10·10·10) = 10^___',o:['5','6','1'],why:'Juntou 2 + 3 fatores de 10.'},
   {txt:'Então, para multiplicar potências de 10, ___ os expoentes.',o:['somamos','multiplicamos','subtraímos']},
   {txt:'10⁵ ÷ 10² = (10·10·10·10·10) ÷ (10·10) = 10^___',o:['3','7','2,5'],why:'Dois 10 de cima cancelam com os de baixo.'},
   {txt:'Para dividir, ___ os expoentes.',o:['subtraímos','dividimos','somamos']}],fim:'10<sup>m</sup> × 10<sup>n</sup> = 10<sup>m+n</sup>      10<sup>m</sup> ÷ 10<sup>n</sup> = 10<sup>m−n</sup>'},
 {t:'n',q:'Estime quantos segundos há em um ano: 365 × 24 × 3600 ≈ 3,2 × 10^?. Responda o expoente.',a:7,why:'365 × 24 × 3600 = 31 536 000 ≈ 3,2 × 10⁷ segundos.',dica:'Faça a conta e conte as casas até sobrar um algarismo antes da vírgula.'},
 {t:'mundo',h:'Potências de 10 na sua volta',itens:[['Celular de 128 GB','Guarda cerca de 1,28 × 10¹¹ bytes. "Giga" = 10⁹.'],['Fio de cabelo','Mede uns 10⁻⁴ m: um décimo de milímetro.'],['Distância até o Sol','1,5 × 10¹¹ m. A luz leva 8 minutos para chegar.'],['Remédio','Doses em mg: mili = 10⁻³ grama.']]}];

LX.vetores.jor=[
 {t:'cena',h:'Andou 7, está a 5',p:`<p>Você sai de casa e anda <b>3 quarteirões para leste</b> e depois <b>4 para o norte</b>. O aplicativo de mapa diz que você está a <b>5 quarteirões</b> de casa, em linha reta.</p><p>Mas você andou 7! Quem está certo?</p>`},
 {t:'lab',sim:'vec',p:'Cada seta é um deslocamento. <b>Desafio:</b> arraste as pontas até A = (3, 0), 3 para leste, e B = (0, 4), 4 para o norte.',goal:s=>s.p.m==='s'&&eq(s.A[0],3)&&eq(s.A[1],0)&&eq(s.B[0],0)&&eq(s.B[1],4),ok:'A resultante R, do começo ao fim, mede <b>5</b>. O aplicativo estava certo.',dica:'Arraste a bolinha azul até x = 3 no eixo horizontal; depois a vermelha até ficar 4 quadrinhos acima dela.'},
 {t:'q',q:'Por que a distância final é 5 e não 3 + 4 = 7?',o:['porque os dois deslocamentos são perpendiculares e formam um triângulo retângulo','porque o aplicativo arredonda','porque vetores nunca se somam','porque andar para o norte é subida'],why:'O caminho andado (7) é diferente da distância em linha reta (5). Os dois deslocamentos são os lados de um triângulo retângulo, e a resultante é a hipotenusa.'},
 {t:'lab',sim:'vec',p:'<b>Desafio:</b> agora faça a resultante R ficar <b>zero</b>, com A diferente de zero.',goal:s=>{ const B=s.p.m==='s'?s.B:[-s.B[0],-s.B[1]]; return Math.hypot(s.A[0],s.A[1])>.1&&Math.hypot(s.A[0]+B[0],s.A[1]+B[1])<1e-6; },ok:'Dois vetores de mesmo tamanho e sentidos opostos se anulam. É o cabo de guerra empatado: muita força, nenhum movimento.',dica:'Faça B apontar exatamente para o lado contrário de A, com o mesmo tamanho: a ponta de B tem de voltar à origem.'},
 {t:'deduz',p:'Com A e B perpendiculares, como calcular R sem desenhar?',linhas:[
   {txt:'A e B são os catetos, e R é a ___ do triângulo.',o:['hipotenusa','altura','base']},
   {txt:'Pelo teorema de Pitágoras, R² = ___',o:['3² + 4²','3 + 4','4² − 3²']},
   {txt:'R² = 9 + 16 = 25, então R = ___',o:['5','25','12,5']}],fim:'|R| = √(R<sub class="up">x</sub>² + R<sub class="up">y</sub>²)'},
 {t:'n',q:'Um barco atravessa um rio a 4 m/s para a frente enquanto a correnteza o leva a 3 m/s rio abaixo, perpendicularmente. Qual é a velocidade real do barco?',a:5,u:'m/s',why:'As velocidades também são vetores: √(4² + 3²) = 5 m/s.',dica:'Mesmo triângulo 3, 4, 5.'},
 {t:'mundo',h:'Vetores na sua volta',itens:[['GPS','"Em linha reta" é o módulo da resultante; o trajeto pelas ruas é a soma dos caminhos.'],['Avião com vento lateral','O piloto aponta o nariz um pouco contra o vento para que a resultante siga a rota.'],['Cabo de guerra','Forças opostas se subtraem: ganha quem puxa mais.']]}];

LX.mu.jor=[
 {t:'cena',h:'O carro no piloto automático',p:`<p>Na estrada, o carro ao lado anda no <b>piloto automático</b>: o velocímetro não muda. Onde ele estará daqui a 1 minuto? E daqui a um tempo qualquer?</p><p>Vamos medir e descobrir a regra.</p>`},
 {t:'medir',sim:'mov',cfg:{acc:false},p:'Deixe <b>s₀ = 0</b> e <b>v₀ = 8 m/s</b>. Dê play, <b>pause</b> em momentos diferentes e anote o tempo e a posição. Depois continue e anote de novo.',rec:s=>s.t>.2&&s.p.s0===0&&s.p.v0===8?[s.t,s.x]:null,recMsg:'Use s₀ = 0 e v₀ = 8 m/s, dê play e pause em algum momento.',cols:['tempo (s)','posição (m)'],need:4,dec:1,
  depois:{q:'Olhe a tabela e o gráfico. O que acontece a cada segundo?',o:['o carro anda sempre os mesmos 8 metros','o carro anda cada vez mais','o carro anda cada vez menos'],why:'Os pontos formam uma <b>reta</b>: distâncias iguais em tempos iguais. Esse é o <b>movimento uniforme</b>.'}},
 {t:'deduz',p:'Transforme o que você mediu numa regra.',linhas:[
   {txt:'A cada 1 s, o carro anda v metros. Em 2 s, anda ___',o:['2·v','v²','v/2']},
   {txt:'Em t segundos, anda ___',o:['v·t','v/t','v + t']},
   {txt:'Se ele partiu da posição s₀, depois de t segundos está em s = ___',o:['s₀ + v·t','v·t − s₀','s₀·v·t']}],fim:'s = s₀ + v·t      v = '+frac('Δs','Δt')},
 {t:'lab',sim:'mov',cfg:{acc:false},p:'<b>Desafio:</b> escolha s₀ e v₀ para o carro terminar <b>exatamente em 50 m</b> depois de 10 segundos. Dê play e deixe chegar ao fim.',goal:s=>s.t>=10&&eq(s.p.s0+s.p.v0*10,50),ok:'Qualquer escolha em que s₀ + 10·v = 50 funciona: 0 e 5 m/s, 20 e 3 m/s, −10 e 6 m/s… A fórmula prevê onde o carro vai estar.',dica:'Use a fórmula ao contrário. Com s₀ = 0, qual v faz v·10 = 50?'},
 {t:'q',q:'No gráfico posição × tempo, o que a inclinação da reta mostra?',o:['a velocidade','a posição inicial','o tempo total'],why:'Reta mais inclinada = mais metros por segundo = mais velocidade. Reta deitada = carro parado.'},
 {t:'n',q:'O carro do piloto automático anda a 20 m/s. Quantos metros ele percorre em 1 minuto?',a:1200,u:'m',why:'1 min = 60 s; Δs = v·t = 20 × 60 = 1200 m.',dica:'Passe o minuto para segundos antes.'},
 {t:'mundo',h:'Movimento uniforme na sua volta',itens:[['Esteira do aeroporto','Anda sempre na mesma velocidade: você pode calcular quando chega ao fim.'],['Luz do Sol','Viaja a velocidade constante e leva cerca de 8 minutos para chegar até você.'],['Escada rolante','Velocidade constante. Se você andar em cima dela, as velocidades se somam.']]}];

LX.muv.jor=[
 {t:'cena',h:'O semáforo abriu',p:`<p>O semáforo abre e o carro arranca: o velocímetro vai subindo, <b>0, 7, 14, 21 km/h…</b> a cada segundo.</p><p>Agora a velocidade <b>muda</b>. Como prever onde o carro vai estar?</p>`},
 {t:'medir',sim:'mov',cfg:{acc:true},p:'Coloque <b>v₀ = 0</b> e <b>a = 2 m/s²</b>. Dê play, pause em momentos diferentes e anote o tempo e a <b>velocidade</b>.',rec:s=>s.t>.2&&s.p.v0===0&&s.p.a===2?[s.t,s.v]:null,recMsg:'Use v₀ = 0 e a = 2 m/s², dê play e pause em algum momento.',cols:['tempo (s)','velocidade (m/s)'],need:4,dec:1,
  depois:{q:'O que acontece com a velocidade a cada segundo?',o:['aumenta sempre os mesmos 2 m/s','dobra a cada segundo','fica constante'],why:'A velocidade cresce em linha reta: ganha 2 m/s por segundo. Esse "ganho por segundo" é a <b>aceleração</b>.'}},
 {t:'deduz',p:'Primeiro, a velocidade.',linhas:[
   {txt:'Em cada segundo o carro ganha a. Em t segundos, ganhou ___',o:['a·t','a/t','a + t']},
   {txt:'Se já tinha v₀ no começo: v = ___',o:['v₀ + a·t','a·t − v₀','v₀·a·t']}],fim:'v = v₀ + a·t'},
 {t:'nota',h:'E a distância?',p:`<p>Com velocidade constante, a distância era v·t: a <b>área de um retângulo</b> no gráfico velocidade × tempo (altura v, base t).</p><p>Essa ideia continua valendo: a distância percorrida é sempre a <b>área embaixo da linha</b> do gráfico v × t. Só que agora a linha é inclinada.</p>`},
 {t:'deduz',p:'Partindo do repouso, a linha v × t forma um triângulo de base t e altura a·t.',linhas:[
   {txt:'A área de um triângulo é base × altura ÷ 2 = ___',o:['a·t²/2','a·t','a·t²']},
   {txt:'Se o carro já tinha v₀, soma-se um retângulo de área v₀·t. Então Δs = ___',o:['v₀·t + a·t²/2','v₀ + a·t','a·t²/2 − v₀']}],fim:'s = s₀ + v₀·t + '+frac('a·t²','2')},
 {t:'q',q:'Partindo do repouso, se o tempo dobra, a distância percorrida…',o:['quadruplica','dobra','fica igual','triplica'],why:'O tempo aparece ao quadrado: (2t)² = 4t². Por isso, na freada, o dobro da velocidade exige muito mais espaço.'},
 {t:'lab',sim:'mov',cfg:{acc:true},p:'<b>Desafio:</b> o carro começa a <b>10 m/s</b> e freia. Escolha a aceleração para ele <b>parar exatamente em t = 5 s</b>. Dê play e deixe passar dos 5 s.',goal:s=>s.p.v0===10&&s.p.a===-2&&s.t>=5,ok:'a = −2 m/s²: perde 2 m/s por segundo e zera em 5 s. Frear é acelerar no sentido contrário ao movimento. (Depois dos 5 s ele começaria a andar de ré, porque a aceleração continua.)',dica:'Use v = v₀ + a·t com v = 0: 0 = 10 + a·5.'},
 {t:'n',q:'Um carro a 30 m/s freia com aceleração de −5 m/s². Em quantos segundos ele para?',a:6,u:'s',why:'0 = 30 − 5·t → t = 6 s.',dica:'Parar é v = 0. Use v = v₀ + a·t.'},
 {t:'mundo',h:'Aceleração na sua volta',itens:[['Arrancada no semáforo','Um carro comum chega a 100 km/h em uns 10 s: a ≈ 2,8 m/s².'],['Freada de emergência','Com o dobro da velocidade, o carro precisa de quatro vezes mais distância para parar.'],['Decolagem','O avião acelera na pista até atingir a velocidade de voo.']]}];

LX.queda.jor=[
 {t:'cena',h:'O livro e a folha',p:`<p>Solte um livro e uma folha de papel da mesma altura: o livro chega bem antes. Agora <b>amasse a folha</b> numa bolinha e repita. Chegam quase juntos!</p><p>O que atrapalhava a folha era o <b>ar</b>. E sem ar nenhum?</p>`},
 {t:'lab',sim:'fall',p:'Aqui as bolas caem no <b>vácuo</b>. Uma tem 10 kg e a outra, 0,1 kg: cem vezes menos. <b>Desafio:</b> solte as duas na Terra e veja quem chega primeiro.',goal:s=>s.t>=s.T,ok:'Chegaram <b>juntas</b>. Sem o ar, a massa não muda a queda. Galileu percebeu isso há 400 anos.',dica:'Aperte "Iniciar" e espere as bolas chegarem ao chão.'},
 {t:'medir',sim:'fall',p:'Solte de novo e <b>pause</b> durante a queda, algumas vezes, anotando o tempo e a velocidade.',rec:s=>s.t>.1&&s.t<s.T&&s.p.g===9.8?[s.t,s.v]:null,recMsg:'Na Terra, dê play e pause durante a queda (antes de chegar ao chão).',cols:['tempo (s)','velocidade (m/s)'],need:3,dec:2,
  depois:{q:'Quanto a velocidade aumenta a cada segundo?',o:['cerca de 10 m/s','cerca de 1 m/s','depende do tamanho da bola'],why:'Aumenta 9,8 m/s por segundo, que arredondamos para 10: é a <b>aceleração da gravidade g</b>. A velocidade cresce em linha reta, como no carro que arranca.'}},
 {t:'q',q:'Então a queda livre é qual movimento que você já conhece?',o:['movimento uniformemente variado, com a = g','movimento uniforme','movimento circular'],why:'É um MUV que parte do repouso, com aceleração g. Todas as fórmulas do MUV valem, trocando a por g.'},
 {t:'deduz',p:'Adapte as fórmulas do MUV para uma queda que parte do repouso.',linhas:[
   {txt:'v = v₀ + a·t, com v₀ = 0 e a = g: v = ___',o:['g·t','g/t','g + t']},
   {txt:'Δs = v₀·t + a·t²/2 vira a altura caída: h = ___',o:['g·t²/2','g·t','g·t²']}],fim:'v = g·t      h = '+frac('g·t²','2')},
 {t:'lab',sim:'fall',p:'<b>Desafio:</b> leve a experiência para a <b>Lua</b> e solte da mesma altura.',goal:s=>s.p.g===1.6&&s.t>=s.T,ok:'Na Lua, g = 1,6 m/s², seis vezes menor: a queda demora bem mais. Em 1971 um astronauta soltou um martelo e uma pena lá, e eles chegaram juntos.',dica:'Em "Onde?", escolha Lua e aperte "Iniciar".'},
 {t:'n',q:'Uma pedra cai de um prédio e leva 3 s para chegar ao chão. Qual é a altura do prédio? (g = 10 m/s²)',a:45,u:'m',why:'h = g·t²/2 = 10 × 9 / 2 = 45 m, mais ou menos um prédio de 15 andares.',dica:'h = g·t²/2. Lembre de elevar o tempo ao quadrado.'},
 {t:'mundo',h:'Queda na sua volta',itens:[['Paraquedas','Aumenta muito a resistência do ar, e a queda deixa de ser livre.'],['Gota de chuva','Se caísse no vácuo, chegaria a mais de 300 km/h. O ar a freia para uns 30 km/h.'],['Salto na piscina','De uma plataforma de 10 m você chega à água a uns 14 m/s, cerca de 50 km/h.']]}];

LX.lancamento.jor=[
 {t:'cena',h:'O chute do goleiro',p:`<p>O goleiro chuta a bola para o meio de campo. Se chutar muito baixo, ela bate logo no chão. Muito alto, sobe e cai perto.</p><p>Existe um <b>ângulo ideal</b> para ir mais longe?</p>`},
 {t:'lab',sim:'proj',cfg:{th:30},p:'<b>Desafio:</b> com 20 m/s, encontre o ângulo que faz a bola ir <b>mais longe</b>. Teste vários ângulos e lance cada um até o fim.',goal:s=>s.p.th===45&&s.p.g===10&&s.tr.length>2&&s.y<=0,ok:'<b>45°</b> dá o maior alcance: 40 m. Menos que isso a bola fica pouco tempo no ar; mais que isso ela sobe demais e anda pouco para a frente.',dica:'Compare o alcance nos números à direita. Experimente valores entre 30° e 60°.'},
 {t:'q',q:'Observe as setas durante o voo. O que acontece com a seta vₓ (horizontal)?',o:['não muda: nada empurra a bola para o lado','diminui até zerar no topo','aumenta na descida'],why:'Sem resistência do ar, nenhuma força age na horizontal. Então, na horizontal, a bola faz <b>movimento uniforme</b>. Só a vertical sente a gravidade.'},
 {t:'nota',h:'Dois movimentos ao mesmo tempo',p:'<p>O truque do lançamento é separar a velocidade em duas partes que não se atrapalham: na <b>horizontal</b>, movimento uniforme; na <b>vertical</b>, a mesma queda livre da lição anterior, só que começando para cima.</p>'},
 {t:'deduz',p:'Monte as regras de cada direção.',linhas:[
   {txt:'Horizontal, velocidade constante: x = ___',o:['vₓ·t','vₓ·t²/2','g·t']},
   {txt:'Vertical, a gravidade freia a subida: v<sub>y</sub> = ___',o:['v₀<sub>y</sub> − g·t','v₀<sub>y</sub> + g·t','g·t']},
   {txt:'No ponto mais alto, v<sub>y</sub> = 0. O tempo de subida é t = ___',o:['v₀<sub>y</sub>/g','g/v₀<sub>y</sub>','v₀<sub>y</sub>·g']},
   {txt:'A descida demora o mesmo que a subida. Tempo total no ar = ___',o:['2·v₀<sub>y</sub>/g','v₀<sub>y</sub>/g','v₀<sub>y</sub>/(2g)']}],fim:'x = vₓ·t      t<sub class="up">voo</sub> = '+frac('2·v₀<sub class="up">y</sub>','g')},
 {t:'q',q:'Com a mesma velocidade de lançamento, 30° e 60° dão alcances…',o:['iguais','30° vai mais longe','60° vai mais longe'],why:'Ângulos que somam 90° dão o mesmo alcance: um fica menos tempo no ar mas corre mais na horizontal, o outro o contrário. Confira no laboratório livre.'},
 {t:'n',q:'Uma bola sai com vₓ = 15 m/s e v₀<sub>y</sub> = 20 m/s. A que distância ela cai? (g = 10 m/s²)',a:60,u:'m',why:'Tempo no ar = 2 × 20/10 = 4 s. Alcance = 15 × 4 = 60 m.',dica:'Primeiro o tempo de voo (2·v₀<sub>y</sub>/g), depois x = vₓ·t.'},
 {t:'mundo',h:'Lançamentos na sua volta',itens:[['Arremesso de basquete','Os bons arremessadores lançam num ângulo alto, perto de 50°, para a bola cair "por cima" do aro.'],['Chafariz','Cada jato de água desenha uma parábola.'],['Salto em distância','Os atletas saem a uns 20°: correr rápido rende mais que subir muito.']]}];

LX.mcu.jor=[
 {t:'cena',h:'Acelerando sem acelerar?',p:`<p>Na roda-gigante você gira com velocidade sempre do mesmo tamanho. Mesmo assim, a física diz que você está <b>acelerando</b> o tempo todo.</p><p>Como pode?</p>`},
 {t:'lab',sim:'mcu',cfg:{force:false},p:'Observe a seta azul, a velocidade. <b>Desafio:</b> faça a bola dar <b>uma volta por segundo</b> (período T = 1 s) e dê play.',goal:s=>eq(s.p.T,1)&&s.playing,ok:'Veja a seta azul: ela tem sempre o mesmo tamanho, mas <b>muda de direção</b> a cada instante.',dica:'Arraste "Período T" até 1 s e aperte "Iniciar".'},
 {t:'q',q:'Velocidade é um vetor. Se a direção dela muda o tempo todo, então…',o:['existe aceleração, mesmo com a velocidade do mesmo tamanho','não existe aceleração, porque o velocímetro não muda','a bola está freando'],why:'Aceleração é qualquer mudança da velocidade, no tamanho <b>ou na direção</b>. No círculo, essa aceleração aponta para o centro: é a <b>aceleração centrípeta</b> (seta roxa).'},
 {t:'deduz',p:'Quanto vale a velocidade na volta?',linhas:[
   {txt:'Numa volta, a bola percorre o comprimento da circunferência: ___',o:['2πR','πR²','R']},
   {txt:'Ela gasta um período T nessa volta. Então v = ___',o:['2πR/T','T/(2πR)','2πR·T']}],fim:'v = '+frac('2πR','T')+'      f = '+frac('1','T')},
 {t:'lab',sim:'mcu',cfg:{force:false},p:'Anote a aceleração centrípeta com R = 1,5 m e T = 2 s. <b>Desafio:</b> depois, mantenha o raio e faça a bola girar com o <b>dobro da velocidade</b>.',goal:s=>eq(s.p.R,1.5)&&eq(s.p.T,1),ok:'Com o dobro da velocidade (T de 2 s para 1 s), a aceleração ficou <b>4 vezes maior</b>: cerca de 59 contra 15 m/s².',dica:'Dobrar a velocidade é dar a volta na metade do tempo.'},
 {t:'q',q:'Dobrar a velocidade quadruplicou a aceleração. Então a aceleração depende de…',o:['v² (a velocidade ao quadrado)','v','da massa da bola'],why:'Com geometria dá para mostrar que a = v²/R. Curva mais fechada (R menor) ou mais rápida pede mais aceleração.'},
 {t:'n',q:'Uma roda-gigante de raio 20 m dá uma volta em 2 minutos (120 s). Qual é a velocidade de quem está nela? (π ≈ 3,14)',a:2*Math.PI*20/120,u:'m/s',why:'v = 2πR/T = 2 × 3,14 × 20 / 120 ≈ 1,05 m/s, um passo lento.',dica:'v = 2πR/T, com T em segundos.'},
 {t:'mundo',h:'Círculos na sua volta',itens:[['Máquina de lavar','Na centrifugação o tambor gira muito rápido; a roupa fica, a água escapa pelos furos.'],['Curva de carro','Numa curva fechada em alta velocidade, a aceleração exigida cresce com v².'],['Relógio de ponteiros','O ponteiro dos segundos tem período de 60 s.']]}];

LX.newton.jor=[
 {t:'cena',h:'O ônibus freou',p:`<p>O ônibus freia de repente e seu corpo vai <b>para a frente</b>. Ninguém empurrou você.</p><p>O que aconteceu?</p>`},
 {t:'q',q:'Por que seu corpo foi para a frente?',o:['ele tendia a continuar andando, e o ônibus parou','o ônibus empurrou você para a frente','o motorista acelerou para trás'],why:'É a <b>inércia</b>: sem força, um corpo mantém o movimento que tinha. O ônibus parou, mas você continuou. Quem faz você parar é o cinto ou a barra onde você se segura.'},
 {t:'medir',sim:'block',cfg:{fric:false},p:'Um bloco sem atrito. Deixe a <b>massa em 5 kg</b>, escolha uma força, dê play e anote. Repita com <b>outras forças</b>.',rec:s=>s.t>.3&&s.p.m===5?[s.p.F,s.p.F/5]:null,recMsg:'Use massa de 5 kg e dê play.',cols:['força (N)','aceleração (m/s²)'],need:3,dec:2,
  depois:{q:'Com a massa fixa, se você dobra a força, a aceleração…',o:['dobra','cai pela metade','não muda'],why:'Os pontos formam uma reta que passa pela origem: aceleração <b>proporcional</b> à força.'}},
 {t:'medir',sim:'block',cfg:{fric:false},p:'Agora deixe a <b>força em 40 N</b> e mude a <b>massa</b>. Dê play e anote a cada massa.',rec:s=>s.t>.3&&s.p.F===40?[s.p.m,40/s.p.m]:null,recMsg:'Use força de 40 N e dê play.',cols:['massa (kg)','aceleração (m/s²)'],need:3,dec:2,
  depois:{q:'Com a força fixa, se você dobra a massa, a aceleração…',o:['cai pela metade','dobra','não muda'],why:'Mais massa, mais difícil de acelerar: a aceleração é <b>inversamente proporcional</b> à massa. Massa mede a inércia.'}},
 {t:'deduz',p:'Junte as duas descobertas.',linhas:[
   {txt:'a cresce com F e diminui com m. Então a = ___',o:['F/m','F·m','m/F']},
   {txt:'Multiplicando os dois lados por m: F = ___',o:['m·a','a/m','m + a']},
   {txt:'Com m em kg e a em m/s², a força sai em newtons: 1 N = 1 kg·___',o:['m/s²','m/s','m']}],fim:'F<sub class="up">R</sub> = m·a'},
 {t:'lab',sim:'block',cfg:{fric:false},p:'<b>Desafio:</b> faça um bloco de <b>10 kg</b> ter aceleração de <b>3 m/s²</b> e dê play.',goal:s=>s.p.m===10&&s.p.F===30&&s.t>.3,ok:'F = m·a = 10 × 3 = 30 N. A fórmula que você montou funciona.',dica:'Use F = m·a para descobrir a força.'},
 {t:'n',q:'Você empurra um carrinho de supermercado de 20 kg com 30 N, sem atrito. Qual é a aceleração?',a:1.5,u:'m/s²',why:'a = F/m = 30/20 = 1,5 m/s².'},
 {t:'mundo',h:'Newton na sua volta',itens:[['Cinto de segurança','Numa batida o carro para, mas você continua: o cinto aplica a força que te freia.'],['Toalha puxada da mesa','Puxando rápido, os pratos quase não se mexem: a inércia os mantém no lugar.'],['Carro cheio x vazio','Com a mesma força do motor, o carro lotado acelera menos: mais massa.']]}];

LX.forcas.jor=[
 {t:'cena',h:'Mais pesado no elevador?',p:`<p>Quando o elevador começa a subir, você sente as pernas mais "pesadas". Quando começa a descer, sente um frio na barriga, como se ficasse mais leve.</p><p>Seu peso mudou mesmo?</p>`},
 {t:'lab',sim:'elev',p:'A pessoa de 60 kg está numa balança dentro do elevador. <b>Desafio:</b> coloque a aceleração em <b>zero</b> (elevador parado ou em velocidade constante).',goal:s=>s.p.a===0,ok:'Com aceleração zero, a balança marca <b>60 kg</b>. A balança mede a força com que empurra você, a <b>normal N</b>, que aqui é igual ao peso.',dica:'Arraste o controle de aceleração até 0.'},
 {t:'lab',sim:'elev',cfg:{a:0},p:'<b>Desafio:</b> faça a balança marcar <b>mais</b> que 60 kg.',goal:s=>s.p.a>0&&s.p.m===60,ok:'Acelerando para cima, a balança empurra você com mais força que o peso. O peso (a Terra puxando) continua o mesmo; o que muda é a normal.',dica:'Tente uma aceleração positiva (para cima).'},
 {t:'q',q:'Quando a balança marca mais que o peso, a força resultante na pessoa aponta…',o:['para cima, porque N é maior que P','para baixo','para lugar nenhum: é zero'],why:'N − P é a resultante. Se N > P, ela aponta para cima, e é isso que acelera a pessoa para cima.'},
 {t:'lab',sim:'elev',cfg:{a:0},p:'<b>Desafio:</b> faça a balança marcar <b>zero</b>.',goal:s=>s.p.a<=-10,ok:'Com aceleração de −10 m/s² o elevador está em <b>queda livre</b>: você e a balança caem juntos e ela não empurra nada. Os astronautas em órbita "flutuam" pelo mesmo motivo.',dica:'Qual aceleração tem um corpo em queda livre?'},
 {t:'deduz',p:'Monte a fórmula da balança.',linhas:[
   {txt:'Na pessoa agem N (para cima) e P (para baixo). A resultante é ___',o:['N − P','N + P','P']},
   {txt:'Pela 2ª lei: N − P = ___',o:['m·a','0','m·g']},
   {txt:'Como P = m·g: N = ___',o:['m·(g + a)','m·g − a','m·a']}],fim:'N = m·(g + a)'},
 {t:'q',q:'A Terra puxa você com 600 N. Pela 3ª lei (ação e reação), você puxa a Terra com…',o:['600 N, para cima','0 N','bem menos que 600 N, porque a Terra é enorme'],why:'Ação e reação têm sempre o <b>mesmo tamanho</b> e sentidos opostos, e agem em corpos diferentes. A Terra quase não se mexe porque a massa dela é gigantesca, não porque a força seja menor.'},
 {t:'n',q:'Uma pessoa de 50 kg está num elevador que acelera para cima a 2 m/s². Quanto a balança marca, em kg? (g = 10 m/s²)',a:60,u:'kg',why:'N = m·(g + a) = 50 × 12 = 600 N. A balança divide por 10 e mostra 60 kg.',dica:'Calcule N = m·(g + a) e divida por g.'},
 {t:'mundo',h:'Ação e reação na sua volta',itens:[['Andar','Seu pé empurra o chão para trás; o chão empurra você para a frente.'],['Foguete','Empurra os gases para baixo; os gases empurram o foguete para cima.'],['Montanha-russa','O "frio na barriga" na descida é a normal diminuindo.']]}];

LX.atrito.jor=[
 {t:'cena',h:'O armário pesado',p:`<p>Você empurra um armário e ele <b>não se mexe</b>. Empurra mais forte, mais forte… e de repente ele "desgruda". Depois disso, fica mais fácil mantê-lo andando.</p><p>Quem estava segurando o armário?</p>`},
 {t:'lab',sim:'block',cfg:{fric:true},p:'<b>Desafio:</b> com a massa de 5 kg e μₑ = 0,5, aumente a força <b>aos poucos</b> até o bloco começar a andar. Deixe o play ligado.',goal:s=>s.p.m===5&&eq(s.p.ue,.5)&&s.v>.01,ok:'Ele só andou quando a força passou de <b>25 N</b>. Antes disso, o atrito cresceu junto com a sua força e o segurou.',dica:'Dê play e vá subindo a força devagar, olhando a seta do atrito.'},
 {t:'q',q:'Com o bloco parado e uma força de 10 N empurrando, quanto vale o atrito?',o:['10 N, igual à força','25 N, o máximo','0 N, porque nada se mexe'],why:'O atrito estático é "esperto": vale exatamente o necessário para impedir o movimento, até um limite máximo. Passou do limite, o bloco escorrega.'},
 {t:'deduz',p:'De que depende esse limite?',linhas:[
   {txt:'Superfícies mais apertadas uma contra a outra "grudam" mais. O atrito máximo cresce com a ___',o:['normal N','velocidade','área de contato']},
   {txt:'Cada par de superfícies tem seu coeficiente μ. O atrito máximo parado é ___',o:['μₑ·N','N/μₑ','μₑ + N']},
   {txt:'Andando, o atrito é o cinético: Fat = ___',o:['μ<sub>c</sub>·N','μₑ·N','zero']}],fim:'Fat<sub class="up">máx</sub> = μₑ·N      Fat<sub class="up">c</sub> = μ<sub class="up">c</sub>·N'},
 {t:'q',q:'Por que é mais fácil manter o armário andando do que tirá-lo do lugar?',o:['porque μ cinético é menor que μ estático','porque a normal diminui','porque a massa diminui'],why:'Parado, as superfícies se "encaixam" melhor. Em movimento, o atrito cai para μ<sub>c</sub>·N, que é menor.'},
 {t:'n',q:'Uma caixa de 40 kg está num piso com μₑ = 0,5. Qual é a menor força horizontal que a coloca em movimento? (g = 10 m/s²)',a:200,u:'N',why:'N = P = 400 N; Fat máx = 0,5 × 400 = 200 N. Qualquer força acima disso a tira do lugar.',dica:'Primeiro a normal (igual ao peso aqui), depois μₑ·N.'},
 {t:'mundo',h:'Atrito na sua volta',itens:[['Freio ABS','Evita que a roda trave: rolando, o pneu usa o atrito estático, que é maior.'],['Tênis de basquete','A sola de borracha tem μ alto, para não escorregar nas mudanças de direção.'],['Andar no gelo','μ muito baixo: não há atrito suficiente para empurrar o chão para trás.']]}];

LX.plano.jor=[
 {t:'cena',h:'A ladeira',p:`<p>Numa rua muito íngreme, uma caixa solta escorrega; numa rampa suave, ela fica parada.</p><p>O que muda quando a rampa fica mais inclinada?</p>`},
 {t:'q',q:'Aumentando a inclinação, a parte do peso que puxa a caixa ladeira abaixo…',o:['aumenta','diminui','não muda'],why:'Numa rampa deitada, o peso só aperta a caixa contra o chão. Numa parede vertical, o peso inteiro puxa para baixo. Entre os dois, a parte "ladeira abaixo" vai crescendo.'},
 {t:'lab',sim:'incl',p:'<b>Desafio:</b> com μ = 0,5, encontre o <b>menor ângulo</b> em que o bloco escorrega.',goal:s=>eq(s.p.mu,.5)&&s.p.th===27&&s.def.phys(s).slides,ok:'Começa a escorregar em 27°. Nesse ângulo, a parte do peso ladeira abaixo passa a ser maior que o atrito máximo.',dica:'Coloque μ em 0,5 e vá aumentando o ângulo de grau em grau, olhando a mensagem no canto do desenho.'},
 {t:'deduz',p:'O peso se divide em duas partes, como um vetor com componentes.',linhas:[
   {txt:'Ao longo da rampa: P·sen θ. Contra a rampa: ___',o:['P·cos θ','P·tg θ','P']},
   {txt:'A rampa empurra de volta a parte que a aperta: N = ___',o:['P·cos θ','P','P·sen θ']},
   {txt:'Sem atrito, a força que acelera é m·g·sen θ. Então a = ___',o:['g·sen θ','g','g·cos θ']}],fim:'a = g·sen θ   (sem atrito)      N = P·cos θ'},
 {t:'q',q:'Sem atrito, um bloco de 2 kg e um de 10 kg descem a mesma rampa. Qual acelera mais?',o:['os dois igual','o de 10 kg','o de 2 kg'],why:'a = g·sen θ não tem massa. É o mesmo motivo pelo qual a queda livre não depende da massa: a rampa é uma "queda livre diluída".'},
 {t:'n',q:'Uma rampa de 30° não tem atrito. Qual é a aceleração de um bloco que desce por ela? (sen 30° = 0,5; g = 10 m/s²)',a:5,u:'m/s²',why:'a = g·sen θ = 10 × 0,5 = 5 m/s², metade da queda livre.'},
 {t:'mundo',h:'Rampas na sua volta',itens:[['Rampa de acessibilidade','A norma limita a inclinação a cerca de 5° para a cadeira de rodas subir e descer com segurança.'],['Estrada de serra','O zigue-zague diminui a inclinação: a subida fica mais longa, mas exige menos força.'],['Escorregador','Mais inclinado, mais rápido: a = g·(sen θ − μ·cos θ).']]}];

LX.centripeta.jor=[
 {t:'cena',h:'A corda arrebentou',p:`<p>Você gira uma bolinha presa num barbante, em círculo. De repente o barbante arrebenta.</p><p>Para onde a bolinha vai?</p>`},
 {t:'aposta',q:'Faça sua aposta: a bolinha sai…',o:['em linha reta, na direção em que estava indo (tangente ao círculo)','em linha reta para fora, afastando-se do centro','continuando a curva por um tempo']},
 {t:'lab',sim:'mcu',cfg:{force:true},p:'<b>Desafio:</b> dê play e <b>corte a corda</b>.',goal:s=>s.free,ok:'A bolinha sai pela <b>tangente</b>, em linha reta: inércia. Sem a corda, nada muda a direção dela.',dica:'Aperte "Iniciar" e depois o botão "Cortar a corda".'},
 {t:'q',q:'Então, enquanto girava, quem mudava a direção da bolinha o tempo todo?',o:['a corda, puxando para o centro','uma força para fora, a "centrífuga"','a própria velocidade'],why:'Só existe uma força horizontal: a tração da corda, apontando para o <b>centro</b>. É ela a <b>força centrípeta</b>. A sensação de ser jogado para fora é só a sua inércia.'},
 {t:'deduz',p:'Use a 2ª lei com a aceleração do círculo.',linhas:[
   {txt:'Da lição anterior, a aceleração no círculo é a = ___',o:['v²/R','v·R','R/v²']},
   {txt:'Pela 2ª lei, F = m·a. Então a força centrípeta é F = ___',o:['m·v²/R','m·v·R','m·R/v']}],fim:'F<sub class="up">c</sub> = '+frac('m·v²','R')},
 {t:'q',q:'Numa curva, o carro dobra a velocidade. A força de atrito que os pneus precisam fazer…',o:['quadruplica','dobra','fica igual'],why:'F cresce com v². É por isso que curvas fechadas têm placa de velocidade máxima.'},
 {t:'n',q:'Um carro de 1000 kg faz uma curva de raio 50 m a 10 m/s. Qual força centrípeta os pneus fazem?',a:2000,u:'N',why:'F = m·v²/R = 1000 × 100 / 50 = 2000 N, feita pelo atrito entre os pneus e o asfalto.'},
 {t:'mundo',h:'Força centrípeta na sua volta',itens:[['Curva de carro','Quem segura o carro na curva é o atrito dos pneus. Na pista molhada ele diminui, e o carro "sai pela tangente".'],['Satélites e a Lua','A gravidade da Terra é a força centrípeta que os mantém em órbita.'],['Globo da morte','A moto fica "grudada" na parede porque a parede faz a força centrípeta.']]}];
