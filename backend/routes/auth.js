const express = require('express')
const router = express.Router()
const User = require('../models/User')
const { body, validationResult } = require('express-validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const fetchuser = require('../middleware/fetchuser')

const JWT_SECRET = 'iojdofsdnsoibjeij#*'

// ROUTE 1:Create a user using: POST "/api/auth/createuser". No Login Required
router.post('/createuser', [
    body('name', 'enter a valid name').isLength({ min: 3 }),
    body('email', 'enter a valid email').isEmail(),
    body('password', 'password should be atleast 5 chars').isLength({ min: 5 })
], async (req, res) => {
    // if there are errors
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
    }
    // Check whether the user exists already
    try {
        let user = await User.findOne({ email: req.body.email })
        if (user) {
            return res.status(400).json({ error: 'Sorry, a user with this email already exists' })
        } else {
            const salt = await bcrypt.genSalt(10)
            secPass = await bcrypt.hash(req.body.password, salt)
            user = await User.create({
                name: req.body.name,
                email: req.body.email,
                password: secPass
            })
            const data = {
                user: {
                    id: user.id
                }
            }
            const authtoken = jwt.sign(data, JWT_SECRET)
            res.json({ authtoken })
        }
    } catch (err) {
        console.log(err.message)
        res.status(500).send("Internal Server Error")
    }
})

// ROUTE 2:Authenticate a user using: POST "/api/auth/login". No Login Required
router.post('/login', [
    body('email', 'Enter a valid email').isEmail(),
    body('password', 'Password cannot be blank').exists()
], async (req, res) => {
    // if there are errors
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
    }

    const { email, password } = req.body;
    try {
        // Check if user exists
        let user = await User.findOne({ email })
        if (!user) return res.status(400).json({ error: 'Incorrect Credentials' })
        // Compare password
        const pass = await bcrypt.compare(password, user.password)
        if (!pass) {
            return res.status(400).json({ error: 'Incorrect Credentials' })
        }

        const payload = {
            user: {
                id: user.id
            }
        }

        const authtoken = jwt.sign(payload, JWT_SECRET)
        res.json({ authtoken })

    } catch (err) {
        console.error(err.message)
        res.status(500).send({ error: "Internal Server Error" })
    }
})

// Route 3: Get Loggedin User Details using: POST "/api/auth/getuser". Login required
router.post('/getuser', fetchuser, async (req, res) => {
    try {
        userId = req.user.id
        const user = await User.findById(userId).select('-password')
        res.send(user)
    } catch (err) {
        console.error(err.message)
        res.status(500).send("Internal Server Error")
    }
})

module.exports = router

// sample auth-token : eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoiNjMxYzgzZGE1OGE5YmU1MTJmOTcyZWEzIn0sImlhdCI6MTY2MjgxMzE0Nn0.1j1OtXytrewBh2ihUTKfODsWhHX34fxdfHEBxeQDpO0