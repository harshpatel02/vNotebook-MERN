import NoteContext from './NoteContext'
import React, { useState } from 'react'
import axios from 'axios'

const NoteState = (props) => {
    const host = "http://localhost:5000"
    const initialNotes = []
    const [notes, setNotes] = useState(initialNotes)

    const getNotes = async () => {
        const resp = await axios.get(`${host}/api/notes/all`, {
            headers: {
                'Content-Type': 'application/json',
                'auth-token': localStorage.getItem('token')
            }
        })
        setNotes(resp.data)
    }

    // Add a Note
    const addNote = async (title, description, tag) => {
        await fetch(`${host}/api/notes/add`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'auth-token': localStorage.getItem('token')
            },
            body: JSON.stringify({ title, description, tag })
        })
    }

    // Delete a Note
    const deleteNote = async (id) => {
        // api call
        await fetch(`${host}/api/notes/delete/${id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'auth-token': localStorage.getItem('token')
            }
        })

        let newNotes = notes.filter((note) => {
            return note._id !== id
        })
        setNotes(newNotes)
    }

    // Edit a Note
    const editNote = async (id, title, description, tag) => {
        // api call

        await fetch(`${host}/api/notes/update/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'auth-token': localStorage.getItem('token')
            },
            body: JSON.stringify({ title, description, tag })
        })

        for (let i = 0; i < notes.length; i++) {
            const elem = notes[i]
            if (elem._id === id) {
                elem.title = title
                elem.description = description
                elem.tag = tag
            }
        }
    }

    return (
        <NoteContext.Provider value={{ notes, getNotes, addNote, deleteNote, editNote }}>
            {props.children}
        </NoteContext.Provider>
    )
}

export default NoteState