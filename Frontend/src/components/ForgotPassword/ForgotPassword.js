import React from 'react'
import axios from 'axios'
import './forgotPassword.css'
import { useNavigate } from 'react-router-dom'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function ForgotPassword() {
    var count = 0
    let navigate = useNavigate()

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

    async function changePasswordClick() {
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
            try {
                let res = await axios.put(`https://pujari-jcb-spares-backend.onrender.com/users/changePassword/${email.value}/${securityCode.value}`, newPassword)
                if (res.status === 200) {
                    successToastMessage('Password successfully changed', 2500)
                    setTimeout(() => {
                        navigate('/')
                    }, 3500);
                }
                else {
                    errorToastMessage('Invalid email address/security code', 3000)
                    // document.getElementById('emailSecurityCodeError').innerText = '*Invalid email address/security code'
                    // setTimeout(() => {
                    //     document.getElementById('emailSecurityCodeError').innerText = ''
                    // }, 3000);
                }
            }
            catch (error) {
                // console.log(error);
                errorToastMessage('Invalid email address/security code', 3000)
                // document.getElementById('emailSecurityCodeError').innerText = '*Invalid email address/security code'
                // setTimeout(() => {
                //     document.getElementById('emailSecurityCodeError').innerText = ''
                // }, 3000);
            }
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

    function successToastMessage(message, time) {
        toast.success(message, {
            position: "bottom-left",
            autoClose: time,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
        });
    }

    function errorToastMessage(message, time) {
        toast.error(message, {
            position: "bottom-left",
            autoClose: time,
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
            <ToastContainer />
        </>
    )
}

export default ForgotPassword