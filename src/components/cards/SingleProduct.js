import React, { useState } from 'react'
import { Card, Tabs, Tooltip } from 'antd'
import { HeartOutlined, ShoppingCartOutlined } from '@ant-design/icons'
import 'react-responsive-carousel/lib/styles/carousel.min.css'
import { Carousel } from 'react-responsive-carousel'
import Laptop from '../../images/laptop.png'
import ProductListItems from './ProductListItems'
import StarRating from 'react-star-ratings'
import RatingModal from '../modal/RatingModal'
import { showAverage } from '../../functions/rating'
import _ from 'lodash'
import { useSelector, useDispatch } from 'react-redux'
import { addToWishlist } from '../../functions/user'
import { toast } from 'react-toastify'
import { useHistory, useParams } from 'react-router-dom'

const { TabPane } = Tabs

// This is child component of Product page
const SingleProduct = ({ product, onStarClick, star }) => {
  const { title, images, description, _id } = product
  const [tooltip, setToolTip] = useState('Click to add')

  // redux
  const { user, cart } = useSelector((state) => ({ ...state }))
  const dispatch = useDispatch()
  // router
  let history = useHistory()
  let { slug } = useParams()

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

  const handleAddToWishlist = (e) => {
    e.preventDefault()
    if (user) {
      addToWishlist(product._id, user.token).then((res) => {
        console.log('added to wishlist', res.data)
        toast.success('Added to wishlist')
        history.push('/user/wishlist')
      })
    } else {
      history.push({
        pathname: '/login',
        state: { from: `/product/${slug}` },
      })
    }
  }

  return (
    <>
      <div className="col-md-7">
        {images && images.length ? (
          <Carousel showArrows={true} autoPlay infiniteLoop>
            {images &&
              images.map((i) => (
                <img src={i.url} key={i.public_id} alt="product" />
              ))}
          </Carousel>
        ) : (
          <Card
            cover={
              <img src={Laptop} className="mb-3 card-image" alt="product" />
            }
          ></Card>
        )}

        <Tabs type="card">
          <TabPane tab="Description" key="1">
            {description && description}
          </TabPane>
          <TabPane tab="More" key="2">
            Call us on xxxx xxx xxx to learn more about this product.
          </TabPane>
        </Tabs>
      </div>

      <div className="col-md-5">
        <h1 className="bg-info p-3">{title}</h1>

        {product && product.ratings && product.ratings.length > 0 ? (
          showAverage(product)
        ) : (
          <div className="text-center pt-1 pb-3">No rating yet</div>
        )}

        <Card
          actions={[
            <Tooltip title={tooltip}>
              <a onClick={handleAddToCart}>
                <ShoppingCartOutlined className="text-danger" />
                <br />
                Add to Cart
              </a>
            </Tooltip>,
            <a onClick={handleAddToWishlist}>
              <HeartOutlined className="text-danger" /> <br />
              Add to Wishlist
            </a>,
            <RatingModal>
              <StarRating
                name={_id}
                numberOfStars={5}
                rating={star}
                changeRating={onStarClick}
                isSelectable={true}
                starRatedColor="red"
              />
            </RatingModal>,
          ]}
        >
          <ProductListItems product={product} />
        </Card>
      </div>
    </>
  )
}

export default SingleProduct
