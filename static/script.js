document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('optimizeForm');
    const optimizeBtn = document.getElementById('optimizeBtn');
    const loadingSection = document.getElementById('loadingSection');
    const resultsSection = document.getElementById('resultsSection');
    const errorSection = document.getElementById('errorSection');
    const uploadSection = document.querySelector('.upload-section');

    form.addEventListener('submit', async function (e) {
        e.preventDefault();

        // Add ripple effect to button
        optimizeBtn.classList.add('clicked');
        setTimeout(() => optimizeBtn.classList.remove('clicked'), 600);

        const formData = new FormData(form);
        const resumeFile = document.getElementById('resume').files[0];
        const jobDescription = document.getElementById('job_description').value.trim();

        // Validation with enhanced animations
        if (!resumeFile) {
            showError('Please select a resume file.');
            shakeElement(document.getElementById('resume'));
            return;
        }

        if (!jobDescription) {
            showError('Please enter a job description.');
            shakeElement(document.getElementById('job_description'));
            return;
        }

        // Check file size (16MB limit)
        if (resumeFile.size > 16 * 1024 * 1024) {
            showError('File size must be less than 16MB.');
            shakeElement(document.getElementById('resume'));
            return;
        }

        // Show loading state with enhanced animation
        showLoading();

        try {
            const response = await fetch('/optimize', {
                method: 'POST',
                body: formData
            });

            const data = await response.json();

            if (data.success) {
                showResults(data);
            } else {
                showError(data.error || 'An error occurred while optimizing your resume.');
            }
        } catch (error) {
            console.error('Error:', error);
            showError('Network error. Please check your connection and try again.');
        }
    });

    function showLoading() {
        uploadSection.style.display = 'none';
        resultsSection.style.display = 'none';
        errorSection.style.display = 'none';
        loadingSection.style.display = 'block';
        optimizeBtn.disabled = true;
    }

    function showResults(data) {
        loadingSection.style.display = 'none';
        errorSection.style.display = 'none';
        resultsSection.style.display = 'block';

        // Add success animation
        createSuccessAnimation();

        // Animate ATS score counting up
        animateCounter(document.getElementById('atsScore'), 0, parseInt(data.ats_score), 2000);

        // Typewriter effect for optimized content
        typewriterEffect(document.getElementById('optimizedContent'), data.optimized_resume, 50);

        // Populate changes
        const changesContent = document.getElementById('changesContent');
        if (data.changes_summary && data.changes_summary.length > 0) {
            const changesList = document.createElement('ul');
            data.changes_summary.forEach(change => {
                const li = document.createElement('li');
                li.textContent = change;
                changesList.appendChild(li);
            });
            changesContent.innerHTML = '';
            changesContent.appendChild(changesList);
        } else {
            changesContent.textContent = 'No specific changes documented.';
        }

        // Populate recommendations
        const recommendationsContent = document.getElementById('recommendationsContent');
        if (data.recommendations && data.recommendations.length > 0) {
            const recList = document.createElement('ul');
            data.recommendations.forEach(rec => {
                const li = document.createElement('li');
                li.textContent = rec;
                recList.appendChild(li);
            });
            recommendationsContent.innerHTML = '';
            recommendationsContent.appendChild(recList);
        } else {
            recommendationsContent.textContent = 'No additional recommendations at this time.';
        }

        // Set up download button
        const downloadBtn = document.getElementById('downloadBtn');
        downloadBtn.onclick = function () {
            window.open(data.download_url, '_blank');
        };

        // Reset form state
        optimizeBtn.disabled = false;
    }

    function showError(message) {
        loadingSection.style.display = 'none';
        resultsSection.style.display = 'none';
        errorSection.style.display = 'block';
        document.getElementById('errorText').textContent = message;
        optimizeBtn.disabled = false;
    }

    // File input styling
    const fileInput = document.getElementById('resume');
    fileInput.addEventListener('change', function () {
        const fileName = this.files[0]?.name;
        if (fileName) {
            const label = this.previousElementSibling;
            if (label && label.tagName === 'LABEL') {
                label.innerHTML = `<i class="fas fa-file-check"></i> ${fileName}`;
                label.style.color = '#28a745';
            }
        }
    });
});

function showTab(tabName) {
    // Hide all tab contents
    const tabContents = document.querySelectorAll('.tab-content');
    tabContents.forEach(content => {
        content.classList.remove('active');
    });

    // Remove active class from all tab buttons
    const tabBtns = document.querySelectorAll('.tab-btn');
    tabBtns.forEach(btn => {
        btn.classList.remove('active');
    });

    // Show selected tab content
    document.getElementById(tabName + 'Tab').classList.add('active');

    // Add active class to clicked button
    event.target.classList.add('active');
}

function resetForm() {
    document.getElementById('optimizeForm').reset();
    document.querySelector('.upload-section').style.display = 'block';
    document.getElementById('resultsSection').style.display = 'none';
    document.getElementById('errorSection').style.display = 'none';
    document.getElementById('loadingSection').style.display = 'none';

    // Reset file input label
    const fileLabel = document.querySelector('label[for="resume"]');
    fileLabel.innerHTML = '<i class="fas fa-file-upload"></i> Upload Resume';
    fileLabel.style.color = '#555';
}

// Add some interactive features
document.addEventListener('DOMContentLoaded', function () {
    // Add hover effects to form elements
    const formElements = document.querySelectorAll('input, textarea, button');
    formElements.forEach(element => {
        element.addEventListener('focus', function () {
            this.style.transform = 'scale(1.02)';
        });

        element.addEventListener('blur', function () {
            this.style.transform = 'scale(1)';
        });
    });

    // Add file drag and drop functionality
    const fileInput = document.getElementById('resume');
    const fileInputContainer = fileInput.parentElement;

    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
        fileInputContainer.addEventListener(eventName, preventDefaults, false);
    });

    function preventDefaults(e) {
        e.preventDefault();
        e.stopPropagation();
    }

    ['dragenter', 'dragover'].forEach(eventName => {
        fileInputContainer.addEventListener(eventName, highlight, false);
    });

    ['dragleave', 'drop'].forEach(eventName => {
        fileInputContainer.addEventListener(eventName, unhighlight, false);
    });

    function highlight(e) {
        fileInputContainer.classList.add('drag-over');
        fileInputContainer.style.borderColor = '#667eea';
        fileInputContainer.style.backgroundColor = '#f0f4ff';
    }

    function unhighlight(e) {
        fileInputContainer.classList.remove('drag-over');
        fileInputContainer.style.borderColor = '#ddd';
        fileInputContainer.style.backgroundColor = '#f9f9f9';
    }

    fileInputContainer.addEventListener('drop', handleDrop, false);

    function handleDrop(e) {
        const dt = e.dataTransfer;
        const files = dt.files;

        if (files.length > 0) {
            fileInput.files = files;
            const event = new Event('change', { bubbles: true });
            fileInput.dispatchEvent(event);
        }
    }
});
// Enhanc
ed Animation Functions
function shakeElement(element) {
    element.style.animation = 'shake 0.5s ease-in-out';
    setTimeout(() => {
        element.style.animation = '';
    }, 500);
}

function createSuccessAnimation() {
    const successDiv = document.createElement('div');
    successDiv.innerHTML = `
        <svg class="success-checkmark" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 52 52">
            <circle class="success-checkmark__circle" cx="26" cy="26" r="25" fill="none"/>
            <path class="success-checkmark__check" fill="none" d="m14.1 27.2l7.1 7.2 16.7-16.8"/>
        </svg>
    `;
    successDiv.style.position = 'fixed';
    successDiv.style.top = '50%';
    successDiv.style.left = '50%';
    successDiv.style.transform = 'translate(-50%, -50%)';
    successDiv.style.zIndex = '9999';
    successDiv.style.background = 'rgba(255, 255, 255, 0.95)';
    successDiv.style.borderRadius = '50%';
    successDiv.style.padding = '20px';
    successDiv.style.boxShadow = '0 10px 30px rgba(0, 0, 0, 0.3)';

    document.body.appendChild(successDiv);

    setTimeout(() => {
        successDiv.remove();
    }, 2000);
}

function animateCounter(element, start, end, duration) {
    let startTime = null;

    function animate(currentTime) {
        if (startTime === null) startTime = currentTime;
        const timeElapsed = currentTime - startTime;
        const progress = Math.min(timeElapsed / duration, 1);

        const currentValue = Math.floor(progress * (end - start) + start);
        element.textContent = currentValue;

        if (progress < 1) {
            requestAnimationFrame(animate);
        }
    }

    requestAnimationFrame(animate);
}

function typewriterEffect(element, text, speed) {
    element.textContent = '';
    let i = 0;

    function typeChar() {
        if (i < text.length) {
            element.textContent += text.charAt(i);
            i++;
            setTimeout(typeChar, speed);
        }
    }

    typeChar();
}

function createFloatingParticles() {
    const colors = ['#667eea', '#764ba2', '#f093fb', '#28a745', '#ffd700'];

    for (let i = 0; i < 10; i++) {
        const particle = document.createElement('div');
        particle.style.position = 'fixed';
        particle.style.width = '6px';
        particle.style.height = '6px';
        particle.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        particle.style.borderRadius = '50%';
        particle.style.pointerEvents = 'none';
        particle.style.zIndex = '1000';
        particle.style.left = Math.random() * window.innerWidth + 'px';
        particle.style.top = window.innerHeight + 'px';

        document.body.appendChild(particle);

        const animation = particle.animate([
            { transform: 'translateY(0px) rotate(0deg)', opacity: 1 },
            { transform: `translateY(-${window.innerHeight + 100}px) rotate(360deg)`, opacity: 0 }
        ], {
            duration: Math.random() * 3000 + 2000,
            easing: 'ease-out'
        });

        animation.onfinish = () => particle.remove();
    }
}

// Enhanced scroll reveal animation
function revealOnScroll() {
    const reveals = document.querySelectorAll('.scroll-reveal');

    reveals.forEach(reveal => {
        const windowHeight = window.innerHeight;
        const elementTop = reveal.getBoundingClientRect().top;
        const elementVisible = 150;

        if (elementTop < windowHeight - elementVisible) {
            reveal.classList.add('revealed');
        }
    });
}

// Add CSS for shake animation
const shakeCSS = `
@keyframes shake {
    0%, 100% { transform: translateX(0); }
    10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
    20%, 40%, 60%, 80% { transform: translateX(5px); }
}
`;

const style = document.createElement('style');
style.textContent = shakeCSS;
document.head.appendChild(style);

// Initialize scroll reveal
window.addEventListener('scroll', revealOnScroll);

// Add floating particles on successful submission
document.addEventListener('DOMContentLoaded', function () {
    // Create floating particles periodically
    setInterval(createFloatingParticles, 10000);

    // Add interactive hover effects
    const interactiveElements = document.querySelectorAll('.btn-primary, .btn-secondary, .tab-btn');
    interactiveElements.forEach(element => {
        element.classList.add('interactive-hover');
    });

    // Add scroll reveal class to elements
    const elementsToReveal = document.querySelectorAll('.form-group, .results-section > *');
    elementsToReveal.forEach(element => {
        element.classList.add('scroll-reveal');
    });

    // Initial scroll reveal check
    revealOnScroll();
});