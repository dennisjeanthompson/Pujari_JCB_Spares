import Navbar from '../Navbar/Navbar'
import React from 'react'
import './home.css'
import { useNavigate } from 'react-router-dom'

function Home() {
  let navigate = useNavigate()
  // let allProducts=[]
  const allProducts = JSON.parse(sessionStorage.getItem('allProducts'))

  function viewMoreClick(product) {
    sessionStorage.setItem('product', JSON.stringify(product))
    navigate('/product-details')
  }

  return (
    <>
      <Navbar myProfile={true} logout={true} home={false} />

      <div className="allRecipeMainDiv border" style={{height:'600px', overflow:'auto'}}>
        {/* <div className='productsDiv'> */}
          {
            allProducts.length ? allProducts.map((e, i) => {
              return (<div key={i} className="card shadow border-0" style={{ width: '18rem' }}>
                <div className='mt-3 position-relative top-0 start-50 translate-middle-x' style={{ width: '200px', height: '200px' }}>
                  <img src={e.productImage} className="rounded card-img-top" alt={e.productName} style={{ width: '100%', height: '100%' }} />
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
                </ul>
                <div className="p-3 card-body position-relative bottom-0 start-0">
                  <button className='btn btn-primary' onClick={() => { viewMoreClick(e) }}>View more</button>
                </div>
              </div>)
            }) : <div className=''><h4>No data</h4></div>
          }
        {/* </div> */}
      </div>
    </>
  )
}

export default Home