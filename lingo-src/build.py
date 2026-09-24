#!/usr/bin/env python3
"""Monta o SaberLingo (app de arquivo único com várias matérias) a partir das fontes compartilhadas.
Cada matéria vira um pacote em PACKS, carregado só quando é o curso escolhido.
Uso: python3 lingo-src/build.py"""
import os, re, json
D = os.path.dirname(os.path.abspath(__file__)); ROOT = os.path.dirname(D)
rd = lambda f: open(os.path.join(D, f), encoding='utf-8').read()
OUT = 'SaberLingo'
# id, nome, ícone, cor, cor escura, descrição, arquivos de conteúdo
COURSES = [
    ('mat', 'Matemática', '➗', '#58cc02', '#58a700', 'Do Fundamental I ao Ensino Médio', ['content-mat.js', 'content-mat2.js', 'content-mat3.js', 'oficiais-mat.js']),
    ('por', 'Português', '📝', '#ce82ff', '#a568cc', 'Gramática, interpretação e literatura', ['content-por.js', 'oficiais-por.js']),
    ('fis', 'Física', '⚛️', '#1cb0f6', '#1899d6', 'Do 9º ano ao Ensino Médio', ['content-fis.js', 'content-fis2.js', 'content-fis3.js', 'oficiais-fis.js']),
    ('qui', 'Química', '🧪', '#ff9600', '#e07b00', 'Da matéria à química orgânica', ['content-qui.js', 'oficiais-qui.js']),
    ('bio', 'Biologia', '🧬', '#2bb673', '#1f8f57', 'Da célula à ecologia', ['content-bio.js', 'oficiais-bio.js']),
    ('his', 'História', '🏛️', '#e2735a', '#b85a44', 'Geral e do Brasil', ['content-his.js', 'oficiais-his.js']),
    ('geo', 'Geografia', '🌎', '#2b70c9', '#1f569e', 'Física, humana e do Brasil', ['content-geo.js', 'oficiais-geo.js']),
    ('fil', 'Filosofia e Sociologia', '💭', '#ff6fb5', '#d4509a', 'Dos gregos à sociologia brasileira', ['content-fil.js', 'oficiais-fil.js']),
]
GLOBALS = ['BRAND', 'UNITS', 'GLOSS', 'CARDS', 'FUVQ', 'OFICIAIS_MAN']
packs = []; built = []
for cid, name, icon, color, dark, desc, files in COURSES:
    src = ''.join(rd(f) for f in files if os.path.exists(os.path.join(D, f)))
    if not src.strip(): continue
    # as declarações globais do conteúdo passam a preencher os globais do app
    src = re.sub(r'^const (' + '|'.join(GLOBALS) + r')=', r'\1=', src, flags=re.M)
    meta = json.dumps({'id': cid, 'name': name, 'icon': icon, 'color': color, 'dark': dark, 'desc': desc}, ensure_ascii=False)
    built.append(cid)
    packs.append(f'/* ================= Curso: {name} ================= */\nPACKS[{json.dumps(cid)}]=Object.assign({meta},{{load(){{\n{src}\n}}}});\n')
head = 'let ' + ','.join(GLOBALS) + ';\nconst PACKS={};\nconst COURSE_ORDER=' + json.dumps(built) + ';\n'
html = rd('head.html') + rd('core.js') + head + ''.join(packs) + rd('courses.js') + rd('engine.js') + rd('fuvest.js') + rd('ui.js')
os.makedirs(os.path.join(ROOT, OUT), exist_ok=True)
open(os.path.join(ROOT, OUT, 'index.html'), 'w', encoding='utf-8').write(html)
print(OUT, len(html), 'bytes;', 'cursos:', ', '.join(built))
