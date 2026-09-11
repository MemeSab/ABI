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
            if (typeof closePackageModal === 'function') {
                closePackageModal();
            }
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
    const leadFormView = document.getElementById('lead-form-view');
    const leadSuccessMessage = document.getElementById('lead-success');

    const openDownloadModal = (resourceName) => {
        if (!downloadModal) return;

        // Reset modal views
        if (leadFormView) {
            leadFormView.style.display = 'block';
        }
        if (leadForm) {
            leadForm.reset();
        }
        if (leadSuccessMessage) {
            leadSuccessMessage.classList.remove('show');
            leadSuccessMessage.setAttribute('aria-hidden', 'true');
        }

        modalResourceName.textContent = resourceName;
        resourceIdentifierInput.value = resourceName;
        downloadModal.classList.add('show');
        downloadModal.setAttribute('aria-hidden', 'false');
    };

    const closeDownloadModal = () => {
        if (!downloadModal) return;
        downloadModal.classList.remove('show');
        downloadModal.setAttribute('aria-hidden', 'true');
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

    // Lead Form submission
    if (leadForm) {
        leadForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Collect form inputs
            const name = document.getElementById('lead-name').value;
            const email = document.getElementById('lead-email').value;
            const resource = resourceIdentifierInput.value;
            
            console.log(`Lead collected: ${name} (${email}) downloaded resource: "${resource}"`);
            
            // Submit form via fetch to FormSubmit
            fetch("https://formsubmit.co/ajax/hello@abigailstocks.com", {
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
            
            // Determine download file and web preview url based on resource
            let downloadUrl = '';
            let filename = '';
            let webUrl = '';
            let buttonLabel = 'Download PDF Directly';
            const lowerRes = resource.toLowerCase();
            const isMorningChecklist = lowerRes.includes("morning") || lowerRes.includes("checklist");
            const isWeeklyReflection = lowerRes.includes("reflection") || lowerRes.includes("prompts");
            const isHabitTracker = lowerRes.includes("habit") || lowerRes.includes("tracker");
            
            if (isMorningChecklist) {
                downloadUrl = 'assets/morning-wellness-checklist.pdf';
                filename = 'Morning_Wellness_Checklist_Abigail_Stocks.pdf';
                webUrl = 'morning-wellness-checklist.html';
                buttonLabel = 'Download Checklist (PDF)';
            } else if (isWeeklyReflection) {
                downloadUrl = 'assets/weekly-reflection-prompts.pdf';
                filename = 'Weekly_Reflection_Prompts_Abigail_Stocks.pdf';
                webUrl = 'weekly-reflection-prompts.html';
                buttonLabel = 'Download Prompts (PDF)';
            } else if (isHabitTracker) {
                downloadUrl = 'assets/daily-habits-tracker.pdf';
                filename = 'Daily_Healthy_Habits_Tracker_Abigail_Stocks.pdf';
                webUrl = 'daily-habits-tracker.html';
                buttonLabel = 'Download Tracker (PDF)';
            }

            // Animate transition to dedicated success view
            if (leadFormView) {
                leadFormView.style.display = 'none';
            }
            if (leadSuccessMessage) {
                leadSuccessMessage.classList.add('show');
                leadSuccessMessage.setAttribute('aria-hidden', 'false');
                
                // Actions container
                const actionsContainer = document.getElementById('modal-success-actions');
                if (actionsContainer && downloadUrl) {
                    actionsContainer.innerHTML = `
                        <a href="${downloadUrl}" download="${filename}" class="btn btn-primary btn-block">📥 ${buttonLabel}</a>
                        ${webUrl ? `<a href="${webUrl}" target="_blank" class="btn btn-secondary btn-block">📱 Open Interactive Web Version &rarr;</a>` : ''}
                    `;
                }
                
                // Trigger auto-download
                if (downloadUrl) {
                    const autoLink = document.createElement('a');
                    autoLink.href = downloadUrl;
                    autoLink.setAttribute('download', filename);
                    document.body.appendChild(autoLink);
                    autoLink.click();
                    document.body.removeChild(autoLink);
                }
            }

            // Optional: Keep modal open longer for the user to choose
            const autoCloseDelay = 15000;
            setTimeout(() => {
                if (downloadModal.classList.contains('show')) {
                    closeDownloadModal();
                }
            }, autoCloseDelay);
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
    };

    const closeGuideModal = () => {
        if (!guideDownloadModal) return;
        guideDownloadModal.classList.remove('show');
        guideDownloadModal.setAttribute('aria-hidden', 'true');
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
            fetch("https://formsubmit.co/ajax/hello@abigailstocks.com", {
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
                
                // Add dual action buttons to featured guide success
                let guideActions = document.getElementById('guide-success-actions');
                if (!guideActions) {
                    guideActions = document.createElement('div');
                    guideActions.id = 'guide-success-actions';
                    guideActions.style.marginTop = '16px';
                    guideActions.style.display = 'flex';
                    guideActions.style.flexDirection = 'column';
                    guideActions.style.gap = '10px';
                    guideSuccessContainer.appendChild(guideActions);
                }
                guideActions.innerHTML = `
                    <a href="assets/movement-mindset-guide.pdf" download="Movement_and_Mindset_Guide_Abigail_Stocks.pdf" class="btn btn-primary btn-block" style="text-decoration:none;">📥 Download Workbook (PDF)</a>
                    <a href="movement-mindset-guide.html" target="_blank" class="btn btn-secondary btn-block" style="text-decoration:none;">📱 Open Interactive Web Guide &rarr;</a>
                `;
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
            fetch("https://formsubmit.co/ajax/hello@abigailstocks.com", {
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

    // ==========================================
    // 6. COACHING PACKAGE ENQUIRY MODAL & AUTOMATED EMAILS
    // ==========================================
    const packageModal = document.getElementById('package-enquiry-modal');
    const modalPackageName = document.getElementById('modal-package-name');
    const successPackageName = document.getElementById('success-package-name');
    const enquiryPackageInput = document.getElementById('enquiry-package-name');
    const packageCardClose = document.querySelector('.package-card-close');
    const packageEnquireButtons = document.querySelectorAll('.package-enquire-btn');
    const packageForm = document.getElementById('package-enquiry-form');
    const packageFormView = document.getElementById('package-form-view');
    const packageSuccessMessage = document.getElementById('package-enquiry-success');
    const packageSubmitBtn = document.getElementById('package-submit-btn');

    // Centralized Package Follow-Up Email Templates
    // Note: Reuses the exact package breakdown from the website cards and the live Discovery Call booking URL.
    // Abigail or site owners can safely modify or expand copy for each package directly below.
    const PACKAGE_EMAIL_TEMPLATES = {
        "Single Habit Reset": (name) => `Hi ${name || 'there'},

Thank you for your enquiry about the Single Habit Reset coaching package with Abigail Stocks Coaching.

Here is the detailed breakdown of what this package includes:

PACKAGE: Single Habit Reset (1:1 Deep Dive)
- Focus: Ideal for a quick reset, laser focus on a specific health hurdle, or a targeted realignment of your daily routines.
- 60 Mins intensive 1:1 coaching session
- Current routine audit & block identification
- Actionable post-call habit blueprint
- Email recap with custom action steps

INVESTMENT & DETAILS:
Investment discussed on enquiry.
(If you have specific hurdles or routine questions you would like to explore, feel free to reply directly to this email.)

NEXT STEP: BOOK YOUR COMPLIMENTARY DISCOVERY CALL
Whenever you are ready to connect and discuss your goals, you can book a free, no-pressure 30-minute Discovery Call here:
https://calendly.com/hello-abigailstocks/30min

Warmly,
Abigail Stocks
Healthy Habits Coach
hello@abigailstocks.com | https://abigailstocks.com`,

        "6-Session Momentum": (name) => `Hi ${name || 'there'},

Thank you for your enquiry about the 6-Session Momentum coaching package with Abigail Stocks Coaching.

Here is the detailed breakdown of what this package includes:

PACKAGE: 6-Session Momentum (Popular Pathway)
- Focus: Perfect for building momentum, establishing solid daily rhythms, and building self-trust with consistent accountability.
- 6 x 60 Mins dedicated 1:1 coaching sessions
- Weekly or bi-weekly accountability check-ins
- Mindset & movement worksheets & guides
- Direct email support between sessions

INVESTMENT & DETAILS:
Investment discussed on enquiry.
(If you have specific hurdles or routine questions you would like to explore, feel free to reply directly to this email.)

NEXT STEP: BOOK YOUR COMPLIMENTARY DISCOVERY CALL
Whenever you are ready to connect and discuss your goals, you can book a free, no-pressure 30-minute Discovery Call here:
https://calendly.com/hello-abigailstocks/30min

Warmly,
Abigail Stocks
Healthy Habits Coach
hello@abigailstocks.com | https://abigailstocks.com`,

        "12-Session Transformation": (name) => `Hi ${name || 'there'},

Thank you for your enquiry about the 12-Session Transformation coaching package with Abigail Stocks Coaching.

Here is the detailed breakdown of what this package includes:

PACKAGE: 12-Session Transformation (Full Transformation)
- Focus: Our deepest and most comprehensive program, designed for full lifestyle shifts, sustained habit changes, and lasting wellness.
- 12 x 60 Mins deep-dive 1:1 sessions
- Complete habit transformation map
- Ongoing priority message & email support
- Custom wellness logs & personalized tools

INVESTMENT & DETAILS:
Investment discussed on enquiry.
(If you have specific hurdles or routine questions you would like to explore, feel free to reply directly to this email.)

NEXT STEP: BOOK YOUR COMPLIMENTARY DISCOVERY CALL
Whenever you are ready to connect and discuss your goals, you can book a free, no-pressure 30-minute Discovery Call here:
https://calendly.com/hello-abigailstocks/30min

Warmly,
Abigail Stocks
Healthy Habits Coach
hello@abigailstocks.com | https://abigailstocks.com`
    };

    window.closePackageModal = () => {
        if (!packageModal) return;
        packageModal.classList.remove('show');
        packageModal.setAttribute('aria-hidden', 'true');
    };

    const openPackageModal = (packageName) => {
        if (!packageModal) return;

        // Reset views and forms
        if (packageFormView) packageFormView.style.display = 'block';
        if (packageForm) packageForm.reset();
        if (packageSuccessMessage) {
            packageSuccessMessage.classList.remove('show');
            packageSuccessMessage.setAttribute('aria-hidden', 'true');
        }
        if (packageSubmitBtn) {
            packageSubmitBtn.disabled = false;
            packageSubmitBtn.textContent = 'Email to Enquire';
        }

        if (modalPackageName) modalPackageName.textContent = packageName;
        if (successPackageName) successPackageName.textContent = packageName;
        if (enquiryPackageInput) enquiryPackageInput.value = packageName;

        packageModal.classList.add('show');
        packageModal.setAttribute('aria-hidden', 'false');
    };

    packageEnquireButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const pkg = btn.getAttribute('data-package') || 'Single Habit Reset';
            openPackageModal(pkg);
        });
    });

    if (packageCardClose) packageCardClose.addEventListener('click', window.closePackageModal);
    if (packageModal) {
        packageModal.addEventListener('click', (e) => {
            if (e.target === packageModal) {
                window.closePackageModal();
            }
        });
    }

    // Package Enquiry Form submission
    if (packageForm) {
        packageForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const name = document.getElementById('package-lead-name').value.trim();
            const email = document.getElementById('package-lead-email').value.trim();
            const selectedPackage = enquiryPackageInput.value || 'Single Habit Reset';

            console.log(`Package enquiry submitted: ${name} (${email}) for "${selectedPackage}"`);

            // Disable submit button during request
            if (packageSubmitBtn) {
                packageSubmitBtn.disabled = true;
                packageSubmitBtn.textContent = 'Sending Enquiry...';
            }

            // Generate package-specific follow-up email content
            const templateFn = PACKAGE_EMAIL_TEMPLATES[selectedPackage] || PACKAGE_EMAIL_TEMPLATES["Single Habit Reset"];
            const autoresponseMessage = templateFn(name);

            // Submit form via fetch to FormSubmit
            fetch("https://formsubmit.co/ajax/hello@abigailstocks.com", {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify({
                    name: name,
                    email: email,
                    package: selectedPackage,
                    _subject: `New Coaching Enquiry: ${selectedPackage} - Abigail Stocks Coaching`,
                    _autoresponse: autoresponseMessage
                })
            })
            .then(response => response.json())
            .then(data => console.log('Package Enquiry FormSubmit Success:', data))
            .catch(error => console.error('Package Enquiry FormSubmit Error:', error));

            // Transition to success state
            if (packageFormView) {
                packageFormView.style.display = 'none';
            }
            if (packageSuccessMessage) {
                packageSuccessMessage.classList.add('show');
                packageSuccessMessage.setAttribute('aria-hidden', 'false');
            }
        });
    }
});
