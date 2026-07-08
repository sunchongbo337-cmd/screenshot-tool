import zipfile
import xml.etree.ElementTree as ET
import sys
import io

sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

path = r'C:\Users\lenovo\Desktop\中期报告.docx'
with zipfile.ZipFile(path) as z:
    data = z.read('word/document.xml')
    root = ET.fromstring(data)
    ns = 'http://schemas.openxmlformats.org/wordprocessingml/2006/main'
    
    paras = []
    for p in root.iter(f'{{{ns}}}p'):
        texts = []
        style = ''
        pPr = p.find(f'{{{ns}}}pPr')
        if pPr is not None:
            pStyle = pPr.find(f'{{{ns}}}pStyle')
            if pStyle is not None:
                style = pStyle.get(f'{{{ns}}}val', '')
        for t in p.iter(f'{{{ns}}}t'):
            if t.text:
                texts.append(t.text)
        text = ''.join(texts).strip()
        if text and len(text) > 1:
            paras.append((style, text))
    
    # Extract chapter 3 (rough range from earlier output)
    start = None
    end = None
    for i, (style, text) in enumerate(paras):
        if '3 ' in text and ('设计' in text or '实现' in text):
            start = i
        elif start is not None and (text.startswith('4 ') or text.startswith('5 ') or text.startswith('6 ')):
            end = i
            break
    
    if start is not None:
        end_idx = end if end else len(paras)
        chapter3 = paras[start:end_idx]
        print(f'Chapter 3 paragraphs: {len(chapter3)}')
        for style, text in chapter3:
            print(f'[{style}] {text}')
    else:
        print('Chapter 3 not found')
