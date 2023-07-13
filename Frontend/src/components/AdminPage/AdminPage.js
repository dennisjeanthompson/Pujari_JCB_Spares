import axios from 'axios'
import Navbar from '../Navbar/Navbar'
import { Helmet } from 'react-helmet'
import Snackbar from '@mui/material/Snackbar'
import IconButton from '@mui/material/IconButton'
import CloseIcon from '@mui/icons-material/Close'
import React, { useEffect, useState } from 'react'

function AdminPage() {
    let [users, setUsers] = useState([])
    let [open, setOpen] = useState(false)
    let [orders, setOrders] = useState([])
    let [message, setMessage] = useState("")

    useEffect(() => {
        axios.get('https://pujari-jcb-spares-user.onrender.com')
            .then((res) => {
                setUsers(res.data)
            })
            .catch((error) => {
                console.log(error);
            })

        axios.get('https://pujari-jcb-spares-order.onrender.com')
            .then((res) => {
                setOrders(res.data)
            })
            .catch((error) => {
                console.log(error);
            })
    }, [setUsers, setOrders])

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
                console.log(res);
                setMessage('Order successfully deleted')
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
            <Helmet>
                <title>Pujari JCB Spares | Admin</title>
            </Helmet>
            
            <Navbar myProfile={false} logout={true} home={true} />

            <div className="m-5">
                <div className=''>
                    <div>
                        <h4>All users</h4>
                    </div>
                    <div style={{ width: '70%' }}>
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
                                        return (<tr key={i}>
                                            <td>{i + 1}</td>
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

                <div className='mt-5'>
                    <div>
                        <h4>All orders</h4>
                    </div>
                    <div style={{ width: '100%' }}>
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