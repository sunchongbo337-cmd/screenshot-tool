import zipfile
import xml.etree.ElementTree as ET

path = r'C:\Users\lenovo\Desktop\中期报告.docx'
with zipfile.ZipFile(path) as z:
    data = z.read('word/document.xml')
    root = ET.fromstring(data)
    ns = 'http://schemas.openxmlformats.org/wordprocessingml/2006/main'
    
    paras = []
    for p in root.iter(f'{{{ns}}}p'):
        texts = []
        for t in p.iter(f'{{{ns}}}t'):
            if t.text:
                texts.append(t.text)
        text = ''.join(texts).strip()
        if text:
            paras.append(text)
    
    print('\n'.join(paras[:200]))
