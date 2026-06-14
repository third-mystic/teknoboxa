document.addEventListener('DOMContentLoaded', () => {
    // Select all subscription forms on the page
    const subscribeForms = document.querySelectorAll('.subscribe-form');

    subscribeForms.forEach(form => {
        form.addEventListener('submit', async (event) => {
            event.preventDefault();

            const emailInput = form.querySelector('input[type="email"]');
            const submitButton = form.querySelector('button[type="submit"]');
            const originalButtonText = submitButton ? submitButton.textContent : 'Signup';

            if (!emailInput || !submitButton) return;

            // Prepare the data
            const formData = new FormData(form);
            const data = Object.fromEntries(formData.entries());

            // Disable UI during submission
            emailInput.disabled = true;
            submitButton.disabled = true;
            submitButton.textContent = 'Sending...';

            try {
                const response = await fetch(form.action, {
                    method: 'POST',
                    headers: {
                        'Accept': 'application/json'
                    },
                    body: formData
                });

                if (response.ok) {
                    // Success: replace the form content
                    form.innerHTML = '<div class="success-message">You are signed up!</div>';
                } else {
                    throw new Error('Form submission failed');
                }
            } catch (error) {
                console.error('Submission error:', error);
                alert('Oops! There was a problem. Please try again.');
                
                // Re-enable for retry
                emailInput.disabled = false;
                submitButton.disabled = false;
                submitButton.textContent = originalButtonText;
            }
        });
    });

    // Scroll-based highlight effect for titles
    const titles = document.querySelectorAll('.selection-title');
    
    // Setup the IntersectionObserver
    const observerOptions = {
        root: null, // Viewport
        rootMargin: '-15% 0px -60% 0px', // Triggers when the element is in the middle 10% of the screen
        threshold: 0 // Trigger as soon as it crosses the margin
    };

    const titleObserver = new IntersectionObserver((entries) => {
        const intersectingEntries = entries.filter(entry => entry.isIntersecting);
        if (intersectingEntries.length > 0) {
            // Find the title that should become active
            const targetTitle = intersectingEntries[intersectingEntries.length - 1].target;
            
            // Only proceed if this title isn't already the active one
            if (!targetTitle.classList.contains('scrolled-active')) {
                // Remove active class and any active glitch from all titles
                titles.forEach(t => {
                    t.classList.remove('scrolled-active', 'glitch-1', 'glitch-2', 'glitch-3', 'glitch-4');
                });
                
                // Add active class
                targetTitle.classList.add('scrolled-active');
                
                // Function to apply a quick glitch
                const applyGlitch = () => {
                    // Only glitch if still active
                    if (!targetTitle.classList.contains('scrolled-active')) return;
                    
                    const glitchType = Math.floor(Math.random() * 4) + 1;
                    const glitchClass = `glitch-${glitchType}`;
                    targetTitle.classList.add(glitchClass);
                    
                    // Remove the glitch quickly
                    const duration = Math.floor(Math.random() * 100) + 50;
                    setTimeout(() => {
                        targetTitle.classList.remove(glitchClass);
                    }, duration);
                };

                // Trigger first glitch immediately
                applyGlitch();
                
                // Trigger second glitch after exactly 2 seconds
                setTimeout(applyGlitch, 2000);
            }
        }
    }, observerOptions);

    titles.forEach(title => {
        titleObserver.observe(title);
    });

    // Clear active effects when at the very top of the page
    window.addEventListener('scroll', () => {
        if (window.scrollY === 0) {
            titles.forEach(t => {
                t.classList.remove('scrolled-active', 'glitch-1', 'glitch-2', 'glitch-3', 'glitch-4');
            });
        }
    });
});

