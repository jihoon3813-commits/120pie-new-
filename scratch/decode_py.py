# -*- coding: utf-8 -*-
import sys

s = "李쎌뾽紐⑤뜽"
# Let's try encode/decode combinations
try:
    print("Direct cp949 encode / utf-8 decode:")
    b = s.encode('cp949', errors='ignore')
    print(b.decode('utf-8', errors='ignore'))
except Exception as e:
    print("Error 1:", e)

try:
    print("Direct utf-8 encode / cp949 decode:")
    b = s.encode('utf-8')
    print(b.decode('cp949', errors='ignore'))
except Exception as e:
    print("Error 2:", e)

try:
    # Often, UTF-8 bytes were read as CP949, which creates U+XXXX characters.
    # To recover, we encode to CP949 (since the program read CP949 bytes to Unicode U+XXXX),
    # which gives us the raw UTF-8 bytes, and then we decode as UTF-8.
    print("UTF-8 read as CP949 -> CP949 encode / UTF-8 decode:")
    b = s.encode('cp949')
    print(b.decode('utf-8'))
except Exception as e:
    print("Error 3:", e)
