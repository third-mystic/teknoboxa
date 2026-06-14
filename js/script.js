document.addEventListener('DOMContentLoaded', () => {
    const subscribeForm = document.getElementById('subscribeForm');
    const emailInput = document.getElementById('emailInput');

    if (subscribeForm && emailInput) {
        subscribeForm.addEventListener('submit', async (event) => {
            event.preventDefault(); // Prevent default form submission

            const email = emailInput.value;
            const submitButton = subscribeForm.querySelector('button[type="submit"]');

            // Optionally disable input and button during submission
            emailInput.disabled = true;
            if (submitButton) {
                submitButton.disabled = true;
                submitButton.textContent = 'Sending...';
            }

            try {
                const response = await fetch(subscribeForm.action, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    },
                    body: JSON.stringify({ email: email })
                });

                if (response.ok) {
                    emailInput.placeholder = 'See you soon';
                    emailInput.value = ''; // Clear the input field
                    if (submitButton) {
                        submitButton.textContent = 'Success!';
                    }
                } else {
                    // Handle non-OK responses from Formspree (e.g., validation errors)
                    const errorData = await response.json();
                    console.error('Formspree error:', errorData);
                    alert('Oops! There was a problem submitting your email. Please try again.');
                    // Re-enable for user to try again
                    emailInput.disabled = false;
                    if (submitButton) {
                        submitButton.disabled = false;
                        submitButton.textContent = 'Wishlist Now!';
                    }
                }
            } catch (error) {
                console.error('Network error:', error);
                alert('Oops! A network error occurred. Please check your connection.');
                // Re-enable for user to try again
                emailInput.disabled = false;
                if (submitButton) {
                    submitButton.disabled = false;
                    submitButton.textContent = 'Wishlist Now!';
                }
            }
        });
    }

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

