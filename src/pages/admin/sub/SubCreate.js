import React, { useState, useEffect } from 'react'
import AdminNav from '../../../components/nav/AdminNav'
import { toast } from 'react-toastify'
import { useSelector } from 'react-redux'
import { getCategories } from '../../../functions/category'
import { createSub, getSubs, removeSub } from '../../../functions/sub'
import { Link } from 'react-router-dom'
import { EditOutlined, DeleteOutlined } from '@ant-design/icons'
import CategoryForm from '../../../components/forms/CategoryForm'
import LocalSearch from '../../../components/forms/LocalSearch'
import { Modal } from 'antd'
import { ExclamationCircleOutlined } from '@ant-design/icons'

const { confirm } = Modal

const SubCreate = () => {
  const { user } = useSelector((state) => ({ ...state }))
  const [name, setName] = useState('')
  const [loading, setLoading] = useState(false)
  const [categories, setCategories] = useState([])
  const [subs, setSubs] = useState([])
  const [category, setCategory] = useState('')
  // searching/filtering
  const [keyword, setKeyword] = useState('')

  useEffect(() => {
    loadCategories()
    loadSubs()
  }, [])

  const loadCategories = () =>
    getCategories().then((c) => setCategories(c.data))

  const loadSubs = () => getSubs().then((s) => setSubs(s.data))

  const handleSubmit = (e) => {
    e.preventDefault()
    // console.log(name)
    setLoading(true)
    createSub({ name, parent: category }, user.token)
      .then((res) => {
        // console.log(res)
        setLoading(false)
        setName('')
        toast.success(`"${res.data.name}" was created`)
        loadSubs()
      })
      .catch((err) => {
        console.error(`Error occurred. `, err)
        setLoading(false)
        if (err.response.status === 400) toast.error(err.response.data)
      })
  }

  const showDeleteConfirm = (slug) => {
    confirm({
      title: 'Are you sure you want to delete this sub category?',
      icon: <ExclamationCircleOutlined />,
      content: 'The sub category will be permanently deleted',
      okText: 'Yes',
      okType: 'danger',
      cancelText: 'No',
      onOk() {
        setLoading(true)
        removeSub(slug, user.token)
          .then((res) => {
            setLoading(false)
            toast.success(`"${res.data.name}" was deleted`)
            loadSubs()
          })
          .catch((err) => {
            if (err.response.status === 400) {
              console.error(`Error occurred during removal. `, err)
              setLoading(false)
              toast.error(err.response.data)
            }
          })
      },
      onCancel() {},
    })
  }

  const handleRemove = async (slug) => {
    showDeleteConfirm(slug)
    // if (window.confirm('Are you sure you want to delete?')) {
    //   setLoading(true)
    //   removeSub(slug, user.token)
    //     .then((res) => {
    //       setLoading(false)
    //       toast.success(`"${res.data.name}" was deleted`)
    //       loadSubs()
    //     })
    //     .catch((err) => {
    //       if (err.response.status === 400) {
    //         console.error(`Error occurred during removal. `, err)
    //         setLoading(false)
    //         toast.error(err.response.data)
    //       }
    //     })
    // }
  }

  const searched = (keyword) => (c) => c.name.toLowerCase().includes(keyword)

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-md-2">
          <AdminNav />
        </div>
        <div className="col">
          {loading ? (
            <h4 className="text-danger">Loading...</h4>
          ) : (
            <h4>Create Sub Category</h4>
          )}

          <div className="form-group">
            <label htmlFor="category">Parent Category</label>
            <select
              name="category"
              id="category"
              className="form-control"
              onChange={(e) => setCategory(e.target.value)}
            >
              <option value="">Please select</option>
              {categories.length > 0 &&
                categories.map((c) => (
                  <option key={c._id} value={c._id}>
                    {c.name}
                  </option>
                ))}
            </select>
          </div>

          <CategoryForm
            handleSubmit={handleSubmit}
            name={name}
            setName={setName}
          />

          <LocalSearch keyword={keyword} setKeyword={setKeyword} />

          {subs.filter(searched(keyword)).map((s) => (
            <div className="alert alert-secondary" key={s._id}>
              {s.name}{' '}
              <span
                onClick={() => handleRemove(s.slug)}
                className="btn btn-sm float-right"
              >
                <DeleteOutlined className="text-danger" />
              </span>{' '}
              <Link to={`/admin/sub/${s.slug}`}>
                <span className="btn btn-sm float-right">
                  <EditOutlined className="text-warning" />
                </span>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default SubCreate
