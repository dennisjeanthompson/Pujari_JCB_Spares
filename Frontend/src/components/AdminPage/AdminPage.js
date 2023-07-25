import axios from 'axios'
import Navbar from '../Navbar/Navbar'
import Snackbar from '@mui/material/Snackbar'
import IconButton from '@mui/material/IconButton'
import CloseIcon from '@mui/icons-material/Close'
import React, { useState } from 'react'
import { useEffect } from 'react'
import * as XLSX from 'xlsx'
import './adminPage.css'

function AdminPage() {
    let [userNames, setUserNames] = useState([])
    let [userData, setUserData] = useState([])
    let [open, setOpen] = useState(false)
    let [product, setProduct] = useState([])
    let [orders, setOrders] = useState([])
    let [allProducts, setAllProducts] = useState([])
    let [message, setMessage] = useState("")

    let userEmail = ''
    let orderStartDateTime = ''
    let orderEndDateTime = ''

    // let pendingOrders = orders.length ? orders.filter((e) => e.delivered === false) : ''
    // let deliveredOrders = orders.length ? orders.filter((e) => e.delivered === true) : ''

    useEffect(() => {
        // all users data
        axios.get('https://pujari-jcb-spares-user.onrender.com')
            .then((res) => {
                setUserNames(res.data)
                setUserData(res.data)
            })
            .catch((error) => {
                console.log(error);
            })

        // all orders data
        axios.get(`https://pujari-jcb-spares-order.onrender.com?email=${userEmail}&startDateTime=${orderStartDateTime}&endDateTime=${orderEndDateTime}`)
            .then((res) => {
                setOrders(res.data)
            })
            .catch((error) => {
                console.log(error);
            })

        axios.get('https://pujari-jcb-spares-order.onrender.com/getAllProducts')
            .then((response) => {
                setAllProducts(response.data)
            })
            .catch((error) => {
                console.log(error);
            })
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    function deleteUserClick(e) {
        axios.delete(`https://pujari-jcb-spares-user.onrender.com/deleteUser/${e.email}`)
            .then((res) => {
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

                axios.get(`https://pujari-jcb-spares-order.onrender.com?email=${userEmail}&startDateTime=${orderStartDateTime}&endDateTime=${orderEndDateTime}`)
                    .then((res) => {
                        setOrders(res.data)
                    })
                    .catch((error) => {
                        console.log(error);
                    })
            })
            .catch((error) => {
                console.log(error);
            })
    }

    async function findUserClick() {
        const userSelect = document.getElementById('userSelect')

        if (userSelect.value === 'User name') {
            setMessage('Please select user name')
            setOpen(true)
        }
        else {
            let userInfo = userNames.length ? userNames.filter((e) => e._id === userSelect.value) : ''
            await axios.get(`https://pujari-jcb-spares-user.onrender.com?email=${userInfo[0].email}`)
                .then((res) => {
                    setUserData(res.data);
                })
                .catch((error) => {
                    console.log(error);
                })
        }
    }

    async function refreshUsersClick() {
        let userSelectEmail = ''
        document.getElementById('userSelect').value = 'User name'
        await axios.get(`https://pujari-jcb-spares-user.onrender.com?email=${userSelectEmail}`)
            .then((res) => {
                setUserData(res.data)
            })
            .catch((error) => {
                console.log(error);
            })
    }

    async function findOrderClick() {
        const userName = document.getElementById('userName')
        const date = document.getElementById('date')

        if (userName.value === 'User name' && date.value === '') {
            setMessage('Please select user name or date')
            setOpen(true)
        }
        else {
            if (date.value !== '') {
                const testDate = '2023-07-11T18:30:00.000Z'
                var startDateTime = new Date(new Date(date.value).setHours(new Date(testDate).getHours(), new Date(testDate).getMinutes(), new Date(testDate).getSeconds(), 0)).toISOString();
                var endDate = new Date(new Date(date.value).setDate(new Date(date.value).getDate() + 1)).toISOString();
                var endDateTime = new Date(new Date(endDate).setHours(new Date(testDate).getHours(), new Date(testDate).getMinutes(), new Date(testDate).getSeconds(), 0)).toISOString();
                console.log(startDateTime);
                console.log(endDateTime);
            }
            // for user
            if (userName.value !== 'User name' && date.value === '') {
                let userInfo = userNames.length ? userNames.filter((e) => e._id === userName.value) : ''
                // console.log(userInfo);
                userEmail = userInfo[0].email
                orderStartDateTime = ''
                orderEndDateTime = ''
            }

            // for date
            else if (userName.value === 'User name' && date.value !== '') {
                userEmail = ''
                orderStartDateTime = startDateTime
                orderEndDateTime = endDateTime
            }
            else if (userName.value !== 'User name' && date.value !== '') {
                let userInfo = userNames.length ? userNames.filter((e) => e._id === userName.value) : ''
                // console.log(userInfo);
                userEmail = userInfo[0].email
                orderStartDateTime = startDateTime
                orderEndDateTime = endDateTime
            }
            await axios.get(`https://pujari-jcb-spares-order.onrender.com?email=${userEmail}&startDateTime=${orderStartDateTime}&endDateTime=${orderEndDateTime}`)
                .then((res) => {
                    setOrders(res.data)
                    // console.log(res.data);
                })
                .catch((error) => {
                    console.log(error);
                })
        }

    }

    async function refreshOrdersClick() {
        userEmail = ''
        orderStartDateTime = ''
        orderEndDateTime = ''
        document.getElementById('userName').value = 'User name'
        document.getElementById('date').value = ''
        await axios.get(`https://pujari-jcb-spares-order.onrender.com?email=${userEmail}&startDateTime=${orderStartDateTime}&endDateTime=${orderEndDateTime}`)
            .then((res) => {
                setOrders(res.data)
            })
            .catch((error) => {
                // console.log(error);
            })
    }

    // Excel Sheet Download
    function downloadExcelSheet(tableId, sheetText) {
        // Acquire Data (reference to the HTML table)
        var table_elt = document.getElementById(`${tableId}`);

        // Extract Data (create a workbook object from the table)
        var workbook = XLSX.utils.table_to_book(table_elt);

        // Process Data (add a new row)
        var ws = workbook.Sheets["Sheet1"];

        XLSX.utils.sheet_add_aoa(ws, [[]], { origin: -1 });
        XLSX.utils.sheet_add_aoa(ws, [["Created " + new Date().toLocaleString()]], { origin: -1 });

        // Package and Release Data (`writeFile` tries to write and save an XLSB file)
        XLSX.writeFile(workbook, `${sheetText}.xlsx`);
    }

    function refreshAllProducts() {
        axios.get('https://pujari-jcb-spares-order.onrender.com/getAllProducts')
            .then((response) => {
                setAllProducts(response.data)
            })
            .catch((error) => {
                console.log(error);
            })
    }

    function editProductClick(product) {
        setProduct(product)
    }

    function deleteProductClick() {
        console.log('deleteProductClick');
    }

    function deliveryChargesValidate() {
        const deliveryCharges = document.getElementById('deliveryCharges')
        const deliveryChargesError = document.getElementById('deliveryChargesError')
        if (deliveryCharges.value === '') {
            deliveryChargesError.innerText = "*Required"
        }
        else {
            if (deliveryCharges.value < 1) {
                deliveryChargesError.innerText = "*Invalid"
            }
            else {
                deliveryChargesError.innerText = ""
            }
        }
    }

    function priceValidate() {
        const price = document.getElementById('price')
        const priceError = document.getElementById('priceError')
        if (price.value === '') {
            priceError.innerText = "*Required"
        }
        else {
            if (price.value < 1) {
                priceError.innerText = "*Invalid"
            }
            else {
                priceError.innerText = ""
            }
        }
    }

    async function saveChangesClick() {
        const price = document.getElementById('price')
        const priceError = document.getElementById('priceError')
        const deliveryCharges = document.getElementById('deliveryCharges')
        const deliveryChargesError = document.getElementById('deliveryChargesError')
        if (price.value === '') {
            priceError.innerText = "*Required"
        }
        else {
            if (price.value < 1) {
                priceError.innerText = "*Invalid"
            }
            else {
                priceError.innerText = ''
            }
        }
        if (deliveryCharges.value === '') {
            deliveryChargesError.innerText = "*Required"
        }
        else {
            if (deliveryCharges.value < 1) {
                deliveryChargesError.innerText = "*Invalid"
            }
            else {
                deliveryChargesError.innerText = ""
            }
        }
        if (priceError.innerText === '' && deliveryChargesError.innerText === "") {
            const productInfo = {
                productPrice: price.value,
                productDeliveryCharges: deliveryCharges.value
            }
            await axios.put(`https://pujari-jcb-spares-order.onrender.com/updateProduct/${product.productId}`, productInfo)
                .then((res) => {
                    setMessage("Product information successfully updated")
                    setOpen(true)

                    async function getAllProducts() {
                        await axios.get('https://pujari-jcb-spares-order.onrender.com/getAllProducts')
                            .then((response) => {
                                setAllProducts(response.data)
                            })
                            .catch((error) => {
                                console.log(error);
                            })
                    }
                    getAllProducts()
                })
                .catch((error) => {
                    console.log(error);
                })
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
            <div className="modal fade" id="exampleModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h1 className="modal-title fs-5" id="exampleModalLabel">Edit Product</h1>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            <div className='' style={{ width: '80%' }}>
                                <div className="input-group input-group-sm mb-3">
                                    <span className="input-group-text" id="inputGroup-sizing-sm">Product Name</span>
                                    <input type="text" id='productName' className="form-control" aria-label="Sizing example input" aria-describedby="inputGroup-sizing-sm" defaultValue={product.productName} readOnly />
                                </div>
                                <div className="input-group input-group-sm mb-3">
                                    <span className="input-group-text" id="inputGroup-sizing-sm">Manufacturer</span>
                                    <input type="text" id='manufacturer' className="form-control" aria-label="Sizing example input" aria-describedby="inputGroup-sizing-sm" defaultValue={product.productManufacturer} readOnly />
                                </div>
                                <div className="input-group input-group-sm mb-3">
                                    <span className="input-group-text" id="inputGroup-sizing-sm">Material</span>
                                    <input type="text" id='material' className="form-control" aria-label="Sizing example input" aria-describedby="inputGroup-sizing-sm" defaultValue={product.productMaterial} readOnly />
                                </div>
                                <div className="input-group input-group-sm mb-3">
                                    <span className="input-group-text" id="inputGroup-sizing-sm">Length</span>
                                    <input type="text" id='length' className="form-control" aria-label="Sizing example input" aria-describedby="inputGroup-sizing-sm" defaultValue={product.productLength} readOnly />
                                </div>
                                <div className="input-group input-group-sm mb-3">
                                    <span className="input-group-text" id="inputGroup-sizing-sm">Quantity</span>
                                    <input type="text" id='quantity' className="form-control" aria-label="Sizing example input" aria-describedby="inputGroup-sizing-sm" defaultValue={product.productQuantity} readOnly />
                                </div>
                                <div className="input-group input-group-sm mb-3">
                                    <span className="input-group-text" id="inputGroup-sizing-sm">Model</span>
                                    <input type="text" id='model' className="form-control" aria-label="Sizing example input" aria-describedby="inputGroup-sizing-sm" defaultValue={product.productModel} readOnly />
                                </div>
                                <div className="input-group input-group-sm mb-3">
                                    <span className="input-group-text" id="inputGroup-sizing-sm">Price</span>
                                    <input type="number" id='price' className="form-control" aria-label="Sizing example input" aria-describedby="inputGroup-sizing-sm" defaultValue={product.productPrice} onChange={() => { priceValidate() }} />
                                    <span id='priceError' className='text-danger'></span>
                                </div>
                                <div className="input-group input-group-sm mb-3">
                                    <span className="input-group-text" id="inputGroup-sizing-sm">Delivery Charges</span>
                                    <input type="number" id='deliveryCharges' className="form-control" aria-label="Sizing example input" aria-describedby="inputGroup-sizing-sm" defaultValue={product.productDeliveryCharges} onChange={() => { deliveryChargesValidate() }} />
                                    <span id='deliveryChargesError' className='text-danger'></span>
                                </div>

                            </div>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-outline-primary" onClick={() => { saveChangesClick() }}>Save changes</button>
                        </div>
                    </div>
                </div>
            </div>


            <Navbar myProfile={false} logout={true} home={true} />
            <div className="m-5">
                <div>
                    <div className='row' style={{ width: '50%' }}>
                        <div className='col'>
                            <h4>All Users</h4>
                        </div>
                        <div className="col" >
                            <select className="form-select" id="userSelect">
                                <option defaultValue>User name</option>
                                {
                                    userNames.length ? userNames.map((e, i) => {
                                        return (<option key={i} hidden={e.email === "admin@gmail.com"} value={e._id}>{e.name}</option>
                                        )
                                    }) : ''
                                }
                            </select>
                            <span id='' className='text-danger'></span>
                        </div>
                        <div className="col" style={{ marginTop: '3px', maxWidth: 'fit-content' }} >
                            <button type="button" id='sumbitbutton' className="btn btn-outline-primary btn-sm" onClick={() => { findUserClick() }}>Search</button>
                        </div>
                        <div className="col" style={{ marginTop: '3px', maxWidth: 'fit-content' }}>
                            <p className='btn btn-sm border border-primary' title='Refresh' style={{ color: 'green' }} onClick={() => { refreshUsersClick() }}><i className="fa-solid fa-rotate fs-5"></i></p>
                        </div>
                        <div className="col" style={{ marginTop: '3px' }}>
                            <button className='btn btn-sm border border-primary text-primary' onClick={() => { downloadExcelSheet('usersDataTable', 'Users') }}>Download Excel Sheet</button>
                        </div>
                    </div>
                    <div className='mt-3' style={{ width: '70%', height: '250px', overflowY: 'auto', position: 'sticky', top: 0 }}>
                        <table id='usersDataTable' className="table" style={{ borderCollapse: 'collapse' }}>
                            <thead style={{ backgroundColor: '#a3a3a3', position: 'sticky', top: 0 }}>
                                <tr>
                                    <th scope="col" style={{ position: 'sticky', top: 0 }}>Name</th>
                                    <th scope="col" style={{ position: 'sticky', top: 0 }}>Email address</th>
                                    <th scope="col" style={{ position: 'sticky', top: 0 }}>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    userData.length ? userData.map((e, i) => {
                                        return (<tr hidden={e.name === "Admin"} key={i}>
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

                {/* pending orders div start */}
                <div style={{ marginTop: '80px' }}>
                    <div className='row' style={{ width: '70%' }}>
                        <div className='col'>
                            <h4>Pending Orders</h4>
                        </div>
                        <div className="col" >
                            <select className="form-select" id="userName">
                                <option defaultValue>User name</option>
                                {
                                    userNames.length ? userNames.map((e, i) => {
                                        return (<option key={i} hidden={e.email === "admin@gmail.com"} value={e._id}>{e.name}</option>
                                        )
                                    }) : ''
                                }
                            </select>
                            <span id='' className='text-danger'></span>
                        </div>
                        <div className="col" style={{ maxWidth: 'fit-content' }}>
                            <input type="date" className='form-control' id="date" />
                        </div>
                        <div className="col" style={{ marginTop: '3px', maxWidth: 'fit-content' }} >
                            <button type="button" id='sumbitbutton' className="btn btn-outline-primary btn-sm" onClick={() => { findOrderClick() }}>Search</button>
                        </div>
                        <div className="col" style={{ marginTop: '3px', maxWidth: 'fit-content' }}>
                            <p className='btn btn-sm border border-primary' title='Refresh' style={{ color: 'green' }} onClick={() => { refreshOrdersClick() }}><i className="fa-solid fa-rotate fs-5"></i></p>
                        </div>
                        <div className="col" style={{ marginTop: '3px' }}>
                            <button className='btn btn-sm border border-primary text-primary' onClick={() => { downloadExcelSheet('pendingOrdersTable', 'Pending Orders Report') }}>Download Excel Sheet</button>
                        </div>
                    </div>
                    <div className='mt-3' style={{ width: '100%', height: '330px', overflowY: 'auto', position: 'sticky', top: 0 }}>
                        <table id='pendingOrdersTable' className="table" style={{ borderCollapse: 'collapse' }}>
                            <thead style={{ backgroundColor: '#a3a3a3', position: 'sticky', top: 0 }}>
                                <tr className='text-black'>
                                    <th scope="col" style={{ position: 'sticky', top: 0 }}>Sr. No.</th>
                                    <th scope="col" style={{ position: 'sticky', top: 0 }}>User name</th>
                                    <th scope="col" style={{ position: 'sticky', top: 0 }}>Product Name</th>
                                    <th scope="col" style={{ position: 'sticky', top: 0 }}>Quantity</th>
                                    <th scope="col" style={{ position: 'sticky', top: 0 }}>Address</th>
                                    <th scope="col" style={{ position: 'sticky', top: 0 }}>Price</th>
                                    <th scope="col" style={{ position: 'sticky', top: 0 }}>Delivery charges</th>
                                    <th scope="col" style={{ position: 'sticky', top: 0 }}>Total amount</th>
                                    <th scope="col" style={{ position: 'sticky', top: 0 }}>Payment Mode</th>
                                    <th scope="col" style={{ position: 'sticky', top: 0 }}>Date</th>
                                    <th scope="col" style={{ position: 'sticky', top: 0 }}>Action</th>
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
                                            <td>{e.deliveryCharges}</td>
                                            <td>{e.totalAmount}</td>
                                            <td>{e.paymentMode}</td>
                                            <td>{new Date(e.date).toLocaleString()}</td>
                                            <td>
                                                <button type="button" id='sumbitbutton' className="btn btn-sm border-danger text-danger" onClick={() => { deleteOrderClick(e) }}>Delete Order</button>
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
                <div className='' style={{ marginTop: '80px' }}>
                    <div className='row' style={{ width: '70%' }}>
                        <div className='col'>
                            <h4>Delivered Orders</h4>
                        </div>
                        <div className="col" >
                            <select className="form-select" id="userName">
                                <option defaultValue>User name</option>
                                {
                                    userNames.length ? userNames.map((e, i) => {
                                        return (<option key={i} hidden={e.email === "admin@gmail.com"} value={e._id}>{e.name}</option>
                                        )
                                    }) : ''
                                }
                            </select>
                            <span id='' className='text-danger'></span>
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
                        <div className="col" style={{ marginTop: '3px' }}>
                            <button className='btn btn-sm border border-primary text-primary'>Download Excel Sheet</button>
                        </div>
                    </div>
                    <div className='mt-3' style={{ width: '100%', height: '330px', overflowY: 'auto', position: 'sticky', top: 0 }}>
                        <table className="table" style={{ borderCollapse: 'collapse' }}>
                            <thead style={{ backgroundColor: '#a3a3a3', position: 'sticky', top: 0 }}>
                                <tr className='text-black'>
                                    <th scope="col" style={{ position: 'sticky', top: 0 }}>Sr. No.</th>
                                    <th scope="col" style={{ position: 'sticky', top: 0 }}>User name</th>
                                    <th scope="col" style={{ position: 'sticky', top: 0 }}>Product Name</th>
                                    <th scope="col" style={{ position: 'sticky', top: 0 }}>Quantity</th>
                                    <th scope="col" style={{ position: 'sticky', top: 0 }}>Address</th>
                                    <th scope="col" style={{ position: 'sticky', top: 0 }}>Price</th>
                                    <th scope="col" style={{ position: 'sticky', top: 0 }}>Delivery charges</th>
                                    <th scope="col" style={{ position: 'sticky', top: 0 }}>Total amount</th>
                                    <th scope="col" style={{ position: 'sticky', top: 0 }}>Payment Mode</th>
                                    <th scope="col" style={{ position: 'sticky', top: 0 }}>Order Date</th>
                                    <th scope="col" style={{ position: 'sticky', top: 0 }}>Delivery Date</th>
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

                <div className='mt-5'>
                    <div className="row mt-2" style={{ width: '350px' }}>
                        <div className='col'>
                            <h4>All Products </h4>
                        </div>
                        <div className="col">
                            <p className='btn btn-sm border border-primary' title='Refresh' style={{ color: 'green' }} onClick={() => { refreshAllProducts() }}><i className="fa-solid fa-rotate fs-6"></i></p>
                        </div>
                    </div>

                    <div className='p-3 mt-3' style={{ height: '800px', overflow: 'auto', display: 'grid', justifyContent: 'center', gridTemplateColumns: 'auto auto auto auto', gridGap: '50px' }}>
                        {
                            allProducts.length ? allProducts.map((e, i) => {
                                return (<div key={i} className="card" style={{ width: '18rem' }}>
                                    <div className='mt-3 position-relative top-0 start-50 translate-middle-x' style={{ width: '200px', height: '200px' }}>
                                        <img src={e.productImage} className="card-img-top" alt={e.productName} style={{ width: '100%', height: '100%' }} />
                                    </div>
                                    <div className="card-body">
                                        <h5 className="card-title">{e.productName}</h5>
                                    </div>
                                    <ul className="list-group list-group-flush">
                                        <li className="list-group-item">Manufacturer: {e.productManufacturer}</li>
                                        <li className="list-group-item">Material: {e.productMaterial}</li>
                                        <li className="list-group-item">Length: {e.productLength}</li>
                                        <li className="list-group-item">Quantity: {e.productQuantity}</li>
                                        <li className="list-group-item">Model: {e.productModel}</li>
                                        <li className="list-group-item">Price: Rs. {e.productPrice}</li>
                                        <li className="list-group-item">Delivery Charges: {e.productDeliveryCharges}</li>
                                    </ul>
                                    <div className="p-3 card-body position-relative bottom-0 start-0">
                                        <span className='editDeleteLogo'><i className="fa-regular fa-pen-to-square fs-4 text-primary " data-bs-toggle="modal" data-bs-target="#exampleModal" onClick={() => { editProductClick(e) }}></i> <i className="fa-solid fa-trash-can fs-4 ms-2 text-danger" onClick={() => { deleteProductClick() }}></i></span>
                                    </div>
                                </div>)
                            }) : ""
                        }
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