/* =====================================================================
   Jornadas de descoberta — Energia, Quantidade de movimento,
   Gravitação, Estática e fluidos
   ===================================================================== */
const ymid=s=>s.def.yx(s,s.x);

LX.trabalho.jor=[
 {t:'cena',h:'A mala de rodinhas',p:`<p>Você arrasta uma caixa por uma corda. Puxando a corda bem inclinada para cima, parece que a força "rende" menos. Puxando mais deitada, a caixa vai mais fácil.</p><p>Na física, a energia que uma força transfere ao empurrar ou puxar algo ao longo de um caminho se chama <b>trabalho</b>. Vamos medir quanto trabalho a corda faz.</p>`},
 {t:'aposta',q:'Com a mesma força de 20 N, em qual ângulo da corda a caixa recebe mais energia nos 5 m?',o:['corda na horizontal (0°)','corda a 45°','corda na vertical (90°)'],depois:'Agora meça no laboratório.'},
 {t:'medir',sim:'work',p:'Mantenha <b>F = 20 N</b> e <b>d = 5 m</b>. Puxe a caixa até a bandeira com ângulos diferentes (por exemplo 0°, 30°, 60° e 90°) e anote o trabalho em cada um.',rec:s=>s.p.F===20&&s.p.d===5&&(s.x>=s.p.d||s.p.th===90)?[s.p.th,20*Math.cos(s.p.th*Math.PI/180)*5]:null,recMsg:'Use F = 20 N e d = 5 m e deixe a caixa chegar à bandeira (em 90° ela nem sai do lugar: pode anotar direto).',cols:['ângulo (°)','trabalho (J)'],need:4,dec:1,
  depois:{q:'Quanto mais inclinada a corda, o trabalho…',o:['diminui: só a parte horizontal da força empurra a caixa para a frente','aumenta','não muda'],why:'Em 0° são 100 J; em 60°, metade; em 90°, nada. A parte vertical da força não ajuda a caixa a andar para a frente.'}},
 {t:'deduz',p:'Monte a fórmula do trabalho.',linhas:[
   {txt:'A parte da força na direção do movimento é ___',o:['F·cos θ','F·sen θ','F']},
   {txt:'Trabalho = força na direção do movimento × deslocamento: W = ___',o:['F·d·cos θ','F·d','F/d']},
   {txt:'Com a força perpendicular (θ = 90°), cos 90° = 0, então W = ___',o:['0','F·d','−F·d']}],fim:'W = F·d·cos θ'},
 {t:'q',q:'Você carrega uma mochila andando num corredor plano, com velocidade constante. A força para cima que você faz para segurá-la realiza trabalho?',o:['não: ela é perpendicular ao deslocamento','sim, um trabalho grande','sim, negativo'],why:'Força para cima, movimento para a frente: θ = 90° e W = 0. Seu braço cansa por outros motivos (músculos), mas, para a física, a mochila não ganhou energia.'},
 {t:'nota',h:'E a potência?',p:'<p>Subir uma escada correndo ou andando exige o <b>mesmo trabalho</b>: você ergue o mesmo peso até a mesma altura. O que muda é a <b>rapidez</b> com que a energia é transferida: a <b>potência</b>, P = W/Δt, medida em watts (1 W = 1 J por segundo).</p>'},
 {t:'n',q:'Um motor ergue 200 kg a 10 m de altura em 20 s, com velocidade constante. Qual é a potência? (g = 10 m/s²)',a:1000,u:'W',why:'Força = peso = 2000 N. W = 2000 × 10 = 20 000 J. P = 20 000/20 = 1000 W, ou 1 kW.',dica:'Primeiro o trabalho (peso × altura), depois divida pelo tempo.'},
 {t:'mundo',h:'Trabalho e potência na sua volta',itens:[['Mala de rodinhas','Puxar com a alça mais baixa deixa mais força na direção do movimento.'],['Rampa x escada','A rampa pede menos força, por uma distância maior: o trabalho para subir é o mesmo.'],['Potência do carro','1 cv ≈ 735 W. Um carro de 100 cv entrega uns 73 000 J por segundo.'],['Chuveiro','5500 W: transfere 5500 J de energia para a água a cada segundo.']]}];

LX.energia.jor=[
 {t:'cena',h:'O dobro da velocidade',p:`<p>Dois carros iguais freiam: um a 36 km/h e outro a 72 km/h. O mais rápido precisa de <b>quatro vezes</b> mais pista para parar, e não só do dobro.</p><p>É porque a energia de movimento cresce de um jeito especial com a velocidade.</p>`},
 {t:'lab',sim:'ramp',cfg:{fric:false},p:'O skatista parte do alto da pista. Observe as barras de energia. <b>Desafio:</b> dê play e <b>pause</b> quando a energia cinética (azul) estiver no máximo. Use a câmera lenta se precisar.',goal:s=>s.t>.2&&!s.playing&&Math.abs(s.x)<1.2,ok:'No fundo da pista a energia potencial (altura) virou toda energia cinética (movimento).',dica:'A cinética é máxima onde ele passa mais rápido: no ponto mais baixo.'},
 {t:'medir',sim:'ramp',cfg:{fric:false},p:'Solte o skatista de <b>três alturas diferentes</b>. Pause quando ele passar pelo fundo e anote a altura de partida e a energia cinética.',rec:s=>!s.playing&&s.t>.2&&Math.abs(s.x)<1.2?[s.p.h0,s.p.m*GRAV*s.p.h0]:null,recMsg:'Dê play e pause quando o skatista estiver no fundo da pista.',cols:['altura de partida (m)','energia cinética no fundo (J)'],need:3,dec:0,
  depois:{q:'A energia cinética no fundo é…',o:['proporcional à altura: dobrando a altura, dobra a energia','proporcional ao quadrado da altura','a mesma para qualquer altura'],why:'Os pontos formam uma reta pela origem. A energia "guardada" na altura é proporcional a ela: é a energia potencial.'}},
 {t:'deduz',p:'De onde vem a energia potencial?',linhas:[
   {txt:'Para erguer algo de massa m sem acelerar, a força é igual ao peso: ___',o:['m·g','m','g']},
   {txt:'O trabalho para subir uma altura h é W = ___',o:['m·g·h','m·g/h','m·h']},
   {txt:'Esse trabalho fica guardado na altura: E<sub>p</sub> = ___',o:['m·g·h','m·v²/2','m·g']}],fim:'E<sub class="up">p</sub> = m·g·h'},
 {t:'deduz',p:'E a energia de movimento? Imagine uma força F que acelera um corpo do repouso até a velocidade v, ao longo de uma distância d.',linhas:[
   {txt:'O trabalho dela é W = F·d = m·a·d. Por Torricelli, v² = 2·a·d, então a·d = ___',o:['v²/2','2·v²','v/2']},
   {txt:'Logo, W = m·a·d = ___',o:['m·v²/2','m·v','m·v²']}],fim:'E<sub class="up">c</sub> = '+frac('m·v²','2')},
 {t:'q',q:'Volte aos carros: de 36 para 72 km/h a velocidade dobrou. A energia cinética…',o:['quadruplicou','dobrou','ficou igual'],why:'v² ficou 4 vezes maior. Os freios precisam tirar 4 vezes mais energia, e por isso a distância de freada quadruplica.'},
 {t:'n',q:'Uma bola de 0,4 kg é chutada a 20 m/s. Qual é a energia cinética dela?',a:80,u:'J',why:'E<sub>c</sub> = 0,4 × 20²/2 = 0,4 × 400/2 = 80 J.',dica:'Eleve a velocidade ao quadrado antes de multiplicar.'},
 {t:'mundo',h:'Energia na sua volta',itens:[['Usina hidrelétrica','A água represada no alto tem energia potencial; ao cair, ela gira as turbinas.'],['Velocidade e acidentes','A 120 km/h um carro tem quase 3 vezes a energia que tem a 70 km/h.'],['Estilingue','Esticar o elástico guarda energia elástica, que vira cinética da pedra.']]}];

LX.conservacao.jor=[
 {t:'cena',h:'A montanha-russa sem motor',p:`<p>Numa montanha-russa, o carrinho é puxado só até o alto da primeira subida. Depois, nenhum motor empurra. Mesmo assim ele percorre o trajeto todo.</p><p>E repare: <b>o primeiro morro é sempre o mais alto</b>. Por quê?</p>`},
 {t:'aposta',q:'Sem atrito, o skatista parte do repouso a 8 m de altura. Até que altura ele sobe do outro lado?',o:['8 m','menos de 8 m','mais de 8 m']},
 {t:'lab',sim:'ramp',cfg:{fric:false},p:'<b>Desafio:</b> solte o skatista e veja até onde ele chega do outro lado.',goal:s=>s.x>0&&ymid(s)>s.p.h0-.35,ok:'Ele chega à <b>mesma altura</b>. Sem atrito, nenhuma energia se perde: a potencial vira cinética e volta a ser potencial.',dica:'Aperte "Iniciar" e espere ele subir a rampa da direita.'},
 {t:'q',q:'Durante todo o movimento, a barra "total" (cinética + potencial)…',o:['fica constante','aumenta na descida','diminui na subida'],why:'É a <b>conservação da energia mecânica</b>: o que uma barra perde a outra ganha.'},
 {t:'lab',sim:'ramp',cfg:{fric:true,mu:.06},p:'Agora a pista tem atrito. <b>Desafio:</b> deixe rodar até o skatista parar de vez.',goal:s=>s.stopped,ok:'A cada ida e volta ele sobe menos, até parar no fundo. A energia não sumiu: virou <b>calor</b> (barra vermelha), por causa do atrito.',dica:'Dê play e use a velocidade normal (1×). Pode levar uns 20 segundos.'},
 {t:'deduz',p:'Use a conservação para achar a velocidade no fundo, sem atrito.',linhas:[
   {txt:'No alto, só potencial. No fundo, só cinética: m·g·h = ___',o:['m·v²/2','m·v','m·g']},
   {txt:'A massa aparece dos dois lados e se cancela: v² = ___',o:['2·g·h','g·h','2·h/g']},
   {txt:'Então v = ___',o:['√(2·g·h)','2·g·h','g·h/2']}],fim:'v = √(2·g·h)   (não depende da massa nem do formato da pista)'},
 {t:'q',q:'Por que o primeiro morro da montanha-russa é o mais alto?',o:['porque o carrinho nunca pode subir mais alto do que a energia inicial permite, e ainda perde um pouco com o atrito','porque assim fica mais bonito','porque os morros seguintes têm motor'],why:'Toda a energia vem da altura inicial. Um morro mais alto que o primeiro pediria mais energia do que o carrinho tem.'},
 {t:'n',q:'Um carrinho parte do repouso a 20 m de altura. Com que velocidade passa pelo ponto mais baixo (0 m)? (sem atrito, g = 10 m/s²)',a:20,u:'m/s',why:'v = √(2 × 10 × 20) = √400 = 20 m/s, cerca de 72 km/h.'},
 {t:'mundo',h:'Conservação na sua volta',itens:[['Balanço','Sem empurrar, ele sobe sempre um pouco menos: o atrito e o ar levam energia.'],['Freio regenerativo','Carros elétricos transformam a energia cinética da freada em energia na bateria.'],['Bola quicando','Cada quique é mais baixo: parte da energia vira calor e som.']]}];

LX.impulso.jor=[
 {t:'cena',h:'Dobre os joelhos',p:`<p>Pulando de um muro, você cai dobrando os joelhos, sem pensar. Cair de pernas duras dói muito mais, embora a velocidade de chegada seja a mesma.</p><p>O que muda é o <b>tempo</b> que você leva para parar.</p>`},
 {t:'lab',sim:'impulse',p:'Um pé chuta a bola: o gráfico mostra a força durante o contato. Dê play com os valores iniciais e veja a velocidade da bola. <b>Desafio:</b> depois, faça a bola sair com a <b>mesma velocidade</b> usando metade da força (400 N).',goal:s=>s.p.F===400&&eq(s.p.dt,.04)&&eq(s.p.m,.45)&&s.ph>1,ok:'Metade da força durante o dobro do tempo: a área do gráfico é a mesma, e a velocidade também.',dica:'Se a força cair pela metade, o que precisa acontecer com o tempo de contato para a área continuar igual?'},
 {t:'q',q:'O que decidiu a velocidade final da bola?',o:['a área do gráfico força × tempo','só a força máxima','só o tempo de contato'],why:'Essa área se chama <b>impulso</b>. Força grande por pouco tempo ou força pequena por muito tempo podem dar o mesmo resultado.'},
 {t:'deduz',p:'Ligue o impulso à 2ª lei de Newton.',linhas:[
   {txt:'F = m·a, e a aceleração é a = Δv/Δt. Então F = ___',o:['m·Δv/Δt','m·Δt/Δv','Δv/(m·Δt)']},
   {txt:'Multiplicando os dois lados por Δt: F·Δt = ___',o:['m·Δv','m·v·t','Δv']},
   {txt:'O produto m·v se chama quantidade de movimento Q. Assim, F·Δt = ___',o:['ΔQ','Q','m']}],fim:'I = F·Δt = ΔQ      Q = m·v'},
 {t:'q',q:'Ao cair, seu corpo precisa perder a mesma quantidade de movimento de qualquer jeito. Dobrando os joelhos, o tempo de parada aumenta. A força nas pernas…',o:['diminui','aumenta','não muda'],why:'F·Δt é fixo: se Δt cresce, F diminui. É a mesma ideia do air bag e do colchão do salto em altura.'},
 {t:'n',q:'Uma bola de 0,5 kg chega a 10 m/s às mãos de um goleiro, que a para em 0,05 s. Qual é a força média nas mãos dele?',a:100,u:'N',why:'ΔQ = 0,5 × 10 = 5 kg·m/s. F = ΔQ/Δt = 5/0,05 = 100 N. Recuando as mãos (0,1 s), cairia para 50 N.',dica:'Primeiro a variação da quantidade de movimento, depois divida pelo tempo.'},
 {t:'mundo',h:'Impulso na sua volta',itens:[['Air bag','Faz o corpo parar em mais tempo: a força diminui.'],['Luva de boxe','O estofado aumenta o tempo do impacto.'],['Pegar um ovo','Você recua a mão ao pegá-lo: mais tempo, menos força, ovo inteiro.']]}];

LX.colisoes.jor=[
 {t:'cena',h:'A tacada de sinuca',p:`<p>Na sinuca, a bola branca bate em cheio numa bola parada. A branca <b>para</b> e a outra sai com a velocidade que a branca tinha.</p><p>É como se a "quantidade de movimento" passasse de uma bola para a outra. Vamos ver isso acontecer.</p>`},
 {t:'lab',sim:'coll',p:'Dois carrinhos de 2 kg; o 1 vem a 5 m/s e o 2 está parado. <b>Desafio:</b> dê play e veja a batida.',goal:s=>s.hit&&s.t>s.hitT+.3,ok:'Massas iguais, batida elástica: eles <b>trocaram de velocidade</b>, como na sinuca.',dica:'Aperte "Iniciar".'},
 {t:'medir',sim:'coll',p:'Faça <b>três batidas diferentes</b> (mude massas, velocidades ou o coeficiente e). Depois de cada batida, anote a quantidade de movimento total antes e depois.',rec:s=>s.hit&&s.t>s.hitT+.2?[s.p.m1*s.p.v1+s.p.m2*s.p.v2,s.p.m1*s.u1+s.p.m2*s.u2]:null,recMsg:'Dê play e espere a batida acontecer.',cols:['Q total antes (kg·m/s)','Q total depois (kg·m/s)'],need:3,dec:1,
  depois:{q:'O que você percebe em todas as batidas?',o:['a quantidade de movimento total não muda','ela sempre diminui','ela sempre dobra'],why:'Os pontos caem sobre a reta "depois = antes". É a <b>conservação da quantidade de movimento</b>.'}},
 {t:'lab',sim:'coll',p:'<b>Desafio:</b> faça os carrinhos <b>grudarem</b> na batida.',goal:s=>s.p.e===0&&s.hit&&s.t>s.hitT+.2,ok:'Com e = 0 eles saem juntos. Q total se conservou, mas veja a barra de energia: parte dela virou deformação e calor.',dica:'O coeficiente de restituição e mede o quanto eles "quicam". Zero: grudam.'},
 {t:'deduz',p:'Por que Q total se conserva?',linhas:[
   {txt:'Na batida, a força no carrinho 1 e a força no 2 são ação e reação, pelo mesmo tempo. Os impulsos: I₁ = ___',o:['−I₂','I₂','0']},
   {txt:'Como I = ΔQ, temos ΔQ₁ + ΔQ₂ = ___',o:['0','2·ΔQ₁','m·v']},
   {txt:'Então a quantidade de movimento total antes é igual à total ___',o:['depois','dividida por 2','zero']}],fim:'m₁·v₁ + m₂·v₂ = m₁·v₁\' + m₂·v₂\''},
 {t:'n',q:'Um vagão de 3 t a 4 m/s engata num vagão de 1 t parado, e eles seguem juntos. Qual é a velocidade do conjunto?',a:3,u:'m/s',why:'Q antes = 3000 × 4 = 12 000 kg·m/s. Juntos: 4000·v\' = 12 000 → v\' = 3 m/s.',dica:'Depois de engatar, a massa é a soma: 4 t.'},
 {t:'q',q:'Uma espingarda dá um "coice" para trás quando atira. Por quê?',o:['a quantidade de movimento total era zero e continua zero: bala para a frente, arma para trás','a pólvora empurra a arma para trás porque explode','o ar empurra a arma'],why:'Antes do tiro, tudo parado: Q = 0. Depois, a bala leva Q para a frente e a arma ganha Q igual para trás.'},
 {t:'mundo',h:'Colisões na sua volta',itens:[['Foguete','Joga gases para trás e ganha quantidade de movimento para a frente, até no vácuo.'],['Teste de batida','Engenheiros medem a quantidade de movimento antes e depois para entender as forças.'],['Patinação','Se você empurra um amigo parado no gelo, os dois deslizam em sentidos opostos.']]}];

LX.gravitacao.jor=[
 {t:'cena',h:'A Lua está caindo',p:`<p>Newton percebeu que a Lua está <b>caindo</b> na direção da Terra o tempo todo, puxada pela mesma gravidade que derruba uma maçã.</p><p>Só que ela também anda muito rápido para o lado. Enquanto cai, a Terra "foge" por baixo dela, e ela nunca chega. Isso é uma órbita.</p>`},
 {t:'lab',sim:'orbit',p:'O planeta parte com uma velocidade para o lado. <b>Desafio:</b> encontre a velocidade que faz a órbita ser um <b>círculo</b> e dê play.',goal:s=>eq(s.p.v,1,.001)&&s.t>1.5,ok:'Com a velocidade certa, o planeta cai exatamente o quanto a curva exige: órbita circular.',dica:'Na escala do controle, a órbita circular é 1.'},
 {t:'lab',sim:'orbit',cfg:{v:.8},p:'Agora a velocidade é 0,8: a órbita vira uma elipse. As áreas coloridas são varridas em <b>tempos iguais</b>. <b>Desafio:</b> deixe o planeta dar uma volta completa.',goal:s=>!s.esc&&s.t>s.Tp,ok:'Perto da estrela as fatias são curtas e largas; longe, compridas e finas. Todas têm a mesma área: é a 2ª lei de Kepler.',dica:'Aperte "Iniciar" e espere uma volta.'},
 {t:'q',q:'Para varrer áreas iguais em tempos iguais, onde o planeta precisa andar mais rápido?',o:['perto da estrela','longe da estrela','igual em todo lugar'],why:'Perto, o "raio" da fatia é curto; para ter a mesma área, o arco percorrido precisa ser maior. Por isso a Terra é mais rápida em janeiro, quando está mais perto do Sol.'},
 {t:'lab',sim:'orbit',p:'<b>Desafio:</b> faça o planeta <b>escapar</b> da estrela.',goal:s=>s.esc&&s.t>1,ok:'Acima de √2 ≈ 1,41 vez a velocidade circular, a gravidade não consegue mais segurá-lo: é a <b>velocidade de escape</b>.',dica:'Aumente bastante a velocidade inicial.'},
 {t:'deduz',p:'Newton juntou tudo numa lei só.',linhas:[
   {txt:'A força da gravidade cai com o quadrado da distância. Dobrando a distância, ela fica ___',o:['4 vezes menor','2 vezes menor','4 vezes maior']},
   {txt:'E é proporcional às duas massas. Então F = G·___',o:['M·m/d²','(M + m)/d','M/(m·d)']}],fim:'F = G·'+frac('M·m','d²')},
 {t:'n',q:'Se a distância entre dois corpos cair à metade, a força gravitacional entre eles fica quantas vezes maior?',a:4,u:'vezes',why:'F ∝ 1/d². Com d/2: 1/(d/2)² = 4/d². Quatro vezes maior.'},
 {t:'mundo',h:'Gravitação na sua volta',itens:[['Marés','A Lua puxa mais o lado do oceano que está mais perto dela.'],['GPS','Os satélites estão em órbita: caindo o tempo todo, sem nunca chegar.'],['Astronautas "flutuando"','Na estação espacial a gravidade é quase 90% da nossa. Eles flutuam porque estão em queda livre junto com a nave.']]}];

LX.torque.jor=[
 {t:'cena',h:'A porta e a dobradiça',p:`<p>Tente abrir uma porta empurrando bem perto da dobradiça: é difícil. Na maçaneta, longe da dobradiça, é fácil.</p><p>Para <b>girar</b> algo, não importa só a força, mas também <b>a que distância</b> do eixo ela age.</p>`},
 {t:'lab',sim:'lever',p:'Na gangorra, uma criança de 40 kg está a 1,5 m do apoio. Do outro lado, uma de 20 kg. <b>Desafio:</b> equilibre a gangorra mudando <b>só a distância</b> da criança da direita.',goal:s=>s.p.m1===40&&eq(s.p.d1,1.5)&&s.p.m2===20&&eq(s.p.d2,3),ok:'A criança com metade da massa precisa sentar ao <b>dobro da distância</b>: 3 m.',dica:'Com metade do peso, ela precisa de mais "alavanca".'},
 {t:'medir',sim:'lever',p:'Equilibre a gangorra de <b>três jeitos diferentes</b> (mude massas e distâncias). Quando aparecer "equilíbrio", anote.',rec:s=>Math.abs(s.p.m1*s.p.d1-s.p.m2*s.p.d2)<1e-9?[s.p.m1*s.p.d1,s.p.m2*s.p.d2]:null,recMsg:'Primeiro equilibre a gangorra: a mensagem no alto precisa dizer "equilíbrio".',key:s=>[s.p.m1,s.p.d1,s.p.m2,s.p.d2],cols:['massa × distância à esquerda','massa × distância à direita'],need:3,dec:2,
  depois:{q:'Sempre que a gangorra equilibrou…',o:['massa × distância foi igual dos dois lados','as massas eram iguais','as distâncias eram iguais'],why:'O que conta é o produto. Peso × distância ao eixo é o <b>momento</b> (ou torque).'}},
 {t:'deduz',p:'Monte a regra do equilíbrio.',linhas:[
   {txt:'O "poder de girar" de uma força é ela vezes a distância ao eixo: M = ___',o:['F·d','F/d','F + d']},
   {txt:'Para não girar, o momento de um lado é igual ao do ___',o:['outro lado','apoio','chão']}],fim:'M = F·d      equilíbrio: F₁·d₁ = F₂·d₂'},
 {t:'n',q:'Com um pé de cabra de 1 m, apoiado a 10 cm da ponta que está sob uma pedra, você faz 100 N na outra ponta. Qual força chega à pedra?',a:900,u:'N',why:'Seu braço: 0,9 m. O da pedra: 0,1 m. 100 × 0,9 = F × 0,1 → F = 900 N. A alavanca multiplicou sua força por 9.',dica:'Iguale os momentos dos dois lados do apoio.'},
 {t:'q',q:'Por que a maçaneta fica do lado oposto à dobradiça?',o:['quanto maior a distância ao eixo, menos força é preciso para o mesmo momento','para a porta ficar mais leve','porque é mais bonito'],why:'Mesma necessidade de momento, distância maior: força menor.'},
 {t:'mundo',h:'Alavancas na sua volta',itens:[['Chave de roda','Um cabo mais comprido solta parafusos apertados com menos força.'],['Tesoura','Cortar perto do eixo é mais fácil: lá a força das lâminas é maior.'],['Carrinho de mão','O peso fica perto da roda (eixo) e você levanta longe dela.']]}];

LX.pressao.jor=[
 {t:'cena',h:'O ouvido no fundo da piscina',p:`<p>No fundo de uma piscina funda, o ouvido dói. A água acima de você está empurrando.</p><p>Um mergulhador a 10 m de profundidade sente o <b>dobro</b> da pressão que sente na superfície. De onde vem isso?</p>`},
 {t:'lab',sim:'press',p:'Um sensor desce no lago. <b>Desafio:</b> leve o sensor a <b>10 m</b> de profundidade na água, somando a pressão do ar.',goal:s=>s.p.rho===1000&&eq(s.p.h,10)&&s.p.atm===1,ok:'2 atm: 1 atm do ar sobre o lago e mais 1 atm dos 10 m de água.',dica:'Arraste o controle de profundidade até o fim.'},
 {t:'medir',sim:'press',cfg:{h:2},p:'Agora coloque "Somar a pressão do ar?" em <b>não</b>, para ver só a parte da água. Anote a pressão em <b>quatro profundidades</b>.',rec:s=>s.p.atm===0&&s.p.rho===1000?[s.p.h,s.p.rho*GRAV*s.p.h/1000]:null,recMsg:'Use água e escolha "não" em "Somar a pressão do ar?".',cols:['profundidade (m)','pressão da água (kPa)'],need:4,dec:1,
  depois:{q:'A pressão da água…',o:['cresce em proporção à profundidade','cresce com o quadrado da profundidade','é a mesma em qualquer profundidade'],why:'Reta pela origem: a cada metro, mais 10 kPa. É o peso da coluna de água acima do sensor.'}},
 {t:'deduz',p:'Calcule o peso da coluna de água em cima do sensor, numa área A.',linhas:[
   {txt:'A coluna tem área A e altura h. Volume: ___',o:['A·h','A/h','h']},
   {txt:'Massa: ρ·A·h. Peso: ___',o:['ρ·A·h·g','ρ·g','A·h']},
   {txt:'Pressão = peso ÷ área = ___',o:['ρ·g·h','ρ·A·g','g·h/A']}],fim:'p = p<sub class="up">atm</sub> + ρ·g·h'},
 {t:'q',q:'Dois mergulhadores estão a 10 m: um no mar aberto, outro numa piscina estreita. Quem sente mais pressão?',o:['os dois sentem a mesma','o do mar, porque há mais água','o da piscina, porque a água está apertada'],why:'A fórmula não tem a largura nem a quantidade total de água: só a profundidade (e o líquido).'},
 {t:'n',q:'Qual é a pressão só da água (sem contar o ar) a 30 m de profundidade, em atmosferas? (1 atm ≈ 10⁵ Pa; g = 10 m/s²)',a:3,u:'atm',why:'ρ·g·h = 1000 × 10 × 30 = 300 000 Pa = 3 atm. Com o ar, o mergulhador sente 4 atm.'},
 {t:'mundo',h:'Pressão na sua volta',itens:[['Caixa-d\'água no alto','Quanto mais alta, maior a coluna de água e mais forte o chuveiro.'],['Barragem','É mais grossa embaixo, onde a pressão da água é maior.'],['Macaco hidráulico','A pressão se transmite pelo óleo: área 50 vezes maior, força 50 vezes maior.']]}];

LX.empuxo.jor=[
 {t:'cena',h:'O navio de aço',p:`<p>Um navio de aço com milhares de toneladas flutua. Um prego de aço afunda.</p><p>Arquimedes descobriu o segredo há mais de 2000 anos: todo líquido empurra para cima o que está dentro dele. Esse empurrão é o <b>empuxo</b>.</p>`},
 {t:'lab',sim:'buoy',p:'Um bloco de madeira (600 kg/m³) vai ser colocado na água (1000 kg/m³). <b>Desafio:</b> dê play e espere ele parar.',goal:s=>s.p.rb===600&&s.p.rf===1000&&s.t>3,ok:'Flutua com <b>60%</b> do volume submerso. O empuxo (seta azul) ficou igual ao peso (seta vermelha).',dica:'Aperte "Iniciar" e espere uns segundos.'},
 {t:'medir',sim:'buoy',p:'Teste <b>três densidades menores que 1000</b> na água. Depois que o bloco parar, anote a densidade e a porcentagem submersa.',rec:s=>s.t>4&&s.p.rb<s.p.rf&&s.p.rf===1000?[s.p.rb,s.p.rb/s.p.rf*100]:null,recMsg:'Use água, uma densidade menor que 1000, dê play e espere uns 4 segundos.',cols:['densidade do bloco (kg/m³)','parte submersa (%)'],need:3,dec:1,
  depois:{q:'A porcentagem submersa é…',o:['a densidade do bloco dividida pela da água','sempre metade','maior para blocos menos densos'],why:'Um bloco de 300 kg/m³ fica 30% submerso; um de 900, 90%. É por isso que só a "ponta do iceberg" aparece: o gelo tem 920 kg/m³.'}},
 {t:'lab',sim:'buoy',p:'<b>Desafio:</b> faça o bloco <b>afundar</b>.',goal:s=>s.p.rb>s.p.rf&&s.t>2,ok:'Mais denso que o líquido: mesmo todo submerso, o empuxo não alcança o peso.',dica:'Aumente a densidade do bloco além da densidade do líquido.'},
 {t:'deduz',p:'De onde vem o tamanho do empuxo?',linhas:[
   {txt:'O corpo empurra para fora um volume de líquido igual ao volume submerso. A massa desse líquido é ___',o:['ρ<sub>líquido</sub>·V<sub>sub</sub>','ρ<sub>corpo</sub>·V','V<sub>sub</sub>/ρ']},
   {txt:'O empuxo é o peso desse líquido deslocado: E = ___',o:['ρ<sub>líquido</sub>·V<sub>sub</sub>·g','ρ<sub>líquido</sub>·g','m·g']}],fim:'E = ρ<sub class="up">líquido</sub>·V<sub class="up">sub</sub>·g'},
 {t:'q',q:'Então como o navio de aço flutua?',o:['o casco oco desloca muita água: a densidade média do navio (aço + ar) é menor que a da água','o aço de navio é mais leve','o motor o mantém em cima'],why:'Um prego maciço desloca pouca água. O navio, com o mesmo aço espalhado num casco cheio de ar, desloca água suficiente para um empuxo igual ao seu peso.'},
 {t:'n',q:'Um objeto de 3 L é totalmente mergulhado em água. Qual é o empuxo? (1 L = 0,001 m³; g = 10 m/s²)',a:30,u:'N',why:'E = 1000 × 0,003 × 10 = 30 N: o peso de 3 kg de água.'},
 {t:'mundo',h:'Empuxo na sua volta',itens:[['Colete salva-vidas','Aumenta seu volume com pouco peso: mais empuxo.'],['Submarino','Enche ou esvazia tanques de água para afundar ou subir.'],['Balão de ar quente','O ar também dá empuxo: o ar quente, menos denso, sobe.'],['Mar Morto','A água muito salgada é mais densa: você boia sem esforço.']]}];
