import React from 'react'

const CategoryForm = ({ handleSubmit, name, setName }) => (
  <form onSubmit={handleSubmit}>
    <div className="form-group">
      <label htmlFor="category">Name</label>
      <input
        type="text"
        className="form-control"
        name="category"
        id="category"
        onChange={(e) => setName(e.target.value)}
        value={name}
        autoFocus
        required
      />
      <br />
      <button className="btn btn-outline-primary">Save</button>
    </div>
  </form>
)

export default CategoryForm
