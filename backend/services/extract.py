import pdfplumber
import io
from PyPDF2 import PdfReader

def extract_text_from_pdf(file_stream):
    try:
        with pdfplumber.open(file_stream) as pdf:
            text = "\n".join(p.page.extract_text() or "" for p in pdf.pages)
            return text.strip()
    except:
        reader = PdfReader(file_stream)
        return "\n".join(p.extract_text() or "" for p in reader.pages)
