import zipfile
import sys
import io

sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

path = r'C:\Users\lenovo\Desktop\中期报告.docx'
with zipfile.ZipFile(path) as z:
    data = z.read('word/document.xml')
    # Check first 200 bytes
    print("First 200 bytes (hex):")
    print(data[:200].hex())
    print("\nFirst 200 bytes (decoded as utf-8):")
    try:
        print(data[:200].decode('utf-8'))
    except:
        print("Failed to decode as utf-8")
    print("\nFirst 200 bytes (decoded as gbk):")
    try:
        print(data[:200].decode('gbk'))
    except:
        print("Failed to decode as gbk")
