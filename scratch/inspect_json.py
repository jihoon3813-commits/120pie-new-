import json

def decode_mojibake(text):
    try:
        # Encode to cp949 (to get back the raw bytes that were misinterpreted)
        # and then decode as utf-8.
        return text.encode('cp949').decode('utf-8')
    except Exception as e:
        # If that fails, just return the text
        return text

# Let's inspect step 396
with open(r'd:\anti-gv\25. 120pie(new)_2\scratch\franchise_from_fcfe2e54-0c4e-4167-8fd6-d0d791b028ba_step_396.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

print("Keys:", data.keys())
repl = data.get('ReplacementContent', '')
print("ReplacementContent Length:", len(repl))
print("First 200 chars:", repl[:200])
print("First 200 chars decoded:", decode_mojibake(repl[:200]))
