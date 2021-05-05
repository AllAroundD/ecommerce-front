import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { toast } from 'react-toastify'
import DatePicker from 'react-datepicker'
import {
  getCoupons,
  removeCoupon,
  createCoupon,
} from '../../../functions/coupon'
import 'react-datepicker/dist/react-datepicker.css'
import { DeleteOutlined } from '@ant-design/icons'
import AdminNav from '../../../components/nav/AdminNav'

const CreateCouponPage = () => {
  const [name, setName] = useState('')
  const [expiry, setExpiry] = useState('')
  const [discount, setDiscount] = useState('')
  const [loading, setLoading] = useState('')
  const [coupons, setCoupons] = useState([])

  const { user } = useSelector((state) => ({ ...state }))

  useEffect(() => {
    loadAllCoupons()
  }, [])

  const loadAllCoupons = () => getCoupons().then((res) => setCoupons(res.data))

  const handleSubmit = (e) => {
    e.preventDefault()
    // console.table(name, expiry, discount)
    createCoupon({ name, expiry, discount }, user.token)
      .then((res) => {
        setLoading(true)
        loadAllCoupons()
        setLoading(false)
        setName('')
        setDiscount('')
        setExpiry('')
        toast.success(`"${res.data.name}" is created`)
      })
      .catch((err) => console.log('create coupon error', err))
  }

  const handleRemove = (couponId) => {
    if (window.confirm('Delete?')) {
      setLoading(true)
      removeCoupon(couponId, user.token)
        .then((res) => {
          loadAllCoupons()
          setLoading(false)
          toast.error(`"${res.data.name}" deleted`)
        })
        .catch((err) => console.error('handleRemove error: ', err))
    }
  }

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-md-2">
          <AdminNav />
        </div>
        <div className="col-md-10">
          {loading ? (
            <h4 className="text-danger">Loading...</h4>
          ) : (
            <h4>Coupon</h4>
          )}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="text-muted">Name</label>
              <input
                type="text"
                className="form-control"
                onChange={(e) => setName(e.target.value)}
                value={name}
                autoFocus
                required
                maxLength="12"
                minLength="6"
              />
            </div>
            <div className="form-group">
              <label className="text-muted">Discount %</label>
              <input
                type="text"
                className="form-control"
                onChange={(e) => setDiscount(e.target.value)}
                value={discount}
                required
              />
            </div>
            <div className="form-group">
              <label className="text-muted">Expiry</label>
              <br />
              <DatePicker
                className="form-control"
                selected={new Date()}
                value={expiry}
                required
                onChange={(date) => setExpiry(date)}
              />
            </div>
            <button className="btn btn-outline-primary">Save</button>
          </form>

          <br />

          <h4>{coupons.length} Coupons</h4>

          <table className="table table-bordered">
            <thead className="thead-light">
              <tr>
                <th scope="col">Name</th>
                <th scope="col">Expiry</th>
                <th scope="col">Discount</th>
                <th scope="col">Action</th>
              </tr>
            </thead>
            <tbody>
              {coupons.map((c) => (
                <tr key={c._id}>
                  <td>{c.name}</td>
                  <td>{new Date(c.expiry).toLocaleDateString()}</td>
                  <td>{c.discount}%</td>
                  <td>
                    <DeleteOutlined
                      onClick={() => handleRemove(c._id)}
                      className="text-danger pointer"
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default CreateCouponPage
