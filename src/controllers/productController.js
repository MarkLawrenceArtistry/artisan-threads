const { db } = require('../database')

const createProduct = (req, res) => {
    const { name, description, price, stock_quantity } = req.body

    if(!req.file) {
        return res.status(400).json({success:false,data:"No image file uploaded."})
    }

    const imageUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`

    const query = `
        INSERT INTO products (name, description, price, stock_quantity, image_url)
        VALUES (?, ?, ?, ?, ?)
    `

    const params = [name, description, price, stock_quantity]

    db.run(query, params, function(err) {
        if(err) {
            return res.status(500).json({success:false,data:err.message})
        } else {
            return res.status(201).json({
                success: true,
                data: {
                    id: this.lastID,
                    name,
                    description,
                    price,
                    stock_quantity,
                    imageUrl
                }
            })
        }
    })
}

module.exports = { createProduct }