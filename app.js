// Application State
const appState = {
  apiKeys: [],
  currentKeyIndex: 0,
  selectedClass: '',
  selectedSubject: '',
  generatedQuestions: []
};

// Subject data by class
const subjectsByClass = {
  '9': ['Mathematics', 'Science', 'Social Science', 'English', 'Hindi'],
  '10': ['Mathematics', 'Science', 'Social Science', 'English', 'Hindi'],
  '11': ['Mathematics', 'Physics', 'Chemistry', 'Biology', 'English', 'Computer Science', 'Business Studies', 'Accountancy', 'Economics', 'History', 'Geography', 'Political Science', 'Psychology', 'Physical Education'],
  '12': ['Mathematics', 'Physics', 'Chemistry', 'Biology', 'English', 'Computer Science', 'Business Studies', 'Accountancy', 'Economics', 'History', 'Geography', 'Political Science', 'Psychology', 'Physical Education']
};

// DOM Elements
const apiKey1Input = document.getElementById('apiKey1');
const apiKey2Input = document.getElementById('apiKey2');
const apiKey3Input = document.getElementById('apiKey3');
const saveApiKeysBtn = document.getElementById('saveApiKeysBtn');
const apiStatusBadge = document.getElementById('apiStatus');
const apiMessage = document.getElementById('apiMessage');
const classSelect = document.getElementById('classSelect');
const subjectSelect = document.getElementById('subjectSelect');
const generationForm = document.getElementById('generationForm');
const generateBtn = document.getElementById('generateBtn');
const generationMessage = document.getElementById('generationMessage');
const loadingContainer = document.getElementById('loadingContainer');
const resultsSection = document.getElementById('resultsSection');
const paperInfo = document.getElementById('paperInfo');
const questionsContainer = document.getElementById('questionsContainer');
const downloadBtn = document.getElementById('downloadBtn');
const newPaperBtn = document.getElementById('newPaperBtn');

// Toggle password visibility
function setupPasswordToggles() {
  const toggleButtons = document.querySelectorAll('.toggle-password');
  
  toggleButtons.forEach(button => {
    button.addEventListener('click', function() {
      const targetId = this.getAttribute('data-target');
      const input = document.getElementById(targetId);
      
      if (input.type === 'password') {
        input.type = 'text';
        this.innerHTML = `
          <svg class="eye-icon" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
            <line x1="1" y1="1" x2="23" y2="23"></line>
          </svg>
        `;
      } else {
        input.type = 'password';
        this.innerHTML = `
          <svg class="eye-icon" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
            <circle cx="12" cy="12" r="3"></circle>
          </svg>
        `;
      }
    });
  });
}

// Save API Keys
function saveApiKeys() {
  const key1 = apiKey1Input.value.trim();
  const key2 = apiKey2Input.value.trim();
  const key3 = apiKey3Input.value.trim();
  
  // Reset API keys
  appState.apiKeys = [];
  
  // Add non-empty keys
  if (key1) appState.apiKeys.push(key1);
  if (key2) appState.apiKeys.push(key2);
  if (key3) appState.apiKeys.push(key3);
  
  // Validate
  if (appState.apiKeys.length === 0) {
    showMessage(apiMessage, 'Please enter at least one API key.', 'error');
    return;
  }
  
  // Success
  showMessage(apiMessage, `Successfully saved ${appState.apiKeys.length} API key(s)!`, 'success');
  apiStatusBadge.textContent = 'Configured';
  apiStatusBadge.classList.add('configured');
  
  // Enable generate button if class and subject are selected
  updateGenerateButton();
}

// Update Generate Button State
function updateGenerateButton() {
  const hasApiKeys = appState.apiKeys.length > 0;
  const hasClass = classSelect.value !== '';
  const hasSubject = subjectSelect.value !== '';
  
  generateBtn.disabled = !(hasApiKeys && hasClass && hasSubject);
}

// Populate subjects based on class
function populateSubjects() {
  const selectedClass = classSelect.value;
  
  if (!selectedClass) {
    subjectSelect.disabled = true;
    subjectSelect.innerHTML = '<option value="">First select a class</option>';
    return;
  }
  
  // Enable subject select
  subjectSelect.disabled = false;
  
  // Get subjects for selected class
  const subjects = subjectsByClass[selectedClass] || [];
  
  // Populate options
  subjectSelect.innerHTML = '<option value="">Choose a subject</option>';
  subjects.forEach(subject => {
    const option = document.createElement('option');
    option.value = subject;
    option.textContent = subject;
    subjectSelect.appendChild(option);
  });
  
  appState.selectedClass = selectedClass;
  updateGenerateButton();
}

// Handle subject change
function handleSubjectChange() {
  appState.selectedSubject = subjectSelect.value;
  updateGenerateButton();
}

// Get next API key (round-robin)
function getNextApiKey() {
  if (appState.apiKeys.length === 0) return null;
  
  const key = appState.apiKeys[appState.currentKeyIndex];
  appState.currentKeyIndex = (appState.currentKeyIndex + 1) % appState.apiKeys.length;
  
  return key;
}

// Generate Sample Paper
async function generateSamplePaper(event) {
  event.preventDefault();
  
  // Validate
  if (appState.apiKeys.length === 0) {
    showMessage(generationMessage, 'Please configure your API keys first.', 'error');
    return;
  }
  
  if (!appState.selectedClass || !appState.selectedSubject) {
    showMessage(generationMessage, 'Please select both class and subject.', 'error');
    return;
  }
  
  // Hide previous results and messages
  resultsSection.style.display = 'none';
  generationMessage.classList.remove('show');
  
  // Show loading
  loadingContainer.style.display = 'block';
  
  // Get API key
  const apiKey = getNextApiKey();
  
  // Create prompt
  const prompt = `Generate 50 CBSE board exam style questions for Class ${appState.selectedClass} ${appState.selectedSubject}. Include a variety of question types: MCQs (20%), Short Answer (30%), Long Answer (30%), and Case-Based/Application Questions (20%). Format each question with proper numbering from 1 to 50. Make questions aligned with CBSE exam pattern and marking scheme.`;
  
  try {
    // Simulate API call (in real implementation, this would call Gemini API through backend)
    await simulateApiCall(prompt, apiKey);
    
    // Display results
    displayResults();
    
  } catch (error) {
    console.error('Error generating paper:', error);
    loadingContainer.style.display = 'none';
    showMessage(generationMessage, 'Failed to generate paper. Please check your API keys and try again.', 'error');
  }
}

// Simulate API call (replace with actual Gemini API call in production)
async function simulateApiCall(prompt, apiKey) {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 3000));
  
  // Generate sample questions based on class and subject
  appState.generatedQuestions = generateSampleQuestions();
}

// Generate sample questions (placeholder for actual API response)
function generateSampleQuestions() {
  const questionTypes = {
    mcq: { count: 10, prefix: 'Multiple Choice Question' },
    shortAnswer: { count: 15, prefix: 'Short Answer Question' },
    longAnswer: { count: 15, prefix: 'Long Answer Question' },
    caseBased: { count: 10, prefix: 'Case-Based Question' }
  };
  
  const questions = [];
  const subject = appState.selectedSubject;
  const classNum = appState.selectedClass;
  
  let questionNumber = 1;
  
  // MCQs
  for (let i = 0; i < questionTypes.mcq.count; i++) {
    questions.push(`${questionNumber}. (MCQ) Which of the following statements about ${subject} in Class ${classNum} curriculum is correct? (a) Option A (b) Option B (c) Option C (d) Option D`);
    questionNumber++;
  }
  
  // Short Answer Questions
  for (let i = 0; i < questionTypes.shortAnswer.count; i++) {
    questions.push(`${questionNumber}. (2-3 Marks) Explain the concept of [topic ${i + 1}] in ${subject} with suitable examples.`);
    questionNumber++;
  }
  
  // Long Answer Questions
  for (let i = 0; i < questionTypes.longAnswer.count; i++) {
    questions.push(`${questionNumber}. (5-6 Marks) Discuss in detail the importance and applications of [advanced topic ${i + 1}] in ${subject}. Support your answer with relevant diagrams and examples.`);
    questionNumber++;
  }
  
  // Case-Based Questions
  for (let i = 0; i < questionTypes.caseBased.count; i++) {
    questions.push(`${questionNumber}. (4 Marks) Read the following case study and answer the questions:\n\nCase Study: [Scenario related to ${subject}]\n\n(a) Analyze the given situation.\n(b) What would be the outcome?\n(c) Suggest alternatives.`);
    questionNumber++;
  }
  
  return questions;
}

// Display Results
function displayResults() {
  // Hide loading
  loadingContainer.style.display = 'none';
  
  // Show results section
  resultsSection.style.display = 'block';
  
  // Update paper info
  const currentDate = new Date().toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
  
  paperInfo.innerHTML = `
    <h3>Class ${appState.selectedClass} - ${appState.selectedSubject}</h3>
    <p><strong>Total Questions:</strong> 50 | <strong>Generated on:</strong> ${currentDate}</p>
    <p><strong>Question Distribution:</strong> MCQs (20%), Short Answer (30%), Long Answer (30%), Case-Based (20%)</p>
  `;
  
  // Display questions
  questionsContainer.innerHTML = '';
  appState.generatedQuestions.forEach(question => {
    const questionItem = document.createElement('div');
    questionItem.className = 'question-item';
    questionItem.innerHTML = `<div class="question-text">${question}</div>`;
    questionsContainer.appendChild(questionItem);
  });
  
  // Scroll to results
  resultsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

// Download paper as text file
function downloadPaper() {
  const currentDate = new Date().toLocaleDateString('en-IN');
  
  let content = `CBSE SAMPLE PAPER\n`;
  content += `${'='.repeat(50)}\n\n`;
  content += `Class: ${appState.selectedClass}\n`;
  content += `Subject: ${appState.selectedSubject}\n`;
  content += `Date: ${currentDate}\n`;
  content += `Total Questions: 50\n\n`;
  content += `${'='.repeat(50)}\n\n`;
  
  appState.generatedQuestions.forEach(question => {
    content += `${question}\n\n`;
  });
  
  content += `${'='.repeat(50)}\n`;
  content += `End of Paper\n`;
  
  // Create blob and download
  const blob = new Blob([content], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `CBSE_Class${appState.selectedClass}_${appState.selectedSubject}_Sample_Paper.txt`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

// Generate new paper (reset)
function generateNewPaper() {
  resultsSection.style.display = 'none';
  generationMessage.classList.remove('show');
  classSelect.value = '';
  subjectSelect.value = '';
  subjectSelect.disabled = true;
  subjectSelect.innerHTML = '<option value="">First select a class</option>';
  appState.selectedClass = '';
  appState.selectedSubject = '';
  appState.generatedQuestions = [];
  updateGenerateButton();
  
  // Scroll to form
  document.querySelector('.generation-section').scrollIntoView({ behavior: 'smooth', block: 'start' });
}

// Show message utility
function showMessage(element, message, type) {
  element.textContent = message;
  element.className = `message-box ${type} show`;
  
  // Auto-hide after 5 seconds
  setTimeout(() => {
    element.classList.remove('show');
  }, 5000);
}

// Event Listeners
saveApiKeysBtn.addEventListener('click', saveApiKeys);
classSelect.addEventListener('change', populateSubjects);
subjectSelect.addEventListener('change', handleSubjectChange);
generationForm.addEventListener('submit', generateSamplePaper);
downloadBtn.addEventListener('click', downloadPaper);
newPaperBtn.addEventListener('click', generateNewPaper);

// Initialize
setupPasswordToggles();
updateGenerateButton();

// Note: In production, replace simulateApiCall with actual Gemini API integration
// This would typically be done through a Python Flask backend that handles:
// 1. Receiving the prompt and API key from the frontend
// 2. Making the actual API call to Google Gemini
// 3. Processing and returning the response
// 4. Handling rate limiting and key rotation on the server side