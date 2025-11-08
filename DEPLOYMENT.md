# Deployment Guide

## Deploying CBSE Paper Generator to Production

### Option 1: Deploy Both on Same Server

#### Using Heroku:

**1. Create Heroku account** at https://heroku.com

**2. Install Heroku CLI:**
```bash
# macOS
brew install heroku/brew/heroku

# Windows
# Download from https://devcenter.heroku.com/articles/heroku-cli
```

**3. Prepare files:**

Create `Procfile`:
```
web: gunicorn flask_app:app
```

Add to `requirements.txt`:
```
gunicorn==21.2.0
```

**4. Deploy:**
```bash
heroku login
heroku create cbse-paper-gen
git init
git add .
git commit -m "Initial commit"
git push heroku main
heroku open
```

**5. Set environment variables:**
```bash
heroku config:set GEMINI_API_KEY_1=your_key_1
heroku config:set GEMINI_API_KEY_2=your_key_2
heroku config:set GEMINI_API_KEY_3=your_key_3
```

### Option 2: Split Deployment (Recommended)

#### Frontend on Netlify/Vercel:

**Netlify:**
1. Go to https://netlify.com
2. Drag and drop your HTML file
3. Get URL: `https://cbse-paper-gen.netlify.app`

**Vercel:**
```bash
npm i -g vercel
vercel
```

#### Backend on Railway/Render:

**Railway:**
1. Go to https://railway.app
2. Connect GitHub repo
3. Add environment variables
4. Deploy

**Render:**
1. Go to https://render.com
2. New â†’ Web Service
3. Connect repo
4. Add environment variables
5. Deploy

**Update frontend API URL:**
```javascript
// In your JavaScript
const API_BASE_URL = 'https://your-backend.railway.app';
```

### Option 3: AWS Deployment

#### Frontend on S3 + CloudFront:
```bash
aws s3 sync . s3://cbse-paper-gen --exclude "*" --include "*.html" --include "*.css" --include "*.js"
```

#### Backend on Lambda + API Gateway:
Use AWS SAM or Serverless framework

### Option 4: Docker Deployment

**Dockerfile:**
```dockerfile
FROM python:3.11-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install -r requirements.txt

COPY . .

EXPOSE 5000

CMD ["python", "flask_app.py"]
```

**docker-compose.yml:**
```yaml
version: '3.8'
services:
  backend:
    build: .
    ports:
      - "5000:5000"
    environment:
      - GEMINI_API_KEY_1=${GEMINI_API_KEY_1}
      - GEMINI_API_KEY_2=${GEMINI_API_KEY_2}
      - GEMINI_API_KEY_3=${GEMINI_API_KEY_3}
```

**Deploy:**
```bash
docker-compose up -d
```

### Environment Variables Management

**Create `.env` file (never commit this):**
```
GEMINI_API_KEY_1=your_key_1
GEMINI_API_KEY_2=your_key_2
GEMINI_API_KEY_3=your_key_3
FLASK_ENV=production
```

**Load in Flask:**
```python
from dotenv import load_dotenv
import os

load_dotenv()

api_keys = [
    os.getenv('GEMINI_API_KEY_1'),
    os.getenv('GEMINI_API_KEY_2'),
    os.getenv('GEMINI_API_KEY_3')
]
api_keys = [key for key in api_keys if key]  # Filter None values
```

### Production Checklist

- [ ] Remove debug mode: `app.run(debug=False)`
- [ ] Set proper CORS origins: `CORS(app, origins=['https://yourdomain.com'])`
- [ ] Use environment variables for API keys
- [ ] Enable HTTPS
- [ ] Add rate limiting
- [ ] Set up logging
- [ ] Add monitoring (Sentry, New Relic)
- [ ] Configure backups
- [ ] Set up CI/CD pipeline
- [ ] Add API usage analytics

### Monitoring & Maintenance

**Add logging:**
```python
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

@app.route('/api/generate-paper', methods=['POST'])
def generate_paper():
    logger.info(f"Generating paper for class {class_num}, subject {subject}")
    # ...
```

**Monitor API usage:**
```python
# Track API calls
api_call_count = 0

def log_api_call():
    global api_call_count
    api_call_count += 1
    logger.info(f"Total API calls: {api_call_count}")
```

---

Choose the deployment option that best fits your needs and budget!
