/* =====================================================================
   Jornadas e exemplos animados — Termologia
   ===================================================================== */
LX.temperatura.jor=[
 {t:'cena',h:'Febre de 100?',p:`<p>Um amigo americano manda mensagem: "estou com 100 graus de febre!". Ele está bem? Depende da escala.</p><p><b>Temperatura</b> mede o quanto as partículas de um corpo se agitam. Existem várias escalas para medi-la, e é fácil passar de uma para a outra.</p>`},
 {t:'medir',sim:'temp',cfg:{C:20},p:'Mude a temperatura e anote o valor em <b>Celsius</b> e em <b>Fahrenheit</b>, em quatro temperaturas diferentes.',rec:s=>[s.p.C,s.p.C*1.8+32],cols:['Celsius (°C)','Fahrenheit (°F)'],need:4,dec:1,
  depois:{q:'Olhe a tabela. Cada 10 °C a mais equivalem a quantos °F a mais?',o:['18 °F','10 °F','32 °F'],why:'Os pontos formam uma reta inclinada que não passa pela origem: 0 °C já é 32 °F, e cada 1 °C vale 1,8 °F.'}},
 {t:'deduz',p:'Construa a conversão usando a água como referência: ela congela a 0 °C = 32 °F e ferve a 100 °C = 212 °F.',linhas:[
   {txt:'De 0 a 100 °C são 100 divisões. De 32 a 212 °F são ___ divisões.',o:['180','212','100']},
   {txt:'Então 1 °C equivale a ___ °F.',o:['1,8','2,12','0,55']},
   {txt:'Começando de 32, uma temperatura T<sub>C</sub> vira T<sub>F</sub> = ___',o:['1,8·T<sub>C</sub> + 32','1,8·T<sub>C</sub> − 32','T<sub>C</sub> + 32']}],fim:'T<sub class="up">F</sub> = 1,8·T<sub class="up">C</sub> + 32      T<sub class="up">K</sub> = T<sub class="up">C</sub> + 273'},
 {t:'n',q:'Voltando ao amigo: quanto são 100 °F em Celsius?',a:(100-32)/1.8,u:'°C',why:'(100 − 32)/1,8 ≈ 37,8 °C: uma febre leve. Nada de água fervendo!',dica:'Faça o caminho de volta: tire 32 e divida por 1,8.'},
 {t:'lab',sim:'temp',cfg:{C:20},p:'<b>Desafio:</b> encontre a temperatura em que Celsius e Fahrenheit marcam o <b>mesmo número</b>.',goal:s=>s.p.C===-40,ok:'−40 °C = −40 °F. É a única temperatura em que as duas escalas concordam.',dica:'É uma temperatura negativa, bem fria. Resolva T = 1,8·T + 32.'},
 {t:'lab',sim:'temp',cfg:{C:20},p:'<b>Desafio:</b> leve o termômetro até o <b>zero absoluto</b>.',goal:s=>s.p.C<=-273,ok:'0 K (−273 °C): as partículas param de se agitar. Não existe nada mais frio, por isso a escala Kelvin não tem números negativos.',dica:'Arraste a temperatura até o fim, à esquerda.'},
 {t:'q',q:'Por que não existe temperatura abaixo do zero absoluto?',o:['porque é quando a agitação das partículas chega ao mínimo: não dá para se agitar menos que isso','porque o termômetro não consegue medir','porque a água congela antes'],why:'Temperatura é agitação. No zero absoluto ela atinge o mínimo possível.'},
 {t:'mundo',h:'Temperatura na sua volta',itens:[['Previsão nos EUA','"Máxima de 86" é 30 °C, um dia quente.'],['Ciência','Físicos usam kelvin: o espaço entre as galáxias está a uns 3 K.'],['Corpo humano','37 °C ou 98,6 °F. Acima de 38 °C, febre.']]}];
LX.temperatura.exa={q:'Converta <b>25 °C</b> (temperatura de um dia agradável) para kelvin e para Fahrenheit.',sim:'temp',set:{C:25},ty:999,passos:[
 {txt:'Kelvin: some 273. 25 + 273 = <b>298 K</b>.',ask:{q:'Quanto é 25 °C em kelvin?',a:298,u:'K'}},
 {txt:'Fahrenheit: multiplique por 1,8 (25 × 1,8 = 45) …',ask:{q:'Quanto é 25 × 1,8?',a:45}},
 {txt:'… e some 32: 45 + 32 = <b>77 °F</b>. Confira nos termômetros.',ask:{q:'Quanto é 25 °C em Fahrenheit?',a:77,u:'°F'}}]};

LX.dilatacao.jor=[
 {t:'cena',h:'As frestas dos trilhos',p:`<p>Os trilhos de trem não são uma barra contínua: entre um pedaço e outro há uma pequena <b>fresta</b>. Pontes e calçadas também têm.</p><p>Sem elas, no calor do verão, os trilhos empurrariam uns aos outros e entortariam. Quanto um trilho cresce?</p>`},
 {t:'lab',sim:'dilat',cfg:{dT:0},p:'<b>Desafio:</b> aqueça um trilho de <b>aço</b> de <b>20 m</b> em <b>50 °C</b> (do inverno ao verão) e veja quanto ele cresce.',goal:s=>s.p.al===12e-6&&s.p.L0===20&&s.p.dT===50,ok:'Cresce <b>12 mm</b>. Parece pouco, mas sem folga isso empurraria o trilho vizinho com uma força enorme.',dica:'O material já é aço e o comprimento já é 20 m: só falta o aquecimento.'},
 {t:'medir',sim:'dilat',cfg:{dT:0},p:'Mantendo aço e 20 m, anote quanto o trilho cresce para <b>quatro aquecimentos</b> diferentes.',rec:s=>s.p.al===12e-6&&s.p.L0===20?[s.p.dT,s.p.L0*s.p.al*s.p.dT*1000]:null,recMsg:'Use aço e 20 m de comprimento.',cols:['aquecimento ΔT (°C)','dilatação ΔL (mm)'],need:4,dec:2,
  depois:{q:'O que acontece com a dilatação quando o aquecimento dobra?',o:['dobra também','quadruplica','fica igual'],why:'Reta pela origem: ΔL é proporcional a ΔT.'}},
 {t:'lab',sim:'dilat',cfg:{dT:50},p:'<b>Desafio:</b> com 20 m e 50 °C, descubra qual material <b>dilata mais</b>.',goal:s=>s.p.al===23e-6&&s.p.L0===20&&s.p.dT===50,ok:'O alumínio dilata quase o dobro do aço. Cada material tem seu <b>coeficiente de dilatação α</b>.',dica:'Teste os quatro materiais e compare o ΔL.'},
 {t:'q',q:'E se o trilho tiver o dobro do comprimento, com o mesmo aquecimento?',o:['dilata o dobro','dilata a mesma coisa','dilata a metade'],why:'Cada metro dilata a mesma fração. Com o dobro de metros, o dobro de dilatação.'},
 {t:'deduz',p:'Junte o que você descobriu.',linhas:[
   {txt:'ΔL é proporcional ao aquecimento e ao comprimento inicial: ΔL ∝ ___',o:['L₀·ΔT','L₀/ΔT','ΔT/L₀']},
   {txt:'O número que depende do material é o coeficiente α: ΔL = ___',o:['L₀·α·ΔT','α·ΔT','L₀ + α·ΔT']}],fim:'ΔL = L₀·α·ΔT'},
 {t:'q',q:'Uma placa de metal tem um furo no meio. Ao aquecer a placa, o furo…',o:['aumenta','diminui','não muda'],why:'Tudo cresce na mesma proporção, como uma foto ampliada, inclusive o furo. É assim que se solta a tampa de metal de um pote: água quente na tampa.'},
 {t:'n',q:'Um trilho de aço (α = 12×10⁻⁶ °C⁻¹) de 50 m vai de 20 °C para 40 °C. Quanto ele cresce, em milímetros?',a:12,u:'mm',why:'ΔL = 50 × 12×10⁻⁶ × 20 = 0,012 m = 12 mm.'},
 {t:'mundo',h:'Dilatação na sua volta',itens:[['Pote com tampa presa','Água quente na tampa de metal: ela dilata mais que o vidro e solta.'],['Fios de alta tensão','No verão ficam mais compridos e "barrigudos".'],['Termômetro de álcool','O líquido dilata e sobe pelo tubo fino.']]}];
LX.dilatacao.exa={q:'Um trilho de aço (α = 12×10⁻⁶ °C⁻¹) mede <b>50 m</b> a 20 °C. Quanto ele cresce num dia de 40 °C?',sim:'dilat',set:{al:12e-6,L0:50,dT:0},ty:999,passos:[
 {txt:'Variação de temperatura: ΔT = 40 − 20 = <b>20 °C</b>.',ask:{q:'Qual é o ΔT?',a:20,u:'°C'},set:{dT:20}},
 {txt:'ΔL = L₀·α·ΔT = 50 × 12×10⁻⁶ × 20 = 12 000 × 10⁻⁶ m.'},
 {txt:'<b>ΔL = 0,012 m = 12 mm</b>, mais de um centímetro: por isso as frestas.',ask:{q:'Quantos milímetros o trilho cresce?',a:12,u:'mm'}}]};

LX.calorimetria.jor=[
 {t:'cena',h:'Café com leite',p:`<p>O café está quente demais. Você põe leite gelado e a mistura fica morna. Mas em que temperatura, exatamente?</p><p>Quando dois corpos se encostam, o calor passa do mais quente para o mais frio até os dois ficarem com a mesma temperatura: o <b>equilíbrio térmico</b>.</p>`},
 {t:'aposta',q:'Você mistura 200 g de água a 80 °C com 200 g de água a 20 °C. A temperatura final fica em…',o:['50 °C','100 °C','menos de 50 °C','mais de 50 °C']},
 {t:'lab',sim:'calor',cfg:{m1:200,T1:80,c2:1,m2:200,T2:20},p:'A caixa de isopor não deixa calor escapar. <b>Desafio:</b> dê play e espere o equilíbrio.',goal:s=>s.p.m1===200&&s.p.T1===80&&s.p.c2===1&&s.p.m2===200&&s.p.T2===20&&s.t>8,ok:'<b>50 °C</b>: massas iguais do mesmo material dão a média simples. O que a quente perdeu, a fria ganhou.',dica:'Aperte "Iniciar" e espere o gráfico se juntar.'},
 {t:'lab',sim:'calor',cfg:{m1:200,T1:80,c2:.11,m2:300,T2:20},p:'Agora o corpo frio é um pedaço de <b>ferro</b> de 300 g, a 20 °C. <b>Desafio:</b> misture e veja onde fica o equilíbrio.',goal:s=>s.p.c2===.11&&s.t>8,ok:'O equilíbrio fica perto de 70 °C! O ferro esquenta com pouco calor: o <b>calor específico</b> dele é baixo (0,11), o da água é alto (1).',dica:'Aperte "Iniciar".'},
 {t:'deduz',p:'De que depende o calor para mudar a temperatura de um corpo?',linhas:[
   {txt:'Mais massa ou mais variação de temperatura pedem mais calor: Q ∝ ___',o:['m·ΔT','m/ΔT','ΔT']},
   {txt:'O fator de cada material é o calor específico c: Q = ___',o:['m·c·ΔT','m·c','c·ΔT']},
   {txt:'Na caixa isolada, o calor que um perde o outro ganha: Q<sub>cedido</sub> + Q<sub>recebido</sub> = ___',o:['0','Q','m·c']}],fim:'Q = m·c·ΔT      Q<sub class="up">cedido</sub> + Q<sub class="up">recebido</sub> = 0'},
 {t:'q',q:'Por que as cidades do litoral têm temperaturas mais amenas que as do interior?',o:['a água tem calor específico alto: esquenta e esfria devagar','o mar é salgado','venta mais no litoral'],why:'O mar absorve muito calor de dia e devolve à noite sem mudar muito de temperatura, segurando o clima da região.'},
 {t:'n',q:'Misturam-se 100 g de água a 90 °C com 300 g de água a 10 °C. Qual é a temperatura final?',a:30,u:'°C',why:'100·(90 − T) = 300·(T − 10) → 9000 − 100T = 300T − 3000 → T = 30 °C.',dica:'Calor cedido = calor recebido. Monte a equação com T desconhecida.'},
 {t:'mundo',h:'Calorimetria na sua volta',itens:[['Areia x mar','Ao meio-dia a areia queima o pé e o mar está fresco: a areia tem c bem menor.'],['Bolsa de água quente','A água guarda muito calor e o libera devagar.'],['Panela de ferro','Esquenta rápido; uma de barro, mais devagar.']]}];
LX.calorimetria.exa={q:'Misturam-se <b>100 g de água a 90 °C</b> com <b>300 g de água a 10 °C</b> numa caixa isolada. Qual é a temperatura final?',sim:'calor',set:{m1:100,T1:90,c2:1,m2:300,T2:10},tx:.72,ty:24,passos:[
 {txt:'A água quente perde: 100 × 1 × (90 − T). A fria ganha: 300 × 1 × (T − 10).',tags:[['cedido = recebido','ink']]},
 {txt:'100·(90 − T) = 300·(T − 10) → 9000 − 100T = 300T − 3000 → 400T = 12 000.'},
 {txt:'<b>T = 30 °C</b>. Mais perto dos 10 °C porque há o triplo de água fria. Veja as temperaturas se encontrarem.',ask:{q:'Qual é a temperatura final?',a:30,u:'°C'},ate:9,tags:[['equilíbrio: 30 °C','acc']]}]};

LX.propagacao.jor=[
 {t:'cena',h:'A maçaneta gelada',p:`<p>De manhã, a maçaneta de metal parece mais gelada que a porta de madeira. Mas as duas estão no mesmo cômodo há horas, à mesma temperatura!</p><p>O que você sente com a mão não é a temperatura: é a <b>rapidez com que o calor sai de você</b>.</p>`},
 {t:'aposta',q:'Por que o metal parece mais frio que a madeira?',o:['ele tira calor da sua mão mais depressa','ele está mais frio','ele guarda "frio"']},
 {t:'lab',sim:'conduc',p:'Calor atravessa uma placa entre um lado quente e um frio. <b>Desafio:</b> sem mudar as medidas, troque o material para que passem <b>menos de 100 W</b>.',goal:s=>s.def.phi(s)<100,ok:'Madeira e isopor são <b>isolantes</b>: seguram o calor. O cobre e o aço deixam passar dezenas de milhares de watts.',dica:'Teste os materiais e olhe o fluxo Φ.'},
 {t:'medir',sim:'conduc',p:'Escolha o <b>isopor</b> e anote o fluxo de calor para <b>quatro espessuras</b> diferentes.',rec:s=>s.p.k===.03?[s.p.L,s.def.phi(s)]:null,recMsg:'Escolha o isopor primeiro.',cols:['espessura L (cm)','fluxo de calor Φ (W)'],need:4,dec:2,
  depois:{q:'O que acontece com o fluxo quando a espessura dobra?',o:['cai pela metade','dobra','não muda'],why:'Placa mais grossa, calor passa menos: Φ é inversamente proporcional a L. Por isso paredes grossas e roupas de várias camadas esquentam mais.'}},
 {t:'deduz',p:'Junte o que você viu.',linhas:[
   {txt:'O fluxo cresce com a área e com a diferença de temperatura, e diminui com a espessura: Φ ∝ ___',o:['A·ΔT/L','A·L·ΔT','L/(A·ΔT)']},
   {txt:'Com o fator do material, a condutividade k: Φ = ___',o:['k·A·ΔT/L','k·L','A/k']}],fim:'Φ = '+frac('k·A·ΔT','L')+'   (lei de Fourier)'},
 {t:'q',q:'Condução é por contato. Como o calor do Sol chega à Terra, se no espaço não há nada?',o:['por radiação: ondas eletromagnéticas atravessam o vácuo','por condução pelo ar','por convecção no espaço'],why:'Radiação não precisa de meio. Já a convecção (correntes de ar ou água) e a condução precisam de matéria.'},
 {t:'n',q:'Uma janela de vidro (k = 0,8 W/m·K) tem 2 m² e 1 cm de espessura. Dentro faz 25 °C e fora, 15 °C. Quanto calor atravessa por segundo?',a:1600,u:'W',why:'Φ = 0,8 × 2 × 10 / 0,01 = 1600 W.',dica:'Lembre de passar 1 cm para metros.'},
 {t:'mundo',h:'Calor na sua volta',itens:[['Garrafa térmica','Vácuo entre as paredes (sem condução nem convecção) e espelho (reflete a radiação).'],['Ar-condicionado no alto','O ar frio desce e espalha pela sala: convecção.'],['Cobertor','Não esquenta: segura o calor do seu corpo com o ar preso nas fibras.']]}];
LX.propagacao.exa={q:'Uma janela de vidro (k = 0,8 W/m·K) tem <b>2 m²</b> e <b>1 cm</b> de espessura, com <b>10 °C</b> de diferença entre dentro e fora. Quanto calor ela deixa passar? E se fosse um vidro duplo, equivalente a 2 cm?',sim:'conduc',set:{k:.8,A:2,L:1,dT:10},ty:999,passos:[
 {txt:'Espessura em metros: L = 1 cm = <b>0,01 m</b>.',ask:{q:'Quanto é 1 cm em metros?',a:.01,u:'m'}},
 {txt:'Φ = k·A·ΔT/L = 0,8 × 2 × 10 / 0,01 = <b>1600 W</b>, como uma chaleira elétrica ligada o tempo todo.',ask:{q:'Qual é o fluxo de calor?',a:1600,u:'W'}},
 {txt:'Com o dobro da espessura, o fluxo cai pela metade: <b>800 W</b>.',ask:{q:'E com 2 cm de espessura?',a:800,u:'W'},set:{L:2}}]};

LX.estados.jor=[
 {t:'cena',h:'O gelo no copo',p:`<p>Num dia quente, um copo de água com gelo continua <b>gelado</b> enquanto há gelo boiando. Só depois que o último cubo derrete é que a água começa a esquentar.</p><p>Para onde vai o calor enquanto o gelo derrete?</p>`},
 {t:'aposta',q:'Aquecendo gelo a 0 °C, enquanto ele derrete, a temperatura da mistura…',o:['fica parada em 0 °C','sobe devagar','sobe rápido']},
 {t:'lab',sim:'phase',p:'O fogão aquece gelo a −20 °C. <b>Desafio:</b> dê play e <b>pause</b> durante um trecho <b>horizontal</b> do gráfico.',goal:s=>!s.playing&&s.Q>0&&[1,3].includes(s.def.TofQ(s,s.Q).i),ok:'Num patamar, o calor não aumenta a temperatura: ele está desmontando a estrutura do gelo (ou da água, na fervura).',dica:'Os patamares aparecem em 0 °C (derretendo) e em 100 °C (fervendo).'},
 {t:'q',q:'Deixe rodar até o fim (no laboratório livre, se quiser). Qual patamar é mais longo?',o:['o da fervura, a 100 °C','o do derretimento, a 0 °C','os dois são iguais'],why:'Vaporizar 1 g de água pede 540 cal; derreter 1 g de gelo, só 80 cal. Ferver tudo custa quase 7 vezes mais.'},
 {t:'deduz',p:'Quanto calor uma mudança de estado precisa?',linhas:[
   {txt:'Durante a mudança a temperatura não muda; o calor depende só da massa e do material: Q = m·___',o:['L','c·ΔT','g']},
   {txt:'Para a água, L<sub>f</sub> = 80 cal/g. Derreter 50 g de gelo pede ___ cal',o:['4000','130','1,6']}],fim:'Q = m·L      água: L<sub class="up">f</sub> = 80 cal/g, L<sub class="up">v</sub> = 540 cal/g'},
 {t:'lab',sim:'phase',cfg:{m:200},p:'<b>Desafio:</b> com <b>200 g</b> de gelo, deixe o aquecimento ir até o fim. Compare o tamanho dos patamares com os de 100 g.',goal:s=>s.p.m===200&&s.Q>=s.tot,ok:'Com o dobro da massa, cada etapa pede o dobro de calor.',dica:'Dê play e espere o gráfico chegar ao fim. Pode usar 1× ou um fogão mais forte.'},
 {t:'q',q:'Por que a comida cozinha mais rápido na panela de pressão?',o:['com mais pressão, a água só ferve acima de 100 °C','o vapor fica mais pesado','a pressão empurra o calor para dentro da comida'],why:'A temperatura de fervura sobe com a pressão: a água chega a uns 120 °C sem ferver.'},
 {t:'n',q:'Quanto calor transforma 50 g de gelo a 0 °C em água a 20 °C? (L<sub>f</sub> = 80 cal/g; c<sub>água</sub> = 1 cal/g·°C)',a:5000,u:'cal',why:'Derreter: 50 × 80 = 4000 cal. Aquecer: 50 × 1 × 20 = 1000 cal. Total: 5000 cal.',dica:'São duas etapas: derreter e depois aquecer.'},
 {t:'mundo',h:'Mudanças de estado na sua volta',itens:[['Suor','Ao evaporar, o suor leva calor do seu corpo: é o ar-condicionado natural.'],['Gelo no isopor','Enquanto derrete, segura a temperatura em 0 °C.'],['Montanhas','Em La Paz, a 3600 m, a água ferve a uns 88 °C: o macarrão demora mais.']]}];
LX.estados.exa={q:'Quanto calor é preciso para transformar <b>50 g de gelo a −20 °C</b> em <b>água a 20 °C</b>? (c<sub>gelo</sub> = 0,5; L<sub>f</sub> = 80 cal/g; c<sub>água</sub> = 1)',sim:'phase',set:{m:50,P:2},ty:999,passos:[
 {txt:'Aquecer o gelo de −20 °C a 0 °C: Q₁ = 50 × 0,5 × 20 = <b>500 cal</b>.',ask:{q:'Quanto calor para aquecer o gelo até 0 °C?',a:500,u:'cal'},ate:s=>s.def.TofQ(s,s.Q).i>=1},
 {txt:'Derreter tudo a 0 °C: Q₂ = 50 × 80 = <b>4000 cal</b>. Repare no patamar.',ask:{q:'Quanto calor para derreter os 50 g?',a:4000,u:'cal'},ate:s=>s.def.TofQ(s,s.Q).i>=2},
 {txt:'Aquecer a água de 0 a 20 °C: Q₃ = 50 × 1 × 20 = <b>1000 cal</b>.',ate:s=>s.def.TofQ(s,s.Q).T>=20},
 {txt:'Total: 500 + 4000 + 1000 = <b>5500 cal</b>. Derreter custou mais que as outras duas etapas juntas.',ask:{q:'Quanto calor no total?',a:5500,u:'cal'}}]};

LX.gases.jor=[
 {t:'cena',h:'O pneu que enche sozinho',p:`<p>Você calibra o pneu de manhã. Depois de rodar na estrada quente, ele está mais cheio, sem ninguém pôr ar. E uma lata de spray no fogo pode explodir.</p><p>Um gás é feito de partículas batendo nas paredes. Cada batida é um empurrão: isso é a <b>pressão</b>.</p>`},
 {t:'lab',sim:'gas',p:'<b>Desafio:</b> com a temperatura em 300 K, <b>comprima</b> o gás até 2,5 L (metade do volume inicial). Observe o manômetro.',goal:s=>s.p.T===300&&s.p.V===2.5,ok:'A pressão <b>dobrou</b>. Com menos espaço, as partículas batem nas paredes com o dobro da frequência.',dica:'Diminua o volume pelo controle.'},
 {t:'medir',sim:'gas',p:'Mantenha <b>300 K</b> e anote a pressão para <b>quatro volumes</b>.',rec:s=>s.p.T===300?[s.p.V,.2*.082*300/s.p.V]:null,recMsg:'Coloque a temperatura em 300 K.',cols:['volume (L)','pressão (atm)'],need:4,dec:3,
  depois:{q:'Com a temperatura fixa, dobrando o volume, a pressão…',o:['cai pela metade','dobra','não muda'],why:'É uma curva que desce (hipérbole): P·V fica constante. É a lei de Boyle, a transformação isotérmica.'}},
 {t:'medir',sim:'gas',p:'Agora mantenha <b>5 L</b> e anote a pressão para <b>quatro temperaturas</b>.',rec:s=>s.p.V===5?[s.p.T,.2*.082*s.p.T/5]:null,recMsg:'Coloque o volume em 5 L.',cols:['temperatura (K)','pressão (atm)'],need:4,dec:3,
  depois:{q:'Com o volume fixo, dobrando a temperatura em kelvin, a pressão…',o:['dobra','cai pela metade','não muda'],why:'Reta pela origem: P/T constante. Partículas mais agitadas batem mais forte e mais vezes. É o pneu quente.'}},
 {t:'deduz',p:'Junte as duas descobertas.',linhas:[
   {txt:'P cai com V e cresce com T. Então P·V/T é ___',o:['constante','zero','igual a T²']},
   {txt:'Para n mols de gás, essa constante é n·R. Assim, P·V = ___',o:['n·R·T','n·T','R/T']}],fim:'P·V = n·R·T      '+frac('P₁·V₁','T₁')+' = '+frac('P₂·V₂','T₂')},
 {t:'q',q:'Por que nas contas de gases a temperatura precisa estar em kelvin?',o:['porque a pressão é proporcional à temperatura absoluta: em 0 K não haveria agitação nenhuma','porque Celsius é só para o tempo','porque o kelvin é maior'],why:'Em Celsius, 0 °C não é "sem agitação". Dobrar de 10 °C para 20 °C não dobra a pressão; dobrar de 283 K para 566 K, sim.'},
 {t:'n',q:'Um pneu é calibrado a 30 psi a 27 °C. Depois de rodar, chega a 57 °C (volume constante). Qual é a nova pressão?',a:33,u:'psi',why:'Em kelvin: 300 K e 330 K. P₂ = 30 × 330/300 = 33 psi. Por isso se calibra o pneu frio.',dica:'Converta para kelvin antes.'},
 {t:'mundo',h:'Gases na sua volta',itens:[['Seringa tampada','Empurre o êmbolo: o ar resiste cada vez mais.'],['Lata de spray','Nunca no fogo: com o volume fixo, a pressão sobe com a temperatura.'],['Balão no sol','Cresce no calor (isobárica) e murcha no frio.']]}];
LX.gases.exa={q:'Um cilindro tem gás a <b>300 K</b> ocupando <b>5 L</b>, a cerca de 1 atm. Ele é aquecido até <b>600 K</b> com o volume fixo. Depois, ainda a 600 K, é comprimido até <b>2,5 L</b>. O que acontece com a pressão?',sim:'gas',set:{T:300,V:5},ty:999,passos:[
 {txt:'Estado inicial: 300 K, 5 L, cerca de 1 atm (o manômetro marca 0,98).'},
 {txt:'Com o volume fixo, P/T é constante. A temperatura em kelvin dobrou, então a pressão <b>dobra</b>: cerca de 2 atm.',ask:{q:'A pressão fica quantas vezes maior?',a:2,u:'vezes'},set:{T:600}},
 {txt:'A 600 K, P·V é constante. Com metade do volume, a pressão dobra de novo: cerca de <b>4 atm</b>.',ask:{q:'Qual é a nova pressão, aproximadamente? (em atm)',a:3.94,u:'atm',tol:.04},set:{V:2.5}}]};

LX.termodinamica.jor=[
 {t:'cena',h:'Só 30%',p:`<p>Num carro, só cerca de <b>30%</b> da energia da gasolina vira movimento. O resto sai como calor, pelo escapamento e pelo radiador.</p><p>Engenheiros são ruins de serviço? Não: a física <b>proíbe</b> chegar a 100%. Vamos descobrir por quê.</p>`},
 {t:'lab',sim:'engine',p:'A máquina recebe calor da fonte quente, faz trabalho girando o volante e joga o resto na fonte fria. <b>Desafio:</b> faça a máquina ideal render <b>mais de 70%</b>.',goal:s=>s.p.k===1&&s.def.eta(s)>.7,ok:'Para render mais, a diferença entre as temperaturas precisa crescer: fonte quente mais quente ou fonte fria mais fria.',dica:'Mexa nas temperaturas das fontes.'},
 {t:'medir',sim:'engine',p:'Deixe a fonte fria em <b>300 K</b> e a máquina ideal. Anote o rendimento para <b>quatro temperaturas</b> da fonte quente.',rec:s=>s.p.Tf===300&&s.p.k===1?[s.p.Tq,s.def.eta(s)*100]:null,recMsg:'Use fonte fria em 300 K e máquina ideal.',cols:['fonte quente (K)','rendimento (%)'],need:4,dec:1,
  depois:{q:'Esquentando a fonte quente, o rendimento…',o:['aumenta, mas nunca chega a 100%','chega a 100% a partir de 1500 K','não muda'],why:'A curva sobe cada vez mais devagar e nunca alcança 100%: sempre sobra calor rejeitado.'}},
 {t:'deduz',p:'Monte as leis da máquina térmica.',linhas:[
   {txt:'1ª lei (conservação): o calor recebido vira trabalho ou é rejeitado. Q₁ = ___',o:['W + Q₂','W − Q₂','Q₂']},
   {txt:'Rendimento é a fração aproveitada: η = ___',o:['W/Q₁','Q₂/Q₁','Q₁/W']},
   {txt:'A melhor máquina possível (Carnot) tem η = 1 − ___',o:['T<sub>f</sub>/T<sub>q</sub>','T<sub>q</sub>/T<sub>f</sub>','Q₁/W']}],fim:'η = '+frac('W','Q₁')+'      η<sub class="up">máx</sub> = 1 − '+frac('T<sub class="up">f</sub>','T<sub class="up">q</sub>')},
 {t:'q',q:'Para uma máquina ter 100% de rendimento, a fonte fria deveria estar a…',o:['0 K, o que é impossível','300 K','a mesma temperatura da quente'],why:'Com T<sub>f</sub> = 0 K, T<sub>f</sub>/T<sub>q</sub> = 0. Mas o zero absoluto não pode ser alcançado. É a 2ª lei da termodinâmica.'},
 {t:'n',q:'Um motor recebe 1000 J de calor por ciclo e rejeita 700 J. Qual é o rendimento, em porcentagem?',a:30,u:'%',why:'W = 1000 − 700 = 300 J. η = 300/1000 = 30%.'},
 {t:'mundo',h:'Máquinas térmicas na sua volta',itens:[['Motor do carro','Cerca de 25% a 35% da energia vira movimento.'],['Geladeira','É uma máquina térmica ao contrário: gasta energia para tirar calor de dentro.'],['Usina termelétrica','Usa vapor quente e um rio ou torre de resfriamento como fonte fria.']]}];
LX.termodinamica.exa={q:'Um motor real recebe <b>1000 J</b> de calor por ciclo e rejeita <b>700 J</b>. Qual é o trabalho e o rendimento? Se ele trabalha entre 750 K e 300 K, qual seria o máximo possível?',sim:'engine',set:{Tq:750,Tf:300,Q1:1000,k:.5},tx:.82,ty:22,passos:[
 {txt:'Conservação: W = Q₁ − Q₂ = 1000 − 700 = <b>300 J</b>. Veja a seta amarela do trabalho.',ask:{q:'Qual é o trabalho por ciclo?',a:300,u:'J'}},
 {txt:'Rendimento: η = W/Q₁ = 300/1000 = <b>30%</b>.',ask:{q:'Qual é o rendimento, em %?',a:30,u:'%'}},
 {txt:'O máximo (Carnot) seria 1 − 300/750 = 1 − 0,4 = <b>60%</b>. Este motor real aproveita metade do máximo possível.',ask:{q:'Qual é o rendimento máximo, em %?',a:60,u:'%'},tags:[['máximo possível: 60%','ok']]}]};
