// Hamburger menu toggle
const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');

if (hamburger) {
    hamburger.addEventListener('click', () => {
        navLinks.style.display = navLinks.style.display === 'flex' ? 'none' : 'flex';
        hamburger.classList.toggle('active');
    });
}

// Smooth scroll functionality
function smoothScrollTo(selector) {
    const element = document.querySelector(selector);
    if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
    }
}

// Close mobile menu when link is clicked
const navItems = document.querySelectorAll('.nav-links a');
navItems.forEach(item => {
    item.addEventListener('click', () => {
        if (navLinks.style.display === 'flex') {
            navLinks.style.display = 'none';
            hamburger.classList.remove('active');
        }
    });
});

// Contact form handling
const contactForm = document.getElementById('contactForm');

if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault(); // Prevent default form submission
        
        // Show loading state
        const submitButton = contactForm.querySelector('button[type="submit"]');
        const originalText = submitButton.textContent;
        submitButton.textContent = 'Bezig met verzenden...';
        submitButton.disabled = true;
        
        // Prepare form data
        const formData = new FormData(contactForm);
        
        // Submit form using fetch
        fetch(contactForm.action, {
            method: 'POST',
            body: formData
        })
        .then(response => {
            if (response.ok) {
                // Show success message
                showSuccessMessage('Uw bericht is succesvol verzonden! We nemen zo snel mogelijk contact met u op.');
                
                // Reset form
                contactForm.reset();
                
                // Reset multi-select displays
                document.getElementById('subject-display').textContent = '-- Selecteer vak(ken) --';
                document.getElementById('day-display').textContent = '-- Selecteer dag(en) --';
                
                // Hide other subject field
                document.getElementById('other-subject-group').style.display = 'none';
                
                // Close any open dropdowns
                document.querySelectorAll('.multi-select-options').forEach(options => {
                    options.style.display = 'none';
                });
                document.querySelectorAll('.multi-select-container').forEach(container => {
                    container.classList.remove('open');
                });
            } else {
                throw new Error('Form submission failed');
            }
        })
        .catch(error => {
            console.error('Error:', error);
            showSuccessMessage('Er is een fout opgetreden. Probeer het opnieuw of neem direct contact met ons op.', true);
        })
        .finally(() => {
            // Reset button state
            submitButton.textContent = originalText;
            submitButton.disabled = false;
        });
    });
}

// Function to open contact form
function openContactForm() {
    const contactSection = document.getElementById('contact');
    contactSection.scrollIntoView({ behavior: 'smooth' });
    document.getElementById('name').focus();
}

// Success message notification
function showSuccessMessage(message, isError = false) {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background-color: ${isError ? '#f44336' : 'var(--accent-color)'};
        color: white;
        padding: 16px 24px;
        border: 1px solid var(--border-color);
        z-index: 1000;
        font-size: 14px;
        font-weight: 500;
        max-width: 400px;
        border-radius: 4px;
    `;
    notification.textContent = message;

    document.body.appendChild(notification);

    // Remove notification after 5 seconds
    setTimeout(() => {
        if (notification.parentNode) {
            notification.remove();
        }
    }, 5000);
}

// Add minimal CSS
const style = document.createElement('style');
style.textContent = `
    .hamburger.active span:nth-child(1) {
        transform: rotate(45deg) translate(8px, 8px);
    }

    .hamburger.active span:nth-child(2) {
        opacity: 0;
    }

    .hamburger.active span:nth-child(3) {
        transform: rotate(-45deg) translate(6px, -6px);
    }



        .nav-links a {
            display: block;
            padding: 16px 20px;
        }
    }
`;
document.head.appendChild(style);

// Active navigation link highlight
window.addEventListener('scroll', () => {
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-links a');
    
    let current = '';
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        if (scrollY >= sectionTop - 60) {
            current = section.getAttribute('id');
        }
    });
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href').slice(1) === current) {
            link.classList.add('active');
        }
    });
});

// Add active link styling
const activeStyle = document.createElement('style');
activeStyle.textContent = `
    .nav-links a.active {
        color: var(--primary-color);
        border-bottom: 3px solid var(--primary-color);
        padding-bottom: 5px;
    }
`;
document.head.appendChild(activeStyle);

// Mobile menu responsive behavior
window.addEventListener('resize', () => {
    if (window.innerWidth > 768) {
        navLinks.style.display = 'flex';
    } else {
        navLinks.style.display = 'none';
    }
});

// Function to toggle "Other Subject" text input field
function toggleOtherSubject() {
    const otherSubjectCheckbox = document.querySelector('input[name="subject_overig"]');
    const otherSubjectGroup = document.getElementById('other-subject-group');
    
    otherSubjectGroup.style.display = otherSubjectCheckbox && otherSubjectCheckbox.checked ? 'block' : 'none';
}

// Multi-select dropdown functionality
function toggleMultiSelect(type) {
    const container = event.target.closest('.multi-select-container');
    const options = container.querySelector('.multi-select-options');
    const isOpen = options.style.display === 'block';
    
    // Close all multi-select dropdowns
    document.querySelectorAll('.multi-select-options').forEach(opt => {
        opt.style.display = 'none';
    });
    document.querySelectorAll('.multi-select-container').forEach(cont => {
        cont.classList.remove('open');
    });
    
    // Open clicked dropdown if it wasn't already open
    if (!isOpen) {
        options.style.display = 'block';
        container.classList.add('open');
    }
}

// Update multi-select display text
function updateMultiSelect(type) {
    const prefix = type === 'subject' ? 'subject_' : 'dag_';
    const checkboxes = document.querySelectorAll(`input[name^="${prefix}"]`);
    const display = document.getElementById(`${type}-display`);
    
    const selected = Array.from(checkboxes)
        .filter(cb => cb.checked)
        .map(cb => cb.parentElement.textContent.trim());
    
    if (selected.length === 0) {
        display.textContent = `-- Selecteer ${type === 'subject' ? 'vak(ken)' : 'dag(en)'} --`;
    } else if (selected.length === 1) {
        display.textContent = selected[0];
    } else {
        display.textContent = `${selected.length} geselecteerd`;
    }
    
    // Update other subject field visibility
    if (type === 'subject') {
        toggleOtherSubject();
    }
}

// Close multi-select when clicking outside
document.addEventListener('click', function(event) {
    if (!event.target.closest('.multi-select-container')) {
        document.querySelectorAll('.multi-select-options').forEach(options => {
            options.style.display = 'none';
        });
        document.querySelectorAll('.multi-select-container').forEach(container => {
            container.classList.remove('open');
        });
    }
});
