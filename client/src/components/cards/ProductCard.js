import React, { useState } from 'react'
import { Card, Tooltip } from 'antd'
import { EyeOutlined, ShoppingCartOutlined } from '@ant-design/icons'
import laptop from '../../images/laptop.png'
import { Link } from 'react-router-dom'
import { showAverage } from '../../functions/rating'
import _ from 'lodash'
import { useSelector, useDispatch } from 'react-redux'

const { Meta } = Card

const ProductCard = ({ product }) => {
  const [tooltip, setToolTip] = useState('Click to add')

  // redux
  const { user, cart } = useSelector((state) => ({ ...state }))
  const dispatch = useDispatch()

  const handleAddToCart = () => {
    // create cart array
    let cart = []
    if (typeof window !== undefined) {
      // if cart is in local storage, get it from local storage
      if (localStorage.getItem('ecomm_cart')) {
        cart = JSON.parse(localStorage.getItem('ecomm_cart'))
      }
      // push new product to cart
      cart.push({
        ...product,
        count: 1,
      })

      // remove duplicates
      let unique = _.uniqWith(cart, _.isEqual)
      // save to local storage
      // console.log('unique', unique)
      localStorage.setItem('ecomm_cart', JSON.stringify(unique))
      // show tooltip
      setToolTip('Added')

      // add to redux state
      dispatch({
        type: 'ADD_TO_CART',
        payload: unique,
      })
      // show cart items in side drawer
      dispatch({
        type: 'SET_VISIBLE',
        payload: true,
      })
    }
  }

  const { title, description, images, slug, price, quantity } = product
  return (
    <>
      {product && product.ratings && product.ratings.length > 0 ? (
        showAverage(product)
      ) : (
        <div className="text-center pt-1 pb-3">No rating yet</div>
      )}
      <Card
        cover={
          <img
            src={images && images.length ? images[0].url : laptop}
            style={{ height: '150px', objectFit: 'cover' }}
            className="p-1"
            alt="product"
          />
        }
        actions={[
          <Link to={`/product/${slug}`}>
            <EyeOutlined className="text-warning" />
            <br />
            View Product
          </Link>,
          <Tooltip title={tooltip}>
            <a onClick={handleAddToCart} disabled={quantity < 1}>
              <ShoppingCartOutlined className="text-danger" />
              <br />
              {quantity < 1 ? 'Out of stock' : 'Add to Cart'}
            </a>
          </Tooltip>,
        ]}
      >
        <Meta
          title={`${title} - ${price.toLocaleString('en-US', {
            style: 'currency',
            currency: 'USD',
          })}`}
          description={`${description && description.substring(0, 50)}...`}
        />
        {title}
      </Card>
    </>
  )
}

export default ProductCard
