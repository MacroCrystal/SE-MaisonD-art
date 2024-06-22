document.addEventListener('DOMContentLoaded', function () {
    const Toast = Swal.mixin({
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timerProgressBar: true,
        didOpen: (toast) => {
            toast.classList.add('swal2-show');
        }
    });

    const container = document.getElementById('container');
    const signUpForm = document.querySelector('#container form[action="/signup"]');
    const signInForm = document.querySelector('#container form[action="/login"]');
    const signUpName = document.getElementById('signUpName');
    const signUpEmail = document.getElementById('signUpEmail');
    const signUpPassword = document.getElementById('signUpPassword');
    const loginEmail = document.getElementById('loginEmail');
    const loginPassword = document.getElementById('loginPassword');

    const registerBtn = document.getElementById('register');
    const loginBtn = document.getElementById('login');

    registerBtn.addEventListener('click', () => {
        container.classList.add("active");
    });

    loginBtn.addEventListener('click', () => {
        container.classList.remove("active");
    });

    signUpForm.addEventListener('submit', async function (event) {
        event.preventDefault();
        const formData = {
            name: signUpName.value,
            email: signUpEmail.value,
            password: signUpPassword.value
        };

        try {
            const response = await fetch('/signup', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            if (response.ok) {
                Toast.fire({
                    icon: 'success',
                    title: 'User registered successfully.'
                });
                signUpForm.reset();
                setTimeout(() => {
                    window.location.href = '/home'; // Redirect to home page after 3 seconds
                }, 3000); // 3000 milliseconds = 3 seconds
            } else {
                throw new Error('Failed to register user');
            }
        } catch (error) {
            console.error('Error registering user:', error);
            Toast.fire({
                icon: 'error',
                title: 'Failed to register user.'
            });
        }
    });

    signInForm.addEventListener('submit', async function (event) {
        event.preventDefault();
        const formData = {
            email: loginEmail.value,
            password: loginPassword.value
        };

        try {
            const response = await fetch('/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            if (response.ok) {
                Toast.fire({
                    icon: 'success',
                    title: 'Login successful.'
                });
                signInForm.reset();
                setTimeout(() => {
                    window.location.href = '/home'; // Redirect to home page after 3 seconds
                }, 1500); // 3000 milliseconds = 3 seconds
            } else {
                throw new Error('Failed to log in');
            }
        } catch (error) {
            console.error('Error logging in:', error);
            Toast.fire({
                icon: 'error',
                title: 'Failed to log in.'
            });
            setTimeout(() => {
                location.reload(); // Reload the page after 3 seconds on failed login
            }, 1000); // 3000 milliseconds = 3 seconds
        }
    });
});
