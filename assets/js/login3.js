const forgotPasswordLink = document.querySelector('.login-form .text a');

if (forgotPasswordLink) {
    forgotPasswordLink.addEventListener('click', (event) => {
        event.preventDefault();
        alert('Password reset is not configured yet. Please contact support@nutrinourish.com.');
    });
}