document.addEventListener("DOMContentLoaded", () => {
    const images = document.querySelectorAll('.auction-image');
    const popup = document.getElementById('popup');
    const closeBtn = document.querySelector('.close');
    let selectedProductID = null; // Declare selectedProductID outside

    images.forEach(image => {
        image.addEventListener('click', () => {
            selectedProductID = image.getAttribute('data-product-id'); // Set selectedProductID
            popup.style.display = 'block';
        });
    });

    closeBtn.addEventListener('click', () => {
        popup.style.display = 'none';
    });

    window.addEventListener('click', (event) => {
        if (event.target === popup) {
            popup.style.display = 'none';
        }
    });

    document.getElementById('bid-form').addEventListener('submit', async (event) => {
        event.preventDefault();
        const bidAmount = document.getElementById('bid-amount').value;
        try {
            const response = await fetch('/submitBid', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    productID: selectedProductID,
                    bidPrice: bidAmount
                })
            });

            const result = await response.json();
            if (response.ok) {
                alert(result.message);
                window.location.reload(); // Reload the page after successful bid submission
            } else {
                alert(result.error);
            }

            popup.style.display = 'none';
        } catch (error) {
            console.error('Error submitting bid:', error);
            alert('Failed to submit bid. Please try again.');
        }
    });

    // Countdown Timer
    const countdownElement = document.getElementById('countdown');
    const auctionEndDateStr = '<%= auctions[0].auctionEndDate %>'; // Assuming auctionEndDate is the same for all auctions
    const auctionEndDate = new Date(auctionEndDateStr.replace(/-/g, '/')); // Replace '-' with '/' for Safari compatibility

    function updateCountdown() {
        const now = new Date();
        const timeDifference = auctionEndDate.getTime() - now.getTime(); // Calculate difference in milliseconds

        if (timeDifference <= 0) {
            countdownElement.innerHTML = 'Auction Ended';
        } else {
            const days = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
            const hours = Math.floor((timeDifference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((timeDifference % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((timeDifference % (1000 * 60)) / 1000);

            countdownElement.innerHTML = `${days}d ${hours}h ${minutes}m ${seconds}s`;
        }
    }

    updateCountdown(); // Initial call
    setInterval(updateCountdown, 1000); // Update every second
});
