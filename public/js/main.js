import * as api from './api.js'
import * as render from './render.js'

document.addEventListener('DOMContentLoaded', () => {

	// CONSTANTS
	const registerForm = document.querySelector('#register-form')
	const loginForm = document.querySelector('#login-form')
    const logoutBtn = document.querySelector('#logout-button')
	
    const productsListDiv = document.querySelector('#products-list')








    // (AUTH) REGISTER
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









    // (PRODUCTS) GET ALL PRODUCTS
    async function loadProducts() {
        try {
			const result = await api.getAllProducts()
			render.renderProductsTable(result, productsListDiv)
		} catch(err) {
			console.error(err)
		}
    }
    if(productsListDiv) {
        loadProducts()
    }
})