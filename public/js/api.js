

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