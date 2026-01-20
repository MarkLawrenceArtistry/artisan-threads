
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

    products.forEach(element => {
        const card = document.createElement('div');
        card.dataset.id = element.id
        card.classList.add('shop-item')

        card.innerHTML = `
            ${element.name}
            ${element.description}
            ${element.price}
            ${element.stock_quantity}
            
            <img src=${element.image_url} style="height: 100px;">

            <div class="action-buttons">
                <button class='btn edit-btn'>Edit</button>
                <button class='btn delete-btn'>Delete</button>
            </div>
        `;

        container.appendChild(card)
    });
}
