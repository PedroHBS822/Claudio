"""Separa as questões de Física dentro de Ciências da Natureza do ENEM (pontuação por palavras-chave
+ ajustes manuais conferidos questão a questão em OVERRIDE)."""
import re, unicodedata

def norm(s):
    return unicodedata.normalize('NFKD', s.lower()).encode('ascii', 'ignore').decode()

FIS = r'''velocidade|aceleracao|forca(s)? (resultante|peso|normal|de atrito|magnetica|eletrica|centripeta)|atrito|newton|energia cinetica|energia potencial|energia mecanica|
trabalho realizado|potencia (eletrica|dissipada|media|util)|quilowatt|kwh|\bwatt|\bjoule|resistor|resistencia eletrica|corrente eletrica|tensao eletrica|ddp|
\bvolt|ampere|\bohm|circuito|curto-circuito|fusivel|disjuntor|lampada|chuveiro eletrico|capacitor|campo magnetico|campo eletrico|ima[s]?\b|bobina|inducao|
eletroimã|carga eletrica|eletrizad|eletrostatic|lente|espelho|refracao|reflexao|difracao|interferencia|polariza|indice de refracao|
comprimento de onda|frequencia|\bhertz|\bhz\b|onda[s]? (sonora|eletromagnetica|mecanica)|\bsom\b|sonor|decibel|ressonancia|efeito doppler|
dilatacao termica|calor especifico|capacidade termica|calor latente|conducao termica|conveccao|irradiacao termica|termodinamic|maquina termica|
rendimento|ciclo de carnot|pressao atmosferica|pressao hidrostatica|empuxo|densidade|vasos comunicantes|principio de pascal|arquimedes|
movimento|trajetoria|queda livre|lancamento|gravidade|gravitacional|orbita|satelite|momento linear|quantidade de movimento|colisao|impulso|
torque|alavanca|polia|roldana|equilibrio de corpos|centro de massa|mola|elastic|pendulo|periodo de oscilacao|fotovoltaic|efeito fotoeletrico|
radiacao (ultravioleta|infravermelha|eletromagnetica)|luz (visivel|branca)|arco-iris|prisma|fibra optica|raio[s]? x|laser|
usina (hidreletrica|eolica|nuclear|termeletrica)|gerador|transformador|motor eletrico|energia eletrica|consumo de energia|vetor'''

QUI = r'''molecula|atomo|ion[s]?\b|ionic|reacao quimica|equacao quimica|mol\b|mols\b|g/mol|massa molar|concentracao|solucao aquosa|soluto|solvente|
\bph\b|acid|basic|oxidacao|reducao|oxirreducao|eletrolise|pilha|catalis|polimero|organic|funcao organica|isomer|hidrocarboneto|combustao|
estequiometr|ligacao (quimica|covalente|ionica)|tabela periodica|elemento quimico|precipit|sal\b|sais\b|dioxido|monoxido|oxigenio|nitrogenio|
carbono|enxofre|sodio|potassio|calcio|cloro|ferro|aluminio|cobre|chumbo|mercurio|ozonio|metano|etanol|glicose|ester|amina|detergente|sabao|
radioativ|meia-vida|decaimento|isotopo|entalpia|exotermic|endotermic|equilibrio quimico|cinetica quimica|titulacao|destilacao|filtracao|
decantacao|mistura|substancia|composto'''

BIO = r'''celula|celular|dna|rna|gene|genetic|cromossom|proteina|enzima|organismo|especie|evolucao|selecao natural|ecossistema|cadeia alimentar|
populacao|bacteria|virus|fungo|parasita|doenca|vacina|anticorpo|sistema imunologico|hormonio|sangue|figado|rim|pulmao|coracao|neuronio|
fotossintese|respiracao celular|mitocondria|cloroplasto|planta|vegetal|animal|inseto|mamifero|reproducao|embriao|mutacao|heranca|
bioma|desmatamento|biodiversidade|nutriente|vitamina|metabolismo|sistema digestorio|mosquito|dengue'''

PAT = {k: re.compile(v.replace('\n', ''), re.I) for k, v in (('fis', FIS), ('qui', QUI), ('bio', BIO))}
UNIT = re.compile(r'\d\s?(m/s|km/h|m/s2|m/s²|\bn\b|newtons?|\bj\b|joules?|kj\b|\bw\b|kw\b|kwh|mw\b|\bv\b|volts?|\ba\b|\bma\b|ohms?|ω|hz|khz|mhz|ghz|db\b|kcal|\bcal\b|°c|\bk\b|atm\b|\bpa\b|kpa|mmhg|nm\b|kg/m3|kg/m³|g/cm3|g/cm³|rpm)', re.I)
CHEM = re.compile(r'\b(?:[A-Z][a-z]?\d*){2,}\b|\b(?:CO2|H2O|O2|N2|H2|CH4|NaCl|NH3|SO2|NO2|HCl|H2SO4|CaCO3)\b')
STRONG_Q = re.compile(r'\bmol\b|g/mol|reacao quimica|equacao quimica|\bph\b|ligac|isomer|funcao organica|oxidacao|reducao|eletrolise|estequiometr|concentracao|entalpia|polimer|ester\b|acido|base\b', re.I)
STRONG_B = re.compile(r'celula|dna|rna|\bgene|genetic|especie|organismo|evolu|ecossistema|bacteria|virus|doenca|proteina|enzima|hormonio|fotossintese', re.I)

# Conferidas manualmente, questão a questão (ENEM 2009–2025 e reaplicações 2017–2025):
# números das questões de Física em Ciências da Natureza. Edições fora desta lista caem no classificador.
FISICA_ENEM = {
    '2009': {5, 14, 17, 18, 19, 20, 27, 30, 31, 32, 35, 37, 38, 39, 45},
    '2010': {47, 48, 50, 52, 56, 58, 68, 70, 78, 81, 84, 89},
    '2011': {46, 56, 60, 63, 66, 67, 70, 73, 74, 77, 78, 84, 86},
    '2012': {47, 50, 54, 55, 60, 61, 64, 67, 71, 72, 73, 74, 77, 78, 83, 84, 88},
    '2013': {48, 52, 57, 61, 65, 66, 72, 75, 76, 79, 82, 83, 85, 87, 89},
    '2014': {46, 50, 55, 57, 64, 66, 67, 68, 72, 76, 82, 84, 87},
    '2015': {49, 53, 57, 63, 64, 65, 68, 70, 73, 75, 79, 82, 85, 86, 88},
    '2016': {47, 49, 54, 55, 57, 59, 63, 66, 74, 77, 82, 84, 86, 88},
    '2017': {93, 99, 101, 103, 107, 108, 110, 112, 115, 127, 129, 131, 133},
    '2017-reaplicacao': {91, 94, 98, 101, 104, 107, 110, 112, 117, 118, 121, 124, 126, 129, 132, 135},
    '2018': {95, 97, 103, 104, 108, 112, 115, 118, 120, 122, 125, 128, 131, 134},
    '2018-reaplicacao': {91, 100, 101, 102, 105, 107, 110, 114, 120, 121, 126, 128, 131, 135},
    '2019': {92, 94, 98, 102, 106, 109, 111, 113, 117, 119, 121, 126, 131, 132, 134, 135},
    '2019-reaplicacao': {91, 100, 102, 103, 106, 112, 124, 132, 135},
    '2020': {91, 93, 98, 99, 105, 106, 107, 109, 111, 113, 114, 116, 120, 126, 128, 130, 133},
    '2020-reaplicacao': {91, 95, 96, 99, 105, 110, 117, 121, 122, 124, 127, 128, 129},
    '2021': {92, 94, 99, 100, 102, 105, 107, 108, 109, 115, 125, 126, 128, 131, 133, 134},
    '2021-reaplicacao': {99, 101, 104, 111, 112, 113, 119, 120, 121, 125, 126, 127, 132},
    '2022': {93, 95, 96, 100, 103, 105, 111, 112, 115, 116, 119, 123, 128, 134, 135},
    '2022-reaplicacao': {95, 99, 104, 105, 107, 111, 115, 118, 119, 122, 123, 127, 128, 131, 135},
    '2023': {100, 108, 109, 111, 112, 113, 114, 117, 120, 122, 124, 128, 131, 132, 135},
    '2023-reaplicacao': {100, 101, 102, 104, 105, 106, 107, 110, 122, 125, 126, 131, 132, 133, 135},
    '2024': {91, 96, 99, 100, 101, 103, 106, 119, 121, 122, 127, 129, 130, 131, 132},
    '2024-reaplicacao': {91, 98, 100, 103, 104, 105, 107, 115, 117, 121, 124, 126, 128, 133},
    '2025': {94, 95, 101, 108, 113, 114, 118, 119, 120, 122, 126, 128, 130, 132},
    '2025-reaplicacao': {104, 106, 107, 112, 115, 121, 122, 129, 130},
}

def score(text):
    t = norm(text)
    f = len(PAT['fis'].findall(t)) + 1.5 * len(UNIT.findall(t))
    q = len(PAT['qui'].findall(t)) + 2 * len(STRONG_Q.findall(t)) + 1.5 * len(set(m for m in CHEM.findall(text) if re.search(r'\d', m)))
    b = len(PAT['bio'].findall(t)) + 2 * len(STRONG_B.findall(t))
    return {'fis': round(f, 1), 'qui': round(q, 1), 'bio': round(b, 1)}

def classify_cn(text, key=None):
    if key:
        ed, _, n = key.rpartition('-')
        if ed in FISICA_ENEM: return ('fis' if int(n) in FISICA_ENEM[ed] else 'outra'), {}
    sc = score(text)
    best = max(sc, key=sc.get)
    return (best if sc[best] > 0 else 'qui'), sc

# ---------------------------------------------------------------- Ciências Humanas e Natureza (Química × Biologia)
CH = {
 'geo': r'''clima|climatic|relevo|bacia|hidrograf|rio |rios |urbaniz|metropol|megalop|populac|demograf|migra|agropecu|agricul|agronegoc|latifund|industrializ|globaliz|territor|fronteira|cartograf|mapa|escala|latitude|longitude|
desmatamento|bioma|solo|erosao|energia|recursos hidricos|espaco geografico|regiao|regional|idh|fuso|placas tectonicas|vegetacao|chuva|seca|el nino|commodit|exportac|paisagem|
mineracao|petroleo|litoral|cerrado|amazonia|caatinga|semiarido|desertific|aquifero|hidreletric|transporte|rodovi|ferrovi|logistic|fluxo|rede urbana|cidade|campo|rural|
ambiental|meio ambiente|sustentab|aquecimento global|efeito estufa|geopolit|bloco econom|mercosul|imigrante|refugiad|densidade''',
 'his': r'''seculo|colonial|colonia|imperio|imperial|republica|escraviz|escravid|escravo|revolucao|revolucion|guerra|ditadura|regime militar|monarquia|\brei\b|rainha|medieval|feudal|idade media|antiguidade|
grecia|grego|roma|romano|vargas|independencia|abolic|periodo|\bera\b|getulio|imperador|colonizac|portugues|jesuit|bandeirant|quilomb|oligarqu|coronel|tenent|integralis|
nazis|fascis|guerra fria|urss|sovietic|renascimento|reforma protestante|iluminis|absolutis|mercantilis|burguesia|operari|sindicat|1[5-9]\d\d|18\d\d|19[0-8]\d|cruzad|napoleao|constituicao de 1''',
 'fil': r'''filosof|filosofo|razao|etica|moral|conhecimento|verdade|platao|aristoteles|socrates|kant|descartes|nietzsche|hobbes|locke|rousseau|maquiavel|hegel|sartre|beauvoir|arendt|foucault|
adorno|horkheimer|habermas|bauman|bourdieu|sociolog|durkheim|weber|marx|cultura|ideologia|alienac|virtude|liberdade|existenc|estado de natureza|contrato social|
cidadania|democracia|poder|dominac|individuo|sujeito|consciencia|religi|mito|logos|felicidade|justica|direitos humanos|trabalho|capitalis|consumo|industria cultural|
genero|feminis|racismo|preconceito|desigualdade|movimento social|identidade|etnocentr|diversidade cultural'''}
CHP = {k: re.compile(v.replace('\n', ''), re.I) for k, v in CH.items()}
AUTHORS = re.compile(r'\b(PLAT[AÃ]O|ARIST[OÓ]TELES|KANT|DESCARTES|NIETZSCHE|HOBBES|LOCKE|ROUSSEAU|MAQUIAVEL|HEGEL|SARTRE|BEAUVOIR|ARENDT|FOUCAULT|ADORNO|HABERMAS|BAUMAN|BOURDIEU|DURKHEIM|WEBER|MARX|ESPINOSA|HUME|BACON|AGOSTINHO|TOM[AÁ]S DE AQUINO|MONTAIGNE|PASCAL|S[EÊ]NECA|EPICURO|SCHOPENHAUER|KIERKEGAARD|MERLEAU|WITTGENSTEIN|POPPER|KUHN|RAWLS|MILL|BENTHAM|TOCQUEVILLE|MONTESQUIEU|VOLTAIRE|COMTE|GRAMSCI|CHAU[IÍ]|BOBBIO|ELIAS|GIDDENS|CASTELLS|LATOUR|AGAMBEN|DELEUZE|DERRIDA|LEVINAS|BENJAMIN|MARCUSE|FROMM|SIMMEL|TOURAINE|LIPOVETSKY|HAN, B)\b')

def score_ch(text):
    t = norm(text)
    sc = {k: len(p.findall(t)) for k, p in CHP.items()}
    sc['fil'] += 4 * len(AUTHORS.findall(text))
    return sc

def classify_ch(text, key=None):
    if key in CH_OVERRIDE: return CH_OVERRIDE[key], {}
    sc = score_ch(text); best = max(sc, key=sc.get)
    return (best if sc[best] > 0 else 'his'), sc

def classify_qb(text, key=None):
    """Química × Biologia (para as questões de Natureza que não são de Física)."""
    if key in QB_OVERRIDE: return QB_OVERRIDE[key], {}
    sc = score(text)
    return ('qui' if sc['qui'] >= sc['bio'] else 'bio'), sc

# Revisão manual das questões de Ciências Humanas do ENEM em que a classificação automática errava.
# Formato: (curso, edição) -> números das questões.
CH_FIX = {
    ('fil', '2009'): [54],
    ('geo', '2009'): [55, 68],
    ('his', '2009'): [46, 47, 52, 53, 70, 74, 84],
    ('fil', '2010'): [36],
    ('geo', '2010'): [8, 37],
    ('his', '2010'): [10, 11, 12, 13, 16, 18, 21, 42],
    ('fil', '2011'): [18, 23, 30],
    ('geo', '2011'): [14],
    ('his', '2011'): [19, 36, 43],
    ('his', '2012'): [5, 6, 8, 17],
    ('his', '2013'): [5, 6, 12, 26, 31, 39],
    ('fil', '2014'): [5, 8, 12, 19, 29],
    ('geo', '2014'): [36],
    ('his', '2014'): [2, 28, 32, 42],
    ('fil', '2015'): [3, 17, 35, 41],
    ('geo', '2015'): [4, 21, 38],
    ('his', '2015'): [5, 11, 14, 20, 37, 44],
    ('fil', '2016'): [7, 41, 42],
    ('geo', '2016'): [16, 39],
    ('his', '2016'): [14, 26, 27, 33, 34, 43],
    ('fil', '2017'): [67],
    ('geo', '2017'): [77],
    ('his', '2017'): [62, 63, 78, 80],
    ('fil', '2017-reaplicacao'): [90],
    ('geo', '2017-reaplicacao'): [85],
    ('his', '2017-reaplicacao'): [48, 83, 86],
    ('fil', '2018'): [80, 87],
    ('geo', '2018'): [63, 81, 89],
    ('his', '2018'): [50, 57, 58, 61, 68, 69, 76, 84],
    ('fil', '2018-reaplicacao'): [46],
    ('geo', '2018-reaplicacao'): [64, 87],
    ('his', '2018-reaplicacao'): [52, 60, 66, 67, 85],
    ('geo', '2019'): [56, 57, 59],
    ('his', '2019'): [54, 60, 79, 82, 84],
    ('fil', '2019-reaplicacao'): [73],
    ('his', '2019-reaplicacao'): [66, 70],
    ('fil', '2020'): [69],
    ('his', '2020'): [62, 66, 68, 75],
    ('geo', '2020-reaplicacao'): [49, 56, 62, 63, 75, 76, 83],
    ('his', '2020-reaplicacao'): [55, 59, 60, 68, 72, 74],
    ('geo', '2021'): [89],
    ('his', '2021'): [49, 67, 69, 74, 88],
    ('fil', '2021-reaplicacao'): [90],
    ('geo', '2021-reaplicacao'): [47, 65, 83],
    ('his', '2021-reaplicacao'): [46, 51, 53, 54, 74, 81, 82],
    ('fil', '2022'): [48, 60],
    ('his', '2022'): [58, 89],
    ('geo', '2022-reaplicacao'): [47, 90],
    ('his', '2022-reaplicacao'): [57, 60, 65, 72, 76, 87],
    ('fil', '2023'): [88, 90],
    ('his', '2023'): [51, 62, 65, 70, 80, 82, 87],
    ('fil', '2023-reaplicacao'): [87],
    ('his', '2023-reaplicacao'): [65, 69, 76, 82, 85, 88],
    ('fil', '2024'): [78, 82],
    ('geo', '2024'): [48],
    ('his', '2024'): [84, 85],
    ('geo', '2024-reaplicacao'): [52, 58],
    ('his', '2024-reaplicacao'): [47, 63, 74],
    ('fil', '2025'): [72],
    ('geo', '2025'): [46, 68],
    ('his', '2025'): [52, 78, 85, 87],
    ('fil', '2025-reaplicacao'): [48, 53, 60],
    ('his', '2025-reaplicacao'): [57, 74, 76, 78, 86],
}
CH_OVERRIDE = {f'{ed}-{n}': c for (c, ed), ns in CH_FIX.items() for n in ns}
# Revisão manual das questões de Natureza (não Física) do ENEM em que a separação Química × Biologia errava.
QB_FIX = {
    ('bio', '2009'): [34],
    ('qui', '2009'): [40],
    ('bio', '2010'): [86, 87, 88],
    ('bio', '2011'): [48, 49, 64, 88],
    ('bio', '2012'): [68],
    ('qui', '2012'): [46, 76, 79],
    ('bio', '2013'): [59],
    ('bio', '2014'): [75],
    ('qui', '2014'): [49, 52],
    ('bio', '2015'): [47, 61, 67, 69],
    ('bio', '2016'): [69],
    ('qui', '2016'): [64, 67],
    ('bio', '2017'): [94, 132],
    ('bio', '2017-reaplicacao'): [102, 127, 134],
    ('bio', '2018'): [127],
    ('qui', '2018'): [105, 116],
    ('bio', '2018-reaplicacao'): [99, 125, 129],
    ('bio', '2019'): [95, 97, 100, 107],
    ('qui', '2019'): [104],
    ('bio', '2019-reaplicacao'): [111, 114, 117],
    ('qui', '2019-reaplicacao'): [108],
    ('bio', '2020'): [118],
    ('qui', '2020'): [103],
    ('bio', '2020-reaplicacao'): [98, 123, 130],
    ('qui', '2020-reaplicacao'): [116, 120, 132],
    ('bio', '2021'): [110, 127],
    ('qui', '2021'): [124],
    ('bio', '2021-reaplicacao'): [109, 131],
    ('qui', '2021-reaplicacao'): [123],
    ('bio', '2022'): [120],
    ('qui', '2022'): [97],
    ('bio', '2022-reaplicacao'): [109, 114],
    ('qui', '2022-reaplicacao'): [96],
    ('bio', '2023'): [92, 95, 97],
    ('qui', '2023'): [129, 130],
    ('bio', '2023-reaplicacao'): [91, 114, 121, 123],
    ('bio', '2024'): [107, 111],
    ('qui', '2024'): [92],
    ('bio', '2024-reaplicacao'): [99, 111, 114],
    ('qui', '2024-reaplicacao'): [110, 127],
    ('bio', '2025'): [102, 105, 129],
    ('qui', '2025'): [127, 134, 135],
    ('bio', '2025-reaplicacao'): [99, 120],
}
QB_OVERRIDE = {f'{ed}-{n}': c for (c, ed), ns in QB_FIX.items() for n in ns}
