import * as api from './api.js'
import * as render from './render.js'

document.addEventListener('DOMContentLoaded', () => {

	// CONSTANTS
	const registerForm = document.querySelector('#register-form')
	const loginForm = document.querySelector('#login-form')
    const logoutBtn = document.querySelector('#logout-button')
	
    const productsListDiv = document.querySelector('#products-list')
    const usersListDiv = document.querySelector('#users-list')

    const userForm = document.querySelector('#user-form')
    const createUserBtn = document.querySelector('#create-btn')
    const cancelUserBtn = document.querySelector('#cancel-btn')



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




    // (PRODUCTS) GET ALL PRODUCTS
    if(productsListDiv) {
        loadProducts()
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
    // (AUTH) REGISTER admin/UPDATE
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
				console.error(err)
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
    if(!(window.location.pathname.endsWith('index.html') || window.location.pathname.endsWith('login.html') || window.location.pathname.endsWith('register.html')) && !localStorage.getItem('currentUser')) {
        alert('You must be logged in to view this page. Redirecting..')
        window.location.href = 'index.html'
    }
})