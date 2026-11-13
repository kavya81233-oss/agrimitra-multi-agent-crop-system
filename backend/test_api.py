import sys
import os

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
sys.path.append(BASE_DIR)

from fastapi.testclient import TestClient
from main import app

client = TestClient(app)

print("--- Testing API Endpoints ---")

# 1. Health
r = client.get('/api/health')
print('1. HEALTH:', r.status_code, r.json())
assert r.status_code == 200

# 2. Dashboard stats
r = client.get('/api/dashboard/stats')
print('2. STATS:', r.status_code, r.json())
assert r.status_code == 200

# 3. Farmer profile
r = client.get('/api/farmer')
print('3. FARMER:', r.status_code, r.json())
assert r.status_code == 200

# 4. Weather endpoint
r = client.get('/api/weather?location=Bengaluru')
print('4. WEATHER:', r.status_code, "Temp:", r.json()['temperature'], "Risk:", r.json()['environmental_risk'])
assert r.status_code == 200

# 5. Assistant chat
r = client.post('/api/assistant/chat', json={'message': 'Why are my tomato leaves turning yellow?', 'language': 'en'})
print('5. ASSISTANT:', r.status_code, "Reply snippet:", r.json()['reply'][:60].replace("\n", " "))
assert r.status_code == 200

# 6. Assistant chat in Kannada
r = client.post('/api/assistant/chat', json={'message': 'ಟೊಮೆಟೊ ಎಲೆಗಳು ಹಳದಿ ಬಣ್ಣಕ್ಕೆ ತಿರುಗಲು ಕಾರಣವೇನು?', 'language': 'kn'})
print('6. ASSISTANT (KN):', r.status_code, "Reply snippet:", r.json()['reply'][:50].replace("\n", " "))
assert r.status_code == 200

# 7. Actions list
r = client.get('/api/actions')
print('7. ACTIONS COUNT:', len(r.json()))
assert r.status_code == 200

# 8. Analyze crop
r = client.post('/api/analyze-crop', data={
    'crop_type': 'Tomato',
    'location': 'Bengaluru Rural',
    'symptoms_description': 'Concentric target rings on bottom leaves with yellowing halos'
})
print('8. ANALYZE CROP:', r.status_code, "Disease:", r.json()['disease_detected'], 'Risk:', r.json()['risk_level'])
assert r.status_code == 200

print("\n>>> ALL API TESTS PASSED SUCCESSFULLY! <<<")
