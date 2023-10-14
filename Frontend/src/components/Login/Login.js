import './login.css'
import axios from 'axios'
import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
// import { GoogleLogin } from '@react-oauth/google';
// import jwtDecode from 'jwt-decode';
import Navbar from '../Navbar/Navbar'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function Login() {
    var count = 0
    let navigate = useNavigate()

    useEffect(() => {
        axios.get('https://pujari-jcb-spares-backend.onrender.com/products/allProducts')
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

    async function loginClick() {
        const email = document.getElementById('email')
        const emailError = document.getElementById('emailError')
        const password = document.getElementById('password')
        const passwordError = document.getElementById('passwordError')
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
            try {
                let res = await axios.get(`https://pujari-jcb-spares-backend.onrender.com/users/login?email=${email.value}&password=${password.value}`)
                if (res.status === 200) {
                    // console.log(res);
                    sessionStorage.setItem('userInfo', JSON.stringify(res.data.userData[0]))
                    sessionStorage.setItem('token', res.data.tokenData)
                    successToastMessage()
                    setTimeout(() => {
                        navigate('/home')
                    }, 3000)
                }
                else {
                    errorToastMessage()
                }
            }
            catch (error) {
                errorToastMessage()
            }
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

    function successToastMessage() {
        toast.success('Login successful', {
            position: "bottom-left",
            autoClose: 2000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
        });
    }

    function errorToastMessage() {
        toast.error('Invaid login credentials !', {
            position: "bottom-left",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
        });
    }

    return (
        <>
            <Navbar />
            <div className="loginMainDiv rounded shadow" >
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
                <div className='mt-2'>
                    <input className="form-check-input" type="checkbox" value="" id="flexCheckDefault" onClick={() => { showPasswordClick() }} /> Show password
                </div>
                <div className='text-center mt-2'>
                    <button type="button" className="btn btn-outline-primary" onClick={() => { loginClick() }}>Login</button>
                    {/* <div className="" style={{ width: 'fit-content', marginLeft: '60px', marginTop: '10px' }}>
                        <GoogleLogin onSuccess={response} onError={error} />
                    </div> */}
                    <h6 className='mt-3 hoverText'>new user? <span className='text-primary' onClick={() => { navigate('/signup') }}>create account</span></h6>
                    <h6 className='mb-0 hoverText'>forgot password? <span className='text-primary' onClick={() => { navigate('/change-password') }}>click here</span></h6>
                    <button className='btn btn-outline-primary btn-sm mt-3' onClick={() => navigate('/admin-login')}><i className="fa-solid fa-circle-user"></i> click here for admin login</button>
                </div>
                <div className='text-center mt-3 border rounded p-2'>
                    <span>Test login credentials</span><br />
                    <span>Email address: userone@gmail.com</span><br />
                    <span>Password: userone</span>
                </div>
            </div>
            <ToastContainer />
        </>
    )
}

export default Login