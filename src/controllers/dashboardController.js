const { db } = require('../database')
const bcrypt = require('bcrypt')
const { run, all, get } = require('../utils/helper')



const getAnalytics = async (req, res) => {
    try {
        const result = await all(`
            SELECT
                (SELECT SUM(total_amount) FROM orders) AS totalSales,
                (SELECT COUNT(*) FROM orders) AS totalOrders,
                (SELECT COUNT(*) FROM users) AS totalUsers;
        `);

        res.status(200).json({success:true,data:result})
    } catch(err) {
        return res.status(500).json({success:false,data:`Internal Server Error: ${err.message}`});
    }
}





module.exports = {
    getAnalytics
}