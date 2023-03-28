import React from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

const Navbar = () => {
    let location = useLocation()
    let navigate = useNavigate()

    const logout = () => {
        localStorage.removeItem('token')
        navigate('/login')
    }

    return (
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
            <div className="container-fluid">
                <a className="navbar-brand" href="/">vNotebook</a>
                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarSupportedContent">
                    <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                        <li className="nav-item">
                            <a className={`nav-link ${location.pathname === "/" ? "active" : ""}`} aria-current="page" href="/">Home</a>
                        </li>
                        <li className="nav-item">
                            <a className={`nav-link ${location.pathname === "/about" ? "active" : ""}`} aria-current="page" href="/about">About</a>
                        </li>
                    </ul>
                    {!localStorage.getItem('token') ? <form className="d-flex" role="search">
                        <a className='btn btn-sm btn-outline-warning mx-1' href="/login" role='button'>Login</a>
                        <a className='btn btn-sm btn-outline-warning mx-1' href="/signup" role='button'>Signup</a>
                    </form> : <button onClick={logout} className='btn btn-sm btn-warning mx-1'> Logout </button>}
                </div>
            </div>
        </nav >
    )
}

export default Navbar