# CBSE Paper Generator - Quick Start Guide

## 5-Minute Setup

### Step 1: Get Your API Keys (2 minutes)
1. Go to https://ai.google.dev/
2. Click "Get API Key"
3. Sign in with Google
4. Create 1-3 API keys
5. Copy them to a safe place

### Step 2: Install Dependencies (1 minute)
```bash
pip install flask flask-cors google-generativeai
```

### Step 3: Start the Server (30 seconds)
```bash
python flask_app.py
```

### Step 4: Open the App (30 seconds)
1. Open the web application in your browser
2. Enter your API keys
3. Click "Save API Keys"

### Step 5: Generate Your First Paper (1 minute)
1. Select Class: 10
2. Select Subject: Mathematics
3. Click "Generate Paper"
4. Wait 10-30 seconds
5. Download your paper!

## That's it! You're ready to generate CBSE papers! ðŸŽ‰

---

## Testing the API Directly

You can test the Flask backend using curl or Python:

### Using curl:
```bash
# Health check
curl http://localhost:5000/api/health

# Configure API keys
curl -X POST http://localhost:5000/api/configure-keys \
  -H "Content-Type: application/json" \
  -d '{"api_keys": ["your_key_1", "your_key_2", "your_key_3"]}'

# Get subjects for Class 10
curl http://localhost:5000/api/get-subjects?class=10

# Generate paper
curl -X POST http://localhost:5000/api/generate-paper \
  -H "Content-Type: application/json" \
  -d '{"class": "10", "subject": "Mathematics"}'
```

### Using Python requests:
```python
import requests

# Configure keys
response = requests.post('http://localhost:5000/api/configure-keys',
    json={'api_keys': ['key1', 'key2', 'key3']})
print(response.json())

# Generate paper
response = requests.post('http://localhost:5000/api/generate-paper',
    json={'class': '10', 'subject': 'Mathematics'})
print(response.json())
```

## Common Issues & Quick Fixes

### "Connection refused"
â†’ Make sure Flask server is running: `python flask_app.py`

### "Invalid API key"
â†’ Check your API key at https://ai.google.dev/

### "Rate limit exceeded"
â†’ Add more API keys or wait a few minutes

### Port 5000 already in use
â†’ Change port in flask_app.py: `app.run(port=5001)`

---

Need help? Check the full README.md for detailed documentation.
