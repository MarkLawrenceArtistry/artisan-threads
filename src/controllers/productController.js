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

    const params = [name, description, price, stock_quantity, imageUrl]

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

const getProduct = (req, res) => {
    const { id } = req.params
    const query = `
        SELECT * FROM products
        WHERE id = ?
    `
    const params = [id]

    db.get(query, params, (err, row) => {
        if(err) {
            return res.status(500).json({success:false,data:err.message})
        }

        if(!row) {
            return res.status(404).json({success:false,data:"Product not found."})
        } else {
            return res.status(200).json({success:true,data:row})
        }
    })
}

const getAllProduct = (req, res) => {
    const query = `
        SELECT * FROM products
    `
    db.all(query, [], (err, rows) => {
        if(err) {
            return res.status(500).json({success:false,data:err.message})
        } else {
            return res.status(200).json({success:true,data:rows})
        }
    })
}

const updateProduct = (req, res) => {
    const { id } = req.params
    const { name, description, price, stock_quantity } = req.body

    let imageUrl = null

    if(req.file) {
        imageUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`
    }

    const query = `
        UPDATE products 
        SET
            name = COALESCE(?, name),
            description = COALESCE(?, description),
            price = COALESCE(?, price),
            stock_quantity = COALESCE(?, stock_quantity),
            image_url = COALESCE(?, image_url)
        WHERE id = ?
    `
    const params = [name, description, price, stock_quantity, imageUrl, id]

    db.run(query, params, function(err) {
        if(err) {
            return res.status(500).json({success:false,data:err.message})
        }

        if(this.changes > 0) {
            return res.status(200).json({success:true,data:`Changes to this product no.${id}: ${this.changes}`})
        } else {
            return res.status(404).json({success:false,data:"Product not found."})
        }
    })
}

const deleteProduct = (req, res) => {
    const { id } = req.params
    const query = `
        DELETE FROM products
        WHERE id = ?
    `
    const params = [id]

    db.run(query, params, function(err) {
        if(err) {
            return res.status(500).json({success:false,data:err.message})
        }

        if(this.changes > 0) {
            return res.status(200).json({success:true,data:`Product no.${this.lastID} successfully deleted.`})
        } else {
            return res.status(404).json({success:false,data:"Product not found."})
        }
    })
}

module.exports = { createProduct, getProduct, getAllProduct, updateProduct, deleteProduct }