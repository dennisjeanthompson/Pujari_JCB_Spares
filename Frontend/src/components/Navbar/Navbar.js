import './navbar.css'
import React from 'react'
import { useNavigate } from 'react-router-dom'

function Navbar(props) {
    let navigate = useNavigate()
    const userInfo = JSON.parse(sessionStorage.getItem('userInfo'))

    function logoutClick() {
        sessionStorage.clear()
        navigate('/')
    }

    function myProfileClick() {
        if (userInfo.email === "admin@gmail.com") {
            navigate('/admin')
        }
        else {
            navigate('/profile')
        }
    }
    return (
        <>
            <nav className="shadow navbar navbar-expand-lg bg-light sticky-top" style={{ position: 'sticky' }}>
                <div className="container-fluid">
                    <span className="navbar-brand" style={{ letterSpacing: '3px' }}>PUJARI JCB SPARES</span>
                    <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className="collapse navbar-collapse" id="navbarSupportedContent">
                        <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                            {
                                props.home ? <li className="nav-item">
                                    <span className="nav-link active navItems" aria-current="page" onClick={() => { navigate('/home') }}>Home</span>
                                </li> : ''
                            }
                            {
                                props.myProfile ? <li className="nav-item">
                                    <span className="nav-link active navItems" onClick={() => { myProfileClick() }}>My Profile</span>
                                </li> : ''
                            }
                            {
                                props.logout ? <li className="nav-item">
                                    <span className="nav-link active navItems" onClick={() => { logoutClick() }}>Logout</span>
                                </li> : ''
                            }
                        </ul>
                    </div>
                </div>
            </nav>
        </>
    )
}

export default Navbar