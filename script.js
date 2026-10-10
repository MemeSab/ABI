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
    // AUTOMATED EMAIL TEMPLATES (FormSubmit _autoresponse)
    // ==========================================
    const getResourceEmailContent = (name, resourceName) => {
        const clientName = name ? name.trim() : 'there';
        const lowerRes = (resourceName || '').toLowerCase();

        if (lowerRes.includes('morning') || lowerRes.includes('checklist')) {
            return `Hi ${clientName},

Thank you for downloading the Morning Wellness Checklist from Abigail Stocks Coaching!

Here are your direct access links:
• Download the PDF Checklist: https://abigailstocks.com/assets/morning-wellness-checklist.pdf
• Open the Interactive Web Version: https://abigailstocks.com/morning-wellness-checklist.html

Start small, build momentum, and celebrate the small wins!

When you're ready to design routines that truly stick:
• Book a free 30-minute Discovery Call: https://calendly.com/hello-abigailstocks/30min

Warmly,
Abigail Stocks
Habit & Mindset Coach
https://abigailstocks.com`;
        } else if (lowerRes.includes('reflection') || lowerRes.includes('prompts')) {
            return `Hi ${clientName},

Thank you for downloading the Weekly Reflection Prompts from Abigail Stocks Coaching!

Here are your direct access links:
• Download the PDF Prompts: https://abigailstocks.com/assets/weekly-reflection-prompts.pdf
• Open the Interactive Web Version: https://abigailstocks.com/weekly-reflection-prompts.html

Use these prompts each week to pause, reflect, and realign with your personal intentions.

Whenever you'd like 1:1 guidance on your wellness journey:
• Book a free 30-minute Discovery Call: https://calendly.com/hello-abigailstocks/30min

Warmly,
Abigail Stocks
Habit & Mindset Coach
https://abigailstocks.com`;
        } else if (lowerRes.includes('habit') || lowerRes.includes('tracker')) {
            return `Hi ${clientName},

Thank you for downloading the Daily Healthy Habits Tracker from Abigail Stocks Coaching!

Here are your direct access links:
• Download the PDF Tracker: https://abigailstocks.com/assets/daily-habits-tracker.pdf
• Open the Interactive Web Version: https://abigailstocks.com/daily-habits-tracker.html

Remember: consistency over intensity. Track your daily habits and watch your progress unfold!

When you're ready to accelerate your habit transformation:
• Book a free 30-minute Discovery Call: https://calendly.com/hello-abigailstocks/30min

Warmly,
Abigail Stocks
Habit & Mindset Coach
https://abigailstocks.com`;
        } else {
            // Movement & Mindset Guide or default
            return `Hi ${clientName},

Thank you for downloading the Movement & Mindset Guide from Abigail Stocks Coaching!

Here are your direct access links:
• Download the PDF Workbook: https://abigailstocks.com/assets/movement-mindset-guide.pdf
• Open the Interactive Web Guide: https://abigailstocks.com/movement-mindset-guide.html

Take your time exploring the exercises and habit reflections. When you're ready to take the next step towards sustainable habits, I'd love to chat:
• Book a free 30-minute Discovery Call: https://calendly.com/hello-abigailstocks/30min

If you ever have any questions, you can reply directly to this email.

Warmly,
Abigail Stocks
Habit & Mindset Coach
https://abigailstocks.com`;
        }
    };

    const getContactEmailContent = (name) => {
        const clientName = name ? name.trim() : 'there';
        return `Hi ${clientName},

Thank you for getting in touch with Abigail Stocks Coaching!

I have received your message and will get back to you personally within 24-48 hours.

If you'd like to jump straight into a conversation about your habits and goals, you can book a free 30-minute Discovery Call right here:
https://calendly.com/hello-abigailstocks/30min

Speak soon,
Abigail Stocks
Habit & Mindset Coach
https://abigailstocks.com`;
    };

    const getPackageEmailContent = (name, packageName) => {
        const clientName = name ? name.trim() : 'there';
        if (packageName === 'Initial Coaching Call' || packageName === 'Single Habit Reset') {
            return `Hi ${clientName},

Thank you for your enquiry about the Initial Coaching Call with Abigail Stocks Coaching!

Here is what is included in your 60-minute session:
• 60 Mins dedicated 1:1 coaching session
• Explore your goals, understand personal challenges & blocks
• Actionable next steps & personalized habit guidance
• Understand if 1:1 coaching is the right fit for your journey

Investment: £45 (One-off session)

Ready to begin? Reply directly to this email or reach out to hello@abigailstocks.com to confirm your availability.

If you have any questions before booking, feel free to ask!

Warmly,
Abigail Stocks
Habit & Mindset Coach
https://abigailstocks.com`;
        } else if (packageName === '6-Week Coaching Programme' || packageName === '6-Session Momentum') {
            return `Hi ${clientName},

Thank you for your enquiry about the 6-Week Coaching Programme with Abigail Stocks Coaching!

Here is what is included in your structured programme:
• 6 × 60-Minute dedicated 1:1 coaching sessions (weekly rhythm)
• Structured roadmap to build confidence, set habits & make steady progress
• Mindset & movement worksheets & tailored guides
• Direct email support & accountability between sessions

Investment: £250 package price (regular £270)

Ready to begin? Reply directly to this email or reach out to hello@abigailstocks.com to secure your spot and schedule your first session.

Warmly,
Abigail Stocks
Habit & Mindset Coach
https://abigailstocks.com`;
        } else {
            return `Hi ${clientName},

Thank you for your enquiry about the 12-Week Coaching Programme with Abigail Stocks Coaching!

Here is what is included in your comprehensive programme:
• 12 × 60-Minute deep-dive 1:1 sessions (weekly rhythm)
• Complete habit transformation roadmap for deep progress and lasting change
• Ongoing priority message & direct email support between sessions
• Custom wellness logs, personalized reflection tools & continuous accountability

Investment: £495 package price (regular £540)

Ready to begin? Reply directly to this email or reach out to hello@abigailstocks.com to secure your spot and arrange your schedule.

Warmly,
Abigail Stocks
Habit & Mindset Coach
https://abigailstocks.com`;
        }
    };

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
            
            // 1. Trigger automated inbox delivery via Vercel serverless API
            fetch('/api/send-email', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    type: 'resource',
                    name: name,
                    email: email,
                    resourceName: resource
                })
            }).catch(err => console.log('Email delivery notice:', err));

            // 2. Submit form via fetch to FormSubmit (Lead notification backup)
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
                    _subject: `New Lead Magnet Download: ${resource}`,
                    _autoresponse: getResourceEmailContent(name, resource),
                    _cc: "hello@abigailstocks.com"
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
            
            // 1. Trigger automated inbox delivery via Vercel serverless API
            fetch('/api/send-email', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    type: 'resource',
                    name: name,
                    email: email,
                    resourceName: 'Movement & Mindset Guide'
                })
            }).catch(err => console.log('Email delivery notice:', err));

            // 2. Submit form via fetch to FormSubmit (Lead notification backup)
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
                    _subject: `New Lead Magnet Download: ${resource}`,
                    _autoresponse: getResourceEmailContent(name, resource),
                    _cc: "hello@abigailstocks.com"
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
            
            // 1. Trigger automated inbox delivery via Vercel serverless API
            fetch('/api/send-email', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    type: 'contact',
                    name: name,
                    email: email,
                    message: message
                })
            }).catch(err => console.log('Email delivery notice:', err));

            // 2. Submit form via fetch to FormSubmit (Lead notification backup)
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
                    _subject: "New Contact Message - Abigail Stocks Coaching",
                    _autoresponse: getContactEmailContent(name),
                    _cc: "hello@abigailstocks.com"
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
    const packageSuccessCloseBtn = document.querySelector('.package-success-close-btn');

    const successClientName = document.getElementById('success-client-name');
    const packageFeaturesList = document.getElementById('package-features-list');
    const packageStripeBtn = document.getElementById('package-stripe-btn');

    // Centralized Package Configuration & Direct CTA Links (prices exactly match Stripe)
    const PACKAGE_CONFIG = {
        "Single Habit Reset": {
            title: "Single Habit Reset (1:1 Deep Dive)",
            stripeUrl: "https://buy.stripe.com/dRm8wQ6Z84ELaJ0caA6sw00",
            stripeButtonText: "Book & Pay Single Session via Stripe (£75) &rarr;",
            features: [
                "<strong>60 Mins</strong> intensive 1:1 coaching session",
                "Current routine audit & block identification",
                "Actionable post-call habit blueprint",
                "Email recap with custom action steps"
            ]
        },
        "6-Session Momentum": {
            title: "6-Session Momentum (Popular Pathway)",
            stripeUrl: "https://buy.stripe.com/00w00k0AK0ovaJ0eiI6sw01",
            stripeButtonText: "Secure 6-Session Package via Stripe (£420) &rarr;",
            features: [
                "<strong>6 x 60 Mins</strong> dedicated 1:1 coaching sessions",
                "Weekly or bi-weekly accountability check-ins",
                "Mindset & movement worksheets & guides",
                "Direct email support between sessions"
            ]
        },
        "12-Session Transformation": {
            title: "12-Session Transformation (Full Transformation)",
            stripeUrl: "https://buy.stripe.com/cNi3cwcjs0ov18q3E46sw02",
            stripeButtonText: "Secure 12-Session Package via Stripe (£780) &rarr;",
            features: [
                "<strong>12 x 60 Mins</strong> deep-dive 1:1 sessions",
                "Complete habit transformation map",
                "Ongoing priority message & email support",
                "Custom wellness logs & personalized tools"
            ]
        }
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
            packageSubmitBtn.textContent = 'Submit Enquiry';
        }

        if (modalPackageName) modalPackageName.textContent = packageName;
        if (successPackageName) successPackageName.textContent = packageName;
        if (enquiryPackageInput) enquiryPackageInput.value = packageName;

        packageModal.classList.add('show');
        packageModal.setAttribute('aria-hidden', 'false');
    };

    packageEnquireButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const pkg = btn.getAttribute('data-package') || 'Initial Coaching Call';
            openPackageModal(pkg);
        });
    });

    if (packageCardClose) packageCardClose.addEventListener('click', window.closePackageModal);
    if (packageSuccessCloseBtn) packageSuccessCloseBtn.addEventListener('click', window.closePackageModal);
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
            const selectedPackage = enquiryPackageInput.value || 'Initial Coaching Call';

            console.log(`Package enquiry submitted: ${name} (${email}) for "${selectedPackage}"`);

            // Disable submit button during request
            if (packageSubmitBtn) {
                packageSubmitBtn.disabled = true;
                packageSubmitBtn.textContent = 'Sending Enquiry...';
            }

            // 1. Trigger automated package details delivery to client inbox via Vercel serverless API
            fetch('/api/send-email', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    type: 'package',
                    name: name,
                    email: email,
                    packageName: selectedPackage
                })
            }).catch(err => console.log('Package email delivery notice:', err));

            // 2. Submit form via fetch to FormSubmit (Lead notification backup)
            fetch("https://formsubmit.co/ajax/abigailstockscoaching@gmail.com", {
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
                    _autoresponse: getPackageEmailContent(name, selectedPackage),
                    _cc: "hello@abigailstocks.com"
                })
            })
            .then(response => response.json())
            .then(data => console.log('Package Enquiry FormSubmit Success:', data))
            .catch(error => console.error('Package Enquiry FormSubmit Error:', error));

            // Populate dynamic package details and action links in modal
            const config = PACKAGE_CONFIG[selectedPackage] || PACKAGE_CONFIG["Single Habit Reset"];
            if (successClientName) successClientName.textContent = name || 'there';
            if (successPackageName) successPackageName.textContent = selectedPackage;
            if (packageFeaturesList) {
                packageFeaturesList.innerHTML = config.features.map(f => `<li style="margin-bottom: 6px;">${f}</li>`).join('');
            }
            if (packageStripeBtn) {
                packageStripeBtn.href = config.stripeUrl;
                packageStripeBtn.innerHTML = config.stripeButtonText;
            }

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
