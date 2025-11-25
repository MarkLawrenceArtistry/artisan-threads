const sqlite3 = require('sqlite3');
const DB_SOURCE = 'database.db';

const db = new sqlite3.Database(DB_SOURCE, (err) => {
    if(err) {
        console.log(err.message);
    }
})

const initDB = () => {
    db.serialize(() => {
        db.run('PRAGMA foreign_keys = ON;', (err) => {
            if(err) {
                console.log(err.message);
            }
        })

        const users = `
            CREATE TABLE users (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL,
                email TEXT UNIQUE NOT NULL,
                password_hash TEXT NOT NULL,
                role TEXT DEFAULT 'customer'
            )
        `;
        
        const products = `
            CREATE TABLE products (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL,
                description TEXT,
                price REAL NOT NULL,
                stock_quantity INTEGER NOT NULL,
                image_url TEXT
            )
        `;

        const orders = `
            CREATE TABLE orders (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_id INTEGER NOT NULL,
                total_amount REAL NOT NULL,
                status TEXT DEFAULT 'Pending',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (user_id) REFERENCES users(id)
            )
        `;

        const order_items = `
            CREATE TABLE order_items (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                order_id INTEGER NOT NULL,
                product_id INTEGER NOT NULL,
                quantity INTEGER NOT NULL,
                price_at_purchase REAL NOT NULL, 
                FOREIGN KEY (order_id) REFERENCES orders(id),
                FOREIGN KEY (product_id) REFERENCES products(id)
            )
        `;

        const cart_items = `
            CREATE TABLE cart_items (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_id INTEGER NOT NULL,
                product_id INTEGER NOT NULL,
                quantity INTEGER NOT NULL,
                FOREIGN KEY (user_id) REFERENCES users(id),
                FOREIGN KEY (product_id) REFERENCES products(id)
            )
        `;

        db.run(users, (err) => {
            if(err) {
                console.log(err.message)
            } else {
                console.log('users TABLE CREATED SUCCESSFULLY/ALREADY EXISTS.')
            }
        })

        db.run(products, (err) => {
            if(err) {
                console.log(err.message)
            } else {
                console.log('products TABLE CREATED SUCCESSFULLY/ALREADY EXISTS.')
            }
        })

        db.run(orders, (err) => {
            if(err) {
                console.log(err.message)
            } else {
                console.log('orders TABLE CREATED SUCCESSFULLY/ALREADY EXISTS.')
            }
        })

        db.run(order_items, (err) => {
            if(err) {
                console.log(err.message)
            } else {
                console.log('order_items TABLE CREATED SUCCESSFULLY/ALREADY EXISTS.')
            }
        })
        
        db.run(cart_items, (err) => {
            if(err) {
                console.log(err.message)
            } else {
                console.log('cart_items TABLE CREATED SUCCESSFULLY/ALREADY EXISTS.')
            }
        })
    })
}

module.exports = { initDB }