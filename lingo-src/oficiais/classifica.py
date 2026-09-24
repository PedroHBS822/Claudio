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
