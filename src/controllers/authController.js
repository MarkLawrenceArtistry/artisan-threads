const { db } = require('../database')
const bcrypt = require('bcrypt')
const { run, all, get } = require('../utils/helper')

const register = (req, res) => {
    const { name, email, password, role } = req.body;

    if(!name || !email || !password || !role) {
        return res.status(400).json({success:false,data:"All fields are required."})
    }

    bcrypt.hash(password, 10, (err, hash) => {
        if(err) {
            return res.status(500).json({success:false,data:`Error hashing password: ${err.message}`})
        }

        const query = `
            INSERT INTO users (name, email, password_hash, role)
            VALUES (?, ?, ?, ?)
        `

        const params = [name, email, hash, role]

        db.run(query, params, function(err) {
            if(err) {
                return res.status(500).json({success:false,data:`Internal Server Error: ${err.message}`})
            } else {
                return res.status(200).json({success:true,data:{
                    id: this.lastID,
                    name: name,
                    email: email,
                    role: role
                }})
            }
        })
    })
}

const login = (req, res) => {
    const { email, password } = req.body;

    if(!email || !password) {
        return res.status(400).json({success:false,data:"Email and password are required."})
    }

    const query = `
        SELECT *
        FROM users
        WHERE email = ?
    `
    const params = [email]

    db.get(query, params, (err, user) => {
        if(err) {
            return res.status(500).json({success:false,data:`Internal Server Error: ${err.message}`})
        }

        if(!user) {
            return res.status(401).json({success:false,data:"Invalid email or password."})
        }

        bcrypt.compare(password, user.password_hash, (bcryptErr, isMatch) => {
            if(bcryptErr) {
                return res.status(500).json({success:false,data:'Error verifying password.'})
            }

            if(isMatch) {
                return res.status(200).json({success:true,data:{
                    message:"Logged in successful",
                    id: user.id,
                    name: user.name,
                    email: email,
                    role: user.role
                }})
            } else {
                return res.status(400).json({success:false,data:"Invalid email or password."})
            }
        })
    })
}

const getAllUsers = async (req, res) => {
    try {
        const rows = await all("SELECT id, name, email, role FROM users");

        return res.status(200).json({success:true,data:rows})
    } catch(err) {
        return res.status(500).json({success:false,data:`Internal Server Error: ${err}`})
    }
}

const getUser = async (req, res) => {
    try {
        const { id } = req.params

        if(!id){
            return res.status(400).json({success:false,data:"ID is required."})
        }

        const row = await get("SELECT id, name, email, role FROM users WHERE id = ?", [id])
        if(!row) {
            return res.status(404).json({success:false,data:"User not found."})
        }

        return res.status(200).json({success:true,data:row})
    } catch(err) {
        return res.status(500).json({success:false,data:`Internal Server Error: ${err}`})
    }
}

const updateUser = async (req, res) => {
    try {
        const { id } = req.params
        let { name, email, password, role } = req.body

        if(!password) {
            password = null;
        } else {
            const salt = await bcrypt.genSalt(10);
            password = await bcrypt.hash(password, salt);
        }

        await run(`
            UPDATE users
            SET
                name = COALESCE(?, name),    
                email = COALESCE(?, email),    
                password_hash = COALESCE(?, password_hash),    
                role = COALESCE(?, role)
            WHERE id = ?
        `, [name, email, password, role, id])

        return res.status(201).json({success:true,data:`User: ${name} updated successfully!`})
    } catch(err) {
        return res.status(500).json({success:false,data:`Internal Server Error: ${err.message}`})
    }
}

const deleteUser = async (req, res) => {
    try {
        const { id } = req.params

        await run("DELETE FROM users WHERE id = ?", [id])
        return res.status(200).json({success:true,data:"Delete user successfully!"})
    } catch(err) {
        return res.status(500).json({success:false,data:`Internal Server Error: ${err.message}`})
    }
}

module.exports = { register, login, getAllUsers, getUser, updateUser, deleteUser }