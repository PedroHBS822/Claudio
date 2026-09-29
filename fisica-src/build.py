#!/usr/bin/env python3
"""Monta FisicaDoZero/index.html a partir das fontes deste diretório."""
import os
SRC = os.path.dirname(os.path.abspath(__file__))
OUT = os.path.join(SRC, '..', 'FisicaDoZero', 'index.html')
JS = ['core.js', 'sims1.js', 'sims2.js', 'sims3.js', 'les1.js', 'les2.js', 'les3.js']
head = open(os.path.join(SRC, 'head.html'), encoding='utf-8').read()
js = '\n'.join(open(os.path.join(SRC, f), encoding='utf-8').read() for f in JS)
html = head + '\n<script>\n"use strict";\n' + js + '\nif(document.body) boot(); else addEventListener(\'DOMContentLoaded\',boot);\n</script>\n'
os.makedirs(os.path.dirname(OUT), exist_ok=True)
open(OUT, 'w', encoding='utf-8').write(html)
print('FisicaDoZero/index.html', len(html.encode()), 'bytes')
