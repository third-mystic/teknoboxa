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
        rootMargin: '-35% 0px -35% 0px', // Triggers when the element is in the middle 30% of the screen
        threshold: 0 // Trigger as soon as it crosses the margin
    };

    const titleObserver = new IntersectionObserver((entries) => {
        const intersectingEntries = entries.filter(entry => entry.isIntersecting);
        if (intersectingEntries.length > 0) {
            // Remove active class from all titles
            titles.forEach(t => t.classList.remove('scrolled-active'));
            // Add active class to the most recently intersecting title
            intersectingEntries[intersectingEntries.length - 1].target.classList.add('scrolled-active');
        }
    }, observerOptions);

    titles.forEach(title => {
        titleObserver.observe(title);
    });
});

