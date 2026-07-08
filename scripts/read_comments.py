import zipfile
import xml.etree.ElementTree as ET

path = r'C:\Users\lenovo\Desktop\中期报告.docx'
with zipfile.ZipFile(path) as z:
    names = z.namelist()
    print('FILES IN DOCX:')
    for n in names:
        if 'comment' in n.lower() or 'people' in n.lower() or 'document' in n.lower():
            print(n)
    if 'word/comments.xml' in names:
        data = z.read('word/comments.xml')
        root = ET.fromstring(data)
        ns = 'http://schemas.openxmlformats.org/wordprocessingml/2006/main'
        print('\nCOMMENTS:')
        for c in root.findall(f'{{{ns}}}comment'):
            author = c.get(f'{{{ns}}}author')
            date = c.get(f'{{{ns}}}date')
            texts = [t.text for t in c.iter() if t.tag.endswith('}t') and t.text]
            body = ''.join(texts)
            print(f'- {author} | {date}: {body}')
    else:
        print('NO word/comments.xml found')
