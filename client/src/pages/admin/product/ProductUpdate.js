import React, { useState, useEffect } from 'react'
import AdminNav from '../../../components/nav/AdminNav'
import { toast } from 'react-toastify'
import { useSelector } from 'react-redux'
import { getProduct, updateProduct } from '../../../functions/product'
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

const ProductUpdate = ({ match, history }) => {
  const [values, setValues] = useState(initialState)
  const [subOptions, setSubOptions] = useState([])
  const [categories, setCategories] = useState([])
  const [arrayOfSubs, setArrayofSubs] = useState([])
  const [selectedCategory, setSelectedCategory] = useState('')
  const [loading, setLoading] = useState(false)

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

      if (p.data.category) {
        getCategorySubs(p.data.category._id).then((res) => {
          setSubOptions(res.data) // on first load, show default subs
        })
        // prepare array of ids to show as default sub values in antd Select
        let arr = []
        p.data.subs.map((s) => {
          arr.push(s._id)
        })
        // console.log('Array of subs', arr)
        setArrayofSubs((prev) => arr) // required for antd Select to work
      }
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
    setLoading(true)

    values.subs = arrayOfSubs
    values.category = selectedCategory ? selectedCategory : values.category

    updateProduct(slug, values, user.token)
      .then((res) => {
        setLoading(false)
        // console.log(res)
        toast.success(`Product "${res.data.title}" was updated`)
        history.push('/admin/products')
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
    // console.log('CLICKED CATEGORY', e.target.value)
    setValues({ ...values, subs: [] })

    setSelectedCategory(e.target.value)

    getCategorySubs(e.target.value).then((res) => {
      // console.log('SUB OPTIONS ON CATEGORY CLICK', res)
      setSubOptions(res.data)
    })

    // console.log('EXISTING CATEGORY values.category', values.category)

    // if user clicks back to the original category, show its sub categories in default
    if (values.category._id === e.target.value) {
      loadProduct()
    }

    // clear old sub category ids
    setArrayofSubs([])
  }

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-md-2">
          <AdminNav />
        </div>
        <div className="col-md-10">
          {loading ? (
            <LoadingOutlined className="text-danger h1" />
          ) : (
            <h4>Product Update</h4>
          )}
          <hr />
          {/* {JSON.stringify(values)} */}
          <div className="p-3">
            <FileUpload
              values={values}
              setValues={setValues}
              setLoading={setLoading}
            />
          </div>

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
            selectedCategory={selectedCategory}
          />
        </div>
      </div>
    </div>
  )
}

export default ProductUpdate
