const { db } = require('../database')

const addItem = (req, res) => {
    const { user_id, product_id, quantity } = req.body
    
    const query = `
        INSERT INTO cart_items (user_id, product_id, quantity)
        VALUES (?, ?, ?)
    `

    const params = [user_id, product_id, quantity]

    db.run(query, params, function(err) {
        if(err) {
            return res.status(500).json({success:false,data:`Either the product was not found or: ${err.message}`})
        }

        return res.status(200).json({success:true,data:{
            message: "Added to cart successfully!",
            id: this.lastID,
            user_id: user_id,
            product_id: product_id,
            quantity: quantity
        }})
    })
}

const getItem = (req, res) => {
    const { id } = req.params
    const query = `
        SELECT * FROM cart_items
        WHERE id = ?
    `
    const params = [id]

    db.get(query, params, (err, row) => {
        if(err) {
            return res.status(500).json({success:false,data:err.message})
        }

        if(!row) {
            return res.status(404).json({success:false,data:"Item in the cart was not found."})
        } else {
            return res.status(200).json({success:true,data:row})
        }
    })
}

const getAllItem = (req, res) => {
    const query = `
        SELECT * FROM cart_items;
    `

    db.all(query, [], (err, rows) => {
        if(err) {
            return res.status(500).json({success:false,data:err.message})
        } else {
            return res.status(200).json({success:true,data:rows})
        }
    })
}

const deleteItem = (req, res) => {
    const { id } = req.params

    const query = `
        DELETE FROM cart_items
        WHERE id = ?
    `

    const params = [id]

    db.run(query, params, function(err) {
        if(err) {
            return res.status(500).json({success:false,data:err.message})
        }

        if(this.changes > 0) {
            return res.status(200).json({success:true,data:"Item successfully removed from the cart."})
        } else {
            return res.status(404).json({success:false,data:"Item in the cart was not found."})
        }
    })
}

module.exports = { addItem, getItem, getAllItem, deleteItem }