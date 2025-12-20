const { run, all, get } = require('../utils/helper');

const placeOrder = async (req, res) => {
    const { user_id } = req.body;

    if(!user_id) {
        return res.status(400).json({success:false,data:"User id is required."});
    }

    try {
        // 1. Start transaction
        await run('BEGIN TRANSACTION');

        // 2. Get Cart Items joined with Product details
        const cartItems = await all(`
            SELECT ci.product_id, 
                ci.quantity, 
                p.price, 
                p.stock_quantity
            FROM cart_items ci
            JOIN products p
            ON ci.product_id = p.id
            WHERE ci.user_id = ?
        `, [user_id]);

        if(cartItems.length === 0) {
            await run("ROLLBACK");
            return res.status(400).json({success:false,data:"Cart cannot be empty."})
        }

        // 3. Calculate Total and Validate Stock
        let total_amount = 0

        for(const item of cartItems) {
            if(item.quantity > item.stock_quantity) {
                await run("ROLLBACK");
                return res.status(400).json({success:false,data:`There is no stock available for product no. ${item.product_id}`});
            }

            total_amount += item.price * item.quantity;
        }

        // 4. Create the order record
        const result = await run(`
            INSERT INTO orders (user_id, total_amount, status)
            VALUES (?, ?, ?)
        `, [user_id, total_amount, "PENDING"])

        const order_id = result.lastID;

        // 5. Move items from cart to order_items & update stock.
        for(const item of cartItems) {
            // Create order item
            await run(`
                INSERT INTO order_items (order_id, product_id, quantity, price_at_purchase)
                VALUES (?, ?, ?, ?)
            `, [order_id, item.product_id, item.quantity, item.price]);

            // Subtract it from the stocks of product table
            await run(`
                UPDATE products
                SET
                    stock_quantity = stock_quantity - ?
                WHERE id = ?
            `, [item.quantity, item.product_id])
        }

        // 6. Clear the user cart
        await run("DELETE FROM cart_items WHERE user_id = ?", [user_id])

        // 7. Commit the transaction
        await run("COMMIT");

        return res.status(200).json({success:true,data:{
            message: "Order placed successfully!",
            order_id: order_id
        }});
    } catch(err) {
        await run("ROLLBACK");
        return res.status(500).json({success:false,data:`Internal Server Error: ${err.message}`});
    }
}

module.exports = { placeOrder }