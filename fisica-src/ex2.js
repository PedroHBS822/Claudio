/* =====================================================================
   Exemplos animados — Energia, Quantidade de movimento, Gravitação,
   Estática e fluidos
   ===================================================================== */
LX.trabalho.exa={q:'Você puxa uma caixa de 2 kg por <b>5 m</b> com uma corda que faz <b>60°</b> com o chão, aplicando <b>20 N</b>. Quanto trabalho a corda realiza? Sem atrito, quanto tempo leva e qual a potência média?',sim:'work',set:{F:20,th:60,d:5},tx:.36,ty:22,passos:[
 {txt:'Só a parte horizontal da força puxa a caixa para a frente: Fₓ = 20 × cos 60° = 20 × 0,5 = <b>10 N</b>.',ask:{q:'Quanto vale Fₓ = F·cos 60°?',a:10,u:'N'},tags:[['Fₓ = 10 N','vel']]},
 {txt:'Trabalho: W = Fₓ·d = 10 × 5 = <b>50 J</b>. Veja a barra de energia encher até a bandeira.',ask:{q:'Qual é o trabalho?',a:50,u:'J'},ate:s=>s.x>=s.p.d,tags:[['W = 50 J','energy']]},
 {txt:'A caixa acelera com a = 10/2 = 5 m/s² e cobre os 5 m em t = √(2 × 5/5) ≈ <b>1,41 s</b>.',tags:[['t ≈ 1,41 s','ink']]},
 {txt:'Potência média: P = W/Δt = 50/1,41 ≈ <b>35 W</b>.',ask:{q:'Qual é a potência média?',a:35.4,u:'W',tol:.04},tags:[['P ≈ 35 W','force']]}]};

LX.energia.exa={q:'Um skatista de <b>60 kg</b> parte do repouso a <b>5 m</b> de altura numa pista sem atrito. Qual é a energia potencial dele no alto? Com que velocidade passa pelo fundo? (g = 10 m/s²)',sim:'ramp',cfg:{fric:false,h0:5},set:{h0:5,m:60},tx:.34,ty:22,passos:[
 {txt:'No alto, parado, toda a energia é potencial: E<sub>p</sub> = m·g·h = 60 × 10 × 5 = <b>3000 J</b>.',ask:{q:'Qual é a energia potencial no alto?',a:3000,u:'J'},tags:[['Ep = 3000 J','acc']]},
 {txt:'No fundo, a altura é zero: os 3000 J viraram energia cinética. Veja as barras trocarem.',ate:s=>s.x>=0,tags:[['no fundo: Ec = 3000 J','vel']]},
 {txt:'m·v²/2 = 3000 → 60·v²/2 = 3000 → v² = 100 → <b>v = 10 m/s</b> (36 km/h).',ask:{q:'Qual é a velocidade no fundo?',a:10,u:'m/s'},tags:[['v = 10 m/s','vel']]}]};

LX.conservacao.exa={q:'Um skatista parte do repouso a <b>8 m</b> de altura numa pista sem atrito. Qual é a velocidade dele quando passa a <b>3 m</b> de altura? (g = 10 m/s²)',sim:'ramp',cfg:{fric:false,h0:8},set:{h0:8},tx:.34,ty:22,passos:[
 {txt:'De 8 m para 3 m, ele desceu <b>5 m</b>. Só essa parte da energia potencial virou cinética.',ask:{q:'Quantos metros ele desceu?',a:5,u:'m'},ate:s=>s.x<0&&s.def.yx(s,s.x)<=3,tags:[['altura 3 m: desceu 5 m','acc']]},
 {txt:'Conservação: m·g·5 = m·v²/2. A massa se cancela: v² = 2 × 10 × 5 = 100.',tags:[['m·g·Δh = m·v²/2','ink']]},
 {txt:'<b>v = 10 m/s</b>, qualquer que seja a massa e o formato da pista.',ask:{q:'Qual é a velocidade a 3 m de altura?',a:10,u:'m/s'},tags:[['v = 10 m/s','vel']]},
 {txt:'E do outro lado? Sem atrito, ele sobe até os mesmos 8 m e para por um instante.',ate:s=>s.x>0&&s.v<=0,tags:[['volta aos 8 m','ok']]}]};

LX.impulso.exa={q:'Um pé chuta uma bola de <b>0,45 kg</b>. A força sobe até <b>800 N</b> e volta a zero em <b>20 ms</b> (gráfico triangular). Com que velocidade a bola sai?',sim:'impulse',set:{F:800,dt:.02,m:.45},tx:.3,ty:84,passos:[
 {txt:'O impulso é a área do triângulo: base × altura ÷ 2 = 0,02 × 800 / 2 = <b>8 N·s</b>.',ask:{q:'Quanto vale o impulso?',a:8,u:'N·s'},ate:1,tags:[['I = 8 N·s','energy']]},
 {txt:'O impulso vira quantidade de movimento: Q = 8 kg·m/s, e a bola partiu do repouso.'},
 {txt:'v = Q/m = 8/0,45 ≈ <b>17,8 m/s</b>, uns 64 km/h.',ask:{q:'Com que velocidade a bola sai?',a:17.8,u:'m/s',tol:.03},ate:2.2,tags:[['v ≈ 17,8 m/s','vel']]}]};

LX.colisoes.exa={q:'Um carrinho de <b>3 kg</b> a <b>4 m/s</b> bate num carrinho de <b>1 kg</b> parado, e eles saem grudados. Qual é a velocidade do conjunto? Quanta energia se perde?',sim:'coll',set:{m1:3,v1:4,m2:1,v2:0,e:0},ty:22,passos:[
 {txt:'Antes: Q = 3 × 4 + 1 × 0 = <b>12 kg·m/s</b>.',ask:{q:'Qual é a quantidade de movimento total antes?',a:12,u:'kg·m/s'},tags:[['Q antes = 12 kg·m/s','acc']]},
 {txt:'Depois, juntos: (3 + 1)·v\' = 12 → <b>v\' = 3 m/s</b>. Veja a batida.',ask:{q:'Com que velocidade saem juntos?',a:3,u:'m/s'},ate:s=>s.hit&&s.t>s.hitT+.8,tags:[['juntos a 3 m/s','acc']]},
 {txt:'Energia cinética antes: 3 × 4²/2 = 24 J. Depois: 4 × 3²/2 = 18 J. <b>6 J</b> viraram deformação e calor.',ask:{q:'Quantos joules se perderam?',a:6,u:'J'},tags:[['24 J → 18 J','energy']]}]};

LX.gravitacao.exa={q:'Um planeta parte com 0,8 vez a velocidade de órbita circular e descreve uma elipse. No ponto mais distante ele está <b>2,1 vezes</b> mais longe da estrela do que no mais próximo. Onde ele é mais rápido, e quantas vezes?',sim:'orbit',cfg:{v:.8},set:{v:.8,ar:1},ty:22,passos:[
 {txt:'Ele parte do ponto mais distante, devagar. A gravidade o puxa para dentro e ele vai acelerando.',ate:1.2,tags:[['longe: mais devagar','vel']]},
 {txt:'Pela 2ª lei de Kepler (áreas iguais em tempos iguais), no ponto mais próximo ele precisa ser mais rápido. Veja ele passar perto da estrela.',ate:s=>s.r[0]<0&&s.u[0]>=0,tags:[['perto: mais rápido','force']]},
 {txt:'Nos dois extremos, distância × velocidade é igual. Se a distância ficou 2,1 vezes menor, a velocidade ficou <b>2,1 vezes maior</b>.',ask:{q:'Quantas vezes mais rápido ele passa no ponto mais próximo?',a:2.1,u:'vezes',tol:.03},tags:[['2,1 vezes mais rápido','force']]}]};

LX.torque.exa={q:'Uma criança de <b>20 kg</b> senta a <b>3 m</b> do apoio da gangorra. Onde deve sentar o pai, de <b>60 kg</b>, para equilibrar?',sim:'lever',set:{m1:20,d1:3,m2:60,d2:3},ty:96,passos:[
 {txt:'Com o pai também a 3 m, a gangorra despenca para o lado dele: o momento dele é 3 vezes maior.',tags:[['60 × 3 > 20 × 3','force']]},
 {txt:'Equilíbrio: momentos iguais. 20 × 3 = 60 × d.',tags:[['m₁·d₁ = m₂·d₂','ink']]},
 {txt:'<b>d = 1 m</b>. Com o triplo da massa, o pai precisa de um terço da distância.',ask:{q:'A que distância do apoio o pai deve sentar?',a:1,u:'m'},set:{d2:1},tags:[['equilibrou com d = 1 m','ok']]}]};

LX.pressao.exa={q:'A que profundidade de um lago a pressão total chega a <b>1,8 atm</b>? (1 atm ≈ 10⁵ Pa; água: 1000 kg/m³; g = 10 m/s²)',sim:'press',set:{rho:1000,h:0,atm:1},tx:.72,ty:22,passos:[
 {txt:'Na superfície já existe a pressão do ar: <b>1 atm</b>.',set:{h:0},tags:[['superfície: 1 atm','ink']]},
 {txt:'Cada 10 m de água somam ρ·g·h = 1000 × 10 × 10 = 10⁵ Pa: mais <b>1 atm</b>.',ask:{q:'Quantas atmosferas 10 m de água acrescentam?',a:1,u:'atm'},set:{h:10},tags:[['10 m: 2 atm','force']]},
 {txt:'Faltam 0,8 atm além da superfície. Se 10 m dão 1 atm, 0,8 atm pede <b>8 m</b>.',ask:{q:'Qual é a profundidade?',a:8,u:'m'},set:{h:8},tags:[['8 m: 1,8 atm','ok']]}]};

LX.empuxo.exa={q:'Um bloco de gelo de <b>10 L</b> (densidade 920 kg/m³) flutua no mar (1030 kg/m³). Que volume fica embaixo da água? (g = 10 m/s²)',sim:'buoy',set:{rb:920,V:10,rf:1030},tx:.3,ty:22,passos:[
 {txt:'Peso do gelo: P = 920 × 0,010 × 10 = <b>92 N</b>.',ask:{q:'Qual é o peso do bloco?',a:92,u:'N'},tags:[['P = 92 N','force']]},
 {txt:'Flutuando parado, o empuxo equilibra o peso: E = 92 N. Veja o bloco se acomodar.',ate:6,tags:[['E = P = 92 N','vel']]},
 {txt:'E = ρ<sub>mar</sub>·V<sub>sub</sub>·g → 92 = 1030 × V<sub>sub</sub> × 10 → V<sub>sub</sub> ≈ 0,0089 m³ = <b>8,9 L</b>.',ask:{q:'Quantos litros ficam submersos?',a:8.93,u:'L',tol:.03},tags:[['submerso ≈ 8,9 L (89%)','vel']]},
 {txt:'Só 11% do gelo fica de fora: é a famosa "ponta do iceberg".'}]};
