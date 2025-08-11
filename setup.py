#!/usr/bin/env python3
"""
Setup script for AI Resume Optimizer
"""

import os
import subprocess
import sys

def install_requirements():
    """Install required packages"""
    print("Installing required packages...")
    try:
        subprocess.check_call([sys.executable, "-m", "pip", "install", "-r", "requirements.txt"])
        print("✅ All packages installed successfully!")
    except subprocess.CalledProcessError as e:
        print(f"❌ Error installing packages: {e}")
        return False
    return True

def setup_environment():
    """Setup environment file"""
    if not os.path.exists('.env'):
        print("Creating .env file from template...")
        with open('.env.example', 'r') as template:
            content = template.read()
        
        with open('.env', 'w') as env_file:
            env_file.write(content)
        
        print("✅ .env file created!")
        print("⚠️  Please add your Gemini API key to the .env file")
    else:
        print("✅ .env file already exists")

def create_directories():
    """Create necessary directories"""
    directories = ['uploads', 'static', 'templates']
    for directory in directories:
        if not os.path.exists(directory):
            os.makedirs(directory)
            print(f"✅ Created {directory} directory")
        else:
            print(f"✅ {directory} directory already exists")

def main():
    print("🚀 Setting up AI Resume Optimizer...")
    print("=" * 50)
    
    # Create directories
    create_directories()
    
    # Install requirements
    if not install_requirements():
        return
    
    # Setup environment
    setup_environment()
    
    print("\n" + "=" * 50)
    print("🎉 Setup complete!")
    print("\nNext steps:")
    print("1. Add your Gemini API key to the .env file")
    print("2. Run: python app.py")
    print("3. Open http://localhost:5000 in your browser")
    print("\nTo get a Gemini API key:")
    print("- Visit: https://makersuite.google.com/app/apikey")
    print("- Create a new API key")
    print("- Add it to your .env file")

if __name__ == "__main__":
    main()