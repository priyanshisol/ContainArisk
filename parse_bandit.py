import json
try:
    with open('bandit.json', encoding='utf-8') as f:
        d = json.load(f)
    print("Bandit Vulnerabilities:")
    for res in d.get('results', []):
        if res.get('issue_severity') in ('HIGH', 'MEDIUM'):
            print(f"- [{res.get('issue_severity')}] {res.get('issue_text')} in {res.get('filename')} line {res.get('line_number')}")
except Exception as e:
    print(f"Error reading bandit.json: {e}")
