# CBSE AI Sample Paper Generator

An intelligent web application that generates CBSE board-style sample papers with 50 questions using Google Gemini AI. Built with HTML5, CSS3, JavaScript (frontend) and Python Flask (backend).

## ðŸŒŸ Features

- **Multi-Class Support**: Generate papers for Classes 9, 10, 11, and 12
- **Comprehensive Subject Coverage**: 
  - Classes 9-10: Mathematics, Science, Social Science, English, Hindi
  - Classes 11-12: 14+ subjects including Physics, Chemistry, Biology, Mathematics, Commerce, and Humanities
- **CBSE-Aligned Questions**: 50 questions following official CBSE exam pattern
- **Multiple API Keys**: Support for up to 3 Gemini API keys with automatic rotation
- **Question Type Distribution**:
  - Multiple Choice Questions (MCQs): 20%
  - Short Answer Questions: 30%
  - Long Answer Questions: 30%
  - Case-Based/Application Questions: 20%
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Export Functionality**: Download generated papers as formatted text files

## ðŸ—ï¸ Architecture

```
â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”         â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”         â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”
â”‚                 â”‚         â”‚                  â”‚         â”‚                 â”‚
â”‚   HTML/CSS/JS   â”‚ â—„â”€â”€â”€â”€â”€â–º â”‚   Flask Server   â”‚ â—„â”€â”€â”€â”€â”€â–º â”‚   Gemini API    â”‚
â”‚   (Frontend)    â”‚  HTTP   â”‚   (Backend)      â”‚   API   â”‚   (Google)      â”‚
â”‚                 â”‚         â”‚                  â”‚         â”‚                 â”‚
â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜         â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜         â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜
```

### Communication Flow:
1. User enters API keys in the frontend
2. Frontend sends keys to Flask backend via POST request
3. User selects class and subject, clicks "Generate Paper"
4. Frontend sends request to Flask `/api/generate-paper` endpoint
5. Flask backend rotates through API keys (round-robin)
6. Backend calls Gemini API with detailed prompt
7. Gemini generates 50 CBSE-style questions
8. Backend returns formatted questions to frontend
9. Frontend displays questions with download option

## ðŸ“‹ Prerequisites

### Frontend (Web Application)
- Modern web browser (Chrome, Firefox, Safari, Edge)
- Internet connection

### Backend (Python Flask Server)
- Python 3.8 or higher
- pip (Python package manager)
- Google Gemini API keys (get from https://ai.google.dev/)

## ðŸš€ Installation & Setup

### Step 1: Clone or Download the Project

```bash
# Clone the repository (if using Git)
git clone <repository-url>
cd cbse-paper-generator

# Or download and extract the ZIP file
```

### Step 2: Install Python Dependencies

```bash
pip install flask flask-cors google-generativeai
```

**Package Details:**
- `flask`: Web framework for the backend server
- `flask-cors`: Enables Cross-Origin Resource Sharing (CORS)
- `google-generativeai`: Official Google Gemini API client

### Step 3: Get Gemini API Keys

1. Visit [Google AI Studio](https://ai.google.dev/)
2. Sign in with your Google account
3. Click "Get API Key" â†’ "Create API Key"
4. Create up to 3 API keys for rotation (recommended)
5. Copy and save your API keys securely

### Step 4: Start the Flask Backend

```bash
python flask_app.py
```

You should see:
```
============================================================
CBSE AI Sample Paper Generator - Flask Backend
============================================================
Server starting on http://localhost:5000

Available endpoints:
  POST /api/configure-keys  - Configure Gemini API keys
  GET  /api/get-subjects    - Get subjects for a class
  POST /api/generate-paper  - Generate sample paper
  GET  /api/health          - Health check
============================================================

 * Running on http://0.0.0.0:5000
```

### Step 5: Open the Frontend

1. Open `index.html` in your web browser
2. Or navigate to `http://localhost:5000` if Flask is serving the frontend

## ðŸ“– Usage Guide

### Configuring API Keys

1. When you first open the application, you'll see the "API Key Configuration" section
2. Enter your Gemini API keys in the three input fields
   - You can use 1, 2, or 3 API keys
   - Multiple keys help avoid rate limits through rotation
3. Click "Save API Keys"
4. A success message confirms your keys are configured

### Generating a Sample Paper

1. Select a **Class** from the dropdown (9, 10, 11, or 12)
2. Select a **Subject** (options update based on selected class)
3. Click the **"Generate Paper"** button
4. Wait while the AI generates 50 questions (10-30 seconds)
5. Review the generated questions displayed on screen
6. Click **"Download Paper"** to export as a text file
7. Click **"Generate New Paper"** to create another paper

## ðŸ”§ API Endpoints Documentation

### 1. Configure API Keys
```http
POST /api/configure-keys
Content-Type: application/json

{
  "api_keys": ["key1", "key2", "key3"]
}

Response:
{
  "success": true,
  "message": "Successfully configured 3 API key(s)",
  "key_count": 3
}
```

### 2. Get Subjects for a Class
```http
GET /api/get-subjects?class=10

Response:
{
  "success": true,
  "subjects": ["Mathematics", "Science", "Social Science", "English", "Hindi"]
}
```

### 3. Generate Sample Paper
```http
POST /api/generate-paper
Content-Type: application/json

{
  "class": "10",
  "subject": "Mathematics"
}

Response:
{
  "success": true,
  "class": "10",
  "subject": "Mathematics",
  "questions": "Q1. What is the value of...
...",
  "question_count": 50,
  "generated_at": "2025-11-08 21:00:00"
}
```

### 4. Health Check
```http
GET /api/health

Response:
{
  "status": "healthy",
  "api_keys_configured": 3,
  "version": "1.0.0"
}
```

## ðŸ” API Key Rotation Implementation

The backend implements intelligent API key rotation:

```python
# Round-robin rotation
current_key_index = 0

def get_next_api_key():
    key = api_keys[current_key_index]
    current_key_index = (current_key_index + 1) % len(api_keys)
    return key
```

**Benefits:**
- Distributes load across multiple API keys
- Avoids rate limit errors
- Increases reliability and uptime
- Automatic failover capability

## ðŸ“Š CBSE Question Distribution

Each generated paper contains **50 questions** distributed as:

| Question Type | Count | Marks Each | Total Marks |
|--------------|-------|------------|-------------|
| MCQs | 10 | 1 | 10 |
| Short Answer | 15 | 2-3 | 30-45 |
| Long Answer | 15 | 5-6 | 75-90 |
| Case-Based | 10 | 4 | 40 |

**Total: 50 Questions | 155-185 Marks**

(Note: Actual CBSE papers are typically 80 marks theory + 20 marks practical)

## ðŸŽ¯ Supported Subjects by Class

### Class 9 & 10 (5 subjects)
- Mathematics
- Science
- Social Science
- English
- Hindi

### Class 11 & 12 (14 subjects)
- **Science Stream**: Mathematics, Physics, Chemistry, Biology, Computer Science
- **Commerce Stream**: Business Studies, Accountancy, Economics
- **Humanities Stream**: History, Geography, Political Science, Psychology
- **Others**: English, Physical Education

## ðŸ›¡ï¸ Security Best Practices

1. **Never commit API keys to version control**
   - Add `.env` file to `.gitignore`
   - Use environment variables in production

2. **API Key Storage**
   - Keys are stored in memory during runtime
   - Not persisted to disk in current implementation
   - Consider using environment variables:
     ```bash
     export GEMINI_API_KEY_1="your_key_1"
     export GEMINI_API_KEY_2="your_key_2"
     export GEMINI_API_KEY_3="your_key_3"
     ```

3. **Rate Limiting**
   - Implement request throttling for production
   - Monitor API usage to avoid quota exhaustion

4. **CORS Configuration**
   - Currently allows all origins (development)
   - Restrict to specific domains in production:
     ```python
     CORS(app, origins=['https://yourdomain.com'])
     ```

## ðŸ› Troubleshooting

### Issue: "No API keys configured" error
**Solution**: Ensure you've clicked "Save API Keys" and received a success message.

### Issue: Questions not generating
**Possible causes:**
- Invalid API keys - verify at https://ai.google.dev/
- Rate limit exceeded - wait a few minutes or use additional keys
- Network connectivity issues

### Issue: Flask server won't start
**Solution**: Check if port 5000 is already in use
```bash
# Kill process on port 5000 (Unix/Mac)
lsof -ti:5000 | xargs kill -9

# Windows
netstat -ano | findstr :5000
taskkill /PID <PID> /F
```

### Issue: CORS errors in browser console
**Solution**: Ensure Flask-CORS is installed and configured properly:
```bash
pip install flask-cors
```

## ðŸ”„ Future Enhancements

- [ ] PDF generation with proper formatting
- [ ] Answer key generation
- [ ] Marking scheme with each question
- [ ] Question difficulty customization
- [ ] Previous year question pattern analysis
- [ ] User authentication and saved papers
- [ ] Support for more languages (regional)
- [ ] Diagram generation for science subjects
- [ ] Integration with NCERT syllabus API

## ðŸ“ Project Structure

```
cbse-paper-generator/
â”‚
â”œâ”€â”€ index.html              # Frontend HTML
â”œâ”€â”€ styles.css              # Styling (embedded in HTML)
â”œâ”€â”€ script.js               # JavaScript logic (embedded in HTML)
â”œâ”€â”€ flask_app.py            # Python Flask backend
â”œâ”€â”€ requirements.txt        # Python dependencies
â””â”€â”€ README.md               # This file
```

## ðŸ¤ Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## ðŸ“œ License

This project is licensed under the MIT License - see the LICENSE file for details.

## ðŸ™ Acknowledgments

- **Google Gemini AI**: For providing the powerful language model API
- **CBSE**: For the official examination pattern and syllabus guidelines
- **Flask Framework**: For the robust Python web framework
- **Open Source Community**: For the tools and libraries that made this possible

## ðŸ“ž Support

For issues, questions, or suggestions:
- Open an issue on GitHub
- Email: support@example.com (replace with your email)

## âš ï¸ Disclaimer

This is an educational tool designed to help students practice. Generated questions should be:
- Reviewed by educators before use
- Used as supplementary study material
- Not considered official CBSE content
- Verified for accuracy and curriculum alignment

The developers are not affiliated with CBSE or Google.

---

**Made with â¤ï¸ for students preparing for CBSE board exams**

*Last Updated: November 2025*
