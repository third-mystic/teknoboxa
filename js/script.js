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
    
    // Setup the IntersectionObserver for titles
    const observerOptions = {
        root: null,
        rootMargin: '-15% 0px -60% 0px', 
        threshold: 0
    };

    const titleObserver = new IntersectionObserver((entries) => {
        const intersectingEntries = entries.filter(entry => entry.isIntersecting);
        if (intersectingEntries.length > 0) {
            const targetTitle = intersectingEntries[intersectingEntries.length - 1].target;
            
            if (!targetTitle.classList.contains('scrolled-active')) {
                titles.forEach(t => {
                    t.classList.remove('scrolled-active', 'glitch-1', 'glitch-2', 'glitch-3', 'glitch-4');
                });
                
                targetTitle.classList.add('scrolled-active');
                
                const applyGlitch = () => {
                    if (!targetTitle.classList.contains('scrolled-active')) return;
                    const glitchType = Math.floor(Math.random() * 4) + 1;
                    const glitchClass = `glitch-${glitchType}`;
                    targetTitle.classList.add(glitchClass);
                    setTimeout(() => {
                        targetTitle.classList.remove(glitchClass);
                    }, Math.floor(Math.random() * 100) + 50);
                };

                applyGlitch();
                setTimeout(applyGlitch, 2000);
            }
        }
    }, observerOptions);

    titles.forEach(title => {
        titleObserver.observe(title);
    });

    // Scroll-based "popping" effect for cards on mobile
    const cards = document.querySelectorAll('.selection-card');
    const containers = document.querySelectorAll('.selection-container');
    
    const updateActiveCard = () => {
        if (window.innerWidth > 767) {
            cards.forEach(card => card.classList.remove('scrolled-pop'));
            return;
        }

        let mostCenteredCard = null;
        let minDistance = Infinity;
        const viewportCenter = window.innerHeight / 2;

        cards.forEach(card => {
            const rect = card.getBoundingClientRect();
            const cardCenter = rect.top + rect.height / 2;
            const distance = Math.abs(viewportCenter - cardCenter);

            // Only consider cards within a reasonable viewing zone
            const inZone = rect.top < window.innerHeight * 0.8 && rect.bottom > window.innerHeight * 0.2;

            if (inZone && distance < minDistance) {
                // Check if this card's section title is active
                const container = card.closest('.selection-container');
                const containerIndex = Array.from(containers).indexOf(container);
                const relatedTitle = titles[containerIndex];
                
                // Only allow the card to be active if its title is already scrolled-active
                if (relatedTitle && relatedTitle.classList.contains('scrolled-active')) {
                    minDistance = distance;
                    mostCenteredCard = card;
                }
            }
        });

        cards.forEach(card => {
            if (card === mostCenteredCard) {
                card.classList.add('scrolled-pop');
            } else {
                card.classList.remove('scrolled-pop');
            }
        });
    };

    let scrollTick = false;
    window.addEventListener('scroll', () => {
        if (!scrollTick) {
            window.requestAnimationFrame(() => {
                updateActiveCard();
                scrollTick = false;
            });
            scrollTick = true;
        }
    });
    
    window.addEventListener('resize', updateActiveCard);
    // Initial call and delayed call to account for image loading
    updateActiveCard();
    window.addEventListener('load', updateActiveCard);

    // Clear active effects when at the very top of the page
    window.addEventListener('scroll', () => {
        if (window.scrollY === 0) {
            titles.forEach(t => {
                t.classList.remove('scrolled-active', 'glitch-1', 'glitch-2', 'glitch-3', 'glitch-4');
            });
            cards.forEach(c => {
                c.classList.remove('scrolled-pop');
            });
        }
    });
});
