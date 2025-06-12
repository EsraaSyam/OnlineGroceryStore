document.addEventListener('DOMContentLoaded', function() {
    const addProductButton = document.getElementById('addProduct');
    const productsContainer = document.getElementById('productsContainer');
    let idx = 1;

    addProductButton.addEventListener('click', function() {
        const div = document.createElement('div');
        div.innerHTML= `
            <select name="products[${idx}][type]" required>
                <option value=""> Select Type</option>
                <option value="IN_STOCK">In Stock</option>
                <option value="FRESH_FOOD">Fresh Food</option>
                <option value="EXTERNAL">External</option>
            </select>
            <input type="number" name="products[${idx}][count]" min="1" required placeholder="Count">
        `;
        productsContainer.appendChild(div);
        idx++;
    });
});