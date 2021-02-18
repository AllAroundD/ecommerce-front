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
  const [categories, setCategories] = useState([])
  const [arrayOfSubs, setArrayofSubs] = useState([])
  // redux
  const { user } = useSelector((state) => ({ ...state }))
  const { slug } = match.params

  useEffect(() => {
    loadProduct()
    loadCategories()
  }, [])

  const loadProduct = () => {
    getProduct(slug).then((p) => {
      // load single product
      setValues({ ...values, ...p.data })
      // load single product category subs
      getCategorySubs(p.data.category._id).then((res) => {
        setSubOptions(res.data) // on first load, show default subs
      })
      // prepare array of ids to show as default sub values in antd Select
      let arr = []
      p.data.subs.map((s) => {
        arr.push(s._id)
      })
      console.log('Array of subs', arr)
      setArrayofSubs((prev) => arr) // required for antd Select to work
    })
    // console.log('single product', values)
  }

  const loadCategories = () =>
    getCategories().then((c) => {
      // console.log('GET CATEGORIES IN UPDATE PRODUCT', c.data)
      setCategories(c.data)
    })

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
          {JSON.stringify(values)}
          <ProductUpdateForm
            handleSubmit={handleSubmit}
            handleChange={handleChange}
            handleCategoryChange={handleCategoryChange}
            setValues={setValues}
            values={values}
            subOptions={subOptions}
            categories={categories}
            arrayOfSubs={arrayOfSubs}
            setArrayofSubs={setArrayofSubs}
          />
        </div>
      </div>
    </div>
  )
}

export default ProductUpdate
