import React from 'react'
import ModalImage from 'react-modal-image'
import laptop from '../../images/laptop.png'

const ProductCardinCheckout = ({ p }) => {
  return (
    <tbody>
      <tr>
        <td>
          <div style={{ width: '100px', height: 'auto' }}>
            {p.images ? (
              <ModalImage small={p.images[0].url} large={p.images[0].url} />
            ) : (
              <ModalImage small={laptop} large={laptop} />
            )}
          </div>
        </td>
        <td>{p.title}</td>
        <td>${p.price}</td>
        <td>{p.brand}</td>
        <td>{p.color}</td>
        <td>{p.count}</td>
        <td>Shipping icon</td>
        <td>Delete icon</td>
      </tr>
    </tbody>
  )
}

export default ProductCardinCheckout
