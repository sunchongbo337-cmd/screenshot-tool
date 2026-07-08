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
    
    # Find chapter 3 content - look for heading "3 " patterns
    start = None
    end = None
    for i, (style, text) in enumerate(paras):
        # Look for chapter 3 heading
        if style in ['11', '12', '13', 'Heading1', 'Heading2', 'Heading3'] and '3' in text:
            if '设计' in text or '实现' in text or '实习' in text or '应用' in text:
                if start is None:
                    start = i
        elif start is not None:
            # Look for chapter 4 or 5 to end chapter 3
            if (style in ['11', '12', '13', 'Heading1', 'Heading2', 'Heading3'] and 
                (text.startswith('4 ') or text.startswith('5 ') or text.startswith('6 '))):
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
        print("Looking for patterns...")
        for i, (style, text) in enumerate(paras[:50]):
            print(f'[{style}] {text[:100]}')
