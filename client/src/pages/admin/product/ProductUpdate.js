import React, { useState, useEffect } from 'react'
import AdminNav from '../../../components/nav/AdminNav'
import { toast } from 'react-toastify'
import { useSelector } from 'react-redux'
import { createProduct, getProduct } from '../../../functions/product'
import { getCategories, getCategorySubs } from '../../../functions/category'
import FileUpload from '../../../components/forms/FileUpload'
import { LoadingOutlined } from '@ant-design/icons'
import ProductUpdateForm from '../../../components/forms/ProductUpdateForm'

const initialState = {
  title: '',
  description: '',
  price: '',
  categories: [],
  category: '',
  subs: [],
  shipping: '',
  quantity: '',
  images: [],
  colors: ['Black', 'Brown', 'Silver', 'White', 'Blue'],
  brands: ['Apple', 'Samsung', 'Microsoft', 'Lenovo', 'Asus'],
  color: '',
  brand: '',
}

const ProductUpdate = ({ match }) => {
  const [values, setValues] = useState(initialState)

  const [subOptions, setSubOptions] = useState([])
  const [showSub, setShowSub] = useState(false)
  // redux
  const { user } = useSelector((state) => ({ ...state }))
  const { slug } = match.params

  useEffect(() => {
    loadProduct()
  }, [])

  const loadProduct = () => {
    getProduct(slug).then((p) => {
      setValues({ ...values, ...p.data })
    })
    // console.log('single product', values)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    createProduct(values, user.token)
      .then((res) => {
        // console.log(res)
        window.alert(`Product "${res.data.title}" was updated`)
        window.location.reload()
      })
      .catch((err) => {
        console.error(`Update Product failed. `, err)
        // if (err.response.status === 400) toast.error(err.response.data)
        toast.error(err.response.data.err)
      })
  }

  const handleChange = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value })
    // console.log(e.target.name, '------', e.target.value)
  }

  const handleCategoryChange = (e) => {
    e.preventDefault()
    console.log('CLICKED CATEGORY', e.target.value)
    setValues({ ...values, subs: [], category: e.target.value })
    getCategorySubs(e.target.value).then((res) => {
      console.log('SUB OPTIONS ON CATEGORY CLICK', res)
      setSubOptions(res.data)
    })
    setShowSub(true)
  }

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-md-2">
          <AdminNav />
        </div>
        <div className="col-md-10">
          <h4>Product Update</h4>
          <hr />
          {/* {JSON.stringify(values)} */}
          <ProductUpdateForm
            handleSubmit={handleSubmit}
            handleChange={handleChange}
            handleCategoryChange={handleCategoryChange}
            setValues={setValues}
            values={values}
            subOptions={subOptions}
            showSub={showSub}
          />
        </div>
      </div>
    </div>
  )
}

export default ProductUpdate
