/* =====================================================================
   Jornadas e exemplos animados — Eletricidade, Magnetismo e Física moderna
   ===================================================================== */
const Fcoul=s=>9e-3*s.p.q1*s.p.q2/s.p.d**2;

LX.coulomb.jor=[
 {t:'cena',h:'O pente e o papel',p:`<p>Penteie o cabelo seco e aproxime o pente de papel picado: os pedacinhos pulam até ele. Um balão esfregado no cabelo gruda na parede.</p><p>Esfregar passa <b>elétrons</b> de um corpo para o outro: um fica com carga negativa (sobram elétrons) e o outro, positiva (faltam).</p>`},
 {t:'lab',sim:'coulomb',p:'Uma esfera tem +2 μC e a outra, −3 μC: elas se atraem. <b>Desafio:</b> faça as duas se <b>repelirem</b>.',goal:s=>s.p.q1*s.p.q2>0,ok:'Cargas de mesmo sinal se repelem; de sinais opostos se atraem.',dica:'Mude o sinal de uma das cargas.'},
 {t:'medir',sim:'coulomb',p:'Volte para <b>+2 μC</b> e <b>−3 μC</b>. Anote a força para <b>quatro distâncias</b>.',rec:s=>s.p.q1===2&&s.p.q2===-3?[s.p.d,Math.abs(Fcoul(s))]:null,recMsg:'Use carga 1 = 2 μC e carga 2 = −3 μC.',cols:['distância (m)','força (N)'],need:4,dec:3,
  depois:{q:'Compare 0,3 m com 0,6 m. Dobrando a distância, a força…',o:['fica 4 vezes menor','fica 2 vezes menor','não muda'],why:'A curva despenca: a força cai com o <b>quadrado</b> da distância, como na gravitação.'}},
 {t:'lab',sim:'coulomb',p:'<b>Desafio:</b> sem mudar a distância de 0,3 m, faça a força <b>dobrar</b> (de 0,6 N para 1,2 N) mudando as cargas.',goal:s=>eq(s.p.d,.3)&&Math.abs(Math.abs(Fcoul(s))-1.2)<1e-6,ok:'O produto das cargas dobrou (de 6 para 12), e a força dobrou junto: F é proporcional a q₁·q₂.',dica:'Procure cargas cujo produto, sem sinal, dê 12.'},
 {t:'deduz',p:'Junte as duas descobertas.',linhas:[
   {txt:'F cresce com o produto das cargas e cai com o quadrado da distância: F = k·___',o:['|q₁·q₂|/d²','(q₁ + q₂)/d','q₁·q₂·d²']}],fim:'F = k·'+frac('|q₁·q₂|','d²')+'      k = 9×10⁹ N·m²/C²'},
 {t:'q',q:'Por que o cabelo fica arrepiado depois de tirar um gorro de lã?',o:['os fios ficam com carga de mesmo sinal e se repelem','o gorro puxa os fios','o cabelo esquenta'],why:'Cada fio recebe a mesma carga e empurra os vizinhos.'},
 {t:'n',q:'Duas cargas se atraem com 0,6 N a 0,3 m. Qual será a força a 0,6 m?',a:.15,u:'N',why:'Dobrando a distância, a força fica 4 vezes menor: 0,6/4 = 0,15 N.'},
 {t:'mundo',h:'Cargas na sua volta',itens:[['Choque na maçaneta','Você acumula carga andando no carpete e descarrega no metal.'],['Raio','Nuvens acumulam cargas enormes até o ar conduzir.'],['Impressora a laser','O toner é atraído por regiões carregadas do cilindro.']]}];
LX.coulomb.exa={q:'Duas esferas, com <b>+2 μC</b> e <b>−3 μC</b>, estão a <b>0,3 m</b>. Qual é a força entre elas? E a 0,6 m? (k = 9×10⁹ N·m²/C²)',sim:'coulomb',set:{q1:2,q2:-3,d:.3},ty:999,passos:[
 {txt:'Sinais opostos: <b>atração</b>. Produto das cargas, sem sinal: 2×10⁻⁶ × 3×10⁻⁶ = 6×10⁻¹² C².'},
 {txt:'F = 9×10⁹ × 6×10⁻¹² / 0,3² = 0,054/0,09 = <b>0,6 N</b>.',ask:{q:'Qual é a força?',a:.6,u:'N'}},
 {txt:'Com o dobro da distância, F fica 4 vezes menor: <b>0,15 N</b>.',ask:{q:'E a 0,6 m?',a:.15,u:'N'},set:{d:.6}}]};

LX.campo.jor=[
 {t:'cena',h:'Uma força à distância',p:`<p>Uma carga empurra ou puxa outra sem encostar nela. Como uma "sabe" da outra?</p><p>Faraday imaginou que cada carga modifica o espaço à sua volta, criando um <b>campo elétrico</b>. Outra carga colocada ali sente uma força. As setinhas do laboratório mostram esse campo.</p>`},
 {t:'lab',sim:'field',p:'<b>Desafio:</b> arraste a sonda amarela para bem perto da carga <b>positiva</b> (vermelha) e veja para onde aponta o campo.',goal:s=>Math.hypot(s.pr[0]-s.c[0][0],s.pr[1]-s.c[0][1])<.25,ok:'Perto da carga positiva o campo é forte e aponta para <b>fora</b> dela.',dica:'Clique na bolinha amarela e arraste.'},
 {t:'q',q:'E perto da carga negativa (azul), o campo…',o:['aponta para dentro dela','aponta para fora','é zero'],why:'O campo sai das cargas positivas e entra nas negativas. É o caminho que uma carga positiva de teste seguiria.'},
 {t:'lab',sim:'field',p:'<b>Desafio:</b> deixe as duas cargas <b>positivas</b>.',goal:s=>s.p.q1>0&&s.p.q2>0,ok:'Entre duas cargas iguais o campo quase se anula: as setas de uma e da outra apontam em sentidos opostos.',dica:'Mude o sinal da carga B.'},
 {t:'deduz',p:'O campo mede a força por unidade de carga.',linhas:[
   {txt:'Uma carga de teste q sente a força F. O campo ali é E = ___',o:['F/q','F·q','q/F']},
   {txt:'Usando a lei de Coulomb, F = k·Q·q/d². Então E = ___',o:['k·Q/d²','k·Q/d','k·q/d²']}],fim:'E = k·'+frac('Q','d²')+'      F = q·E'},
 {t:'n',q:'Qual é o campo elétrico a 1 m de uma carga de 1 μC (1×10⁻⁶ C)? (k = 9×10⁹)',a:9000,u:'N/C',why:'E = 9×10⁹ × 1×10⁻⁶ / 1² = 9000 N/C.'},
 {t:'q',q:'Por que o celular perde o sinal dentro do elevador?',o:['a caixa de metal bloqueia o campo de fora (gaiola de Faraday)','o elevador está alto demais','o celular desliga sozinho'],why:'Dentro de um condutor fechado o campo elétrico externo se anula. Por isso o carro protege você de um raio.'},
 {t:'mundo',h:'Campo elétrico na sua volta',itens:[['Para-raios','A ponta concentra o campo e "chama" a descarga para um caminho seguro.'],['Tela touch','Seu dedo altera o campo elétrico da tela, que sabe onde você tocou.'],['Gaiola de Faraday','Um carro protege quem está dentro de um raio.']]}];
LX.campo.exa={q:'Uma carga de <b>2 μC</b> cria um campo. Qual é o campo a <b>3 m</b> dela? Que força sentiria uma carga de <b>1 μC</b> colocada ali? (k = 9×10⁹)',sim:'field',set:{q1:2,q2:0},noReads:true,ty:999,passos:[
 {txt:'E = k·Q/d² = 9×10⁹ × 2×10⁻⁶ / 3² = 18 000/9 = <b>2000 N/C</b>.',ask:{q:'Qual é o campo a 3 m?',a:2000,u:'N/C'}},
 {txt:'Na carga de prova: F = q·E = 1×10⁻⁶ × 2000 = <b>0,002 N</b>.',ask:{q:'Qual é a força na carga de 1 μC?',a:.002,u:'N'}},
 {txt:'As setas do desenho mostram o campo saindo da carga positiva em todas as direções, mais forte perto dela.'}]};

LX.ohm.jor=[
 {t:'cena',h:'O que é corrente',p:`<p>Ao ligar uma lâmpada, elétrons começam a andar pelo fio, empurrados pela <b>tensão</b> (U, em volts) da pilha ou da tomada. O fluxo de carga é a <b>corrente</b> (I, em amperes).</p><p>O fio e a lâmpada dificultam a passagem: essa dificuldade é a <b>resistência</b> (R, em ohms).</p>`},
 {t:'lab',sim:'ohm',p:'<b>Desafio:</b> faça passar exatamente <b>1 A</b> pelo circuito.',goal:s=>eq(s.p.U/s.p.R,1),ok:'Qualquer combinação em que a tensão em volts é igual à resistência em ohms dá 1 A: 12 V e 12 Ω, 20 V e 20 Ω…',dica:'Mexa na tensão e na resistência e olhe a corrente.'},
 {t:'medir',sim:'ohm',p:'Deixe <b>R = 20 Ω</b> e anote a corrente para <b>quatro tensões</b>.',rec:s=>s.p.R===20?[s.p.U,s.p.U/20]:null,recMsg:'Coloque a resistência em 20 Ω.',cols:['tensão U (V)','corrente I (A)'],need:4,dec:2,
  depois:{q:'Dobrando a tensão, a corrente…',o:['dobra','cai pela metade','não muda'],why:'Reta pela origem: a corrente é proporcional à tensão. O fator é 1/R.'}},
 {t:'deduz',p:'Monte a lei de Ohm.',linhas:[
   {txt:'I é proporcional a U, e a resistência dificulta: I = ___',o:['U/R','U·R','R/U']},
   {txt:'Isolando a tensão: U = ___',o:['R·I','I/R','R/I']}],fim:'U = R·I'},
 {t:'lab',sim:'ohm',p:'<b>Desafio:</b> faça a lâmpada brilhar forte, com potência <b>acima de 20 W</b>.',goal:s=>s.p.U*s.p.U/s.p.R>20,ok:'A potência é P = U·I = U²/R. Mais tensão ou menos resistência: mais brilho.',dica:'Aumente a tensão ou diminua a resistência.'},
 {t:'q',q:'Com a mesma tensão, se a resistência dobra, a corrente…',o:['cai pela metade','dobra','não muda'],why:'I = U/R: R em dobro, I pela metade.'},
 {t:'n',q:'Um aquecedor de resistência 11 Ω é ligado em 220 V. Qual é a corrente?',a:20,u:'A',why:'I = U/R = 220/11 = 20 A.'},
 {t:'mundo',h:'Corrente na sua volta',itens:[['Disjuntor','Desliga quando a corrente passa do limite, para o fio não esquentar demais.'],['Fio grosso do chuveiro','Correntes grandes pedem fios grossos, com resistência baixa.'],['Choque','O corpo seco tem resistência alta; molhado, bem menor: a corrente fica perigosa.']]}];
LX.ohm.exa={q:'Uma lâmpada de farol de carro tem resistência de <b>6 Ω</b> e é ligada na bateria de <b>12 V</b>. Qual é a corrente? E a potência?',sim:'ohm',set:{U:12,R:6},tx:.3,ty:999,passos:[
 {txt:'Lei de Ohm: I = U/R = 12/6 = <b>2 A</b>. Veja os elétrons circulando.',ask:{q:'Qual é a corrente?',a:2,u:'A'},ate:2},
 {txt:'Potência: P = U·I = 12 × 2 = <b>24 W</b>.',ask:{q:'Qual é a potência da lâmpada?',a:24,u:'W'}},
 {txt:'Em 1 hora ela gasta 24 W × 1 h = 24 Wh = 0,024 kWh.'}]};

LX.resistores.jor=[
 {t:'cena',h:'O pisca-pisca de Natal',p:`<p>Nos piscas antigos, quando uma lâmpada queimava, <b>todas apagavam</b>. Em casa, se uma lâmpada queima, as outras continuam acesas.</p><p>A diferença está no jeito de ligar: em <b>série</b> (uma atrás da outra) ou em <b>paralelo</b> (cada uma no seu caminho).</p>`},
 {t:'lab',sim:'resist',p:'As lâmpadas estão em série. <b>Desafio:</b> ligue-as <b>em paralelo</b> e compare o brilho.',goal:s=>s.p.mode==='p',ok:'Em paralelo, cada lâmpada recebe a tensão inteira da fonte (12 V) e brilha muito mais.',dica:'Mude a ligação.'},
 {t:'medir',sim:'resist',cfg:{mode:'s'},p:'Em <b>série</b>, anote a soma R₁ + R₂ + R₃ e a resistência equivalente para <b>três combinações</b>.',rec:s=>s.p.mode==='s'?[s.p.R1+s.p.R2+s.p.R3,s.def.calc(s).Req]:null,key:s=>[s.p.R1,s.p.R2,s.p.R3],recMsg:'Use a ligação em série.',cols:['R₁ + R₂ + R₃ (Ω)','R equivalente (Ω)'],need:3,dec:2,
  depois:{q:'Em série, a resistência equivalente é…',o:['a soma das resistências','a média delas','a maior delas'],why:'A corrente precisa atravessar todas, uma depois da outra: as dificuldades se somam.'}},
 {t:'q',q:'Ligue em paralelo e olhe a resistência equivalente. Ela é…',o:['menor que a menor das resistências','a soma das três','maior que a maior'],why:'Em paralelo, cada lâmpada é um caminho a mais para a corrente. Mais caminhos, menos resistência no total.'},
 {t:'deduz',p:'Em paralelo, todas recebem a mesma tensão U.',linhas:[
   {txt:'As correntes são U/R₁, U/R₂ e U/R₃, e a total é a soma. Como I = U/R<sub>eq</sub>: 1/R<sub>eq</sub> = ___',o:['1/R₁ + 1/R₂ + 1/R₃','R₁ + R₂ + R₃','1/(R₁ + R₂ + R₃)']},
   {txt:'Com duas resistências iguais a R em paralelo: R<sub>eq</sub> = ___',o:['R/2','2R','R']}],fim:'série: R<sub class="up">eq</sub> = R₁ + R₂ + R₃      paralelo: '+frac('1','R<sub class="up">eq</sub>')+' = '+frac('1','R₁')+' + '+frac('1','R₂')+' + '+frac('1','R₃')},
 {t:'n',q:'Resistores de 10, 20 e 30 Ω estão em série numa fonte de 12 V. Qual é a corrente?',a:.2,u:'A',why:'R<sub>eq</sub> = 60 Ω. I = 12/60 = 0,2 A, a mesma em todos.'},
 {t:'q',q:'Por que as tomadas de uma casa são ligadas em paralelo?',o:['cada aparelho recebe a tensão inteira e funciona sozinho','para gastar menos energia','para a corrente ser a mesma em todos'],why:'Desligar um aparelho não afeta os outros, e todos recebem 127 ou 220 V.'},
 {t:'mundo',h:'Circuitos na sua volta',itens:[['Benjamim (T)','Liga vários aparelhos em paralelo: a corrente total soma e pode esquentar a tomada.'],['Pisca de Natal moderno','Usa grupos em paralelo para uma lâmpada queimada não apagar tudo.'],['Chuveiro','O seletor muda a resistência ligada.']]}];
LX.resistores.exa={q:'Três lâmpadas de <b>10, 20 e 30 Ω</b> estão ligadas em <b>série</b> numa fonte de <b>12 V</b>. Qual é a corrente e a tensão em cada uma? E em paralelo?',sim:'resist',set:{mode:'s',U:12,R1:10,R2:20,R3:30},ty:999,passos:[
 {txt:'Em série, as resistências se somam: R<sub>eq</sub> = 10 + 20 + 30 = <b>60 Ω</b>.',ask:{q:'Qual é a resistência equivalente?',a:60,u:'Ω'}},
 {txt:'I = 12/60 = <b>0,2 A</b>, a mesma nas três. Tensões: 2 V, 4 V e 6 V (somam 12 V).',ask:{q:'Qual é a corrente?',a:.2,u:'A'}},
 {txt:'Em paralelo: 1/R<sub>eq</sub> = 1/10 + 1/20 + 1/30 = 11/60 → R<sub>eq</sub> ≈ <b>5,45 Ω</b>. Cada lâmpada recebe 12 V e todas brilham mais.',ask:{q:'Qual é a resistência equivalente em paralelo?',a:60/11,u:'Ω',tol:.03},set:{mode:'p'}}]};

LX.potencia.jor=[
 {t:'cena',h:'O vilão da conta de luz',p:`<p>A conta de luz não cobra "watts": cobra <b>quilowatts-hora</b> (kWh), energia. E quase sempre o maior gasto da casa é o <b>chuveiro elétrico</b>, mesmo ficando ligado só alguns minutos por dia.</p>`},
 {t:'lab',sim:'consumo',p:'<b>Desafio:</b> com o chuveiro de 5500 W, faça o gasto do mês ficar <b>abaixo de 50 kWh</b>.',goal:s=>s.p.a===0&&5500*s.p.h*30/1000<50,ok:'Banhos mais curtos! Com 15 minutos por dia, o chuveiro gasta uns 41 kWh por mês.',dica:'Diminua as horas de uso por dia.'},
 {t:'medir',sim:'consumo',p:'Chuveiro: anote o gasto mensal para <b>quatro tempos de banho</b> por dia.',rec:s=>s.p.a===0?[s.p.h,5500*s.p.h*30/1000]:null,recMsg:'Escolha o chuveiro.',cols:['horas por dia','energia no mês (kWh)'],need:4,dec:2,
  depois:{q:'Dobrando o tempo de banho, o gasto…',o:['dobra','quadruplica','não muda'],why:'Energia = potência × tempo. Mesma potência, o dobro do tempo, o dobro da energia.'}},
 {t:'deduz',p:'Calcule o gasto do chuveiro.',linhas:[
   {txt:'Energia é potência vezes tempo: E = ___',o:['P·Δt','P/Δt','Δt/P']},
   {txt:'5500 W = 5,5 kW, ligado 0,5 h por dia: ___ kWh por dia',o:['2,75','11','2750']},
   {txt:'Em 30 dias: ___ kWh',o:['82,5','2,75','165']}],fim:'E = P·Δt      P = U·I = R·I² = '+frac('U²','R')},
 {t:'q',q:'A chave "inverno" do chuveiro esquenta mais porque…',o:['liga uma resistência menor: com a mesma tensão, P = U²/R aumenta','liga uma resistência maior','aumenta a tensão da casa'],why:'Menos resistência, mais corrente, mais potência e mais calor (e conta maior).'},
 {t:'n',q:'Uma casa consumiu 150 kWh no mês, com tarifa de R$ 0,80 por kWh. Quanto é a conta (sem impostos)?',a:120,u:'reais',why:'150 × 0,80 = R$ 120.'},
 {t:'q',q:'Uma lâmpada LED de 9 W ilumina como uma incandescente de 60 W. Ligadas o mesmo tempo, a LED gasta…',o:['cerca de 7 vezes menos energia','o mesmo','mais'],why:'60/9 ≈ 7. A incandescente transforma quase toda a energia em calor.'},
 {t:'mundo',h:'Energia elétrica na sua volta',itens:[['Selo Procel','Mostra o consumo mensal do aparelho em kWh.'],['Stand-by','Aparelhos "desligados" na tomada ainda gastam alguns watts o tempo todo.'],['Ar-condicionado','1400 W por 8 h/dia passa de 300 kWh por mês.']]}];
LX.potencia.exa={q:'Um chuveiro de <b>5500 W</b> fica ligado <b>30 minutos por dia</b>. Quanto ele gasta no mês, e quanto isso custa com tarifa de <b>R$ 0,85/kWh</b>?',sim:'consumo',set:{a:0,h:.5,tf:.85},ty:999,passos:[
 {txt:'Em quilowatts: 5500 W = <b>5,5 kW</b>. Em horas: 30 min = 0,5 h.'},
 {txt:'Por dia: 5,5 × 0,5 = 2,75 kWh. No mês: 2,75 × 30 = <b>82,5 kWh</b>.',ask:{q:'Quantos kWh no mês?',a:82.5,u:'kWh'}},
 {txt:'Custo: 82,5 × 0,85 ≈ <b>R$ 70</b>. Só o banho!',ask:{q:'Quanto custa, em reais?',a:70.13,u:'reais',tol:.02}}]};

LX.magnetismo.jor=[
 {t:'cena',h:'A aurora polar',p:`<p>Perto dos polos, o céu às vezes fica coberto de luzes verdes e roxas: a <b>aurora</b>. São partículas eletricamente carregadas vindas do Sol, desviadas pelo campo magnético da Terra até os polos.</p><p>Um campo magnético muda a direção de cargas em movimento. Vamos ver como.</p>`},
 {t:'lab',sim:'magforce',p:'Um próton gira num campo magnético que entra na tela. <b>Desafio:</b> faça a partícula girar no <b>sentido contrário</b>.',goal:s=>s.p.q===-1&&s.t>1,ok:'Trocando o sinal da carga, a força inverte e o giro também.',dica:'Troque a partícula e dê play.'},
 {t:'medir',sim:'magforce',p:'Próton a 5×10⁵ m/s: anote o raio da trajetória para <b>quatro campos B</b>.',rec:s=>s.p.q===1&&s.p.v===5?[s.p.B,s.def.R(s)*100]:null,recMsg:'Use o próton e velocidade 5×10⁵ m/s.',cols:['campo B (T)','raio R (cm)'],need:4,dec:2,
  depois:{q:'Dobrando o campo, o raio…',o:['cai pela metade','dobra','não muda'],why:'Campo mais forte, força maior, curva mais fechada.'}},
 {t:'lab',sim:'magforce',p:'<b>Desafio:</b> faça o raio passar de <b>10 cm</b>.',goal:s=>s.def.R(s)*100>10,ok:'Mais velocidade ou menos campo: curva mais aberta.',dica:'Aumente a velocidade ou diminua o campo.'},
 {t:'deduz',p:'A força magnética é sempre perpendicular à velocidade.',linhas:[
   {txt:'Uma força sempre perpendicular à velocidade faz a partícula girar em círculo: é uma força ___',o:['centrípeta','peso','de atrito']},
   {txt:'|q|·v·B = m·v²/R. Então R = ___',o:['m·v/(|q|·B)','|q|·B/(m·v)','m·v·|q|·B']}],fim:'F = |q|·v·B·sen θ      R = '+frac('m·v','|q|·B')},
 {t:'q',q:'A força magnética aumenta a velocidade da partícula?',o:['não: ela só muda a direção, pois é perpendicular ao movimento','sim','às vezes'],why:'Força perpendicular ao deslocamento não realiza trabalho: a energia cinética não muda.'},
 {t:'n',q:'Um próton (1,6×10⁻¹⁹ C) entra a 1×10⁶ m/s, perpendicular a um campo de 0,5 T. Qual é a força? (digite 8e-14, por exemplo)',a:8e-14,u:'N',why:'F = 1,6×10⁻¹⁹ × 1×10⁶ × 0,5 = 8×10⁻¹⁴ N.'},
 {t:'mundo',h:'Magnetismo na sua volta',itens:[['Bússola','Aponta ao longo do campo magnético da Terra.'],['Ressonância magnética','Campos fortíssimos interagem com os núcleos do corpo.'],['Aceleradores','Ímãs curvam partículas em anéis de quilômetros.']]}];
LX.magnetismo.exa={q:'Um próton (m = 1,67×10⁻²⁷ kg; q = 1,6×10⁻¹⁹ C) entra a <b>1×10⁶ m/s</b>, perpendicular a um campo de <b>0,1 T</b>. Qual é a força e o raio da trajetória?',sim:'magforce',set:{q:1,v:10,B:.1},ty:999,passos:[
 {txt:'F = q·v·B = 1,6×10⁻¹⁹ × 1×10⁶ × 0,1 = <b>1,6×10⁻¹⁴ N</b>.',ask:{q:'Qual é a força? (ex.: 1.6e-14)',a:1.6e-14,u:'N'},ate:1.5},
 {txt:'R = m·v/(q·B) = 1,67×10⁻²⁷ × 1×10⁶ / (1,6×10⁻¹⁹ × 0,1) ≈ <b>0,104 m ≈ 10 cm</b>.',ask:{q:'Qual é o raio, em cm?',a:10.4,u:'cm',tol:.03},ate:3}]};

LX.campofio.jor=[
 {t:'cena',h:'A bússola que mexeu',p:`<p>Em 1820, numa aula, Oersted ligou um fio a uma pilha perto de uma bússola, e a agulha <b>girou</b>. Foi a descoberta de que <b>corrente elétrica cria campo magnético</b>.</p>`},
 {t:'lab',sim:'wireB',p:'O fio atravessa a tela com corrente saindo dela; as bússolas mostram o campo. <b>Desafio:</b> inverta o sentido da corrente.',goal:s=>s.p.dir==='entra',ok:'Todas as bússolas giram ao contrário: o sentido do campo segue a <b>regra da mão direita</b>.',dica:'Mude o sentido da corrente.'},
 {t:'medir',sim:'wireB',p:'Com <b>10 A</b>, arraste a sonda e anote o campo em <b>quatro distâncias</b> diferentes.',rec:s=>{ const d=Math.hypot(...s.pr); return s.p.i===10?[d,2e-7*10/(d/100)*1e6]:null; },key:s=>[Math.round(Math.hypot(...s.pr))],recMsg:'Coloque a corrente em 10 A.',cols:['distância d (cm)','campo B (μT)'],need:4,dec:1,
  depois:{q:'Dobrando a distância, o campo…',o:['cai pela metade','cai para um quarto','dobra'],why:'O campo de um fio cai com 1/d, e não com 1/d².'}},
 {t:'lab',sim:'wireB',p:'<b>Desafio:</b> com 10 A, encontre o ponto onde o campo é igual ao da <b>Terra</b> (cerca de 50 μT).',goal:s=>s.p.i===10&&Math.abs(2e-7*10/(Math.hypot(...s.pr)/100)-5e-5)<5e-6,ok:'A uns 4 cm do fio. Perto de fios com corrente, a bússola não aponta para o norte!',dica:'Arraste a sonda para mais perto do fio e olhe o valor em μT.'},
 {t:'deduz',p:'Monte a fórmula do fio.',linhas:[
   {txt:'B cresce com a corrente e cai com a distância: B ∝ ___',o:['i/d','i·d','d/i']},
   {txt:'Com o fator μ₀/(2π) = 2×10⁻⁷: B = ___',o:['μ₀·i/(2π·d)','μ₀·i·d','2π·d/(μ₀·i)']}],fim:'B = '+frac('μ₀·i','2π·d')},
 {t:'n',q:'Um fio conduz 20 A. Qual é o campo a 10 cm dele, em μT?',a:40,u:'μT',why:'B = 2×10⁻⁷ × 20/0,1 = 4×10⁻⁵ T = 40 μT.'},
 {t:'q',q:'Como fazer um eletroímã mais forte?',o:['mais corrente, mais espiras e um núcleo de ferro','menos corrente','fio mais fino'],why:'B = μ₀·N·i/ℓ num solenoide, e o ferro multiplica o campo centenas de vezes.'},
 {t:'mundo',h:'Eletroímãs na sua volta',itens:[['Ferro-velho','Um eletroímã ergue carros e solta ao desligar.'],['Campainha','O eletroímã puxa o martelinho.'],['Alto-falante','A corrente da música move um ímã preso ao cone.']]}];
LX.campofio.exa={q:'Um fio longo conduz <b>20 A</b>. Qual é o campo magnético a <b>10 cm</b> dele? E a 20 cm?',sim:'wireB',set:{i:20,dir:'sai'},fn:s=>{ s.pr=[10,0]; },tx:.28,ty:24,passos:[
 {txt:'d = 10 cm = 0,1 m. B = 2×10⁻⁷ × 20 / 0,1 = <b>4×10⁻⁵ T = 40 μT</b>, quase o campo da Terra.',ask:{q:'Qual é o campo, em μT?',a:40,u:'μT'},tags:[['d = 10 cm: B = 40 μT','energy']]},
 {txt:'Com o dobro da distância, o campo cai pela metade: <b>20 μT</b>.',ask:{q:'E a 20 cm?',a:20,u:'μT'},fn:s=>{ s.pr=[20,0]; },tags:[['d = 20 cm: B = 20 μT','energy']]}]};

LX.inducao.jor=[
 {t:'cena',h:'De onde vem a eletricidade',p:`<p>Quase toda a eletricidade que chega à sua casa vem de <b>ímãs girando perto de bobinas</b>, nas usinas. Faraday descobriu isso em 1831: um campo magnético que <b>varia</b> cria corrente.</p>`},
 {t:'lab',sim:'induct',p:'O ímã vai e volta dentro da bobina ligada a uma lâmpada. <b>Desafio:</b> deixe o ímã <b>parado dentro</b> da bobina.',goal:s=>s.p.mv===0&&s.t>1,ok:'O medidor volta ao zero e a lâmpada apaga: ímã parado, fluxo constante, nenhuma corrente.',dica:'Mude o movimento para "ímã parado dentro".'},
 {t:'lab',sim:'induct',p:'<b>Desafio:</b> faça a lâmpada brilhar mais, com o pico da fem acima de <b>6</b>.',goal:s=>s.p.mv===1&&s.peak>6,ok:'Mais rapidez ou mais espiras: a fem cresce. É a lei de Faraday.',dica:'Aumente a rapidez do movimento e o número de espiras.'},
 {t:'q',q:'Compare os dois gráficos. A fem é grande quando…',o:['o fluxo muda rápido','o fluxo é grande','o ímã para dentro da bobina'],why:'Nos picos do fluxo (ímã no meio) a fem é zero; ela é máxima onde o fluxo sobe ou desce mais rápido.'},
 {t:'deduz',p:'Monte a lei de Faraday.',linhas:[
   {txt:'A fem cresce com a rapidez da variação do fluxo e com o número de espiras: ε = −N·___',o:['ΔΦ/Δt','Φ·Δt','Φ']}],fim:'ε = −N·'+frac('ΔΦ','Δt')+'   (o sinal de menos é a lei de Lenz)'},
 {t:'n',q:'O fluxo numa bobina de 100 espiras cai 0,02 Wb em 0,1 s. Qual é o módulo da fem média?',a:20,u:'V',why:'|ε| = 100 × 0,02/0,1 = 20 V.'},
 {t:'q',q:'Por que um transformador não funciona com a corrente contínua de uma pilha?',o:['corrente contínua não faz o fluxo variar','a pilha tem pouca tensão','o transformador só aceita 220 V'],why:'Sem variação de fluxo, não há indução no outro enrolamento.'},
 {t:'mundo',h:'Indução na sua volta',itens:[['Carregador sem fio','Uma bobina na base induz corrente numa bobina dentro do celular.'],['Fogão de indução','O campo variável induz correntes no fundo da panela, que esquenta.'],['Cartão por aproximação','A maquininha induz energia no chip do cartão.']]}];
LX.inducao.exa={q:'O fluxo magnético numa bobina de <b>100 espiras</b> varia de <b>0,02 Wb para zero</b> em <b>0,1 s</b> (o ímã sai da bobina). Qual é a fem média induzida?',sim:'induct',set:{w:1.25,N:100,mv:1},noReads:true,ty:999,passos:[
 {txt:'Variação do fluxo: ΔΦ = 0 − 0,02 = <b>−0,02 Wb</b>.',ate:1.5},
 {txt:'Lei de Faraday: ε = −N·ΔΦ/Δt = −100 × (−0,02)/0,1 = <b>20 V</b>.',ask:{q:'Qual é a fem média, em volts?',a:20,u:'V'},ate:3},
 {txt:'Com o dobro das espiras ou o movimento duas vezes mais rápido, seriam 40 V.'}]};

LX.fotoeletrico.jor=[
 {t:'cena',h:'O mistério da luz',p:`<p>Luz batendo em certos metais arranca elétrons. O estranho: luz vermelha <b>fortíssima</b> não arranca nada de alguns metais, enquanto luz ultravioleta <b>fraquinha</b> arranca na hora.</p><p>Einstein resolveu o mistério e ganhou o Nobel por isso.</p>`},
 {t:'lab',sim:'photo',cfg:{l:450,W:4.3},p:'A placa agora é de <b>zinco</b> e a luz é azul. <b>Desafio:</b> tente arrancar elétrons só aumentando a <b>intensidade</b> ao máximo.',goal:s=>s.p.W===4.3&&s.p.I===10&&s.t>1,ok:'Nenhum elétron, mesmo com o dobro de fótons! Mais fótons não adianta se <b>cada um</b> tem pouca energia.',dica:'Aumente a intensidade até 10.'},
 {t:'lab',sim:'photo',cfg:{l:450,W:4.3},p:'<b>Desafio:</b> agora consiga arrancar elétrons do zinco.',goal:s=>s.p.W===4.3&&1240/s.p.l>4.3&&s.t>.5,ok:'Com ultravioleta (abaixo de uns 288 nm), cada fóton tem energia suficiente.',dica:'Diminua o comprimento de onda.'},
 {t:'medir',sim:'photo',p:'Placa de <b>sódio</b>: anote a energia de cada fóton e a energia dos elétrons arrancados para <b>quatro comprimentos de onda</b> que arrancam elétrons.',rec:s=>{ const E=1240/s.p.l; return s.p.W===2.28&&E>2.28?[E,E-2.28]:null; },recMsg:'Use o sódio e uma luz que arranque elétrons.',cols:['energia do fóton (eV)','energia do elétron (eV)'],need:4,dec:2,
  depois:{q:'Como a energia do elétron depende da do fóton?',o:['em linha reta: é a energia do fóton menos um valor fixo','não depende','cresce com o quadrado'],why:'A reta corta o eixo em 2,28 eV: a energia que o elétron gasta para sair do sódio (função trabalho φ).'}},
 {t:'deduz',p:'A explicação de Einstein.',linhas:[
   {txt:'A luz chega em pacotes, os fótons, com energia proporcional à frequência: E = ___',o:['h·f','h/f','f/h']},
   {txt:'O elétron gasta φ para sair; o resto vira energia de movimento: K = ___',o:['h·f − φ','h·f + φ','φ − h·f']}],fim:'E = h·f      K<sub class="up">máx</sub> = h·f − φ'},
 {t:'q',q:'Aumentar a intensidade da luz (com a mesma cor) aumenta…',o:['o número de elétrons arrancados, não a energia de cada um','a energia de cada elétron','nada'],why:'Intensidade = quantidade de fótons. A energia de cada fóton depende só da frequência.'},
 {t:'n',q:'Qual é a energia de um fóton de luz violeta de 400 nm? (use E = 1240/λ, com λ em nm e E em eV)',a:3.1,u:'eV',why:'E = 1240/400 = 3,1 eV.'},
 {t:'mundo',h:'O fóton na sua volta',itens:[['Painel solar','Fótons soltam elétrons no silício e criam corrente.'],['Câmera do celular','Cada pixel conta os fótons que chegam.'],['Porta automática','Um feixe de luz interrompido corta a corrente do sensor.']]}];
LX.fotoeletrico.exa={q:'Luz violeta de <b>400 nm</b> ilumina uma placa de sódio (função trabalho <b>φ = 2,28 eV</b>). Qual é a energia de cada fóton? Com que energia máxima saem os elétrons?',sim:'photo',set:{l:400,I:5,W:2.28},tx:.3,ty:999,passos:[
 {txt:'Energia do fóton: E = 1240/400 = <b>3,1 eV</b>.',ask:{q:'Qual é a energia do fóton?',a:3.1,u:'eV'},ate:2},
 {txt:'Como 3,1 eV > 2,28 eV, há emissão. K = 3,1 − 2,28 = <b>0,82 eV</b>.',ask:{q:'Qual é a energia cinética máxima dos elétrons?',a:.82,u:'eV'},ate:4}]};

LX.radioatividade.jor=[
 {t:'cena',h:'O relógio dos fósseis',p:`<p>Como os cientistas sabem que um osso tem 10 mil anos? Os seres vivos têm um pouco de carbono-14, um átomo <b>instável</b>. Depois da morte, ele vai se desfazendo num ritmo conhecido.</p><p>Esse ritmo é a <b>meia-vida</b>: o tempo para metade dos núcleos se transformar.</p>`},
 {t:'lab',sim:'decay',p:'Cada bolinha é um núcleo instável; a meia-vida é 3 s. <b>Desafio:</b> dê play e espere <b>uma meia-vida</b>.',goal:s=>s.t>=s.p.T,ok:'Sobrou mais ou menos metade, uns 200 de 400. Não dá para saber qual núcleo vai decair, mas o conjunto segue a regra.',dica:'Aperte "Iniciar" e espere 3 segundos.'},
 {t:'q',q:'Depois de duas meias-vidas, quanto sobra?',o:['um quarto','nada','metade'],why:'Metade da metade: 1/4. A cada meia-vida, divide por 2.'},
 {t:'lab',sim:'decay',p:'<b>Desafio:</b> deixe passar <b>três meias-vidas</b> e confira quanto sobrou.',goal:s=>s.t>=3*s.p.T,ok:'Cerca de 1/8, uns 50 de 400.',dica:'Espere 9 segundos.'},
 {t:'deduz',p:'Monte a regra do decaimento.',linhas:[
   {txt:'A cada meia-vida, a quantidade cai pela metade. Depois de n meias-vidas: N = ___',o:['N₀/2ⁿ','N₀/n','N₀·2ⁿ']}],fim:'N = '+frac('N₀','2ⁿ')+'      n = '+frac('t','T<sub class="up">1/2</sub>')},
 {t:'n',q:'Uma amostra tem 3200 núcleos radioativos. Quantos restam depois de 3 meias-vidas?',a:400,u:'núcleos',why:'3200/2³ = 3200/8 = 400.'},
 {t:'q',q:'A meia-vida do carbono-14 é 5730 anos. Um fóssil tem 1/4 do carbono-14 original. Qual é a idade dele?',o:['cerca de 11 460 anos (duas meias-vidas)','5730 anos','cerca de 23 000 anos'],why:'1/4 = duas metades: 2 × 5730 = 11 460 anos.'},
 {t:'mundo',h:'Radioatividade na sua volta',itens:[['Medicina nuclear','Exames usam substâncias de meia-vida curta, que somem do corpo em horas.'],['Datação','Carbono-14 para fósseis; urânio para rochas de bilhões de anos.'],['Usina nuclear','A fissão do urânio libera calor para gerar vapor.']]}];
LX.radioatividade.exa={q:'Uma amostra tem <b>400 núcleos</b> radioativos com meia-vida de <b>3 s</b>. Quantos restam depois de 6 s?',sim:'decay',set:{T:3},ty:999,passos:[
 {txt:'6 s são 6/3 = <b>2 meias-vidas</b>.',ask:{q:'Quantas meias-vidas são 6 s?',a:2}},
 {txt:'N = 400/2² = 400/4 = <b>100 núcleos</b>. Veja a simulação: cada núcleo decai ao acaso, mas o total fica perto da previsão.',ask:{q:'Quantos núcleos restam?',a:100,u:'núcleos'},ate:6}]};

LX.relatividade.jor=[
 {t:'cena',h:'O GPS e o tempo',p:`<p>Os satélites de GPS andam a 14 000 km/h. Se os engenheiros não corrigissem os relógios deles usando a teoria de Einstein, o seu GPS erraria vários quilômetros por dia.</p><p>Einstein mostrou que o <b>tempo passa diferente</b> para quem se move.</p>`},
 {t:'lab',sim:'rel',p:'Cada relógio conta um "tique" quando a luz vai e volta entre os espelhos. <b>Desafio:</b> deixe a nave <b>parada</b> e veja os dois relógios.',goal:s=>s.p.b===0&&s.t>2,ok:'Parados, os dois relógios batem juntos.',dica:'Leve a velocidade da nave a zero.'},
 {t:'lab',sim:'rel',p:'<b>Desafio:</b> faça o fator γ passar de <b>2</b> (o tempo da nave passa na metade do ritmo).',goal:s=>1/Math.sqrt(1-s.p.b**2)>2,ok:'Acima de 87% da velocidade da luz, cada segundo na nave dura mais de 2 segundos para quem fica parado.',dica:'Aumente bastante a velocidade.'},
 {t:'medir',sim:'rel',p:'Anote o fator γ para <b>quatro velocidades</b> da nave.',rec:s=>[s.p.b*100,1/Math.sqrt(1-s.p.b**2)],cols:['velocidade (% de c)','γ'],need:4,dec:2,
  depois:{q:'Como γ cresce com a velocidade?',o:['quase nada no início e dispara perto da velocidade da luz','em linha reta','diminui'],why:'No dia a dia, γ é praticamente 1. Só perto de c o efeito fica enorme.'}},
 {t:'deduz',p:'Por que o tempo dilata?',linhas:[
   {txt:'Na nave em movimento, quem está parado vê a luz do relógio percorrer uma diagonal, mais comprida. Como a velocidade da luz é a mesma para todos, o tique da nave ___',o:['demora mais para quem está parado','demora menos','é igual']},
   {txt:'O fator é γ = 1/√(1 − v²/c²): Δt = ___',o:['γ·Δt₀','Δt₀/γ','c·Δt₀']}],fim:'Δt = γ·Δt₀      γ = '+frac('1','√(1 − v²/c²)')},
 {t:'n',q:'Qual é o fator γ de uma nave a 60% da velocidade da luz?',a:1.25,u:'',why:'γ = 1/√(1 − 0,36) = 1/√0,64 = 1/0,8 = 1,25.'},
 {t:'mundo',h:'Relatividade na sua volta',itens:[['GPS','Corrige microssegundos por dia por causa da relatividade.'],['Múons','Partículas criadas no alto da atmosfera chegam ao chão porque "vivem mais" em alta velocidade.'],['E = m·c²','A energia do Sol vem de massa convertida em energia.']]}];
LX.relatividade.exa={q:'Uma nave viaja a <b>60%</b> da velocidade da luz. Na nave passam <b>10 s</b>. Quanto tempo passa para quem ficou na Terra?',sim:'rel',set:{b:.6},ty:999,passos:[
 {txt:'v/c = 0,6, então v²/c² = <b>0,36</b>.'},
 {txt:'γ = 1/√(1 − 0,36) = 1/√0,64 = 1/0,8 = <b>1,25</b>.',ask:{q:'Qual é o fator γ?',a:1.25},ate:3},
 {txt:'Δt = γ·Δt₀ = 1,25 × 10 = <b>12,5 s</b> na Terra.',ask:{q:'Quanto tempo passa na Terra?',a:12.5,u:'s'},ate:6}]};
