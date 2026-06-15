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

                // Synchronize the first card of the section on mobile
                if (window.matchMedia('(max-width: 767px)').matches) {
                    const titleIndex = Array.from(titles).indexOf(targetTitle);
                    const cardContainers = document.querySelectorAll('.selection-container');
                    
                    // Only for the first two sections (Fighters and Cyberware)
                    if (titleIndex >= 0 && titleIndex < 2 && cardContainers[titleIndex]) {
                        const firstCard = cardContainers[titleIndex].querySelector('.selection-card');
                        if (firstCard) {
                            // Remove pop from all cards first to avoid multiple active cards
                            document.querySelectorAll('.selection-card').forEach(c => c.classList.remove('scrolled-pop'));
                            firstCard.classList.add('scrolled-pop');
                        }
                    }
                }
                
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

    // Scroll-based "popping" effect for cards on mobile
    if (window.matchMedia('(max-width: 767px)').matches) {
        const cards = document.querySelectorAll('.selection-card');
        
        const cardObserverOptions = {
            root: null,
            rootMargin: '-25% 0px -25% 0px', 
            threshold: 0.2
        };

        const cardObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                const card = entry.target;
                const container = card.closest('.selection-container');
                const containers = Array.from(document.querySelectorAll('.selection-container'));
                const containerIndex = containers.indexOf(container);
                const isFirstCard = container && container.querySelector('.selection-card') === card;
                
                // If it's the first card and its title is active, let the titleObserver handle it
                // unless we are scrolling away from the title zone.
                const relatedTitle = titles[containerIndex];
                const isTitleActive = relatedTitle && relatedTitle.classList.contains('scrolled-active');

                if (entry.isIntersecting) {
                    card.classList.add('scrolled-pop');
                } else {
                    // Only remove if not the currently "synced" first card
                    if (!(isFirstCard && isTitleActive)) {
                        card.classList.remove('scrolled-pop');
                    }
                }
            });
        }, cardObserverOptions);

        cards.forEach(card => {
            cardObserver.observe(card);
        });
    }

    // Clear active effects when at the very top of the page
    window.addEventListener('scroll', () => {
        if (window.scrollY === 0) {
            titles.forEach(t => {
                t.classList.remove('scrolled-active', 'glitch-1', 'glitch-2', 'glitch-3', 'glitch-4');
            });
            document.querySelectorAll('.selection-card').forEach(c => {
                c.classList.remove('scrolled-pop');
            });
        }
    });
});

