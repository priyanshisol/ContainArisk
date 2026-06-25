import json
try:
    with open('frontend/audit.json', encoding='utf-16') as f:
        d = json.load(f)
    print("NPM Audit Vulnerabilities:")
    for k, v in d.get('vulnerabilities', {}).items():
        if v.get('severity') in ('critical', 'high'):
            print(f"- {k}: {v.get('severity')} - {v.get('name')}")
except Exception as e:
    print(f"Error reading frontend audit.json: {e}")
