import * as api from './api.js'
import * as render from './render.js'

document.addEventListener('DOMContentLoaded', () => {

	// CONSTANTS
	const registerForm = document.querySelector('#register-form');
	const loginForm = document.querySelector('#login-form');
    const logoutBtn = document.querySelector('#logout-button');
	
    const productsListDiv = document.querySelector('#products-list');
    const productForm = document.querySelector('#product-form');
    const createProductBtn = document.querySelector('#create-product-btn');
    const cancelProductBtn = document.querySelector('#cancel-product-btn');

    const usersListDiv = document.querySelector('#users-list');
    const userForm = document.querySelector('#user-form');
    const createUserBtn = document.querySelector('#create-btn');
    const cancelUserBtn = document.querySelector('#cancel-btn');

    const shopListDiv = document.querySelector('#shop-list');

    const menuToggle = document.querySelector('.menu-toggle');
    const navLinks = document.querySelector('.nav-links');



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
            cancelProductBtn.style.display = "none"
            productForm.querySelector('#product-image').style.display = "none"
        })
    }



    // (SHOP) 
    if(shopListDiv) {
        loadShop();

        shopListDiv.addEventListener('click', (e) => {
            e.preventDefault();
        })
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
				const data = await api.loginAccount(credentials)
                localStorage.setItem("currentUser", JSON.stringify(data))
				alert('Logged in successfully!')
				
				loginForm.reset()
                if(data.role === "admin") {
                    location.href = 'admin-dashboard.html';
                } else {
                    location.href = 'dashboard.html';
                }
			}
			catch(err) {
				alert(`Error: ${err.message}`)
			} 
		})
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
         window.location.pathname.endsWith('cart.html')) && !localStorage.getItem('currentUser')) {
        alert('You must be logged in to view this page. Redirecting..')
        window.location.href = 'index.html'
    }
})