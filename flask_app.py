
"""
CBSE AI Sample Paper Generator - Flask Backend
This Flask application provides API endpoints for generating CBSE sample papers
using Google Gemini API with support for multiple API keys and key rotation.

Requirements:
    pip install flask flask-cors google-generativeai

Usage:
    python app.py

The server will start on http://localhost:5000
"""

from flask import Flask, request, jsonify, render_template
from flask_cors import CORS
from google import genai
import os
import time
from typing import List, Dict
import json

app = Flask(__name__)
CORS(app)  # Enable CORS for JavaScript communication

# Global variables for API key management
api_keys: List[str] = []
current_key_index = 0

# CBSE subject mappings
SUBJECTS_BY_CLASS = {
    "9": ["Mathematics", "Science", "Social Science", "English", "Hindi"],
    "10": ["Mathematics", "Science", "Social Science", "English", "Hindi"],
    "11": ["Mathematics", "Physics", "Chemistry", "Biology", "English", 
           "Computer Science", "Business Studies", "Accountancy", "Economics",
           "History", "Geography", "Political Science", "Psychology", "Physical Education"],
    "12": ["Mathematics", "Physics", "Chemistry", "Biology", "English",
           "Computer Science", "Business Studies", "Accountancy", "Economics",
           "History", "Geography", "Political Science", "Psychology", "Physical Education"]
}


def get_next_api_key() -> str:
    """
    Implements round-robin API key rotation.
    Returns the next API key in the rotation sequence.
    """
    global current_key_index
    if not api_keys:
        raise ValueError("No API keys configured")

    key = api_keys[current_key_index]
    current_key_index = (current_key_index + 1) % len(api_keys)
    return key


def generate_questions_with_gemini(class_num: str, subject: str, api_key: str) -> str:
    """
    Generates 50 CBSE-style questions using Google Gemini API.

    Args:
        class_num: The class number (9, 10, 11, or 12)
        subject: The subject name
        api_key: Google Gemini API key

    Returns:
        Generated questions as formatted text
    """
    try:
        # Initialize Gemini client
        client = genai.Client(api_key=api_key)

        # Create detailed prompt for CBSE question generation
        prompt = f"""Generate exactly 50 CBSE board exam style questions for Class {class_num} {subject}.

Follow these requirements strictly:
1. Total Questions: Exactly 50 questions
2. Question Type Distribution:
   - Multiple Choice Questions (MCQs): 10 questions (1 mark each)
   - Short Answer Questions: 15 questions (2-3 marks each)
   - Long Answer Questions: 15 questions (5-6 marks each)
   - Case-Based/Application Questions: 10 questions (4 marks each)

3. Format each question as:
   Q[number]. [Question text]
   [For MCQs, include 4 options: (a), (b), (c), (d)]
   Marks: [X]

4. Ensure questions cover:
   - Core concepts from CBSE syllabus
   - Different difficulty levels (easy, moderate, difficult)
   - Real-world applications
   - Conceptual understanding
   - Problem-solving skills

5. Align with latest CBSE exam pattern 2025-26

6. Number questions from 1 to 50

Generate the questions now:"""

        # Call Gemini API
        response = client.models.generate_content(
            model='gemini-2.0-flash',
            contents=prompt
        )

        return response.text

    except Exception as e:
        raise Exception(f"Error generating questions with Gemini API: {str(e)}")


@app.route('/')
def index():
    """Serve the main HTML page (if using Flask to serve frontend)"""
    return render_template('index.html')


@app.route('/api/configure-keys', methods=['POST'])
def configure_keys():
    """
    Endpoint to configure API keys.
    Expects JSON: {"api_keys": ["key1", "key2", "key3"]}
    """
    try:
        data = request.get_json()

        if not data or 'api_keys' not in data:
            return jsonify({
                'success': False,
                'error': 'API keys are required'
            }), 400

        keys = data['api_keys']

        # Filter out empty keys
        valid_keys = [key.strip() for key in keys if key and key.strip()]

        if not valid_keys:
            return jsonify({
                'success': False,
                'error': 'At least one valid API key is required'
            }), 400

        # Update global API keys
        global api_keys, current_key_index
        api_keys = valid_keys
        current_key_index = 0

        return jsonify({
            'success': True,
            'message': f'Successfully configured {len(valid_keys)} API key(s)',
            'key_count': len(valid_keys)
        })

    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500


@app.route('/api/get-subjects', methods=['GET'])
def get_subjects():
    """
    Endpoint to get subjects for a specific class.
    Query param: class (e.g., ?class=10)
    """
    try:
        class_num = request.args.get('class')

        if not class_num:
            return jsonify({
                'success': False,
                'error': 'Class number is required'
            }), 400

        if class_num not in SUBJECTS_BY_CLASS:
            return jsonify({
                'success': False,
                'error': f'Invalid class number: {class_num}'
            }), 400

        return jsonify({
            'success': True,
            'subjects': SUBJECTS_BY_CLASS[class_num]
        })

    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500


@app.route('/api/generate-paper', methods=['POST'])
def generate_paper():
    """
    Main endpoint to generate CBSE sample paper.
    Expects JSON: {
        "class": "10",
        "subject": "Mathematics"
    }
    """
    try:
        data = request.get_json()

        # Validate input
        if not data:
            return jsonify({
                'success': False,
                'error': 'Request data is required'
            }), 400

        class_num = data.get('class')
        subject = data.get('subject')

        if not class_num or not subject:
            return jsonify({
                'success': False,
                'error': 'Both class and subject are required'
            }), 400

        # Validate class and subject
        if class_num not in SUBJECTS_BY_CLASS:
            return jsonify({
                'success': False,
                'error': f'Invalid class: {class_num}'
            }), 400

        if subject not in SUBJECTS_BY_CLASS[class_num]:
            return jsonify({
                'success': False,
                'error': f'Invalid subject for class {class_num}: {subject}'
            }), 400

        # Check if API keys are configured
        if not api_keys:
            return jsonify({
                'success': False,
                'error': 'API keys not configured. Please configure API keys first.'
            }), 400

        # Get next API key using rotation
        api_key = get_next_api_key()

        # Generate questions
        questions = generate_questions_with_gemini(class_num, subject, api_key)

        return jsonify({
            'success': True,
            'class': class_num,
            'subject': subject,
            'questions': questions,
            'question_count': 50,
            'generated_at': time.strftime('%Y-%m-%d %H:%M:%S'),
            'api_key_used': len(api_key)  # Just send length for security
        })

    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500


@app.route('/api/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({
        'status': 'healthy',
        'api_keys_configured': len(api_keys),
        'version': '1.0.0'
    })


if __name__ == '__main__':
    print("=" * 60)
    print("CBSE AI Sample Paper Generator - Flask Backend")
    print("=" * 60)
    print("Server starting on http://localhost:5000")
    print()
    print("Available endpoints:")
    print("  POST /api/configure-keys  - Configure Gemini API keys")
    print("  GET  /api/get-subjects    - Get subjects for a class")
    print("  POST /api/generate-paper  - Generate sample paper")
    print("  GET  /api/health          - Health check")
    print("=" * 60)
    print()

    # Run the Flask application
    app.run(debug=True, host='0.0.0.0', port=5000)
