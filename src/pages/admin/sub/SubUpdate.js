import React, { useState, useEffect } from 'react'
import AdminNav from '../../../components/nav/AdminNav'
import { toast } from 'react-toastify'
import { useSelector } from 'react-redux'
import { getSub, updateSub } from '../../../functions/sub'
import CategoryForm from '../../../components/forms/CategoryForm'
import { getCategories } from '../../../functions/category'

const SubUpdate = ({ history, match }) => {
  const { user } = useSelector((state) => ({ ...state }))
  const [name, setName] = useState('')
  const [loading, setLoading] = useState(false)
  const [categories, setCategories] = useState('')
  const [parent, setParent] = useState('')

  useEffect(() => {
    loadCategories()
    loadSub()
    // eslint-disable-next-line
  }, [])

  const loadCategories = () =>
    getCategories().then((c) => setCategories(c.data))

  const loadSub = () =>
    getSub(match.params.slug).then((s) => {
      setName(s.data.name)
      setParent(s.data.parent)
    })

  const handleSubmit = (e) => {
    e.preventDefault()
    // console.log(name)
    setLoading(true)
    updateSub(match.params.slug, { name, parent }, user.token)
      .then((res) => {
        // console.log(res)
        setLoading(false)
        setName('')
        toast.success(`"${res.data.name}" was updated`)
        history.push('/admin/sub')
      })
      .catch((err) => {
        console.error(`Error occurred. `, err)
        setLoading(false)
        if (err.response.status === 400) toast.error(err.response.data)
      })
  }

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
            <h4>Update Sub Category</h4>
          )}

          <div className="form-group">
            <label htmlFor="category">Parent Category</label>
            <select
              name="category"
              id="category"
              className="form-control"
              onChange={(e) => setParent(e.target.value)}
            >
              <option value="">Please select</option>
              {categories.length > 0 &&
                categories.map((c) => (
                  <option key={c._id} value={c._id} selected={c._id === parent}>
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
          <hr />
        </div>
      </div>
    </div>
  )
}

export default SubUpdate
