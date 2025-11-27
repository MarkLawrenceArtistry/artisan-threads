const express = require('express');
const cors = require('cors');
const { db, initDB } = require('./database.js')

const app = express();
const PORT = process.env.port || 3000;

const authRoutes = require('./routes/auth.js')

// Middlewares
app.use(express.json());
app.use(express.static('../public'));
app.use(cors());

app.use('/api/auth', authRoutes)

initDB();

// Initial Routes
app.get('/', (req, res) => {
    res.status(200).json({success:true,data:"Welcome to my app"})
});

app.listen(PORT, () => {
    console.log(`The port is listening at https://localhost:${PORT}`)
})