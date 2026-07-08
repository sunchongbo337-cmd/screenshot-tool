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
        if text:
            paras.append((style, text))
    
    print(f'Total paragraphs: {len(paras)}')
    print('\n'.join(f'[{s}] {t}' for s, t in paras))
