import React, { useContext, useState, useEffect } from 'react'
import Product from "@/components/Product"
import Filter from "@/components/Filter"
import Pagination from "@/components/Pagination"
import { CartContext } from "@/App"

export default function ProductList({ products, onAddToCart }) {
  const { cart } = useContext(CartContext)
  const [filteredProducts, setFilteredProducts] = useState(products)
  const [priceRange, setPriceRange] = useState([0, 100])
  const [currentPage, setCurrentPage] = useState(1)
  const [productsPerPage] = useState(9) // 3 columns * 3 rows

  useEffect(() => {
    // Calculate min and max prices from products
    const prices = products.map(product => product.price)
    const minPrice = Math.min(...prices)
    const maxPrice = Math.max(...prices)
    setPriceRange([minPrice, maxPrice])

    // Apply default filters on initial render
    applyFilters({ category: '', priceRange: [minPrice, maxPrice], isPriceFilterEnabled: false })
  }, [products])

  const applyFilters = (filters) => {
    const { category, priceRange, isPriceFilterEnabled } = filters;
    let filtered = products;

    if (category) {
      filtered = filtered.filter(product => product.category === category);
    }

    if (isPriceFilterEnabled) {
      filtered = filtered.filter(product => product.price >= priceRange[0] && product.price <= priceRange[1]);
    }

    setFilteredProducts(filtered);
  }

  // Get current products
  const indexOfLastProduct = currentPage * productsPerPage
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage
  const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct)

  // Change page
  const paginate = pageNumber => setCurrentPage(pageNumber)

  return (
    <div className="flex">
      <Filter onApplyFilters={applyFilters} priceRange={priceRange} />
      <div className="flex flex-wrap justify-start w-full lg:ml-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
          {currentProducts.map(product => (
            <Product
              key={product._id}
              imgSrc={product.image}
              price={product.price}
              rating={product.rating}
              link={`/products/${product._id}`}
              onAddToCart={() => onAddToCart(product)}
              isInCart={cart.products.some(p => p.id === product._id)}
            />					
          ))}
        </div>
        <Pagination
          productsPerPage={productsPerPage}
          totalProducts={filteredProducts.length}
          paginate={paginate}
          currentPage={currentPage}
        />
      </div>
    </div>
  )
}