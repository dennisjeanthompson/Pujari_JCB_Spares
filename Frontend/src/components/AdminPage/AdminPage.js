import axios from 'axios'
import Navbar from '../Navbar/Navbar'
import { Helmet } from 'react-helmet'
import Snackbar from '@mui/material/Snackbar'
import IconButton from '@mui/material/IconButton'
import CloseIcon from '@mui/icons-material/Close'
import React, { useState } from 'react'

function AdminPage() {
    let [users, setUsers] = useState([])
    // let [userData, setUserData] = useState([])
    let [open, setOpen] = useState(false)
    let [orders, setOrders] = useState([])
    let [message, setMessage] = useState("")

    var userEmail = ''
    var productName = ''

    // setTimeout(() => {
    axios.get('https://pujari-jcb-spares-user.onrender.com')
        .then((res) => {
            // setUserData(res.data)
            setUsers(res.data)
            // console.log('called');
        })
        .catch((error) => {
            console.log(error);
        })
    // });



    axios.get(`https://pujari-jcb-spares-order.onrender.com?email=${userEmail}&productName=${productName}`)
        .then((res) => {
            setOrders(res.data)
        })
        .catch((error) => {
            console.log(error);
        })

    function deleteUserClick(e) {
        axios.delete(`https://pujari-jcb-spares-user.onrender.com/deleteUser/${e.email}`)
            .then((res) => {
                console.log(res);
                setMessage('User successfully deleted')
                setOpen(true)
            })
            .catch((error) => {
                console.log(error);
            })
    }

    function deleteOrderClick(e) {
        axios.delete(`https://pujari-jcb-spares-order.onrender.com/cancleOrder/${e._id}`)
            .then((res) => {
                setMessage('Order successfully deleted')
                setOpen(true)
            })
            .catch((error) => {
                console.log(error);
            })
    }

    // async function findUserClick() {
    //     const userSelect = document.getElementById('userSelect')
    //     const userSelectError = document.getElementById('userSelectError')

    //     if (userSelect.value === 'Choose...' || userSelect.value === 'allUsers') {
    //         await axios.get('https://pujari-jcb-spares-user.onrender.com')
    //             .then((res) => {
    //                 setUsers(res.data)
    //             })
    //             .catch((error) => {
    //                 console.log(error);
    //             })
    //     }
    //     else {
    //         userSelectError.innerText = ''
    //         let userEmail = userData.length ? userData.filter((e) => e.name === userSelect.value) : ''
    //         await axios.get(`https://pujari-jcb-spares-user.onrender.com?email=${userEmail[0].email}`)
    //             .then((res) => {
    //                 setUsers(res.data);
    //             })
    //             .catch((error) => {
    //                 console.log(error);
    //             })
    //     }
    // }

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
            <Helmet>
                <title>Pujari JCB Spares | Admin</title>
            </Helmet>
            <Navbar myProfile={false} logout={true} home={true} />
            <div className="m-5">
                <div className=''>
                    <div>
                        <h4>All users</h4>
                    </div>
                    {/* <div className='row' style={{ width: '30%' }}>
                        <div className="col" >
                            <label htmlFor="email" className="form-label">User Name</label>
                            <select className="form-select" id="userSelect">
                                <option defaultValue>Choose...</option>
                                {
                                    users.length ? users.map((e, i) => {
                                        return (<option key={i} hidden={e.email === "admin@gmail.com"} value={e.name}>{e.name}</option>
                                        )
                                    }) : ''
                                }
                                <option value='allUsers'>All Users</option>
                            </select>
                            <span id='userSelectError' className='text-danger'></span>
                        </div>
                        <div className='col'>
                            <button type="button" id='sumbitbutton' className="btn btn-sm border-primary text-primary" style={{ marginTop: '35px' }}>Find User</button>
                        </div>
                    </div> */}
                    <div className='mt-3' style={{ width: '70%' }}>
                        <table className="table">
                            <thead>
                                <tr>
                                    <th scope="col">Sr. No.</th>
                                    <th scope="col">Name</th>
                                    <th scope="col">Email address</th>
                                    <th scope="col">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    users.length ? users.map((e, i) => {
                                        return (<tr hidden={e.name === "Admin"} key={i}>
                                            <td>{i}</td>
                                            <td>{e.name}</td>
                                            <td>{e.email}</td>
                                            <td>
                                                <button type="button" id='sumbitbutton' className="btn btn-sm border-danger text-danger" onClick={() => { deleteUserClick(e) }}>Delete User</button>
                                            </td>
                                        </tr>)
                                    }) : ''
                                }
                            </tbody>
                        </table>
                    </div>
                </div>

                <div style={{ marginTop: '80px' }}>
                    <div className='row' style={{ width: '70%' }}>
                        <div className='col'>
                            <h4>All orders</h4>
                        </div>
                        {/* <div className="col" >
                            <select className="form-select" id="">
                                <option defaultValue>User name</option>
                                {
                                    users.length ? users.map((e, i) => {
                                        return (<option key={i} hidden={e.email === "admin@gmail.com"} value={e.name}>{e.name}</option>
                                        )
                                    }) : ''
                                }
                                <option value='allUsers'>All Users</option>
                            </select>
                            <span id='' className='text-danger'></span>
                        </div>
                        <div className="col" >
                            <select className="form-select" id="">
                                <option defaultValue>Product name</option>
                                {
                                    users.length ? users.map((e, i) => {
                                        return (<option key={i} hidden={e.email === "admin@gmail.com"} value={e.name}>{e.name}</option>
                                        )
                                    }) : ''
                                }
                                <option value='allUsers'>All Users</option>
                            </select>
                            <span id='' className='text-danger'></span>
                        </div>
                        <div className="col" >
                            <input type="date" className='form-control' name="" id="date" />
                        </div>
                        <div className="col" style={{marginTop:'3px'}}>
                            <button type="button" id='sumbitbutton' className="btn btn-sm border-primary text-primary" onClick={()=>{
                                console.log(new Date(document.getElementById('date').value).toISOString())
                            }}>Find Order</button>

                        </div> */}
                    </div>
                    <div className='mt-3' style={{ width: '100%' }}>
                        <table className="table">
                            <thead>
                                <tr>
                                    <th scope="col">Sr. No.</th>
                                    <th scope="col">User name</th>
                                    <th scope="col">Product Name</th>
                                    <th scope="col">Quantity</th>
                                    <th scope="col">Address</th>
                                    <th scope="col">Price</th>
                                    <th scope="col">Payment Mode</th>
                                    <th scope="col">Date</th>
                                    <th scope="col">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    orders.length ? orders.map((e, i) => {
                                        return (<tr key={i}>
                                            <td>{i + 1}</td>
                                            <td>{e.userName}</td>
                                            <td>{e.name}</td>
                                            <td>{e.quantity}</td>
                                            <td>{e.address}</td>
                                            <td>{e.price}</td>
                                            <td>{e.paymentMode}</td>
                                            <td>{new Date(e.date).toLocaleString()}</td>
                                            <td>
                                                <button type="button" id='sumbitbutton' className="btn btn-sm border-danger text-danger" onClick={() => { deleteOrderClick(e) }}>Delete Order</button>
                                            </td>
                                        </tr>)
                                    }) : ''
                                }
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
            {
                open ? <Snackbar open={open} autoHideDuration={3000} onClose={handleClose} message={message} action={action} /> : ''
            }
        </>
    )
}

export default AdminPage
