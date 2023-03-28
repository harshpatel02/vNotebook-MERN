import React, { useContext } from 'react'
import noteContext from '../context/notes/NoteContext'

const NoteItem = (props) => {
    const context = useContext(noteContext)
    const { deleteNote } = context
    const { note, updateNote } = props
    return (
        <div className="col-md-3">
            <div className="card my-3">
                <div className="card-body">
                    <h5 className="card-title text-center">{note.title}</h5>
                    <p className="card-text text-center">{note.description}</p>
                    <div className="d-flex justify-content-between">
                        <i className="fa-regular fa-pen-to-square" onClick={() => { updateNote(note) }}></i>
                        <h6 className="card-subtitle mb-2 d-inline" style={{ fontSize: "15px", backgroundColor: "#101820FF", color: "#FEE715FF" }}>&nbsp;{note.tag}&nbsp;</h6>
                        <i className="mx-2 fa-regular fa-trash-can" onClick={() => { deleteNote(note._id); props.showAlert("success", "Note deleted successfully") }}></i>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default NoteItem