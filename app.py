import os
import json
from flask import Flask, render_template, request, jsonify, send_file
from werkzeug.utils import secure_filename
import pdfplumber
import docx
from docx import Document
from docx.shared import Inches
import google.generativeai as genai
from dotenv import load_dotenv
import tempfile
import uuid
import threading
import time

# Load environment variables
load_dotenv()

app = Flask(__name__)
app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024  # 16MB max file size
app.config['UPLOAD_FOLDER'] = 'uploads'

# Create uploads directory if it doesn't exist
os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)

# Validate and configure Gemini API
api_key = os.getenv('GEMINI_API_KEY')
if not api_key or api_key == 'your_gemini_api_key_here':
    print("ERROR: Please set a valid GEMINI_API_KEY in your .env file")
    print("Get your API key from: https://makersuite.google.com/app/apikey")
    exit(1)

genai.configure(api_key=api_key)

ALLOWED_EXTENSIONS = {'txt', 'pdf', 'docx'}

def cleanup_old_files():
    """Clean up files older than 1 hour"""
    try:
        current_time = time.time()
        for filename in os.listdir(app.config['UPLOAD_FOLDER']):
            file_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
            if os.path.isfile(file_path):
                file_age = current_time - os.path.getctime(file_path)
                if file_age > 3600:  # 1 hour
                    os.remove(file_path)
                    print(f"Cleaned up old file: {filename}")
    except Exception as e:
        print(f"Error during cleanup: {e}")

def schedule_cleanup():
    """Schedule periodic cleanup"""
    cleanup_old_files()
    threading.Timer(1800, schedule_cleanup).start()  # Run every 30 minutes

# Start cleanup scheduler
schedule_cleanup()

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

def extract_pdf_text(file_path):
    """Extract text from PDF file"""
    try:
        with pdfplumber.open(file_path) as pdf:
            text = ''
            for page in pdf.pages:
                page_text = page.extract_text()
                if page_text:
                    text += page_text + '\n'
            return text.strip()
    except Exception as e:
        raise Exception(f"Error reading PDF: {str(e)}")

def extract_docx_text(file_path):
    """Extract text from DOCX file"""
    try:
        doc = docx.Document(file_path)
        text = ''
        for paragraph in doc.paragraphs:
            text += paragraph.text + '\n'
        return text.strip()
    except Exception as e:
        raise Exception(f"Error reading DOCX: {str(e)}")

def extract_txt_text(file_path):
    """Extract text from TXT file"""
    try:
        with open(file_path, 'r', encoding='utf-8') as file:
            return file.read().strip()
    except Exception as e:
        raise Exception(f"Error reading TXT: {str(e)}")

def extract_text_from_file(file_path, filename):
    """Extract text based on file extension"""
    extension = filename.rsplit('.', 1)[1].lower()
    
    if extension == 'pdf':
        return extract_pdf_text(file_path)
    elif extension == 'docx':
        return extract_docx_text(file_path)
    elif extension == 'txt':
        return extract_txt_text(file_path)
    else:
        raise Exception("Unsupported file format")

def optimize_resume_with_gemini(resume_text, job_description):
    """Use Gemini API to optimize resume"""
    try:
        model = genai.GenerativeModel('gemini-1.5-flash')
        
        prompt = f"""
        You are an expert resume optimizer and ATS specialist. Please analyze the following resume and job description, then provide an optimized version.

        RESUME:
        {resume_text}

        JOB DESCRIPTION:
        {job_description}

        Please provide your response in the following JSON format:
        {{
            "optimized_resume": "The complete optimized resume text with improved keywords, formatting, and ATS optimization",
            "changes_summary": [
                "List of specific changes made",
                "Keywords added or modified",
                "Formatting improvements",
                "ATS optimization tips applied"
            ],
            "ats_score": "A score from 1-10 indicating ATS compatibility",
            "recommendations": [
                "Additional recommendations for the candidate"
            ]
        }}

        Focus on:
        1. Keyword optimization for the specific job
        2. ATS-friendly formatting
        3. Quantifying achievements where possible
        4. Tailoring experience to match job requirements
        5. Improving action verbs and impact statements
        """
        
        response = model.generate_content(prompt)
        
        if not response or not response.text:
            raise Exception("Empty response from Gemini API")
        
        # Try to parse JSON response
        try:
            # Clean the response text
            response_text = response.text.strip()
            if response_text.startswith('```json'):
                response_text = response_text[7:]
            if response_text.endswith('```'):
                response_text = response_text[:-3]
            
            result = json.loads(response_text)
            
            # Validate required fields
            required_fields = ['optimized_resume', 'changes_summary', 'ats_score', 'recommendations']
            for field in required_fields:
                if field not in result:
                    result[field] = [] if field in ['changes_summary', 'recommendations'] else "N/A"
            
            return result
        except json.JSONDecodeError as e:
            print(f"JSON parsing error: {e}")
            # If JSON parsing fails, return a structured response
            return {
                "optimized_resume": response.text,
                "changes_summary": ["AI optimization applied - manual review recommended"],
                "ats_score": "8",
                "recommendations": ["Review the optimized content and make final adjustments"]
            }
            
    except Exception as e:
        raise Exception(f"Error with Gemini API: {str(e)}")

def create_docx_from_text(text, filename):
    """Create a DOCX file from text"""
    doc = Document()
    
    # Add title
    title = doc.add_heading('Optimized Resume', 0)
    title.alignment = 1  # Center alignment
    
    # Split text into paragraphs and add to document
    paragraphs = text.split('\n')
    for para_text in paragraphs:
        if para_text.strip():
            if para_text.isupper() or para_text.endswith(':'):
                # Likely a section header
                doc.add_heading(para_text, level=1)
            else:
                doc.add_paragraph(para_text)
    
    # Save to temporary file
    temp_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
    doc.save(temp_path)
    return temp_path

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/optimize', methods=['POST'])
def optimize_resume():
    try:
        # Check if file was uploaded
        if 'resume' not in request.files:
            return jsonify({'error': 'No resume file uploaded'}), 400
        
        file = request.files['resume']
        job_description = request.form.get('job_description', '').strip()
        
        if file.filename == '':
            return jsonify({'error': 'No file selected'}), 400
        
        if not job_description:
            return jsonify({'error': 'Job description is required'}), 400
        
        if not allowed_file(file.filename):
            return jsonify({'error': 'Invalid file format. Please upload PDF, DOCX, or TXT files.'}), 400
        
        # Save uploaded file
        filename = secure_filename(file.filename)
        unique_filename = f"{uuid.uuid4()}_{filename}"
        file_path = os.path.join(app.config['UPLOAD_FOLDER'], unique_filename)
        file.save(file_path)
        
        try:
            # Extract text from uploaded file
            resume_text = extract_text_from_file(file_path, filename)
            
            if not resume_text.strip():
                return jsonify({'error': 'Could not extract text from the uploaded file'}), 400
            
            # Optimize resume using Gemini
            optimization_result = optimize_resume_with_gemini(resume_text, job_description)
            
            # Create optimized resume file
            optimized_filename = f"optimized_{uuid.uuid4()}.docx"
            optimized_file_path = create_docx_from_text(
                optimization_result['optimized_resume'], 
                optimized_filename
            )
            
            return jsonify({
                'success': True,
                'optimized_resume': optimization_result['optimized_resume'],
                'changes_summary': optimization_result['changes_summary'],
                'ats_score': optimization_result['ats_score'],
                'recommendations': optimization_result['recommendations'],
                'download_url': f'/download/{optimized_filename}'
            })
            
        finally:
            # Clean up uploaded file
            if os.path.exists(file_path):
                os.remove(file_path)
                
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/download/<filename>')
def download_file(filename):
    try:
        file_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
        if os.path.exists(file_path):
            return send_file(file_path, as_attachment=True, download_name=f"optimized_resume.docx")
        else:
            return jsonify({'error': 'File not found'}), 404
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    app.run(debug=os.getenv('FLASK_DEBUG', 'False').lower() == 'true', host='0.0.0.0', port=port)