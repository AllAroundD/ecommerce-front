import React, { useState, useEffect } from 'react'
import UserNav from '../../components/nav/UserNav'
import { getWishlist, removeFromWishlist } from '../../functions/user'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { DeleteOutlined } from '@ant-design/icons'
import { toast } from 'react-toastify'

const Wishlist = () => {
  const [wishlist, setWishlist] = useState([])
  const { user } = useSelector((state) => ({ ...state }))

  useEffect(() => {
    loadWishlist()
    // eslint-disable-next-line
  }, [])

  const loadWishlist = () =>
    getWishlist(user.token).then((res) => {
      // console.log(res.data.wishlist)
      setWishlist(res.data.wishlist)
    })

  const handleRemove = (productId, title) =>
    removeFromWishlist(productId, user.token).then((res) => {
      loadWishlist()
      toast.success(`${title} removed from wishlist.`)
    })

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-md-2">
          <UserNav />
        </div>
        <div className="col">
          <h4>Wishlist</h4>
          {wishlist.map((p) => (
            <div key={p._id} className="alert alert-secondary">
              <Link to={`/product/${p.slug}`}>{p.title}</Link>
              <span
                onClick={() => handleRemove(p._id, p.title)}
                className="btn btn-sm float-right"
              >
                <DeleteOutlined className="text-danger" />
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Wishlist
