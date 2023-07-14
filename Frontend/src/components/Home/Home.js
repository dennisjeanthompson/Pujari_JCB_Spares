import axios from 'axios'
// import { Helmet } from 'react-helmet'
import Navbar from '../Navbar/Navbar'
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useEffect } from 'react'

function Home() {
  let navigate = useNavigate()
  let [allProducts, setAllProducts] = useState([])

  useEffect(() => {
    axios.get('https://pujari-jcb-spares-order.onrender.com/getAllProducts')
      .then((response) => {
        setAllProducts(response.data)
      })
      .catch((error) => {
        console.log(error);
      })
  }, [setAllProducts])



  function viewMoreClick(product) {
    sessionStorage.setItem('product', JSON.stringify(product))
    navigate('/product-details')
  }

  return (
    <>
      {/* <Helmet>
        <title>Pujari JCB Spares | Home</title>
      </Helmet> */}

      <Navbar myProfile={true} logout={true} home={false} />

      <div className='mt-4'>
        <div className=' p-3' style={{ display: 'grid', justifyContent: 'center', gridTemplateColumns: 'auto auto auto auto', gridGap: '50px' }}>
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
                  <li className="list-group-item">Delivery Charges: {e.productDeliveryCharges}</li>
                  <li className="list-group-item">Price: {e.productPrice}</li>
                </ul>
                <div className="p-3 card-body position-relative bottom-0 start-0">
                  <button className='btn  btn-primary' onClick={() => { viewMoreClick(e) }}>View more</button>
                </div>
              </div>)
            }) : ""
          }
        </div>
      </div>
    </>
  )
}

export default Home