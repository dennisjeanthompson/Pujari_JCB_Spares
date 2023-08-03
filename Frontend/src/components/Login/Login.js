import './login.css'
import axios from 'axios'
import React, { useEffect, useState } from 'react'
import Snackbar from '@mui/material/Snackbar'
import { useNavigate } from 'react-router-dom'
import IconButton from '@mui/material/IconButton'
import CloseIcon from '@mui/icons-material/Close'
import { GoogleLogin } from '@react-oauth/google';
import jwtDecode from 'jwt-decode';
import Navbar from '../Navbar/Navbar'

function Login() {
    var count = 0
    let navigate = useNavigate()
    let [open, setOpen] = useState(false)

    useEffect(() => {
        axios.get('https://pujari-jcb-spares-order.onrender.com/getAllProducts')
            .then((response) => {
                sessionStorage.setItem('allProducts', JSON.stringify(response.data))
            })
            .catch((error) => {
                console.log(error);
            })
    }, [])


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
            axios.get(`https://pujari-jcb-spares-user.onrender.com/login?email=${email.value}&password=${password.value}`)
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

    const response = async (res) => {
        const emailPasswordError = document.getElementById('emailPasswordError')
        let userObject = jwtDecode(res.credential);

        await axios.get(`https://pujari-jcb-spares-user.onrender.com/login?email=${userObject.email}`)
            .then((res) => {
                if (res.data.message === "Login Successful") {
                    sessionStorage.setItem('userInfo', JSON.stringify(res.data.data[0]))
                    setOpen(true)
                    setTimeout(() => {
                        navigate('/home')
                    }, 2500);
                }
                else {
                    emailPasswordError.innerText = '*Email address not exist'
                    setTimeout(() => {
                        emailPasswordError.innerText = ''
                    }, 3000);
                }
            })
            .catch((error) => {
                console.log(error);
            })
    }

    const error = (error) => {
        console.log(error)
    }
    return (
        <>
            <Navbar />
            <div className="position-absolute top-50 start-50 translate-middle rounded shadow p-4 col-3" >
                <h4 className='text-center'>Login</h4>
                <div>
                    <label htmlFor="email" className="form-label">Email address</label>
                    <input type="text" className="form-control" id="email" aria-describedby="emailHelp" autoComplete='off' onKeyUp={() => { emailValidate() }} />
                    <span id='emailError' className='text-danger'></span>
                </div>
                <div className='mt-2'>
                    <label htmlFor="password" className="form-label">Password</label>
                    <input type="password" className="form-control" id="password" aria-describedby="emailHelp" autoComplete='off' onKeyUp={() => { passwordValidate() }} />
                    <span id='passwordError' className='text-danger'></span>
                </div>
                <div className='text-center mt-2'>
                    <span id='emailPasswordError' className='text-danger'></span>
                </div>
                <div className='mt-2'>
                    <input className="form-check-input" type="checkbox" value="" id="flexCheckDefault" onClick={() => { showPasswordClick() }} /> Show password
                </div>
                <div className='text-center mt-2'>
                    <button type="button" className="btn btn-outline-primary" onClick={() => { loginClick() }}>Login</button>
                    <div className="" style={{ width: 'fit-content', marginLeft: '60px', marginTop: '10px' }}>
                        <GoogleLogin onSuccess={response} onError={error} />
                    </div>
                    <h6 className='mt-3 hoverText'>new user? <span className='text-primary' onClick={() => { navigate('/signup') }}>create account</span></h6>
                    <h6 className='mb-0 hoverText'>forgot password? <span className='text-primary' onClick={() => { navigate('/change-password') }}>click here</span></h6>
                    <button className='btn btn-outline-primary btn-sm mt-3' onClick={() => navigate('/admin-login')}><i className="fa-solid fa-circle-user"></i> click here for admin login</button>
                </div>

            </div>
            {
                open ? <Snackbar open={open} autoHideDuration={3000} onClose={handleClose} message="Login successful" action={action} /> : ''
            }
        </>
    )
}

export default Login