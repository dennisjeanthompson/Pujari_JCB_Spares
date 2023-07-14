import './login.css'
import axios from 'axios'
// import { Helmet } from 'react-helmet'
import React, { useState } from 'react'
import Snackbar from '@mui/material/Snackbar'
import { useNavigate } from 'react-router-dom'
import IconButton from '@mui/material/IconButton'
import CloseIcon from '@mui/icons-material/Close'


function Login() {
    var count = 0
    let navigate = useNavigate()
    let [open, setOpen] = useState(false)

    function emailValidate() {
        const email = document.getElementById('email')
        const emailError = document.getElementById('emailError')
        if (email.value === '') {
            emailError.innerText = '*Required'
        }
        else {
            emailError.innerText = ''
        }
    }

    function passwordValidate() {
        const password = document.getElementById('password')
        const passwordError = document.getElementById('passwordError')
        if (password.value === '') {
            passwordError.innerText = '*Required'
        }
        else {
            passwordError.innerText = ''
        }
    }

    function loginClick() {
        const email = document.getElementById('email')
        const emailError = document.getElementById('emailError')
        const password = document.getElementById('password')
        const passwordError = document.getElementById('passwordError')
        const emailPasswordError = document.getElementById('emailPasswordError')
        if (email.value === '') {
            emailError.innerText = '*Required'
        }
        else {
            emailError.innerText = ''
        }
        if (password.value === '') {
            passwordError.innerText = '*Required'
        }
        else {
            passwordError.innerText = ''
        }
        if (emailError.innerText === '' && passwordError.innerText === '') {
            axios.get(`https://pujari-jcb-spares-user.onrender.com/login/${email.value}/${password.value}`)
                .then((response) => {
                    if (response.data.message === "Login Successful") {
                        sessionStorage.setItem('userInfo', JSON.stringify(response.data.data[0]))
                        setOpen(true)
                        setTimeout(() => {
                            navigate('/home')
                        }, 2500);
                    }
                    else {
                        emailPasswordError.innerText = '*Invalid email address/password'
                        setTimeout(() => {
                            emailPasswordError.innerText = ''
                        }, 3000);
                    }
                })
                .catch((error) => {
                    console.log(error);
                })
        }
    }

    function showPasswordClick() {
        const password = document.getElementById('password')
        count++
        if (count % 2 === 0) {
            password.setAttribute('type', 'password')
        }
        else {
            password.removeAttribute('type')
        }
    }

    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setOpen(false);
    }

    const action = (
        <React.Fragment>
            <IconButton size="small" aria-label="close" color="inherit" onClick={handleClose}>
                <CloseIcon fontSize="small" />
            </IconButton>
        </React.Fragment>
    )
    return (
        <>
            {/* <Helmet>
                <title>Pujari JCB Spares | Login</title>
            </Helmet> */}
            <div className="shadow col-3 rounded position-absolute top-50 start-50 translate-middle p-4">
                <div>
                    <h4 className='text-center'>Login</h4>
                    <div>
                        <label htmlFor="email" className="form-label">Email address</label>
                        <input type="text" className="form-control" id="email" aria-describedby="emailHelp" autoComplete='off' onKeyUp={() => { emailValidate() }} />
                        <span id='emailError' className='text-danger'></span>
                    </div>
                    <div className='mt-3'>
                        <label htmlFor="password" className="form-label">Password</label>
                        <input type="password" className="form-control" id="password" aria-describedby="emailHelp" autoComplete='off' onKeyUp={() => { passwordValidate() }} />
                        <span id='passwordError' className='text-danger'></span>
                    </div>
                    <div className='text-center mt-3'>
                        <span id='emailPasswordError' className='text-danger'></span>
                    </div>
                    <div className='mt-2'>
                        <input className="form-check-input" type="checkbox" value="" id="flexCheckDefault" onClick={() => { showPasswordClick() }} /> Show password
                    </div>
                    <div className='text-center mt-3'>
                        <button type="button" className="btn btn-outline-primary" onClick={() => { loginClick() }}>Login</button>
                        <h6 className='mt-3 hoverText'>new user? <span className='text-primary' onClick={() => { navigate('/signup') }}>create account</span></h6>
                        <h6 className='mb-0 hoverText'>forgot password? <span className='text-primary' onClick={() => { navigate('/change-password') }}>click here</span></h6>
                    </div>
                    <div className='mt-3 text-center' >
                        <h6>Admin login credentials</h6>
                        <h6>Email address: admin@gmail.com</h6>
                        <h6>Password: admin</h6>
                    </div>
                </div>

            </div>



            {
                open ? <Snackbar open={open} autoHideDuration={3000} onClose={handleClose} message="Login successful" action={action} /> : ''
            }
        </>
    )
}

export default Login