import axios from 'axios';
import Navbar from '../Navbar/Navbar'
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function ProductDetails() {
    // let [allOrders, setAllOrders] = useState([])
    let [orderForm, setOrderForm] = useState(false)
    let navigate = useNavigate()

    const product = JSON.parse(sessionStorage.getItem('product'))
    const userInfo = JSON.parse(sessionStorage.getItem('userInfo'))
    const token = sessionStorage.getItem('token')

    let auth = {
        headers: { Authorization: `Bearer ${token}` }
    }

    function nameValidate() {
        const name = document.getElementById('name')
        const nameError = document.getElementById('nameError')
        if (name.value === '') {
            nameError.innerText = "*Required"
        }
        else {
            nameError.innerText = ""
        }
    }

    function addressValidate() {
        const address = document.getElementById('address')
        const addressError = document.getElementById('addressError')
        if (address.value === '') {
            addressError.innerText = "*Required"
        }
        else {
            addressError.innerText = ""
        }
    }

    function mobileValidate() {
        const mobile = document.getElementById('mobile')
        const mobileError = document.getElementById('mobileError')
        if (mobile.value === '') {
            mobileError.innerText = "*Required"
        }
        else {
            mobileError.innerText = ""
        }
    }

    async function confirmOrderClick() {
        const name = document.getElementById('name')
        const nameError = document.getElementById('nameError')
        const address = document.getElementById('address')
        const addressError = document.getElementById('addressError')
        const mobile = document.getElementById('mobile')
        const mobileError = document.getElementById('mobileError')
        const quantity = document.getElementById('quantity')
        const quantityError = document.getElementById('quantityError')
        const amount = document.getElementById('amount')
        const payment = document.getElementById('payment')
        const deliveryCharges = document.getElementById('deliveryCharges')
        const totalAmount = document.getElementById('totalAmount')
        if (name.value === '') {
            nameError.innerText = "*Required"
        }
        else {
            if (!isNaN(name.value)) {
                nameError.innerText = "*Invalid"
            }
            else {
                nameError.innerText = ""
            }
        }
        if (address.value === '') {
            addressError.innerText = "*Required"
        }
        else {
            addressError.innerText = ""
        }
        if (mobile.value === '') {
            mobileError.innerText = "*Required"
        }
        else {
            if (mobile.value.length < 10 || mobile.value.length > 10) {
                mobileError.innerText = "*Invalid"
            }
            else {
                mobileError.innerText = ""
            }
        }
        if (quantity.value < 1) {
            quantityError.innerText = "*Invalid"
        }
        else {
            quantityError.innerText = ""
        }
        if (nameError.innerText === "" && addressError.innerText === "" && mobileError.innerText === "" && quantityError.innerText === "") {
            const placedOrderData = {
                email: userInfo.email,
                userName: userInfo.name,
                name: product.productName,
                address: address.value,
                quantity: quantity.value,
                price: amount.value,
                deliveryCharges: deliveryCharges.value,
                totalAmount: totalAmount.value,
                paymentMode: payment.value,
                date: new Date().toISOString(),
                delivered: false
            }

            try {
                await axios.post('https://pujari-jcb-spares-backend.onrender.com/orders/newOrder', placedOrderData, auth)
                const emailData = {
                    email: placedOrderData.email,
                    userName: placedOrderData.userName,
                    name: placedOrderData.name,
                    address: placedOrderData.address,
                    quantity: placedOrderData.quantity,
                    price: placedOrderData.price,
                    deliveryCharges: placedOrderData.deliveryCharges,
                    totalAmount: placedOrderData.totalAmount,
                    date: new Date().toISOString()
                }
                try {
                    await axios.post('https://pujari-jcb-spares-backend.onrender.com/orders/sendEmail', emailData)
                    setOrderForm(false)
                    successToastMessage('Order Placed ! Please check your email for order details', 3500)
                }
                catch (error) {
                    if (error.response) {
                        if (error.response.status === 400) {
                            errorToastMessage('Failed to send email !', 3000)
                        }
                    }
                    else {
                        errorToastMessage('Something went wrong. Please try again', 3000)
                    }
                }
            }
            catch (error) {
                if (error.response) {
                    if (error.response.status === 401) {
                        errorToastMessage('Session expired. Please login again !', 3000)
                        setTimeout(() => {
                            navigate('/')
                            sessionStorage.clear()
                        }, 3500)
                    }
                    else if (error.response.status === 400) {
                        errorToastMessage('Order not placed. Please try again !', 3000)
                    }
                }
                else {
                    errorToastMessage('Something went wrong. Please try again !', 3000)
                }
            }
        }
    }

    function quantityChange() {
        const quantity = document.getElementById('quantity')
        const quantityError = document.getElementById('quantityError')
        const amount = document.getElementById('amount')
        const totalAmount = document.getElementById('totalAmount')
        const deliveryCharges = document.getElementById('deliveryCharges')
        const price = product.productPrice

        if (quantity.value < 1) {
            quantityError.innerText = "*Invalid"
        }
        else {
            quantityError.innerText = ""
            amount.value = price * quantity.value
            totalAmount.value = parseInt(amount.value) + parseInt(deliveryCharges.value)
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
            <Navbar myProfile={true} logout={true} home={true} />
            <div className="mt-5 mb-4">
                <div className='ms-3 hoverText' style={{ width: 'fit-content', }}>
                    <h4 onClick={() => { navigate('/home') }}><i className="fa-solid fa-arrow-left-long"></i> Back</h4>
                </div>

                <div className='row position-relative top-0 start-50 translate-middle-x' style={{ width: '70%' }}>
                    <div className="col-3 border rounded" style={{ width: '300px', height: '340px' }}>
                        <img src={product.productImage} alt={product.productName} style={{ width: '100%', height: '100%' }} />
                    </div>
                    <div className="col-8 border rounded ms-5">
                        <div className='position-relative top-0 start-50 translate-middle-x mt-3' style={{ width: 'fit-content' }}>
                            <h6 className='fs-5 '>Name: {product.productName}</h6>
                            <h6 className='fs-5'>Model: {product.productModel}</h6>
                            <h6 className='fs-5'>Manufacturer: {product.productManufacturer}</h6>
                            <h6 className='fs-5'>Material: {product.productMaterial}</h6>
                            <h6 className='fs-5'>Length: {product.productLength}</h6>
                            <h6 className='fs-5'>Quantity: {product.productQuantity}</h6>
                            <h6 className='fs-5'>Price: Rs. {product.productPrice}</h6>
                            <h6 className='fs-5'>Delivery charges: Rs. {product.productDeliveryCharges}</h6>
                        </div>
                        <div className='text-center mt-3'>
                            <button className='btn  btn-primary' onClick={() => { setOrderForm(true) }}>Place order</button>
                        </div>
                    </div>
                </div>
                {/* Place order form */}
                {
                    orderForm ? <div className='border rounded mt-4 col-6 position-relative top-0 start-50 translate-middle-x p-3'>
                        <div className="row">
                            <div className="col">
                                <label htmlFor="name" className="form-label">Name</label>
                                <input type="text" className="form-control" id="name" aria-describedby="emailHelp" onKeyUp={() => { nameValidate() }} />
                                <span id='nameError' className='text-danger'></span>
                            </div>
                            <div className="col">
                                <label htmlFor="address" className="form-label">Address</label>
                                <input type="text" className="form-control" id="address" aria-describedby="emailHelp" onKeyUp={() => { addressValidate() }} />
                                <span id='addressError' className='text-danger'></span>

                            </div>
                            <div className="col">
                                <label htmlFor="mobile" className="form-label">Contact number</label>
                                <input type="number" className="form-control" id="mobile" aria-describedby="emailHelp" onKeyUp={() => { mobileValidate() }} />
                                <span id='mobileError' className='text-danger'></span>
                            </div>
                            <div className="col">
                                <label htmlFor="payment" className="form-label">Payment mode</label>
                                <input type="text" className="form-control" id="payment" aria-describedby="emailHelp" defaultValue="Cash on delivery" readOnly />
                            </div>
                        </div>
                        <div className="row mt-3">
                            <div className="col">
                                <label htmlFor="quantity" className="form-label">Quantity</label>
                                <input type="number" className="form-control" id="quantity" aria-describedby="emailHelp" defaultValue={1} onChange={() => { quantityChange() }} />
                                <span id='quantityError' className='text-danger'></span>
                            </div>
                            <div className="col">
                                <label htmlFor="amount" className="form-label">Price</label>
                                <input type="number" className="form-control" id="amount" aria-describedby="emailHelp" readOnly defaultValue={product.productPrice} />
                            </div>
                            <div className="col">
                                <label htmlFor="deliveryCharges" className="form-label">Delivery charges</label>
                                <input type="number" className="form-control" id="deliveryCharges" aria-describedby="emailHelp" readOnly defaultValue={product.productDeliveryCharges} />
                            </div>
                            <div className="col">
                                <label htmlFor="totalAmount" className="form-label">Total amount</label>
                                <input type="number" className="form-control" id="totalAmount" aria-describedby="emailHelp" readOnly defaultValue={product.productPrice + product.productDeliveryCharges} />
                            </div>
                        </div>
                        <div className='text-center mt-3'>
                            <button type='submit' className='btn  btn-primary' onClick={() => { confirmOrderClick() }}>Confirm order</button>
                            <button type='submit' className='btn  btn-danger ms-3' onClick={() => { setOrderForm(false) }}>Cancle</button>
                        </div>
                    </div> : ""
                }
            </div>
            <ToastContainer />
        </>
    )
}

export default ProductDetails