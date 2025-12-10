#!/usr/bin/env python3
"""
Test script for multi-file upload functionality
Tests the file type validation and text extraction functions
"""

import sys
import os

# Add the backend directory to the path
sys.path.append('backend')

from backend.server import extract_text_from_file

def test_file_validation():
    """Test file extension validation"""
    print("Testing file validation...")
    
    # Test allowed extensions
    allowed_extensions = ['.pdf', '.docx', '.doc', '.txt', '.md', '.jpg', '.jpeg', '.png', '.gif', '.bmp', '.tiff', '.webp']
    
    # Test some valid files
    valid_files = [
        "document.pdf",
        "notes.docx", 
        "old_document.doc",
        "text_file.txt",
        "readme.md",
        "photo.jpg",
        "image.png",
        "screenshot.gif"
    ]
    
    # Test some invalid files
    invalid_files = [
        "script.js",
        "video.mp4", 
        "archive.zip",
        "presentation.pptx"
    ]
    
    print("Valid files:")
    for filename in valid_files:
        extension = '.' + filename.lower().split('.')[-1]
        is_valid = extension in allowed_extensions
        print(f"  {filename}: {'✓' if is_valid else '✗'}")
    
    print("\nInvalid files:")
    for filename in invalid_files:
        extension = '.' + filename.lower().split('.')[-1]
        is_valid = extension in allowed_extensions
        print(f"  {filename}: {'✓' if not is_valid else '✗'}")

def test_text_extraction():
    """Test text extraction functions"""
    print("\nTesting text extraction...")
    
    # Test with sample text
    sample_text = "This is a test document for note generation.\nIt contains multiple lines of text.\nAI should process this content."
    sample_text_bytes = sample_text.encode('utf-8')
    
    # Test TXT extraction
    print("Testing TXT extraction...")
    extracted = extract_text_from_file(sample_text_bytes, "test.txt")
    if extracted:
        print("✓ TXT extraction successful")
        print(f"  Extracted: {extracted[:50]}...")
    else:
        print("✗ TXT extraction failed")
    
    # Test with markdown content
    md_content = "# Test Document\n\nThis is a **markdown** file with *formatting*.\n\n- List item 1\n- List item 2"
    md_bytes = md_content.encode('utf-8')
    
    print("\nTesting MD extraction...")
    extracted_md = extract_text_from_file(md_bytes, "test.md")
    if extracted_md:
        print("✓ MD extraction successful")
        print(f"  Extracted: {extracted_md[:50]}...")
    else:
        print("✗ MD extraction failed")

if __name__ == "__main__":
    print("=" * 60)
    print("Multi-File Upload Support Test")
    print("=" * 60)
    
    test_file_validation()
    test_text_extraction()
    
    print("\n" + "=" * 60)
    print("Test completed!")
    print("=" * 60)