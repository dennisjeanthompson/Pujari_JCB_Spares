import React from 'react'
import Navbar from '../Navbar/Navbar'
import './adminLogin.css'
import { useNavigate } from 'react-router-dom'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function AdminLogin() {
  let count = 0;
  let navigate = useNavigate();

  function adminPasswordValidate() {
    const password = document.getElementById('password')
    const passwordError = document.getElementById('passwordError')
    if (password.value === "") {
      passwordError.innerText = "*Required"
    }
    else {
      passwordError.innerText = ''
    }
  }

  function loginAdminClick() {
    const password = document.getElementById('password')
    const passwordError = document.getElementById('passwordError')
    if (password.value === "") {
      passwordError.innerText = "*Required"
    }
    else {
      if (password.value === "admin@123") {
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
        setTimeout(() => {
          navigate('/admin-profile')
        }, 3000)
      }
      else {
        passwordError.innerText = "*Invalid"
      }
    }
  }

  function showPasswordClick() {
    const password = document.getElementById('password');
    count++;
    if (count % 2 === 0) {
      password.setAttribute('type', 'password')
    }
    else {
      password.removeAttribute('type')
    }
  }
  return (
    <>
      <Navbar />
      <div className='adminLoginMainDiv shadow rounded p-3'>

        <div className=''>
          <label htmlFor="password" className="form-label">Password</label>
          <input type="password" className="form-control" id="password" aria-describedby="emailHelp" autoComplete='off' onKeyUp={() => adminPasswordValidate()} />
          <span id='passwordError' className='text-danger'></span>
        </div>
        <div className='mt-2'>
          <input className="form-check-input" type="checkbox" value="" id="flexCheckDefault" onClick={() => showPasswordClick()} /> Show password
        </div>
        <div className="text-center mt-2">
          <button className='btn btn-outline-primary btn-sm mt-2' onClick={() => loginAdminClick()}>Login as Admin</button>
        </div>
        <div className="text-center mt-2">
          <span>Password: admin@123</span>
        </div>
        <div className="text-center text-primary m-2">
          <h6 className='m-0 backToLogin' onClick={() => navigate('/')}>back to login</h6>
        </div>
      </div>
      <ToastContainer />
    </>
  )
}

export default AdminLogin