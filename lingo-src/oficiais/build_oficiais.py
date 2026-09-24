#!/usr/bin/env python3
"""Converte provas oficiais (FUVEST 1ª fase e ENEM) em bancos de questões do SaberLingo (uma pasta por matéria).

Fontes (clonar antes de rodar):
  FUVEST 2018–2024: BLUEX (github.com/Portuguese-Benchmark-Datasets/BLUEX) — descompacte
                    data/bluex_dataset.zip em --bluex
  ENEM 2009–2025:   updated-enem-api, branch fix/alternativas-e-gabaritos-dos-cadernos-oficiais
                    (github.com/migueldsants/updated-enem-api) — pasta public/ em --enem
Uso: python3 lingo-src/oficiais/build_oficiais.py --bluex /tmp/bluex --enem /tmp/upd/public

Saída: <App>/provas/<prova>.js (questões + figuras em WebP embutidas, carregadas sob demanda)
       lingo-src/oficiais-mat.js e lingo-src/oficiais-fis.js (índice das provas, embutido no app)
"""
import argparse, base64, glob, html, io, json, os, re, sys
from PIL import Image

D = os.path.dirname(os.path.abspath(__file__)); SRC = os.path.dirname(D); ROOT = os.path.dirname(SRC)
sys.path.insert(0, D)
from classifica import classify_cn, classify_ch, classify_qb

LET = 'ABCDE'
IMG_CACHE = {}

def img_uri(path, maxw=760, q=58):
    if path in IMG_CACHE: return IMG_CACHE[path]
    im = Image.open(path)
    if im.mode in ('RGBA', 'LA', 'P'):
        im = im.convert('RGBA'); bg = Image.new('RGB', im.size, 'white'); bg.paste(im, mask=im.split()[-1]); im = bg
    else: im = im.convert('RGB')
    if im.width > maxw: im = im.resize((maxw, round(im.height * maxw / im.width)), Image.LANCZOS)
    b = io.BytesIO(); im.save(b, 'WEBP', quality=q, method=6)
    uri = 'data:image/webp;base64,' + base64.b64encode(b.getvalue()).decode()
    IMG_CACHE[path] = (uri, im.width, im.height)
    return IMG_CACHE[path]

def img_tag(path, cls='qimg'):
    uri, w, h = img_uri(path)
    return f'<img class="{cls}" src="{uri}" width="{w}" height="{h}" alt="Figura da questão" loading="lazy">'

# ---------------------------------------------------------------- notação
def balanced(s, i):
    """s[i]=='(' → índice do ')' correspondente."""
    d = 0
    for j in range(i, len(s)):
        if s[j] == '(': d += 1
        elif s[j] == ')':
            d -= 1
            if d == 0: return j
    return -1

def scripts(s):
    """x^2 → x<sup>2</sup>, 10^(-3) → 10<sup>−3</sup>, a_(n-1) → a<sub>n−1</sub>, sqrt( → √("""
    s = re.sub(r'\bsqrt\s*\(', '√(', s)
    out = []; i = 0
    while i < len(s):
        c = s[i]
        if c in '^_' and i > 0 and i + 1 < len(s) and (s[i-1].isalnum() or s[i-1] in ')]}'):
            tag = 'sup' if c == '^' else 'sub'
            if s[i+1] == '(':
                j = balanced(s, i + 1)
                if j > 0:
                    out.append(f'<{tag}>{s[i+2:j]}</{tag}>'); i = j + 1; continue
            m = re.match(r'[‐\-−–]?[0-9A-Za-zα-ωΑ-Ω.,]+', s[i+1:]) if c == '^' else re.match(r'[0-9A-Za-z]+', s[i+1:])
            if m:
                tok = m.group(0).rstrip('.,')
                out.append(f'<{tag}>{tok}</{tag}>'); i += 1 + len(tok); continue
        out.append(c); i += 1
    s = ''.join(out)
    return re.sub(r'<(sup|sub)>[‐\-–]', r'<\1>−', s)

def math_fix(s):
    s = re.sub(r'\(cid:\d+\)', '', s)
    s = re.sub(r'(\d)\s*[xX]\s*10\s*\^', r'\1 × 10^', s)
    s = re.sub(r'\s\*\s|(?<=[\w)])\*(?=[\w(√])', ' · ', s)
    return scripts(s)

# ---------------------------------------------------------------- FUVEST (BLUEX)
MARK = re.compile(r'^\s*(\[IMAGE|[IVX]{1,4}\s*[.)–-]|[•●▪–-]\s|\d{1,2}\s*[.)]\s|[a-e]\)\s|Note e adote|Dados?:|Considere)', re.I)

def fuv_text(t, imgs, base):
    t = t.replace('\r', '')
    lines = [re.sub(r'[ \t ]+', ' ', l).strip() for l in t.split('\n')]
    paras = []
    for l in lines:
        if not l: continue
        if paras and not MARK.match(l) and '|' not in l and '|' not in paras[-1] and not paras[-1].endswith(':'):
            paras[-1] += ' ' + l
        else: paras.append(l)
    outp = []; table = []
    def flush():
        if table:
            outp.append('<table class="qtab">' + ''.join('<tr>' + ''.join(f'<td>{c.strip()}</td>' for c in r.strip('|').split('|')) + '</tr>' for r in table) + '</table>')
            table.clear()
    for p in paras:
        p = math_fix(html.escape(p, quote=False))
        if '|' in p: table.append(p); continue
        flush(); outp.append(f'<p>{p}</p>')
    flush()
    h = ''.join(outp)
    def rep(m):
        k = int(m.group(1))
        if k >= len(imgs): raise ValueError('imagem ausente')
        return '</p>' + img_tag(os.path.join(base, imgs[k])) + '<p>'
    h = re.sub(r'\[IMAGE (\d+)\]', rep, h)
    return re.sub(r'<p>\s*</p>', '', h)

def fuv_alt(a, imgs, base):
    a = re.sub(r'^\s*[a-eA-E]\s*\)\s*', '', a).strip()
    m = re.fullmatch(r'\[IMAGE (\d+)\]', a)
    if m:
        k = int(m.group(1))
        if k >= len(imgs): raise ValueError('imagem ausente')
        return img_tag(os.path.join(base, imgs[k]), 'altimg')
    if not a: raise ValueError('alternativa vazia')
    return math_fix(html.escape(re.sub(r'\s+', ' ', a), quote=False))

SUBJ = {'mat': 'mathematics', 'por': 'portuguese', 'fis': 'physics', 'qui': 'chemistry', 'bio': 'biology',
        'his': 'history', 'geo': 'geography', 'fil': 'philosophy'}

def load_fuvest(bluex):
    out = {c: {} for c in SUBJ}; skipped = []
    for f in sorted(glob.glob(os.path.join(bluex, 'questions/USP/*/*.json'))):
        q = json.load(open(f, encoding='utf-8')); subj = set(q['subject'])
        areas = [a for a, s in SUBJ.items() if s in subj]
        if not areas: continue
        year = int(q['id'].split('_')[1]); num = q['number']
        if q['answer'] not in list(LET) or len(q['alternatives']) != 5:
            skipped.append((q['id'], 'sem gabarito (anulada)' if q['answer'] is None else 'formato')); continue
        try:
            item = {'id': f'fuv{year}-{num}', 'n': num, 'q': fuv_text(q['question'], q['associated_images'], bluex),
                    'alts': [fuv_alt(a, q['associated_images'], bluex) for a in q['alternatives']], 'ans': LET.index(q['answer'])}
            if len(set(item['alts'])) < 5: raise ValueError('alternativas repetidas (erro na fonte)')
        except ValueError as e:
            skipped.append((q['id'], str(e))); continue
        for a in areas:
            out[a].setdefault(year, []).append(dict(item, area=AREA[a]))
    return out, skipped

# ---------------------------------------------------------------- ENEM
WRAP_END = re.compile(r'[.!?:;…"”»]\s*$')
def unwrap(p):
    """Junta as quebras de linha que vêm só da diagramação do PDF (prosa), preservando versos.
    Um parágrafo é tratado como prosa quando tem frase terminando no meio de uma linha ou linhas longas;
    aí a quebra some se a linha seguinte começa com minúscula e a anterior não fecha a frase.
    Linhas terminadas em dois espaços (quebra explícita do markdown) são sempre mantidas."""
    lines = p.split('\n')
    if len(lines) < 2: return p
    prose = any(re.search(r'[a-zà-ú]{2}[”"»)]?[.!?][”"»]? +[A-ZÀ-Ú“"]', l) for l in lines) or max(len(l) for l in lines) > 70
    if not prose: return '<br>'.join(lines)
    out = lines[0]
    for l in lines[1:]:
        if out.endswith('  '): out = out.rstrip() + '<br>' + l  # quebra explícita do markdown (versos)
        elif out.endswith('-') and re.match(r'[a-zà-ú]', l): out = out[:-1] + l
        elif re.match(r'\s*[a-zà-ú(\d]', l) and not WRAP_END.search(out) and '\x00' not in l[:3]: out += ' ' + l.strip()
        else: out += '<br>' + l
    return out

def md(t, qdir):
    if not t: return ''
    t = t.replace('\r', '').replace(' ', ' ')
    t = re.sub(r'\^\{\s*([^}]*?)\s*\}(?:\d*​[−\-\d\s\t]*​+)?', lambda m: '^(' + m.group(1).replace('-', '−') + ')', t)
    t = re.sub(r'(\d)​([−\-]?\d+)​+', r'\1^(\2)', t)
    t = t.replace('​', '')
    imgs = []
    def keep_img(m):
        imgs.append(os.path.join(qdir, m.group(1).split('/')[-1])); return f'\x00IMG{len(imgs)-1}\x00'
    t = re.sub(r'!\[[^\]]*\]\((\S+?)(?:\s+"[^"]*")?\)', keep_img, t)
    t = re.sub(r'\[([^\]]+)\]\((https?://[^)]+)\)', r'\1', t)
    t = html.escape(t, quote=False)
    t = re.sub(r'&lt;(/?)(sub|sup)&gt;', r'<\1\2>', t)
    t = re.sub(r'\*{4,}', '**', t)
    t = re.sub(r'\*\*((?:(?!\n\s*\n).)+?)\*\*', r'<b>\1</b>', t, flags=re.S)
    t = re.sub(r'(?<![A-Za-z0-9\\])_(?!_)([^_\n]+?)_(?![A-Za-z0-9])', r'<i>\1</i>', t)
    t = re.sub(r'\\([*_#])', r'\1', t)
    t = scripts(t)
    paras = [p.strip() for p in re.split(r'\n\s*\n', t) if p.strip()]
    h = ''.join('<p>' + unwrap(p) + '</p>' for p in paras)
    def put(m):
        p = imgs[int(m.group(1))]
        if not os.path.exists(p): raise ValueError('figura ausente ' + p)
        return '</p>' + img_tag(p) + '<p>'
    h = re.sub(r'\x00IMG(\d+)\x00', put, h)
    return re.sub(r'<p>\s*(<br>\s*)*</p>', '', h)

def enem_area(ed, idx):
    y = int(ed[:4])
    if 136 <= idx <= 180: return 'MT'
    if y >= 2017: return 'LC' if idx <= 45 else 'CH' if idx <= 90 else 'CN'
    if y == 2009: return 'CN' if idx <= 45 else 'CH' if idx <= 90 else 'LC'
    return 'CH' if idx <= 45 else 'CN' if idx <= 90 else 'LC'

def load_enem(root):
    out = {c: {} for c in SUBJ}; skipped = []
    for ed_dir in sorted(glob.glob(os.path.join(root, '20*'))):
        ed = os.path.basename(ed_dir)
        for f in sorted(glob.glob(os.path.join(ed_dir, 'questions/*/details.json'))):
            d = json.load(open(f, encoding='utf-8')); idx = d['index']; area = enem_area(ed, idx)
            if d.get('language') or area is None: continue
            qdir = os.path.dirname(f)
            # limpa ruídos de extração: cabeçalho "ENEM 2022" repetido e a letra da alternativa
            # seguinte colada no fim do texto (reaplicações 2022 e 2023)
            intro = re.sub(r'\s+A\s*$', '', d.get('alternativesIntroduction') or '')
            ctx = re.sub(r'(?:ENEM 20\d\d\s*){2,}', '', d.get('context') or '') + '\n\n' + intro
            for i, a in enumerate(d['alternatives'][:4]):
                if a.get('text'): a['text'] = re.sub(r'\s+' + LET[i + 1] + r'\s*$', '', a['text'])
            full = ctx + ' ' + ' '.join(a.get('text') or '' for a in d['alternatives']); key = f'{ed}-{idx}'
            if area == 'MT': app = 'mat'
            elif area == 'LC': app = 'por'
            elif area == 'CH': app = classify_ch(full, key)[0]
            elif classify_cn(full, key)[0] == 'fis': app = 'fis'
            else: app = classify_qb(full, key)[0]
            ans = d.get('correctAlternative')
            if ans not in list(LET) or len(d['alternatives']) != 5:
                skipped.append((f'{ed}/{idx}', 'sem gabarito/anulada')); continue
            try:
                alts = []
                for a in d['alternatives']:
                    if a.get('file'):
                        p = os.path.join(qdir, a['file'].split('/')[-1])
                        if not os.path.exists(p): raise ValueError('figura ausente')
                        alts.append((md(a.get('text'), qdir) if a.get('text') else '') + img_tag(p, 'altimg'))
                    else:
                        t = md(a.get('text') or '', qdir)
                        if not t: raise ValueError('alternativa vazia')
                        alts.append(re.sub(r'^<p>(.*)</p>$', r'\1', t))
                item = {'id': f'enem{ed.replace("-reaplicacao", "r")}-{idx}', 'n': idx, 'q': md(ctx, qdir), 'alts': alts,
                        'ans': LET.index(ans), 'area': AREA[app]}
                if not item['q']: raise ValueError('enunciado vazio')
                if len(set(alts)) < 5: raise ValueError('alternativas repetidas (erro na fonte)')
            except ValueError as e:
                skipped.append((f'{ed}/{idx}', str(e))); continue
            out[app].setdefault(ed, []).append(item)
    return out, skipped

# ---------------------------------------------------------------- saída
APP_DIR = 'SaberLingo'
AREA = {'mat': 'Matemática', 'por': 'Português', 'fis': 'Física', 'qui': 'Química', 'bio': 'Biologia',
        'his': 'História', 'geo': 'Geografia', 'fil': 'Filosofia e Sociologia'}
SUB_ENEM = {'mat': 'Matemática e suas Tecnologias', 'por': 'Linguagens, Códigos e suas Tecnologias',
            'fis': 'Ciências da Natureza (Física)', 'qui': 'Ciências da Natureza (Química)', 'bio': 'Ciências da Natureza (Biologia)',
            'his': 'Ciências Humanas (História)', 'geo': 'Ciências Humanas (Geografia)', 'fil': 'Ciências Humanas (Filosofia e Sociologia)'}

def enem_day(course, y):
    """Até 2016: 1º dia = Humanas + Natureza, 2º dia = Linguagens + Matemática.
    A partir de 2017: 1º dia = Linguagens + Humanas, 2º dia = Natureza + Matemática."""
    if course == 'mat': return '2º dia'
    if course in ('his', 'geo', 'fil'): return '1º dia'
    if course == 'por': return '2º dia' if y <= 2016 else '1º dia'
    return '1º dia' if y <= 2016 else '2º dia'

def write(course, fuv, enem):
    pdir = os.path.join(ROOT, APP_DIR, 'provas', course); os.makedirs(pdir, exist_ok=True)
    for f in glob.glob(os.path.join(pdir, '*.js')): os.remove(f)
    man = []; files = {}; total = 0
    def add(pid, fname, meta, qs):
        nonlocal total
        qs.sort(key=lambda q: q['n'])
        files.setdefault(fname, []).append((pid, qs))
        man.append(dict(meta, id=pid, n=len(qs), file=f'provas/{course}/{fname}')); total += len(qs)
    for y in sorted(fuv, reverse=True):
        add(f'fuvest-{y}', f'fuvest-{y}.js', {'exam': 'FUVEST', 'year': y, 'label': f'FUVEST {y}', 'sub': '1ª fase · Conhecimentos Gerais', 'ed': 'regular'}, fuv[y])
    for ed in sorted(enem, key=lambda e: (e[:4], e), reverse=True):
        y = int(ed[:4]); rea = ed.endswith('reaplicacao')
        add(f'enem-{ed}', f'enem-{y}.js', {'exam': 'ENEM', 'year': y, 'label': f'ENEM {y}' + (' · Reaplicação' if rea else ''),
                                          'sub': f'{enem_day(course, y)} · {SUB_ENEM[course]}', 'ed': 'reaplicacao' if rea else 'regular'}, enem[ed])
    for fname, items in files.items():
        with open(os.path.join(pdir, fname), 'w', encoding='utf-8') as fh:
            for pid, qs in items:
                fh.write(f'OFICIAIS_ADD({json.dumps(pid)},{json.dumps(qs, ensure_ascii=False, separators=(",", ":"))});\n')
    for m in man: m['kb'] = os.path.getsize(os.path.join(ROOT, APP_DIR, m['file'])) // 1024
    with open(os.path.join(SRC, f'oficiais-{course}.js'), 'w', encoding='utf-8') as fh:
        fh.write('/* Índice das provas oficiais (gerado por lingo-src/oficiais/build_oficiais.py) */\n')
        fh.write('const OFICIAIS_MAN=' + json.dumps(man, ensure_ascii=False, separators=(',', ':')) + ';\n')
    print(course, total, 'questões em', len(man), 'provas,', len(files), 'arquivos,', sum(os.path.getsize(os.path.join(pdir, f)) for f in files) // 1024, 'KB')

if __name__ == '__main__':
    ap = argparse.ArgumentParser(); ap.add_argument('--bluex', required=True); ap.add_argument('--enem', required=True)
    a = ap.parse_args()
    fuv, s1 = load_fuvest(a.bluex); enem, s2 = load_enem(a.enem)
    for k, why in s1 + s2: print('  ignorada', k, '—', why)
    for c in SUBJ: write(c, fuv[c], enem[c])
