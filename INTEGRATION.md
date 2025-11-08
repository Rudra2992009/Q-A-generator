# Frontend-Backend Integration Guide

## How JavaScript Communicates with Python Flask

### Overview
The frontend (HTML/CSS/JS) communicates with the Python Flask backend using HTTP requests. JavaScript's `fetch()` API sends requests, and Flask processes them and returns JSON responses.

## Communication Architecture

```
â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”
â”‚                         Browser                              â”‚
â”‚  â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”  â”‚
â”‚  â”‚                    JavaScript                          â”‚  â”‚
â”‚  â”‚  fetch('http://localhost:5000/api/generate-paper')    â”‚  â”‚
â”‚  â”‚         â†“ HTTP POST Request (JSON)                     â”‚  â”‚
â”‚  â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜  â”‚
â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜
                           â†“
                    Internet/Network
                           â†“
â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”
â”‚                    Flask Server (Python)                     â”‚
â”‚  â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”  â”‚
â”‚  â”‚  @app.route('/api/generate-paper', methods=['POST'])  â”‚  â”‚
â”‚  â”‚  def generate_paper():                                 â”‚  â”‚
â”‚  â”‚      # Process request                                 â”‚  â”‚
â”‚  â”‚      # Call Gemini API                                 â”‚  â”‚
â”‚  â”‚      # Return JSON response                            â”‚  â”‚
â”‚  â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜  â”‚
â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜
                           â†“
                    Internet/Network
                           â†“
â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”
â”‚                     Google Gemini API                        â”‚
â”‚  â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”  â”‚
â”‚  â”‚  Generate questions based on prompt                    â”‚  â”‚
â”‚  â”‚  Return formatted text                                 â”‚  â”‚
â”‚  â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜  â”‚
â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜
```

## Key Concepts

### 1. CORS (Cross-Origin Resource Sharing)
When JavaScript in the browser makes requests to a server, CORS must be enabled:

**Python (Flask):**
```python
from flask_cors import CORS
app = Flask(__name__)
CORS(app)  # Allow JavaScript to make requests
```

### 2. JSON Data Exchange
Data is sent and received as JSON format:

**JavaScript sends:**
```javascript
const data = {
    class: "10",
    subject: "Mathematics"
};

fetch('http://localhost:5000/api/generate-paper', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
})
```

**Python receives:**
```python
@app.route('/api/generate-paper', methods=['POST'])
def generate_paper():
    data = request.get_json()
    class_num = data.get('class')
    subject = data.get('subject')
    # Process...
    return jsonify({'success': True, 'questions': questions})
```

### 3. Async/Await Pattern
JavaScript uses async/await for handling API calls:

```javascript
async function generatePaper() {
    try {
        const response = await fetch(url, options);
        const data = await response.json();
        displayQuestions(data.questions);
    } catch (error) {
        console.error('Error:', error);
    }
}
```

## Step-by-Step Request Flow

### Example: Generating a Paper

**1. User Action (Browser)**
```
User clicks "Generate Paper" button
â†“
JavaScript event listener triggered
```

**2. JavaScript Prepares Request**
```javascript
const requestData = {
    class: document.getElementById('class').value,
    subject: document.getElementById('subject').value
};
```

**3. JavaScript Sends HTTP Request**
```javascript
const response = await fetch('http://localhost:5000/api/generate-paper', {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify(requestData)
});
```

**4. Flask Receives Request**
```python
@app.route('/api/generate-paper', methods=['POST'])
def generate_paper():
    data = request.get_json()  # Parse JSON from request body
    class_num = data.get('class')
    subject = data.get('subject')
```

**5. Flask Calls Gemini API**
```python
# Get API key (with rotation)
api_key = get_next_api_key()

# Call Gemini
client = genai.Client(api_key=api_key)
response = client.models.generate_content(
    model='gemini-2.0-flash',
    contents=prompt
)
questions = response.text
```

**6. Flask Returns Response**
```python
return jsonify({
    'success': True,
    'questions': questions,
    'class': class_num,
    'subject': subject
})
```

**7. JavaScript Receives Response**
```javascript
const data = await response.json();
if (data.success) {
    displayQuestions(data.questions);
}
```

**8. Update UI**
```javascript
document.getElementById('results').innerHTML = data.questions;
```

## API Key Rotation Mechanism

The backend rotates through multiple API keys automatically:

```python
# Global state
api_keys = ['key1', 'key2', 'key3']
current_key_index = 0

def get_next_api_key():
    """Round-robin key selection"""
    global current_key_index
    key = api_keys[current_key_index]

    # Move to next key (wrap around)
    current_key_index = (current_key_index + 1) % len(api_keys)

    return key

# Usage in generate_paper:
api_key = get_next_api_key()  # Gets key1 first time
api_key = get_next_api_key()  # Gets key2 second time
api_key = get_next_api_key()  # Gets key3 third time
api_key = get_next_api_key()  # Gets key1 fourth time (cycles back)
```

**Benefits:**
- Distributes API load across multiple keys
- Reduces chance of hitting rate limits
- Increases reliability
- No manual intervention needed

## Error Handling Pattern

### JavaScript Side:
```javascript
async function generatePaper() {
    try {
        const response = await fetch(url, options);

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        if (!data.success) {
            showError(data.error);
            return;
        }

        displayQuestions(data.questions);

    } catch (error) {
        console.error('Error:', error);
        showError('Failed to generate paper. Please try again.');
    }
}
```

### Python Side:
```python
@app.route('/api/generate-paper', methods=['POST'])
def generate_paper():
    try:
        data = request.get_json()

        # Validation
        if not data:
            return jsonify({'success': False, 'error': 'No data provided'}), 400

        # Process...
        questions = generate_questions_with_gemini(class_num, subject, api_key)

        return jsonify({'success': True, 'questions': questions})

    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500
```

## Testing the Integration

### 1. Test Backend Independently:
```python
# test_backend.py
import requests

# Test health
response = requests.get('http://localhost:5000/api/health')
print(response.json())

# Test key configuration
response = requests.post('http://localhost:5000/api/configure-keys',
    json={'api_keys': ['test_key']})
print(response.json())
```

### 2. Test Frontend Independently:
```javascript
// Open browser console and run:
fetch('http://localhost:5000/api/health')
    .then(res => res.json())
    .then(data => console.log(data));
```

### 3. Test Full Integration:
1. Start Flask: `python flask_app.py`
2. Open frontend in browser
3. Open browser DevTools (F12) â†’ Network tab
4. Click "Generate Paper"
5. Watch the network request and response

## Security Considerations

### 1. Never Expose API Keys in Frontend
âŒ **BAD:**
```javascript
// Don't do this!
const API_KEY = "AIza...hardcoded...key";
```

âœ… **GOOD:**
```javascript
// Let users enter their own keys
const apiKeys = getUserEnteredKeys();
sendToBackend(apiKeys);  // Backend stores and uses them
```

### 2. Validate Input on Backend
```python
# Always validate on server side
if not class_num or class_num not in SUBJECTS_BY_CLASS:
    return jsonify({'success': False, 'error': 'Invalid class'}), 400
```

### 3. Use HTTPS in Production
```python
# Development
app.run(host='0.0.0.0', port=5000)

# Production
# Use gunicorn with SSL certificates
```

## Deployment Considerations

### Development:
- Frontend: Open HTML file directly
- Backend: `python flask_app.py`
- URL: `http://localhost:5000`

### Production:
1. **Frontend**: Deploy to Netlify, Vercel, or GitHub Pages
2. **Backend**: Deploy to:
   - Heroku
   - AWS EC2
   - Google Cloud Run
   - DigitalOcean
3. Update frontend API URL to production backend URL
4. Enable CORS for production domain
5. Use environment variables for API keys
6. Use HTTPS for all requests

## Troubleshooting

### Issue: "CORS error"
**Cause:** Flask-CORS not installed or not configured
**Fix:**
```bash
pip install flask-cors
```
```python
from flask_cors import CORS
CORS(app)
```

### Issue: "Connection refused"
**Cause:** Flask server not running
**Fix:** Start server with `python flask_app.py`

### Issue: "404 Not Found"
**Cause:** Wrong API endpoint URL
**Fix:** Check Flask routes match frontend fetch URLs

### Issue: "500 Internal Server Error"
**Cause:** Backend error (check Flask console)
**Fix:** Look at Flask terminal for error traceback

---

This guide covers the complete integration between the HTML/CSS/JS frontend and Python Flask backend. The key is understanding HTTP requests, JSON data exchange, and proper error handling.
