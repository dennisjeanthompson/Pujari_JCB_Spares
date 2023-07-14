import axios from 'axios'
import Navbar from '../Navbar/Navbar'
import { Helmet } from 'react-helmet'
import Snackbar from '@mui/material/Snackbar'
import React, { useState } from 'react'
import IconButton from '@mui/material/IconButton'
import CloseIcon from '@mui/icons-material/Close'

function UserProfile() {
  var count = 0
  let [open, setOpen] = useState(false)
  let [message, setMessage] = useState("")
  let [allOrders, setAllOrders] = useState([])
  const userInfo = JSON.parse(sessionStorage.getItem('userInfo'))

  axios.get(`https://pujari-jcb-spares-order.onrender.com/getOrders/${userInfo.email}`)
    .then((response) => {
      setAllOrders(response.data)
    })
    .catch((error) => {
      console.log(error);
    })

  function nameValidate() {
    const name = document.getElementById('name')
    const nameError = document.getElementById('nameError')
    if (name.value === '') {
      nameError.innerText = "*Required"
    }
    else {
      nameError.innerText = ''
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

  function submitClick() {
    const name = document.getElementById('name')
    const nameError = document.getElementById('nameError')
    const email = document.getElementById('email')
    const password = document.getElementById('password')
    const passwordError = document.getElementById('passwordError')
    const securityCode = document.getElementById('securityCode')
    const securityCodeError = document.getElementById('securityCodeError')

    if (name.value === '') {
      nameError.innerText = "*Required"
    }
    else {
      if (!isNaN(name.value)) {
        nameError.innerText = "*Invalid"
      }
      else {
        nameError.innerText = ''
      }
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
      if (securityCode.value.length < 5 || securityCode.value.length > 15) {
        securityCodeError.innerText = '*Security code should be between 5 to 15'
      }
      else {
        securityCodeError.innerText = ''
      }
    }
    if (nameError.innerText === '' && passwordError.innerText === '' && securityCodeError.innerText === '') {
      const newData = {
        name: name.value,
        email: email.value,
        password: password.value,
        securityCode: securityCode.value
      }
      axios.put(`https://pujari-jcb-spares-user.onrender.com/updateUser/${email.value}`, newData)
        .then((response) => {
          sessionStorage.setItem('userInfo', JSON.stringify(newData))
          setMessage("Profile successfully updated")
          setOpen(true)
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

  function cancelOrderClick(product) {
    axios.delete(`https://pujari-jcb-spares-order.onrender.com/cancleOrder/${product._id}`)
      .then((response) => {
        setMessage("Order canceled")
        setOpen(true)
      })
      .catch((error) => {
        console.log(error);
      })
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
        <title>Pujari JCB Spares | Profile</title>
      </Helmet> */}

      <Navbar myProfile={false} logout={true} home={true} />

      <div className="shadow col-3 rounded p-4 mt-5 ms-5">
        <div>
          <h4 className='text-center'>Profile</h4>
          <div>
            <label htmlFor="name" className="form-label">Name</label>
            <input type="text" className="form-control" id="name" aria-describedby="emailHelp" defaultValue={userInfo.name} onKeyUp={() => { nameValidate() }} />
            <span id='nameError' className='text-danger'></span>
          </div>
          <div className='mt-3'>
            <label htmlFor="email" className="form-label">Email address</label>
            <input type="email" className="form-control" id="email" aria-describedby="emailHelp" defaultValue={userInfo.email} />
            <span id='emailError' className='text-danger'></span>
          </div>
          <div className='mt-3'>
            <label htmlFor="password" className="form-label">Password</label>
            <input type="password" className="form-control" id="password" aria-describedby="emailHelp" defaultValue={userInfo.password} onKeyUp={() => { passwordValidate() }} />
            <span id='passwordError' className='text-danger'></span>
          </div>
          <div className='mt-3'>
            <label htmlFor="securityCode" className="form-label">Account security code</label>
            <input type="password" className="form-control" id="securityCode" aria-describedby="emailHelp" defaultValue={userInfo.securityCode} onKeyUp={() => { securityCodeValidate() }} />
            <span id='securityCodeError' className='text-danger'></span>
          </div>
          <div className='text-center mt-3'>
            <span id='emailSecurityCodeError' className='text-danger'></span>
          </div>
          <div className='mt-2'>
            <input className="form-check-input" type="checkbox" value="" id="flexCheckDefault" onClick={() => { showPasswordClick() }} /> Show password & security code
          </div>
          <div className='text-center mt-4'>
            <button type="button" id='sumbitbutton' className="btn btn-outline-success ms-3" onClick={() => { submitClick() }}><i className="fa-solid fa-check"></i> Submit</button>
          </div>
        </div>
      </div>

      <div className="m-5">
        <div className='mt-2'>
          <h4>Your orders</h4>
        </div>
        <div className=' mt-3' style={{ width: '70%' }}>
          <table className="table">
            <thead>
              <tr>
                <th scope="col">Sr. No.</th>
                <th scope="col">Product Name</th>
                <th scope="col">Quantity</th>
                <th scope="col">Price</th>
                <th scope="col">Payment Mode</th>
                <th scope="col">Date</th>
                <th scope="col">Action</th>
              </tr>
            </thead>
            <tbody>
              {
                allOrders.length ? allOrders.map((e, i) => {
                  return (
                    <tr key={i}>
                      <th>{i + 1}</th>
                      <td>{e.name}</td>
                      <td>{e.quantity}</td>
                      <td>{e.price}</td>
                      <td>{e.paymentMode}</td>
                      <td>{new Date(e.date).toLocaleString()}</td>
                      <td>
                        <button type="button" id='sumbitbutton' className="btn btn-sm border-danger text-danger" onClick={() => { cancelOrderClick(e) }}>cancel order</button>
                      </td>
                    </tr>
                  )
                }) : ''
              }
            </tbody>
          </table>
        </div>
      </div>
      {
        open ? <Snackbar open={open} autoHideDuration={3000} onClose={handleClose} message={message} action={action} /> : ''
      }
    </>
  )
}

export default UserProfile