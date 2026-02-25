document.addEventListener('DOMContentLoaded', () => {
    const subscribeForm = document.getElementById('subscribeForm');
    const emailInput = document.getElementById('emailInput');

    if (subscribeForm && emailInput) {
        subscribeForm.addEventListener('submit', (event) => {
            event.preventDefault(); // Prevent default form submission

            emailInput.placeholder = 'See you soon';
            emailInput.value = ''; // Clear the input field
            emailInput.disabled = true; // Optionally disable the input
            const submitButton = subscribeForm.querySelector('button[type="submit"]');
            if (submitButton) {
                submitButton.disabled = true; // Optionally disable the button
                submitButton.textContent = 'Thanks!'; // Optionally change button text
            }
        });
    }
});
