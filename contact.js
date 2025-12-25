document.addEventListener('DOMContentLoaded', function() {
    const contactForm = document.getElementById('contactForm');
    const submitBtn = document.querySelector('.submit-btn');
    
    if (typeof emailjs === 'undefined') {
        console.error('EmailJS is not loaded');
        showNotification('EmailJS failed to load. Please refresh the page.', 'error');
        return;
    }
    
    console.log('EmailJS is loaded and ready');
    
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        if (validateForm()) {
            submitFormWithEmailJS();
        }
    });
    
    const inputs = contactForm.querySelectorAll('input, select, textarea');
    inputs.forEach(input => {
        input.addEventListener('blur', function() {
            validateField(this);
        });
        
        input.addEventListener('input', function() {
            clearFieldError(this);
        });
    });
    
    function validateForm() {
        let isValid = true;
        const requiredFields = contactForm.querySelectorAll('[required]');
        
        requiredFields.forEach(field => {
            if (!validateField(field)) {
                isValid = false;
            }
        });
        
        const emailField = document.getElementById('email');
        if (emailField.value && !isValidEmail(emailField.value)) {
            showFieldError(emailField, 'Please enter a valid email address');
            isValid = false;
        }
        
        return isValid;
    }
    
    function validateField(field) {
        const value = field.value.trim();
        
        if (field.hasAttribute('required') && !value) {
            showFieldError(field, 'This field is required');
            return false;
        }
        
        switch(field.type) {
            case 'email':
                if (value && !isValidEmail(value)) {
                    showFieldError(field, 'Please enter a valid email address');
                    return false;
                }
                break;
            case 'text':
                if (field.id === 'name' && value.length < 2) {
                    showFieldError(field, 'Name must be at least 2 characters long');
                    return false;
                }
                break;
            case 'tel':
                if (field.id === 'phone' && value && !isValidPhone(value)) {
                    showFieldError(field, 'Please enter a valid phone number');
                    return false;
                }
                break;
            case 'select-one':
                if (field.id === 'subject' && !value) {
                    showFieldError(field, 'Please select a subject');
                    return false;
                }
                break;
        }
        
        clearFieldError(field);
        return true;
    }
    
    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
    
    function isValidPhone(phone) {
        const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
        return phoneRegex.test(phone.replace(/[\s\-\(\)]/g, ''));
    }
    
    function showFieldError(field, message) {
        clearFieldError(field);
        
        const errorDiv = document.createElement('div');
        errorDiv.className = 'field-error';
        errorDiv.textContent = message;
        errorDiv.style.cssText = `
            color: #ED3500;
            font-size: 0.8rem;
            margin-top: 0.25rem;
            animation: fadeIn 0.3s ease;
        `;
        
        field.parentNode.appendChild(errorDiv);
        field.style.borderColor = '#ED3500';
    }
    
    function clearFieldError(field) {
        const errorDiv = field.parentNode.querySelector('.field-error');
        if (errorDiv) {
            errorDiv.remove();
        }
        field.style.borderColor = 'rgba(9, 63, 180, 0.1)';
    }
    
    function submitFormWithEmailJS() {
        const formData = new FormData(contactForm);
        const submitData = Object.fromEntries(formData);
        
        submitBtn.classList.add('loading');
        submitBtn.querySelector('span').textContent = 'Sending...';
        
        const templateParams = {
            from_name: submitData.name,
            from_phone: submitData.phone,
            from_email: submitData.email,
            subject: submitData.subject,
            message: submitData.message,
            newsletter: submitData.newsletter ? 'Yes' : 'No',
            to_name: 'My Study Friend Team'
        };
        
        console.log('Sending email with params:', templateParams);
        
        emailjs.send('service_w0ql2qp', 'template_kcibg7k', templateParams)
            .then(function(response) {
                console.log('SUCCESS!', response.status, response.text);
                showNotification('Message sent successfully! We\'ll get back to you soon.', 'success');
                
                contactForm.reset();
                
                submitBtn.classList.remove('loading');
                submitBtn.querySelector('span').textContent = 'Send Message';
                
                submitBtn.classList.add('submit-success');
                setTimeout(() => {
                    submitBtn.classList.remove('submit-success');
                }, 500);
                
            }, function(error) {
                console.error('EmailJS Error Details:', error);
                console.error('Error Status:', error.status);
                console.error('Error Text:', error.text);
                
                let errorMessage = 'Failed to send message. Please try again later.';
                
                if (error.status === 400) {
                    errorMessage = 'Invalid email configuration. Please contact support.';
                } else if (error.status === 401) {
                    errorMessage = 'Email service authentication failed. Please contact support.';
                } else if (error.status === 403) {
                    errorMessage = 'Email service access denied. Please contact support.';
                } else if (error.status === 404) {
                    errorMessage = 'Email template not found. Please contact support.';
                } else if (error.status === 429) {
                    errorMessage = 'Too many requests. Please wait a moment and try again.';
                } else if (error.status === 500) {
                    errorMessage = 'Email service error. Please try again later.';
                }
                
                showNotification(errorMessage, 'error');
                
                submitBtn.classList.remove('loading');
                submitBtn.querySelector('span').textContent = 'Send Message';
            });
    }
    
    function showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.textContent = message;
        notification.className = `notification notification-${type}`;
        
        let bgColor = '#093FB4';
        if (type === 'success') bgColor = '#27ae60';
        if (type === 'error') bgColor = '#ED3500';
        
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${bgColor};
            color: #FFFCFB;
            padding: 1rem 1.5rem;
            border-radius: 8px;
            box-shadow: 0 4px 15px rgba(9, 63, 180, 0.2);
            z-index: 1000;
            font-size: 0.9rem;
            max-width: 300px;
            opacity: 0;
            transform: translateX(100%);
            transition: all 0.3s ease;
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.opacity = '1';
            notification.style.transform = 'translateX(0)';
        }, 10);
        
        setTimeout(() => {
            notification.style.opacity = '0';
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                if (notification.parentNode) {
                    document.body.removeChild(notification);
                }
            }, 300);
        }, 5000);
    }
    
    const messageTextarea = document.getElementById('message');
    if (messageTextarea) {
        messageTextarea.addEventListener('input', function() {
            const maxLength = 1000;
            const currentLength = this.value.length;
            const remaining = maxLength - currentLength;
            
            let counter = this.parentNode.querySelector('.char-counter');
            if (!counter) {
                counter = document.createElement('div');
                counter.className = 'char-counter';
                counter.style.cssText = `
                    text-align: right;
                    font-size: 0.8rem;
                    color: #222831;
                    margin-top: 0.25rem;
                `;
                this.parentNode.appendChild(counter);
            }
            
            counter.textContent = `${currentLength}/${maxLength} characters`;
            
            if (remaining < 100) {
                counter.style.color = remaining < 50 ? '#ED3500' : '#093FB4';
            } else {
                counter.style.color = '#093FB4';
            }
        });
    }
    
    messageTextarea.addEventListener('input', function() {
        this.style.height = 'auto';
        this.style.height = Math.min(this.scrollHeight, 200) + 'px';
    });
    
    const faqItems = document.querySelectorAll('.faq-item');
    faqItems.forEach(item => {
        item.addEventListener('click', function() {
            this.style.transform = 'scale(0.98)';
            setTimeout(() => {
                this.style.transform = '';
            }, 150);
        });
    });
    
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
});

const style = document.createElement('style');
style.textContent = `
    @keyframes fadeIn {
        from { opacity: 0; transform: translateY(-10px); }
        to { opacity: 1; transform: translateY(0); }
    }
`;
document.head.appendChild(style); 