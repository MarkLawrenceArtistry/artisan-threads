
// PRODUCTS
export function renderProductsTable(products, container) {
    container.innerHTML = ``;

    const table = document.createElement('table')
	table.className = 'products table'
    table.innerHTML = `
        <thead>
            <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Description</th>
                <th>Price</th>
                <th>Stock Quantity</th>
                <th>Image URL</th>
                <th>Actions</th>
            </tr>
        </thead>
        <tbody></tbody>
    `;

    const tbody = table.querySelector('tbody');
    products.forEach(element => {
        const row = document.createElement('tr')
        row.dataset.id = element.id
        row.classname = 'product-item'

        row.innerHTML = `
            <td>${element.id}</td>
            <td>${element.name}</td>
            <td>${element.description}</td>
            <td>${element.price}</td>
            <td>${element.stock_quantity}</td>
            <td>
                <img src=${element.image_url} style="height: 100px;">
            </td>
            <td>
                <div class="action-buttons">
                    <button class='btn edit-btn'>Edit</button>
                    <button class='btn delete-btn'>Delete</button>
                </div>
            </td>
        `;

        tbody.appendChild(row)
    });
    if(products.length < 1) {
        tbody.innerHTML = `
            <td colspan="7" class="no-data" style="text-align:center;">There is no data here..</td>
        `
    }

    container.appendChild(table)
}



// AUTH
export function renderUsersTable(users, container) {
    container.innerHTML = ``;

    const table = document.createElement('table')
	table.className = 'users table'
    table.innerHTML = `
        <thead>
            <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Actions</th>
            </tr>
        </thead>
        <tbody></tbody>
    `;

    const tbody = table.querySelector('tbody');
    users.forEach(element => {
        const row = document.createElement('tr')
        row.dataset.id = element.id
        row.classname = 'user-item'

        row.innerHTML = `
            <td>${element.id}</td>
            <td>${element.name}</td>
            <td>${element.email}</td>
            <td>${element.role}</td>
            <td>
                <div class="action-buttons">
                    <button class='btn edit-btn'>Edit</button>
                    <button class='btn delete-btn'>Delete</button>
                </div>
            </td>
        `;

        tbody.appendChild(row)
    });
    if(users.length < 1) {
        tbody.innerHTML = `
            <td colspan="5" class="no-data" style="text-align:center;">There is no data here..</td>
        `
    }

    container.appendChild(table)
}



// SHOP
export function renderShopItems(products, container) {
    container.innerHTML = '';

    if (!products || products.length === 0) {
        container.innerHTML = '<p>No products found.</p>';
        return;
    }

    products.forEach(element => {
        const card = document.createElement('div');
        card.dataset.id = element.id
        card.classList.add('shop-item')

        card.innerHTML = `
            <div class="product-image-container">
                <img src="${element.image_url}" alt="${element.name}" class="product-image">
            </div>
            
            <div class="product-info">
                <h3 class="product-title">${element.name}</h3>
                <p class="product-desc">${element.description}</p>
                <div class="product-meta">
                    <span class="product-price">₱${element.price}</span>
                    <span class="product-stock">Stock: ${element.stock_quantity}</span>
                </div>
            </div>

            <div class="product-actions">
                <button class="add-to-cart-btn" data-id="${element.id}">Add to Cart</button>
            </div>
        `;

        container.appendChild(card)
    });
}



// CART
export function renderCart(cart, container) {
    container.innerHTML = '';

    if (!cart || cart.length === 0) {
        container.innerHTML = `
            <h2>Your cart is empty.</h2>
            <a href="shop.html">Continue Shopping</a>
        `;
        return;
    }

    const cartWrapper = document.createElement('div');
    cartWrapper.classList.add('cart-wrapper');

    const table = document.createElement('table')
	table.className = 'cart table'
    table.innerHTML = `
        <thead>
            <tr>
                <th>Product</th>
                <th>Quantity</th>
                <th>Price</th>
                <th>Subtotal</th>
                <th>Actions</th>
            </tr>
        </thead>
        <tbody></tbody>
    `;

    let total = 0;
    const tbody = table.querySelector('tbody');
    cart.forEach(element => {
        const row = document.createElement('tr')
        row.dataset.id = element.cart_item_id
        row.classname = 'cart-item'

        const itemTotal = element.price * element.quantity;
        total += itemTotal;

        row.innerHTML = `
            <td>
                <div class="cart-info">
                    <div class="cart-image">
                        <img src="${element.image_url}" alt="${element.name}">
                    </div>
                    
                    <div class="cart-name">
                        <p>${element.name}</p>
                    </div>
                </div>
            </td>
            <td id="quantity-wrapper"><p id="cart-quantity">${element.quantity}</p></td>
            <td>₱${element.price.toFixed(2)}</td>
            <td>₱${itemTotal.toFixed(2)}</td>
            <td>
                <div class="cart-actions">
                    <button class="remove-to-cart-btn">Remove to Cart</button>
                    <button class="edit-quantity-btn">Edit Quantity</button>
                </div>
            </td>
        `;

        tbody.appendChild(row);
    })

    table.appendChild(tbody)
    cartWrapper.appendChild(table);
    container.appendChild(cartWrapper);

    const summaryHtml = `
        <div class="cart-summary">
            <h3>Total: ₱${total.toFixed(2)}</h3>
            <button class="checkout-btn">Proceed to Checkout</button>
        </div>
    `;

    container.innerHTML += summaryHtml;
}




// CHECKOUT
export function renderCheckoutCart(cart, container) {
    container.innerHTML = '';

    if (!cart || cart.length === 0) {
        container.innerHTML = `
            <h2>Your cart is empty.</h2>
            <a href="shop.html">Continue Shopping</a>
        `;
        return;
    }

    const cartWrapper = document.createElement('div');
    cartWrapper.classList.add('cart-wrapper');

    const table = document.createElement('table')
	table.className = 'cart table'
    table.innerHTML = `
        <thead>
            <tr>
                <th>Product</th>
                <th>Quantity</th>
                <th>Price</th>
                <th>Subtotal</th>
            </tr>
        </thead>
        <tbody></tbody>
    `;

    let total = 0;
    const tbody = table.querySelector('tbody');
    cart.forEach(element => {
        const row = document.createElement('tr')
        row.dataset.id = element.cart_item_id
        row.classname = 'cart-item'

        const itemTotal = element.price * element.quantity;
        total += itemTotal;

        row.innerHTML = `
            <td>
                <div class="cart-info">
                    <div class="cart-name">
                        <p>${element.name}</p>
                    </div>
                </div>
            </td>
            <td id="quantity-wrapper"><p id="cart-quantity">${element.quantity}</p></td>
            <td>₱${element.price.toFixed(2)}</td>
            <td>₱${itemTotal.toFixed(2)}</td>
        `;

        tbody.appendChild(row);
    })

    table.appendChild(tbody)
    cartWrapper.appendChild(table);
    container.appendChild(cartWrapper);

    const summaryHtml = `
        <div class="cart-summary">
            <h3>Total: ₱${total.toFixed(2)}</h3>
        </div>
    `;

    container.innerHTML += summaryHtml;
}




// ORDERS
export function renderOrders(orders, container) {
    container.innerHTML = ``;

    const table = document.createElement('table')
	table.className = 'orders table'
    table.innerHTML = `
        <thead>
            <tr>
                <th>ID</th>
                <th>Customer Name</th>
                <th>Total Amout</th>
                <th>Status</th>
                <th>Actions</th>
            </tr>
        </thead>
        <tbody></tbody>
    `;

    const tbody = table.querySelector('tbody');
    orders.forEach(element => {
        const row = document.createElement('tr')
        row.dataset.id = element.id
        row.classname = 'order-item'

        row.innerHTML = `
            <td>${element.id}</td>
            <td>${element.name}</td>
            <td>${element.total_amount}</td>
            <td id="order-status"><p id="order-status-p">${element.status}</p></td>
            <td>
                <div class="action-buttons">
                    <button class='btn edit-btn'>Edit</button>
                    <button class='btn delete-btn'>Delete</button>
                </div>
            </td>
        `;

        tbody.appendChild(row)
    });
    if(orders.length < 1) {
        tbody.innerHTML = `
            <td colspan="5" class="no-data" style="text-align:center;">There is no data here..</td>
        `
    }

    container.appendChild(table)
}