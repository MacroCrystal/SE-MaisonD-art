document.getElementById('logoutButton').addEventListener('click', function() {
    // Send a request to your server to log out
    fetch('/logout', {
        method: 'POST',
        credentials: 'same-origin', // Include this if your server requires it
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(response => {
        if (response.ok) {
            // Redirect to the login page
            window.location.href = '/login';
        } else {
            // Handle error
            console.error('Logout failed');
        }
    })
    .catch(error => {
        console.error('Error:', error);
    });
});

document.addEventListener('DOMContentLoaded', function () {
    fetch('/profile-data')
        .then(response => response.json())
        .then(data => {
            document.getElementById('userName').value = data.userName;
            document.getElementById('userEmail').value = data.userEmail;
            document.getElementById('userPhoneNumber').value = data.userPhoneNumber || '';
            document.getElementById('userAddress').value = data.userAddress || '';
        });
});

function saveChanges() {
    const userPhoneNumber = document.getElementById('userPhoneNumber').value;
    const userAddress = document.getElementById('userAddress').value;

    fetch('/updateProfile', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ userPhoneNumber, userAddress })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            Swal.fire({
                title: 'Profile updated!',
                text: data.message,
                icon: 'success',
                confirmButtonText: 'OK'
            });
        } else {
            Swal.fire({
                title: 'Error!',
                text: data.message,
                icon: 'error',
                confirmButtonText: 'OK'
            });
        }
    })
    .catch(error => {
        Swal.fire({
            title: 'Profile updated!',
            icon: 'success',
            confirmButtonText: 'OK'
        });
    });
}


