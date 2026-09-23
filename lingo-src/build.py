#!/usr/bin/env python3
"""Monta os apps de arquivo único (MatLingo, FisLingo) a partir das fontes compartilhadas.
Uso: python3 lingo-src/build.py"""
import os,re
D=os.path.dirname(os.path.abspath(__file__)); ROOT=os.path.dirname(D)
rd=lambda f:open(os.path.join(D,f),encoding='utf-8').read()
APPS={'MatLingo':['content-mat.js','content-mat2.js','content-mat3.js'],'FisLingo':['content-fis.js','content-fis2.js','content-fis3.js']}
for app,content in APPS.items():
    c=''.join(rd(f) for f in content if os.path.exists(os.path.join(D,f)))
    b=lambda k:re.search(k+r":'([^']*)'",c).group(1)
    head=rd('head.html').replace('{{APP}}',app).replace('{{TUTOR}}',b('tutor')).replace('{{THEME}}',b('body')).replace('{{CHATPH}}',b('chatPh'))
    html=head+rd('core.js')+c+rd('engine.js')+rd('fuvest.js')+rd('ui.js')
    os.makedirs(os.path.join(ROOT,app),exist_ok=True)
    open(os.path.join(ROOT,app,'index.html'),'w',encoding='utf-8').write(html)
    print(app,len(html),'bytes')
