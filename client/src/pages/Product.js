import React, { useEffect, useState } from 'react'
import { getProduct, productStar, getRelated } from '../functions/product'
import SingleProduct from '../components/cards/SingleProduct'
import { useSelector } from 'react-redux'
import ProductCard from '../components/cards/ProductCard'

const Product = ({ match }) => {
  const [product, setProduct] = useState([])
  const [star, setStar] = useState(0)
  const { user } = useSelector((state) => ({ ...state }))
  const [related, setRelated] = useState([])

  const { slug } = match.params

  useEffect(() => {
    loadSingleProduct()
  }, [slug])

  // set the Rating object
  useEffect(() => {
    if (product.ratings && user) {
      let existingRatingObject = product.ratings.find(
        (element) => element.postedBy.toString() === user._id.toString(),
      )
      existingRatingObject && setStar(existingRatingObject.star) // current user's star
    }
  }, [product.ratings, user])

  const loadSingleProduct = () => {
    getProduct(slug).then((res) => {
      setProduct(res.data)
      // load related
      getRelated(res.data._id).then((res) => setRelated(res.data))
    })
  }

  const onStarClick = (newRating, name) => {
    setStar(newRating)
    productStar(name, newRating, user.token).then((res) => {
      console.log('rating clicked', res.data)
      loadSingleProduct() // show updated rating in real-time
    })
  }

  return (
    <div className="container-fluid">
      <div className="row pt-4">
        <SingleProduct
          product={product}
          onStarClick={onStarClick}
          star={star}
        />
      </div>

      <div className="row">
        <div className="col text-center pt-5 pb-5">
          <hr />
          <h4>Related Products</h4>
          <hr />
        </div>
      </div>
      <div className="row pb-5">
        {related.length ? (
          related.map((r) => (
            <div key={r._id} className="col-md-4">
              <ProductCard product={r} />
            </div>
          ))
        ) : (
          <div className="text-center col">No Products found</div>
        )}
      </div>
    </div>
  )
}

export default Product
