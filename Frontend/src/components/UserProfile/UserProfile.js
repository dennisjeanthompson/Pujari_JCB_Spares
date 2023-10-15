import axios from 'axios'
import Navbar from '../Navbar/Navbar'
import React, { useEffect, useState } from 'react'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';

function UserProfile() {
  var count = 0
  let navigate = useNavigate()
  let [allOrders, setAllOrders] = useState([])
  const userInfo = JSON.parse(sessionStorage.getItem('userInfo'))
  const token = JSON.parse(sessionStorage.getItem('token'))

  let userEmail = userInfo.email
  let orderStartDateTime = ''
  let orderEndDateTime = ''

  let auth = {
    headers: { Authorization: `Bearer ${token}` }
  }

  useEffect(() => {
    getOrders()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  async function getOrders() {
    try {
      let res = await axios.get(`https://pujari-jcb-spares-backend.onrender.com/orders/getOrders/${userInfo.email}`, auth)
      setAllOrders(res.data)
    }
    catch (error) {
      if (error.response) {
        if (error.response.status === 400) {
          infoToastMessage('No order data found !', 3000)
          setAllOrders([])
        }
        else if (error.response.status === 401) {
          errorToastMessage('Session expired. Please login again !', 3000)
          setTimeout(() => {
            navigate('/')
            sessionStorage.clear()
          }, 3500);
        }
      }
      else {
        errorToastMessage('Something went wrong. Please try again !', 3000)
      }
    }
  }

  // const pendingOrders = allOrders.length ? allOrders.filter((e) => e.delivered === false) : ''
  // const deliveredOrders = allOrders.length ? allOrders.filter((e) => e.delivered === true) : ''

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

  async function submitClick() {
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
      const newUserData = {
        name: name.value,
        email: email.value,
        password: password.value,
        securityCode: securityCode.value
      }
      try {
        await axios.put(`https://pujari-jcb-spares-backend.onrender.com/users/updateUser/${email.value}`, newUserData, auth)
        sessionStorage.setItem('userInfo', JSON.stringify(newUserData))
        successToastMessage('Profile successfully updated', 3000)
      }
      catch (error) {
        if (error.response) {
          if (error.response.status === 401) {
            errorToastMessage('Session expired. Please login again', 3000)
            setTimeout(() => {
              navigate('/')
              sessionStorage.clear()
            }, 3500);
          }
          else if (error.response.status === 400) {
            errorToastMessage('Failed to update profile !', 3000)
          }
        }
        else {
          errorToastMessage('Something went wrong. Please try again !', 3000)

        }
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

  async function cancelOrderClick(order) {
    let confirmation = window.confirm("Are you sure, you want to cancel this order")
    if (confirmation) {
      try {
        await axios.delete(`https://pujari-jcb-spares-backend.onrender.com/orders/cancleOrder/${order.orderId}`, auth)
        successToastMessage('Order successfully canceled', 3000)
        getOrders()
      }
      catch (error) {
        if (error.response) {
          if (error.response.status === 400) {
            errorToastMessage('Falied to cancel the order !', 3000)
          }
          else if (error.response.status === 401) {
            errorToastMessage('Session expired. Please login again !', 3000)
            setTimeout(() => {
              navigate('/')
              sessionStorage.clear()
            }, 3500);
          }
        }
        else {
          errorToastMessage('Something went wrong. Please try again !', 3000)
        }
      }
    }
  }

  async function findOrderClick() {
    const date = document.getElementById('date')
    if (date.value === '') {
      errorToastMessage('Please select date', 3000)
    }
    else {
      const testDate = '2023-07-11T18:30:00.000Z'
      orderStartDateTime = new Date(new Date(date.value).setHours(new Date(testDate).getHours(), new Date(testDate).getMinutes(), new Date(testDate).getSeconds(), 0)).toISOString();
      var endDate = new Date(new Date(date.value).setDate(new Date(date.value).getDate() + 1)).toISOString();
      orderEndDateTime = new Date(new Date(endDate).setHours(new Date(testDate).getHours(), new Date(testDate).getMinutes(), new Date(testDate).getSeconds(), 0)).toISOString();
      try {
        let res = await axios.get(`https://pujari-jcb-spares-backend.onrender.com/orders?email=${userEmail}&startDateTime=${orderStartDateTime}&endDateTime=${orderEndDateTime}`)
        setAllOrders(res.data)
      }
      catch (error) {
        if (error.response) {
          if (error.response.status === 400) {
            setAllOrders([])
            infoToastMessage('No order data found !', 3000)
          }
          else if (error.response.status === 401) {
            errorToastMessage('Session expired. Please login again !', 3000)
            setTimeout(() => {
              navigate('/')
              sessionStorage.clear()
            }, 3500);
          }
        }
        else {
          errorToastMessage('Something went wrong. Please try again !', 3000)
        }
      }
    }
  }

  async function refreshClick() {
    document.getElementById('date').value = ""
    getOrders()
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

  function infoToastMessage(message, time) {
    toast.info(message, {
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
            <input type="email" className="form-control" id="email" aria-describedby="emailHelp" defaultValue={userInfo.email} readOnly />
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

      {/* pending orders div start */}
      <div className='ms-5' style={{ marginTop: '80px', width: '80%' }} >
        <div className='row' style={{ width: '45%' }}>
          <div className='col'>
            <h4>Pending Orders</h4>
          </div>
          <div className="col" style={{ maxWidth: 'fit-content' }}>
            <input type="date" className='form-control' id="date" />
          </div>
          <div className="col" style={{ marginTop: '3px', maxWidth: 'fit-content' }} >
            <button type="button" id='sumbitbutton' className="btn btn-outline-primary btn-sm" onClick={() => { findOrderClick() }}>Search</button>
          </div>
          <div className="col" style={{ marginTop: '3px', maxWidth: 'fit-content' }}>
            <p className='btn btn-sm border border-primary' title='Refresh' style={{ color: 'green' }} onClick={() => { refreshClick() }}><i className="fa-solid fa-rotate fs-5"></i></p>
          </div>
        </div>
        <div className='mt-3 shadow rounded' style={{ width: '100%', height: '320px', overflowY: 'auto', position: 'sticky', top: 0 }}>
          <table id='pendingOrdersTable' className="table" style={{ borderCollapse: 'collapse' }}>
            <thead style={{ backgroundColor: '#a3a3a3', position: 'sticky', top: 0 }}>
              <tr className='text-black'>
                <th scope="col" style={{ position: 'sticky', top: 0 }}>Sr. No.</th>
                <th scope="col" style={{ position: 'sticky', top: 0 }}>Product Name</th>
                <th scope="col" style={{ position: 'sticky', top: 0 }}>Quantity</th>
                <th scope="col" style={{ position: 'sticky', top: 0 }}>Price</th>
                <th scope="col" style={{ position: 'sticky', top: 0 }}>Delivery charges</th>
                <th scope="col" style={{ position: 'sticky', top: 0 }}>Total amount</th>
                <th scope="col" style={{ position: 'sticky', top: 0 }}>Order date</th>
                <th scope="col" style={{ position: 'sticky', top: 0 }}>Expected delivery date</th>
                <th scope="col" style={{ position: 'sticky', top: 0 }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {
                allOrders.length ? allOrders.map((e, i) => {
                  return (<tr key={i}>
                    <td>{i + 1}</td>
                    <td>{e.name}</td>
                    <td>{e.quantity}</td>
                    <td>{e.price}</td>
                    <td>{e.deliveryCharges}</td>
                    <td>{e.totalAmount}</td>
                    <td>{new Date(e.date).toLocaleString()}</td>
                    <td>{new Date(new Date(e.date).setDate(new Date(e.date).getDate() + 5)).toLocaleDateString()}</td>
                    <td>
                      <button type="button" id='sumbitbutton' className="btn btn-sm btn-outline-danger" onClick={() => { cancelOrderClick(e) }}>Cancel Order</button>
                    </td>
                  </tr>)
                }) : <tr style={{ width: '100%', fontFamily: 'Arial' }}><td>No Data</td></tr>
              }
            </tbody>
          </table>
        </div>
      </div>
      {/* pending orders div end */}

      {/* delivered orders div start */}
      <div className='ms-5 mb-5' style={{ marginTop: '70px', width: '80%' }}>
        <div className='row' style={{ width: '45%' }}>
          <div className='col'>
            <h4>Delivered Orders</h4>
          </div>
          <div className="col" style={{ maxWidth: 'fit-content' }}>
            <input type="date" className='form-control' id="date" />
          </div>
          <div className="col" style={{ marginTop: '3px', maxWidth: 'fit-content' }} >
            <button type="button" id='sumbitbutton' className="btn btn-outline-primary btn-sm">Search</button>
          </div>
          <div className="col" style={{ marginTop: '3px', maxWidth: 'fit-content' }}>
            <p className='btn btn-sm border border-primary' title='Refresh' style={{ color: 'green' }}><i className="fa-solid fa-rotate fs-5"></i></p>
          </div>
        </div>
        <div className='mt-3 shadow rounded' style={{ width: '100%', height: '320px', overflowY: 'auto', position: 'sticky', top: 0 }}>
          <table className="table" style={{ borderCollapse: 'collapse' }}>
            <thead style={{ backgroundColor: '#a3a3a3', position: 'sticky', top: 0 }}>
              <tr className='text-black'>
                <th scope="col" style={{ position: 'sticky', top: 0 }}>Sr. No.</th>
                <th scope="col" style={{ position: 'sticky', top: 0 }}>Product Name</th>
                <th scope="col" style={{ position: 'sticky', top: 0 }}>Quantity</th>
                <th scope="col" style={{ position: 'sticky', top: 0 }}>Price</th>
                <th scope="col" style={{ position: 'sticky', top: 0 }}>Delivery charges</th>
                <th scope="col" style={{ position: 'sticky', top: 0 }}>Total amount</th>
                <th scope="col" style={{ position: 'sticky', top: 0 }}>Date</th>
              </tr>
            </thead>
            <tbody>
              {
                <tr style={{ width: '100%', fontFamily: 'Arial' }}><td>No Data</td></tr>
              }
            </tbody>
          </table>
        </div>
      </div>
      {/* delivered orders div end */}
      <ToastContainer />
    </>
  )
}

export default UserProfile