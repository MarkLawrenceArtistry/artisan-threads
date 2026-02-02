
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
// (AUTH) Admin change password
export async function adminChangePassword(data, id) {
    const response = await fetch(`/api/auth/password/${id}`, {
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
// (AUTH) Update user
export async function updateProduct(data, id) {
    const response = await fetch(`/api/products/${id}`, {
        method: 'PUT',
        body: data
    })

    const result = await response.json()
    if(!result.success) {
        throw new Error(result.data)
    }

    return result.data
}





// (PRODUCTS) Get all products
export async function getAllProducts(searchTerm = '') {
    let url = '/api/products';
    if(searchTerm) {
        url += `?searchTerm=${encodeURIComponent(searchTerm)}`
    }

    const response = await fetch(url, {
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
// (PRODUCTS) Get product
export async function getProduct(id) {
    const response = await fetch(`/api/products/${id}`, {
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
// (PRODUCTS) Delete product
export async function deleteProduct(id) {
    const response = await fetch(`/api/products/${id}`, {
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
// (PRODUCTS) Get all recent products
export async function getRecentProducts() {
    const response = await fetch('/api/products/recent/');

    const result = await response.json();
    if(!result.success) {
        throw new Error(result.data);
    }

    return result.data;
}







// (CART) Add Item
export async function addItem(data) {
    const response = await fetch('/api/cart_items/', {
        method: 'POST',
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
// (CART) Get Cart with details
export async function getCart(user_id) {
    const response = await fetch(`/api/cart_items/cart/user/${user_id}`, {
        method: 'GET',
    })

    const result = await response.json()
    if(!result.success) {
        throw new Error(result.data)
    }

    return result.data
}
// (CART) Remove Item in Cart
export async function removeItem(product_id) {
    const response = await fetch(`/api/cart_items/${product_id}`, {
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
// (CART) Update Quantity in Cart
export async function updateItemQuantity(product_id, quantity) {
    
    const response = await fetch(`/api/cart_items/qty/${product_id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(quantity)
    })

    const result = await response.json()
    if(!result.success) {
        throw new Error(result.data)
    }

    return result.data
}





// (ORDERS) Place Order
export async function placeOrder(user_id) {
    const response = await fetch(`/api/orders/place`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(user_id)
    })

    const result = await response.json()
    if(!result.success) {
        throw new Error(result.data)
    }

    return result.data
}
// (ORDERS) Get all
export async function getAllOrders() {
    const response = await fetch('/api/orders');

    const result = await response.json();
    if(!result.success) {
        throw new Error(result.data);
    }

    return result.data;
}
// (ORDERS) Update status in orders
export async function updateStatusOrder(order_id, status) {
    
    const response = await fetch(`/api/orders/${order_id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(status)
    })

    const result = await response.json()
    if(!result.success) {
        throw new Error(result.data)
    }

    return result.data
}
// (ORDERS) Get all orders from one customer
export async function getAllOrdersOneCustomer(user_id) {
    const response = await fetch(`/api/orders/${user_id}`);

    const result = await response.json();
    if(!result.success) {
        throw new Error(result.data);
    }

    return result.data;
}





// (DASHBOARD)
export async function getAnalytics() {
    const response = await fetch("/api/dashboard/analytics");
    const result = await response.json();
    if(!result.success) {
        throw new Error(result.data);
    }

    return result.data;
}