import React from 'react'
import { Link } from "react-router-dom"
import { ShoppingCart, Search, Check } from "react-feather"
import clsx from "clsx"
import ReactStars from "react-rating-stars-component"

import Card from "./Card"

export default function Product({ link, imgSrc, price, rating = 0, onAddToCart, isInCart }) {
	return (
		<Card className="relative max-w-xs rounded-lg m-2 overflow-hidden group">
			<div className="relative">
				<img src={imgSrc} alt="Product" className="w-full h-48 object-cover" />
				<div className={clsx(
					"absolute inset-0 flex justify-center items-center space-x-4",
					"opacity-0 transition-opacity ease-out",
					"group-hover:opacity-100 group-hover:bg-black/40"
				)}>
					{isInCart ? (
						<Link to="/cart">
							<ProductButton className="bg-green-500 text-white">
								<Check className='min-w-8' />
							</ProductButton>
						</Link>
					) : (
						<ProductButton onClick={onAddToCart}>
							<ShoppingCart className='min-w-8' />
						</ProductButton>
					)}
					<Link to={link}>
						<ProductButton>
							<Search className='min-w-8' />
						</ProductButton>
					</Link>
				</div>
			</div>
			<div className="p-4 text-center">
				<div className="flex items-center justify-center mb-2">
					<ReactStars
						count={5}
						value={rating}
						size={24}
						activeColor="#ffd700"
						isHalf={true}
						edit={false}
					/>
					<span className="ml-2 text-gray-600">{rating.toFixed(1)}</span>
				</div>
				<p className="text-gray-800 font-bold">${price}</p>
				<p className="mt-1 text-gray-600">This is a short description of the product.</p>
			</div>
		</Card>
	)
}

function ProductButton({ children, className, ...props }) {
	return (
		<button className={`p-2 bg-white w-10 h-10 flex justify-center items-center rounded-full transition-all duration-300 ease-out hover:w-20 focus:outline-none ${className}`} {...props}>
			{children}
		</button>
	)
}