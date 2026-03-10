const USERS_KEY = 'nutriNourishUsers';
const SESSION_KEY = 'nutriNourishSession';
const LAST_EMAIL_KEY = 'nutriNourishLastEmail';

function parseJson(storageKey, fallback) {
    try {
        const raw = localStorage.getItem(storageKey);
        return raw ? JSON.parse(raw) : fallback;
    } catch (_) {
        return fallback;
    }
}

function saveJson(storageKey, value) {
    localStorage.setItem(storageKey, JSON.stringify(value));
}

function getUsers() {
    const users = parseJson(USERS_KEY, []);
    return Array.isArray(users) ? users : [];
}

function setSession(user) {
    saveJson(SESSION_KEY, {
        email: user.email,
        name: user.name,
        loggedInAt: new Date().toISOString()
    });
    localStorage.setItem(LAST_EMAIL_KEY, user.email);
}

function redirectAfterAuth(form) {
    const action = form.getAttribute('action') || 'features.html';
    window.location.href = action;
}

document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.querySelector('.login-form form');
    const signupForm = document.querySelector('.signup-form form');
    const forgotPasswordLink = document.querySelector('.login-form .text a');

    const loginEmailInput = document.getElementById('login-email');
    const loginPasswordInput = document.getElementById('login-password');
    const signupNameInput = document.getElementById('signup-name');
    const signupEmailInput = document.getElementById('signup-email');
    const signupPasswordInput = document.getElementById('signup-password');

    const activeSession = parseJson(SESSION_KEY, null);
    const lastEmail = localStorage.getItem(LAST_EMAIL_KEY);
    if (loginEmailInput) {
        loginEmailInput.value = activeSession?.email || lastEmail || '';
    }

    if (signupForm) {
        signupForm.addEventListener('submit', (event) => {
            event.preventDefault();

            const name = signupNameInput?.value.trim() || '';
            const email = signupEmailInput?.value.trim().toLowerCase() || '';
            const password = signupPasswordInput?.value || '';

            if (!name || !email || password.length < 6) {
                alert('Please complete all fields. Password must be at least 6 characters.');
                return;
            }

            const users = getUsers();
            const exists = users.some((user) => user.email === email);
            if (exists) {
                alert('An account with this email already exists. Please log in instead.');
                return;
            }

            const user = {
                id: Date.now(),
                name,
                email,
                password,
                createdAt: new Date().toISOString()
            };

            users.push(user);
            saveJson(USERS_KEY, users);
            setSession(user);
            alert('Account created successfully. You are now logged in.');
            redirectAfterAuth(signupForm);
        });
    }

    if (loginForm) {
        loginForm.addEventListener('submit', (event) => {
            event.preventDefault();

            const email = loginEmailInput?.value.trim().toLowerCase() || '';
            const password = loginPasswordInput?.value || '';
            const users = getUsers();

            const matchedUser = users.find((user) => user.email === email && user.password === password);
            if (!matchedUser) {
                alert('Invalid email or password.');
                return;
            }

            setSession(matchedUser);
            alert(`Welcome back, ${matchedUser.name}!`);
            redirectAfterAuth(loginForm);
        });
    }

    if (forgotPasswordLink) {
        forgotPasswordLink.addEventListener('click', (event) => {
            event.preventDefault();

            const email = loginEmailInput?.value.trim().toLowerCase() || '';
            if (!email) {
                alert('Please enter your email to continue.');
                return;
            }

            const users = getUsers();
            const exists = users.some((user) => user.email === email);
            if (!exists) {
                alert('No account found with this email. Please sign up first.');
                return;
            }

            alert(`Password reset is not connected yet. A reset link would be sent to ${email}.`);
        });
    }
});