import React, { useState } from 'react'
import axios from 'axios'
import './forgotPassword.css'
import { Helmet } from 'react-helmet'
import Snackbar from '@mui/material/Snackbar'
import { useNavigate } from 'react-router-dom'
import IconButton from '@mui/material/IconButton'
import CloseIcon from '@mui/icons-material/Close'

function ForgotPassword() {
    var count = 0
    let navigate = useNavigate()
    let [open, setOpen] = useState(false)

    function emailValidate() {
        const email = document.getElementById('email')
        const emailError = document.getElementById('emailError')
        if (email.value === '') {
            emailError.innerText = "*Required"
        }
        else {
            emailError.innerText = ''
        }
    }

    function securityCodeValidate() {
        const securityCode = document.getElementById('securityCode')
        const securityCodeError = document.getElementById('securityCodeError')
        if (securityCode.value === '') {
            securityCodeError.innerText = "*Required"
        }
        else {
            securityCodeError.innerText = ''

        }
    }

    function passwordValidate() {
        const password = document.getElementById('password')
        const passwordError = document.getElementById('passwordError')
        if (password.value === '') {
            passwordError.innerText = "*Required"
        }
        else {
            passwordError.innerText = ''
        }
    }

    function changePasswordClick() {
        const email = document.getElementById('email')
        const emailError = document.getElementById('emailError')
        const securityCode = document.getElementById('securityCode')
        const securityCodeError = document.getElementById('securityCodeError')
        const password = document.getElementById('password')
        const passwordError = document.getElementById('passwordError')

        if (email.value === '') {
            emailError.innerText = "*Required"
        }
        else {
            emailError.innerText = ''
        }
        if (password.value === '') {
            passwordError.innerText = "*Required"
        }
        else {
            if (password.value.length < 5 || password.value.length > 15) {
                passwordError.innerText = '*Password length should be between 5 to 15'
            }
            else {
                passwordError.innerText = ''
            }
        }
        if (securityCode.value === '') {
            securityCodeError.innerText = "*Required"
        }
        else {
            if (securityCode.value === '') {
                securityCodeError.innerText = '*Required'
            }
            else {
                securityCodeError.innerText = ''
            }
        }
        if (emailError.innerText === '' && passwordError.innerText === '' && securityCodeError.innerText === '') {
            const newPassword = {
                password: password.value
            }
            axios.put(`https://pujari-jcb-spares-user.onrender.com/changePassword/${email.value}/${securityCode.value}`, newPassword)
                .then((response) => {
                    if (response.data.message === "Invalid credentials") {
                        document.getElementById('emailSecurityCodeError').innerText = '*Invalid email address/security code'
                        setTimeout(() => {
                            document.getElementById('emailSecurityCodeError').innerText = ''
                        }, 3000);
                    }
                    else {
                        setOpen(true)
                        setTimeout(() => {
                            navigate('/')
                        }, 2500);
                    }
                })
                .catch((error) => {
                    console.log(error);
                })
        }
    }

    function showPasswordClick() {
        const password = document.getElementById('password')
        const securityCode = document.getElementById('securityCode')
        count++
        if (count % 2 === 0) {
            password.setAttribute('type', 'password')
            securityCode.setAttribute('type', 'password')
        }
        else {
            password.removeAttribute('type')
            securityCode.removeAttribute('type')
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
                <title>Pujari JCB Spares | Change Password</title>
            </Helmet> */}
            <div className="shadow col-3 rounded position-absolute top-50 start-50 translate-middle p-4">
                <div>
                    <h4 className='text-center'>Password Reset</h4>
                    <div className='mt-3'>
                        <label htmlFor="email" className="form-label">Email address</label>
                        <input type="text" className="form-control" id="email" aria-describedby="emailHelp" autoComplete='off' onKeyUp={() => { emailValidate() }} />
                        <span id='emailError' className='text-danger'></span>
                    </div>
                    <div className='mt-3'>
                        <label htmlFor="securityCode" className="form-label">Account Security Code</label>
                        <input type="password" className="form-control" id="securityCode" aria-describedby="emailHelp" autoComplete='off' onKeyUp={() => { securityCodeValidate() }} />
                        <span id='securityCodeError' className='text-danger'></span>
                    </div>
                    <div className='mt-3'>
                        <label htmlFor="password" className="form-label">New Password</label>
                        <input type="password" className="form-control" id="password" aria-describedby="emailHelp" autoComplete='off' onKeyUp={() => { passwordValidate() }} />
                        <span id='passwordError' className='text-danger'></span>
                    </div>
                    <div className="text-center mt-3">
                        <span id='emailSecurityCodeError' className='text-danger'></span>
                    </div>
                    <div className='mt-2'>
                        <input className="form-check-input" type="checkbox" value="" id="flexCheckDefault" onClick={() => { showPasswordClick() }} /> Show password & security code
                    </div>
                    <div className='text-center mt-4'>
                        <button type="button" className="btn btn-outline-primary" onClick={() => { changePasswordClick() }}>Change Password</button>
                        <h6 className='mt-3 mb-0 text-primary hoverText' onClick={() => { navigate('/') }}>back to login</h6>
                    </div>
                </div>
            </div>
            {
                open ? <Snackbar open={open} autoHideDuration={3000} onClose={handleClose} message="Password successfully updated" action={action} /> : ''
            }
        </>
    )
}

export default ForgotPassword