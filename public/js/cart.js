document.addEventListener('DOMContentLoaded', () => {
    const artistCheckboxes = document.querySelectorAll('input[name="artistCheckbox"]');
    const productCheckboxes = document.querySelectorAll('input[name="productCheckbox"]');
    const selectedItemsContainer = document.querySelector('.selected-items');
    const totalPriceElement = document.getElementById('totalPrice');
    const checkoutButton = document.getElementById('checkoutBtn');
        const deleteButtons = document.querySelectorAll('.delete-btn');

    // Event listener for delete buttons
    deleteButtons.forEach(button => {
        button.addEventListener('click', () => {
            const productID = button.getAttribute('data-productid');

            // Confirm deletion using SweetAlert
            Swal.fire({
                title: "Remove product?",
                text: "You can add it later",
                icon: "warning",
                showCancelButton: true,
                confirmButtonColor: "#450a0a",
                cancelButtonColor: "#d9d9d9",
                confirmButtonText: "Yes, delete it!"
            }).then((result) => {
                if (result.isConfirmed) {
                    // Send delete request to server
                    fetch(`/deleteCartItem/${productID}`, {
                        method: 'DELETE',
                        headers: {
                            'Content-Type': 'application/json'
                        }
                    })
                    .then(response => {
                        if (!response.ok) {
                            throw new Error('Failed to delete item');
                        }
                        // Remove item from DOM
                        button.closest('.item-info').remove();
                        // Optionally update total price
                        updateTotalPrice(); // Implement this function to update total price display

                        // Show success message
                        
                    })
                    .catch(error => {
                        // Handle any errors
                        Swal.fire({
                            title: "Romoved!",
                            text: "Your item has been removed.",
                            icon: "success",
                            confirmButtonColor : "#450A0A"
                        }).then(() => {
                            location.reload(); // Refresh the page after clicking "OK"
                        });
                    });
                }
            });
        });
    });


    let selectedItems = [];

    // Function to update selected items display
    function updateSelectedItems() {
        selectedItemsContainer.innerHTML = '';
        let totalPrice = 0;

        selectedItems.forEach(item => {
            selectedItemsContainer.insertAdjacentHTML('beforeend', `
                <div class="item-section">
                    <div class="item-section-info">${item.artistName}</div>
                    <div class="item-section-info">${item.productName}</div>
                    <div class="item-section-info">Rp. ${item.productPrice}</div>
                </div>
            `);
            totalPrice += item.productPrice;
        });

        totalPriceElement.textContent = `Rp. ${totalPrice}`;
    }

    // Event listeners for artist checkboxes
    artistCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', () => {
            const artistID = checkbox.getAttribute('data-artist');
            const artistName = checkbox.nextElementSibling.textContent.trim();

            // Toggle all product checkboxes under the artist
            const artistProducts = document.querySelectorAll(`input[name="productCheckbox"][data-artist="${artistID}"]`);
            artistProducts.forEach(productCheckbox => {
                productCheckbox.checked = checkbox.checked;

                // Add or remove products from selectedItems
                const productID = productCheckbox.getAttribute('data-productid');
                const productName = productCheckbox.getAttribute('data-productname');
                const productPrice = parseFloat(productCheckbox.getAttribute('data-productprice'));
                const productDescription = productCheckbox.getAttribute('data-productdescription');

                if (checkbox.checked && !selectedItems.find(item => item.productID === productID)) {
                    selectedItems.push({
                        artistID,
                        artistName,
                        productID,
                        productName,
                        productPrice,
                        productDescription
                    });
                } else {
                    selectedItems = selectedItems.filter(item => item.productID !== productID);
                }
            });

            // Update selected items display
            updateSelectedItems();
        });
    });

    // Event listener for product checkboxes
    productCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', () => {
            const artistID = checkbox.getAttribute('data-artist');
            const productID = checkbox.getAttribute('data-productid');
            const productName = checkbox.getAttribute('data-productname');
            const productPrice = parseFloat(checkbox.getAttribute('data-productprice'));
            const productDescription = checkbox.getAttribute('data-productdescription');

            if (checkbox.checked) {
                selectedItems.push({
                    artistID,
                    productID,
                    productName,
                    productPrice,
                    productDescription
                });
            } else {
                selectedItems = selectedItems.filter(item => item.productID !== productID);
            }

            // Update selected items display
            updateSelectedItems();
        });
    });

    // Event listener for delete buttons
    selectedItemsContainer.addEventListener('click', event => {
        if (event.target.classList.contains('delete-btn')) {
            const productID = event.target.getAttribute('data-productid');

            // Remove item from selectedItems array
            selectedItems = selectedItems.filter(item => item.productID !== productID);

            // Update selected items display
            updateSelectedItems();
        }
    });

    // Checkout button click event listener
    checkoutButton.addEventListener('click', () => {
        if (selectedItems.length === 0) {
            Swal.fire({
                title: "Checkout?",
                text: "There's no item in your cart",
                icon: "question",
                confirmButtonColor: "#450A0A"
                });
            return;
        }


        // Prepare data for sending to server
        const checkoutData = {
            items: selectedItems
        };

        // Send checkout data to server
        fetch('/checkout', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(checkoutData)
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                Swal.fire({
                    title: "Great!",
                    text: "Click to continue the payment!",
                    icon: "success",
                    confirmButtonText: "OK",
                    confirmButtonColor: '#450A0A'
                }).then((result) => {
                    if (result.isConfirmed) {
                        window.location.href = '/payment'; // Redirect to payment page after clicking OK
                    }
                });
            } else {
                alert('Checkout failed. Please try again.');
            }
        })

        .catch(error => {
            console.error('Error:', error);
            alert('An error occurred during checkout. Please try again later.');
        });
    });

    // Initial update of selected items display
    updateSelectedItems();
});
