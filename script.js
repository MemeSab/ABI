document.addEventListener('DOMContentLoaded', () => {

    // ==========================================
    // 1. MOBILE NAVIGATION DRAWER
    // ==========================================
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    if (navToggle && navMenu) {
        navToggle.addEventListener('click', () => {
            const isExpanded = navToggle.getAttribute('aria-expanded') === 'true';
            navToggle.setAttribute('aria-expanded', !isExpanded);
            navToggle.classList.toggle('active');
            navMenu.classList.toggle('show');
        });

        // Close menu when clicking a link
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                navToggle.setAttribute('aria-expanded', 'false');
                navToggle.classList.remove('active');
                navMenu.classList.remove('show');
            });
        });

        // Close menu when clicking outside of header
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.site-header') && navMenu.classList.contains('show')) {
                navToggle.setAttribute('aria-expanded', 'false');
                navToggle.classList.remove('active');
                navMenu.classList.remove('show');
            }
        });
    }

    // ==========================================
    // 2. SCROLL SPY ACTIVE LINKS
    // ==========================================
    const sections = document.querySelectorAll('section');
    const scrollSpyOptions = {
        root: null,
        rootMargin: '-30% 0px -60% 0px', // Adjust active area triggers
        threshold: 0
    };

    const scrollSpyObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const sectionId = entry.target.getAttribute('id');
                navLinks.forEach(link => {
                    const href = link.getAttribute('href');
                    if (href === `#${sectionId}`) {
                        link.classList.add('active');
                    } else {
                        link.classList.remove('active');
                    }
                });
            }
        });
    }, scrollSpyOptions);

    sections.forEach(section => {
        scrollSpyObserver.observe(section);
    });

    // ==========================================
    // 3. TESTIMONIAL LIGHTBOX MODAL
    // ==========================================
    const lightboxModal = document.getElementById('lightbox-modal');
    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxClose = document.querySelector('.lightbox-close');
    const openLightboxButtons = document.querySelectorAll('.open-lightbox');

    const openLightbox = (imageSrc, authorName) => {
        if (!lightboxModal || !lightboxImg) return;
        lightboxImg.src = imageSrc;
        lightboxImg.alt = `Original recommendation screenshot from ${authorName}`;
        lightboxModal.classList.add('show');
        lightboxModal.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden'; // Stop scroll
    };

    const closeLightbox = () => {
        if (!lightboxModal || !lightboxImg) return;
        lightboxModal.classList.remove('show');
        lightboxModal.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = ''; // Restore scroll
        setTimeout(() => {
            lightboxImg.src = '';
        }, 300);
    };

    openLightboxButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const card = e.target.closest('.testimonial-card');
            const authorName = card ? card.querySelector('.author-name').textContent : 'Client';
            const imagePath = btn.getAttribute('data-image');
            openLightbox(imagePath, authorName);
        });
    });

    if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
    if (lightboxModal) {
        lightboxModal.addEventListener('click', (e) => {
            if (e.target === lightboxModal) {
                closeLightbox();
            }
        });
    }

    // Escape key closes modals
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeLightbox();
            closeDownloadModal();
            closeGuideModal();
        }
    });

    // ==========================================
    // 4. RESOURCE LEAD MAGNET MODAL (STANDARD)
    // ==========================================
    const downloadModal = document.getElementById('download-modal');
    const modalResourceName = document.getElementById('modal-resource-name');
    const resourceIdentifierInput = document.getElementById('resource-identifier');
    const downloadClose = document.querySelector('.card-close');
    const downloadButtons = document.querySelectorAll('.resource-download-btn');
    const leadForm = document.getElementById('lead-form');
    const leadSuccessMessage = document.getElementById('lead-success');

    const openDownloadModal = (resourceName) => {
        if (!downloadModal) return;
        
        // Reset modal forms
        if (leadForm) {
            leadForm.style.display = 'block';
            leadForm.reset();
        }
        if (leadSuccessMessage) {
            leadSuccessMessage.classList.remove('show');
            // Reset success text back to defaults
            const successTitle = leadSuccessMessage.querySelector('h4');
            const successText = leadSuccessMessage.querySelector('p');
            if (successTitle) successTitle.textContent = "Sent with love!";
            if (successText) successText.textContent = "Please check your inbox (and spam folder, just in case) for your download link. Happy reading!";
            const fallbackLink = document.getElementById('manual-download-btn');
            if (fallbackLink) fallbackLink.remove();
        }

        modalResourceName.textContent = resourceName;
        resourceIdentifierInput.value = resourceName;
        downloadModal.classList.add('show');
        downloadModal.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
    };

    const closeDownloadModal = () => {
        if (!downloadModal) return;
        downloadModal.classList.remove('show');
        downloadModal.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
    };

    downloadButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const resource = btn.getAttribute('data-resource');
            if (resource === "Movement & Mindset Guide") {
                openGuideModal();
            } else {
                openDownloadModal(resource);
            }
        });
    });

    if (downloadClose) downloadClose.addEventListener('click', closeDownloadModal);
    if (downloadModal) {
        downloadModal.addEventListener('click', (e) => {
            if (e.target === downloadModal) {
                closeDownloadModal();
            }
        });
    }

    // Lead Form submission simulation (Standard)
    if (leadForm) {
        leadForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Collect form inputs
            const name = document.getElementById('lead-name').value;
            const email = document.getElementById('lead-email').value;
            const resource = resourceIdentifierInput.value;
            
            console.log(`Lead collected: ${name} (${email}) downloaded resource: "${resource}"`);
            
            // Submit form via fetch to FormSubmit
            fetch("https://formsubmit.co/ajax/abigailstockscoaching@gmail.com", {
                method: "POST",
                headers: { 
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify({
                    name: name,
                    email: email,
                    resource: resource,
                    _subject: `New Lead Magnet Download: ${resource}`
                })
            })
            .then(response => response.json())
            .then(data => console.log('FormSubmit Success:', data))
            .catch(error => console.error('FormSubmit Error:', error));
            
            // Animate transition to success
            leadForm.style.display = 'none';
            if (leadSuccessMessage) {
                leadSuccessMessage.classList.add('show');
            }

            // Optional: Close modal automatically after 5 seconds
            setTimeout(() => {
                if (downloadModal.classList.contains('show')) {
                    closeDownloadModal();
                }
            }, 5000);
        });
    }

    // ==========================================
    // 4b. FEATURED GUIDE LEAD MAGNET MODAL
    // ==========================================
    const guideDownloadModal = document.getElementById('guide-download-modal');
    const guideDownloadClose = document.querySelector('.guide-card-close');
    const guideLeadForm = document.getElementById('guide-lead-form');
    const guideFormContainer = document.getElementById('guide-form-container');
    const guideSuccessContainer = document.getElementById('guide-success-container');

    const openGuideModal = () => {
        if (!guideDownloadModal) return;
        
        // Reset forms
        if (guideLeadForm) {
            guideLeadForm.reset();
        }
        if (guideFormContainer) {
            guideFormContainer.style.display = 'block';
        }
        if (guideSuccessContainer) {
            guideSuccessContainer.classList.remove('show');
            guideSuccessContainer.setAttribute('aria-hidden', 'true');
        }

        guideDownloadModal.classList.add('show');
        guideDownloadModal.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
    };

    const closeGuideModal = () => {
        if (!guideDownloadModal) return;
        guideDownloadModal.classList.remove('show');
        guideDownloadModal.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
    };

    if (guideDownloadClose) {
        guideDownloadClose.addEventListener('click', closeGuideModal);
    }
    
    if (guideDownloadModal) {
        guideDownloadModal.addEventListener('click', (e) => {
            if (e.target === guideDownloadModal) {
                closeGuideModal();
            }
        });
    }

    if (guideLeadForm) {
        guideLeadForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const name = document.getElementById('guide-lead-name').value;
            const email = document.getElementById('guide-lead-email').value;
            const resource = "Movement & Mindset Guide";
            
            console.log(`Lead collected: ${name} (${email}) downloaded resource: "${resource}"`);
            
            // Submit form via fetch to FormSubmit
            fetch("https://formsubmit.co/ajax/abigailstockscoaching@gmail.com", {
                method: "POST",
                headers: { 
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify({
                    name: name,
                    email: email,
                    resource: resource,
                    _subject: `New Lead Magnet Download: ${resource}`
                })
            })
            .then(response => response.json())
            .then(data => console.log('FormSubmit Success:', data))
            .catch(error => console.error('FormSubmit Error:', error));
            
            // Transition to success state
            if (guideFormContainer) {
                guideFormContainer.style.display = 'none';
            }
            if (guideSuccessContainer) {
                guideSuccessContainer.classList.add('show');
                guideSuccessContainer.setAttribute('aria-hidden', 'false');
            }
            
            // Trigger auto-download
            const autoLink = document.createElement('a');
            autoLink.href = 'assets/movement-mindset-guide.pdf';
            autoLink.setAttribute('download', 'Movement_and_Mindset_Guide_Abigail_Stocks.pdf');
            document.body.appendChild(autoLink);
            autoLink.click();
            document.body.removeChild(autoLink);
        });
    }

    // ==========================================
    // 5. CONTACT FORM SIMULATOR
    // ==========================================
    const contactForm = document.getElementById('contact-form');
    const formSuccessMessage = document.getElementById('form-success-message');

    if (contactForm && formSuccessMessage) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const message = document.getElementById('message').value;
            
            console.log(`Contact Form Submission: ${name} (${email}) - Message: ${message}`);
            
            // Submit form via fetch to FormSubmit
            fetch("https://formsubmit.co/ajax/abigailstockscoaching@gmail.com", {
                method: "POST",
                headers: { 
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify({
                    name: name,
                    email: email,
                    message: message,
                    _subject: "New Contact Message - Abigail Stocks Coaching"
                })
            })
            .then(response => response.json())
            .then(data => console.log('FormSubmit Success:', data))
            .catch(error => console.error('FormSubmit Error:', error));
            
            // Animate form closing and success message appearing
            contactForm.style.height = `${contactForm.offsetHeight}px`;
            setTimeout(() => {
                contactForm.style.opacity = '0';
                contactForm.style.height = '0px';
                contactForm.style.overflow = 'hidden';
                contactForm.style.margin = '0';
                contactForm.style.padding = '0';
                
                setTimeout(() => {
                    contactForm.style.display = 'none';
                    formSuccessMessage.classList.add('show');
                }, 300);
            }, 10);
        });
    }
});
