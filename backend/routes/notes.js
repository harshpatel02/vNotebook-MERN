const express = require('express')
const router = express.Router()
const Note = require('../models/Note')
const fetchuser = require('../middleware/fetchuser')
const { body, validationResult } = require('express-validator')

// ROUTE 1: Get All the Notes using: GET "/api/notes/get"
router.get('/all', fetchuser, async (req, res) => {
    try {
        const notes = await Note.find({ user: req.user.id })
        res.json(notes);
    } catch (error) {
        console.error(error.message)
        res.status(500).send("Internal Server Error")
    }
})

// ROUTE 2: Add the Note using: POST "/api/notes/add"
router.post('/add', fetchuser, [
    body('title', 'Enter a valid title').isLength({ min: 3 }),
    body('description', 'Description must be atleast 5 characters').isLength({ min: 5 })
], async (req, res) => {
    try {
        const { title, description, tag } = req.body
        // if there are errors
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() })
        }
        const note = new Note({
            title, description, tag, user: req.user.id
        })
        const savedNote = await note.save()
        res.json(note)
    }
    catch (error) {
        console.error(error.message)
        res.status(500).json("Internal Server Error")
    }
})

// ROUTE 3: Update an Existing Note using: PUT "/api/notes/update"
router.put('/update/:id', fetchuser, async (req, res) => {
    const { title, description, tag } = req.body;
    // Create a newNote to update
    try {
        const newNote = {}
        if (title) newNote.title = title
        if (description) newNote.description = description
        if (tag) newNote.tag = tag

        // Find the note to be updated
        let note = await Note.findById(req.params.id)
        if (!note) {
            return res.status(404).send("Not Found")
        }

        // Check if the updater is same as the owner
        if (note.user.toString() !== req.user.id) {
            return res.status(401).send("Not Allowed")
        }

        note = await Note.findByIdAndUpdate(req.params.id, { $set: newNote }, { new: true })
        res.status(201).json(note)
    } catch (error) {
        console.log(error.message)
        res.status(500).json("Internal Server Error")
    }

})

// ROUTE 4: Delete a Note using: DELETE "/api/notes/delete"
router.delete('/delete/:id', fetchuser, async (req, res) => {
    try {
        // Find the note to be deleted
        let note = await Note.findById(req.params.id)
        if (!note) {
            return res.status(404).send("Not Found")
        }
        // Allow deletion only if user owns this note
        if (note.user.toString() !== req.user.id) {
            return res.status(401).send("Not Allowed")
        }

        note = await Note.findByIdAndDelete(req.params.id)
        res.status(201).json({
            "Success": "Note has been Deleted",
            note: note
        })
    } catch (error) {
        console.error(error.message)
        res.status(500).json("Internal Server Error")
    }

})

module.exports = router