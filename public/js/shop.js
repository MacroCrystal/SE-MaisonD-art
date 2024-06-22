// Add an event listener to detect changes in the selected category
filterSelect.addEventListener('change', async () => {
    // Get the selected category
    const selectedCategoryId = filterSelect.options[filterSelect.selectedIndex].dataset.category;

    try {
        // Make an AJAX request to fetch products based on the selected category
        const response = await fetch(`/shop?CategoryID=${selectedCategoryId}`);
        const products = await response.json();

        // Render the products on the page (assuming you have a function for this)
        renderProducts(products);
    } catch (error) {
        console.error('Error fetching products:', error);
    }
});
