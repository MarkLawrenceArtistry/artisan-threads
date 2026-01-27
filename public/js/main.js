import * as api from './api.js'
import * as render from './render.js'

document.addEventListener('DOMContentLoaded', () => {

	// CONSTANTS
    // (AUTH)
	const registerForm = document.querySelector('#register-form');
	const loginForm = document.querySelector('#login-form');
    const logoutBtn = document.querySelector('#logout-button');
	
    // (PRODUCTS)
    const productsListDiv = document.querySelector('#products-list');
    const productForm = document.querySelector('#product-form');
    const createProductBtn = document.querySelector('#create-product-btn');
    const cancelProductBtn = document.querySelector('#cancel-product-btn');

    // (AUTH) ACCOUNTS EVENT LISTENERS
    const usersListDiv = document.querySelector('#users-list');
    const userForm = document.querySelector('#user-form');
    const createUserBtn = document.querySelector('#create-btn');
    const cancelUserBtn = document.querySelector('#cancel-btn');

    // (SHOP)
    const shopListDiv = document.querySelector('#shop-list');
    
    // (CART)
    const cartListDiv = document.querySelector('#cart-list');
    const checkoutCartDiv = document.querySelector('#checkout-cart');
    const placeOrderBtn = document.querySelector('#confirm-checkout');

    // (ORDERS)
    const ordersListDiv = document.querySelector('#orders-list');
    const ordersListCustomerDiv = document.querySelector('#orders-list-customer');

    // (DASHBOARD)
    const orderStatusChart = document.querySelector('#order-status-chart')
    const kpiWrapper = document.querySelector('#kpi-wrapper')

    // (OTHERS)
    const menuToggle = document.querySelector('.menu-toggle');
    const navLinks = document.querySelector('.nav-links');
    const userIndicatorEl = document.querySelector('#user-indicator');
    const formWrapper = document.querySelector('.form-wrapper');

    // UTILITIES
    if(menuToggle) {
        menuToggle.addEventListener('click', () => {
            navLinks.classList.toggle('active');
        });
    }
    


    // LOADERS
    async function loadProducts() {
        try {
			const result = await api.getAllProducts()
			render.renderProductsTable(result, productsListDiv)
		} catch(err) {
			console.error(err)
		}
    }
    async function loadUsers() {
        try {
			const result = await api.getAllUsers()
			render.renderUsersTable(result, usersListDiv)
		} catch(err) {
			console.error(err)
		}
    }
    async function loadShop() {
        try {
			const result = await api.getAllProducts()
			render.renderShopItems(result, shopListDiv)
		} catch(err) {
			console.error(err)
		}
    }
    async function loadCart() {
        try {
			const currentUser = JSON.parse(localStorage.getItem('currentUser'));

            if(!currentUser) {
                cartListDiv.innerHTML = `<p>You must be <a href="login.html">logged in</a> first.</p>`;
                return;
            }

            const cart = await api.getCart(currentUser.id);
            render.renderCart(cart, cartListDiv);
		} catch(err) {
			console.error(err);
            cartListDiv.innerHTML = `<p>There must be something wrong. Check your console.</p>`;
		}
    }
    async function loadCheckoutCart() {
        try {
			const currentUser = JSON.parse(localStorage.getItem('currentUser'));

            if(!currentUser) {
                checkoutCartDiv.innerHTML = `<p>You must be <a href="login.html">logged in</a> first.</p>`;
                return;
            }

            const cart = await api.getCart(currentUser.id);
            render.renderCheckoutCart(cart, checkoutCartDiv);
		} catch(err) {
			console.error(err);
            checkoutCartDiv.innerHTML = `<p>There must be something wrong. Check your console.</p>`;
		}
    }
    async function loadOrders() {
        try {
            const orders = await api.getAllOrders();
            render.renderOrders(orders, ordersListDiv);
		} catch(err) {
			console.error(err);
            ordersListDiv.innerHTML = `<p>There must be something wrong. Check your console.</p>`;
		}
    }
    async function loadOrdersCustomers() {
        try {
			const currentUser = JSON.parse(localStorage.getItem('currentUser'));

            if(!currentUser) {
                ordersListCustomerDiv.innerHTML = `<p>You must be <a href="login.html">logged in</a> first.</p>`;
                return;
            }

            const orders = await api.getAllOrdersOneCustomer(currentUser.id);
            render.renderOrdersCustomers(orders, ordersListCustomerDiv);
		} catch(err) {
			console.error(err);
            ordersListCustomerDiv.innerHTML = `<p>There must be something wrong. Check your console.</p>`;
		}
    }
    async function loadOrderStatusChart() {
        try {
            const orders = await api.getAllOrders();
            render.renderOrderStatusChart(orders, orderStatusChart);
		} catch(err) {
			console.error(err);
            orderStatusChart.innerHTML = `<p>There must be something wrong. Check your console.</p>`;
		}
    }
    async function loadKpi() {
        try {
            const kpi = await api.getAnalytics();
            render.renderAnalytics(kpi, kpiWrapper);
		} catch(err) {
			console.error(err);
            kpiWrapper.innerHTML = `<p>There must be something wrong. Check your console.</p>`;
		}
    }




    // (PRODUCTS) GET ALL PRODUCTS
    if(productsListDiv) {
        loadProducts();

        productsListDiv.addEventListener('click', async (e) => {
            e.preventDefault();

            const row = e.target.closest('tr')
            const product_id = row.dataset.id

            if(e.target.classList.contains('edit-btn')) {
                productForm.reset();
                productForm.style.display = "block"
                formWrapper.style.display = "flex"
                cancelProductBtn.style.display = "block"
                productForm.querySelector('#product-image').style.display = "block"

                const product = await api.getProduct(product_id)
                productForm.querySelector('.form-title').innerText = "Update product"

                productForm.querySelector('#product-id').value = product.id
                productForm.querySelector('#product-name').value = product.name
                productForm.querySelector('#product-description').value = product.description
                productForm.querySelector('#product-price').value = product.price;
                productForm.querySelector('#product-stock_quantity').value = product.stock_quantity
                productForm.querySelector('#product-image').src = product.image_url
            }

            if(e.target.classList.contains('delete-btn')) {
                if(confirm("Are you sure you want to delete this product?")) {
                    try {
                        await api.deleteProduct(product_id)
                        location.reload()
                    } catch(err) {
                        alert(`Error: ${err.message}`)
                    }
                }
            }
        })
    }
    if(productForm) {
        productForm.addEventListener('submit', async (e) => {
            e.preventDefault()

            let formData = new FormData();

            // {{ key }}, {{ value }}
            const name = document.querySelector('#product-name').value
            if(name) formData.append('name', name)
            
            const description = document.querySelector('#product-description').value
            if(description) formData.append('description', description)

            const price = document.querySelector('#product-price').value
            if (price) formData.append('price', price)
            
            const stock_quantity = document.querySelector('#product-stock_quantity').value
            if(stock_quantity) formData.append('stock_quantity', stock_quantity) 

            // chinicheck ng .files[0] yung first file na ininput sa input[type="file"] tag natin
            const fileInput = document.querySelector('#product-image_url')
            if(fileInput.files[0]) {
                formData.append('image', fileInput.files[0])
            }

            const id = productForm.querySelector('#product-id').value
            if(id) {
                await api.updateProduct(formData, id)
                alert('Product updated successfully!')
            } else {
                await api.createProduct(formData)
                alert('Product created successfully!')
            }
            

            location.reload()
            
        })
    }
    if(createProductBtn) {
        createProductBtn.addEventListener('click', (e) => {
            e.preventDefault()
            productForm.reset();
            formWrapper.style.display = "flex"
            productForm.style.display = "block"
            cancelProductBtn.style.display = "block"
            productForm.querySelector('.form-title').innerText = "Create user"
        })
    }
    if(cancelProductBtn) {
        cancelProductBtn.addEventListener('click', (e) => {
            e.preventDefault()
            productForm.reset();
            productForm.style.display = "none"
            formWrapper.style.display = "none"
            cancelProductBtn.style.display = "none"
            productForm.querySelector('#product-image').style.display = "none"
        })
    }



    // (SHOP)
    const itemDetailDiv = document.querySelector('#item-detail');
    if(shopListDiv) {
        loadShop();

        shopListDiv.addEventListener('click', async (e) => {
            e.preventDefault();

            const card = e.target.closest('.shop-item');
            const product_id = card.dataset.id;

            if(e.target.classList.contains('add-to-cart-btn')) {
                const product = await api.getProduct(product_id);
                localStorage.setItem('currentProduct', JSON.stringify(product));
                location.href = 'details.html';
            }
        });
    }
    if(window.location.pathname.endsWith('details.html')) {
        const currentProduct = JSON.parse(localStorage.getItem('currentProduct'));

        itemDetailDiv.innerHTML = '';

        if(!currentProduct) {
            itemDetailDiv.innerHTML = `<p>Nothing here yet. Pick a product! <a href="shop.html">Click here.</a></p>`;
            return
        }
        itemDetailDiv.innerHTML = `
            <div class="product-image-container">
                <img src="${currentProduct.image_url}" alt="${currentProduct.name}" class="product-image">
            </div>
            
            <div class="product-info">
                <h3 class="product-title">${currentProduct.name}</h3>
                <p class="product-desc">${currentProduct.description}</p>
                <div class="product-meta">
                    <span class="product-price">₱${currentProduct.price}</span>
                    <span class="product-stock">Stock: ${currentProduct.stock_quantity}</span>
                </div>
                <div>
                    <label>Quantity</label>
                    <input type="quantity" id="add-product-quantity">
                </div>
            </div>

            <div class="product-actions">
                <button class="add-to-cart-btn" id="add-product-cart">Add to Cart</button>
                <button id="cancel-product-cart">Cancel</button>
            </div>
        `;
    }
    const cancelProductCartBtn = document.querySelector('#cancel-product-cart');
    if(cancelProductCartBtn) {
        cancelProductCartBtn.addEventListener('click', (e) => {
            localStorage.removeItem('currentProduct');
            location.href = "shop.html";
        })
    }
    const addProductCartBtn = document.querySelector('#add-product-cart');
    if(addProductCartBtn) {
        const currentProduct = JSON.parse(localStorage.getItem('currentProduct'));
        const currentUser = JSON.parse(localStorage.getItem('currentUser'));

        addProductCartBtn.addEventListener('click', async (e) => {
            const quantity = document.querySelector('#add-product-quantity').value;
            if(!quantity) {
                alert('Quantity cannot be 0.');
                return;
            }

            if(!currentUser) {
                alert('You need to be logged in first.');
                location.href = 'login.html';
                return;
            }

            const data = {
                user_id: currentUser.id,
                product_id: currentProduct.id,
                quantity: quantity
            }

            // api
            try {
                const result = await api.addItem(data);
                alert("Added item to cart successfully!");
                location.href = 'shop.html'
            } catch(err) {
                alert(`Error: ${err.message}`);
            }
        })
    }


    
    // (CART)
    if(cartListDiv) {
        loadCart();

        cartListDiv.addEventListener('click', async (e) => {
            if(e.target.classList.contains('remove-to-cart-btn')) {
                const row = e.target.closest('tr');
                const cart_id = row.dataset.id;

                if(confirm("Are you sure you want to remove the product from your cart?")) {
                    await api.removeItem(cart_id);
                    location.reload();
                    alert('Item removed successfully.')
                }
            }

            if(e.target.classList.contains('edit-quantity-btn')) {
                const row = e.target.closest('tr');
                const cart_id = row.dataset.id;

                const quantityTextEl = row.querySelector('#cart-quantity');
                quantityTextEl.style.display = 'none';

                let quantityWrapper = row.querySelector('#quantity-wrapper');
                quantityWrapper.innerHTML = `
                    <input type="number" id="cart-update-quantity">
                `;

                const editBtn = row.querySelector('.edit-quantity-btn');
                editBtn.style.display = 'none';

                const cartActionsDiv = row.querySelector('.cart-actions');
                cartActionsDiv.innerHTML += `
                    <button class="cancel-update-btn">Cancel</button>
                    <button class="save-update-btn">Save</button>
                `;

                const saveUpdateBtn = row.querySelector('.save-update-btn');
                saveUpdateBtn.addEventListener('click', async (e) => {
                    const quantityInputEl = row.querySelector('#cart-update-quantity').value.trim();
                    const data = {
                        quantity: quantityInputEl
                    }
                    await api.updateItemQuantity(cart_id, data);
                    alert("Updated the item quantity successfully.");
                    location.reload();
                })

                const cancelUpdateBtn = row.querySelector('.cancel-update-btn');
                cancelUpdateBtn.addEventListener('click', async (e) => {
                    location.reload();
                })
            }

            if(e.target.classList.contains('checkout-btn')) {
                location.href = 'checkout.html';
            }
        })
    }
    



    // (CHECKOUT)
    if(checkoutCartDiv) {
        loadCheckoutCart();
    }
    if(placeOrderBtn) {
        placeOrderBtn.addEventListener('click', async (e) => {
            try {
                const currentUser = JSON.parse(localStorage.getItem('currentUser'));
                const userId = {
                    user_id: currentUser.id
                }
                const result = await api.placeOrder(userId);
                alert("Order placed successfully. Check your dashboard for the status of your order.");
                location.href = "cart.html"
            } catch(err) {
                alert(`Error: ${err.message}`);
            }
        })
    }





    // (ORDERS)
    if(ordersListDiv) {
        loadOrders();

        ordersListDiv.addEventListener('click', async (e) => {
            e.preventDefault()

            if(e.target.classList.contains('edit-btn')) {
                const row = e.target.closest('tr');
                const order_id = row.dataset.id;

                const orderStatusText = row.querySelector('#order-status-p');
                orderStatusText.style.display = 'none';

                const orderStatusEl = row.querySelector('#order-status');
                orderStatusEl.innerHTML += `
                    <div>
                        <select class="status-order">
                            <option value="PENDING">Pending</option>
                            <option value="SHIPPED">Shipped</option>
                            <option value="DELIVERED">Delivered</option>
                        </select>
                    </div>
                `;
                
                const editBtn = row.querySelector('.edit-btn');
                editBtn.style.display = 'none';

                const orderActionsDiv = row.querySelector('.action-buttons');
                orderActionsDiv.innerHTML += `
                    <button class="cancel-update-btn">Cancel</button>
                    <button class="save-update-btn">Save</button>
                `;

                const saveUpdateBtn = row.querySelector('.save-update-btn');
                saveUpdateBtn.addEventListener('click', async (e) => {
                    const newStatus = row.querySelector('.status-order').value;
                    console.log(newStatus)
                    const data = {
                        status: newStatus
                    }
                    const result = await api.updateStatusOrder(order_id, data);
                    alert(result);
                    location.reload()
                })

                const cancelUpdateBtn = row.querySelector('.cancel-update-btn');
                cancelUpdateBtn.addEventListener('click', async (e) => {
                    location.reload();
                })

            }
        })
    }




    // (ORDERS) CUSTOMER
    if(ordersListCustomerDiv) {
        loadOrdersCustomers();
    }




    // (DASHBOARD) Display Orders by Status
    if(orderStatusChart) {
        loadOrderStatusChart();
        loadKpi();
    }




    // (AUTH) REGISTER publicly
	if(registerForm) {
		registerForm.addEventListener('submit', async (e) => {
			e.preventDefault()
			
			const newAccount = {
				name: document.querySelector('#account-name').value.trim(),
				email: document.querySelector('#account-email').value.trim(),
				password: document.querySelector('#account-password').value.trim(),
				role: "customer"
			}
			
			try {
				await api.createAccount(newAccount)
				alert('Created account successfully!')
				
				registerForm.reset()
                location.href = 'login.html'
			}
			catch(err) {
				console.error(err)
			} 
		})
	}

    // (AUTH) REGISTER admin/UPDATE
    if(createUserBtn) {
        createUserBtn.addEventListener('click', (e) => {
            e.preventDefault()
            userForm.reset();
            formWrapper.style.display = "flex"
            userForm.style.display = "block"
            cancelUserBtn.style.display = "block"
            userForm.querySelector('.form-title').innerText = "Create user"
        })
    }
    if(cancelUserBtn) {
        cancelUserBtn.addEventListener('click', (e) => {
            e.preventDefault()
            userForm.reset();
            userForm.style.display = "none"
            formWrapper.style.display = "none"
            cancelUserBtn.style.display = "none"
        })
    }
    if(userForm) {
        userForm.addEventListener('submit', async (e) => {
            e.preventDefault()

            const data = {
                name: userForm.querySelector('#user-name').value.trim() || null,
                email: userForm.querySelector('#user-email').value.trim() || null, 
                password: userForm.querySelector('#user-password').value.trim() || null,
                role: userForm.querySelector('#user-role').value.trim() || null
            }

            const id = userForm.querySelector('#user-id').value
            if(id) {
                await api.updateUser(data, id)
                alert("User updated successfully!")
            } else {
                await api.createAccount(data)
                alert("User created successfully!")
            }

            location.reload()
        })
    }

    // (AUTH) TABLE EVENT LISTENER (UPDATE/DELETE)
    if(usersListDiv) {
        loadUsers();

        usersListDiv.addEventListener('click', async (e) => {
            e.preventDefault()

            const row = e.target.closest('tr')
            const user_id = row.dataset.id

            if(e.target.classList.contains('edit-btn')) {
                userForm.reset();
                userForm.style.display = "block"
                formWrapper.style.display = "flex"
                cancelUserBtn.style.display = "block"

                const user = await api.getUser(user_id)
                userForm.querySelector('.form-title').innerText = "Update user"

                userForm.querySelector('#user-id').value = user.id
                userForm.querySelector('#user-name').value = user.name
                userForm.querySelector('#user-email').value = user.email
                userForm.querySelector('#user-password').value = "";
                userForm.querySelector('#user-role').value = user.role
            }

            if(e.target.classList.contains('delete-btn')) {
                if(confirm("Are you sure you want to delete this account?")) {
                    try {
                        await api.deleteUser(user_id)
                        location.reload()
                    } catch(err) {
                        alert(`Error: ${err.message}`)
                    }
                }
            }
        })
    }

    // (AUTH) LOGIN
    if(loginForm) {
		loginForm.addEventListener('submit', async (e) => {
			e.preventDefault()
			
			const credentials = {
				email: document.querySelector('#login-email').value.trim(),
				password: document.querySelector('#login-password').value.trim()
			}
			
			try {
				const data = await api.loginAccount(credentials);
                localStorage.setItem("currentUser", JSON.stringify(data));
				alert('Logged in successfully!');
				
				loginForm.reset();
                if(data.role === "admin") {
                    location.href = 'admin-dashboard.html';
                } else {
                    location.href = 'index.html';
                }
			}
			catch(err) {
				alert(`Error: ${err.message}`)
			} 
		})
	}

    if(userIndicatorEl) {
        const currentUser = JSON.parse(localStorage.getItem('currentUser'));
        if(!currentUser) {
            return
        }
        if(currentUser.role !== 'admin') {
            userIndicatorEl.style.display = 'inline-block'
            userIndicatorEl.innerHTML = `<p>Current User: ${currentUser.name}</p>`;
            userIndicatorEl.style.hover
            userIndicatorEl.addEventListener('click', (e) => {location.href = 'dashboard.html'})
        }
    }

    // (AUTH) LOGOUT
    if(logoutBtn) {
        logoutBtn.addEventListener('click', (e) => {
            e.preventDefault()

            if(confirm('Are you sure you want to logout?')) {
                localStorage.removeItem('currentUser')
                location.reload()
            }
        })
    }

    // (AUTH) GATEKEEPER FUNCTION/SESSION CHECKER
    if(!(window.location.pathname.endsWith('index.html') || 
         window.location.pathname.endsWith('login.html') ||
         window.location.pathname.endsWith('register.html') ||
         window.location.pathname.endsWith('shop.html') ||
         window.location.pathname.endsWith('details.html') ||
         window.location.pathname.endsWith('checkout.html') ||
         window.location.pathname.endsWith('cart.html')) && !localStorage.getItem('currentUser')) {
        alert('You must be logged in to view this page. Redirecting..')
        window.location.href = 'index.html'
    }
})