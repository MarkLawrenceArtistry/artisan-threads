const express = require('express');
const cors = require('cors');
const path = require('path')
const { db, initDB } = require('./database.js')

const app = express();
const PORT = process.env.port || 3000;

// Routes
const authRoutes = require('./routes/auth.js')
const productRoutes = require('./routes/products.js')
const cartRoutes = require('./routes/cart_items.js')
const orderRoutes = require('./routes/orders.js')

// Middlewares
app.use(express.json());
app.use(express.static(path.join(__dirname, '../../public')));
app.use(cors());

app.use('/api/auth', authRoutes)
app.use('/api/products', productRoutes)
app.use('/api/cart_items', cartRoutes)
app.use('/api/orders', orderRoutes)

initDB();

// Initial Routes
app.get('/', (req, res) => {
    res.status(200).json({success:true,data:"Welcome to my app"})
});

app.listen(PORT, () => {
    console.log(`The server is listening at https://localhost:${PORT}`)
})