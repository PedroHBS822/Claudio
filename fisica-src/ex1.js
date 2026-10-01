/* =====================================================================
   Exemplos animados — Ferramentas, Cinemática e Dinâmica
   ===================================================================== */
LX.grandezas.exa={q:'Um carro anda a <b>90 km/h</b>. Quanto é isso em m/s?',sim:'conv',set:{v:90},ty:58,passos:[
 {txt:'Em 1 hora o carro anda 90 km. Em metros: 90 × 1000 = <b>90 000 m</b>.',tags:[['90 km = 90 000 m','ink']]},
 {txt:'1 hora tem 60 × 60 = <b>3600 s</b>.',tags:[['1 h = 3600 s','ink']]},
 {txt:'90 000 m em 3600 s: em cada segundo, 90 000 ÷ 3600 = <b>25 m</b>. Veja a bandeira do 1º segundo cair nos 25 m.',ask:{q:'Quantos metros o carro anda em 1 segundo?',a:25,u:'m'},ate:1,tags:[['em 1 s: 25 m','vel']]},
 {txt:'Atalho: 90 ÷ 3,6 = <b>25 m/s</b>. Dá o mesmo porque 3600 ÷ 1000 = 3,6. Em 4 s o carro cruza os 100 m.',ate:4,tags:[['90 km/h = 25 m/s','force']]}]};

LX.potencias.exa={q:'Calcule <b>(3 × 10⁸) × (2 × 10⁻³)</b>. Por exemplo: a luz anda 3×10⁸ m por segundo; quanto ela anda em 2 milissegundos?',sim:'pow10',set:{e:8},ty:176,passos:[
 {txt:'3 × 10⁸ m é a distância que a luz percorre em 1 segundo: quase a distância até a Lua (10⁸ na régua).',set:{e:8},tags:[['10⁸ m','vel']]},
 {txt:'2 × 10⁻³ s são 2 milissegundos, um piscar muito rápido.',set:{e:-3},tags:[['10⁻³','force']]},
 {txt:'Multiplique os números da frente: 3 × 2 = <b>6</b>.',ask:{q:'Quanto é 3 × 2?',a:6}},
 {txt:'Some os expoentes: 8 + (−3) = <b>5</b>. Resultado: <b>6 × 10⁵ m</b>, 600 km, mais ou menos de São Paulo ao Rio.',ask:{q:'Qual é o expoente final? (8 + (−3))',a:5},set:{e:5},tags:[['6 × 10⁵ m ≈ São Paulo–Rio','ok']]}]};

LX.vetores.exa={q:'Duas cordas puxam uma caixa com forças <b>perpendiculares</b> de 6 N e 8 N. Qual é a força resultante? (cada quadrinho do desenho vale 2 N)',sim:'vec',set:{m:'s'},fn:s=>{ s.A=[3,0]; s.B=[0,4]; },tx:.68,ty:24,passos:[
 {txt:'A seta A (6 N) aponta para a direita: 3 quadrinhos. A seta B (8 N) aponta para cima: 4 quadrinhos.',tags:[['A = 6 N, B = 8 N','ink']]},
 {txt:'Encaixando B na ponta de A, as duas formam os catetos de um triângulo retângulo. A resultante R é a hipotenusa.'},
 {txt:'R = √(6² + 8²) = √(36 + 64) = √100 = <b>10 N</b>.',ask:{q:'Qual é o módulo da resultante?',a:10,u:'N'},tags:[['R = 10 N (5 quadrinhos)','acc']]},
 {txt:'Repare: <b>não</b> é 6 + 8 = 14 N. Só dá 14 se as cordas puxarem para o mesmo lado. Agora com as duas para a direita:',fn:s=>{ s.A=[3,0]; s.B=[4,0]; },tags:[['mesma direção: R = 14 N','force']]}]};

LX.mu.exa={q:'Um ciclista passa pelo marco <b>20 m</b> da ciclovia andando a <b>6 m/s</b>, sem mudar a velocidade. Onde ele estará 5 s depois?',sim:'mov',cfg:{acc:false},set:{s0:20,v0:6},ty:150,passos:[
 {txt:'Dados: s₀ = 20 m e v = 6 m/s. Velocidade constante: movimento uniforme. Repare no rastro: um carro por segundo, sempre igualmente espaçados.',ate:2,tags:[['s₀ = 20 m · v = 6 m/s','ink']]},
 {txt:'Em 5 s ele anda Δs = v·t = 6 × 5 = <b>30 m</b>.',ask:{q:'Quantos metros ele anda em 5 s?',a:30,u:'m'},ate:5,tags:[['em 5 s andou 30 m','vel']]},
 {txt:'Posição: s = s₀ + v·t = 20 + 30 = <b>50 m</b>.',ask:{q:'Em que marco ele está?',a:50,u:'m'},tags:[['s = 50 m','acc']]},
 {txt:'A mesma regra prevê qualquer instante: em 10 s, s = 20 + 60 = 80 m. No gráfico s × t, uma reta.',ate:10,tags:[['t = 10 s → s = 80 m','acc']]}]};

LX.muv.exa={q:'Um carro a <b>20 m/s</b> (72 km/h) freia com aceleração de <b>−5 m/s²</b>. Quanto tempo leva para parar e quanto anda até parar?',sim:'mov',cfg:{acc:true},set:{s0:0,v0:20,a:-5},ty:150,passos:[
 {txt:'Frear = perder velocidade: a cada segundo, 5 m/s a menos. Veja 1 s de freada: a velocidade caiu de 20 para 15 m/s.',ate:1,tags:[['t = 1 s: v = 15 m/s','acc']]},
 {txt:'Parar é v = 0. Pela função da velocidade: 0 = 20 − 5·t → <b>t = 4 s</b>.',ask:{q:'Em quantos segundos o carro para?',a:4,u:'s'},ate:4,tags:[['parou em t = 4 s','force']]},
 {txt:'A distância é a área do triângulo no gráfico v × t: base 4 s, altura 20 m/s → 4 × 20 / 2 = <b>40 m</b>.',ask:{q:'Quantos metros ele andou freando?',a:40,u:'m'},tags:[['Δs = 40 m','vel']]},
 {txt:'Confira com Torricelli: 0² = 20² + 2·(−5)·Δs → 0 = 400 − 10·Δs → Δs = 40 m. Com o dobro da velocidade, seriam 160 m!'}]};

LX.queda.exa={q:'Uma pedra é solta do alto de um prédio e leva <b>3 s</b> para chegar ao chão. Qual a altura do prédio e a velocidade ao tocar o solo? (g = 10 m/s²)',sim:'fall',set:{h:45,g:10},tx:.72,ty:22,passos:[
 {txt:'Solta do repouso: a cada segundo, a velocidade aumenta 10 m/s. Depois de 1 s: v = 10 m/s e caiu h = 10 × 1²/2 = 5 m.',ate:1,tags:[['t = 1 s: caiu 5 m, v = 10 m/s','acc']]},
 {txt:'Depois de 2 s: v = 20 m/s e h = 10 × 2²/2 = 20 m. A distância cresce com o quadrado do tempo.',ate:2,tags:[['t = 2 s: caiu 20 m, v = 20 m/s','acc']]},
 {txt:'Em 3 s: h = g·t²/2 = 10 × 9 / 2 = <b>45 m</b>, um prédio de uns 15 andares.',ask:{q:'Qual é a altura do prédio?',a:45,u:'m'},ate:3,tags:[['h = 45 m','force']]},
 {txt:'Velocidade ao chegar: v = g·t = 10 × 3 = <b>30 m/s</b>, ou 108 km/h.',ask:{q:'Com que velocidade a pedra chega ao chão?',a:30,u:'m/s'},tags:[['v = 30 m/s = 108 km/h','vel']]}]};

LX.lancamento.exa={q:'Um chute sai a <b>25 m/s</b> fazendo 37° com o chão (cos 37° = 0,8; sen 37° = 0,6). Quanto tempo a bola fica no ar e a que distância cai?',sim:'proj',cfg:{th:35},set:{v0:25,th:36.87,g:10},ty:22,passos:[
 {txt:'Separe a velocidade: vₓ = 25 × 0,8 = <b>20 m/s</b> (horizontal) e v₀<sub>y</sub> = 25 × 0,6 = <b>15 m/s</b> (vertical).',tags:[['vₓ = 20 m/s · v₀y = 15 m/s','ink']]},
 {txt:'Na vertical a gravidade tira 10 m/s por segundo: v<sub>y</sub> zera em 15/10 = <b>1,5 s</b>. É o topo do voo.',ask:{q:'Em quantos segundos a bola chega ao ponto mais alto?',a:1.5,u:'s'},ate:1.5,tags:[['topo em t = 1,5 s','acc']]},
 {txt:'A descida demora o mesmo que a subida: tempo total no ar = <b>3 s</b>.',ask:{q:'Quanto tempo a bola fica no ar?',a:3,u:'s'},ate:3,tags:[['no ar por 3 s','acc']]},
 {txt:'Na horizontal ela andou o tempo todo a 20 m/s: alcance = 20 × 3 = <b>60 m</b>.',ask:{q:'A que distância a bola cai?',a:60,u:'m'},tags:[['alcance = 60 m','vel']]}]};

LX.mcu.exa={q:'Um carrossel de raio <b>3 m</b> dá uma volta a cada <b>6 s</b>. Qual é a velocidade de quem está na borda, e a aceleração centrípeta? (π ≈ 3,14)',sim:'mcu',cfg:{force:false},set:{R:3,T:6},ty:22,passos:[
 {txt:'Numa volta a cadeira percorre o comprimento do círculo: 2πR = 2 × 3,14 × 3 = <b>18,84 m</b>.',ask:{q:'Quantos metros a cadeira anda numa volta?',a:18.84,u:'m'},tags:[['uma volta = 18,84 m','vel']]},
 {txt:'Essa volta leva 6 s. Veja uma volta completa.',ate:6,tags:[['T = 6 s','ink']]},
 {txt:'v = 2πR/T = 18,84/6 ≈ <b>3,14 m/s</b>.',ask:{q:'Qual é a velocidade?',a:3.14,u:'m/s'},tags:[['v ≈ 3,14 m/s','vel']]},
 {txt:'Aceleração para o centro: a = v²/R = 3,14²/3 ≈ <b>3,3 m/s²</b>. É ela que muda a direção da velocidade o tempo todo.',ask:{q:'Qual é a aceleração centrípeta?',a:3.29,u:'m/s²',tol:.03},ate:9,tags:[['a ≈ 3,3 m/s² (para o centro)','acc']]}]};

LX.newton.exa={q:'Duas crianças brincam com um carrinho de <b>20 kg</b>: uma empurra com <b>70 N</b> para a frente e a outra segura com <b>30 N</b> para trás. Qual é a aceleração? (sem atrito)',sim:'block',cfg:{fric:false},set:{m:20,F:40},tx:.36,ty:24,passos:[
 {txt:'As duas forças estão na mesma direção, em sentidos opostos: a resultante é 70 − 30 = <b>40 N</b> para a frente.',ask:{q:'Qual é a força resultante?',a:40,u:'N'},tags:[['70 N − 30 N = 40 N','force']]},
 {txt:'Pela 2ª lei: a = F<sub>R</sub>/m = 40/20 = <b>2 m/s²</b>.',ask:{q:'Qual é a aceleração?',a:2,u:'m/s²'},ate:1,tags:[['a = 2 m/s²','acc']]},
 {txt:'Com 2 m/s², a cada segundo ele ganha 2 m/s. Depois de 3 s, v = <b>6 m/s</b>. Veja no gráfico, em cima, a reta subindo.',ask:{q:'Qual a velocidade depois de 3 s?',a:6,u:'m/s'},ate:3,tags:[['t = 3 s: v = 6 m/s','acc']]}]};

LX.forcas.exa={q:'Uma pessoa de <b>50 kg</b> está numa balança dentro de um elevador que acelera <b>para baixo a 2 m/s²</b> (por exemplo, começando a descer). Quanto a balança marca?',sim:'elev',set:{m:50,a:-2},tx:.34,ty:22,passos:[
 {txt:'Na pessoa agem o peso P = 50 × 10 = <b>500 N</b> (para baixo) e a normal N da balança (para cima).',ask:{q:'Qual é o peso da pessoa?',a:500,u:'N'},tags:[['P = 500 N','force']]},
 {txt:'Ela acelera para baixo, então N é <b>menor</b> que P. Pela 2ª lei: N − P = m·a → N = 50 × (10 − 2) = <b>400 N</b>.',ask:{q:'Quanto vale a normal N?',a:400,u:'N'},ate:1,tags:[['N = 400 N','vel']]},
 {txt:'A balança divide por g e mostra 400 ÷ 10 = <b>40 kg</b>. É aquele "frio na barriga" de ficar mais leve.',ask:{q:'Quanto a balança marca?',a:40,u:'kg'},tags:[['a balança marca 40 kg','ok']]}]};

LX.atrito.exa={q:'Uma caixa de <b>20 kg</b> está no chão (μₑ = 0,4; μ<sub>c</sub> = 0,3). Você empurra com <b>100 N</b>. Ela se move? Com que aceleração?',sim:'block',cfg:{fric:true},set:{m:20,F:100,ue:.4,uc:.3},tx:.36,ty:24,passos:[
 {txt:'No chão plano, a normal é igual ao peso: N = 20 × 10 = <b>200 N</b>.',ask:{q:'Quanto vale a normal?',a:200,u:'N'},tags:[['N = 200 N','vel']]},
 {txt:'O atrito estático aguenta no máximo μₑ·N = 0,4 × 200 = <b>80 N</b>.',ask:{q:'Qual é o atrito estático máximo?',a:80,u:'N'},tags:[['atrito máximo = 80 N','force']]},
 {txt:'100 N é mais que 80 N: a caixa <b>desgruda e escorrega</b>. Andando, o atrito passa a ser o cinético: 0,3 × 200 = <b>60 N</b>.',ate:.6,tags:[['100 N > 80 N: escorrega!','force'],['atrito cinético = 60 N','force']]},
 {txt:'Resultante: 100 − 60 = 40 N. Aceleração: a = 40/20 = <b>2 m/s²</b>.',ask:{q:'Qual é a aceleração da caixa?',a:2,u:'m/s²'},ate:3,tags:[['a = 2 m/s²','acc']]}]};

LX.plano.exa={q:'Uma caixa de <b>2 kg</b> desce uma rampa de 37° com atrito μ = 0,25. Qual é a aceleração? (sen 37° = 0,6; cos 37° = 0,8)',sim:'incl',set:{th:36.87,m:2,mu:.25},tx:.36,ty:24,passos:[
 {txt:'Peso: P = 2 × 10 = 20 N. A parte que puxa ladeira abaixo é P·sen θ = 20 × 0,6 = <b>12 N</b>.',ask:{q:'Quanto vale P·sen θ?',a:12,u:'N'},tags:[['P·sen θ = 12 N','vel']]},
 {txt:'A parte que aperta a rampa é P·cos θ = 20 × 0,8 = 16 N, e a normal equilibra: N = <b>16 N</b>.',tags:[['N = 16 N','acc']]},
 {txt:'Atrito: μ·N = 0,25 × 16 = <b>4 N</b>, contra o movimento.',ask:{q:'Quanto vale o atrito?',a:4,u:'N'},tags:[['atrito = 4 N','force']]},
 {txt:'Resultante ladeira abaixo: 12 − 4 = 8 N. Aceleração: a = 8/2 = <b>4 m/s²</b>.',ask:{q:'Qual é a aceleração?',a:4,u:'m/s²'},ate:1.6,tags:[['a = 4 m/s²','acc']]}]};

LX.centripeta.exa={q:'Uma bola de <b>2 kg</b> gira presa a um barbante de <b>2 m</b>, a <b>4 m/s</b>. Qual é a força que o barbante faz? E se ele arrebentar?',sim:'mcu',cfg:{force:true},set:{m:2,R:2,T:Math.PI},ty:22,passos:[
 {txt:'A velocidade muda de direção o tempo todo: há aceleração para o centro, a = v²/R = 16/2 = <b>8 m/s²</b>.',ask:{q:'Qual é a aceleração centrípeta?',a:8,u:'m/s²'},ate:1.2,tags:[['a = 8 m/s² (para o centro)','acc']]},
 {txt:'Quem produz essa aceleração é o barbante: F = m·a = 2 × 8 = <b>16 N</b>, sempre puxando para o centro.',ask:{q:'Qual é a força do barbante?',a:16,u:'N'},ate:2.4,tags:[['F = 16 N','force']]},
 {txt:'Se o barbante arrebenta, a força some. Sem força, a bola segue <b>em linha reta</b>, pela tangente: inércia.',fn:s=>{ if(!s.free){ s.def.btns[0].f(s); s.playing=false; } },ate:3.4,tags:[['sem força: linha reta','vel']]}]};
