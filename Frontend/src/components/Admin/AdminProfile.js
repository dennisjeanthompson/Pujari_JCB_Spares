import axios from 'axios'
import Navbar from '../Navbar/Navbar'
import React, { useState } from 'react'
import { useEffect } from 'react'
import * as XLSX from 'xlsx'
import './adminProfile.css'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function AdminPage() {
    let [userNames, setUserNames] = useState([])
    let [userData, setUserData] = useState([])
    let [product, setProduct] = useState([])
    let [orders, setOrders] = useState([])
    let [allProducts, setAllProducts] = useState([])

    let email = ''
    let userEmail = ''
    let orderStartDateTime = ''
    let orderEndDateTime = ''

    useEffect(() => {
        // all users data
        getAllUsers()

        // all orders data
        getAllOrders()

        // all products data 
        getAllProducts()

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    async function getAllUsers() {
        try {
            let res = await axios.get(`https://pujari-jcb-spares-backend.onrender.com/users?email=${email}`)
            setUserNames(res.data)
            setUserData(res.data)
        }
        catch (error) {
            // console.log(error);
            if (error.response) {
                if (error.response.status === 400) {
                    setUserNames([])
                    setUserData([])
                }
            }
            else {
                errorToastMessage('Something went wrong. Please try again !', 3000)
            }
        }
    }

    async function getAllOrders() {
        try {
            let res = await axios.get(`https://pujari-jcb-spares-backend.onrender.com/orders?email=${userEmail}&startDateTime=${orderStartDateTime}&endDateTime=${orderEndDateTime}`)
            // console.log(res);
            setOrders(res.data)
        }
        catch (error) {
            // console.log(error);
            if (error.response) {
                if (error.response.status === 400) {
                    setOrders([])
                }
            }
            else {
                errorToastMessage('Something went wrong. Please try again !', 3000)
            }
        }
    }

    let pendingOrders = orders.length ? orders.filter((e) => e.delivered === false) : ''
    let deliveredOrders = orders.length ? orders.filter((e) => e.delivered === true) : ''

    async function getAllProducts() {
        try {
            let res = await axios.get('https://pujari-jcb-spares-backend.onrender.com/products/allProducts')
            setAllProducts(res.data)
        }
        catch (error) {
            if (error.response) {
                if (error.response.status === 400) {
                    setAllProducts([])
                }
            }
            else {
                errorToastMessage('Something went wrong. Please try again !', 3000)
            }
        }
    }

    async function deleteUserClick(userId) {
        let confirmation = window.confirm("Are sure, you want to delete this user")
        if (confirmation) {
            try {
                await axios.delete(`https://pujari-jcb-spares-backend.onrender.com/users/deleteUser?userId=${userId}`)
                getAllUsers()
                successToastMessage('User successfully deleted', 2000)
            }
            catch (error) {
                if (error.response) {
                    if (error.response.status === 400) {
                        errorToastMessage('Failed to delete user !', 3000)
                    }
                }
                else {
                    errorToastMessage('Something went wrong. Please try again !', 3000)
                }
            }
        }
    }

    async function deleteOrderClick(orderId) {
        let confirmation = window.confirm("Are sure, you want to delete this order")
        if (confirmation) {
            try {
                await axios.delete(`https://pujari-jcb-spares-backend.onrender.com/orders/cancleOrder/${orderId}`)
                getAllOrders()
                successToastMessage('Order successfully deleted', 3000)
            }
            catch (error) {
                console.log(error);
                if (error.response) {
                    if (error.response.status === 400) {
                        errorToastMessage('Order failed to delete !', 3000)
                    }
                }
                else {
                    errorToastMessage('Something went wrong. Please try again !', 3000)
                }
            }
        }
    }

    async function findUserClick() {
        const userSelect = document.getElementById('userSelect')
        if (userSelect.value === 'User name') {
            errorToastMessage('Please select user name', 3000)
        }
        else {
            let userInfo = userNames.length ? userNames.filter((e) => e._id === userSelect.value) : ''
            try {
                let res = await axios.get(`https://pujari-jcb-spares-backend.onrender.com/users?email=${userInfo[0].email}`)
                setUserData(res.data);
            }
            catch (error) {
                if (error.response) {
                    if (error.response.status === 400) {
                        errorToastMessage('User not found !', 3000)
                    }
                }
                else {
                    errorToastMessage('Something went wrong. Please try again !', 3000)
                }
            }
        }
    }

    async function refreshUsersClick() {
        document.getElementById('userSelect').value = 'User name'
        getAllUsers()
    }

    async function findOrderClick() {
        const userName = document.getElementById('userName')
        const date = document.getElementById('date')
        if (userName.value === 'User name' && date.value === '') {
            errorToastMessage('Please select user name or date', 3000)
        }
        else {
            if (date.value !== '') {
                const testDate = '2023-07-11T18:30:00.000Z'
                var startDateTime = new Date(new Date(date.value).setHours(new Date(testDate).getHours(), new Date(testDate).getMinutes(), new Date(testDate).getSeconds(), 0)).toISOString();
                var endDate = new Date(new Date(date.value).setDate(new Date(date.value).getDate() + 1)).toISOString();
                var endDateTime = new Date(new Date(endDate).setHours(new Date(testDate).getHours(), new Date(testDate).getMinutes(), new Date(testDate).getSeconds(), 0)).toISOString();
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
            // for user and date
            else if (userName.value !== 'User name' && date.value !== '') {
                let userInfo = userNames.length ? userNames.filter((e) => e._id === userName.value) : ''
                // console.log(userInfo);
                userEmail = userInfo[0].email
                orderStartDateTime = startDateTime
                orderEndDateTime = endDateTime
            }
            try {
                let res = await axios.get(`https://pujari-jcb-spares-backend.onrender.com/orders?email=${userEmail}&startDateTime=${orderStartDateTime}&endDateTime=${orderEndDateTime}`)
                // console.log(res);
                setOrders(res.data)
            }
            catch (error) {
                // console.log(error);
                if (error.response) {
                    if (error.response.status === 400) {
                        infoToastMessage('No order data found !', 3000)
                        setOrders([])
                    }
                }
                else {
                    infoToastMessage('Something went wrong. Please try again !', 3000)
                }
            }
        }

    }

    async function refreshOrdersClick() {
        userEmail = ''
        orderStartDateTime = ''
        orderEndDateTime = ''
        document.getElementById('userName').value = 'User name'
        document.getElementById('date').value = ''
        try {
            let res = await axios.get(`https://pujari-jcb-spares-backend.onrender.com/orders?email=${userEmail}&startDateTime=${orderStartDateTime}&endDateTime=${orderEndDateTime}`)
            setOrders(res.data)
        }
        catch (error) {
            console.log(error);
            if (error.response) {
                if (error.response.status === 400) {
                    errorToastMessage('No order data found !', 3000)
                }
            }
            else {
                errorToastMessage('Something went wrong. Please try again !', 3000)
            }
        }
    }

    function downloadExcelSheet(tableId, fileName) {
        // Acquire Data (reference to the HTML table)
        var table_elt = document.getElementById(`${tableId}`);

        // Extract Data (create a workbook object from the table)
        var workbook = XLSX.utils.table_to_book(table_elt);

        // Process Data (add a new row)
        var sheet = workbook.Sheets["Sheet1"];

        XLSX.utils.sheet_add_aoa(sheet, [[]], { origin: -1 });
        XLSX.utils.sheet_add_aoa(sheet, [["Created " + new Date().toLocaleString()]], { origin: -1 });

        // Package and Release Data (`writeFile` tries to write and save an XLSB file)
        XLSX.writeFile(workbook, `${fileName}.xlsx`);
    }

    function editProductClick(product) {
        setProduct(product)
        // console.log(product);
    }

    async function deleteProductClick(product) {
        let confirmation = window.confirm("Are you sure, you want to delete this product")
        if (confirmation) {
            try {
                await axios.delete(`https://pujari-jcb-spares-backend.onrender.com/products/deleteProduct/${product.productId}`)
                getAllProducts()
                successToastMessage('Product successfully deleted', 3000)
            }
            catch (error) {
                // console.log(error);
                if (error.response) {
                    if (error.response.status === 400) {
                        errorToastMessage('Failed to delete product !', 3000)
                    }
                }
                else {
                    errorToastMessage('Something went wrong. Please try again !', 3000)
                }
            }
        }
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
            try {
                await axios.put(`https://pujari-jcb-spares-backend.onrender.com/products/updateProduct/${product.productId}`, productInfo)
                getAllProducts()
                successToastMessage('Product information successfully updated', 3000)
            }
            catch (error) {
                // console.log(error);
                if (error.response) {
                    if (error.response.status === 400) {
                        errorToastMessage('Failed to update product !', 3000)
                    }
                }
                else {
                    errorToastMessage('Something went wrong. Please try again !', 3000)
                }
            }
        }
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

            <Navbar myProfile={false} logout={true} home={false} />

            <div className="m-3">
                <div className='' style={{ marginTop: '30px' }}>
                    <div className='allUsersButtonsDiv'>
                        <div>
                            <h4>All Users</h4>
                        </div>
                        <div className='usernameSelectDiv' >
                            <select className="form-select" id="userSelect">
                                <option defaultValue>User name</option>
                                {
                                    userNames.length ? userNames.map((e, i) => {
                                        return (<option key={i} value={e._id}>{e.name}</option>
                                        )
                                    }) : ''
                                }
                            </select>
                            <span id='' className='text-danger'></span>
                        </div>
                        <div className='allUsersSearchButtonDiv' >
                            <button type="button" id='sumbitbutton' className="btn btn-outline-primary btn-sm" onClick={() => { findUserClick() }}>Search</button>
                        </div>
                        <div className='allUsersRefreshButtonDiv'>
                            <p className='btn btn-sm border border-primary' title='Refresh' style={{ color: 'green' }} onClick={() => { refreshUsersClick() }}><i className="fa-solid fa-rotate fs-5"></i></p>
                        </div>
                        <div className='allUsersExcelButtonDiv'>
                            <button className='btn btn-sm btn-outline-primary' onClick={() => { downloadExcelSheet('usersDataTable', 'Users') }}>Download Excel Sheet</button>
                        </div>
                    </div>
                    <div className='allUsersTableDiv mt-3 shadow rounded'>
                        <table id='usersDataTable' className="table" style={{ borderCollapse: 'collapse' }}>
                            <thead style={{ backgroundColor: '#a3a3a3', position: 'sticky', top: 0 }}>
                                <tr>
                                    <th scope="col" style={{ position: 'sticky', top: 0 }}>Sr. No.</th>
                                    <th scope="col" style={{ position: 'sticky', top: 0 }}>Name</th>
                                    <th scope="col" style={{ position: 'sticky', top: 0 }}>Email address</th>
                                    <th scope="col" style={{ position: 'sticky', top: 0 }}>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    userData.length ? userData.map((e, i) => {
                                        return (<tr key={i}>
                                            <td>{i + 1}</td>
                                            <td>{e.name}</td>
                                            <td>{e.email}</td>
                                            <td>
                                                <button type="button" id='sumbitbutton' className="btn btn-sm btn-outline-danger" onClick={() => { deleteUserClick(e.userId) }}>Delete User</button>
                                            </td>
                                        </tr>)
                                    }) : <tr style={{ fontFamily: 'Arial' }}><td>No Data</td></tr>
                                }
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* pending orders div start */}
                <div style={{ marginTop: '80px' }}>
                    <div className='pendingOrdersButtonsDiv'>
                        <div className=''>
                            <h4>Pending Orders</h4>
                        </div>
                        <div className="" >
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
                        <div className="calenderDiv">
                            <input type="date" className='form-control' id="date" />
                        </div>
                        <div className="" style={{ marginTop: '3px', maxWidth: 'fit-content' }} >
                            <button type="button" id='sumbitbutton' className="btn btn-outline-primary btn-sm" onClick={() => { findOrderClick() }}>Search</button>
                        </div>
                        <div className="" style={{ marginTop: '3px', maxWidth: 'fit-content' }}>
                            <p className='btn btn-sm border border-primary' title='Refresh' style={{ color: 'green' }} onClick={() => { refreshOrdersClick() }}><i className="fa-solid fa-rotate fs-5"></i></p>
                        </div>
                        <div className="" style={{ marginTop: '3px' }}>
                            <button className='btn btn-sm btn-outline-primary' onClick={() => { downloadExcelSheet('pendingOrdersTable', 'Pending Orders Report') }}>Download Excel Sheet</button>
                        </div>
                    </div>
                    <div className='pendingOrdersTableDiv mt-3 shadow rounded' style={{ width: '100%', height: '325px', overflowY: 'auto', position: 'sticky', top: 0 }}>
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
                                    <th scope="col" style={{ position: 'sticky', top: 0 }}>Order date</th>
                                    <th scope="col" style={{ position: 'sticky', top: 0 }}>Expected delivery date</th>
                                    <th scope="col" style={{ position: 'sticky', top: 0 }}>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    pendingOrders.length ? pendingOrders.map((e, i) => {
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
                                            <td>{new Date(new Date(e.date).setDate(new Date(e.date).getDate() + 5)).toLocaleDateString()}</td>
                                            <td>
                                                <button type="button" id='sumbitbutton' className="btn btn-sm btn-outline-danger" onClick={() => { deleteOrderClick(e.orderId) }}>Delete Order</button>
                                            </td>
                                        </tr>)
                                    }) : <tr style={{ fontFamily: 'Arial' }}><td>No Data</td></tr>
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
                                        return (<option key={i} value={e._id}>{e.name}</option>
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
                            <button className='btn btn-sm btn-outline-primary'>Download Excel Sheet</button>
                        </div>
                    </div>
                    <div className='mt-3 shadow rounded' style={{ width: '100%', height: '330px', overflowY: 'auto', position: 'sticky', top: 0 }}>
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
                                    <th scope="col" style={{ position: 'sticky', top: 0 }}>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    deliveredOrders.length ? deliveredOrders.map((e, i) => {
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
                                            <td>{new Date(new Date(e.date).setDate(new Date(e.date).getDate() + 5)).toLocaleDateString()}</td>
                                            <td>
                                                <button type="button" id='sumbitbutton' className="btn btn-sm btn-outline-danger" onClick={() => { deleteOrderClick(e.orderId) }}>Delete Order</button>
                                            </td>
                                        </tr>)
                                    }) : <tr style={{ fontFamily: 'Arial' }}><td>No Data</td></tr>
                                }
                            </tbody>
                        </table>
                    </div>
                </div>
                {/* delivered orders div end */}

                <div className='mt-5'>
                    <div className=''>
                        <h4>All Products</h4>
                    </div>
                    <div className='allProductsDiv border rounded'>
                        {
                            allProducts.length ? allProducts.map((e, i) => {
                                return (<div key={i} className="card shadow border-0" style={{ width: '18rem' }}>
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
                                        <span className='editDeleteLogo'><i className="fa-regular fa-pen-to-square fs-4 text-primary " data-bs-toggle="modal" data-bs-target="#exampleModal" onClick={() => { editProductClick(e) }}></i> <i className="fa-solid fa-trash-can fs-4 ms-2 text-danger" onClick={() => { deleteProductClick(e) }}></i></span>
                                    </div>
                                </div>)
                            }) : <div className='text-center'><h4 style={{ fontFamily: 'Arial' }}>No Data</h4></div>
                        }
                    </div>
                </div>
            </div>
            <ToastContainer />
        </>
    )
}

export default AdminPage