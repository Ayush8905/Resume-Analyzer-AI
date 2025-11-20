# 🤖 AI Resume Optimizer & Generator
## Live Demo Link: https://resume-optimizer-ai.vercel.app/

A beautiful, AI-powered web application that optimizes resumes based on job descriptions using Google's Gemini API. Built with modern animations and responsive design.

![AI Resume Optimizer](https://img.shields.io/badge/AI-Resume%20Optimizer-blue?style=for-the-badge&logo=robot)
![Python](https://img.shields.io/badge/Python-3.8+-blue?style=for-the-badge&logo=python)
![Flask](https://img.shields.io/badge/Flask-2.3+-green?style=for-the-badge&logo=flask)
![Gemini AI](https://img.shields.io/badge/Gemini-AI-orange?style=for-the-badge&logo=google)

## ✨ Features

- 📄 **Multi-format Support**: Upload PDF, DOCX, or TXT resume files
- 🎯 **Job-Specific Optimization**: Tailors resume content to match job descriptions
- 🤖 **AI-Powered Analysis**: Uses Google Gemini AI for intelligent optimization
- 📊 **ATS Score**: Get compatibility scores for Applicant Tracking Systems
- 📝 **Detailed Changes**: View comprehensive summary of all modifications
- 💾 **Download Ready**: Get optimized resume in DOCX format
- 🎨 **Beautiful UI**: Modern design with smooth animations
- 📱 **Responsive**: Works perfectly on desktop and mobile devices

## 🛠️ Tech Stack

| Component | Technology |
|-----------|------------|
| **Backend** | Python Flask |
| **Frontend** | HTML5, CSS3, JavaScript |
| **AI Engine** | Google Gemini API |
| **File Processing** | pdfplumber, python-docx |
| **Styling** | Custom CSS with animations |
| **Document Generation** | ReportLab, python-docx |

## 🚀 Quick Start

### Prerequisites
- Python 3.8 or higher
- Google Gemini API key ([Get one here](https://makersuite.google.com/app/apikey))

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/yourusername/ai-resume-optimizer.git
cd ai-resume-optimizer
```

2. **Install dependencies**
```bash
pip install -r requirements.txt
```

3. **Set up environment variables**
```bash
cp .env.example .env
```
Edit `.env` and add your Gemini API key:
```
GEMINI_API_KEY=your_actual_api_key_here
FLASK_ENV=development
FLASK_DEBUG=True
```

4. **Run the application**
```bash
python app.py
```

5. **Open your browser**
Navigate to `http://localhost:5000`

## 📁 Project Structure

```
ai-resume-optimizer/
├── 📄 app.py                 # Main Flask application
├── 📄 requirements.txt       # Python dependencies
├── 📄 setup.py              # Automated setup script
├── 📄 .env.example          # Environment variables template
├── 📄 .gitignore            # Git ignore rules
├── 📄 README.md             # This file
├── 📁 static/               # Static assets
│   ├── 🎨 style.css         # Beautiful CSS with animations
│   └── ⚡ script.js         # Interactive JavaScript
├── 📁 templates/            # HTML templates
│   └── 🌐 index.html        # Main application interface
└── 📁 uploads/              # Temporary file storage
    └── 📄 .gitkeep          # Keep directory in git
```

## 🎯 How It Works

1. **Upload Resume**: Drag & drop or select your resume file (PDF, DOCX, TXT)
2. **Add Job Description**: Paste the complete job posting
3. **AI Analysis**: Gemini AI analyzes both documents
4. **Optimization**: AI optimizes resume for the specific job
5. **Review Results**: See ATS score, changes made, and recommendations
6. **Download**: Get your optimized resume in DOCX format

## 🎨 Features Showcase

### Beautiful Animations
- ✨ Gradient background with smooth transitions
- 🌟 Glowing text effects on headers
- 💫 Floating particle effects
- 🔄 Interactive button animations
- 📱 Responsive hover effects

### Smart AI Optimization
- 🎯 Keyword optimization for ATS systems
- 📊 Industry-specific terminology enhancement
- 🔧 Format improvements for readability
- 📈 Quantification of achievements
- 🎪 Action verb enhancement

## 🔧 Configuration

### Environment Variables
```bash
GEMINI_API_KEY=your_gemini_api_key_here  # Required: Your Gemini API key
FLASK_ENV=development                     # Optional: Flask environment
FLASK_DEBUG=True                         # Optional: Enable debug mode
```

### File Upload Limits
- Maximum file size: 16MB
- Supported formats: PDF, DOCX, TXT
- Processing timeout: 60 seconds

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Developer

**Developed by Ayush(@sh)**

- 🌟 Passionate about AI and web development
- 💼 Creating tools that make job hunting easier
- 🚀 Always learning and building cool stuff

## 🙏 Acknowledgments

- Google Gemini AI for powerful language processing
- Flask community for the excellent web framework
- All contributors and users of this project

## 📞 Support

If you encounter any issues or have questions:

1. Check the [Issues](https://github.com/yourusername/ai-resume-optimizer/issues) page
2. Create a new issue if your problem isn't already reported
3. Provide detailed information about your setup and the issue

---

⭐ **Star this repository if you found it helpful!** ⭐
