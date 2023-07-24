import axios from 'axios'
import Navbar from '../Navbar/Navbar'
import Snackbar from '@mui/material/Snackbar'
import React, { useEffect, useState } from 'react'
import IconButton from '@mui/material/IconButton'
import CloseIcon from '@mui/icons-material/Close'

function UserProfile() {
  var count = 0
  let [open, setOpen] = useState(false)
  let [message, setMessage] = useState("")
  let [allOrders, setAllOrders] = useState([])
  const userInfo = JSON.parse(sessionStorage.getItem('userInfo'))

  let userEmail = userInfo.email
  let orderStartDateTime = ''
  let orderEndDateTime = ''

  useEffect(() => {
    axios.get(`https://pujari-jcb-spares-order.onrender.com/getOrders/${userInfo.email}`)
      .then((response) => {
        setAllOrders(response.data)
      })
      .catch((error) => {
        console.log(error);
      })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

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

  async function findOrderClick() {
    const date = document.getElementById('date')
    if (date.value === '') {
      setMessage('Please select date')
      setOpen(true)
    }
    else {
      const testDate = '2023-07-11T18:30:00.000Z'
      orderStartDateTime = new Date(new Date(date.value).setHours(new Date(testDate).getHours(), new Date(testDate).getMinutes(), new Date(testDate).getSeconds(), 0)).toISOString();
      var endDate = new Date(new Date(date.value).setDate(new Date(date.value).getDate() + 1)).toISOString();
      orderEndDateTime = new Date(new Date(endDate).setHours(new Date(testDate).getHours(), new Date(testDate).getMinutes(), new Date(testDate).getSeconds(), 0)).toISOString();
      await axios.get(`https://pujari-jcb-spares-order.onrender.com?email=${userEmail}&startDateTime=${orderStartDateTime}&endDateTime=${orderEndDateTime}`)
        .then((res) => {
          setAllOrders(res.data)
        })
        .catch((error) => {
          console.log(error);
        })
    }
  }

  async function refreshClick() {
    await axios.get(`https://pujari-jcb-spares-order.onrender.com?email=${userEmail}&startDateTime=${orderStartDateTime}&endDateTime=${orderEndDateTime}`)
      .then((res) => {
        setAllOrders(res.data)
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

      {/* pending orders div start */}
      <div className='ms-5' style={{ marginTop: '80px', width: '70%' }} >
        <div className='row' style={{ width: '50%' }}>
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
        <div className='mt-3' style={{ width: '100%', height: '330px', overflowY: 'auto', position: 'sticky', top: 0 }}>
          <table id='pendingOrdersTable' className="table" style={{ borderCollapse: 'collapse' }}>
            <thead style={{ backgroundColor: '#a3a3a3', position: 'sticky', top: 0 }}>
              <tr className='text-black'>
                <th scope="col" style={{ position: 'sticky', top: 0 }}>Sr. No.</th>
                <th scope="col" style={{ position: 'sticky', top: 0 }}>Product Name</th>
                <th scope="col" style={{ position: 'sticky', top: 0 }}>Quantity</th>
                <th scope="col" style={{ position: 'sticky', top: 0 }}>Price</th>
                <th scope="col" style={{ position: 'sticky', top: 0 }}>Date</th>
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
                    <td>{new Date(e.date).toLocaleString()}</td>
                    <td>
                      <button type="button" id='sumbitbutton' className="btn btn-sm border-danger text-danger" onClick={() => { cancelOrderClick(e) }}>Cancel Order</button>
                    </td>
                  </tr>)
                }) : ""
              }
            </tbody>
          </table>
        </div>
      </div>
      {/* pending orders div end */}

      {/* delivered orders div start */}
      <div className='ms-5' style={{ marginTop: '70px', width: '70%' }}>
        <div className='row' style={{ width: '55%' }}>
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
        <div className='mt-3' style={{ width: '100%', height: '330px', overflowY: 'auto', position: 'sticky', top: 0 }}>
          <table className="table" style={{ borderCollapse: 'collapse' }}>
            <thead style={{ backgroundColor: '#a3a3a3', position: 'sticky', top: 0 }}>
              <tr className='text-black'>
                <th scope="col" style={{ position: 'sticky', top: 0 }}>Sr. No.</th>
                <th scope="col" style={{ position: 'sticky', top: 0 }}>Product Name</th>
                <th scope="col" style={{ position: 'sticky', top: 0 }}>Quantity</th>
                <th scope="col" style={{ position: 'sticky', top: 0 }}>Price</th>
                <th scope="col" style={{ position: 'sticky', top: 0 }}>Date</th>
              </tr>
            </thead>
            <tbody>
              {

              }
            </tbody>
          </table>
        </div>
      </div>
      {/* delivered orders div end */}
      {
        open ? <Snackbar open={open} autoHideDuration={3000} onClose={handleClose} message={message} action={action} /> : ''
      }
    </>
  )
}

export default UserProfile