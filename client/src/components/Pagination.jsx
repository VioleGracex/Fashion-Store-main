import React from 'react'

const Pagination = ({ productsPerPage, totalProducts, paginate, currentPage }) => {
  const pageNumbers = []

  for (let i = 1; i <= Math.ceil(totalProducts / productsPerPage); i++) {
    pageNumbers.push(i)
  }

  return (
    <nav className="w-full p-4">
      <ul className="flex justify-center space-x-2">
        {pageNumbers.map(number => (
          <li key={number} className={`page-item ${currentPage === number ? 'font-bold' : ''}`}>
            <button
              onClick={() => paginate(number)}
              className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded"
            >
              {number}
            </button>
          </li>
        ))}
      </ul>
    </nav>
  )
}

export default Pagination