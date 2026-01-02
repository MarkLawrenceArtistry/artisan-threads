

// (AUTH) Register
export async function createAccount(newAccount) {
    const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(newAccount)
    })

    const result = await response.json()
    if(!result.success) {
        throw new Error(result.data)
    }

    return result.data
}
// (AUTH) Login
export async function loginAccount(credentials) {
    const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(credentials)
    })

    const result = await response.json()
    if(!result.success) {
        throw new Error(result.data)
    }

    return result.data
}
// (AUTH) Get all users
export async function getAllUsers() {
    const response = await fetch('/api/auth', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    })

    const result = await response.json()
    if(!result.success) {
        throw new Error(result.data)
    }

    return result.data
}
// (AUTH) Get user
export async function getUser(id) {
    const response = await fetch(`/api/auth/${id}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    })

    const result = await response.json()
    if(!result.success) {
        throw new Error(result.data)
    }

    return result.data
}
// (AUTH) Update user
export async function updateUser(data, id) {
    const response = await fetch(`/api/auth/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })

    const result = await response.json()
    if(!result.success) {
        throw new Error(result.data)
    }

    return result.data
}
// (AUTH) Delete user
export async function deleteUser(id) {
    const response = await fetch(`/api/auth/${id}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        }
    })

    const result = await response.json()
    if(!result.success) {
        throw new Error(result.data)
    }

    return result.data
}





// (PRODUCTS) Get all products
export async function getAllProducts() {
    const response = await fetch('/api/products', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    })

    const result = await response.json()
    if(!result.success) {
        throw new Error(result.data)
    }

    return result.data
}
// (PRODUCTS) Create product
export async function createProduct(formData) {
    const response = await fetch('/api/products/', {
        method: 'POST',
        body: formData
    })

    const result = await response.json()
    if(!result.success) {
        throw new Error(result.data)
    }

    return result.data
}