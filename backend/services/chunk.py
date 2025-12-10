def chunk_text(text, chunk_size=1000, overlap=200):
    tokens = text.split()
    chunks = []
    start = 0

    while start < len(tokens):
        end = min(start + chunk_size, len(tokens))
        chunk = " ".join(tokens[start:end])
        chunks.append(chunk)
        start = end - overlap

    return chunks
