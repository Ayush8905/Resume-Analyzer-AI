document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('optimizeForm');
    const optimizeBtn = document.getElementById('optimizeBtn');
    const loadingSection = document.getElementById('loadingSection');
    const resultsSection = document.getElementById('resultsSection');
    const errorSection = document.getElementById('errorSection');
    const uploadSection = document.querySelector('.upload-section');

    form.addEventListener('submit', async function (e) {
        e.preventDefault();

        const formData = new FormData(form);
        const resumeFile = document.getElementById('resume').files[0];
        const jobDescription = document.getElementById('job_description').value.trim();

        // Validation
        if (!resumeFile) {
            showError('Please select a resume file.');
            return;
        }

        if (!jobDescription) {
            showError('Please enter a job description.');
            return;
        }

        // Check file size (16MB limit)
        if (resumeFile.size > 16 * 1024 * 1024) {
            showError('File size must be less than 16MB.');
            return;
        }

        // Show loading state
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

        // Populate results
        document.getElementById('atsScore').textContent = data.ats_score;
        document.getElementById('optimizedContent').textContent = data.optimized_resume;

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